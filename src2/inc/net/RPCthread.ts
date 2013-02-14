#include "RPC.ts"

self.onmessage = function(e) {
	var rpc: IRPC = akra.net.createRpc();

	rpc.bind(SIGNAL(connected), 
		function (pRPC: IRPC): void {
			var i: int = 0;
			setInterval(function () {
				rpc.remote.echo(i ++, function (n) {
					self.postMessage(n);
				});
				rpc.remote.bufferTest(function (pBuffer) {
					self.postMessage(new Float32Array(pBuffer));
				});
			}, 1000);
		}
	);

	rpc.connect("ws://localhost");

};