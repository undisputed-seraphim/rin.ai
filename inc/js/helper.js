function setMatrixUniforms() {
  //var pUniform = r.gl.getUniformLocation( r.program(), "uPMatrix");
  //r.gl.uniformMatrix4fv( pUniform, false, mat4.flatten( perspectiveMatrix ) );
 
  var mvUniform = r.gl.getUniformLocation( r.program(), "uMVMatrix");
  r.gl.uniformMatrix4fv( mvUniform, false, mat4.flatten( mvMatrix ) );
}