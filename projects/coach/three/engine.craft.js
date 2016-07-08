/**
 * @author Makarov Igor 2012 craft.iomakarov.com
 * @description
 */
var aircraft = function( pars ) {
    this.c2d    = pars.c2d;
    this.pmmd   = {
        t:pars.t || 0,
        x:pars.x || 0,
        y:pars.y || 0,
        u:pars.u || 0,
        
        Vx:pars.Vx || 0,
        Vy:pars.Vy || 0,
        wz:pars.wz || 0        
    }
    this.sceneObject = null
    this.active = pars.active;
    this.mng = 0.2;
    this.mmng = 0.2;
    this.tth = {
        xcm:0,
        ycm:0,
        Iz:0,
        M:0,
        en:[
            {
                group3d:null,
                object3d:null,
                gas3d:null,
                x:-300*this.mng,
                y:150*this.mng,

                d:20*this.mng,
                l:50*this.mng,
                m:50*this.mmng,
                  
                pwmax:100,
                pwb:false,
                pw:0,
                maxdt:100,
                mindt:10,
                
                u:185*Math.PI/180,          
                ub:0
            },
            {
                group3d:null,
                object3d:null,
                gas3d:null,
                x:300*this.mng,
                y:150*this.mng,
                
                d:20*this.mng,
                l:50*this.mng,
                m:50*this.mmng,
                  
                pwmax:100,
                pwb:false,
                pw:0,
                maxdt:100,
                mindt:10,
                
                u:175*Math.PI/180,          
                ub:0
            },
            {
                group3d:null,
                object3d:null,
                gas3d:null,
                x:-100*this.mng,
                y:-140*this.mng,
                
                d:40*this.mng,
                l:100*this.mng,
                m:150*this.mmng,
                  
                pwmax:200,
                pwb:false,
                pw:0,
                maxdt:100,
                mindt:10,
                
                u:0*Math.PI/180,          
                ub:0
            },            
            {
                group3d:null,
                object3d:null,
                gas3d:null,
                x:100*this.mng,
                y:-140*this.mng,

                d:40*this.mng,
                l:100*this.mng,
                m:150*this.mmng,
                  
                pwmax:200,
                pwb:false,
                pw:0,
                maxdt:100,
                mindt:10,
                
                u:0*Math.PI/180,          
                ub:0
            }            
        ],
       
        mc:50*this.mng,
        rc:30*this.mng,
        lc:100*this.mng,      
    }


    with (Math) {
        with (this.tth) {
            this.tth.M = mc;
            for (var i=0;i<en.length;i++) this.tth.M += en[i].m;
            
            var Iz = 1/4*mc*pow(rc,2)+1/12*mc*pow(lc,2);
            for (var i=0;i<en.length;i++) Iz += 1/4*en[i].m*pow(en[i].d/2,2)+1/12*en[i].m*pow(en[i].l,2)+en[i].m*(pow(en[i].x,2)+pow(en[i].y,2));
            
            var sumxm = 0;
            for (var i=0;i<en.length;i++) sumxm += en[i].x*en[i].m;
            this.tth.xcm = -sumxm/this.tth.M;
            var sumym = 0;
            for (var i=0;i<en.length;i++) sumym += en[i].y*en[i].m;
            this.tth.ycm = -sumym/this.tth.M;
            
            this.tth.Iz  = Iz - this.tth.M*(pow(this.tth.xcm,2)+pow(this.tth.ycm,2));
        }
    }
    this.getV = function() {
        with (Math) {
            return sqrt(pow(this.pmmd.Vx,2)+pow(this.pmmd.Vy,2));
        }
    }

    this.getSceneObject = function() {
        with ( this.tth ) {
            this.sceneObject = new THREE.Object3D();//create an empty container
            var geometry = new THREE.CylinderGeometry( 0, 2*rc, lc, 20, 1 );
            var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
            var body = new THREE.Mesh( geometry, material );
            body.position.x = 0;
            body.position.y = 0;
            body.position.z = 0;
            this.sceneObject.add( body );
            for (var i=0;i<en.length;i++) {
                en[i].group3d = new THREE.Object3D();
                en[i].group3d.position.x = en[i].x;
                en[i].group3d.position.y = en[i].y;

                var geometry = new THREE.CylinderGeometry( en[i].d*0.7, en[i].d, en[i].l, 15, 1 );
                var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
                en[i].object3d = new THREE.Mesh( geometry, material );
                en[i].object3d.position.x = 0;
                en[i].object3d.position.y = 0;

                var geometry = new THREE.CylinderGeometry( en[i].d*0.4, en[i].d*0.7, en[i].l*0.9, 15, 1 );
                en[i].gas3d = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color:0xff2400, shading: THREE.FlatShading}));
                en[i].gas3d.position.x = 0;
                en[i].gas3d.position.y = 0;
                en[i].gas3d.rotation.z = -Math.PI;

                en[i].group3d.add( en[i].object3d );
                en[i].group3d.add( en[i].gas3d );
                this.sceneObject.add( en[i].group3d );
            }
            return this.sceneObject;
        }
    }

    this.computation = function() {
        var p0 = this.pmmd;
        var integrationTime 	= 0.1;
        this.pmmd = rgk.step(p0,this,'t',integrationTime );
        this.sceneObject.position.x = this.pmmd.x;
        this.sceneObject.position.y = this.pmmd.y;
        this.sceneObject.rotation.z = -this.pmmd.u;
        with ( this.tth ) {
            for (var i=0;i<en.length;i++) {
                en[i].group3d.rotation.z = -en[i].u;
                en[i].gas3d.position.y = -en[i].l*0.05-(1-(en[i].pwmax-en[i].pw)/en[i].pwmax)*en[i].l*0.9;
            }
        }
    }

    this.mmd = function(pars) {
        var res = [];
            with (Math) {
                with (this.tth) {
                    for (var i=0;i<en.length;i++) {
                        if ( en[i].pwb ) {
                            if ( en[i].pw + en[i].pwmax/en[i].maxdt < en[i].pwmax )
                                en[i].pw += en[i].pwmax/en[i].maxdt;
                            else
                                en[i].pw = en[i].pwmax;
                        } else {
                            if ( en[i].pw - en[i].pwmax/en[i].mindt > 0 )
                                en[i].pw -= en[i].pwmax/en[i].mindt;
                            else
                                en[i].pw = 0;
                        } 
                    }
                    for (var i=0;i<en.length;i++) {
                        if ( en[i].ub > 0 ) {
                            en[i].u += 1*PI/180;
                        } 
                        if ( en[i].ub < 0 ) {
                            en[i].u -= 1*PI/180;
                        }
                    }                       
                    var Psx = 0;
                    var Psy = 0;
                    for (var i=0;i<en.length;i++) {
                        Psx += en[i].pw*sin(en[i].u);
                        Psy += en[i].pw*cos(en[i].u);
                    }
                    var Px = Psx*cos(pars.u)+Psy*sin(pars.u);
                    var Py = -Psx*sin(pars.u)+Psy*cos(pars.u);
                    
                    var Mz = 0;
                    for (var i=0;i<en.length;i++) {
                        Mz += en[i].pw*(en[i].y*sin(en[i].u)-en[i].x*cos(en[i].u));
                    }
                    var G = 6.67384*5;//*pow(10,11);
                    var Me = 5.9736;//*pow(10,24);
                    var Ue = atan2(pars.x,pars.y);
                    var r = sqrt(pow(pars.x,2)+pow(pars.y,2));
                    var Fe = G*M*Me/pow(r,2);
                    res.Vx = (Px)/M - Fe*sin(Ue);
                    res.Vy = (Py)/M - Fe*cos(Ue);
                    res.wz = (Mz)/Iz;
                    res.x  = pars.Vx;
                    res.y  = pars.Vy;
                    res.u  = pars.wz; 
                }
            }        
        return res;
    }
}
