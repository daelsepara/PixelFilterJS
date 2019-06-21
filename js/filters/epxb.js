// SNES9x's EPX (variant B) modified by Hawkynt to support thresholds
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

                var c0 = Common.CLR(Input, srcx, srcy, x, y, -1, -1);
                var c1 = Common.CLR(Input, srcx, srcy, x, y, 0, -1);
                var c2 = Common.CLR(Input, srcx, srcy, x, y, 1, -1);
                var c3 = Common.CLR(Input, srcx, srcy, x, y, -1, 0);
                var c4 = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var c5 = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                var c6 = Common.CLR(Input, srcx, srcy, x, y, -1, 1);
                var c7 = Common.CLR(Input, srcx, srcy, x, y, 0, 1);
                var c8 = Common.CLR(Input, srcx, srcy, x, y, 1, 1);

                P[1] = P[2] = P[3] = P[4] = c4;

                if (Common.IsNotLike(c3, c5) && Common.IsNotLike(c1, c7) && ( // diagonal
                    (Common.IsLike(c4, c3) || Common.IsLike(c4, c7) || Common.IsLike(c4, c5) || Common.IsLike(c4, c1) || ( // edge smoothing
                        (Common.IsNotLike(c0, c8) || Common.IsLike(c4, c6) || Common.IsLike(c4, c2)) && (Common.IsNotLike(c6, c2) || Common.IsLike(c4, c0) || Common.IsLike(c4, c8)))))) {

                    if (Common.IsLike(c1, c3) && (Common.IsNotLike(c4, c0) || Common.IsNotLike(c4, c8) || Common.IsNotLike(c1, c2) || Common.IsNotLike(c3, c6))) {

                        P[1] = Interpolate.Interpolate2P(c1, c3);
                    }

                    if (Common.IsLike(c5, c1) && (Common.IsNotLike(c4, c2) || Common.IsNotLike(c4, c6) || Common.IsNotLike(c5, c8) || Common.IsNotLike(c1, c0))) {

                        P[2] = Interpolate.Interpolate2P(c5, c1);
                    }

                    if (Common.IsLike(c3, c7) && (Common.IsNotLike(c4, c6) || Common.IsNotLike(c4, c2) || Common.IsNotLike(c3, c0) || Common.IsNotLike(c7, c8))) {

                        P[3] = Interpolate.Interpolate2P(c3, c7);
                    }

                    if (Common.IsLike(c7, c5) && (Common.IsNotLike(c4, c8) || Common.IsNotLike(c4, c0) || Common.IsNotLike(c7, c6) || Common.IsNotLike(c5, c2))) {

                        P[4] = Interpolate.Interpolate2P(c7, c5);
                    }
                }

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }

            current++;

            notify({ ScalingProgress: current / total });
        }
    }
}