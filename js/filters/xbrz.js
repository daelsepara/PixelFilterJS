//  XBRZ
class ScaleSize {
  
    constructor(scaler) {

      this.scaler = scaler;
      this.size = scaler.Scale();
    }
}

class ImagePointer {

    constructor(imageData) {

        this._imageData = imageData;
        this._offset = 0;
    }

    Position(offset) {

      this._offset = (offset);
    }

    GetPixel() {
        
        return this._imageData[parseInt(this._offset)];
    }

    SetPixel(val) {

      this._imageData[this._offset] = val;
    }
}

class BlendType {

    // These blend types must fit into 2 bits.
    static get BlendNone() {
        
        return 0; //do not blend
    }

    static get BlendNormal() {
    
        return 1; //a normal indication to blend
    }

    static get BlendDominant() {

        return 2; //a strong indication to blend
    }
}

class BlendResult {

    constructor() {

        this.f = BlendType.BlendNone;
        this.g = BlendType.BlendNone;
        this.j = BlendType.BlendNone;
        this.k = BlendType.BlendNone;
    }

    Reset() {

        this.f = BlendType.BlendNone;
        this.g = BlendType.BlendNone;
        this.j = BlendType.BlendNone;
        this.k = BlendType.BlendNone;
    }
}

class ScalerCfg {
    
    // These are the default values:
    constructor() {

        this.luminanceWeight = 1.0;
        this.equalColorTolerance = 30.0;
        this.dominantDirectionThreshold = 3.6;
        this.steepDirectionThreshold = 2.2;
    }
}

class Tuple {

    constructor (i, j) {

      this.I = i;
      this.J = j;
    }
}

class Constants {

    static get CONFIGURATION() {

        return this.hasOwnProperty('_CONFIGURATION') ? this._CONFIGURATION : new ScalerCfg();
    }

    static get MAX_ROTS() {

        return this.hasOwnProperty('_MAX_ROTS') ? this._MAX_ROTS : 4;
    }

    static get MAX_SCALE() {

        return this.hasOwnProperty('_MAX_SCALE') ? this._MAX_SCALE : 6;
    }

    static get MAX_SCALE_SQUARED() {

        return this.hasOwnProperty('_MAX_SCALE_SQUARED') ? this._MAX_SCALE_SQUARED : this.MAX_SCALE * this.MAX_SCALE;
    }

    static get MATRIX_ROTATION() {

        return this.hasOwnProperty('_MATRIX_ROTATION') ? this._MATRIX_ROTATION : [];
    }

    static set MATRIX_ROTATION(v) {

        this._MATRIX_ROTATION = v;
    }
}


class Utility {

    static _Square(value) {
        
        return parseFloat(value * value);
    }

    static _DistYCbCr(pix1, pix2, lumaWeight) {
        
        //http://en.wikipedia.org/wiki/YCbCr#ITU-R_BT.601_conversion
        //YCbCr conversion is a matrix multiplication => take advantage of linearity by subtracting first!
        var rDiff = parseFloat(Common.Red(pix1) - Common.Red(pix2));
        var gDiff = parseFloat(Common.Green(pix1) - Common.Green(pix2));
        var bDiff = parseFloat(Common.Blue(pix1) - Common.Blue(pix2));

        const kB = 0.0593; //ITU-R BT.2020 conversion
        const kR = 0.2627; //
        const kG = parseFloat(1.0 - kB - kR);

        const scaleB = 0.5 / (1.0 - kB);
        const scaleR = 0.5 / (1.0 - kR);

        var y = parseFloat(kR * rDiff + kG * gDiff + kB * bDiff); //[!], analog YCbCr!
        var cB = parseFloat(scaleB * (bDiff - y));
        var cR = parseFloat(scaleR * (rDiff - y));

        // Skip division by 255.
        // Also skip square root here by pre-squaring the
        // config option equalColorTolerance.
        return parseFloat(this._Square(lumaWeight * y) + this._Square(cB) + this._Square(cR));
    }
}

class IColorDist {

    _ColorDist(pix1, pix2, luminanceWeight) {
        
        return pix1 == pix2 ? 0 : Utility._DistYCbCr(pix1, pix2, luminanceWeight);
    }

    _(col1, col2) {

      return this._ColorDist(col1, col2, Constants.CONFIGURATION.luminanceWeight);
    }
}

class IColorEq {

    constructor(a) {

        this._eqColorThres = a; 
    }

    _(col1, col2) {

        var dist = new IColorDist();

        const a1 = parseFloat(Common.Alpha(col1)) / 255.0;
        const a2 = parseFloat(Common.Alpha(col2)) / 255.0;
			
        /*
        Requirements for a color distance handling alpha channel: with a1, a2 in [0, 1]

        1. if a1 = a2, distance should be: a1 * distYCbCr()
        2. if a1 = 0,  distance should be: a2 * distYCbCr(black, white) = a2 * 255
        3. if a1 = 1,  ??? maybe: 255 * (1 - a2) + a2 * distYCbCr()
        */

        //return std::min(a1, a2) * DistYCbCrBuffer::dist(pix1, pix2) + 255 * abs(a1 - a2);
        //=> following code is 15% faster:
        const d = dist._ColorDist(col1, col2, Constants.CONFIGURATION.luminanceWeight) ;

        /*
        if (a1 < a2)
            return (a1 * d + 255 * (a2 - a1)) < this._eqColorThres;
        else
            return (a2 * d + 255 * (a1 - a2)) < this._eqColorThres;
        */

       return (a1 * a2 * Utility._Square(d) + Utility._Square(255 * (a1 - a2))) < this._eqColorThres;
    }
}

class Kernel_3X3 {

    constructor() {

        this._ = new Array(3 * 3);
        this._.fill(0);
    }
}

class Kernel_4X4 {

    constructor() {

        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.d = 0;
        this.e = 0;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.i = 0;
        this.j = 0;
        this.k = 0;
        this.l = 0;
        this.m = 0;
        this.n = 0;
        this.o = 0;
        this.p = 0;
    }
}

/*
input kernel area naming convention:
-----------------
| A | B | C | D |
----|---|---|---|
| E | F | G | H | //evalute the four corners between F, G, J, K
----|---|---|---| //input pixel is at position F
| I | J | K | L |
----|---|---|---|
| M | N | O | P |
-----------------
*/

class RotationDegree {

    static get Rot0() {
        
        return 0;
    }

    static get Rot90() {
        
        return 1;
    }

    static get Rot180() {
        
        return 2;
    }

    static get Rot270() {
        
        return 3;
    }
}

class Rot {

    static get _() {

        return this.hasOwnProperty('_rot') ? this._rot : 0;
    }
    
    // Cache the 4 rotations of the 9 positions, a to i.
    static Initialize() {

        this._rot = new Array(9 * 4);
        this.a = 0, this.b = 1, this.c = 2, this.d = 3, this.e = 4, this.f = 5, this.g = 6, this.h = 7, this.i = 8;

        this.deg0 = [
            this.a, this.b, this.c,
            this.d, this.e, this.f,
            this.g, this.h, this.i
        ];

        this.deg90 = [
            this.g, this.d, this.a,
            this.h, this.e, this.b,
            this.i, this.f, this.c
        ];

        this.deg180 = [
            this.i, this.h, this.g,
            this.f, this.e, this.d,
            this.c, this.b, this.a
        ];

        this.deg270 = [
            this.c, this.f, this.i,
            this.b, this.e, this.h,
            this.a, this.d, this.g
        ];

        this.rotation = [this.deg0, this.deg90, this.deg180, this.deg270];

        for (var rotDeg = 0; rotDeg < 4; rotDeg++)
            for (var x = 0; x < 9; x++)
                this._rot[(x << 2) + rotDeg] = this.rotation[rotDeg][x];
    }
}

class BlendInfo {

    static GetTopL(b) {
        
        return ((b) & 0x03);
    }

    static GetTopR(b) {
        
        return ((b >> 2) & 0x03);
    }

    static GetBottomR(b) {
        
        return ((b >> 4) & 0x03);
    }

    static GetBottomL(b) {
        
        return ((b >> 6) & 0x03);
    }

    static SetTopL(b, bt) {

        return b | bt;
    }

    static SetTopR(b, bt) {
        
        return (b | (bt << 2));
    }

    static SetBottomR(b, bt) {
        
        return (b | (bt << 2));
    }

    static SetBottomL(b, bt) {
        
        return (b | (bt << 6));
    }

    static Rotate(b, rotDeg) {
        
        var l = (rotDeg) << 1;
        var r = 8 - l;
        
        return (b << l | b >> r);
    }
}

class Alpha {

    static Blend(m, n, dstPtr, col) {

        var calcColor = function(colFront, colBack) {
            
            return parseFloat((colFront * weightFront + colBack * weightBack) / weightSum); 
        }

        var p = dstPtr.GetPixel();

        const weightFront = parseFloat(Common.Alpha(col)) * m;
		const weightBack = parseFloat(Common.Alpha(p)) * (n - m);
        const weightSum = weightFront + weightBack;

        var a = parseInt(weightSum / n);
        var r = parseInt(calcColor(Common.Red(col), Common.Red(p)));
        var g = parseInt(calcColor(Common.Green(col), Common.Green(p)));
        var b = parseInt(calcColor(Common.Blue(col), Common.Blue(p)));

        dstPtr.SetPixel(Common.ARGBINT(a, r, g, b));
    }
}

class OutputMatrix {
    
    constructor(scale, output, outWidth) {
        
        this._n = (scale - 2) * (Constants.MAX_ROTS * Constants.MAX_SCALE_SQUARED);
        this._output = new ImagePointer(output);
        this._outWidth = outWidth;
        this._nr = 0;
        this._outi = 0;
    }

    Move(rotDeg, outi) {
        
        this._nr = this._n + rotDeg * Constants.MAX_SCALE_SQUARED;
        this._outi = outi;
    }

    Reference(i, j) {
        
        var rot = Constants.MATRIX_ROTATION[this._nr + parseInt(i * Constants.MAX_SCALE + j)];
        this._output.Position(this._outi + rot.J + rot.I * this._outWidth);
        
        return this._output;
    }
}

class Scaler_2X {

    constructor() {
        
        this._SCALE = 2;
    }

    Scale() {
        
        return this._SCALE;
    }

    BlendLineShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 1, 0), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 1, 1), col);
    }

    BlendLineSteep(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(0, this._SCALE - 1), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 1), col);
    }

    BlendLineSteepAndShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(1, 0), col);
        Alpha.Blend(1, 4, output.Reference(0, 1), col);
        Alpha.Blend(5, 6, output.Reference(1, 1), col); //[!] fixes 7/8 used in xBR
    }

    BlendLineDiagonal(col, output) {
        
        Alpha.Blend(1, 2, output.Reference(1, 1), col);
    }

    BlendCorner(col, output) {
        
        //model a round corner
        Alpha.Blend(2146018366, 10000000000, output.Reference(1, 1), col); //exact: 1 - pi/4 = 0.2146018366
    }
}

class Scaler_3X {

    constructor() {
        
        this._SCALE = 3;
    }

    Scale() {
        
        return this._SCALE;
    }

    BlendLineShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 1, 0), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 2, 2), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 1, 1), col);
        output.Reference(this._SCALE - 1, 2).SetPixel(col);
    }

    BlendLineSteep(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(0, this._SCALE - 1), col);
        Alpha.Blend(1, 4, output.Reference(2, this._SCALE - 2), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 1), col);
        output.Reference(2, this._SCALE - 1).SetPixel(col);
    }

    BlendLineSteepAndShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(2, 0), col);
        Alpha.Blend(1, 4, output.Reference(0, 2), col);
        Alpha.Blend(3, 4, output.Reference(2, 1), col);
        Alpha.Blend(3, 4, output.Reference(1, 2), col);
        output.Reference(2, 2).SetPixel(col);
    }

    BlendLineDiagonal(col, output) {
        
        Alpha.Blend(1, 8, output.Reference(1, 2), col);
        Alpha.Blend(1, 8, output.Reference(2, 1), col);
        Alpha.Blend(7, 8, output.Reference(2, 2), col);
    }

    BlendCorner(col, output) {

        //model a round corner
        Alpha.Blend(4545939598, 10000000000, output.Reference(2, 2), col); //exact: 0.4545939598
    }
  }

  class Scaler_4X {
    
    constructor() {
        
        this._SCALE = 4;
    }

    Scale() {
        
        return this._SCALE;
    }

    BlendLineShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 1, 0), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 2, 2), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 1, 1), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 2, 3), col);
        output.Reference(this._SCALE - 1, 2).SetPixel(col);
        output.Reference(this._SCALE - 1, 3).SetPixel(col);
    }

    BlendLineSteep(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(0, this._SCALE - 1), col);
        Alpha.Blend(1, 4, output.Reference(2, this._SCALE - 2), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 1), col);
        Alpha.Blend(3, 4, output.Reference(3, this._SCALE - 2), col);
        output.Reference(2, this._SCALE - 1).SetPixel(col);
        output.Reference(3, this._SCALE - 1).SetPixel(col);
    }

    BlendLineSteepAndShallow(col, output) {
        
        Alpha.Blend(3, 4, output.Reference(3, 1), col);
        Alpha.Blend(3, 4, output.Reference(1, 3), col);
        Alpha.Blend(1, 4, output.Reference(3, 0), col);
        Alpha.Blend(1, 4, output.Reference(0, 3), col);
        Alpha.Blend(1, 3, output.Reference(2, 2), col); //[!] fixes 1/4 used in xBR
        output.Reference(3, 3).SetPixel(col);
        output.Reference(3, 2).SetPixel(col);
        output.Reference(2, 3).SetPixel(col);
    }

    BlendLineDiagonal(col, output) {

        Alpha.Blend(1, 2, output.Reference(this._SCALE - 1, this._SCALE / 2), col);
        Alpha.Blend(1, 2, output.Reference(this._SCALE - 2, this._SCALE / 2 + 1), col);
        output.Reference(this._SCALE - 1, this._SCALE - 1).SetPixel(col);
    }

    BlendCorner(col, output) {
        
        // model a round corner
        Alpha.Blend(6848532563, 10000000000, output.Reference(3, 3), col); //exact: 0.6848532563
        Alpha.Blend(8677704501, 10000000000, output.Reference(3, 2), col); //0.08677704501
        Alpha.Blend(8677704501, 10000000000, output.Reference(2, 3), col); //0.08677704501
    }
  }

  class Scaler_5X {
    
    constructor() {
        
        this._SCALE = 5;
    }

    Scale() {
        
        return this._SCALE;
    }

    BlendLineShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 1, 0), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 2, 2), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 3, 4), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 1, 1), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 2, 3), col);
        output.Reference(this._SCALE - 1, 2).SetPixel(col);
        output.Reference(this._SCALE - 1, 3).SetPixel(col);
        output.Reference(this._SCALE - 1, 4).SetPixel(col);
        output.Reference(this._SCALE - 2, 4).SetPixel(col);
    }

    BlendLineSteep(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(0, this._SCALE - 1), col);
        Alpha.Blend(1, 4, output.Reference(2, this._SCALE - 2), col);
        Alpha.Blend(1, 4, output.Reference(4, this._SCALE - 3), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 1), col);
        Alpha.Blend(3, 4, output.Reference(3, this._SCALE - 2), col);
        output.Reference(2, this._SCALE - 1).SetPixel(col);
        output.Reference(3, this._SCALE - 1).SetPixel(col);
        output.Reference(4, this._SCALE - 1).SetPixel(col);
        output.Reference(4, this._SCALE - 2).SetPixel(col);
    }

    BlendLineSteepAndShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(0, this._SCALE - 1), col);
        Alpha.Blend(1, 4, output.Reference(2, this._SCALE - 2), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 1), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 1, 0), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 2, 2), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 1, 1), col);
        output.Reference(2, this._SCALE - 1).SetPixel(col);
        output.Reference(3, this._SCALE - 1).SetPixel(col);
        output.Reference(this._SCALE - 1, 2).SetPixel(col);
        output.Reference(this._SCALE - 1, 3).SetPixel(col);
        output.Reference(4, this._SCALE - 1).SetPixel(col);
        Alpha.Blend(2, 3, output.Reference(3, 3), col);
    }

    BlendLineDiagonal(col, output) {
        
        Alpha.Blend(1, 8, output.Reference(this._SCALE - 1, this._SCALE / 2), col);
        Alpha.Blend(1, 8, output.Reference(this._SCALE - 2, this._SCALE / 2 + 1), col);
        Alpha.Blend(1, 8, output.Reference(this._SCALE - 3, this._SCALE / 2 + 2), col);
        Alpha.Blend(7, 8, output.Reference(4, 3), col);
        Alpha.Blend(7, 8, output.Reference(3, 4), col);
        output.Reference(4, 4).SetPixel(col);
    }

    BlendCorner(col, output) {
        
        //model a round corner
        Alpha.Blend(8631434088, 10000000000, output.Reference(4, 4), col); //exact: 0.8631434088
        Alpha.Blend(2306749731, 10000000000, output.Reference(4, 3), col); //0.2306749731
        Alpha.Blend(2306749731, 10000000000, output.Reference(3, 4), col); //0.2306749731
    }
}

class Scaler_6X {

    constructor() {
        
        this._SCALE = 6;
    }

    Scale() {
        
        return this._SCALE;
    }

    BlendLineShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 1, 0), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 2, 2), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 3, 4), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 1, 1), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 2, 3), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 3, 5), col);
        output.Reference(this._SCALE - 1, 2).SetPixel(col);
        output.Reference(this._SCALE - 1, 3).SetPixel(col);
        output.Reference(this._SCALE - 1, 4).SetPixel(col);
        output.Reference(this._SCALE - 1, 5).SetPixel(col);
        output.Reference(this._SCALE - 2, 4).SetPixel(col);
        output.Reference(this._SCALE - 2, 5).SetPixel(col);
    }

    BlendLineSteep(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(0, this._SCALE - 1), col);
        Alpha.Blend(1, 4, output.Reference(2, this._SCALE - 2), col);
        Alpha.Blend(1, 4, output.Reference(4, this._SCALE - 3), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 1), col);
        Alpha.Blend(3, 4, output.Reference(3, this._SCALE - 2), col);
        Alpha.Blend(3, 4, output.Reference(5, this._SCALE - 3), col);
        output.Reference(2, this._SCALE - 1).SetPixel(col);
        output.Reference(3, this._SCALE - 1).SetPixel(col);
        output.Reference(4, this._SCALE - 1).SetPixel(col);
        output.Reference(5, this._SCALE - 1).SetPixel(col);
        output.Reference(4, this._SCALE - 2).SetPixel(col);
        output.Reference(5, this._SCALE - 2).SetPixel(col);
    }

    BlendLineSteepAndShallow(col, output) {
        
        Alpha.Blend(1, 4, output.Reference(0, this._SCALE - 1), col);
        Alpha.Blend(1, 4, output.Reference(2, this._SCALE - 2), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 1), col);
        Alpha.Blend(3, 4, output.Reference(1, this._SCALE - 2), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 1, 0), col);
        Alpha.Blend(1, 4, output.Reference(this._SCALE - 2, 2), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 1, 1), col);
        Alpha.Blend(3, 4, output.Reference(this._SCALE - 2, 3), col);
        output.Reference(2, this._SCALE - 1).SetPixel(col);
        output.Reference(3, this._SCALE - 1).SetPixel(col);
        output.Reference(4, this._SCALE - 1).SetPixel(col);
        output.Reference(5, this._SCALE - 1).SetPixel(col);
        output.Reference(4, this._SCALE - 2).SetPixel(col);
        output.Reference(5, this._SCALE - 2).SetPixel(col);
        output.Reference(this._SCALE - 1, 2).SetPixel(col);
        output.Reference(this._SCALE - 1, 3).SetPixel(col);
    }

    BlendLineDiagonal(col, output) {
        
        Alpha.Blend(1, 2, output.Reference(this._SCALE - 1, this._SCALE / 2), col);
        Alpha.Blend(1, 2, output.Reference(this._SCALE - 2, this._SCALE / 2 + 1), col);
        Alpha.Blend(1, 2, output.Reference(this._SCALE - 3, this._SCALE / 2 + 2), col);
        output.Reference(this._SCALE - 2, this._SCALE - 1).SetPixel(col);
        output.Reference(this._SCALE - 1, this._SCALE - 1).SetPixel(col);
        output.Reference(this._SCALE - 1, this._SCALE - 2).SetPixel(col);
    }
    
    BlendCorner(col, output) {
    
        //model a round corner
        Alpha.Blend(9711013910, 10000000000, output.Reference(5, 5), col); //exact: 0.9711013910
        Alpha.Blend(4236372243, 10000000000, output.Reference(4, 5), col); //0.4236372243
        Alpha.Blend(4236372243, 10000000000, output.Reference(5, 4), col); //0.4236372243
        Alpha.Blend( 5652034508, 10000000000, output.Reference(5, 3), col); //0.05652034508
        Alpha.Blend( 5652034508, 10000000000, output.Reference(3, 5), col); //0.05652034508
    }
}

class Filter {

    constructor() {

        Constants.MATRIX_ROTATION = new Array((Constants.MAX_SCALE - 1) * Constants.MAX_SCALE_SQUARED * Constants.MAX_ROTS);

        for (var n = 2; n < Constants.MAX_SCALE + 1; n++) {
            for (var r = 0; r < Constants.MAX_ROTS; r++) {

                var nr = (n - 2) * (Constants.MAX_ROTS * Constants.MAX_SCALE_SQUARED) + r * Constants.MAX_SCALE_SQUARED;
                
                for (var i = 0; i < Constants.MAX_SCALE; i++) {
                    for (var j = 0; j < Constants.MAX_SCALE; j++) {

                        Constants.MATRIX_ROTATION[nr + i * Constants.MAX_SCALE + j] = this._BuildMatrixRotation(r, i, j, n);
                    }
                }
            }
        }

        Rot.Initialize();
    }

    _BuildMatrixRotation(rotDeg, i, j, n) {
        
        var iOld = 0;
        var jOld = 0;

        if (rotDeg == 0) {
        
            iOld = i;
            jOld = j;
        
        } else {

            //old coordinates before rotation!
            var old = this._BuildMatrixRotation(rotDeg - 1, i, j, n);
            iOld = n - 1 - old.J;
            jOld = old.I;
        }

        return new Tuple(iOld, jOld);
    }

    Apply(Input, srcx, srcy, scale) {

        scale = Math.max(2, Math.min(scale, 6));

        Init.Init(srcx, srcy, scale, scale, false);

        var src = this.ToArray(Input, srcx, srcy);
        var dst = new Array(Common.SizeX * Common.SizeY);
        dst.fill(0);

        switch(scale) {

            case 3:

                this.ScaleImage(new ScaleSize(new Scaler_3X()), src, dst, srcx, srcy, 0, 0, srcx, srcy)
            
                break;
    
            case 4:

                this.ScaleImage(new ScaleSize(new Scaler_4X()), src, dst, srcx, srcy, 0, 0, srcx, srcy)
                
                break;

            case 5:

                this.ScaleImage(new ScaleSize(new Scaler_5X()), src, dst, srcx, srcy, 0, 0, srcx, srcy)
            
                break;

            case 6:

                this.ScaleImage(new ScaleSize(new Scaler_6X()), src, dst, srcx, srcy, 0, 0, srcx, srcy)
            
                break;

            default:

                this.ScaleImage(new ScaleSize(new Scaler_2X()), src, dst, srcx, srcy, 0, 0, srcx, srcy)
                
                break;
        }

        this.ToImage(Common.ScaledImage, dst, Common.SizeX, Common.SizeY);
    }

    // helper functions added to work with PixelFilter
	ToArray(Input, srcx, srcy) {

        var dst = new Array(srcx * srcy);
        
		var Channels = 4;

		for (var y = 0; y < srcy; y++) {

			for (var x = 0; x < srcx; x++) {

				var index = y * srcx + x;
				var pixel = index * Channels;
				var r = Input[pixel];
				var g = Input[pixel + 1];
				var b = Input[pixel + 2];
                var a = Input[pixel + 3];

				dst[index] = Common.ARGBINT(a, r, g, b);
			}
        }
        
        return dst;
    }

    ToImage(dst, src, srcx, srcy) {

        var Channels = 4;

        for (var y = 0; y < srcy; y++) {
			for (var x = 0; x < srcx; x++) {

				var index = y * srcx + x;
				var pixel = index * Channels;

				dst[pixel] = Common.Red(src[index]);
				dst[pixel + 1] = Common.Green(src[index]);
                dst[pixel + 2] = Common.Blue(src[index]);
                dst[pixel + 3] = 255;
			}
		}
    }
    
    _FillBlock(trg, trgi, pitch, col, blockSize) {
        
        for (var y = 0; y < blockSize; ++y, trgi += pitch)
            for (var x = 0; x < blockSize; ++x)
                trg[trgi + x] = col;
    }

    _PreProcessCorners(kernel, blendResult, preProcessCornersColorDist) {
        
        blendResult.Reset();

        if ((kernel.f == kernel.g && kernel.j == kernel.k) || (kernel.f == kernel.j && kernel.g == kernel.k))
            return;

        var dist = preProcessCornersColorDist;

        var weight = 4.0;
        var jg = dist._(kernel.i, kernel.f) + dist._(kernel.f, kernel.c) + dist._(kernel.n, kernel.k) + dist._(kernel.k, kernel.h) + weight * dist._(kernel.j, kernel.g);
        var fk = dist._(kernel.e, kernel.j) + dist._(kernel.j, kernel.o) + dist._(kernel.b, kernel.g) + dist._(kernel.g, kernel.l) + weight * dist._(kernel.f, kernel.k);

        var dominantGradient;

        if (jg < fk) {

            dominantGradient = Constants.CONFIGURATION.dominantDirectionThreshold * jg < fk;
            
            if (kernel.f != kernel.g && kernel.f != kernel.j)
                blendResult.f = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal;

            if (kernel.k != kernel.j && kernel.k != kernel.g)
                blendResult.k = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal;

        } else if (fk < jg) {

            dominantGradient = Constants.CONFIGURATION.dominantDirectionThreshold * fk < jg;
            
            if (kernel.j != kernel.f && kernel.j != kernel.k)
                blendResult.j = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal;

            if (kernel.g != kernel.f && kernel.g != kernel.k)
                blendResult.g = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal;
        }
    }

    /*
    input kernel area naming convention:
    -------------
    | A | B | C |
    ----|---|---|
    | D | E | F | //input pixel is at position E
    ----|---|---|
    | G | H | I |
    -------------
    */

    blendPixel(scaler, rotDeg, ker, trgi, blendInfo, scalePixelColorEq, scalePixelColorDist, outputMatrix) {

        var b = ker._[Rot._[(1 << 2) + (rotDeg)]];
        var c = ker._[Rot._[(2 << 2) + (rotDeg)]];
        var d = ker._[Rot._[(3 << 2) + (rotDeg)]];
        var e = ker._[Rot._[(4 << 2) + (rotDeg)]];
        var f = ker._[Rot._[(5 << 2) + (rotDeg)]];
        var g = ker._[Rot._[(6 << 2) + (rotDeg)]];
        var h = ker._[Rot._[(7 << 2) + (rotDeg)]];
        var i = ker._[Rot._[(8 << 2) + (rotDeg)]];

        var blend = BlendInfo.Rotate(blendInfo, rotDeg);

        if ((BlendInfo.GetBottomR(blend)) >= BlendType.BlendNormal && BlendInfo.GetBottomR(blend) <= BlendType.BlendDominant) {
        
            var eq = function(pix1, pix2) { 
                
                return scalePixelColorEq._(pix1, pix2); 
            }

            var dist = function(pix1, pix2) { 
                
                return scalePixelColorDist._(pix1, pix2); 
            }

            var doLineBlend = function() {

                if (BlendInfo.GetBottomR(blend) == BlendType.BlendDominant)
                    return true;

                //make sure there is no second blending in an adjacent rotation for this pixel: handles insular pixels, mario eyes
                if (BlendInfo.GetTopR(blend) != BlendType.BlendNone && !eq(e, g))
                    return false;

                if (BlendInfo.GetBottomL(blend) != BlendType.BlendNone && !eq(e, c))
                    return false;

                //no full blending for L-shapes; blend corner only (handles "mario mushroom eyes")
				if (!eq(e, i) && eq(g, h) && eq(h, i) && eq(i, f) && eq(f, c))
                    return false;

                return true;
            }

            const px = dist(e, f) <= dist(e, h) ? f : h;

            var output = outputMatrix;
            
            output.Move(rotDeg, trgi);

            if (doLineBlend()) {

                const fg = dist(f, g); //test sample: 70% of values max(fg, hc) / min(fg, hc) are between 1.1 and 3.7 with median being 1.9
				const hc = dist(h, c); //

				const haveShallowLine = Constants.CONFIGURATION.steepDirectionThreshold * fg <= hc && e != g && d != g;
				const haveSteepLine = Constants.CONFIGURATION.steepDirectionThreshold * hc <= fg && e != c && b != c;

				if (haveShallowLine) {

					if (haveSteepLine) {
                        
                        scaler.BlendLineSteepAndShallow(px, output);
                    
                    } else { 
                        
                        scaler.BlendLineShallow(px, output);
                    }
                
                } else {

					if (haveSteepLine) {

                        scaler.BlendLineSteep(px, output);
                    
                    } else {
                        
                        scaler.BlendLineDiagonal(px, output);
                    }
                }
                
            } else {

                scaler.BlendCorner(px, output);
            }
        }
    }

    _ScalePixel(scaler, rotDeg, ker, trgi, blendInfo, //result of preprocessing all four corners of pixel "e"
        scalePixelColorEq,
        scalePixelColorDist,
        outputMatrix) {

        //int a = kernel._[Rot._[(0 << 2) + rotDeg]];
        var b = ker._[Rot._[(1 << 2) + (rotDeg)]];
        var c = ker._[Rot._[(2 << 2) + (rotDeg)]];
        var d = ker._[Rot._[(3 << 2) + (rotDeg)]];
        var e = ker._[Rot._[(4 << 2) + (rotDeg)]];
        var f = ker._[Rot._[(5 << 2) + (rotDeg)]];
        var g = ker._[Rot._[(6 << 2) + (rotDeg)]];
        var h = ker._[Rot._[(7 << 2) + (rotDeg)]];
        var i = ker._[Rot._[(8 << 2) + (rotDeg)]];

        var blend = BlendInfo.Rotate(blendInfo, rotDeg);

        if (BlendInfo.GetBottomR(blend) == BlendType.BlendNone)
            return;

        var eq = scalePixelColorEq;
        var dist = scalePixelColorDist;

        var doLineBlend;

        if (BlendInfo.GetBottomR(blend) >= BlendType.BlendDominant) {

            doLineBlend = true;

            //make sure there is no second blending in an adjacent
            //rotation for this pixel: handles insular pixels, mario eyes
            //but support double-blending for 90? corners
        } else if (BlendInfo.GetTopR(blend) != BlendType.BlendNone && !eq._(e, g)) {
            
            doLineBlend = false;

        } else if (BlendInfo.GetBottomL(blend) != BlendType.BlendNone && !eq._(e, c)) {
            
            doLineBlend = false;
            
            //no full blending for L-shapes; blend corner only (handles "mario mushroom eyes")
        } else if (eq._(g, h) && eq._(h, i) && eq._(i, f) && eq._(f, c) && !eq._(e, i)) {

            doLineBlend = false;

        } else {

            doLineBlend = true;
        }

        //choose most similar color
        var px = dist._(e, f) <= dist._(e, h) ? f : h;

        var output = outputMatrix;
        output.Move(rotDeg, trgi);
        
        if (!doLineBlend) {
            
            scaler.BlendCorner(px, output);
            
            return;
        }

        //test sample: 70% of values max(fg, hc) / min(fg, hc)
        //are between 1.1 and 3.7 with median being 1.9
        var fg = dist._(f, g);
        var hc = dist._(h, c);

        var haveShallowLine = Constants.CONFIGURATION.steepDirectionThreshold * fg <= hc && e != g && d != g;
        var haveSteepLine = Constants.CONFIGURATION.steepDirectionThreshold * hc <= fg && e != c && b != c;

        if (haveShallowLine) {

            if (haveSteepLine)
                scaler.BlendLineSteepAndShallow(px, output);
            else
                scaler.BlendLineShallow(px, output);

        } else {

            if (haveSteepLine)
                scaler.BlendLineSteep(px, output);
            else
                scaler.BlendLineDiagonal(px, output);
        }
    }

    ScaleImage(scaleSize, src, trg, srcWidth, srcHeight, xFirst, yFirst, xLast, yLast) {

        var x, y, blendResult, sM1, s0, sP1, sP2, xM1, xP1, xP2;

        yFirst = Math.max(yFirst, 0);
        yLast = Math.min(yLast, srcHeight);

        if (yFirst >= yLast || srcWidth <= 0)
            return;

        var trgWidth = srcWidth * scaleSize.size;

        //temporary buffer for "on the fly preprocessing"
        var preProcBuffer = new Array(srcWidth);
        preProcBuffer.fill(0);

        var ker4 = new Kernel_4X4();

        var preProcessCornersColorDist = new IColorDist();

        //initialize preprocessing buffer for first row:
        //detect upper left and right corner blending
        //this cannot be optimized for adjacent processing
        //stripes; we must not allow for a memory race condition!
        if (yFirst > 0) {

            y = yFirst - 1;

            sM1 = srcWidth * Math.max(y - 1, 0);
            s0 = srcWidth * y; //center line
            sP1 = srcWidth * Math.min(y + 1, srcHeight - 1);
            sP2 = srcWidth * Math.min(y + 2, srcHeight - 1);

            for (x = xFirst; x < xLast; ++x) {

                xM1 = Math.max(x - 1, 0);
                xP1 = Math.min(x + 1, srcWidth - 1);
                xP2 = Math.min(x + 2, srcWidth - 1);

                //read sequentially from memory as far as possible
                ker4.b = src[sM1 + x];
                ker4.c = src[sM1 + xP1];

                ker4.e = src[s0 + xM1];
                ker4.f = src[s0 + x];
                ker4.g = src[s0 + xP1];
                ker4.h = src[s0 + xP2];

                ker4.i = src[sP1 + xM1];
                ker4.j = src[sP1 + x];
                ker4.k = src[sP1 + xP1];
                ker4.l = src[sP1 + xP2];

                ker4.n = src[sP2 + x];
                ker4.o = src[sP2 + xP1];

                blendResult = new BlendResult();

                this._PreProcessCorners(ker4, blendResult, preProcessCornersColorDist); // writes to blendResult
                
                /*
                preprocessing blend result:
                ---------
                | F | G | //evalute corner between F, G, J, K
                ----|---| //input pixel is at position F
                | J | K |
                ---------
                */

                preProcBuffer[x] = BlendInfo.SetTopR(preProcBuffer[x], blendResult.j);

                if (x + 1 < srcWidth)
                    preProcBuffer[x + 1] = BlendInfo.SetTopL(preProcBuffer[x + 1], blendResult.k);
            }
        }

        var eqColorThres = Utility._Square(Constants.CONFIGURATION.equalColorTolerance);

        var scalePixelColorEq = new IColorEq(eqColorThres);
        var scalePixelColorDist = new IColorDist();
        var outputMatrix = new OutputMatrix(scaleSize.size, trg, trgWidth);

        var ker3 = new Kernel_3X3();

        for (y = yFirst; y < yLast; ++y) {

            //consider MT "striped" access
            var trgi = scaleSize.size * y * trgWidth;

            sM1 = srcWidth * Math.max(y - 1, 0);
            s0 = srcWidth * y; //center line
            sP1 = srcWidth * Math.min(y + 1, srcHeight - 1);
            sP2 = srcWidth * Math.min(y + 2, srcHeight - 1);

            var blendXy1 = 0;
            var blendXy = 0;
            
            for (x = xFirst; x < xLast; ++x, trgi += scaleSize.size) {

                xM1 = Math.max(x - 1, 0);
                xP1 = Math.min(x + 1, srcWidth - 1);
                xP2 = Math.min(x + 2, srcWidth - 1);

                //evaluate the four corners on bottom-right of current pixel
                //blend_xy for current (x, y) position
               
                {
                    //read sequentially from memory as far as possible
                    ker4.b = src[sM1 + x];
                    ker4.c = src[sM1 + xP1];

                    ker4.e = src[s0 + xM1];
                    ker4.f = src[s0 + x];
                    ker4.g = src[s0 + xP1];
                    ker4.h = src[s0 + xP2];

                    ker4.i = src[sP1 + xM1];
                    ker4.j = src[sP1 + x];
                    ker4.k = src[sP1 + xP1];
                    ker4.l = src[sP1 + xP2];

                    ker4.n = src[sP2 + x];
                    ker4.o = src[sP2 + xP1];

                    blendResult = new BlendResult();
                    
                    this._PreProcessCorners(ker4, blendResult, preProcessCornersColorDist); // writes to blendResult

                    /*
                    preprocessing blend result:
                    ---------
                    | F | G | //evaluate corner between F, G, J, K
                    ----|---| //current input pixel is at position F
                    | J | K |
                    ---------
                    */

                    //all four corners of (x, y) have been determined at
                    //this point due to processing sequence!
                    blendXy = BlendInfo.SetBottomR(preProcBuffer[x], blendResult.f);

                    //set 2nd known corner for (x, y + 1)
                    blendXy1 = BlendInfo.SetTopR(blendXy1, blendResult.j);
                    //store on current buffer position for use on next row
                    preProcBuffer[x] = blendXy1;

                    //set 1st known corner for (x + 1, y + 1) and
                    //buffer for use on next column
                    blendXy1 = BlendInfo.SetTopL(0, blendResult.k);

                    //set 3rd known corner for (x + 1, y)
                    if (x + 1 < srcWidth)
                        preProcBuffer[x + 1] = BlendInfo.SetBottomL(preProcBuffer[x + 1], blendResult.g);
                }

                //fill block of size scale * scale with the given color
                //  //place *after* preprocessing step, to not overwrite the
                //  //results while processing the the last pixel!
                this._FillBlock(trg, trgi, trgWidth, src[s0 + x], scaleSize.size);

                //blend four corners of current pixel
                if (blendXy == 0)
                    continue;

                const a = 0, b = 1, c = 2, d = 3, e = 4, f = 5, g = 6, h = 7, i = 8;

                //read sequentially from memory as far as possible
                ker3._[a] = src[sM1 + xM1];
                ker3._[b] = src[sM1 + x];
                ker3._[c] = src[sM1 + xP1];

                ker3._[d] = src[s0 + xM1];
                ker3._[e] = src[s0 + x];
                ker3._[f] = src[s0 + xP1];

                ker3._[g] = src[sP1 + xM1];
                ker3._[h] = src[sP1 + x];
                ker3._[i] = src[sP1 + xP1];
                
                this.blendPixel(scaleSize.scaler, RotationDegree.Rot0, ker3, trgi, blendXy, scalePixelColorEq, scalePixelColorDist, outputMatrix);
                this.blendPixel(scaleSize.scaler, RotationDegree.Rot90, ker3, trgi, blendXy, scalePixelColorEq, scalePixelColorDist, outputMatrix);
                this.blendPixel(scaleSize.scaler, RotationDegree.Rot180, ker3, trgi, blendXy, scalePixelColorEq, scalePixelColorDist, outputMatrix);
                this.blendPixel(scaleSize.scaler, RotationDegree.Rot270, ker3, trgi, blendXy, scalePixelColorEq, scalePixelColorDist, outputMatrix);
            }
        }
    }
}