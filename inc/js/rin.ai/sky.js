__$r.prototype.$Sky = function $Sky( type ) {
	this.type = type;
	this.ready = false;
	
	this.buffers = { v: "", n: "", t: "", i: "" };
	this.mesh = { v: [], t: [], n: [], i: [] };
	this.textures = {};
	this.matrix = mat4.create();
	this.position = [ 0, 0, 0 ];
	this.rotation = [ 0, 0, 0 ];
	this.$state = {};
}

__$r.prototype.$Sky.prototype = {
	init: function() {
		this.mesh.v = skies[this.type].v;
		this.mesh.t = skies[this.type].t;
		this.mesh.n = skies[this.type].n;
		this.mesh.i = skies[this.type].i;
		this.buffers.n = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffers.n );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.mesh.n ), gl.STATIC_DRAW);
		this.buffers.v = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffers.v );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.mesh.v ), gl.STATIC_DRAW );
		this.buffers.t = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffers.t );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.mesh.t ), gl.STATIC_DRAW);
		this.buffers.i = gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffers.i );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.mesh.i ), gl.STATIC_DRAW );
		if( skies[this.type].textures !== undefined ) {
			for( var i in skies[this.type].textures ) {
				this.textures[i] = new rin.$Texture( i, this );
				this.textures[i].element.src = skies[this.type].textures[i];
			}
		}
		this.ready = true;
	},
	buffer: function() {
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffers.n );
		gl.vertexAttribPointer( rin.$program().pointers.normal, 3, gl.FLOAT, false, 0, 0 );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffers.v );
		gl.vertexAttribPointer( rin.$program().pointers.vertex, 3, gl.FLOAT, false, 0, 0 );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffers.t );
		gl.vertexAttribPointer( rin.$program().pointers.texture, 2, gl.FLOAT, false, 0, 0 );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffers.i );
	},
	render: function() {
		if( this.ready ) {
			this.buffer();
			gl.disable( gl.DEPTH_TEST );
			gl.uniform3f( gl.getUniformLocation( rin.program(), "uLightDirection" ), 0.0, 0.0, 0.0);
			var normalMatrix = mat4.inverse( this.matrix );
			normalMatrix = mat4.transpose( normalMatrix );
			var nUniform = gl.getUniformLocation( rin.program(), "uNMatrix" );
			gl.uniformMatrix4fv(nUniform, false, new Float32Array( mat4.flatten( normalMatrix ) ) );
			mvMatrix = mat4.translate( mvMatrix, [ this.position[0], this.position[1], this.position[2] ] );
			setMatrixUniforms(); var current = 0;
			for( var j in this.textures ) {
				if( this.textures[j].ready ) {
					gl.uniform1i( gl.getUniformLocation( rin.program(), "uUseTextures" ), true );
					gl.enableVertexAttribArray( rin.$program().pointers.texture );
					gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialAmbientColor" ),
						this.textures[j].Ka[0], this.textures[j].Ka[1], this.textures[j].Ka[2] );
					gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialSpecularColor" ),
						this.textures[j].Ks[0], this.textures[j].Ks[1], this.textures[j].Ks[2] );
					gl.uniform3f( gl.getUniformLocation( rin.program(), "uMaterialDiffuseColor" ),
						this.textures[j].Kd[0], this.textures[j].Kd[1], this.textures[j].Kd[2] );
					gl.uniform1f( gl.getUniformLocation( rin.program(), "uMaterialShininess" ),	this.textures[j].Ns );
					gl.activeTexture( gl.TEXTURE0 );
					gl.uniform1i( gl.getUniformLocation( rin.program(), "uSampler" ), 0 );
					gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffers.i );
					gl.bindTexture( gl.TEXTURE_2D, this.textures[j].texture );
					gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, current * 12 );
				} current++;
			}
		}
	},
}

var skies = {
	"default": {
		textures: { "sky1": "inc/scenes/default/sky/sky_t.jpg", "sky4": "inc/scenes/default/sky/sky_l.jpg",
					"sky3": "inc/scenes/default/sky/sky_b.jpg", "sky2": "inc/scenes/default/sky/sky_r.jpg",
					"sky5": "inc/scenes/default/sky/sky_f.jpg" },
		v: [
			-10.0,  5.0, -10.0,
      		-10.0,  5.0,  10.0,
       		10.0,  5.0,  10.0,
       		10.0,  5.0, -10.0,
       
       		10.0, 0.0, -10.0,
       		10.0, 5.0, -10.0,
       		10.0, 5.0,  10.0,
       		10.0, 0.0,  10.0,
       
       		-10.0, 0.0, -10.0,
      		-10.0, 5.0, -10.0,
       		10.0, 5.0, -10.0,
       		10.0, 0.0, -10.0,
       
       		-10.0, 0.0, -10.0,
      		-10.0, 0.0,  10.0,
      		-10.0, 5.0,  10.0,
      		-10.0, 5.0, -10.0,
      
      		-10.0, 0.0,  10.0,
       		10.0, 0.0,  10.0,
       		10.0, 5.0,  10.0,
      		-10.0, 5.0,  10.0,
		],
		n: [
			0.0,  -1.0,  0.0,
       		0.0,  -1.0,  0.0,
       		0.0,  -1.0,  0.0,
       		0.0,  -1.0,  0.0,
			
			-1.0,  0.0,  0.0,
       		-1.0,  0.0,  0.0,
       		-1.0,  0.0,  0.0,
      		-1.0,  0.0,  0.0,
      		
      		0.0,  0.0, 1.0,
     		0.0,  0.0, 1.0,
		    0.0,  0.0, 1.0,
       		0.0,  0.0, 1.0,
       
       		1.0,  0.0,  0.0,
      		1.0,  0.0,  0.0,
      		1.0,  0.0,  0.0,
      		1.0,  0.0,  0.0,
      		
      		0.0,  0.0,  -1.0,
       		0.0,  0.0,  -1.0,
       		0.0,  0.0,  -1.0,
       		0.0,  0.0,  -1.0,
		],
		t: [
		  	1.0, 0.0,
		  	1.0, 1.0,
		  	0.0, 1.0,
		  	0.0, 0.0,
		  
		  	1.0, 0.0,
		  	1.0, 1.0,
		  	0.0, 1.0,
		  	0.0, 0.0,
		  
		  	1.0, 0.0,
		  	1.0, 1.0,
		  	0.0, 1.0,
		  	0.0, 0.0,
		  
		  	0.0, 0.0,
		  	1.0, 0.0,
		  	1.0, 1.0,
		  	0.0, 1.0,
		  
		  	0.0, 0.0,
		  	1.0, 0.0,
		  	1.0, 1.0,
		  	0.0, 1.0,
		],
		i: [
			0, 1, 2,
			0, 2, 3,
			
			4, 5, 6,
			4, 6, 7,
			
			8, 9, 10,
			8, 10, 11,
			
			12, 13, 14,
			12, 14, 15,
			
			16, 17, 18,
			16, 18, 19,
		],
	}
}