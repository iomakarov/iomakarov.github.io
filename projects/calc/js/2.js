/* iNode Functions*/
function is_chrome() {
    var is_chr = false, chr_version = false;
    if ( navigator.userAgent.toLowerCase().indexOf( 'chrome' ) > -1 ) {
        is_chr = true;
        chr_version = navigator.userAgent.replace( /^.*Chrome\/([\d\.]+).*$/i, '$1' )
    }
    ;
    return is_chr;
};
iClear = function () { $delChs( $( 'iNodes' ) ); };
iAdd = function ( num, pars ) {
    var num = num || null;
    var pars = pars || null;
    var iTemp = iClone.cloneNode( true );
    if ( pars != null ) {
        var iVars = $getTNT( "input", "iVar[]", iTemp );
        var iFuncs = $getTNT( "input", "iFunc[]", iTemp );
        var iRess = $getTNT( "input", "iRes[]", iTemp );
        var iComms = $getTNT( "input", "iComm[]", iTemp );
        var iCommBs = $getTNT( "input", "iCommB[]", iTemp );
        iVars[0].value = pars.iVar;
        iFuncs[0].value = pars.iFunc;
        iRess[0].value = pars.iRes;
        iComms[0].value = pars.iComm;
        if ( ( pars.iComm != null ) && (pars.iComm != "") ) {
            iComms[0].style.display = "block";
            iCommBs[0].value = "к";
        }
    }
    ;
    var iNodes = $( 'iNodes' );

    if ( ( num == null ) || ( num == -1 ) ) {
        var tbs = iNodes.childNodes;
        if ( ( tbs.length > 0 ) && ( num == -1 ) ) {
            iNodes.insertBefore( iTemp, tbs[0] );
        } else {
            iNodes.appendChild( iTemp );
        }
        var iSelects = $getTNT( "input", "iSelect[]", iNodes );
        iSelects[0].checked = true;
    } else {
        var tbs = iNodes.childNodes;
        iNodes.insertBefore( iTemp, tbs[num] );
        var iSelects = $getTNT( "input", "iSelect[]", iNodes );

        iSelects[num].checked = true;
    }
    ;
};
iDel = function ( el ) {
    var pr = $getPr( el, 5 );
    var prOld = pr.parentNode;
    prOld.removeChild( pr );
};
ocCommB = function ( el ) {
    var pr = $getPr( el, 5 );
    var iComms = $getTNT( "input", "iComm[]", pr );
    if ( iComms[0].style.display == "none" ) {
        iComms[0].style.display = "block";
        el.value = "к";
    } else {
        iComms[0].style.display = "none";
        el.value = "К";
    }
    ;
};
rd = function ( x, n ) {
    var n = n || null;
    var res = NaN;
    with ( Math ) {
        if ( ( n == null ) || ( n == 0 ) ) {
            res = round( x );
        } else {
            if ( ( n == round( n ) ) ) {
                if ( ( n < 0 ) && ( pow( 10, abs( n ) ) > abs( round( x ) ) ) ) {
                    return 0;
                }
                ;
                var d10 = pow( 10, n );
                res = round( x * d10 ) / d10;
            }
            ;
        }
        ;
    }
    ;
    return res;
};
RD = rd;
rD = rd;
Rd = rd;
fc = function ( x ) {
    var res = NaN;
    if ( ( x > 0 ) && ( x == Math.round( x ) ) ) {
        var res = 1;
        for ( var i = 1; i <= x; i++ ) {
            res = res * i;
        }
        ;
    }
    ;
    return res;
};
FC = fc;
fC = fc;
Fc = fc;
iCalc = function ( el ) {
    var res = true;
    var iNodes = $( 'iNodes' );
    var iVars = $getTNT( "input", "iVar[]", iNodes );
    var iFunc = $getTNT( "input", "iFunc[]", iNodes );
    var iRes = $getTNT( "input", "iRes[]", iNodes );
    for ( i = 0; i < iVars.length; i++ ) {
        if ( iFunc[i].value != '' ) {
            try {
                if ( iVars[i].value != '' ) {
                    with ( Math ) {
                        var onlymystr = "var " + iVars[i].value + "=" + iFunc[i].value + ";";
                        eval( onlymystr );
                        iRes[i].value = eval( iVars[i].value );
                    }
                    ;
                } else {
                    with ( Math ) {
                        var onlymystr = iFunc[i].value;
                        iRes[i].value = eval( onlymystr );
                    }
                    ;
                }
                ;
            } catch ( e ) {
                alert( "Ошибка в " + 1 * (i + 1) + " строке!" );
                res = false;
                return res;
                break;
            }
            ;
        }
        ;
    }
    ;
    return res;
};
iReset = function () {
    var iSelects = $getTNT( "input", "iSelect[]", $( 'iNodes' ) );
    for ( var i = 0; i < iSelects.length; i++ ) {
        iSelects[i].checked = false;
    }
    ;
};
iNum = function () {
    var iNums = $getTNT( "input", "iNum[]", $( 'iNodes' ) );
    for ( var i = 0; i < iNums.length; i++ ) {
        iNums[i].value = i + 1;
    }
    ;
};
iSaveNum = function () {
    var iNums = $getTNT( "input", "iSaveNum[]", $( 'iSaveNodes' ) );
    for ( var i = 0; i < iNums.length; i++ ) {
        iNums[i].value = i + 1;
    }
    ;
};
iForm = function ( nm, act, send, targ ) {
    var send = send || "";
    var targ = targ || "";
    var form = document.forms[nm];
    form.action = act + send;
    form.target = targ;
    form.submit();
};


/* onClick functions */
ocAdd = function () {
    var iSelects = $getTNT( "input", "iSelect[]", $( 'iNodes' ) );
    var num = null;
    for ( var i = 0; i < iSelects.length; i++ ) {
        if ( iSelects[i].checked == true ) {
            num = i + 1;
        }
        ;
    }
    ;
    if ( num == null ) {
        num = -1;
    }
    iAdd( num );
    iNum();
};
ocDel = function ( el ) {
    iDel( el );
    iNum();
    iCalc();
};
ocClear = function () {
    iClear();
    iAdd();
    iNum();
};

ocPage = function ( nm, dyn ) {
    var dyn = dyn || null;
    var pages = new Array();
    pages[0] = "index";
    pages[1] = "info";
    for ( i = 0; i < pages.length; i++ ) {
        if ( nm == pages[i] ) {
            $( "page_" + pages[i] ).style.display = "block";

        } else {
            $( "page_" + pages[i] ).style.display = "none";
        }
        ;
    }
    ;
    if ( nm == pages[0] ) {
        document.onkeydown = ocEnter;
    } else {
        document.onkeydown = null;
    }
    ;

};
doGetCaretPosition = function ( ctrl ) {
    var CaretPos = null;
    if ( document.selection ) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart( 'character', -ctrl.value.length );
        CaretPos = Sel.text.length;
    } else if ( ctrl.selectionStart || ctrl.selectionStart == '0' ) CaretPos = ctrl.selectionStart;
    return (CaretPos);
};
setCaretPosition = function ( ctrl, pos ) {
    if ( ctrl.setSelectionRange ) {
        ctrl.focus();
        ctrl.setSelectionRange( pos, pos );
    } else if ( ctrl.createTextRange ) {
        var range = ctrl.createTextRange();
        range.collapse( true );
        range.moveEnd( 'character', pos );
        range.moveStart( 'character', pos );
        range.select();
    }
    ;
};
getSelText = function ( obj ) {
    var str = null;
    if ( document.selection ) {
        var el = document.selection.createRange();
        if ( el.text ) {
            str = el.text;
        }
        ;
    } else {
        if ( typeof(obj.selectionStart) == "number" ) {
            if ( obj.selectionStart != obj.selectionEnd ) {
                var start = obj.selectionStart;
                var end = obj.selectionEnd;
                str = obj.value.substr( start, end - start );
            }
            ;
        }
        ;
    }
    ;
    return str;
};
replaceSelectedText = function ( obj, str ) {
    obj.focus();
    if ( document.selection ) {
        var s = document.selection.createRange();
        if ( s.text ) {
            s.text = str;
            s.select();
            return true;
        }
        ;
    } else {
        if ( typeof(obj.selectionStart) == "number" ) {
            if ( obj.selectionStart != obj.selectionEnd ) {
                var start = obj.selectionStart;
                var end = obj.selectionEnd;
                obj.value = obj.value.substr( 0, start ) + str + obj.value.substr( end );
                obj.setSelectionRange( end, end );
                return true;
            }
            ;
        }
        ;
    }
    ;
    return false;
};
insString = function ( str, istr, num ) {
    var res = "";
    if ( num == 0 ) {
        res = istr + str;
    } else {
        for ( var i = 0; i < str.length; i++ ) {
            res = res + str.charAt( i );
            if ( i == num - 1 ) {
                res = res + istr;
            }
            ;
        }
        ;
    }
    ;
    return res;
};
repString = function ( str, istr, num ) {
    var res = "";
    for ( var i = 0; i < str.length; i++ ) {
        if ( i != num - 1 ) {
            res = res + str.charAt( i );
        }
        ;
        if ( i == num - 1 ) {
            res = res + istr;
        }
        ;
    }
    ;
    return res;
};
ocButton = function ( data ) {
    var iSelects = $getTNT( "input", "iSelect[]", $( 'iNodes' ) );
    var num = null;
    for ( var i = 0; i < iSelects.length; i++ ) {
        if ( iSelects[i].checked == true ) {
            num = i;
        }
        ;
    }
    ;
    if ( ( num != null ) | ( iSelects.length == 1 ) ) {
        if ( num == null ) {
            num = 0;
        }
        ;
        var istr = data.alt;
        var sstr = "";
        var estr = "";
        var dpos = 0;
        if ( data.className == "bFunc" ) {
            sstr = "(";
            estr = ")";
            dpos = 1;
            if ( data.value == "x^2" ) {
                sstr = "(";
                estr = ",2)";
                dpos = 3;
            }
            ;
            if ( data.value == "x^y" ) {
                sstr = "(";
                estr = ",)";
                dpos = 2;
            }
            ;
        }
        ;
        var iFuncs = $getTNT( "input", "iFunc[]", $( 'iNodes' ) );
        var sel = getSelText( iFuncs[num] );
        var pos = doGetCaretPosition( iFuncs[num] );
        if ( sel != null ) {
            if ( data.className != "bFunc" ) {
                sel = "";
            }
            replaceSelectedText( iFuncs[num], istr + sstr + sel + estr );
            setCaretPosition( iFuncs[num], pos + (istr + sstr + sel + estr).length - dpos );
        } else {
            if ( pos != 0 ) {
                if ( data.value == "<---" ) {
                    iFuncs[num].value = repString( iFuncs[num].value, istr + sstr + estr, pos );
                    dpos = 1;
                } else {
                    iFuncs[num].value = insString( iFuncs[num].value, istr + sstr + estr, pos );
                }
                ;
            } else {
                if ( iFuncs[num].value == "" ) {
                    iFuncs[num].value = iFuncs[num].value + istr + sstr + estr;
                } else {
                    iFuncs[num].value = insString( iFuncs[num].value, istr + sstr + estr, 0 );
                }
                ;
            }
            ;
            setCaretPosition( iFuncs[num], pos + (istr + sstr + estr).length - dpos );
        }
        ;
    } else {
        alert( "Выберите строку" );
    }
    ;
};
ocInput = function ( data ) {
    var pr = $getPr( data, 4 );
    var iSelects = $getTNT( "input", "iSelect[]", pr );
    iSelects[0].checked = true;
};
ocEnter = function ( evt ) {
    evt = (evt) ? evt : window.event;
    evt.returnvalue = false;
    if ( evt ) {
        var code = (evt.charCode) ? evt.charCode : evt.keyCode;
        if ( code == 13 ) {
            iCalc();
            return false;
        }
        ;
    }
    ;
};