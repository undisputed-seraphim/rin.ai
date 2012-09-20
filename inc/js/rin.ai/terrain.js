__$r.prototype.$Terrain = function $Terrain( params ) {
	params = params || {};
	this.init( "default", "default.png" );
}

__$r.prototype.$Terrain.prototype = {
	init: function( pack, name ) {
		var image = document.createElement("img"),
			terrain = this;
		image.onload = function(){ terrain.map( getHeightData( this ) ); };
		image.src = "inc/scenes/"+pack+"/terrain/"+name;
	},
	map: function( params ) {
		this.width = params.width;
		this.height = params.height;
		console.log( params );
	}
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