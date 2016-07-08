function show(hash)
{
    var  num = hash.replace('#','')
        ,$a = $("ul").find('a').filter('[href=#'+num+']')
        ,pattern = /\r\n|\r|\n/g;
    $a.addClass('open');
    $a.scrollTo();
    $.ajax({
         url: "data/"+num+".txt"
        ,dataType: "text"
        ,cache: false
    }).done(function( text ) {
        var  arr = text.split(pattern)
            ,title = arr[0];
        arr.splice(0, 2);
        $('<p>'+ arr.join('<br>')+'<br></p>').insertAfter($a);
    });

}
$('ul.poetry').find('a').on('click', function() {
    $a = $(this);
    if ($a.hasClass('open')){
        $a.removeClass('open');
        $a.next().remove();
    } else {
        show($a.attr('href'));
    }
});
$(function() {
    $('ul').find('a').each(function() {
        var href = $(this).attr( "href" );
        $(this).attr( "href", href.replace('data/','#').replace('.txt',''));
    });
    var hash = location.hash;
    if (hash)
    {
        show(hash);
    }
});
//console.log(); всегда рядом
