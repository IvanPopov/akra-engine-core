A_FORMAT({
	'AnimationFrame': {
		members: {
			'fTime'			: 'Float',
			'fWeight'		: 'Float',
			'pMatrix'		: {
				write: 'Mat4',
				read: function (pFrame) {
					var m4f = this.read();

					m4f.decompose(
						pFrame.qRotation,
						pFrame.v3fScale,
						pFrame.v3fTranslation);

					return m4f;
				}
			},

			// 'qRotation'		: 'Quat4',
			// 'v3fScale'		: 'Vec3',
			// 'v3fTranslation': 'Vec3'
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
			//extra data in animation
			'extra'			: 'Object'
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
			'_pAnimationList': {
				read: function (pAnimationBlend) {
					var pAnimations = this.read();
					for (var i = 0; i < pAnimations.length; ++ i) {
						pAnimationBlend.setAnimation(i, 
							pAnimations[i].animation, 
							pAnimations[i].weight,
							pAnimations[i].mask);
						trace('blend >> ', pAnimationBlend.name, 'duration > ', pAnimationBlend.duration);
					}
					trace(pAnimationBlend);
				},
				write: 'Array'
			}
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