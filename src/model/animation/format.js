A_FORMAT({
	'AnimationFrame': {
		'fTime'			: 'Float',
		'fWeight'		: 'Float',
		'pMatrix'		: 'Mat4',

		'@constructor'	: function () {
			return new a.AnimationFrame();
		}
	},
	'AnimationTrack': {
		'_sTarget'		: 'String',
		'_pKeyFrames'	: 'Array',

		'@constructor'	: function () {
			return new a.AnimationTrack();
		}
	},
	'AnimationBase': {
		'_pTargetMap'	: 'Object',
		'_pTargetList'	: 'Array',
		'_fDuration'	: 'Float',
		'_sName'		: 'String'
	},
	'Animation': {
		'_pTracks'		: 'Array',

		'@extends'		: ['AnimationBase'],
		'@constructor'	: function () {
			return new a.Animation();
		}
	},
	'AnimationContainer': {
		'_bEnable'		: 'Boolean',
		'_fStartTime'	: 'Float',
		'_fSpeed'		: 'Float',
		'_bLoop'		: 'Boolean',
		'_pAnimation'	: '',
		'_fDuration'	: 'Float',
		'_bReverse'		: 'Boolean',

		'@extends'		: ['AnimationBase'],
		'@constructor'	: function () {
			return new a.AnimationContainer();
		}
	},
	'AnimationBlend': {
		'_pAnimationList': 'Array',

		'@extends'		: ['AnimationBase'],
		'@constructor'	: function () {
			return new a.AnimationBlend();
		}
	},
	'AnimationSwitch': {
		'_sClass': 'String',

		'@extends'		: ['AnimationBase'],
		'@constructor'	: function () {
			return new a.AnimationSwitch();
		}
	}
});