function Animation (sName, eOptions) {
    'use strict';
	
    Enum([
    	REPEAT = FLAG(0)
    	], ANIMATION_OPTIONS, a.Animation);

	this._pTracks = [];
	this._sName = sName || null;

	this._fStartTime = 0;
	this._fDuration = 0;

	this._eOptions = 0;

	if (eOptions) {
		this.setOptions(eOptions);
	}
}

PROPERTY(Animation, 'name',
	function () {
		return this._sName;
	});

Animation.prototype.setOptions = function (eOptions) {
    'use strict';
    
	this._eOptions |= eOptions;
};

Animation.prototype.getOptions = function () {
    'use strict';
    
	return this._eOptions;
};

Animation.prototype.addTrack = function (pTrack) {
    'use strict';
    
	this._pTracks.push(pTrack);

	this._fDuration = Math.max(this._fDuration, pTrack.fEndTime);
};


Animation.prototype.attachToTimeline = function (fStartTime) {
    'use strict';
    
	this._fStartTime = fStartTime;
};

Animation.prototype.bind = function (pSkeleton) {
    'use strict';
   
   	var pTracks = this._pTracks; 
   	var bResult = true;

	for (var i = pTracks.length - 1; i >= 0; i--) {
		if (!pTracks[i].bind(pSkeleton)) {
			trace('cannot bind animation track [', i, '] to joint <', pTracks[i]._sTarget, '>');
			bResult = false;
		}
	};

	return bResult;
};

Animation.prototype.play = function (fTime) {
    'use strict';
    
	var fCurTime = fTime - this._fStartTime;
    var pTracks = this._pTracks;

    if (this._eOptions & a.Animation.REPEAT) {
    	fCurTime = Math.modulus(fCurTime, this._fDuration);
    }
    else if (fCurTime < 0 || fCurTime >= this._fDuration) {
	    return;
	}

	for (var i = pTracks.length - 1, pTrack; i >= 0; i--) {
		pTrack = pTracks[i];
		trace(pTrack.fStartTime, '<', fCurTime, '<', pTrack.fEndTime);
		if (pTrack.fStartTime <= fCurTime && pTrack.fEndTime > fCurTime) {
			if (pTrack.fTime > fCurTime) {
				pTrack.reset();
			}

			pTrack.play(fCurTime);
		}
	};
};

A_NAMESPACE(Animation);