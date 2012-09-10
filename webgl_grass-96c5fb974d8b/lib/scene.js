/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var Scene = function(glee, gl, params){
    var depthstencil = this.depthstencil = new glee.DepthStencilBuffer({
        width: params.width,
        height: params.height
    });
    var depthbuffer = new glee.DepthBuffer({width: params.width, height: params.height});
    
    this.albedo = FloatTexture(glee, gl, params.width, params.height);
    this.normaldepth = FloatTexture(glee, gl, params.width, params.height);

    this.terrain = new Terrain(glee, gl, {
        resources: params.resources,
        fbo: params.fbo,
        view: params.view,
        proj: params.proj,
        depthstencil: depthstencil,
        depthbuffer: depthbuffer,
        albedo: this.albedo,
        normaldepth: this.normaldepth,
    });
    
    this.vegetation = params.resources.grass.init(glee, gl, {
        resources: params.resources,
        fbo: params.fbo,
        view: params.view,
        proj: params.proj,
        depthstencil: depthstencil,
        depthbuffer: depthbuffer,
        albedo: this.albedo,
        normaldepth: this.normaldepth,
        terrain: this.terrain,
    });

    this.eyepos = new glee.Processor({
        fbo: params.fbo,
        shader: params.resources.eyepos,
        result: FloatTexture(glee, gl, params.width, params.height),
        clear: true,
        samplers: {
            normaldepthmap: this.normaldepth
        },
        uniforms: {
            inv_proj: params.proj.inverse
        }
    });
    
    this.worldpos = new glee.Processor({
        fbo: params.fbo,
        shader: params.resources.worldpos,
        result: FloatTexture(glee, gl, params.width, params.height),
        clear: true,
        samplers: {
            normaldepthmap: this.eyepos.result
        },
        uniforms: {
            inv_view: params.view.inv
        }
    });

    this.render = function(){
        this.terrain.render();
        this.vegetation.render();
        this.eyepos.render();
        this.worldpos.render();
    }
}
