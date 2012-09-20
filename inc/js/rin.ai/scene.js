__$r.prototype.$Scene = function $Scene() {
	this.cameras = [];
	this.models = [];
	this.lights = [];
	this.skies = [];
	this.terrain = "";
	this.time = 1200;
	this.tick = 0;
	this.ident = {};
	
	this.$state = {};
}

__$r.prototype.$Scene.prototype = {
	init: function() {
		this.cameras.push( new rin.$Camera( 45, rin.width / rin.height, 0.1, 100.0 ) );
		this.camera( 0 );
		this.skies.push( new rin.$Sky( "default" ) );
		this.sky( 0 ).init();
		this.lights.push( new rin.$Light( "directional" ) );
		this.light( 0 ).init();
		this.terrain = new rin.$Terrain();
		gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		gl.depthFunc( gl.LEQUAL ); },
	add: function( type, params ) {
		switch( type.toLowerCase() ) {
			case "obj":
				this.models.push( new rin.$OBJModel( this.models.length, params ) );
				break; } },
	sky: function( s ) {
		if( s === undefined ) return this.skies[ this.$state["SKY"] ];
		else { this.state( "SKY", s ); return this.sky(); } },
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
	light: function( l ) { return this.lights[ l ];	},
	tock: function() {
		document.getElementById("time").innerHTML = this.time;
		this.tick++;
		if( this.tick == 10 ) {
			this.tick = 0; this.time += 1;
			if( this.time > 2400 ) this.time = 0;
			if( this.time % 50 == 0 ) document.dispatchEvent( new Event("halfhour") ); } },
	render: function() {
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		this.tock();
		this.camera().update();
		//this.sky().render();
		gl.enable( gl.DEPTH_TEST );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
		gl.enable( gl.BLEND );
		this.terrain.render();
		for( var i in this.models ) { this.models[i].render(); }
		gl.disable( gl.BLEND );
	},
}