// Hyllian - Retro Shader - 2013
// see: https://github.com/libretro/common-shaders/blob/master/retro/shaders/retro-v2.cg
/*
   Hyllian - Retro Shader - 2013

   A re-implementation from the original made by Hyllian and DOLLS!
   
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

        var tempSrc = this.CopyPadded(Input, srcx, srcy, scale);
        var srcDim = Math.max(srcx, srcy);
        srcDim = srcDim + (scale - srcDim % scale);

        var dstDim = scale * srcDim;
        dstDim = dstDim + (scale - dstDim % scale);

        var tempDst = Init.New(dstDim, dstDim);
        
        var total = dstDim;
        var current = 0;

        for (var y = 0; y < dstDim; y++) {

            var offset = y * dstDim;
            var positiony = y / dstDim;

            for (var x = 0; x < dstDim; x++) {

                var argb = this.scale(tempSrc, x / dstDim, positiony, srcDim, srcDim, scale);

                tempDst[(offset + x) * Channels] = Common.Red(argb);
                tempDst[(offset + x) * Channels + 1] = Common.Green(argb);
                tempDst[(offset + x) * Channels + 2] = Common.Blue(argb);
                tempDst[(offset + x) * Channels + 3] = Common.Alpha(argb);
            }

            current++;

            notify({ ScalingProgress: current / total });
        }

        this.CopyCropped(Common.ScaledImage, tempDst, Common.SizeX, Common.SizeY, dstDim, dstDim);
    }

    CopyPadded(src, srcx, srcy, scale) {

        const Channels = 4;

        var dim = Math.max(srcx, srcy);
        dim = dim + (scale - dim % scale);

        var dst = new Uint8ClampedArray(dim * dim * Channels);

        Common.Copy2D(dst, src, dim, dim, srcx, srcy);

        return dst;
    }

    CopyCropped(dst, src, dstx, dsty, srcx, srcy) {

        Common.Copy2D(dst, src, dstx, dsty, srcx, srcy);
    }

    // This value must be between 0.0 (totally black) and 1.0 (nearest neighbor)
    get RETRO_PIXEL_SIZE() { return 0.84; }

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

    fMul(x, y) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++) {

            dst[i] = x[i] * y[i];
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

    scale(image, ppx, ppy, srcx, srcy, scale) {

        var pixel = Common.CLR(image, srcx, srcy, ppx * srcx, ppy * srcy, 0, 0);

        // Reading the texel
        var power = 2.4;
        var E = this.fPow(this.float3(pixel), [power, power, power]);

        var fpx = this.fract(ppx * srcx);
        var fpy = this.fract(ppy * srcy);

        var ps = 1.0 / scale;

        var fx = this.clamp(this.clamp(fpx + 0.5 * ps, 0.0, 1.0) - this.RETRO_PIXEL_SIZE, 0.0, ps) / ps;
        var fy = this.clamp(this.clamp(fpy + 0.5 * ps, 0.0, 1.0) - this.RETRO_PIXEL_SIZE, 0.0, ps) / ps;

        var max_coord = Math.max(fx, fy);

        var res = this.fLerp(this.fMulC(E, 1.04 + fpx * fpy), this.fMulC(E, 0.36), max_coord);

        // Product interpolation
        var pwr = 1.0 / 2.2;

        res = this.fClamp(this.fPow(res, [pwr, pwr, pwr]), 0.0, 1.0);

        var r = Common._Clip8(res[0] * 255);
        var g = Common._Clip8(res[1] * 255);
        var b = Common._Clip8(res[2] * 255);
        var a = Common.Alpha(pixel);

        return Common.ARGBINT(a, r, g, b);
    }
}