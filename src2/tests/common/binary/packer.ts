#include "io/Packer.ts"
#include "io/UnPacker.ts"
#include "util/test/testutils.ts"


module akra.util.test {
	
	var test_1 = () => {
		var f32a: Float32Array = new Float32Array([4, 3, 2, 1]);
		var fnNoName: Function = function (b, c, a) {
			return Math.pow((b + a) * c, 2);
		};

		shouldBeArray("Must be " + f32a.toString(), f32a);
		check(io.undump(io.dump(f32a, {header: false})));

		shouldBeTrue("Function no name function: " + fnNoName.toString());
		check((<Function>io.undump(io.dump(fnNoName, {header: false}))).toString() == fnNoName.toString());
		console.log(io.undump(io.dump(fnNoName, {header: false})));

	};

	new Test({
		name: "Packer/Unpacker tests",
		main: test_1,
		description: "Test bin packer/unpacker api."
		});
}