var vec3 = {
	create: function( x, y, z ) {
    	return new Float32Array( [ x || 0, y || 0, z || 0 ] ); },
    add: function( a, b ) {
    	return new Float32Array( [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ] ); },
	subtract: function( a, b ) {
		return new Float32Array( [ parseFloat( a[0] - b[0] ), parseFloat( a[1] - b[1] ), parseFloat( a[2] - b[2] ) ] ); },
    normalize: function( v ) {
    	var length = vec3.magnitude( v );
    	return length == 0 ? new Float32Array( [ 0, 0, 0 ] ) :
			new Float32Array( [ parseFloat( v[0] / length ), parseFloat( v[1] / length ), parseFloat( v[2] / length ) ] ); },
	magnitude: function( v ) {
		return ( parseFloat(v[0] * v[0]) + parseFloat(v[1] * v[1]) + parseFloat(v[2] * v[2]) );
	},
	dot: function( a, b ) {
		return ( a[0] * b[0] ) + ( a[1] * b[1] ) + ( a[2] * b[2] );
	},
	cross: function( a, b ) {
		return vec3.create( a[1] * b[2] - a[2] * b[1],
						 -( a[0] * b[2] - a[2] * b[0] ),
						    a[0] * b[1] - a[1] * b[0] ); },
}

var quat = {
	create: function( x, y, z, w ) {
		if( typeof( x ) == "number" ) return new Float32Array( [ x, y, z, w ] );
		else {
			if( typeof( y ) == "undefined" ) return new Float32Array( [ 0, 0, 1, 0 ] );
			else {
				var y = y * 0.5,
					s = Math.sin( y ),
					v = vec3.normalize( x );
				return quat.create( ( v[0] * s ), ( v[1] * s ), ( v[2] * s ), Math.cos( y ) );
			}
		}
	},
	normalize: function( quat ) {
		var mag2 = quat[3] * quat[3] + quat[0] * quat[0] + quat[1] * quat[1] + quat[2] * quat[2];
		if( Math.abs( mag2 ) > 0.00001 && Math.abs( mag2 - 1.0 ) > 0.00001 ) {
			var mag = Math.sqrt( mag2 );
			return quat.create( quat[0] / mag, quat[1] / mag, quat[2] / mag, quat[3] / mag );
		}
		return quat;
	},
	inverse: function( q ) {
		return new Float32Array( [ -q[0], -q[1], -q[2], q[3] ] );
	},
	euler: function( x, y, z ) {
		var p = x * Math.PI / 180 / 2.0,
			y = y * Math.PI / 180 / 2.0,
			r = z * Math.PI / 180 / 2.0;
		var sinp = Math.sin(p),
			siny = Math.sin(y),
			sinr = Math.sin(r),
			cosp = Math.cos(p),
			cosy = Math.cos(y),
			cosr = Math.cos(r);
		return quat.normalize( quat.create(
			sinr * cosp * cosy - cosr * sinp * siny,
		  	cosr * sinp * cosy + sinr * cosp * siny,
		  	cosr * cosp * siny - sinr * sinp * cosy,
		  	cosr * cosp * cosy + sinr * sinp * siny ) );
	},
	multiply: function( q, r ) {
		return quat.create(
			q[3] * r[0] + q[0] * r[3] + q[1] * r[2] - q[2] * r[1],
			q[3] * r[1] + q[1] * r[3] + q[2] * r[0] - q[0] * r[2],
			q[3] * r[2] + q[2] * r[3] + q[0] * r[1] - q[1] * r[0],
			q[3] * r[3] - q[0] * r[0] - q[1] * r[1] - q[2] * r[2] );
	},
	mat4: function( quat ) {
		var x2 = quat[0] * quat[0],
			y2 = quat[1] * quat[1],
			z2 = quat[2] * quat[2],
			xy = quat[0] * quat[1],
			xz = quat[0] * quat[2],
			yz = quat[1] * quat[2],
			wx = quat[3] * quat[0],
			wy = quat[3] * quat[1],
			wz = quat[3] * quat[2];
		return mat4.create(
			1.0 - 2.0 * (y2 + z2), 2.0 * (xy - wz), 2.0 * (xz + wy), 0.0,
			2.0 * (xy + wz), 1.0 - 2.0 * (x2 + z2), 2.0 * (yz - wx), 0.0,
			2.0 * (xz - wy), 2.0 * (yz + wx), 1.0 - 2.0 * (x2 + y2), 0.0,
			0.0, 0.0, 0.0, 1.0 );
	},
	fromRotationMatrix: function( mat ) {
        var dest = new Float32Array( [0, 0, 0, 0] );
        var fTrace = mat[0] + mat[4] + mat[8];
        var fRoot;
        if ( fTrace > 0.0 ) {
            fRoot = Math.sqrt(fTrace + 1.0);
            dest[3] = 0.5 * fRoot;
            fRoot = 0.5/fRoot;  // 1/(4w)
            dest[0] = (mat[7]-mat[5])*fRoot;
            dest[1] = (mat[2]-mat[6])*fRoot;
            dest[2] = (mat[3]-mat[1])*fRoot;
        } else {
            var s_iNext = quat.fromRotationMatrix.s_iNext = quat.fromRotationMatrix.s_iNext || [1,2,0];
            var i = 0;
            if ( mat[4] > mat[0] )
              i = 1;
            if ( mat[8] > mat[i*3+i] )
              i = 2;
            var j = s_iNext[i];
            var k = s_iNext[j];
            fRoot = Math.sqrt(mat[i*3+i]-mat[j*3+j]-mat[k*3+k] + 1.0);
            dest[i] = 0.5 * fRoot;
            fRoot = 0.5 / fRoot;
            dest[3] = (mat[k*3+j] - mat[j*3+k]) * fRoot;
            dest[j] = (mat[j*3+i] + mat[i*3+j]) * fRoot;
            dest[k] = (mat[k*3+i] + mat[i*3+k]) * fRoot;
        }
        return dest;
    }
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
	clone: function( m ) {
		return new Float32Array(
		  [ m[0],	m[1],	m[2],	m[3],
		    m[4],	m[5],	m[6],	m[7],
			m[8],	m[9],	m[10],	m[11],
			m[12],	m[13],	m[14],	m[15] ] ); },
	flatten: function( m ) {
		return new Float32Array(
		  [ m[0],	m[4],	m[8],	m[12],
		    m[1],	m[5],	m[9],	m[13],
			m[2],	m[6],	m[10],	m[14],
			m[3],	m[7],	m[11],	m[15] ] ); },
	perspective: function( fovy, aspect, znear, zfar ) {
    	var ymax = znear * Math.tan(fovy * Math.PI / 360.0),
			ymin = -ymax,
    		xmin = ymin * aspect,
    		xmax = ymax * aspect;
    	return mat4.frustum( xmin, xmax, ymin, ymax, znear, zfar ); },
    frustum: function( left, right, bottom, top, znear, zfar ) {
    	var X = 2 * znear / ( right - left ),
	    	Y = 2 * znear / ( top - bottom ),
    		A = ( right + left ) / ( right - left ),
	    	B = ( top + bottom ) / ( top - bottom ),
    		C = -( zfar + znear ) / ( zfar - znear ),
	    	D = -2 * zfar * znear / ( zfar - znear );
    	return mat4.create(
    		X, 0, A, 0,
	        0, Y, B, 0,
    	    0, 0, C, D,
        	0, 0, -1, 0 ); },
	ortho: function( left, right, bottom, top, znear, zfar) {
	    var tx = -( right + left ) / ( right - left ),
			ty = -( top + bottom ) / ( top - bottom ),
			tz = -( zfar + znear ) / ( zfar - znear );

    	return mat4.create( 2 / ( right - left ), 0, 0, tx,
							0, 2 / ( top - bottom ), 0, ty,
							0, 0, -2 / ( zfar - znear ), tz,
							0, 0, 0, 1 ); },
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
		var A1 = [m[0], m[1], m[2], m[3]],
			A2 = [m[4], m[5], m[6], m[7]],
			A3 = [m[8], m[9], m[10],m[11]],
			A4 = [m[12],m[13],m[14],m[15]],
			B1 = [n[0], n[4], n[8], n[12]],
			B2 = [n[1], n[5], n[9], n[13]],
			B3 = [n[2], n[6], n[10],n[14]],
			B4 = [n[3], n[7], n[11],n[15]];
		return new Float32Array(
		  [	mat4.mh(A1, B1), mat4.mh(A1, B2), mat4.mh(A1, B3), mat4.mh(A1, B4),
			mat4.mh(A2, B1), mat4.mh(A2, B2), mat4.mh(A2, B3), mat4.mh(A2, B4),
			mat4.mh(A3, B1), mat4.mh(A3, B2), mat4.mh(A3, B3), mat4.mh(A3, B4),
			mat4.mh(A4, B1), mat4.mh(A4, B2), mat4.mh(A4, B3), mat4.mh(A4, B4) ] );
	},
	rotateY: function( m, a ) {
		var t = mat4.create(),
			c = Math.cos( a ),
			s = Math.sin( a );
		t[0] = c;
		t[2] = -s;
		t[8] = s;
		t[10] = c;
		return mat4.multiply( m, t );
	},
	$rotate: function ( mat, angle, axis, dest ) {
        var x = axis[0], y = axis[1], z = axis[2],
            len = Math.sqrt(x * x + y * y + z * z),
            s, c, t,
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;
        if (!len) { return null; }
        if (len !== 1) {
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
        }
        s = Math.sin(angle);
        c = Math.cos(angle);
        t = 1 - c;
        a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
        a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
        a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
        if (!dest) {
            dest = mat;
        } else if (mat !== dest) {
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        }
        dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
        dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
        dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
        dest[3] = a03 * b00 + a13 * b01 + a23 * b02;

        dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
        dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
        dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
        dest[7] = a03 * b10 + a13 * b11 + a23 * b12;

        dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
        dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
        dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
        dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
        return dest;
    },
	rotate: function( m, v ) {
		var t = mat4.create(),
			r = mat4.create();
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
	},
	look: function( eye, center, up ) {
    	var z = vec3.normalize( vec3.subtract( eye, center ) ),
    		x = vec3.normalize( vec3.cross( up, z ) ),
    		y = vec3.normalize( vec3.cross( z, x ) ),
    		m = mat4.create(
				x[0], x[1], x[2], 0,
            	y[0], y[1], y[2], 0,
            	z[0], z[1], z[2], 0,
            	0, 0, 0, 1 ),
   			t = mat4.create(
				1, 0, 0, -eye[0],
            	0, 1, 0, -eye[1],
            	0, 0, 1, -eye[2],
            	0, 0, 0, 1 );
    	return mat4.multiply( m, t );
	},
	lookAt: function (eye, center, up) {
        var dest = mat4.create();

        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            centerx = center[0],
            centery = center[1],
            centerz = center[2];

        if (eyex === centerx && eyey === centery && eyez === centerz) {
            return mat4.identity(dest);
        }

        //vec3.direction(eye, center, z);
        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        // normalize (no check needed for 0 because of early return)
        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        //vec3.normalize(vec3.cross(up, z, x));
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        //vec3.normalize(vec3.cross(z, x, y));
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        dest[0] = x0;
        dest[1] = y0;
        dest[2] = z0;
        dest[3] = 0;
        dest[4] = x1;
        dest[5] = y1;
        dest[6] = z1;
        dest[7] = 0;
        dest[8] = x2;
        dest[9] = y2;
        dest[10] = z2;
        dest[11] = 0;
        dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        dest[15] = 1;

        return dest;
    },
	transpose: function( m ) {
		var t = mat4.create();
			t[0] = m[0];
       		t[1] = m[4];
        	t[2] = m[8];
        	t[3] = m[12];
        	t[4] = m[1];
        	t[5] = m[5];
        	t[6] = m[9];
        	t[7] = m[13];
        	t[8] = m[2];
        	t[9] = m[6];
        	t[10] = m[10];
        	t[11] = m[14];
        	t[12] = m[3];
        	t[13] = m[7];
        	t[14] = m[11];
        	t[15] = m[15];
		return t;
	},
	inverse: function( m ) {
		var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3],
            a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7],
            a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11],
            a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,
            d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
            invDet;
		invDet = 1 / d;
		var t = mat4.clone( m );
			t[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        	t[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
        	t[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        	t[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
        	t[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
       		t[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        	t[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
        	t[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        	t[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        	t[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
        	t[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        	t[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
        	t[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
        	t[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        	t[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
        	t[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
		return t;
	}
}