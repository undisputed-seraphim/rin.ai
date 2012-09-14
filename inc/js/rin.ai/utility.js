var vec3 = {
	create: function( x, y, z ) {
    	return new Float32Array( [ x || 0, y || 0, z || 0 ] ); },
    add: function( a, b ) {
    	return new Float32Array( [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ] ); },
    normalize: function( v ) {
    	var length = ( (v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]) );
    	return new Float32Array( [ v[0] / length, v[1] / length, v[2] / length ] ); }
}

var mat4 = {
	create: function( $$00, $$01, $$02, $$03,
			   		  $$10, $$11, $$12, $$13,
			   		  $$20, $$21, $$22, $$23,
			   		  $$30, $$31, $$32, $$33 ) {
		if( typeof( $$00 ) == "number" ) return new Float32Array(
		  [ $$00,	$$01,	$$02,	$$03,
			$$10,	$$11,	$$12,	$$13,
			$$20,	$$21,	$$22,	$$23,
			$$30,	$$31,	$$32, 	$$33 ] );
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
	translate: function( m, v ) {
		var t = mat4.create();
		t[3] = v[0];
    	t[7] = v[1];
		t[11] = v[2];
		return mat4.multiply( m, t );
	},
	mh: function( v, w ) {
		return v[0] * w[0] + v[1] * w[1] + v[2] * w[2] + v[3] * w[3];
	},
	multiply: function( m, n ) {
		var A1 = [m[0], m[1], m[2], m[3]];
		var A2 = [m[4], m[5], m[6], m[7]];
		var A3 = [m[8], m[9], m[10],m[11]];
		var A4 = [m[12],m[13],m[14],m[15]];
		var B1 = [n[0], n[4], n[8], n[12]];
		var B2 = [n[1], n[5], n[9], n[13]];
		var B3 = [n[2], n[6], n[10],n[14]];
		var B4 = [n[3], n[7], n[11],n[15]];
		return new Float32Array(
		  [	mat4.mh(A1, B1), mat4.mh(A1, B2), mat4.mh(A1, B3), mat4.mh(A1, B4),
			mat4.mh(A2, B1), mat4.mh(A2, B2), mat4.mh(A2, B3), mat4.mh(A2, B4),
			mat4.mh(A3, B1), mat4.mh(A3, B2), mat4.mh(A3, B3), mat4.mh(A3, B4),
			mat4.mh(A4, B1), mat4.mh(A4, B2), mat4.mh(A4, B3), mat4.mh(A4, B4) ] );
	},
	rotateY: function( m, a ) {
		a = a * ( Math.PI / 180 );
		var t = mat4.create();
		t[0] = Math.cos( a );
		t[2] = -1 * Math.sin( a );
		t[8] = Math.sin( a );
		t[10] = Math.cos( a );
		return mat4.multiply( m, t );
	},
	rotate: function( m, v ) {
		var t = mat4.create();
		var r = mat4.create();
		if( v[0] != 0 ) {
			v[0] = v[0] * ( Math.PI / 180 );
			t[5] = Math.cos( v[0] );
			t[6] = Math.sin( v[0] );
			t[9] = -1 * Math.sin( v[0] );
			t[10] = Math.cos( v[0] );
			r = mat4.multiply( t, r );
			t = mat4.create();
		}
		if( v[1] != 0 ) {
			v[1] = v[1] * ( Math.PI / 180 );
			t[0] = Math.cos( v[1] );
			t[2] = -1 * Math.sin( v[1] );
			t[8] = Math.sin( v[1] );
			t[10] = Math.cos( v[1] );
			r = mat4.multiply( t, r );
			t = mat4.create();
		}
		if( v[2] != 0 ) {
			v[2] = v[2] * ( Math.PI / 180 );
			t[0] = Math.cos( v[2] );
			t[1] = Math.sin( v[2] );
			t[4] = -1 * Math.sin( v[2] );
			t[5] = Math.cos( v[2] );
			r = mat4.multiply( t, r );
		}
		return mat4.multiply( m, r );
	}
}