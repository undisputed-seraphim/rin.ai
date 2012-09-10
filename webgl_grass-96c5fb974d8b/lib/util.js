/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var sphere_picks = [];
for(var i=0; i<8; i++){
    var x = Math.random()-0.5;
    var y = Math.random()-0.5;
    var z = Math.random()-0.5;
    var l = Math.sqrt(x*x+y*y+z*z);
    x/= l;
    y/= l;
    z/= l;
    l = Math.random();
    sphere_picks.push(x*l, y*l, z*l);
}

var golden_spiral = function(N){
    var picks = [];
    var inc = Math.PI * (3 - Math.sqrt(5));
    var off = 2/N;
    for(var k=0; k<N; k++){
        var y = k * off - 1.0 + (off/2);
        var r = Math.sqrt(1 - y*y);
        var phi = k*inc;
        if(y > 0.0){
            picks.push(Math.cos(phi)*r, y, Math.sin(phi)*r);
        }
    }
    return picks;
}

var Keys = function(){
    var keymap = ({
        87: 'w',
        65: 'a',
        83: 's',
        68: 'd',
        81: 'q',
        69: 'e',
        37: 'left',
        39: 'right',
        38: 'up',
        40: 'down',
        13: 'enter',
        27: 'esc',
        32: 'space',
        8: 'backspace',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        91: 'start',
        0: 'altc',
        20: 'caps',
        9: 'tab',
        49: 'key1',
        50: 'key2',
        51: 'key3',
        52: 'key4'
    });

    var self = this;

    $(document).keydown(function(event){
        self[keymap[event.which]] = true;
    });
    
    $(document).keyup(function(event){
        self[keymap[event.which]] = false;
    });
   
}

var Viewpoint = function(glee, keys, canvas){
    this.matrix = new glee.Mat4();
    this.rot = new glee.Mat3();
    this.inv = new glee.Mat4();
    this.inv_rot = new glee.Mat3();

    var mousepressed = false;
    var x, y;

    var position = this.position = new glee.Vec3(0.5, 0.2, 0.5);
    var speed = this.speed = new glee.Vec3();
    var change = this.speed = new glee.Vec3();

    var rotation = this.rotation = new glee.Vec3();
    var rotspeed = new glee.Vec3();
    var tmp = new glee.Vec3();

    var elem = document;

    $(elem).mousedown(function(event){
        if(event.button == 0){
            x = event.pageX, y = event.pageY;
            mousepressed = true;
        }
        return false;
    });

    $(elem).mouseup(function(event){
        if(event.button == 0){
            mousepressed = false;
        }
    });

    $(elem).mousemove(function(event){
        if(mousepressed){
            var xdelta = event.pageX-x;
            var ydelta = y-event.pageY;
            x = event.pageX, y = event.pageY;
            rotspeed.x -= xdelta*0.5;
            rotspeed.y -= ydelta*0.5;
        }
    });
            
    this.step = function(delta){
        delta = delta/1000;
        tmp.update(rotspeed).mul(delta);
        rotation.add(tmp);
        rotspeed.mul(0.98);
        
        tmp.update(speed).mul(delta).mul(0.001);
        position.add(tmp);
        speed.mul(0.99);

        change.x = keys.a ? -1 : keys.d ? +1 : 0;
        change.y = keys.q ? -1 : keys.e ? +1 : 0;
        change.z = keys.s ? +1 : keys.w ? -1 : 0;

        change.mul(1.0).mul(this.rot);
        speed.add(change);

        if(rotation.y > 70){
            rotation.y = 70;
            rotspeed.y = 0;
        }
        else if(rotation.y < -70){
            rotation.y = -70;
            rotspeed.y = 0;
        }
        
        this.matrix.ident()
            .rotatex(this.rotation.y)
            .rotatey(-this.rotation.x)
            .translate(-position.x, -position.y, -position.z)
        this.rot.updateFrom(this.matrix);
        this.inv.updateFrom(this.matrix).invert();
        this.inv_rot.updateFrom(this.inv);
    }
};

var FloatTexture = function(glee, gl, width, height){
    return new glee.Texture({
        width: width,
        height: height,
        format: gl.RGBA,
        internal_format: gl.RGBA,
        type: gl.FLOAT
    });
}

var randomTexture = function(glee, gl, width, height){
    var data = [];
    for(var i=0; i<width*height; i++){
        data[i+0];
        var x = Math.random()-0.5;
        var y = Math.random()-0.5;
        var z = Math.random()-0.5;
        var l = Math.sqrt(x*x+y*y+z*z);
        x/= l;
        y/= l;
        z/= l;
        data.push(x, y, z, 1.0);
    }
    data = new Float32Array(data);

    return new glee.Texture({
        width: width,
        height: height,
        format: gl.RGBA,
        internal_format: gl.RGBA,
        type: gl.FLOAT,
        repeat: true,
        data: data
    });
}

var Perspective = function(glee, params){
    this.matrix = new glee.Mat4().perspective(params);
    this.inverse = new glee.Mat4().inverse_perspective(params);
}
