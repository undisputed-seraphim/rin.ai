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
    for( var i = 0; i < arrElements.length; i++ ) {
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
		var $dae = { vertex: {}, position: {}, texcoord: {}, normal: {} },
			$temp = { vertex: {}, position: {}, texcoord: {}, normal: {} },
			$p = data.getElementsByTagName( "polylist" ),
			$m = parseFloat( getElementsByAttribute( data , "unit", "meter" )[0].getAttribute("meter") ),
			$c = "", max = 0, newMax = 0, face = {}, $i = 0;
		console.log( $m );
		this.mesh.frame(0);
		this.mesh.node(0);
		for( var i in $p ) {
			if( $p[i].nodeType === 1 ) {
				$c = $p[i].getAttribute( "material" ),
				$a = getElementsByAttribute( doc( $p[i].parentNode ), "input", "semantic", [ "position", "vertex", "texcoord", "normal" ] );
				for( var j in $a ) {
					if( $a[j].nodeType === 1 ) {
						max = 0;
						switch( $a[j].getAttribute( "semantic" ).toLowerCase() ) {
							case "vertex": $temp.vertex[ $c ] = getChildrenByTagName( data.getElementById( $a[j].getAttribute( "source" )
								.substring(1) ).parentNode, "p" )[0].textContent.trim().split(" ").map(parseFloat); break;
							case "position": $temp.position[ $c ] = getChildrenByTagName( data.getElementById( $a[j].getAttribute( "source" )
								.substring(1) ), "float_array" )[0].textContent.trim().split(" ").map(parseFloat)
									.map( function(x) {
										if( face[max] === undefined ) face[max] = [];
										else if( face[max].length === 3 ) max++;
										if( face[max] === undefined ) face[max] = [];
										face[max].push(x)
									}); $temp.position[$c] = face; max = 0; face = {}; break;
							case "normal": $temp.normal[ $c ] = getChildrenByTagName( data.getElementById( $a[j].getAttribute( "source" )
								.substring(1) ), "float_array" )[0].textContent.trim().split(" ").map(parseFloat)
									.map( function(x) {
										if( face[max] === undefined ) face[max] = [];
										else if( face[max].length === 3 ) max++;
										if( face[max] === undefined ) face[max] = [];
										face[max].push(x)
									}); $temp.normal[$c] = face; max = 0; face = {}; break;
							case "texcoord": $temp.texcoord[ $c ] = getChildrenByTagName( data.getElementById( $a[j].getAttribute( "source" )
								.substring(1) ), "float_array" )[0].textContent.trim().split(" ").map(parseFloat)
									.map( function(x) {
										if( face[max] === undefined ) face[max] = [];
										else if( face[max].length === 2 ) max++;
										if( face[max] === undefined ) face[max] = [];
										face[max].push(x)
									}); $temp.texcoord[$c] = face; max = 0; face = {}; break;
						}
					}
				}
				this.mesh.mat( $c );
				this.mesh.textures[$c] = new rin.$Texture( $c, this.mesh );
				this.mesh.textures[$c].element.src = "inc/models/"+this.name+"/textures/"+$c+".png";
				face = [];
				for( var j = 0; j < $temp.vertex[ $c ].length; j+=3 ) {
					this.mesh.vertex( $temp.position[$c][ $temp.vertex[$c][j] ][0],
									  $temp.position[$c][ $temp.vertex[$c][j] ][1],
									  $temp.position[$c][ $temp.vertex[$c][j] ][2] );
					this.mesh.normal( $temp.normal[$c][ $temp.vertex[$c][j+1] ][0],
									  $temp.normal[$c][ $temp.vertex[$c][j+1] ][1],
									  $temp.normal[$c][ $temp.vertex[$c][j+1] ][2] );
					this.mesh.texture( $temp.texcoord[$c][ $temp.vertex[$c][j+2] ][0],
									   $temp.texcoord[$c][ $temp.vertex[$c][j+2] ][1] );
					face.push( $i ); $i++;
					if( face.length === 3 ) {
						this.mesh.face( face[0], face[1], face[2] );
						face = [];
					}
				}
			}
		}
		//rin.$Ajax( this, "test.txt", "finish" );
		console.log( $dae, this.mesh );
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