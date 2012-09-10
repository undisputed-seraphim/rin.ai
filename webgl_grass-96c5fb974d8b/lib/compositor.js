/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var Compositor = function(glee, gl, params){
    var color = FloatTexture(glee, gl, params.width, params.height);

    var screen_sky = new glee.Processor({
        fbo: params.fbo,
        shader: params.resources.cubesampler,
        result: color,
        clear: {
            color: [0,0,0,0]
        },
        uniforms: {
            inv_proj: params.proj.inverse,
            inv_view_rot: params.view.inv_rot
        },
        samplers: {
            source: params.sky.scattering.result
        }
    });

    var lit_scene = new glee.Processor({
        fbo: params.fbo,
        result: color,
        shader: params.resources.multiply,
        samplers: {
            op1: params.scene.albedo,
            op2: params.lighting.result.result
        },
        stencil: {
            test: true,
            mask: 0,
            func: {
                test: gl.EQUAL,
                ref: 255,
                mask: 255 
            },
            op: {
                fail: gl.KEEP,
                depth_fail: gl.KEEP,
                pass: gl.KEEP
            }
        },
        depthstencil: params.scene.depthstencil,
    });
            
    var gamma = new glee.Processor({
        fbo: params.fbo,
        clear: true,
        result: FloatTexture(glee, gl, params.width, params.height),
        shader: params.resources.gamma,
        uniforms: {
            factor: 2.2
        },
        samplers: {
            source: color,
        }
    });

    var antialias = new Antialias(glee, gl, {
        fbo: params.fbo,
        width: params.width,
        height: params.height,
        scene: params.scene,
        source: gamma.result,
        resources: params.resources,
    });
  
    var pass = new glee.Processor({
        shader: params.resources.pass,
        clear: true,
        samplers: {
            source: antialias.result,
        },
    });

    this.render = function(){
        screen_sky.render();
        lit_scene.render();
        gamma.render();
        antialias.render();
    }

    this.blit = function(){
        pass.render();
    }
}
