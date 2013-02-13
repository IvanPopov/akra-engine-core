#include "util/test/testutils.ts"
#include "net/RPC.ts"

module akra.util.test {
	
	var rpc_test = () => {
		var pRpc: IRPC = net.createRpc();
		var i: int = 0;
		
		pRpc.join("ws://localhost");

		pRpc.bind(SIGNAL(joined), 
			function (pRpc: IRPC): void {

				setInterval(function (): void {

					var iSendTime: int = now();
			
					(function (n) {
						pRpc.remote.echo(n, function (pErr: Error, j: int): void {
							if (!isNull(pErr)) {
								WARNING(pErr.message);
								return;
							}

							shouldBeTrue("ping: " + (now() - iSendTime) +" ms" + "[ echo: " + j + " ]");	
							check(n == j);
					
							
						})
					})(i ++);
				}, 10);
			}
		);


	}

	new Test({
		name: "RPC tests",
		main: rpc_test,
		description: "Test all RPC apis"
		});
}