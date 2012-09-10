/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var Antialias = function(glee, gl, params){
    this.edge_detect = new glee.Processor({
        fbo: params.fbo,
        result: FloatTexture(glee, gl, params.width, params.height),
        shader: params.resources.edge,
        clear: true,
        samplers: {
            normaldepthmap: params.scene.normaldepth
        },
        uniforms: {
            offset: [1/params.width, 1/params.height]
        }
    });
   
    this.antialias = new glee.Processor({
        fbo: params.fbo,
        result: FloatTexture(glee, gl, params.width, params.height),
        shader: params.resources.antialias,
        clear: true,
        samplers: {
            source: params.source,
            edgemap: this.edge_detect.result
        },
        uniforms: {
            offset: [1/params.width, 1/params.height]
        }
    });

    this.result = this.antialias.result;

    this.render = function(){
        this.edge_detect.render();
        this.antialias.render();
    }
}
