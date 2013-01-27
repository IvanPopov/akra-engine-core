#include "util/test/testutils.ts"
#include "util/ObjectArray.ts"

module akra.util.test {
	
	var test_1 = () => {
		shouldBeTrue("ObjectArray creation");
		shouldBeTrue("ObjectArray length correct");
		
		var pTpl: uint[] = [1, 2, 3, 4, 5];
		var pArray: IObjectArray = new ObjectArray(pTpl);

		check(isDefAndNotNull(pArray));
		check(pArray.length === pTpl.length);

		for (var i = 0, n = pTpl.length; i < n; ++ i) {
			var t: uint = pTpl.pop();
			shouldBeTrue("poped element is: " + t);	
			check(pArray.pop() == t);
		}

		shouldBeTrue("length is 0");	
		check(pArray.length === pTpl.length);

		for (var i: uint = 0; i < 5; ++ i) {
			pArray.push(i);
			pTpl.push(i);
			shouldBeTrue("pushed element is: " + i);
			check(pArray.value(i) === pTpl[i] && pTpl.length == pArray.length);
		}

		shouldBeTrue("length is 0 after cleaning");
		check(0 == pArray.clear().length);
	}

	new Test({
		name: "ObjectArray Tests",
		main: test_1,
		description: "Test all ObjectArray apis"
		});
}