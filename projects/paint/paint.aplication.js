'use strict';

var paintAplication = (function() {
    function init() {
        paint.init('canvas');
        _setDefault();
        _setControlEvents();
    }
    function _setDefault() {
        paintBrush.setColor('black');
        paintBrush.setStyle('classic');
    }
    function _setControlEvents() {
  
        $("span.brush").click( function(){
            paintBrush.setStyle($(this).data('brush'));
            $("span.brush").removeClass('checked');
            $(this).addClass('checked');
        });

        $("span.color").click( function(){
            paintBrush.setColor($(this).data('color'));
            $("span.color").removeClass('checked');
            $(this).addClass('checked');
        });

        $("span.clear").click( function(){
            paint.clear();
        });

        $("span.undo").click( function(){
            paintHistory.undo();
        });

        $("span.redo").click( function(){
            paintHistory.redo();
        });

        document.getElementById('save-button').addEventListener('click', paint.saveInUploadFile, false);
        
        /* This code disable touch event on control panel*/ 
        var container = document.getElementById('paint');
        container.addEventListener('touchmove', function(event) {
            event.preventDefault();
            /*touches = event.touches;*/
        }, false); 
    }

    return {
        init:init
    }
})();