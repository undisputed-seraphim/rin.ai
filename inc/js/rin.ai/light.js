__$r.prototype.$Light = function $Light( type, params ) {
	this.type = type;
	this.colors = {
		ambient: [ 0.0, 0.0, 0.0 ],
		diffuse: [ 0.0, 0.0, 0.0 ],
		specular:[ 0.0, 0.0, 0.0 ] };
}

__$r.prototype.$Light.prototype = {
	update: function() {
		
	}
}