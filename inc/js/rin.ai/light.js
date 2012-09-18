__$r.prototype.$Light = function $Light( type, params ) {
	params = params || {};
	this.type = type;
	this.color = params.color || [ 1.0, 1.0, 1.0 ];
	this.colors = {
		ambient: params.ambient || [ 0.0, 0.0, 0.0 ],
		diffuse: params.diffuse || [ 0.0, 0.0, 0.0 ],
		specular:params.specular || [ 0.0, 0.0, 0.0 ] };
	this.direction = params.direction || "NA";
	this.enabled = false;
}

__$r.prototype.$Light.prototype = {
	init: function() {
		this.enabled = true;
		document.addEventListener( "halfhour", this.update );
		this.apply();
	},
	apply: function() {
		gl.uniform3f( gl.getUniformLocation( rin.program(), "uAmbientColor" ), 0.6, 0.6, 0.6);
		gl.uniform3f( gl.getUniformLocation( rin.program(), "uDiffuseColor" ), 1.5, 1.5, 1.5);
	    gl.uniform3f( gl.getUniformLocation( rin.program(), "uSpecularColor" ), 0.8, 0.8, 0.8);
		gl.uniform3f( gl.getUniformLocation( rin.program(), "uDirectionalColor" ), 0.75, 0.75, 0.75);
		gl.uniform3f( gl.getUniformLocation( rin.program(), "uLightDirection" ), 0.5, 0.0, 1.0);
	},
	update: function() {
	}
}