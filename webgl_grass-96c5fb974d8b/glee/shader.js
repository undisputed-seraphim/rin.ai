/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
Glee.extensions.push(function(glee){
    var Shader = glee.Shader = function(source, path){
        lines = source.split('\n');
        var directives = [];
        var shaders = {};
        var current;
        var gl = glee.gl;

        Glee.each(lines, function(i, line){
            if(line.charAt(0) == '#'){
                directives.push({line: i, text: line});
            }
            else{
                var type = line.match(/^(\w+):/);
                if(type){
                    type = type[1];
                    current = shaders[type];
                    if(!current){
                        current = shaders[type] = [];
                    }
                }
                else{
                    if(current){
                        current.push({line: i, text: line});
                    }
                }

            }
        });

        directives.push(
            '#version 100',
            'precision highp float;',
            'precision highp vec2;',
            'precision highp vec3;',
            'precision highp vec4;'
        );

        directives = directives.join('\n');
        var shader_types = {
            fragment: gl.FRAGMENT_SHADER,
            vertex: gl.VERTEX_SHADER
        };
        var program = gl.createProgram();
        Glee.each(shaders, function(type, lines){
            var shader_source = directives+'\n';
            $.each(lines, function(i, line){
                shader_source += '#line ' + line.line + '\n' + line.text + '\n';
            });
            var shader_type = shader_types[type];
            var shader = gl.createShader(shader_type);
            gl.shaderSource(shader, shader_source);
            gl.compileShader(shader);

            if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
                gl.attachShader(program, shader);
            }
            else{
                glee.handleError({
                    type: 'shader compile',
                    error: gl.getShaderInfoLog(shader),
                    path: path,
                    vendor: glee.get('VENDOR'),
                    version: glee.get('VERSION'),
                    maxVSTextureUnits: glee.get('MAX_VERTEX_TEXTURE_IMAGE_UNITS')
                });
            }
        });
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            glee.handleError({
                type: 'program link',
                error: gl.getProgramInfoLog(program),
                path: path,
                vendor: glee.get('VENDOR'),
                version: glee.get('VERSION'),
                maxVSTextureUnits: glee.get('MAX_VERTEX_TEXTURE_IMAGE_UNITS')
            });
        }
        
        this.attrib_count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        this.uniform_count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        this.uniform_cache = {};
        this.attrib_cache = {};

        this.bind = function(){
            Shader.current = this;
            gl.useProgram(program);
        };
        this.unbind = function(){
            Shader.current = null;
            gl.useProgram(null);
        }

        this.getAttribLocation = function(name){
            var attrib_location = this.attrib_cache[name];
            if(attrib_location === undefined){
                var attrib_location = this.attrib_cache[name] = gl.getAttribLocation(program, name);
            }
            return attrib_location;
        }

        this.getUniformLocation = function(name){
            var uniform_location = this.uniform_cache[name];
            if(uniform_location === undefined){
                var uniform_location = this.uniform_cache[name] = gl.getUniformLocation(program, name);
            }
            return uniform_location;
        }

        this.sampler = function(name, unit){
            var uniform_location = this.getUniformLocation(name);
            if(uniform_location){
                var pushed = this.push();
                gl.uniform1i(uniform_location, unit);
                this.pop(pushed);
            }
            return this;
        }

        this.uniform = function(name, value){
            var uniform_location = this.getUniformLocation(name);
            if(uniform_location){
                if(value === undefined){
                    return gl.getUniform(program, uniform_location);
                }
                else{
                    var pushed = this.push();
                    if(value.type == 'Mat4'){
                        gl.uniformMatrix4fv(uniform_location, false, value.data);
                    }
                    else if(value.type == 'Mat3'){
                        gl.uniformMatrix3fv(uniform_location, false, value.data);
                    }
                    else if(value.type == 'Vec3'){
                        gl.uniform3f(uniform_location, value.x, value.y, value.z);
                    }
                    else if(typeof(value) == 'number'){
                        gl.uniform1f(uniform_location, value);
                    }
                    else if(typeof(value) == 'object'){
                        gl['uniform' + value.length + 'fv'](uniform_location, value);
                    }
                    this.pop(pushed);
                }
            }
            return this;
        }

        this.uniform2f = function(name, x, y){
            var uniform_location = this.getUniformLocation(name);
            if(uniform_location){
                var pushed = this.push();
                gl.uniform2f(uniform_location, x, y);
                this.pop(pushed);
            }
            return this;
        }
        
        this.uniform3fv = function(name, value){
            var uniform_location = this.getUniformLocation(name);
            if(uniform_location){
                var pushed = this.push();
                gl.uniform3fv(uniform_location, value);
                this.pop(pushed);
            }
            return this;
        }

        this.push = function(){
            if(Shader.current == this){
                return false;
            }
            else{
                Shader.stack.push(this);
                this.bind();
                return true;
            }
        };
        this.pop = function(pushed){
            if(pushed){
                var previous = Shader.stack.pop();
                if(previous){
                    Shader.current = previous;
                    previous.bind();
                }
                else{
                    this.unbind();
                }
            }
        };

        this.binding = function(body){
            var pushed = this.push();
            body();
            this.pop(pushed);
        };

    };
    Shader.current = null;
    Shader.stack = [];
});
