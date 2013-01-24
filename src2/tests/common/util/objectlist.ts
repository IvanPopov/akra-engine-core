#include "util/test/testutils.ts"
#include "util/ObjectList.ts"

module akra.utils.test {
	
	var test_1 = () => {
		shouldBeTrue("ObjectArray creation");
		shouldBeTrue("ObjectArray length correct");
		
		var pTpl: uint[] = [1, 2, 3, 4, 5];
		var pList: IObjectList = new ObjectList(pTpl);

		check(isDefAndNotNull(pList));
		check(pList.length === pTpl.length);

		for (var i = 0, n = pTpl.length; i < n; ++ i) {
			var t: uint = pTpl.pop();
			shouldBeTrue("poped element is: " + t);	
			check(pList.pop() == t);
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
	}

	new Test({
		name: "ObjectList Tests",
		main: test_1,
		description: "Test all ObjectList apis"
		});
}