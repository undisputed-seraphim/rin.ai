body.onload = function() {
	console.log( "here" );
	
	dC.init();
	dC.load("test.pssg");
}

var size = {
	"char":		1,
	"short":	1,
	"int":		4,
	"float":	4,
	"double":	8
}

function dCode() {
	this.data = "";
	this.dv = "";
	this.ui = "";
	this.cblock = "";
	this.prev = "char";
	this.count = 0;
	this.pointer = 0;
	
	this.chunks = [];
	this.cindex = [];
	this.cident = {};
	this.pindex = [];
	this.blocks = { t: {}, v: {}, n: {} };
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
		
		//header
		var pssg = new PSSG();
		pssg.header.read();
		
		//chunk list
		for( var i = 0; i < pssg.header.parts[pssg.header.pident["types"]].data; i++ ) {
			var pindex = this.read( "int", 1 ),
				plen = this.read( "int", 1 ),
				pname = "",
				pprops = 0;
			pname = this.read( "char", plen ).join("");
			pprops = this.read( "int", 1 );

			//console.log( pindex, plen, pname, pprops );
			pssg.ctypes[ pindex ] = new TYPE( pname );
			
			for( var j = 0; j < pprops; j++ ) {
				var ppindex = this.read( "int", 1 ),
					pplen = this.read( "int", 1 ),
					ppname = "";
				ppname = this.read( "char", pplen ).join("");
				
				//console.log( "    ", ppindex, pplen, ppname );
				pssg.ctypes[ pindex ].parts.push( ppname );
				pssg.ptypes[ppindex] = ppname;
			}
		}
		
		console.log( pssg );
		/*this.ui.label( "header" );
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
		while( this.cindex[this.read("int", 1 )] == "DATABLOCKDATA" ) {
			var t = this.read("int", 1 ), tmp = [];
			console.log( this.read("int", 1 ) );
			for( var i = 0; i < this.count; i++ ) {
				tmp.push( this.read(this.prev, this.num) );
			}
			console.log( this.pointer, tmp );
			this.blocks[this.cblock].data = tmp;
			//console.log( this.read("int", 1 ) );
			this.process();
			this.process();
			//console.log( this.cindex[this.read("int", 1 )] );
			//console.log( this.read("float",this.read("int",1) / size["float"]) );
		}
		
		console.log( this );
		this.printBlocks( ["blockKFB","blockJFB","blockFFB","blockEFB","blockIFB"] );*/
	},
	
	/* get a chunk from the stack */
	get: function( n ) { return this.chunks[ this.cident[n] ]; },
	
	/* add a chunk to the stack */
	add: function( c ) {
		this.cident[c.name] = this.chunks.length;
		this.chunks.push( c );
	},
	
	printBlocks: function( arr ) {
		for( var i in arr ) console.log( this.blocks[arr[i]] );
	},
	
	/* process the next chunk of the file */
	process: function( c ) {
		for( var i in c.parts ) {
			c.parts[i].data = this.read( c.parts[i].type, c.parts[i].amount );
		}
		/*var begin = this.pointer;
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
				unknown = this.read( "int", 1 ),
				current = "";
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
			if( this.pindex[pindex] == "dataType" ) {
				switch( pdata ) {
					case "uchar4":
						this.prev = "short";
						this.num = 4;
						break;
					case "float4":
						this.prev = "float";
						this.num = 4;
						break;
					case "float3":
						this.prev = "float";
						this.num = 3;
						break;
				}
			} else if( this.pindex[pindex] == "renderType" ) {
				if( this.blocks[this.cblock] !== undefined ) this.blocks[this.cblock].type = pdata;
			} else if( this.pindex[pindex] == "elementCount" ) {
				this.count = pdata;
			} else if( this.pindex[pindex] == "id" ) {
				if( this.cindex[cindex] == "DATABLOCK" ) {
					this.blocks[pdata] = new block(pdata);
					this.cblock = pdata;
				}
			}
		}
		end = this.pointer;
		this.ui.bounds( begin, end );*/
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
					res.push( String.fromCharCode( this.dv.getInt8(offset + i * size[type]) ) );
				}
				break;
			case "short":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getUint8(offset + i * size[type]) );
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
			case "double":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getFloat64( (offset + i * size[type]) ) );
				break;
		}
		if( typeof arguments[2] == "undefined" || arguments[2] === false || arguments[2] === true )
			this.pointer += size[type] * amount;
		if( res.length == 1 ) return res[0];
		return res;
	},
};

window.dC = new dCode();