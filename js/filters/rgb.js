// Dot-Matrix Printer Effect
class Filter {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = Math.max(1, Math.min(4, scale));
			
        Init.Init(srcx, srcy, scale, scale, threshold);

        var Pixel, Channels = 4;
        var P = Array(17);

        P.fill(0);

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var pixel = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
					
                var oddrow = (y % 2) > 0;
                var oddcol = (x % 2) > 0;
                
                var dst = (y * srcx + x) * Channels;
                
                switch(scale) {

                    case 2: // x2
                        
                        P[1] = Common.ARGBINT(Common.Alpha(pixel), Common.Red(pixel), 0, 0);
                        P[2] = Common.ARGBINT(Common.Alpha(pixel), 0, Common.Green(pixel), 0);
                        P[3] = Common.ARGBINT(Common.Alpha(pixel), 0, 0, Common.Blue(pixel));
                        P[4] = pixel;

                        for (Pixel = 1; Pixel < 5; Pixel++) {

                            Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                        
                        break;

                    case 3: // x3
                    
                        P[1] = pixel;
                        P[2] = Common.ARGBINT(Common.Alpha(pixel), 0, Common.Green(pixel), 0);
                        P[3] = Common.ARGBINT(Common.Alpha(pixel), 0, 0, Common.Blue(pixel));
                        P[4] = Common.ARGBINT(Common.Alpha(pixel), 0, 0, Common.Blue(pixel));
                        P[5] = pixel;
                        P[6] = Common.ARGBINT(Common.Alpha(pixel), Common.Red(pixel), 0, 0);
                        P[7] = Common.ARGBINT(Common.Alpha(pixel), Common.Red(pixel), 0, 0);
                        P[8] = Common.ARGBINT(Common.Alpha(pixel), 0, Common.Green(pixel), 0);
                        P[9] = pixel;

                        for (Pixel = 1; Pixel < 10; Pixel++) {

                            Common.Write9RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                        
                        break;

                    case 4: // x4
                    
                        P[1] = P[2] = P[5] = P[6] = pixel; 
                        P[3] = P[4] = P[7] = P[8] = Common.ARGBINT(Common.Alpha(pixel), 0, Common.Green(pixel), 0);
                        P[9] = P[10] = P[13] = P[14] = Common.ARGBINT(Common.Alpha(pixel), 0, 0, Common.Blue(pixel));
                        P[11] = P[12] = P[15] = P[16] = Common.ARGBINT(Common.Alpha(pixel), Common.Red(pixel), 0, 0);
                        
                        for (var Pixel = 1; Pixel < 17; Pixel++) {

                            Common.Write16RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                        
                        break;
                        

                    default: // x1
                        
                        if (oddrow && oddcol) {

                            Common.ScaledImage[dst] = 0;
                            Common.ScaledImage[dst + 1] = 0;
                            Common.ScaledImage[dst + 2] = Common.Blue(pixel);
                            Common.ScaledImage[dst + 3] = Common.Alpha(pixel);
                        
                        } else if (!oddrow && !oddcol) {

                            Common.ScaledImage[dst] = Common.Red(pixel);
                            Common.ScaledImage[dst + 1] = Common.Green(pixel);
                            Common.ScaledImage[dst + 2] = Common.Blue(pixel);
                            Common.ScaledImage[dst + 3] = Common.Alpha(pixel);
                        
                        } else if (oddrow) {

                            Common.ScaledImage[dst] = 0;
                            Common.ScaledImage[dst + 1] = Common.Green(pixel);
                            Common.ScaledImage[dst + 2] = 0;
                            Common.ScaledImage[dst + 3] = Common.Alpha(pixel);
                        
                        } else {

                            Common.ScaledImage[dst] = Common.Red(pixel);
                            Common.ScaledImage[dst + 1] = 0;
                            Common.ScaledImage[dst + 2] = 0;
                            Common.ScaledImage[dst + 3] = Common.Alpha(pixel);
                        }
                        
                        break;							
                }
            }
        }
    }
}