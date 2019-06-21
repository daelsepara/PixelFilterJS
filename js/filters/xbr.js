// XBRnX family of filters by Hyllian
var Filter = class {

    Apply(Input, srcx, srcy, scale) {

        var AllowAlphaBlending = true;
        var UseOriginalImplementation = false;

        scale = Math.max(2, Math.min(4, scale));

        Init.Init(srcx, srcy, scale, scale, true);

        var Pixel, P = Array(17);

        P.fill(0);

        var total = srcy;
        var current = 0;

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                // Pixel mapping schemes for 2, 3, 4x

                // 2x
                /*
                   A1 B1 C1
                A0 PA PB PC C4    P1 P2
                D0 PD PE PF F4 => --+--
                G0 PG PH PI I4    P3 P4
                   G5 H5 I5
                */

                // 3x
                /*
                   A1 B1 C1
                A0 PA PB PC C4    P1 P2 P3
                D0 PD PE PF F4 => P4 P5 P6
                G0 PG PH PI I4    P7 P8 P9
                   G5 H5 I5
                */

                // 4x
                /*
                   A1 B1 C1       P01|P02|P03|P04
                A0 PA PB PC C4    P05|P06|P07|P08
                D0 PD PE PF F4 => ---+---+---+---
                G0 PG PH PI I4    P09|P10|P11|P12
                   G5 H5 I5       P13|P14|P15|P16
                */

                var a1 = Common.CLR(Input, srcx, srcy, x, y, -1, -2);
                var b1 = Common.CLR(Input, srcx, srcy, x, y, 0, -2);
                var c1 = Common.CLR(Input, srcx, srcy, x, y, 1, -2);

                var a0 = Common.CLR(Input, srcx, srcy, x, y, -2, -1);
                var pa = Common.CLR(Input, srcx, srcy, x, y, -1, -1);
                var pb = Common.CLR(Input, srcx, srcy, x, y, 0, -1);
                var pc = Common.CLR(Input, srcx, srcy, x, y, 1, -1);
                var c4 = Common.CLR(Input, srcx, srcy, x, y, 2, -1);

                var d0 = Common.CLR(Input, srcx, srcy, x, y, -2, 0);
                var pd = Common.CLR(Input, srcx, srcy, x, y, -1, 0);
                var pe = Common.CLR(Input, srcx, srcy, x, y, 0, 0);
                var pf = Common.CLR(Input, srcx, srcy, x, y, 1, 0);
                var f4 = Common.CLR(Input, srcx, srcy, x, y, 2, 0);

                var g0 = Common.CLR(Input, srcx, srcy, x, y, -2, 1);
                var pg = Common.CLR(Input, srcx, srcy, x, y, -1, 1);
                var ph = Common.CLR(Input, srcx, srcy, x, y, 0, 1);
                var pi = Common.CLR(Input, srcx, srcy, x, y, 1, 1);
                var i4 = Common.CLR(Input, srcx, srcy, x, y, 2, 1);

                var g5 = Common.CLR(Input, srcx, srcy, x, y, -1, 2);
                var h5 = Common.CLR(Input, srcx, srcy, x, y, 0, 2);
                var i5 = Common.CLR(Input, srcx, srcy, x, y, 1, 2);

                switch (scale) {

                    case 3: // 3x

                        P[1] = P[2] = P[3] = P[4] = P[5] = P[6] = P[7] = P[8] = P[9] = pe;

                        this._Kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, P, 3, 6, 7, 8, 9, AllowAlphaBlending, UseOriginalImplementation);
                        this._Kernel3X(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, P, 1, 2, 9, 6, 3, AllowAlphaBlending, UseOriginalImplementation);
                        this._Kernel3X(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, P, 7, 4, 3, 2, 1, AllowAlphaBlending, UseOriginalImplementation);
                        this._Kernel3X(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, P, 9, 8, 1, 4, 7, AllowAlphaBlending, UseOriginalImplementation);

                        for (Pixel = 1; Pixel < 10; Pixel++) {

                            Common.Write9RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }

                        break;

                    case 4: // 4x

                        P[1] = P[2] = P[3] = P[4] = P[5] = P[6] = P[7] = P[8] = pe;
                        P[9] = P[10] = P[11] = P[12] = P[13] = P[14] = P[15] = P[16] = pe;

                        this._Kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, P, 16, 15, 12, 4, 8, 11, 14, 13, AllowAlphaBlending);
                        this._Kernel4Xv2(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, P, 4, 8, 3, 1, 2, 7, 12, 16, AllowAlphaBlending);
                        this._Kernel4Xv2(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, P, 1, 2, 5, 13, 9, 6, 3, 4, AllowAlphaBlending);
                        this._Kernel4Xv2(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, P, 13, 9, 14, 16, 15, 10, 5, 1, AllowAlphaBlending);

                        for (Pixel = 1; Pixel < 17; Pixel++) {

                            Common.Write16RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }

                        break;

                    default: // 2x

                        P[1] = P[2] = P[3] = P[4] = pe;

                        this._Kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, P, 2, 3, 4, AllowAlphaBlending);
                        this._Kernel2Xv5(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, P, 1, 4, 2, AllowAlphaBlending);
                        this._Kernel2Xv5(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, P, 3, 2, 1, AllowAlphaBlending);
                        this._Kernel2Xv5(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, P, 4, 1, 3, AllowAlphaBlending);

                        for (Pixel = 1; Pixel < 5; Pixel++) {

                            Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                        }

                        break;
                }
            }

            current++;

            notify({ ScalingProgress: current / total });
        }
    }

    // color difference
    AbsDifference(pixel1, pixel2) {

        const _LUMINANCE_TRIGGER = 48;
        const _CHROMA_U_TRIGGER = 7;
        const _CHROMA_V_TRIGGER = 6;

        return (
            _LUMINANCE_TRIGGER * Math.abs(Common.Luminance(pixel1) - Common.Luminance(pixel2))
            + _CHROMA_V_TRIGGER * Math.abs(Common.ChromaV(pixel1) - Common.ChromaV(pixel2))
            + _CHROMA_U_TRIGGER * Math.abs(Common.ChromaU(pixel1) - Common.ChromaU(pixel2))
        );
    }

    _YuvDifference(a, b) {

        return (this.AbsDifference(a, b));
    }

    _IsEqual(a, b) {

        return (Common.IsLike(a, b));
    }

    // alpha blending
    _AlphaBlend32W(dst, offset, src, blend) {

        if (blend)
            dst[offset] = Interpolate.Interpolate2P2Q(dst[offset], src, 7, 1);
    }

    _AlphaBlend64W(dst, offset, src, blend) {

        if (blend)
            dst[offset] = Interpolate.Interpolate2P2Q(dst[offset], src, 3, 1);
    }

    _AlphaBlend128W(dst, offset, src, blend) {

        if (blend)
            dst[offset] = Interpolate.Interpolate2P(dst[offset], src);
    }

    _AlphaBlend192W(dst, offset, src, blend) {

        dst[offset] = blend ? Interpolate.Interpolate2P2Q(dst[offset], src, 1, 3) : src;
    }

    _AlphaBlend224W(dst, offset, src, blend) {

        dst[offset] = blend ? Interpolate.Interpolate2P2Q(dst[offset], src, 1, 7) : src;
    }

    // region 2x
    _Left2_2X(dst, n3, n2, pixel, blend) {

        this._AlphaBlend192W(dst, n3, pixel, blend);
        this._AlphaBlend64W(dst, n2, pixel, blend);
    }

    _Up2_2X(dst, n3, n1, pixel, blend) {

        this._AlphaBlend192W(dst, n3, pixel, blend);
        this._AlphaBlend64W(dst, n1, pixel, blend);
    }

    _Dia_2X(dst, n3, pixel, blend) {

        this._AlphaBlend128W(dst, n3, pixel, blend);
    }

    _Kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, dst, n1, n2, n3, blend) {

        var ex = (pe != ph && pe != pf);

        if (!ex)
            return;

        var e = (this._YuvDifference(pe, pc) + this._YuvDifference(pe, pg) + this._YuvDifference(pi, h5) + this._YuvDifference(pi, f4)) + (this._YuvDifference(ph, pf) << 2);
        var i = (this._YuvDifference(ph, pd) + this._YuvDifference(ph, i5) + this._YuvDifference(pf, i4) + this._YuvDifference(pf, pb)) + (this._YuvDifference(pe, pi) << 2);
        var px = (this._YuvDifference(pe, pf) <= this._YuvDifference(pe, ph)) ? pf : ph;

        if ((e < i) && ((!this._IsEqual(pf, pb) && !this._IsEqual(ph, pd)) || (this._IsEqual(pe, pi) && (!this._IsEqual(pf, i4) && !this._IsEqual(ph, i5))) || this._IsEqual(pe, pg) || this._IsEqual(pe, pc))) {

            var ke = this._YuvDifference(pf, pg);
            var ki = this._YuvDifference(ph, pc);
            var ex2 = (pe != pc && pb != pc);
            var ex3 = (pe != pg && pd != pg);

            if ((((ke << 1) <= ki) && ex3) || ((ke >= (ki << 1)) && ex2)) {

                if (((ke << 1) <= ki) && ex3)
                    this._Left2_2X(dst, n3, n2, px, blend);

                if ((ke >= (ki << 1)) && ex2)
                    this._Up2_2X(dst, n3, n1, px, blend);

            } else {

                this._Dia_2X(dst, n3, px, blend);
            }

        } else if (e <= i) {

            this._AlphaBlend64W(dst, n3, px, blend);
        }
    }
    //endregion

    //region 3x
    _LeftUp2_3X(dst, n7, n5, n6, n2, n8, pixel, blend) {

        this._AlphaBlend192W(dst, n7, pixel, blend);
        this._AlphaBlend64W(dst, n6, pixel, blend);

        dst[n5] = dst[n7];
        dst[n2] = dst[n6];
        dst[n8] = pixel;
    }

    _Left2_3X(dst, n7, n5, n6, n8, pixel, blend) {

        this._AlphaBlend192W(dst, n7, pixel, blend);
        this._AlphaBlend64W(dst, n5, pixel, blend);
        this._AlphaBlend64W(dst, n6, pixel, blend);

        dst[n8] = pixel;
    }

    _Up2_3X(dst, n5, n7, n2, n8, pixel, blend) {

        this._AlphaBlend192W(dst, n5, pixel, blend);
        this._AlphaBlend64W(dst, n7, pixel, blend);
        this._AlphaBlend64W(dst, n2, pixel, blend);

        dst[n8] = pixel;
    }

    _Dia_3X(dst, n8, n5, n7, pixel, blend) {

        this._AlphaBlend224W(dst, n8, pixel, blend);
        this._AlphaBlend32W(dst, n5, pixel, blend);
        this._AlphaBlend32W(dst, n7, pixel, blend);
    }

    _Kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, dst, n2, n5, n6, n7, n8, blend, useOriginalImplementation) {

        var ex = (pe != ph && pe != pf);

        if (!ex)
            return;

        var e = (this._YuvDifference(pe, pc) + this._YuvDifference(pe, pg) + this._YuvDifference(pi, h5) + this._YuvDifference(pi, f4)) + (this._YuvDifference(ph, pf) << 2);
        var i = (this._YuvDifference(ph, pd) + this._YuvDifference(ph, i5) + this._YuvDifference(pf, i4) + this._YuvDifference(pf, pb)) + (this._YuvDifference(pe, pi) << 2);

        var state;

        if (useOriginalImplementation)
            state = ((e < i) && ((!this._IsEqual(pf, pb) && !this._IsEqual(ph, pd)) || (this._IsEqual(pe, pi) && (!this._IsEqual(pf, i4) && !this._IsEqual(ph, i5))) || this._IsEqual(pe, pg) || this._IsEqual(pe, pc)));
        else
            state = ((e < i) && ((!this._IsEqual(pf, pb) && !this._IsEqual(pf, pc)) || (!this._IsEqual(ph, pd) && !this._IsEqual(ph, pg)) || (this._IsEqual(pe, pi) && ((!this._IsEqual(pf, f4) && !this._IsEqual(pf, i4)) || (!this._IsEqual(ph, h5) && !this._IsEqual(ph, i5)))) || this._IsEqual(pe, pg) || this._IsEqual(pe, pc)));

        if (state) {

            var ke = this._YuvDifference(pf, pg);
            var ki = this._YuvDifference(ph, pc);
            var ex2 = (pe != pc && pb != pc);
            var ex3 = (pe != pg && pd != pg);
            var px = (this._YuvDifference(pe, pf) <= this._YuvDifference(pe, ph)) ? pf : ph;

            if (((ke << 1) <= ki) && ex3 && (ke >= (ki << 1)) && ex2) {

                this._LeftUp2_3X(dst, n7, n5, n6, n2, n8, px, blend);

            } else if (((ke << 1) <= ki) && ex3) {

                this._Left2_3X(dst, n7, n5, n6, n8, px, blend);

            } else if ((ke >= (ki << 1)) && ex2) {

                this._Up2_3X(dst, n5, n7, n2, n8, px, blend);

            } else {

                this._Dia_3X(dst, n8, n5, n7, px, blend);
            }

        } else if (e <= i) {

            this._AlphaBlend128W(dst, n8, ((this._YuvDifference(pe, pf) <= this._YuvDifference(pe, ph)) ? pf : ph), blend);
        }
    }
    //endregion

    //region 4x
    _LeftUp2(dst, n15, n14, n11, n13, n12, n10, n7, n3, pixel, blend) {

        this._AlphaBlend192W(dst, n13, pixel, blend);
        this._AlphaBlend64W(dst, n12, pixel, blend);

        dst[n15] = dst[n14] = dst[n11] = pixel;
        dst[n10] = dst[n3] = dst[n12];
        dst[n7] = dst[n13];
    }

    _Left2(dst, n15, n14, n11, n13, n12, n10, pixel, blend) {

        this._AlphaBlend192W(dst, n11, pixel, blend);
        this._AlphaBlend192W(dst, n13, pixel, blend);
        this._AlphaBlend64W(dst, n10, pixel, blend);
        this._AlphaBlend64W(dst, n12, pixel, blend);

        dst[n14] = pixel;
        dst[n15] = pixel;
    }

    _Up2(dst, n15, n14, n11, n3, n7, n10, pixel, blend) {

        this._AlphaBlend192W(dst, n14, pixel, blend);
        this._AlphaBlend192W(dst, n7, pixel, blend);
        this._AlphaBlend64W(dst, n10, pixel, blend);
        this._AlphaBlend64W(dst, n3, pixel, blend);

        dst[n11] = pixel;
        dst[n15] = pixel;
    }

    _Dia(dst, n15, n14, n11, pixel, blend) {

        this._AlphaBlend128W(dst, n11, pixel, blend);
        this._AlphaBlend128W(dst, n14, pixel, blend);

        dst[n15] = pixel;
    }

    _Kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, dst, n15, n14, n11, n3, n7, n10, n13, n12, blend) {

        var ex = (pe != ph && pe != pf);

        if (!ex)
            return;

        var e = (this._YuvDifference(pe, pc) + this._YuvDifference(pe, pg) + this._YuvDifference(pi, h5) + this._YuvDifference(pi, f4)) + (this._YuvDifference(ph, pf) << 2);
        var i = (this._YuvDifference(ph, pd) + this._YuvDifference(ph, i5) + this._YuvDifference(pf, i4) + this._YuvDifference(pf, pb)) + (this._YuvDifference(pe, pi) << 2);
        var px = (this._YuvDifference(pe, pf) <= this._YuvDifference(pe, ph)) ? pf : ph;

        if ((e < i) && ((!this._IsEqual(pf, pb) && !this._IsEqual(ph, pd)) || (this._IsEqual(pe, pi) && (!this._IsEqual(pf, i4) && !this._IsEqual(ph, i5))) || this._IsEqual(pe, pg) || this._IsEqual(pe, pc))) {

            var ke = this._YuvDifference(pf, pg);
            var ki = this._YuvDifference(ph, pc);
            var ex2 = (pe != pc && pb != pc);
            var ex3 = (pe != pg && pd != pg);

            if ((((ke << 1) <= ki) && ex3) || ((ke >= (ki << 1)) && ex2)) {

                if (((ke << 1) <= ki) && ex3)
                    this._Left2(dst, n15, n14, n11, n13, n12, n10, px, blend);
                if ((ke >= (ki << 1)) && ex2)
                    this._Up2(dst, n15, n14, n11, n3, n7, n10, px, blend);

            } else {

                this._Dia(dst, n15, n14, n11, px, blend);
            }

        } else if (e <= i) {

            this._AlphaBlend128W(dst, n15, px, blend);
        }
    }
    //endregion
}