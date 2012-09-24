__$r.prototype.$Terrain = function $Terrain( params ) {
	params = params || {};
	this.height = 0;
	this.width = 0;
	this.zero = "max"
	this.mesh = new rin.$Mesh( params );
	this.hmap = [];
	this.cmap = [];
	this.init( params.pack || "default", params.name || "default" );
}

__$r.prototype.$Terrain.prototype = {
	init: function( pack, name ) {
		var image = document.createElement("img"),
			terrain = this;
		image.onload = function(){ terrain.map( getHeightData( this ) ); };
		image.src = "inc/scenes/"+pack+"/terrain/"+name+"/map.png";
		this.mesh.textures["default"] = new rin.$Texture( "default", this.mesh );
		this.mesh.textures["default"].element.src = "inc/scenes/"+pack+"/terrain/"+name+"/texture.png"; },
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
			if( i < this.hmap.length - 1 ) this.cmap[i] = [];
			if( i < this.hmap.length - 1 ) for( var j in this.hmap[i] ) {
				if( j < this.hmap[i].length - 1 ) {
					this.cmap[i].push( ( this.hmap[i][j] / 2 ) + ( this.hmap[i][parseFloat(j)+1] / 2 ) +
									( this.hmap[parseFloat(i)+1][j] / 2 ) + ( this.hmap[parseFloat(i)+1][parseFloat(j)+1] / 2 ) / 4 );
					this.mesh.vertex( parseFloat(i) - hmid, this.hmap[i][j] / 2, parseFloat(j) - wmid )
							 .vertex( parseFloat(i) - hmid, this.hmap[i][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid )
							 .vertex( parseFloat(i) + 1 - hmid, this.hmap[parseFloat(i)+1][j] / 2, parseFloat(j) - wmid )
							 .vertex( parseFloat(i) + 1 - hmid, this.hmap[parseFloat(i)+1][parseFloat(j)+1] / 2, parseFloat(j) + 1 - wmid );
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
					this.mesh.normal( normal13[0], normal13[1], normal13[2] ).normal( normal13[0], normal13[1], normal13[2] )
							 .normal( normal23[0], normal23[1], normal23[2] ).normal( normal23[0], normal23[1], normal23[2] );
					this.mesh.texture( 0.2, 0.3 ).texture( 0.3, 0.4 ).texture( 0.4, 0.5 )
							 .texture( 0.5, 0.6 ).texture( 0.6, 0.7 ).texture( 0.7, 0.8 );
					this.mesh.face( current, current+1, current+2 ).face( current+1, current+2, current+3 );
					current += 4;
				}
			}
		}
		this.mesh.init();
	},
	render: function() { this.mesh.render(); },
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