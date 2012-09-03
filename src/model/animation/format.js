A_FORMAT({
	'AnimationFrame': {
		members: {
			'fTime'			: 'Float',
			'fWeight'		: 'Float',
			'pMatrix'		: 'Mat4',
		},

		ctor : function () {
			return new a.AnimationFrame();
		}
	},
	'AnimationTrack': {
		members : {
			'_sTarget'		: 'String',
			'_pKeyFrames'	: 'Array',
		},

		ctor	: 'a.AnimationTrack'
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
			'SceneObject'	: null,
			'SceneNode'		: null
		}
	},
	'Animation': {
		members: {
			'_pTracks'		: 'Array'
		},

		base		: ['AnimationBase'],
		ctor	: 'a.Animation'
	},
	'AnimationContainer': {
		members : {
			'_bEnable'		: 'Boolean',
			'_fStartTime'	: 'Float',
			'_fSpeed'		: 'Float',
			'_bLoop'		: 'Boolean',
			'_pAnimation'	: null,
			'_fDuration'	: 'Float',
			'_bReverse'		: 'Boolean',
			'_bPause'		: 'Boolean',

		},

		base		: ['AnimationBase'],
		ctor	: 'a.AnimationContainer'
	},
	'AnimationBlend': {
		members: {
			'_pAnimationList': 'Array',
		}
,
		base		: ['AnimationBase'],
		ctor	: 'a.AnimationBlend'
	},
	'AnimationSwitch': {
		base		: ['AnimationBase'],
		ctor	: 'a.AnimationSwitch'
	},
	'AnimationController': {
		ctor: function () {
			return new a.AnimationController(this.options['engine']);
		},

		members: {
			'_pAnimations': {
				read: function () {
					return this.read();
				},
				write: 'Array'
			},
			'_eOptions': 'Int',
			'_pActiveAnimation': null
		}
	}
});