/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
Glee.extensions.push(function(glee){
    var gl = glee.gl;
    glee.checkError = function(){
        var code = gl.getError();
        switch(code){
            case gl.NO_ERROR:
                return;
            case gl.OUT_OF_MEMORY:
                throw 'Out of Memory'
            case gl.INVALID_ENUM:
                throw 'Invalid Enum'
            case gl.INVALID_OPERATION:
                throw 'Invalid Operation'
            case gl.INVALID_FRAMEBUFFER_OPERATION:
                throw 'Invalid Framebuffer Operation'
            case gl.INVALID_VALUE:
                throw 'Invalid Value'
        }
    }
});
