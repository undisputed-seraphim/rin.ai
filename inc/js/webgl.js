body.onload = function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
}

function goAhead() {
	//$r.scene.add( "obj", { name: "ultimecia", range: 33 } );
	$r.scene.add( "obj", { name: "uni", range: 30, rate: 50 } );
	$r.start();
}