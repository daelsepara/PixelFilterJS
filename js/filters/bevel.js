// Hyllian's bevel shader
// see: https://github.com/libretro/common-shaders/blob/master/retro/shaders/bevel.cg
/*
   Hyllian's Bevel Shader
  
   Copyright (C) 2011-2014 Hyllian/Jararaca - sergiogdb@gmail.com

   This program is free software; you can redistribute it and/or
   modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation; either version 2
   of the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

*/
/*
* This JavaScript Version was adapted from the cg language to work in PixelFilterJS by sdsepara (June, 2019). See above link to cg source. 
*/
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        var Channels = 4;

        scale = Math.max(1, scale);

        Init.Init(srcx, srcy, scale, scale, threshold);

        var tempSrc = Common.CopyPadded(Input, srcx, srcy, scale);
        var srcDim = Math.sqrt(tempSrc.length / Channels);

        var dstDim = scale * srcDim;
        dstDim = Common.NextPow(dstDim, scale);

        var tempDst = Init.New(dstDim, dstDim);

        var total = dstDim;
        var current = 0;

        for (var y = 0; y < dstDim; y++) {

            var offset = y * dstDim;
            var positiony = y / dstDim;

            for (var x = 0; x < dstDim; x++) {

                var argb = this.scale(tempSrc, x / dstDim, positiony, srcDim, srcDim);

                tempDst[(offset + x) * Channels] = Common.Red(argb);
                tempDst[(offset + x) * Channels + 1] = Common.Green(argb);
                tempDst[(offset + x) * Channels + 2] = Common.Blue(argb);
                tempDst[(offset + x) * Channels + 3] = Common.Alpha(argb);
            }

            current++;

            notify({ ScalingProgress: current / total });
        }

        Common.CopyCropped(Common.ScaledImage, tempDst, Common.SizeX, Common.SizeY, dstDim, dstDim);
    }

    // Bevel Level
    get BEVEL_LEVEL() { return 0.2; }
    get InputGamma() { return 2.4; }
    get OutputGamma() { return 2.2; }

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
            dst[i] = x[i] * (1 - a[i]) + y[i] * a[i];

        return dst;
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

    clamp(x, floor, ceil) {

        return Interpolate.Fix((x - floor) / (ceil - floor), 0.0, 1.0);
    }

    fClamp(x, a, b) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = this.clamp(x[i], a, b);
        }

        return dst;
    }

    GAMMA_IN(color) {

        return this.fPow(color, [this.InputGamma, this.InputGamma, this.InputGamma]);
    }

    GAMMA_OUT(color) {

        return this.fPow(color, [1.0 / this.OutputGamma, 1.0 / this.OutputGamma, 1.0 / this.OutputGamma]);
    }

    bevel(posx, posy, color) {

        var r = Math.sqrt(posx * posx + posy * posy);

        var delta = this.fLerp([this.BEVEL_LEVEL, this.BEVEL_LEVEL, this.BEVEL_LEVEL], [1.0 - this.BEVEL_LEVEL, 1.0 - this.BEVEL_LEVEL, 1.0 - this.BEVEL_LEVEL], color);

        var weight = this.fMulC(delta, (1 - r));

        return this.fAdd(color, weight);
    }

    saturate(x) {

        return this.fClamp(x, 0.0, 1.0);
    }

    scale(image, ppx, ppy, srcx, srcy) {

        var pixel = Common.CLR(image, srcx, srcy, ppx * srcx, ppy * srcy, 0, 0);

        // Reading the texel
        var color = this.GAMMA_IN(this.float3(pixel));

        var positionx = this.fract(ppx * srcx);
        var positiony = this.fract(ppy * srcy);

        var res = this.GAMMA_OUT(this.saturate(this.bevel(positionx, positiony, color)));

        var r = Common._Clip8(res[0] * 255);
        var g = Common._Clip8(res[1] * 255);
        var b = Common._Clip8(res[2] * 255);
        var a = Common.Alpha(pixel);

        return Common.ARGBINT(a, r, g, b);
    }
}