function ready(fn) {
    document.readyState != 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
}
async function show(href)
{
    console.log(href)
    var
        data = await fetch(href, { method: 'get'}),
        dataText = await data.text(),
        a = document.querySelector("ul.poetry a[href='"+href+"']"),
        pattern = /\r\n|\r|\n/g,
        arr = dataText.split(pattern);
    a.classList.add('open');
    a.scrollIntoView({behavior: 'smooth'});
    arr.splice(0, 2);
    a.insertAdjacentHTML('afterend', '<p>'+ arr.join('<br>')+'<br></p>');
    history.pushState(null, null, href);
}
ready(() => {
    document.getElementById("openCensure").onclick = function() {
        document.querySelectorAll("li.censure").forEach(el => {
            el.classList.remove("censure");
        });    
    };
    document.querySelectorAll("ul.poetry a").forEach(el => {
        el.addEventListener("click", (e) => {
            if (el.classList.contains('open')){
                el.classList.remove('open');
                el.nextElementSibling.parentNode.removeChild(el.nextElementSibling);
            } else {
                show(el.getAttribute('href'));
            }
            e.preventDefault();
        })
    });
    location.hash ? show(location.hash.replace('#','')) : null;

});