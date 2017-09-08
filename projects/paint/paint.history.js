"use strict";

var paintHistory = (function() {
    var 
        redo_list = [],
        undo_list = [],
        now_canvas = null,
        canvas,
        ctx;

    function init(cs, cx) {
        canvas = cs;
        ctx = cx;
    }
    function saveState() {
        redo_list = [];
        if (now_canvas){
            undo_list.push(now_canvas);
        }
        now_canvas = canvas.toDataURL(); 
    }

    function clear() {
        redo_list = [];
        undo_list = [];
        now_canvas = null;
    }

    function undo() {
        _restore(undo_list, redo_list);
    }

    function redo() {
        _restore(redo_list, undo_list);
    }

    function _restore(pop, push){
        if (pop.length) {
            push.push(canvas.toDataURL()); 
            _restoreImage(pop.pop());
        }
    }

    function _restoreImage(restore_state){
        
        var img = new Image();
        img.src = restore_state;
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            now_canvas = canvas.toDataURL(); 
        }
    }

    return {
        init:init,
        saveState:saveState,
        clear:clear,
        undo:undo,
        redo:redo
    }
})();