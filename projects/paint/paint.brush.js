'use strict';

var paintBrush = (function() {
    var ctx,
        color = 'black',
        style = 'classic',
        steps = [];

    function init(context){
        ctx = context;
        _reset();
    }
    function _reset(){
        steps = [];
    }

    function drawStart(x, y){
        _preareDraw(x, y);
        _draw();
    }
    function draw(x, y){
        _preareDraw(x, y);
        _draw();
    }
    function drawStop(){
        _reset();
    }


    function _preareDraw(x, y){
        var d = new Date(),
            t = d.getTime(),
            xr, yr, l, v, dv;

        var step = {
            x:x,
            y:y,
            t:t,
            v:null,
            dx:null,
            dy:null,
            xc:null,
            yc:null,
        };

        if (steps.length) {
            var step_1 = steps[steps.length-1];
            xr = step.x - step_1.x; 
            yr = step.y - step_1.y;
            l = Math.sqrt(Math.pow(xr,2) + Math.pow(yr,2));
            v = l/(step.t-step_1.t);
            v = step_1.v?(v+step_1.v)/2:v;
            
            dv = v/(2*l);
            step.v = v;
            step.dx = dv*yr;
            step.dy = dv*xr;
            step.xc = step_1.x + xr/2;
            step.yc = step_1.y + yr/2;
            if (steps.length>2) {
                steps.shift();
            }    
        }

        steps.push(step);
    }

    function _draw(){
        var drawStyle = new Function('ctx', 'color', 'steps','return '+style+'(ctx, color, steps)');
        drawStyle(ctx, color, steps);
    }

    function setColor(c){
        color = c;
    }
    function setStyle(s){
        style = s;
    }
    return {
        init:init,
        drawStart,
        draw:draw,
        drawStop,
        setColor:setColor,
        setStyle:setStyle
    }
})();
