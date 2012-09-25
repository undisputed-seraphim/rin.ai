__$r.prototype.$OBJModel = function $OBJModel( id, params ) {
	params =			params || {};
	this.type =			params.type || "object";
	this.id =			id;
	this.name =			params.name || "noname";
	
	this.range =		params.range || 0;
	params.range =		this.range;
	this.animated =		this.range == 0 ? false : true;
	this.mesh =			new rin.$Mesh( params );
	
	this.mtllib =		"";
	this.current =		0;
	this.ajax =			{ obj: "", mtl: "" };
	this.load();
};

__$r.prototype.$OBJModel.prototype = {
	load: function() {
		if( this.animated ) { this.current++; this.mesh.prop( "animated", true ); }
		this.ajax.obj = new XMLHttpRequest();
		this.ajax.obj.$id = this.id;
		this.ajax.obj.onreadystatechange = function() { if( this.readyState == 4 ) r.scene.models[this.$id].parse(); };
		var modifier = this.animated ? "_"+("000000" + this.current).slice(-6) : "";
		this.ajax.obj.open( "get", "inc/models/"+this.name+"/"+this.name+""+modifier+".obj" );
		this.ajax.obj.send( null );
	},
	parse: function() {
		var full = this.ajax.obj.responseText.split("\n");
		var $v = [], $t = [], $n = [], $f = {}, $o = "", $m = "", $i = 0, dup = false;
		var zmin = 0, zmax = 0, xmin = 0, xmax = 0, ymin = 0, ymax = 0;
		for( var i in full ) {
			var line = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "o": $o = full[i].substring( full[i].indexOf(" ")+1 ); if( $o == "" ) $o = "_"; $f[$o] = {}; break;
				case "mtllib": this.mtllib = full[i].substring( full[i].indexOf(" ")+1 ); break;
				case "usemtl": $m = full[i].substring( full[i].indexOf(" ")+1 ).trim(); $f[$o][$m] = []; break;
				case "v":  $v.push( [ line[0], line[1], line[2] ] ); break;
				case "vt": $t.push( [ line[0], line[1] ] ); break;
				case "vn": $n.push( [ line[0], line[1], line[2] ] ); break;
				case "f":
					var $0 = line[0].split("/"); var $1 = line[1].split("/"); var $2 = line[2].split("/");
					if( $0.length > 2 ) {
						$f[$o][$m].push( {
								v: [ $v[ parseInt($0[0])-1 ], $v[ parseInt($1[0])-1 ], $v[ parseInt($2[0])-1 ] ],
								t: [ $t[ parseInt($0[1])-1 ], $t[ parseInt($1[1])-1 ], $t[ parseInt($2[1])-1 ] ],
								n: [ $n[ parseInt($0[2])-1 ], $n[ parseInt($1[2])-1 ], $n[ parseInt($2[2])-1 ] ] } );
					}
					break;
			}
		}
		$v = null; $t = null; $n = null; $o = null; $m = null;
		var c = 0;
		this.mesh.frame( this.current );
		for( var i in $f ) {
			this.mesh.node( i );
			for( var k in $f[i] ) {
				this.mesh.mat( k );
				for( var l in $f[i][k] ) {
					for( var j = 0; j < 3; j++ ) {
						this.mesh.vertex( $f[i][k][l].v[j][0], $f[i][k][l].v[j][1], $f[i][k][l].v[j][2] );
						$f[i][k][l].t[j] === undefined ? this.mesh.texture( 0, 0 ) :
							this.mesh.texture( $f[i][k][l].t[j][0], $f[i][k][l].t[j][1] );
						this.mesh.normal( $f[i][k][l].n[j][0], $f[i][k][l].n[j][1], $f[i][k][l].n[j][2] );
					}
					this.mesh.face( c, c+1, c+2 );
					c += 3;
				}
			}
		}
		$f = null;
		if( this.mtllib != "" ) {
			this.ajax.mtl = new XMLHttpRequest();
			this.ajax.mtl.$id = this.id;
			this.ajax.mtl.onreadystatechange = function() { if( this.readyState == 4 ) r.scene.models[this.$id].texture(); };
			this.ajax.mtl.open( "get", "inc/models/"+this.name+"/"+this.mtllib );
			this.ajax.mtl.send( null );
		}
		if( this.current != this.range ) {
			this.load();
		} else { this.mesh.init(); }
	},
	texture: function() {
		var full = this.ajax.mtl.responseText.split("\n");
		var current = "", skip = false;
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "newmtl":
					/*if( this.textures[current] !== undefined ) {
						if( this.textures[current].src === undefined ) {
							this.textures[current].src = ""; } }*/
					current = full[i].substring( full[i].indexOf(" ")+1 ).trim();
					if( current === "" ) current = "_";
					if( this.mesh.textures[current] === undefined ) {
						skip = false;
						this.mesh.textures[current] = new rin.$Texture( current, this.mesh );
					} else skip = true;
					break;
				case "map_Kd": if( skip ) break; this.mesh.textures[current].element.src = "inc/models/"+this.name+"/"+
						full[i].substring( full[i].indexOf(" ")+1 ).trim();	break;
				case "Ns": if( skip ) break; this.mesh.textures[current].Ns = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "Ka": if( skip ) break; this.mesh.textures[current].Ka = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Kd": if( skip ) break; this.mesh.textures[current].Kd = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Ks": if( skip ) break; this.mesh.textures[current].Ks = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Ni": if( skip ) break; this.mesh.textures[current].Ni = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "d": if( skip ) break; this.mesh.textures[current].d = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "illum": if( skip ) break; this.mesh.textures[current].illum = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			}
		}
	},
	render: function() { this.mesh.render(); }
};