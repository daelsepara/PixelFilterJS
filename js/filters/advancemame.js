// AdvanceMame scaling using interpolation
class Filter {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = Math.max(2, Math.min(3, scale));
			
        Init.Init(srcx, srcy, scale, scale, threshold);

        var Pixel;
        var P = Array(10);
        
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

                P[1] = P[2] = P[3] = P[4] = P[5] = P[6] = P[7] = P[8] = P[9] = c4;
                
                switch(scale) {

                    case 3: // x3
                        
                        if (Common.IsNotLike(c1, c7) && Common.IsNotLike(c3, c5)) {
                            
                            if (Common.IsLike(c3, c1)) {

                                P[1] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c3, c1), c4, 5, 3);
                            }
                            
                            if (Common.IsLike(c1, c5)) {

                                P[3] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c5, c1), c4, 5, 3);
                            }
                            
                            if (Common.IsLike(c3, c7)) {

                                P[7] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c3, c7), c4, 5, 3);
                            }
                            
                            if (Common.IsLike(c7, c5)) {

                                P[9] = Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c7, c5), c4, 5, 3);
                            }

                            if ((Common.IsLike(c3, c1) && Common.IsNotLike(c4, c2)) && (Common.IsLike(c5, c1) && Common.IsNotLike(c4, c0)))
                                P[2] = Interpolate.Interpolate3P(c1, c3, c5);
                            else if (Common.IsLike(c3, c1) && Common.IsNotLike(c4, c2))
                                P[2] = Interpolate.Interpolate2P(c3, c1);
                            else if (Common.IsLike(c5, c1) && Common.IsNotLike(c4, c0))
                                P[2] = Interpolate.Interpolate2P(c5, c1);

                            if ((Common.IsLike(c3, c1) && Common.IsNotLike(c4, c6)) && (Common.IsLike(c3, c7) && Common.IsNotLike(c4, c0)))
                                P[4] = Interpolate.Interpolate3P(c3, c1, c7);
                            else if (Common.IsLike(c3, c1) && Common.IsNotLike(c4, c6))
                                P[4] = Interpolate.Interpolate2P(c3, c1);
                            else if (Common.IsLike(c3, c7) && Common.IsNotLike(c4, c0))
                                P[4] = Interpolate.Interpolate2P(c3, c7);

                            if ((Common.IsLike(c5, c1) && Common.IsNotLike(c4, c8)) && (Common.IsLike(c5, c7) && Common.IsNotLike(c4, c2)))
                                P[6] = Interpolate.Interpolate3P(c5, c1, c7);
                            else if (Common.IsLike(c5, c1) && Common.IsNotLike(c4, c8))
                                P[6] = Interpolate.Interpolate2P(c5, c1);
                            else if (Common.IsLike(c5, c7) && Common.IsNotLike(c4, c2))
                                P[6] = Interpolate.Interpolate2P(c5, c7);

                            if ((Common.IsLike(c3, c7) && Common.IsNotLike(c4, c8)) && (Common.IsLike(c5, c7) && Common.IsNotLike(c4, c6)))
                                P[8] = Interpolate.Interpolate3P(c7, c3, c5);
                            else if (Common.IsLike(c3, c7) && Common.IsNotLike(c4, c8))
                                P[8] = Interpolate.Interpolate2P(c3, c7);
                            else if (Common.IsLike(c5, c7) && Common.IsNotLike(c4, c6))
                                P[8] = Interpolate.Interpolate2P(c5, c7);
                        }

                        for (Pixel = 1; Pixel < 10; Pixel++) {

                            Common.Write9RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                    
                        break;
                    
                    default: // x2
                        
                        if (Common.IsNotLike(c1, c7) && Common.IsNotLike(c3, c5)) {

                            P[1] = (Common.IsLike(c3, c1)) ? Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c1, c3), c4, 5, 3) : c4;
                            P[2] = (Common.IsLike(c5, c1)) ? Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c1, c5), c4, 5, 3) : c4;
                            P[3] = (Common.IsLike(c3, c7)) ? Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c7, c3), c4, 5, 3) : c4;
                            P[3] = (Common.IsLike(c5, c7)) ? Interpolate.Interpolate2P2Q(Interpolate.Interpolate2P(c7, c5), c4, 5, 3) : c4;
                        }

                        for (Pixel = 1; Pixel < 5; Pixel++) {

                            Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                        
                        break;
                }
            }

            current++;

            notify({ScalingProgress: current / total});
        }
    }
}