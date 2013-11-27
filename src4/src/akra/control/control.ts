/// <reference path="GamepadMap.ts" />
/// <reference path="KeyMap.ts" />

module akra.control {
    export function createGamepadMap(): IGamepadMap {
        return new GamepadMap;
    }

    export function createKeymap(target?: Document): IKeyMap;
    export function createKeymap(target?: HTMLElement): IKeyMap;
    export function createKeymap(target?: any): IKeyMap {
        return new KeyMap(target);
    }

}