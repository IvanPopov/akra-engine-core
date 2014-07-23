/// <reference path="../common.ts" />
/// <reference path="../idl/ISunLight.ts" />
/// <reference path="../core/Engine.ts" />
/// <reference path="../scene/light/SunLight.ts" />
/// <reference path="../render/Screen.ts" />
/// <reference path="../color/colors.ts" />

//#define SKY_GPU

module akra.model {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Mat4 = math.Mat4;
	import VE = data.VertexElement;

	import Color = color.Color;

	// core.Engine.depends("effects/sky.fx");

	export class Sky implements IEventProvider {
		guid: uint = guid();

		skyDome: ISceneModel = null;
		sun: ISunLight = null;

		/*private*/ _fSunTheta: float;				/* Theta angle from zenith to sun*/
		/*private*/ _fSunPhi: float;				/* Phi angle */
		/*private*/ _fKr: float;					/* Rayleigh scattering constant*/
		/*private*/ _fKr4PI: float;					/* Same * 4 * PI*/
		/*private*/ _fKm: float;					/* Mie scattering constant*/
		/*private*/ _fKm4PI: float;					/* Same * 4 * PI*/
		/*private*/ _fESun: float;					/* Sun brightness constant*/
		/*private*/ _fKrESun: float;				/**/
		/*private*/ _fKmESun: float;				/**/
		/*private*/ _fg: float;						/* The Mie phase asymmetry factor*/
		/*private*/ _fg2: float;
		/*private*/ _fExposure: float;				/* Exposure constant*/
		/*private*/ _fInnerRadius: float;			/* Inner planetary radius */
		/*private*/ _fInnerRadius2: float;			/**/
		/*private*/ _fOuterRadius: float;			/* Outer atmosphere radius*/
		/*private*/ _fOuterRadius2: float;			/**/
		/*private*/ _fScale: float;					/* */
		/*private*/ _fScaleOverScaleDepth: float;	/**/
		/*private*/ _fRayleighScaleDepth: float;	/**/
		/*private*/ _fMieScaleDepth: float;			/**/

		/*private*/ _nHorinLevel: uint = 13;			/**/

		time: float = 0.0;

		private _v3fSunDir: IVec3 = new Vec3;
		private _v3fInvWavelength4: IVec3 = new Vec3;
		private _v3fHG: IVec3 = new Vec3;
		private _v3fEye: IVec3 = new Vec3;
		private _v3fGroundc0: IVec3 = new Vec3;
		private _v3fGroundc1: IVec3 = new Vec3;

		// Number of sample rays to use in integral equation
		private _nSize: uint;
		private _nSamples: uint;

		private _v2fTex: IVec2 = new Vec2;
		// private _bSkyBuffer: boolean;

		// private _v2fRttQuad: IVec2[] = [new Vec2, new Vec2, new Vec2, new Vec2];

		private _pBackBuffer: IRenderTarget;
		private _pSurface: IRenderTarget;

		private _pSkyBuffer: ITexture;
		private _pSkyBackBuffer: ITexture;

		private _pSkyBlitBox: IPixelBox = null;


		constructor(private _pEngine: IEngine, nCols: uint, nRows: uint, fR: float) {
			this.setupSignals();

			logger.assert(nCols > 2);
			logger.assert(nRows > 1);
			logger.assert(nCols * nRows < 65535);

			this._fInnerRadius = fR;
			this._init();
			this.init();
			this.createBuffers();

			var pDomeMesh: IMesh = this.createDome(nCols, nRows);

			var pSceneModel: ISceneModel = _pEngine.getScene().createModel("dome" + this.guid);

			pSceneModel.setMesh(pDomeMesh);
			pSceneModel.accessLocalBounds().set(MAX_UINT32, MAX_UINT32, MAX_UINT32);
			// pSceneModel.scale(this._fOuterRadius);

			this.skyDome = pSceneModel;

			this.sun = <ISunLight>_pEngine.getScene().createLightPoint(ELightTypes.SUN, true, 2048);

			this.sun.attachToParent(this.skyDome);
			this.sun.setSkyDome(this.skyDome);
		}

		/** Number of sample rays to use in integral equation */
		getSize(): uint {
			return this._nSize;
		}

		getSampler(): uint {
			return this._nSamples;
		}

		setWaveLength(x: float, y: float, z: float): Sky;
		setWaveLength(v3fLength: IVec3): Sky;
		setWaveLength(x, y?, z?): Sky {
			var v: IVec3 = arguments.length > 1 ? Vec3.temp(x, y, z) : arguments[0];
			this._v3fInvWavelength4.x = 1.0 / math.pow(v.x, 4.0);
			this._v3fInvWavelength4.y = 1.0 / math.pow(v.y, 4.0);
			this._v3fInvWavelength4.z = 1.0 / math.pow(v.z, 4.0);

			return this;
		}

		getWaveLength(v3fDest?: IVec3): IVec3 {
			v3fDest = isDefAndNotNull(v3fDest) ? v3fDest : Vec3.temp();
			v3fDest.x = math.pow(1 / this._v3fInvWavelength4.x, 1. / 4.);
			v3fDest.y = math.pow(1 / this._v3fInvWavelength4.y, 1. / 4.);
			v3fDest.z = math.pow(1 / this._v3fInvWavelength4.z, 1. / 4.);
			return v3fDest;
		}

		protected setupSignals(): void {

		}

		final getEngine(): IEngine {
			return this._pEngine;
		}

		getSunDirection(): IVec3 {
			return this._v3fSunDir;
		}

		scale(fCos: float): float {
			var x: float = 1.0 - fCos;
			return this._fRayleighScaleDepth * math.exp(-0.00287 + x * (0.459 + x * (3.83 + x * (-6.80 + x * 5.25))));
		}

		expv(v: IVec3): IVec3 {
			return Vec3.temp(math.exp(v.x), math.exp(v.y), math.exp(v.z));
		}


		private _init(): void {
			this._nSize = 32; 		/*Higher, Better, More CPU/GPU*/
			this._nSamples = 5;	/*Higher, Better, More CPU/GPU*/
			this._fKr = 0.0025;
			this._fKm = 0.0010;
			this._fESun = 20.0;
			this._fg = -0.990;
			this._fExposure = -2.0;

			this._fRayleighScaleDepth = 0.25;
			this._fMieScaleDepth = 0.1;
			this.setWaveLength(0.650, 0.570, 0.475);
		}

		init(): void {
			// this._nSize = 32; 		
			// this._nSamples = 5;		
			// this._fKr = 0.0025;
			this._fKr4PI = this._fKr * 4.0 * math.PI;
			// this._fKm = 0.0010;
			this._fKm4PI = this._fKm * 4.0 * math.PI;
			// this._fESun = 20.0;
			this._fKrESun = this._fESun * this._fKr;
			this._fKmESun = this._fESun * this._fKm;
			// this._fg = -0.990;
			this._fg2 = this._fg * this._fg;
			// this._fExposure = -2.0;
			this._fInnerRadius2 = this._fInnerRadius * this._fInnerRadius;
			this._fOuterRadius = this._fInnerRadius * 1.025;
			this._fOuterRadius2 = this._fOuterRadius * this._fOuterRadius;
			this._fScale = 1.0 / (this._fOuterRadius - this._fInnerRadius);

			// this._fRayleighScaleDepth = 0.25;
			// this._fMieScaleDepth = 0.1;
			this._fScaleOverScaleDepth = this._fScale / this._fRayleighScaleDepth;

			this._v3fHG.x = 1.5 * ((1.0 - this._fg2) / (2.0 + this._fg2));
			this._v3fHG.y = 1.0 + this._fg2;
			this._v3fHG.z = 2.0 * this._fg;
			this._v3fEye.x = 0.0;
			this._v3fEye.y = this._fInnerRadius + 1.0e-6;
			this._v3fEye.z = 0.0;


			// this._bSkyBuffer = false;

		}

		private updateSunLight(): void {
			this.sun.updateSunDirection(this._v3fSunDir);
		}

		private createBuffers(): void {


			var pEngine: IEngine = this.getEngine();
			var pRsmgr: IResourcePoolManager = pEngine.getResourceManager();

			this._pSkyBuffer = pRsmgr.createTexture("sky_buffer" + this.guid);
			// this._pSkyBackBuffer = pRsmgr.createTexture("sky_back_buffer" + this.getGuid());

			this._pSkyBuffer.create(this._nSize, this._nSize, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);
			// this._pSkyBackBuffer.create(this._nSize, this._nSize, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);

			this._pSkyBlitBox = new pixelUtil.PixelBox(this._nSize, this._nSize, 1, EPixelFormats.FLOAT32_RGBA, new Uint8Array(this._pSkyBuffer.getByteLength()));

			if (config.USE_ATMOSPHERIC_SCATTERING_GPU_MODE) {
				var pScreen: IRenderableObject = this._pScreen = new render.Screen(pEngine.getRenderer());

				var pSkyDomeUpdateMethod: IRenderMethod = pRsmgr.createRenderMethod(".skydomeupdate");
				var pSkyDomeUpdateEffect: IEffect = pRsmgr.createEffect(".skydomeupdate");

				pSkyDomeUpdateEffect.addComponent("akra.system.SkyDomeUpdate");

				pSkyDomeUpdateMethod.setEffect(pSkyDomeUpdateEffect);
				pScreen.getTechnique().setMethod(pSkyDomeUpdateMethod);

				var pSkyDomeTarget: IRenderTarget = this._pSkyBuffer.getBuffer().getRenderTarget();
				pSkyDomeTarget.setAutoUpdated(false);
				
				//var pViewport: IViewport = pSkyDomeTarget.addViewport(null, ".skydomeupdate", 0, 0, 0, 1, 1);
				var pViewport: IViewport = pSkyDomeTarget.addViewport(new render.Viewport(null, ".skydomeupdate", 0, 0, 0, 1, 1));
				pViewport.setDepthParams(false, false, 0);
				pViewport.setClearEveryFrame(false);


				pScreen.getTechnique(".skydomeupdate").render.connect(this, this._onSkyDomeTexRender);
				//this.connect(pScreen.getTechnique(".skydomeupdate"), SIGNAL(render), SLOT(_onSkyDomeTexRender));

				this._pSkyDomeViewport = pViewport;
			}
		}


		_onSkyDomeTexRender(pTechnique: IRenderTechnique, iPass: uint): void {
			if (config.USE_ATMOSPHERIC_SCATTERING_GPU_MODE) {
				debug.assert(iPass === 0, "invalid pass");

				var pPass: IRenderPass = pTechnique.getPass(iPass);

				pPass.setUniform("nSamples", this._nSamples);
				pPass.setUniform("fSamples", <float>this._nSamples);
				pPass.setUniform("fOuterRadius", this._fOuterRadius);
				pPass.setUniform("fInnerRadius", this._fInnerRadius);
				pPass.setUniform("fKr4PI", this._fKr4PI);
				pPass.setUniform("fKm4PI", this._fKm4PI);
				pPass.setUniform("fScale", this._fScale);
				pPass.setUniform("fScaleDepth", this._fRayleighScaleDepth);
				pPass.setUniform("fScaleOverScaleDepth", this._fScaleOverScaleDepth);
				pPass.setUniform("fCameraHeight", this._v3fEye.y);
				pPass.setUniform("fCameraHeight2", this._v3fEye.y * this._v3fEye.y);
				pPass.setUniform("vSunPos", this._v3fSunDir);
				pPass.setUniform("vEye", this._v3fEye);
			}
		}


		private _pScreen: IRenderableObject = null;
		private _pSkyDomeViewport: IViewport = null;


		private getWrite(): ITexture {
			/*if (this._bSkyBuffer)*/ return this._pSkyBuffer;
			/*return this._pSkyBackBuffer;*/
		}

		private getRead(): ITexture {
			/*if (!this._bSkyBuffer) */return this._pSkyBuffer;
			/*return this._pSkyBackBuffer;*/
		}


		updateSkyBuffer(pPass: IRenderPass): void {
			if (!config.USE_ATMOSPHERIC_SCATTERING_GPU_MODE) {
				var pPixelBuffer: IPixelBuffer = this.getWrite().getBuffer();
				// var pBox: IBox = geometry.box(0, 0, 0, this._nSize, this._nSize, 1);

				// var pRect: IPixelBox = pPixelBuffer.lock(pBox, ELockFlags.WRITE);

				// debug.assert(!isNull(pRect), "cannot lock texture");

				// var pBuffer: Float32Array = new Float32Array(pRect.data.buffer);
				var pBuffer: Float32Array = new Float32Array(this._pSkyBlitBox.data.buffer);
				var nIndex: uint = 0;

				for (var x: uint = 0; x < this._nSize; x++) {

					var fCosxz: float = math.cos(1.0) * x / <float>(this._nSize - 1.0);

					for (var y: uint = 0; y < this._nSize; y++) {
						var fCosy: float = (math.PI * 2.0) * y / <float>(this._nSize - 1.0);

						var vVecPos: IVec3 = Vec3.temp();
						var vEye: IVec3 = Vec3.temp(0.0, this._fInnerRadius + 1e-6, 0.0);

						vVecPos.x = math.sin(fCosxz) * math.cos(fCosy) * this._fOuterRadius;
						vVecPos.y = math.cos(fCosxz) * this._fOuterRadius;
						vVecPos.z = math.sin(fCosxz) * math.sin(fCosy) * this._fOuterRadius;

						var v3Pos: IVec3 = Vec3.temp(vVecPos);
						var v3Ray: IVec3 = v3Pos.subtract(vEye, Vec3.temp());
						var fFar: float = v3Ray.length();

						v3Ray.scale(1. / fFar);

						// Calculate the ray's starting position, then calculate its scattering offset
						var v3Start: IVec3 = Vec3.temp(vEye);
						var fHeight: float = v3Start.length();
						var fDepth: float = math.exp(this._fScaleOverScaleDepth * (this._fInnerRadius - vEye.y));
						var fStartAngle: float = v3Ray.dot(v3Start) / fHeight;
						var fStartOffset: float = fDepth * this.scale(fStartAngle);

						// Initialize the scattering loop variables
						var fSampleLength: float = fFar / this._nSamples;
						var fScaledLength: float = fSampleLength * this._fScale;
						var v3SampleRay: IVec3 = v3Ray.scale(fSampleLength, Vec3.temp());
						var v3SamplePoint: IVec3 = v3SampleRay.scale(0.5, Vec3.temp()).add(v3Start);

						// Now loop through the sample rays
						var v3FrontColor: IVec3 = Vec3.temp(0.0);

						for (var i: uint = 0; i < this._nSamples; i++) {
							var fHeight: float = v3SamplePoint.length();
							var fDepth: float = math.exp(this._fScaleOverScaleDepth * (this._fInnerRadius - fHeight));
							var fLightAngle: float = this._v3fSunDir.dot(v3SamplePoint) / fHeight;
							var fCameraAngle: float = v3Ray.dot(v3SamplePoint) / fHeight;
							var fScatter: float = (fStartOffset + fDepth * (this.scale(fLightAngle) - this.scale(fCameraAngle)));

							var v3Attenuate: IVec3 = this.expv((this._v3fInvWavelength4.scale(this._fKr4PI, Vec3.temp()).add(Vec3.temp(this._fKm4PI))).scale(-fScatter));


							v3FrontColor.add(v3Attenuate.scale(fDepth * fScaledLength, Vec3.temp()));
							v3SamplePoint.add(v3SampleRay);
						}

						//D3DXVECTOR3 V = vEye - vVecPos;
						//D3DXVec3Normalize( &V, &V );

						pBuffer[nIndex * 4 + 0] = math.min(v3FrontColor.x, 6.5519996e4);
						pBuffer[nIndex * 4 + 1] = math.min(v3FrontColor.y, 6.5519996e4);
						pBuffer[nIndex * 4 + 2] = math.min(v3FrontColor.z, 6.5519996e4);
						pBuffer[nIndex * 4 + 3] = 0.0;

						nIndex++;
					}
				}


				var HorizonSamples: IVec3 = Vec3.temp(0.);

				for (var x: uint = 0; x < this._nSize; x++) {
					HorizonSamples.add(Vec3.temp(
						pBuffer[((this._nSize - this._nHorinLevel) * this._nSize + x) * 4 + 0],
						pBuffer[((this._nSize - this._nHorinLevel) * this._nSize + x) * 4 + 1],
						pBuffer[((this._nSize - this._nHorinLevel) * this._nSize + x) * 4 + 2]));
				}

				HorizonSamples.scale(1. / <float>this._nSize);

				this._v3fGroundc0.set(HorizonSamples);
				this._v3fGroundc1.set(HorizonSamples);

				this._v3fGroundc0.x *= this._v3fInvWavelength4.x * this._fKrESun;
				this._v3fGroundc0.y *= this._v3fInvWavelength4.y * this._fKrESun;
				this._v3fGroundc0.z *= this._v3fInvWavelength4.z * this._fKrESun;
				this._v3fGroundc1.scale(this._fKmESun);

				pPixelBuffer.blitFromMemory(this._pSkyBlitBox);

				// pPixelBuffer.unlock();
				// this._bSkyBuffer = !this._bSkyBuffer;
				if (this.sun) {
					this.sun.getParams().groundC0.set(this._v3fGroundc0);
					this.sun.getParams().groundC1.set(this._v3fGroundc1);
					this.sun.getParams().eyePosition.set(this._v3fEye);
					this.sun.getParams().sunDir.set(this._v3fSunDir);
					this.sun.getParams().hg.set(this._v3fHG);

					// LOG(this._v3fGroundc0.toString(), this._v3fGroundc1.toString())
				}

			}
			else {
				//pViewport.startFrame();
				//pViewport.renderObject(this._pScreen);
				//pViewport.endFrame();


				//// Horizon fog color
				//D3DXVECTOR3 HorizonSamples = D3DXVECTOR3(0.0f, 0.0f, 0.0f);
				//float fCosxz = (D3DX_PI * 0.5f);

				//for(UINT y = 0; y < m_nSize; y++)
				//{
				//	float fCosy = (D3DX_PI * 2.0f) * y / (float)(m_nSize - 1);
				//	D3DXVECTOR3 vVecPos, vEye = D3DXVECTOR3(0.0f, m_fInnerRadius + 1e-6f, 0.0f);

				//		vVecPos.x = m_fOuterRadius * sin(fCosxz) * cos(fCosy);
				//		vVecPos.z = m_fOuterRadius * sin(fCosxz) * sin(fCosy);
				//		vVecPos.y = m_fOuterRadius * cos(fCosxz);

				//	D3DXVECTOR3 v3Pos = vVecPos;
				//	D3DXVECTOR3 v3Ray = v3Pos - vEye;
				//	float fFar = D3DXVec3Length(&v3Ray);
				//		v3Ray /= fFar;

				//	// Calculate the ray's starting position, then calculate its scattering offset
				//	D3DXVECTOR3 v3Start = vEye;
				//	float fHeight = D3DXVec3Length(&v3Start);
				//	float fDepth = exp(m_fScaleOverScaleDepth * (m_fInnerRadius - vEye.y));
				//	float fStartAngle = D3DXVec3Dot(&v3Ray, &v3Start) / fHeight;
				//	float fStartOffset = fDepth * scale(fStartAngle);

				//	// Initialize the scattering loop variables
				//	float fSampleLength = fFar / m_nSamples;
				//	float fScaledLength = fSampleLength * m_fScale;
				//	D3DXVECTOR3 v3SampleRay = v3Ray * fSampleLength;
				//	D3DXVECTOR3 v3SamplePoint = v3Start + v3SampleRay * 0.5f;

				//	// Now loop through the sample rays
				//	D3DXVECTOR3 v3Attenuate;
				//	for(unsigned int i = 0; i < m_nSamples; i++)
				//	{
				//		float fHeight = D3DXVec3Length(&v3SamplePoint);
				//		float fDepth = exp(m_fScaleOverScaleDepth * (m_fInnerRadius - fHeight));
				//		float fLightAngle = D3DXVec3Dot(&this._v3fSunDir, &v3SamplePoint) / fHeight;
				//		float fCameraAngle = D3DXVec3Dot(&v3Ray, &v3SamplePoint) / fHeight;
				//		float fScatter = (fStartOffset + fDepth * (scale(fLightAngle) - scale(fCameraAngle)));
				//			v3Attenuate = expv(-fScatter * (m_v3fInvWavelength4 * m_fKr4PI + D3DXVECTOR3(m_fKm4PI, m_fKm4PI, m_fKm4PI)));
				//			HorizonSamples += v3Attenuate * (fDepth * fScaledLength);
				//			v3SamplePoint += v3SampleRay;
				//		}
				//	}

				//	HorizonSamples /= (float) m_nSize;

				//	m_v3fGroundc0 = m_v3fGroundc1 = HorizonSamples;
				//	m_v3fGroundc0.x *= (m_v3fInvWavelength4.x * m_fKrESun);
				//	m_v3fGroundc0.y *= (m_v3fInvWavelength4.y * m_fKrESun);
				//	m_v3fGroundc0.z *= (m_v3fInvWavelength4.z * m_fKrESun);
				//	m_v3fGroundc1 *= m_fKmESun;
			}
		}


		createDome(Cols: uint, Rows: uint): IMesh {
			var DVSize: uint = Cols * Rows;
			var DISize: uint = (Cols - 1) * (Rows - 1) * 2;

			var pDome: IMesh = this.getEngine().createMesh("dome", EMeshOptions.HB_READABLE);

			// Fill the Vertices Buffer
			var pVertices: Float32Array = new Float32Array(DVSize * 3 + DVSize * 2);

			var DomeIndex: uint = 0;

			for (var i: uint = 0; i < Cols; i++) {
				var MoveXZ: float = math.cos(1.0) * i / (Cols - 1);
				for (var j: uint = 0; j < Rows; j++) {
					var MoveY: float = (math.PI * 2.0) * j / (Rows - 1);

					pVertices[DomeIndex * 5 + 0] = math.sin(MoveXZ) * math.cos(MoveY);
					pVertices[DomeIndex * 5 + 1] = math.cos(MoveXZ);
					pVertices[DomeIndex * 5 + 2] = math.sin(MoveXZ) * math.sin(MoveY);

					pVertices[DomeIndex * 5 + 3] = j / (Rows - 1.0);
					pVertices[DomeIndex * 5 + 4] = i / (Cols - 1.0);

					DomeIndex++;
				}
			}

			// console.log(pVertices);

			// Fill the Indices Buffer
			var pIndices: Float32Array = new Uint16Array(DISize * 3);
			DomeIndex = 0;

			for (var i: uint = 0; i < Rows - 1; i++) {
				for (var j: uint = 0; j < Cols - 1; j++) {
					pIndices[DomeIndex++] = i * Rows + j;
					pIndices[DomeIndex++] = (i + 1) * Rows + j;
					pIndices[DomeIndex++] = (i + 1) * Rows + j + 1;

					pIndices[DomeIndex++] = (i + 1) * Rows + j + 1;
					pIndices[DomeIndex++] = i * Rows + j + 1;
					pIndices[DomeIndex++] = i * Rows + j;
				}
			}

			var pSubMesh: IMeshSubset = pDome.createSubset("main",
				EPrimitiveTypes.TRIANGLELIST, ERenderDataBufferOptions.RD_SINGLE_INDEX);

			var e = pSubMesh.getData().allocateData([VE.float3("POSITION"), VE.float2("TEXCOORD0")], pVertices);
			pSubMesh.getData().allocateIndex([VE.float("INDEX0")], pIndices);
			pSubMesh.setShadow(false);

			var pMatrial: IMaterial = pSubMesh.getRenderMethod().getSurfaceMaterial().getMaterial();
			pMatrial.diffuse = color.LIGHT_GRAY;
			pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
			pMatrial.specular = new Color(0.7, 0.7, 0.7, 1);
			pMatrial.emissive = new Color(0., 0., 0., 1.);
			pMatrial.shininess = 0.25;
			
			if ((<core.Engine>this.getEngine()).isLoaded()) {
				pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.sky");
			}
			else {
				//this.getEngine().bind(SIGNAL(depsLoaded), () => {
				//	pSubMesh.renderMethod.effect.addComponent("akra.system.sky");
				//});
				this.getEngine().depsLoaded.connect(() => {
					pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.sky");
				});
			}

			pSubMesh.getTechnique().render.connect(this, this._onDomeRender);
			//this.connect(pSubMesh.getTechnique(), SIGNAL(render), SLOT(_onDomeRender));

			return pDome;
		}

		k: uint = 1;
		// update(pModelView: IMat4, pProjection: IMat4, pPass: IRenderPass): void {
		update(pSceneObject: ISceneObject, pCamera: ICamera, pPass: IRenderPass): void {
			var pProjection: IMat4 = pCamera.getProjectionMatrix();
			var m4fModel: IMat4 = Mat4.temp(pSceneObject.getWorldMatrix());

			// pModelView.data[__41] = 0.0;
			// pModelView.data[__42] = 0.0;
			// pModelView.data[__43] = 0.0;

			m4fModel.setTranslation(Vec3.temp(0.0, -this._fInnerRadius - 1.0e-6, 0.0).add(pCamera.getWorldPosition()));
			m4fModel.scaleRight(Vec3.temp(this._fOuterRadius * this.k));

			var pModelView: IMat4 = pCamera.getViewMatrix().multiply(m4fModel, Mat4.temp());

			// var m4fTranslation: IMat4 = Mat4.temp(1.).setTranslation(Vec3.temp(0.0, -this._fInnerRadius - 1.0e-6, 0.0));
			// pModelView.multiply(m4fTranslation);

			var MP: IMat4 = pProjection.multiply(pModelView, Mat4.temp());

			this._v2fTex.set(<float> this._nSize, 1.0 / this._nSize);

			pPass.setUniform("WorldViewProjection", MP);
			pPass.setUniform("WorldView", pModelView);
			pPass.setUniform("fKrESun", this._fKrESun);
			pPass.setUniform("fKmESun", this._fKmESun);
			pPass.setUniform("Tex", this._v2fTex);
			pPass.setUniform("vSunPos", this._v3fSunDir);
			pPass.setUniform("vHG", this._v3fHG);
			pPass.setUniform("vInvWavelength", this._v3fInvWavelength4);
			pPass.setUniform("vEye", this._v3fEye);
			pPass.setUniform("fOuterRadius", this._fOuterRadius);
			pPass.setForeign("IS_ENABLE_ALPHA", false);
			pPass.setTexture("tSkyBuffer", this.getRead());
		}

		setTime(T: float): void {
			var time: float = this.time = T;
			var meridian: float = 56.48 * math.RADIAN_RATIO;/*1.3788101;*/
			var longitude: float = 105.5 * math.RADIAN_RATIO;/*1.3852096;*/
			var latitude: float = 0.762127107;
			var day: int = 172;

			var t: float, delta: float;
			var A: float, B: float, C: float, D: float, E: float, F: float;

			A = 4 * math.PI * (day - 80) / 373;
			B = 2 * math.PI * (day - 8) / 355;
			C = 2 * math.PI * (day - 81) / 368;

			t = time +
			0.170 * math.sin(A) -
			0.129 * math.sin(B) +
			12 * (meridian - longitude) / math.PI;

			delta = 0.4093 * math.sin(C);

			D = math.PI * t / 12;

			E = math.sin(latitude) * math.sin(delta) -
			math.cos(latitude) * math.cos(delta) * math.cos(D);

			F = (-math.cos(delta) * math.sin(D)) / (math.cos(latitude) * math.sin(delta) -
			math.sin(latitude) * math.cos(delta) * math.cos(D));

			this._fSunTheta = math.PI * 0.5 - <float>math.asin(E);
			this._fSunPhi = <float>math.atan(F);
			/*		
					vSunDir.x = math.cos(this._fSunPhi) * math.sin(this._fSunTheta);
					vSunDir.y = math.sin(this._fSunPhi) * math.sin(this._fSunTheta);
					vSunDir.z = math.cos(this._fSunTheta);
			*/
			this._v3fSunDir.x = 0.0;
			this._v3fSunDir.y = <float>math.cos(T * 0.1);
			this._v3fSunDir.z = <float>math.sin(T * 0.1);

			var Zenith: IVec3 = Vec3.temp(0, 1, 0);
			this._fSunTheta = math.acos(this._v3fSunDir.dot(Zenith));

			this._v3fSunDir.normalize();

			this.updateSkyBuffer(null);
			this.updateSunLight();
		}

		_onDomeRender(pTechnique: IRenderTechnique, iPass: uint,
			pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			var pCamera: ICamera = pViewport.getCamera();
			this.update(pSceneObject, pCamera, pPass);
		}
	}
}

