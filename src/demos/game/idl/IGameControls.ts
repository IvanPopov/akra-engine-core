/// <reference path="../../../../built/Lib/akra.d.ts"/>

interface IGameControls {
	direct: akra.IOffset;

	forward : boolean;
	back    : boolean;
	right   : boolean;
	left    : boolean;
	dodge   : boolean;
	gun     : boolean;
	harpoon : boolean;

	fire: float;
}