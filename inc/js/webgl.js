$(document).ready(function() {
	//_gl = new webgl("canvas");
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
	//_gl.viewport(0, 0, canvas.width, canvas.height);
	//_gl.initShaders();
	//document.addEventListener( "modelLoaded", goAhead );
	//miku = new model( "miku2" );
	//_gl.loadModel( "miku2" );
	//_gl.loadTextures( "miku2" );
	//_gl.initBuffers( "miku2" );
	//_gl.queue( function() {	_gl.start(); } );
});

function goAhead() {
	$r.scene.add( "obj", "miku2" );
	$r.start();
}