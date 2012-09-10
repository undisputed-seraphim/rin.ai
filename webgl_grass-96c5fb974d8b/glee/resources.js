/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/

Glee.xhr = function(params){
    var request = new XMLHttpRequest();
    if(params.type){
        console.dir(request);
        request.overrideMimeType('text/plain; charset=x-user-defined');
    }
    request.onreadystatechange = function(){
        if(this.readyState == 4){
            params.success(request.responseText);
        }
    };
    request.open('GET', params.url);
    request.send();
};

Glee.prototype.load = function(params){
    var resources = params.resources;
    var extre = /\.(.+)$/
    var count = 0;
    var loaded = 0;
    var glee = this;
    var onprogress = params.onprogress || function(){};

    var do_load = function(root, obj){
        var prefix;
        if(root){
            if(obj.root){
                var prefix = root + '/' + obj.root;
            }
            else{
                var prefix = root;
            }
        }
        else if(obj.root){
            var prefix = obj.root;
        }
        Glee.each(obj, function(name, loc){
            if(name == 'root'){
                return;
            }
            else if(typeof(loc) == 'object'){
                do_load(prefix, loc);
            }
            else if(typeof(loc) == 'function'){
                return;
            }
            else{
                if(prefix){
                    var path = prefix + '/' + loc;
                }
                else{
                    var path = loc;
                }
                count += 1;
                var extension = path.match(extre)[1];
                if(extension == 'shader'){
                    Glee.xhr({
                        url: path,
                        success: function(text){
                            obj[name] = new glee.Shader(text, path);
                            loaded += 1;
                            onprogress(loaded/count, path);
                        }
                    });
                }
                else if(extension == 'png' || extension == 'jpg' || extension == 'gif'){
                    var image = new Image();
                    image.onload = function(){
                        obj[name] = new glee.Texture({image: image});
                        loaded += 1;
                        onprogress(loaded/count, path);
                    };
                    image.src = path;
                }
                else if(extension == 'vbo'){
                    Glee.xhr({
                        url: path,
                        success: function(text){
                            var params = JSON.parse(text);
                            obj[name] = new glee.VBO(params);
                            loaded += 1;
                            onprogress(loaded/count, path);
                        }
                    });
                }
            }
        });
    };
    do_load(null, resources);

    var interval = setInterval(function(){
        if(count==loaded){
            clearInterval(interval);
            params.onload(resources);
        }
    }, 100);
};
