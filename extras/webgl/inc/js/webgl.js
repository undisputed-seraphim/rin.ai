var _gl;
var miku;
var gl = function() { return _gl; };
var squareRotation = 0.0;
var lastSquareUpdateTime = 0;

function webgl( id ) {
	this.element =			document.getElementById( id );
	this.ctx = 				this.element.getContext( 'experimental-webgl' );
	this.buffers =			{ vertex: "", color: "", texture: "", normal: "", index: "" };
	this.program = 			"";
	this.visible =			{};
	this.mtllib =			"";
	this.numTex =			0;
	this.texLoaded =		0;
	this.xRot = this.yRot =	0;
	this.zPos =	this.xPos =	0;
	this.yYaw =				0;
	this.vertexPosition = 	0;
	this.textureCoord =		0;
	this.interval = 		"";
	this.q =				{ queue: [], running: false };
	this.v =				{ vertex: "", normal: "", texture: "" };
	this.color( 0.0, 0.0, 0.0, 1.0 );
	this.ctx.enable( this.ctx.DEPTH_TEST );
	this.ctx.depthFunc( this.ctx.LEQUAL );
} webgl.prototype.viewport = function( x, y, width, height ) {
	if( arguments.length == 0 ) 		return this.ctx.getParameter( this.ctx.VIEWPORT );
	else 								this.ctx.viewport( x || this.viewport()[0], y || this.viewport()[1],
														width || this.viewport()[2], height || this.viewport()[3] );
}; webgl.prototype.color = function( r, g, b, a ) {
	if( arguments.length == 0 ) 		return this.ctx.getParameter( this.ctx.COLOR_CLEAR_VALUE );
	else 								this.ctx.clearColor( r || this.color()[0], g || this.color()[1],
														b || this.color()[2], a || this.color()[3] );
}; webgl.prototype.initShaders = function() {
	var vertex = this.getShader( "vertex" );
	var fragment = this.getShader( "fragment" );
	this.program = this.ctx.createProgram();
	this.ctx.attachShader( this.program, vertex );
	this.ctx.attachShader( this.program, fragment );
	this.ctx.linkProgram( this.program );
	this.ctx.useProgram( this.program );
	this.v.vertex = this.ctx.getAttribLocation( this.program, "aVertex" );
	this.ctx.enableVertexAttribArray( this.v.vertex );
	//this.v.normal = this.ctx.getAttribLocation( this.program, "aNormal" );
	//this.ctx.enableVertexAttribArray( this.v.normal );
	this.v.texture = this.ctx.getAttribLocation( this.program, "aTexture" );
	this.ctx.enableVertexAttribArray( this.v.texture );
}; webgl.prototype.getShader = function( which ) {
	var shader;
	if( which == "vertex" ) shader = this.ctx.createShader( this.ctx.VERTEX_SHADER );
	else if( which == "fragment" ) shader = this.ctx.createShader( this.ctx.FRAGMENT_SHADER );
	this.ctx.shaderSource( shader, _shaders[which] );
	this.ctx.compileShader( shader );
	return shader || null;
}; webgl.prototype.loadModel = function( which ) {
	this.queue( function() { getModel( which ); } );
}; webgl.prototype.loadTextures = function( which ) {
	this.queue( function() { getTextures( which ); } );
}; webgl.prototype.initBuffers = function( which ) {
	this.queue( function() { _gl.initVertexBuffer( which ) } );
	//this.queue( function() { _gl.initColorBuffer( which ) } );
	this.queue( function() { _gl.initTextureBuffer( which ) } );
	//this.queue( function() { _gl.initNormalBuffer( which ) } );
	this.queue( function() { _gl.initIndexBuffer( which ) } );
}; webgl.prototype.initVertexBuffer = function( which ) {
	this.buffers.vertex = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.vertex );
	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( which.v.vertices ), this.ctx.STATIC_DRAW );
	for( var i in which.mesh ) {
		for( var j in which.mesh[i].textures ) {
			which.mesh[i].textures[j].v.buffers.vertex = this.ctx.createBuffer();
		    this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, which.mesh[i].textures[j].v.buffers.vertex );
	    	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( which.mesh[i].textures[j].v.vertex  ), this.ctx.STATIC_DRAW);
		}
	}
	this.q.running = false; this.queue();
}; webgl.prototype.initColorBuffer = function( which ) {
	this.buffers.color = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.color );
	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( _colors[which] ), this.ctx.STATIC_DRAW );
	this.q.running = false; this.queue();
}; webgl.prototype.initTextureBuffer = function( which ) {
	this.buffers.texture = this.ctx.createBuffer();
    this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.texture );
    this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( which.v.textures ), this.ctx.STATIC_DRAW);
	/*for( var i in which.mesh ) {
		for( var j in which.mesh[i].textures ) {
			which.mesh[i].textures[j].v.buffers.texture = this.ctx.createBuffer();
		    this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, which.mesh[i].textures[j].v.buffers.texture );
	    	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( which.mesh[i].textures[j].v.texture  ), this.ctx.STATIC_DRAW);
		}
	}*/
    this.q.running = false; this.queue();
}; webgl.prototype.initNormalBuffer = function( which ) {
	this.buffers.normal = this.ctx.createBuffer();
    this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.normal );
    this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( which.v.normals ), this.ctx.STATIC_DRAW);
	this.q.running = false; this.queue();
}; webgl.prototype.initIndexBuffer = function( which ) {
	this.buffers.index = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, this.buffers.index );
	this.ctx.bufferData( this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array( which.v.indices ), this.ctx.STATIC_DRAW );
	for( var i in which.mesh ) {
		for( var j in which.mesh[i].textures ) {
			which.mesh[i].textures[j].v.buffers.index = this.ctx.createBuffer();
			this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, which.mesh[i].textures[j].v.buffers.index );
			this.ctx.bufferData( this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array( which.mesh[i].textures[j].v.index ), this.ctx.STATIC_DRAW );
		}
	}
	this.q.running = false; this.queue();
}; webgl.prototype.render = function( which, part ) {
	//this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.normal );
	//this.ctx.vertexAttribPointer( this.v.normal, 3, this.ctx.FLOAT, false, 0, 0 );
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.vertex );
	this.ctx.vertexAttribPointer( this.v.vertex, 3, this.ctx.FLOAT, false, 0, 0 );
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.texture );
	this.ctx.vertexAttribPointer( this.v.texture, 2, this.ctx.FLOAT, true, 0, 0);
	//if( part === undefined ) {
		for( var i in which.mesh ) {
			for( var j in which.mesh[i].textures ) {
				//if( which.v.mats[j] === undefined ) console.log( j == " " );
				if( which.v.mats[j].src != "" ) {
					this.ctx.uniform1i( this.ctx.getUniformLocation( this.program, "uUseTextures" ), true );
					this.ctx.enableVertexAttribArray( this.v.texture );
					this.ctx.activeTexture( this.ctx.TEXTURE0 );
					this.ctx.bindTexture( this.ctx.TEXTURE_2D, which.v.mats[j].texture );
					this.ctx.uniform1i( this.ctx.getUniformLocation( this.program, "uSampler" ), 0 );
				} else { this.ctx.disableVertexAttribArray( this.v.texture ); }
				if( which.v.mats[j].v.Ka !== undefined ) this.ctx.uniform3f( this.ctx.getUniformLocation( this.program, "uMaterialAmbientColor" ),
					which.v.mats[j].v.Ka[0], which.v.mats[j].v.Ka[1], which.v.mats[j].v.Ka[2] );
    			this.ctx.uniform3f( this.ctx.getUniformLocation( this.program, "uMaterialDiffuseColor" ), 0.0, 0.0, 0.0);
    			this.ctx.uniform3f( this.ctx.getUniformLocation( this.program, "uMaterialSpecularColor" ), 0.5, 0.5, 0.5);
				this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, which.mesh[i].textures[j].v.buffers.index );
				setMatrixUniforms();
				this.ctx.drawElements( this.ctx.TRIANGLES, which.mesh[i].textures[j].v.index.length, this.ctx.UNSIGNED_SHORT, 0 );
			}
		}
	//}
}; webgl.prototype.draw = function() {
	this.ctx.clear( this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT );
	perspectiveMatrix = makePerspective( 45, 640.0/480.0, 0.1, 100.0 );
	loadIdentity();
	if( Controls.any( "wasd" ) ) {
		if( Controls.keys.a ) 	this.yYaw -=		0.2;
		if( Controls.keys.d ) 	this.yYaw +=		0.2;
		if( Controls.keys.w ) { this.zPos +=		(0.03 * Math.cos( this.yYaw * ( Math.PI / 180 ) ) );
								this.xPos -=		(0.03 * Math.sin( this.yYaw * ( Math.PI / 180 ) ) ); }
		if( Controls.keys.s ) { this.zPos -=		(0.03 * Math.cos( this.yYaw * ( Math.PI / 180 ) ) );
								this.xPos -=		(0.03 * Math.sin( this.yYaw * ( Math.PI / 180 ) ) ); }
	}
	mvTranslate( [this.xPos, 0.0, this.zPos] );
	mvRotate( this.yYaw, [0.0, 1.0, 0.0] );
	mvPushMatrix();
	mvTranslate( [0.0, -1.0, -6.0] );
	if( Controls.any( "arrows" ) ) {
		if( Controls.keys.up ) this.xRot--;
		if( Controls.keys.down ) this.xRot++;
		if( Controls.keys.left ) this.yRot--;
		if( Controls.keys.right ) this.yRot++;
	}
	mvRotate( _gl.xRot, [1, 0, 0] );
	mvRotate( _gl.yRot, [0, 1, 0] );
	//this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.color );
	//this.ctx.vertexAttribPointer( this.vertexColor, 4, this.ctx.FLOAT, false, 0, 0 );
	this.render( miku );
	mvPopMatrix();
	var currentTime = (new Date).getTime();
	if (lastSquareUpdateTime) {
		var delta = currentTime - lastSquareUpdateTime;
		squareRotation += (30 * delta) / 1000.0;
	}
	lastSquareUpdateTime = currentTime;
}; webgl.prototype.start = function() {
	Controls.enable("world");
	if( this.interval ) clearInterval( this.interval );
	lastSquareUpdateTime = (new Date).getTime();
	this.interval = setInterval( function() { _gl.draw(); }, 15 );
}; webgl.prototype.stop = function() {
	if( this.interval ) clearInterval( this.interval );
}; webgl.prototype.queue = function( callback ) {
	if( arguments.length == 0 ) {
		if( this.q.queue.length > 0 && !this.q.running ) {
			this.q.running = true; this.q.queue.shift().call();
		}
	} else if( !this.q.running ) {
		this.q.running = true; callback.call();
	} else {
		this.q.queue.push( callback );
	}
};

$(document).ready(function() {
	_gl = new webgl("canvas");
	//_gl.viewport(0, 0, canvas.width, canvas.height);
	_gl.initShaders();
	document.addEventListener( "modelLoaded", goAhead );
	miku = new model( "miku2" );
	_gl.loadModel( "miku2" );
	//_gl.loadTextures( "miku2" );
	//_gl.initBuffers( "miku2" );
	//_gl.queue( function() {	_gl.start(); } );
});

function goAhead() {
	document.removeEventListener( "modelLoaded", goAhead );
	_gl.initBuffers( miku );
	_gl.queue( function() {	_gl.start(); } );
}

function getModel( name ) {
	$.ajax({ url: "inc/models/"+name+"/"+name+".obj" }).done( function( response ){
		var full = response.split("\n");
		_models[name] = {}; _materials[name] = {};
		var vertices = []; var textures = []; var _new = []; var current = ""; var tempVerts = []; var tempNew = []; var tempTexture = [];
		var prevVerts = 0; var tex = [];
		loop1:
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "o": if( vertices.length > 0 ) {
						prevVerts+=tempVerts.length; _models[name][current].vertex = tempVerts; tempVerts = [];
						_models[name][current].index = tempNew; tempNew = [];
						_models[name][current].texture = tempTexture; tex = tex.concat( tempTexture ); tempTexture = [];
					} current = full[i].substring( full[i].indexOf(" ")+1 ); _models[name][current] = {}; break;
				case "v":
					vertices.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0] );
					tempVerts.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0] );
					vertices.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[1] );
					tempVerts.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[1] );
					vertices.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[2] );
					tempVerts.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[2] );
					break;
				case "mtllib": _gl.mtllib = full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0]; break;
				case "usemtl":
					if( _materials[name][current] === undefined ) _materials[name][current] = [];
					_materials[name][current].push([textures.length, full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0]]); break;
				case "vn": console.log( "got a vn" ); break;
				case "vt":
					textures.push( [full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0],
						full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[1] ] );
					break;
				case "f": 
					var temp = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
					if( temp.length > 2 ) {
						if( (temp[0].split("/").length - 1) == 2 &&
								temp[0].substring( temp[0].indexOf("/")+1, temp[0].lastIndexOf("/") ) != "" ) {
							tempTexture.push( textures[temp[0].substring( temp[0].indexOf("/")+1, temp[0].lastIndexOf("/") )-1][0] );
								tempTexture.push( textures[temp[0].substring( temp[0].indexOf("/")+1, temp[0].lastIndexOf("/") )-1][1] );
							tempTexture.push( textures[temp[1].substring( temp[1].indexOf("/")+1, temp[1].lastIndexOf("/") )-1][0] );
								tempTexture.push( textures[temp[1].substring( temp[1].indexOf("/")+1, temp[1].lastIndexOf("/") )-1][1] );
							tempTexture.push( textures[temp[2].substring( temp[2].indexOf("/")+1, temp[2].lastIndexOf("/") )-1][0] );
								tempTexture.push( textures[temp[2].substring( temp[2].indexOf("/")+1, temp[2].lastIndexOf("/") )-1][1] );
						}
						_new.push( temp[0].substring( 0, temp[0].indexOf("/") )-1 );
						tempNew.push( temp[0].substring( 0, temp[0].indexOf("/") )-1 );
						_new.push( temp[1].substring( 0, temp[1].indexOf("/") )-1 );
						tempNew.push( temp[1].substring( 0, temp[1].indexOf("/") )-1 );
						_new.push( temp[2].substring( 0, temp[2].indexOf("/") )-1 );
						tempNew.push( temp[2].substring( 0, temp[2].indexOf("/") )-1 );
					}
					break;
			}
		}
		_models[name][current].vertex = tempVerts;
		_models[name][current].index = tempNew;
		_models[name][current].texture = tempTexture;
		tex = tex.concat( tempTexture );
		_vertices[name] = vertices;
		_indices[name] = _new;
		_textures[name] = tex;
		_gl.q.running = false; _gl.queue();
	});
}

function getTextures( name ) {
	$.ajax({ url: "inc/models/"+name+"/"+_gl.mtllib }).done( function( response ){
		var full = response.split("\n"); var current = ""; var num = 0;
		_images[name] = {};
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "newmtl": console.log("newmtl"); current = full[i].substring( full[i].indexOf(" ")+1 ); break;
				case "map_Kd": num++; _images[name][current] = full[i].substring( full[i].indexOf(" ")+1 ); break;
			}
		}
		_gl.numTex = num;
		preloadTextures( name );
	});
}

function preloadTextures( name ) {
	_tex[name] = {};
	for( var i in _images[name] ) {
		_tex[name][i] = { img: "", tex: "" };
		_tex[name][i].img = new Image();
		_tex[name][i].img.onload = function() { handleImage( name ); };
		_tex[name][i].img.src = "inc/models/"+name+"/"+_images[name][i];
	}
	console.log( _tex[name] );
}

function handleImage( name ) {
	_gl.texLoaded++;
	if( _gl.texLoaded == _gl.numTex ) createTextures( name );
}

function createTextures( name ) {
	for( var i in _tex[name] ) {
		_tex[name][i].tex = _gl.ctx.createTexture();
		_gl.ctx.bindTexture(_gl.ctx.TEXTURE_2D, _tex[name][i].tex);
		_gl.ctx.pixelStorei(_gl.ctx.UNPACK_FLIP_Y_WEBGL, true);
		_gl.ctx.texImage2D(_gl.ctx.TEXTURE_2D, 0, _gl.ctx.RGBA, _gl.ctx.RGBA, _gl.ctx.UNSIGNED_BYTE, _tex[name][i].img);
		_gl.ctx.texParameteri(_gl.ctx.TEXTURE_2D, _gl.ctx.TEXTURE_MAG_FILTER, _gl.ctx.NEAREST);
		_gl.ctx.texParameteri(_gl.ctx.TEXTURE_2D, _gl.ctx.TEXTURE_MIN_FILTER, _gl.ctx.NEAREST);
		_gl.ctx.generateMipmap(_gl.ctx.TEXTURE_2D);
		_gl.ctx.bindTexture(_gl.ctx.TEXTURE_2D, null);
    	_gl.numTex--;
	}
    _gl.q.running = false; _gl.queue();
}

function debug( which, part ) {
	console.log( part, _models[which][part].vertex, _models[which][part].index, _models[which][part].texture );
}