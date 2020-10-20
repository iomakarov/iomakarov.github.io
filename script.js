function ready(fn) {
    document.readyState != 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
}
async function show(hash)
{
    var  
        num = hash.replace('#',''),
        data = await fetch("data/"+num+".txt", { method: 'get'}),
        dataText = await data.text(),
        a = document.querySelector("ul.poetry a[href='#"+num+"']"),
        pattern = /\r\n|\r|\n/g,
        arr = dataText.split(pattern);
    a.classList.add('open');
    a.scrollIntoView({behavior: 'smooth'});
    arr.splice(0, 2);
    a.insertAdjacentHTML('afterend', '<p>'+ arr.join('<br>')+'<br></p>');
    //history.pushState(null, null, '/anypath');
}
ready(() => {
    document.querySelectorAll("ul.poetry a").forEach(el => {
        el.addEventListener("click", () => {
            if (el.classList.contains('open')){
                el.classList.remove('open');
                el.nextElementSibling.parentNode.removeChild(el.nextElementSibling);
            } else {
                show(el.getAttribute('href'));
            }
        })
    });
    location.hash ? show(location.hash) : null;
});