// Themaister's bead
// see: https://github.com/libretro/common-shaders/blob/master/retro/shaders/bead.cg
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

    // Bead High
    get BEAD_HIGH() { return 0.35; }

    // Bead Low
    get BEAD_LOW() { return 0.2; }

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

    dist(coordx, coordy, sourcex, sourcey) {

        var dx = coordx - sourcex;
        var dy = coordy - sourcey;

        return Math.sqrt(dx * dx + dy * dy);
    }

    rolloff(len) {

        return Math.exp(-6.0 * len);
    }

    lookup(pixel_nox, pixel_noy, color) {

        var delta = this.dist(this.fract(pixel_nox), this.fract(pixel_noy), 0.5, 0.5);

        if (delta > this.BEAD_LOW && delta < this.BEAD_HIGH)
            return color;
        else if (delta >= this.BEAD_HIGH)
            return this.fMulC(color, this.rolloff(delta - this.BEAD_HIGH));
        else if (delta <= this.BEAD_LOW)
            return this.fMulC(color, this.rolloff(this.BEAD_LOW - delta));
        else
            return [0.0, 0.0, 0.0];
    }


    scale(image, ppx, ppy, srcx, srcy) {

        var pixel = Common.CLR(image, srcx, srcy, ppx * srcx, ppy * srcy, 0, 0);

        var res = this.lookup(ppx * srcx, ppy * srcy, this.float3(pixel));

        var r = Common._Clip8(res[0] * 255);
        var g = Common._Clip8(res[1] * 255);
        var b = Common._Clip8(res[2] * 255);
        var a = Common.Alpha(pixel);

        return Common.ARGBINT(a, r, g, b);
    }
}