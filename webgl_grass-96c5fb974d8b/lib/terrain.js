/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var Terrain = function(glee, gl, params){
    var model = this.model = params.resources.terrain;
    this.heightmap = new glee.Processor({
        fbo: params.fbo,
        shader: model.shaders.heightmap,
        result: FloatTexture(glee, gl, 1024, 1024),
        draw: function(){
            gl.disable(gl.CULL_FACE);
            model.mesh.draw();
            gl.enable(gl.CULL_FACE);
        }
    });
            
    this.albedo = new glee.Processor({
        fbo: params.fbo,
        depthstencil: params.depthstencil,
        shader: model.shaders.albedo,
        blend: false,
        clear: {
            color: [0, 0, 0, 1],
            depth: 1,
            stencil: 1
        },
        result: params.albedo, 
        uniforms: {
            proj: params.proj.matrix,
            view: params.view.matrix,
            view_rot: params.view.rot,
        },
        samplers: {
            material: model.texture,
            mixmap: model.mix,
            detail1: model.detail1.texture.repeat().mipmap(),
            detail2: model.detail2.texture.repeat().mipmap()
        },
        draw: function(){
            model.mesh.draw();
        },
        depth: {
            test: 'Less',
            write: true
        },
        stencil: {
            test: true,
            mask: 255,
            func: {
                test: gl.ALWAYS,
                ref: 255,
                mask: 255
            },
            op: {
                fail: gl.REPLACE,
                depth_fail: gl.REPLACE,
                pass: gl.REPLACE
            }
        }
    });

    this.normaldepth = new glee.Processor({
        fbo: params.fbo,
        shader: model.shaders.normdepth,
        blend: false,
        clear: {
            color: [0, 1, 0, 2],
            depth: 1
        },
        result: params.normaldepth,
        uniforms: {
            proj: params.proj.matrix,
            view: params.view.matrix,
        },
        samplers: {
            normals: model.normals,
            mixmap: model.mix,
            detail1: model.detail1.normals.repeat().mipmap(),
            detail2: model.detail2.normals.repeat().mipmap()
        },
        draw: function(){
            model.mesh.draw();
        },
        depth: {
            buffer: params.depthbuffer,
            test: 'Less',
            write: true
        },
    });

    this.render = function(){
        this.heightmap.render();
        this.albedo.render();
        this.normaldepth.render();
    }
}
