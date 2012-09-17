__$r.prototype.$Camera = function $Camera( fovy, aspect, znear, zfar ) {
	this.perspective = mat4.perspective( fovy, aspect, znear, zfar );
	this.matrix = mat4.create();
	this.position = [ 0, -1.0, -6 ];
	this.rotation = [ 0, 0, 0 ];
	this.step = 0; this.side = 0;
	this.controls = false;
}

__$r.prototype.$Camera.prototype = {
	init: function( p, r ) {
		gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "uPMatrix"), false, mat4.flatten( this.perspective ) );
		this.matrix = mat4.translate( mat4.create(), [ p[0] || this.position[0], p[1] || this.position[1], p[2] || this.position[2] ] );
		this.update();
	},
	enable: function( p, r ) {
		//r === undefined ? p === undefined ? this.init( this.position, this.rotation ) : this.init( p ) : this.init( p, r );
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
				if( Controls.keys.left )	this.rotation[1] +=	1; if( this.rotation[1] > 360 ) this.rotation[1] -= 360;
				if( Controls.keys.right )	this.rotation[1] -=	1; if( this.rotation[1] < 0 ) this.rotation[1] += 360;
				if( Controls.keys.up )		this.rotation[0] +=	1; if( this.rotation[0] > 360 ) this.rotation[0] -= 360;
				if( Controls.keys.down )	this.rotation[0] -=	1; if( this.rotation[0] < 0 ) this.rotation[0] += 360;
				var rotateX = mat4.$rotate( mat4.create(), this.rotation[0] * Math.PI / 180, [ 1.0, 0.0, 0.0 ] );
				var rotateY = mat4.$rotate( mat4.create(), this.rotation[1] * Math.PI / 180, [ 0.0, 1.0, 0.0 ] );
				this.matrix = mat4.multiply( mat4.create(), rotateX );
				this.matrix = mat4.multiply( this.matrix, rotateY );
				if( Controls.keys.w )		this.step =		0.05;
				if( Controls.keys.s )		this.step =		-0.05;
				if( Controls.keys.a )		this.side =		-0.05;
				if( Controls.keys.d )		this.side =		0.05;
				temp = vec3.cross( vec3.create( Math.sin( this.rotation[1] * Math.PI / 180 ), -(Math.sin( this.rotation[0] * Math.PI / 180 ) ),
					Math.cos( this.rotation[1] * Math.PI / 180 ) ), vec3.create(0,1,0) );
				this.position[0] += ( Math.sin( this.rotation[1] * Math.PI / 180 ) * this.step ) + ( temp[0] * this.side );
				this.position[1] += -( Math.sin( this.rotation[0] * Math.PI / 180 ) * this.step ) + ( temp[1] * this.side );
				this.position[2] += ( Math.cos( this.rotation[1] * Math.PI / 180 ) * this.step ) + ( temp[2] * this.side );
				var translate = mat4.translate( mat4.create(), [ this.position[0], this.position[1], this.position[2] ] );
				this.matrix = mat4.multiply( this.matrix, translate );
			}
		}
		mvMatrix = this.matrix;
	}
}