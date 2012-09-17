__$r.prototype.$Scene = function $Scene() {
	this.cameras = [];
	this.models = [];
	this.lights = [];
	this.skies = [];
	this.ident = {};
	
	this.$state = {};
}

__$r.prototype.$Scene.prototype = {
	init: function() {
		this.cameras.push( new rin.$Camera( 45, rin.width / rin.height, 0.1, 100.0 ) );
		this.camera( 0 ).enable();
		this.skies.push( new rin.$Sky( "default" ) );
		this.sky( 0 ).init();
		gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
		gl.depthFunc( gl.LEQUAL );
	},
	add: function( type, params ) {
		switch( type.toLowerCase() ) {
			case "obj":
				this.models.push( new rin.$OBJModel( this.models.length, params ) );
				break; } },
	sky: function( s ) {
		if( s === undefined ) return this.skies[ this.$state["SKY"] ];
		else {
			this.state( "SKY", s );
			return this.sky(); } },
	camera: function( c ) {
		if( c === undefined ) return this.cameras[ this.$state["CAMERA"] ];
		else {
			if( this.camera() ) this.camera().disable();
			this.state( "CAMERA", c );
			this.camera().enable();
			return this.camera(); } },
	state: function( state, value ) {
		if( value === undefined )
			if( typeof(state) == "object" )
				for( var i in state ) this.$state[i] = state[i];
			else return this.$state[state];
		else this.$state[state] = value;
		return this; },
	render: function() {
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		this.camera().update();
		this.sky().render();
		gl.uniform3f( gl.getUniformLocation( rin.program(), "uLightDirection" ), 0.5, 0.0, 1.0);
		for( var i in this.models ) { this.models[i].render(); }
	},
}