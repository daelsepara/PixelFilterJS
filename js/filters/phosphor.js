// Phosphor
// https://github.com/libretro/common-shaders/blob/master/crt/shaders/phosphor.cg
/*
* This JavaScript Version was adapted from the cg language to work in PixelFilterJS by sdsepara (June, 2019). See above link to cg source.
*/
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        var Channels = 4;

        scale = Math.max(2, scale);

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

    get INPUT_GAMMA() { return 2.4; }
    get OUTPUT_GAMMA() { return 2.2; }
    get COLOR_BOOST() { return 1.45; }

    float3(a) {

        return [Common.Red(a) / 255, Common.Green(a) / 255, Common.Blue(a) / 255];
    }

    fAdd(x, y) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = x[i] + y[i];
        }

        return dst;
    }

    fPow(x, p) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++)
            dst[i] = Math.pow(x[i], p[i]);

        return dst;
    }

    fMul(x, y) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = x[i] * y[i];
        }

        return dst;
    }

    fMulC(a, scale) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++)
            dst[i] = a[i] * scale;

        return dst;
    }

    fClamp(x, a, b) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = Interpolate.Fix((x[i] - a) / (b - a), 0.0, 1.0);
        }

        return dst;
    }

    GAMMA_IN(color) {

        return this.fPow(color, [this.INPUT_GAMMA, this.INPUT_GAMMA, this.INPUT_GAMMA]);
    }

    GAMMA_OUT(color) {

        return this.fPow(color, [1.0 / this.OUTPUT_GAMMA, 1.0 / this.OUTPUT_GAMMA, 1.0 / this.OUTPUT_GAMMA]);
    }

    fmod(a, m) {

        return a - m * Math.floor(a / m);
    }

    to_focus(pixel) {

        pixel = this.fmod(pixel + 3.0, 3.0);

        if (pixel >= 2.0) // Blue
            return [pixel - 2.0, 0.0, 3.0 - pixel];
        else if (pixel >= 1.0) // Green
            return [0.0, 2.0 - pixel, pixel - 1.0];
        else // Red
            return [1.0 - pixel, pixel, 0.0];
    }

    scale(image, ppx, ppy, srcx, srcy) {

        var y = this.fmod(ppy, 1.0);
        var intensity = Math.exp(-0.2 * y);

        var one_x = (1.0 / (3.0 * srcx));
        var coordx = parseInt((ppx) * srcx);
        var coordy = parseInt((ppy) * srcy);

        var coord_prev = parseInt((ppx - 1.0 * one_x) * srcx);
        var coord_prev_prev = parseInt((ppx - 2.0 * one_x) * srcx);

        var pixel = Common.CLR(image, srcx, srcy, coordx, coordy, 0, 0);
        var color = this.float3(pixel);
        var color_prev = this.float3(Common.CLR(image, srcx, srcy, coord_prev, coordy, 0, 0));
        var color_prev_prev = this.float3(Common.CLR(image, srcx, srcy, coord_prev_prev, coordy, 0, 0));

        var pixel_x = 3.0 * ppx;

        var focus = this.to_focus(pixel_x - 0.0);
        var focus_prev = this.to_focus(pixel_x - 1.0);
        var focus_prev_prev = this.to_focus(pixel_x - 2.0);

        var result = this.fAdd(this.fAdd(this.fMulC(this.fMul(color, focus), 0.8), this.fMulC(this.fMul(color_prev, focus_prev), 0.6)), this.fMulC(this.fMul(color_prev_prev, focus_prev_prev), 0.3));

        result = this.fMulC(this.fPow(result, [1.4, 1.4, 1.4]), 2.3);
        result = this.fMul(result, [this.COLOR_BOOST, this.COLOR_BOOST, this.COLOR_BOOST]);

        var ret = this.fClamp(this.GAMMA_OUT(this.fMulC(result, intensity)), 0.0, 1.0);

        var r = Common._Clip8(ret[0] * 255);
        var g = Common._Clip8(ret[1] * 255);
        var b = Common._Clip8(ret[2] * 255);
        var a = Common.Alpha(pixel);

        return Common.ARGBINT(a, r, g, b);
    }
}