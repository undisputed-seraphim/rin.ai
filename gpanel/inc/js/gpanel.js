(function() {

/* super function for obtaining sets of html elements */
window.g = function g( ids, dom ) {
	dom = dom || document;
	ids = ids || "";
	var res = [],
		targets = ids === "" ? [""] : map( ids.split( "," ), trim ),
		temp = "",
		cur = "";

	for( var i = 0; i < targets.length; i++ ) {
		cur = targets[i];
		switch( cur.substr( 0, 1 ) || "*" ) {
			case "#":
				/* by id */
				temp = dom.getElementById( trim( cur.substr( 1 ) ) );
				if( temp )
					if( !inArray( res, temp ) )
						res.push( temp );
				break;
			case ".":
				/* by class name */
				temp = dom.getElementsByTagName( "*" );
				for( var j = 0; j < temp.length; j++ )
					if( temp[j].nodeType === 1 )
						if( inArray( ( temp[j].className || "" ).split(" "), trim( cur.substr( 1 ) ) ) )
							if( !inArray( res, temp[j] ) )
								res.push( temp[j] );
				break;
			case "*":
				/* all elements */
				temp = dom.getElementsByTagName( "*" );
				for( var j = 0; j < temp.length; j++ )
					if( temp[j].nodeType === 1 )
						if( !inArray( res, temp[j] ) )
							res.push( temp[j] );
				break;
			default:
				/* by tag name */
				temp = dom.getElementsByTagName( cur );
				for( var j = 0; j < temp.length; j++ )
					if( temp[j].nodeType === 1 )
						if( !inArray( res, temp[j] ) )
							res.push( temp[j] );
				break;
		}
	}

	return new set( res );
}

/* a set object used to store result sets of items obtained with $() */
function set( els ) {
	els = els || [];
	this.length = els.length;
	this.elements = [];
	for( var i = 0; i < els.length; i++ )
		if( els[i] )
			this.elements.push( new element( els[i] ) );
}

/* functionality for set objects */
set.prototype = {
	
	/* merge multiple sets into one list */
	merge: function( arr ) {
		arr = makeArray( arr );
		var res = [];
		for( var i = 0; i < arr.length; i++ )
			for( var j = 0; j < arr[i].length; j++ )
				if( !inArray( res, arr[i].elements[j] ) )
					res.push( arr[i].elements[j].target );
		return new set( res );
	},
	
	/* perform a function on each item in the set */
	each: function( func ) {
		var res = [];
		for( var i = 0; i < this.elements.length; i++ )
			res.push( func.call( this.elements[i] ) );
		return res.length === 1 ? res[0] : res;
	},
	
	/* get item at index n of the set */
	get: function( n ) {
		n = n || 0;
		if( typeof n == "number" && this.elements[n] )
			return new set( [ this.elements[n].target ] );
		if( n === "" )
			return this;
		return new set(); 
	},
	
	/* grab a new set with only the first element included */
	first: function() {
		if( this.length > 0 )
			return new set( [ this.elements[0] ] );
		return this;
	},
	
	/* check if set is empty */
	empty: function() { return this.length == 0; },
	
	/* get previous sibling of element */
	previous: function() {
		if( this.length === 1 )
			return this.elements[0].prev();
		return this.merge( this.each( function() { return this.prev(); } ) );
	},
	
	/* get next sibling of element */
	next: function() {
		if( this.length === 1 )
			return this.elements[0].next();
		return this.merge( this.each( function() { return this.next(); } ) );
	},
	
	/* get the parent of the FIRST node in the set */
	parent: function() { return this.each( function() { return this.parent(); } ); },
	
	/* get or set the direct properties of items within a set */
	property: function( prop, val ) {
		var res = this.each( function() { return this.property( prop, val ); } );
		return typeof val == "undefined" ? res : this;
	},
	
	/* get or set attributes of items within a set */
	attribute: function( prop, val ) {
		var res = this.each( function() { return this.attribute( prop, val ); } );
		return typeof val == "undefined" ? res : this;
	},
	
	/* get or set value attribute of elements */
	value: function( val ) {
		var res = this.each( function() { return this.value( val ); } );
		return typeof val == "undefined" ? res : this;
	},
	
	/* get or set style of items within a set */
	style: function( prop, val ) {
		var res = this.each( function() { return this.style( prop, val ); } );
		return typeof val == "undefined" ? res : this;
	},
	
	/* check if items within a set all contain particular class */
	hasClass: function( cls ) { return trueArray( this.each( function() { return this.hasClass( cls ); } ) ); },
	
	/* add class to all items in set */
	addClass: function( cls ) { return this.each( function() { return this.addClass( cls ); } ); },
	
	/* remove class from all items in set */
	removeClass: function( cls ) { return this.each( function() { return this.removeClass( cls ); } ); },
	
	/* toggle given class on all items in a set */
	toggleClass: function( cls ) { return this.each( function() { return this.toggleClass( cls ); } ); },
	
	/* get children of items within a set */
	children: function( ids ) { return this.merge( this.each( function() { return this.children( ids ); } ) ); },
	
	/* bind a function to an event handler on the element */
	bind: function( ev, callback ) { return this.each( function() { return this.bind( ev, callback ); } ); },
	
	/* focus the first element in a set */
	focus: function() { if( this.length > 0 ) this.elements[0].focus(); return this; }
};

/* element object, points to a target dom element */
function element( dom ) { this.target = dom; }

/* functionality of element objects */
element.prototype = {
	
	/* get previous sibling of an element */
	previous: function() {
		do res = this.target.previousSibling;
			while( res && res.nodeType !== 1 );
		return res ? new set( [ res ] ) : new set ();
	},
	
	/* get next sibling of an element */
	next: function() {
		do res = this.target.nextSibling;
			while( res && res.nodeType !== 1 );
		return res ? new set( [ res ] ) : new set ();
	},
	
	/* get parentNode of the element */
	parent: function() {
		if( this.target.parentNode )
			return new set( [ this.target.parentNode ] );
		return new set();
	},
	
	/* get or set a direct property of the dom target */
	property: function( prop, val ) {
		if( typeof val == "undefined" && typeof prop == "string" )
			return this.target[prop] || "";
		if( typeof prop == "object" )
			for( var i in prop )
				this.target[i] = prop[i];
		else this.target[prop] = val;
	},
	
	/* get or set an attribute of an element object */
	attribute: function( prop, val ) {
		if( typeof val == "undefined" && typeof prop == "string" )
			return this.target.getAttribute( prop ) || "";
		else if( typeof prop == "object" )
			for( var i in prop )
				this.target.setAttribute( i, prop[ i ] );
		else
			this.target.setAttribute( prop, val );
		return this;
	},
	
	/* get or set value of element, while firing the element's onchange if needed */
	value: function( val ) {
		if( typeof val == "undefined" ) {
			if( this.target.tagName.toLowerCase() == "select" )
				return this.children("option").get( this.target.selectedIndex ).value() || "";
			else
				return this.target.getAttribute( "value" ) || this.target.value || "";
		}
		
		if( this.target.tagName.toLowerCase() == "select" ) {
			if( typeof val == "number" ) {
				if( !this.children("option").get( val ).empty() )
					this.target.selectedIndex = val;
				else
					this.target.selectedIndex = 0;
			} else {
				var opts = this.children("option").elements;
				for( var i = 0; i < opts.length; i++ )
					if( opts[i].value().toLowerCase() == val.toLowerCase() )
						this.target.selectedIndex = i;
			}
		} else
			this.attribute( "value", val );
			
		if( this.target.onchange )
			this.target.onchange();
	},
	
	/* get or set properties of an element object's style */
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
		this.attribute( "style", style );
		return this;
	},
	
	/* check if element has a particular class */
	hasClass: function( cls ) {
		var classes = this.target.className.replace(/\s{2,}/g, ' ').split(" ");
		return inArray( classes, cls );
	},
	
	/* add class to element */
	addClass: function( cls ) {
		if( !this.hasClass( cls ) )
			this.target.className = trim( this.target.className + " " + cls );
		return this;
	},
	
	/* remove class from an element */
	removeClass: function( cls ) {
		if( !this.hasClass( cls ) )
			return this;
		var classes = this.target.className.replace(/\s{2,}/g, ' ').split(" ");
		for( var i = 0; i < classes.length; i++ )
			if( classes[i] == cls )
				classes.splice( i, 1 );
		this.target.className = classes.join(" ");
		return this;
	},
	
	/* remove class if it exists, or add if it doesnt */
	toggleClass: function( cls ) {
		this.hasClass( cls ) ? this.removeClass( cls ) : this.addClass( cls );
		return this;
	},
	
	/* get children of an element object based on id(#)/class(.)/tag name */
	children: function( ids ) {
		ids = typeof ids == "undefined" ? "" : ids;
		if( typeof ids == "number" )
			return this.target.children[ids] ? new set( [ this.target.children[ids] ] ) : new set();

		var results = [],
			targets = ids === "" ? [""] : map( ids.split( "," ), trim ),
			childs = this.target.children;

		for( var i = 0; i < childs.length; i++ ) {
			for( var j = 0; j < targets.length; j++ ) {
				switch( targets[j].substr( 0, 1 ) || "" ) {
					case "#":
						/* children by id */
						if( inArray( ( childs[i].getAttribute( "id" ) || "" ).split(" "), targets[j].substr(1) ) )
							if( !inArray( results, childs[i] ) )
								results.push( childs[i] );
						break;
					case ".":
						/* children by class name */
						if( inArray( ( childs[i].className || "" ).split(" "), targets[j].substr(1) ) )
							if( !inArray( results, childs[i] ) )
								results.push( childs[i] );
						break;
					case "":
						/* all children */
						if( !inArray( results, childs[i] ) )
							results.push( childs[i] );
						break;
					default:
						/* children by tag name */
						if( childs[i].tagName.toLowerCase() == targets[j].toLowerCase() )
							if( !inArray( results, childs[i] ) )
								results.push( childs[i] );
						break;
				}
			}
		}

		return new set( results );
	},
	
	/* bind a function as an event callback */
	bind: function( ev, callback ) { var el = this; this.target[ev] = function( e ) { return callback.call( el, e ); }; },
	
	/* focus on an element */
	focus: function() { this.target.focus(); }
};

/* alias functions (shortcuts) */
if( !window.$ )
	window.$ = window.g;
set.prototype.css = set.prototype.style;			element.prototype.css = element.prototype.style;
set.prototype.prev = set.prototype.previous;		element.prototype.prev = element.prototype.previous;
set.prototype.prop = set.prototype.property;		element.prototype.prop = element.prototype.property;
set.prototype.attr = set.prototype.attribute;		element.prototype.attr = element.prototype.attribute;

/* helper functions for this mini library */
function trim( str ) { return str.replace( /^\s+|\s+$/g, "" ); }
function map( arr, func ) { for( var i = 0; i < arr.length; i++ ) arr[i] = func( arr[i] ); return arr; }
function inArray( arr, el ) { for( var i = 0; i < arr.length; i++ ) if( arr[i] === el ) return true; return false; }
function makeArray( arr ) { arr = arr instanceof Array ? arr : [ arr ]; return arr; }
function trueArray( arr ) { arr = makeArray( arr ); for( var i in arr ) if( arr[i] !== true ) return false; return true; }
function byClass( cls, set ) { }

})();

function ajax( file, callback ) {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if( this.readyState == 4 )
			callback( this.responseText );
	}
	ajax.open( "get", file, true );
	ajax.send();
}

if( $("#focus").length )
	$("#focus").focus();

$(".heading").bind( "onclick", function( e ) {
	if( e.target.tagName !== "A" )
		this.next().toggleClass( "hidden" );
});

$(".section_title").bind( "onclick", function( e ) {
	this.parent().children(".section_body").toggleClass( "hidden" );
});