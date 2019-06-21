// LQ nX Magnification
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = Math.max(2, Math.min(scale, 4));
			
        Init.Init(srcx, srcy, scale, scale, threshold);

        var Pixel;
        var P = Array(17);
        
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

                var pattern = 0;

                if ((Common.IsNotLike(c4, c0)))
                    pattern |= 1;
                if ((Common.IsNotLike(c4, c1)))
                    pattern |= 2;
                if ((Common.IsNotLike(c4, c2)))
                    pattern |= 4;
                if ((Common.IsNotLike(c4, c3)))
                    pattern |= 8;
                if ((Common.IsNotLike(c4, c5)))
                    pattern |= 16;
                if ((Common.IsNotLike(c4, c6)))
                    pattern |= 32;
                if ((Common.IsNotLike(c4, c7)))
                    pattern |= 64;
                if ((Common.IsNotLike(c4, c8)))
                    pattern |= 128;

                switch(scale) {

                    case 3: // x3
						
                        this.Lq3xKernel(pattern, c0, c1, c2, c3, c4, c5, c6, c7, c8, P);

                        for (Pixel = 1; Pixel < 10; Pixel++) {

                            Common.Write9RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }
							
                        break;
                            
                    case 4: // x4
                        
                        this.Lq4xKernel(pattern, c0, c1, c2, c3, c4, c5, c6, c7, c8, P);

                        for (Pixel = 1; Pixel < 17; Pixel++) {
                            
                            Common.Write16RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }

                        break;

                    default: // x2
						
                        this.Lq2xKernel(pattern, c0, c1, c2, c3, c4, c5, c6, c7, c8, P);

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

    // region standard LQ2x casepath
    Lq2xKernel(pattern, c0, c1, c2, c3, c4, c5, c6, c7, c8, Pixel) {

        var e01, e10, e11;
        var e00 = e01 = e10 = e11 = c4;

        switch (pattern) {
            
            //region LQ2x PATTERNS
            case 0:
            case 2:
            case 4:
            case 6:
            case 8:
            case 12:
            case 16:
            case 20:
            case 24:
            case 28:
            case 32:
            case 34:
            case 36:
            case 38:
            case 40:
            case 44:
            case 48:
            case 52:
            case 56:
            case 60:
            case 64:
            case 66:
            case 68:
            case 70:
            case 96:
            case 98:
            case 100:
            case 102:
            case 128:
            case 130:
            case 132:
            case 134:
            case 136:
            case 140:
            case 144:
            case 148:
            case 152:
            case 156:
            case 160:
            case 162:
            case 164:
            case 166:
            case 168:
            case 172:
            case 176:
            case 180:
            case 184:
            case 188:
            case 192:
            case 194:
            case 196:
            case 198:
            case 224:
            case 226:
            case 228:
            case 230: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                }
                
                break;

            case 1:
            case 5:
            case 9:
            case 13:
            case 17:
            case 21:
            case 25:
            case 29:
            case 33:
            case 37:
            case 41:
            case 45:
            case 49:
            case 53:
            case 57:
            case 61:
            case 65:
            case 69:
            case 97:
            case 101:
            case 129:
            case 133:
            case 137:
            case 141:
            case 145:
            case 149:
            case 153:
            case 157:
            case 161:
            case 165:
            case 169:
            case 173:
            case 177:
            case 181:
            case 185:
            case 189:
            case 193:
            case 197:
            case 225:
            case 229: {

                    e00 = c1;
                    e01 = c1;
                    e10 = c1;
                    e11 = c1;
                }
                
                break;

            case 3:
            case 35:
            case 67:
            case 99:
            case 131:
            case 163:
            case 195:
            case 227: {

                    e00 = c2;
                    e01 = c2;
                    e10 = c2;
                    e11 = c2;
                }
                
                break;

            case 7:
            case 39:
            case 71:
            case 103:
            case 135:
            case 167:
            case 199:
            case 231: {

                    e00 = c3;
                    e01 = c3;
                    e10 = c3;
                    e11 = c3;
                }
                
                break;

            case 10:
            case 138: {

                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                }
                
                break;

            case 11:
            case 27:
            case 75:
            case 139:
            case 155:
            case 203: {

                    e01 = c2;
                    e10 = c2;
                    e11 = c2;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c3, 2, 1, 1));
                }
                
                break;

            case 14:
            case 142: {

                    e10 = c0;
                    e11 = c0;
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c0, 3, 3, 2);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                    }
                }
                
                break;

            case 15:
            case 143:
            case 207: {

                    e10 = c4;
                    e11 = c4;
                    
                    if (Common.IsNotLike(c1, c3)) {
                        
                        e00 = c4;
                        e01 = c4;

                    } else {
                        
                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c4, 3, 3, 2);
                        e01 = Interpolate.Interpolate2P2Q(c4, c1, 3, 1);
                    }
                }
                
                break;

            case 18:
            case 22:
            case 30:
            case 50:
            case 54:
            case 62:
            case 86:
            case 118: {

                    e00 = c0;
                    e10 = c0;
                    e11 = c0;
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 19:
            case 51: {

                    e10 = c2;
                    e11 = c2;
                    
                    if (Common.IsNotLike(c1, c5)) {
                        
                        e00 = c2;
                        e01 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e01 = Interpolate.Interpolate3P3Q(c1, c5, c2, 3, 3, 2);
                    }
                }
                
                break;

            case 23:
            case 55:
            case 119: {
                
                    e10 = c3;
                    e11 = c3;
                    
                    if (Common.IsNotLike(c1, c5)) {

                        e00 = c3;
                        e01 = c3;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c3, c1, 3, 1);
                        e01 = Interpolate.Interpolate3P3Q(c1, c5, c3, 3, 3, 2);
                    }
                }
                
                break;

            case 26: {

                    e10 = c0;
                    e11 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 31:
            case 95: {

                    e10 = c4;
                    e11 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 42:
            case 170: {

                    e01 = c0;
                    e11 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e10 = c0;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c0, 3, 3, 2);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }
                }
                
                break;

            case 43:
            case 171:
            case 187: {

                    e01 = c2;
                    e11 = c2;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e10 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 3, 3, 2);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 3, 1);
                    }
                }
                
                break;

            case 46:
            case 174: {

                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                }
                
                break;

            case 47:
            case 175: {

                    e01 = c4;
                    e10 = c4;
                    e11 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 14, 1, 1));
                }
                
                break;

            case 58:
            case 154:
            case 186: {

                    e10 = c0;
                    e11 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 6, 1, 1));
                }
                
                break;

            case 59: {

                    e10 = c2;
                    e11 = c2;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c3, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 6, 1, 1));
                }
                
                break;

            case 63: {

                    e10 = c4;
                    e11 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 14, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 72:
            case 76:
            case 104:
            case 106:
            case 108:
            case 110:
            case 120:
            case 124: {

                    e00 = c0;
                    e01 = c0;
                    e11 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                }
                
                break;

            case 73:
            case 77:
            case 105:
            case 109:
            case 125: {

                    e01 = c1;
                    e11 = c1;
                    
                    if (Common.IsNotLike(c7, c3)) {

                        e00 = c1;
                        e10 = c1;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 3, 1);
                        e10 = Interpolate.Interpolate3P3Q(c3, c7, c1, 3, 3, 2);
                    }
                }
                
                break;

            case 74: {

                    e01 = c0;
                    e11 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                }
                
                break;

            case 78:
            case 202:
            case 206: {

                    e01 = c0;
                    e11 = c0;
                    e10 = Common.IsNotLike(c7, c3) ? c0 : Interpolate.Interpolate3P3Q(c0, c3, c7, 6, 1, 1);
                    e00 = Common.IsNotLike(c1, c3) ? c0 : Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1);
                }
                
                break;

            case 79: {

                    e01 = c4;
                    e11 = c4;
                    e10 = Common.IsNotLike(c7, c3) ? c4 : Interpolate.Interpolate3P3Q(c4, c3, c7, 6, 1, 1);
                    e00 = Common.IsNotLike(c1, c3) ? c4 : Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1);
                }
                
                break;

            case 80:
            case 208:
            case 210:
            case 216: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = Common.IsNotLike(c7, c5) ? c0 : Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                }
                
                break;

            case 81:
            case 209:
            case 217: {

                    e00 = c1;
                    e01 = c1;
                    e10 = c1;
                    e11 = Common.IsNotLike(c7, c5) ? c1 : Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1);
                }
                
                break;

            case 82:
            case 214:
            case 222: {

                    e00 = c0;
                    e10 = c0;
                    e11 = Common.IsNotLike(c7, c5) ? c0 : Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    e01 = Common.IsNotLike(c1, c5) ? c0 : Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1);
                }
                
                break;

            case 83:
            case 115: {

                    e00 = c2;
                    e10 = c2;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c5, c7, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 6, 1, 1));
                }
                
                break;

            case 84:
            case 212: {

                    e00 = c0;
                    e10 = c0;

                    if (Common.IsNotLike(c7, c5)) {

                        e01 = c0;
                        e11 = c0;

                    } else {
                        e01 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e11 = Interpolate.Interpolate3P3Q(c5, c7, c0, 3, 3, 2);
                    }
                }
                
                break;

            case 85:
            case 213:
            case 221: {

                    e00 = c1;
                    e10 = c1;

                    if (Common.IsNotLike(c7, c5)) {

                        e01 = c1;
                        e11 = c1;
                    
                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c1, c5, 3, 1);
                        e11 = Interpolate.Interpolate3P3Q(c5, c7, c1, 3, 3, 2);
                    }
                }
                
                break;

            case 87: {

                    e00 = c3;
                    e10 = c3;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c5, c7, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 2, 1, 1));
                }
                
                break;

            case 88:
            case 248:
            case 250: {

                    e00 = c0;
                    e01 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                }
                
                break;

            case 89:
            case 93: {

                    e00 = c1;
                    e01 = c1;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 6, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 6, 1, 1));
                }
                
                break;

            case 90: {

                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 6, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 6, 1, 1));
                }
                
                break;

            case 91: {

                    e10 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 6, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c5, c7, 6, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c3, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 6, 1, 1));
                }
                
                break;

            case 92: {

                    e00 = c0;
                    e01 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 6, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1));
                }
                
                break;

            case 94: {

                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 6, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 107:
            case 123: {

                    e01 = c2;
                    e11 = c2;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c3, 2, 1, 1));
                }
                
                break;

            case 111: {

                    e01 = c4;
                    e11 = c4;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 14, 1, 1));
                }
                
                break;

            case 112:
            case 240: {

                    e00 = c0;
                    e01 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {

                        e10 = c0;
                        e11 = c0;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e11 = Interpolate.Interpolate3P3Q(c5, c7, c0, 3, 3, 2);
                    }
                }
                
                break;

            case 113:
            case 241: {

                    e00 = c1;
                    e01 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {

                        e10 = c1;
                        e11 = c1;

                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                        e11 = Interpolate.Interpolate3P3Q(c5, c7, c1, 3, 3, 2);
                    }
                }
                
                break;

            case 114: {

                    e00 = c0;
                    e10 = c0;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 6, 1, 1));
                }
                
                break;

            case 116: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1));
                }
                
                break;

            case 117: {

                    e00 = c1;
                    e01 = c1;
                    e10 = c1;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 6, 1, 1));
                }
                
                break;

            case 121: {

                    e00 = c1;
                    e01 = c1;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 6, 1, 1));
                }
                
                break;

            case 122: {

                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 6, 1, 1));
                }
                
                break;

            case 126: {

                    e00 = c0;
                    e11 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 127: {

                    e11 = c4;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 14, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 146:
            case 150:
            case 178:
            case 182:
            case 190: {

                    e00 = c0;
                    e10 = c0;

                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c0;
                        e11 = c0;

                    } else {

                        e01 = Interpolate.Interpolate3P3Q(c1, c5, c0, 3, 3, 2);
                        e11 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 147:
            case 179: {

                    e00 = c2;
                    e10 = c2;
                    e11 = c2;
                    e01 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 6, 1, 1));
                }
                
                break;

            case 151:
            case 183: {

                    e00 = c3;
                    e10 = c3;
                    e11 = c3;
                    e01 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 14, 1, 1));
                }
                
                break;

            case 158: {
                
                    e10 = c0;
                    e11 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 159: {

                    e10 = c4;
                    e11 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 14, 1, 1));
                }
                
                break;

            case 191: {

                    e10 = c4;
                    e11 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 14, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 14, 1, 1));
                }
                
                break;

            case 200:
            case 204:
            case 232:
            case 236:
            case 238: {

                    e00 = c0;
                    e01 = c0;

                    if (Common.IsNotLike(c7, c3)) {

                        e10 = c0;
                        e11 = c0;

                    } else {

                        e10 = Interpolate.Interpolate3P3Q(c3, c7, c0, 3, 3, 2);
                        e11 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }
                }
                
                break;

            case 201:
            case 205: {

                    e00 = c1;
                    e01 = c1;
                    e11 = c1;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 6, 1, 1));
                }
                
                break;

            case 211: {

                    e00 = c2;
                    e01 = c2;
                    e10 = c2;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c5, c7, 2, 1, 1));
                }
                
                break;

            case 215: {

                    e00 = c3;
                    e10 = c3;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c5, c7, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 14, 1, 1));
                }
                
                break;

            case 218: {

                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 6, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 6, 1, 1));
                }
                
                break;

            case 219: {

                    e01 = c2;
                    e10 = c2;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c3, 2, 1, 1));
                }
                
                break;

            case 220: {

                    e00 = c0;
                    e01 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 6, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                }
                
                break;

            case 223: {

                    e10 = c4;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 14, 1, 1));
                }
                
                break;

            case 233:
            case 237: {

                    e00 = c1;
                    e01 = c1;
                    e11 = c1;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 14, 1, 1));
                }
                
                break;

            case 234: {

                    e01 = c0;
                    e11 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1));
                }
                
                break;

            case 235: {

                    e01 = c2;
                    e11 = c2;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 14, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c3, 2, 1, 1));
                }
                
                break;

            case 239: {

                    e01 = c4;
                    e11 = c4;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 14, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 14, 1, 1));
                }
                
                break;

            case 242: {

                    e00 = c0;
                    e10 = c0;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 6, 1, 1));
                }
                
                break;

            case 243: {
                
                    e00 = c2;
                    e01 = c2;

                    if (Common.IsNotLike(c7, c5)) {

                        e10 = c2;
                        e11 = c2;

                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c2, c7, 3, 1);
                        e11 = Interpolate.Interpolate3P3Q(c5, c7, c2, 3, 3, 2);
                    }
                }
                
                break;

            case 244: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 14, 1, 1));
                }
                
                break;

            case 245: {

                    e00 = c1;
                    e01 = c1;
                    e10 = c1;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 14, 1, 1));
                }
                
                break;

            case 246: {

                    e00 = c0;
                    e10 = c0;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 14, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 247: {

                    e00 = c3;
                    e10 = c3;
                    e11 = (Common.IsNotLike(c7, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c5, c7, 14, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 14, 1, 1));
                }
                
                break;

            case 249: {

                    e00 = c1;
                    e01 = c1;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 14, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1));
                }
                
                break;

            case 251: {

                    e01 = c2;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 14, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c3, 2, 1, 1));
                }
                
                break;

            case 252: {

                    e00 = c0;
                    e01 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 14, 1, 1));
                }
                
                break;

            case 253: {
                
                    e00 = c1;
                    e01 = c1;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 14, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 14, 1, 1));
                }
                
                break;

            case 254: {

                    e00 = c0;
                    e10 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 14, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 255: {

                    e10 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 14, 1, 1));
                    e11 = (Common.IsNotLike(c7, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c5, c7, 14, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 14, 1, 1));
                    e01 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 14, 1, 1));
                }
                
                break;
        }
        //endregion
        
        Pixel[1] = (e00);
        Pixel[2] = (e01);
        Pixel[3] = (e10);
        Pixel[4] = (e11);
    }
    //endregion

    //region standard LQ3x casepath
    Lq3xKernel(pattern, c0, c1, c2, c3, c4, c5, c6, c7, c8, Pixel) {

        var e01, e02, e10, e11, e12, e20, e21, e22;
        var e00 = e01 = e02 = e10 = e11 = e12 = e20 = e21 = e22 = c4;

        switch (pattern) {
            
            //region LQ3x PATTERNS
            case 0:
            case 2:
            case 4:
            case 6:
            case 8:
            case 12:
            case 16:
            case 20:
            case 24:
            case 28:
            case 32:
            case 34:
            case 36:
            case 38:
            case 40:
            case 44:
            case 48:
            case 52:
            case 56:
            case 60:
            case 64:
            case 66:
            case 68:
            case 70:
            case 96:
            case 98:
            case 100:
            case 102:
            case 128:
            case 130:
            case 132:
            case 134:
            case 136:
            case 140:
            case 144:
            case 148:
            case 152:
            case 156:
            case 160:
            case 162:
            case 164:
            case 166:
            case 168:
            case 172:
            case 176:
            case 180:
            case 184:
            case 188:
            case 192:
            case 194:
            case 196:
            case 198:
            case 224:
            case 226:
            case 228:
            case 230: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                }
                
                break;
                
            case 1:
            case 5:
            case 9:
            case 13:
            case 17:
            case 21:
            case 25:
            case 29:
            case 33:
            case 37:
            case 41:
            case 45:
            case 49:
            case 53:
            case 57:
            case 61:
            case 65:
            case 69:
            case 97:
            case 101:
            case 129:
            case 133:
            case 137:
            case 141:
            case 145:
            case 149:
            case 153:
            case 157:
            case 161:
            case 165:
            case 169:
            case 173:
            case 177:
            case 181:
            case 185:
            case 189:
            case 193:
            case 197:
            case 225:
            case 229: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                }
                
                break;

            case 3:
            case 35:
            case 67:
            case 99:
            case 131:
            case 163:
            case 195:
            case 227: {

                    e00 = c2;
                    e01 = c2;
                    e02 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                }
                
                break;

            case 7:
            case 39:
            case 71:
            case 103:
            case 135:
            case 167:
            case 199:
            case 231: {

                    e00 = c3;
                    e01 = c3;
                    e02 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                }
                
                break;

            case 10:
            case 138: {

                    e02 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c0, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                    }
                }
                
                break;

            case 11:
            case 27:
            case 75:
            case 139:
            case 155:
            case 203: {

                    e02 = c2;
                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;
                        e10 = c2;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 7, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 7, 1);
                    }
                }
                
                break;

            case 14:
            case 142: {

                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e02 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c0, 3, 1);
                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }
                }
                
                break;

            case 15:
            case 143:
            case 207: {

                    e11 = c4;
                    e12 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c4;
                        e01 = c4;
                        e02 = c4;
                        e10 = c4;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c4, 3, 1);
                        e02 = Interpolate.Interpolate2P2Q(c4, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c4, c3, 3, 1);
                    }
                }
                
                break;

            case 18:
            case 22:
            case 30:
            case 50:
            case 54:
            case 62:
            case 86:
            case 118: {

                    e00 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;

                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c0;
                        e02 = c0;
                        e12 = c0;

                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                    }
                }
                
                break;

            case 19:
            case 51: {

                    e10 = c2;
                    e11 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;

                    if (Common.IsNotLike(c1, c5)) {

                        e00 = c2;
                        e01 = c2;
                        e02 = c2;
                        e12 = c2;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 3, 1);
                        e02 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e12 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                    }
                }
                
                break;

            case 23:
            case 55:
            case 119: {

                    e10 = c3;
                    e11 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    
                    if (Common.IsNotLike(c1, c5)) {

                        e00 = c3;
                        e01 = c3;
                        e02 = c3;
                        e12 = c3;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c3, c1, 3, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c3, 3, 1);
                        e02 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e12 = Interpolate.Interpolate2P2Q(c3, c5, 3, 1);
                    }
                }
                
                break;

            case 26: {

                    e01 = c0;
                    e11 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c0, 7, 7, 2);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e12 = c0;

                    } else {

                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                    }
                }
                
                break;

            case 31:
            case 95: {

                    e01 = c4;
                    e11 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c4;
                        e10 = c4;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c4, 7, 7, 2);
                        e10 = Interpolate.Interpolate2P2Q(c4, c3, 7, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c4;
                        e12 = c4;

                    } else {

                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c4, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c4, c5, 7, 1);
                    }
                }
                
                break;

            case 42:
            case 170: {

                    e02 = c0;
                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c0;
                        e01 = c0;
                        e10 = c0;
                        e20 = c0;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c0, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }
                }
                
                break;

            case 43:
            case 171:
            case 187: {

                    e02 = c2;
                    e11 = c2;
                    e12 = c2;
                    e21 = c2;
                    e22 = c2;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e01 = c2;
                        e10 = c2;
                        e20 = c2;
                    
                    } else {
                    
                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c2, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c2, c3, 3, 1);
                    }
                }
                
                break;

            case 46:
            case 174: {

                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                }
                
                break;

            case 47:
            case 175: {

                    e01 = c4;
                    e02 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                }
                
                break;

            case 58:
            case 154:
            case 186: {

                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 59: {

                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e01 = c2;
                        e10 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 7, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 7, 1);
                    }
                    
                    e02 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1));
                }
                
                break;

            case 63: {

                    e01 = c4;
                    e10 = c4;
                    e11 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c5)) {
                    
                        e02 = c4;
                        e12 = c4;
                    
                    } else {
                    
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c4, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c4, c5, 7, 1);
                    }
                }
                
                break;

            case 72:
            case 76:
            case 104:
            case 106:
            case 108:
            case 110:
            case 120:
            case 124: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e11 = c0;
                    e12 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {

                        e10 = c0;
                        e20 = c0;
                        e21 = c0;

                    } else {
                    
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                    }
                }
                
                break;

            case 73:
            case 77:
            case 105:
            case 109:
            case 125: {

                    e01 = c1;
                    e02 = c1;
                    e11 = c1;
                    e12 = c1;
                    e22 = c1;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e00 = c1;
                        e10 = c1;
                        e20 = c1;
                        e21 = c1;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c1, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e21 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                    }
                }
                
                break;

            case 74: {

                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e21 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c0, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                    }
                }
                
                break;

            case 78:
            case 202:
            case 206: {

                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                }
                
                break;

            case 79: {

                    e02 = c4;
                    e11 = c4;
                    e12 = c4;
                    e21 = c4;
                    e22 = c4;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c4;
                        e01 = c4;
                        e10 = c4;
                    
                    } else {
                    
                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c4, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c4, c1, 7, 1);
                        e10 = Interpolate.Interpolate2P2Q(c4, c3, 7, 1);
                    }
                }
                
                break;

            case 80:
            case 208:
            case 210:
            case 216: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {

                        e12 = c0;
                        e21 = c0;
                        e22 = c0;

                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c0, 7, 7, 2);
                    }
                }
                
                break;

            case 81:
            case 209:
            case 217: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    e20 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c1;
                        e21 = c1;
                        e22 = c1;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c1, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c1, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c1, 7, 7, 2);
                    }
                }
                
                break;

            case 82:
            case 214:
            case 222: {

                    e00 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;

                    if (Common.IsNotLike(c7, c5)) {

                        e21 = c0;
                        e22 = c0;

                    } else {
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c0, 7, 7, 2);
                    }
                    
                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c0;
                        e02 = c0;

                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                    }
                }
                
                break;

            case 83:
            case 115: {

                    e00 = c2;
                    e01 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = (Common.IsNotLike(c7, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c5, c7, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1));
                }
                
                break;

            case 84:
            case 212: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e02 = c0;
                        e12 = c0;
                        e21 = c0;
                        e22 = c0;
                    
                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e12 = Interpolate.Interpolate2P2Q(c5, c0, 3, 1);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e22 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 85:
            case 213:
            case 221: {

                    e00 = c1;
                    e01 = c1;
                    e10 = c1;
                    e11 = c1;
                    e20 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e02 = c1;
                        e12 = c1;
                        e21 = c1;
                        e22 = c1;
                    
                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c1, c5, 3, 1);
                        e12 = Interpolate.Interpolate2P2Q(c5, c1, 3, 1);
                        e21 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                        e22 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 87: {
                
                    e00 = c3;
                    e10 = c3;
                    e11 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = (Common.IsNotLike(c7, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c5, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c3;
                        e02 = c3;
                        e12 = c3;

                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c3, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c3, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c3, c5, 7, 1);
                    }
                }
                
                break;

            case 88:
            case 248:
            case 250: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e11 = c0;
                    e21 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {

                        e10 = c0;
                        e20 = c0;

                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e12 = c0;
                        e22 = c0;

                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c0, 7, 7, 2);
                    }
                }
                
                break;

            case 89:
            case 93:
            case 253: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e21 = c1;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1));
                    e22 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1));
                }
                
                break;

            case 90: {

                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 91: {

                    e11 = c2;
                    e12 = c2;
                    e21 = c2;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 2, 1, 1));
                    e22 = (Common.IsNotLike(c7, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c5, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e01 = c2;
                        e10 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 7, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 7, 1);
                    }

                    e02 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1));
                }
                
                break;

            case 92: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                }
                
                break;

            case 94: {

                    e10 = c0;
                    e11 = c0;
                    e21 = c0;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c0;
                        e02 = c0;
                        e12 = c0;

                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                    }
                }
                
                break;

            case 107:
            case 123: {

                    e02 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e22 = c2;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c2;
                        e21 = c2;
                    
                    } else {

                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c2, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c2, c7, 7, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 7, 1);
                    }
                }
                
                break;

            case 111: {

                    e01 = c4;
                    e02 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e22 = c4;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c4;
                        e21 = c4;
                    
                    } else {

                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c4, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c4, c7, 7, 1);

                    }

                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                }
                
                break;

            case 112:
            case 240: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c0;
                        e20 = c0;
                        e21 = c0;
                        e22 = c0;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e21 = Interpolate.Interpolate2P2Q(c7, c0, 3, 1);
                        e22 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 113:
            case 241: {
                
                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c1;
                        e20 = c1;
                        e21 = c1;
                        e22 = c1;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c1, c5, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                        e21 = Interpolate.Interpolate2P2Q(c7, c1, 3, 1);
                        e22 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 114: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 116:
            case 244: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                }
                
                break;

            case 117:
            case 245: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1));
                }
                
                break;

            case 121: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e11 = c1;
                    e12 = c1;

                    if (Common.IsNotLike(c7, c3)) {

                        e10 = c1;
                        e20 = c1;
                        e21 = c1;

                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c1, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c1, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c1, c7, 7, 1);
                    }

                    e22 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1));
                }
                
                break;

            case 122: {

                    e01 = c0;
                    e11 = c0;
                    e12 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                        e10 = c0;
                        e20 = c0;
                        e21 = c0;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                    }

                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 126: {
                
                    e00 = c0;
                    e11 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e10 = c0;
                        e20 = c0;
                        e21 = c0;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c0;
                        e02 = c0;
                        e12 = c0;
                    
                    } else {
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                    }
                }
                
                break;

            case 127: {

                    e11 = c4;
                    e22 = c4;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c4;
                        e21 = c4;
                    
                    } else {
                    
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c4, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c4, c7, 7, 1);
                    }
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c4;
                        e01 = c4;
                        e10 = c4;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c4, c1, 7, 1);
                        e10 = Interpolate.Interpolate2P2Q(c4, c3, 7, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c4;
                        e12 = c4;

                    } else {

                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c4, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c4, c5, 7, 1);
                    }
                }
                
                break;

            case 146:
            case 150:
            case 178:
            case 182:
            case 190: {

                    e00 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = c0;
                    e21 = c0;
                    
                    if (Common.IsNotLike(c1, c5)) {
                    
                        e01 = c0;
                        e02 = c0;
                        e12 = c0;
                        e22 = c0;
                    
                    } else {
                    
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e02 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e12 = Interpolate.Interpolate2P2Q(c5, c0, 3, 1);
                        e22 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 147:
            case 179: {

                    e00 = c2;
                    e01 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e02 = (Common.IsNotLike(c1, c5)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1));
                }
                
                break;

            case 151:
            case 183: {

                    e00 = c3;
                    e01 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    e02 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 2, 1, 1));
                }
                
                break;

            case 158: {
                
                    e10 = c0;
                    e11 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c5)) {
                    
                        e01 = c0;
                        e02 = c0;
                        e12 = c0;
                    
                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                    }
                }
                
                break;

            case 159: {
                
                    e01 = c4;
                    e11 = c4;
                    e12 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c4;
                        e10 = c4;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c4, 7, 7, 2);
                        e10 = Interpolate.Interpolate2P2Q(c4, c3, 7, 1);
                    }

                    e02 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 191: {

                    e01 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 200:
            case 204:
            case 232:
            case 236:
            case 238: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e11 = c0;
                    e12 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e10 = c0;
                        e20 = c0;
                        e21 = c0;
                        e22 = c0;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e21 = Interpolate.Interpolate2P2Q(c7, c0, 3, 1);
                        e22 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }
                }
                
                break;

            case 201:
            case 205:
            case 233:
            case 237: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e21 = c1;
                    e22 = c1;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1));
                }
                
                break;

            case 211: {

                    e00 = c2;
                    e01 = c2;
                    e02 = c2;
                    e10 = c2;
                    e11 = c2;
                    e20 = c2;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c2;
                        e21 = c2;
                        e22 = c2;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c2, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c2, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c2, 7, 7, 2);
                    }
                }
                
                break;

            case 215: {

                    e00 = c3;
                    e01 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e20 = c3;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e21 = c3;
                        e22 = c3;
                    
                    } else {

                        e21 = Interpolate.Interpolate2P2Q(c3, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c3, 7, 7, 2);
                    }

                    e02 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 2, 1, 1));
                }
                
                break;

            case 218: {

                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c0;
                        e21 = c0;
                        e22 = c0;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c0, 7, 7, 2);
                    }

                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 219: {

                    e02 = c2;
                    e11 = c2;
                    e20 = c2;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c2;
                        e21 = c2;
                        e22 = c2;
                    
                    } else {
                    
                        e12 = Interpolate.Interpolate2P2Q(c2, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c2, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c2, 7, 7, 2);
                    }
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e01 = c2;
                        e10 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 7, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 7, 1);
                    }
                }
                
                break;

            case 220: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1));

                    if (Common.IsNotLike(c7, c5)) {

                        e12 = c0;
                        e21 = c0;
                        e22 = c0;

                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c0, 7, 7, 2);
                    }
                }
                
                break;

            case 223: {

                    e11 = c4;
                    e20 = c4;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e21 = c4;
                        e22 = c4;
                    
                    } else {

                        e21 = Interpolate.Interpolate2P2Q(c4, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c4, 7, 7, 2);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c4;
                        e10 = c4;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c4, 7, 7, 2);
                        e10 = Interpolate.Interpolate2P2Q(c4, c3, 7, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c4;
                        e02 = c4;
                        e12 = c4;

                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c4, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1);
                        e12 = Interpolate.Interpolate2P2Q(c4, c5, 7, 1);
                    }
                }
                
                break;

            case 234: {

                    e01 = c0;
                    e02 = c0;
                    e11 = c0;
                    e12 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e10 = c0;
                        e20 = c0;
                        e21 = c0;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                    }

                    e00 = (Common.IsNotLike(c1, c3)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1));
                }
                
                break;

            case 235: {

                    e02 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e21 = c2;
                    e22 = c2;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 2, 1, 1));

                    if (Common.IsNotLike(c1, c3)) {
                        e00 = c2;
                        e01 = c2;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 7, 1);
                    }
                }
                
                break;

            case 239: {

                    e01 = c4;
                    e02 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e21 = c4;
                    e22 = c4;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                }
                
                break;

            case 242: {
                
                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c0;
                        e21 = c0;
                        e22 = c0;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c0, 7, 7, 2);
                    }

                    e02 = (Common.IsNotLike(c1, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1));
                }
                
                break;

            case 243: {

                    e00 = c2;
                    e01 = c2;
                    e02 = c2;
                    e10 = c2;
                    e11 = c2;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c2;
                        e20 = c2;
                        e21 = c2;
                        e22 = c2;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c2, c7, 3, 1);
                        e21 = Interpolate.Interpolate2P2Q(c7, c2, 3, 1);
                        e22 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 246: {
                
                    e00 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c5)) {
                    
                        e01 = c0;
                        e02 = c0;
                    
                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                    }
                }
                
                break;

            case 247: {

                    e00 = c3;
                    e01 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = (Common.IsNotLike(c7, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c5, c7, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 2, 1, 1));
                }
                
                break;

            case 249: {
                
                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    e21 = c1;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e12 = c1;
                        e22 = c1;
                    
                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c1, c5, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c1, 7, 7, 2);
                    }
                }
                
                break;

            case 251: {
                
                    e02 = c2;
                    e11 = c2;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e10 = c2;
                        e20 = c2;
                        e21 = c2;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c2, c3, c7, 2, 1, 1);
                        e21 = Interpolate.Interpolate2P2Q(c2, c7, 7, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e12 = c2;
                        e22 = c2;

                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c2, c5, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c5, c7, c2, 7, 7, 2);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c1, c3, c2, 7, 7, 2);
                        e01 = Interpolate.Interpolate2P2Q(c2, c1, 7, 1);
                    }
                }
                
                break;

            case 252: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e10 = c0;
                        e20 = c0;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                    }

                    e22 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                }
                
                break;

            case 254: {

                    e00 = c0;
                    e11 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e10 = c0;
                        e20 = c0;
                    
                    } else {

                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 7, 1);
                        e20 = Interpolate.Interpolate3P3Q(c3, c7, c0, 7, 7, 2);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e12 = c0;
                        e21 = c0;
                        e22 = c0;

                    } else {

                        e12 = Interpolate.Interpolate2P2Q(c0, c5, 7, 1);
                        e21 = Interpolate.Interpolate2P2Q(c0, c7, 7, 1);
                        e22 = Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e01 = c0;
                        e02 = c0;

                    } else {

                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 7, 1);
                        e02 = Interpolate.Interpolate3P3Q(c1, c5, c0, 7, 7, 2);
                    }
                }
                
                break;

            case 255: {

                    e01 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e21 = c4;
                    e20 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1));
                    e22 = (Common.IsNotLike(c7, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    e02 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;
                
        }
        //endregion

        Pixel[1] = (e00);
        Pixel[2] = (e01);
        Pixel[3] = (e02);
        Pixel[4] = (e10);
        Pixel[5] = (e11);
        Pixel[6] = (e12);
        Pixel[7] = (e20);
        Pixel[8] = (e21);
        Pixel[9] = (e22);
    }
    //endregion

    //region standard LQ4x casepath
    Lq4xKernel(pattern, c0, c1, c2, c3, c4, c5, c6, c7, c8, Pixel) {

        var e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33;
        var e00 = e01 = e02 = e03 = e10 = e11 = e12 = e13 = e20 = e21 = e22 = e23 = e30 = e31 = e32 = e33 = c4;
        
        switch (pattern) {
            
            //region LQ4x PATTERNS

            case 0:
            case 2:
            case 4:
            case 6:
            case 8:
            case 12:
            case 16:
            case 20:
            case 24:
            case 28:
            case 32:
            case 34:
            case 36:
            case 38:
            case 40:
            case 44:
            case 48:
            case 52:
            case 56:
            case 60:
            case 64:
            case 66:
            case 68:
            case 70:
            case 96:
            case 98:
            case 100:
            case 102:
            case 128:
            case 130:
            case 132:
            case 134:
            case 136:
            case 140:
            case 144:
            case 148:
            case 152:
            case 156:
            case 160:
            case 162:
            case 164:
            case 166:
            case 168:
            case 172:
            case 176:
            case 180:
            case 184:
            case 188:
            case 192:
            case 194:
            case 196:
            case 198:
            case 224:
            case 226:
            case 228:
            case 230: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;
                }
                
                break;

            case 1:
            case 5:
            case 9:
            case 13:
            case 17:
            case 21:
            case 25:
            case 29:
            case 33:
            case 37:
            case 41:
            case 45:
            case 49:
            case 53:
            case 57:
            case 61:
            case 65:
            case 69:
            case 97:
            case 101:
            case 129:
            case 133:
            case 137:
            case 141:
            case 145:
            case 149:
            case 153:
            case 157:
            case 161:
            case 165:
            case 169:
            case 173:
            case 177:
            case 181:
            case 185:
            case 189:
            case 193:
            case 197:
            case 225:
            case 229: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                    e23 = c1;
                    e30 = c1;
                    e31 = c1;
                    e32 = c1;
                    e33 = c1;
                }
                
                break;

            case 3:
            case 35:
            case 67:
            case 99:
            case 131:
            case 163:
            case 195:
            case 227: {

                    e00 = c2;
                    e01 = c2;
                    e02 = c2;
                    e03 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e30 = c2;
                    e31 = c2;
                    e32 = c2;
                    e33 = c2;
                }
                
                break;

            case 7:
            case 39:
            case 71:
            case 103:
            case 135:
            case 167:
            case 199:
            case 231: {

                    e00 = c3;
                    e01 = c3;
                    e02 = c3;
                    e03 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e13 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    e23 = c3;
                    e30 = c3;
                    e31 = c3;
                    e32 = c3;
                    e33 = c3;
                }
                
                break;

            case 10:
            case 138: {
                
                    e02 = c0;
                    e03 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {
                        
                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                    }
                }
                
                break;

            case 11:
            case 27:
            case 75:
            case 139:
            case 155:
            case 203: {

                    e02 = c2;
                    e03 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e30 = c2;
                    e31 = c2;
                    e32 = c2;
                    e33 = c2;

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;
                        e10 = c2;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                    }
                }
                
                break;

            case 14:
            case 142: {

                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {
                        e00 = c0;
                        e01 = c0;
                        e02 = c0;
                        e03 = c0;
                        e10 = c0;
                        e11 = c0;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c3, 5, 3);
                        e02 = Interpolate.Interpolate2P2Q(c1, c0, 3, 1);
                        e03 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate3P3Q(c3, c0, c1, 2, 1, 1);
                        e11 = Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1);
                    }
                }
                
                break;

            case 15:
            case 143:
            case 207: {

                    e12 = c4;
                    e13 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e30 = c4;
                    e31 = c4;
                    e32 = c4;
                    e33 = c4;
                    
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c4;
                        e01 = c4;
                        e02 = c4;
                        e03 = c4;
                        e10 = c4;
                        e11 = c4;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c3, 5, 3);
                        e02 = Interpolate.Interpolate2P2Q(c1, c4, 3, 1);
                        e03 = Interpolate.Interpolate2P2Q(c4, c1, 3, 1);
                        e10 = Interpolate.Interpolate3P3Q(c3, c1, c4, 2, 1, 1);
                        e11 = Interpolate.Interpolate3P3Q(c4, c1, c3, 6, 1, 1);
                    }
                }
                
                break;

            case 18:
            case 22:
            case 30:
            case 50:
            case 54:
            case 62:
            case 86:
            case 118: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 19:
            case 51: {

                    e10 = c2;
                    e11 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e30 = c2;
                    e31 = c2;
                    e32 = c2;
                    e33 = c2;
                    
                    if (Common.IsNotLike(c1, c5)) {

                        e00 = c2;
                        e01 = c2;
                        e02 = c2;
                        e03 = c2;
                        e12 = c2;
                        e13 = c2;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 3, 1);
                        e02 = Interpolate.Interpolate2P2Q(c1, c5, 5, 3);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e12 = Interpolate.Interpolate3P3Q(c2, c1, c5, 6, 1, 1);
                        e13 = Interpolate.Interpolate3P3Q(c5, c1, c2, 2, 1, 1);
                    }
                }
                
                break;

            case 23:
            case 55:
            case 119: {

                    e10 = c3;
                    e11 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    e23 = c3;
                    e30 = c3;
                    e31 = c3;
                    e32 = c3;
                    e33 = c3;
                    
                    if (Common.IsNotLike(c1, c5)) {

                        e00 = c3;
                        e01 = c3;
                        e02 = c3;
                        e03 = c3;
                        e12 = c3;
                        e13 = c3;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c3, c1, 3, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c3, 3, 1);
                        e02 = Interpolate.Interpolate2P2Q(c1, c5, 5, 3);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e12 = Interpolate.Interpolate3P3Q(c3, c1, c5, 6, 1, 1);
                        e13 = Interpolate.Interpolate3P3Q(c5, c1, c3, 2, 1, 1);
                    }
                }
                
                break;

            case 26: {

                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 31:
            case 95: {

                    e11 = c4;
                    e12 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e30 = c4;
                    e31 = c4;
                    e32 = c4;
                    e33 = c4;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c4;
                        e01 = c4;
                        e10 = c4;
                    
                    } else {
                    
                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c4, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c4, 1, 1);
                    }
                    
                    if (Common.IsNotLike(c1, c5)) {
                    
                        e02 = c4;
                        e03 = c4;
                        e13 = c4;
                    
                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c1, c4, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c4, c5, 1, 1);
                    }
                }
                
                break;

            case 42:
            case 170: {

                    e02 = c0;
                    e03 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c0;
                        e01 = c0;
                        e10 = c0;
                        e11 = c0;
                        e20 = c0;
                        e30 = c0;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate3P3Q(c1, c0, c3, 2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c1, 5, 3);
                        e11 = Interpolate.Interpolate3P3Q(c0, c1, c3, 6, 1, 1);
                        e20 = Interpolate.Interpolate2P2Q(c3, c0, 3, 1);
                        e30 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }
                }
                
                break;

            case 43:
            case 171:
            case 187: {

                    e02 = c2;
                    e03 = c2;
                    e12 = c2;
                    e13 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e31 = c2;
                    e32 = c2;
                    e33 = c2;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e01 = c2;
                        e10 = c2;
                        e11 = c2;
                        e20 = c2;
                        e30 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate3P3Q(c1, c2, c3, 2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c1, 5, 3);
                        e11 = Interpolate.Interpolate3P3Q(c2, c1, c3, 6, 1, 1);
                        e20 = Interpolate.Interpolate2P2Q(c3, c2, 3, 1);
                        e30 = Interpolate.Interpolate2P2Q(c2, c3, 3, 1);
                    }
                }
                
                break;

            case 46:
            case 174: {

                    e02 = c0;
                    e03 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c0;
                        e01 = c0;
                        e10 = c0;
                    
                    } else {
                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }
                }
                
                break;

            case 47:
            case 175: {
                
                    e01 = c4;
                    e02 = c4;
                    e03 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e30 = c4;
                    e31 = c4;
                    e32 = c4;
                    e33 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                }
                
                break;

            case 58:
            case 154:
            case 186: {

                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c0;
                        e01 = c0;
                        e10 = c0;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 59: {

                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e30 = c2;
                    e31 = c2;
                    e32 = c2;
                    e33 = c2;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e01 = c2;
                        e10 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c2;
                        e03 = c2;
                        e13 = c2;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                    }
                }
                
                break;

            case 63: {

                    e01 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e30 = c4;
                    e31 = c4;
                    e32 = c4;
                    e33 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c5)) {
                    
                        e02 = c4;
                        e03 = c4;
                        e13 = c4;
                    
                    } else {
                    
                        e02 = Interpolate.Interpolate2P2Q(c1, c4, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c4, c5, 1, 1);
                    }
                }
                
                break;

            case 72:
            case 76:
            case 104:
            case 106:
            case 108:
            case 110:
            case 120:
            case 124: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e32 = c0;
                    e33 = c0;

                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {
                    
                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }
                }
                
                break;

            case 73:
            case 77:
            case 105:
            case 109:
            case 125: {
                
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e22 = c1;
                    e23 = c1;
                    e32 = c1;
                    e33 = c1;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e00 = c1;
                        e10 = c1;
                        e20 = c1;
                        e21 = c1;
                        e30 = c1;
                        e31 = c1;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c1, 3, 1);
                        e20 = Interpolate.Interpolate2P2Q(c3, c7, 5, 3);
                        e21 = Interpolate.Interpolate3P3Q(c1, c3, c7, 6, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate3P3Q(c7, c1, c3, 2, 1, 1);
                    }
                }
                
                break;

            case 74: {

                    e02 = c0;
                    e03 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                    }
                }
                
                break;

            case 78:
            case 202:
            case 206: {

                    e02 = c0;
                    e03 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }
                }
                
                break;

            case 79: {

                    e02 = c4;
                    e03 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e32 = c4;
                    e33 = c4;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c4;
                        e30 = c4;
                        e31 = c4;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c4, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c4, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c4;
                        e01 = c4;
                        e10 = c4;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c4, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c4, 1, 1);
                    }
                }
                
                break;

            case 80:
            case 208:
            case 210:
            case 216: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e30 = c0;
                    e31 = c0;

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 81:
            case 209:
            case 217: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                    e30 = c1;
                    e31 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c1;
                        e32 = c1;
                        e33 = c1;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c1, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 82:
            case 214:
            case 222: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e30 = c0;
                    e31 = c0;

                    if (Common.IsNotLike(c7, c5)) {
                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 83:
            case 115: {

                    e00 = c2;
                    e01 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e30 = c2;
                    e31 = c2;
                
                    if (Common.IsNotLike(c7, c5)) {
                
                        e23 = c2;
                        e32 = c2;
                        e33 = c2;
                
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c2, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c2, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c2;
                        e03 = c2;
                        e13 = c2;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                    }
                }
                
                break;

            case 84:
            case 212: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e30 = c0;
                    e31 = c0;

                    if (Common.IsNotLike(c7, c5)) {

                        e03 = c0;
                        e13 = c0;
                        e22 = c0;
                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {
                        e03 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e13 = Interpolate.Interpolate2P2Q(c5, c0, 3, 1);
                        e22 = Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1);
                        e23 = Interpolate.Interpolate2P2Q(c5, c7, 5, 3);
                        e32 = Interpolate.Interpolate3P3Q(c7, c0, c5, 2, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 85:
            case 213:
            case 221: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e20 = c1;
                    e21 = c1;
                    e30 = c1;
                    e31 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e03 = c1;
                        e13 = c1;
                        e22 = c1;
                        e23 = c1;
                        e32 = c1;
                        e33 = c1;
                    
                    } else {

                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 3, 1);
                        e13 = Interpolate.Interpolate2P2Q(c5, c1, 3, 1);
                        e22 = Interpolate.Interpolate3P3Q(c1, c5, c7, 6, 1, 1);
                        e23 = Interpolate.Interpolate2P2Q(c5, c7, 5, 3);
                        e32 = Interpolate.Interpolate3P3Q(c7, c1, c5, 2, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 87: {

                    e00 = c3;
                    e01 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    e30 = c3;
                    e31 = c3;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c3;
                        e32 = c3;
                        e33 = c3;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c3, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c3, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c3, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c3;
                        e03 = c3;
                        e13 = c3;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c3, c5, 1, 1);
                    }
                }
                
                break;

            case 88:
            case 248:
            case 250: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 89:
            case 93: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e21 = c1;
                    e22 = c1;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c1;
                        e30 = c1;
                        e31 = c1;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c1, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c1;
                        e32 = c1;
                        e33 = c1;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c1, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1);
                    }
                }
                
                break;

            case 90: {

                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 91: {

                    e11 = c2;
                    e12 = c2;
                    e21 = c2;
                    e22 = c2;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c2;
                        e30 = c2;
                        e31 = c2;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c2, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c2, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c2, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c2;
                        e32 = c2;
                        e33 = c2;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c2, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c2, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;
                        e10 = c2;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c2;
                        e03 = c2;
                        e13 = c2;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                    }
                }
                
                break;

            case 92: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    }
                }
                
                break;
                
            case 94: {

                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;

                    if (Common.IsNotLike(c7, c3)) {

                        e20 = c0;
                        e30 = c0;
                        e31 = c0;

                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 107:
            case 123: {

                    e02 = c2;
                    e03 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e32 = c2;
                    e33 = c2;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c2;
                        e30 = c2;
                        e31 = c2;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c2, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;
                        e10 = c2;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                    }
                }
                
                break;
                
            case 111: {

                    e01 = c4;
                    e02 = c4;
                    e03 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e32 = c4;
                    e33 = c4;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c4;
                        e30 = c4;
                        e31 = c4;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c3, c4, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c4, c7, 1, 1);
                    }

                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                }
                
                break;

            case 112:
            case 240: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e22 = c0;
                        e23 = c0;
                        e30 = c0;
                        e31 = c0;
                        e32 = c0;
                        e33 = c0;
                    
                    } else {

                        e22 = Interpolate.Interpolate3P3Q(c0, c5, c7, 6, 1, 1);
                        e23 = Interpolate.Interpolate3P3Q(c5, c0, c7, 2, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e31 = Interpolate.Interpolate2P2Q(c7, c0, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c7, c5, 5, 3);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 113:
            case 241: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e22 = c1;
                        e23 = c1;
                        e30 = c1;
                        e31 = c1;
                        e32 = c1;
                        e33 = c1;
                    
                    } else {

                        e22 = Interpolate.Interpolate3P3Q(c1, c5, c7, 6, 1, 1);
                        e23 = Interpolate.Interpolate3P3Q(c5, c1, c7, 2, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                        e31 = Interpolate.Interpolate2P2Q(c7, c1, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c7, c5, 5, 3);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 114: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e30 = c0;
                    e31 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c0;
                        e32 = c0;
                        e33 = c0;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 116: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e30 = c0;
                    e31 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c0;
                        e32 = c0;
                        e33 = c0;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    }
                }
                
                break;

            case 117: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                    e30 = c1;
                    e31 = c1;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c1;
                        e32 = c1;
                        e33 = c1;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c1, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1);
                    }
                }
                
                break;

            case 121: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e21 = c1;
                    e22 = c1;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c1;
                        e30 = c1;
                        e31 = c1;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c1, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c1;
                        e32 = c1;
                        e33 = c1;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c1, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1);
                    }
                }
                
                break;

            case 122: {

                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;

                    if (Common.IsNotLike(c7, c3)) {
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;

                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                        e33 = Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 126: {
                
                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 127: {

                    e01 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e32 = c4;
                    e33 = c4;

                    if (Common.IsNotLike(c7, c3)) {

                        e20 = c4;
                        e30 = c4;
                        e31 = c4;

                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c3, c4, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c4, c7, 1, 1);
                    }

                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c4;
                        e03 = c4;
                        e13 = c4;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c1, c4, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c4, c5, 1, 1);
                    }
                }
                
                break;

            case 146:
            case 150:
            case 178:
            case 182:
            case 190: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e12 = c0;
                        e13 = c0;
                        e23 = c0;
                        e33 = c0;

                    } else {

                        e02 = Interpolate.Interpolate3P3Q(c1, c0, c5, 2, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e12 = Interpolate.Interpolate3P3Q(c0, c1, c5, 6, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c5, c1, 5, 3);
                        e23 = Interpolate.Interpolate2P2Q(c5, c0, 3, 1);
                        e33 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 147:
            case 179: {

                    e00 = c2;
                    e01 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e30 = c2;
                    e31 = c2;
                    e32 = c2;
                    e33 = c2;

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c2;
                        e03 = c2;
                        e13 = c2;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c2, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c2, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c2, c5, 3, 1);
                    }
                }
                
                break;

            case 151:
            case 183: {

                    e00 = c3;
                    e01 = c3;
                    e02 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e13 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    e23 = c3;
                    e30 = c3;
                    e31 = c3;
                    e32 = c3;
                    e33 = c3;
                    e03 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 2, 1, 1));
                }
                
                break;

            case 158: {

                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c0;
                        e01 = c0;
                        e10 = c0;
                    
                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 159: {

                    e02 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e30 = c4;
                    e31 = c4;
                    e32 = c4;
                    e33 = c4;
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c4;
                        e01 = c4;
                        e10 = c4;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c4, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c4, 1, 1);
                    }

                    e03 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 191: {

                    e01 = c4;
                    e02 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e30 = c4;
                    e31 = c4;
                    e32 = c4;
                    e33 = c4;
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    e03 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 200:
            case 204:
            case 232:
            case 236:
            case 238: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e22 = c0;
                    e23 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e21 = c0;
                        e30 = c0;
                        e31 = c0;
                        e32 = c0;
                        e33 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate3P3Q(c3, c0, c7, 2, 1, 1);
                        e21 = Interpolate.Interpolate3P3Q(c0, c3, c7, 6, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c7, c3, 5, 3);
                        e32 = Interpolate.Interpolate2P2Q(c7, c0, 3, 1);
                        e33 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }
                }
                
                break;

            case 201:
            case 205: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e21 = c1;
                    e22 = c1;
                    e23 = c1;
                    e32 = c1;
                    e33 = c1;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c1;
                        e30 = c1;
                        e31 = c1;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c1, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c1, c7, 3, 1);
                    }
                }
                
                break;

            case 211: {

                    e00 = c2;
                    e01 = c2;
                    e02 = c2;
                    e03 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e30 = c2;
                    e31 = c2;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c2;
                        e32 = c2;
                        e33 = c2;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c2, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c2, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 215: {

                    e00 = c3;
                    e01 = c3;
                    e02 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e13 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    e30 = c3;
                    e31 = c3;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c3;
                        e32 = c3;
                        e33 = c3;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c3, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }

                    e03 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 2, 1, 1));
                }
                
                break;

            case 218: {

                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 219: {

                    e02 = c2;
                    e03 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e30 = c2;
                    e31 = c2;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c2;
                        e32 = c2;
                        e33 = c2;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c2, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c2, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;
                        e10 = c2;

                    } else {
                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                    }
                }
                
                break;

            case 220: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                        e30 = Interpolate.Interpolate3P3Q(c0, c3, c7, 2, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 3, 1);
                    }

                    if (Common.IsNotLike(c7, c5)) {

                        e23 = c0;
                        e32 = c0;
                        e33 = c0;

                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 223: {

                    e02 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e30 = c4;
                    e31 = c4;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c4;
                        e32 = c4;
                        e33 = c4;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c4, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c4, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c4;
                        e01 = c4;
                        e10 = c4;

                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c4, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c3, c4, 1, 1);
                    }

                    e03 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;

            case 233:
            case 237: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                    e23 = c1;
                    e31 = c1;
                    e32 = c1;
                    e33 = c1;
                    e30 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1));
                }
                
                break;

            case 234: {

                    e02 = c0;
                    e03 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e32 = c0;
                    e33 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c0;
                        e01 = c0;
                        e10 = c0;

                    } else {

                        e00 = Interpolate.Interpolate3P3Q(c0, c1, c3, 2, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e10 = Interpolate.Interpolate2P2Q(c0, c3, 3, 1);
                    }
                }
                
                break;

            case 235: {

                    e02 = c2;
                    e03 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e23 = c2;
                    e31 = c2;
                    e32 = c2;
                    e33 = c2;
                    e30 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c3)) {
                    
                        e00 = c2;
                        e01 = c2;
                        e10 = c2;
                    
                    } else {

                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                    }
                }
                
                break;

            case 239: {

                    e01 = c4;
                    e02 = c4;
                    e03 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e31 = c4;
                    e32 = c4;
                    e33 = c4;
                    e30 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                }
                
                break;

            case 242: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e30 = c0;
                    e31 = c0;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c0;
                        e32 = c0;
                        e33 = c0;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 3, 1);
                        e03 = Interpolate.Interpolate3P3Q(c0, c1, c5, 2, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 3, 1);
                    }
                }
                
                break;

            case 243: {

                    e00 = c2;
                    e01 = c2;
                    e02 = c2;
                    e03 = c2;
                    e10 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e20 = c2;
                    e21 = c2;
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e22 = c2;
                        e23 = c2;
                        e30 = c2;
                        e31 = c2;
                        e32 = c2;
                        e33 = c2;
                    
                    } else {

                        e22 = Interpolate.Interpolate3P3Q(c2, c5, c7, 6, 1, 1);
                        e23 = Interpolate.Interpolate3P3Q(c5, c2, c7, 2, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c2, c7, 3, 1);
                        e31 = Interpolate.Interpolate2P2Q(c7, c2, 3, 1);
                        e32 = Interpolate.Interpolate2P2Q(c7, c5, 5, 3);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 244: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                }
                
                break;

            case 245: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                    e23 = c1;
                    e30 = c1;
                    e31 = c1;
                    e32 = c1;
                    e33 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1));
                }
                
                break;

            case 246: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e20 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e30 = c0;
                    e31 = c0;
                    e32 = c0;
                    e33 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c1, c5)) {
                    
                        e02 = c0;
                        e03 = c0;
                        e13 = c0;
                    
                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 247: {

                    e00 = c3;
                    e01 = c3;
                    e02 = c3;
                    e10 = c3;
                    e11 = c3;
                    e12 = c3;
                    e13 = c3;
                    e20 = c3;
                    e21 = c3;
                    e22 = c3;
                    e23 = c3;
                    e30 = c3;
                    e31 = c3;
                    e32 = c3;
                    e33 = (Common.IsNotLike(c7, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c5, c7, 2, 1, 1));
                    e03 = (Common.IsNotLike(c1, c5)) ? (c3) : (Interpolate.Interpolate3P3Q(c3, c1, c5, 2, 1, 1));
                }
                
                break;

            case 249: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                    e31 = c1;
                    e30 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c1;
                        e32 = c1;
                        e33 = c1;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c1, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }
                }
                
                break;

            case 251: {

                    e02 = c2;
                    e03 = c2;
                    e11 = c2;
                    e12 = c2;
                    e13 = c2;
                    e20 = c2;
                    e21 = c2;
                    e22 = c2;
                    e31 = c2;
                    e30 = (Common.IsNotLike(c7, c3)) ? (c2) : (Interpolate.Interpolate3P3Q(c2, c3, c7, 2, 1, 1));
                    
                    if (Common.IsNotLike(c7, c5)) {
                    
                        e23 = c2;
                        e32 = c2;
                        e33 = c2;
                    
                    } else {

                        e23 = Interpolate.Interpolate2P2Q(c2, c5, 1, 1);
                        e32 = Interpolate.Interpolate2P2Q(c2, c7, 1, 1);
                        e33 = Interpolate.Interpolate2P2Q(c5, c7, 1, 1);
                    }

                    if (Common.IsNotLike(c1, c3)) {

                        e00 = c2;
                        e01 = c2;
                        e10 = c2;

                    } else {
                    
                        e00 = Interpolate.Interpolate2P2Q(c1, c3, 1, 1);
                        e01 = Interpolate.Interpolate2P2Q(c1, c2, 1, 1);
                        e10 = Interpolate.Interpolate2P2Q(c2, c3, 1, 1);
                    }
                }
                
                break;

            case 252: {

                    e00 = c0;
                    e01 = c0;
                    e02 = c0;
                    e03 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e13 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e32 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }

                    e33 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));
                }
                
                break;

            case 253: {

                    e00 = c1;
                    e01 = c1;
                    e02 = c1;
                    e03 = c1;
                    e10 = c1;
                    e11 = c1;
                    e12 = c1;
                    e13 = c1;
                    e20 = c1;
                    e21 = c1;
                    e22 = c1;
                    e23 = c1;
                    e31 = c1;
                    e32 = c1;
                    e30 = (Common.IsNotLike(c7, c3)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c3, c7, 2, 1, 1));
                    e33 = (Common.IsNotLike(c7, c5)) ? (c1) : (Interpolate.Interpolate3P3Q(c1, c5, c7, 2, 1, 1));
                }
                
                break;

            case 254: {

                    e00 = c0;
                    e01 = c0;
                    e10 = c0;
                    e11 = c0;
                    e12 = c0;
                    e21 = c0;
                    e22 = c0;
                    e23 = c0;
                    e32 = c0;
                    
                    if (Common.IsNotLike(c7, c3)) {
                    
                        e20 = c0;
                        e30 = c0;
                        e31 = c0;
                    
                    } else {

                        e20 = Interpolate.Interpolate2P2Q(c0, c3, 1, 1);
                        e30 = Interpolate.Interpolate2P2Q(c3, c7, 1, 1);
                        e31 = Interpolate.Interpolate2P2Q(c0, c7, 1, 1);
                    }

                    e33 = (Common.IsNotLike(c7, c5)) ? (c0) : (Interpolate.Interpolate3P3Q(c0, c5, c7, 2, 1, 1));

                    if (Common.IsNotLike(c1, c5)) {

                        e02 = c0;
                        e03 = c0;
                        e13 = c0;

                    } else {

                        e02 = Interpolate.Interpolate2P2Q(c0, c1, 1, 1);
                        e03 = Interpolate.Interpolate2P2Q(c1, c5, 1, 1);
                        e13 = Interpolate.Interpolate2P2Q(c0, c5, 1, 1);
                    }
                }
                
                break;

            case 255: {

                    e01 = c4;
                    e02 = c4;
                    e10 = c4;
                    e11 = c4;
                    e12 = c4;
                    e13 = c4;
                    e20 = c4;
                    e21 = c4;
                    e22 = c4;
                    e23 = c4;
                    e31 = c4;
                    e32 = c4;
                    e30 = (Common.IsNotLike(c7, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c3, c7, 2, 1, 1));
                    e33 = (Common.IsNotLike(c7, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c5, c7, 2, 1, 1));
                    e00 = (Common.IsNotLike(c1, c3)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c3, 2, 1, 1));
                    e03 = (Common.IsNotLike(c1, c5)) ? (c4) : (Interpolate.Interpolate3P3Q(c4, c1, c5, 2, 1, 1));
                }
                
                break;
        }
        //endregion

        Pixel[1] = (e00);
        Pixel[2] = (e01);
        Pixel[3] = (e02);
        Pixel[4] = (e03);
        Pixel[5] = (e10);
        Pixel[6] = (e11);
        Pixel[7] = (e12);
        Pixel[8] = (e13);
        Pixel[9] = (e20);
        Pixel[10] = (e21);
        Pixel[11] = (e22);
        Pixel[12] = (e23);
        Pixel[13] = (e30);
        Pixel[14] = (e31);
        Pixel[15] = (e32);
        Pixel[16] = (e33);
    }
    //endregion
    
}