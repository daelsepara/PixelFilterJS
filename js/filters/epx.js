// EPX/Scale 2/3X - Eric\'s Pixel eXpander / Advance Mame Scale 2/3X
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(2, Math.min(3, scale));
			
        Init.Init(srcx, srcy, scale, scale, false);

        var P = Array(10);
        
        P.fill(0);

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var c0 = Common.CLR(Input, srcx, srcy, x, y, -1, -1);
                var c1 = Common.CLR(Input, srcx, srcy, x, y, 0, -1);
                var c2 = Common.CLR(Input, srcx, srcy, x, y, 1, -1);
                var c3 = Common.CLR(Input, srcx, srcy, x, y, -1, 0);
                var c4 = Common.CLR(Input, srcx, srcy, x, y);
                var c5 = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                var c6 = Common.CLR(Input, srcx, srcy, x, y, -1, 1);
                var c7 = Common.CLR(Input, srcx, srcy, x, y, 0, 1);
                var c8 = Common.CLR(Input, srcx, srcy, x, y, 1, 1);

                switch(scale) {

                    case 3:

                        P[1] = P[2] = P[3] = P[4] = P[5] = P[6] = P[7] = P[8] = P[9] = c4;

                        if (Common.IsNotLike(c3, c5) && Common.IsNotLike(c7, c1)) {
								
                            var neq40 = Common.IsNotLike(c4, c0);
                            var neq41 = Common.IsNotLike(c4, c1);
                            var neq42 = Common.IsNotLike(c4, c2);
                            var neq43 = Common.IsNotLike(c4, c3);
                            var neq45 = Common.IsNotLike(c4, c5);
                            var neq46 = Common.IsNotLike(c4, c6);
                            var neq47 = Common.IsNotLike(c4, c7);
                            var neq48 = Common.IsNotLike(c4, c8);

                            var eq13 = Common.IsLike(c1, c3) && (neq40 || neq48 || Common.IsNotLike(c1, c2) || Common.IsNotLike(c3, c6));
                            var eq37 = Common.IsLike(c3, c7) && (neq46 || neq42 || Common.IsNotLike(c3, c0) || Common.IsNotLike(c7, c8));
                            var eq75 = Common.IsLike(c7, c5) && (neq48 || neq40 || Common.IsNotLike(c7, c6) || Common.IsNotLike(c5, c2));
                            var eq51 = Common.IsLike(c5, c1) && (neq42 || neq46 || Common.IsNotLike(c5, c8) || Common.IsNotLike(c1, c0));
                            
                            if (
                                (!neq40) ||
                                (!neq41) ||
                                (!neq42) ||
                                (!neq43) ||
                                (!neq45) ||
                                (!neq46) ||
                                (!neq47) ||
                                (!neq48)
                                ) {
                                
                                if (eq13)
                                    P[1] = Interpolate.Interpolate2P(c1, c3);
                                if (eq51)
                                    P[3] = Interpolate.Interpolate2P(c5, c1);
                                if (eq37)
                                    P[7] = Interpolate.Interpolate2P(c3, c7);
                                if (eq75)
                                    P[9] = Interpolate.Interpolate2P(c7, c5);

                                if ((eq51 && neq40) && (eq13 && neq42))
                                    P[2] = Interpolate.Interpolate3P(c1, c3, c5);
                                else if (eq51 && neq40)
                                    P[2] = Interpolate.Interpolate2P(c1, c5);
                                else if (eq13 && neq42)
                                    P[2] = Interpolate.Interpolate2P(c1, c3);

                                if ((eq13 && neq46) && (eq37 && neq40))
                                    P[4] = Interpolate.Interpolate3P(c3, c1, c7);
                                else if (eq13 && neq46)
                                    P[4] = Interpolate.Interpolate2P(c3, c1);
                                else if (eq37 && neq40)
                                    P[4] = Interpolate.Interpolate2P(c3, c7);

                                if ((eq75 && neq42) && (eq51 && neq48))
                                    P[6] = Interpolate.Interpolate3P(c5, c1, c7);
                                else if (eq75 && neq42)
                                    P[6] = Interpolate.Interpolate2P(c5, c7);
                                else if (eq51 && neq48)
                                    P[6] = Interpolate.Interpolate2P(c5, c1);

                                if ((eq37 && neq48) && (eq75 && neq46))
                                    P[8] = Interpolate.Interpolate3P(c7, c3, c5);
                                else if (eq75 && neq46)
                                    P[8] = Interpolate.Interpolate2P(c7, c5);
                                else if (eq37 && neq48)
                                    P[8] = Interpolate.Interpolate2P(c7, c3);

                            } else {

                                if (eq13)
                                    P[1] = Interpolate.Interpolate2P(c1, c3);
                                if (eq51)
                                    P[3] = Interpolate.Interpolate2P(c5, c1);
                                if (eq37)
                                    P[7] = Interpolate.Interpolate2P(c3, c7);
                                if (eq75)
                                    P[9] = Interpolate.Interpolate2P(c7, c5);
                            }
                        }

                        for (var Pixel = 1; Pixel < 10; Pixel++) {

                            Common.Write9RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }

                        break;

                    default: // x2
                        
                        P[1] = Common.IsLike(c3, c1) && Common.IsNotLike(c3, c7) && Common.IsNotLike(c1, c5) ? c1 : c4;
                        P[2] = Common.IsLike(c1, c5) && Common.IsNotLike(c1, c3) && Common.IsNotLike(c5, c7) ? c5 : c4;
                        P[3] = Common.IsLike(c7, c3) && Common.IsNotLike(c7, c5) && Common.IsNotLike(c3, c1) ? c3 : c4;
                        P[4] = Common.IsLike(c5, c7) && Common.IsNotLike(c5, c1) && Common.IsNotLike(c7, c3) ? c7 : c4;

                        for (var i = 1; i < 5; i++) {

                            Common.Write4RGB(Common.ScaledImage, srcx, srcy, x, y, i, P[i]);
                        }
                        
                        break;
                }
            }
        }
    }
}