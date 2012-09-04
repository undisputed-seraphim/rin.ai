var _gl;
var squareRotation = 0.0;
var lastSquareUpdateTime = 0;
var _shaders = {
	fragment: "\
		varying lowp vec4 vColor;\
		void main(void) {\
			gl_FragColor = vColor;\
		}",
	vertex: "\
		attribute vec3 aVertexPosition;\
		attribute vec4 aVertexColor;\
   		uniform mat4 uMVMatrix;\
      	uniform mat4 uPMatrix;\
		varying lowp vec4 vColor;\
    	void main(void) {\
	        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
			vColor = aVertexColor;\
		}"
}
var _vertices = {
	square: [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0 ],
}

var _colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0     // blue
];
function webgl( id ) {
	this.element =			document.getElementById( id );
	this.ctx = 				this.element.getContext( 'experimental-webgl' );
	this.buffers =			{ vertex: "", color: "" };
	this.program = 			"";
	this.vertexPosition = 	0;
	this.vertexColor =		0;
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
	this.ctx.drawArrays( this.ctx.TRIANGLE_STRIP, 0, 4 );
	mvPopMatrix();
	var currentTime = (new Date).getTime();
if (lastSquareUpdateTime) {
  var delta = currentTime - lastSquareUpdateTime;
   
  squareRotation += (30 * delta) / 1000.0;
}
 
lastSquareUpdateTime = currentTime;
};

var mvMatrixStack = [];
 
function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}
 
function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
   
  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}
 
function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
   
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}
function loadIdentity() {
  mvMatrix = Matrix.I(4);
}
 
function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}
 
function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}
 
function setMatrixUniforms() {
  var pUniform = _gl.ctx.getUniformLocation( _gl.program, "uPMatrix");
  _gl.ctx.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
 
  var mvUniform = _gl.ctx.getUniformLocation( _gl.program, "uMVMatrix");
  _gl.ctx.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

$(document).ready(function() {
	_gl = new webgl("canvas");
	_gl.color( 0.0, 0.0, 0.0, 1.0 );
	
	_gl.viewport(0, 0, canvas.width, canvas.height);
	_gl.initShaders();
	_gl.initVertexBuffer( "square" );
	setInterval( function() { _gl.draw(); }, 15 );
});

Matrix.Translation = function (v)
{
  if (v.elements.length == 2) {
    var r = Matrix.I(3);
    r.elements[2][0] = v.elements[0];
    r.elements[2][1] = v.elements[1];
    return r;
  }

  if (v.elements.length == 3) {
    var r = Matrix.I(4);
    r.elements[0][3] = v.elements[0];
    r.elements[1][3] = v.elements[1];
    r.elements[2][3] = v.elements[2];
    return r;
  }

  throw "Invalid length for Translation";
}
Matrix.prototype.flatten = function ()
{
    var result = [];
    if (this.elements.length == 0)
        return [];


    for (var j = 0; j < this.elements[0].length; j++)
        for (var i = 0; i < this.elements.length; i++)
            result.push(this.elements[i][j]);
    return result;
}

Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 &&
        this.elements[0].length == 4)
        return this;

    if (this.elements.length > 4 ||
        this.elements[0].length > 4)
        return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j)
                this.elements[i].push(1);
            else
                this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i == 0)
            this.elements.push([1, 0, 0, 0]);
        else if (i == 1)
            this.elements.push([0, 1, 0, 0]);
        else if (i == 2)
            this.elements.push([0, 0, 1, 0]);
        else if (i == 3)
            this.elements.push([0, 0, 0, 1]);
    }

    return this;
};
Vector.prototype.flatten = function ()
{
    return this.elements;
};

function mht(m) {
    var s = "";
    if (m.length == 16) {
        for (var i = 0; i < 4; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*4+0].toFixed(4) + "," + m[i*4+1].toFixed(4) + "," + m[i*4+2].toFixed(4) + "," + m[i*4+3].toFixed(4) + "]</span><br>";
        }
    } else if (m.length == 9) {
        for (var i = 0; i < 3; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*3+0].toFixed(4) + "," + m[i*3+1].toFixed(4) + "," + m[i*3+2].toFixed(4) + "]</font><br>";
        }
    } else {
        return m.toString();
    }
    return s;
}

//
// gluLookAt
//
function makeLookAt(ex, ey, ez,
                    cx, cy, cz,
                    ux, uy, uz)
{
    var eye = $V([ex, ey, ez]);
    var center = $V([cx, cy, cz]);
    var up = $V([ux, uy, uz]);

    var mag;

    var z = eye.subtract(center).toUnitVector();
    var x = up.cross(z).toUnitVector();
    var y = z.cross(x).toUnitVector();

    var m = $M([[x.e(1), x.e(2), x.e(3), 0],
                [y.e(1), y.e(2), y.e(3), 0],
                [z.e(1), z.e(2), z.e(3), 0],
                [0, 0, 0, 1]]);

    var t = $M([[1, 0, 0, -ex],
                [0, 1, 0, -ey],
                [0, 0, 1, -ez],
                [0, 0, 0, 1]]);
    return m.x(t);
}

//
// glOrtho
//
function makeOrtho(left, right,
                   bottom, top,
                   znear, zfar)
{
    var tx = -(right+left)/(right-left);
    var ty = -(top+bottom)/(top-bottom);
    var tz = -(zfar+znear)/(zfar-znear);

    return $M([[2/(right-left), 0, 0, tx],
               [0, 2/(top-bottom), 0, ty],
               [0, 0, -2/(zfar-znear), tz],
               [0, 0, 0, 1]]);
}
function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//
// glFrustum
//
function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    return $M([[X, 0, A, 0],
               [0, Y, B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]]);
}