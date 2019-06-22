// LCD
// see: https://github.com/LIJI32/SameBoy/blob/master/Shaders/LCD.fsh
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        var Channels = 4;

        scale = 2;

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

    Mul(x, y) {

        var r = Common.Red(x) * y;
        var g = Common.Green(x) * y;
        var b = Common.Blue(x) * y;
        var a = Common.Alpha(x) * y;

        return Common.ARGBINT(a, r, g, b);
    }

    scale(image, ppx, ppy, srcx, srcy) {

        const COLOR_LOW = 0.8
        const COLOR_HIGH = 1.0
        const SCANLINE_DEPTH = 0.1

        var posx = this.fract(ppx * srcx);
        var posy = this.fract(ppy * srcy);
        var sub_posx = this.fract(ppx * srcx * 6);
        var sub_posy = this.fract(ppy * srcy * 6);

        var positionx = parseInt(ppx * srcx);
        var positiony = parseInt(ppy * srcy);

        var center = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 0);
        var left = Common.CLR(image, srcx, srcy, positionx, positiony, -1, 0);
        var right = Common.CLR(image, srcx, srcy, positionx, positiony, 1, 0);

        if (posy < 1.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, 0, -1), 0.5 - sub_posy / 2.0);
            left = this.mix(left, Common.CLR(image, srcx, srcy, positionx, positiony, -1, -1), 0.5 - sub_posy / 2.0);
            right = this.mix(right, Common.CLR(image, srcx, srcy, positionx, positiony, 1, -1), 0.5 - sub_posy / 2.0);
            this.Mul(center, sub_posy * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(left, sub_posy * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(right, sub_posy * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));

        } else if (posy > 5.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, 0, 1), sub_posy / 2.0);
            left = this.mix(left, Common.CLR(image, srcx, srcy, positionx, positiony, -1, 1), sub_posy / 2.0);
            right = this.mix(right, Common.CLR(image, srcx, srcy, positionx, positiony, 1, 1), sub_posy / 2.0);
            this.Mul(center, (1.0 - sub_posy) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(left, (1.0 - sub_posy) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(right, (1.0 - sub_posy) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
        }

        var midleft = this.mix(left, center, 0.5);
        var midright = this.mix(right, center, 0.5);

        var ret;
        var cr = Common.Red(center);
        var cg = Common.Green(center);
        var cb = Common.Blue(center);
        var lb = Common.Blue(left);
        var mlb = Common.Blue(midleft);
        var mrr = Common.Red(midright);
        var mrg = Common.Green(midright);
        var rr = Common.Red(right);
        var rg = Common.Green(right);
        var alpha = Common.Alpha(center);

        if (posx < 1.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_HIGH * lb), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * lb), sub_posx);

        } else if (posx < 2.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * lb), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mlb), sub_posx);

        } else if (posx < 3.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mlb), Common.ARGBINT(alpha, COLOR_LOW * mrr, COLOR_HIGH * cg, COLOR_LOW * cb), sub_posx);

        } else if (posx < 4.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * mrr, COLOR_HIGH * cg, COLOR_LOW * cb), Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_HIGH * cg, COLOR_HIGH * cb), sub_posx);

        } else if (posx < 5.0 / 6.0) {

            ret = this.mix(alpha, Common.ARGBINT(COLOR_LOW * rr, COLOR_HIGH * cg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_LOW * mrg, COLOR_HIGH * cb), sub_posx);

        } else {

            ret = this.mix(alpha, Common.ARGBINT(COLOR_LOW * rr, COLOR_LOW * mrg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_HIGH * rr, COLOR_LOW * rg, COLOR_HIGH * cb), sub_posx);
        }

        return ret;
    }
}