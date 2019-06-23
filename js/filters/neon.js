// Neon
// https://github.com/libretro/common-shaders/blob/master/neon/shaders/neon-variation-1.cg
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

                var argb = this.scale(Input, x / Common.SizeX, positiony, srcx, srcy, scale);

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

    fDiff(x, y) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = x[i] - y[i];
        }

        return dst;
    }

    fAdd(x, y) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = x[i] + y[i];
        }

        return dst;
    }

    fAbs(x) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++)
            dst[i] = Math.abs(x[i]);

        return dst;
    }

    float3(a) {

        return [Common.Red(a), Common.Green(a), Common.Blue(a)];
    }

    fMulC(a, scale) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++)
            dst[i] = a[i] * scale;

        return dst;
    }

    fLerp(x, y, a) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++)
            dst[i] = x[i] * (1 - a) + y[i] * a;

        return dst;
    }

    scale(image, ppx, ppy, srcx, srcy, scale_factor) {

        var dx = 0.5 / (srcx * scale_factor);
        var dy = 0.5 / (srcy * scale_factor);

        var c00 = Common.CLR(image, srcx, srcy, parseInt((ppx - dx) * srcx), parseInt((ppy - dy) * srcy), 0, 0);
        var c01 = Common.CLR(image, srcx, srcy, parseInt((ppx - dx) * srcx), parseInt((ppy) * srcy), 0, 0);
        var c02 = Common.CLR(image, srcx, srcy, parseInt((ppx - dx) * srcx), parseInt((ppy + dy) * srcy), 0, 0);
        var c10 = Common.CLR(image, srcx, srcy, parseInt((ppx) * srcx), parseInt((ppy - dy) * srcy), 0, 0);
        var c11 = Common.CLR(image, srcx, srcy, parseInt((ppx) * srcx), parseInt((ppy) * srcy), 0, 0);
        var c12 = Common.CLR(image, srcx, srcy, parseInt((ppx) * srcx), parseInt((ppy + dy) * srcy), 0, 0);
        var c20 = Common.CLR(image, srcx, srcy, parseInt((ppx + dx) * srcx), parseInt((ppy - dy) * srcy), 0, 0);
        var c21 = Common.CLR(image, srcx, srcy, parseInt((ppx + dx) * srcx), parseInt((ppy) * srcy), 0, 0);
        var c22 = Common.CLR(image, srcx, srcy, parseInt((ppx + dx) * srcx), parseInt((ppy + dy) * srcy), 0, 0);

        var first = this.fLerp(this.float3(c00), this.float3(c20), this.fract(scale_factor * ppx * srcx + 0.5));
        var second = this.fLerp(this.float3(c02), this.float3(c22), this.fract(scale_factor * ppx * srcx + 0.5));

        var mid_horiz = this.fLerp(this.float3(c01), this.float3(c21), this.fract(scale_factor * ppx * srcx + 0.5));
        var mid_vert = this.fLerp(this.float3(c10), this.float3(c12), this.fract(scale_factor * ppy * srcy + 0.5));

        var res = this.fLerp(first, second, this.fract(scale_factor * ppy * srcy + 0.5));

        var ret = this.fAdd(this.fMulC(this.fAdd(this.fAdd(res, mid_horiz), mid_vert), 0.28), this.fMulC(this.fAbs(this.fDiff(res, this.fLerp(mid_horiz, mid_vert, 0.5))), 4.7));

        var r = Common._Clip8(ret[0]);
        var g = Common._Clip8(ret[1]);
        var b = Common._Clip8(ret[2]);
        var a = Common.Alpha(c11);

        return Common.ARGBINT(a, r, g, b);
    }
}