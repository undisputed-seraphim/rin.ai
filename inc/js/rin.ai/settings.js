var Settings = {
	flags: {
		showBoundingBox: false,
		showSkeleton: false,
	},
	visible: function( item, bool ) {
		if( bool === undefined ) return Settings.flags[item];
		else if( Settings.flags[item] !== undefined )
			Settings.flags[item] = bool;
	},
	update: function() {
		for( var i in Settings.flags ) {
			var element = document.getElementById( i );
			if( element ) {
				Settings.flags[i] = element.checked;
			}
		}
	}
}