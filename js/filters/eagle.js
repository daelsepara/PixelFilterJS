// Eagle nX Family of Filters
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(2, Math.min(3, scale));
			
        Init.Init(srcx, srcy, scale, scale, false);

        var Pixel;
        var P = Array(10);
        var C = Array(9);

        P.fill(0);
        C.fill(0);

        var total = srcy;
        var current = 0;

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                //   C         P
                //
                //          +-----+
                // 0 1 2    |1|2|3|
                //  \|/     |-+-+-|
                // 3-4-5 => |4|5|6|
                //  /|\     |-+-+-|
                // 6 7 8    |7|8|9|
                //          +-----+
                
                C[0] = Common.CLR(Input, srcx, srcy, x, y, -1, -1);
                C[1] = Common.CLR(Input, srcx, srcy, x, y, 0, -1);
                C[2] = Common.CLR(Input, srcx, srcy, x, y, 1, -1);
                C[3] = Common.CLR(Input, srcx, srcy, x, y, -1, 0);
                C[4] = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                C[5] = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                C[6] = Common.CLR(Input, srcx, srcy, x, y, -1, 1);
                C[7] = Common.CLR(Input, srcx, srcy, x, y, 0, 1);
                C[8] = Common.CLR(Input, srcx, srcy, x, y, 1, 1);

                switch(scale) {
                    
                    case 3:
                        
                        P[1] = (Common.IsLike(C[0], C[1]) && Common.IsLike(C[0], C[3])) ? Interpolate.Interpolate3P(C[0], C[1], C[3]) : C[4];
                        P[2] = (Common.IsLike(C[0], C[1]) && Common.IsLike(C[0], C[3]) && Common.IsLike(C[2], C[1]) && Common.IsLike(C[2], C[5])) ? Interpolate.Interpolate2P(Interpolate.Interpolate3P(C[0], C[1], C[3]), Interpolate.Interpolate3P(C[2], C[1], C[5])) : C[4];
                        P[3] = (Common.IsLike(C[2], C[1]) && Common.IsLike(C[2], C[5])) ? Interpolate.Interpolate3P(C[2], C[1], C[5]) : C[4];
                        P[4] = (Common.IsLike(C[0], C[1]) && Common.IsLike(C[0], C[3]) && Common.IsLike(C[6], C[7]) && Common.IsLike(C[6], C[3])) ? Interpolate.Interpolate2P(Interpolate.Interpolate3P(C[0], C[1], C[3]), Interpolate.Interpolate3P(C[6], C[3], C[7])) : C[4];
                        P[5] = C[4];
                        P[6] = (Common.IsLike(C[2], C[1]) && Common.IsLike(C[2], C[5]) && Common.IsLike(C[8], C[5]) && Common.IsLike(C[8], C[7])) ? Interpolate.Interpolate2P(Interpolate.Interpolate3P(C[2], C[1], C[5]), Interpolate.Interpolate3P(C[8], C[5], C[7])) : C[4];
                        P[7] = (Common.IsLike(C[6], C[3]) && Common.IsLike(C[6], C[7])) ? Interpolate.Interpolate3P(C[6], C[3], C[7]) : C[4];
                        P[8] = (Common.IsLike(C[6], C[7]) && Common.IsLike(C[6], C[3]) && Common.IsLike(C[8], C[5]) && Common.IsLike(C[8], C[7])) ? Interpolate.Interpolate2P(Interpolate.Interpolate3P(C[6], C[7], C[3]), Interpolate.Interpolate3P(C[8], C[5], C[7])) : C[4];
                        P[9] = (Common.IsLike(C[8], C[5]) && Common.IsLike(C[8], C[7])) ? Interpolate.Interpolate3P(C[8], C[5], C[7]) : C[4];

                        for (Pixel = 1; Pixel < 10; Pixel++) {

                            Common.Write9RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                    
                        break;
                        
                    default:
                    
                        P[1] = (Common.IsLike(C[1], C[0]) && Common.IsLike(C[1], C[3])) ? Interpolate.Interpolate3P(C[1], C[0], C[3]) : C[4];
                        P[2] = (Common.IsLike(C[2], C[1]) && Common.IsLike(C[2], C[5])) ? Interpolate.Interpolate3P(C[2], C[1], C[5]) : C[4];
                        P[3] = (Common.IsLike(C[6], C[3]) && Common.IsLike(C[6], C[7])) ? Interpolate.Interpolate3P(C[6], C[3], C[7]) : C[4];
                        P[4] = (Common.IsLike(C[7], C[5]) && Common.IsLike(C[7], C[8])) ? Interpolate.Interpolate3P(C[7], C[5], C[8]) : C[4];

                        for (Pixel = 1; Pixel < 5; Pixel++) {

                            Common.Write4RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                        
                        break;
                }
            }

            current++;

            notify({ScalingProgress: current / total });
        }
    }
}