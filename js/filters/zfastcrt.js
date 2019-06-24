// ZFAST-CRT
// see: https://github.com/libretro/common-shaders/blob/master/crt/shaders/zfast_crt.cg
/*
    zfast_crt_standard - A simple, fast CRT shader.
    Copyright (C) 2017 Greg Hogan (SoltanGris42)
    This program is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

Notes:  This shader does scaling with a weighted linear filter for adjustable
	sharpness on the x and y axes based on the algorithm by Inigo Quilez here:
	http://http://www.iquilezles.org/www/articles/texture/texture.htm
	but modified to be somewhat sharper.  Then a scanline effect that varies
	based on pixel brighness is applied along with a monochrome aperture mask.
	This shader runs at 60fps on the Raspberry Pi 3 hardware at 2mpix/s
	resolutions (1920x1080 or 1600x1200).
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

                var argb = this.scale(Input, x / Common.SizeX, positiony, srcx, srcy, Common.SizeX, Common.SizeY);

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

        return a * (1 - c) + b * c;
    }

    Mul(x, y) {

        var r = Common.Red(x) * y;
        var g = Common.Green(x) * y;
        var b = Common.Blue(x) * y;
        var a = Common.Alpha(x) * y;

        return Common.ARGBINT(a, r, g, b);
    }

    // Blur Amount X-Axis
    get BLURSCALEX() { return 0.45; }

    // Scanline Darkness - Low
    get LOWLUMSCAN() { return 5.0; }

    // Scanline Darkness - High
    get HILUMSCAN() { return 10.0; }

    // Dark Pixel Brightness Boost
    get BRIGHTBOOST() { return 1.25; }

    // Mask Effect Amount
    get MASK_DARK() { return 0.25; }

    // Mask/Scanline Fade
    get MASK_FADE() { return 0.8; }

    dot(colour, floats) {

        var r = Common.Red(colour) * floats[0] / 255;
        var g = Common.Green(colour) * floats[1] / 255;
        var b = Common.Blue(colour) * floats[2] / 255;

        return r + g + b;
    }

    scale(image, ppx, ppy, srcx, srcy) {

        var invDims = 1.0;
        var maskFade = 0.333 * this.MASK_FADE;

        var px = ppx * srcx;
        var py = ppy * srcy;

        var ix = Math.floor(px) + 0.5;
        var iy = Math.floor(py) + 0.5;

        var fx = px - ix;
        var fy = py - iy;

        px = (ix + 4.0 * fx * fx * fx) * invDims;
        py = (iy + 4.0 * fy * fy * fy) * invDims;

        px = this.mix(px, ppx, this.BLURSCALEX);
        var Y = fy * fy;
        var YY = Y * Y;

        var mask = 1.0 - this.MASK_DARK;

        var colour = Common.CLR(image, srcx, srcy, ppx * srcx, ppy * srcy, 0, 0);
        var scanLineWeight = (this.BRIGHTBOOST - this.LOWLUMSCAN * (Y - 2.05 * YY));
        var scanLineWeightB = 1.0 - this.HILUMSCAN * (YY - 2.8 * YY * Y);

        var ret = this.Mul(colour, this.mix(scanLineWeight * mask, scanLineWeightB, this.dot(colour, [maskFade, maskFade, maskFade])));

        var r = Common.Red(ret);
        var g = Common.Green(ret);
        var b = Common.Blue(ret);
        var a = Common.Alpha(colour);

        return Common.ARGBINT(a, r, g, b);
    }
}