$(document).ready(function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
});

function goAhead() {
	$r.scene.add( "obj", { name: "ultimecia", range: 33 } );
	$r.start();
}