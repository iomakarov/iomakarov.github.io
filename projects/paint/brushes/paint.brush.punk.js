'use strict';
var punk = function(ctx, color, steps){
    var m, s, s_1, dx, dy;
    if (steps.length>2){

        m = 100;
        s = steps[steps.length-1];
        s_1 = steps[steps.length-2];
        dx = s.dx*m;
        dy = s.dy*m;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(s.xc+dx, s.yc-dy);
        ctx.lineTo(s_1.x-dx, s_1.y+dy);
        ctx.lineTo(s.x-dx, s.y+dy);
        ctx.fill();
    }
}

