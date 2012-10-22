(function(){

function $rin() {
	this.programs = [];
	this.shaders = [];
	this.running = false;
	this.scene = "";
	this.time = 0;
	this.timeout = "";
	this.$state = {};
}

$rin.prototype = {
	init: function( id ) {
		this.gl = gl = window.gl = document.getElementById( id ).getContext( 'experimental-webgl' );
		this.width = document.getElementById( id ).width;
		this.height = document.getElementById( id ).height;
		this.canvas = document.getElementById( id );
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
	
	start: function() { if( !this.scene.initialized ) this.scene.init(); this.running = true; this.time = 0; this.render(); },
	restart: function() { this.running = true; this.render(); },
	stop: function() { this.running = false; },
	render: function() { if( r.running ) { rin.scene.render(); window.requestAnimFrame( r.render, rin.canvas ); } }
}

window.$r = window.r = window.rin = new $rin();
window.__$r = $rin;

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return rin.timeout = window.setTimeout( callback, 1000/60 );
		};
})();

window.cancelAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.clearTimeout;
})();

})();