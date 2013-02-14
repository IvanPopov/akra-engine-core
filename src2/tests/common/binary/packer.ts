#include "io/Packer.ts"
#include "io/UnPacker.ts"
#include "util/testutils.ts"

module akra {
	
	test("Packer/Unpacker tests", () => {
		var f32a: Float32Array = new Float32Array([4, 3, 2, 1]);
		var fnNoName: Function = function (b, c, a) {
			return Math.pow((b + a) * c, 2);
		};
		
		var pSub: Object = {
			name: "sub",
			value: [1, 2, 3, 4, 5]
		};

		var pObject: Object = {
			value: [pSub, pSub]
		}

		shouldBeArray("Must be " + f32a.toString(), f32a);
		check(io.undump(io.dump(f32a, {header: false})));

		shouldBeTrue("Function no name function: " + fnNoName.toString());
		check((<Function>io.undump(io.dump(fnNoName, {header: false})))(10, 20, 30) == fnNoName(10, 20, 30));
		
		shouldBeTrue("Object " + pObject.toString());

		var pCopy = io.undump(io.dump(pObject, {header: false}));

		check(pCopy.value[0] === pCopy.value[1]);
		LOG(pCopy);

	});
}