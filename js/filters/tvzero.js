// No-scaling TV-like effect using interlacing and gamma reduction
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(1, Math.min(4, scale));
			
        Init.Init(srcx, srcy, 1, 1, false);

        var Channels = 4;
        var P = Array(10);
        
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

                var dst = (y * srcx + x) * Channels;
                
                var row = y % scale;
                
                switch(row) {

                    case 1:
                        
                        Common.ScaledImage[dst] = Common.Red(subPixel);
                        Common.ScaledImage[dst + 1] = Common.Green(subPixel);
                        Common.ScaledImage[dst + 2] = Common.Blue(subPixel);
                        
                        break;

                    case 2:
                        
                        Common.ScaledImage[dst] = Common.Red(subPixel2);
                        Common.ScaledImage[dst + 1] = Common.Green(subPixel2);
                        Common.ScaledImage[dst + 2] = Common.Blue(subPixel2);

                        break;
                    
                    case 3:
                    
                        Common.ScaledImage[dst] = Common.Red(subPixel3);
                        Common.ScaledImage[dst + 1] = Common.Green(subPixel3);
                        Common.ScaledImage[dst + 2] = Common.Blue(subPixel3);
                                                
                        break;
                    
                    default:
                        
                        Common.ScaledImage[dst] = Common.Red(pixel);
                        Common.ScaledImage[dst + 1] = Common.Green(pixel);
                        Common.ScaledImage[dst + 2] = Common.Blue(pixel);
                        
                        break;
                }
            }
        }
    }
}