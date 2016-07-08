/**
 * @author Makarov Igor 2012 iomakarov.com
 * @description
 */
define([], function() {
    function init() {
        $('.carousel').carousel({interval: 5000});

    };
    return {
        init: init
    };
});
