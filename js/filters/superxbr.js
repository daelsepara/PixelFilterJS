//  Hyllian's Super-XBR modified from https://github.com/hansonw/super-xbr
class Filter {

    df(a, b) {

        return Math.abs(a - b);
    }

    clamp(x, floor, ceil) {
        
        return Interpolate.Fix(x, floor, ceil);
    }

    matrix4() {

        // Surprisingly, using Uint8Arrays ends up being slower.
        return [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    }

    /*
                            P1
    |P0|B |C |P1|         C     F4          |a0|b1|c2|d3|
    |D |E |F |F4|      B     F     I4       |b0|c1|d2|e3|   |e1|i1|i2|e2|
    |G |H |I |I4|   P0    E  A  I     P3    |c0|d1|e2|f3|   |e3|i3|i4|e4|
    |P2|H5|I5|P3|      D     H     I5       |d0|e1|f2|g3|
                        G     H5
                            P2
    sx, sy
    -1  -1 | -2  0   (x+y) (x-y)    -3  1  (x+y-1)  (x-y+1)
    -1   0 | -1 -1                  -2  0
    -1   1 |  0 -2                  -1 -1
    -1   2 |  1 -3                   0 -2
    0  -1 | -1  1   (x+y) (x-y)      ...     ...     ...
    0   0 |  0  0
    0   1 |  1 -1
    0   2 |  2 -2
    1  -1 |  0  2   ...
    1   0 |  1  1
    1   1 |  2  0
    1   2 |  3 -1
    2  -1 |  1  3   ...
    2   0 |  2  2
    2   1 |  3  1
    2   2 |  4  0
    */

   diagonal_edge(mat, wp) {

        var dw1 = wp[0]*(this.df(mat[0][2], mat[1][1]) + this.df(mat[1][1], mat[2][0]) +
            this.df(mat[1][3], mat[2][2]) + this.df(mat[2][2], mat[3][1])) +
            wp[1] * (this.df(mat[0][3], mat[1][2]) + this.df(mat[2][1], mat[3][0])) +
            wp[2] * (this.df(mat[0][3], mat[2][1]) + this.df(mat[1][2], mat[3][0])) +
            wp[3] * this.df(mat[1][2], mat[2][1]) +
            wp[4] * (this.df(mat[0][2], mat[2][0]) + this.df(mat[1][3], mat[3][1])) +
            wp[5] * (this.df(mat[0][1], mat[1][0]) + this.df(mat[2][3], mat[3][2]));

        var dw2 = wp[0]*(this.df(mat[0][1], mat[1][2]) + this.df(mat[1][2], mat[2][3]) +
            this.df(mat[1][0], mat[2][1]) + this.df(mat[2][1], mat[3][2])) +
            wp[1] * (this.df(mat[0][0], mat[1][1]) + this.df(mat[2][2], mat[3][3])) +
            wp[2] * (this.df(mat[0][0], mat[2][2]) + this.df(mat[1][1], mat[3][3])) +
            wp[3] * this.df(mat[1][1], mat[2][2]) +
            wp[4] * (this.df(mat[1][0], mat[3][2]) + this.df(mat[0][1], mat[2][3])) +
            wp[5] * (this.df(mat[0][2], mat[1][3]) + this.df(mat[2][0], mat[3][1]));

        return (dw1 - dw2);
    }
    
    Apply(Input, srcx, srcy, scale) {

        scale = 2;

        const Channels = 4;
        var Channel, sample, csx, csy, sx, sy, x, y, cx, cy;
			
        Init.Init(srcx, srcy, scale, scale, false);

        var wgt1 = 0.129633;
        var wgt2 = 0.175068;
        var w1 = -wgt1;
        var w2 = wgt1 + 0.5;
        var w3 = -wgt2;
        var w4 = wgt2 + 0.5;

        var outw = srcx * scale, outh = srcy * scale;
        var wp = [2.0, 1.0, -1.0, 4.0, -1.0, 1.0];

        // First Pass
        var r = this.matrix4(), g = this.matrix4(), b = this.matrix4(), a = this.matrix4(), Y = this.matrix4();

        var rf, gf, bf, af, ri, gi, bi, ai;
        var d_edge;
        var min_r_sample, max_r_sample;
        var min_g_sample, max_g_sample;
        var min_b_sample, max_b_sample;
        var min_a_sample, max_a_sample;

        var total = outh * 3;
        var current = 0;

        for (y = 0; y < outh; ++y) {
            for (x = 0; x < outw; ++x) {

                cx = parseInt(x / scale), cy = parseInt(y / scale); // central pixels on original images
                
                // sample supporting pixels in original image
                for (sx = -1; sx <= 2; ++sx) {
                    for (sy = -1; sy <= 2; ++sy) {
                        
                        // clamp pixel locations
                        csy = this.clamp(sy + cy, 0, srcy - 1);
                        csx = this.clamp(sx + cx, 0, srcx - 1);
                        // sample & add weighted components
                        sample = (csy * srcx + csx) * Channels;
                        
                        r[sx + 1][sy + 1] = Input[sample];
                        g[sx + 1][sy + 1] = Input[sample + 1];
                        b[sx + 1][sy + 1] = Input[sample + 2];
                        a[sx + 1][sy + 1] = Input[sample + 3];
                        Y[sx + 1][sy + 1] = (0.2126*r[sx + 1][sy + 1] + 0.7152*g[sx + 1][sy + 1] + 0.0722*b[sx + 1][sy + 1]);
                    }
                }

                min_r_sample = Math.min(r[1][1], r[2][1], r[1][2], r[2][2]);
                min_g_sample = Math.min(g[1][1], g[2][1], g[1][2], g[2][2]);
                min_b_sample = Math.min(b[1][1], b[2][1], b[1][2], b[2][2]);
                min_a_sample = Math.min(a[1][1], a[2][1], a[1][2], a[2][2]);
                max_r_sample = Math.max(r[1][1], r[2][1], r[1][2], r[2][2]);
                max_g_sample = Math.max(g[1][1], g[2][1], g[1][2], g[2][2]);
                max_b_sample = Math.max(b[1][1], b[2][1], b[1][2], b[2][2]);
                max_a_sample = Math.max(a[1][1], a[2][1], a[1][2], a[2][2]);
                
                d_edge = this.diagonal_edge(Y, wp);

                if (d_edge <= 0) {
                    
                    rf = w1*(r[0][3] + r[3][0]) + w2*(r[1][2] + r[2][1]);
                    gf = w1*(g[0][3] + g[3][0]) + w2*(g[1][2] + g[2][1]);
                    bf = w1*(b[0][3] + b[3][0]) + w2*(b[1][2] + b[2][1]);
                    af = w1*(a[0][3] + a[3][0]) + w2*(a[1][2] + a[2][1]);
            
                } else {

                    rf = w1*(r[0][0] + r[3][3]) + w2*(r[1][1] + r[2][2]);
                    gf = w1*(g[0][0] + g[3][3]) + w2*(g[1][1] + g[2][2]);
                    bf = w1*(b[0][0] + b[3][3]) + w2*(b[1][1] + b[2][2]);
                    af = w1*(a[0][0] + a[3][3]) + w2*(a[1][1] + a[2][2]);
                }

                // anti-ringing, clamp.
                rf = this.clamp(rf, min_r_sample, max_r_sample);
                gf = this.clamp(gf, min_g_sample, max_g_sample);
                bf = this.clamp(bf, min_b_sample, max_b_sample);
                af = this.clamp(af, min_a_sample, max_a_sample);
                ri = this.clamp(Math.ceil(rf), 0, 255);
                gi = this.clamp(Math.ceil(gf), 0, 255);
                bi = this.clamp(Math.ceil(bf), 0, 255);
                ai = this.clamp(Math.ceil(af), 0, 255);

                for (Channel = 0; Channel < Channels; Channel++) {
                    
                    Common.ScaledImage[(y * outw + x) * Channels + Channel] = Common.ScaledImage[(y * outw + x + 1) * Channels + Channel] =  Common.ScaledImage[((y + 1) * outw + x) * Channels + Channel] = Input[(cy * srcx + cx) * Channels + Channel];
                }

                Common.ScaledImage[((y + 1) * outw + x + 1) * Channels] = ri;
                Common.ScaledImage[((y + 1) * outw + x + 1) * Channels + 1] = gi; 
                Common.ScaledImage[((y + 1) * outw + x + 1) * Channels + 2] = bi;
                Common.ScaledImage[((y + 1) * outw + x + 1) * Channels + 3] = ai;
                
                ++x;
            }

            ++y;

            current += 2;

            notify({ScalingProgress: current / total });
        }
        
        // Second Pass
        wp[0] = 2.0;
        wp[1] = 0.0;
        wp[2] = 0.0;
        wp[3] = 0.0;
        wp[4] = 0.0;
        wp[5] = 0.0;

        for (y = 0; y < outh; ++y) {
            for (x = 0; x < outw; ++x) {
                
                // sample supporting pixels in original image
                for (sx = -1; sx <= 2; ++sx) {
                    for (sy = -1; sy <= 2; ++sy) {

                        // clamp pixel locations
                        csy = this.clamp(sx - sy + y, 0, scale * srcy - 1);
                        csx = this.clamp(sx + sy + x, 0, scale * srcx - 1);
                        
                        // sample & add weighted components
                        sample = (csy * outw + csx) * Channels;

                        r[sx + 1][sy + 1] = Common.ScaledImage[sample];
                        g[sx + 1][sy + 1] = Common.ScaledImage[sample + 1];
                        b[sx + 1][sy + 1] = Common.ScaledImage[sample + 2];
                        a[sx + 1][sy + 1] = Common.ScaledImage[sample + 3];
                        Y[sx + 1][sy + 1] = (0.2126*r[sx + 1][sy + 1] + 0.7152*g[sx + 1][sy + 1] + 0.0722*b[sx + 1][sy + 1]);
                    }
                }

                min_r_sample = Math.min(r[1][1], r[2][1], r[1][2], r[2][2]);
                min_g_sample = Math.min(g[1][1], g[2][1], g[1][2], g[2][2]);
                min_b_sample = Math.min(b[1][1], b[2][1], b[1][2], b[2][2]);
                min_a_sample = Math.min(a[1][1], a[2][1], a[1][2], a[2][2]);
                max_r_sample = Math.max(r[1][1], r[2][1], r[1][2], r[2][2]);
                max_g_sample = Math.max(g[1][1], g[2][1], g[1][2], g[2][2]);
                max_b_sample = Math.max(b[1][1], b[2][1], b[1][2], b[2][2]);
                max_a_sample = Math.max(a[1][1], a[2][1], a[1][2], a[2][2]);
                
                d_edge = this.diagonal_edge(Y, wp);

                if (d_edge <= 0) {
    
                    rf = w3*(r[0][3] + r[3][0]) + w4*(r[1][2] + r[2][1]);
                    gf = w3*(g[0][3] + g[3][0]) + w4*(g[1][2] + g[2][1]);
                    bf = w3*(b[0][3] + b[3][0]) + w4*(b[1][2] + b[2][1]);
                    af = w3*(a[0][3] + a[3][0]) + w4*(a[1][2] + a[2][1]);
                
                } else {

                    rf = w3*(r[0][0] + r[3][3]) + w4*(r[1][1] + r[2][2]);
                    gf = w3*(g[0][0] + g[3][3]) + w4*(g[1][1] + g[2][2]);
                    bf = w3*(b[0][0] + b[3][3]) + w4*(b[1][1] + b[2][2]);
                    af = w3*(a[0][0] + a[3][3]) + w4*(a[1][1] + a[2][2]);
                }

                // anti-ringing, clamp.
                rf = this.clamp(rf, min_r_sample, max_r_sample);
                gf = this.clamp(gf, min_g_sample, max_g_sample);
                bf = this.clamp(bf, min_b_sample, max_b_sample);
                af = this.clamp(af, min_a_sample, max_a_sample);
                ri = this.clamp(Math.ceil(rf), 0, 255);
                gi = this.clamp(Math.ceil(gf), 0, 255);
                bi = this.clamp(Math.ceil(bf), 0, 255);
                ai = this.clamp(Math.ceil(af), 0, 255);

                Common.ScaledImage[(y * outw + x + 1) * Channels] = ri;
                Common.ScaledImage[(y * outw + x + 1) * Channels + 1] = gi; 
                Common.ScaledImage[(y * outw + x + 1) * Channels + 2] = bi;
                Common.ScaledImage[(y * outw + x + 1) * Channels + 3] = ai;

                for (sx = -1; sx <= 2; ++sx) {
                    for (sy = -1; sy <= 2; ++sy) {

                        // clamp pixel locations
                        csy = this.clamp(sx - sy + 1 + y, 0, scale * srcy - 1);
                        csx = this.clamp(sx + sy - 1 + x, 0, scale * srcx - 1);
                        
                        // sample & add weighted components
                        sample = (csy * outw + csx) * Channels;
                        
                        r[sx + 1][sy + 1] = Common.ScaledImage[sample];
                        g[sx + 1][sy + 1] = Common.ScaledImage[sample + 1];
                        b[sx + 1][sy + 1] = Common.ScaledImage[sample + 2];
                        a[sx + 1][sy + 1] = Common.ScaledImage[sample + 3];
                        Y[sx + 1][sy + 1] = (0.2126*r[sx + 1][sy + 1] + 0.7152*g[sx + 1][sy + 1] + 0.0722*b[sx + 1][sy + 1]);
                    }
                }

                d_edge = this.diagonal_edge(Y, wp);

                if (d_edge <= 0) {

                    rf = w3*(r[0][3] + r[3][0]) + w4*(r[1][2] + r[2][1]);
                    gf = w3*(g[0][3] + g[3][0]) + w4*(g[1][2] + g[2][1]);
                    bf = w3*(b[0][3] + b[3][0]) + w4*(b[1][2] + b[2][1]);
                    af = w3*(a[0][3] + a[3][0]) + w4*(a[1][2] + a[2][1]);

                } else {

                    rf = w3*(r[0][0] + r[3][3]) + w4*(r[1][1] + r[2][2]);
                    gf = w3*(g[0][0] + g[3][3]) + w4*(g[1][1] + g[2][2]);
                    bf = w3*(b[0][0] + b[3][3]) + w4*(b[1][1] + b[2][2]);
                    af = w3*(a[0][0] + a[3][3]) + w4*(a[1][1] + a[2][2]);
                }

                // anti-ringing, clamp.
                rf = this.clamp(rf, min_r_sample, max_r_sample);
                gf = this.clamp(gf, min_g_sample, max_g_sample);
                bf = this.clamp(bf, min_b_sample, max_b_sample);
                af = this.clamp(af, min_a_sample, max_a_sample);
                ri = this.clamp(Math.ceil(rf), 0, 255);
                gi = this.clamp(Math.ceil(gf), 0, 255);
                bi = this.clamp(Math.ceil(bf), 0, 255);
                ai = this.clamp(Math.ceil(af), 0, 255);

                Common.ScaledImage[((y + 1) * outw + x) * Channels] = ri;
                Common.ScaledImage[((y + 1) * outw + x) * Channels + 1] = gi; 
                Common.ScaledImage[((y + 1) * outw + x) * Channels + 2] = bi;
                Common.ScaledImage[((y + 1) * outw + x) * Channels + 3] = ai;

                ++x;
            }

            ++y;

            current += 2;

            notify({ScalingProgress: current / total });
        }

        // Third Pass
        wp[0] =  2.0;
        wp[1] =  1.0;
        wp[2] = -1.0;
        wp[3] =  4.0;
        wp[4] = -1.0;
        wp[5] =  1.0;

        for (y = outh - 1; y >= 0; --y) {
            for (x = outw - 1; x >= 0; --x) {
                for (sx = -2; sx <= 1; ++sx) {
                    for (sy = -2; sy <= 1; ++sy) {
                        
                        // clamp pixel locations
                        csy = this.clamp(sy + y, 0, scale * srcy - 1);
                        csx = this.clamp(sx + x, 0, scale * srcx - 1);

                        // sample & add weighted components
                        sample = (csy * outw + csx) * Channels;

                        r[sx + 2][sy + 2] = Common.ScaledImage[sample];
                        g[sx + 2][sy + 2] = Common.ScaledImage[sample + 1];
                        b[sx + 2][sy + 2] = Common.ScaledImage[sample + 2];
                        a[sx + 2][sy + 2] = Common.ScaledImage[sample + 3];
                        Y[sx + 2][sy + 2] = (0.2126*r[sx + 2][sy + 2] + 0.7152*g[sx + 2][sy + 2] + 0.0722*b[sx + 2][sy + 2]);
                    }
                }

                min_r_sample = Math.min(r[1][1], r[2][1], r[1][2], r[2][2]);
                min_g_sample = Math.min(g[1][1], g[2][1], g[1][2], g[2][2]);
                min_b_sample = Math.min(b[1][1], b[2][1], b[1][2], b[2][2]);
                min_a_sample = Math.min(a[1][1], a[2][1], a[1][2], a[2][2]);
                max_r_sample = Math.max(r[1][1], r[2][1], r[1][2], r[2][2]);
                max_g_sample = Math.max(g[1][1], g[2][1], g[1][2], g[2][2]);
                max_b_sample = Math.max(b[1][1], b[2][1], b[1][2], b[2][2]);
                max_a_sample = Math.max(a[1][1], a[2][1], a[1][2], a[2][2]);
                
                d_edge = this.diagonal_edge(Y, wp);

                if (d_edge <= 0) {

                    rf = w1*(r[0][3] + r[3][0]) + w2*(r[1][2] + r[2][1]);
                    gf = w1*(g[0][3] + g[3][0]) + w2*(g[1][2] + g[2][1]);
                    bf = w1*(b[0][3] + b[3][0]) + w2*(b[1][2] + b[2][1]);
                    af = w1*(a[0][3] + a[3][0]) + w2*(a[1][2] + a[2][1]);

                } else {

                    rf = w1*(r[0][0] + r[3][3]) + w2*(r[1][1] + r[2][2]);
                    gf = w1*(g[0][0] + g[3][3]) + w2*(g[1][1] + g[2][2]);
                    bf = w1*(b[0][0] + b[3][3]) + w2*(b[1][1] + b[2][2]);
                    af = w1*(a[0][0] + a[3][3]) + w2*(a[1][1] + a[2][2]);
                }

                // anti-ringing, clamp.
                rf = this.clamp(rf, min_r_sample, max_r_sample);
                gf = this.clamp(gf, min_g_sample, max_g_sample);
                bf = this.clamp(bf, min_b_sample, max_b_sample);
                af = this.clamp(af, min_a_sample, max_a_sample);
                ri = this.clamp(Math.ceil(rf), 0, 255);
                gi = this.clamp(Math.ceil(gf), 0, 255);
                bi = this.clamp(Math.ceil(bf), 0, 255);
                ai = this.clamp(Math.ceil(af), 0, 255);
                
                Common.ScaledImage[(y * outw + x) * Channels] = ri;
                Common.ScaledImage[(y * outw + x) * Channels + 1] = gi; 
                Common.ScaledImage[(y * outw + x) * Channels + 2] = bi;
                Common.ScaledImage[(y * outw + x) * Channels + 3] = ai;
            }

            current++;

            notify({ScalingProgress: current / total });
        }
    }
}