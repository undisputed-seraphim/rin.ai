var _texture_loaded = 0;
var _texture_max = 0;

function texture( name ) {
	this.name = name;
	
	this.v = { index: [], texture: [], buffer: "" };
}

function material( name ) {
	this.name = name;
	this.src = "";
	this.parent = "";
	this.element = document.createElement( "img" );
	this.element.onload = function( mod ) { return function() { mod.preloaded() }}(this);
	this.ready = false;
	this.texture = "";
	this.v = { Ns: "", Ka: "", Kd: "", Ks: "", Ni: "", d: "", illum: "" };
} material.prototype.load = function( mod, max ) {
	this.parent = mod;
	_texture_max = max;
	if( this.src != "" ) this.element.src = "inc/models/"+mod.name+"/"+this.src;
	else _texture_loaded++;
}; material.prototype.preloaded = function() {
	_texture_loaded++;
	this.ready = true;
	if( _texture_loaded == _texture_max - 1 ) this.init();
}; material.prototype.init = function() {
	for( var i in this.parent.v.mats ) {
		if( this.parent.v.mats[i].src != "" ) {
			this.parent.v.mats[i].texture = _gl.ctx.createTexture();
			_gl.ctx.bindTexture(_gl.ctx.TEXTURE_2D, this.parent.v.mats[i].texture);
			//_gl.ctx.pixelStorei(_gl.ctx.UNPACK_FLIP_Y_WEBGL, true);
			_gl.ctx.texImage2D(_gl.ctx.TEXTURE_2D, 0, _gl.ctx.RGBA, _gl.ctx.RGBA, _gl.ctx.UNSIGNED_BYTE, this.parent.v.mats[i].element);
			_gl.ctx.texParameteri(_gl.ctx.TEXTURE_2D, _gl.ctx.TEXTURE_MAG_FILTER, _gl.ctx.NEAREST);
			_gl.ctx.texParameteri(_gl.ctx.TEXTURE_2D, _gl.ctx.TEXTURE_MIN_FILTER, _gl.ctx.NEAREST);
			_gl.ctx.generateMipmap(_gl.ctx.TEXTURE_2D);
			_gl.ctx.bindTexture(_gl.ctx.TEXTURE_2D, null);
		}
	}
	document.dispatchEvent( new Event("modelLoaded") );
};