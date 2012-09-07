function model( name ) {
	this.name = name;
	this.mesh = new Object();
	this.mtllib = "";
	
	this.v = { vertices: [], textures: [], indices: [], mats: {} };
	
	this.load();
} model.prototype.load = function() {
	$.ajax({ url: "inc/models/"+this.name+"/"+this.name+".obj", data: "testing" }).done( function( mod ) { return function( response ){
		var full = response.split("\n"); var currentObj = undefined; var currentMtl = undefined;
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "o": currentObj = full[i].substring( full[i].indexOf(" ")+1 ).trim(); if( currentObj == "" ) currentObj = " ";
					mod.mesh[currentObj] = new segment( currentObj ); break;
				case "v":
					mod.v.vertices.push( full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0],
						full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[1], full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[2] );
					break;
				case "mtllib": mod.mtllib = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "usemtl":
					currentMtl = full[i].substring( full[i].indexOf(" ")+1 ).trim(); if( currentMtl == "" ) currentMtl = " ";
					mod.mesh[currentObj].textures[currentMtl] = new texture( currentMtl ); break;
				case "vn": break;
				case "vt": mod.v.textures.push( [full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[0],
						full[i].substring( full[i].indexOf(" ")+1 ).split(" ")[1] ] ); break;
				case "f":
					var temp = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" ");
					if( temp.length > 2 ) {
						if( temp[0].split("/").length - 1 == 2 && temp[0].substring( temp[0].indexOf("/")+1, temp[0].lastIndexOf("/") ) != "") {
							mod.mesh[currentObj].textures[currentMtl].v.texture.push(
								mod.v.textures[ temp[0].substring( temp[0].indexOf("/")+1, temp[0].lastIndexOf("/") )-1 ][0],
								mod.v.textures[ temp[0].substring( temp[0].indexOf("/")+1, temp[0].lastIndexOf("/") )-1 ][1],
								mod.v.textures[ temp[1].substring( temp[1].indexOf("/")+1, temp[1].lastIndexOf("/") )-1 ][0],
								mod.v.textures[ temp[1].substring( temp[1].indexOf("/")+1, temp[1].lastIndexOf("/") )-1 ][1],
								mod.v.textures[ temp[2].substring( temp[2].indexOf("/")+1, temp[2].lastIndexOf("/") )-1 ][0],
								mod.v.textures[ temp[2].substring( temp[2].indexOf("/")+1, temp[2].lastIndexOf("/") )-1 ][1] );
						}
						mod.mesh[currentObj].textures[currentMtl].v.index.push( temp[0].substring( 0, temp[0].indexOf("/") )-1,
							temp[1].substring( 0, temp[1].indexOf("/") )-1, temp[2].substring( 0, temp[2].indexOf("/") )-1 );
						mod.v.indices.push( temp[0].substring( 0, temp[0].indexOf("/") )-1,
							temp[1].substring( 0, temp[1].indexOf("/") )-1, temp[2].substring( 0, temp[2].indexOf("/") )-1 );
					}
					break;
			}
		}
		console.log( mod ); var temp = [];
		//for( var i in mod.v.textures ) { for( var j in mod.v.textures[i] ) { temp.push(j); } }
		//console.log( temp ); mod.v.textures = temp;
		if( this.mtllib != "" ) mod.preload();
	}}(this));
}; model.prototype.preload = function() {
	$.ajax({ url: "inc/models/"+this.name+"/"+this.mtllib }).done( function( mod ) { return function( response ){
		var full = response.split("\n"); var current = ""; var num = 0;
		for( var i in full ) {
			switch( full[i].substring( 0, full[i].indexOf(" ") ) ) {
				case "newmtl": current = full[i].substring( full[i].indexOf(" ")+1 ).trim(); mod.v.mats[current] = new material(current); break;
				case "map_Kd": num++; mod.v.mats[current].src = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "Ns": mod.v.mats[current].v.Ns = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "Ka": mod.v.mats[current].v.Ka = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Kd": mod.v.mats[current].v.Kd = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Ks": mod.v.mats[current].v.Ks = full[i].substring( full[i].indexOf(" ")+1 ).trim().split(" "); break;
				case "Ni": mod.v.mats[current].v.Ni = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "d": mod.v.mats[current].v.d = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
				case "illum": mod.v.mats[current].v.illum = full[i].substring( full[i].indexOf(" ")+1 ).trim(); break;
			}
		}
		for( var i in mod.v.mats ) {
			mod.v.mats[i].load( mod, num );
		}
	}}(this));
};

function segment( name ) {
	this.name = name;
	this.textures = {};
}