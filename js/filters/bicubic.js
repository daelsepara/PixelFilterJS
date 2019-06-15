// Bicubic - see: https://blog.demofox.org/2015/08/15/resizing-images-with-bicubic-interpolation/
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(1, scale);
			
        Init.Init(srcx, srcy, scale, scale, false);

        var Channels = 4;
        var row = 0;

        for (var y = 0; y < Common.SizeY; ++y) {

            var destPixel = row;

            var v = parseFloat(y) / parseFloat(Common.SizeY - 1);
            
            for (var x = 0; x < Common.SizeX; ++x) {

                var u = parseFloat(x) / parseFloat(Common.SizeX - 1);
                var sample = this.SampleBicubic(Input, srcx, srcy, u, v);
    
                Common.ScaledImage[destPixel + 0] = sample[0];
                Common.ScaledImage[destPixel + 1] = sample[1];
                Common.ScaledImage[destPixel + 2] = sample[2];
                destPixel += Channels;
            }

            row += Common.SizeX * Channels;
        }
    }

    // t is a value that goes from 0 to 1 to interpolate in a C1 continuous way across uniformly sampled data points.
    // when t is 0, this will return B.  When t is 1, this will return C.  Inbetween values will return an interpolation
    // between B and C.  A and B are used to calculate slopes at the edges.
    CubicHermite (A, B, C, D, t) {

        var a = -A / 2.0 + (3.0 * B) / 2.0 - (3.0 * C) / 2.0 + D / 2.0;
        var b = A - (5.0 * B) / 2.0 + 2.0 * C - D / 2.0;
        var c = -A / 2.0 + C / 2.0;
        var d = B;
    
        return a*t*t*t + b*t*t + c*t + d;
    }

    getByte(val, N) {

		return (val >>> (8 * N)) & 0xff;
	}

    SampleBicubic (src, srcx, srcy, u, v) {

        // calculate coordinates -> also need to offset by half a pixel to keep image from shifting down and left half a pixel
        var x = (u * srcx) - 0.5;
        var xint = parseInt(x);
        var xfract = x - Math.floor(x);
    
        var y = (v * srcy) - 0.5;
        var yint = parseInt(y);
        var yfract = y - Math.floor(y);
    
        // 1st row
        var p00 = Common.CLR(src, srcx, srcy, xint, yint, -1, -1);
        var p10 = Common.CLR(src, srcx, srcy, xint, yint, 0, -1);
        var p20 = Common.CLR(src, srcx, srcy, xint, yint, 1, -1);
        var p30 = Common.CLR(src, srcx, srcy, xint, yint, 2, -1);
    
        // 2nd row
        var p01 = Common.CLR(src, srcx, srcy, xint, yint, -1, 0);
        var p11 = Common.CLR(src, srcx, srcy, xint, yint, 0, 0);
        var p21 = Common.CLR(src, srcx, srcy, xint, yint, 1, 0);
        var p31 = Common.CLR(src, srcx, srcy, xint, yint, 2, 0);
    
        // 3rd row
        var p02 = Common.CLR(src, srcx, srcy, xint, yint, -1, 1);
        var p12 = Common.CLR(src, srcx, srcy, xint, yint, 0, 1);
        var p22 = Common.CLR(src, srcx, srcy, xint, yint, 1, 1);
        var p32 = Common.CLR(src, srcx, srcy, xint, yint, 2, 1);
    
        // 4th row
        var p03 = Common.CLR(src, srcx, srcy, xint, yint, -1, 2);
        var p13 = Common.CLR(src, srcx, srcy, xint, yint, 0, 2);
        var p23 = Common.CLR(src, srcx, srcy, xint, yint, 1, 2);
        var p33 = Common.CLR(src, srcx, srcy, xint, yint, 2, 2);
    
        // interpolate bi-cubically!
        // Clamp the values since the curve can put the value below 0 or above 255
        var ret = new Uint8ClampedArray(3);

        for (var i = 0; i < 3; ++i) {

            var col0 = this.CubicHermite(this.getByte(p00, i), this.getByte(p10, i), this.getByte(p20, i), this.getByte(p30, i), xfract);
            var col1 = this.CubicHermite(this.getByte(p01, i), this.getByte(p11, i), this.getByte(p21, i), this.getByte(p31, i), xfract);
            var col2 = this.CubicHermite(this.getByte(p02, i), this.getByte(p12, i), this.getByte(p22, i), this.getByte(p32, i), xfract);
            var col3 = this.CubicHermite(this.getByte(p03, i), this.getByte(p13, i), this.getByte(p23, i), this.getByte(p33, i), xfract);
            var value = this.CubicHermite(col0, col1, col2, col3, yfract);
            
            ret[2 - i] = value;
        }

        return ret;
    }
}