(function(){
var gl, rin;

(function(){

function $rin() {
	this._models = [];
	this._ident = {};
	rin = this;
}
$rin.prototype.init = function( id ) { gl = document.getElementById( id ).getContext( 'webgl-experimental' ); return this; }
$rin.prototype.model = $rin.prototype.m = {
	add: function( type, name ) {
		switch( type.toLowerCase() ) {
			case "obj":
				var length = rin._models.length;
				rin._models.push( new rin.$OBJModel( length, name ) );
				rin._ident[name] = length;
				return rin._models[length]; break;
		} } }
$rin.prototype.models = function models( m ) { return m === undefined ? this._models : this._models[this._ident[m]]; }

/* OBJModel */
$rin.prototype.$OBJModel = function $OBJModel( id, name ) {
	this.id = id;
	this.name = name;
	this.mesh = {};
	this.ready = false;
	this.ajax = "";
	this.v = { vertices: [], textures: [], normals: [] };
	this.load();
}
$rin.prototype.$OBJModel.prototype.load = function() {
	this.ajax = new XMLHttpRequest();
	this.ajax.$id = this.id;
	this.ajax.onreadystatechange = function() { if( this.readyState == 4 ) rin._models[this.$id].parse(); };
	this.ajax.open( "get", "inc/models/"+this.name+"/"+this.name+".obj" );
	this.ajax.send( null );
}
$rin.prototype.$OBJModel.prototype.parse = function() {
	var full = this.ajax.responseText.split("\n");
	var $v = []; var $t = []; var $n = []; var $f = {}; var $o = ""; var $m = "";
	for( var i in full ) {
		var line = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
		switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
			case "o": $o = full[i].substring( full[i].indexOf(" ")+1 ); $f[$o] = {}; break;
			case "usemtl": $m = full[i].substring( full[i].indexOf(" ")+1 ); $f[$o][$m] = []; break;
			case "v": $v.push( [ line[0], line[1], line[2] ] ); break;
			case "vt": $t.push( [ line[0], line[1] ] ); break;
			case "vn": $n.push( [ line[0], line[1], line[2] ] ); break;
			case "f":
				var $0 = line[0].split("/"); var $1 = line[1].split("/"); var $2 = line[2].split("/");
				if( $0.length > 2 ) {
					$f[$o][$m].push( { v: [ $v[ parseInt($0[0])-1 ], $v[ parseInt($1[0])-1 ], $v[ parseInt($2[0])-1 ] ],
							t: [ $t[ parseInt($0[1])-1 ], $t[ parseInt($1[1])-1 ], $t[ parseInt($2[1])-1 ] ],
							n: [ $n[ parseInt($0[2])-1 ], $n[ parseInt($1[2])-1 ], $n[ parseInt($2[2])-1 ] ] } );
				}
				break;
		}
	}
	$v = null; $t = null; $n = null;
	var c = 0;
	console.log( $f );
	for( var i in $f ) {
		this.mesh[i] = {};
		for( var k in $f[i] ) {
			this.mesh[i][k] = { i: [], b: "", mat: "" };
			for( var l in $f[i][k] ) {
				for( var j = 0; j < 3; j++ ) {
					this.mesh[i][k].i.push( c, c+1, c+2);
					this.v.vertices.push( $f[i][k][l].v[j][0], $f[i][k][l].v[j][1], $f[i][k][l].v[j][2] );
					this.v.normals.push( $f[i][k][l].n[j][0], $f[i][k][l].n[j][1], $f[i][k][l].n[j][2] );
					$f[i][k][l].t[j] === undefined ? this.v.textures.push( 0, 0 ) : this.v.textures.push( $f[i][k][l].t[j][0], $f[i][k][l].t[j][1] );
				}
				c += 3;
			}
		}
	}
	//for( var i = 0; i < $v.length; i++ ) { $i.push( i ); }
	console.log( this, $v, $n, $t );
}

window.$r = window.r = window.rin = new $rin();
})();

})();