(function(){

function $rin() {
	this.programs = [];
	this.shaders = [];
	this.scene = "";
	this.interval = "";
	this.$state = {};
}

$rin.prototype = {
	init: function( id ) {
		this.gl = gl = window.gl = document.getElementById( id ).getContext( 'experimental-webgl' );
		this.width = document.getElementById( id ).width;
		this.height = document.getElementById( id ).height;
		this.canvas = id;
		this.programs.push( new this.$Program() );
		this.shaders.push( new this.$Shader( "vertex", "default" ) );
		this.shaders.push( new this.$Shader( "fragment", "default" ) );
		this.state( { "PROGRAM": 0, "VERTEX_SHADER": 0, "FRAGMENT_SHADER": 1 } );
		this.$program().attach( this.shaders[0].target ).attach( this.shaders[1].target ).link().use().init();
		this.scene = new this.$Scene();
		document.dispatchEvent( new Event("rinLoaded") );
	},
	state: function( state, value ) {
		if( value === undefined )
			if( typeof(state) == "object" )
				for( var i in state ) this.$state[i] = state[i];
			else return this.$state[state];
		else this.$state[state] = value;
		return this;
	},
	program: function() { return this.programs[ this.$state[ "PROGRAM" ] ].target; },
	$program: function() { return this.programs[ this.$state[ "PROGRAM" ] ]; },
	
	render: function() { rin.scene.render(); },
	start: function() { this.scene.init(); this.interval = setInterval( rin.render, 15 ); },
	stop: function() { clearInterval( this.interval ); this.interval = ""; Controls.disable(); }
}

window.$r = window.r = window.rin = new $rin();
window.__$r = $rin;
})();