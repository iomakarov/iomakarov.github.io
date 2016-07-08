/**
 * @author Makarov Igor 2012 iomakarov.com
 * @description
 */
define([]
, function() {

    function init() {
        $("#playlist").playlist(
            {
                playerurl: "/static/swf/drplayer.swf"
            }
        );
    };

    return {
        init: init
    };
});

