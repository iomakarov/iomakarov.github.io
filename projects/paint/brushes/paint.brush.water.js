'use strict';
var matherWater = function(ctx, color, steps, style){
    var m, s, s_1, s_2, dx, dy, dx_1, dy_1, dx_2, dy_2;
    m = 20;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    if (style=='tube') {
        ctx.fillStyle = color;
        ctx.strokeStyle = 'white';
    }

    if (style=='palm') {
        m = 30;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = color;
    }
    
    if (style=='eraser') {
        m = 50;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
    }

    if (steps.length>2){
        s = steps[steps.length-1];
        s_1 = steps[steps.length-2];
        s_2 = steps[steps.length-3];
        dx = s.dx*m;
        dy = s.dy*m;
        dx_1 = s_1.dx*m;
        dy_1 = s_1.dy*m;
        dx_2 = s_2.dx*m;
        dy_2 = s_2.dy*m;

        if (s_2.v==null){
            dx_1 = dx;
            dy_1 = dy;
            dx_2 = dx;
            dy_2 = dy;
            ctx.beginPath();
            ctx.arc(s_2.x,s_2.y,Math.abs(s.v*m/2),0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
        }


        ctx.beginPath();
        ctx.moveTo(s_1.x-dx_1,s_1.y+dy_1);
        ctx.quadraticCurveTo(s.xc-dx_1, s.yc+dy_1,s.x-dx, s.y+dy);
        ctx.lineTo(s.x+dx, s.y-dy);
        ctx.quadraticCurveTo(s.xc+dx_1, s.yc-dy_1,s_1.x+dx_1,s_1.y-dy_1);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(s_2.x-dx_2, s_2.y+dy_2);
        ctx.quadraticCurveTo(s_1.x-dx_1, s_1.y+dy_1,s.x-dx, s.y+dy);
        ctx.lineTo(s.x+dx, s.y-dy);
        ctx.quadraticCurveTo(s_1.x+dx_1, s_1.y-dy_1,s_2.x+dx_2,s_2.y-dy_2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.xc,s.yc,(s.v+s_1.v)/2*m/2,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.v*m/2,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
        
    }
}

var water = function(ctx, color, steps){
    matherWater(ctx, color, steps,'water');
}
var eraser = function(ctx, color, steps){
    matherWater(ctx, color, steps,'eraser');
}
var tube = function(ctx, color, steps){
    matherWater(ctx, color, steps,'tube');
}
var palm = function(ctx, color, steps){
    matherWater(ctx, color, steps,'palm');
}


