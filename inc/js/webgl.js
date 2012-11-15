body.onload = function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
}


function goAhead() {
	/*$r.scene.add( "obj", { name: "ultimecia", range: 250, position: [-1,0,0], animation: "next",
		amap: { "idle": [1, 33], "hit1": [34, 52], "hit2": [53, 75],
		"attack1": [76, 128], "attack2": [129, 169], "next": [170, 250] } } );*/
		
	//$r.scene.add( "dae", { name: "terra", pack: "dissidia", type: "character", position: [-0.5, 0.5, 0],
	//			amap: { "default": [0,81], "idle": [0,81], "run": [81,101] } } );
	$r.scene.add( "dae", { name: "cloud", pack: "dissidia", type: "character", position: [-0.5, 0.5, 0],
						   amap: { "default": [0,50] } } );
	
	/*var m = new $r.$Mesh( { name: "test", type: "character", position: [0.5, 0.5, 0] } );
	
	var s = "";
	var spl1 = s.split("|"),
		master = [];
	for( var i in spl1 ) {
		master[i] = { v:[], n:[], t:[] }
		var tmp = spl1[i].split("[");
		var vtmp = tmp[0].split("=");
		for( var j in vtmp )
			master[i].v.push( vtmp[j].split(",") );
		var vtmp = tmp[1].split("=");
		for( var j in vtmp )
			master[i].n.push( vtmp[j].split(",") );
		var vtmp = tmp[2].split("=");
		for( var j in vtmp )
			master[i].t.push( vtmp[j].split(",") );
	}
	console.log( master );
	
	m.frame( 0 );
	m.node( 0 );
	var face = [], l = 0;
	
	for( var i in master ) {
		m.mat( i );
		face = [];
		var v = master[i].v,
			n = master[i].n,
			t = master[i].t;
		for( var j = 0; j < v.length; j++ ) {
			m.vertex( v[j][0], v[j][1], v[j][2] );
			m.normal( n[j][0], n[j][1], n[j][2] );
			m.texture( t[j][0], t[j][1] );
			face.push( l++ );
			if( face.length == 3 ) {
				m.face( face[0], face[1], face[2] );
				face = [];
			}
		}
	}
	m.textured = false;
	m.colored = true;
	//$r.m = m;
	console.log( m );*/
	
	//$r.scene.add( "dae", { name: "blackheart_v", type: "character", position: [2, 0.5, 0] } );
	
	/*$r.scene.add( "dae", { name: "blackheart_mk2", type: "character", position: [0.5, 0.5, 0] } );
	$r.scene.add( "dae", { name: "blackheart_v", type: "character", position: [-0.5, 0.5, 0] } );
	$r.scene.add( "dae", { name: "noire_v", type: "character", position: [1, 0.5, 0.5] } );
	$r.scene.add( "dae", { name: "noire_mk2", type: "character", position: [-1, 0.5, 0.5] } );
	
	$r.scene.add( "dae", { name: "purpleheart_v", type: "character", position: [1.5, 0.5, 0] } );
	$r.scene.add( "dae", { name: "purpleheart_mk2", type: "character", position: [-1.5, 0.5, 0] } );
	$r.scene.add( "dae", { name: "neptune_v", type: "character", position: [2, 0.5, 0.5] } );
	$r.scene.add( "dae", { name: "neptune_mk2", type: "character", position: [-2, 0.5, 0.5] } );
	
	$r.scene.add( "dae", { name: "blanc_mk2", type: "character", position: [1.5, 0.5, -1] } );
	$r.scene.add( "dae", { name: "whiteheart_mk2", type: "character", position: [0.5, 0.5, -1] } );
	$r.scene.add( "dae", { name: "uni_mk2", type: "character", position: [-1.5, 0.5, 1] } );
	$r.scene.add( "dae", { name: "blacksister_mk2", type: "character", position: [-0.5, 0.5, 1] } );
	
	$r.scene.add( "dae", { name: "nepgear_mk2", type: "character", position: [1.5, 0.5, 1] } );
	$r.scene.add( "dae", { name: "purplesister_mk2", type: "character", position: [0.5, 0.5, 1] } );
	$r.scene.add( "dae", { name: "vert_mk2", type: "character", position: [-1.5, 0.5, -1] } );
	$r.scene.add( "dae", { name: "greenheart_mk2", type: "character", position: [-0.5, 0.5, -1] } );
	
	$r.scene.add( "dae", { name: "5pb_mk2", type: "character", position: [0, 0.5, 1.5] } );*/
	//$r.scene.add( "dae", { name: "ultimecia", type: "character", position: [2, 0.5, 0] } );
	//$r.scene.add( "obj", { name: "purplesister_mk2", type: "character" } );
	//$r.scene.add( "dae", { name: "noire_v", type: "character", position: [2,0.5,0] } );
	//$r.scene.add( "dae", { name: "greenheart_mk2", type: "character", position: [2,0.5,0] } );
	//var p = new $r.$Primitive( "cube" );
	//$r.scene.add( p );
	$r.start();
}