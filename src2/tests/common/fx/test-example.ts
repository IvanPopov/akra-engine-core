#include "util/testutils.ts"
#include "fx/Effect.ts"
#include "AFXComposer.ts"

module akra {
	test("Example creation test", () => {
		var pEffect: IAFXEffect = new fx.Effect(null);

		shouldBeTrue("Creation test");
		check(isDefAndNotNull(pEffect));

		LOG(pEffect);
	});
}