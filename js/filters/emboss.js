// SABR v3.0
// https://github.com/libretro/common-shaders/blob/master/sabr/shaders/sabr-v3.0.cg
/*
	SABR v3.0 Shader
	Joshua Street

	Portions of this algorithm were taken from Hyllian's 5xBR v3.7c
	shader.

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

    get Ai() { return [1, -1, -1, 1]; }
    get B45() { return [1, 1, -1, -1]; }
    get C45() { return [1.5, 0.5, -0.5, 0.5]; }
    get B30() { return [0.5, 2, -0.5, -2]; }
    get C30() { return [1, 1, -0.5, 0.0]; }
    get B60() { return [2, 0.5, -2, -0.5]; }
    get C60() { return [2, 0.0, -1, 0.5]; }
    get lum() { return [0.299, 0.587, 0.114]; }
    get threshold() { return [0.32, 0.32, 0.32, 0.32]; }
    get M45() { return [0.4, 0.4, 0.4, 0.4]; }
    get M30() { return [0.2, 0.4, 0.2, 0.4]; }
    get M60() { return [0.4, 0.2, 0.4, 0.2]; }
    get Mshift() { return [0.2, 0.2, 0.2, 0.2]; }
    get coef() { return 2; }

    float4(a) {

        return [Common.Red(a) / 255, Common.Green(a) / 255, Common.Blue(a) / 255, Common.Alpha(a) / 255];
    }

    fract(x) {

        return x - Math.floor(x);
    }

    fMul(x, y) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++) {

            dst[i] = x[i] * y[i];
        }

        return dst;
    }

    fMulC(x, c) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++) {

            dst[i] = x[i] * c;
        }

        return dst;
    }

    fDiff(x, y) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++) {

            dst[i] = x[i] - y[i];
        }

        return dst;
    }

    fAdd(x, y) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++) {

            dst[i] = x[i] + y[i];
        }

        return dst;
    }

    scale(image, ppx, ppy, srcx, srcy, scale) {

        var Color = [0.5, 0.5, 0.5, 0.0];

        var deltax = 1 / (scale * srcx);
        var deltay = 1 / (scale * srcy);

        Color = this.fDiff(Color, this.fMulC(this.float4(Common.CLR(image, srcx, srcy, (ppx - deltax) * srcx, (ppy - deltay) * srcy, 0, 0)), 2.0));
        Color = this.fAdd(Color, this.fMulC(this.float4(Common.CLR(image, srcx, srcy, (ppx + deltax) * srcx, (ppy + deltay) * srcy, 0, 0)), 2.0));

        var rgb = (Color[0] + Color[1] + Color[2]) / 3.0;

        var r = Common._Clip8(rgb * 255);
        var g = Common._Clip8(rgb * 255);
        var b = Common._Clip8(rgb * 255);

        return Common.ARGBINT(255, r, g, b);
    }
}