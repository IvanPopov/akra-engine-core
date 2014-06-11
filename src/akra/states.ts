/// <reference path="idl/3d-party/es6-promises.d.ts" />

module akra {
	export enum EState {
		FULFILLED,				// The action relating to the promise succeeded
		REJECTED,				// The action relating to the promise failed
		PENDING					// Hasn't fulfilled or rejected yet
	}

	export interface IResolveFunction<T_TARGET, T_RESULT> extends Function {
		(pTarget: T_TARGET, pResult: T_RESULT): void;
	}

	export interface IStateEngine<T_TARGET> {
		cancel(): void;
		resolve(): void;
		reject(e: Error): void;
	}

	export interface IState<T_TARGET, T_RESULT> {
		(fnResolve: IResolveFunction<T_TARGET, T_RESULT>, fnReject: (pTarget: T_TARGET, e: Error) => void);
	}

	export interface IDrivenState<T_TARGET, T_RESULT> extends IState<T_TARGET, T_RESULT>, IStateEngine<T_TARGET> {
	}

	class StateEngine<T_TARGET> implements IStateEngine<T_TARGET> {
		constructor(pTarget: T_TARGET) {

		}

		cancel(): void {
			console.log((<any>this).constructor);
		}

		resolve(): void {

		}

		reject(e: Error): void {

		}

		listen(fnResolve, fnReject): void {

		}
	}

	export function createState<T_TARGET, T_RESULT>(pTarget: T_TARGET): IState<T_TARGET, T_RESULT> {

		var pState: IDrivenState<T_TARGET, T_RESULT> = <any>((fnResolve, fnReject) => {
			
		});

		return null;
	}

}

