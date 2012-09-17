(function(){

__$r.prototype.$Primitive = function $Primitive( type, params ) {
	this.type = type;
	this.ready = false;
	this.mesh = { v: "", n: "", t: "", i: "" };
	this.create( type, params );
}

__$r.prototype.$Primitive.prototype = {
	create: function( type, params ) {
		switch( type ) {
			case "cube":
				this.faces = params.faces.toUpperCase() || "TRBLFD";
				this.scale = params.scale || 1;
				break;
		}
	},
	buffer: function() {
	},
	render: function() {
	},
}

})();