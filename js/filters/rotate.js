var Filter = class {

    SwapDimensions() {

        Common._SizeX = Common._SizeX ^ Common._SizeY ^ (Common._SizeY = Common._SizeX);
    }

    Apply(Input, srcx, srcy, rotate, threshold) {

        const Channels = 4;

	rotate = Math.max(1, Math.min(3, rotate));

	Init.Init(srcx, srcy, 1, 1, threshold);

        Common.Copy(Common.ScaledImage, Input, srcx * srcy * Channels);

	switch(rotate) {

            case 2:
                
                Rotate.Rotate180(Common.ScaledImage, Input, srcx, srcy);
                
                break;
            
            case 3:
            
                Rotate.Rotate270(Common.ScaledImage, Input, srcx, srcy);

                this.SwapDimensions();
        
                break;
                
            default:
            
                Rotate.Rotate90(Common.ScaledImage, Input, srcx, srcy);

                this.SwapDimensions();
                
                break;
        }
    }
}
