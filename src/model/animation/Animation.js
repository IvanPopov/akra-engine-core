/**
 * Complete animation with set of tracks.
 * @param {String} sName Animation name.
 */
function Animation (sName) {
    'use strict';

    a.AnimationBase.call(this);

	/**
	 * Animation name.
	 * @private
	 * @type {[type]}
	 */
	this._sName = sName || ('animation' + a.sid());
	this._fDuration = 0;
}

EXTENDS(Animation, Array, a.AnimationBase);

PROPERTY(Animation, 'name',
	function () {
		return this._sName;
	});

PROPERTY(Animation, 'duration',
	function () {
		return this._fDuration;
	});


Animation.prototype.push = function (pTrack) {
    'use strict';
    
	Array.prototype.push.call(this, pTrack);
	this._fDuration = Math.max(this._fDuration, pTrack.duration);
	this.addTarget(pTrack.targetName);
};

Animation.prototype.bind = function (pTarget) {
    'use strict';
   
	for (var i = this.length - 1; i--;) {
		if (!this[i].bind(pTarget)) {
			trace('cannot bind animation track [', i, '] to joint <', pTracks[i]._sTarget, '>');
		}
		else {
			this.setTarget(this[i].targetName, this[i].target);
		}
	};
};

Animation.prototype.update = function (fTime, bLoop) {
    'use strict';

    if (fTime > this._fDuration) {
    	fTime = (bLoop === true? fTime % (this._fDuration): this._fDuration);
    }

	for (var i = this.length - 1; i--;) {
		var pTrack = this[i];
		
		if (pTrack.pTarget === null) {
			continue;
		}
		
		pTrack.update(fTime);
	};

	return fTime;
};

A_NAMESPACE(Animation);