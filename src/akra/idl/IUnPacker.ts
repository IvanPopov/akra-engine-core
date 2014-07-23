/// <reference path="IBinReader.ts" />
/// <reference path="IPackerFormat.ts" />

module akra {
	export interface IUnPacker extends IBinReader {
		getTemplate(): IPackerTemplate;
	
		read(): any;
	}
	
}
