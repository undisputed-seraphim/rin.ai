body.onload = function() {
	console.log( "here" );
	
	dC.init();
	dC.load("test.gmo");
}

var size = {
	"uchar":	1,
	"char":		1,
	"ushort":	2,
	"short":	1,
	"uint":		4,
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
	/* initialize dCode app's ui */
	init: function() {
		var ui = this.ui = new $ui();
		var dc_area = ui.$("#dCode"),
			actual = ui.create( "div", { id: "data" } ),
			preview = ui.create( "div", { id: "preview" } );
		dc_area.append( preview );
		/*heading.append(  ui.create("a", { href:"javascript:", id: "link_newtemplate" }, "new" ).click(
			function( e ) {
				console.log( e );
			} ) );*/
		dc_area.append( actual );
	},
	
	/* load a file from string path as arraybuffer */
	load: function( file ) { ajax( this, file, "parse", "arraybuffer" ); },
	
	lift: function( beg, end ) {
		data = this.ui.$("#data");
		for( var i = beg; i <= end; i++ ) {
			data.children( i ).prop( "class", "spacer lift" );
		}
	},
	
	buffer: function( n, offset ) {
		offset = offset || this.pointer;
		bIO.ab2str( this, this.data.slice( offset, offset + n ), "preview" );
	},
	
	preview: function( data ) {
		data = data || "";
		var res = "";
		for( var i = 0; i < data.length; i++ )
			res += '<span class="spacer">'+data[i]+'</span>';
		this.ui.$("#data").html( res + "..." );
		this.lift( 3, 4 );
	},
	
	/* 'data' is file content of loaded file */
	parse: function( data ) {
		this.data = data;
		this.dv = new DataView( data );
		this.buffer( 50 );
		//header
		this.pssg = new PSSG();
		//this.pssg.header.read();
		
		//chunk list
		/*for( var i = 0; i < this.pssg.header.parts[this.pssg.header.pident["types"]].data; i++ ) {
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
		}*/
		
		console.log( this.read("char",16) );
		for( var i = 0; i < 10; i++ ) {
			var cindex = this.read("ushort", 1 );
				hsize = this.read("ushort", 1 ),
				csize = this.read( "ushort", 4 );
			console.log( cindex, hsize );
		}
		console.log( this.pssg, data.byteLength );
		
		//this.buffer( 50 );
		//pssgdatabase node, top level parent
		/*var offset = this.pointer, s = 0;
		
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
		
		var limit = 0, pdatablock = {n: "", t: ""}, pdatastream = "", plibrary = "", ptexture = "", ptextureblock = "", pshaderprogram = "",
			pshaderprogramcode = {n:"",t:""}, pshadergroup = "", proot = "", pnode = "", prenderdata = "", prenderindex = {n:"",t:""},
			pskeleton = "", pend = 0, snode = "", nstack = [], estack = [], prendernode = "", prenderstream = "", pmodifier = "";
		for( var i in this.pssg.chunks ) {
			var c = this.pssg.chunks[i];
			this.pointer = c.start;
			
			console.log( c.name );
			
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
				case "INDEXSOURCEDATA":
					c.parent = prenderindex.n;
					c.parts.push( new PART("data","temp",0) );
					this.skip("int",2);
					c.parts[c.parts.length-1].data = [];
					break;
				case "SHADERSTREAMDEFINITION": case "SHADERINPUT":
					this.skip("int",2);
					break;
				case "TEXTUREIMAGEBLOCK": 
					console.log( this.read("int",2) );
					break;
				case "TEXTUREIMAGEBLOCKDATA":
					c.parent = ptextureblock;
					c.parts.push( new PART("data","temp",0) );
					this.skip("int",2);
					c.parts[c.parts.length-1].data = [];
					break;
				case "MODIFIERNETWORKINSTANCEUNIQUEMODIFIERINPUT":
					break;
				case "ROOTNODE": nstack.unshift( i ); estack.unshift(c.size); pnode = i; c.parent = plibrary; console.log( this.read("int",2) ); break;
				case "NODE":
					console.log( c.size, c.end );
					c.parent = pnode;
					//estack.unshift(c.start+c.size);
					nstack.unshift( i );
					pnode = i;
					this.skip("int",2);
					break;
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
						c.parts[c.parts.length-1].data.push( this.read("short",3) );
						break;
					case "SHADERPROGRAMCODEBLOCK":
						switch( pshaderprogramcode.t ) {
							case "CgSource": c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
							case "CgRsxBinary": c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
							case "CgRsxBinaryGcm": c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
							default: c.parts[c.parts.length -1].data.push( this.read("char",1) ); break;
						}
						break;
					case "INDEXSOURCEDATA":
						switch( prenderindex.t ) {
							case "uchar": c.parts[c.parts.length-1].data.push( this.read("short",1) ); break;
							case "ushort": c.parts[c.parts.length-1].data.push( this.read("ushort",1) ); break;
							default: console.log( prenderindex.t, ":type not accounted for:" ); this.read("int",1); break;
						}
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
								if( (( c.name == "RISTREAM" || c.name == "MODIFIERNETWORKINSTANCEDYNAMICSTREAM" )
									 	&& this.pssg.ptypes[cur] == "id") || (c.name == "MODIFIERNETWORKINSTANCEMODIFIERINPUT"
										&& this.pssg.ptypes[cur] == "source" ) ) {
									c.parts.push( new PART( this.pssg.ptypes[cur], "uint", 1 ) );
									c.parts[c.parts.length - 1].data = this.read( "uint", 1 );
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
							case "uint":
								c.parts.push( new PART( this.pssg.ptypes[cur], "uint", 1 ) );
								c.parts[c.parts.length - 1].data = this.read( "uint", 1 );
								break;
							case "int":
								c.parts.push( new PART( this.pssg.ptypes[cur], "int", 1 ) );
								c.parts[c.parts.length - 1].data = this.read( "int", 1 );
								break;
							case undefined:
								if( c.name == "SHADERINPUT" ) {
									this.rewind("int",2);
									c.parts.push( new PART( "data", "float", 3 ) );
									c.parts[c.parts.length - 1].data = this.read( "float", 3 );
								} else {
									c.parts.push( new PART( this.pssg.ptypes[cur], "int", 1 ) );
									c.parts[c.parts.length - 1].data = this.read( "int", 1 );
								}
								break;
						}
						switch( this.pssg.ctypes[cindex].name ) {
							case "LIBRARY": plibrary = i; break;
							case "DATABLOCK": pdatablock.n = i; c.parent = plibrary; break;
							case "DATABLOCKSTREAM": pdatablock.t = c.prop("dataType"); pdatastream = i; c.parent = pdatablock.n; break;
							case "TEXTURE": ptexture = i; c.parent = plibrary; break;
							case "TEXTUREIMAGEBLOCK": ptextureblock = i; c.parent = ptexture; break;
							case "SHADERGROUP": pshadergroup = i; c.parent = plibrary; break;
							case "SHADERPROGRAM": pshaderprogram = i; c.parent = plibrary; break;
							case "SHADERPROGRAMCODE": pshaderprogramcode.n = i; pshaderprogramcode.t = c.prop("codeType"); c.parent = pshaderprogram; break;
							case "CGSTREAM": c.parent = pshaderprogramcode.n; break;
							case "SHADERINPUT": c.parent = pshadergroup; break;
							case "SHADERINPUTDEFINITION":
								if( pshadergroup == "" ) c.parent = pshaderprogramcode.n;
								else c.parent = pshadergroup; break;
							case "SHADERSTREAMDEFINITION": c.parent = pshadergroup; break;
							case "SHADERGROUPPASS": c.parent = pshadergroup; break;
							case "RENDERDATASOURCE": prenderdata = i; c.parent = plibrary; break;
							case "RENDERINDEXSOURCE": prenderindex.n = i; prenderindex.t = c.prop("format"); c.parent = prenderdata; break;
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
		
		console.log( this.pssg.get("RENDERSTREAMINSTANCE") );
		console.log( this.pssg.get("LIBRARY") );
		
		var dbs = this.pssg.get("DATABLOCK"),
			sources = {}, blocks = {}, overall = {};
		
		for( var i = 0; i < dbs.length; i++ ) {
			var res = {}, c = dbs[i];
			res.id = c.prop("id");
			res.type = c.children[0].prop("renderType");
			res.data = c.children[0].children[0].prop("data");
			blocks[ res.id ] = res;
		}
		console.log( blocks );

		var rds = this.pssg.get("RENDERDATASOURCE");
		for( var i = 0; i < rds.length; i++ ) {
			var res = {}, c = rds[i];
			res.id = c.prop("id");
			res.streams = [];
			for( var j = 0; j < c.children.length; j++ ) {
				if( j == 0 ) {
					res.iid = c.children[j].prop("id");
					res.data = c.children[j].children[0].prop("data");
					res.type = c.children[j].prop("primitive");
				} else {
					var stream = {};
					stream.id = c.children[j].prop("id");
					stream.block = c.children[j].prop("dataBlock");
					res.streams.push( stream );
				}
			}
			sources[ res.id ] = res;
		}
		console.log( sources );

		for( var i in sources ) {
			c = sources[i];
			overall[ c.id ] = { v: [], n: [], t: [] };
			for( var j = 0; j < c.streams.length; j++ ) {
				switch( blocks[c.streams[j].block.substr(1)].type ) {
					case "SkinnableVertex": case "Vertex":
						for( var k = 0; k < c.data.length; k++ ) {
							overall[ c.id ].v.push( blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][0],
													blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][1],
													blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][2] );
						}
						break;
					case "SkinnableNormal": case "Normal":
						for( var k = 0; k < c.data.length; k++ ) {
							overall[ c.id ].n.push( blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][0],
													blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][1],
													blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][2] );
						}
						break;
					case "ST":
						for( var k = 0; k < c.data.length; k++ ) {
							overall[ c.id ].t.push( blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][0],
													blocks[c.streams[j].block.substr(1)].data[ c.data[k] ][1] );
						}
						break;
				}
			}
		}
		console.log( overall );
		
		var s = ""
		for( var i in overall ) {
			if( s !== "" ) s += "|";
			c = overall[i];
			for( var j = 0; j < c.v.length; j+=3 ) {
				s += c.v[j] +","+ c.v[j+1] + "," + c.v[j+2];
				if( c.v[j+3] !== undefined ) s += "=";
			} s += "[";
			for( var j = 0; j < c.n.length; j+=3 ) {
				s += c.n[j] +","+ c.n[j+1] + "," + c.n[j+2];
				if( c.n[j+3] !== undefined ) s += "=";
			} s += "[";
			for( var j = 0; j < c.t.length; j+=2 ) {
				s += c.t[j] +","+ c.t[j+1];
				if( c.t[j+2] !== undefined ) s += "=";
			}
		}
		
		document.getElementById("data").innerHTML = s;*/
		
		/*for( var i in dbs ) {
			var res = { id:"", type:"", data:"" };
			c = dbs[i];
			res.id = c.prop("id");
			c = c.children[0];
			res.type = c.prop("renderType");
			c = c.children[0];
			res.data = c.prop("data");
			if( overall[res.type] === undefined ) overall[res.type] = [];
			overall[res.type].push( { id: res.id, data: res.data } );
		}
		console.log( overall );
		var master = [];
		for( var i in overall["SkinnableVertex"] ) {
			c = overall["SkinnableVertex"][i];
			var w = 0, n = { v: "", n:"", t:"" };
			for( var j in overall["ST"] ) {
				if( overall["ST"][j].data.length == c.data.length )
					w = j;
			}
			n.v = c.data;
			n.n = overall["SkinnableNormal"][i].data;
			n.t = overall["ST"][w].data;
			master.push( n );
		}
		console.log( master );
		var s = "";
		
		for( var i in master ) {
			c = master[i];
			for( var j in c.v ) {
				s += c.v[j][0] +","+ c.v[j][1] + "," + c.v[j][2];
				if( c.v[parseInt(j)+1] !== undefined ) s += "=";
			} s += "[";
			for( var j in c.n ) {
				s += c.n[j][0] +","+ c.n[j][1] + "," + c.n[j][2];
				if( c.n[parseInt(j)+1] !== undefined ) s += "=";
			} s += "[";
			for( var j in c.t ) {
				s += c.t[j][0] +","+ c.t[j][1];
				if( c.t[parseInt(j)+1] !== undefined ) s += "=";
			}
			if( master[parseInt(i)+1] !== undefined ) s += "|";
		}
		
		document.getElementById("data").innerHTML = s;*/
		
		var tmp = new bIO.file("test.pssg");
		console.log( tmp );
		//console.log( this.dv.byteLength );
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
				for( var i = 0; i < amount; i++ )
					res.push( String.fromCharCode( this.dv.getInt8( offset + i * size[type] ) ) );
				break;
			case "ushort":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getUint16( offset+i*size[type] ) );
				break;
			case "short":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getUint8( offset + i * size[type] ) );
				break;
			case "uint":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getUint32( offset + i * size[type] ) );
				break;
			case "int":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getInt32( offset + i * size[type] ) );
				break;
			case "float":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getFloat32( offset + i * size[type] ) );
				break;
			case "double":
				for( var i = 0; i < amount; i++ )
					res.push( this.dv.getFloat64( offset + i * size[type] ) );
				break;
		}
		if( typeof arguments[2] == "undefined" || arguments[2] === false || arguments[2] === true )
			this.pointer += size[type] * amount;
		if( res.length == 1 ) return res[0];
		return res;
	},
	addTemplate: function() {
		this.ui.addTemplate();
	}
};

window.dC = new dCode();