/**
 * Complete animation with set of tracks.
 * @param {String} sName Animation name.
 */
function Animation (sName) {
    A_CLASS;


	this._pTracks = [];
	this.name = sName;
}

EXTENDS(Animation, a.AnimationBase);

Animation.prototype.push = function (pTrack) {
    'use strict';
    
	this._pTracks.push(pTrack);
	this._fDuration = Math.max(this._fDuration, pTrack.duration);
	this.addTarget(pTrack.targetName);
};

Animation.prototype.bind = function (pTarget) {
    'use strict';
    
    var pPointer;
    var pTracks = this._pTracks;
	for (var i = 0; i < pTracks.length; ++ i) {
		if (!pTracks[i].bind(pTarget)) {
			trace('cannot bind animation track [', i, '] to joint <', pTracks[i]._sTarget, '>');
		}
		else {
			pPointer = this.setTarget(pTracks[i].targetName, pTracks[i].target);
			pPointer.track = pTracks[i];
		}
	};
};


Animation.prototype.frame = function (sName, fTime) {
    'use strict';

    var pPointer = this._pTargetMap[sName];
    
    if (!pPointer) {
    	return null;
    }

	return pPointer.track.frame(Math.clamp(fTime, 0, this._fDuration));
};

A_NAMESPACE(Animation);