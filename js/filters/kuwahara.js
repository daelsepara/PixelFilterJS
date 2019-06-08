// Kuwahara Filter (nxn window)
class Filter {

    varmin(varr, srcx, srcy, min, dstx, dsty) {

		if (varr < min) {

			min = varr;
			dstx = srcx;
			dsty = srcy;
        }
        
        return {min: min, dstx: dstx, dsty: dsty};
    }
    
    Kuwahara(Input, srcx, srcy, win) {

		var Channels = 4;
		
		var pad = (win + 1) / 2;
		var ofs = (win - 1) / 2;
		var fx = srcx + ofs;
		var fy = srcy + ofs;
		
		var fxy = fx * fy;
		var mean = new Array(fxy);
		var variance = new Array(fxy);
		
		var sum, varr;
        var n;
        var ys, xs;

		for (ys = -ofs; ys < srcy; ys++) {
			for (xs = -ofs; xs < srcx; xs++) {

				sum = 0.0;
				varr = 0.0;
				n = 0;

				for (var xf = xs; xf < xs + pad; xf++) {
					for (var yf = ys; yf < ys + pad; yf++) {

						var val = parseFloat(Common.Luminance(Common.CLR(Input, srcx, srcy, xf, yf, 0, 0)));

						sum += val;
						varr += val * val;

						n++;
					}
				}

				var index = (ys + ofs) * fx + xs + ofs;

				mean[index] = sum / n;
				variance[index] = varr - sum * mean[index];
			}
		}

		var xc = 0, yc = 0;

		var min, result;

		for (var y = 0; y < srcy; y++) {

			var yy = y * srcx;

			for (var x = 0; x < srcx; x++) {

				min = Number.MAX_VALUE;

				var yo = y + ofs;
				var xo = x + ofs;
				var yx1 = y * fx + x;
				var yx2 = yo * fx + x;
				
                result = this.varmin(variance[yx1], x, y, min, xc, yc);
                min = result.min, xc = result.dstx, yc = result.dsty;
                
                result = this.varmin(variance[yx2], x, yo, min, xc, yc);
                min = result.min, xc = result.dstx, yc = result.dsty;

                result = this.varmin(variance[yx1 + ofs], xo, y, min, xc, yc);
                min = result.min, xc = result.dstx, yc = result.dsty;

                result = this.varmin(variance[yx2 + ofs], xo, yo, min, xc, yc);
                min = result.min, xc = result.dstx, yc = result.dsty;
                
				var dst = (yy + x) * Channels;

				// YUV to RGB (ITU-R) see https://en.wikipedia.org/wiki/YUV
				var pixel = Common.CLR(Input, srcx, srcy, x, y, 0, 0);

				var luminance = mean[yc * fx + xc] + 0.5;
				var cr = parseFloat(Common.ChromaU(pixel));
				var cb = parseFloat(Common.ChromaV(pixel));
				var crr = (cr - 127.5);
				var cbb = (cb - 127.5);

				Common.ScaledImage[dst] = Common._Clip8(parseInt(luminance + 1.042 * crr));
				Common.ScaledImage[dst + 1] = Common._Clip8(parseInt(luminance - 0.344 * cbb - 0.714 * crr));
				Common.ScaledImage[dst + 2] = Common._Clip8(parseInt(luminance + 1.772 * cbb));
			}
		}
	}

    Apply(Input, srcx, srcy, win) {

        win = Math.max(3, win);
        
        Init.Init(srcx, srcy, 1, 1, false);

        this.Kuwahara(Input, srcx, srcy, win);
    }
}