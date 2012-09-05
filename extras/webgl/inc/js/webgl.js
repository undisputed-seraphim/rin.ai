var _gl;
var squareRotation = 0.0;
var lastSquareUpdateTime = 0;

function webgl( id ) {
	this.element =			document.getElementById( id );
	this.ctx = 				this.element.getContext( 'experimental-webgl' );
	this.buffers =			{ vertex: "", color: "" };
	this.program = 			"";
	this.vertexPosition = 	0;
	this.vertexColor =		0;
	this.interval = 		"";
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
	console.log( this.vertexPosition );
	this.ctx.enableVertexAttribArray( this.vertexColor );
}; webgl.prototype.getShader = function( which ) {
	var shader;
	if( which == "vertex" ) shader = this.ctx.createShader( this.ctx.VERTEX_SHADER );
	else if( which == "fragment" ) shader = this.ctx.createShader( this.ctx.FRAGMENT_SHADER );
	this.ctx.shaderSource( shader, _shaders[which] );
	this.ctx.compileShader( shader );
	return shader || null;
}; webgl.prototype.initVertexBuffer = function( which ) {
	this.buffers.vertex = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.vertex );
	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( _vertices[which] ), this.ctx.STATIC_DRAW );
	this.buffers.color = this.ctx.createBuffer();
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.color );
	this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( _colors ), this.ctx.STATIC_DRAW );
}; webgl.prototype.draw = function() {
	this.ctx.clear( this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT );
	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
	loadIdentity();
	mvTranslate([-0.0, 0.0, -6.0]);
	mvPushMatrix();
	mvRotate( squareRotation, [1, 0, -1] );
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.vertex );
	this.ctx.vertexAttribPointer( this.vertexPosition, 3, this.ctx.FLOAT, false, 0, 0 );
	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.buffers.color );
	this.ctx.vertexAttribPointer(	this.vertexColor, 4, this.ctx.FLOAT, false, 0, 0 );
	setMatrixUniforms();
	this.ctx.drawArrays( this.ctx.TRIANGLES, 0, 4 );
	mvPopMatrix();
	var currentTime = (new Date).getTime();
	if (lastSquareUpdateTime) {
		var delta = currentTime - lastSquareUpdateTime;
		squareRotation += (30 * delta) / 1000.0;
	}
	lastSquareUpdateTime = currentTime;
}; webgl.prototype.start = function() {
	if( this.ctx.interval ) clearInterval( this.ctx.interval );
	this.ctx.interval = setInterval( function() { _gl.draw(); }, 15 );
}; webgl.prototype.stop = function() {
	if( this.ctx.interval ) clearInterval( this.ctx.interval );
};

$(document).ready(function() {
	_gl = new webgl("canvas");
	_gl.color( 0.0, 0.0, 0.0, 1.0 );
	
	_gl.viewport(0, 0, canvas.width, canvas.height);
	_gl.initShaders();
	temp = getModel( "cube" );
});

function getModel( name ) {
	$.ajax({ url: "inc/models/"+name+"/"+name+".obj" }).done( function( response ){
		var full = response.split("\n");
		var vertices = [];
		var _new = [];
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "o": console.log( "got an object" ); break;
				case "v":  vertices.push( [full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0],
					full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[1], full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[2]] ); console.log(i);break;
				case "vn": console.log( "got a vn" ); break;
				case "vt": console.log( "got a vt" ); break;
				case "f": 
					var temp = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
					for( var j in vertices[temp[0].substring( 0, temp[0].indexOf("/") )-1] ) _new.push( vertices[temp[0].substring( 0, temp[0].indexOf("/") )-1][j] );
					for( var j in vertices[temp[1].substring( 0, temp[1].indexOf("/") )-1] ) _new.push( vertices[temp[1].substring( 0, temp[1].indexOf("/") )-1][j] );
					for( var j in vertices[temp[2].substring( 0, temp[2].indexOf("/") )-1] ) _new.push( vertices[temp[2].substring( 0, temp[2].indexOf("/") )-1][j] );
					break;
			}
		}
		console.log( _new );
		_vertices[name] = _new;
		_gl.initVertexBuffer( "cube" );
		_gl.start();
	});
}