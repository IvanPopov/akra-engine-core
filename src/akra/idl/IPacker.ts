

module akra {
	export interface IPackerOptions {
		header?: boolean;
	}
	
	export interface IPacker extends IBinWriter {
		getTemplate(): IPackerTemplate;
		write(pData: any, sType?: string, bHeader?: boolean): boolean;
	}
	
}
