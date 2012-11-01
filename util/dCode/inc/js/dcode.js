body.onload = function() {
	console.log( "here" );
	dC.load("test.pssg");
}

var size = {
	"char":		1,
	"short":	2,
	"int":		4,
	"float":	4,
	"double":	8
}

function dCode() {
	this.data = "";
}

dCode.prototype = {
	
	/* load a file from string path */
	load: function( file ) { ajax( this, file, "parse", "arraybuffer" ); },
	
	/* 'data' is file content of loaded file */
	parse: function( data ) {
		this.data = data;
		var pssg = this.read( "char", 4 ),
			chunkSize = this.read( "int", 1 )[0],
			params = this.read( "int", 1 )[0],
			props = this.read( "int", 1 )[0];
			
		//console.log( pssg, chunkSize, props, params );
		for( var i = 0; i < 14; i++ ) {
			var pindex = 0, plen = 0, pname = "", pprops = 0;
			
			// index , name length, name, props
			pindex = this.read( "int", 1 )[0];
			plen = this.read( "int", 1 )[0];
			for( var j = 0; j < plen; j++ ) {
				pname += this.read( "char", 1 )[0];
			}
			pprops = this.read( "int", 1 )[0];
			//console.log( pindex, plen, pname, pprops );
			for( var j = 0; j < pprops; j++ ) {
				var ppindex = 0, pplen = 0, ppname = "";
				ppindex = this.read( "int", 1 )[0];
				pplen = this.read( "int", 1 )[0];
				for( var k = 0; k < pplen; k++ ) {
					ppname += this.read( "char", 1 )[0];
				}
				//console.log( "    ", ppindex, pplen, ppname );
			}
		}
	},
	
	/* read specified amount of bytes into string, possibly trimming string */
	read: function( type, amount, offset ) {
		amount = amount || 1;
		var res = [],
			dv = new DataView( this.data.slice( (offset || 0), (offset || 0) + size[type] * amount ) );
		switch( type ) {
			case "char":
				for( var i = 0; i < amount; i++ )
					res.push( String.fromCharCode( dv.getUint8(i) ) );
				break;
			case "short":
				for( var i = 0; i < amount; i++ )
					res.push( dv.getUint16(i) );
				break;
			case "int":
				for( var i = 0; i < amount; i++ ) {
					dv = new DataView( this.data.slice( 0+(i*size[type]), (i+1)*size[type] ) );
					res.push( dv.getInt32(0) );
				}
				break;
		}
		if( typeof offset == "undefined" || offset === false || offset === true )
			this.data = this.data.slice( (offset || 0) + size[type] * amount );
		return res;
	}
};

window.dC = new dCode();