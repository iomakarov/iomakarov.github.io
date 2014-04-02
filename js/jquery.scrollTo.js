(function($) {
    $.scrollToElement = function($element, speed) {
        $("html, body").animate({
            scrollTop: $element.offset().top
        }, speed);
        return $element;
    };

    $.fn.scrollTo = function(speed) {
        speed = speed || 750;
        return $.scrollToElement(this, speed);
    };
})(jQuery);