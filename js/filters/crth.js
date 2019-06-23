// CRT (Horizontal Scanlines)
// https://github.com/LIJI32/SameBoy/blob/master/Shaders/CRT.fsh
var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold) {

        var Channels = 4;

        scale = Math.max(2, scale);

        Init.Init(srcx, srcy, scale, scale, threshold);

        var temp;

        temp = new Uint8ClampedArray(srcx * srcy * Channels);
        Common.Copy(temp, Input, srcx * srcy * Channels);

        Rotate.Rotate90(Input, temp, srcx, srcy);
        srcx = srcx ^ srcy ^ (srcy = srcx);
        this.SwapDimensions();

        temp = Init.New(Common.SizeX, Common.SizeY);

        var total = Common.SizeY;
        var current = 0;

        for (var y = 0; y < Common.SizeY; y++) {

            var offset = y * Common.SizeX;
            var positiony = y / Common.SizeY;

            for (var x = 0; x < Common.SizeX; x++) {

                var argb = this.scale(Input, x / Common.SizeX, positiony, srcx, srcy);

                temp[(offset + x) * Channels] = Common.Red(argb);
                temp[(offset + x) * Channels + 1] = Common.Green(argb);
                temp[(offset + x) * Channels + 2] = Common.Blue(argb);
                temp[(offset + x) * Channels + 3] = Common.Alpha(argb);
            }

            current++;

            notify({ ScalingProgress: current / total });
        }

        Rotate.Rotate270(Common.ScaledImage, temp, Common.SizeX, Common.SizeY);
        this.SwapDimensions();
    }
    
    SwapDimensions() {

        Common.SizeX = Common.SizeX ^ Common.SizeY ^ (Common.SizeY = Common.SizeX);
    }

    fract(x) {

        return x - Math.floor(x);
    }

    mix(a, b, c) {

        return Interpolate.Interpolate2P1Q(a, b, c);
    }

    Mul(x, y) {

        var r = Common.Red(x) * y;
        var g = Common.Green(x) * y;
        var b = Common.Blue(x) * y;
        var a = Common.Alpha(x) * y;

        return Common.ARGBINT(a, r, g, b);
    }

    scale(image, ppx, ppy, srcx, srcy) {

        const COLOR_LOW = 0.7;
        const COLOR_HIGH = 1.0;
        const VERTICAL_BORDER_DEPTH = 0.6;
        const SCANLINE_DEPTH = 0.3;
        const CURVENESS = 0.3;

        /* Curve and pixel ratio */
        var y_curve = Math.cos(ppx - 0.5) * CURVENESS + (1 - CURVENESS);
        var y_multiplier = 8.0 / 7.0 / y_curve;

        ppy *= y_multiplier;
        ppy -= (y_multiplier - 1) / 2;
        
        if (ppy < 0.0) return Common.ARGBINT(0, 0, 0, 0);
        if (ppy > 1.0) return Common.ARGBINT(0, 0, 0, 0);

        var x_curve = Math.cos(ppy - 0.5) * CURVENESS + (1 - CURVENESS);
        var x_multiplier = 1 / x_curve;
        
        ppx *= x_multiplier;
        ppx -= (x_multiplier - 1) / 2;
        
        if (ppx < 0.0) return Common.ARGBINT(0, 0, 0, 0);
        if (ppx > 1.0) return Common.ARGBINT(0, 0, 0, 0);

        var posx = this.fract(ppx * srcx);
        var posy = this.fract(ppy * srcy);
        var sub_posx = this.fract(ppx * srcx * 6);
        var sub_posy = this.fract(ppy * srcy * 6);

        var positionx = parseInt(ppx * srcx);
        var positiony = parseInt(ppy * srcy);

        var center = Common.CLR(image, srcx, srcy, positionx, positiony, 0, 0);
        var left = Common.CLR(image, srcx, srcy, positionx, positiony, -1, 0);
        var right = Common.CLR(image, srcx, srcy, positionx, positiony, 1, 0);

        /* Vertical blurring */
        if (posy < 1.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, 0, -1), 0.5 - sub_posy / 2.0);
            left = this.mix(left, Common.CLR(image, srcx, srcy, positionx, positiony, -1, -1), 0.5 - sub_posy / 2.0);
            right = this.mix(right, Common.CLR(image, srcx, srcy, positionx, positiony, 1, -1), 0.5 - sub_posy / 2.0);

        } else if (posy > 5.0 / 6.0) {

            center = this.mix(center, Common.CLR(image, srcx, srcy, positionx, positiony, 0, 1), sub_posy / 2.0);
            left = this.mix(left, Common.CLR(image, srcx, srcy, positionx, positiony, -1, 1), sub_posy / 2.0);
            right = this.mix(right, Common.CLR(image, srcx, srcy, positionx, positiony, 1, 1), sub_posy / 2.0);
        }

        /* Scanlines */
        var scanline_multiplier;

        if (posy < 0.5) {

            scanline_multiplier = (posy * 2) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH);

        } else {

            scanline_multiplier = ((1 - posy) * 2) * SCANLINE_DEPTH + (1 - SCANLINE_DEPTH);
        }

        this.Mul(center, scanline_multiplier);
        this.Mul(left, scanline_multiplier);
        this.Mul(right, scanline_multiplier);

        /* Vertical seperator for shadow masks */
        var odd = (ppx * srcx) & 1;

        var gradient_position;

        if (odd) {

            posy += 0.5;
            posy = this.fract(posy);
        }

        if (posy < 1.0 / 3.0) {

            gradient_position = posy * 3.0;

            this.Mul(center, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
            this.Mul(left, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
            this.Mul(right, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));

        } else if (posy > 2.0 / 3.0) {

            gradient_position = (1 - posy) * 3.0;

            this.Mul(center, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
            this.Mul(left, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
            this.Mul(right, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
        }

        /* Blur the edges of the separators of adjacent columns */
        if (posx < 1.0 / 6.0 || posx > 5.0 / 6.0) {

            posy += 0.5;
            posy = this.fract(posy);

            if (posy < 1.0 / 3.0) {

                gradient_position = posy * 3.0;

                if (posx < 0.5) {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (posx) * 6.0);

                } else {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (1 - posx) * 6.0);
                }

                this.Mul(center, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
                this.Mul(left, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
                this.Mul(right, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));

            } else if (posy > 2.0 / 3.0) {

                gradient_position = (1 - posy) * 3.0;

                if (posx < 0.5) {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (posx) * 6.0);

                } else {

                    gradient_position = 1 - (1 - gradient_position) * (1 - (1 - posx) * 6.0);
                }

                this.Mul(center, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
                this.Mul(left, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
                this.Mul(right, gradient_position * VERTICAL_BORDER_DEPTH + (1 - VERTICAL_BORDER_DEPTH));
            }
        }

        /* Subpixel blurring, like LCD filter*/
        var midleft = this.mix(left, center, 0.5);
        var midright = this.mix(right, center, 0.5);

        var ret;

        var cr = Common.Red(center);
        var cg = Common.Green(center);
        var cb = Common.Blue(center);
        var mlb = Common.Blue(midleft);
        var mrr = Common.Red(midright);
        var mrg = Common.Green(midright);
        var lb = Common.Blue(left);
        var rr = Common.Red(right);
        var rg = Common.Green(right);
        var alpha = Common.Alpha(center);

        if (posx < 1.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_HIGH * lb), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * lb), sub_posx);

        } else if (posx < 2.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_LOW * cg, COLOR_LOW * lb), Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mlb), sub_posx);

        } else if (posx < 3.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_HIGH * cr, COLOR_HIGH * cg, COLOR_LOW * mlb), Common.ARGBINT(alpha, COLOR_LOW * mrr, COLOR_HIGH * cg, COLOR_LOW * cb), sub_posx);

        } else if (posx < 4.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * mrr, COLOR_HIGH * cg, COLOR_LOW * cb), Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_HIGH * cg, COLOR_HIGH * cb), sub_posx);

        } else if (posx < 5.0 / 6.0) {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_HIGH * cg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_LOW * mrg, COLOR_HIGH * cb), sub_posx);

        } else {

            ret = this.mix(Common.ARGBINT(alpha, COLOR_LOW * rr, COLOR_LOW * mrg, COLOR_HIGH * cb), Common.ARGBINT(alpha, COLOR_HIGH * rr, COLOR_LOW * rg, COLOR_HIGH * cb), sub_posx);
        }

        /* Anti alias the curve */
        if (positionx < 1) {

            this.Mul(ret, positionx);

        } else if (positionx > srcx - 1) {

            this.Mul(ret, srcx - positionx);
        }

        if (positiony < 1) {

            this.Mul(ret, positiony);

        } else if (positiony > srcy - 1) {

            this.Mul(ret, srcy - positiony);
        }

        return ret;
    }
}