#include "util/testutils.ts"

module akra {

	test("array.indexOf() vs Object[]", () => {

		var arr = [], obj = {}, objSave = {};

		function initTestObjects(nElements): void {
			for(var i: uint = 0; i < nElements; i++){
				arr[i] = "elem" + i;
				obj["elem"+i] = i;
				objSave["elem"+i] = i;
			}
		}

		function wrapper(fnCall: Function, nCall: uint): void {
			var time = <any>(new Date());

			var res: int = 0;
			for(var i: uint = 0; i < nCall; i++){
				res += fnCall.call(null)/nCall;
			}

			time = (<any>(new Date())) - time;
			console.log(time, res);
		}

		var sample = null;
		function generateSample(iMin: int, iMax: int): void {
			sample = new Array(iMax - iMin);

			for(var i: uint = 0; i < sample.length; i++){
				sample[i] = "elem" + (i + iMin);
			}
		}

		function testArray(): int {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < sample.length; i++){
				(arr.indexOf(sample[i]) < 0) ? 0 : nMatches++;
			}

			return nMatches;
		}

		function testObject(): int {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < sample.length; i++){
				if(obj[sample[i]] !== undefined) nMatches++;
			}

			return nMatches;
		}

		function testObjectSave(): int {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < sample.length; i++){
				if(objSave[sample[i]] == null){
					objSave[sample[i]] = null;
				}
				else {
					nMatches++;
				}
			}

			return nMatches;
		}

		initTestObjects(50);
		generateSample(0, 200);
		
		wrapper(testArray, 10000);
		wrapper(testObject, 10000);
		wrapper(testObjectSave, 10000);

		// LOG(arr, obj, objSave)
	});
}