function vec3( x, y, z ) {
	this.x = x;
	this.y = y;
	this.z = z;
}

vec3.prototype = {
}

function mat4( $$00, $$01, $$02, $$03,
			   $$10, $$11, $$12, $$13,
			   $$20, $$21, $$22, $$23,
			   $$30, $$31, $$32, $$33 ) {
	this.m = [ $$00 || 1,		$$01 || 0,		$$02 || 0,		$$03 || 0,
			   $$10 || 0,		$$11 || 1,		$$12 || 0,		$$13 || 0,
			   $$20 || 0,		$$21 || 0,		$$22 || 1,		$$23 || 0,
			   $$30 || 0,		$$31 || 0,		$$32 || 0, 		$$33 || 1 ];
}

mat4.prototype = {
	translate: function( x, y, z ) {
		
	}
}