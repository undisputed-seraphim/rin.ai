__$r.prototype.$DAEModel = function $DAEModel( id, params ) {
	params = params || {};
	this.id = id;
	this.name = params.name || "noname";
	this.textures = {};
	
	this.mesh = new rin.$Mesh( params );
	this.file = "inc/models/"+this.name+"/"+this.name+".dae";
	this.init();
}

__$r.prototype.$DAEModel.prototype = {
	init: function() {
		rin.$Ajax( this, this.file, "parse", "xml" );
	},
	parse: function( data ) {
		//rin.$Ajax( this, "test.txt", "finish" );*/
		var $sources = {}, source = "", stride = 0,
			polylist = getChildrenByTagName( data.getElementsByTagName( "library_geometries" )[0], "polylist" ), offset = 0,
			$c = "", $m = "", $a = "", $i = 0, face = [], temp = "";
		this.mesh.frame( 0 );
		this.mesh.node( 0 );
		for( var i in polylist ) {
			if( polylist[i].nodeType === 1 ) {
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
							getChildrenByTagName( source, "float_array" )[0].textContent.trim().split(" ").map( parseFloat )
								.map( function( x ) { face.push( x ); if( face.length === stride ) { $sources[ $c ].push( face ); face = []; } });
						}
						/* populate vertex/normal/texture/position */
						face = [];
						switch( temp[j].getAttribute( "semantic" ).toLowerCase() ) {
							case "vertex": for( var k = offset; k < $a.length; k += 3 ) {
								this.mesh.vertex( $sources[$c][ $a[k] ][0], $sources[$c][ $a[k] ][1], $sources[$c][ $a[k] ][2] );
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
		/* grab material attributes */
		this.mesh.init();
	},
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
	render: function() {
		this.mesh.render();
	}
}