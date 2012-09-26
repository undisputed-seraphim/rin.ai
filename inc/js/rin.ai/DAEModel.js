__$r.prototype.$DAEModel = function $DAEModel( id, params ) {
	params = params || {};
	this.id = id;
	this.name = params.name || "noname";
	this.textures = {};
	
	this.mesh = new rin.$Mesh( params );
	this.file = "inc/models/"+this.name+"/"+this.name+".dae";
	this.init();
}

function doc( element ) {
	var doc = document.implementation.createHTMLDocument( "temp" );
	doc.documentElement.innerHTML = '<!DOCTYPE html><html><head></head><body></body></html>';
	doc.body.appendChild( element.cloneNode(true) );
	return doc;
}

function getChildrenByTagName( element, tag, depth ) {
	return doc(element).getElementsByTagName( tag );
}

function getElementsByAttribute( oElm, strTagName, strAttributeName, strAttributeValue ) {
	if( typeof strAttributeValue == "object" ) strAttributeValue.map( function(x){ return x.toLowerCase(); } );
    var arrElements = ( strTagName == "*" && oElm.all ) ? oElm.all : oElm.getElementsByTagName( strTagName );
    var arrReturnElements = new Array();
    var oAttributeValue = ( typeof strAttributeValue != "undefined" ) ? new RegExp( "(^|\\s)" + strAttributeValue + "(\\s|$)", "i" ) : null;
    var oCurrent;
    var oAttribute;
    for( var i  =0; i < arrElements.length; i++ ) {
        oCurrent = arrElements[i];
        oAttribute = oCurrent.getAttribute && oCurrent.getAttribute( strAttributeName );
        if( typeof oAttribute == "string" && oAttribute.length > 0 ){
            if( typeof strAttributeValue == "undefined" || ( oAttributeValue && typeof strAttributeValue == "object" ?
					strAttributeValue.indexOf( oAttribute.toLowerCase() ) != -1 : oAttributeValue.test( oAttribute ) ) ){
                arrReturnElements.push( oCurrent );
            }
        }
    }
    return arrReturnElements;
}

__$r.prototype.$DAEModel.prototype = {
	init: function() {
		rin.$Ajax( this, this.file, "parse", "xml" );
	},
	parse: function( data ) {
		var $vertices = {},
			current = "",
			vertices = data.getElementsByTagName( "vertices" ),
			triangles = data.getElementsByTagName( "triangles" );
		for( var i in vertices ) {
			if( vertices[i].nodeType === 1 ) {
				current = vertices[i].getAttribute( "id" );
				$vertices[ current ] = { position: [], normal: [], texcoord: [], vertex: [] };
				for( var j in vertices[i].childNodes ) {
					if( vertices[i].childNodes[j].nodeName == "input" ) {
						switch( vertices[i].childNodes[j].getAttribute( "semantic" ).toLowerCase() ) {
							case "position": $vertices[ current ].position = data.getElementById( vertices[i].childNodes[j].
								getAttribute("source").substring(1) ).textContent.trim().split(" ").map(parseFloat); break;
							case "normal": $vertices[ current ].normal = data.getElementById( vertices[i].childNodes[j].
								getAttribute("source").substring(1) ).textContent.trim().split(" ").map(parseFloat); break;
							case "texcoord": $vertices[ current ].texcoord = data.getElementById( vertices[i].childNodes[j].
								getAttribute("source").substring(1) ).textContent.trim().split(" ").map(parseFloat); break;
						}
					}
				}
			}
		}
		var max = 0, newMax = 0;
		for( var i in triangles ) {
			if( triangles[i].nodeType === 1 ) {
				for( var j in triangles[i].childNodes ) {
					if( triangles[i].childNodes[j].nodeName == "input" ) {
						current = triangles[i].childNodes[j].getAttribute( "source" ).substring(1);
						this.textures[ current ] = triangles[i].getAttribute( "material" );
						$vertices[ current ].vertex = triangles[i].childNodes[j].nextSibling.
							nextSibling.textContent.trim().split(" ").map(parseFloat).map(function(x) {
								if( x > newMax ) newMax = x;
								return x + max;
							});
						max += 1 + newMax; newMax = 0;
					}
				}
			}
		}
		var instance_mats = data.getElementsByTagName( "instance_material" );
		for( var i in $vertices ) {
			for( var j in instance_mats ) {
				if( instance_mats[j].nodeType === 1 ) {
					if( instance_mats[j].getAttribute( "symbol" ) == this.textures[i] )
						this.textures[i] = data.getElementById( data.getElementById(data.getElementById( instance_mats[j].getAttribute("target").substring(1) ).
							childNodes[1].getAttribute("url").substring(1)).childNodes[1].childNodes[1].childNodes[1].childNodes[1].
								textContent ).childNodes[1].textContent;
				}
			}
		}
		for( var i in this.textures ) {
			this.mesh.textures[i] = new rin.$Texture( i, this.mesh );
			this.mesh.textures[i].element.src = "inc/models/"+this.name+"/textures/"+this.textures[i].substring( this.textures[i].lastIndexOf("/") + 1 )
		}
		var index = 0, face = [];
		console.log( $vertices, this );
		
		
		var $dae = { vertex: {}, position: {}, texcoord: {}, normal: {} },
			$a = getElementsByAttribute( data, "input", "semantic", [ "position", "vertex", "texcoord", "normal" ] ),
			$c = "";
		for( var i in $a ) {
			switch( $a[i].getAttribute( "semantic" ).toLowerCase() ) {
				case "vertex": $c = $a[i].getAttribute( "source" ).substring(1); $dae.vertex[ $c ] =
					getChildrenByTagName( data.getElementById( $c ).parentNode, "p" )[0].textContent.trim().split(" ").map(parseFloat); break;
				case "position": $c = $a[i].getAttribute( "source" ).substring(1); $dae.position[ $c ] =
					getChildrenByTagName( data.getElementById( $c ), "float_array" )[0].textContent.trim().split(" ").map(parseFloat); break;
				case "normal": $c = $a[i].getAttribute( "source" ).substring(1); $dae.normal[ $c ] =
					getChildrenByTagName( data.getElementById( $c ), "float_array" )[0].textContent.trim().split(" ").map(parseFloat); break;
				case "texcoord": $c = $a[i].getAttribute( "source" ).substring(1); $dae.texcoord[ $c ] =
					getChildrenByTagName( data.getElementById( $c ), "float_array" )[0].textContent.trim().split(" ").map(parseFloat); break;
			}
		}
		
		//rin.$Ajax( this, "test.txt", "finish" );
		console.log( $dae );
		this.mesh.frame( 0 );
		this.mesh.node( 0 );
		for( var i in $vertices ) {
			this.mesh.mat(i);
			this.mesh.ba.vba[0] = this.mesh.ba.vba[0].concat( $vertices[i].position );
			this.mesh.ba.tba[0] = this.mesh.ba.tba[0].concat( $vertices[i].texcoord );
			this.mesh.ba.nba[0] = this.mesh.ba.nba[0].concat( $vertices[i].normal );
			this.mesh.ba.iba[0][0][i] = $vertices[i].vertex;
		}
		this.mesh.textured = true;
		this.mesh.normaled = true;
		this.mesh.colored = false;
		this.mesh.init();
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