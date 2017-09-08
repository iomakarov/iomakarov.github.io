'use strict';

var paint = (function() {
    var canvas, 
        context,
        canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight-5,

        brush,
        history,
        isPaint = false;

    function init(canvasId) {
        
        canvas = document.getElementById(canvasId);
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        context = canvas.getContext("2d");

        _setDefault();
        _setDrawEvents();

        clear();
    }

    function _setDefault() {
        brush = paintBrush;
        history = paintHistory;
        brush.init(context);
        history.init(canvas, context);
    }

    function _setDrawEvents() {

        /* Mouse events */
        canvas.onmousedown = function(e){
            var mouseX = e.pageX - this.offsetLeft,
                mouseY = e.pageY - this.offsetTop;
            _paintStart(mouseX, mouseY);
        };

        canvas.onmousemove = function(e){
            if (isPaint){
                var mouseX = e.pageX - this.offsetLeft,
                    mouseY = e.pageY - this.offsetTop;
                _paint(mouseX, mouseY);
            }
        };
        
        canvas.onmouseup = function(e){
            
            _paintStop();
        };
        /* TODO do not work outside canvas
        canvas.onmouseleave = function(e){
            paint = false;
        };
        */

        /* Touch events */ 
        canvas.addEventListener('touchstart', function(e) {
            var touch = e.targetTouches[0],
                touchX = touch.pageX - this.offsetLeft,
                touchY = touch.pageY - this.offsetTop;
            if (e.targetTouches.length == 1) {
               _paintStart(touchX, touchY);
            }
        }, false);

        canvas.addEventListener('touchmove', function(e) {
            var touch = e.targetTouches[0],
                touchX = touch.pageX - this.offsetLeft,
                touchY = touch.pageY - this.offsetTop;
            if (e.targetTouches.length == 1) {
                /* TODO check ! touchstart do not work DESKTOP IE OPERA SAFARI 
                _paintStart(); */
                _paint(touchX, touchY);
            }
        }, false);

        canvas.addEventListener('touchend', function(e) {
            _paintStop();
        }, false);

    }

    function _paint(x, y) {
        brush.draw(x, y);
    }

    function _paintStart(x, y) {
        if (isPaint==false) {
            isPaint = true;
            brush.drawStart(x, y);
        }
    }

    function _paintStop(x, y) {
        isPaint = false;
        brush.drawStop();
        history.saveState();
    }

    function clear(){
        history.clear();
        context.clearRect(0, 0, canvas.width, canvas.height);
        history.saveState();
    }   

    function saveInUploadFile() {
        var dt = canvas.toDataURL();
        var d = new Date();
        /* TODO YYYY-MM-DD hh:mm::ss */
        this.download = 'Feeling_Speed_Brush-'+d.getTime()+'.png';
        this.href = dt; 
    }

    return {
        init:init,
        saveInUploadFile:saveInUploadFile,
        clear:clear
    }
})();