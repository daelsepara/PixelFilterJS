// simple and fast bresenham image scaler, no interpolation
// see: https://snipplr.com/view/67909/
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = Math.max(1, scale);

        Init.Init(srcx, srcy, scale, scale, threshold);

        var src = this.ToArray(Input, srcx, srcy);
        var dst = new Uint32Array(Common.SizeX * Common.SizeY);

        this.Resize(src, dst, srcx, srcy, Common.SizeX, Common.SizeY);

        this.ToImage(Common.ScaledImage, dst, Common.SizeX, Common.SizeY);

        notify({ ScalingProgress: 1.0 });
    }

    Resize(framebuffer, buffer, inpx, inpy, outx, outy) {

        var xint_part = parseInt(inpx / outx);
        var xfrac_part = parseInt(inpx % outx);

        var yint_part = parseInt(inpy / outy);
        var yfrac_part = parseInt(inpy % outy);
        var ye = 0;

        var dsty = 0;
        var xe = 0;

        var src = 0;
        var dst = 0;

        var prevy = dsty;

        var total = outy;
        var current = 0;

        while (dsty < outy) {

            var num_pixels = outx;

            var prevsrc = src;

            while (num_pixels-- > 0) {

                buffer[dst++] = framebuffer[src];

                src += xint_part;
                xe += xfrac_part;

                if (xe >= outx) {

                    xe -= outx;
                    src++;
                }
            }

            // use bresenham to increase line counter
            dsty += yint_part;
            ye += yfrac_part;

            if (ye >= outy) {

                ye -= outy;

                dsty++;

                current++;
            }

            if (dsty == prevy) {

                src = prevsrc;

            } else {

                prevy = dsty;
            }

            notify({ ScalingProgress: current / total * 0.8 });
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