#include "../../../inc/common.ts"
#include "../../../inc/util/Parser.ts"
#include "../../../inc/util/EffectParser.ts"
#include "../../../inc/io/files.ts"

module akra{
	// var pHLSLGrammraFile: IFile = io.fopen("/akra-engine-core/src2/data/grammars/HLSL.gr", "r+t");
	// pHLSLGrammraFile.read(function(pErr: Error, sData: string){
	// 	if(!isNull(pErr)){
	// 		ERROR("Can not load grammar file.");
	// 	}
	// 	else {
	// 		LOG(sData);
	// 	}
	// });
	var client = new XMLHttpRequest();
	client.open('GET', '/akra-engine-core/src2/data/grammars/HLSL.gr');
	client.onreadystatechange = function() {
		LOG(client.responseText);
	}
	client.send();
}