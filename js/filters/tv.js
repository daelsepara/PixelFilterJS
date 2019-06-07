// TV-like effect using interlacing and gamma reduction
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(1, Math.min(4, scale));
			
        Init.Init(srcx, srcy, scale, scale, false);

        var Pixel, Channels = 4;
        var P = Array(17);

        P.fill(0);

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var pixel = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
					
                var R = Common.Red(pixel);
                var G = Common.Green(pixel);
                var B = Common.Blue(pixel);

                var subPixel = Common.RGBINT((R * 5) >> 3, (G * 5) >> 3, (B * 5) >> 3);
                var subPixel2 = Common.RGBINT((R * 5) >> 4, (G * 5) >> 4, (B * 5) >> 4);
                var subPixel3 = Common.RGBINT((R * 5) >> 5, (G * 5) >> 5, (B * 5) >> 5);

                var odd = (y % 2) > 0;
                
                var dst = (y * srcx + x) * Channels;
                
                switch(scale) {

                    case 2: // x2
                        
                        P[1] = pixel;
                        P[2] = pixel;
                        P[3] = subPixel;
                        P[4] = subPixel;

                        for (Pixel = 1; Pixel < 5; Pixel++) {

                            Common.Write4RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                        
                        break;

                    case 3: // x3
                        
                        P[1] = pixel;
                        P[2] = pixel;
                        P[3] = pixel;
                        P[4] = subPixel;
                        P[5] = subPixel;
                        P[6] = subPixel;
                        P[7] = subPixel2;
                        P[8] = subPixel2;
                        P[9] = subPixel2;

                        for (Pixel = 1; Pixel < 10; Pixel++) {

                            Common.Write9RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                    
                        break;
                    
                    case 4: // x4
                    
                        P[1] = P[2] = P[3] = P[4] = pixel;
                        P[5] = P[6] = P[7] = P[8] = subPixel;
                        P[9] = P[10] = P[11] = P[12] = subPixel2;
                        P[13] = P[14] = P[15] = P[16] = subPixel3;
                        
                        for (Pixel = 1; Pixel < 17; Pixel++) {
                            
                            Common.Write16RGB(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
                    
                        break;
                    
                    default: // x1
                        
                        Common.ScaledImage[dst] = odd ? Common.Red(subPixel) : Common.Red(pixel);
                        Common.ScaledImage[dst + 1] = odd ? Common.Green(subPixel) : Common.Green(pixel);
                        Common.ScaledImage[dst + 2] = odd ? Common.Blue(subPixel) : Common.Blue(pixel);
                        
                        break;
                }
            }
        }
    }
}