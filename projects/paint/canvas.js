var paddingCanvas = 60;
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight-paddingCanvas;
var paint = false;
var context;
var xMinus = null;
var yMinus = null;
var xMinus1 = null;
var yMinus1 = null;
var tMinus = null;
var vMinus = null;
var dxm, dym = null;
var dxm1, dym1 = null;
var brush = 'classic';
var color = 'black';
function prepareCanvas()
{
    var canvasDiv = document.getElementById('canvasDiv');
    canvasDiv.addEventListener('touchmove', function(event) {
        event.preventDefault();
        touches = event.touches;
    }, false); 

	canvas = document.createElement('canvas');
    canvas.style.position = 'relative';
    canvas.style.borderTop = '1px solid black';
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');

	canvasDiv.appendChild(canvas);
	context = canvas.getContext("2d"); 

    // Settings event
    $("input[name=brush]").click( function(){
        if( $(this).is(':checked') ) {
            brush = this.value;
        } 
    });

    $("input[name=color]").click( function(){
        if( $(this).is(':checked') ) {
            color = this.value;
        } 
    });

    $("input[name=clear]").click( function(){
        clear();
    });


	// Add mouse events
	// ----------------

	
    canvas.addEventListener('touchmove', function(e) {
        var touch = e.targetTouches[0];
        var mouseX = touch.pageX - this.offsetLeft;
		var mouseY = touch.pageY - this.offsetTop;
        if (e.targetTouches.length == 1) {
            paint = true;
            drowSpeed(mouseX, mouseY);
        }
    }, false);

    canvas.addEventListener('touchend', function(e) {
        paintFalse();
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
    }    
    
    function clear(){
        context.clearRect(0, 0, canvas.width, canvas.height);
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
                        a = (v-vMinus)/(tNow-tMinus);
                        if (brush=='classic') {
                            drowClassic(xc, yc, l, xr, yr, v-a*10, x, y,xMinus,yMinus,xMinus1,yMinus1);
                        }
                        
                    } 
                    vMinus = v;
                    xMinus1 = xMinus;
                    yMinus1 = yMinus;
                }
                if (brush=='pank') {
                    drowPank(xc, yc, l, xr, yr, v, x, y,xMinus,yMinus);
                }
              
            }

            xMinus = x;
            yMinus = y;
            tMinus = tNow;
            
        }
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

        context.beginPath();
        context.moveTo(xm1-dxm1,ym1+dym1);
        context.quadraticCurveTo(xm-dxm, ym+dym,x-dx, y+dy);
        context.lineTo(x+dx, y-dy);
        context.quadraticCurveTo(xm+dxm, ym-dym,xm1+dxm1,ym1-dym1);
        context.fillStyle = color;
        context.strokeStyle = color;
        context.fill();
        context.stroke();
        dxm1 = dxm;
        dym1 = dym;
        dxm = dx;
        dym = dy;
    }

    function drowPank(xc, yc, l, xr, yr, v, x, y,xm,ym){
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

