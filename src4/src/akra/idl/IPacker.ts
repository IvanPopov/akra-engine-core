

module akra {
	interface IPackerOptions {
		header?: boolean;
	}
	
	interface IPacker extends IBinWriter {
		getTemplate(): IPackerTemplate;
		write(pData: any, sType?: string, bHeader?: boolean): boolean;
	}
	
}
