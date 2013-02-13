#include "fx/Effect.ts"

module akra.fx.test {
	var test_1 = () => {
		var pEffect: IAFXEffect = new Effect(null);

		shouldBeTrue("Creation test");
		check(isDefAndNotNull(pEffect));
	}

	new Test({
		name: "Effect Tests",
		main: test_1,
		description: "Example creation test"
		});
}