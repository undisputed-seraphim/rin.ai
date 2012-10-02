__$r.prototype.$Program = function $Program() {
	this.target = gl.createProgram();
	this.pointers = {};
}

__$r.prototype.$Program.prototype = {
	init: function() {
		this.pointers.vertex = gl.getAttribLocation( this.target, "aVertex" );
		gl.enableVertexAttribArray( this.pointers.vertex );
		this.pointers.normal = gl.getAttribLocation( this.target,  "aNormal" );
		gl.enableVertexAttribArray( this.pointers.normal );
		this.pointers.texture = gl.getAttribLocation( this.target,  "aTexture" );
		gl.enableVertexAttribArray( this.pointers.texture );
		this.pointers.index = gl.getAttribLocation( this.target,  "aVertex" );
		gl.enableVertexAttribArray( this.pointers.index );
	},
	attribute: function( name ) {
		return gl.getAttribLocation( this.target, name );
	},
	uniform3f: function( name, v ) {
		gl.uniform3f( gl.getUniformLocation( this.target, name ), v[0], v[1], v[2] );
	},
	attach: function( shader ) { gl.attachShader( this.target, shader ); return this; },
	link: function() { gl.linkProgram( this.target ); return this; },
	use: function() { gl.useProgram( this.target ); return this; }
}

function setMatrixUniforms() {
  //var pUniform = r.gl.getUniformLocation( r.program(), "uPMatrix");
  //r.gl.uniformMatrix4fv( pUniform, false, mat4.flatten( perspectiveMatrix ) );
 
  var mvUniform = gl.getUniformLocation( r.program(), "uMVMatrix");
  gl.uniformMatrix4fv( mvUniform, false, mat4.flatten( mvMatrix ) );
}