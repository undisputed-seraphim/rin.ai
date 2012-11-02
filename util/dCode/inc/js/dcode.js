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
	this.dv = "";
	this.pointer = 0;
	this.cindex = [];
	this.cident = {};
}

dCode.prototype = {
	
	/* load a file from string path */
	load: function( file ) { ajax( this, file, "parse", "arraybuffer" ); },
	
	/* 'data' is file content of loaded file */
	parse: function( data ) {
		this.data = data;
		this.dv = new DataView( data );
		
		//header
		var pssg = this.read( "char", 4 ).join(""),
			chunkSize = this.read( "int", 1 ),
			params = this.read( "int", 1 ),
			props = this.read( "int", 1 );
			
		this.entry( pssg, "char 4" );
			
		console.log( pssg, chunkSize, props, params );
		for( var i = 0; i < props; i++ ) {
			var pindex = this.read( "int", 1 ),
				plen = this.read( "int", 1 ),
				pname = "",
				pprops = 0;
				
			pname = this.read( "char", plen ).join("");
			pprops = this.read( "int", 1 );
			console.log( pindex, plen, pname, pprops );
			this.cindex[pindex] = pname;
			this.cident[pname] = pindex;
			
			for( var j = 0; j < pprops; j++ ) {
				var ppindex = this.read( "int", 1 ),
					pplen = this.read( "int", 1 ),
					ppname = "";
					
				ppname = this.read( "char", pplen ).join("");
				console.log( "    ", ppindex, pplen, ppname );
			}
		}
		//chunks
		for( var i = 0; i < 20; i++ )
			this.process();
			
		console.log( this );
	},
	
	/* process the next chunk of the file */
	process: function() {
		var cindex = this.read( "int", 1 ),
			csize = this.read( "int", 1 ),
			pbytes = this.read( "int", 1 );
		var end = this.pointer + pbytes;
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
				plen = this.read( "int", 1 ),
				pdata = "";
				pdata = this.read("char", plen).join("");
			}
			console.log( "    ", pindex, plen, unknown, pdata );
		}
		console.log( this.pointer );
	},
	
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
	
	/* all functionality via html is done through this object */
	entry: function( left, right ) {
		var e = document.createElement("div"),
			l = document.createElement("div"),
			r = document.createElement("div");
			
		e.className = "entry";
		l.className = "left";
		l.innerHTML = left;
		r.className = "right";
		r.innerHTML = right;
		
		e.appendChild(l);
		e.appendChild(r);
		document.getElementById("content").appendChild(e);
	},
	tab: function( n ) {
		var res = "",
			n = n || 1;
		for( var i = 0; i < n * 5; i++ )
			res += " ";
		return res;
	}
};

window.dC = new dCode();