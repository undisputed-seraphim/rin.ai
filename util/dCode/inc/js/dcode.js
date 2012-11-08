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
		
		var limit = 0, pdatablock = {n: "", t: ""}, pdatastream = "", plibrary = "", ptexture = "", pshaderprogram = "", pshaderprogramcode = "", pshadergroup = "",
			proot = "", pnode = {n:"", c:""}, prenderdata = "", prenderindex = "", pskeleton = "", pend = 0, snode = "", nstack = [], estack = [];
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
					//console.log("t", this.pointer);
					break;
				case "BOUNDINGBOX":
					//console.log("b", this.pointer, estack[0], c.end);
					break;
				case "TEXTUREIMAGEBLOCKDATA": case "SHADERPROGRAMCODEBLOCK":
				case "MODIFIERNETWORKINSTANCEUNIQUEMODIFIERINPUT": case "SHADERINPUT": case "INDEXSOURCEDATA":
					break;
				case "ROOTNODE": nstack.unshift( i ); estack.unshift(c.size); c.parent = plibrary; this.skip("int",2); break;
				case "NODE":
					console.log( estack[0], c.end );
					c.parent = nstack[0];
					estack.unshift(c.start+c.size);
					nstack.unshift( i );
					this.skip("int",2); break;
				case "JOINTNODE": estack.unshift(c.start+c.size); this.skip("int",2); break;
				case "RENDERNODE": estack.unshift(c.start+c.size); this.skip("int",2); break;
				case "SKINNODE": estack.unshift(c.start+c.size); snode = i; c.parent = plibrary; this.skip("int",2); break;
				case "SKINJOINT": c.parent = snode; this.skip("int",2); break;
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
						c.parent = pshaderprogramcode;
						this.read("int",1);
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
						this.read("int",1);
						break;
					case "BOUNDINGBOX": case "MODIFIERNETWORKINSTANCEUNIQUEMODIFIERINPUT":
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
							case "SHADERPROGRAMCODE": pshaderprogramcode = i; c.parent = pshaderprogram; break;
							case "CGSTREAM": c.parent = pshaderprogramcode; break;
							case "SHADERINPUTDEFINITION":
								if( pshadergroup == "" ) c.parent = pshaderprogramcode;
								else c.parent = pshadergroup; break;
							case "SHADERSTREAMDEFINITION": c.parent = pshadergroup; break;
							case "SHADERGROUPPASS": c.parent = pshadergroup; break;
							case "RENDERDATASOURCE": prenderdata = i; c.parent = plibrary; break;
							case "RENDERINDEXSOURCE": prenderindex = i; c.parent = prenderdata; break;
							case "RENDERSTREAM": c.parent = prenderdata; break;
							case "SKELETON": pskeleton = i; c.parent = plibrary; break;
							case "NODE": case "SKINNODE": case "JOINTNODE": case "RENDERNODE": break;
							default: c.parent = plibrary; break;
						}
						break;
				}
			}
		}
		
		//set children of library nodes
		for( var i in this.pssg.chunks ) {
			if( this.pssg.chunks[i].parent != "" ) {
				this.pssg.chunks[this.pssg.chunks[i].parent].children.push( this.pssg.chunks[i] );
			}
		}
		
		console.log( this.pssg.get("LIBRARY") );
		/*var current = "", pcurrent = "", cont = 1;
		while( cont ) {
			current = this.read( "int", 1 );
			if( this.pssg.ctypes[current] !== undefined ) {
				var chunk = new CHUNK( this.pssg.ctypes[current].name ),
					chunkSize = this.read( "int", 1 ),		//chunk size
					propBytes = this.read( "int", 1 ),		//propbytes
					pcont = this.pointer + propBytes;
				
				while( this.pointer < pcont ) {
					pcurrent = this.read( "int", 1 );
					this.read( "int", 1 );					//unknown
					if( this.pssg.ptypes[pcurrent] !== undefined ) {
						switch( dtypes[this.pssg.ptypes[pcurrent]] ) {
							case "string":
								var plen = this.read( "int", 1 );
								chunk.parts.push( new PART( this.pssg.ptypes[pcurrent], "char", plen ) );
								chunk.parts[chunk.parts.length - 1].data = this.read( "char", plen ).join("");
								break;
							case "float3":
								chunk.parts.push( new PART( this.pssg.ptypes[pcurrent], "float", 3 ) );
								chunk.parts[chunk.parts.length - 1].data = this.read( "float", 3 );
								break;
							case undefined:
								chunk.parts.push( new PART( this.pssg.ptypes[pcurrent], "int", 1 ) );
								chunk.parts[chunk.parts.length - 1].data = this.read( "int", 1 );
								break;
						}
					} else { console.log("here", pcurrent); }
				}
				this.pssg.chunks.push( chunk );
			} else { this.rewind( "int", 1 ); cont = 0; }
		}
		
		console.log( this.read("int", 1) );*/
		
		
		
		
		
		
		
		
		
		
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