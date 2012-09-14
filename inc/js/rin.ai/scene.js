__$r.prototype.$Scene = function $Scene() {
	this.cameras = [];
	this.models = [];
	this.lights = [];
	
	this.$state = {};
	this.mvMatrix;
}

__$r.prototype.$Scene.prototype = {
	init: function() {
		this.cameras.push( new rin.$Camera( 45, 640.0/480.0, 0.1, 100.0 ) );
		this.state( "CAMERA", 0 );
		this.camera().enable();
		this.mvMatrix = mat4.create();
		//this.mvMatrix = mat4.translate( this.mvMatrix, [0.0, 0.0, 10.0] );
		//r.gl.uniformMatrix4fv( r.gl.getUniformLocation( r.program(), "uMVMatrix"), false, mat4.flatten( this.mvMatrix ) );
	},
	camera: function() { return this.cameras[ this.$state["CAMERA"] ]; },
	state: function( state, value ) {
		if( value === undefined )
			if( typeof(state) == "object" )
				for( var i in state ) this.$state[i] = state[i];
			else return this.$state[state];
		else this.$state[state] = value;
		return this;
	},
	buffer: function() { },
	render: function() {
		this.camera().update();
		
		for( var i in rin._models ) { rin._models[i].render(); }
	},
}