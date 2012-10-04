(function(){

__$r.prototype.$Shader = function $Shader( type, code ) {
	this.type = type;
	this.target = type.toLowerCase() == "vertex" ?
		gl.createShader( gl.VERTEX_SHADER ) : gl.createShader( gl.FRAGMENT_SHADER );
	if( code !== undefined ) {
		this.source( code == "default" ? shaders["default"][type] : code );
		this.compile();
	}
}

__$r.prototype.$Shader.prototype = {
	source: function( code ) { gl.shaderSource( this.target, code ); },
	compile: function() { gl.compileShader( this.target ); }
}

var shaders = {
	"default": {
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
			uniform bool uUseColor;\
			uniform vec3 uColor;\
			uniform float uAlpha;\
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
				vec3 color = uColor;\
				if (uUseTextures) {\
			      	vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
		    	  	materialAmbientColor = materialAmbientColor * texelColor.rgb;\
					materialDiffuseColor = materialDiffuseColor * texelColor.rgb;\
					materialSpecularColor = materialSpecularColor * texelColor.rgb;\
					alpha = texelColor.a;\
				} else {\
					color = vec3( color * ambientWeight + color * diffuseWeight );\
				}\
				gl_FragColor = vec4(\
					materialAmbientColor * ambientWeight\
					+ materialDiffuseColor * diffuseWeight\
					+ materialSpecularColor * specularWeight,\
					alpha );\
				if( uUseColor ) {\
					gl_FragColor = vec4( color, uAlpha );\
				}\
			}",
		vertex: "\
			attribute vec3 aVertex;\
			attribute vec2 aTexture;\
			attribute vec3 aNormal;\
			attribute float aIndex;\
   			uniform mat4 uMVMatrix;\
	      	uniform mat4 uPMatrix;\
			uniform mat4 uNMatrix;\
			uniform vec3 uAmbientColor;\
			uniform vec3 uLightDirection;\
			uniform vec3 uDirectionalColor;\
			varying vec2 vTextureCoord;\
			varying vec3 vAmbientLight;\
			varying vec4 vNormal;\
			varying vec3 vPosition;\
			varying vec3 vLightDirection;\
	    	void main(void) {\
		        gl_Position = uPMatrix * uMVMatrix * vec4( aVertex, 1.0 );\
	    	    vPosition = gl_Position.xyz;\
				vTextureCoord = vec2( aIndex, aIndex );\
				vTextureCoord = aTexture;\
    			highp vec3 directionalLightColor = uDirectionalColor;\
	    		vLightDirection = uLightDirection;\
    			highp vec4 transformedNormal = uNMatrix * vec4(aNormal, 1.0);\
    			vNormal = transformedNormal;\
				highp float directional = max(dot(aNormal.xyz, uLightDirection), 0.0);\
    			vAmbientLight = uAmbientColor + (directionalLightColor * directional);\
			}"
	}
}
/*temp2 = vec3.add( temp2, vec3.scale( vec3.transform( this.$v[ this.$i[i][k] ],
						this.skeleton.bones[ j ].sMatrix[dt] ), this.inf[i][j] ) );*/
})();
/*bone.matrix = bone.jMatrix;
		if( dt !== undefined ) if( this.skeleton.bones[this.skeleton.root].anima.time[dt] !== undefined ) {
			bone.matrix = bone.anima.matrix[dt]; }
		if( bone.parent !== null ) bone.matrix = mat4.multiply( this.skeleton.bones[bone.parent].matrix, bone.matrix );
		bone.sMatrix = mat4.multiply( bone.matrix, bone.iMatrix );*/
/*for( int i = 0; i < 89; i++ ) {\
						cBones[i] = bones[i];\
						cBones[i].wMat = bones[i].jMat;\
						cBones[i].wMat = bones[i].fMat[0];\
						if( bones[i].parent != -1 ) {\
							for( int j = 0; j < 89; j++ ) {\
								if( j == bones[i].parent ) {\
									cBones[i].wMat = cBones[ j ].wMat * cBones[i].wMat;\
									break;\
								}\
							}\
						}\
					}\*/