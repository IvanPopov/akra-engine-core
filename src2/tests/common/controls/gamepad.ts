#include "akra.ts"
#include "util/testutils.ts"

module akra {
	var pEngine: IEngine = createEngine();
	var pGamepads: IGamepadMap = pEngine.getGamepads();

	test("Gamepad", () => {
		shouldBeNotNull("Is gamepad supported?");
		ok(pGamepads);
	});
}