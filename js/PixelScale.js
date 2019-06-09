angular
	.module('PixelFilter', ['ngWebworker', 'ngFileSaver'])
	.controller('PixelScaleController', ['$scope', 'Webworker', 'FileSaver', 'Blob', function($scope, Webworker, FileSaver, Blob) {

		$scope.Processing = false;
		$scope.SelectedFile = '';
		$scope.InputImage = undefined;
		$scope.asyncFilter = undefined;
		$scope.Processing = false;
		$scope.FilterChosen = undefined;
		$scope.Parameter = 0;
		$scope.Parameters = [];

		$scope.Filters = [
			{name: '2xsai', parameters: [2], description: 'Derek Liauw Kie Fa\'s 2XSaI'},
			{name: '2xscl', parameters: [2], description: 'FNES\' 2x Scaling (wiithout palette mixing)'},
			{name: 'advancemame', parameters: [2, 3], description: 'AdvanceMame scaling using interpolation'},
			{name: 'bilinear+', parameters: [2], description: 'Bilinear+'},
			{name: 'bilinear++', parameters: [2], description: 'Bilinear+ with gamma adjustment'},
			{name: 'des', parameters: [1, 2], description: 'DES filters from FNES'},
			{name: 'eagle', parameters: [2, 3], description: 'Eagle nX Family of Filters'},
			{name: 'epx', parameters: [2, 3], description: 'EPX/Scale 2/3X - Eric\'s Pixel eXpander / Advance Mame Scale 2/3X'},
			{name: 'epxb', parameters: [2], description: 'SNES9x\'s EPX (variant B) modified by Hawkynt to support thresholds'},
			{name: 'epxc', parameters: [2], description: 'SNES9x\'s EPX (variant C) modified by Hawkynt to support thresholds'},
			{name: 'kuwahara', parameters: [3, 5, 7, 9, 11, 13, 15], description: 'Kuwahara Filter (nxn window)'},
			{name: 'hqnx', parameters: [2, 3, 4], description: 'Maxim Stepin\'s High Quality nX Magnification'},
			{name: 'magnify', parameters: [2, 3, 4, 5, 6, 7, 8, 9, 10], description: 'nX Pixel Duplication'},
			{name: 'reverseaa', parameters: [2], description: 'Christoph Feck\'s (christoph@maxiom.de) Reverse Anti-Alias filter'},
			{name: 'rgb', parameters: [1, 2, 3, 4], description: 'Dot-Matrix Printer Effect'},
			{name: 'super2x', parameters: [2], description: 'FNES\' Super 2x Scaling'},
			{name: 'supereagle', parameters: [2], description: 'Kreed\'s SuperEagle modified by Hawkynt to allow thresholds'},
			{name: 'supersai', parameters: [2], description: 'Kreed\'s SuperSaI'},
			{name: 'tv', parameters: [1, 2, 3, 4], description: 'TV-like effect using interlacing and gamma reduction'},
			{name: 'tvzero', parameters: [2, 3, 4], description: 'No-scaling TV-like effect using interlacing and gamma reduction'},
			{name: 'ultra2x', parameters: [2], description: 'FNES\' Ultra 2x Scaling'},
			{name: 'xbr', parameters: [2, 3, 4], description: 'XBRnX family of filters by Hyllian'}
		];

		$scope.LoadInputImage = function() {

			var reader = new FileReader();

			reader.onload = function(event) {

				$scope.$apply(function() {
					
					$scope.InputImage = reader.result;
				
				});
			}

			if ($scope.SelectedFile.name != undefined) {

				if ($scope.SelectedFile.type.match(/^image\//))
					reader.readAsDataURL($scope.SelectedFile);
			}
		}

		$scope.SelectFilter = function() {
			
			var result = $scope.Filters.find(function(element) {
				
				return element.name == $scope.FilterChosen;
			});

			if (result)
				$scope.Parameters = result.parameters;
		}

		$scope.ApplyFilter = function() {

			function async(currentPath, parameter, input) {

				importScripts(currentPath + 'js/Common.js');
				importScripts(currentPath + 'js/filters/' + parameter.filter + '.js');

				var filter = new Filter();

				filter.Apply(input.data, input.width, input.height, parameter.value);

				var output = Common.ScaledImage;

				complete({output: output, width: Common.SizeX, height: Common.SizeY});
			}

			var img = document.getElementById('InputImage');

			if (!$scope.Processing && img.width > 0 && img.height > 0 && $scope.Parameter > 0) {
				
				// extract image data
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				canvas.width = img.width;
				canvas.height = img.height;
				context.drawImage(img, 0, 0 );
			
				var imgData = context.getImageData(0, 0, img.width, img.height);
	
				var currentPath = document.URL;

				$scope.Processing = true;
				
				// mark this worker as one that supports async notifications
				$scope.asyncFilter = Webworker.create(async, { async: true });

				var input = {data: imgData.data, width: img.width, height: img.height};
				var parameter = {filter: $scope.FilterChosen, value: parseInt($scope.Parameter)};
				
				// uses the native $q style notification: https://docs.angularjs.org/api/ng/service/$q
				$scope.asyncFilter.run(currentPath, parameter, input).then(function(result) {
					
					$scope.Processing = false;
					
					// promise is resolved.
					var c = document.getElementById('OutputCanvas');
					c.width = result.width;
					c.height = result.height;

					var newImg = new ImageData(result.width, result.height);
					newImg.data.set(result.output);

					var ctx = c.getContext('2d');
					ctx.putImageData(newImg, 0, 0);

				}, null, function(result) {
					
					// promise has a notification
					
				}).catch(function(oError) {
					
					$scope.asyncFilter = null;
				});
			}
		}

	}]).directive('inputBind', function() {
		
		return function(scope, elm, attrs) {
			
			elm.bind('change', function(evt) {
				
				scope.$apply(function(scope) {
					
					scope[ attrs.name ] = evt.target.files;
					scope['Items'] = 0;
					scope['Categories'] = 0;
					scope['Inputs'] = 0;
					scope['SelectedFile'] = evt.target.files[0];
				});
			});
		};
	});
	
