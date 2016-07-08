/**
 * @author Makarov Igor 2012 craft.iomakarov.com
 * @description
 */
var game = (function() {
    /* Global game's parameters */
    var c2d;
    var width, height;
    var canvas;
    var integrationTime 	= 0.1;
    var intervalTime 		= 20;
    var SI = null;

    var touchCoords = [];
    var X0 = 0;
    var Y0 = 0;
    var brUniverse 		    = 50;
    var rUniverse 		    = 0;

    /* AirCraft */
    var uidCraft = 'a123';
    var iCraft 	= 0;
    var iRocket = 0;

    var rockets = {};
    var crafts = {};
    var planets = {};

    var countPlanets = 0;
    /* Loading game images */
    var imagesOnload = false;
    var images = [];
    var imagesSrc = {
        bg:'img/back.jpg'
    }

    var imagesCount         = 0;
    var imagesOnloadCount   = 0;

    for ( var key in imagesSrc ) imagesCount++;
    for ( var key in imagesSrc ) {
        images[key] = new Image();
        images[key].onload = function(){
            imagesOnloadCount++;
            if (imagesOnloadCount == imagesCount) imagesOnload = true;
        }
        images[key].src = imagesSrc[key];
    }
    /**
     * Инизиализация игры
     * @param pars
     */
    function init(pars){
        canvas = document.getElementById(pars.id);
        if ( !canvas.getContext ) {
            alert('NO CANVAS');
            return;
        }
        canvas.width   = pars.w || $(window).width();
        canvas.height  = pars.h || $(window).height();
        width = canvas.width;
        height = canvas.height;
        c2d = document.getElementById(pars.id).getContext('2d');
    }

    /**
     * Запуск игры после загрузки всех картинок
     */
    function start() {
        if (imagesOnload == false) {
            setTimeout(function(){ game.start() },500);
        } else {
        	restart();
        }
    }
    /**
     * Пауза в игре
     */
    function stop(){
        clearInterval(SI);
    }

    /**
     * Перезапуск игры
     */
    function restart() {
        _initGameObjects();
        _run();
    }

    /**
     * Установка начальных значений для игры
     * @private
     */
    function _initGameObjects() {
        rUniverse = (width>height)?height:width;
        rUniverse = Math.round(rUniverse/2);
        touchCoords = [
            {x:60,y:height-150,r:50,w:'D'}
            ,{x:width-60,y:height-150,r:50,w:'K'}
            ,{x:150,y:height-60,r:50,w:'V'}
            ,{x:width-150,y:height-60,r:50,w:'N'}
            ,{x:width-260,y:height-60,r:50,w:'Space'}
        ];

        countPlanets = 0;
        iCraft = 0;
        iRocket = 0;
        X0 = 0;
        Y0 = 0;

        crafts[uidCraft] = new aircraft({
            c2d:c2d,
            x:width/2,
            y:height/2,
            u:0*Math.PI/180,
            active:false // SOCETS TRUE
        });
        _addStartPlanets();
        _setControls();
    }

    /**
     * Начать игру
     * @private
     */
    function _run(){
        c2d.globalCompositeOperation = 'source-over';
        c2d.setTransform(1, 0, 0, -1, 0, height);
        clearInterval(SI);
        SI = setInterval(function(){ repeat(); },intervalTime);
    }
    /**
     * Добавление планеты на экран
     * @private
     */
    function _addPlanet(){
        var x=y=r=0;
        var w = width;
        var h = height;
        var pmmd = crafts[uidCraft].pmmd;


        var x = pmmd.x;
        var y = pmmd.y;
        with (Math) {
            x = x + (random()<0.5?-1:+1)*(0.25+1*random())*w;
            y = y + (random()<0.5?-1:+1)*(0.25+1*random())*h;
            r = 100 + 100*random();
        }
        planets[iRocket] = new planet({
            c2d:c2d,
            x:x,
            y:y,
            r:r
        });
        iRocket++;
    }

    /**
     * Добавление планет на экран
     * @private
     */
    function _addStartPlanets(){
        for (var i=0;i<10;i++) {
            _addPlanet();
        }
    }

    /**
     * Запуск ракеты
     * @private
     */
    function _runRocket(){
        iRocket++;
        var pmmd = crafts[uidCraft].pmmd;
    	rockets[iRocket]=new rocket({
            rocket_id:iRocket,
            c2d:c2d,
            x:pmmd.x,
            y:pmmd.y,
            u:pmmd.u,
            Vx:pmmd.Vx,
            Vy:pmmd.Vy,
            Vz:pmmd.Vz,
            wz:pmmd.wz,
            active:false // SOCETS TRUE
        });
    }

    /**
     * Проверка на попадание ракеты в планету ( планета уничтожаются, ракета летит дальше, хыхыхы )
     * и планеты в корабль (игра перезапускается)
     *
     * @private
     */
    function _updatePlanets() {
    	for(var i in rockets){
        	var pmmd = rockets[i].pmmd;
	    	var x = pmmd.x;
	    	var y = pmmd.y;
	    	for(var j in planets){
	    		var p = planets[j].pmmd;
	    		with (Math) {
	    			if (pow(p.x-x,2)+pow(p.y-y,2)<=pow(p.r,2)) {
	        			delete planets[j];
                        countPlanets++;
	        			addPlanet();
	        		}	
	    		}
	    	}
    	}
    	var pmmd = crafts[uidCraft].pmmd;
    	var x = pmmd.x;
    	var y = pmmd.y;
    	for(var j in planets){
    		var p = planets[j].pmmd;
    		with (Math) {
    			if (pow(p.x-x,2)+pow(p.y-y,2)<=pow(p.r,2)) {
    				restart();
        		}	
    		}
    	}
    }
    
    function repeat() {
        _reck();
        _updatePlanets();
        _clear();
        _draw();
    }

    /**
     * Заливка фона.
     */
    function _clear() {
        with (c2d) {
        	save();
	            clearRect(0,0,canvas.width,canvas.height);
                var iw = images['bg'].width;
                var ih = images['bg'].height;
                var cw = Math.round(width/iw);
                var ch = Math.round(height/ih);
                for (var i=-1;i<cw+2;i++) {
                    for (var j=-1;j<ch+2;j++) {
                        drawImage(images['bg'],iw*i+X0 % iw,ih*j+Y0 % ih);
                    }
                }
            restore();
        }
    }

    /**
     * Расчет параметров движения.
     */
    function _reck(){
    	for(var i in crafts){
    		 var p0 = crafts[i].pmmd;
    		 crafts[i].pmmd = rgk.step(p0,crafts[i],'t',integrationTime );

    	}
        _autoPosition(crafts[uidCraft]);
        for(var i in rockets){
        	var p0 = rockets[i].pmmd;
            rockets[i].pmmd = rgk.step(p0,rockets[i],'t',integrationTime );
            if ( rockets[i].pmmd.t > 20 ) {
                delete rockets[i];
            }
        }
    }

    /**
     * Изменение положения системы координат
     * в случае вылета корабля за круг
     * для достижения эффекта движения вселенной.
     *
     * @param craft
     * @private
     */
    function _autoPosition(craft) {
        var x = craft.pmmd.x;
        var y = craft.pmmd.y;
        with (Math) {
            var xc = round(width/2);
            var yc = round(height/2);
            var r = rUniverse-brUniverse;
            var xxc = X0+x-xc;
            var yyc = Y0+y-yc;
            if (pow(xxc,2)+pow(yyc,2) > pow(r,2))
            {
                var l = sqrt(pow(xxc,2)+pow(yyc,2));
                var dX = (l)?xxc*(1-r/l):0;
                var dY = (l)?yyc*(1-r/l):0;
                X0 -= dX;
                Y0 -= dY;
            }
        }
    }

    /**
     * Отрисовка объектов игры на экране
     */
    function _draw(){
        _drawCraft();
        _drawRockets();
        _drawPlanets();
        _drawGameInfo();
        _drawTouch();
        _drawGalaxyCircle();
    }
    function _drawRockets(){
        for(var i in rockets){
            rockets[i].draw();
        }
    }
    function _drawPlanets(){
        for(var i in planets){
            planets[i].draw();
        }
    }
    function _drawCraft(){
        for(var i in crafts){
            crafts[i].draw();
        }
    }
    function _drawGameInfo(){
        with (c2d) {
            save();
            setTransform(1, 0, 0, 1, 0, 0);
            save();
            globalAlpha = 0.5;
            fillStyle = "#dc143c";
            strokeStyle = '#dc143c';
            lineWidth 	= 2;
            fillRect(20,20,130,65);
            strokeRect(20,20,130,65);
            restore();
            fillStyle = 'white';
            font = 'italic bold 20px sans-serif';
            textBaseline = 'bottom';
            var v = Math.round(crafts[uidCraft].getV());
            var p = countPlanets;
            fillText('Points: '+p, 30, 50);
            fillText('Speed: '+v, 30, 80);
            restore();
        }
    }
    function _drawTouch(){
        with (c2d) {
            save();
            setTransform(1, 0, 0, 1, 0, 0);
            for (var i=0;i<touchCoords.length;i++) {
                save();
                globalAlpha = 0.5;
                fillStyle = "#dc143c";
                strokeStyle = '#dc143c';
                lineWidth 	= 2;
                beginPath();
                arc(touchCoords[i].x,touchCoords[i].y,touchCoords[i].r,0,Math.PI*2,true);
                fill();
                stroke();
                restore();
                save();
                fillStyle = 'white';
                font = 'italic bold 30px sans-serif';
                var x = touchCoords[i].x -13;
                var y = touchCoords[i].y + 10;
                if (touchCoords[i].w.length>1) {
                    x = touchCoords[i].x-12*(touchCoords[i].w.length/2+1)-3;
                }
                fillText(touchCoords[i].w, x, y);
                restore();
            }
            restore();
        }
    }

    function _drawGalaxyCircle(){
        with (c2d) {
            var xc = Math.round(width/2);
            var yc = Math.round(height/2);
            var r = rUniverse-brUniverse;
            save();
                translate(xc,yc);
                beginPath();
                    /* Создаем градиент */
                    var grad = createLinearGradient(0,0,r,r);
                    grad.addColorStop(0.0,'#8a3324');
                    grad.addColorStop(1.0,'#45161c');
                    strokeStyle=grad;
                    // Тормозит капец с тенями
                    //shadowBlur = 10;
                    //shadowColor = '#45161c';
                    lineWidth 	= 5;
                    arc(0,0,r,0,Math.PI*2,true);
                stroke();
            restore();
        }
    }

    /**
     * Установка элементов управления
     * @private
     */
    function _setControls()
    {
        var en0 = {down:function (){crafts[uidCraft].tth.en[0].pwb = true;}, up:function (){crafts[uidCraft].tth.en[0].pwb = false;}};
        var en1 = {down:function (){crafts[uidCraft].tth.en[1].pwb = true;}, up:function (){crafts[uidCraft].tth.en[1].pwb = false;}};
        var en2 = {down:function (){crafts[uidCraft].tth.en[2].pwb = true;}, up:function (){crafts[uidCraft].tth.en[2].pwb = false;}};
        var en3 = {down:function (){crafts[uidCraft].tth.en[3].pwb = true;}, up:function (){crafts[uidCraft].tth.en[3].pwb = false;}};
        var rk  = {down:function (){}, up:function (){_runRocket();}};

        control.setKeybourd(32,rk);

        control.setKeybourd(68,en0);
        control.setKeybourd(75,en1);
        control.setKeybourd(86,en2);
        control.setKeybourd(78,en3);

        control.setKeybourd(38,{down:function (){crafts[uidCraft].tth.en[0].ub = 1; crafts[uidCraft].tth.en[1].ub = -1;}, up:function (){crafts[uidCraft].tth.en[0].ub = 0; crafts[uidCraft].tth.en[1].ub = 0;}});
        control.setKeybourd(40,{down:function (){crafts[uidCraft].tth.en[0].ub = 1; crafts[uidCraft].tth.en[1].ub = -1;}, up:function (){crafts[uidCraft].tth.en[0].ub = 0; crafts[uidCraft].tth.en[1].ub = 0;}});
        control.setKeybourd(37,{down:function (){crafts[uidCraft].tth.en[2].ub = -1; crafts[uidCraft].tth.en[3].ub = 1;}, up:function (){crafts[uidCraft].tth.en[2].ub = 0; crafts[uidCraft].tth.en[3].ub = 0;}});
        control.setKeybourd(39,{down:function (){crafts[uidCraft].tth.en[2].ub = 1; crafts[uidCraft].tth.en[3].ub = -1;}, up:function (){crafts[uidCraft].tth.en[2].ub = 0; crafts[uidCraft].tth.en[3].ub = 0;}});

        control.setTouch(touchCoords[0],en0);
        control.setTouch(touchCoords[1],en1);
        control.setTouch(touchCoords[2],en2);
        control.setTouch(touchCoords[3],en3);
        control.setTouch(touchCoords[4],rk);

        canvas.setAttribute('ontouchstart','control.touchStart(event)');
        canvas.setAttribute('ontouchmove','control.touchMove(event)');
        canvas.setAttribute('ontouchend','control.touchEnd(event)');
    }


    /**
     * Функция для доступа к данным Игры из вне
     * @param v
     * @return {*}
     */
    function getVar(v)
    {
        switch (v){
            case 'X0': return X0; break;
            case 'Y0': return Y0; break;
            case 'width': return width; break;
            case 'height': return height; break;
        }
        return null;
    }
    return {
         init:init
        ,start:start
        ,stop:stop
        ,getVar:getVar
    }
})();
/* End Game Engine */
