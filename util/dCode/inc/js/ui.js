(function() {

function $ui() { this.init(); }

/* all functionality via html is done through this ui class */
$ui.prototype = {
	init: function() { },
	
	create: function( tag, props, html ) {
		props = props || {};
		html = typeof html == "undefined" ? "" : html.toString();
		var el = new this.element( tag );
		el.prop( props );
		el.html( html );
		return el;
	},
	
	$: function( id, depth ) {
		var res = new this.elements(), id = id || "";
		if( id.substr(0,1) == "." ) {
			var els = document.getElementsByTagName("*");
			for( var i = 0; i < els.length; i++ )
				if( els[i].className == id.substr(1) )
					res.push( new this.element( els[i] ) );
		} else if( id.substr(0,1) == "#" ) {
			res.push( new this.element( document.getElementById( id.substr(1) ) ) );
		} else if( id !== "" ) {
			var els = document.getElementsByTagName( id );
			for( var i = 0; i < els.length; i++ )
				res.push( new this.element( els[i] ) );
		} else {
			var els = document.getElementsByTagName("*");
			for( var i = 0; i < els.length; i++ )
				res.push( new this.element( els[i] ) );
		}
		return res.list.length == 1 ? res.list[0] : res;
	},
	
	elements: function() { this.list = []; },
	
	element: function( type ) {
		this.target = "";
		if( typeof type == "object" )
			this.target = type;
		else
			this.target = document.createElement( type );
	},
	
	/* utility functions */
	trim: function ( str ) {
		return str.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
	},
};
/* element collection item, supplies helpers to individual element functions */
$ui.prototype.elements.prototype = {
	push: function( el ) { this.list.push( el ); },
	get: function( n ) { return this.list[n]; },
	
	append: function( el, clone ) { this.each( function() { this.append( el, clone ); } ); return this; },
	appendTo: function( el, clone ) { this.each( function() { this.appendTo( el, clone ); } ); return this; },
	html: function( data ) { this.each( function() { this.html( data ); } ); return this; },
	prop: function( property, value ) { this.each( function() { this.prop( property, value ); } ); return this; },
	style: function( el, prop, val ) { this.each( function() { this.style( el, prop, val ); } ); return this; },
	
	each: function( func ) {
		for( var i in this.list )
			func.call( this.list[i] );
		return this;
	}
};

/* functions on element objects */
$ui.prototype.element.prototype = {
	before: function( el ) {
		el = el.target || el;
		console.log( this.target.parentNode, el );
		this.target.parentNode.insertBefore( el, this.target );
	},
	
	append: function( el, clone ) {
		el = el.target || el;
		clone = clone || false;
		if( this.target == el && clone !== true )
			return this;
		if( typeof el == "object" )
			this.target.appendChild( clone ? el.clondeNode(true) : el );
		else
			this.target.appendChild( el );
		return this;
	},
	
	appendTo: function( el, clone ) {
		el = el.target || el;
		clone = clone || false;
		if( el == this.target && clone !== true )
			return this;
		el.appendChild( clone ? this.target.clondeNode(true) : this.target );
		return this;
	},
	
	html: function( data ) {
		if( typeof data == "undefined" )
			return this.target.innerHTML;
		this.target.innerHTML = typeof data == "string" ? data : "";
		return this;
	},
	
	prop: function( property, value ) {
		if( typeof value == "undefined" && typeof property == "string" )
			return this.target.getAttribute( property ) || "";
		else if( typeof property == "object" )
			for( var i in property )
				this.target.setAttribute( i, property[ i ] );
		else
			this.target.setAttribute( property, value );
		return this;
	},
	
	value: function( val ) {
		if( val === undefined )
			return this.target.value
		this.target.value = val;
	},
	
	style: function( prop, val ) {
		var style = this.target.getAttribute( "style" ) || "";
		if( typeof prop == "string" && typeof val == "undefined" )
			return style.indexOf( prop ) != -1 ?
				new RegExp( prop+":(.*?);", "ig" ).exec(style)[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '') : "";
		if( typeof prop == "object" )
			for( var i in prop ) {
				style = style.replace( new RegExp( i + ":.*?;", "ig" ), "" );
				prop[i] != "" ? style += i + ": " + prop[i] + ";" : style = style;
			}
		else if( typeof prop == "string" && typeof val == "string" )
			style = style.replace( new RegExp( prop+":.*?;", "ig"), "" ); style += prop+": "+val+";";
		this.prop( "style", style );
		return this;
	},
	
	bind: function( ev, callback ) { this.target[ev] = callback; return this; },
	children: function( id ) {
		var res = new ui.elements(),
			id = typeof id == "undefined" ? "" : id,
			childs = this.target.children;
		if( typeof id == "number" )
			return new ui.element( childs[ id ] );
		else if( id.substr(0,1) == "." )
			for( var i in childs )
				if( childs[i].className == id.substr(1) )
					res.push( new ui.element( childs[i] ) );
		else if( id.substr(0,1) == "#" )
			for( var i in childs )
				if( childs[i].id == id.substr(1) )
					res.push( new ui.element( childs[i] ) );
		else
			for( var i in childs )
				res.push( new ui.element( childs[i] ) );
		return res.list.length == 1 ? res.list[0] : res;
	},
	each: function( func ) { func.call( this ); return this; }
};

window.ui = new $ui();
window.$ = (function() { return ui.$( arguments[0], arguments[1] ); } );

})();