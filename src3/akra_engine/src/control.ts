import GamepadMap = require("control/GamepadMap");
import KeyMap = require("control/KeyMap");

export function createGamepadMap(): AIGamepadMap {
    return new GamepadMap;
}

export function createKeymap(target?: Document): AIKeyMap;
export function createKeymap(target?: HTMLElement): AIKeyMap;
export function createKeymap(target?: any): AIKeyMap {
	return new KeyMap(target);
}