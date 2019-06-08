// DES filters from FNES
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(1, Math.min(2, scale));
        
        var Channels = 4;

        Init.Init(srcx, srcy, scale, scale, false);

        var P = Array(5);
        
        P.fill(0);

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var n = Common.CLR(Input, srcx, srcy, x, y, 0, -1);
                var w = Common.CLR(Input, srcx, srcy, x, y, -1, 0);
                var c = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var e = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                var s = Common.CLR(Input, srcx, srcy, x, y, 0, 1);
                var se = Common.CLR(Input, srcx, srcy, x, y, 1, 1);
                    
                switch(scale) {

                    case 2:

                        var d1 = (((Common.IsLike(w, n)) && (Common.IsNotLike(n, e)) && (Common.IsNotLike(w, s))) ? w : c);
                        var d2 = (((Common.IsLike(n, e)) && (Common.IsNotLike(n, w)) && (Common.IsNotLike(e, s))) ? e : c);
                        var d3 = (((Common.IsLike(w, s)) && (Common.IsNotLike(w, n)) && (Common.IsNotLike(s, e))) ? w : c);
                        var d4 = (((Common.IsLike(s, e)) && (Common.IsNotLike(w, s)) && (Common.IsNotLike(n, e))) ? e : c);
    
                        var ce = Interpolate.Interpolate2P2Q(c, e, 3, 1);
                        var cs = Interpolate.Interpolate2P2Q(c, s, 3, 1);
                        var cse = Interpolate.Interpolate2P2Q(c, se, 3, 1);
    
                        P[1] = Interpolate.Interpolate2P2Q(d1, c, 3, 1);
                        P[2] = Interpolate.Interpolate2P2Q(d2, ce, 3, 1);
                        P[3] = Interpolate.Interpolate2P2Q(d3, cs, 3, 1);
                        P[4] = Interpolate.Interpolate2P2Q(d4, cse, 3, 1);
    
                        for (var Pixel = 1; Pixel < 5; Pixel++) {

                            Common.Write4RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }

                        break;

                    default:

                        var p0 = (((Common.IsLike(w, n)) && (Common.IsNotLike(n, e)) && (Common.IsNotLike(w, s))) ? w : c);
                        var p1 = (((Common.IsLike(n, e)) && (Common.IsNotLike(n, w)) && (Common.IsNotLike(e, s))) ? e : c);
                        var p2 = (((Common.IsLike(w, s)) && (Common.IsNotLike(w, n)) && (Common.IsNotLike(s, e))) ? w : c);
                        var p3 = (((Common.IsLike(s, e)) && (Common.IsNotLike(w, s)) && (Common.IsNotLike(n, e))) ? e : c);
    
                        var d = Interpolate.Interpolate4P(p0, p1, p2, p3);
                        
                        var index = (y * srcx + x) * Channels;
    
                        Common.ScaledImage[index] = Common.Red(d);
                        Common.ScaledImage[index + 1] = Common.Green(d);
                        Common.ScaledImage[index + 2] = Common.Blue(d);

                        break;

                }
            }
        }
    }
}