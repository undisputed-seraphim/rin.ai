(function(){

__$r.prototype.$Primitive = function $Primitive( type, params ) {
	this.type = type;
	this.ready = false;
	this.mesh = new rin.$Mesh();
	this.create( params );
}

__$r.prototype.$Primitive.prototype = {
	create: function( params ) {
		switch( this.type ) {
			case "cube": this.cube( params ); break;
		}
	},
	cube: function( params ) {
		params = params || {};
		var xmin = params.xmin || -1,
			xmax = params.xmax || 1,
			ymin = params.ymin || -1,
			ymax = params.ymax || 1,
			zmin = params.zmin || -1,
			zmax = params.zmax || 1;
		this.mesh.frame( 0 ).node("default").mat("default");
		this.mesh.vertex( xmin, ymax, zmin ).vertex( xmax, ymax, zmin )
				 .vertex( xmax, ymin, zmin ).vertex( xmin, ymin, zmin )
				 .vertex( xmin, ymax, zmax ).vertex( xmax, ymax, zmax )
				 .vertex( xmax, ymin, zmax ).vertex( xmin, ymin, zmax );
		this.mesh.normal( 0, 0, -1 ).normal( 0, 0, -1 )
				 .normal( 0, 0, -1 ).normal( 0, 0, -1 )
				 .normal( 0, 0, 1 ).normal( 0, 0, 1 )
				 .normal( 0, 0, 1 ).normal( 0, 0, 1 );
		this.mesh.face( 0, 1, 3 ).face( 1, 3, 2 ).face( 4, 5, 7 ).face( 5, 7, 6 )
				 .face( 0, 4, 3 ).face( 4, 3, 7 ).face( 1, 5, 2 ).face( 5, 2, 6 )
				 .face( 0, 1, 4 ).face( 1, 4, 5 ).face( 2, 3, 6 ).face( 3, 6, 7 );
		this.mesh.init();
	},
	render: function() { this.mesh.render(); },
}

})();