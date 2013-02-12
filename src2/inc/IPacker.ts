#ifndef IPACKER_TS
#define IPACKER_TS


module akra {
	IFACE(IPackerTemplate);

	export interface IPackerOptions {
		header?: bool;
	}

	export interface IPacker extends IBinWriter {
		template: IPackerTemplate;
		options: IPackerOptions;

		write(pData: any, sType?: string, bHeader?: bool): bool;
	}
}

#endif

