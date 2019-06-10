// FNES' Ultra 2x Scaling
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = 2;
        
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

                var cx = c;
                var wx = w;
                var ex = e;

                var cw = Interpolate.Mixpal(cx, w);
                var ce = Interpolate.Mixpal(cx, e);

                P[1] = (((Common.IsLike(w, n)) && (Common.IsNotLike(n, e)) && (Common.IsNotLike(w, s))) ? wx : cw);
                P[2] = (((Common.IsLike(n, e)) && (Common.IsNotLike(n, w)) && (Common.IsNotLike(e, s))) ? ex : ce);
                P[3] = (((Common.IsLike(w, s)) && (Common.IsNotLike(w, n)) && (Common.IsNotLike(s, e))) ? wx : cw);
                P[4] = (((Common.IsLike(s, e)) && (Common.IsNotLike(w, s)) && (Common.IsNotLike(n, e))) ? ex : ce);

                P[1] = Interpolate.Unmix(P[1], cx);
                P[2] = Interpolate.Unmix(P[2], cx);
                P[3] = Interpolate.Unmix(P[3], cx);
                P[4] = Interpolate.Unmix(P[4], cx);

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }
        }
    }
}