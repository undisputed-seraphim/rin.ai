__$r.prototype.$OBJModel = function $OBJModel( id, name ) {
	this.id = id;
	this.name = name;
	this.textures = {};
	this.mesh = {};
	this.mtllib = "";
	this.ready = false;
	this.matrix = mat4.create();
	this.position = [ 0, 0, 0 ];
	this.rotation = [ 0, 0, 0 ];
	this.faces = 0;
	this.ajax = { obj: "", mtl: "" };
	this.b = { vertex: "", texture: "", normal: "" };
	this.v = { vertices: [], textures: [], normals: [] };
	this.load();
};

__$r.prototype.$OBJModel.prototype = {
	load: function() {
		this.ajax.obj = new XMLHttpRequest();
		this.ajax.obj.$id = this.id;
		this.ajax.obj.onreadystatechange = function() { if( this.readyState == 4 ) r.scene.models[this.$id].parse(); };
		this.ajax.obj.open( "get", "inc/models/"+this.name+"/"+this.name+".obj" );
		this.ajax.obj.send( null );
	},
	parse: function() {
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
			this.ajax.mtl.onreadystatechange = function() { if( this.readyState == 4 ) r.scene.models[this.$id].texture(); };
			this.ajax.mtl.open( "get", "inc/models/"+this.name+"/"+this.mtllib );
			this.ajax.mtl.send( null );
		}
		this.init();
	},
	texture: function() {
		var full = this.ajax.mtl.responseText.split("\n");
		var current = "";
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "newmtl":
					if( this.textures[current] !== undefined ) { if( this.textures[current].src === undefined ) {
						this.textures[current].src = ""; } }
					current = full[i].substring( full[i].indexOf(" ")+1 ).trim();
					if( current == "" ) current = "_"; this.textures[current] = new rin.$Texture( current, this ); break;
				case "map_Kd": this.textures[current].element.src = "inc/models/"+this.name+"/"+
						full[i].substring( full[i].indexOf(" ")+1 ).trim();	break;
				case "Ns": this.textures[current].Ns = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "Ka": this.textures[current].Ka = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Kd": this.textures[current].Kd = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Ks": this.textures[current].Ks = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Ni": this.textures[current].Ni = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "d": this.textures[current].d = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "illum": this.textures[current].illum = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			}
		}
	},
	init: function() {
		this.b.normal = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.b.normal );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.normals ), gl.STATIC_DRAW);
		this.b.vertex = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.b.vertex );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.vertices ), gl.STATIC_DRAW );
		this.b.texture = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.b.texture );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.textures ), gl.STATIC_DRAW);
		for( var i in this.mesh ) {
			for( var j in this.mesh[i] ) {
				this.mesh[i][j].b = gl.createBuffer();
				gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
				gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.mesh[i][j].i ), gl.STATIC_DRAW );
			}
		}
		this.ready = true;
	},
	buffer: function() {
		gl.bindBuffer( gl.ARRAY_BUFFER, this.b.normal );
		gl.vertexAttribPointer( rin.$program().pointers.normal, 3, gl.FLOAT, false, 0, 0 );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.b.vertex );
		gl.vertexAttribPointer( rin.$program().pointers.vertex, 3, gl.FLOAT, false, 0, 0 );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.b.texture );
		gl.vertexAttribPointer( rin.$program().pointers.texture, 2, gl.FLOAT, false, 0, 0 );
	},
	render: function() {
		if( this.ready ) {
			this.buffer();
			var normalMatrix = mat4.inverse( this.matrix );
			normalMatrix = mat4.transpose( normalMatrix );
			var nUniform = gl.getUniformLocation( rin.program(), "uNMatrix" );
			gl.uniformMatrix4fv(nUniform, false, new Float32Array( mat4.flatten( normalMatrix ) ) );
			mvMatrix = mat4.translate( mvMatrix, [ this.position[0], this.position[1], this.position[2] ] );
			setMatrixUniforms();
			for( var i in this.mesh ) {
				for( var j in this.mesh[i] ) {
					if( this.textures[j] !== undefined ) if( this.textures[j].texture != "" && this.textures[j].ready ) {
						gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), true );
						gl.enableVertexAttribArray( rin.$program().pointers.texture );
						gl.activeTexture( gl.TEXTURE0 );
						gl.bindTexture( gl.TEXTURE_2D, this.textures[j].texture );
						gl.uniform1i( gl.getUniformLocation( rin.program(), "uSampler" ), 0 );
					} else {
						gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), false);
						gl.disableVertexAttribArray( rin.$program().pointers.texture );
					} if( this.textures[j] !== undefined ) {
						if( this.textures[j].Ka !== undefined ) gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialAmbientColor" ),
							this.textures[j].Ka[0], this.textures[j].Ka[1], this.textures[j].Ka[2] );
						if( this.textures[j].Ks !== undefined ) gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialSpecularColor" ),
							this.textures[j].Ks[0], this.textures[j].Ks[1], this.textures[j].Ks[2] );
						if( this.textures[j].Kd !== undefined ) gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialDiffuseColor" ),
							this.textures[j].Kd[0], this.textures[j].Kd[1], this.textures[j].Kd[2] );
						if( this.textures[j].Ns !== undefined ) gl.uniform1f( gl.getUniformLocation( rin.program(), "uMaterialShininess" ),
							10 );
					}
					gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
					gl.drawElements( gl.TRIANGLES, this.mesh[i][j].i.length, gl.UNSIGNED_SHORT, 0 );
				}
			}
		}
	}
};