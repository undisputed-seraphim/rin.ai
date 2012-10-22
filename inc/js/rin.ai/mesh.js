(function() {

/*
TODO:
	-ability to reset mesh arrays/buffers
	-change bbox values to be set and subtract / add when needed, instead of calculating seperate variables
	-change mesh so that bounding boxes are special and only get required variables
*/

__$r.prototype.$Mesh = function $Mesh( params ) {
	params =		params || {};
	this.type =		params.type || "object";
	this.mode =		params.mode !== undefined ? params.mode : gl.TRIANGLES;
	this.ba =		{ vba: {}, nba: {}, tba: {}, iba: {}, b: [], w: [], vba2: [] };
	this.bo =		{ vbo: {}, nbo: {}, tbo: {}, ibo: {}, b: "", w: "" };
	this.bbox =		params.bbox || { box: "", min: { x: "", y: "", z: "" }, max: { x: "", y: "", z: "" } };
	this.textures =	{};
	this.color =	params.color || [ 1.0, 0.0, 0.0 ];
	this.alpha =	params.alpha || 1;
	
	this.rotation =	params.rotation || [ 0.0, 0.0, 0.0 ];
	this.position = params.position || [ 0.0, 0.0, 0.0 ];
	this.translate =mat4.create();
	this.rotate =	mat4.create();
	this.matrix =	mat4.create();
	this.physics =	params.physics === false ? true : new rin.$Physics( this, params );
	
	this.min =		{ x: "", y: "", z: "" };
	this.max =		{ x: "", y: "", z: "" };
	this.faces =	{};
	this.index =	"";
	this.current =	"";
	this.material =	"";
	
	this.range =	params.range || 0;
	this.rate =		params.rate || 50;
	this.animated =	this.range == 0 ? false : true;
	this.amap =		this.animated ? params.amap || { "default": [ 1, this.range ] } : {};
	for( var i in this.amap ) { this.animation = params.animation || i; break; }
	this.interval =	"";
	
	this.textured =	false;
	this.normaled =	false;
	this.colored =	false;
	this.ready =	false;
}

__$r.prototype.$Mesh.prototype = {
	init: function() {
		this.ready = false;
		for( var i = this.animated ? 1 : 0; i <= this.range; i++ ) {
			this.bo.vbo[i] = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.vbo[i] );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.ba.vba[i] ), gl.STATIC_DRAW);
			if( this.normaled ) {
				this.bo.nbo[i] = gl.createBuffer();
				gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.nbo[i] );
				gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.ba.nba[i] ), gl.STATIC_DRAW ); }
			if( this.textured ) {
				this.bo.tbo[i] = gl.createBuffer();
				gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.tbo[i] );
				gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.ba.tba[i] ), gl.STATIC_DRAW); }
			for( var k in this.bo.ibo[i] ) {
				for( var j in this.bo.ibo[i][k] ) {
					this.bo.ibo[i][k][j] = gl.createBuffer();
					gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.bo.ibo[i][k][j] );
					gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.ba.iba[i][k][j] ), gl.STATIC_DRAW );
				}
			}
		}
		this.bo.b = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.b );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.ba.b ), gl.STATIC_DRAW );
		this.bo.w = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.w );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.ba.w ), gl.STATIC_DRAW );
		this.pos(); this.rot(); this.transform();
		this.colored = this.textured ? this.colored ? true : false : true;
		this.current = this.animated ? this.amap[ this.animation ][0] : 0;
		if( this.bbox !== true && this.physics !== true ) this.physics.init();
		this.ready = true;
	},
	alterVertex: function( offset, v ) {
		gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.vbo[0] );
		gl.bufferSubData( gl.ARRAY_BUFFER, offset * 4, v );
	},
	frame: function( index, f ) {
		if( f === false ) { this.index = index; this.current = ""; this.material = ""; return; }
		if( this.ba.vba[ index ] !== undefined && f !== true ) return this;
		this.index = index; this.current = ""; this.faces[ index ] = 0;
		this.ba.vba[ index ] = [];		this.ba.nba[ index ] = [];
		this.ba.tba[ index ] = [];		this.ba.iba[ index ] = {};
		this.bo.vbo[ index ] = [];		this.bo.nbo[ index ] = [];
		this.bo.tbo[ index ] = [];		this.bo.ibo[ index ] = {};
		return this;
	},
	node: function( current, f ) {
		if( f === false ) { this.current = current; return; }
		if( this.index === "" || this.current === current ||
			( this.ba.vba[ this.index ][ current ] !== undefined && f !== true ) ) return this;
		this.current = current;
		this.ba.iba[ this.index ][ current ] = {};		this.bo.ibo[ this.index ][ current ] = {};
		return this;
	},
	mat: function( material, f ) {
		if( f === false ) { this.material = material; return; }
		if( this.index === "" || this.material === material ||
			( this.ba.iba[ this.index ][ this.current ][ material ] !== undefined && f !== true ) ) return this;
		this.material = material;
		this.ba.iba[ this.index ][ this.current ][ material ] = [];
		this.bo.ibo[ this.index ][ this.current ][ material ] = "";
		return this;
	},
	check: function() {
		if( this.index !== "" && this.current !== "" && this.material !== "" ) return;
		else {
			if( this.index === "" ) this.frame( 0 );
			if( this.current === "" ) this.node( "default" );
			if( this.material === "" ) this.mat( "default" );
		}
	},
	updateMinMax: function( x, y, z ) {
		if( this.min.x === "" ) {
			this.min.x = x; this.max.x = x;
			this.min.y = y; this.max.y = y;
			this.min.z = z; this.max.z = z;
		} else {
			if( x < this.min.x ) this.min.x = x;
			if( x > this.max.x ) this.max.x = x;
			if( y < this.min.y ) this.min.y = y;
			if( y > this.max.y ) this.max.y = y;
			if( z < this.min.z ) this.min.z = z;
			if( z > this.max.z ) this.max.z = z;
		}
	},
	pos: function() { this.posTo( this.position ); },
	posTo: function( v ) {
		this.position = v || this.position;
		if( this.bbox !== true ) {
			this.bbox.min.x = this.min.x + this.position[0]; this.bbox.max.x = this.max.x + this.position[0];
			this.bbox.min.y = this.min.y + this.position[1]; this.bbox.max.y = this.max.y + this.position[1];
			this.bbox.min.z = this.min.z + this.position[2]; this.bbox.max.z = this.max.z + this.position[2]; }
		this.translate = mat4.translate( mat4.create(), [ this.position[0], this.position[1], this.position[2] ] ); },
	rot: function() { this.rotTo( this.rotation ); },
	rotTo: function( v ) {
		this.rotation = [ v[0] != this.rotation[0] ? v[0] * Math.PI / 180 : this.rotation[0],
						  v[1] != this.rotation[1] ? v[1] * Math.PI / 180 : this.rotation[1],
						  v[2] != this.rotation[2] ? v[2] * Math.PI / 180 : this.rotation[2] ];
		var rotateX = quat.create( [ 1.0, 0.0, 0.0 ], this.rotation[0] ),
			rotateY = quat.create( [ 0.0, 1.0, 0.0 ], this.rotation[1] ),
			rotateZ = quat.create( [ 0.0, 0.0, 1.0 ], this.rotation[2] );
		this.rotate = quat.mat4( quat.multiply( quat.multiply( rotateX, rotateY ), rotateZ ) ); },
	transform: function() {
		this.matrix = mat4.multiply( mat4.multiply( mvMatrix, this.rotate ), this.translate );
	},
	move: function( step, side, rise ) {
		this.position[0] += this.rotate[8] * step + ( this.rotate[0] * side ) + ( this.rotate[4] * rise );
		this.position[1] += this.rotate[9] * step + ( this.rotate[1] * side ) + ( this.rotate[5] * rise );
		this.position[2] += this.rotate[10] * step + ( this.rotate[2] * side ) + ( this.rotate[6] * rise );
		this.pos(); },
	prop: function( prop, val ) { if( val === undefined ) return this[prop]; this[prop] = val; },
	vertex: function( x, y, z ) {
		this.check();
		this.ba.vba[ this.index ].push( parseFloat(x), parseFloat(y), parseFloat(z) );
		this.updateMinMax( parseFloat(x), parseFloat(y), parseFloat(z) );
		return this;
	},
	normal: function( x, y, z ) {
		this.check(); this.normaled = true;
		this.ba.nba[ this.index ].push( parseFloat(x), parseFloat(y), parseFloat(z) );
		return this;
	},
	texture: function( u, v ) {
		this.check(); this.textured = true;
		this.ba.tba[ this.index ].push( parseFloat(u), parseFloat(v) );
		return this;
	},
	face: function( x, y, z ) {
		this.check(); this.faces[ this.index ]++;
		this.ba.iba[ this.index ][ this.current ][ this.material ].push( x, y, z );
		return this;
	},
	line: function( s, f ) {
		this.check();
		this.ba.iba[ this.index ][ this.current ][ this.material ].push( s, f );
		return this;
	},
	buffer: function() {
		if( this.animated ) {
			gl.uniform1i( gl.getUniformLocation( rin.program(), "uAnimated" ), true );
			gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.b );
			gl.vertexAttribPointer( rin.$program().pointers.bone, 4, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( rin.$program().pointers.bone );
			gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.w );
			gl.vertexAttribPointer( rin.$program().pointers.weight, 4, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( rin.$program().pointers.weight );
		}
		else gl.uniform1i( gl.getUniformLocation( rin.program(), "uAnimated" ), false );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.vbo[this.current] );
		gl.vertexAttribPointer( rin.$program().pointers.vertex, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( rin.$program().pointers.vertex );
		if( this.normaled ) {
			gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.nbo[this.current] );
			gl.vertexAttribPointer( rin.$program().pointers.normal, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( rin.$program().pointers.normal );
		} else gl.disableVertexAttribArray( rin.$program().pointers.normal );
		if( this.textured ) {
			gl.bindBuffer( gl.ARRAY_BUFFER, this.bo.tbo[this.current] );
			gl.vertexAttribPointer( rin.$program().pointers.texture, 2, gl.FLOAT, false, 0, 0 ); }
		if( this.colored ) {
			gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseColor" ), true );
			gl.uniform3f( gl.getUniformLocation( rin.program(), "uColor" ), this.color[0], this.color[1], this.color[2] );
			gl.uniform1f( gl.getUniformLocation( rin.program(), "uAlpha" ), this.alpha );
		} else gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseColor" ), false );
	},
	render: function() {
		if( this.ready ) {
			if( this.bbox !== true && this.physics !== true ) this.physics.update();
			this.buffer();
			var normalMatrix = mat4.inverse( this.matrix );
			normalMatrix = mat4.transpose( normalMatrix );
			var nUniform = gl.getUniformLocation( rin.program(), "uNMatrix" );
			gl.uniformMatrix4fv(nUniform, false, new Float32Array( mat4.flatten( normalMatrix ) ) );
			var temp = mat4.clone( mvMatrix );
			mvMatrix = mat4.multiply( mat4.multiply( mvMatrix, mat4.inverse( this.rotate ) ), this.translate );
			//mvMatrix = mat4.translate( mvMatrix, [ this.position[0], this.position[1], this.position[2] ] );
			//mvMatrix = this.matrix;
			setMatrixUniforms();
			for( var i in this.bo.ibo[ this.current ] ) {
				for( var j in this.bo.ibo[ this.current ][i] ) {
					j = j.trim();
					if( this.textures[j] !== undefined ) {
						if( this.textures[j].texture !== "" && this.textures[j].ready && this.textured ) {
							gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), true );
							gl.enableVertexAttribArray( rin.$program().pointers.texture );
							gl.activeTexture( gl.TEXTURE0 );
							gl.bindTexture( gl.TEXTURE_2D, this.textures[j].texture );
							gl.uniform1i( gl.getUniformLocation( rin.program(), "uSampler" ), 0 ); }
					} else {
						gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), false);
						gl.disableVertexAttribArray( rin.$program().pointers.texture );
					} if( this.textures[j] !== undefined ) {
						gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialAmbientColor" ),
							this.textures[j].Ka[0], this.textures[j].Ka[1], this.textures[j].Ka[2] );
						gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialSpecularColor" ),
							this.textures[j].Ks[0], this.textures[j].Ks[1], this.textures[j].Ks[2] );
						gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialDiffuseColor" ),
							this.textures[j].Kd[0], this.textures[j].Kd[1], this.textures[j].Kd[2] );
						gl.uniform1f( gl.getUniformLocation( rin.program(), "uMaterialShininess" ), 10 ); }
					gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.bo.ibo[ this.current ][i][j] );
					gl.drawElements( this.mode, this.ba.iba[ this.current ][i][j].length, gl.UNSIGNED_SHORT, 0 );
				}
			}
			mvMatrix = temp;
		}
	}
}

})();