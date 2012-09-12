(function(){
var gl, rin;

(function(){

function $rin() {
	rin = this;
	this._shaders = { vertex: "", fragment: "" };
	this._state = { program: 0, shaders: { vertex: 0, fragment: 0 } };
	this._models = [];
	this._program = "";
	this._ident = {};
	this.xRot = this.yRot =	0;
	this.zPos =	this.xPos =	0;
	this.yYaw =	0;
	this.b = { normal: "", vertex: "", texture: "" };
	this.q = { running: false, queue: [], current: "" };
	this.v = { texture: "", vertex: "", normal: "" };
}
$rin.prototype.queue = function( func ) {
	if( func !== undefined ) {
		if( this.q.queue.length == 0 && !this.q.running ) { this.q.running = true; console.log("no way"); func.call(); }
		else this.q.queue.push( func );
	}
	if( this.q.queue.length > 0 && !this.q.running ) {
		this.q.queue.shift().call();
	}
}
$rin.prototype.init = function( id ) {
	this.gl = gl = document.getElementById( id ).getContext( 'experimental-webgl' );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );
	//this.program.init();
	this.shader.init();
	//this.program.attach();
	return this;
}
$rin.prototype.draw = function() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	perspectiveMatrix = makePerspective( 45, 640.0/480.0, 0.1, 100.0 );
	loadIdentity();
	if( Controls.any( "wasd" ) ) {
		if( Controls.keys.a )	rin.yYaw -=		0.2;
		if( Controls.keys.d )	rin.yYaw +=		0.2;
		if( Controls.keys.w ) { rin.zPos +=		(0.03 * Math.cos( rin.yYaw * ( Math.PI / 180 ) ) );
								rin.xPos -=		(0.03 * Math.sin( rin.yYaw * ( Math.PI / 180 ) ) ); }
		if( Controls.keys.s ) { rin.zPos -=		(0.03 * Math.cos( rin.yYaw * ( Math.PI / 180 ) ) );
								rin.xPos -=		(0.03 * Math.sin( rin.yYaw * ( Math.PI / 180 ) ) ); }
	}
	mvTranslate( [rin.xPos, 0.0, rin.zPos] );
	mvRotate( rin.yYaw, [0.0, 1.0, 0.0] );
	mvPushMatrix();
	mvTranslate( [0.0, -1.0, -6.0] );
	if( Controls.any( "arrows" ) ) {
		if( Controls.keys.up )		rin.xRot--;
		if( Controls.keys.down )	rin.xRot++;
		if( Controls.keys.left )	rin.yRot--;
		if( Controls.keys.right )	rin.yRot++;
	}
	mvRotate( rin.xRot, [1, 0, 0] );
	mvRotate( rin.yRot, [0, 1, 0] );
	for( var i in rin._models ) { rin._models[i].render(); }
	mvPopMatrix();
}
$rin.prototype.start = function() {
	gl.uniform3f( gl.getUniformLocation( rin._program, "uAmbientColor" ), 1.0, 1.0, 1.0);
	gl.uniform3f( gl.getUniformLocation( rin._program, "uDiffuseColor" ), 1.5, 1.5, 1.5);
    gl.uniform3f( gl.getUniformLocation( rin._program, "uSpecularColor" ), 0.8, 0.8, 0.8);
	gl.uniform3f( gl.getUniformLocation( rin._program, "uDirectionalColor" ), 0.75, 0.75, 0.75);
	gl.uniform3f( gl.getUniformLocation( rin._program, "uLightDirection" ), 0.5, 0.0, 1.0);
	Controls.enable("world");
	rin.interval = setInterval( rin.draw, 15 );
}
$rin.prototype.stop = function() {
	clearInterval( rin.interval );
	Controls.disable();
}

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
}

/* program */


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
	get: function( m ) { return m === undefined ? rin._models : typeof m != "string" ? rin._models[m] : rin._models[ rin._ident[m] ]; }
}

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
}
$rin.prototype.$OBJModel.prototype.load = function() {
	this.ajax.obj = new XMLHttpRequest();
	this.ajax.obj.$id = this.id;
	this.ajax.obj.onreadystatechange = function() { if( this.readyState == 4 ) rin._models[this.$id].parse(); };
	this.ajax.obj.open( "get", "inc/models/"+this.name+"/"+this.name+".obj" );
	this.ajax.obj.send( null );
}
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
}
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
}
$rin.prototype.$OBJModel.prototype.buffer = function() {
	this.b.normal = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.b.normal );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.normals ), gl.STATIC_DRAW);
    gl.vertexAttribPointer( rin.v.normal, 3, gl.FLOAT, false, 0, 0 );
	this.b.vertex = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.b.vertex );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.vertices ), gl.STATIC_DRAW );
	gl.vertexAttribPointer( rin.v.vertex, 3, gl.FLOAT, false, 0, 0 );
	this.b.texture = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.b.texture );
    gl.vertexAttribPointer( rin.v.texture, 2, gl.FLOAT, false, 0, 0 );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.v.textures ), gl.STATIC_DRAW);
	for( var i in this.mesh ) {
		for( var j in this.mesh[i] ) {
			this.mesh[i][j].b = gl.createBuffer();
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.mesh[i][j].i ), gl.STATIC_DRAW );
		}
	}
	this.ready = true;
}
$rin.prototype.$OBJModel.prototype.render = function() {
	var normalMatrix = mvMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	var nUniform = gl.getUniformLocation( rin._program, "uNMatrix" );
	gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
	if( this.ready ) {
		for( var i in this.mesh ) {
			for( var j in this.mesh[i] ) {
				if( this.materials[j] !== undefined ) if( this.materials[j].src != "" && this.materials[j].ready ) {
					gl.uniform1i( gl.getUniformLocation( rin._program, "uUseTextures" ), true );
					gl.enableVertexAttribArray( rin.v.texture );
					gl.activeTexture( gl.TEXTURE0 );
					gl.bindTexture( gl.TEXTURE_2D, this.materials[j].texture );
					gl.uniform1i( gl.getUniformLocation( rin._program, "uSampler" ), 0 );
				} else {
					gl.uniform1i( gl.getUniformLocation( rin._program, "uUseTextures" ), false);
					gl.disableVertexAttribArray( rin.v.texture );
				} if( this.materials[j] !== undefined ) {
					if( this.materials[j].Ka !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialAmbientColor" ),
						this.materials[j].Ka[0], this.materials[j].Ka[1], this.materials[j].Ka[2] );
					if( this.materials[j].Ks !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialSpecularColor" ),
						this.materials[j].Ks[0], this.materials[j].Ks[1], this.materials[j].Ks[2] );
					if( this.materials[j].Kd !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialDiffuseColor" ),
						this.materials[j].Kd[0], this.materials[j].Kd[1], this.materials[j].Kd[2] );
					if( this.materials[j].Ns !== undefined ) gl.uniform3f( gl.getUniformLocation( rin._program, "uMaterialShininess" ),
						this.materials[j].Ns[0], this.materials[j].Ns[1], this.materials[j].Ns[2] );
				}
				gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mesh[i][j].b );
				setMatrixUniforms();
				gl.drawElements( gl.TRIANGLES, this.mesh[i][j].i.length, gl.UNSIGNED_SHORT, 0 );
			}
		}
	}
}

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
}
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
}

window.$r = window.r = window.rin = new $rin();
})();

var _shaders = {
	fragment: "\
		precision mediump float;\
		varying vec2 vTextureCoord;\
		varying vec4 vNormal;\
		varying vec3 vPosition;\
		varying vec3 vAmbientLight;\
		varying vec3 vLightDirection;\
		uniform vec3 uMaterialAmbientColor;\
  		uniform vec3 uMaterialDiffuseColor;\
  		uniform vec3 uMaterialSpecularColor;\
  		uniform float uMaterialShininess;\
		uniform sampler2D uSampler;\
		uniform bool uUseTextures;\
		uniform vec3 uAmbientLightingColor;\
    	uniform vec3 uPointLightingLocation;\
    	uniform vec3 uDiffuseColor;\
    	uniform vec3 uSpecularColor;\
		void main(void) {\
			vec3 materialAmbientColor = uMaterialAmbientColor;\
			vec3 materialDiffuseColor = uMaterialDiffuseColor;\
			vec3 materialSpecularColor = uMaterialSpecularColor;\
			vec3 ambientWeight = vAmbientLight;\
			float diffuseBrightness = max(dot(vNormal.xyz, vLightDirection), 0.0);\
			vec3 diffuseWeight = uDiffuseColor * diffuseBrightness;\
			\
			vec3 specularWeight = vec3(0.0, 0.0, 0.0);\
			vec3 eyeDirection = normalize(-vPosition.xyz);\
			vec3 reflectionDirection = reflect(-vLightDirection, vNormal.xyz);\
			float specularBrightness = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);\
			specularWeight = uSpecularColor * specularBrightness;\
			float alpha = 1.0;\
			if (uUseTextures) {\
		      	vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
		      	materialAmbientColor = materialAmbientColor * texelColor.rgb;\
				materialDiffuseColor = materialDiffuseColor * texelColor.rgb;\
				materialSpecularColor = materialSpecularColor * texelColor.rgb;\
				alpha = texelColor.a;\
			}\
			gl_FragColor = vec4(\
				materialAmbientColor * ambientWeight\
				+ materialDiffuseColor * diffuseWeight\
				+ materialSpecularColor * specularWeight,\
				alpha );\
		}",
	vertex: "\
		attribute vec3 aVertex;\
		attribute vec2 aTexture;\
		attribute vec3 aNormal;\
   		uniform mat4 uMVMatrix;\
      	uniform mat4 uPMatrix;\
		uniform mat4 uNMatrix;\
		uniform vec3 uLightDirection;\
		uniform vec3 uDirectionalColor;\
		varying vec2 vTextureCoord;\
		varying vec3 vAmbientLight;\
		varying vec4 vNormal;\
		varying vec3 vPosition;\
		varying vec3 vLightDirection;\
    	void main(void) {\
	        gl_Position = uPMatrix * uMVMatrix * vec4(aVertex, 1.0);\
	        vPosition = gl_Position.xyz;\
			vTextureCoord = aTexture;\
			highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);\
    		highp vec3 directionalLightColor = uDirectionalColor;\
    		vLightDirection = uLightDirection;\
    		highp vec4 transformedNormal = uNMatrix * vec4(aNormal, 1.0);\
    		vNormal = transformedNormal;\
			highp float directional = max(dot(aNormal.xyz, uLightDirection), 0.0);\
    		vAmbientLight = ambientLight + (directionalLightColor * directional);\
		}"
}

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
	},
	disable: function() {
		document.onkeydown = null;
		document.onkeyup = null;
	}
}

function onKeyDown( ev ) {
	switch( ev.keyCode ) {
		case Controls.keys.UP:			Controls.keys.up =		true; break;
		case Controls.keys.DOWN:		Controls.keys.down =	true; break;
		case Controls.keys.LEFT:		Controls.keys.left =	true; break;
		case Controls.keys.RIGHT:		Controls.keys.right =	true; break;
		case Controls.keys.W:			Controls.keys.w =		true; break;
		case Controls.keys.A:			Controls.keys.a =		true; break;
		case Controls.keys.S:			Controls.keys.s =		true; break;
		case Controls.keys.D:			Controls.keys.d =		true; break;
	}
	if( rin.xRot > 360 ) 		rin.xRot -= 360;
	if( rin.yRot > 360 ) 		rin.yRot -= 360;
	if( rin.xRot < -360 ) 		rin.xRot += 360;
	if( rin.yRot < -360 ) 		rin.yRot += 360;
	if( rin.yYaw > 360 ) 		rin.yYaw -= 360;
	if( rin.yYaw < 0 ) 			rin.yYaw += 360;
}

function onKeyUp( ev ) {
	switch( ev.keyCode ) {
		case Controls.keys.UP:			Controls.keys.up =		false; break;
		case Controls.keys.DOWN:		Controls.keys.down =	false; break;
		case Controls.keys.LEFT:		Controls.keys.left =	false; break;
		case Controls.keys.RIGHT:		Controls.keys.right =	false; break;
		case Controls.keys.W:			Controls.keys.w =		false; break;
		case Controls.keys.A:			Controls.keys.a =		false; break;
		case Controls.keys.S:			Controls.keys.s =		false; break;
		case Controls.keys.D:			Controls.keys.d =		false; break;
	}
}

/* utility functions */
function vector( x, y, z ) {
	this.x = x; this.y = y; this.z = z;
}
vector.prototype.inArray = function( array ) {
	for( var i in array )
		if( this.x == array[i][0] && this.y == array[i][1] && this.z == array[i][2] ) return true;
	return false;
}

})();