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
			attribute vec4 bone;\
			attribute vec4 weight;\
			uniform vec4 quats[100];\
			uniform vec3 trans[100];\
   			uniform mat4 uMVMatrix;\
	      	uniform mat4 uPMatrix;\
			uniform mat4 uNMatrix;\
			uniform bool uAnimated;\
			uniform vec3 uAmbientColor;\
			uniform vec3 uLightDirection;\
			uniform vec3 uDirectionalColor;\
			varying vec2 vTextureCoord;\
			varying vec3 vAmbientLight;\
			varying vec4 vNormal;\
			varying vec3 vPosition;\
			varying vec3 vLightDirection;\
	    	void main(void) {\
				vec4 nor = vec4( 0, 0, 0, 1 );\
				if( uAnimated ) {\
					vec3 vn = normalize( aVertex );\
					vec4 pos = vec4( 0, 0, 0, 1 );\
					vec4 tmp;\
					float yy, zz, xy, zw, xz, yw, xx, yz, xw;\
					if( bone.x != -1.0 ) {\
						tmp = quats[ int(bone.x) ];\
						yy = tmp.y*tmp.y;\
						zz = tmp.z*tmp.z;\
						xy = tmp.x*tmp.y;\
						zw = tmp.z*tmp.w;\
						xz = tmp.x*tmp.z;\
						yw = tmp.y*tmp.w;\
						xx = tmp.x*tmp.x;\
						yz = tmp.y*tmp.z;\
						xw = tmp.x*tmp.w;\
						mat4 mtmp = mat4(\
							vec4(1.0-2.0*yy-2.0*zz,2.0*xy+2.0*zw,2.0*xz-2.0*yw,0),\
							vec4(2.0*xy-2.0*zw,1.0-2.0*xx-2.0*zz,2.0*yz+2.0*xw,0),\
							vec4(2.0*xz+2.0*yw,2.0*yz-2.0*xw,1.0-2.0*xx-2.0*yy,0),\
							vec4(trans[int(bone.x)].x,trans[int(bone.x)].y,trans[int(bone.x)].z,1) );\
						pos += weight.x * mtmp * vec4( aVertex, 1.0 );\
						nor += weight.x * mtmp * vec4( aNormal, 1.0 );\
					}\
					if( bone.y != -1.0 ) {\
						tmp = quats[ int(bone.y) ];\
						yy = tmp.y*tmp.y;\
						zz = tmp.z*tmp.z;\
						xy = tmp.x*tmp.y;\
						zw = tmp.z*tmp.w;\
						xz = tmp.x*tmp.z;\
						yw = tmp.y*tmp.w;\
						xx = tmp.x*tmp.x;\
						yz = tmp.y*tmp.z;\
						xw = tmp.x*tmp.w;\
						mat4 mtmp = mat4(\
							vec4(1.0-2.0*yy-2.0*zz,2.0*xy+2.0*zw,2.0*xz-2.0*yw,0),\
							vec4(2.0*xy-2.0*zw,1.0-2.0*xx-2.0*zz,2.0*yz+2.0*xw,0),\
							vec4(2.0*xz+2.0*yw,2.0*yz-2.0*xw,1.0-2.0*xx-2.0*yy,0),\
							vec4(trans[int(bone.y)].x,trans[int(bone.y)].y,trans[int(bone.y)].z,1) );\
						pos += weight.y * mtmp * vec4( aVertex, 1.0 );\
						nor += weight.y * mtmp * vec4( aNormal, 1.0 );\
					}\
					if( bone.z != -1.0 ) {\
						tmp = quats[ int(bone.z) ];\
						yy = tmp.y*tmp.y;\
						zz = tmp.z*tmp.z;\
						xy = tmp.x*tmp.y;\
						zw = tmp.z*tmp.w;\
						xz = tmp.x*tmp.z;\
						yw = tmp.y*tmp.w;\
						xx = tmp.x*tmp.x;\
						yz = tmp.y*tmp.z;\
						xw = tmp.x*tmp.w;\
						mat4 mtmp = mat4(\
							vec4(1.0-2.0*yy-2.0*zz,2.0*xy+2.0*zw,2.0*xz-2.0*yw,0),\
							vec4(2.0*xy-2.0*zw,1.0-2.0*xx-2.0*zz,2.0*yz+2.0*xw,0),\
							vec4(2.0*xz+2.0*yw,2.0*yz-2.0*xw,1.0-2.0*xx-2.0*yy,0),\
							vec4(trans[int(bone.z)].x,trans[int(bone.z)].y,trans[int(bone.z)].z,1) );\
						pos += weight.z * mtmp * vec4( aVertex, 1.0 );\
						nor += weight.z * mtmp * vec4( aNormal, 1.0 );\
					}\
					if( bone.w != -1.0 ) {\
						tmp = quats[ int(bone.w) ];\
						yy = tmp.y*tmp.y;\
						zz = tmp.z*tmp.z;\
						xy = tmp.x*tmp.y;\
						zw = tmp.z*tmp.w;\
						xz = tmp.x*tmp.z;\
						yw = tmp.y*tmp.w;\
						xx = tmp.x*tmp.x;\
						yz = tmp.y*tmp.z;\
						xw = tmp.x*tmp.w;\
						mat4 mtmp = mat4(\
							vec4(1.0-2.0*yy-2.0*zz,2.0*xy+2.0*zw,2.0*xz-2.0*yw,0),\
							vec4(2.0*xy-2.0*zw,1.0-2.0*xx-2.0*zz,2.0*yz+2.0*xw,0),\
							vec4(2.0*xz+2.0*yw,2.0*yz-2.0*xw,1.0-2.0*xx-2.0*yy,0),\
							vec4(trans[int(bone.w)].x,trans[int(bone.w)].y,trans[int(bone.w)].z,1) );\
						pos += weight.w * mtmp * vec4( aVertex, 1.0 );\
						nor += weight.w * mtmp * vec4( aNormal, 1.0 );\
					}\
					gl_Position = uPMatrix * uMVMatrix * vec4( pos.xyz, 1.0 );\
				}\
				else {\
					gl_Position = uPMatrix * uMVMatrix * vec4( aVertex, 1.0 );\
					nor = vec4( aNormal, 1.0 );\
				}\
	    	    vPosition = gl_Position.xyz;\
				vTextureCoord = aTexture;\
    			highp vec3 directionalLightColor = uDirectionalColor;\
	    		vLightDirection = uLightDirection;\
				highp vec4 transformedNormal = uNMatrix * vec4(nor.xyz, 1.0);\
    			vNormal = transformedNormal;\
				highp float directional = max(dot(nor.xyz, uLightDirection), 0.0);\
    			vAmbientLight = uAmbientColor + (directionalLightColor * directional);\
			}"
	}
}

/*vec4(1.0-2.0*yy-2.0*zz,2.0*xy-2.0*zw,2.0*xz+2.0*yw,0),
					vec4(2.0*xy+2.0*zw,1.0-2.0*xx-2.0*zz,2.0*yz-2.0*xw,0),
					vec4(2.0*xz-2.0*yw,2.0*yz+2.0*xw,1.0-2.0*xx-2.0*yy,0),
					vec4(trans[int(bone.w)].x,trans[int(bone.w)].y,trans[int(bone.w)].z,1) );*/

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