body.onload = function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
}

function goAhead() {
	$r.scene.add( "obj", { name: "ultimecia", range: 33 } );
	$r.scene.add( "obj", { name: "cactuar", position: [ -4.0, 0.0, 0.0 ] } );
	$r.start();
}