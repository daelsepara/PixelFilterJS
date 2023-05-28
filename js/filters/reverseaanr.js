// Reverse Anti-Aliasing (No-Ring)
// https://github.com/libretro/common-shaders/blob/master/anti-aliasing/shaders/reverse-aa-noring.cg
/*
   Reverse Antialiasing Shader

   Adapted from the C source (see Copyright below) to shader
   cg language by Hyllian/Jararaca - sergiogdb@gmail.com

   This shader works best in 2x scale.
*/

/*
 *
 *  Copyright (c) 2012, Christoph Feck <christoph@maxiom.de>
 *  All Rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *    * Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 *  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 *  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 *  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 *
*/

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

    fract(x) {

        return x - Math.floor(x);
    }

    Mul(x, y) {

        var r = Common.Red(x) * y;
        var g = Common.Green(x) * y;
        var b = Common.Blue(x) * y;
        var a = Common.Alpha(x) * y;

        return Common.ARGBINT(a, r, g, b);
    }

    Add(x, y) {

        var r = (Common.Red(x) + Common.Red(y));
        var g = (Common.Green(x) + Common.Green(y));
        var b = (Common.Blue(x) + Common.Blue(y));
        var a = (Common.Alpha(x) + Common.Alpha(y));

        return Common.ARGBINT(a, r, g, b);
    }

    Diff(x, y) {

        var r = (Common.Red(x) - Common.Red(y));
        var g = (Common.Green(x) - Common.Green(y));
        var b = (Common.Blue(x) - Common.Blue(y));
        var a = (Common.Alpha(x) - Common.Alpha(y));

        return Common.ARGBINT(a, r, g, b);
    }

    fDiff(x, y) {

        var r = (Common.Red(x) - Common.Red(y));
        var g = (Common.Green(x) - Common.Green(y));
        var b = (Common.Blue(x) - Common.Blue(y));
        var a = (Common.Alpha(x) - Common.Alpha(y));

        return [a, r, g, b];
    }

    fAbs(x) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++) {

            dst[i] = Math.abs(x[i]);
        }

        return Common.ARGBINT(dst[0], dst[1], dst[2], dst[3]);
    }

    fAdd(x, y) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++) {

            dst[i] = x[i] + y[i];
        }

        return Common.ARGBINT(dst[0], dst[1], dst[2], dst[3]);
    }

    fMin(x, y) {

        var r = Math.min(Common.Red(x), Common.Red(y));
        var g = Math.min(Common.Green(x), Common.Green(y));
        var b = Math.min(Common.Blue(x), Common.Blue(y));
        var a = Math.min(Common.Alpha(x), Common.Alpha(y));

        return Common.ARGBINT(a, r, g, b);
    }

    fMax(x, y) {

        var r = Math.max(Common.Red(x), Common.Red(y));
        var g = Math.max(Common.Green(x), Common.Green(y));
        var b = Math.max(Common.Blue(x), Common.Blue(y));
        var a = Math.max(Common.Alpha(x), Common.Alpha(y));

        return Common.ARGBINT(a, r, g, b);
    }

    lt(x, quant) {

        return x < quant ? x : (255 - x);
    }

    process(x, quant) {

        var r = this.lt(Common.Red(x), 255 * quant);
        var g = this.lt(Common.Green(x), 255 * quant);
        var b = this.lt(Common.Blue(x), 255 * quant);
        var a = this.lt(Common.Alpha(x), 255 * quant);

        return Common.ARGBINT(a, r, g, b);
    }

    clamp(x, m) {

        var r = Common.Red(x);
        var g = Common.Green(x);
        var b = Common.Blue(x);
        var a = Common.Alpha(x);

        var mr = Common.Red(m);
        var mg = Common.Green(m);
        var mb = Common.Blue(m);
        var ma = Common.Alpha(m);

        var fr = Interpolate.Fix(r, -mr, mr);
        var fg = Interpolate.Fix(g, -mg, mg);
        var fb = Interpolate.Fix(b, -mb, mb);
        var fa = Interpolate.Fix(a, -ma, ma);

        return Common.ARGBINT(fa, fr, fg, fb);
    }

    fix(x, q1, q2) {

        var r = Common.Red(x);
        var g = Common.Green(x);
        var b = Common.Blue(x);
        var a = Common.Alpha(x);

        var ar = Common.Red(q1);
        var ag = Common.Green(q1);
        var ab = Common.Blue(q1);
        var aa = Common.Alpha(q1);

        var br = Common.Red(q2);
        var bg = Common.Green(q2);
        var bb = Common.Blue(q2);
        var ba = Common.Alpha(q2);

        var fr = Interpolate.Fix(r, ar, br);
        var fg = Interpolate.Fix(g, ag, bg);
        var fb = Interpolate.Fix(b, ab, bb);
        var fa = Interpolate.Fix(a, aa, ba);

        return Common.ARGBINT(fa, fr, fg, fb);
    }

    res2x(pre2, pre1, px, pos1, pos2) {

        const REVERSEAA_SHARPNESS = 2.0;

        var t, m;
        var df = [this.fDiff(pre2, pre1), this.fDiff(pre1, px), this.fDiff(px, pos1), this.fDiff(pos1, pos2)];

        m = this.process(px, 0.5);
        m = this.Mul(this.fMin(m, this.fMin(this.fAbs(df[1]), this.fAbs(df[2]))), REVERSEAA_SHARPNESS);
        t = this.Mul(this.Diff(this.Mul(this.fAdd(df[1], df[2]), 7), this.Mul(this.fAdd(df[0], df[3]), 3)), 1.0 / 16);
        t = this.clamp(t, m);

        return t;
    }

    scale(image, ppx, ppy, srcx, srcy) {

        /*
            A1 B1 C1
        A0  A  B  C  C4
        D0  D  E  F  F4
        G0  G  H  I  I4
            G5 H5 I5
        */

        var fpx = 2 * this.fract(ppx * srcx) - 1;
        var fpy = 2 * this.fract(ppy * srcy) - 1;

        var positionx = parseInt(ppx * srcx);
        var positiony = parseInt(ppy * srcy);

        var B1 = Common.CLR(image, srcx, srcy, positionx, positiony, 0, -2);
        var B = Common.CLR(image, srcx, srcy, positionx, positiony, 0, -1);
        var D = Common.CLR(image, srcx, srcy, positionx, positiony, -1, 0);
        var E = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 0);
        var F = Common.CLR(image, srcx, srcy, positionx, positiony, 1, 0);
        var H = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 1);
        var H5 = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 2);
        var D0 = Common.CLR(image, srcx, srcy, positionx, positiony, -2, 0);
        var F4 = Common.CLR(image, srcx, srcy, positionx, positiony, 2, 0);

        var _t1 = this.res2x(B1, B, E, H, H5);
        var _t2 = this.res2x(D0, D, E, F, F4);

        var res = this.Add(this.Add(E, this.Mul(_t1, fpy)), this.Mul(_t2, fpx));
        var a = this.fMin(this.fMin(this.fMin(this.fMin(B, D), E), F), H);
        var b = this.fMax(this.fMax(this.fMax(this.fMax(B, D), E), F), H);

        return this.fix(res, a, b);
    }
}