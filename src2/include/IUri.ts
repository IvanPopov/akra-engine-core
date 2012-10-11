///<reference path="akra.ts" />

module akra {
	export interface IUri {
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