/**
 * @author Makarov Igor 2012 craft.iomakarov.com
 * @description
 */
var planet = function( pars ) {
    this.c2d    = pars.c2d;
    this.pmmd   = {
        t:pars.t || 0,
        x:pars.x || 0,
        y:pars.y || 0,
        r:pars.r || 0,
    }
    this.d = 4;
    this.color = '#ffcc00';
    this.getT = function (xp,yp) {
    	var xt=yt=0;
    	with(Math) {
            var X0 = game.getVar('X0');
            var Y0 = game.getVar('Y0');
            var w = game.getVar('width');
            var h = game.getVar('height');
    		var xc = w/2;
    		var yc = h/2;
    		/*
    		var xc = game.crafts[game.uidCraft].pmmd.x + X0;
    		var yc = game.crafts[game.uidCraft].pmmd.y + Y0;     		
    		*/
    		var a  = atan2(xp-xc,yp-yc);
    		var aw = atan2(w,h);
    		var draw = false;
    		var d = this.d;
    		var drawt = false;
			var l = sqrt(pow(xp-xc,2)+pow(yp-yc,2));
			var lt = sqrt(pow(w/2,2)+pow(h/2,2));
			var da = 0.01;
			if (abs(a - aw) < da) {
				if (l > lt) {
					xt = w-d;
	    			yt = h-d;
	    			draw = true;	
				}
			} else if (abs(a - PI + aw) < da) {
				if (l > lt) {
					xt = w-d;
	    			yt = d;
	    			draw = true;	
				}
			} else if (abs( a + PI - aw ) < da) {
				if (l > lt) {
					xt = d;
	    			yt = d;
	    			draw = true;	
				}
			} else if (abs( a + aw ) < da) {
				if (l > lt) {
					xt = d;
	    			yt = h-d;
	    			draw = true;	
				}
    		} else if ( ( a >= 0 && a < aw ) || ( a < 0 && a > -aw ) ) {
				
    			xt = (xp-xc)/(yp-yc)*h/2;
    			yt = -d;
    			lt = sqrt(pow(xt,2)+pow(h/2,2));
    			if ( l > lt ) {
					xt = w/2 + xt;
        			yt = h + yt;
    				draw = true;	
    			}
			} else if ( a > aw && a <= PI - aw ) {
    			xt = -d;
    			yt = (yp-yc)/(xp-xc)*w/2;
    			lt = sqrt(pow(yt,2)+pow(w/2,2));
    			if ( l > lt ) {
    				xt = w + xt;
            		yt = h/2 + yt;
    				draw = true;
    			}
    		} else if ( ( a > PI - aw && a <= PI ) || ( a > -PI && a < -PI + aw ) ) {
    			xt = (xp-xc)/(yp-yc)*h/2;
    			yt = d;
    			lt = sqrt(pow(xt,2)+pow(h/2,2));
    			if ( l > lt ) {
    				xt = w/2 - xt;
            		yt = yt;
    				draw = true;
    			}
    		} else if ( a > -PI + aw && a < -aw ) {
    			xt = d;
    			yt = (yp-yc)/(xp-xc)*w/2;
    			lt = sqrt(pow(yt,2)+pow(w/2,2));
    			if ( l > lt ) {
    				xt = xt;
            		yt = h/2-yt;	
    				draw = true;
    					
    			}
    		}
    	}
    	return {x:xt,y:yt,draw:draw};
    	
    }
    this.getP12 = function () {
        var X0 = game.getVar('X0');
        var Y0 = game.getVar('Y0');
		
    	var xp = X0 + this.pmmd.x;
		var yp = Y0 + this.pmmd.y;
		
    	with(Math) {
            var w = game.getVar('width');
            var h = game.getVar('height');
        	var xc = w/2;
    		var yc = h/2;
    		/*
    		var xc = game.crafts[game.uidCraft].pmmd.x + X0;
    		var yc = game.crafts[game.uidCraft].pmmd.y + Y0;     		
    		*/   
        	var l = sqrt(pow(xp-xc,2)+pow(yp-yc,2));
        	var r = this.pmmd.r;
        	if ( l > r) {
        		var m = sqrt(pow(l,2)-pow(r,2));
        	} else {
        		return null;
        	}
        	var B = asin(r/l);
        	
        	var A  = atan2(xp-xc,yp-yc);
        	var B1 = A - B;
        	var B2 = A + B;
        	
        	x1 = xc + m*sin(B1);
        	y1 = yc + m*cos(B1);
        	
        	x2 = xc + m*sin(B2);
        	y2 = yc + m*cos(B2);
    	}
    	return {
    		x1:x1,y1:y1,
    		x2:x2,y2:y2
    	}
    }
    
    this.drawT12 = function() {
    	var P = this.getP12();
    	if (P) {
    		var T1 = this.getT(P.x1,P.y1);
        	var T2 = this.getT(P.x2,P.y2);
    		if (T1.draw & T2.draw) {
                var w = game.getVar('width');
                var h = game.getVar('height');
        		var d = this.d;
    			with ( this.c2d ) {
	    			save();  
	    				strokeStyle = this.color;
						beginPath();
                            //shadowBlur = 5;
                            //shadowColor = '#ffe800';
							if (T1.x == T2.x || T1.y == T2.y) {
								moveTo(T1.x,T1.y);
								lineTo(T2.x,T2.y);
							} else if (T1.x < T2.x && T1.y < T2.y) {
								moveTo(T1.x,T1.y);
								lineTo(d,h-d);
								lineTo(T2.x,T2.y);
							} else if (T1.x < T2.x && T1.y > T2.y) {
								moveTo(T1.x,T1.y);
								lineTo(w-d,h-d);
								lineTo(T2.x,T2.y);
							} else if (T1.x > T2.x && T1.y > T2.y) {
								moveTo(T1.x,T1.y);
								lineTo(w-d,d);
								lineTo(T2.x,T2.y);
							} else if (T1.x > T2.x && T1.y < T2.y) {
								moveTo(T1.x,T1.y);
								lineTo(d,d);
								lineTo(T2.x,T2.y);
							}
							lineWidth 	= this.d;
							
						stroke();
					restore();
    			}
    		}
    	}
    }
    this.isCirInSq = function(x,y,r,x1,y1,x2,y2) {
    	//console.log(x,y,r,x1,y1,x2,y2);
    	with (Math) {
	    	if (
	    		( x+r>=x1 && x+r<=x2 && y>=y1 && y<=y2 ) ||
	    		( y+r>=y1 && y+r<=y2 && x>=x1 && x<=x2 ) ||
	    		( pow(x-x1,2)+pow(y-y1,2)<=pow(r,2) ) ||
	    		( pow(x-x2,2)+pow(y-y1,2)<=pow(r,2) ) ||
	    		( pow(x-x1,2)+pow(y-y2,2)<=pow(r,2) ) ||
	    		( pow(x-x2,2)+pow(y-y2,2)<=pow(r,2) )    		
	    	) {
	    		return true;
	    	}
    	}
    	return false;
    }
    this.draw   = function() {
        var X0 = game.getVar('X0');
        var Y0 = game.getVar('Y0');


        with ( this.c2d ) {
        	with (this.pmmd) {
                save();
                	translate(X0,Y0);
                    beginPath();
                        strokeStyle=this.color;
                        //shadowBlur = 5;
                        //shadowColor = '#ffe800';
                        lineWidth 	= this.d;
                		arc(x,y,r,0,Math.PI*2,true);
                	stroke();  	
                restore();
        	}
        }
        with (this.pmmd) {

    		var w = game.getVar('width');
    		var h = game.getVar('height');

        	if (!this.isCirInSq(x,y,r,-X0,-Y0,-X0+w,-Y0+h)){
        		this.drawT12();
        	}
        }
    }
}
