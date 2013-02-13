#include "util/test/testutils.ts"
#include "fx/Effect.ts"

module akra.util.test {
	var test_1 = () => {
		var pEffect: IAFXEffect = new fx.Effect(null);

		shouldBeTrue("Creation test");
		check(isDefAndNotNull(pEffect));

		LOG(pEffect);
	}

	new Test({
		name: "Effect Tests",
		main: test_1,
		description: "Example creation test"
		});
}