__$r.prototype.model = __$r.prototype.m = {
	add: function( type, name ) {
		switch( type.toLowerCase() ) {
			case "obj":
				var length = rin._models.length;
				rin._models.push( new rin.$OBJModel( length, name ) );
				rin._ident[name] = length;
				return rin._models[length]; break;
		} },
	get: function( m ) { return m === undefined ? rin._models : typeof m != "string" ? rin._models[m] : rin._models[ rin._ident[m] ]; }
};

__$r.prototype.$OBJModel = function $OBJModel( id, name ) {
	this.id = id;
	this.name = name;
	this.materials = {};
	this.mesh = {};
	this.mtllib = "";
	this.ready = false;
	this.faces = 0;
	this.ajax = { obj: "", mtl: "" };
	this.b = { vertex: "", texture: "", normal: "" };
	this.v = { vertices: [], textures: [], normals: [] };
	this.load();
	return this;
};
__$r.prototype.$OBJModel.prototype.load = function() {
	this.ajax.obj = new XMLHttpRequest();
	this.ajax.obj.$id = this.id;
	this.ajax.obj.onreadystatechange = function() { if( this.readyState == 4 ) rin._models[this.$id].parse(); };
	this.ajax.obj.open( "get", "inc/models/"+this.name+"/"+this.name+".obj" );
	this.ajax.obj.send( null );
};
$rin.prototype.$OBJModel.prototype.parse = function() {
	var full = this.ajax.obj.responseText.split("\n");
	var $v = []; var $t = []; var $n = []; var $f = {}; var $o = ""; var $m = ""; var $i = 0; var $mod = { v: [] }; var dup = false;
	for( var i in full ) {
		var line = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
		switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
			case "o": $o = full[i].substring( full[i].indexOf(" ")+1 ); if( $o == "" ) $o = "_"; $f[$o] = {}; break;
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
			this.mesh[i][k] = { i: [], b: "" };
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
	this.buffer();
};
$rin.prototype.$OBJModel.prototype.texture = function() {
	var full = this.ajax.mtl.responseText.split("\n");
	var current = ""; rin.q.current = 0;
	for( var i in full ) {
		switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
			case "newmtl":
				if( this.materials[current] !== undefined ) { if( this.materials[current].src === undefined ) {
					this.materials[current].src = ""; } }
				current = full[i].substring( full[i].indexOf(" ")+1 ).trim();
				if( current == "" ) current = "_"; this.materials[current] = new rin.$Texture( current, this.id ); break;
			case "map_Kd": rin.q.current++; this.materials[current].src = "inc/models/"+this.name+"/"+
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
	var c = 0;
	for( var i in this.materials ) {
		if( this.materials[i].src != "" ) {
			this.materials[i].element.current = c;
			this.materials[i].element.src = this.materials[i].src;
			c++;
		}
	}
};
$rin.prototype.$OBJModel.prototype.buffer = function() {
	this.b.normal = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.b.normal );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.normals ), gl.STATIC_DRAW);
    gl.vertexAttribPointer( rin.v.normal, 3, gl.FLOAT, false, 0, 0 );
	this.b.vertex = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.b.vertex );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.vertices ), gl.STATIC_DRAW );
	gl.vertexAttribPointer( rin.v.vertex, 3, gl.FLOAT, false, 0, 0 );
	this.b.texture = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.b.texture );
    gl.vertexAttribPointer( rin.v.texture, 2, gl.FLOAT, false, 0, 0 );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.textures ), gl.STATIC_DRAW);
	for( var i in this.mesh ) {
		for( var j in this.mesh[i] ) {
			this.mesh[i][j].b = gl.createBuffer();
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.mesh[i][j].i ), gl.STATIC_DRAW );
		}
	}
	this.ready = true;
};
$rin.prototype.$OBJModel.prototype.render = function() {
	var normalMatrix = mvMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	var nUniform = gl.getUniformLocation( rin._program, "uNMatrix" );
	gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
	if( this.ready ) {
		for( var i in this.mesh ) {
			for( var j in this.mesh[i] ) {
				if( this.materials[j] !== undefined ) if( this.materials[j].src != "" && this.materials[j].ready ) {
					gl.uniform1i( gl.getUniformLocation( rin._program, "uUseTextures" ), true );
					gl.enableVertexAttribArray( rin.v.texture );
					gl.activeTexture( gl.TEXTURE0 );
					gl.bindTexture( gl.TEXTURE_2D, this.materials[j].texture );
					gl.uniform1i( gl.getUniformLocation( rin._program, "uSampler" ), 0 );
				} else {
					gl.uniform1i( gl.getUniformLocation( rin._program, "uUseTextures" ), false);
					gl.disableVertexAttribArray( rin.v.texture );
				} if( this.materials[j] !== undefined ) {
					if( this.materials[j].Ka !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialAmbientColor" ),
						this.materials[j].Ka[0], this.materials[j].Ka[1], this.materials[j].Ka[2] );
					if( this.materials[j].Ks !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialSpecularColor" ),
						this.materials[j].Ks[0], this.materials[j].Ks[1], this.materials[j].Ks[2] );
					if( this.materials[j].Kd !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialDiffuseColor" ),
						this.materials[j].Kd[0], this.materials[j].Kd[1], this.materials[j].Kd[2] );
					if( this.materials[j].Ns !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialShininess" ),
						this.materials[j].Ns[0], this.materials[j].Ns[1], this.materials[j].Ns[2] );
				}
				gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
				setMatrixUniforms();
				gl.drawElements( gl.TRIANGLES, this.mesh[i][j].i.length, gl.UNSIGNED_SHORT, 0 );
			}
		}
	}
};