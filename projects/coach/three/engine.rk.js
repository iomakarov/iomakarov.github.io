/**
 * @author Makarov Igor 2012 craft.iomakarov.com
 * @description
 */
rgk = (function() {
    function _amSum(m1,m2,not) {
        var not = not || null;
        var res = [];
        for ( var id in m1 ) {
            if ( ( not == null ) || ( id != not ) ) {
                res[id] = m1[id] + m2[id];
            }
        }
        return res;
    }
    function _amMultNum(m1,num,not) {
        var not = not || null;
        var res = [];
        for ( var id in m1 ) {
            if ( ( not == null ) || ( id != not ) ) {
                res[id] = m1[id] * num;
            }
        }
        return res;
    }
    function step(pars,obj,t,dt) {
        var res     = [];
        var V1		= pars;
        var C1		= _amMultNum(obj.mmd(V1),dt,t);

        var V2		= _amSum(V1,_amMultNum(C1,0.5,t),t);
        V2[t]   = V1[t] + dt/2;
        var C2		= _amMultNum(obj.mmd(V2),dt,t);

        var V3		= _amSum(V1,_amMultNum(C2,0.5,t),t);
        V3[t] = V1[t] + dt/2;
        var C3		= _amMultNum(obj.mmd(V3),dt,t);

        var V4		= _amSum(V1,C3,t);
        V4[t] = V1[t] + dt;
        var C4		= _amMultNum(obj.mmd(V4),dt,t);

        var res =	_amSum(	V1,_amMultNum( _amSum( C1, _amSum( C4, _amMultNum( _amSum(C2,C3,t),2, t),t),t),1/6,t),t);
        res[t] = V1[t] + dt;
        return res;
    }
    return {
        step:step
    }
})();