// simple and fast bresenham image scaler, no interpolation
// see: https://snipplr.com/view/67909/
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = Math.max(1, scale);

        Init.Init(srcx, srcy, scale, scale, threshold);

        var src = Common.ToArray(Input, srcx, srcy);
        var dst = new Uint32Array(Common.SizeX * Common.SizeY);

        this.Resize(src, dst, srcx, srcy, Common.SizeX, Common.SizeY);

        Common.ToImage(Common.ScaledImage, dst, Common.SizeX, Common.SizeY);

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
}