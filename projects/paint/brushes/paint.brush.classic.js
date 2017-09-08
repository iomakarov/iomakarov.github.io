'use strict';
var classic = function(ctx, color, steps){
    var m, s, s_1, s_2, dx, dy, dx_1, dy_1, dx_2, dy_2;
    if (steps.length>2){
        m = 3;
        s = steps[steps.length-1];
        s_1 = steps[steps.length-2];
        s_2 = steps[steps.length-3];
        dx = s.dx*m;
        dy = s.dy*m;
        dx_1 = s_1.dx*m;
        dy_1 = s_1.dy*m;
        dx_2 = s_2.dx*m;
        dy_2 = s_2.dy*m;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(s_2.x-dx_2, s_2.y+dy_2);
        ctx.quadraticCurveTo(s_1.x-dx_1, s_1.y+dy_1,s.x-dx, s.y+dy);
        ctx.lineTo(s.x+dx, s.y-dy);
        ctx.quadraticCurveTo(s_1.x+dx_1, s_1.y-dy_1,s_2.x+dx_2,s_2.y-dy_2);
        ctx.fill();
        ctx.stroke();
    }
}

