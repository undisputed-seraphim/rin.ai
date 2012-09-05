var Controls = {
	keys: { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, down: false, up: false, left: false, right: false },
	any: function() { return (Controls.keys.up || Controls.keys.down || Controls.keys.left || Controls.keys.right); },
	enable: function( type ) {
		switch( type ) {
			case "world":
				document.onkeydown = onKeyDown;
				document.onkeyup = onKeyUp;
				break;
		}
	}
}

function onKeyDown( ev ) {
	switch( ev.keyCode ) {
		case Controls.keys.UP:			Controls.keys.up = true; break;
		case Controls.keys.DOWN:		Controls.keys.down = true; break;
		case Controls.keys.LEFT:		Controls.keys.left = true; break;
		case Controls.keys.RIGHT:		Controls.keys.right = true; break;
	}
	if( _gl.xRot > 360 ) 	_gl.xRot = _gl.xRot - 360;
	if( _gl.yRot > 360 ) 	_gl.yRot = _gl.yRot - 360;
	if( _gl.xRot < -360 ) 	_gl.xRot = _gl.xRot + 360;
	if( _gl.yRot < -360 ) 	_gl.yRot = _gl.yRot + 360;
}

function onKeyUp( ev ) {
	switch( ev.keyCode ) {
		case Controls.keys.UP:			Controls.keys.up = false; break;
		case Controls.keys.DOWN:		Controls.keys.down = false; break;
		case Controls.keys.LEFT:		Controls.keys.left = false; break;
		case Controls.keys.RIGHT:		Controls.keys.right = false; break;
	}
}