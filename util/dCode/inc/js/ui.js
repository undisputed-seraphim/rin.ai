function ui() {
	this.current = {};
	this.init();
}

/* all functionality via html is done through this ui class */
ui.prototype = {
	init: function() {
		var opts = [];
		for( var i in bIO.types ) {
			opts.push( document.createElement("option") );
			opts[ opts.length -1 ].innerHTML = bIO.types[i].name;
			opts[ opts.length -1 ].value = bIO.types[i].name;
		}
		var s = this.element("select", "select", opts );
		s.id = "type";
		this.$("initial").appendChild( s );
		opts = [];
		for( var i = 0; i < 10; i++ ) {
			opts.push( document.createElement("option") );
			opts[opts.length-1].innerHTML = i+1;
			opts[opts.length-1].value = i+1;
		}
		s = this.element("select", "select", opts );
		s.id = "num";
		this.$("initial").appendChild( s );
		
		var b = this.element("input");
		b.type = "submit";
		b.value = "Add";
		this.$("initial").appendChild( b );
		
		this.$("ntemplates").onclick = function(e) {
			dC.addTemplate();
		}
	},
	$: function( id ) { return document.getElementById( id ); },
	element: function( type, c, data ) {
		var ret = document.createElement( type );
		ret.className = c || "";
		if( typeof data==="object" ) {
			if( data.nodeType===1 && typeof data.tagName==="string" )
				ret.appendChild( data );
			else if( data[0].nodeType === 1 && typeof data[0].tagName === "string" )
				for( var i in data )
					ret.appendChild( data[i] );
			else
				for( var i in data )
					ret.innerHTML += " "+data[i];
		} else
			ret.innerHTML = data === 0 ? 0 : data || "";
		return ret;
	},
	spans: function( type ) {
		var s = this.element( "span", type[0], type[0] ),
			t = this.element( "span", "bytes", type[1] + "&times;"+size[type[0]]+" bytes" );
		return [s, t];
	},
	heading: function( n ) {
		l = this.element("label", "heading", n );
		this.$("content").appendChild( l );
	},
	label: function( n ) {
		var f = document.createElement("fieldset"),
			l = document.createElement("legend"),
			s = this.element( "span", "left", 0 ),
			t = this.element( "span", "right", 0 );
		l.innerHTML = n;
		l.appendChild(s);
		l.appendChild(t);
		f.appendChild(l);
		this.$("content").appendChild(f);
		this.current = { e:f, begin: s, end: t };
	},
	bounds: function( b, e ) {
		this.current.begin.innerHTML = b;
		this.current.end.innerHTML = e;
	},
	entry: function( type, data ) {
		var l = this.element( "div", "left", this.element( "span", type[0], data ) ),
			r = this.element( "div", "right", this.spans( type ) );
			
		var e = this.element( "div", "entry", [l, r] );
		
		this.current.e.appendChild(e);
	},
	tab: function( n ) {
		var res = "";
		for( var i = 0; i < (n || 1) * 5; i++ )
			res += "&nbsp;";
		return res;
	}
}