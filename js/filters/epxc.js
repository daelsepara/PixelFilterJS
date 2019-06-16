// SNES9x's EPX (variant C) modified by Hawkynt to support thresholds
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
                    
                    if ((!neq40) || (!neq41) || (!neq42) || (!neq43) || (!neq45) || (!neq46) || (!neq47) || (!neq48)) {
                        
                        var c3A;

                        if ((eq13 && neq46) && (eq37 && neq40))
                            c3A = Interpolate.Interpolate3P(c3, c1, c7);
                        else if (eq13 && neq46)
                            c3A = Interpolate.Interpolate2P(c3, c1);
                        else if (eq37 && neq40)
                            c3A = Interpolate.Interpolate2P(c3, c7);
                        else
                            c3A = c4;

                        var c7B;

                        if ((eq37 && neq48) && (eq75 && neq46))
                            c7B = Interpolate.Interpolate3P(c7, c3, c5);
                        else if (eq37 && neq48)
                            c7B = Interpolate.Interpolate2P(c7, c3);
                        else if (eq75 && neq46)
                            c7B = Interpolate.Interpolate2P(c7, c5);
                        else
                            c7B = c4;

                        var c5C;

                        if ((eq75 && neq42) && (eq51 && neq48))
                            c5C = Interpolate.Interpolate3P(c5, c1, c7);
                        else if (eq75 && neq42)
                            c5C = Interpolate.Interpolate2P(c5, c7);
                        else if (eq51 && neq48)
                            c5C = Interpolate.Interpolate2P(c5, c1);
                        else
                            c5C = c4;

                        var c1D;

                        if ((eq51 && neq40) && (eq13 && neq42))
                            c1D = Interpolate.Interpolate3P(c1, c3, c5);
                        else if (eq51 && neq40)
                            c1D = Interpolate.Interpolate2P(c1, c5);
                        else if (eq13 && neq42)
                            c1D = Interpolate.Interpolate2P(c1, c3);
                        else
                            c1D = c4;

                        if (eq13)
                            P[1] = Interpolate.Interpolate2P(c1, c3);
                        if (eq51)
                            P[2] = Interpolate.Interpolate2P(c5, c1);
                        if (eq37)
                            P[3] = Interpolate.Interpolate2P(c3, c7);
                        if (eq75)
                            P[4] = Interpolate.Interpolate2P(c7, c5);

                        P[1] = Interpolate.Interpolate4P4Q(P[1], c1D, c3A, c4, 5, 1, 1, 1);
                        P[2] = Interpolate.Interpolate4P4Q(P[2], c7B, c5C, c4, 5, 1, 1, 1);
                        P[3] = Interpolate.Interpolate4P4Q(P[3], c3A, c7B, c4, 5, 1, 1, 1);
                        P[4] = Interpolate.Interpolate4P4Q(P[4], c5C, c1D, c4, 5, 1, 1, 1);

                    } else {

                        if (eq13)
                            P[1] = Interpolate.Interpolate2P(c1, c3);
                        if (eq51)
                            P[2] = Interpolate.Interpolate2P(c5, c1);
                        if (eq37)
                            P[3] = Interpolate.Interpolate2P(c3, c7);
                        if (eq75)
                            P[4] = Interpolate.Interpolate2P(c7, c5);

                        P[1] = Interpolate.Interpolate2P2Q(c4, P[1], 3, 1);
                        P[2] = Interpolate.Interpolate2P2Q(c4, P[2], 3, 1);
                        P[3] = Interpolate.Interpolate2P2Q(c4, P[3], 3, 1);
                        P[4] = Interpolate.Interpolate2P2Q(c4, P[4], 3, 1);
                    }
                }

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }
            
            current++;

            notify({ScalingProgress: current / total });
        }
    }
}