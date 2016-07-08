$(function(){
	function g3(g,t,tp){
        $('img.g1').animate({ opacity: (g==1)?0:1, }, t, "linear");
        $('img.g2').animate({ opacity: (g==1)?1:0, }, t, "linear",function(){ g3((g==1)?0:1,t+tp,tp); });
	}
	g3(1,500,100);
});