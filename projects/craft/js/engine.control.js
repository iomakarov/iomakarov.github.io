/**
 * @author Makarov Igor 2012 craft.iomakarov.com
 * @description
 */
control = (function() {
    //    38
    // 37 40 39
    var keyboardEvents  = {};
    var touchEvents     = [];
    var touches     = [];

    function _onKeyDown(evt){
        var code = evt.keyCode;
        if (keyboardEvents[code]) {
            if (keyboardEvents[code]['down'] ){
                keyboardEvents[code].down();
            }
        }
    }

    function _onKeyUp(evt){
        var code = evt.keyCode;
        if (keyboardEvents[code]) {
            if (keyboardEvents[code]['up'] ){
                keyboardEvents[code].up();
            }
        }
    }

    function setKeybourd(code, funcs){
        keyboardEvents[code] = funcs;
    }

    function setTouch(coord, funcs){
        touchEvents.push({coord:coord, funcs:funcs});
    }

    function touchStart(event){
        var x, y, p;
        if (event.touches){
            for (var i=0;i<touchEvents.length;i++){
                p = touchEvents[i].coord;
                for (var j=0;j<event.touches.length;j++){
                    x = event.touches[j].pageX;
                    y = event.touches[j].pageY;
                    with (Math) {
                        if (pow(p.x-x,2)+pow(p.y-y,2)<=pow(p.r,2)) {
                            if (touchEvents[i].funcs['down']){
                                touchEvents[i].funcs.down();
                            }
                            // add button check

                        }
                    }
                }
            }
        }
    }
    function touchMove(event){

        event.preventDefault();
        /*
        var x, y, p;
        if (event.touches){
            for (var i=0;i<touchEvents.length;i++){
                p = touchEvents[i].coord;
                for (var j=0;j<event.touches.length;j++){
                    x = event.touches[j].pageX;
                    y = event.touches[j].pageY;
                    with (Math) {
                        if (pow(p.x-x,2)+pow(p.y-y,2)>=pow(p.r,2)) {
                            if (touchEvents[i].funcs['up']){
                                touchEvents[i].funcs.up();
                            }
                            // add button check
                        }
                    }
                }
            }
        }
        */
    }
    function touchEnd(event){
//        alert(event.changedTouches.length);
//        alert(event.changedTouches[0]);
        var x, y, p;
        if (event.changedTouches){
            for (var i=0;i<touchEvents.length;i++){
                p = touchEvents[i].coord;
                for (var j=0;j<event.changedTouches.length;j++){
                    x = event.changedTouches[j].pageX;
                    y = event.changedTouches[j].pageY;
                    with (Math) {
                        if (pow(p.x-x,2)+pow(p.y-y,2)<=pow(p.r,2)) {
                            if (touchEvents[i].funcs['up']){
                                touchEvents[i].funcs.up();
                            }
                            // add button check
                        }
                    }
                }
            }
        }
    }

    $(document).keydown(_onKeyDown);
    $(document).keyup(_onKeyUp);
    return {
         setKeybourd:setKeybourd
        ,setTouch:setTouch
        ,touchStart:touchStart
        ,touchMove:touchMove
        ,touchEnd:touchEnd
    }
})();