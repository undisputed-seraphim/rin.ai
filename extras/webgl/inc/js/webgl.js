var _gl;
var gl = function() { return _gl; };
var squareRotation = 0.0;
var lastSquareUpdateTime = 0;

function webgl( id ) {
	this.element =			document.getElementById( id );
	this.ctx = 				this.element.getContext( 'experimental-webgl' );
	this.buffers =			{ vertex: "", color: "", index: "" };
	this.program = 			"";
	this.xRot = this.yRot =	0;
	this.zPos =	this.xPos =	0;
	this.yYaw =				0;
	this.vertexPosition = 	0;
	this.vertexColor =		0;
	this.interval = 		"";
	this.q =				{ queue: [], running: false };
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
	this.vertexPosition = this.ctx.getAttribLocation( this.program, "aVertexPosition" );
	this.ctx.enableVertexAttribArray( this.vertexPosition );
	this.vertexColor = this.ctx.getAttribLocation( this.program, "aVertexColor" );
	this.ctx.enableVertexAttribArray( this.vertexColor );
}; webgl.prototype.getShader = function( which ) {
	var shader;
	if( which == "vertex" ) shader = this.ctx.createShader( this.ctx.VERTEX_SHADER );
	else if( which == "fragment" ) shader = this.ctx.createShader( this.ctx.FRAGMENT_SHADER );
	this.ctx.shaderSource( shader, _shaders[which] );
	this.ctx.compileShader( shader );
	return shader || null;
}; webgl.prototype.loadModel = function( which ) {
	this.queue( function() { getModel( which ); } );
}; webgl.prototype.initBuffers = function( which ) {
	this.queue( function() { _gl.initVertexBuffer( which ) } );
	this.queue( function() { _gl.initColorBuffer( which ) } );
	this.queue( function() { _gl.initIndexBuffer( which ) } );
}; webgl.prototype.initVertexBuffer = function( which ) {
	this.buffers.vertex = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.vertex );
	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( _vertices[which] ), this.ctx.STATIC_DRAW );
	this.q.running = false; this.queue();
}; webgl.prototype.initColorBuffer = function( which ) {
	this.buffers.color = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.color );
	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( _colors[which] ), this.ctx.STATIC_DRAW );
	this.q.running = false; this.queue();
}; webgl.prototype.initIndexBuffer = function( which ) {
	this.buffers.index = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, this.buffers.index );
	this.ctx.bufferData( this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array( _indices[which] ), this.ctx.STATIC_DRAW );
	this.q.running = false; this.queue();
}; webgl.prototype.render = function( which, part ) {
	
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
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.vertex );
	this.ctx.vertexAttribPointer( this.vertexPosition, 3, this.ctx.FLOAT, false, 0, 0 );
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.color );
	this.ctx.vertexAttribPointer( this.vertexColor, 4, this.ctx.FLOAT, false, 0, 0 );
	this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, this.buffers.index );
	setMatrixUniforms();
	this.ctx.drawElements( this.ctx.TRIANGLES, 2, this.ctx.UNSIGNED_SHORT, 0 );
	mvPopMatrix();
	var currentTime = (new Date).getTime();
	if (lastSquareUpdateTime) {
		var delta = currentTime - lastSquareUpdateTime;
		squareRotation += (30 * delta) / 1000.0;
	}
	lastSquareUpdateTime = currentTime;
}; webgl.prototype.start = function() {
	Controls.enable("world");
	if( this.ctx.interval ) clearInterval( this.ctx.interval );
	lastSquareUpdateTime = (new Date).getTime();
	this.ctx.interval = setInterval( function() { _gl.draw(); }, 15 );
}; webgl.prototype.stop = function() {
	if( this.ctx.interval ) clearInterval( this.ctx.interval );
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
	_gl.loadModel( "miku" );
	_gl.initBuffers( "miku" );
	_gl.queue( function() {	_gl.start(); } );
});

function getModel( name ) {
	$.ajax({ url: "inc/models/"+name+"/"+name+".obj" }).done( function( response ){
		var full = response.split("\n");
		_models[name] = {};
		var vertices = []; var _new = []; var current = "";
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "o": current = full[i].substring( full[i].indexOf(" ")+1 ); _models[name][current] = {}; break;
				case "v":
					vertices.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0] );
					vertices.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[1] );
					vertices.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[2] );
					break;
				case "vn": console.log( "got a vn" ); break;
				case "vt": console.log( "got a vt" ); break;
				case "f": 
					var temp = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
					_new.push( temp[0].substring( 0, temp[0].indexOf("/") )-1 );
					_new.push( temp[1].substring( 0, temp[1].indexOf("/") )-1 );
					if( temp.length > 2 ) _new.push( temp[2].substring( 0, temp[2].indexOf("/") )-1 );
					break;
			}
		}
		console.log( _models );
		_vertices[name] = vertices;
		_indices[name] = _new;
		_gl.q.running = false; _gl.queue();
	});
}