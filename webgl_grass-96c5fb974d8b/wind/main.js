resources.wind = {
    root: 'wind',
    shaders: {
        noise: 'noise.shader',
        velocity: 'velocity.shader',
        position: 'position.shader',
        copy: 'copy.shader',
    },
    textures: {
        noise1: 'solidnoise1.jpg',
        noise2: 'solidnoise2.jpg',
        noise3: 'solidnoise3.jpg',
    },
    init: function(glee, gl, params){
        var width=512, height=512;
        this.velocity = FloatTexture(glee, gl, width, height);
        this.position = FloatTexture(glee, gl, width, height);

        this.noise = new glee.Processor({
            fbo: params.fbo,
            result: FloatTexture(glee, gl, width, height),
            shader: this.shaders.noise,
            uniforms: {},
            samplers: {
                src1: this.textures.noise1.repeat(),
                src2: this.textures.noise2.repeat(),
                src3: this.textures.noise3.repeat(),
            }
        });

        this.velocity_proc = new glee.Processor({
            fbo: params.fbo,
            result: FloatTexture(glee, gl, width, height),
            shader: this.shaders.velocity,
            samplers: {
                velocity: this.velocity,
                position: this.position,
                accel: this.noise.result,
            },
            uniforms: {}
        });

        this.copy = new glee.Processor({
            fbo: params.fbo,
            result: this.velocity,
            shader: this.shaders.copy,
            samplers: {
                velocity: this.velocity_proc.result,
            }
        });
        
        this.position_proc = new glee.Processor({
            fbo: params.fbo,
            blend: 'Additive',
            result: this.position,
            shader: this.shaders.position,
            samplers: {
                velocity: this.velocity,
            },
            uniforms: {}
        });
    },
    render: function(delta, shift){
        this.noise.uniforms.time = shift*0.00001;
        this.noise.render();
        this.velocity_proc.uniforms.delta = delta;
        this.velocity_proc.render();
        this.copy.render();
        this.position_proc.uniforms.delta = delta;
        this.position_proc.render();
    },
}

