#ifndef IDATAURI_TS
#define IDATAURI_TS

module akra {
	export interface IDataURI {
		base64: bool;
		data: string;
		mediatype: string;
		charset: string;
	}
}

#endif