// Kreed's SuperSaI
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = 2;

        scale = Math.max(2, Math.min(3, scale));

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
                var d3 = Common.CLR(Input, srcx, srcy, x, y, 2, -1);
                var c3 = Common.CLR(Input, srcx, srcy, x, y, -1, 0);
                var c4 = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var c5 = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                var d4 = Common.CLR(Input, srcx, srcy, x, y, 2, 0);
                var c6 = Common.CLR(Input, srcx, srcy, x, y, -1, 1);
                var c7 = Common.CLR(Input, srcx, srcy, x, y, 0, 1);
                var c8 = Common.CLR(Input, srcx, srcy, x, y, 1, 1);
                var d5 = Common.CLR(Input, srcx, srcy, x, y, 2, 1);
                var d0 = Common.CLR(Input, srcx, srcy, x, y, -1, 2);
                var d1 = Common.CLR(Input, srcx, srcy, x, y, 0, 2);
                var d2 = Common.CLR(Input, srcx, srcy, x, y, 1, 2);
                var d6 = Common.CLR(Input, srcx, srcy, x, y, 2, 2);

                P[1] = P[2] = P[3] = P[4] = c4;

                if (Common.IsLike(c7, c5) && Common.IsNotLike(c4, c8)) {

                    var c57 = Interpolate.Interpolate2P(c7, c5);
                    P[4] = c57;
                    P[2] = c57;

                } else if (Common.IsLike(c4, c8) && Common.IsNotLike(c7, c5)) {

                    //nothing

                } else if (Common.IsLike(c4, c8) && Common.IsLike(c7, c5)) {

                    var c57 = Interpolate.Interpolate2P(c7, c5);
                    var c48 = Interpolate.Interpolate2P(c4, c8);
                    var conc2D = 0;

                    conc2D += Kreed.Conc2D(c57, c48, c6, d1);
                    conc2D += Kreed.Conc2D(c57, c48, c3, c1);
                    conc2D += Kreed.Conc2D(c57, c48, d2, d5);
                    conc2D += Kreed.Conc2D(c57, c48, c2, d4);

                    if (conc2D > 0) {

                        P[4] = c57;
                        P[2] = c57;

                    } else if (conc2D == 0) {

                        P[4] = Interpolate.Interpolate2P(c48, c57);
                        P[2] = Interpolate.Interpolate2P(c48, c57);
                    }

                } else {

                    if (Common.IsLike(c8, c5) && Common.IsLike(c8, d1) && Common.IsNotLike(c7, d2) && Common.IsNotLike(c8, d0)) {

                        P[4] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate3P(c8, c5, d1), c7, 3, 1);

                    } else if (Common.IsLike(c7, c4) && Common.IsLike(c7, d2) && Common.IsNotLike(c7, d6) && Common.IsNotLike(c8, d1)) {

                        P[4] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate3P(c7, c4, d2), c8, 3, 1);

                    } else {

                        P[4] = Interpolate.Interpolate2P(c7, c8);
                    }

                    if (Common.IsLike(c5, c8) && Common.IsLike(c5, c1) && Common.IsNotLike(c5, c0) && Common.IsNotLike(c4, c2)) {

                        P[2] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate3P(c5, c8, c1), c4, 3, 1);

                    } else if (Common.IsLike(c4, c7) && Common.IsLike(c4, c2) && Common.IsNotLike(c5, c1) && Common.IsNotLike(c4, d3)) {

                        P[2] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate3P(c4, c7, c2), c5, 3, 1);

                    } else {

                        P[2] = Interpolate.Interpolate2P(c4, c5);
                    }
                }

                if (Common.IsLike(c4, c8) && Common.IsLike(c4, c3) && Common.IsNotLike(c7, c5) && Common.IsNotLike(c4, d2)) {

                    P[3] = Interpolate.Interpolate2P(c7, Interpolate.Interpolate3P(c4, c8, c3));

                } else if (Common.IsLike(c4, c6) && Common.IsLike(c4, c5) && Common.IsNotLike(c7, c3) && Common.IsNotLike(c4, d0)) {

                    P[3] = Interpolate.Interpolate2P(c7, Interpolate.Interpolate3P(c4, c6, c5));

                } else {

                    P[3] = c7;
                }

                if (Common.IsLike(c7, c5) && Common.IsLike(c7, c6) && Common.IsNotLike(c4, c8) && Common.IsNotLike(c7, c2)) {

                    P[1] = Interpolate.Interpolate2P(Interpolate.Interpolate3P(c7, c5, c6), c4);

                } else if (Common.IsLike(c7, c3) && Common.IsLike(c7, c8) && Common.IsNotLike(c4, c6) && Common.IsNotLike(c7, c0)) {

                    P[1] = Interpolate.Interpolate2P(Interpolate.Interpolate3P(c7, c3, c8), c4);
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