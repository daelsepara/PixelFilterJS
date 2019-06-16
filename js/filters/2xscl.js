// FNES' 2x Scaling (wiithout palette mixing)
class Filter {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = 2;
			
        Init.Init(srcx, srcy, scale, scale, threshold);

        var P = Array(5);
        
        P.fill(0);

        var total = srcy;
        var current = 0;
        
        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var n = Common.CLRA(Input, srcx, srcy, x, y, 0, -1);
                var w = Common.CLRA(Input, srcx, srcy, x, y, -1, 0);
                var c = Common.CLRA(Input, srcx, srcy, x, y, 0, 0);
                var e = Common.CLRA(Input, srcx, srcy, x, y, 1, 0);
                var s = Common.CLRA(Input, srcx, srcy, x, y, 0, 1);

                P[1] = (((Common.IsLike(w, n)) && (Common.IsNotLike(n, e)) && (Common.IsNotLike(w, s))) ? w : c);
                P[2] = (((Common.IsLike(n, e)) && (Common.IsNotLike(n, w)) && (Common.IsNotLike(e, s))) ? e : c);
                P[3] = (((Common.IsLike(w, s)) && (Common.IsNotLike(w, n)) && (Common.IsNotLike(s, e))) ? w : c);
                P[4] = (((Common.IsLike(s, e)) && (Common.IsNotLike(w, s)) && (Common.IsNotLike(n, e))) ? e : c);

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }

            current++;

            notify({ScalingProgress: current / total});
        }
    }
}