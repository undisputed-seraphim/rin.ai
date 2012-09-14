__$r.prototype.$Scene = function $Scene() {
	this.cameras = [];
	this.models = [];
	this.lights = [];
	
	this.$state = {};
	this.stack = [];
}

__$r.prototype.$Scene.prototype = {
	init: function() {
		this.cameras.push( new rin.$Camera( 45, 640.0/480.0, 0.1, 100.0 ) );
		this.state( "CAMERA", 0 );
		this.camera().enable();
		//this.mvMatrix = mat4.translate( this.mvMatrix, [0.0, 0.0, 10.0] );
		//r.gl.uniformMatrix4fv( r.gl.getUniformLocation( r.program(), "uMVMatrix"), false, mat4.flatten( this.mvMatrix ) );
	},
	camera: function( c ) {
		if( c === undefined ) return this.cameras[ this.$state["CAMERA"] ];
		else {
			this.camera().disable();
			this.state( "CAMERA", c );
			this.camera().enable(); } },
	state: function( state, value ) {
		if( value === undefined )
			if( typeof(state) == "object" )
				for( var i in state ) this.$state[i] = state[i];
			else return this.$state[state];
		else this.$state[state] = value;
		return this; },
	push: function( m ) { this.stack.push( m ); },
	pop: function( m ) { m = this.stack.pop(); },
	buffer: function() { },
	render: function() {
		this.push( mvMatrix );
		this.camera().update();
		this.pop( mvMatrix );
		for( var i in rin._models ) { rin._models[i].render(); }
		//r.gl.uniformMatrix4fv( r.gl.getUniformLocation( r.program(), "uPMatrix"), false, mat4.flatten( this.camera().perspective ) );
	},
}