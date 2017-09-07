var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var paint = false;
var context;
var xMinus = null;
var yMinus = null;
var xMinus1 = null;
var yMinus1 = null;

var tMinus = null;
var vMinus = null;
var first = true;
var dxm, dym = null;
var dxm1, dym1 = null;
var brush = 'classic';
var color = 'black';

function prepareCanvas()
{
    var canvasDiv = document.getElementById('paint');
    canvasDiv.addEventListener('touchmove', function(event) {
        event.preventDefault();
        touches = event.touches;
    }, false); 

	canvas = document.getElementById('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight-5);
	canvas.setAttribute('id', 'canvas');
	context = canvas.getContext("2d"); 


    // history - save after drow

    var history = {
        redo_list: [],
        undo_list: [],
        now_canvas: null,
        saveState: function(canvas) {
            this.redo_list = [];
            if (this.now_canvas){
                this.undo_list.push(this.now_canvas);
            }
            this.now_canvas = canvas.toDataURL(); 
        },
        undo: function(canvas, ctx) {
            this.restore(canvas, ctx, this.undo_list, this.redo_list);
        },
        redo: function(canvas, ctx) {
            this.restore(canvas, ctx, this.redo_list, this.undo_list);
        },
        restore: function(canvas, ctx, pop, push){
            if (pop.length) {
                push.push(canvas.toDataURL()); 
                restore_state = pop.pop();
                this.restoreImage(canvas, ctx, restore_state);
            }
        },
        restoreImage: function(canvas, ctx, restore_state){
            var img = new Image();
            img.src = restore_state;
            img.onload = function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                history.now_canvas = canvas.toDataURL(); 
            }
        },
        clear: function() {
            this.redo_list = [];
            this.undo_list = [];
            this.now_canvas = null;
        }
    }

    // Settings event


    $("span.brush").click( function(){
        brush = $(this).data('brush');
        $("span.brush").removeClass('checked');
        $(this).addClass('checked');
    });

    $("span.color").click( function(){
        color = $(this).data('color');
        $("span.color").removeClass('checked');
        $(this).addClass('checked');
    });

    $("span.clear").click( function(){
        history.clear();
        clear();
    });
    $("span.undo").click( function(){
         history.undo(canvas, context);
    });
    $("span.redo").click( function(){
         history.redo(canvas, context);
    });
    

    function download() {
        var dt = canvas.toDataURL();
        var d = new Date();
        this.download = 'Feeling_Speed_Brush-'+d.getTime()+'.png';
        this.href = dt; 
    }
    document.getElementById('save-button').addEventListener('click', download, false);

	// Add mouse events
	// ----------------

	
    canvas.addEventListener('touchmove', function(e) {
        var touch = e.targetTouches[0];
        var mouseX = touch.pageX - this.offsetLeft;
		var mouseY = touch.pageY - this.offsetTop;
        if (e.targetTouches.length == 1) {
            if (paint==false) {
                paint = true;
                
            }
            
            drowSpeed(mouseX, mouseY);
        }
    }, false);

    canvas.addEventListener('touchend', function(e) {
        paintFalse();
    }, false);
    canvas.addEventListener('touchstart', function(e) {
        
    }, false);

	canvas.onmousedown = function(e){
		paint = true;
        
	};

	canvas.onmousemove = function(e){
        var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
        drowSpeed(mouseX, mouseY);
	};
    
	canvas.onmouseup = function(e){
		paintFalse();
	};

    function paintFalse(){
        history.saveState(canvas);
        paint = false;
        xMinus = null;
        yMinus = null;
        tMinus = null;
        vMinus = null;
        xMinus1 = null;
        yMinus1 = null;
        dxm = null;
        dym = null;
        dxm1 = null;
        dym1 = null;
        first = true;
    }    
    
    function clear(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        history.saveState(canvas);
    }   

    function drowSpeed(x, y){
        if(paint==true){
            var d = new Date();
            var tNow = d.getTime();
            var l, v, a, xr, yr, xc, yc;
    
            
            if (tMinus !== null){
               
                with (Math) {
                    xr = x - xMinus; 
                    yr = y - yMinus;
                    xc = xMinus + xr/2;
                    yc = yMinus + yr/2;
                    l = sqrt(pow(xr,2) + pow(yr,2));
                    v = l/(tNow-tMinus);
                   
                    if (vMinus !== null){
                        v = (v+vMinus)/2;
                        
                        if (v > vMinus*2){
                            v = vMinus*2;
                        }
                        if (brush=='classic') {
                            drowClassic(xc, yc, l, xr, yr, v, x, y,xMinus,yMinus,xMinus1,yMinus1);
                        }
                        if (brush=='eraser' || brush=='water' || brush=='tube' || brush=='palm') {
                            drowEraser(xc, yc, l, xr, yr, v, x, y,xMinus,yMinus,xMinus1,yMinus1);
                        }
                        if (brush=='punk') {
                            drowPunk(xc, yc, l, xr, yr, v, x, y,xMinus,yMinus);
                        }
                        if (first){
                            first = false;
                        }
                    } 
                    vMinus = v;
                    xMinus1 = xMinus;
                    yMinus1 = yMinus;
                    
                }
            }

            xMinus = x;
            yMinus = y;
            tMinus = tNow;
            
        }
    }

    function drowEraser(xc, yc, l, xr, yr, v, x, y,xm,ym,xm1,ym1){
        var m = 20;
        var dx = v/(2*l)*yr*m;
        var dy = v/(2*l)*xr*m;
        if (dxm == null) {
            dxm = dx;
            dym = dy;
            if (dxm1 == null) {
                dxm1 = dx;
                dym1 = dy;
            }
        }

        context.fillStyle = color;
        context.strokeStyle = color;
        if (brush=='eraser') {
            context.fillStyle = 'white';
            context.strokeStyle = 'white';
        }

        if (brush=='tube') {
            context.fillStyle = color;
            context.strokeStyle = 'white';
        }

        if (brush=='palm') {
            context.fillStyle = 'white';
            context.strokeStyle = color;
        }

        if (first){
            context.beginPath();
            context.arc(xm1,ym1,Math.abs(v*m/2),0,2*Math.PI);
            context.fill();
            context.stroke();
        }

        
        context.beginPath();
        context.moveTo(xm-dxm,ym+dym);
        context.quadraticCurveTo(xc-dxm, yc+dym,x-dx, y+dy);
        context.lineTo(x+dx, y-dy);
        context.quadraticCurveTo(xc+dxm, yc-dym,xm+dxm,ym-dym);
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(xm1-dxm1,ym1+dym1);
        context.quadraticCurveTo(xm-dxm, ym+dym,x-dx, y+dy);
        context.lineTo(x+dx, y-dy);
        context.quadraticCurveTo(xm+dxm, ym-dym,xm1+dxm1,ym1-dym1);
        context.fill();
        context.stroke();
        
        context.beginPath();
        context.arc(xc,yc,(v+vMinus)/2*m/2,0,2*Math.PI);
        context.fill();
        context.stroke();
        
        context.beginPath();
        context.arc(x,y,v*m/2,0,2*Math.PI);
        context.fill();
        context.stroke();

        
      
        dxm1 = dxm;
        dym1 = dym;
        dxm = dx;
        dym = dy;
    }

    function drowClassic(xc, yc, l, xr, yr, v, x, y,xm,ym,xm1,ym1){
        var m = 3;
        var dx = v/(2*l)*yr*m;
        var dy = v/(2*l)*xr*m;
        if (dxm == null) {
            dxm = dx;
            dym = dy;
            if (dxm1 == null) {
                dxm1 = dx;
                dym1 = dy;
            }
        }
        context.fillStyle = color;
        context.strokeStyle = color;

        context.beginPath();
        context.moveTo(xm1-dxm1,ym1+dym1);
        context.quadraticCurveTo(xm-dxm, ym+dym,x-dx, y+dy);
        context.lineTo(x+dx, y-dy);
        context.quadraticCurveTo(xm+dxm, ym-dym,xm1+dxm1,ym1-dym1);
        context.fill();
        context.stroke();

        dxm1 = dxm;
        dym1 = dym;
        dxm = dx;
        dym = dy;
    }

    function drowPunk(xc, yc, l, xr, yr, v, x, y,xm,ym){
        var m = 100
        var dx = v/(2*l)*yr*m;
        var dy = v/(2*l)*xr*m;
        context.beginPath();
        context.moveTo(xc+dx,yc-dy);
        context.lineTo(xm-dx, ym+dy);
        context.lineTo(x-dx, y+dy);
        context.fillStyle = color;
        context.fill();
    }


    clear();
    /*
    canvas.onmouseleave = function(e){
        paint = false;
    };
    */
    /*
    canvas.addEventListener('touchmove', function(event) {
        //event.preventDefault();
        touches = event.touches;
    }, false);
    */
}
