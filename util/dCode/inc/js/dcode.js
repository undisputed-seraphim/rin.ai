body.onload = function() {
	console.log( "here" );
	
	dC.init();
	dC.load("test.pssg");
}

var size = {
	"char":		1,
	"short":	1,
	"uint":		2,
	"int":		4,
	"float":	4,
	"double":	8
}

function dCode() {
	this.data = "";
	this.pssg = "";
	this.dv = "";
	this.ui = "";
	this.cblock = "";
	this.prev = "char";
	this.parent = "";
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
		this.pssg = new PSSG();
		this.pssg.header.read();
		
		//chunk list
		for( var i = 0; i < this.pssg.header.parts[this.pssg.header.pident["types"]].data; i++ ) {
			var pindex = this.read( "int", 1 ),
				plen = this.read( "int", 1 ),
				pname = "",
				pprops = 0;
			pname = this.read( "char", plen ).join("");
			pprops = this.read( "int", 1 );

			//console.log( pindex, plen, pname, pprops );
			this.pssg.ctypes[ pindex ] = new TYPE( pname );
			
			for( var j = 0; j < pprops; j++ ) {
				var ppindex = this.read( "int", 1 ),
					pplen = this.read( "int", 1 ),
					ppname = "";
				ppname = this.read( "char", pplen ).join("");
				
				//console.log( "    ", ppindex, pplen, ppname );
				this.pssg.ctypes[ pindex ].parts.push( ppname );
				this.pssg.ptypes[ ppindex ] = ppname;
			}
		}
		
		console.log( this.pssg );
		
		//pssgdatabase node, top level parent
		var offset = this.pointer, s = 0;
		
		var ctype = this.pssg.ctypes[this.read( "int", 1 )];
		var size = this.read( "int", 1 );
		var pbytes = this.read( "int", 1 );
		this.pointer += pbytes;
		while( this.pointer < size + offset ) {
			var start = this.pointer;
			var cur = this.read( "int", 1 ),
				name = this.pssg.ctypes[cur].name;
			if( name != "DATABLOCKDATA" && name != "TEXTUREIMAGEBLOCKDATA" && name != "SHADERPROGRAMCODEBLOCK"
			   && name != "TRANSFORM" && name != "BOUNDINGBOX" && name != "MODIFIERNETWORKINSTANCEUNIQUEMODIFIERINPUT" 
			   && name != "SHADERINPUT" && name != "INDEXSOURCEDATA" && name != "INVERSEBINDMATRIX" ) {
				s = this.read( "int", 1 );
				var pbytes = this.read( "int", 1 );
				this.pointer += pbytes;
			} else {
				s = 0;
				var pbytes = this.read( "int", 1 );
				this.pointer += pbytes;
			}
			var end = this.pointer;
			var chunk = new CHUNK(name);
			chunk.start = start;
			chunk.end = end;
			chunk.size = s;
			this.pssg.chunks.push( chunk );
			//console.log( start, name, end );
		}
		
		var limit = 0, pdatablock = {n: "", t: ""}, pdatastream = "", plibrary = "", ptexture = "", pshaderprogram = "",
			pshaderprogramcode = {n:"",t:""}, pshadergroup = "", proot = "", pnode = "", prenderdata = "", prenderindex = "",
			pskeleton = "", pend = 0, snode = "", nstack = [], estack = [], prendernode = "", prenderstream = "", pmodifier = "";
		for( var i in this.pssg.chunks ) {
			var c = this.pssg.chunks[i];
			this.pointer = c.start;
			
			var cindex = this.read("int",1);
			switch( this.pssg.ctypes[cindex].name ) {
				case "DATABLOCKDATA":
					c.parent = pdatastream;
					c.parts.push( new PART("data","temp",0) );
					this.skip("int",2);
					c.parts[c.parts.length-1].data = [];
					break;
				case "TRANSFORM":
					c.parent = pnode;
					c.parts.push( new PART("data","temp",0) );
					this.skip("int",2);
					c.parts[c.parts.length-1].data = [];
					break;
				case "BOUNDINGBOX":
					c.parent = pnode;
					c.parts.push( new PART("data","temp",0) );
					c.parts[c.parts.length-1].data = [];
					this.skip("int",2);
					break;
				case "SHADERPROGRAMCODEBLOCK":
					c.parent = pshaderprogramcode.n;
					c.parts.push( new PART("data","temp",0) );
					this.skip("int",2);
					c.parts[c.parts.length-1].data = [];
					break;
				case "TEXTUREIMAGEBLOCKDATA": case "MODIFIERNETWORKINSTANCEUNIQUEMODIFIERINPUT": case "SHADERINPUT": case "INDEXSOURCEDATA":
					break;
				case "ROOTNODE": pend = c.end; nstack.unshift( i ); estack.unshift(c.size); pnode = i; c.parent = plibrary; this.skip("int",2); break;
				case "NODE":
					console.log( estack[0], c.end );
					c.parent = pnode;
					estack.unshift(c.start+c.size);
					nstack.unshift( i );
					pnode = i;
					this.skip("int",2); break;
				case "JOINTNODE": c.parent = pnode; pnode = i; this.skip("int",2); break;
				case "SKINNODE": c.parent = pnode; pnode = i; this.skip("int",2); break;
				case "SKINJOINT": c.parent = pnode; this.skip("int",2); break;
				case "RENDERNODE": c.parent = pnode; pnode = i; this.skip("int",2); break;
				default:
					this.skip("int",2);
					break;
			}
			while( this.pointer < c.end ) {
				switch( this.pssg.ctypes[cindex].name ) {
					case "DATABLOCKDATA":
						switch( pdatablock.t ) {
							case "float3": c.parts[c.parts.length-1].data.push( this.read("float",3) ); break;
							case "float4": c.parts[c.parts.length-1].data.push( this.read("float",4) ); break;
							case "uchar4": c.parts[c.parts.length-1].data.push( this.read("short",4) ); break;
							default: console.log( pdatablock.t ); c.parts[c.parts.length-1].data.push( this.read("int",1) ); break;
						}
						break;
					case "TEXTUREIMAGEBLOCKDATA":
						c.parent = ptexture;
						this.read("int",1);
						break;
					case "SHADERPROGRAMCODEBLOCK":
						switch( pshaderprogramcode.t ) {
							case "CgSource": c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
							case "CgRsxBinary": c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
							case "CgRsxBinaryGcm": c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
							default: c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
						}
						break;
					case "SHADERINPUT":
						c.parent = pshadergroup;
						this.read("int",1);
						break;
					case "INDEXSOURCEDATA":
						c.parent = prenderindex;
						this.read("int",1);
						break;
					case "INVERSEBINDMATRIX":
						c.parent = pskeleton;
						c.parts.push( new PART( "matrices", "float", 16 ) );
						c.parts[ c.parts.length -1 ].data = [];
						while( this.pointer < c.end ) {
							c.parts[ c.parts.length -1 ].data.push( this.read("float",1) );
						}
						break;
					case "TRANSFORM":
						c.parts[c.parts.length-1].data.push( this.read("float",1) );
						break;
					case "BOUNDINGBOX":
						c.parts[c.parts.length-1].data.push( this.read("float",1) );
						break;
					case "MODIFIERNETWORKINSTANCEUNIQUEMODIFIERINPUT":
						this.read("int",1);
						break;
					default:
						var cur = this.read("int",1),
							unknown = this.read("int",1);
						switch( dtypes[this.pssg.ptypes[cur]] ) {
							case "string":
								if( ( c.name == "RISTREAM" || c.name == "MODIFIERNETWORKINSTANCEDYNAMICSTREAM" )
									 	&& this.pssg.ptypes[cur] == "id" ) {
									c.parts.push( new PART( this.pssg.ptypes[cur], "int", 1 ) );
									c.parts[c.parts.length - 1].data = this.read( "int", 1 );
								}
								else {
									var plen = this.read( "int", 1 );
									c.parts.push( new PART( this.pssg.ptypes[cur], "char", plen ) );
									//console.log( i, c, plen );
									c.parts[c.parts.length - 1].data = this.read( "char", plen ).join("");
								}
								break;
							case "float3":
								c.parts.push( new PART( this.pssg.ptypes[cur], "float", 3 ) );
								c.parts[c.parts.length - 1].data = this.read( "float", 3 );
								break;
							case "float":
								c.parts.push( new PART( this.pssg.ptypes[cur], "float", 1 ) );
								c.parts[c.parts.length - 1].data = this.read( "float", 1 );
								break;
							case undefined:
								c.parts.push( new PART( this.pssg.ptypes[cur], "int", 1 ) );
								c.parts[c.parts.length - 1].data = this.read( "int", 1 );
								break;
						}
						switch( this.pssg.ctypes[cindex].name ) {
							case "LIBRARY": plibrary = i; break;
							case "DATABLOCK": pdatablock.n = i; c.parent = plibrary; break;
							case "DATABLOCKSTREAM": pdatablock.t = c.prop("dataType"); pdatastream = i; c.parent = pdatablock.n; break;
							case "TEXTURE": ptexture = i; c.parent = plibrary; break;
							case "TEXTUREIMAGEBLOCK": c.parent = ptexture; break;
							case "SHADERGROUP": pshadergroup = i; c.parent = plibrary; break;
							case "SHADERPROGRAM": pshaderprogram = i; c.parent = plibrary; break;
							case "SHADERPROGRAMCODE": pshaderprogramcode.n = i; pshaderprogramcode.t = c.prop("codeType"); c.parent = pshaderprogram; break;
							case "CGSTREAM": c.parent = pshaderprogramcode.n; break;
							case "SHADERINPUTDEFINITION":
								if( pshadergroup == "" ) c.parent = pshaderprogramcode.n;
								else c.parent = pshadergroup; break;
							case "SHADERSTREAMDEFINITION": c.parent = pshadergroup; break;
							case "SHADERGROUPPASS": c.parent = pshadergroup; break;
							case "RENDERDATASOURCE": prenderdata = i; c.parent = plibrary; break;
							case "RENDERINDEXSOURCE": prenderindex = i; c.parent = prenderdata; break;
							case "RENDERSTREAM": c.parent = prenderdata; break;
							case "SKELETON": pskeleton = i; c.parent = plibrary; break;
							case "NODE": case "SKINNODE": case "SKINJOINT": case "JOINTNODE": case "RENDERNODE": break;
							case "RENDERSTREAMINSTANCE": case "MODIFIERNETWORKINSTANCE": prenderstream = i; c.parent = pnode; break;
							case "MODIFIERNETWORKINSTANCECOMPILE": pmodifier = i; c.parent = prenderstream; break;
							case "MODIFIERNETWORKINSTANCEUNIQUEINPUT": case "MODIFIERNETWORKINSTANCEUNIQUEMODIFIERINPUT":
								case "MODIFIERNETWORKINSTANCEDYNAMICSTREAMTYPE": c.parent = pmodifier; break;
							case "RISTREAM": case "RENDERINSTANCESOURCE": case "RENDERINSTANCESTREAM": case "MODIFIERNETWORKINSTANCEDYNAMICSTREAM":
								case "MODIFIERNETWORKINSTANCEMODIFIERINPUT": c.parent = prenderstream; break;
							default: c.parent = plibrary; break;
						}
						break;
				}
			}
			//console.log( this.pssg.chunks[c.parent], c.prop("data") );
		}
		
		//set children of library nodes
		for( var i in this.pssg.chunks ) {
			if( this.pssg.chunks[i].parent != "" ) {
				this.pssg.chunks[this.pssg.chunks[i].parent].children.push( this.pssg.chunks[i] );
			}
		}
		
		console.log( this.pssg.get("LIBRARY") );
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
	},
	
	/* reset pointer back a value amount */
	rewind: function( type, n ) { this.pointer -= size[type] * n; },
	
	/* move pointer forward a value */
	skip: function( type, n ) { this.pointer += size[type] * n; },
	
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
			case "uint":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getUint16(offset+i*size[type]) );
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