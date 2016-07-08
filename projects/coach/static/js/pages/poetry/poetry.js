/**
 * @author Makarov Igor 2012 iomakarov.com
 * @description
 */
define([
    'repo/Effects/disorder'
]
, function(
    disorder
) {
    var likeServices = ['vkontakte', 'facebook', 'twitter', 'gplus'];
    function init() {
        disorder.init();
        bindEvents();
        hashPage();
    };
    function hashPage(h) {
        var hash = '';
        if (!h){
            hash = location.hash;
        } else {
            hash = h;
        }
        hash = hash.split('#')[1];
        if (hash){
            $.scrollTo('#'+hash, 1000);
            openPoetry(hash);
        }
    };
    function bindEvents() {
        $('body *').disableSelection();
        $('.poetry-link').live('click', function() {
            hashPage($(this).attr('href'));
            return false;
        });
    	$('.poetry-likes-toggle-a').live('click', function() {
            var idPoetry = $(this).parents('.poetry').find(':input').filter('[name=id_poetry]').val();
            openPoetry('poetry_'+idPoetry);
            return false;
        });
    };
    function openPoetry(poetry){
        disorder.restore($('#'+poetry));
        addLikes(poetry);
    }
    function addLikes(poetry) {
        $parent = $('#'+poetry);
        var $inputs = $parent.find(':input');
        var $likes = $parent.find('.poetry-likes-toggle');
        var title = $inputs.filter('[name=title]').val();
        var link = 'http://iomakarov.com/poetry/#'+poetry;
        $likes.empty();
        var YaShareInstance = new Ya.share({
            element: $likes.get(0),
            title:title,
            description:"Автор: Макаров Игорь",
            link:link,
            image:'http://iomakarov.com/decor/kDz9L77mLHo.jpg',
            elementStyle: {
                type:'none',
                quickServices:likeServices
            }
        });
        $likes.append($('<a href="'+link+'" target="_blank">Ссылка</a>'));
    }
    return {
        init: init

    };
});
