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
					pRpc.remote.echo(i, function (j: int): void {
						
						//if (i < 5) {
							shouldBeTrue("ping: " + (now() - iSendTime) +" ms" + "[ echo: " + j + " ]");	
							check(i == j);
				//		}
				
						i ++;
					})
				}, 100);
			}
		);


	}

	new Test({
		name: "RPC tests",
		main: rpc_test,
		description: "Test all RPC apis"
		});
}