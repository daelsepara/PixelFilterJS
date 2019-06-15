// nX Pixel duplication
class Filter {

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(1, scale);
			
        Init.Init(srcx, srcy, scale, scale, false);

        var P = Array(10);
        
        P.fill(0);

        var total = srcy;
        var current = 0;
        
        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                Common.WriteMagnify(Input, Common.ScaledImage, srcx, srcy, x, y);
            }

            current++;

            notify({ScalingProgress: current / total });
        }
    }
}