var Filter = class {

    Apply(Input, srcx, srcy, flip, threshold) {

        const Channels = 4;

	flip = Math.max(1, Math.min(2, flip));

	Init.Init(srcx, srcy, 1, 1, threshold);

        Common.Copy(Common.ScaledImage, Input, srcx * srcy * Channels);

	switch(flip) {

            case 2:
            
                Flip.FlipUD(Common.ScaledImage, srcx, srcy);
                
                break;
                
            default:
            
                Flip.FlipLR(Common.ScaledImage, srcx, srcy);
                
                break;
        }
    }
}
