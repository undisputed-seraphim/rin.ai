var dtypes = {
	"creator":			"string",
	"creationMachine":	"string",
	"creationDate":		"string",
	"scale":			"float3",
	"up":				"float3",
	"typeName":			"string",
	"shaderGroup":		"string",
	"renderSortPriority":"uint",
	"defaultRenderSortPriority":"uint",
	"renderType":		"string",
	"dataType":			"string",
	"id":				"string",
	"type":				"string",
	"nickname":			"string",
	"joint":			"string",
	"primitive":		"string",
	"format":			"string",
	"dataBlock":		"string",
	"codeType":			"string",
	"cgStreamName":		"string",
	"cgStreamDataType":	"string",
	"cgStreamRenderType":"string",
	"name":				"string",
	"shader":			"string",
	"renderTypeName":	"string",
	"vertexProgram":	"string",
	"fragmentProgram":	"string",
	"texture":			"string",
	"parameterID":		"int",
	"texelFormat":		"string",
	"filename":			"string",
	"network":			"string",
	"indices":			"string",
	"shader":			"string",
	"blendSourceColor":	"string",
	"blendDestColor":	"string",
	"blendSourceAlpha":	"string",
	"blendDestAlpha":	"string",
	"alphaTestFunc":	"string",
	"typename":			"string",
}


function PSSG() {
	this.header = new HEADER();
	this.chunks = [];
	
	this.ctypes = [];
	this.ptypes = [];
}

PSSG.prototype = {
	get: function( n ) {
		if( typeof n == "string" ) {
			var res = [];
			for( var i in this.chunks ) {
				if( this.chunks[i].name == n )
					res.push( this.chunks[i] );
			} return res;
		} else return this.chunks[n];
	}
};

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
	this.parent = "";
	this.children = [];
	this.size = 0;
	this.start = 0;
	this.end = 0;
	
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
	},
	get: function( n ) {
		if( typeof n == "string" ) {
			var res = [];
			for( var i in this.children ) {
				if( this.children[i].name == n )
					res.push( this.children[i] );
			} return res;
		} else return this.children[n];
	},
	prop: function( n ) {
		for( var i in this.parts ) {
			if( this.parts[i].name == n ) {
				return this.parts[i].data;
			}
		}
	}
}

function block( name ) {
	this.name = name;
	this.type = "";
	this.data = "";
}