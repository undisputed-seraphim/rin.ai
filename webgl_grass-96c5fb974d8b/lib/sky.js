/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var Sky = function(glee, gl, params){
    var matrix = new glee.Mat4().translate(-0.6, -0.18, -0.5);
    
    var width = 128;
    var height = 128;
    this.elevation = 0.0;
    this.orientation = 0.0;
    var picks = golden_spiral(512);

    var lightdir = new glee.Vec3(1.0, 0.1, 0.1).normalize();
    var lightMat = new glee.Mat3();

    this.scattering = new glee.CubeProcessor({
        width: width,
        height: height,
        fbo: params.fbo,
        clear: true,
        shader: params.resources.scattering,
        uniforms: {
            lightdir: lightdir
        }
    });
    
    var blur0 = new glee.CubeProcessor({
        width: 64,
        height: 64,
        fbo: params.fbo,
        clear: true,
        shader: params.resources.diffuse_scale,
        samplers: {
            source: this.scattering.result
        },
        uniforms: {
            scale: 1.0
        }
    });
    
    var blur1 = new glee.CubeProcessor({
        width: 64,
        height: 64,
        fbo: params.fbo,
        clear: true,
        shader: params.resources.diffuse_scale,
        samplers: {
            source: blur0.result
        },
        uniforms: {
            scale: 1.0
        }
    });

    var diffuse = new glee.CubeProcessor({
        width: 64,
        height: 64,
        fbo: params.fbo,
        clear: true,
        shader: params.resources.cubemap_convolve,
        samplers: {
            source: blur0.result
        },
        uniform3f: {
            rays: picks
        }
    });
    
    this.diffuse = blur0;
    
    this.env = new glee.CubeProcessor({
        width: 128,
        height: 128,
        fbo: params.fbo,
        clear: true,
        shader: params.resources.cubesampler,
        samplers: {
            source: this.scattering.result
        }
    });
    
    var model = params.resources.terrain;
    var depthbuffer = new glee.DepthBuffer({
        width: 128,
        height: 128 
    });

    this.terrain = new glee.CubeProcessor({
        result: this.env.result,
        width: 128,
        height: 128,
        fbo: params.fbo,
        near: 0.001,
        far: 2,
        shader: params.resources.albedo_cube,
        clear: {
            depth: 1,
        },
        uniforms: {
            model: matrix 
        },
        samplers: {
            material: model.texture,
            normals: model.normals,
            diffuse: this.diffuse.result
        },
        draw: function(){
            model.mesh.draw();
        },
        depth: {
            buffer: depthbuffer,
            test: 'Less',
            write: true
        }
    });

    
    this.render = function(){
        lightdir.set(0, 1, 0);
        lightMat.ident().rotatex(this.elevation).rotatey(this.orientation);
        lightdir.mul(lightMat);

        this.scattering.render();
        blur0.samplers.source = this.scattering.result;
        blur0.render();
        blur0.samplers.source = blur1.result;
        for(var i=0; i<2; i++){
            blur1.render();
            blur0.render();
        }

        diffuse.render();

        blur0.samplers.source = diffuse.result;
        blur0.render();
        blur0.samplers.source = blur1.result;
        for(var i=0; i<2; i++){
            blur1.render();
            blur0.render();
        }
        this.env.render();
        this.terrain.render();
        
        blur0.samplers.source = this.terrain.result;
        blur0.render();
        blur0.samplers.source = blur1.result;
        for(var i=0; i<5; i++){
            blur1.render();
            blur0.render();
        }

        diffuse.render();

        blur0.samplers.source = diffuse.result;
        blur0.render();
        blur0.samplers.source = blur1.result;
        for(var i=0; i<10; i++){
            blur1.render();
            blur0.render();
        }
    }
};
