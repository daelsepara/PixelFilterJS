// Derek Liauw Kie Fa's 2XSaI
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

                P[1] = P[2] = P[3] = P[4] = c4;

                if (Common.IsLike(c4, c8) && Common.IsNotLike(c5, c7)) {
                    
                    var c48 = Interpolate.Interpolate2P(c4, c8);

                    if ((Common.IsLike(c48, c1) && Common.IsLike(c5, d5)) || (Common.IsLike(c48, c7) && Common.IsLike(c48, c2) && Common.IsNotLike(c5, c1) && Common.IsLike(c5, d3))) {

                        //nothing

                    } else {

                        P[2] = Interpolate.Interpolate2P(c48, c5);
                    }

                    if ((Common.IsLike(c48, c3) && Common.IsLike(c7, d2)) || (Common.IsLike(c48, c5) && Common.IsLike(c48, c6) && Common.IsNotLike(c3, c7) && Common.IsLike(c7, d0))) {
                        
                        //nothing
                    
                    } else {

                        P[3] = Interpolate.Interpolate2P(c48, c7);
                    }
                
                } else if (Common.IsLike(c5, c7) && Common.IsNotLike(c4, c8)) {

                    var c57 = Interpolate.Interpolate2P(c5, c7);
                    
                    if ((Common.IsLike(c57, c2) && Common.IsLike(c4, c6)) || (Common.IsLike(c57, c1) && Common.IsLike(c57, c8) && Common.IsNotLike(c4, c2) && Common.IsLike(c4, c0))) {
                        
                        P[2] = c57;
                    
                    } else {

                        P[2] = Interpolate.Interpolate2P(c4, c57);
                    }

                    if ((Common.IsLike(c57, c6) && Common.IsLike(c4, c2)) || (Common.IsLike(c57, c3) && Common.IsLike(c57, c8) && Common.IsNotLike(c4, c6) && Common.IsLike(c4, c0))) {
                        
                        P[3] = c57;
                    
                    } else {

                        P[3] = Interpolate.Interpolate2P(c4, c57);
                    }
                    
                    P[4] = c57;
                
                } else if (Common.IsLike(c4, c8) && Common.IsLike(c5, c7)) {
                    
                    var c48 = Interpolate.Interpolate2P(c4, c8);
                    var c57 = Interpolate.Interpolate2P(c5, c7);
                    
                    if (Common.IsNotLike(c48, c57)) {

                        var conc2D = 0;
                        
                        conc2D += Kreed.Conc2D(c48, c57, c3, c1);
                        conc2D -= Kreed.Conc2D(c57, c48, d4, c2);
                        conc2D -= Kreed.Conc2D(c57, c48, c6, d1);
                        conc2D += Kreed.Conc2D(c48, c57, d5, d2);

                        if (conc2D < 0) {

                            P[4] = c57;

                        } else if (conc2D == 0) {

                            P[4] = Interpolate.Interpolate2P(c48, c57);
                        }

                        P[3] = Interpolate.Interpolate2P(c48, c57);
                        P[2] = Interpolate.Interpolate2P(c48, c57);
                    }
                
                } else {

                    P[4] = Interpolate.Interpolate4P(c4, c5, c7, c8);

                    if (Common.IsLike(c4, c7) && Common.IsLike(c4, c2) && Common.IsNotLike(c5, c1) && Common.IsLike(c5, d3)) {
                        
                        //nothing
                    
                    } else if (Common.IsLike(c5, c1) && Common.IsLike(c5, c8) && Common.IsNotLike(c4, c2) && Common.IsLike(c4, c0)) {

                        P[2] = Interpolate.Interpolate3P(c5, c1, c8);

                    } else {

                        P[2] = Interpolate.Interpolate2P(c4, c5);
                    }

                    if (Common.IsLike(c4, c5) && Common.IsLike(c4, c6) && Common.IsNotLike(c3, c7) && Common.IsLike(c7, d0)) {

                        //nothing

                    } else if (Common.IsLike(c7, c3) && Common.IsLike(c7, c8) && Common.IsNotLike(c4, c6) && Common.IsLike(c4, c0)) {
                        
                        P[3] = Interpolate.Interpolate3P(c7, c3, c8);
                    
                    } else {

                        P[3] = Interpolate.Interpolate2P(c4, c7);
                    }
                }

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }

            current++;

            notify({ScalingProgress: current / total});
        }
    }
}