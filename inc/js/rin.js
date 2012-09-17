(function(){
var gl, rin,
	modules = [ "program", "shader", "scene", "camera",
			    "controls", "utility" ];

(function(){

function $rin() {
	rin = this;
	this.programs = [];
	this.shaders = [];
	this.scene = "";
	this.$state = {};
	this.modules = 6;
	this._models = [];
	this._ident = {};
	this.b = { normal: "", vertex: "", texture: "" };
	this.q = { running: false, queue: [], current: "" };
	this.v = { texture: "", vertex: "", normal: "" };
}

$rin.prototype = {
	program: function() { return this.programs[ this.$state[ "PROGRAM" ] ].target; },
	$program: function() { return this.programs[ this.$state[ "PROGRAM" ] ]; },
}
$rin.prototype.init = function( id ) {
	this.gl = gl = window.gl = document.getElementById( id ).getContext( 'experimental-webgl' );
	this.width = document.getElementById( id ).width;
	this.height = document.getElementById( id ).height;
	this.canvas = id;
	if( gl ) { this.load(); }
};
$rin.prototype.state = function( state, value ) {
	if( value === undefined )
		if( typeof(state) == "object" )
			for( var i in state ) this.$state[i] = state[i];
		else return this.$state[state];
	else this.$state[state] = value;
	return this;
};
$rin.prototype.load = function() {
	if( this.modules != modules.length ) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.onload = function() { rin.load(); }
		document.getElementsByTagName("head")[0].appendChild( script );
		script.src = "inc/js/rin.ai/"+modules[this.modules++]+".js";
	} else {
		this.programs.push( new this.$Program() );
		this.shaders.push( new this.$Shader( "vertex", "default" ) );
		this.shaders.push( new this.$Shader( "fragment", "default" ) );
		this.state( { "PROGRAM": 0, "VERTEX_SHADER": 0, "FRAGMENT_SHADER": 1 } );
		this.$program().attach( this.shaders[0].target ).attach( this.shaders[1].target ).link().use().init();
		this.scene = new this.$Scene();
		document.dispatchEvent( new Event("rinLoaded") );
	}
};
$rin.prototype.draw = function() {
	rin.scene.render();
};
$rin.prototype.start = function() {
	this.scene.init();
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uAmbientColor" ), 0.6, 0.6, 0.6);
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uDiffuseColor" ), 1.5, 1.5, 1.5);
    gl.uniform3f( gl.getUniformLocation( rin.program(), "uSpecularColor" ), 0.8, 0.8, 0.8);
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uDirectionalColor" ), 0.75, 0.75, 0.75);
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uLightDirection" ), 0.5, 0.0, 1.0);
	rin.interval = setInterval( rin.draw, 15 );
};
$rin.prototype.stop = function() {
	clearInterval( rin.interval );
	Controls.disable();
};

window.$r = window.r = window.rin = new $rin();
window.__$r = $rin;
})();

})();