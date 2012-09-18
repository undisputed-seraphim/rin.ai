__$r.prototype.$Camera = function $Camera( fovy, aspect, znear, zfar ) {
	this.perspective = mat4.perspective( fovy, aspect, znear, zfar );
	this.matrix = mat4.create();
	this.rotate = mat4.create();
	this.position = [ 0, -1.0, -6 ];
	this.rotation = [ 0, 0, 0 ];
	this.step = 0; this.side = 0;
	this.controls = false;
	this.limit = 360 * Math.PI / 180;
}

__$r.prototype.$Camera.prototype = {
	init: function( p, r ) {
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );
		var rotateX = quat.create( [ 1.0, 0.0, 0.0 ], r[0] * Math.PI / 180 || this.rotation[0] ),
			rotateY = quat.create( [ 0.0, 1.0, 0.0 ], r[1] * Math.PI / 180 || this.rotation[1] );
		this.rotate = quat.mat4( quat.multiply( rotateX, rotateY ) );
		this.matrix = mat4.multiply( mat4.create(), this.rotate );
		this.matrix = mat4.translate( this.matrix, [ p[0] || this.position[0], p[1] || this.position[1], p[2] || this.position[2] ] );
		this.update();
	},
	enable: function( p, r ) {
		this.init( p || this.position, r || this.rotation );
		Controls.enable("camera");
		this.controls = true;
	},
	disable: function() {
		Controls.disable();
		this.controls = false;
	},
	update: function() {
		this.step = 0; this.side = 0;
		if( this.controls ) {
			if( Controls.any( "wasd" ) || Controls.any( "arrows" ) ) {
				if( Controls.keys.left )	this.rotation[1] -=	.03; if( this.rotation[1] > this.limit ) this.rotation[1] -= this.limit;
				if( Controls.keys.right )	this.rotation[1] +=	.03; if( this.rotation[1] < 0 ) this.rotation[1] += this.limit;
				if( Controls.keys.up )		this.rotation[0] -=	.03; if( this.rotation[0] > this.limit ) this.rotation[0] -= this.limit;
				if( Controls.keys.down )	this.rotation[0] +=	.03; if( this.rotation[0] < 0 ) this.rotation[0] += this.limit;
				var rotateX = quat.create( [ 1.0, 0.0, 0.0 ], this.rotation[0] ),
					rotateY = quat.create( [ 0.0, 1.0, 0.0 ], this.rotation[1] );
				this.rotate = quat.mat4( quat.multiply( rotateX, rotateY ) );
				this.matrix = mat4.multiply( mat4.create(), this.rotate );
				if( Controls.keys.w )		this.step +=		0.05;
				if( Controls.keys.s )		this.step -=		0.05;
				if( Controls.keys.a )		this.side +=		0.05;
				if( Controls.keys.d )		this.side -=		0.05;
				this.position[0] += this.rotate[8] * this.step + ( this.rotate[0] * this.side );
				this.position[1] += this.rotate[9] * this.step + ( this.rotate[1] * this.side );
				this.position[2] += this.rotate[10] * this.step + ( this.rotate[2] * this.side );
				var translate = mat4.translate( mat4.create(), [ this.position[0], this.position[1], this.position[2] ] );
				this.matrix = mat4.multiply( this.matrix, translate );
			}
		}
		mvMatrix = this.matrix;
	}
}