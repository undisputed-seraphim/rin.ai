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
								getAttribute("source").substring(1) ).textContent.trim().split(" ").map(parseFloat).map(function(x){return x / 10000;}); break;
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
							childNodes[1].getAttribute("url").substring(1)).childNodes[1].childNodes[1].childNodes[1].childNodes[1].textContent ).childNodes[1].textContent;
				}
			}
		}
		for( var i in this.textures ) {
			this.mesh.textures[i] = new rin.$Texture( i, this.mesh );
			this.mesh.textures[i].element.src = "inc/models/"+this.name+"/textures/"+this.textures[i].substring( this.textures[i].lastIndexOf("/") + 1 )
		}
		var index = 0, face = [];
		console.log( $vertices, this );
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
	render: function() {
		this.mesh.render();
	}
}