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
    this.active = pars.active;
    this.mng = 0.1;
    this.mmng = 0.2;
    this.tth = {
        xcm:0,
        ycm:0,
        Iz:0,
        M:0,
        en:[
            {
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
                x:-100*this.mng,
                y:-100*this.mng,
                
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
                x:100*this.mng,
                y:-100*this.mng,

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

    this.draw   = function() { 
        var a = 40;
        var b = 20;
        with ( this.c2d ) {
            save();
                with ( this.tth ) {
                	translate(game.getVar('X0'),game.getVar('Y0'));
                    translate(this.pmmd.x,this.pmmd.y);
                    rotate(-this.pmmd.u);
                    translate(xcm,ycm);
                    lineWidth 	= 2;
                    lineCap 	= 'round';
                    //strokeStyle = '#09f';
                    strokeStyle = this.active?'green':'red';
                    /* center M */
                    beginPath();
                        moveTo(-xcm,-ycm);
                        lineTo(-xcm+1,-ycm+1);
                        closePath();
                    stroke();
                    /* craft body */
                    strokeRect(-rc,-lc/2,2*rc,lc);
                    /* engines */
                    var endata=[];
                    for (var i=0;i<en.length;i++) {
                        save();
                                endata[i]={};
                                endata[i].x=en[i].x;
                                endata[i].y=en[i].y;
                                endata[i].u=en[i].u;
                            translate(en[i].x,en[i].y);
                            rotate(-en[i].u);
                            fillStyle   = "rgb(0,200,0)";
                            /* engine gas */
                            if (en[i].pw) fillRect(-en[i].d/2,en[i].l*(-en[i].pw/en[i].pwmax/2-1/2),en[i].d,en[i].l*(en[i].pw/en[i].pwmax)/2);
                            /* engine body */
                            strokeRect(-en[i].d/2,-en[i].l/2,en[i].d,en[i].l);
                            /* soplo */
                            strokeStyle = 'rgb(200,0,0)';
                            beginPath();
                                moveTo(-en[i].d/2,-en[i].l/2);
                                lineTo(+en[i].d/2,-en[i].l/2);
                                closePath();
                            stroke();
                        restore();
                    }
                    //console.log(xcm,ycm);
                    /*
                     * From draw to engine.game.js
                    if(this.active)
                        socket.emit('onchange',{x:this.pmmd.x,y:this.pmmd.y,
                        u:this.pmmd.u,en:endata});
                    */
                } 
            restore();
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
                    res.Vx = (Px)/M;// -0.5;
                    res.Vy = (Py)/M;//-9.81/10;                    
                    res.wz = (Mz)/Iz;
                    res.x  = pars.Vx;
                    res.y  = pars.Vy;
                    res.u  = pars.wz; 
                }
            }        
        return res;
    }
}
