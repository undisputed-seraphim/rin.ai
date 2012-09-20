__$r.prototype.$Terrain = function $Terrain( params ) {
	params = params || {};
	this.height = 0;
	this.width = 0;
	this.zero = "highest"
	this.hmap = [];
	
	this.vba = [];
	this.nba = [];
	this.iba = [];
	this.vbo = "";
	this.nbo = "";
	this.ibo = "";
	
	this.ready = false;
	this.init( params.pack || "default", params.img || "default.png" );
}

__$r.prototype.$Terrain.prototype = {
	init: function( pack, name ) {
		var image = document.createElement("img"),
			terrain = this;
		image.onload = function(){ terrain.map( getHeightData( this ) ); };
		image.src = "inc/scenes/"+pack+"/terrain/"+name; },
	map: function( params ) {
		this.width = params.width;
		this.height = params.height;
		var current = 0;
		for( var i = 0; i < this.height; i++ ) {
			this.hmap[i] = [];
			for( var j = 0; j < this.width; j++ ) {
				this.hmap[i].push( params.data[ current++ ] == 765 ? 1 : 0 );
			}
		} this.build(); },
	check: function( x, y ) {
	},
	build: function() {
		var current = 0,
			wmid = ( this.width - 1 ) / 2,
			hmid = ( this.height - 1 ) / 2;
		for( var i in this.hmap ) {
			if( i < this.hmap.length - 1 ) for( var j in this.hmap[i] ) {
				if( j < this.hmap[i].length - 1 ) {
					this.vba.push( parseFloat(i) - hmid, this.hmap[i][j] / 2, parseFloat(j) - wmid,
								   parseFloat(i) - hmid, this.hmap[i][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid,
								   parseFloat(i) + 1 - hmid, this.hmap[parseFloat(i)+1][j] / 2, parseFloat(j) - wmid,
								   parseFloat(i) + 1 - hmid, this.hmap[parseFloat(i)+1][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid );
					var normal1 = vec3.normalize( vec3.cross(
							vec3.subtract( vec3.create( parseFloat(i) - hmid, this.hmap[i][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid ),
										   vec3.create( parseFloat(i) - hmid, this.hmap[i][j] / 2, parseFloat(j) - wmid ) ),
							vec3.subtract( vec3.create( parseFloat(i) + 1 - hmid, this.hmap[parseFloat(i)+1][j] / 2, parseFloat(j) - wmid ),
										   vec3.create( parseFloat(i) - hmid, this.hmap[i][j] / 2, parseFloat(j) - wmid ) ) ) ),
						normal2 = vec3.normalize( vec3.cross(
							vec3.subtract( vec3.create( parseFloat(i) + 1 - hmid, this.hmap[parseFloat(i)+1][j] / 2, parseFloat(j) - wmid ),
										   vec3.create( parseFloat(i) - hmid, this.hmap[i][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid ) ),
							vec3.subtract( vec3.create( parseFloat(i) + 1 - hmid, this.hmap[parseFloat(i)+1][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid ),
										   vec3.create( parseFloat(i) - hmid, this.hmap[i][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid ) ) ) ),
						normal3 = vec3.normalize( vec3.add( normal1, normal2 ) );
						normal13 = vec3.normalize( vec3.add( normal1, normal3 ) );
						normal23 = vec3.normalize( vec3.add( normal2, normal3 ) );
					this.nba.push( normal13[0], normal13[1], normal13[2],
								   normal13[0], normal13[1], normal13[2],
								   normal23[0], normal23[1], normal23[2],
								   normal23[0], normal23[1], normal23[2] );
					this.iba.push( current, current+1, current+2, current+1, current+2, current+3 );
					current += 4;
				}
			}
		}
		console.log( this.nba );
		this.vbo = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vbo );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.vba ), gl.STATIC_DRAW );
		this.nbo = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.nbo );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.nba ), gl.STATIC_DRAW );
		this.ibo = gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.ibo );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.iba ), gl.STATIC_DRAW );
		this.ready = true;
	},
	buffer: function() {
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vbo );
		gl.vertexAttribPointer( rin.$program().pointers.vertex, 3, gl.FLOAT, false, 0, 0 );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.nbo );
		gl.vertexAttribPointer( rin.$program().pointers.normal, 3, gl.FLOAT, false, 0, 0 );
		//gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), false);
		gl.disableVertexAttribArray( rin.$program().pointers.texture );
	},
	render: function() {
		if( this.ready ) {
			this.buffer();
			//gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialAmbientColor" ), 1.6, 1.6, 1.6 );
			//gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialDiffuseColor" ), 0.5, 0.5, 0.5 );
			//gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialSpecularColor" ), 0.5, 0.5, 0.5 );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.ibo );
			gl.drawElements( gl.TRIANGLES, this.iba.length, gl.UNSIGNED_SHORT, 0 );
			//gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseColor" ), false );
		}
	},
}

function getHeightData( img ) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext( '2d' );
    var size = img.width * img.height, data = new Float32Array( size );
    context.drawImage(img,0,0);
    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }
    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;
    var j=0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all;
    }
    canvas = null;
    return { "data": data, "width": img.width, "height": img.height };
}