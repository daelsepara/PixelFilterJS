// Bilinear+ with Gamma adjustment
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

                var c00 = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var c01 = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                var c10 = Common.CLR(Input, srcx, srcy, x, y, 0, 1);
                var c11 = Common.CLR(Input, srcx, srcy, x, y, 1, 1);

                var gamma = Interpolate.Interpolate3P3Q(c00, c01, c10, 10, 2, 2);

                var r = Common._Clip8((Common.Red(gamma) * 14) >> 4);
                var g = Common._Clip8((Common.Green(gamma) * 14) >> 4);
                var b = Common._Clip8((Common.Blue(gamma) * 14) >> 4);

                P[1] = Common.RGBINT(r, g, b);
                P[2] = Interpolate.Interpolate2P(c00, c01);
                P[3] = Interpolate.Interpolate2P(c00, c10);
                P[4] = Interpolate.Interpolate4P(c00, c01, c10, c11);

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }

            current++;

            notify({ScalingProgress: current / total });
        }
    }
}