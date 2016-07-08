/* Function delElements (s) */
$del = function () {
    for ( var i = 0; i < arguments.length; i++ ) {
        var el = arguments[i];
        var pr = el.parentNode;
        pr.removeChild( el );
    }
    ;
};
/* Function delElements in parentElement */
$delChs = function ( pr ) {
    var chs = pr.childNodes;
    var len = chs.length;
    for ( var i = len - 1; i >= 0; i-- ) {
        pr.removeChild( chs[i] );
    }
    ;
};
/* Function get num parent */
$getPr = function ( el, num ) {
    var pr = el;
    for ( var i = 0; i < num; i++ ) {
        pr = pr.parentNode;
    }
    ;
    return pr;
};
/* Function elements by tag name and name in parent */
$getTNT = function ( tnm, nm, pr ) {
    var els = pr.getElementsByTagName( tnm );
    var res = new Array();
    for ( var i = 0; i < els.length; i++ ) {
        if ( els[i].name == nm ) {
            res.push( els[i] );
        }
        ;
    }
    ;
    return res;
};

/* Function elements by tag name and name in parent */
$ = function ( id ) {
    return document.getElementById(id);
};