// AIURI interface
// [write description here...]

module akra {
interface AIURI {
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
