__$r.prototype.$Timer = function $Timer() {	
	this.recent = new Date().getTime();
}

__$r.prototype.$Timer.prototype = {

	set: function( n ) {
		this.time = n || 0;
		return this;
	},
	
	get: function() {
		this.recent = (new Date().getTime());
		return this.time;
	},
	
	dif: function() {
		var res = (new Date().getTime()) - this.recent;
		this.recent = new Date().getTime();
		return res; 
	},
	
	inc: function( n ) {
		n = n || 1;
		this.time += n;
		if( this.time > this.limit ) {
			this.time = this.limit - this.time;
		}
	},
}