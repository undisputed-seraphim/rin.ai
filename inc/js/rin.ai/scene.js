__$r.prototype.$Scene = function $Scene() {
	this.cameras = [];
	this.models = [];
	this.lights = [];
	
	this.$state = {};
}

__$r.prototype.$Scene.prototype = {
	init: function() {
		this.cameras.push( new rin.$Camera( 45, 640.0/480.0, 0.1, 100.0 ) );
		this.state( "CAMERA", 0 );
		this.camera().enable();
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
		mvTranslate( [0.0, -1.0, -6.0] );
		for( var i in rin._models ) { rin._models[i].render(); }
	},
}