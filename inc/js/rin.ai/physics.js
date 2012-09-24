(function() {

var LEEWAY = 0.0001;

__$r.prototype.$Physics = function $Physics( target, params ) {
	params = params || {};
	this.type = params.type || "object";
	this.target = target;
	
	this.mass = params.mass || 10;
	this.imass = 1 / this.mass;
	this.speed = 0;
	this.direction = [0,-1,0];
	this.gravity = params.gravity || 9.81;
	this.strength = params.strength || 15.00;
	this.forces = [ 0, this.gravity * this.imass, 0 ];
	this.dt = 0.09;
	
	this.tick = new Date().getTime();
	this.grounded = false;
	this.falling = false;
	this.jumping = false;
}

__$r.prototype.$Physics.prototype = {
	init: function() {
		switch( this.type ) {
			
		}
	},
	update: function() {
		if( r.scene.terrain.mesh.max.y <= this.target.bbox.min.y + LEEWAY ) this.ground();
		if( this.falling ) {
			this.target.position[1] += this.speed;
			this.target.pos();
			this.target.transform();
			this.speed *= this.forces[1];
			this.ground();
		}
	},
	fall: function() {
		if( !this.grounded ) {
			this.falling = true;
			this.speed += this.forces[1] * -1 * this.dt;
		}
	},
	jump: function() {

	},
	ground: function() {
		if( this.target != r.scene.terrain.mesh && !this.grounded ) {
			if( !this.falling ) {
				if( r.scene.terrain.mesh.max.y <= this.target.bbox.min.y + LEEWAY ) {
					this.fall();
					this.falling = true;
				}
			} else if( this.falling ) {
				if( r.scene.terrain.mesh.max.y >= this.target.bbox.min.y + LEEWAY ) {
					this.falling = false;
					this.speed = 0;
					this.grounded = true;
				}
			}
		}
	},
}

})();