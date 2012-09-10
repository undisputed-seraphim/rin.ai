/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
resources.grass = {
    root: 'vegetation',
    textures: {
        mix: 'grass_mix.png',
    },
    shaders: {
        albedo      : 'albedo.shader',
        normdepth   : 'normdepth.shader',
        combine     : 'combine.shader',
    },
    init: function(glee, gl, params){
        this.gl = gl;
        var self = this;
        this.make_grass(glee, gl);

        this.combine = new glee.Processor({
            fbo: params.fbo,
            result: FloatTexture(glee, gl, 1024, 1024),
            shader: this.shaders.combine,
            samplers: {
                heightmap: params.terrain.heightmap.result,
                mixmap: this.textures.mix,
                wind: params.resources.wind.position,
            }
        });

        this.albedo = new glee.Processor({
            fbo: params.fbo,
            depthstencil: params.depthstencil,
            result: params.albedo, 
            shader: this.shaders.albedo,
            uniforms: {
                camera: params.view.position,
                proj: params.proj.matrix,
                view: params.view.matrix,
                view_rot: params.view.rot,
            },
            samplers: {
                //datamap: this.combine.result,
            },
            draw: function(){
                self.vbo.draw();
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
            shader: this.shaders.normdepth,
            clear: false,
            result: params.normaldepth,
            uniforms: {
                camera: params.view.position,
                proj: params.proj.matrix,
                view: params.view.matrix,
            },
            samplers: {
                //datamap: this.combine.result,
            },
            draw: function(){
                self.vbo.draw();
            },
            depth: {
                buffer: params.depthbuffer,
                test: 'Less',
                write: true
            },
        });
        return this;
    },
    render: function(){
        this.combine.render();

        this.gl.disable(this.gl.CULL_FACE);
        this.combine.result.bind(0);
        this.albedo.shader.push();
        this.vbo.bind();
        for(var i=0; i<5; i++){
            var field_size = 0.15 + (i/5)*0.50;
            this.albedo.uniforms.field_size = field_size;
            this.albedo.render();
        }
        this.albedo.shader.pop(true);
        this.normaldepth.shader.push();
        this.vbo.bind();
        for(var i=0; i<5; i++){
            var field_size = 0.15 + (i/5)*0.50;
            this.normaldepth.uniforms.field_size = field_size;
            this.normaldepth.render();
        }
        this.normaldepth.shader.pop(true);
        this.gl.enable(this.gl.CULL_FACE);
    },
    make_grass: function(glee, gl){
        var rnd = Math.random;
        var pow = Math.pow;
        var pi = Math.PI;
        var sin = Math.sin;
        var cos = Math.cos;
        var height = 0.0015;
        var base = 0.00009;
        var bend = 0.00004;
     
        var segment_count=5;
        var stem = [];
        var stem_normals = [];
        for(var s=0; s<segment_count; s++){
            stem.push(new glee.Vec3(0, s*height, Math.pow(s, 2)*bend));
        }

        
        var segment_normals = [];
        for(var s=0; s<segment_count; s++){
            segment_normals.push([]);
        }
        for(var s=0; s<segment_count-1; s++){
            var normal = new glee.Vec3().update(stem[s+1]).sub(stem[s]);
            normal.set(normal.x, normal.z, normal.y).normalize();
            segment_normals[s].push(normal);
            segment_normals[s+1].push(normal);
        }
        for(var s=0; s<segment_count; s++){
            var normal = new glee.Vec3();
            for(var i=0; i<segment_normals[s].length; i++){
                normal.add(segment_normals[s][i]);
            }
            normal.mul(1/segment_normals[s].length).normalize();
            stem_normals.push(normal);
        };
        
        var template_vertices = [];
        var template_normals = [];

        for(var s=0; s<segment_count-1; s++){
            var b = stem[s];
            var t = stem[s+1];
            var bn = stem_normals[s];
            var tn = stem_normals[s+1];
            var bln = new glee.Vec3(+0.2, 0, 0).add(bn).normalize();
            var brn = new glee.Vec3(-0.2, 0, 0).add(bn).normalize();
            var tln = new glee.Vec3(+0.2, 0, 0).add(tn).normalize();
            var trn = new glee.Vec3(-0.2, 0, 0).add(tn).normalize();
            var bw = (segment_count-s-0.5)*base;
            var tw = (segment_count-s-1-0.5)*base;
            
            template_vertices.push(
                b.x-bw, b.y, b.z,
                b.x+bw, b.y, b.z,
                t.x-tw, t.y, t.z,
                
                b.x+bw, b.y, b.z,
                t.x+tw, t.y, t.z,
                t.x-tw, t.y, t.z
            );

            template_normals.push(
                bln.x, bln.y, bln.z,
                brn.x, brn.y, brn.z,
                tln.x, tln.y, tln.z,
                
                brn.x, brn.y, brn.z,
                trn.x, trn.y, trn.z,
                tln.x, tln.y, tln.z
            );
        }

        var templates = [];

        var vec = new glee.Vec3();
        for(var i=0; i<200; i++){
            var position = new glee.Vec3();
            var size = 1.2 + (rnd()-0.5)*(rnd()-0.5)*rnd()*6;
            var angle = rnd()*360;
            var rotation = new glee.Mat3().rotatey(angle);
            var template = {vertices: [], normals:[], rotation:rotation, angle:angle};
            for(var j=0; j<template_vertices.length; j+=3){
                vec.set(
                    template_vertices[j]*size,
                    template_vertices[j+1]*size,
                    template_vertices[j+2]*size
                ).mul(rotation);
                template.vertices.push(vec.x, vec.y, vec.z);
                vec.set(
                    template_normals[j],
                    template_normals[j+1],
                    template_normals[j+2]
                ).mul(rotation);
                template.normals.push(vec.x, vec.y, vec.z);
                template.size = size;
            }
            templates.push(template);
        }
        
        vertices = [];
        normals = [];
        centers = [];
        colors = [];

        for(var i=0; i<15000; i++){
            var x=rnd(), y=rnd(), z=rnd();
            var template = templates[i%templates.length];
            vertices.push.apply(vertices, template.vertices);
            normals.push.apply(normals, template.normals);
            var r = 0.22+(rnd()-0.5)*0.1;
            var g = 0.31+(rnd()-0.5)*0.25;
            var b = 0.04+(rnd()-0.5)*0.1;
            for(var j=0; j<template.vertices.length; j+= 3){
                centers.push(x, y, z, template.size);
                colors.push(r, g, b);
            }
        }
        
        this.vbo = new glee.VBO({
            position_3f: vertices,
            normal_3f: normals,
            centersize_4f: centers,
            color_3f: colors,
        });
    }
};
