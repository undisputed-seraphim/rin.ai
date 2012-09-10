/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/

var Glee = function(canvas, options){
    var glee = this;
    this.handleError = function(info){
        if(options.errorHandler){
            options.errorHandler(info);
        }
        throw info;
    };
    var gl = this.gl = canvas.getContext('experimental-webgl', {
        stencil: true
    });
    if(!gl){
        this.handleError({
            type: 'support',
            error: 'No webgl support available',
        });
    }
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    for(i in Glee.extensions){
        var extension = Glee.extensions[i];
        extension(glee);
    }
   
    this.resize = function(width, height){
        this.width = width;
        this.height = height;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        return this;
    }
    
    var clear = this.clear = function(params){
        if(typeof(params) == 'boolean'){
            var flags = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;
            gl.clearColor(0, 0, 0, 1);
            gl.clearDepth(0);
            gl.clearStencil(0);
        }
        else if(typeof(params) == 'object'){
            var flags = 0;
            if(params.color){
                flags |= gl.COLOR_BUFFER_BIT;
                if(typeof(params.color) == 'boolean'){
                    gl.clearColor(0, 0, 0, 1);
                }
                else{
                    gl.clearColor.apply(gl, params.color);
                }
            }
            if(params.depth){
                flags |= gl.DEPTH_BUFFER_BIT;
                gl.clearDepth(params.depth);
            }
            if(params.stencil){
                flags |= gl.STENCIL_BUFFER_BIT;
                gl.clearStencil(params.stencil || 0);
            }
        }
        gl.clear(flags);
        return this;
    };

    this.get = function(name){
        return gl.getParameter(gl[name]);
    }

    this.enableStencil = function(){
        gl.enable(gl.STENCIL_TEST);
        return this;
    }
    this.disableStencil = function(){
        gl.disable(gl.STENCIL_TEST);
        return this;
    }
    
    this.stencilFunc = function(func, ref, mask){
        var func = func || gl.ALWAYS;
        var ref = ref || 0;
        var mask = mask || 255;
        gl.stencilFunc(func, ref, mask);
        return this;
    }

    this.stencilMask = function(mask){
        var mask = mask || 255;
        gl.stencilMask(mask);
    }

    this.stencilOp = function(fail, depth_fail, pass){
        var fail = fail || gl.KEEP;
        var depth_fail = depth_fail || gl.KEEP;
        var pass = pass || gl.KEEP;
        gl.stencilOp(fail, depth_fail, pass);
    }
  
    this.noDepth = function(){
        gl.disable(gl.DEPTH_TEST);
        return this;
    };

    this.depthLess = function(){
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        return this;
    }
    
    this.depthGreater = function(){
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.GREATER);
        return this;
    }

    this.noBlend = function(){
        gl.disable(gl.BLEND);
        return this;
    }

    this.blendAdditive = function(){
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        return this;
    }

    this.blendMul = function(){
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ZERO, gl.SRC_COLOR); // does not work
        //gl.blendFunc(gl.DST_COLOR, gl.ZERO); // does not work
        return this;
    }

    this.blendAlpha = function(){
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.checkError();
        return this;
    }

    this.checkExt = function(name){
        if(!gl.getExtension('OES_' + name)){
            this.handleError({
                type: 'ext',
                error: 'Extension Not Supported: ' + 'OES_' + name,
                vendor: this.get('VENDOR'),
                version: this.get('VERSION')
            });
        }
        return this;
    }
}

Glee.defaults = function(params, defaults){
    var result = {};
    for(name in defaults){
        result[name] = defaults[name];
    };
    for(name in params){
        result[name] = params[name];
    };
    return result;
}

Glee.extend = function(obj, other){
    for(name in other){
        obj[name] = other[name];
    }
}

Glee.each = function(collection, fun){
    for(index in collection){
        fun(index, collection[index]);
    };
};

Glee.extensions = [];
