

module akra {
	export interface IURI {
		getScheme(): string;
		getUserInfo(): string;
		getFragment(): string;
		getURN(): string;
		getURL(): string;
		getAuthority(): string;
		getProtocol(): string;
		
		getHost(): string;
		setHost(sHost: string): void;

		getPort(): uint;
		setPort(iPort: uint): void;

		getPath(): string;
		setPath(sPath: string): void;

		getQuery(): string;
		setQuery(sQuery: string): void;

		toString(): string;
	}
	
	
}
