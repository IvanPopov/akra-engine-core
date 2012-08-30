A_FORMAT({
	'AnimationFrame': {
		members: {
			'fTime'			: 'Float',
			'fWeight'		: 'Float',
			'pMatrix'		: 'Mat4',
		},

		constructor : function () {
			return new a.AnimationFrame();
		}
	},
	'AnimationTrack': {
		members : {
			'_sTarget'		: 'String',
			'_pKeyFrames'	: 'Array',
		},

		constructor	: 'a.AnimationTrack'
	},
	'AnimationBase': {
		members: {
			'_pTargetMap'	: 'Object',
			'_pTargetList'	: 'Array',
			'_fDuration'	: 'Float',
			'_sName'		: 'String',
		},
		//если в пределах этого класс, среди членов будут найдены
		//указатели на запрещенные типы, то вместо сохранения, они 
		//будут занулены.
		blacklist: {
			'Joint'			: null, 
			'Node'			: null, 
			'SceneModel'	: null, 
			'SceneObject'	: null
		}
	},
	'Animation': {
		members: {
			'_pTracks'		: 'Array'
		},

		base		: ['AnimationBase'],
		constructor	: 'a.Animation'
	},
	'AnimationContainer': {
		members : {
			'_bEnable'		: 'Boolean',
			'_fStartTime'	: 'Float',
			'_fSpeed'		: 'Float',
			'_bLoop'		: 'Boolean',
			'_pAnimation'	: '*',
			'_fDuration'	: 'Float',
			'_bReverse'		: 'Boolean',
		},

		base		: ['AnimationBase'],
		constructor	: 'a.AnimationContainer'
	},
	'AnimationBlend': {
		members: {
			'_pAnimationList': 'Array',
		},

		base		: ['AnimationBase'],
		constructor	: 'a.AnimationBlend'
	},
	'AnimationSwitch': {
		base		: ['AnimationBase'],
		constructor	: 'a.AnimationSwitch'
	}
});