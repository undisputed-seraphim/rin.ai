body.onload = function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
}

function goAhead() {
	$r.scene.add( "obj", { name: "uni", range: 30 } );
	//$r.scene.add( "obj", { name: "noire_mk2" } );
	//var p = new $r.$Primitive( "cube" );
	//$r.scene.add( p );
	$r.start();
}