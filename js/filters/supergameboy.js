// ARGB to Gameboy Green
// SEE: https://lospec.com/palette-list/links-awakening-sgb
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = 1;

        Init.Init(srcx, srcy, scale, scale, threshold);

        var Channels = 4;

        var GB_B = [90, 107, 123, 255];
        var GB_G = [57, 140, 198, 255];
        var GB_R = [33, 66, 123, 181];

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var pixel = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var gray = Common.Luminance(pixel);
                var lookup = parseInt(Math.floor(gray / 64));

                var dst = (y * srcx + x) * Channels;

                Common.ScaledImage[dst] = GB_R[lookup];
                Common.ScaledImage[dst + 1] = GB_G[lookup];
                Common.ScaledImage[dst + 2] = GB_B[lookup];
                Common.ScaledImage[dst + 3] = Common.Alpha(pixel);
            }
        }
    }
}