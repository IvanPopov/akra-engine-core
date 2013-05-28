#include "util/testutils.ts"

module akra {

	test("array.indexOf() vs Object[]", () => {

		var arr = null, obj = null, objSave = null;
		var nativeArr = null;

		function initTestObjects(nElements): void {
			arr = new Array(nElements);
			nativeArr = new Uint32Array(nElements);
			obj = {};
			objSave = {};

			for(var i: uint = 0; i < nElements; i++){
				arr[i] = nElements - i;
				obj[i] = nElements - i;
				objSave[i] = nElements - i;
				nativeArr[i] = nElements - i;
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
				sample[i] = (i + iMin);
			}
		}

		function testArray(): int {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < sample.length; i++){
				(arr.indexOf(sample[i]) < 0) ? 0 : nMatches++;
			}

			return nMatches;
		}

		function testNativeArray(): int {
			var nMatches: uint = 0;
			for(var i: uint = 0; i < sample.length; i++){
				for(var j: uint = 0; j < nativeArr.length; j++){
					if(nativeArr[j] === sample[i]){
						nMatches++;
					}
				}
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

		initTestObjects(20);
		generateSample(0, 200);
		
		wrapper(testArray, 10000);
		wrapper(testNativeArray, 10000);
		wrapper(testObject, 10000);
		wrapper(testObjectSave, 10000);

		// LOG(arr, obj, objSave)
	});
}