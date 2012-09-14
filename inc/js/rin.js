(function(){
var gl, rin,
	modules = [ "program", "shader", "scene", "camera",
			    "controls", "utility" ];

(function(){

function $rin() {
	rin = this;
	this.programs = [];
	this.shaders = [];
	this.scene = "";
	this.$state = {};
	this.modules = 0;
	
	this._shaders = { vertex: "", fragment: "" };
	this._state = { program: 0, shaders: { vertex: 0, fragment: 0 } };
	this.controls = false;
	this._models = [];
	this._lights = [];
	this._program = "";
	this._ident = {};
	this.xRot = this.yRot =	0;
	this.zPos =	this.xPos =	0;
	this.yYaw =	0;
	this.b = { normal: "", vertex: "", texture: "" };
	this.q = { running: false, queue: [], current: "" };
	this.v = { texture: "", vertex: "", normal: "" };
}

$rin.prototype = {
	program: function() { return this.programs[ this.$state[ "PROGRAM" ] ].target; },
	$program: function() { return this.programs[ this.$state[ "PROGRAM" ] ]; },
}
$rin.prototype.queue = function( func ) {
	if( func !== undefined ) {
		if( this.q.queue.length == 0 && !this.q.running ) { this.q.running = true; console.log("no way"); func.call(); }
		else this.q.queue.push( func );
	}
	if( this.q.queue.length > 0 && !this.q.running ) {
		this.q.queue.shift().call();
	}
};
$rin.prototype.init = function( id ) {
	this.gl = gl = window.gl = document.getElementById( id ).getContext( 'experimental-webgl' );
	this.canvas = id;
	if( gl ) { this.load(); }
	//return this;
		gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );
		//this.program.init();
		//this.shader.init();
		//this.program.attach();
};
$rin.prototype.state = function( state, value ) {
	if( value === undefined )
		if( typeof(state) == "object" )
			for( var i in state ) this.$state[i] = state[i];
		else return this.$state[state];
	else this.$state[state] = value;
	return this;
};
$rin.prototype.load = function() {
	if( this.modules != modules.length ) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.onload = function() { rin.load(); }
		document.getElementsByTagName("head")[0].appendChild( script );
		script.src = "inc/js/rin.ai/"+modules[this.modules++]+".js";
	} else {
		this.programs.push( new this.$Program() );
		this.shaders.push( new this.$Shader( "vertex", "default" ) );
		this.shaders.push( new this.$Shader( "fragment", "default" ) );
		this.state( { "PROGRAM": 0, "VERTEX_SHADER": 0, "FRAGMENT_SHADER": 1 } );
		this.$program().attach( this.shaders[0].target ).attach( this.shaders[1].target ).link().use().init();
		this.scene = new this.$Scene();
		document.dispatchEvent( new Event("rinLoaded") );
	}
};
$rin.prototype.draw = function() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	loadIdentity();
	rin.scene.render();
	//mvPushMatrix();
	//mvTranslate( [0.0, -1.0, -6.0] );
	/*if( this.controls ) if( Controls.any( "arrows" ) ) {
		if( Controls.keys.up )		rin.xRot--;
		if( Controls.keys.down )	rin.xRot++;
		if( Controls.keys.left )	rin.yRot--;
		if( Controls.keys.right )	rin.yRot++;
	}
	mvRotate( rin.xRot, [1, 0, 0] );
	mvRotate( rin.yRot, [0, 1, 0] );*/
	//for( var i in rin._models ) { rin._models[i].render(); }
	//mvPopMatrix();
};
$rin.prototype.start = function() {
	//this.$program().uniform3f( "uAmbientColor", [ 1.0, 1.0, 1.0 ] );
	//rin.$program().uniform3f( "uAmbientColor", [1.0,1.0,1.0] );
	this.scene.init();
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uAmbientColor" ), 1.0, 1.0, 1.0);
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uDiffuseColor" ), 1.5, 1.5, 1.5);
    gl.uniform3f( gl.getUniformLocation( rin.program(), "uSpecularColor" ), 0.8, 0.8, 0.8);
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uDirectionalColor" ), 0.75, 0.75, 0.75);
	gl.uniform3f( gl.getUniformLocation( rin.program(), "uLightDirection" ), 0.5, 0.0, 1.0);
	rin.interval = setInterval( rin.draw, 15 );
};
$rin.prototype.stop = function() {
	clearInterval( rin.interval );
	Controls.disable();
};

/* shaders */
$rin.prototype.shader = {
	init: function() {
		rin._program = gl.createProgram();
		rin._shaders.vertex = rin.shader.create("VERTEX");
		rin.shader.source( rin._shaders.vertex, _shaders["vertex"] );
		rin.shader.attach( rin._program, rin._shaders.vertex );
		rin._shaders.fragment = rin.shader.create("FRAGMENT");
		rin.shader.source( rin._shaders.fragment, _shaders["fragment"] );
		rin.shader.attach( rin._program, rin._shaders.fragment );
		gl.linkProgram( rin._program );
		gl.useProgram( rin._program );
		rin.v.vertex = gl.getAttribLocation( rin._program, "aVertex" );
		gl.enableVertexAttribArray( rin.v.vertex );
		rin.v.normal = gl.getAttribLocation( rin._program, "aNormal" );
		gl.enableVertexAttribArray( rin.v.normal );
		rin.v.texture = gl.getAttribLocation( rin._program, "aTexture" );
		gl.enableVertexAttribArray( rin.v.texture );
	},
	create: function( type, code ) { return gl.createShader( gl[type+"_SHADER"] ); },
	attach: function( program, shader ) { gl.attachShader( program, shader ); },
	source: function( shader, code ) { gl.shaderSource( shader, code ); gl.compileShader( shader ); },
	set: function( type, shader ) { rin._state.shaders[type] = shader.id; }
};

/* models */
$rin.prototype.model = $rin.prototype.m = {
	add: function( type, name ) {
		switch( type.toLowerCase() ) {
			case "obj":
				var length = rin._models.length;
				rin._models.push( new rin.$OBJModel( length, name ) );
				rin._ident[name] = length;
				return rin._models[length]; break;
		} },
	get: function( m ) {
		return m === undefined ? rin._models : typeof m != "string" ?
			rin._models[m] : rin._models[ rin._ident[m] ]; }
};

$rin.prototype.$OBJModel = function $OBJModel( id, name ) {
	this.id = id;
	this.name = name;
	this.materials = {};
	this.mesh = {};
	this.mtllib = "";
	this.ready = false;
	this.faces = 0;
	this.ajax = { obj: "", mtl: "" };
	this.b = { vertex: "", texture: "", normal: "" };
	this.v = { vertices: [], textures: [], normals: [] };
	this.load();
	return this;
};
$rin.prototype.$OBJModel.prototype.load = function() {
	this.ajax.obj = new XMLHttpRequest();
	this.ajax.obj.$id = this.id;
	this.ajax.obj.onreadystatechange = function() { if( this.readyState == 4 ) rin._models[this.$id].parse(); };
	this.ajax.obj.open( "get", "inc/models/"+this.name+"/"+this.name+".obj" );
	this.ajax.obj.send( null );
};
$rin.prototype.$OBJModel.prototype.parse = function() {
	var full = this.ajax.obj.responseText.split("\n");
	var $v = []; var $t = []; var $n = []; var $f = {}; var $o = ""; var $m = ""; var $i = 0; var $mod = { v: [] }; var dup = false;
	for( var i in full ) {
		var line = full[i].substring( full[i].indexOf(" ")+1 ).split(" ");
		switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
			case "o": $o = full[i].substring( full[i].indexOf(" ")+1 ); if( $o == "" ) $o = "_"; $f[$o] = {}; break;
			case "mtllib": this.mtllib = full[i].substring( full[i].indexOf(" ")+1 ); break;
			case "usemtl": $m = full[i].substring( full[i].indexOf(" ")+1 ); $f[$o][$m] = []; break;
			case "v":  $v.push( [ line[0], line[1], line[2] ] ); break;
			case "vt": $t.push( [ line[0], line[1] ] ); break;
			case "vn": $n.push( [ line[0], line[1], line[2] ] ); break;
			case "f":
				var $0 = line[0].split("/"); var $1 = line[1].split("/"); var $2 = line[2].split("/");
				if( $0.length > 2 ) {
					$f[$o][$m].push( {
							v: [ $v[ parseInt($0[0])-1 ], $v[ parseInt($1[0])-1 ], $v[ parseInt($2[0])-1 ] ],
							t: [ $t[ parseInt($0[1])-1 ], $t[ parseInt($1[1])-1 ], $t[ parseInt($2[1])-1 ] ],
							n: [ $n[ parseInt($0[2])-1 ], $n[ parseInt($1[2])-1 ], $n[ parseInt($2[2])-1 ] ] } );
				}
				break;
		}
	}
	$v = null; $t = null; $n = null;
	var c = 0;
	for( var i in $f ) {
		this.mesh[i] = {};
		for( var k in $f[i] ) {
			this.mesh[i][k] = { i: [], b: "" };
			for( var l in $f[i][k] ) {
				for( var j = 0; j < 3; j++ ) {
					this.mesh[i][k].i.push( c+j );
					this.v.vertices.push( $f[i][k][l].v[j][0], $f[i][k][l].v[j][1], $f[i][k][l].v[j][2] );
					this.v.normals.push( $f[i][k][l].n[j][0], $f[i][k][l].n[j][1], $f[i][k][l].n[j][2] );
					$f[i][k][l].t[j] === undefined ? this.v.textures.push( 0, 0 ) : this.v.textures.push( $f[i][k][l].t[j][0], $f[i][k][l].t[j][1] );
				}
				c += 3; this.faces++;
			}
		}
	}
	$f = null;
	if( this.mtllib != "" ) {
		this.ajax.mtl = new XMLHttpRequest();
		this.ajax.mtl.$id = this.id;
		this.ajax.mtl.onreadystatechange = function() { if( this.readyState == 4 ) rin._models[this.$id].texture(); };
		this.ajax.mtl.open( "get", "inc/models/"+this.name+"/"+this.mtllib );
		this.ajax.mtl.send( null );
	}
	this.buffer();
};
$rin.prototype.$OBJModel.prototype.texture = function() {
	var full = this.ajax.mtl.responseText.split("\n");
	var current = ""; rin.q.current = 0;
	for( var i in full ) {
		switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
			case "newmtl":
				if( this.materials[current] !== undefined ) { if( this.materials[current].src === undefined ) {
					this.materials[current].src = ""; } }
				current = full[i].substring( full[i].indexOf(" ")+1 ).trim();
				if( current == "" ) current = "_"; this.materials[current] = new rin.$Texture( current, this.id ); break;
			case "map_Kd": rin.q.current++; this.materials[current].src = "inc/models/"+this.name+"/"+
					full[i].substring( full[i].indexOf(" ")+1 ).trim();	break;
			case "Ns": this.materials[current].Ns = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			case "Ka": this.materials[current].Ka = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
			case "Kd": this.materials[current].Kd = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
			case "Ks": this.materials[current].Ks = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
			case "Ni": this.materials[current].Ni = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			case "d": this.materials[current].d = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			case "illum": this.materials[current].illum = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
		}
	}
	var c = 0;
	for( var i in this.materials ) {
		if( this.materials[i].src != "" ) {
			this.materials[i].element.current = c;
			this.materials[i].element.src = this.materials[i].src;
			c++;
		}
	}
};
$rin.prototype.$OBJModel.prototype.buffer = function() {
	this.b.normal = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.b.normal );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.normals ), gl.STATIC_DRAW);
    gl.vertexAttribPointer( rin.$program().pointers.normal, 3, gl.FLOAT, false, 0, 0 );
	this.b.vertex = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.b.vertex );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.vertices ), gl.STATIC_DRAW );
	gl.vertexAttribPointer( rin.$program().pointers.vertex, 3, gl.FLOAT, false, 0, 0 );
	this.b.texture = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.b.texture );
    gl.vertexAttribPointer( rin.$program().pointers.texture, 2, gl.FLOAT, false, 0, 0 );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.textures ), gl.STATIC_DRAW);
	for( var i in this.mesh ) {
		for( var j in this.mesh[i] ) {
			this.mesh[i][j].b = gl.createBuffer();
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.mesh[i][j].i ), gl.STATIC_DRAW );
		}
	}
	this.ready = true;
};
$rin.prototype.$OBJModel.prototype.render = function() {
	var normalMatrix = mat4.inverse( mvMatrix );
	normalMatrix = mat4.transpose( normalMatrix );
	var nUniform = gl.getUniformLocation( rin.program(), "uNMatrix" );
	gl.uniformMatrix4fv(nUniform, false, new Float32Array( mat4.flatten( normalMatrix ) ) );
	if( this.ready ) {
		for( var i in this.mesh ) {
			for( var j in this.mesh[i] ) {
				if( this.materials[j] !== undefined ) if( this.materials[j].src != "" && this.materials[j].ready ) {
					gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), true );
					gl.enableVertexAttribArray( rin.$program().pointers.texture );
					gl.activeTexture( gl.TEXTURE0 );
					gl.bindTexture( gl.TEXTURE_2D, this.materials[j].texture );
					gl.uniform1i( gl.getUniformLocation( rin.program(), "uSampler" ), 0 );
				} else {
					gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), false);
					gl.disableVertexAttribArray( rin.$program().pointers.texture );
				} if( this.materials[j] !== undefined ) {
					if( this.materials[j].Ka !== undefined ) gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialAmbientColor" ),
						this.materials[j].Ka[0], this.materials[j].Ka[1], this.materials[j].Ka[2] );
					if( this.materials[j].Ks !== undefined ) gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialSpecularColor" ),
						this.materials[j].Ks[0], this.materials[j].Ks[1], this.materials[j].Ks[2] );
					if( this.materials[j].Kd !== undefined ) gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialDiffuseColor" ),
						this.materials[j].Kd[0], this.materials[j].Kd[1], this.materials[j].Kd[2] );
					if( this.materials[j].Ns !== undefined ) gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialShininess" ),
						this.materials[j].Ns[0], this.materials[j].Ns[1], this.materials[j].Ns[2] );
				}
				gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
				setMatrixUniforms();
				gl.drawElements( gl.TRIANGLES, this.mesh[i][j].i.length, gl.UNSIGNED_SHORT, 0 );
			}
		}
	}
};

/* texture */
$rin.prototype.$Texture = function $Texture( name, id ) {
	this.name = name;
	this.id = id;
	this.element = document.createElement("img");
	this.element.texture = this;
	this.element.onload = this.load;
	this.texture = "";
	this.src = "";
	this.ready = false;
	this.Ka = ""; /* ambient color */
	this.Kd = ""; /* diffuse color */
	this.map_Kd = "";
	this.Ks = ""; /* specular color */
	this.Ns = ""; /* specular coefficient */
	this.Ni = "";
	this.d = ""; /* alpha */
	this.illum = "";
};
$rin.prototype.$Texture.prototype.load = function() {
	if( rin.q.current -1 == this.current ) {
		rin.q.current = 0;
		var model = rin._models[ this.texture.id ];
		for( var i in model.materials ) {
			if( model.materials[i].src != "" ) {
				model.materials[i].texture = gl.createTexture();
				gl.bindTexture( gl.TEXTURE_2D, model.materials[i].texture );
				gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, model.materials[i].element );
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.generateMipmap( gl.TEXTURE_2D );
				gl.bindTexture( gl.TEXTURE_2D, null );
				model.materials[i].ready = true;
			}
		}
	}
};

window.$r = window.r = window.rin = new $rin();
window.__$r = $rin;
})();

})();