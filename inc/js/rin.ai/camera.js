__$r.prototype.$Camera = function $Camera(  fovy, aspect, znear, zfar ) {
	this.perspective = mat4.perspective( fovy, aspect, znear, zfar );
	this.position = { x: 0, y: 0.0, z: -6.0 };
	this.rotation = { x: 0, y: 0, z: 0 };
	this.controls = false;
	this.yaw = 0; this.step = 0;
	this.xPos = 0; this.zPos = 0;
	this.target = vec3.create();
}

__$r.prototype.$Camera.prototype = {
	init: function() {
	},
	enable: function() {
		console.log( this.perspective[12], this.perspective[13], this.perspective[14], "yes" );
		this.perspective = mat4.translate( this.perspective, [ this.position.x, this.position.y, this.position.z ] );
		Controls.enable("camera");
		this.controls = true;
	},
	disable: function() {
		Controls.disable();
		this.controls = false;
	},
	update: function() {
		this.step = 0; this.yaw = 0; this.xPos = 0; this.zPos = 0;
		if( this.controls ) {
			if( Controls.any( "arrows" ) ) {
				if( Controls.keys.up )	this.step =		0.5;
				if( Controls.keys.down )this.step =		-0.5;
				this.perspective = mat4.translate( this.perspective, [-this.perspective[12] * this.step, -this.perspective[13] * this.step, -this.perspective[14] * this.step ] );
			} if( Controls.any( "wasd" ) ) {
				if( Controls.keys.a )	this.yaw =		0.5;
				if( Controls.keys.d )	this.yaw =		-0.5;
				if( Controls.keys.w ) { this.step =		0.5; }
				if( Controls.keys.s ) { this.step =		-0.5; }
				this.perspective = mat4.rotateY( this.perspective, this.yaw );
			}
		}
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );
		/*this.perspective = temp;
		this.perspective = mat4.translate( this.perspective, [ this.xPos, 0.0, this.zPos ] );
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );*/
	}
}