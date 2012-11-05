function chunk( name, type ) {
	this.type = type || "chunk";
	this.name = name || "no name";
	
	this.props = [];
	this.data = [];
	
	this.size = 0;
	this.begin = 0;
	this.end = 0;
}

chunk.prototype = {
	add: function( type, amount ) {
		if( typeof type === "object" )
			for( var i in type ) {
				this.props.push( { t: type[i][0], a: type[i][1] } );
				this.size += size[type[i][0]] * type[i][1];
			}
		else {
			this.props.push( { t: type, a: amount } );
			this.size += size[type] * amount;
		}
	},
	read: function() {
		dC.process( this );
	}
}