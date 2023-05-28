// dot-mask
// see: https://github.com/libretro/common-shaders/blob/master/crt/shaders/dotmask.cg
/*
   Dot Mask
   Authors: cgwg, Timothy Lottes
   License: GPL

   Note: This shader is just the dotmask functions from cgwg's CRT shader and crt-lottes.
*/
/*
* This JavaScript Version was adapted from the cg language to work in PixelFilterJS by sdsepara (June, 2019). See above link to cg source.
*/
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

    // CGWG Dot Mask Strength
    get DOTMASK_STRENGTH() { return 0.3; }

    // Lottes maskDark
    get maskDark() { return 0.5; }

    // Lottes maskLight
    get maskLight() { return 1.5; }

    // shadowMask
    get shadowMask() { return 3; }

    float3(a) {

        return [Common.Red(a) / 255, Common.Green(a) / 255, Common.Blue(a) / 255];
    }

    fract(x) {

        return x - Math.floor(x);
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

    fmod(a, m) {

        return a - m * Math.floor(a / m);
    }

    fMul(x, y) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = x[i] * y[i];
        }

        return dst;
    }

    Mask(posx, posy) {

        var mask = [this.maskDark, this.maskDark, this.maskDark];

        // Very compressed TV style shadow mask.
        if (this.shadowMask == 1) {

            var mask_line = this.maskLight;
            var odd = 0.0;

            if (this.fract(posx / 6.0) < 0.5) odd = 1.0;
            if (this.fract((posy + odd) / 2.0) < 0.5) mask_line = this.maskDark;

            posx = this.fract(posx / 3.0);

            if (posx < 0.333) mask[0] = this.maskLight;
            else if (posx < 0.666) mask[1] = this.maskLight;
            else mask[2] = this.maskLight;

            this.fMulC(mask, mask_line);
        }

        // Aperture-grille.
        else if (this.shadowMask == 2) {

            posx = this.fract(posx / 3.0);

            if (posx < 0.333) mask[0] = this.maskLight;
            else if (posx < 0.666) mask[1] = this.maskLight;
            else mask[2] = this.maskLight;
        }

        // Stretched VGA style shadow mask (same as prior shaders).
        else if (this.shadowMask == 3) {

            posx += posy * 3.0;
            posx = this.fract(posx / 6.0);

            if (posx < 0.333) mask[0] = this.maskLight;
            else if (posx < 0.666) mask[1] = this.maskLight;
            else mask[2] = this.maskLight;
        }

        // VGA style shadow mask.
        else if (this.shadowMask == 4) {

            posx = Math.floor(posx);
            posy = Math.floor(posy * 0.5);
            posx += posy * 3.0;
            posx = this.fract(posx / 6.0);

            if (posx < 0.333) mask[0] = this.maskLight;
            else if (posx < 0.666) mask[1] = this.maskLight;
            else mask[2] = this.maskLight;
        }

        return mask;
    }

    scale(image, ppx, ppy, srcx, srcy, scale) {

        var pixel = Common.CLR(image, srcx, srcy, ppx * srcx, ppy * srcy, 0, 0);

        var res = this.float3(pixel);

        var mask = 1.0 - this.DOTMASK_STRENGTH;
        var mod_factor = scale;

        var dotMaskWeights = this.fLerp([1.0, mask, 1.0], [mask, 1.0, mask], Math.floor(this.fmod(mod_factor, 2.0)));

        if (this.shadowMask == 0) {

            res = this.fMul(res, dotMaskWeights);

        } else {

            var posx = Math.floor(ppx * mod_factor * srcx + 0.5);
            var posy = Math.floor(ppy * mod_factor * srcy + 0.5);

            res = this.fMul(res, this.Mask(posx, posy));
        }

        var r = Common._Clip8(res[0] * 255);
        var g = Common._Clip8(res[1] * 255);
        var b = Common._Clip8(res[2] * 255);
        var a = Common.Alpha(pixel);

        return Common.ARGBINT(a, r, g, b);
    }
}