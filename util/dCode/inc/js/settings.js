var settings = {
	opts: {
		"dC_amount":			{ v: "", t: "select" },
		"dC_type":				{ v: "", t: "select" },
		"dC_buffered":			{ v: "", t: "input" },
		"dC_charAsLetter":		{ v: "", t: "checkbox" },
		"dC_extra":				{ v: "", t: "" },
	},
	
	/* update settings from html page */
	update: function() {
		for( var i in settings.opts ) {
			var el = document.getElementById(i);
			if( typeof el != "undefined" ) {
				switch( settings.opts[i].t ) {
					case "checkbox": settings.opts[i].v = el.checked; break;
					case "select": case "input": settings.opts[i].v = el.value; break;
					default: settings.opts[i].v = ""; break;
				}
			}
		}
		settings.save();
	},
	
	activate: function( opt ) {
		var el = document.getElementById( opt );
		if( typeof el != "undefined" ) {
			/* set options html element */
			switch( settings.opts[opt].t ) {
				case "checkbox": el.checked = settings.opts[opt].v == "true" ? true : false; break;
				case "select": case "input": el.value = settings.opts[opt].v; break;
				default: settings.opts[opt].v = ""; break;
			}
		}
	},
	
	/* load all settings from cookies, or specific setting */
	load: function( setting ) {
		if( setting !== undefined ) {
			settings.opts[setting].v = settings.get( setting );
			if( settings.opts[setting].v !== "" )
				settings.activate( i );
			return;
		}
		for( var i in settings.opts ) {
			settings.opts[i].v = settings.get(i);
			if( settings.opts[i].v === "" )
				i = i;
			else
				settings.activate( i );
		}
		/* there are extra settings that were saved */
		if( settings.opts["extra"] !== "" ) {}
	},
	
	/* save all settings as cookies, or save a specific setting */
	save: function( setting ) {
		if( setting !== undefined ) {
			settings.set( setting, settings.opts[setting].v );
			return;
		}
		for( var i in settings.opts )
			if( settings.opts[i] !== "" )
				settings.set( i, settings.opts[i].v );
		/* save extra settings */
		if( settings.opts["extra"] !== "" ) {}
	},
	
	/* get a setting cookie */
	get: function( name ) {
		var i, x, y, cookies = document.cookie.split(";");
		for( i = 0; i < cookies.length; i++ ) {
			x = cookies[i].substr( 0, cookies[i].indexOf( "=" ) );
			y = cookies[i].substr( cookies[i].indexOf( "=" ) + 1 );
			x = x.replace( /^\s+|\s+$/g, "" );
			if( x == name ) {
				return unescape(y);
			}
		}
		return "";
	},
	
	/* set a setting cookie */
	set: function( name, value ) {
		var exdate = new Date();
		exdate.setDate( exdate.getDate() + 255 );
		value = escape( value ) + "; expires=" + exdate.toUTCString();
		document.cookie = name + "=" + value;
	}
}