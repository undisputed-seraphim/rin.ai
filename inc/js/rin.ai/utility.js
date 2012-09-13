var vec3 = {
	create: function( x, y, z ) {
    	return new Float32Array( [ x, y, z ] ); },
    add: function( a, b ) {
    	return new Float32Array( [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ] ); },
}

var mat4 = {
	create: function( $$00, $$01, $$02, $$03,
			   		  $$10, $$11, $$12, $$13,
			   		  $$20, $$21, $$22, $$23,
			   		  $$30, $$31, $$32, $$33 ) {
		if( typeof( $$00 ) == "number" ) return new Float32Array(
			[ $$00,		$$01,		$$02,		$$03,
			  $$10,		$$11,		$$12,		$$13,
			  $$20,		$$21,		$$22,		$$23,
			  $$30,		$$31,		$$32, 		$$33 ] );
		else return new Float32Array(
		  [ 1,		0,		0,		0,
			0,		1,		0,		0,
			0,		0,		1,		0,
			0,		0,		0, 		1 ] ); },
	flatten: function( m ) {
		return new Float32Array(
			   [ m[0],	m[4],	m[8],	m[12],
			     m[1],	m[5],	m[9],	m[13],
			     m[2],	m[6],	m[10],	m[14],
			     m[3],	m[7],	m[11],	m[15] ] ); },
	perspective: function( fovy, aspect, znear, zfar ) {
    	var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    	var ymin = -ymax;
    	var xmin = ymin * aspect;
    	var xmax = ymax * aspect;
    	return mat4.frustum( xmin, xmax, ymin, ymax, znear, zfar ); },
    frustum: function( left, right, bottom, top, znear, zfar ) {
    	var X = 2*znear/(right-left);
	    var Y = 2*znear/(top-bottom);
    	var A = (right+left)/(right-left);
	    var B = (top+bottom)/(top-bottom);
    	var C = -(zfar+znear)/(zfar-znear);
	    var D = -2*zfar*znear/(zfar-znear);
    	return mat4.create(
    		X, 0, A, 0,
	        0, Y, B, 0,
    	    0, 0, C, D,
        	0, 0, -1, 0 ); },
	translate: function( x, y, z ) {	
	}
}