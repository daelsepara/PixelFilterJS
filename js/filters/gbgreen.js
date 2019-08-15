// ARGB to Gameboy Green
// SEE: https://www.designpieces.com/palette/game-boy-original-color-palette-hex-and-rgb/
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = 1;

        Init.Init(srcx, srcy, scale, scale, threshold);

        var Channels = 4;

        var GB_B = [15, 48, 139, 155];
        var GB_G = [56, 98, 172, 188];
        var GB_R = [15, 48, 15, 15];

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