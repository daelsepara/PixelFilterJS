// Lior Halphon's Omniscale (Modified: Uses Maxim Stepin's Color comparison routine)
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        var Channels = 4;

        scale = Math.max(1, scale);
			
        Init.Init(srcx, srcy, scale, scale, threshold);
        
        var total = Common.SizeY;
        var current = 0;

        for (var y = 0; y < Common.SizeY; y++) {

            var offset = y * Common.SizeX;
            var positiony = y / Common.SizeY;

            for (var x = 0; x < Common.SizeX; x++) {

                var argb = this.ScaleImage(Input, x / Common.SizeX, positiony, srcx, srcy, Common.SizeX, Common.SizeY);

                Common.ScaledImage[(offset + x) * Channels] = Common.Red(argb);
                Common.ScaledImage[(offset + x) * Channels + 1] = Common.Green(argb);
                Common.ScaledImage[(offset + x) * Channels + 2] = Common.Blue(argb);
                Common.ScaledImage[(offset + x) * Channels + 3] = Common.Alpha(argb);
            }

            current++;

            notify({ScalingProgress: current / total});
        }
    }
    
    is_different(a, b) {

        return Common.IsNotLike(a, b);
    }

    mix(x, y, a) {

        return Interpolate.Interpolate2P1Q(x, y, a);
    }

    fract(x) {

        return x - Math.floor(x);
    }    

    P(pattern, m, r) {

        return ((pattern & (m)) == (r))
    }

    Mul(x, y) {

        var r = Common.Red(x) * y;
        var g = Common.Green(x) * y;
        var b = Common.Blue(x) * y;
        var a = Common.Alpha(x) * y;

        return Common.ARGBINT(a, r, g, b);
    }
    
    Add(x, y, scale) {

        var r = (Common.Red(x) + Common.Red(y)) * scale;
        var g = (Common.Green(x) + Common.Green(y)) * scale;
        var b = (Common.Blue(x) + Common.Blue(y)) * scale;
        var a = (Common.Alpha(x) + Common.Alpha(y)) * scale;

        return Common.ARGBINT(a, r, g, b);
    }

    length(a, b) {

        return Math.sqrt(a * a + b * b);
    }

    ScaleImage(image, ppx, ppy, srcx, srcy, dstx, dsty) {

        var ox = 1.0 / srcx;
        var oy = 1.0 / srcy;

        var px = this.fract(ppx * srcx);
        var py = this.fract(ppy * srcy);

        if (px > 0.5) {
            
            ox = -ox;
            px = 1.0 - px;
        }
        
        if (py > 0.5) {
            
            oy = -oy;
            py = 1.0 - py;
        }

        // convert texture coordinates to image coordinates
        ox = parseInt(ox * srcx);
        oy = parseInt(oy * srcy);

        var positionx = parseInt(ppx * srcx);
        var positiony = parseInt(ppy * srcy);

        var w0 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox, -oy);
        var w1 = Common.CLR(image, srcx, srcy, positionx, positiony, 0, -oy);
        var w2 = Common.CLR(image, srcx, srcy, positionx, positiony, ox, -oy);
        var w3 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox, 0);
        var w4 = Common.CLR(image, srcx, srcy, positionx, positiony, 0,  0);
        var w5 = Common.CLR(image, srcx, srcy, positionx, positiony, ox, 0);
        var w6 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox, oy);
        var w7 = Common.CLR(image, srcx, srcy, positionx, positiony, 0,  oy);
        var w8 = Common.CLR(image, srcx, srcy, positionx, positiony, ox, oy);

        var pattern = 0;
        
        if (this.is_different(w0, w4)) pattern |= (1 << 0);
        if (this.is_different(w1, w4)) pattern |= (1 << 1);
        if (this.is_different(w2, w4)) pattern |= (1 << 2);
        if (this.is_different(w3, w4)) pattern |= (1 << 3);
        if (this.is_different(w5, w4)) pattern |= (1 << 4);
        if (this.is_different(w6, w4)) pattern |= (1 << 5);
        if (this.is_different(w7, w4)) pattern |= (1 << 6);
        if (this.is_different(w8, w4)) pattern |= (1 << 7);

        if ((this.P(pattern, 0xbf, 0x37) || this.P(pattern, 0xdb, 0x13)) && this.is_different(w1, w5))
            return this.mix(w4, w3, 0.5 - px);
        
        if ((this.P(pattern, 0xdb, 0x49) || this.P(pattern, 0xef, 0x6d)) && this.is_different(w7, w3))
            return this.mix(w4, w1, 0.5 - py);
        
        if ((this.P(pattern, 0x0b, 0x0b) || this.P(pattern, 0xfe, 0x4a) || this.P(pattern, 0xfe, 0x1a)) && this.is_different(w3, w1))
            return w4;
        
        if ((this.P(pattern, 0x6f, 0x2a) || this.P(pattern, 0x5b, 0x0a) || this.P(pattern, 0xbf, 0x3a) || this.P(pattern, 0xdf, 0x5a) || this.P(pattern, 0x9f, 0x8a) || this.P(pattern, 0xcf, 0x8a) || this.P(pattern, 0xef, 0x4e) || this.P(pattern, 0x3f, 0x0e) ||
            this.P(pattern, 0xfb, 0x5a) || this.P(pattern, 0xbb, 0x8a) || this.P(pattern, 0x7f, 0x5a) || this.P(pattern, 0xaf, 0x8a) || this.P(pattern, 0xeb, 0x8a)) && this.is_different(w3, w1))
            return this.mix(w4, this.mix(w4, w0, 0.5 - px), 0.5 - py);
        
        if (this.P(pattern, 0x0b, 0x08))
            return this.mix(this.mix(this.Mul(w0, 0.375) + this.Mul(w1, 0.25) + this.Mul(w4, 0.375), this.Mul(w4, 0.5) + this.Mul(w1, 0.5), px * 2.0), w4, py * 2.0);

        if (this.P(pattern, 0x0b, 0x02))
            return this.mix(this.mix(this.Mul(w0, 0.375) + this.Mul(w3, 0.25) + this.Mul(w4, 0.375), this.Mul(w4, 0.5) + this.Mul(w3, 0.5), py * 2.0), w4, px * 2.0);
        
        var r, dist, pixel_size;
        
        if (this.P(pattern, 0x2f, 0x2f)) {

            dist = this.length(px - 0.5, py - 0.5);
            pixel_size = this.length(1.0 / (dstx / srcx), 1.0 / (dsty / srcy));
            
            if (dist < 0.5 - pixel_size / 2) {
                
                return w4;
            }

            if (this.is_different(w0, w1) || this.is_different(w0, w3)) {
                
                r = this.mix(w1, w3, py - px + 0.5);
            
            } else {

                r = this.mix(this.mix(this.Mul(w1, 0.375) + this.Mul(w0, 0.25) + this.Mul(w3, 0.375), w3, py * 2.0), w1, px * 2.0);
            }

            if (dist > 0.5 + pixel_size / 2) {

                return r;
            }

            return this.mix(w4, r, (dist - 0.5 + pixel_size / 2) / pixel_size);
        }

        if (this.P(pattern, 0xbf, 0x37) || this.P(pattern, 0xdb, 0x13)) {
            
            dist = px - 2.0 * py;
            pixel_size = this.length(1.0 / (dstx / srcx), 1.0 / (dsty / srcy)) * Math.sqrt(5.0);
            
            if (dist > pixel_size / 2) {

                return w1;
            }

            r = this.mix(w3, w4, px + 0.5);

            if (dist < -pixel_size / 2) {
                
                return r;
            }

            return this.mix(r, w1, (dist + pixel_size / 2) / pixel_size);
        }

        if (this.P(pattern, 0xdb, 0x49) || this.P(pattern, 0xef, 0x6d)) {

            dist = py - 2.0 * px;
            pixel_size = this.length(1.0 / (dstx / srcx), 1.0 / (dsty / srcy)) * Math.sqrt(5.0);
            
            if (py - 2.0 * px > pixel_size / 2) {
                
                return w3;
            }

            r = this.mix(w1, w4, px + 0.5);

            if (dist < -pixel_size / 2) {
                
                return r;
            }
            
            return this.mix(r, w3, (dist + pixel_size / 2) / pixel_size);
        }

        if (this.P(pattern, 0xbf,0x8f) || this.P(pattern, 0x7e,0x0e)) {

            dist = px + 2.0 * py;

            pixel_size = this.length(1.0 / (dstx / srcx), 1.0 / (dsty / srcy)) * Math.sqrt(5.0);
    
            if (dist > 1.0 + pixel_size / 2) {
                
                return w4;
            }
    
            if (this.is_different(w0, w1) || this.is_different(w0, w3)) {
                
                r = this.mix(w1, w3, py - px + 0.5);
            
            } else {
                
                r = this.mix(this.mix(this.Mul(w1, 0.375) + this.Mul(w0, 0.25) + this.Mul(w3, 0.375), w3, py * 2.0), w1, px * 2.0);
            }
    
            if (dist < 1.0 - pixel_size / 2) {

                return r;
            }
    
            return this.mix(r, w4, (dist + pixel_size / 2 - 1.0) / pixel_size);    
        }

        if (this.P(pattern, 0x7e, 0x2a) || this.P(pattern, 0xef, 0xab)) {

            dist = py + 2.0 * px;
            pixel_size = this.length(1.0 / (dstx / srcx), 1.0 / (dsty / srcy)) * Math.sqrt(5.0);
    
            if (py + 2.0 * px > 1.0 + pixel_size / 2) {
                
                return w4;
            }
    
            if (this.is_different(w0, w1) || this.is_different(w0, w3)) {

                r = this.mix(w1, w3, py - px + 0.5);
            
            } else {

                r = this.mix(this.mix(this.Mul(w1, 0.375) + this.Mul(w0, 0.25) + this.Mul(w3, 0.375), w3, py * 2.0), w1, px * 2.0);
            }
    
            if (dist < 1.0 - pixel_size / 2) {

                return r;
            }
    
            return this.mix(r, w4, (dist + pixel_size / 2 - 1.0) / pixel_size);
        }
    
        if (this.P(pattern, 0x1b, 0x03) || this.P(pattern, 0x4f, 0x43) || this.P(pattern, 0x8b, 0x83) || this.P(pattern, 0x6b, 0x43))
            return this.mix(w4, w3, 0.5 - px);
    
        if (this.P(pattern, 0x4b, 0x09) || this.P(pattern, 0x8b, 0x89) || this.P(pattern, 0x1f, 0x19) || this.P(pattern, 0x3b, 0x19))
            return this.mix(w4, w1, 0.5 - py);
    
        if (this.P(pattern, 0xfb,0x6a) || this.P(pattern, 0x6f,0x6e) || this.P(pattern, 0x3f,0x3e) || this.P(pattern, 0xfb,0xfa) || this.P(pattern, 0xdf,0xde) || this.P(pattern, 0xdf,0x1e))
            return this.mix(w4, w0, (1.0 - px - py) / 2.0);
    
        if (this.P(pattern, 0x4f,0x4b) || this.P(pattern, 0x9f,0x1b) || this.P(pattern, 0x2f,0x0b) || this.P(pattern, 0xbe,0x0a) || this.P(pattern, 0xee,0x0a) || this.P(pattern, 0x7e,0x0a) || this.P(pattern, 0xeb,0x4b) || this.P(pattern, 0x3b,0x1b)) {

            dist = px + py;
            pixel_size = this.length(1.0 / (dstx / srcx), 1.0 / (dsty / srcy));
    
            if (dist > 0.5 + pixel_size / 2) {

                return w4;
            }
    
            if (this.is_different(w0, w1) || this.is_different(w0, w3)) {
                
                r = this.mix(w1, w3, py - px + 0.5);
            
            } else {

                r = this.mix(this.mix(this.Mul(w1, 0.375) + this.Mul(w0, 0.25) + this.Mul(w3, 0.375), w3, py * 2.0), w1, px * 2.0);
            }
    
            if (dist < 0.5 - pixel_size / 2) {

                return r;
            }
    
            return this.mix(r, w4, (dist + pixel_size / 2 - 0.5) / pixel_size);
        }
    
        if (this.P(pattern, 0x0b, 0x01))
            return this.mix(this.mix(w4, w3, 0.5 - px), this.mix(w1, this.Add(w1,  w3, 0.5), 0.5 - px), 0.5 - py);
    
        if (this.P(pattern, 0x0b, 0x00))
            return this.mix(this.mix(w4, w3, 0.5 - px), this.mix(w1, w0, 0.5 - px), 0.5 - py);
    
        dist = px + py;
        pixel_size = this.length(1.0 / (dstx / srcx), 1.0 / (dsty / srcy));
    
        if (dist > 0.5 + pixel_size / 2)
            return w4;

        /* We need more samples to "solve" this diagonal */
        var x0 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox * 2.0, -oy);
        var x1 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox, -oy * 2.0);
        var x2 = Common.CLR(image, srcx, srcy, positionx, positiony, 0.0, -oy * 2.0);
        var x3 = Common.CLR(image, srcx, srcy, positionx, positiony, ox, -oy * 2.0);
        var x4 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox * 2.0, -oy);
        var x5 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox * 2.0,  0.0);
        var x6 = Common.CLR(image, srcx, srcy, positionx, positiony, -ox * 2.0,  oy);

        if (this.is_different(x0, w4)) pattern |= 1 << 8;
        if (this.is_different(x1, w4)) pattern |= 1 << 9;
        if (this.is_different(x2, w4)) pattern |= 1 << 10;
        if (this.is_different(x3, w4)) pattern |= 1 << 11;
        if (this.is_different(x4, w4)) pattern |= 1 << 12;
        if (this.is_different(x5, w4)) pattern |= 1 << 13;
        if (this.is_different(x6, w4)) pattern |= 1 << 14;

        var diagonal_bias = -7;
        
        while (pattern != 0) {
            
            diagonal_bias += pattern & 1;
            pattern >>= 1;
        }

        if (diagonal_bias <=  0) {
            
            r = this.mix(w1, w3, py - px + 0.5);

            if (dist < 0.5 - pixel_size / 2) {
                
                return r;
            }
            
            return this.mix(r, w4, (dist + pixel_size / 2 - 0.5) / pixel_size);
        }

        return w4;            
    }
}