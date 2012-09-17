$(document).ready(function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
});

function goAhead() {
	$r.scene.add( "obj", { name: "uni", position: [3.0,0.0,0.0] } );
	$r.scene.add( "obj", { name: "ultimecia", range: 10 } );
	$r.start();
}