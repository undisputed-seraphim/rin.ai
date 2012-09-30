__$r.prototype.$DAEModel = function $DAEModel( id, params ) {
	params = params || {};
	this.id = id;
	this.name = params.name || "noname";
	this.skeleton = new this.$skeleton( params );
	this.textures = {};
	
	this.mesh = new rin.$Mesh( params );
	this.all = { vertex: {} };
	this.$v = [];
	this.$i = [];
	this.file = "inc/models/"+this.name+"/"+this.name+".dae";
	this.init();
}

__$r.prototype.$DAEModel.prototype = {
	init: function() {
		rin.$Ajax( this, this.file, "parse", "xml" );
	},
	parse: function( data ) {
		//rin.$Ajax( this, "test.txt", "finish" );*/
		var $sources = {}, source = "", stride = 0, $offsets = {}, max = 0,
			polylist = getChildrenByTagName( data.getElementsByTagName( "library_geometries" )[0], "polylist" ), offset = 0,
			$c = "", $m = "", $a = "", $p = "", $i = 0, face = [], temp = "", prev = 0;
		this.mesh.frame( 0 );
		this.mesh.node( 0 );
		for( var i in polylist ) {
			if( polylist[i].nodeType === 1 ) {
				$p = polylist[i].parentNode.parentNode.getAttribute( "id" );
				$m = polylist[i].getAttribute( "material" );
				$a = getChildrenByTagName( polylist[i], "p" )[0].textContent.trim().split(" ").map( parseFloat );
				this.mesh.mat( $m );
				this.mesh.textures[ $m ] = new rin.$Texture( $m, this.mesh );
				this.mesh.textures[ $m ].element.src = "inc/models/"+this.name+"/textures/"+$m+".png";
				temp = getChildrenByTagName( polylist[i], "input" );
				for( var j in temp ) {
					if( temp[j].nodeType === 1 ) {
						source = this.getSource( data, data.getElementById( temp[j].getAttribute( "source" ).substring(1) ) );
						$c = source.getAttribute( "id" );
						offset = parseFloat( temp[j].getAttribute( "offset" ) );
						/* if source does not exist, grab the values */
						if( $sources[ $c ] === undefined ) {
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
								if( this.$i[$a[k]] === undefined ) this.$i[$a[k]] = []; this.$i[ $a[k] ].push( this.$v.length - 1 );
								this.all.vertex[ $c ] = $sources[$c];
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
		var $0 = 0;
		for( var i in $offsets ) {
			var skin = getElementsByAttribute( data, "skin", "source", "#"+i )[0], param = "",
				vcount = getChildrenByTagName( skin, "vcount" )[0].textContent.trim().split(" ").map( parseFloat ),
				v = getChildrenByTagName( skin, "v" )[0].textContent.trim().split(" ").map( parseFloat ),
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
								this.skeleton.bones[ $sources[$c][ v[$i] ] ].addTarget( parseFloat(k) + $0 ); $i+=2;
								} } $0 += count; prev = $c; break;
							case "weight": $i = 1; for( var k in vcount ) { for( var l = 0; l < vcount[k]; l++ ) {
								this.skeleton.bones[ $sources[prev][ v[$i-1] ] ].addWeight( parseFloat( $sources[$c][ v[$i] ] ) ); $i+=2;
								} } break;
						}
					} else {
						switch( nodes[j].getAttribute( "semantic" ).toLowerCase() ) {
							case "joint": prev = $c; break;
							case "inv_bind_matrix": $i = 0; for( var k in $sources[prev] ) {
								if( this.skeleton.bones[$sources[prev][k]] === undefined ) nothing();
								else this.skeleton.bones[ $sources[prev][k] ].iMatrix = mat4.create(
									$sources[$c][$i][0],$sources[$c][$i][1],$sources[$c][$i][2],$sources[$c][$i][3],
									$sources[$c][$i][4],$sources[$c][$i][5],$sources[$c][$i][6],$sources[$c][$i][7],
									$sources[$c][$i][8],$sources[$c][$i][9],$sources[$c][$i][10],$sources[$c][$i][11],
									$sources[$c][$i][12],$sources[$c][$i][13],$sources[$c][$i][14],$sources[$c][$i][15] );
								$i++; } break;
						}
					}
				}
			}
		}
		this.skeleton.clean();
		this.createSkeleton();
		//console.log( this.all.vertex, this.$v, this.$i );
		for( var i in this.$i ) {
			for( var j in this.$i[i] ) {
				max = Math.max( max, this.$i[i][j] );
			}
		} console.log( max );
		
		/* grab animation data */
		this.mesh.init();
		for( var i in this.skeleton.bones ) {
			this.animate( this.skeleton.bones[i].id ); break;
		}
	},
	$skeleton: function $skeleton( params ) { this.init( params ); },
	$bone: function $bone( id, parent ) { this.init( id, parent ); },
	getSource: function( data, element ) {
		if( element.tagName.toLowerCase() == "vertices" ) {
			return data.getElementById( element.childNodes[1].getAttribute( "source" ).substring(1) );
		} else if( element.tagName.toLowerCase() == "source" ) return element;
	},
	/*finish: function( data ) {
		var $questions = [], current = 0, $answers = [], $letter = "";
		data = data.split("\n");
		//new RegExp( "(^|\\s)" + strAttributeValue + "(\\s|$)", "i" )
		for( var i in data ) {
			if( new RegExp( "[\\d].\t" ).test( data[i] ) ) {
				$current = $questions.length;
				$letter = "";
				$questions.push( data[i].substring( data[i].indexOf("\t") +1 ) );
				$answers[$current] = {};
			} else if( new RegExp( "[\\w][)]\t" ).test( data[i] ) ) {
				$letter = data[i].substring( 0, data[i].indexOf(")") );
				$answers[ $current ][ data[i].substring( 0, data[i].indexOf(")") ) ] = data[i].substring( data[i].indexOf("\t") +1 );
			} else if( new RegExp( "Answer:" ).test( data[i] ) ) {
				$answers[ $current ].answer = data[i].trim().substring( data[i].trim().lastIndexOf(" ") +1 );
			} else {
				if( data[i].trim() != "" && data[i].substring(0, 4) != "TYPE" && data[i].substring(0, 6) != "POINTS" ) {
					if( $letter === "" ) { $questions[$current] += '\n'+data[i].trim(); }
					else { $answers[ $current ][ $letter ] += data[i].trim(); }
				}
			}
		}
		for( var i in $questions ) {
			$questions[i] = $questions[i].replace(/>/g, "&gt;").replace(/</g,"&lt;").replace(/=/g,"\\=").replace(/{/g,"\\{").replace(/}/g,"\\}")
				.replace(/[\u2018|\u2019|\u201A]/g, "\'").replace(/[\u201C|\u201D|\u201E]/g, "\"").replace(/[\u2013|\u2014]/g, "-")
				.replace(/[\u2265]/g, "&ge;").replace(/[\u2264]/g, "&le;").replace(/[\u2022]/g, "&#8226;").replace(/\u2026/g, "...");
			$questions[i] += "{";
			for( var j in $answers[i] ) {
				$answers[i][j] = $answers[i][j].replace(/>/g, "&gt;").replace(/</g,"&lt;").replace(/=/g,"\\=").replace(/{/g,"\\{").replace(/}/g,"\\}")
					.replace(/[\u2018|\u2019|\u201A]/g, "\'").replace(/[\u201C|\u201D|\u201E]/g, "\"").replace(/[\u2013|\u2014]/g, "-")
					.replace(/[\u2265]/g, "&ge;").replace(/[\u2264]/g, "&le;").replace(/[\u2022]/g, "&#8226;").replace(/\u2026/g, "...");
			}
		}
		console.log( $questions, $answers );
		for( var i in $questions ) {
			document.getElementById("t").value += $questions[i] + '\n';
			document.getElementById("t").value += ($answers[i].answer == "a" ? "="+$answers[i].a : "~"+$answers[i].a) + '\n';
			document.getElementById("t").value += ($answers[i].answer == "b" ? "="+$answers[i].b : "~"+$answers[i].b) + '\n';
			document.getElementById("t").value += ($answers[i].answer == "c" ? "="+$answers[i].c : "~"+$answers[i].c) + '\n';
			document.getElementById("t").value += ($answers[i].answer == "d" ? "="+$answers[i].d : "~"+$answers[i].d) + "}\n\n";
		}
	},*/
	createSkeleton: function() {
		var current = "", prev = "", temp = "", $i = 0, loc1 = "", loc2 = "";
		this.skeleton.mesh.frame(0);
		this.skeleton.mesh.node(0);
		this.skeleton.mesh.mat(0);
		for( var i in this.skeleton.bones ) {
			current = this.skeleton.bones[i];
			for( var j in current.targets ) {
				for( var k in this.$i[ current.targets[j] ] ) {
					temp = temp === "" ? vec3.create( this.$v[ this.$i[ current.targets[j] ][k] ] ) :
						vec3.average( temp, this.$v[ this.$i[ current.targets[j] ][k] ] );
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
	animate: function( bone ) {
		var current = "", temp2 = "", prev = "", track = {},
			temp = this.mesh.ba.vba[0].slice(), skel = this.skeleton;
		current = skel.bones[bone];
		//console.log( skel.bones );
		while( current.children.length > 0 ) {
			if( current.targets.length > 0 ) {
				//current.matrix = mat4.multiply( mat4.create(), current.iMatrix );
				//current.matrix = mat4.multiply( current.matrix, current.jMatrix );
				prev = current.matrix;
				for( var j in current.targets ) {
					for( var k in this.$i[ current.targets[j] ] ) {
						temp2 = vec3.transform( this.$v[ this.$i[ current.targets[j] ][k] ], mat4.create() );
						temp[ this.$i[ current.targets[j] ][k] * 3 ] = temp2[0];
						temp[ this.$i[ current.targets[j] ][k] * 3 + 1 ] = temp2[1];
						temp[ this.$i[ current.targets[j] ][k] * 3 + 2 ] = temp2[2];
					}
				}
			}
			current = skel.bones[ current.children[0] ];
		}
		this.mesh.ba.vba2 = temp;
	},
	render: function() {
		if( Settings.flags.showSkeleton ) {
			this.skeleton.mesh.render();
		} else this.mesh.render();
	}
}

__$r.prototype.$DAEModel.prototype.$skeleton.prototype = {
	init: function( params ) {
		params = params || {};
		this.bones = {};
		this.used = {};
		this.root = "";
		this.count = 0;
		this.data = "";
		this.mesh = new rin.$Mesh( { physics: false, mode: gl.LINES, position: params.position } );
	},
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
	clean: function() {
		for( var i in this.bones ) {
			this.bones[i].clean();
		}
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
		this.weights = [];
		this.targets = [];
		this.jMatrix = "";
		this.iMatrix = "";
		this.sMatrix = "";
		
		this.matrix = "";
	},
	addBone: function( bone ) { this.children.push( bone ); },
	addTarget: function( target ) { typeof target == "object" ? this.targets.concat( target ) : this.targets.push( target ); },
	addWeight: function( weight ) { this.weights.push( weight ); },
	clean: function() {
		var used = [], prev = "", temp = "";
		for( var i in this.targets ) {
			if( used.indexOf( this.targets[i] ) !== -1 ) {
				prev = this.targets.indexOf( this.targets[i] );
				this.targets.splice( prev, 1 );
				temp = this.weights.splice( prev, 1 );
				this.weights[ this.targets.indexOf( this.targets[i] ) ] += temp[0] /= 2;
			} else used.push( this.targets[i] );
		}
	},
	readMatrix: function( data, skel ) {
		var temp = data.getElementById( this.id ).childNodes[1].textContent.trim().split(" ").map( parseFloat );
		this.jMatrix = mat4.create( temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7],
								   temp[8], temp[9], temp[10], temp[11], temp[12], temp[13], temp[14], temp[15] );
		if( this.parent !== null ) {
			this.sMatrix = mat4.multiply( skel.bones[ this.parent ].matrix, this.jMatrix );
		} else {
			this.matrix = this.jMatrix;
			this.sMatrix = mat4.multiply( this.iMatrix, this.matrix );
		}
	}
}