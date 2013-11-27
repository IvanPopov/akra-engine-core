/// <reference path="IUnique.ts" />

module akra {
    export enum EEventType {
        UNICAST,
        BROADCAST
    }

    export interface ISignal<T extends Function> {
        connect(fnCallback: T, eType?: EEventType): boolean;
        connect(fnCallback: string, eType?: EEventType): boolean;
        connect(pReciever: any, fnCallback: T, eType?: EEventType): boolean;
        connect(pReciever: any, fnCallback: string, eType?: EEventType): boolean;

        disconnect(fnCallback: T, eType?: EEventType): boolean;
        disconnect(fnCallback: string, eType?: EEventType): boolean;
        disconnect(pReciever: any, fnCallback: T, eType?: EEventType): boolean;
        disconnect(pReciever: any, fnCallback: string, eType?: EEventType): boolean;

        emit(...args: any[]);
        clear(): void;
        hasListeners(): boolean;
    }

    export interface IListener<T extends Function> {
        reciever: any;
        callback: T;
        type: EEventType;
    }
	
	export interface IEventProvider extends IUnique {
		
	}
}
