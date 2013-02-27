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
			pRpc.remote.echo(10, (err: Error, i: int) => {
				if (isNull(err)) {
					LOG(i, i === 10); 
				}
				else { 
					throw err; 
				}
			});
			// me._pRPC.proc('getMegaTexture', me._sSurfaceTextures, me.getWidthOrig(iLev), me.getHeightOrig(iLev), iX,
   //                            iY, me._iBlockSize, me._iBlockSize, me._eTextureType,
   //                            function (pData) {
		});
	});
}

