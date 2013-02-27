#include "net/RPC.ts"
#include "util/testutils.ts"

module akra {
	test("init tests", () => {
		shouldBeNotNull("rpc");


		var pRpc: IRPC = net.createRpc();

		ok(pRpc);
	})
}
