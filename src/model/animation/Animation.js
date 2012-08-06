function Animation (sName, eOptions) {
    'use strict';

	this._pTracks = [];
	this._sName = sName || ('animation' + a.sid());

	this._fDuration = 0;
}

PROPERTY(Animation, 'name',
	function () {
		return this._sName;
	});

PROPERTY(Animation, 'duration',
	function () {
		return this._fDuration;
	});

Animation.prototype.addTrack = function (pTrack) {
    'use strict';
    
	this._pTracks.push(pTrack);

	this._fDuration = Math.max(this._fDuration, pTrack.fEndTime);
};



Animation.prototype.bind = function (pTarget) {
    'use strict';
   
   	var pTracks = this._pTracks; 
   	var bResult = true;

	for (var i = pTracks.length - 1; i >= 0; i--) {
		if (!pTracks[i].bind(pTarget)) {
			trace('cannot bind animation track [', i, '] to joint <', pTracks[i]._sTarget, '>');
			bResult = false;
		}
	};

	return bResult;
};

Animation.prototype.time = function (fTime, fWeight) {
    'use strict';

    fWeight = fWeight || 1.0;

	var fCurTime = fTime;
    var pTracks = this._pTracks;

    if (fCurTime < 0 || fCurTime >= this._fDuration) {
	    return;
	}

	for (var i = pTracks.length - 1, pTrack; i >= 0; i--) {
		pTrack = pTracks[i];
		if (pTrack.fStartTime <= fCurTime && pTrack.fEndTime > fCurTime) {
			pTrack.time(fCurTime, fWeight);
		}
	};
};

A_NAMESPACE(Animation);