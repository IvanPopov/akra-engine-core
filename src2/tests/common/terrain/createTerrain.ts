#include "core/Engine.ts"
#include "terrain/TerrainROAM.ts"
#include "util/testutils.ts"
module akra {

	test("init tests", () => {
		shouldBeNotNull("terrain");

		var pEngine: IEngine   = createEngine();
		var pTerrain: ITerrain = new terrain.TerrainROAM(pEngine);
		

		ok(pTerrain);
	});
}

