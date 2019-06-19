var Filter = class {

    Apply(Input, srcx, srcy, scale, threshold, win = 3.0) {

        scale = Math.max(1, scale);
        win = Math.max(3, win);

        Init.Init(srcx, srcy, scale, scale, threshold);
        
        this.Resize(Input, srcx, srcy, win, Common.ScaledImage, Common.SizeX, Common.SizeY);
    }

    sinc(x) {

        x = (x * Math.PI);

        if (x < 0.01 && x > -0.01)
            return 1.0 + x * x *(-1.0 / 6.0 + x * x / 120.0);

        return Math.sin(x) / x;
    }

    LanczosFilter(x, lanczos_size) {

        if (Math.abs(x) < lanczos_size) {

            return this.sinc(x) * this.sinc(x / lanczos_size);
        }

        return 0.0;
    }

    Resize(src, srcw, srch, lanczos_size, resized, M, N) {

        const Channels = 4;

        var col_ratio = parseFloat(srcw / M);
        var row_ratio = parseFloat(srch / N);

        var r, c, i, j, v_toSet, weight, row_within, col_within, floor_row, floor_col, lanc_term;
        var win = parseInt(lanczos_size);

        var total = (Channels) * N;
        var current = 0;

        // do not include alpha channel
        for (var Channel = 0; Channel < Channels; Channel++) {

            // Now apply a filter to the image.
            for (r = 0; r < N; ++r) {

                row_within = r * row_ratio;

                floor_row = parseInt(row_within);

                for (c = 0; c < M; ++c) {

                    // x is the new col in terms of the old col coordinates.
                    col_within = c * col_ratio;

                    // The old col corresponding to the closest new col.
                    floor_col = parseInt(col_within);

                    v_toSet = 0;
                    weight = 0.0;

                    for (i = floor_row - win + 1; i <= floor_row + win; ++i) {
                        for (j = floor_col - win + 1; j <= floor_col + win; ++j) {

                            if (i >= 0 && i < srch && j >= 0 && j < srcw) {

                                lanc_term = this.LanczosFilter(row_within - i, lanczos_size) * this.LanczosFilter(col_within - j, lanczos_size);

                                v_toSet += src[(i * srcw + j) * Channels + Channel] * lanc_term;

                                weight += lanc_term;
                            }
                        }
                    }

                    v_toSet /= weight;

                    resized[(r * M + c) * Channels + Channel] = Common._Clip8(parseInt(v_toSet));
                }

                current++;

                notify({ScalingProgress: current / total});
            }
        }
    }
}