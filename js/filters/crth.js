// CRT (Horizontal Scanlines)
// https://github.com/LIJI32/SameBoy/blob/master/Shaders/CRT.fsh
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

                var argb = this.scale(Input, x / Common.SizeX, positiony, srcx, srcy);

                Common.ScaledImage[(offset + x) * Channels] = Common.Red(argb);
                Common.ScaledImage[(offset + x) * Channels + 1] = Common.Green(argb);
                Common.ScaledImage[(offset + x) * Channels + 2] = Common.Blue(argb);
                Common.ScaledImage[(offset + x) * Channels + 3] = Common.Alpha(argb);
            }

            current++;

            notify({ ScalingProgress: current / total });
        }
    }

    fract(x) {

        return x - Math.floor(x);
    }

    mix(a, b, c) {

        return Interpolate.Interpolate2P1Q(a, b, c);
    }

    Mul(x, y) {

        var r = Common.Red(x) * y;
        var g = Common.Green(x) * y;
        var b = Common.Blue(x) * y;
        var a = Common.Alpha(x) * y;

        return Common.ARGBINT(a, r, g, b);
    }

    scale(image, ppx, ppy, srcx, srcy) {

        const COLOR_LOW = 0.7;
        const COLOR_HIGH = 1.0;
        const HORIZONTAL_BORDER_DEPTH = 0.6;
        const SCANLINE_DEPTH = 0.3;
        const CURVENESS = 0.3;

        /* Curve and pixel ratio */
        var y_curve = Math.cos(ppx - 0.5) * CURVENESS + (1 - CURVENESS);
        var y_multiplier = 8.0 / 7.0 / y_curve;

        ppy *= y_multiplier;
        ppy -= (y_multiplier - 1) / 2;

        if (ppy < 0.0) return Common.ARGBINT(0, 0, 0, 0);
        if (ppy > 1.0) return Common.ARGBINT(0, 0, 0, 0);

        var x_curve = Math.cos(ppy - 0.5) * CURVENESS + (1 - CURVENESS);
        var x_multiplier = 1 / x_curve;

        ppx *= x_multiplier;
        ppx -= (x_multiplier - 1) / 2;

        if (ppx < 0.0) return Common.ARGBINT(0, 0, 0, 0);
        if (ppx > 1.0) return Common.ARGBINT(0, 0, 0, 0);

        var posx = this.fract(ppx * srcx);
        var posy = this.fract(ppy * srcy);
        var sub_posx = this.fract(ppx * srcx * 6);
        var sub_posy = this.fract(ppy * srcy * 6);

        var positionx = parseInt(ppx * srcx);
        var positiony = parseInt(ppy * srcy);

        var center = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 0);
        var up = Common.CLR(image, srcx, srcy, positionx, positiony, 0, -1);
        var down = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 1);

        /* Vertical blurring */
        if (posx < 1.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, -1, 0), 0.5 - sub_posx / 2.0);
            up = this.mix(up, Common.CLR(image, srcx, srcy, positionx, positiony, -1, -1), 0.5 - sub_posx / 2.0);
            down = this.mix(down, Common.CLR(image, srcx, srcy, positionx, positiony, -1, 1), 0.5 - sub_posx / 2.0);

        } else if (posx > 5.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, 1, 0), sub_posx / 2.0);
            up = this.mix(up, Common.CLR(image, srcx, srcy, positionx, positiony, 1, -1), sub_posx / 2.0);
            down = this.mix(down, Common.CLR(image, srcx, srcy, positionx, positiony, 1, 1), sub_posx / 2.0);
        }

        /* Scanlines */
        var scanline_multiplier;

        if (posx < 0.5) {

            scanline_multiplier = (posx * 2) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH);

        } else {

            scanline_multiplier = ((1 - posx) * 2) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH);
        }

        this.Mul(center, scanline_multiplier);
        this.Mul(up, scanline_multiplier);
        this.Mul(down, scanline_multiplier);

        /* Vertical seperator for shadow masks */
        var odd = (ppy * srcy) & 1;

        var gradient_position;

        if (odd) {

            posx += 0.5;
            posx = this.fract(posx);
        }

        if (posx < 1.0 / 3.0) {

            gradient_position = posx * 3.0;

            this.Mul(center, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
            this.Mul(up, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
            this.Mul(down, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));

        } else if (posx > 2.0 / 3.0) {

            gradient_position = (1 - posx) * 3.0;

            this.Mul(center, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
            this.Mul(up, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
            this.Mul(down, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
        }

        /* Blur the edges of the separators of adjacent columns */
        if (posy < 1.0 / 6.0 || posy > 5.0 / 6.0) {

            posx += 0.5;
            posx = this.fract(posx);

            if (posx < 1.0 / 3.0) {

                gradient_position = posx * 3.0;

                if (posy < 0.5) {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (posy) * 6.0);

                } else {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (1 - posy) * 6.0);
                }

                this.Mul(center, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
                this.Mul(up, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
                this.Mul(down, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));

            } else if (posx > 2.0 / 3.0) {

                gradient_position = (1 - posx) * 3.0;

                if (posy < 0.5) {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (posy) * 6.0);

                } else {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (1 - posy) * 6.0);
                }

                this.Mul(center, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
                this.Mul(up, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
                this.Mul(down, gradient_position * HORIZONTAL_BORDER_DEPTH + (1 - HORIZONTAL_BORDER_DEPTH));
            }
        }

        /* Subpixel blurring, like LCD filter*/
        var midup = this.mix(up, center, 0.5);
        var middown = this.mix(down, center, 0.5);

        var ret;

        var cr = Common.Red(center);
        var cg = Common.Green(center);
        var cb = Common.Blue(center);
        var mub = Common.Blue(midup);
        var mdr = Common.Red(middown);
        var mdg = Common.Green(middown);
        var ub = Common.Blue(up);
        var dr = Common.Red(down);
        var dg = Common.Green(down);
        var alpha = Common.Alpha(center);

        if (posy < 1.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_HIGH * ub), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * ub), sub_posy);

        } else if (posy < 2.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * ub), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mub), sub_posy);

        } else if (posy < 3.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mub), Common.ARGBINT(alpha, COLOR_LOW * mdr, COLOR_HIGH * cg, COLOR_LOW * cb), sub_posy);

        } else if (posy < 4.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * mdr, COLOR_HIGH * cg, COLOR_LOW * cb), Common.ARGBINT(alpha, COLOR_LOW * dr, COLOR_HIGH * cg, COLOR_HIGH * cb), sub_posy);

        } else if (posy < 5.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * dr, COLOR_HIGH * cg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_LOW * dr, COLOR_LOW * mdg, COLOR_HIGH * cb), sub_posy);

        } else {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * dr, COLOR_LOW * mdg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_HIGH * dr, COLOR_LOW * dg, COLOR_HIGH * cb), sub_posy);
        }

        /* Anti alias the curve */
        if (positionx < 1) {

            this.Mul(ret, positionx);

        } else if (positionx > srcx - 1) {

            this.Mul(ret, srcx - positionx);
        }

        if (positiony < 1) {

            this.Mul(ret, positiony);

        } else if (positiony > srcy - 1) {

            this.Mul(ret, srcy - positiony);
        }

        return ret;
    }
}