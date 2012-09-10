var Controls = {
	keys: { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, W: 87, A: 65, S:83, D:68,
		down: false, up: false, left: false, right: false, w: false, a: false, s: false, d: false },
	any: function( type ) {
		switch( type ) {
			case "arrows": return (Controls.keys.up || Controls.keys.down || Controls.keys.left || Controls.keys.right); break;
			case "wasd": return (Controls.keys.w || Controls.keys.a || Controls.keys.s || Controls.keys.d); break;
		}
	},
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
		case Controls.keys.W:			Controls.keys.w = true; break;
		case Controls.keys.A:			Controls.keys.a = true; break;
		case Controls.keys.S:			Controls.keys.s = true; break;
		case Controls.keys.D:			Controls.keys.d = true; break;
	}
	if( _gl.xRot > 360 ) 	_gl.xRot -= 360;
	if( _gl.yRot > 360 ) 	_gl.yRot -= 360;
	if( _gl.xRot < -360 ) 	_gl.xRot += 360;
	if( _gl.yRot < -360 ) 	_gl.yRot += 360;
	if( _gl.yYaw > 360 ) 	_gl.yYaw -= 360;
	if( _gl.yYaw < 0 ) 		_gl.yYaw += 360;
}

function onKeyUp( ev ) {
	switch( ev.keyCode ) {
		case Controls.keys.UP:			Controls.keys.up = false; break;
		case Controls.keys.DOWN:		Controls.keys.down = false; break;
		case Controls.keys.LEFT:		Controls.keys.left = false; break;
		case Controls.keys.RIGHT:		Controls.keys.right = false; break;
		case Controls.keys.W:			Controls.keys.w = false; break;
		case Controls.keys.A:			Controls.keys.a = false; break;
		case Controls.keys.S:			Controls.keys.s = false; break;
		case Controls.keys.D:			Controls.keys.d = false; break;
	}
}