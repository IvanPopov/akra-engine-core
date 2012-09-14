A_FORMAT({
	'AnimationFrame': {
		members: {
			'fTime'			: 'Float',
			'fWeight'		: 'Float',
			'pMatrix'		: {
				write: function (pFrame) {
					var m4f = pFrame.pMatrix;
					if (Math.abs(pFrame.v3fScale.x - 1.0) > 0.01 || 
						Math.abs(pFrame.v3fScale.y - 1.0) > 0.01 || 
						Math.abs(pFrame.v3fScale.z - 1.0) > 0.01) {
						trace('writing > wrong pFrame detected > ', pFrame);
						trace(m4f.toString());
					}
					this.write(m4f);
				},
				read: function (pFrame) {
					var m4f = this.read();

					m4f.decompose(
						pFrame.qRotation,
						pFrame.v3fScale,
						pFrame.v3fTranslation);

					if (Math.abs(pFrame.v3fScale.x - 1.0) > 0.01 || 
						Math.abs(pFrame.v3fScale.y - 1.0) > 0.01 || 
						Math.abs(pFrame.v3fScale.z - 1.0) > 0.01) {
						trace('loading > wrong pFrame detected > ', pFrame);
						trace(m4f.toString());
					}

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
			'_sName'		: {
				read: function () {
					var str = this.read();
					trace('loading animation: ', str);
					return str;
				},
				write: function (pAnimation) {
					trace('writing animation: ', pAnimation.name);
					this.write(pAnimation.name);
				}
			},
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
			'_pAnimation'	: {
				read: function (pContainer) {
					pContainer.setAnimation(this.read());
				}
			},
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
						trace(pAnimations[i].animation.name, pAnimations[i].weight)
						pAnimationBlend.setAnimation(i, 
							pAnimations[i].animation, 
							pAnimations[i].weight,
							pAnimations[i].mask);
					}
				},
				write: function (pBlend) {
					var pAnimations = pBlend._pAnimationList;
					for (var i = 0; i < pAnimations.length; ++ i) {
						trace('write animation from list: ', 
							pAnimations[i].animation.name,
							pAnimations[i].weight);
					}
					this.write(pAnimations);
				}
			}
		}
,
		base		: ['AnimationBase'],
		ctor	: 'a.AnimationBlend',
		blacklist: {
			'Function': null
		}
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