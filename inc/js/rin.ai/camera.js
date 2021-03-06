__$r.prototype.$Camera = function $Camera( fovy, aspect, znear, zfar ) {
	this.perspective = mat4.perspective( fovy, aspect, znear, zfar );
	this.mode = "free";
	this.attached = "";
	this.model = "";
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
	attach: function( model ) {
		var mesh = model.mesh;
		console.log( mesh.position[0] );
		this.position = mesh.position.slice();
		this.rotation = mesh.rotation.slice();
		this.rotation[1] += ( Math.PI );
		this.rot();
		this.pos();
		this.move( -2, -Math.abs(mesh.max.x-mesh.min.x)*1.3, -Math.abs(mesh.max.y-mesh.min.y)*1.3 );
		this.transform();
		this.model = model;
		this.attached = mesh;
		this.mode = "attached";
	},
	path: function() { },
	pos: function() { this.posTo( this.position ); },
	posTo: function( v ) {
		this.position = v || this.position;
		this.translate = mat4.translate( mat4.create(), [ this.position[0], this.position[1], this.position[2] ] ); },
	rot: function() { this.rotTo( this.rotation ); },
	rotTo: function( v ) {
		this.rotation = [ v[0], v[1], v[2] ];
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
	update: function() {
		this.step = 0; this.side = 0; this.rise = 0;
		if( this.mode == "free" ) {
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
			}
		} else if( this.mode == "attached" ) {
			// move in direction character is facing
			if( Controls.any( "wasd" ) ) {
				if( this.model.anima != "run" ) this.model.animate("run");
				if( Controls.keys.w )		this.step +=		0.05;
				if( Controls.keys.s )		this.step -=		0.05;
				if( Controls.keys.a )		this.side +=		0.05;
				if( Controls.keys.d )		this.side -=		0.05;
				this.attached.move( this.step, this.side, this.rise );
				this.move( this.step, this.side, this.rise );
				this.attached.transform();
				this.transform();
			} else if( Controls.any( "arrows" ) || Controls.keys.space || Controls.keys.shift ) {
				if( Controls.keys.left )	this.attached.rotation[1] -=	.03;
					if( this.attached.rotation[1] > this.limit ) this.attached.rotation[1] -= this.limit;
				if( Controls.keys.right )	this.attached.rotation[1] +=	.03;
					if( this.attached.rotation[1] < 0 ) this.attached.rotation[1] += this.limit;
				if( Controls.keys.up )		this.attached.rotation[0] -=	.03;
					if( this.attached.rotation[0] > this.limit ) this.attached.rotation[0] -= this.limit;
				if( Controls.keys.down )	this.attached.rotation[0] +=	.03;
					if( this.attached.rotation[0] < 0 ) this.attached.rotation[0] += this.limit;
				this.rot();
				if( Controls.keys.space )	this.rise -=		0.05;
				if( Controls.keys.shift )	this.rise +=		0.05;
			} else if( this.model.anima != "idle" ) this.model.animate("idle");
			this.transform();
		}
		mvMatrix = this.matrix;
	}
}