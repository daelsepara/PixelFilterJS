// FNES' Super 2x Scaling
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = 2;
			
        Init.Init(srcx, srcy, scale, scale, threshold);

        var P = Array(5);
        
        P.fill(0);

        var total = srcy;
        var current = 0;
        
        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var n = Common.CLR(Input, srcx, srcy, x, y, 0, -1);
                var w = Common.CLR(Input, srcx, srcy, x, y, -1, 0);
                var c = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var e = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                var s = Common.CLR(Input, srcx, srcy, x, y, 0, 1);

                var cw = Interpolate.Mixpal(c, w);
                var ce = Interpolate.Mixpal(c, e);

                P[1] = (((Common.IsLike(w, n)) && (Common.IsNotLike(n, e)) && (Common.IsNotLike(w, s))) ? w : cw);
                P[2] = (((Common.IsLike(n, e)) && (Common.IsNotLike(n, w)) && (Common.IsNotLike(e, s))) ? e : ce);
                P[3] = (((Common.IsLike(w, s)) && (Common.IsNotLike(w, n)) && (Common.IsNotLike(s, e))) ? w : cw);
                P[4] = (((Common.IsLike(s, e)) && (Common.IsNotLike(w, s)) && (Common.IsNotLike(n, e))) ? e : ce);

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }

            current++;

            notify({ScalingProgress: current / total});
        }
    }
}