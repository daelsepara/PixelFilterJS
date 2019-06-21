// 2D Digital Differential Analyzer (DDA)
// see: http://collaboration.cmc.ec.gc.ca/science/rpn/biblio/ddj/Website/articles/DDJ/1997/9704/9704d/9704d.htm
// original post: http://www.drdobbs.com/database/a-2-d-dda-algorithm-for-fast-image-scali/184410169
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = Math.max(1, scale);

        Init.Init(srcx, srcy, scale, scale, threshold);

		var src = this.ToArray(Input, srcx, srcy);
        var dst = new Uint32Array(Common.SizeX * Common.SizeY);
        
        this.ResizeDDA(src, dst, srcy, srcx, scale);

        this.ToImage(Common.ScaledImage, dst, Common.SizeX, Common.SizeY);
    }

    getline(src, y, cols, aspline) {

        for (var x = 0; x < cols; x++)
            aspline[x] = src[y * cols + x];
    }

    SetPixel(dst, cols, k, y, color) {

        dst[y * cols + k] = color;
    }

    ResizeDDA(src, dst, rows, cols, zoom) {

        var x, y;
        var ddax, dday, izoom, i, j, k;

        /* Calculate the differential amount */
        izoom = parseInt(1.0 / zoom * 1000);
        
        var dstx = parseInt(zoom * cols);

        /* Allocate a buffer for a scan line from original image, and a
        ** resized scan line */
        var aspline = new Uint32Array(parseInt(cols));
        var line = new Uint32Array(dstx + 1);

        y = 0;
        dday = 0;

        var total = rows;
        var current = 0;

        /* Loop over rows in the original image */
        for (i = 0; i < rows; i++) {
            
            /* Get a scan line from the original image (8-bit values expected) */
            this.getline(src, i, cols, aspline);

            /* Adjust the vertical accumulated differential, initialize the
            ** output X pixel and horizontal accumulated differential */
            dday -= 1000;
            x    = 0;
            ddax = 0;

            /* Loop over pixels in the original image */
            for (j = 0; j < cols; j++) {
                
                /* Adjust the horizontal accumulated differential */
                ddax -= 1000;
                
                while (ddax < 0) {
                    
                    /* Store values from original image scanline into the scaled
                    ** buffer until accumulated differential crosses threshold */
                    line[x] = aspline[j];
                    
                    x++;
                    
                    ddax += izoom;
                }
            }

            while (dday < 0) {

                /* The 'outer loop' -- output resized scan lines until the
                ** vertical threshold is crossed */
                dday += izoom;

                for (k = 0; k < x; k++) {

                    this.SetPixel(dst, dstx, k, y, line[k]);
                }
                
                y++;
            }

            current++;

            notify({ScalingProgress: current / total});
        }
    }

    // helper functions added to work with PixelFilter
	ToArray(Input, srcx, srcy) {

		var dst = new Uint32Array(srcx * srcy);

		var Channels = 4;

		for (var y = 0; y < srcy; y++) {

			for (var x = 0; x < srcx; x++) {

				var index = y * srcx + x;
				var pixel = index * Channels;

				var r = Input[pixel];
				var g = Input[pixel + 1];
				var b = Input[pixel + 2];
				var a = Input[pixel + 3];

				dst[index] = Common.ARGBINT(a, r, g, b);
			}
		}

		return dst;
    }
    
    ToImage(dst, src, srcx, srcy) {

		var Channels = 4;

		for (var y = 0; y < srcy; y++) {
			for (var x = 0; x < srcx; x++) {

				var index = y * srcx + x;
				var pixel = index * Channels;

				dst[pixel] = Common.Red(src[index]);
				dst[pixel + 1] = Common.Green(src[index]);
				dst[pixel + 2] = Common.Blue(src[index]);
				dst[pixel + 3] = Common.Alpha(src[index]);
			}
		}
	}
}