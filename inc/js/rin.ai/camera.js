__$r.prototype.$Camera = function $Camera(  fovy, aspect, znear, zfar ) {
	this.perspective = mat4.perspective( fovy, aspect, znear, zfar );
	this.position = { x: 0, y: -1.0, z: -6 };
	this.perspective = mat4.translate( this.perspective, [ this.position.x, this.position.y, this.position.z ] );
	this.view = mat4.create();
	this.step = 0;
	this.rotation = { x: 0, y: 0, z: 0 };
	this.controls = false;
	this.yaw = 0;
	this.xPos = 0; this.zPos = 0;
}

__$r.prototype.$Camera.prototype = {
	init: function() {
	},
	enable: function() {
		//console.log( this.perspective[12], this.perspective[13], this.perspective[14], "yes" );
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uVMatrix"), false, mat4.flatten( this.view ) );
		Controls.enable("camera");
		this.controls = true;
	},
	disable: function() {
		Controls.disable();
		this.controls = false;
	},
	update: function() {
		this.yaw = 0; this.xPos = 0; this.step = 0;
		if( this.controls ) {
			if( Controls.any( "arrows" ) ) {
				if( Controls.keys.up )	this.step =		10;
				if( Controls.keys.down )this.step =		-10;
				//this.perspective = mat4.translate( this.perspective, [ 0.0, 1.0, this.perspective[14] * this.step.z ] );
				mvMatrix = mat4.translate( mvMatrix, [-mvMatrix[12] * this.step, -mvMatrix[13] * this.step, -mvMatrix[14] * this.step ] );
				console.log( this.perspective );
				console.log( "forward: ", this.perspective[12], this.perspective[13], this.perspective[14] );
				console.log( "position: ", this.perspective[3], this.perspective[7], this.perspective[11] );
			} if( Controls.any( "wasd" ) ) {
				if( Controls.keys.a )	this.rotation.y +=		0.5;
				if( Controls.keys.d )	this.rotation.y -=		0.5;
				if( Controls.keys.w ) { this.step.y =		1; }
				if( Controls.keys.s ) { this.step.y =		-1; }
				//this.perspective = mat4.translate( this.perspective, [ 0.0, this.perspective[13] * this.step.y, 0.0 ] );
				//this.perspective = mat4.rotateY( this.perspective, this.yaw );
				mvMatrix = mat4.rotateY( mvMatrix, this.rotation.y * ( Math.PI / 180 ) );
			}
		}
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uMVMatrix"), false, mat4.flatten( mvMatrix ) );
		/*this.perspective = temp;
		this.perspective = mat4.translate( this.perspective, [ this.xPos, 0.0, this.zPos ] );
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );*/
	}
}