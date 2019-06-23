// AAScale2x
// see: https://github.com/LIJI32/SameBoy
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

                var argb;

                switch (scale) {

                    case 4:

                        argb = this.aascale4x(Input, x / Common.SizeX, positiony, srcx, srcy, scale);

                        break;

                    default:

                        argb = this.aascale2x(Input, x / Common.SizeX, positiony, srcx, srcy, scale);

                        break;
                }

                Common.ScaledImage[(offset + x) * Channels] = Common.Red(argb);
                Common.ScaledImage[(offset + x) * Channels + 1] = Common.Green(argb);
                Common.ScaledImage[(offset + x) * Channels + 2] = Common.Blue(argb);
                Common.ScaledImage[(offset + x) * Channels + 3] = Common.Alpha(argb);
            }

            current++;

            notify({ ScalingProgress: current / total });
        }
    }

    equal(a, b) {

        return Common.IsLike(a, b);
    }

    inequal(a, b) {

        return Common.IsNotLike(a, b);
    }

    fract(x) {

        return x - Math.floor(x);
    }

    mix(a, b, c) {

        return Interpolate.Interpolate2P1Q(a, b, c);
    }

    scale2x(image, ppx, ppy, srcx, srcy, scale_factor) {

        // o = offset, the width of a pixel
        var ox = 1.0 / (scale_factor * srcx);
        var oy = 1.0 / (scale_factor * srcy);

        var px = this.fract(ppx * srcx);
        var py = this.fract(ppy * srcy);

        // texel arrangement
        // A B C
        // D E F
        // G H I

        var B = Common.CLR(image, srcx, srcy, parseInt((ppx) * srcx), parseInt((ppy - oy) * srcy), 0, 0);
        var D = Common.CLR(image, srcx, srcy, parseInt((ppx - ox) * srcx), parseInt((ppy) * srcy), 0, 0);
        var E = Common.CLR(image, srcx, srcy, parseInt((ppx) * srcx),  parseInt((ppy) * srcy), 0, 0);
        var F = Common.CLR(image, srcx, srcy, parseInt((ppx + ox) * srcx),  parseInt((ppy) * srcy), 0, 0);
        var H = Common.CLR(image, srcx, srcy, parseInt((ppx) * srcx),  parseInt((ppy + oy) * srcy), 0, 0);

        // p = the position within a pixel [0...1]
        if (px > .5) {

            if (py > .5) {

                // Top Right
                return this.equal(B, F) && this.inequal(B, D) && this.inequal(F, H) ? F : E;

            } else {

                // Bottom Right
                return this.equal(H, F) && this.inequal(D, H) && this.inequal(B, F) ? F : E;
            }

        } else {

            if (py > .5) {

                // Top Left
                return this.equal(D, B) && this.inequal(B, F) && this.inequal(D, H) ? D : E;

            } else {

                // Bottom Left
                return this.equal(D, H) && this.inequal(D, B) && this.inequal(H, F) ? D : E;
            }
        }
    }

    aascale2x(image, ppx, ppy, srcx, srcy, scale_factor) {

        var texture = Common.CLR(image, srcx, srcy, parseInt(ppx * srcx), parseInt(ppy * srcy), 0, 0);

        return this.mix(texture, this.scale2x(image, ppx, ppy, srcx, srcy, scale_factor), 0.5);
    }

    aascale4x(image, ppx, ppy, srcx, srcy, scale_factor) {

        // o = offset, the width of a pixel
        var ox = 1.0 / (scale_factor * srcx);
        var oy = 1.0 / (scale_factor * srcy);

        // texel arrangement
        // A B C
        // D E F
        // G H I

        var B = this.aascale2x(image, ppx, ppy - oy, srcx, srcy, scale_factor);
        var D = this.aascale2x(image, ppx - ox, ppy, srcx, srcy, scale_factor);
        var E = this.aascale2x(image, ppx, ppy, srcx, srcy, scale_factor);
        var F = this.aascale2x(image, ppx + ox, ppy, srcx, srcy, scale_factor);
        var H = this.aascale2x(image, ppx, ppy + oy, srcx, srcy, scale_factor);

        var R;

        // p = the position within a pixel [0...1]
        var px = this.fract(ppx * srcx);
        var py = this.fract(ppy * srcy);

        if (px > .5) {

            if (py > .5) {

                // Top Right
                R = this.equal(B, F) && this.inequal(B, D) && this.inequal(F, H) ? F : E;

            } else {

                // Bottom Right
                R = this.equal(H, F) && this.inequal(D, H) && this.inequal(B, F) ? F : E;
            }
        } else {

            if (py > .5) {

                // Top Left
                R = this.equal(D, B) && this.inequal(B, F) && this.inequal(D, H) ? D : E;

            } else {

                // Bottom Left
                R = this.equal(D, H) && this.inequal(D, B) && this.inequal(H, F) ? D : E;
            }
        }

        return this.mix(R, E, 0.5);
    }
}