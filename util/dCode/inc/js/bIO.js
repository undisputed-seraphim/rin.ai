var bIO = {
	
	/* base data types */
	types: {
		"uchar":	{ name: "uchar",	size: 1,	func: "getUint8" },
		"char":		{ name: "char",		size: 1,	func: "getInt8" },
		"ushort":	{ name: "ushort",	size: 2,	func: "getUint16" },
		"short":	{ name: "short",	size: 2,	func: "getInt16" },
		"uint":		{ name: "uint",		size: 4,	func: "getUint32" },
		"int":		{ name: "int",		size: 4,	func: "getInt32" },
		"float":	{ name: "float",	size: 4,	func: "getFloat32" },
		"double":	{ name: "double",	size: 8,	func: "getFloat64" },
	},
	sizeof: function( type ) { return type.size || bIO.types[ type ].size; },
	
	/* object used to represent data from a binary file */
	file: function file( filename, caller, callback ) {
		this.name = "";
		this.dv = "";
		this.size = "";
		this.pointer = "";
		
		this.templates = {};
		this.idents = {};
		this.links = {};
		this.chunks = [];
		
		if( filename !== undefined ) {
			this.load( filename, caller, callback );
		}
	},
	
	/* object used to tell how data is stored within a chunk */
	template: function template( name ) {
		this.name = name;
		this.parts = [];
	},
	
	list: function list( amount ) {
		this.id = "list";
		this.amount = amount || 1;
		this.parts = [];
	},
	
	/* object used to denote the type and amount of data within a chunk */
	part: function part( name, type, amount ) {
		this.id = "part";
		this.name = name || "no name";
		this.type = type || "int";
		this.amount = amount || 1;
	},
	
	self: function( index ) {
		this.id = "self";
		this.index = index;
	},
	
	/* read in a property that can be used in the future with 'link' */
	ident: function ident( name, type, amount ) {
		this.id = "ident";
		this.name = name || "no name";
		this.type = type || "int";
		this.amount = amount || 1;
	},
	
	/* link a property to a previously established ident */
	link: function link( name, type, amount ) {
		this.id = "link";
		this.name = name || "no name";
		this.type = type || "int";
		this.amount = amount || 1;
	},
	
	/* object used to represent a piece of a binary file */
	chunk: function chunk( template ) {
		this.name = template.name;
		this.start = "";
		this.end = "";
		this.data = [];
	},
	
	/* static helper functions for binary manipulation */
	ab2str: function( obj, buf, callback, type ) {
		type = type || Uint8Array;
		var blob = new Blob( [ new type( buf ) ] ),
			fr = new FileReader();
		fr.onload = function( e ) {
			obj[callback]( e.target.result );
		}
		fr.readAsText(blob);
	},
}

/* helper shortcuts */
var sizeof = bIO.sizeof;

bIO.file.prototype = {
	$: function( n ) {
		var res = [];
		if( typeof n == "string" )
			for( var i in this.chunks ) {
				if( this.chunks[i].name == n ) {
					res.push( this.chunks[n] );
				}
			}
		else res.push( this.chunks[n] );
		return res;
	},
	load: function( filename, caller, callback ) {
		this.name = filename;
		if( caller !== undefined && callback !== undefined ) {
			this.caller = caller;
			this.callback = callback;
		}
		ajax( this, filename, "loaded", "arraybuffer" );
	},
	add: function( template ) { return this.chunks[ this.chunks.push( new bIO.chunk( template ) ) - 1 ]; },
	template: function( name ) { this.templates[name] = new bIO.template( name ); return this.templates[ name ]; },
	ident: function( name, data ) { this.idents[name] = data; return this.idents[name]; },
	loaded: function( data ) {
		this.data = data;
		this.dv = new DataView( data );
		this.size = data.byteLength;
		this.pointer = 0;
		if( this.caller !== undefined )
			this.caller[ this.callback ]();
		
		/*var t = this.template("header");
		t.add( "pssg", "char", 4 );
		t.add( "size", "int", 1 );
		t.link( "props", "int", 1 );
		t.add( "params", "int", 1 );
		this.add( t );
		this.process( 0 );
		
		t = this.template("chunklist");
		t.link( "param", "int", 1 );*/
		//t.ident( "param", "string", 1 );
	},
	process: function( c ) {
		c = this.chunks[ c ] || c || this.chunks[0];
		c.start = this.pointer;
		var t = this.templates[ c.name ];
		for( var i in t.parts ) {
			if( t.parts[i].type == "string" ) {
				var len = this.read("int",1);
				c.data.push( this.read( "char", len ) );
			} else {
				c.data.push( this.read( t.parts[i].type, t.parts[i].amount ) );
			}
			if( t.parts[i].id == "link" ) {
				this.links[ t.parts[i].name ] = [this.chunks.length-1,c.data.length-1];
				console.log( this.chunks[this.links[ t.parts[i].name ][0]].data[this.links[t.parts[i].name][1]] );
			}
		}
		c.end = this.pointer;
	},
	preread: function( type, amount, offset, caller, callback ) {
		var tmp = this.pointer;
		this.pointer = offset;
		var res = this.read( type, amount );
		if( typeof res != "object" ) {
			var tmp = [];
			tmp.push( res );
			res = tmp;
		}
		this.pointer = tmp;
		caller[callback]( res );
	},
	read: function( type, amount ) {
		amount = amount || 1;
		var res = [];
		for( var i = 0; i < amount; i++ )
			res.push( this.dv[ bIO.types[ type ].func ]( this.pointer + i * sizeof(type) ) );
		this.pointer += sizeof(type) * amount;
		return res.length == 1 ? res[0] : res;
	}
};

bIO.template.prototype = {
	add: function( name, type, amount ) { this.parts.push( new bIO.part( name, type, amount ) ); },
	link: function( type, amount ) { this.parts.push( new bIO.link( type, amount ) ); },
};