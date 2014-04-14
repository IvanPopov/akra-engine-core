/// <reference path="../idl/ILightPoint.ts" />
/// <reference path="../idl/IShaderInput.ts" />
/// <reference path="../idl/IAFXSamplerState.ts" />
/// <reference path="../idl/IOmniLight.ts" />
/// <reference path="../idl/IProjectLight.ts" />
/// <reference path="../idl/ISunLight.ts" />

/// <reference path="../fx/PassInputBlend.ts" />


module akra.render {
	// done to rename interfaces, in the future it 
	// easier to move to other samplers states.
	interface IShadowSampler extends IAFXSamplerState {}
	interface ISampler2d extends IAFXSamplerState {}

	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat4 = math.Mat4;

	export interface IUniform {

	}

	export class LightData {
		DIFFUSE: IVec4 = new Vec4();
		AMBIENT: IVec4 = new Vec4();
		SPECULAR: IVec4 = new Vec4();
		POSITION: IVec3 = new Vec3();
		ATTENUATION: IVec3 = new Vec3();

		// set(pLightParam: IOmniParameters, v3fPosition: IVec3): LightData;
		// set(pLightParam: IProjectParameters, v3fPosition: IVec3): LightData;
		set(pLightParam: ILightParameters, v3fPosition: IVec3): LightData;
		set(pLightParam: any, v3fPosition: IVec3): LightData {
			
			this.DIFFUSE.set(pLightParam.diffuse);
			this.AMBIENT.set(pLightParam.ambient);
			this.SPECULAR.set(pLightParam.specular);
			this.ATTENUATION.set(pLightParam.attenuation);
			this.POSITION.set(v3fPosition);

			return this;
		}
	}

	export class SunLightData {
		SUN_DIRECTION: IVec3 = new Vec3();
		EYE_POSITION: IVec3 = new Vec3();
		GROUNDC0: IVec3 = new Vec3();
		GROUNDC1: IVec3 = new Vec3();
		HG: IVec3 = new Vec3;
		SKY_DOME_ID: int = 0;

		set(pSunParam: ISunParameters, iSunDomeId: int): SunLightData {
			this.SUN_DIRECTION.set(pSunParam.sunDir);
			this.EYE_POSITION.set(pSunParam.eyePosition);
			this.GROUNDC0.set(pSunParam.groundC0);
			this.GROUNDC1.set(pSunParam.groundC1);
			this.HG.set(pSunParam.hg);
			this.SKY_DOME_ID = iSunDomeId;

			return this;
		}
	}

	//////////////////////////////////////


	export class UniformOmni implements IUniform {
		LIGHT_DATA: LightData = new LightData();

		setLightData(pLightParam: IOmniParameters, v3fPosition: IVec3): UniformOmni {
			this.LIGHT_DATA.set(pLightParam, v3fPosition);
			
			return this;
		}

		private static _pBuffer: IUniform[] = gen.array<IUniform>(200, UniformOmni);
		private static _iElement: uint = 0;

		static temp(): IUniform {
			UniformOmni._iElement = (UniformOmni._iElement === UniformOmni._pBuffer.length - 1 ? 0 : UniformOmni._iElement);
			var p = UniformOmni._pBuffer[UniformOmni._iElement++];
			return p;
		}

	}

	//////////////////////////////////////

	export class UniformProject implements IUniform {
		LIGHT_DATA: LightData = new LightData();
		SHADOW_MATRIX: IMat4 = new Mat4();

		setLightData(pLightParam: IProjectParameters, v3fPosition: IVec3): UniformProject {
			this.LIGHT_DATA.set(pLightParam, v3fPosition);
			
			return this;
		}

		setMatrix(m4fMatrix: IMat4): UniformProject {
			this.SHADOW_MATRIX.set(m4fMatrix);
			return this;
		}

		private static _pBuffer: IUniform[] = gen.array<IUniform>(200, UniformProject);
		private static _iElement: uint = 0;

		static temp(): IUniform {
			UniformProject._iElement = (UniformProject._iElement === UniformProject._pBuffer.length - 1 ? 0 : UniformProject._iElement);
			var p = UniformProject._pBuffer[UniformProject._iElement++];
			return p;
		}
	}

	//////////////////////////////////////


	export class UniformProjectShadow implements IUniform {
		LIGHT_DATA: LightData = new LightData();
		TO_LIGHT_SPACE: IMat4 = new Mat4();
		REAL_PROJECTION_MATRIX: IMat4 = new Mat4();
		OPTIMIZED_PROJECTION_MATRIX: IMat4 = new Mat4();
		SHADOW_SAMPLER: IAFXSamplerState = render.createSamplerState();

		setLightData(pLightParam: IProjectParameters, v3fPosition: IVec3): UniformProjectShadow {
			this.LIGHT_DATA.set(pLightParam, v3fPosition);
			return this;
		}

		setMatrix(m4fToLightSpace: IMat4, m4fRealProj: IMat4, m4fOptimizedProj: IMat4): UniformProjectShadow {
			this.TO_LIGHT_SPACE.set(m4fToLightSpace);
			this.REAL_PROJECTION_MATRIX.set(m4fRealProj);
			this.OPTIMIZED_PROJECTION_MATRIX.set(m4fOptimizedProj);

			return this;
		}

		setSampler(sTexture: string): UniformProjectShadow {
			this.SHADOW_SAMPLER.textureName = sTexture;
			return this;
		}

		private static _pBuffer: IUniform[] = gen.array<IUniform>(20, UniformProjectShadow);
		private static _iElement: uint = 0;

		static temp(): IUniform {
			UniformProjectShadow._iElement = (UniformProjectShadow._iElement === UniformProjectShadow._pBuffer.length - 1 ? 0 : UniformProjectShadow._iElement);
			var p = UniformProjectShadow._pBuffer[UniformProjectShadow._iElement++];
			return p;
		}
	}

	//////////////////////////////////////

	export class UniformOmniShadow implements IUniform {
		LIGHT_DATA: LightData = new LightData;
		TO_LIGHT_SPACE: IMat4[] = 
		[
			new Mat4, new Mat4, new Mat4, 
			new Mat4, new Mat4, new Mat4
		];

		OPTIMIZED_PROJECTION_MATRIX: IMat4[] = 
		[
			new Mat4, new Mat4, new Mat4, 
			new Mat4, new Mat4, new Mat4
		];
		
		SHADOW_SAMPLER: IAFXSamplerState[] = 
		[
			render.createSamplerState(), render.createSamplerState(), render.createSamplerState(),
			render.createSamplerState(), render.createSamplerState(), render.createSamplerState()
		];

		setLightData(pLightParam: IOmniParameters, v3fPosition: IVec3): UniformOmniShadow {
			this.LIGHT_DATA.set(pLightParam, v3fPosition);
			return this;
		}

		setMatrix(m4fToLightSpace: IMat4, m4fOptimizedProj: IMat4, index: int): UniformOmniShadow {
			this.TO_LIGHT_SPACE[index].set(m4fToLightSpace);
			this.OPTIMIZED_PROJECTION_MATRIX[index].set(m4fOptimizedProj);
			return this;
		}

		setSampler(sTexture: string, index: int): UniformOmniShadow {
			this.SHADOW_SAMPLER[index].textureName = sTexture;
			return this;
		}

		private static _pBuffer: IUniform[] = gen.array<IUniform>(3, UniformOmniShadow);
		private static _iElement: uint = 0;

		static temp(): IUniform {
			UniformOmniShadow._iElement = (UniformOmniShadow._iElement === UniformOmniShadow._pBuffer.length - 1 ? 0 : UniformOmniShadow._iElement);
			var p = UniformOmniShadow._pBuffer[UniformOmniShadow._iElement++];
			return p;
		}
	}

	//////////////////////////////////////

	export class UniformSun implements IUniform {
		LIGHT_DATA: SunLightData = new SunLightData();

		setLightData(pSunParam: ISunParameters, iSunDomeId: int): UniformSun {
			this.LIGHT_DATA.set(pSunParam, iSunDomeId);
			return this;
		}


		private static _pBuffer: IUniform[] = gen.array<IUniform>(3, UniformSun);
		private static _iElement: uint = 0;

		static temp(): IUniform {
			UniformSun._iElement = (UniformSun._iElement === UniformSun._pBuffer.length - 1 ? 0 : UniformSun._iElement);
			var p = UniformSun._pBuffer[UniformSun._iElement++];
			return p;
		}
	}

	//////////////////////////////////////

	export class UniformSunShadow implements IUniform {
		LIGHT_DATA: SunLightData = new SunLightData();

		SHADOW_SAMPLER: IAFXSamplerState = render.createSamplerState();
		TO_LIGHT_SPACE: IMat4 = new Mat4();
		OPTIMIZED_PROJECTION_MATRIX: IMat4 = new Mat4();

		setLightData(pSunParam: ISunParameters, iSunDomeId: int): UniformSunShadow {
			this.LIGHT_DATA.set(pSunParam, iSunDomeId);

			return this;
		}

		setSampler(sTexture: string): UniformSunShadow {
			this.SHADOW_SAMPLER.textureName = sTexture;
			return this;
		}

		setMatrix(m4fToLightSpace: IMat4, m4fOptimizedProj: IMat4): UniformSunShadow {
			this.TO_LIGHT_SPACE.set(m4fToLightSpace);
			this.OPTIMIZED_PROJECTION_MATRIX.set(m4fOptimizedProj);

			return this;
		}

		private static _pBuffer: IUniform[] = gen.array<IUniform>(3, UniformSunShadow);
		private static _iElement: uint = 0;

		static temp(): IUniform {
			UniformSunShadow._iElement = (UniformSunShadow._iElement === UniformSunShadow._pBuffer.length - 1 ? 0 : UniformSunShadow._iElement);
			var p = UniformSunShadow._pBuffer[UniformSunShadow._iElement++];
			return p;
		}
	}

	//////////////////////////////////////


	export interface UniformMap {
		omni: UniformOmni[];
		project: UniformProject[];
		sun: UniformSun[];
		omniShadows: UniformOmniShadow[];
		projectShadows: UniformProjectShadow[];
		sunShadows: UniformSunShadow[];
		textures: ITexture[];
		samplersOmni: IAFXSamplerState[];
		samplersProject: IAFXSamplerState[];
		samplersSun: IAFXSamplerState[];
	}
}

