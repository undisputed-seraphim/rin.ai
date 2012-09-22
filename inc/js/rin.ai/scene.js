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
		this.camera( 0 ).init().enable();
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
		else { this.state( "CAMERA", c ); return this.camera(); } },
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
		//this.terrain.render();
		//this.sky().render();
		gl.enable( gl.DEPTH_TEST );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
		gl.enable( gl.BLEND );
		for( var i in this.models ) { this.models[i].render(); }
		gl.disable( gl.BLEND );
		/*gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseColor" ), true );
		gl.uniform3f( gl.getUniformLocation( rin.program(), "uColor" ), 1.0, 0.0, 0.0 );
		var line = [ 0, 0, 0,
					 0, 10, 0,
					 0, 0, 0,
					 0, -10, 0 ];
		var iba = [ 1, 2, 3, 4 ];
		var buffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( line ), gl.STATIC_DRAW);
		gl.vertexAttribPointer( rin.$program().pointers.vertex, 2, gl.FLOAT, false, 0, 0 );
		gl.disableVertexAttribArray( rin.$program().pointers.texture );
		gl.disableVertexAttribArray( rin.$program().pointers.normal );
		var ibo = gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibo );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( iba ), gl.STATIC_DRAW );
		gl.drawElements( gl.LINE_STRIP, iba.length, gl.UNSIGNED_SHORT, 0 );
		gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseColor" ), false );*/
	},
}