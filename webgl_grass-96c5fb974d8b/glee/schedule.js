/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
Glee.prototype.schedule = function(fps, onrun){
    var last = (new Date()).getTime();
    var itime = 1000/fps;

    var active = true;
    $(window).bind('blur', function(){
        active = false;
    });
    
    $(window).bind('focus', function(){
        active = true;
    });

    var interval = setInterval(function(){
        var current = (new Date()).getTime();
        var delta = Math.max(itime, current-last);
        last = current;
        if(active){
            onrun(delta);
        }
    }, itime);

    return {
        stop: function(){
            clearInterval(interval);
        }
    }
};
