function PSSG() {
	this.header = new HEADER();
	this.chunks = [];
	
	this.ctypes = [];
	this.ptypes = [];
}

function TYPE( name ) {
	this.name = name;
	this.parts = [];
}

function PART( name, type, amount ) {
	this.name = name;
	this.type = type;
	this.amount = amount;
	this.data = "";
}

function CHUNK( name ) {
	this.name = name || "no name";
	
	this.parts = [];
	this.pident = {};
}

function HEADER() {
	this.name = "header";
	this.parts = [];
	this.pident = {
		"head":  0,
		"size":  1,
		"props": 2,
		"types": 3 };
	this.parts.push( new PART( "head", "char", 4 ) );
	this.parts.push( new PART( "size", "int", 1 ) );
	this.parts.push( new PART( "props", "int", 1 ) );
	this.parts.push( new PART( "types", "int", 1 ) );
}

CHUNK.prototype = HEADER.prototype = {
	add: function( type, amount ) {
		this.parts.push( new PART( type, amount ) );
	},
	read: function() {
		dC.process( this );
	}
}

function block( name ) {
	this.name = name;
	this.type = "";
	this.data = "";
}