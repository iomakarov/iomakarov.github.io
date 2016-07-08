/**
 * Created with JetBrains PhpStorm.
 * User: imakarov
 * Date: 02.04.13
 * Time: 14:44
 * To change this template use File | Settings | File Templates.
 */
var game = (function() {
    var stats, scene, camera, renderer;
    var cube_1, cube_2, cube_3, cube_4;
    var mesh = [];
    var count = 500;
    function init() {
        // FPS
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        document.body.appendChild( stats.domElement );

        // camera
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 500;

        // scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.001 );

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
        /*
         var geometry = new THREE.Geometry()
         geometry.vertices.push( new THREE.Vector3( 0,  10, 0 ) );
         geometry.vertices.push( new THREE.Vector3( -10, -10, 0 ) );
         geometry.vertices.push( new THREE.Vector3(  10, -10, 0 ) );
         geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
         var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        */

        var geometry = new THREE.SphereGeometry( 20, 20, 20 );  // CUBE
        var material =  new THREE.MeshLambertMaterial( { color:0xFFFF00, shading: THREE.FlatShading } );
        cube_1 = new THREE.Mesh(geometry, material);
        cube_1.position.x = 100;
        cube_1.rotation.z = 0;
        scene.add(cube_1);

        for ( var i = 0; i < count; i ++ ) {
            var material =  new THREE.MeshLambertMaterial( { color:Math.random()*0xFFFFFF<<0, shading: THREE.FlatShading } );
            mesh[i] = new THREE.Mesh( geometry, material );
            mesh[i].position.x = ( Math.random() - 0.5 ) * 1000;
            mesh[i].position.y = ( Math.random() - 0.5 ) * 1000;
            mesh[i].position.z = ( Math.random() - 0.5 ) * 1000;
            mesh[i].rotation.z = 0;
            //mesh[i].updateMatrix();
            //mesh[i].matrixAutoUpdate = false;
            scene.add( mesh[i] );
        }
    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        render();
        stats.update();
    }

    function render() {
        renderCube();
    }
    function renderCube() {
        //cube_1.position.x += 0.01;
        cube_1.rotation.z += 0.01;
        for ( var i = 0; i < count; i ++ ) {
            mesh[i].rotation.z += 0.01;
        }
        renderer.render(scene, camera);
    }

    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        //effect.setSize( window.innerWidth, window.innerHeight );
    }

    return {
         init:init
        ,start:start
    }

})();
game.init();
game.start();

