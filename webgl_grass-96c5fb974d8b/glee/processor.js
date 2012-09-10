/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
Glee.extensions.push(function(glee){ 
    var gl = glee.gl;

    var FillScreen = glee.FillScreen = function(){
        var vbo = new glee.VBO({
            position_3f: [
                 1,  1,  0,   -1,  1,  0,  -1, -1,  0,
                 1,  1,  0,   -1, -1,  0,   1, -1,  0,
            ],
            texcoord_2f: [
                1, 1,  0, 1,  0, 0,
                1, 1,  0, 0,  1, 0,
            ]
        });

        this.draw = function(){
            vbo.draw(gl.TRIANGLES, 6);
        }
    }

    var fill_screen = glee.fill_screen = new FillScreen();

    var Processor = glee.Processor = function(params){
        Glee.extend(this, params);
    }
    Processor.prototype = {
        render: function(){
            var self = this;

            var unit = 0;
            if(this.samplers){
                for(name in this.samplers){
                    this.shader.sampler(name, unit);
                    this.samplers[name].bind(unit);
                    unit += 1;
                };
            }
            if(this.uniforms){
                for(name in this.uniforms){
                    this.shader.uniform(name, this.uniforms[name]);
                }
            }

            if(this.uniform3f){
                for(name in this.uniform3f){
                    this.shader.uniform3fv(name, this.uniform3f[name]);
                }
            }

            if(this.result){
                this.fbo.color(this.result);
                gl.viewport(0, 0, this.result.width, this.result.height);
                this.shader.uniform2f('viewport', this.result.width, this.result.height);
            }
            else{
                gl.viewport(0, 0, glee.width, glee.height);
                this.shader.uniform2f('viewport', glee.width, glee.height);
            }

            if(this.blend){
                glee['blend' + this.blend]();
            }
            else{
                glee.noBlend();
            }

            if(this.depth){
                if(this.fbo){
                    if(this.depth.buffer){
                        this.fbo.depth(this.depth.buffer);
                    }
                    else{
                        this.fbo.depth(null);
                    }
                }

                if(this.depth.test){
                    glee['depth'+this.depth.test]();
                }
                else{
                    glee.noDepth();
                }

                if(this.depth.write){
                    gl.depthMask(true);
                }
                else{
                    gl.depthMask(false);
                }
            }
            else{
                if(this.fbo){
                    this.fbo.depth(null);
                }
                glee.noDepth();
                gl.depthMask(false);
            }
   
            var stencil = this.stencil;
            if(stencil){
                if(stencil.test){
                    glee.enableStencil();
                }
                else{
                    glee.disableStencil();
                }
                if(this.fbo){
                    if(stencil.buffer){
                        this.fbo.stencil(stencil.buffer);
                        this.fbo.check();
                    }
                    else{
                        this.fbo.stencil(null);
                    }
                }
                glee.stencilMask(stencil.mask);
                if(stencil.func){
                    glee.stencilFunc(stencil.func.test, stencil.func.ref, stencil.func.mask);
                }
                else{
                    glee.stencilFunc();
                }
                if(stencil.op){
                    glee.stencilOp(stencil.op.fail, stencil.op.depth_fail, stencil.op.pass);
                }
                else{
                    glee.stencilOp();
                }
            }
            else{
                if(this.fbo){
                    this.fbo.stencil(null);
                }
                glee.disableStencil();
            }

            if(this.fbo){
                this.fbo.depthstencil(this.depthstencil);
            }
            
            if(this.clear){
                glee.clear(this.clear);
            }

            if(this.draw){
                this.shader.binding(function(){
                    self.draw(self);
                });
            }
            else{
                this.shader.binding(function(){
                    fill_screen.draw();
                });
            }
        }
    };
});
