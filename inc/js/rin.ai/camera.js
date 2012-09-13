__$r.prototype.$Camera = function $Camera(  fovy, aspect, znear, zfar ) {
	this.perspective = mat4.perspective( fovy, aspect, znear, zfar );
	this.position = { x: 0, y: 0.0, z: -6.0 };
	this.rotation = { x: 0, y: 0, z: 0 };
	this.controls = false;
	this.yaw = 0;
	this.xPos = 0; this.zPos = 0;
	this.target = vec3.create();
}

__$r.prototype.$Camera.prototype = {
	init: function() {
	},
	enable: function() {
		this.perspective = mat4.translate( this.perspective, [ this.position.x, this.position.y, this.position.z ] );
		Controls.enable("world");
		this.controls = true;
	},
	update: function() {
		this.yaw = 0; this.xPos = 0; this.zPos = 0;
		if( this.controls ) if( Controls.any( "wasd" ) ) {
			if( Controls.keys.a )	this.yaw +=		0.02;
			if( Controls.keys.d )	this.yaw -=		0.02;
			if( Controls.keys.w ) { this.zPos +=	(0.03 * Math.cos( this.yaw * ( Math.PI / 180 ) ) );
									this.xPos -=	(0.03 * Math.sin( this.yaw * ( Math.PI / 180 ) ) ); }
			if( Controls.keys.s ) { this.zPos -=	(0.03 * Math.cos( this.yaw * ( Math.PI / 180 ) ) );
									this.xPos +=	(0.03 * Math.sin( this.yaw * ( Math.PI / 180 ) ) ); }
			this.perspective = mat4.rotate( this.perspective, [ 0, this.yaw, 0 ] );
			this.perspective = mat4.translate( this.perspective, [ this.xPos, 0.0, this.zPos ] );
		}
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );
		/*this.perspective = temp;
		this.perspective = mat4.translate( this.perspective, [ this.xPos, 0.0, this.zPos ] );
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );*/
	}
}