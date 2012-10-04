__$r.prototype.$DAEModel = function $DAEModel( id, params ) {
	params = params || {};
	this.id = id;
	this.name = params.name || "noname";
	this.skeleton = new this.$skeleton( params );
	this.textures = {};
	
	this.mesh = new rin.$Mesh( params );
	this.inf = [];
	this.$v = [];
	this.$i = [];
	this.parents = {};
	this.stack = [];
	this.dt = 0;
	this.interval = "";
	this.pack = params.pack === undefined ? "models/" : "packs/"+params.pack+"/models/";
	this.file = "inc/"+this.pack+this.name+"/"+this.name+".dae";
	this.ready = false;
	this.init();
}

__$r.prototype.$DAEModel.prototype = {
	init: function() { rin.$Ajax( this, this.file, "parse", "xml" ); },
	parse: function( data ) {
		//rin.$Ajax( this, "test.txt", "finish" );*/
		var $sources = {}, source = "", stride = 0, $offsets = {}, max = 0, parents = [];
			polylist = getChildrenByTagName( data.getElementsByTagName( "library_geometries" )[0], "polylist" ), offset = 0,
			$c = "", $m = "", $a = "", $p = "", $i = 0, $j = 0, face = [], temp = "", prev = 0, $0 = 0;
		this.mesh.frame( 0 );
		this.mesh.node( 0 );
		for( var i in polylist ) {
			if( polylist[i].nodeType === 1 ) {
				$p = polylist[i].parentNode.parentNode.getAttribute( "id" );
				$m = polylist[i].getAttribute( "material" );
				$a = getChildrenByTagName( polylist[i], "p" )[0].textContent.trim().split(" ").map( parseFloat );
				this.mesh.mat( $m );
				this.mesh.textures[ $m ] = new rin.$Texture( $m, this.mesh );
				this.mesh.textures[ $m ].element.src = "inc/"+this.pack+this.name+"/textures/"+$m+".png";
				temp = getChildrenByTagName( polylist[i], "input" );
				for( var j in temp ) {
					if( temp[j].nodeType === 1 ) {
						source = this.getSource( data, data.getElementById( temp[j].getAttribute( "source" ).substring(1) ) );
						$c = source.getAttribute( "id" );
						offset = parseFloat( temp[j].getAttribute( "offset" ) );
						/* if source does not exist, grab the values */
						if( $sources[ $c ] === undefined ) {
							if( parents.indexOf( source.parentNode ) == - 1 ) {
								parents.push( source.parentNode );
								$0 += $j; $j = 0;
							}
							$sources[ $c ] = []; face = [];
							stride = parseFloat( doc( source ).getElementsByTagName( "accessor" )[0].getAttribute( "stride" ) );
							getChildrenByTagName( source, "float_array" )[0].textContent.trim().split(" ").map( parseFloat ).map( function( x ) {
								face.push( x ); if( face.length === stride ) { $sources[ $c ].push( face ); face = []; } });
						}
						/* populate vertex/normal/texture/position */
						face = [];
						switch( temp[j].getAttribute( "semantic" ).toLowerCase() ) {
							case "vertex": if( $offsets[ $p ] === undefined ) { $offsets[ $p ] = [ $c, prev ]; }
								prev += $sources[$c].length; for( var k = offset; k < $a.length; k += 3 ) {
								this.mesh.vertex( $sources[$c][ $a[k] ][0], $sources[$c][ $a[k] ][1], $sources[$c][ $a[k] ][2] );
								this.$v.push( [ $sources[$c][ $a[k] ][0], $sources[$c][ $a[k] ][1], $sources[$c][ $a[k] ][2] ] );
								if( this.$i[$a[k]+$0] === undefined ) { this.$i[$a[k]+$0] = []; $j++; } this.$i[ $a[k] +$0].push( this.$v.length - 1 );
								face.push( $i ); $i++; if( face.length === 3 ) { this.mesh.face( face[0], face[1], face[2] ); face = []; } } break;
							case "normal": for( var k = offset; k < $a.length; k += 3 ) {
								this.mesh.normal( $sources[$c][ $a[k] ][0], $sources[$c][ $a[k] ][1], $sources[$c][ $a[k] ][2] ); } break;
							case "texcoord": for( var k = offset; k < $a.length; k += 3 ) {
								this.mesh.texture( $sources[$c][ $a[k] ][0], $sources[$c][ $a[k] ][1] ); } break;
						}
					}
				}
			}
		}
		/* grab skeleton */
		var skel = data.getElementsByTagName( "node" )[0],
			nodes = skel.childNodes, root = "";
		for( var i = 0; i < nodes.length; i++ ) {
			if( nodes[i].nodeType === 1 && nodes[i].tagName == "node" ) {
				root = nodes[i]; break;
			}
		}
		this.skeleton.addBone( new this.$bone( root.getAttribute( "id" ), null ), true );
		this.skeleton.setRoot( root.getAttribute( "id" ) );
		this.skeleton.setData( doc( root ) );
		nodes = getChildrenByTagName( root, "node" );
		for( var i = 0; i < nodes.length; i++ ) {
			if( nodes[i].nodeType === 1 && nodes[i].tagName == "node" ) {
				if( nodes[i].getAttribute("id") != root.getAttribute("id") ) {
					this.skeleton.addNode( nodes[i].parentNode.getAttribute("id"),
						new this.$bone( nodes[i].getAttribute("id"), nodes[i].parentNode.getAttribute("id") ) );
				}
			}
		}
		this.skeleton.getMatrices();
		
		/* grab skin data */
		var $0 = 0, count = 0;
		for( var i in $offsets ) {
			var skin = getElementsByAttribute( data, "skin", "source", "#"+i )[0], param = "",
				vcount = getChildrenByTagName( skin, "vcount" )[0].textContent.trim().split(" ").map( parseFloat ),
				v = getChildrenByTagName( skin, "v" )[0].textContent.trim().split(" ").map( parseFloat ),
				$0 = parseInt($0) + count,
				count = parseFloat( getChildrenByTagName( skin, "vertex_weights" )[0].getAttribute( "count" ) );
				nodes = getChildrenByTagName( skin, "input" ), temp = 0;
			for( var j in nodes ) {
				if( nodes[j].nodeType === 1 ) {
					source = this.getSource( data, data.getElementById( nodes[j].getAttribute( "source" ).substring(1) ) );
					$c = source.getAttribute( "id" );
					if( $sources[ $c ] === undefined ) {
						$sources[ $c ] = []; face = [];
						stride = parseFloat( doc( source ).getElementsByTagName( "accessor" )[0].getAttribute( "stride" ) );
						param = doc( source ).getElementsByTagName( "param" )[0].getAttribute( "type" );
						getChildrenByTagName( source, ["float_array","Name_array"] )[0].textContent.trim().split(" ").map( function( x ) {
							face.push( param == "name" ? x : parseFloat(x) ); if( face.length === stride ) {
							$sources[ $c ].push( stride === 1 ? face[0] : face ); face = []; } });
					}
					if( nodes[j].parentNode.tagName == "vertex_weights" ) {
						switch( nodes[j].getAttribute( "semantic" ).toLowerCase() ) {
							case "joint": $i = 0; for( var k in vcount ) { for( var l = 0; l < vcount[k]; l++ ) {
								//this.skeleton.bones[ $sources[$c][ v[$i] ] ].addTarget( parseInt(k) + parseInt($0) );
								//if( this.all.vertex[ parseInt(k) + parseInt($0) ] === undefined ) this.all.vertex[ parseInt(k)+parseInt($0) ] = [];
								if ( this.skeleton.inf[ $sources[$c][ v[$i] ] ] === undefined ) {
									this.skeleton.inf[ $sources[$c][ v[$i] ] ] = {};
								} if ( this.skeleton.inf[ $sources[$c][ v[$i] ] ][ parseInt(k) + parseInt($0) ] === undefined ) {
									this.skeleton.inf[ $sources[$c][ v[$i] ] ][ parseInt(k) + parseInt($0) ] = []; } $i+=2;
								} } prev = $c; break;
							case "weight": $i = 1; for( var k in vcount ) { for( var l = 0; l < vcount[k]; l++ ) {
								//this.skeleton.bones[ $sources[prev][ v[$i-1] ] ].addWeight( parseFloat( $sources[$c][ v[$i] ] ) );
								if( this.inf[ parseInt(k) + parseInt($0) ] === undefined ) this.inf[ parseInt(k) + parseInt($0) ] = {};
								if( this.inf[ parseInt(k) + parseInt($0) ][ $sources[prev][v[$i-1]] ] === undefined ) 
									this.inf[ parseInt(k) + parseInt($0) ][ $sources[prev][v[$i-1]] ] = 1;
								this.inf[ parseInt(k) + parseInt($0) ][$sources[prev][v[$i-1]]] = parseFloat( $sources[$c][ v[$i] ] );
								this.skeleton.inf[ $sources[prev][ v[$i-1] ] ][ parseInt(k) + parseInt($0) ].push( parseFloat( $sources[$c][ v[$i] ] ) );
								$i+=2; } } break;
						}
					} else {
						switch( nodes[j].getAttribute( "semantic" ).toLowerCase() ) {
							case "joint": prev = $c; break;
							case "inv_bind_matrix": $i = 0; for( var k in $sources[prev] ) {
								if( this.skeleton.bones[$sources[prev][k]] === undefined ) nothing();
								else {
									this.skeleton.bones[ $sources[prev][k] ].iMatrix = mat4.create(
										$sources[$c][$i][0],$sources[$c][$i][1],$sources[$c][$i][2],$sources[$c][$i][3],
										$sources[$c][$i][4],$sources[$c][$i][5],$sources[$c][$i][6],$sources[$c][$i][7],
										$sources[$c][$i][8],$sources[$c][$i][9],$sources[$c][$i][10],$sources[$c][$i][11],
										$sources[$c][$i][12],$sources[$c][$i][13],$sources[$c][$i][14],$sources[$c][$i][15] );
									/*this.skeleton.bones[ $sources[prev][k]].iQuat = quat.fromRotationMatrix(
										this.skeleton.bones[ $sources[prev][k] ].iMatrix );
									this.skeleton.bones[ $sources[prev][k]].iTran = vec3.create(
										this.skeleton.bones[ $sources[prev][k] ].iMatrix[3],
										this.skeleton.bones[ $sources[prev][k] ].iMatrix[7],
										this.skeleton.bones[ $sources[prev][k] ].iMatrix[11] );*/
								}
								$i++; } break;
						}
					}
				}
			}
		}
		this.createSkeleton();
		//console.log( this.all.vertex, this.$v, this.$i );
		for( var i in this.$i ) {
			for( var j in this.$i[i] ) {
				max = Math.max( max, this.$i[i][j] );
			}
		} console.log( max, this.$v, this.$i, this.skeleton.inf, this.inf );
		
		/* grab animation data */
		var anilist = getChildrenByTagName( data.getElementsByTagName( "library_animations" )[0], "input" );
		for( var i in anilist ) {
			if( anilist[i].nodeType === 1 ) {
				source = this.getSource( data, data.getElementById( anilist[i].getAttribute( "source" ).substring(1) ) );
				$c = source.getAttribute( "id" );
				if( $sources[ $c ] === undefined ) {
					$sources[ $c ] = []; face = [];
					stride = parseFloat( doc( source ).getElementsByTagName( "accessor" )[0].getAttribute( "stride" ) );
					param = doc( source ).getElementsByTagName( "param" )[0].getAttribute( "type" );
					getChildrenByTagName( source, ["float_array","Name_array"] )[0].textContent.trim().split(" ").map( function( x ) {
						face.push( param == "name" ? x : parseFloat(x) ); if( face.length === stride ) {
						$sources[ $c ].push( stride === 1 ? face[0] : face ); face = []; } });
				}
				$p = getChildrenByTagName( source.parentNode, "channel" )[0].getAttribute( "target" );
				$p = $p.substring( 0, $p.indexOf("/") )
				switch( anilist[i].getAttribute( "semantic" ).toLowerCase() ) {
					case "input": for( var k in $sources[$c] ) { if( this.skeleton.bones[$p] !== undefined ) {
						this.skeleton.bones[ $p ].anima.ident[ $sources[$c][k] ] = this.skeleton.bones[$p].anima.time.length;
						this.skeleton.bones[ $p ].anima.time.push( $sources[$c][k] ); } } break;
					case "output": for( var k in $sources[$c] ) { if( this.skeleton.bones[$p] !== undefined ) {
						this.skeleton.bones[ $p ].anima.matrix.push( $sources[$c][k] );
						/*this.skeleton.bones[$p].anima.quat.push(quat.fromRotationMatrix($sources[$c][k]));
						this.skeleton.bones[$p].anima.tran.push( vec3.create(
							$sources[$c][k][3], $sources[$c][k][7], $sources[$c][k][11] ) );*/ } } break;
					case "interpolation": for( var k in $sources[$c] ) { if( this.skeleton.bones[$p] !== undefined ) {
						this.skeleton.bones[ $p ].anima.interp.push( $sources[$c][k] ); } } break;
				}
			}
		} 
		console.log( this.skeleton );
		this.mesh.init();
		if( anilist.length > 0 ) this.buffer();
		else this.ready = true;
		//this.ready = true;
	},
	$skeleton: function $skeleton( params ) { this.init( params ); },
	$bone: function $bone( id, parent ) { this.init( id, parent ); },
	getSource: function( data, element ) {
		if( element.tagName.toLowerCase() == "vertices" ) {
			return data.getElementById( element.childNodes[1].getAttribute( "source" ).substring(1) );
		} else if( element.tagName.toLowerCase() == "source" ) return element;
	},
	createSkeleton: function() {
		var current = "", prev = "", temp = "", $i = 0, loc1 = "", loc2 = "";
		this.skeleton.mesh.frame(0);
		this.skeleton.mesh.node(0);
		this.skeleton.mesh.mat(0);
		for( var i in this.skeleton.bones ) {
			current = this.skeleton.bones[i];
			for( var j in this.skeleton.inf[ current.id ] ) {
				for( var k in this.$i[ parseInt(j) ] ) {
					temp = temp === "" ? vec3.create( this.$v[ this.$i[ parseInt(j) ][k] ] ) :
						vec3.average( temp, this.$v[ this.$i[ parseInt(j) ][k] ] );
				}
			}
			current.location = temp;
			temp = "";
		}
		for( var i in this.skeleton.bones ) {
			current = this.skeleton.bones[i];
			loc1 = current.location
			if( current.parent !== null ) {
				loc2 = this.skeleton.bones[ current.parent ].location;
				this.skeleton.mesh.vertex( loc1[0], loc1[1], loc1[2] );
				this.skeleton.mesh.vertex( loc2[0], loc2[1], loc2[2] );
				this.skeleton.mesh.line( $i++, $i++ );
			} for( var j in current.children ) {
				loc2 = this.skeleton.bones[ current.children[j] ].location;
				this.skeleton.mesh.vertex( loc1[0], loc1[1], loc1[2] );
				this.skeleton.mesh.vertex( loc2[0], loc2[1], loc2[2] );
				this.skeleton.mesh.line( $i++, $i++ );
			}
		}
		this.skeleton.mesh.init();
	},
	apply: function( dt ) {
		//var temp = this.mesh.ba.vba[0].slice(), temp2 = "";
		var temp2 = "";
		for( var i in this.inf ) {
			for( var k in this.$i[ i ] ) {
				temp2 = [0,0,0];
				for( var j in this.inf[i] ) {
					temp2 = vec3.add( temp2, vec3.scale( vec3.transform( this.$v[ this.$i[i][k] ],
						this.skeleton.bones[ j ].sMatrix[dt] ), this.inf[i][j] ) );
				}
				//temp[ this.$i[i][k] * 3 ] = temp2[0];
				//temp[ this.$i[i][k] * 3 + 1 ] = temp2[1];
				//temp[ this.$i[i][k] * 3 + 2 ] = temp2[2];
				this.mesh.alterVertex( this.$i[i][k] * 3, temp2 );
			}
		}
		//this.skeleton.animations[ dt ].v = temp;
		//if( this.skeleton.animations[ dt + 1 ] !== undefined ) this.buffer( dt + 1 );
		//else { this.ready = true; /*this.start();*/ }
	},
	setBoneMats: function( dt ) {
		for( var i in this.parents ) {
			gl.uniformMatrix4fv( gl.getUniformLocation( rin.program(), "sMats["+this.parents[ i ]+"]" ),
				false, mat4.flatten( this.skeleton.bones[i].sMatrix[ dt ] ) );
		}
	},
	process: function( dt ) {
		if( this.stack.length === 0 ) {
			//this.apply( dt );
			if( dt + 1 != this.skeleton.animations.length ) this.buffer( dt + 1 );
			else {
				var bdata = [], wdata = [], temp2 = "", m = 0;
				for( var i in this.inf ) {
					for( var k in this.$i[ i ] ) {
						bdata[ this.$i[i][k] ] = new Array( -1, -1, -1, -1 );
						wdata[ this.$i[i][k] ] = new Array( -1, -1, -1, -1 ); m = 0;
						for( var j in this.inf[i] ) {
							bdata[ this.$i[i][k] ][ m ] = this.parents[ j ];
							wdata[ this.$i[i][k] ][ m ] = this.inf[i][k]; m++;
						}
					}
				} for( var i in bdata ) {
					this.mesh.ba.b.push( bdata[i][0], bdata[i][1], bdata[i][2], bdata[i][3] );
					this.mesh.ba.w.push( wdata[i][0], wdata[i][1], wdata[i][2], wdata[i][3] );
				}
				this.setBoneMats( 0 );
				console.log( bdata, this.parents );
				this.dt = 0;
				this.ready = true;
			} return; }
		var bone = this.stack.pop(), inf = "",
			bone = this.skeleton.bones[ bone ];
		if( this.parents[bone.id] === undefined ) { this.parents[bone.id] = this.dt; this.dt++; }
		bone.matrix = bone.jMatrix;
		if( dt !== undefined ) if( this.skeleton.bones[this.skeleton.root].anima.time[dt] !== undefined ) {
			bone.matrix = bone.anima.matrix[dt]; }
		if( bone.parent !== null ) bone.matrix = mat4.multiply( this.skeleton.bones[bone.parent].matrix, bone.matrix );
		bone.sMatrix[dt] = mat4.multiply( bone.matrix, bone.iMatrix );
		for( var i in bone.children ) this.stack.push( bone.children[i] );
		this.process( dt );
	},
	buffer: function( dt ) {
		//console.log( "1" );
		if( this.skeleton.animations.length === 0 )
			for( var i in this.skeleton.bones[this.skeleton.root].anima.ident )
				this.skeleton.animations.push( new Array() );
		this.stack = []; var bone = "";
		this.stack.push( this.skeleton.root );
		if( dt === undefined ) dt = 0;
		this.process( dt );
	},
	update: function() { this.mesh.ba.vba2 = this.skeleton.animations[ this.dt ].v;
		this.dt++; if( this.skeleton.animations[ this.dt ]===undefined ) this.dt = 0; },
	start: function() { var mod = this; this.interval = setInterval( function() { mod.update(); }, 100 ); },
	render: function() {
		if( this.ready ) {
			if( Settings.flags.showBoundingBox && this.mesh.bbox !== true ) {
					this.mesh.bbox.box = new rin.$Primitive( "cube",
						{ xmin: this.mesh.bbox.min.x, ymin: this.mesh.bbox.min.y, zmin: this.mesh.bbox.min.z,
				  		  xmax: this.mesh.bbox.max.x, ymax: this.mesh.bbox.max.y, zmax: this.mesh.bbox.max.z,
			  			  bbox: true, method: "wire", physics: false } ).render(); }
			if( Settings.flags.showSkeleton ) {
				this.skeleton.mesh.render();
			} else this.mesh.render();
		}
	}
}

__$r.prototype.$DAEModel.prototype.$skeleton.prototype = {
	init: function( params ) {
		params = params || {};
		this.bones = {};
		this.animations = [];
		this.inf = {};
		this.root = "";
		this.count = 0;
		this.data = "";
		this.mesh = new rin.$Mesh( { bbox: true, physics: false, mode: gl.LINES, position: params.position } );
	},
	setRoot: function( root ) { this.root = root; },
	setData: function( data ) { this.data = data; },
	addBone: function( bone, root ) {
		this.count++;
		this.bones[ bone.id ] = bone;
		if( root === true ) this.root = bone.id;
	},
	addNode: function( parent, node ) {
		this.count++;
		this.bones[ node.id ] = node;
		this.bones[ parent ].addBone( node.id );
	},
	getMatrices: function() {
		for( var i in this.bones ) {
			this.bones[i].readMatrix( this.data, this );
		}
	}
}

__$r.prototype.$DAEModel.prototype.$bone.prototype = {
	init: function( id, parent ) {
		this.id = id;
		this.parent = parent;
		this.children = [];
		this.location = "";
		this.anima = { ident: {}, time: [], matrix: [], quat: [], tran: [], interp: [] };
		this.weights = [];
		this.targets = [];
		
		this.jMatrix = "";
		//this.jQuat = "";
		//this.jTran = "";
		
		this.iMatrix = "";
		//this.iQuat = "";
		//this.iTran = "";
		
		this.sMatrix = [];
		//this.sQuat = "";
		//this.sTran = "";
		
		this.matrix = "";
		//this.quat = "";
		//this.tran = "";
	},
	addBone: function( bone ) { this.children.push( bone ); },
	addTarget: function( target ) { this.targets.push( target ); },
	addWeight: function( weight ) { this.weights.push( weight ); },
	readMatrix: function( data, skel ) {
		var temp = data.getElementById( this.id ).childNodes[1].textContent.trim().split(" ").map( parseFloat );
		this.jMatrix = mat4.create( temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7],
								   temp[8], temp[9], temp[10], temp[11], temp[12], temp[13], temp[14], temp[15] );
		//this.jQuat = quat.fromRotationMatrix( this.jMatrix );
		//this.jTran = vec3.create( this.jMatrix[3], this.jMatrix[7], this.jMatrix[11] );
	}
}