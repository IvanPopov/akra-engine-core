#include "util/test/testutils.ts"
#include "util/ObjectList.ts"

module akra.util {
	
	test("ObjectList Tests", () => {

		shouldBeTrue("ObjectArray creation");
		shouldBeTrue("ObjectArray length correct");
		
		var pTpl: uint[] = [1, 2, 3, 4, 5];
		var pList: IObjectList = new ObjectList(pTpl);

		check(isDefAndNotNull(pList));
		check(pList.length === pTpl.length);

		for (var i = 0, n = pTpl.length; i < n; ++ i) {
			var t: uint = pTpl.pop();
			var e: uint = pList.pop();

			shouldBeTrue("poped element is: " + t);	
			check(e == t);
		}

		shouldBeTrue("length is 0");	
		check(pList.length === pTpl.length);

		for (var i: uint = 0; i < 5; ++ i) {
			pList.push(i);
			pTpl.push(i);
			shouldBeTrue("pushed element is: " + i);
			check(pList.value(i) === pTpl[i] && pTpl.length == pList.length);
		}

		shouldBeTrue("length is 0 after cleaning");
		check(0 == pList.clear().length);


		pList.fromArray(pTpl);

		var pSubList: IObjectList = pList.slice(2, 4);
		var pSubArray: uint[] = pTpl.slice(2, 4);


		shouldBeTrue("slice works correctly");

		for (var i = 0, n = pSubArray.length; i < n; ++ i) {

			if (pSubArray[i] !== pSubList.value(i)) {
				check(false);
				break;
			}

			if (i === n - 1) {
				check(true);
			}
		}

		shouldBeTrue("indexOf works correctly");
		check(pSubArray.indexOf(2) == pSubList.indexOf(2) && pSubArray.indexOf(10) == pSubList.indexOf(10));

		shouldBeTrue("forEach works correctly");
		pList.forEach(function(pData: any, i?: uint) {
			if (pData !== pTpl[i]) {
				check(false);
			}
			else if (i === pTpl.length - 1) {
				check(true);
			}

			//console.log(i, ": ", pData, "(", pTpl[i], ")");
		});
	});
}