var Filter = class {

	Apply(Input, srcx, srcy, scale, threshold) {

		scale = Math.max(1, scale);

		Init.Init(srcx, srcy, scale, scale, threshold);

		var src = Common.ToArray(Input, srcx, srcy);
		var dst = new Uint32Array(Common.SizeX * Common.SizeY);

		this.nearestNeighborScale(src, srcx, srcy, srcx, dst, Common.SizeX, Common.SizeY, Common.SizeX, 0, srcy);
		Common.ToImage(Common.ScaledImage, dst, Common.SizeX, Common.SizeY);

		notify({ ScalingProgress: 1.0 });
	}

	_FillBlock(trg, trgi, pitch, col, blockWidth, blockHeight) {

		for (var y = 0; y < blockHeight; ++y, trgi += pitch)
			for (var x = 0; x < blockWidth; ++x)
				trg[trgi + x] = col;
	}

	// from Zenju's XBRZ code
	nearestNeighborScale(src, srcWidth, srcHeight, srcPitch, trg, trgWidth, trgHeight, trgPitch, yFirst, yLast) {

		yFirst = Math.max(yFirst, 0);
		yLast = Math.min(yLast, srcHeight);

		if (yFirst >= yLast || trgWidth <= 0 || trgHeight <= 0) return;

		var total = yLast - yFirst;
		var current = 0;

		for (var y = yFirst; y < yLast; ++y) {

			//mathematically: ySrc = floor(srcHeight * yTrg / trgHeight)
			// => search for integers in: [ySrc, ySrc + 1) * trgHeight / srcHeight

			// keep within for loop to support MT input slices!
			const yTrg_first = parseInt((y * trgHeight + srcHeight - 1) / srcHeight); //=ceil(y * trgHeight / srcHeight)
			const yTrg_last = parseInt(((y + 1) * trgHeight + srcHeight - 1) / srcHeight); //=ceil(((y + 1) * trgHeight) / srcHeight)
			const blockHeight = parseInt(yTrg_last - yTrg_first);

			if (blockHeight > 0) {

				var srcLine = parseInt(y * srcPitch);
				var trgLine = parseInt(yTrg_first * trgPitch);

				var xTrg_first = 0;

				for (var x = 0; x < srcWidth; ++x) {

					const xTrg_last = parseInt(((x + 1) * trgWidth + srcWidth - 1) / srcWidth);
					const blockWidth = xTrg_last - xTrg_first;

					if (blockWidth > 0) {

						xTrg_first = xTrg_last;

						this._FillBlock(trg, trgLine, trgPitch, src[srcLine + x], blockWidth, blockHeight);

						trgLine += blockWidth;
					}
				}
			}

			current++;

			notify({ ScalingProgress: current / total * 0.8 });

		}
	}
}