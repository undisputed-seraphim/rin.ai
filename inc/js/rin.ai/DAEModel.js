__$r.prototype.$DAEModel = function $DAEModel( id, params ) {
	params = params || {};
	this.id = id;
	this.name = params.name || "noname";
	
	this.mesh = new rin.$Mesh( params );
	this.file = "inc/models/"+this.name+"/"+this.name+".dae";
	this.init();
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
		for( var i in triangles ) {
			if( triangles[i].nodeType === 1 ) {
				for( var j in triangles[i].childNodes ) {
					if( triangles[i].childNodes[j].nodeName == "input" ) {
						current = triangles[i].childNodes[j].getAttribute( "source" ).substring(1);
						$vertices[ current ].vertex = triangles[i].childNodes[j].nextSibling.
							nextSibling.textContent.trim().split(" ").map(parseFloat);
					}
				}
			}
		}
		console.log( this );
		this.mesh.frame( 0 );
		this.mesh.node( 0 );
		for( var i in $vertices ) {
			this.mesh.ba.iba[ 0 ][ 0 ][ i ]
			this.mesh.ba.vba[ 0 ]
		}
	},
	render: function() {
	}
}