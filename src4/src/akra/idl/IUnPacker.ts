/// <reference path="IBinReader.ts" />
/// <reference path="IPackerFormat.ts" />

module akra {
	interface IUnPacker extends IBinReader {
		getTemplate(): IPackerTemplate;
	
		read(): any;
	}
	
}
