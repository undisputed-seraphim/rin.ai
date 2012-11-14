var Controls = {
	keys: {
		UP:		38,		up:		false,		LEFT:	37,		left:	false,
		DOWN:	40,		down:	false,		RIGHT:	39,		right:	false,
		SPACE:	32,		space:	false,		CTRL:	17,		ctrl:	false,
		SHIFT:	16,		shift:	false,		ALT:	18,		alt:	false,
		ONE:	49,		one:	false,		TWO:	50,		two:	false,
		THREE:	51,		three:	false,		FOUR:	52,		four:	false,
		FIVE:	53,		five:	false,		SIX:	54,		six:	false,
		SEVEN:	55,		seven:	false,		EIGHT:	56,		eight:	false,
		NINE:	57,		nine:	false,		ZERO:	48,		zero:	false,
		NUMPAD1:97,		numpad1:false,		NUMPAD2:98,		numpad2:false,
		NUMPAD3:99,		numpad3:false,		NUMPAD4:100,	numpad4:false,
		NUMPAD5:101,	numpad5:false,		NUMPAD6:102,	numpad6:false,
		NUMPAD7:103,	numpad7:false,		NUMPAD8:104,	numpad8:false,
		NUMPAD9:105,	numpad9:false,		NUMPAD0:96,		numpad0:false,
		TIMES:	106,	times:	false,		ADD:	107,	add:	false,
		MINUS:	109,	minus:	false,		DECIMAL:110,	decimal:false,
		DIVIDE:	111,	divide:	false,		TILDE:	192,	tilde:	false,
		BSPACE:	8,		bspace:	false,		DEL:	46,		del:	false,
		HOME:	36,		home:	false,		END:	35,		end:	false,
		PGUP:	33,		pgup:	false,		PGDN:	34,		pgdn:	false,
		HYPHEN:	189,	hyphen: false,		EQUALS:	187,	equals:	false,
		LBRACK:	219,	lbrack:	false,		RBRACK:	221,	rbrack:	false,
		BSLASH:	220,	bslash:	false,		FSLASH:	191,	fslash:	false,
		COLON:	186,	colon:	false,		QUOTE:	222,	quote:	false,
		COMMA:	188,	comma:	false,		PERIOD:	190,	period:	false,
		ESC:	27,		esc:	false,		ENTER:	13,		enter:	false,
		INSERT:	45,		insert:	false,		TAB:	9,		tab:	false,
		A:		65,		a:		false,		B:		66,		b:		false,
		C:		67,		c:		false,		D:		68,		d:		false,
		E:		69,		e:		false,		F:		70,		f:		false,
		G:		71,		g:		false,		H:		72,		h:		false,
		I:		73,		i:		false,		J:		74,		j:		false,
		K:		75,		k:		false,		L:		76,		l:		false,
		M:		77,		m:		false,		N:		78,		n:		false,
		O:		79,		o:		false,		P:		80,		p:		false,
		Q:		81,		q:		false,		R:		82,		r:		false,
		S:		83,		s:		false,		T:		84,		t:		false,
		U:		85,		u:		false,		V:		86,		v:		false,
		W:		87,		w:		false,		X:		88,		x:		false,
		Y:		89,		y:		false,		Z:		90,		z:		false,
		LMOUSE:	0,		lmouse:	false,		RMOUSE:	2,		rmouse:	false,
		MMOUSE:	1,		mmouse:	false,		MWHEEL:	0,		mwheel:	false
	},
	any: function( type ) {
		switch( type ) {
			case "arrows": return ( Controls.keys.down || Controls.keys.up ||
								    Controls.keys.left || Controls.keys.right ); break;
			case "numbers": return ( Controls.keys.zero || Controls.keys.one  || Controls.keys.two || Controls.keys.three ||
									 Controls.keys.four || Controls.keys.five || Controls.keys.six || Controls.keys.seven ||
									 Controls.keys.nine || Controls.keys.eight ); break;
			case "numpad": return ( Controls.keys.numpad0 || Controls.keys.numpad1 || Controls.keys.numpad2 || Controls.keys.numpad3 ||
								    Controls.keys.numpad4 || Controls.keys.numpad5 || Controls.keys.numpad6 || Controls.keys.numpad7 ||
									Controls.keys.numpad8 || Controls.keys.numpad9 || Controls.keys.add		|| Controls.keys.divide	 ||
									Controls.keys.times	  || Controls.keys.minus   || Controls.keys.decimal ); break;
			case "wasd": return ( Controls.keys.w || Controls.keys.a ||
								  Controls.keys.s || Controls.keys.d ); break;
		}
	},
	enable: function( type ) {
		Controls.disable();
		document.onkeydown = Controls.onKeyDown;
		document.onkeyup = Controls.onKeyUp;
		document.onmousedown = Controls.onMouseDown;
		document.onmouseup = Controls.onMouseUp;
	},
	disable: function() {
		document.onkeydown = null;
		document.onkeyup = null;
	},
	onKeyDown: function( ev ) {
		switch( ev.keyCode ) {
			case Controls.keys.UP:			Controls.keys.up =		true; break;
			case Controls.keys.DOWN:		Controls.keys.down =	true; break;
			case Controls.keys.LEFT:		Controls.keys.left =	true; break;
			case Controls.keys.RIGHT:		Controls.keys.right =	true; break;
			case Controls.keys.SPACE:		Controls.keys.space =	true; break;
			case Controls.keys.SHIFT:		Controls.keys.shift =	true; break;
			case Controls.keys.ONE:			Controls.keys.one =		true; break;
			case Controls.keys.TWO:			Controls.keys.two =		true; break;
			case Controls.keys.THREE:		Controls.keys.three =	true; break;
			case Controls.keys.FOUR:		Controls.keys.four =	true; break;
			case Controls.keys.FIVE:		Controls.keys.five =	true; break;
			case Controls.keys.SIX:			Controls.keys.six =		true; break;
			case Controls.keys.SEVEN:		Controls.keys.seven =	true; break;
			case Controls.keys.EIGHT:		Controls.keys.eight =	true; break;
			case Controls.keys.NINE:		Controls.keys.nine =	true; break;
			case Controls.keys.ZERO:		Controls.keys.zero =	true; break;
			
			case Controls.keys.NUMPAD1:		Controls.keys.numpad1 =	true; break;
			case Controls.keys.NUMPAD2:		Controls.keys.numpad2 =	true; break;
			case Controls.keys.NUMPAD3:		Controls.keys.numpad3 =	true; break;
			case Controls.keys.NUMPAD4:		Controls.keys.numpad4 =	true; break;
			case Controls.keys.NUMPAD5:		Controls.keys.numpad5 =	true; break;
			case Controls.keys.NUMPAD6:		Controls.keys.numpad6 =	true; break;
			case Controls.keys.NUMPAD7:		Controls.keys.numpad7 =	true; break;
			case Controls.keys.NUMPAD8:		Controls.keys.numpad8 =	true; break;
			case Controls.keys.NUMPAD9:		Controls.keys.numpad9 =	true; break;
			case Controls.keys.NUMPAD0:		Controls.keys.numpad0 =	true; break;
			case Controls.keys.DIVIDE:		Controls.keys.divide =	true; break;
			case Controls.keys.TIMES:		Controls.keys.times =	true; break;
			case Controls.keys.MINUS:		Controls.keys.minus =	true; break;
			case Controls.keys.ADD:			Controls.keys.add =		true; break;
			case Controls.keys.DECIMAL:		Controls.keys.decimal =	true; break;
			
			case Controls.keys.A:			Controls.keys.a =		true; break;
			case Controls.keys.B:			Controls.keys.b =		true; break;
			case Controls.keys.C:			Controls.keys.c =		true; break;
			case Controls.keys.D:			Controls.keys.d =		true; break;
			case Controls.keys.E:			Controls.keys.e =		true; break;
			case Controls.keys.F:			Controls.keys.f =		true; break;
			case Controls.keys.G:			Controls.keys.g =		true; break;
			case Controls.keys.H:			Controls.keys.h =		true; break;
			case Controls.keys.I:			Controls.keys.i =		true; break;
			case Controls.keys.J:			Controls.keys.j =		true; break;
			case Controls.keys.K:			Controls.keys.k =		true; break;
			case Controls.keys.L:			Controls.keys.l =		true; break;
			case Controls.keys.M:			Controls.keys.m =		true; break;
			case Controls.keys.N:			Controls.keys.n =		true; break;
			case Controls.keys.O:			Controls.keys.o =		true; break;
			case Controls.keys.P:			Controls.keys.p =		true; break;
			case Controls.keys.Q:			Controls.keys.q =		true; break;
			case Controls.keys.R:			Controls.keys.r =		true; break;
			case Controls.keys.S:			Controls.keys.s =		true; break;
			case Controls.keys.T:			Controls.keys.t =		true; break;
			case Controls.keys.U:			Controls.keys.u =		true; break;
			case Controls.keys.V:			Controls.keys.v =		true; break;
			case Controls.keys.W:			Controls.keys.w =		true; break;
			case Controls.keys.X:			Controls.keys.x =		true; break;
			case Controls.keys.Y:			Controls.keys.y =		true; break;
			case Controls.keys.Z:			Controls.keys.z =		true; break;
		}
	},
	onKeyUp: function( ev ) {
		switch( ev.keyCode ) {
			case Controls.keys.UP:			Controls.keys.up =		false; break;
			case Controls.keys.DOWN:		Controls.keys.down =	false; break;
			case Controls.keys.LEFT:		Controls.keys.left =	false; break;
			case Controls.keys.RIGHT:		Controls.keys.right =	false; break;
			case Controls.keys.SPACE:		Controls.keys.space =	false; break;
			case Controls.keys.SHIFT:		Controls.keys.shift =	false; break;
			case Controls.keys.ONE:			Controls.keys.one =		false; break;
			case Controls.keys.TWO:			Controls.keys.two =		false; break;
			case Controls.keys.THREE:		Controls.keys.three =	false; break;
			case Controls.keys.FOUR:		Controls.keys.four =	false; break;
			case Controls.keys.FIVE:		Controls.keys.five =	false; break;
			case Controls.keys.SIX:			Controls.keys.six =		false; break;
			case Controls.keys.SEVEN:		Controls.keys.seven =	false; break;
			case Controls.keys.EIGHT:		Controls.keys.eight =	false; break;
			case Controls.keys.NINE:		Controls.keys.nine =	false; break;
			case Controls.keys.ZERO:		Controls.keys.zero =	false; break;
			
			case Controls.keys.NUMPAD1:		Controls.keys.numpad1 =	false; break;
			case Controls.keys.NUMPAD2:		Controls.keys.numpad2 =	false; break;
			case Controls.keys.NUMPAD3:		Controls.keys.numpad3 =	false; break;
			case Controls.keys.NUMPAD4:		Controls.keys.numpad4 =	false; break;
			case Controls.keys.NUMPAD5:		Controls.keys.numpad5 =	false; break;
			case Controls.keys.NUMPAD6:		Controls.keys.numpad6 =	false; break;
			case Controls.keys.NUMPAD7:		Controls.keys.numpad7 =	false; break;
			case Controls.keys.NUMPAD8:		Controls.keys.numpad8 =	false; break;
			case Controls.keys.NUMPAD9:		Controls.keys.numpad9 =	false; break;
			case Controls.keys.NUMPAD0:		Controls.keys.numpad0 =	false; break;
			case Controls.keys.DIVIDE:		Controls.keys.divide =	false; break;
			case Controls.keys.TIMES:		Controls.keys.times =	false; break;
			case Controls.keys.MINUS:		Controls.keys.minus =	false; break;
			case Controls.keys.ADD:			Controls.keys.add =		false; break;
			case Controls.keys.DECIMAL:		Controls.keys.decimal =	false; break;
			
			case Controls.keys.A:			Controls.keys.a =		false; break;
			case Controls.keys.B:			Controls.keys.b =		false; break;
			case Controls.keys.C:			Controls.keys.c =		false; break;
			case Controls.keys.D:			Controls.keys.d =		false; break;
			case Controls.keys.E:			Controls.keys.e =		false; break;
			case Controls.keys.F:			Controls.keys.f =		false; break;
			case Controls.keys.G:			Controls.keys.g =		false; break;
			case Controls.keys.H:			Controls.keys.h =		false; break;
			case Controls.keys.I:			Controls.keys.i =		false; break;
			case Controls.keys.J:			Controls.keys.j =		false; break;
			case Controls.keys.K:			Controls.keys.k =		false; break;
			case Controls.keys.L:			Controls.keys.l =		false; break;
			case Controls.keys.M:			Controls.keys.m =		false; break;
			case Controls.keys.N:			Controls.keys.n =		false; break;
			case Controls.keys.O:			Controls.keys.o =		false; break;
			case Controls.keys.P:			Controls.keys.p =		false; break;
			case Controls.keys.Q:			Controls.keys.q =		false; break;
			case Controls.keys.R:			Controls.keys.r =		false; break;
			case Controls.keys.S:			Controls.keys.s =		false; break;
			case Controls.keys.T:			Controls.keys.t =		false; break;
			case Controls.keys.U:			Controls.keys.u =		false; break;
			case Controls.keys.V:			Controls.keys.v =		false; break;
			case Controls.keys.W:			Controls.keys.w =		false; break;
			case Controls.keys.X:			Controls.keys.x =		false; break;
			case Controls.keys.Y:			Controls.keys.y =		false; break;
			case Controls.keys.Z:			Controls.keys.z =		false; break;
		}
	},
	onMouseDown: function( ev ) {
		switch( ev.button ) {
			case Controls.keys.LMOUSE:		Controls.keys.lmouse =	true; break;
			case Controls.keys.RMOUSE:		Controls.keys.rmouse =	true; break;
			case Controls.keys.MMOUSE:		Controls.keys.mmouse =	true; break;
		}
	},
	onMouseUp: function( ev ) {
		switch( ev.button ) {
			case Controls.keys.LMOUSE:		Controls.keys.lmouse =	false; break;
			case Controls.keys.RMOUSE:		Controls.keys.rmouse =	false; break;
			case Controls.keys.MMOUSE:		Controls.keys.mmouse =	false; break;
		}
	}
}