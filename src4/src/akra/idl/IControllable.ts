 
module akra {
	export enum EUserEvents {
		CLICK = 0x01,
		MOUSEMOVE = 0x02,
		MOUSEDOWN = 0x04,
		MOUSEUP = 0x08,
		MOUSEOVER = 0x10,
		MOUSEOUT = 0x20,
		DRAGSTART = 0x40,
		DRAGSTOP = 0x80,
		DRAGGING = 0x100,
		MOUSEWHEEL = 0x200,

		ANY = CLICK | MOUSEMOVE | MOUSEDOWN | MOUSEUP | MOUSEOVER | MOUSEOUT | DRAGSTART | DRAGSTOP | DRAGGING | MOUSEWHEEL
	}

	export interface IControllable {
		enableSupportForUserEvent(iType: int): int;
		isUserEventSupported(eType: EUserEvents): boolean;
	}
 }

