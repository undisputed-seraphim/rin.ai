__$r.prototype.$Camera = function $Camera( fovy, aspect, znear, zfar ) {
	this.perspective = mat4.perspective( fovy, aspect, znear, zfar );
	this.matrix = mat4.create();
	this.rotate = mat4.create();
	this.translate = mat4.create();
	this.position = [ 0, -1.0, -6 ];
	this.rotation = [ 0, 0, 0 ];
	this.step = 0; this.side = 0; this.rise = 0;
	this.controls = false;
	this.limit = 360 * Math.PI / 180;
}

__$r.prototype.$Camera.prototype = {
	init: function( p, r ) {
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );
		this.position = p || this.position; this.pos();
		this.rotation = r || this.rotation; this.rot();
		//this.look( [0,0,0], [0,1,0] ); this.rot();
		this.transform();
		this.update();
		return this;
	},
	enable: function() {
		Controls.enable("camera");
		this.controls = true;
	},
	disable: function() {
		Controls.disable();
		this.controls = false;
	},
	attach: function() { },
	path: function() { },
	pos: function() { this.posTo( this.position ); },
	posTo: function( v ) {
		this.position = v || this.position;
		this.translate = mat4.translate( mat4.create(), [ this.position[0], this.position[1], this.position[2] ] ); },
	rot: function() { this.rotTo( this.rotation ); },
	rotTo: function( v ) {
		this.rotation = [ v[0] != this.rotation[0] ? v[0] * Math.PI / 180 : this.rotation[0],
						  v[1] != this.rotation[1] ? v[1] * Math.PI / 180 : this.rotation[1],
						  v[2] != this.rotation[2] ? v[2] * Math.PI / 180 : this.rotation[2] ];
		var rotateX = quat.create( [ 1.0, 0.0, 0.0 ], this.rotation[0] ),
			rotateY = quat.create( [ 0.0, 1.0, 0.0 ], this.rotation[1] ),
			rotateZ = quat.create( [ 0.0, 0.0, 1.0 ], this.rotation[2] );
		this.rotate = quat.mat4( quat.multiply( quat.multiply( rotateX, rotateY ), rotateZ ) ); },
	transform: function() { this.matrix = mat4.multiply( mat4.multiply( mat4.create(), this.rotate ), this.translate ); },
	move: function( step, side, rise ) {
		this.position[0] += this.rotate[8] * step + ( this.rotate[0] * side ) + ( this.rotate[4] * rise );
		this.position[1] += this.rotate[9] * step + ( this.rotate[1] * side ) + ( this.rotate[5] * rise );
		this.position[2] += this.rotate[10] * step + ( this.rotate[2] * side ) + ( this.rotate[6] * rise );
		this.pos(); },
	pitch: function( deg ) {
		if( deg === undefined ) return this.rotation[0] * 180 / Math.PI;
		this.rotTo( [ deg * Math.PI / 180, this.rotation[1], this.rotation[2] ] ); },
	yaw: function( deg ) {
		if( deg === undefined ) return this.rotation[0] * 180 / Math.PI;
		this.rotTo( [ this.rotation[0], deg * Math.PI / 180, this.rotation[2] ] ); },
	roll: function( deg ) {
		if( deg === undefined ) return this.rotation[0] * 180 / Math.PI;
		this.rotTo( [ this.rotation[0], this.rotation[1], deg * Math.PI / 180 ] ); },
	look: function( center, up ) {
		var f = vec3.normalize( vec3.subtract( center, this.position ) );
			f[0] = -f[0], f[1] = -f[1], f[2] = -f[2];
		var s = vec3.cross( f, up );
		var u = vec3.cross( s, f );
		this.rotate = mat4.create(
			s[0], s[1], s[2], 0,
			u[0], u[1], u[2], 0,
			-f[0], -f[1], -f[2], 0,
			0, 0, 0, 1 );
		this.rotation[0] = Math.atan2( -up[1] * this.rotate[6], this.rotate[5] );
		this.rotation[1] = Math.atan2( -this.rotate[8], this.rotate[0] );
		this.rotation[2] = Math.asin( this.rotate[4] );
	},
	update: function() {
		this.step = 0; this.side = 0; this.rise = 0;
		if( this.controls ) {
			if( Controls.any( "wasd" ) || Controls.any( "arrows" ) || Controls.keys.space || Controls.keys.shift ) {
				if( Controls.keys.left )	this.rotation[1] -=	.03; if( this.rotation[1] > this.limit ) this.rotation[1] -= this.limit;
				if( Controls.keys.right )	this.rotation[1] +=	.03; if( this.rotation[1] < 0 ) this.rotation[1] += this.limit;
				if( Controls.keys.up )		this.rotation[0] -=	.03; if( this.rotation[0] > this.limit ) this.rotation[0] -= this.limit;
				if( Controls.keys.down )	this.rotation[0] +=	.03; if( this.rotation[0] < 0 ) this.rotation[0] += this.limit;
				this.rot();
				if( Controls.keys.w )		this.step +=		0.05;
				if( Controls.keys.s )		this.step -=		0.05;
				if( Controls.keys.a )		this.side +=		0.05;
				if( Controls.keys.d )		this.side -=		0.05;
				if( Controls.keys.space )	this.rise -=		0.05;
				if( Controls.keys.shift )	this.rise +=		0.05;
				this.move( this.step, this.side, this.rise );
				this.transform();
			}
			if( Controls.keys.j ) {
				r.scene.models[0].mesh.physics.jump();
			}
			if( Controls.any( "numpad" ) ) {
				if( Controls.keys.numpad8 ) r.scene.models[0].mesh.move( .01, 0, 0 );
				if( Controls.keys.numpad2 ) r.scene.models[0].mesh.move( -.01, 0, 0 );
				if( Controls.keys.numpad4 ) { r.scene.models[0].mesh.rotation[1] += .03; }
				r.scene.models[0].mesh.rot(); 
				r.scene.models[0].mesh.pos();
				r.scene.models[0].mesh.transform();
			}
		}
		mvMatrix = this.matrix;
	}
}