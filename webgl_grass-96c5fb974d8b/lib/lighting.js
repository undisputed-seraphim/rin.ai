/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var Lighting = function(glee, gl, params){
    this.environment = new glee.Processor({
        fbo: params.fbo,
        result: FloatTexture(glee, gl, params.width, params.height),
        shader: params.resources.cubelight,
        samplers: {
            normaldepthmap: params.scene.normaldepth,
            diffuse: params.sky.diffuse.result,
            albedo: params.scene.albedo,
        },
    });

    this.random = randomTexture(glee, gl, 1024, 512);

    this.ssao = new glee.Processor({
        fbo: params.fbo,
        result: FloatTexture(glee, gl, params.width, params.height),
        shader: params.resources.ssao,
        blend: false,
        clear: true,
        samplers: {
            random: this.random,
            worldposmap: params.scene.worldpos.result,
            normaldepthmap: params.scene.normaldepth
        },
        uniforms: {
            proj: params.proj.matrix,
            view: params.view.matrix,
            ray_scale: 0.01,
            accentuation: 4.0,
            falloff: 100.0,
            falloff_accentuation: 2.0
        },
        uniform3f: {
            rays: sphere_picks
        }
    });
  
    this.blur_vertical = new glee.Processor({
        fbo: params.fbo,
        result: FloatTexture(glee, gl, params.width, params.height),
        clear: true,
        shader: params.resources.feature_blur,
        uniforms: {
            axis: [0, 1]
        },
        samplers: {
            normaldepthmap: params.scene.normaldepth,
            source: this.ssao.result
        }
    });
    
    this.blur_horizontal = new glee.Processor({
        fbo: params.fbo,
        result: FloatTexture(glee, gl, params.width, params.height),
        clear: true,
        shader: params.resources.feature_blur,
        uniforms: {
            axis: [1, 0]
        },
        samplers: {
            normaldepthmap: params.scene.normaldepth,
            source: this.blur_vertical.result
        }
    });

    this.result = new glee.Processor({
        fbo: params.fbo,
        result: FloatTexture(glee, gl, params.width, params.height),
        clear: true,
        shader: params.resources.multiply,
        samplers: {
            op1: this.blur_horizontal.result,
            op2: this.environment.result
        }
    });
    //this.result = this.environment;
   
    this.render = function(){
        this.environment.render();
        this.ssao.render();

        this.blur_vertical.samplers.source = this.ssao.result;
        for(var i=0; i<4; i++){
            this.blur_vertical.render();
            this.blur_vertical.samplers.source = this.blur_horizontal.result;
            this.blur_horizontal.render();
        }
        this.result.render();
    }
}
