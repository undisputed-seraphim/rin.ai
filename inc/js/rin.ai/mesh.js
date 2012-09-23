(function() {

__$r.prototype.$Mesh = function $Mesh( params ) {
	params =		params || {};
	this.type =		params.type || gl.TRIANGLES;
	this.ba =		{ vba: {}, nba: {}, tba: {}, iba: {} };
	this.bo =		{ vbo: {}, nbo: {}, tbo: {}, ibo: {} };
	this.faces =	0;
	this.bbox =		params.bbox || {};
	this.textures =	{};
	this.color =	params.color || [ 1.0, 0.0, 0.0 ];
	this.alpha =	params.alpha || 1;
	
	this.rotation =	[ 0.0, 0.0, 0.0 ];
	this.position = [ 0.0, 0.0, 0.0 ];
	this.translate =mat4.create();
	this.rotate =	mat4.create();
	this.matrix =	mat4.create();
	
	this.min =		{};
	this.max =		{};
	this.index =	"";
	this.current =	"";
	this.material =	"";
	
	this.animation ="default";
	this.range =	params.range || 0;
	this.rate =		params.rate || 50;
	this.animated =	this.range == 0 ? false : true;
	this.amap =		this.animated ? params.amap || { "default": [ 1, this.range ] } : {};
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
			if( this.bbox !== true ) this.bbox[i] = new rin.$Primitive( "cube",
				{ xmin: this.min[i].x, ymin: this.min[i].y, zmin: this.min[i].z,
				  xmax: this.max[i].x, ymax: this.max[i].y, zmax: this.max[i].z,
				  bbox: true, method: "wire" } );
		}
		this.colored = this.textured ? this.colored ? true : false : true;
		this.current = this.animated ? 1 : 0;
		this.ready = true;
	},
	frame: function( index, f ) {
		if( f === false ) { this.index = index; this.current = ""; this.material = ""; return; }
		if( this.ba.vba[ index ] !== undefined && f !== true ) return this;
		this.index = index; this.current = ""; this.faces[ index ] = 0;
		this.ba.vba[ index ] = [];		this.ba.nba[ index ] = [];
		this.ba.tba[ index ] = [];		this.ba.iba[ index ] = {};
		this.bo.vbo[ index ] = [];		this.bo.nbo[ index ] = [];
		this.bo.tbo[ index ] = [];		this.bo.ibo[ index ] = {};
		this.min[ index ] = { x: "", y: "", z: "" };
		this.max[ index ] = { x: "", y: "", z: "" };
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
		if( this.index !== "" && this.current !== "" ) return;
		else {
			if( this.index === "" ) this.frame( 0 );
			if( this.current === "" ) this.node( "noname" );
		}
	},
	updateMinMax: function( x, y, z ) {
		if( this.min[ this.index ].x === "" ) {
			this.min[ this.index ].x = x; this.max[ this.index ].x = x;
			this.min[ this.index ].y = y; this.max[ this.index ].y = y;
			this.min[ this.index ].z = z; this.max[ this.index ].z = z;
		} else {
			if( x < this.min[ this.index ].x ) this.min[ this.index ].x = x;
			if( x > this.max[ this.index ].x ) this.max[ this.index ].x = x;
			if( y < this.min[ this.index ].y ) this.min[ this.index ].y = y;
			if( y > this.max[ this.index ].y ) this.max[ this.index ].y = y;
			if( z < this.min[ this.index ].z ) this.min[ this.index ].z = z;
			if( z > this.max[ this.index ].z ) this.max[ this.index ].z = z;
		}
	},
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
	start: function() { var mesh = this; this.interval = setInterval( function() { mesh.next(); }, this.rate ); },
	stop: function() { clearInterval( this.interval ); this.interval = ""; },
	next: function() { this.current == this.amap[ this.animation ][1] ? this.current = this.amap[ this.animation ][0] : this.current++; },
	buffer: function() {
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
			if( Settings.flags.showBoundingBox && this.bbox !== true ) this.bbox[ this.current ].render();
			this.buffer();
			if( this.interval === "" && this.animated ) { this.start(); }
			var normalMatrix = mat4.inverse( this.matrix );
			normalMatrix = mat4.transpose( normalMatrix );
			var nUniform = gl.getUniformLocation( rin.program(), "uNMatrix" );
			gl.uniformMatrix4fv(nUniform, false, new Float32Array( mat4.flatten( normalMatrix ) ) );
			var temp = mat4.clone( mvMatrix );
			mvMatrix = mat4.translate( mvMatrix, [ this.position[0], this.position[1], this.position[2] ] );
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
					gl.drawElements( this.type, this.ba.iba[ this.current ][i][j].length, gl.UNSIGNED_SHORT, 0 );
				}
			}
			mvMatrix = temp;
		}
	}
}

})();