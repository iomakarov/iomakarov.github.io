/**
 * @author Makarov Igor 2012 craft.iomakarov.com
 * @description
 */
window.onload = function() {
    game.init({id:'craft'});
    game.start();
    $("#start").click(function(){
        game.start();
    });
    $("#stop").click(function(){
        game.stop();
    });

    /*
    window.socket = io.connect('http://imakarov.dv.rbc.ru:8080');
    socket.on('update', function (data) {
        //console.log(data);
        game.updateCraft(data);
        //document.write(data+'<br/>');
        //socket.emit('my other event', { my: 'data' });
    });
    socket.on('update_rocket', function (data) {
        game.updateRocket(data);
    });
    */
}