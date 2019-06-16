// Christoph Feck's (christoph@maxiom.de) Reverse Anti-Alias filter
class Filter {

    Apply(Input, srcx, srcy, scale, threshold) {

        scale = 2;
			
        Init.Init(srcx, srcy, scale, scale, threshold);

        var P = Array(5);
        
        P.fill(0);

        var total = srcy;
        var current = 0;

        for (var y = 0; y < srcy; y++) {
            for (var x = 0; x < srcx; x++) {

                var b1 = Common.CLRA(Input, srcx, srcy, x, y, 0, -2);
                var b = Common.CLRA(Input, srcx, srcy, x, y, 0, -1);
                var d = Common.CLRA(Input, srcx, srcy, x, y, -1, 0);
                var e = Common.CLRA(Input, srcx, srcy, x, y, 0, 0);
                var f = Common.CLRA(Input, srcx, srcy, x, y, 1, 0);
                var h = Common.CLRA(Input, srcx, srcy, x, y, 0, 1);
                var h5 = Common.CLRA(Input, srcx, srcy, x, y, 0, 2);
                var d0 = Common.CLRA(Input, srcx, srcy, x, y, -2, 0);
                var f4 = Common.CLRA(Input, srcx, srcy, x, y, 2, 0);

                var rr = 0, rg = 0, rb = 0, ra = 0;
                var gr = 0, gg = 0, gb = 0, ga = 0;
                var br = 0, bg = 0, bb = 0, ba = 0;
                var ar = 0, ag = 0, ab = 0, aa = 0;
                var result;

                // return {rd: this.FullClamp(e0), gn: this.FullClamp(e1), bl: this.FullClamp(e2), alpha: this.FullClamp(e3)};
                result = ReverseAA._ReverseAntiAlias(Common.Red(b1), Common.Red(b), Common.Red(d), Common.Red(e), Common.Red(f), Common.Red(h), Common.Red(h5), Common.Red(d0), Common.Red(f4));
                rr = result.rd, rg = result.gn, rb = result.bl, ra = result.alpha;

                result = ReverseAA._ReverseAntiAlias(Common.Green(b1), Common.Green(b), Common.Green(d), Common.Green(e), Common.Green(f), Common.Green(h), Common.Green(h5), Common.Green(d0), Common.Green(f4));
                gr = result.rd, gg = result.gn, gb = result.bl, ga = result.alpha;

                result = ReverseAA._ReverseAntiAlias(Common.Blue(b1), Common.Blue(b), Common.Blue(d), Common.Blue(e), Common.Blue(f), Common.Blue(h), Common.Blue(h5), Common.Blue(d0), Common.Blue(f4));
                br = result.rd, bg = result.gn, bb = result.bl, ba = result.alpha;

                result = ReverseAA._ReverseAntiAlias(Common.Alpha(b1), Common.Alpha(b), Common.Alpha(d), Common.Alpha(e), Common.Alpha(f), Common.Alpha(h), Common.Alpha(h5), Common.Alpha(d0), Common.Alpha(f4));
                ar = result.rd, ag = result.gn, ab = result.bl, aa = result.alpha;

                P[1] = Common.ARGBINT(ReverseAA.FullClamp(ar), ReverseAA.FullClamp(rr), ReverseAA.FullClamp(gr), ReverseAA.FullClamp(br));
                P[2] = Common.ARGBINT(ReverseAA.FullClamp(ag), ReverseAA.FullClamp(rg), ReverseAA.FullClamp(gg), ReverseAA.FullClamp(bg));
                P[3] = Common.ARGBINT(ReverseAA.FullClamp(ab), ReverseAA.FullClamp(rb), ReverseAA.FullClamp(gb), ReverseAA.FullClamp(bb));
                P[4] = Common.ARGBINT(ReverseAA.FullClamp(aa), ReverseAA.FullClamp(ra), ReverseAA.FullClamp(ga), ReverseAA.FullClamp(ba));

                for (var Pixel = 1; Pixel < 5; Pixel++) {

                    Common.Write4RGBA(Common.ScaledImage, srcx, srcy, x, y, Pixel, P[Pixel]);
                }
            }

            current++;

            notify({ScalingProgress: current / total});
        }
    }
}