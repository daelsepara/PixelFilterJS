// Smooth Bilinear
// https://github.com/LIJI32/SameBoy/blob/master/Shaders/SmoothBilinear.fsh
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

    mix(a, b, c) {

        return Interpolate.Interpolate2P1Q(a, b, c);
    }

    smoothstep(a, b, x) {

        // clamp
        x = Interpolate.Fix((x - a) / (b - a), 0.0, 1.0);

        return x * x * (3.0 - 2.0 * x);
    }

    scale(image, ppx, ppy, srcx, srcy) {

        var pixelx = ppx * srcx - 0.5;
        var pixely = ppy * srcy - 0.5;

        var q11 = Common.CLR(image, srcx, srcy, (Math.floor(pixelx) + 0.5), (Math.floor(pixely) + 0.5), 0, 0);
        var q12 = Common.CLR(image, srcx, srcy, (Math.floor(pixelx) + 0.5), (Math.ceil(pixely) + 0.5), 0, 0);
        var q21 = Common.CLR(image, srcx, srcy, (Math.ceil(pixelx) + 0.5), (Math.floor(pixely) + 0.5), 0, 0);
        var q22 = Common.CLR(image, srcx, srcy, (Math.ceil(pixelx) + 0.5), (Math.ceil(pixely) + 0.5), 0, 0);

        var sx = this.smoothstep(0.0, 1.0, this.fract(pixelx));
        var sy = this.smoothstep(0.0, 1.0, this.fract(pixely));

        var r1 = this.mix(q11, q21, sx);
        var r2 = this.mix(q12, q22, sx);

        return this.mix(r1, r2, sy);
    }
}