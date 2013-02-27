#include "net/RPC.ts"
#include "util/testutils.ts"

module akra {
	export var pRpc: IRPC = null;

	test("init tests", () => {
		shouldBeNotNull("rpc");

		pRpc = net.createRpc();
		

		ok(pRpc);
	});

	asyncTest("get mega texture", () => {
		pRpc.join("ws://localhost:6112");
		pRpc.bind(SIGNAL(joined), (pRpc: IRPC) => {
			pRpc.remote.getMegaTexture("", 32, 32, 0, 0, 32, 32, 0x1907/* RGB */,
				(err: Error, pData: ArrayBuffer) => {
					if (isNull(err)) {
						LOG(pData); 
					}
					else { 
						throw err; 
					}
				});
		});
	});
}

