// ARGB to Grayscale
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = 1;
			
        Init.Init(srcx, srcy, scale, scale, threshold);

        var Channels = 4;

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var pixel = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var gray = Common.Luminance(pixel);

                var dst = (y * srcx + x) * Channels;

                Common.ScaledImage[dst] = gray;
                Common.ScaledImage[dst + 1] = gray;
                Common.ScaledImage[dst + 2] = gray;
                Common.ScaledImage[dst + 3] = Common.Alpha(pixel);
            }
        }
    }
}