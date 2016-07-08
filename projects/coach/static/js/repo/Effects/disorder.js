/**
 * @author Makarov Igor 2012 iomakarov.com
 * @description
 */
define([], function() {
    //var moduleVar;
	var _classDisorder = 'effect-disorder';
	var _br = '<br>';
	var _style = '<style>.'+_classDisorder+' {cursor:pointer;} .'+_classDisorder+' span {position:relative; }</style>';
	
    function init() {
        updateVars();
        bindEvents();
        $('body').append(_style);
        apply($('.'+_classDisorder));
    };
    
    function updateVars() {
    };

    function bindEvents() {
    };

    function apply($els){
    	$els.each(function (i) {
	    	var $steb = $(this);
			var text = $steb.html();
			$steb.empty();
			var rStr = ''; 
			var rX=0,rY=0;
			text = text.split('');
			var tag = false;
			var tag_text = '';
			for (var i=0;i<text.length;i++) {
				if (text[i] == '<') {
					tag = true;
				}
				
				if (!tag) {
					rX = Math.round(Math.random()*50 - 25);
					rY = Math.round(Math.random()*50 - 25);
					rStr += '<span style="left:'+rX+'px;top:'+rY+'px;">'+text[i]+'</span>';
				} else {
					tag_text += text[i];
					if (text[i] == '>') {
						rStr += tag_text;
						tag_text = '';
						tag = false;
					}
				}
			}
			$steb.html(rStr);
			$steb.click(function(){
                restore($(this));
            });
    	});
    }
    function restore($el){

        $el.find('span').animate(
            {
                top : "0px"
                ,left : "0px"
            }, 500,
            "linear",
            function(){
                //$steb.parents('.poetry').find('.poetry-social').css({visibility:'visible'});
            }
        );

    }
    return {
        init: init
        ,restore:restore
    };
});
