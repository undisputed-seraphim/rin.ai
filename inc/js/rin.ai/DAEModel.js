__$r.prototype.$DAEModel = function $DAEModel( id, params ) {
	params = params || {};
	this.id = id;
	this.name = params.name || "noname";
	this.skeleton = new this.$skeleton( params );
	this.mesh = new rin.$Mesh( params );
	this.textures = {};
	
	this.animations = 0;
	this.amap = params.amap || { "default": [0, 2] }
	this.anima = "default";
	
	this.inf = [];
	this.$v = [];
	this.$i = [];
	this.parents = {};
	this.stack = [];
	this.dt = this.amap[this.anima][0];
	this.interval = "";
	this.prev = 0;
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
								}
								$i++; } break;
						}
					}
				}
			}
		}
		this.createSkeleton();
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
				$p = $p.substring( 0, $p.indexOf("/") );
				switch( anilist[i].getAttribute( "semantic" ).toLowerCase() ) {
					case "input": for( var k in $sources[$c] ) { if( this.skeleton.bones[$p] !== undefined ) {
						this.skeleton.bones[ $p ].anima.ident[ $sources[$c][k] ] = this.skeleton.bones[$p].anima.time.length;
						this.skeleton.bones[ $p ].anima.time.push( $sources[$c][k] );
						this.skeleton.times[ k ] = $sources[$c][k]; } } break;
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
		$bcheck = [];
		for( var i = 0; i < this.inf.length; i++ ) {
			/* grab values for current index */
			var btmp = [-1.0,-1.0,-1.0,-1.0];
			var wtmp = [0,0,0,0];
			var $$i = 0;
			for( var k in this.inf[i] ) {
				if( $bcheck[this.skeleton.ident[k]] == undefined )
					$bcheck[this.skeleton.ident[k]] = k;
				btmp[$$i] = this.skeleton.ident[k];
				wtmp[$$i] = this.inf[i][k];
				$$i++;
			}
			for( var j = 0; j < this.$i[i].length; j++ ) {
				this.mesh.ba.b[this.$i[i][j]*4] = btmp[0];
				this.mesh.ba.b[this.$i[i][j]*4+1] = btmp[1];
				this.mesh.ba.b[this.$i[i][j]*4+2] = btmp[2];
				this.mesh.ba.b[this.$i[i][j]*4+3] = btmp[3];
				this.mesh.ba.w[this.$i[i][j]*4] = wtmp[0];
				this.mesh.ba.w[this.$i[i][j]*4+1] = wtmp[1];
				this.mesh.ba.w[this.$i[i][j]*4+2] = wtmp[2];
				this.mesh.ba.w[this.$i[i][j]*4+3] = wtmp[3];
			}
		}
		this.mesh.init();
		if( anilist.length > 0 ) {
			this.animations = anilist.length;
			this.mesh.animated = true;
			this.buffer();
			this.start();
		} else {
			this.mesh.animated = false;
			this.ready = true;
		}
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
		this.stack = [];
		this.stack.push( this.skeleton.root );
		var next = this.dt+1;
		
		for( var i = 0; this.stack.length != 0; i++ ) {
			current = this.stack.pop();
			var bone = this.skeleton.bones[current];
			var qtmp = bone.sQuat[this.dt];
			var ttmp = bone.sTran[this.dt];
			if( dt != 0 ) {
				//qtmp = bone.sQuat[this.dt];
				//ttmp = [ bone.sMatrix[this.dt][3], bone.sMatrix[this.dt][7], bone.sMatrix[this.dt][11] ];
				//qtmp = mat4.lerp( bone.sMatrix[this.dt], bone.sMatrix[next], dt );
				//if( quat.range( bone.sQuat[this.dt], bone.sQuat[next] ) ) {
					qtmp = quat.slerp( bone.sQuat[this.dt], bone.sQuat[next], dt );
					ttmp = vec3.lerp( bone.sTran[this.dt], bone.sTran[next], dt );
				//}
			}
			this.mesh.alterBone( this.skeleton.ident[current], qtmp, ttmp );
			//this.mesh.alterBone( this.skeleton.ident[current], qtmp );
			//gl.uniform4f( gl.getUniformLocation( rin.program(), "quats["+this.skeleton.ident[current]+"]" ),
			//	qtmp[0], qtmp[1], qtmp[2], qtmp[3] );
			//gl.uniform3f( gl.getUniformLocation( rin.program(), "trans["+this.skeleton.ident[current]+"]" ),
			//	ttmp[0], ttmp[1], ttmp[2] );
				
			for( var j in bone.children )
				this.stack.push( bone.children[j] );
		}
	},
	buffer: function() {
		var str = "";
		for( var dt = 0; dt < this.skeleton.bones[this.skeleton.root].anima.time.length; dt++ ) {
			this.stack = [];
			this.stack.push( this.skeleton.root );
			for( var i = 0; this.stack.length != 0; i++ ) {
				current = this.stack.pop();
				var bone = this.skeleton.bones[current];
				bone.matrix = bone.jMatrix;
				bone.matrix = bone.anima.matrix[dt];
				if( bone.parent != null ) bone.matrix = mat4.multiply( this.skeleton.bones[bone.parent].matrix, bone.matrix );
				bone.sMatrix[dt] = mat4.multiply( bone.matrix, bone.iMatrix );
				bone.sQuat[dt] = mat4.quat( bone.sMatrix[dt] );
				bone.sTran[dt] = vec3.create( bone.sMatrix[dt][3], bone.sMatrix[dt][7], bone.sMatrix[dt][11] );
				//str += bone.sTran[dt][0]+" "+bone.sTran[dt][1]+" "+bone.sTran[dt][2]+"\n";
				//if( dt == 0 ) this.mesh.alterBone( i, bone.sMatrix[0] );
				if( dt == 0 ) this.mesh.alterBone( i, bone.sQuat[0], bone.sTran[0] );
			
				for( var j in bone.children )
					this.stack.push( bone.children[j] );
			}
		}
		this.ready = true;
		//var mod = new rin.$Mod( this.name, this );
		//console.log( str );
		//r.scene.cameras[0].attach( r.scene.models[0] ); 
	},
	update: function() {
		//this.dt = 11;
		//this.apply(0);
		//return;
		if( this.prev == 0 ) {
			this.dt = this.amap[this.anima][0];
			this.prev = new Date().getTime();
			this.apply( 0 );
		} else {
			var next = -1, dif = 0, nnext = 0;
			
			if( this.dt+1 == this.amap[this.anima][1] ) {
				this.dt = this.amap[this.anima][0];
				this.prev = (new Date().getTime());
				this.apply(0);
				return;
			} else next = this.dt+1;
			
			dif = ((new Date().getTime() - this.prev + this.skeleton.times[this.amap[this.anima][0]] * 1000) / 1000);
			
			if( dif < this.skeleton.times[next] ) {
				this.apply( (dif - this.skeleton.times[this.dt]) / this.skeleton.times[next] );
			} else if( dif == this.skeleton.times[next] ) {
				this.dt++;
				if( this.dt+1 == this.amap[this.anima][1] ) {
					this.dt = this.amap[this.anima][0];
					this.prev = new Date().getTime();
					this.apply(0);
				} else {
					this.apply( 0 );
				}
			} else {
				this.dt++;
				if( this.dt+1 == this.amap[this.anima][1] ) {
					this.dt = this.amap[this.anima][0];
					this.prev = new Date().getTime();
					this.apply(0);
				} else {
					nnext = this.dt+1;
					this.apply( dif - this.skeleton.times[this.dt] );
				}
			}
		}
	},
	animate: function( name ) {
		if(this.amap[name] !== undefined ) {
			this.anima = name;
			this.dt = this.amap[this.anima][0];
			clearInterval( this.invertal );
			this.prev = 0;
			this.start();
		}
		else this.anima = "default";
	},
	start: function() { /*var mod = this; this.interval = setInterval( function() { mod.update(); }, 7 );*/ },
	render: function() {
		if( this.ready ) {
			if( Settings.flags.showBoundingBox && this.mesh.bbox !== true ) {
					this.mesh.bbox.box = new rin.$Primitive( "cube",
						{ xmin: this.mesh.bbox.min.x, ymin: this.mesh.bbox.min.y, zmin: this.mesh.bbox.min.z,
				  		  xmax: this.mesh.bbox.max.x, ymax: this.mesh.bbox.max.y, zmax: this.mesh.bbox.max.z,
			  			  bbox: true, method: "wire", physics: false } ).render(); }
			if( Settings.flags.showSkeleton ) {
				this.mesh.animated = false;
				this.skeleton.mesh.render();
			} else {
				if( this.animations > 0 ) this.mesh.animated = true;
				this.update();
				this.mesh.render();
			}
		}
	}
}

__$r.prototype.$DAEModel.prototype.$skeleton.prototype = {
	init: function( params ) {
		params = params || {};
		this.bones = {};
		this.ident = {};
		this.animations = [];
		this.times = [];
		this.inf = {};
		this.root = "";
		this.count = 0;
		this.data = "";
		this.mesh = new rin.$Mesh( { bbox: true, physics: false, mode: gl.LINES, position: params.position } );
	},
	setRoot: function( root ) { this.root = root; },
	setData: function( data ) { this.data = data; },
	addBone: function( bone, root ) {
		this.ident[ bone.id ] = this.count;
		this.count++;
		this.bones[ bone.id ] = bone;
		if( root === true ) this.root = bone.id;
	},
	addNode: function( parent, node ) {
		this.ident[ node.id ] = this.count;
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
		this.iMatrix = "";
		this.sMatrix = [];
		this.sQuat = [];
		this.sTran = [];
		this.matrix = "";
	},
	addBone: function( bone ) { this.children.push( bone ); },
	addTarget: function( target ) { this.targets.push( target ); },
	addWeight: function( weight ) { this.weights.push( weight ); },
	readMatrix: function( data, skel ) {
		var temp = data.getElementById( this.id ).childNodes[1].textContent.trim().split(" ").map( parseFloat );
		this.jMatrix = mat4.create( temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7],
								   temp[8], temp[9], temp[10], temp[11], temp[12], temp[13], temp[14], temp[15] );
	}
}