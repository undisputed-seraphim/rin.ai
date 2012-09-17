(function(){
var __rinTextureQueue = [];
var __rinTextureLoading = false;

__$r.prototype.$Texture = function $Texture( name, parent ) {
	this.name = name;
	this.caller = parent;
	this.element = document.createElement("img");
	this.element.texture = this;
	this.element.onload = this.queue;
	this.texture = "";
	this.src = "";
	this.ready = false;
	this.Ka = [ 1.0, 1.0, 1.0 ]; /* ambient color */
	this.Kd = [ 0.0, 0.0, 0.0 ]; /* diffuse color */
	this.map_Kd = "";
	this.Ks = [ 0.0, 0.0, 0.0 ]; /* specular color */
	this.Ns = 1; /* specular coefficient */
	this.Ni = "";
	this.d = ""; /* alpha */
	this.illum = "";
};

__$r.prototype.$Texture.prototype = {
	queue: function() {
		__rinTextureQueue.push( this.texture );
		this.texture.process();
	},
	process: function() {
		if( __rinTextureLoading === false && __rinTextureQueue.length > 0 ) {
			__rinTextureLoading = true;
			__rinTextureQueue[0].load();
			__rinTextureQueue.shift();
		}
	},
	load: function() {
		var caller = this.caller;
		if( caller.textures[ this.name ].texture == "" ) {
			caller.textures[ this.name ].texture = gl.createTexture();
			gl.bindTexture( gl.TEXTURE_2D, caller.textures[ this.name ].texture );
			gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, caller.textures[ this.name ].element );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.generateMipmap( gl.TEXTURE_2D );
			gl.bindTexture( gl.TEXTURE_2D, null );
			caller.textures[ this.name ].ready = true;
		}
		__rinTextureLoading = false;
	}
};
})();