// LCD (Horizontal Scanlines)
// see: https://github.com/LIJI32/SameBoy/blob/master/Shaders/LCD.fsh
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
        var up = Common.CLR(image, srcx, srcy, positionx, positiony, 0, -1);
        var down = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 1);

        if (posx < 1.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, -1, 0), 0.5 - sub_posx / 2.0);
            up = this.mix(up, Common.CLR(image, srcx, srcy, positionx, positiony, -1, -1), 0.5 - sub_posx / 2.0);
            down = this.mix(down, Common.CLR(image, srcx, srcy, positionx, positiony, -1, 1), 0.5 - sub_posx / 2.0);
            this.Mul(center, sub_posy * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(up, sub_posx * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(down, sub_posx * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));

        } else if (posx > 5.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, 1, 0), sub_posx / 2.0);
            up = this.mix(up, Common.CLR(image, srcx, srcy, positionx, positiony, 1, -1), sub_posx / 2.0);
            down = this.mix(down, Common.CLR(image, srcx, srcy, positionx, positiony, 1, 1), sub_posx / 2.0);
            this.Mul(center, (1.0 - sub_posx) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(up, (1.0 - sub_posx) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
            this.Mul(down, (1.0 - sub_posx) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH));
        }

        var midup = this.mix(up, center, 0.5);
        var middown = this.mix(down, center, 0.5);

        var ret;
        var cr = Common.Red(center);
        var cg = Common.Green(center);
        var cb = Common.Blue(center);
        var ub = Common.Blue(up);
        var mub = Common.Blue(midup);
        var mdr = Common.Red(middown);
        var mdg = Common.Green(middown);
        var rr = Common.Red(down);
        var rg = Common.Green(down);
        var alpha = Common.Alpha(center);

        if (posy < 1.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_HIGH * ub), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * ub), sub_posy);

        } else if (posy < 2.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * ub), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mub), sub_posy);

        } else if (posy < 3.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mub), Common.ARGBINT(alpha, COLOR_LOW * mdr, COLOR_HIGH * cg, COLOR_LOW * cb), sub_posy);

        } else if (posy < 4.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * mdr, COLOR_HIGH * cg, COLOR_LOW * cb), Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_HIGH * cg, COLOR_HIGH * cb), sub_posy);

        } else if (posy < 5.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_HIGH * cg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_LOW * mdg, COLOR_HIGH * cb), sub_posy);

        } else {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_LOW * mdg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_HIGH * rr, COLOR_LOW * rg, COLOR_HIGH * cb), sub_posy);
        }

        return ret;
    }
}