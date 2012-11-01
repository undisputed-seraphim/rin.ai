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
		var test = [];
		test.push( this.read( "char", 4 ), this.read( "int", 1 ), this.read( "int", 1 ), this.read( "int", 1 ) );
		console.log( test );
	},
	
	/* read specified amount of bytes into string, possibly trimming string */
	read: function( type, amount, offset ) {
		var res = [],
			dv = new DataView( this.data.slice( (offset || 0), (offset || 0) + size[type] * amount ) );
		switch( type ) {
			case "char":
				for( var i = 0; i < amount; i++ )
					res.push( String.fromCharCode( dv.getUint8(i) ) );
				break;
			case "int":
				for( var i = 0; i < amount; i++ )
					res.push( dv.getUint32(i) );
				break;
		}
		if( typeof offset == "undefined" || offset === false || offset === true )
		   this.data = this.data.slice( (offset || 0) + size[type] * amount );
		return res;
	}
};

window.dC = new dCode();