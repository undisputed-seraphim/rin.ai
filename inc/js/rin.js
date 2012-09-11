(function(){
var gl, rin;

(function(){

function $rin() {
	rin = this;
	this._shaders = { vertex: [], fragment: [] };
	this._state = { shaders: { vertex: 0, fragment: 0 } };
	this._models = [];
	this._ident = {};
}
$rin.prototype.init = function( id ) {
	this.gl = gl = document.getElementById( id ).getContext( 'webgl-experimental' );
	this.shader.init();
	return this;
}

/* shaders */
$rin.prototype.shader = {
	init: function() {
		rin.shader.add( "vertex" );
		rin.shader.add( "fragment" );
		rin.shader.set( "vertex", rin._shaders["vertex"][0] );
		rin.shader.set( "fragment", rin._shaders["fragment"][0] );
	},
	add: function( type, code ) {
		rin._shaders[type].push( new rin.$Shader( rin._shaders[type].length, type, code ) );
	},
	get: function() { },
	set: function( type, shader ) { rin._state.shaders[type] = shader.id; }
}

$rin.prototype.$Shader = function $Shader( id, type, code ) {
	this.id = id;
	this.type = type;
}

/* models */
$rin.prototype.model = $rin.prototype.m = {
	add: function( type, name ) {
		switch( type.toLowerCase() ) {
			case "obj":
				var length = rin._models.length;
				rin._models.push( new rin.$OBJModel( length, name ) );
				rin._ident[name] = length;
				return rin._models[length]; break;
		} },
	get: function( m ) { return m === undefined ? rin._models : rin._models[ rin._ident[m] ]; }
}

$rin.prototype.$OBJModel = function $OBJModel( id, name ) {
	this.id = id;
	this.name = name;
	this.materials = {};
	this.mesh = {};
	this.mtllib = "";
	this.ready = false;
	this.faces = 0;
	this.ajax = { obj: "", mtl: "" };
	this.v = { vertices: [], textures: [], normals: [] };
	this.load();
	return this;
}
$rin.prototype.$OBJModel.prototype.load = function() {
	this.ajax.obj = new XMLHttpRequest();
	this.ajax.obj.$id = this.id;
	this.ajax.obj.onreadystatechange = function() { if( this.readyState == 4 ) rin._models[this.$id].parse(); };
	this.ajax.obj.open( "get", "inc/models/"+this.name+"/"+this.name+".obj" );
	this.ajax.obj.send( null );
}
$rin.prototype.$OBJModel.prototype.parse = function() {
	var full = this.ajax.obj.responseText.split("\n");
	var $v = []; var $t = []; var $n = []; var $f = {}; var $o = ""; var $m = ""; var $i = 0; var $mod = { v: [] }; var dup = false;
	for( var i in full ) {
		var line = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
		switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
			case "o": $o = full[i].substring( full[i].indexOf(" ")+1 ); $f[$o] = {}; break;
			case "mtllib": this.mtllib = full[i].substring( full[i].indexOf(" ")+1 ); break;
			case "usemtl": $m = full[i].substring( full[i].indexOf(" ")+1 ); $f[$o][$m] = []; break;
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
	$v = null; $t = null; $n = null;
	var c = 0;
	for( var i in $f ) {
		this.mesh[i] = {};
		for( var k in $f[i] ) {
			this.mesh[i][k] = { i: [], b: "", t: "" };
			for( var l in $f[i][k] ) {
				for( var j = 0; j < 3; j++ ) {
					this.mesh[i][k].i.push( c+j );
					this.v.vertices.push( $f[i][k][l].v[j][0], $f[i][k][l].v[j][1], $f[i][k][l].v[j][2] );
					this.v.normals.push( $f[i][k][l].n[j][0], $f[i][k][l].n[j][1], $f[i][k][l].n[j][2] );
					$f[i][k][l].t[j] === undefined ? this.v.textures.push( 0, 0 ) : this.v.textures.push( $f[i][k][l].t[j][0], $f[i][k][l].t[j][1] );
				}
				c += 3; this.faces++;
			}
		}
	}
	$f = null;
	if( this.mtllib != "" ) {
		this.ajax.mtl = new XMLHttpRequest();
		this.ajax.mtl.$id = this.id;
		this.ajax.mtl.onreadystatechange = function() { if( this.readyState == 4 ) rin._models[this.$id].texture(); };
		this.ajax.mtl.open( "get", "inc/models/"+this.name+"/"+this.mtllib );
		this.ajax.mtl.send( null );
	}
	this.ready = true;
}
$rin.prototype.$OBJModel.prototype.texture = function() {
	var full = this.ajax.mtl.responseText.split("\n");
	var current = "";
	for( var i in full ) {
		switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
			case "newmtl": current = full[i].substring( full[i].indexOf(" ")+1 ).trim();
				if( current == "" ) current = "_"; this.materials[current] = new rin.$Texture( current ); break;
			case "map_Kd": this.materials[current].element.src = "inc/models/"+this.name+"/"+
					full[i].substring( full[i].indexOf(" ")+1 ).trim();	break;
			case "Ns": this.materials[current].Ns = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			case "Ka": this.materials[current].Ka = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
			case "Kd": this.materials[current].Kd = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
			case "Ks": this.materials[current].Ks = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
			case "Ni": this.materials[current].Ni = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			case "d": this.materials[current].d = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			case "illum": this.materials[current].illum = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
		}
	}
}
$rin.prototype.$OBJModel.prototype.buffer = function() {
}

/* texture */

$rin.prototype.$Texture = function $Texture( name ) {
	this.name = name;
	this.element = document.createElement("img");
	this.element.onload = this.load;
	this.ready = false;
	this.Ka = ""; /* ambient color */
	this.Kd = ""; /* diffuse color */
	this.map_Kd = "";
	this.Ks = ""; /* specular color */
	this.Ns = ""; /* specular coefficient */
	this.Ni = "";
	this.d = ""; /* alpha */
	this.illum = "";
}

$rin.prototype.$Texture.prototype.load = function() {
	console.log("here");
}

window.$r = window.r = window.rin = new $rin();
})();

/* utility functions */
function vector( x, y, z ) {
	this.x = x; this.y = y; this.z = z;
}
vector.prototype.inArray = function( array ) {
	for( var i in array )
		if( this.x == array[i][0] && this.y == array[i][1] && this.z == array[i][2] ) return true;
	return false;
}

})();