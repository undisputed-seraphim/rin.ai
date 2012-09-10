/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
$(function(){
    var user = $.cookie('user');
    if(!user){
        var user = '';
        var chars = 'abcdef0123456789'
        for(var i=0; i<32; i++){
            var index = Math.floor(Math.random()*chars.length);
            user += chars.charAt(index);
        }
        $.cookie('user', user, {expires: 365*10});
    }

    var canvas = $('canvas')[0];
    var fpselem = $('#fps');
    var ssao_check = $('#ssao')[0];
    var aa_check = $('#aa')[0];

    var glee = new Glee(canvas, {
        errorHandler: function(info){
            fpselem.remove();
            $(canvas).remove();
            console.log(info);
            info.user = user;
            $.ajax({
                contentType: 'text/plain',
                data: JSON.stringify(info),
                type: 'POST',
                url: '/webgl_report/',
            });

            if(info.type == 'support'){
                $('div.support').show();
            }
            else if(info.type == 'ext'){
                $('.ext').show();
            }
            else{
                $('div.unknown').show();
                $.each(info, function(name, text){
                    $('<div class="error"></div>').text(name + ': ' + text).appendTo('body').show();
                });
            }
        }
    }).checkExt('texture_float');

    if(!glee.get('MAX_VERTEX_TEXTURE_IMAGE_UNITS')){
        fpselem.remove();
        $(canvas).remove();
        $('div.driver').show();
        var info = {
            type: 'insufficient',
            error: 'no texture lookup in vertex shader',
            user: user,
            vendor: glee.get('VENDOR'),
            version: glee.get('VERSION'),
        };
        $.ajax({
            contentType: 'text/plain',
            data: JSON.stringify(info),
            type: 'POST',
            url: '/webgl_report/',
        });
        return;
    }

    var gl = glee.gl;
    var fps_updates = 0;
            
    var fps = new glee.FPS({
        interval: 250,
        average_over: 2,
        update: function(fps){
            if(fps > 0){
                fps_updates += 1;
                if(fps_updates == 10){
                    var info = {
                        fps: fps,
                        user: user,
                        vendor: glee.get('VENDOR'),
                        version: glee.get('VERSION'),
                    };
                    $.ajax({
                        contentType: 'text/plain',
                        data: JSON.stringify(info),
                        type: 'POST',
                        url: '/webgl_report/',
                    });
                }
            }
            fpselem.text(fps.toFixed(1) + ' FPS');
        },
    });

    glee.load({
        resources: resources,
        onload:function(){
            var width = 1200;
            var height = 600;

            glee.resize(width, height);

            var fbo = new glee.FBO();
            var keys = new Keys();
            var view = new Viewpoint(glee, keys, canvas);
            var proj = new Perspective(glee, {
                width: width,
                height: height,
                fov: 75,
                near: 0.001,
                far: 2
            });
            
            this.resources.wind.init(glee, gl, {
                fbo: fbo,
            });

            var sky = new Sky(glee, gl, {
                fbo: fbo,
                resources: this.resources,
            });

            var scene = new Scene(glee, gl, {
                fbo: fbo,
                width: width,
                height: height,
                resources: this.resources,
                view: view,
                proj: proj
            });

            var lighting = new Lighting(glee, gl, {
                fbo: fbo,
                width: width,
                height: height,
                proj: proj,
                view: view,
                resources: this.resources,
                sky: sky,
                scene: scene
            });
            
            var compositor = new Compositor(glee, gl, {
                fbo: fbo,
                width: width,
                height: height,
                resources: this.resources,
                scene: scene,
                sky: sky,
                lighting: lighting,
                view: view,
                proj: proj,
            });
            
            sky.render();
            var shift = 0.0;
            glee.schedule(60, function(delta){
                fps.tick();
                view.step(delta);
                shift += delta;
                
                if(keys.up){
                    sky.elevation += 0.01*delta;
                    sky.render();
                }
                else if(keys.down){
                    sky.elevation -= 0.01*delta;
                    sky.render();
                }
                else if(keys.left){
                    sky.orientation -= 0.01*delta;
                    sky.render();
                }
                else if(keys.right){
                    sky.orientation += 0.01*delta;
                    sky.render();
                }

                fbo.bind();
                    this.resources.wind.render(delta, shift);
                    scene.render();
                    lighting.render();
                    compositor.render();
                fbo.unbind();
                compositor.blit();
            });
        }
    });
});
