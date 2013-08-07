export interface IGameControls {
	direct: IOffset;

	forward : bool;
	back    : bool;
	right   : bool;
	left    : bool;
	dodge   : bool;
	gun     : bool;

	fire: float;
}