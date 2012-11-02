#ifndef IURI_TS
#define IURI_TS

module akra {
	export interface IURI {
		scheme: string;
		userinfo: string;
		host: string;
		port: uint;
		path: string;
		query: string;
		fragment: string;
		urn: string;
		url: string;
		authority: string;
		protocol: string;

		toString(): string;
	}
}

#endif