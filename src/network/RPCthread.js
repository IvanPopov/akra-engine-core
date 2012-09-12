importScripts('../files/Pathinfo.js');
importScripts('../files/URI.js');
importScripts('Pipe.js');
importScripts('RPC.js');

self.onmessage = function(e) {
	var rpc = new a.NET.RPC('ws://localhost', {}, function () {
	var i = 0;
	setInterval(function () {
		rpc.echo(i ++, function (n) {
			self.postMessage(n);
		});
		rpc.bufferTest(function (pBuffer) {
			self.postMessage(new Float32Array(pBuffer));
		});
		}, 1000);
	});
};