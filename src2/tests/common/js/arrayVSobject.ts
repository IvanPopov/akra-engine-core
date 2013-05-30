#include "util/testutils.ts"

module akra {

	function wrapper(fnCall: Function, nCall: uint): void {
		var time = <any>(new Date());

		var res: int = 0;
		for(var i: uint = 0; i < nCall; i++){
			res += fnCall.call(null)/nCall;
		}

		time = (<any>(new Date())) - time;
		console.log(time, res);
	}


	test("array.indexOf(var) vs Object[var]", () => {

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

		initTestObjects(10);
		generateSample(0, 10);
		
		// wrapper(testArray, 10000);
		// wrapper(testNativeArray, 10000);
		// wrapper(testObject, 10000);
		// wrapper(testObjectSave, 10000);

		// LOG(arr, obj, objSave)
	});

	test("string[] vs int[] vs any[]", () => {
		var pArrInt: uint[] = null;
		var pArrNativeInt: Uint32Array = null;
		var pArrStr: string[] = null;
		var pArrAny: any[] = null;

		function initTestObjects(nElements): void {
			pArrInt = new Array(nElements);
			pArrNativeInt = new Uint32Array(nElements);
			pArrStr = new Array(nElements);
			pArrAny = new Array(nElements);

			for(var i: uint = 0; i < nElements; i++){
				pArrInt[i] = i;
				pArrNativeInt[i] = i;
				pArrStr[i] = i.toString();
				pArrAny[i] = {0: i.toString()};
			}
		}

		var pSampleInt: uint[] = null;
		var pSampleNativeInt: Uint32Array = null;
		var pSampleStr: string[] = null;
		var pSampleAny: any[] = null;

		function generateSample(iMin: int, iMax: int): void {
			pSampleInt = new Array(iMax - iMin);
			pSampleNativeInt = new Uint32Array(iMax - iMin);
			pSampleStr = new Array(iMax - iMin);
			pSampleAny = new Array(iMax - iMin);

			for(var i: uint = 0; i < (iMax - iMin); i++){ 
				pSampleInt[i] = (i + iMin);
				pSampleNativeInt[i] = (i + iMin);
				pSampleStr[i] = (i + iMin).toString();
				pSampleAny[i] = {0: (i + iMin).toString()};
			}
		}

		function testIntArray(): uint {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < pSampleInt.length; i++){
				// nMatches += lengthInt(pSampleInt[i]);
				pSampleInt[i] = pSampleInt[pSampleInt.length - i - 1];
				// (pArrInt.indexOf(pSampleInt[i]) < 0) ? 0 : nMatches++;
			}

			return nMatches;
		}

		function testNativeIntArray(): uint {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < pSampleNativeInt.length; i++){
				// nMatches += lengthInt(pSampleNativeInt[i]);
				pSampleNativeInt[i] = pSampleNativeInt[pSampleNativeInt.length - i - 1];
				// (pArrInt.indexOf(pSampleInt[i]) < 0) ? 0 : nMatches++;
			}

			return nMatches;
		}

		function testStrArray(): uint {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < pSampleStr.length; i++){
				// nMatches += length(pSampleStr[i]);
				pSampleStr[i] = pSampleStr[pSampleStr.length - i - 1];
				// (pArrInt.indexOf(pSampleInt[i]) < 0) ? 0 : nMatches++;
			}

			return nMatches;
		}

		function testAnyArray(): uint {
			var nMatches: uint = 0;

			for(var i: uint = 0; i < pSampleAny.length; i++){
				// nMatches += length(pSampleAny[i][0]);
				pSampleAny[i] = pSampleAny[pSampleAny.length - i - 1];
				// (pArrInt.indexOf(pSampleInt[i]) < 0) ? 0 : nMatches++;
			}

			return nMatches;
		}

		// function lengthInt(value: uint): uint {
		// 	return value;
		// }

		// function length(s: string):uint {
		// 	return s.length;
		// }

		initTestObjects(10);
		generateSample(0, 200);

		wrapper(testIntArray, 100000); /*fastest*/
		wrapper(testNativeIntArray, 100000); /*slowest*/
		wrapper(testStrArray, 100000); /*10-15% slower than int[]*/
		wrapper(testAnyArray, 100000); /*10-15% slower than int[]*/

		LOG(pSampleInt, pSampleStr, pSampleAny)
	});
}