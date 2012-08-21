A_DEFINE_NAMESPACE(NET);

Include('Pipe.js');
Include('RPC.js');

A_NAMESPACE(Pipe, NET);

function pipe() {
	var pUri = a.uri(arguments[0]);
	var fnCallback = arguments[1];
	var pPipe = new a.NET.Pipe();

	return pPipe.open(pUri, fnCallback) || null;
}

A_NAMESPACE(pipe, NET);