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

    fMax(x, y) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = Math.max(x[i], y[i]);

        return dst;
    }

    dot(x, y) {

        var sum = 0.0;

        // do not include alpha channel
        for (var i = 0; i < 3; i++)
            sum += x[i] * y[i];

        return sum;
    }

    lum_to(v0, v1, v2, v3) {

        return [this.dot(this.lum, v0), this.dot(this.lum, v1), this.dot(this.lum, v2), this.dot(this.lum, v3)];
    }

    lum_df(A, B) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = Math.abs(A[i] - B[i]);

        return dst;
    }

    lum_eq(A, B) {

        var dst = new Array(4);

        var diff = this.lum_df(A, B);

        for (var i = 0; i < 4; i++)
            dst[i] = diff[i] < this.threshold[i];

        return dst;
    }

    neq(A, B) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = (A[i] != B[i]);

        return dst;
    }

    and(A, B) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = A[i] && B[i];

        return dst;
    }

    or(A, B) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = A[i] || B[i];

        return dst;
    }

    le(A, B) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = (A[i] <= B[i]);

        return dst;
    }

    lt(A, B) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = (A[i] < B[i]);

        return dst;
    }

    neg(A) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = !A[i];

        return dst;
    }

    fMulC(a, scale) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = a[i] * scale;

        return dst;
    }

    lum_wd(a, b, c, d, e, f, g, h) {

        return this.fAdd(this.fAdd(this.fAdd(this.fAdd(this.lum_df(a, b), this.lum_df(a, c)), this.lum_df(d, e)), this.lum_df(d, f)), this.fMulC(this.lum_df(g, h), 4.0));
    }

    c_df(c1, c2) {

        var sum = 0.0;

        // do not include alpha channel
        for (var i = 0; i < 3; i++)
            sum += Math.abs(c1[i] - c2[i]);

        return sum;
    }

    smoothstep(a, b, x) {

        // clamp
        var t = Interpolate.Fix((x - a) / (b - a), 0.0, 1);

        return t * t * (3.0 - 2 * t);
    }

    fSmoothstep(a, b, x) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = this.smoothstep(a[i], b[i], x[i]);

        return dst;
    }

    step(a, b) {

        return a < b || a <= 0.0 ? 0.0 : 1;
    }

    fStep(a, b) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = this.step(a[i], b[i]);

        return dst;
    }

    boolToFloat(A) {

        var dst = new Array(4);

        for (var i = 0; i < 4; i++)
            dst[i] = A[i] == true ? 1 : 0.0;

        return dst;
    }

    fLerp(x, y, a) {

        var dst = new Array(3);

        for (var i = 0; i < 3; i++)
            dst[i] = x[i] + a * (y[i] - x[i]);

        return dst;
    }

    scale(image, ppx, ppy, srcx, srcy, scale) {

        var fpx = this.fract(ppx * srcx);
        var fpy = this.fract(ppy * srcy);

        var x = 1 / scale;
        var y = 1 / scale;

        var positionx = ppx * srcx;
        var positiony = ppy * srcy;

        /*
            A1 B1 C1
        A0  A  B  C  C4
        D0  D  E  F  F4
        G0  G  H  I  I4
            G5 H5 I5
        */

        /*
		Mask for algorithm
		+-----+-----+-----+-----+-----+
		|     |  1  |  2  |  3  |     |
		+-----+-----+-----+-----+-----+
		|  5  |  6  |  7  |  8  |  9  |
		+-----+-----+-----+-----+-----+
		| 10  | 11  | 12  | 13  | 14  |
		+-----+-----+-----+-----+-----+
		| 15  | 16  | 17  | 18  | 19  |
		+-----+-----+-----+-----+-----+
		|     | 21  | 22  | 23  |     |
		+-----+-----+-----+-----+-----+
        */

        // Store mask values
        var P1 = this.float4(Common.CLR(image, srcx, srcy, positionx - x, positionx - 2 * y, 0, 0));
        var P2 = this.float4(Common.CLR(image, srcx, srcy, positionx, positionx - 2 * y, 0, 0));
        var P3 = this.float4(Common.CLR(image, srcx, srcy, positionx + x, positionx - 2 * y, 0, 0));

        var P6 = this.float4(Common.CLR(image, srcx, srcy, positionx - x, positiony - y, 0, 0));
        var P7 = this.float4(Common.CLR(image, srcx, srcy, positionx, positiony - y, 0, 0));
        var P8 = this.float4(Common.CLR(image, srcx, srcy, positionx + x, positiony - y, 0, 0));

        var P11 = this.float4(Common.CLR(image, srcx, srcy, positionx - x, positiony, 0, 0));
        var P12 = this.float4(Common.CLR(image, srcx, srcy, positionx, positiony, 0, 0));
        var P13 = this.float4(Common.CLR(image, srcx, srcy, positionx + x, positiony, 0, 0));

        var P16 = this.float4(Common.CLR(image, srcx, srcy, positionx - x, positiony + y, 0, 0));
        var P17 = this.float4(Common.CLR(image, srcx, srcy, positionx, positiony + y, 0, 0));
        var P18 = this.float4(Common.CLR(image, srcx, srcy, positionx + x, positiony + y, 0, 0));

        var P21 = this.float4(Common.CLR(image, srcx, srcy, positionx - x, positiony + 2 * y, 0, 0));
        var P22 = this.float4(Common.CLR(image, srcx, srcy, positionx, positiony + 2 * y, 0, 0));
        var P23 = this.float4(Common.CLR(image, srcx, srcy, positionx + x, positiony + 2 * y, 0, 0));

        var P5 = this.float4(Common.CLR(image, srcx, srcy, positionx - 2 * x, positiony - y, 0, 0));
        var P10 = this.float4(Common.CLR(image, srcx, srcy, positionx - 2 * x, positiony, 0, 0));
        var P15 = this.float4(Common.CLR(image, srcx, srcy, positionx - 2 * x, positiony + y, 0, 0));

        var P9 = this.float4(Common.CLR(image, srcx, srcy, positionx + 2 * x, positiony - y, 0, 0));
        var P14 = this.float4(Common.CLR(image, srcx, srcy, positionx + 2 * x, positiony, 0, 0));
        var P19 = this.float4(Common.CLR(image, srcx, srcy, positionx + 2 * x, positiony + y, 0, 0));

        var p7 = this.lum_to(P7, P11, P17, P13);
        var p8 = this.lum_to(P8, P6, P16, P18);
        var p11 = this.lum_to(P11, P17, P13, P7);
        var p12 = this.lum_to(P12, P12, P12, P12);
        var p13 = this.lum_to(P13, P7, P11, P17);
        var p14 = this.lum_to(P14, P2, P10, P22);
        var p16 = this.lum_to(P16, P18, P8, P6);
        var p17 = this.lum_to(P11, P17, P13, P7);
        var p18 = this.lum_to(P18, P8, P6, P16);
        var p19 = this.lum_to(P19, P3, P5, P21);
        var p22 = this.lum_to(P22, P14, P2, P10);
        var p23 = this.lum_to(P23, P9, P1, P15);

        var AiMulFpy = this.fMulC(this.Ai, fpy);
        var B45MulFpx = this.fMulC(this.B45, fpx);

        var ma45 = this.fSmoothstep(this.fDiff(this.C45, this.M45), this.fAdd(this.C45, this.M45), this.fAdd(AiMulFpy, B45MulFpx));
        var ma30 = this.fSmoothstep(this.fDiff(this.C30, this.M30), this.fAdd(this.C30, this.M30), this.fAdd(AiMulFpy, this.fMulC(this.B30, fpx)));
        var ma60 = this.fSmoothstep(this.fDiff(this.C60, this.M60), this.fAdd(this.C60, this.M60), this.fAdd(AiMulFpy, this.fMulC(this.B60, fpx)));
        var marn = this.fSmoothstep(this.fAdd(this.fDiff(this.C45, this.M45), this.Mshift), this.fAdd(this.fAdd(this.C45, this.M45), this.Mshift), this.fAdd(AiMulFpy, B45MulFpx));

        var e45 = this.lum_wd(p12, p8, p16, p18, p22, p14, p17, p13);
        var econt = this.lum_wd(p17, p11, p23, p13, p7, p19, p12, p18);
        var e30 = this.lum_df(p13, p16);
        var e60 = this.lum_df(p8, p17);

        // Calculate rule results for interpolation
        var r45_1 = this.and(this.neq(p12, p13), this.neq(p12, p17));
        var r45_2 = this.and(this.neg(this.lum_eq(p13, p7)), this.neg(this.lum_eq(p13, p8)));
        var r45_3 = this.and(this.neg(this.lum_eq(p17, p11)), this.neg(this.lum_eq(p17, p16)));
        var r45_4_1 = this.and(this.neg(this.lum_eq(p13, p14)), this.neg(this.lum_eq(p13, p19)));
        var r45_4_2 = this.and(this.neg(this.lum_eq(p17, p22)), this.neg(this.lum_eq(p17, p23)));
        var r45_4 = this.and(this.lum_eq(p12, p18), this.or(r45_4_1, r45_4_2));
        var r45_5 = this.or(this.lum_eq(p12, p16), this.lum_eq(p12, p8));
        var r45 = this.and(r45_1, this.or(this.or(this.or(r45_2, r45_3), r45_4), r45_5));
        var r30 = this.and(this.neq(p12, p16), this.neq(p11, p16));
        var r60 = this.and(this.neq(p12, p8), this.neq(p7, p8));

        var edr45 = this.and(this.lt(e45, econt), r45);
        var edrrn = this.le(e45, econt);
        var edr30 = this.and(this.le(this.fMulC(e30, this.coef), e60), r30);
        var edr60 = this.and(this.le(this.fMulC(e60, this.coef), e30), r60);

        var final45 = this.boolToFloat(this.and(this.and(this.neg(edr30), this.neg(edr60)), edr45));
        var final30 = this.boolToFloat(this.and(this.and(edr45, this.neg(edr60)), edr30));
        var final60 = this.boolToFloat(this.and(this.and(edr45, this.neg(edr30)), edr60));
        var final36 = this.boolToFloat(this.and(this.and(edr45, edr30), edr60));
        var finalrn = this.boolToFloat(this.and(this.neg(edr45), edrrn));

        var px = this.fStep(this.lum_df(p12, p17), this.lum_df(p12, p13));
        var mac = this.fAdd(this.fAdd(this.fAdd(this.fAdd(this.fMul(final36, this.fMax(ma30, ma60)), this.fMul(final30, ma30)), this.fMul(final60, ma60)), this.fMul(final45, ma45)), this.fMul(finalrn, marn));

        var res1 = this.fLerp(P12, this.fLerp(P13, P17, px[0]), mac[0]);
        res1 = this.fLerp(res1, this.fLerp(P7, P13, px[1]), mac[1]);
        res1 = this.fLerp(res1, this.fLerp(P11, P7, px[2]), mac[2]);
        res1 = this.fLerp(res1, this.fLerp(P17, P11, px[3]), mac[3]);

        var res2 = this.fLerp(P12, this.fLerp(P17, P11, px[3]), mac[3]);
        res2 = this.fLerp(res2, this.fLerp(P11, P7, px[2]), mac[2]);
        res2 = this.fLerp(res2, this.fLerp(P7, P13, px[1]), mac[1]);
        res2 = this.fLerp(res2, this.fLerp(P13, P17, px[0]), mac[0]);

        var ret = (this.fLerp(res1, res2, this.step(this.c_df(P12, res1), this.c_df(P12, res2))));

        var r = Common._Clip8(ret[0] * 255);
        var g = Common._Clip8(ret[1] * 255);
        var b = Common._Clip8(ret[2] * 255);
        var a = Common._Clip8(P12[3] * 255); // copy alpha channel

        return Common.ARGBINT(a, r, g, b);
    }
}