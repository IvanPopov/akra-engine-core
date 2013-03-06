#ifndef GAMEPADMAP_TS
#define GAMEPADMAP_TS

#include "IGamepadMap.ts"
#include "info/info.ts"

#define TYPICAL_BUTTON_COUNT 16
#define TYPICAL_AXIS_COUNT 4

module akra.controls {
	class GamepadMap implements IGamepadMap {
		private _bTicking: bool = false;
		private _pCollection: Gamepad[] = [];
		private _pPrevRawGamepadTypes: string[];
		private _pPrevTimestamps: long[];

		init(): bool {

			if (!info.api.gamepad) {
	            WARNING("Gamepad API is unsupported.");
	            return false;
	        }

	        var pMap: GamepadMap = this;
	        var pCollection: Gamepad[] = this._pCollection;
        
            window.addEventListener('MozGamepadConnected', (e: GamepadEvent) => {
            	pCollection.push(e.gamepad);
			    pMap.connected(e.gamepad);
			    pMap._startPolling();
            }, false);

            window.addEventListener('MozGamepadDisconnected', (e: GamepadEvent) => {	
		        for (var i: int = 0; i <pCollection.length; ++ i) {
		            if (pCollection[i].index == e.gamepad.index) {
		                pMap.disconnected(pCollection.splice(i, 1)[0]);
		                break;
		            }
		        }

		        if (pCollection.length == 0) {
		            pMap._stopPolling();
		        }
            }, false);
            
            if ( !! navigator.gamepads || !! navigator.getGamepads) {
                this._startPolling();
                return true;
            }

            return false;
		}

		inline isActive(): bool {
			return this._bTicking;
		}


		find(sID?: string): Gamepad;
    	find(i?: int): Gamepad;
    	find(id?): Gamepad {
    		var sID: string = null;
    		var i: int = 0;

    		if (arguments.length) {
    			if (isString(arguments[0])) {
    				sID = <string>arguments[0];
    			}
    			else if (isInt(arguments[0])) {
    				i = <int>arguments[0];
    			}
    		}

    		if (!isNull(sID)) {
    			for (i = 0; i < this._pCollection.length; ++ i) {
    				if (this._pCollection[i].id == sID) {
    					return this._pCollection[i];
    				}
    			}
    		}

    		return this._pCollection[i];
    	}

		inline _startPolling(): void {
			 if (!this._bTicking) {
	            this._bTicking = true;
	            this.update();
	        }
		}

		inline _stopPolling(): void {
			this._bTicking = false;
		}

		inline update(): void {
			this.pollStatus();
		}

		private pollStatus(): void {
			if (!this._bTicking) {
				return;
			}

			this.pollGamepads();

	        for (var i in this._pCollection) {
	            var pGamepad: Gamepad = this._pCollection[i];
	            
	            if (pGamepad.timestamp && (pGamepad.timestamp == this._pPrevTimestamps[i])) {
	                continue;
	            }

	            this._pPrevTimestamps[i] = pGamepad.timestamp;
	        }
		}

		private pollGamepads(): void {
			var pRawGamepads: Gamepad[] = (navigator.getGamepads && navigator.getGamepads()) || navigator.gamepads;
	        if (isDefAndNotNull(pRawGamepads)) {
	        	debug_print("get raw gamepads");

	            this._pCollection = [];
	            
	            var isGamepadsChanged: bool = false;
	            
	            for (var i: int = 0; i < pRawGamepads.length; i++) {
	                if (typeof pRawGamepads[i] != this._pPrevRawGamepadTypes[i]) {
	                    
	                    isGamepadsChanged = true;
	                    this._pPrevRawGamepadTypes[i] = typeof pRawGamepads[i];
	                    
	                    if (isDefAndNotNull(pRawGamepads[i])) {
	                        this.updated(pRawGamepads[i]);
	                    }
	                }

	                if (isDefAndNotNull(pRawGamepads[i])) {
	                    this._pCollection.push(pRawGamepads[i]);
	                }
	            }

	            //if (isGamepadsChanged) {
	                //todo: collection changed...
	            //}
	        }
		}

		BEGIN_EVENT_TABLE(GamepadMap);
			BROADCAST(connected, CALL(pGamepad));
			BROADCAST(disconnected, CALL(pGamepad));
			BROADCAST(updated, CALL(pGamepad));
		END_EVENT_TABLE();
	}

	export function createGamepadMap(): IGamepadMap {
		return new GamepadMap;
	}
}

#endif