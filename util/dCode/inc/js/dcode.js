body.onload = function() {
	console.log( "here" );
	
	dC.init();
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
	this.dv = "";
	this.ui = "";
	this.pointer = 0;
	
	this.chunks = [];
	this.cindex = [];
	this.cident = {};
	this.pindex = [];
}

dCode.prototype = {
	/* initialize dCode app */
	init: function() { this.ui = new ui(); },
	
	/* load a file from string path as arraybuffer */
	load: function( file ) { ajax( this, file, "parse", "arraybuffer" ); },
	
	/* 'data' is file content of loaded file */
	parse: function( data ) {
		this.data = data;
		this.dv = new DataView( data );
		/*var header = new chunk("header");
		header.add( [ ["char", 4], ["int", 1], ["int", 1], ["int", 1] ] );
		this.add( header );
		
		var list = new chunk("chunks", "list");
		this.add( list );
		console.log( this.chunks );
		this.chunks[0].read();*/
		//header		
		this.ui.label( "header" );
		var begin = this.pointer;
		var pssg = this.read( "char", 4 ).join(""),
			chunkSize = this.read( "int", 1 ),
			params = this.read( "int", 1 ),
			props = this.read( "int", 1 );
		var end = this.pointer;
		
		this.ui.entry( ["char", 4], pssg );
		this.ui.entry( ["int", 1], chunkSize );
		this.ui.entry( ["int", 1], params );
		this.ui.entry( ["int", 1], props );
		
		this.ui.bounds( begin, end );
		this.ui.heading( "chunk list" );

		console.log( pssg, chunkSize, props, params );
		for( var i = 0; i < props; i++ ) {
			var pindex = this.read( "int", 1 ),
				plen = this.read( "int", 1 ),
				pname = "",
				pprops = 0;
				
			pname = this.read( "char", plen ).join("");
			pprops = this.read( "int", 1 );
			this.ui.label( pname );
			this.ui.entry( ["int",1], pindex );
			this.ui.entry( ["int",1], plen );
			this.ui.entry( ["char",plen], pname );
			this.ui.entry( ["int",1], pprops );

			console.log( pindex, plen, pname, pprops );
			this.cindex[pindex] = pname;
			this.cident[pname] = pindex;
			
			for( var j = 0; j < pprops; j++ ) {
				var ppindex = this.read( "int", 1 ),
					pplen = this.read( "int", 1 ),
					ppname = "";
					
				ppname = this.read( "char", pplen ).join("");
				this.ui.entry( ["int",1], this.ui.tab()+ppindex );
				this.ui.entry( ["int",1], this.ui.tab()+pplen );
				this.ui.entry( ["char",pplen], this.ui.tab()+ppname );
				
				console.log( "    ", ppindex, pplen, ppname );
				this.pindex[ppindex] = ppname;
			}
			this.ui.bounds( " ", " " );
		}
		//chunks
		for( var i = 0; i < 21; i++ )
			this.process();
		
		//datablockdata
		console.log( this.cindex[this.read("int", 1 )] );
		console.log( this.read("int", 1 ) );
		var tfloat = [];
		for( var i = 0; i < 1169 / size["float"]; i++ ) {
			tfloat.push( this.read("float",1) );
		}
		console.log( tfloat, tfloat.length+4 / 12 );
		console.log( this.pointer, this.read("int", 1) );
		
		console.log( this );
	},
	
	/* get a chunk from the stack */
	get: function( n ) { return this.chunks[ this.cident[n] ]; },
	
	/* add a chunk to the stack */
	add: function( c ) {
		this.cident[c.name] = this.chunks.length;
		this.chunks.push( c );
	},
	
	/* process the next chunk of the file */
	process: function( c ) {
		/*this.ui.label( c.name );
		c.begin = this.pointer;
		var data = "";
		for( var i in c.props ) {
			c.data[i] = this.read( c.props[i].t, c.props[i].a );
			this.ui.entry( [c.props[i].t, c.props[i].a], c.data[i] );
		}
		c.end = this.pointer;
		this.ui.bounds( c.begin, c.end );*/
		var begin = this.pointer;
		var cindex = this.read( "int", 1 ),
			csize = this.read( "int", 1 ),
			pbytes = this.read( "int", 1 );
		var end = this.pointer + pbytes;
		this.ui.label( this.cindex[cindex] );
		this.ui.entry( ["int", 1], cindex );
		this.ui.entry( ["int", 1], csize );
		this.ui.entry( ["int", 1], pbytes );
		console.log( cindex, this.cindex[cindex], csize, pbytes, end );
		
		while( this.pointer < end ) {
			var pindex = this.read( "int", 1 ),
				unknown = this.read( "int", 1 );
			if( pindex == 55 || pindex == 56 ) {
				pdata = "";
				pdata += this.read("float",3);
			}
			else if( unknown == 4 ) {
				pdata = "";
				pdata += this.read("int",1);
			}
			else {
				plen = this.read( "int", 1 );
				pdata = "";
				pdata = this.read("char", plen).join("");
			}
			console.log( "    ", this.pindex[pindex], plen, unknown, pdata );
		}
		end = this.pointer;
		this.ui.bounds( begin, end );
		console.log( this.pointer );
	},
	
	/* reset pointer back a value amount */
	rewind: function( type, n ) { this.pointer -= size[type] * n; },
	
	/* read specified amount of bytes into string, possibly trimming string */
	read: function( type, amount, offset ) {
		if( offset === undefined ) offset = this.pointer;
		amount = amount || 1;
		var res = [];
		switch( type ) {
			case "char":
				for( var i = 0; i < amount; i++ ) {
					res.push( String.fromCharCode( this.dv.getUint8(offset + i * size[type]) ) );
				}
				break;
			case "short":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getUint16(offset + i * size[type]) );
				break;
			case "int":
				for( var i = 0; i < amount; i++ ) {
					res.push( this.dv.getInt32(offset + i * size[type]) );
				}
				break;
			case "float":
				for( var i = 0; i < amount; i++ ) {
					res.push( this.dv.getFloat32( (offset + i * size[type]) ) );
				}
				break;
		}
		if( typeof arguments[2] == "undefined" || arguments[2] === false || arguments[2] === true )
			this.pointer += size[type] * amount;
		if( res.length == 1 ) return res[0];
		return res;
	},
};

window.dC = new dCode();