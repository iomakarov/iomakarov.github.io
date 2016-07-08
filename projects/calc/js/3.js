function onLoad(){
    var iNodes = $( 'iNodes' );
    var iNode = iNodes.children[0];
    iClone = iNode.cloneNode( true );
    iNum();
    var iSelects = $getTNT( "input", "iSelect[]", iNodes );
    iSelects[0].checked = true;
    ocPage( "index" );
}
