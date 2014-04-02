function show(href)
{
    var url = href.replace('#','');
    if (url)
    {
        var $a = $("ul").find('a').filter('[href="'+url+'"]')
            ,pattern = /\r\n|\r|\n/g;
        $a.addClass('open');
        $.ajax({
             url: url
            ,dataType: "text"
            ,cache: false
        }).done(function( text ) {
            location.hash = url;
            var arr = text.split(pattern),
                title = arr[0];
            arr.splice(0, 2);
            $('<p>'+ arr.join('<br>')+'<br></p>').insertAfter($a);
        });
    }
}
$('ul').find('a').on('click', function() {
    $a = $(this);
    if ($a.hasClass('open')){
        $a.removeClass('open');
        $a.next().remove();
    } else {
        show($a.attr('href'));
    }
    return false;
});
$(function() {
    show(location.hash);
});
//console.log(); всегда держи его при себе