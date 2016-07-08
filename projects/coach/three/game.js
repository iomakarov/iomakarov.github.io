/**
 * Created with JetBrains PhpStorm.
 * User: imakarov
 * Date: 02.04.13
 * Time: 14:44
 * To change this template use File | Settings | File Templates.
 */
var game = (function() {
    var stats, scene, camera, renderer;
    var mesh = [];
    var count = 100;

    /* AirCraft */
    var uidCraft = 'myID';
    var iCraft 	= 0;
    var crafts = {};

    function init() {
        // FPS
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        document.body.appendChild( stats.domElement );

        // camera
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z = 1000;

        // scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0x000000, 0.00003 );

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColor( scene.fog.color, 1 );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(renderer.domElement);

        // controls
        controls = new THREE.OrbitControls( camera );
        controls.addEventListener( 'change', render );

        // lights
        sceneAddLights();

        //add Objects
        sceneAddObjects();

        // Controls
        _setControls()
    }

    function start() {
        animate();
    }

    function sceneAddLights() {
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );
    }

    function sceneAddObjects() {
        //craft
        crafts[uidCraft] = new aircraft({
            x:500,
            y:0,
            u:0*Math.PI/180,
            active:false
        });
        var craftScene = crafts[uidCraft].getSceneObject();
        scene.add(craftScene);
/*
        //balls
        var geometry = new THREE.SphereGeometry( 20, 50, 50 );  // CUBE
        var material =  new THREE.MeshLambertMaterial( { color:0xFFFF00, shading: THREE.FlatShading } );
        for ( var i = 0; i < count; i ++ ) {
            var material =  new THREE.MeshLambertMaterial( { color:Math.random()*0xFFFFFF<<0, shading: THREE.FlatShading } );
            mesh[i] = new THREE.Mesh( geometry, material );
            mesh[i].position.x = (Math.random()<0.5?-1:+1)*(0.1+1*Math.random())*1000;
            mesh[i].position.y = (Math.random()<0.5?-1:+1)*(0.1+1*Math.random())*1000;
            //mesh[i].position.z = ( Math.random() - 0.5 ) * 1000;
            mesh[i].rotation.z = 0;
            //mesh[i].updateMatrix();
            //mesh[i].matrixAutoUpdate = false;
            scene.add( mesh[i] );
        }
*/

        // earth
        var earthTexture = new THREE.Texture();
        var loader = new THREE.ImageLoader();
        loader.addEventListener( 'load', function ( event ) {
            earthTexture.image = event.content;
            earthTexture.needsUpdate = true;
        } );
        loader.load( 'land_ocean_ice_cloud_2048.jpg' );
        var geometry = new THREE.SphereGeometry( 150, 20, 20 );
        var material = new THREE.MeshBasicMaterial( { map: earthTexture, overdraw: true } );
        var earth = new THREE.Mesh( geometry, material );
        scene.add( earth );

        // stars
        var radius = 1;
        var countStars = 1000;
        var starsGeometry = new THREE.Geometry();
        for ( i = 0; i < countStars; i ++ ) {
            var vertex = new THREE.Vector3();
            var minR=0.2;
            var maxR=0.5;
            while (
                Math.sqrt(Math.pow(vertex.x,2)+Math.pow(vertex.y,2)+Math.pow(vertex.z,2)) < minR ||
                Math.sqrt(Math.pow(vertex.x,2)+Math.pow(vertex.y,2)+Math.pow(vertex.z,2)) > maxR
                ){
                vertex.x = Math.random()-0.5;
                vertex.y = Math.random()-0.5;
                vertex.z = Math.random()-0.5;
            }

            vertex.multiplyScalar( radius );
            starsGeometry.vertices.push( vertex );
        }
        var starsMaterials = new THREE.ParticleBasicMaterial({color: 0xFFFFFF});
        var stars = new THREE.ParticleSystem( starsGeometry, starsMaterials );
        var s = 100000;
        stars.scale.set( s, s, s );
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
        scene.add( stars );
    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        computation();
        render();
        stats.update();
    }
    function computation() {
        crafts[uidCraft].computation();
    }
    function render() {
        renderer.render(scene, camera);
    }

    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        //effect.setSize( window.innerWidth, window.innerHeight );
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
        //var rk  = {down:function (){}, up:function (){_runRocket();}};

        //control.setKeybourd(32,rk);

        control.setKeybourd(68,en0);
        control.setKeybourd(75,en1);
        control.setKeybourd(86,en2);
        control.setKeybourd(78,en3);

        control.setKeybourd(38,{down:function (){crafts[uidCraft].tth.en[0].ub = 1; crafts[uidCraft].tth.en[1].ub = -1;}, up:function (){crafts[uidCraft].tth.en[0].ub = 0; crafts[uidCraft].tth.en[1].ub = 0;}});
        control.setKeybourd(40,{down:function (){crafts[uidCraft].tth.en[0].ub = 1; crafts[uidCraft].tth.en[1].ub = -1;}, up:function (){crafts[uidCraft].tth.en[0].ub = 0; crafts[uidCraft].tth.en[1].ub = 0;}});
        control.setKeybourd(37,{down:function (){crafts[uidCraft].tth.en[2].ub = -1; crafts[uidCraft].tth.en[3].ub = 1;}, up:function (){crafts[uidCraft].tth.en[2].ub = 0; crafts[uidCraft].tth.en[3].ub = 0;}});
        control.setKeybourd(39,{down:function (){crafts[uidCraft].tth.en[2].ub = 1; crafts[uidCraft].tth.en[3].ub = -1;}, up:function (){crafts[uidCraft].tth.en[2].ub = 0; crafts[uidCraft].tth.en[3].ub = 0;}});
/*
        control.setTouch(touchCoords[0],en0);
        control.setTouch(touchCoords[1],en1);
        control.setTouch(touchCoords[2],en2);
        control.setTouch(touchCoords[3],en3);
        control.setTouch(touchCoords[4],rk);

        canvas.setAttribute('ontouchstart','control.touchStart(event)');
        canvas.setAttribute('ontouchmove','control.touchMove(event)');
        canvas.setAttribute('ontouchend','control.touchEnd(event)');
*/
    }
    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
         init:init
        ,start:start
    }

})();

window.onload = function() {
    game.init();
    game.start();
}


