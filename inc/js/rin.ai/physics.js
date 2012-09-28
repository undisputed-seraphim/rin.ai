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
	this.gravity = params.gravity || -9.81;
	this.strength = params.strength || 15.00;
	this.f_gravity = this.imass * this.gravity;
	this.legstrength = params.legstrength || 0.25;
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
		if( r.scene.terrain.mesh.max.y + LEEWAY <= this.target.position[1] &&
		   	!this.falling && !this.jumping ) this.ground();
		else if( r.scene.terrain.mesh.max.y - LEEWAY >= this.target.position[1] && !this.grounded ) this.fix();
		if( this.falling ) {
			this.speed = this.f_gravity * this.dt;
			if( this.target.bbox.min.y + this.speed < r.scene.terrain.mesh.max.y ) {
				this.target.position[1] = r.scene.terrain.mesh.max.y - LEEWAY;
				this.dt = 0;
				this.falling = false;
				this.grounded = true;
			} else {
				this.target.position[1] += this.speed;
				this.dt += 0.02;
			}
			this.target.pos();
			this.target.transform();
			this.ground();
		} else if( this.jumping ) {
			this.speed = this.legstrength + ( this.f_gravity * this.dt );
			if( this.speed < 0 ) {
				this.jumping = false;
				this.dt = 0.02;
				this.fall();
			} else {
				this.target.position[1] += this.speed;
				this.target.pos();
				this.target.transform();
				this.dt += 0.02;
			}
		}
	},
	fix: function() {
		this.target.position[1] = r.scene.terrain.mesh.max.y;
		this.target.pos();
		this.target.transform();
		this.grounded = true;
	},
	fall: function() {
		if( !this.grounded ) {
			this.falling = true;
		}
	},
	jump: function() {
		if( this.grounded ) {
			this.grounded = false;
			this.dt = 0.02;
			this.jumping = true;
		}
	},
	ground: function() {
		//console.log( "ground check" );
		if( !this.grounded ) {
			if( !this.falling && !this.jumping ) {
				if( r.scene.terrain.mesh.max.y <= this.target.bbox.min.y + LEEWAY ) {
					this.dt = 0.02;
					this.fall();
				}
			} else if( this.falling ) {
				if( r.scene.terrain.mesh.max.y >= this.target.bbox.min.y + LEEWAY ) {
					this.falling = false;
					this.speed = 0;
					this.dt = 0;
					this.grounded = true;
				}
			}
		}
	},
}

})();