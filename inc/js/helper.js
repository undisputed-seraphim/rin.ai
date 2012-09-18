function setMatrixUniforms() {
  //var pUniform = r.gl.getUniformLocation( r.program(), "uPMatrix");
  //r.gl.uniformMatrix4fv( pUniform, false, mat4.flatten( perspectiveMatrix ) );
 
  var mvUniform = r.gl.getUniformLocation( r.program(), "uMVMatrix");
  r.gl.uniformMatrix4fv( mvUniform, false, mat4.flatten( mvMatrix ) );
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