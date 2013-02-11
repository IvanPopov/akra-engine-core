#include "io/BinReader.ts"
#include "io/BinWriter.ts"
#include "util/test/testutils.ts"
#include "IPacker.ts"

module akra.util.test {
	
	var test_1 = () => {
		var pWriter: IBinWriter = new io.BinWriter;
		 var i8a 	= new Int8Array([-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]);
	    var i16a 	= new Int16Array([-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]);
	    var i32a 	= new Int32Array([-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]);

	    var ui8a 	= new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1, 0]);
	    var ui16a 	= new Uint16Array([8, 7, 6, 5, 4, 3, 2, 1, 0]);
	    var ui32a 	= new Uint32Array([8, 7, 6, 5, 4, 3, 2, 1, 0]);

	    var f32a 	= new Float32Array([-50, -100, -150]);
	    var f64a 	= new Float64Array([100, 200, 300]);

	    var sa 	= ["word 1", "word 2", "word 3"];


		shouldBe("Is bool: TRUE", true);
		shouldBe("Is bool: FALSE", false);
		
		shouldBe("Is uint: 8", 8);
		shouldBe("Is uint: 16", 16);
		shouldBe("Is uint: 32", 32);

		shouldBe("Is int: -8", -8);
		shouldBe("Is int: -16", -16);
		shouldBe("Is int: -32", -32);

		shouldBe("Is float: 128", 128);
		shouldBe("Is float: 256", 256);

		shouldBe("Is string: \"en/english\"", "en/english");
		shouldBe("Is string: \"ru/русский\"", "ru/русский");

		shouldBeArray("Is int8Array: [-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]", i8a);
		shouldBeArray("Is int16Array: [-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]", i16a);
		shouldBeArray("Is int32Array: [-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]", i32a);

		shouldBeArray("Is Uint8Array: [8, 7, 6, 5, 4, 3, 2, 1, 0]", ui8a);
		shouldBeArray("Is Uint16Array: [8, 7, 6, 5, 4, 3, 2, 1, 0]", ui16a);
		shouldBeArray("Is Uint32Array: [8, 7, 6, 5, 4, 3, 2, 1, 0]", ui32a);

		shouldBeArray("Is float32Array: [-50, -100, -150]", f32a);
		shouldBeArray("Is float64Array: [100, 200, 300]", f64a);

		shouldBeArray("Is stringArray: [\"word 1\", \"word 2\", \"word 3\"]", sa);

	    pWriter.bool(true);
	    pWriter.bool(false);

	    pWriter.uint8(8);
	    pWriter.uint16(16);
	    pWriter.uint32(32);

	    pWriter.int8(-8);
	    pWriter.int16(-16);
	    pWriter.int32(-32);

	    pWriter.float32(128);
	    pWriter.float64(256);

	    pWriter.string("en/english");
	    pWriter.string("ru/русский");


	    pWriter.int8Array(i8a);
	    pWriter.int16Array(i16a);
	    pWriter.int32Array(i32a);
	    
	    pWriter.uint8Array(ui8a);
	    pWriter.uint16Array(ui16a);
	    pWriter.uint32Array(ui32a);

	    pWriter.float32Array(f32a);
	    pWriter.float64Array(f64a);

	    pWriter.stringArray(sa);

	    //===========================

	    var pReader = new io.BinReader(pWriter);


	    check(pReader.bool());
	    check(pReader.bool());

	    check(pReader.uint8());
	    check(pReader.uint16());
	    check(pReader.uint32());

	    check(pReader.int8());
	    check(pReader.int16());
	    check(pReader.int32());

	    check(pReader.float32());
	    check(pReader.float64());

	    check(pReader.string());
	    check(pReader.string());

	    check(pReader.int8Array())
	    check(pReader.int16Array())
	    check(pReader.int32Array())

	    check(pReader.uint8Array())
	    check(pReader.uint16Array())
	    check(pReader.uint32Array())

	    check(pReader.float32Array())
	    check(pReader.float64Array())

	    check(pReader.stringArray())
		
	}

	new Test({
		name: "Bin Reader/Writer tests",
		main: test_1,
		description: "Test bin reader/writer api."
		});
}