var akra;
(function (akra) {
    /// <reference path="../common.ts" />
    /// <reference path="../idl/ISunLight.ts" />
    /// <reference path="../core/Engine.ts" />
    /// <reference path="../scene/light/SunLight.ts" />
    /// <reference path="../render/Screen.ts" />
    //#define SKY_GPU
    (function (model) {
        var Vec3 = math.Vec3;

        // core.Engine.depends("effects/sky.fx");
        var Sky = (function () {
            function Sky(_pEngine, nCols, nRows, fR) {
                this._pEngine = _pEngine;
                this.guid = akra.guid();
                this.skyDome = null;
                this.sun = null;
                /*private*/ this._nHorinLevel = 13;
                this.time = 0.0;
                this._v3fSunDir = new Vec3();
                this._v3fInvWavelength4 = new Vec3();
                this._v3fHG = new Vec3();
                this._v3fEye = new Vec3();
                this._v3fGroundc0 = new Vec3();
                this._v3fGroundc1 = new Vec3();
                this._pSkyBlitBox = null;
                this._pScreen = null;
                this._pSkyDomeViewport = null;
                this.k = 1;
                akra.logger.assert(nCols > 2);
                akra.logger.assert(nRows > 1);
                akra.logger.assert(nCols * nRows < 65535);

                this._fInnerRadius = fR;
                this._init();
                this.init();
                this.createBuffers();

                var pDomeMesh = this.createDome(nCols, nRows);

                var pSceneModel = _pEngine.getScene().createModel("dome" + this.guid);

                pSceneModel.mesh = pDomeMesh;
                pSceneModel.accessLocalBounds().set(akra.MAX_UINT32, akra.MAX_UINT32, akra.MAX_UINT32);

                // pSceneModel.scale(this._fOuterRadius);
                this.skyDome = pSceneModel;

                this.sun = _pEngine.getScene().createLightPoint(akra.ELightTypes.SUN, true, 2048);

                this.sun.attachToParent(this.skyDome);
                this.sun.skyDome = this.skyDome;
            }
            Sky.prototype.getEngine = function () {
                return this._pEngine;
            };

            Sky.prototype.scale = function (fCos) {
                var x = 1.0 - fCos;
                return this._fRayleighScaleDepth * akra.math.exp(-0.00287 + x * (0.459 + x * (3.83 + x * (-6.80 + x * 5.25))));
            };

            Sky.prototype.expv = function (v) {
                return Vec3.temp(akra.math.exp(v.x), akra.math.exp(v.y), akra.math.exp(v.z));
            };

            Sky.prototype._init = function () {
                this._nSize = 32;
                this._nSamples = 5;
                this._fKr = 0.0025;
                this._fKm = 0.0010;
                this._fESun = 20.0;
                this._fg = -0.990;
                this._fExposure = -2.0;

                this._fRayleighScaleDepth = 0.25;
                this._fMieScaleDepth = 0.1;
                this._v3fInvWavelength4.x = 1.0 / akra.math.pow(0.650, 4.0);
                this._v3fInvWavelength4.y = 1.0 / akra.math.pow(0.570, 4.0);
                this._v3fInvWavelength4.z = 1.0 / akra.math.pow(0.475, 4.0);
            };

            Sky.prototype.init = function () {
                // this._nSize = 32;
                // this._nSamples = 5;
                // this._fKr = 0.0025;
                this._fKr4PI = this._fKr * 4.0 * akra.math.PI;

                // this._fKm = 0.0010;
                this._fKm4PI = this._fKm * 4.0 * akra.math.PI;

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
            };

            Sky.prototype.updateSunLight = function () {
                this.sun.updateSunDirection(this._v3fSunDir);
            };

            Sky.prototype.createBuffers = function () {
                var pEngine = this.getEngine();
                var pRsmgr = pEngine.getResourceManager();

                this._pSkyBuffer = pRsmgr.createTexture("sky_buffer" + this.guid);

                // this._pSkyBackBuffer = pRsmgr.createTexture("sky_back_buffer" + this.getGuid());
                this._pSkyBuffer.create(this._nSize, this._nSize, 1, null, akra.ETextureFlags.RENDERTARGET, 0, 0, akra.ETextureTypes.TEXTURE_2D, akra.EPixelFormats.FLOAT32_RGBA);

                // this._pSkyBackBuffer.create(this._nSize, this._nSize, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);
                this._pSkyBlitBox = new akra.pixelUtil.PixelBox(this._nSize, this._nSize, 1, akra.EPixelFormats.FLOAT32_RGBA, new Uint8Array(this._pSkyBuffer.byteLength));

                if (akra.config.SKY_GPU) {
                    var pScreen = this._pScreen = new akra.render.Screen(pEngine.getRenderer());

                    var pSkyDomeUpdateMethod = pRsmgr.createRenderMethod(".skydomeupdate");
                    var pSkyDomeUpdateEffect = pRsmgr.createEffect(".skydomeupdate");

                    pSkyDomeUpdateEffect.addComponent("akra.system.SkyDomeUpdate");

                    pSkyDomeUpdateMethod.effect = pSkyDomeUpdateEffect;
                    pScreen.getTechnique().setMethod(pSkyDomeUpdateMethod);

                    var pSkyDomeTarget = this._pSkyBuffer.getBuffer().getRenderTarget();
                    pSkyDomeTarget.setAutoUpdated(false);

                    var pViewport = pSkyDomeTarget.addViewport(null, ".skydomeupdate", 0, 0, 0, 1, 1);
                    pViewport.setDepthParams(false, false, 0);
                    pViewport.setClearEveryFrame(false);

                    pScreen.getTechnique(".skydomeupdate").render.connect(this, this._onSkyDomeTexRender);

                    //this.connect(pScreen.getTechnique(".skydomeupdate"), SIGNAL(render), SLOT(_onSkyDomeTexRender));
                    this._pSkyDomeViewport = pViewport;
                }
            };

            Sky.prototype._onSkyDomeTexRender = function (pTechnique, iPass) {
                if (akra.config.SKY_GPU) {
                    akra.debug.assert(iPass === 0, "invalid pass");

                    var pPass = pTechnique.getPass(iPass);

                    pPass.setUniform("nSamples", this._nSamples);
                    pPass.setUniform("fSamples", this._nSamples);
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
            };

            Sky.prototype.getWrite = function () {
                /*if (this._bSkyBuffer)*/ return this._pSkyBuffer;
                /*return this._pSkyBackBuffer;*/
            };

            Sky.prototype.getRead = function () {
                /*if (!this._bSkyBuffer) */ return this._pSkyBuffer;
                /*return this._pSkyBackBuffer;*/
            };

            Sky.prototype.updateSkyBuffer = function (pPass) {
                if (!akra.config.SKY_GPU) {
                    var pPixelBuffer = this.getWrite().getBuffer();

                    // var pBox: IBox = geometry.box(0, 0, 0, this._nSize, this._nSize, 1);
                    // var pRect: IPixelBox = pPixelBuffer.lock(pBox, ELockFlags.WRITE);
                    // debug.assert(!isNull(pRect), "cannot lock texture");
                    // var pBuffer: Float32Array = new Float32Array(pRect.data.buffer);
                    var pBuffer = new Float32Array(this._pSkyBlitBox.data.buffer);
                    var nIndex = 0;

                    for (var x = 0; x < this._nSize; x++) {
                        var fCosxz = akra.math.cos(1.0) * x / (this._nSize - 1.0);

                        for (var y = 0; y < this._nSize; y++) {
                            var fCosy = (akra.math.PI * 2.0) * y / (this._nSize - 1.0);

                            var vVecPos = Vec3.temp();
                            var vEye = Vec3.temp(0.0, this._fInnerRadius + 1e-6, 0.0);

                            vVecPos.x = akra.math.sin(fCosxz) * akra.math.cos(fCosy) * this._fOuterRadius;
                            vVecPos.y = akra.math.cos(fCosxz) * this._fOuterRadius;
                            vVecPos.z = akra.math.sin(fCosxz) * akra.math.sin(fCosy) * this._fOuterRadius;

                            var v3Pos = Vec3.temp(vVecPos);
                            var v3Ray = v3Pos.subtract(vEye, Vec3.temp());
                            var fFar = v3Ray.length();

                            v3Ray.scale(1. / fFar);

                            // Calculate the ray's starting position, then calculate its scattering offset
                            var v3Start = Vec3.temp(vEye);
                            var fHeight = v3Start.length();
                            var fDepth = akra.math.exp(this._fScaleOverScaleDepth * (this._fInnerRadius - vEye.y));
                            var fStartAngle = v3Ray.dot(v3Start) / fHeight;
                            var fStartOffset = fDepth * this.scale(fStartAngle);

                            // Initialize the scattering loop variables
                            var fSampleLength = fFar / this._nSamples;
                            var fScaledLength = fSampleLength * this._fScale;
                            var v3SampleRay = v3Ray.scale(fSampleLength, Vec3.temp());
                            var v3SamplePoint = v3SampleRay.scale(0.5, Vec3.temp()).add(v3Start);

                            // Now loop through the sample rays
                            var v3FrontColor = Vec3.temp(0.0);

                            for (var i = 0; i < this._nSamples; i++) {
                                var fHeight = v3SamplePoint.length();
                                var fDepth = akra.math.exp(this._fScaleOverScaleDepth * (this._fInnerRadius - fHeight));
                                var fLightAngle = this._v3fSunDir.dot(v3SamplePoint) / fHeight;
                                var fCameraAngle = v3Ray.dot(v3SamplePoint) / fHeight;
                                var fScatter = (fStartOffset + fDepth * (this.scale(fLightAngle) - this.scale(fCameraAngle)));

                                var v3Attenuate = this.expv((this._v3fInvWavelength4.scale(this._fKr4PI, Vec3.temp()).add(Vec3.temp(this._fKm4PI))).scale(-fScatter));

                                v3FrontColor.add(v3Attenuate.scale(fDepth * fScaledLength, Vec3.temp()));
                                v3SamplePoint.add(v3SampleRay);
                            }

                            //D3DXVECTOR3 V = vEye - vVecPos;
                            //D3DXVec3Normalize( &V, &V );
                            pBuffer[nIndex * 4 + 0] = akra.math.min(v3FrontColor.x, 6.5519996e4);
                            pBuffer[nIndex * 4 + 1] = akra.math.min(v3FrontColor.y, 6.5519996e4);
                            pBuffer[nIndex * 4 + 2] = akra.math.min(v3FrontColor.z, 6.5519996e4);
                            pBuffer[nIndex * 4 + 3] = 0.0;

                            nIndex++;
                        }
                    }

                    var HorizonSamples = Vec3.temp(0.);

                    for (var x = 0; x < this._nSize; x++) {
                        HorizonSamples.add(Vec3.temp(pBuffer[((this._nSize - this._nHorinLevel) * this._nSize + x) * 4 + 0], pBuffer[((this._nSize - this._nHorinLevel) * this._nSize + x) * 4 + 1], pBuffer[((this._nSize - this._nHorinLevel) * this._nSize + x) * 4 + 2]));
                    }

                    HorizonSamples.scale(1. / this._nSize);

                    this._v3fGroundc0.set(HorizonSamples);
                    this._v3fGroundc1.set(HorizonSamples);

                    this._v3fGroundc0.x *= this._v3fInvWavelength4.x * this._fKrESun;
                    this._v3fGroundc0.y *= this._v3fInvWavelength4.y * this._fKrESun;
                    this._v3fGroundc0.z *= this._v3fInvWavelength4.z * this._fKrESun;
                    this._v3fGroundc1.scale(this._fKmESun);

                    pPixelBuffer.blitFromMemory(this._pSkyBlitBox);

                    if (this.sun) {
                        this.sun.params.groundC0.set(this._v3fGroundc0);
                        this.sun.params.groundC1.set(this._v3fGroundc1);
                        this.sun.params.eyePosition.set(this._v3fEye);
                        this.sun.params.sunDir.set(this._v3fSunDir);
                        this.sun.params.hg.set(this._v3fHG);
                        // LOG(this._v3fGroundc0.toString(), this._v3fGroundc1.toString())
                    }
                } else {
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
            };

            Sky.prototype.createDome = function (Cols, Rows) {
                var DVSize = Cols * Rows;
                var DISize = (Cols - 1) * (Rows - 1) * 2;

                var pDome = this.getEngine().createMesh("dome", akra.EMeshOptions.HB_READABLE);

                // Fill the Vertices Buffer
                var pVertices = new Float32Array(DVSize * 3 + DVSize * 2);

                var DomeIndex = 0;

                for (var i = 0; i < Cols; i++) {
                    var MoveXZ = akra.math.cos(1.0) * i / (Cols - 1);
                    for (var j = 0; j < Rows; j++) {
                        var MoveY = (akra.math.PI * 2.0) * j / (Rows - 1);

                        pVertices[DomeIndex * 5 + 0] = akra.math.sin(MoveXZ) * akra.math.cos(MoveY);
                        pVertices[DomeIndex * 5 + 1] = akra.math.cos(MoveXZ);
                        pVertices[DomeIndex * 5 + 2] = akra.math.sin(MoveXZ) * akra.math.sin(MoveY);

                        pVertices[DomeIndex * 5 + 3] = j / (Rows - 1.0);
                        pVertices[DomeIndex * 5 + 4] = i / (Cols - 1.0);

                        DomeIndex++;
                    }
                }

                // console.log(pVertices);
                // Fill the Indices Buffer
                var pIndices = new Float32Array(DISize * 3);
                DomeIndex = 0;

                for (var i = 0; i < Rows - 1; i++) {
                    for (var j = 0; j < Cols - 1; j++) {
                        pIndices[DomeIndex++] = i * Rows + j;
                        pIndices[DomeIndex++] = (i + 1) * Rows + j;
                        pIndices[DomeIndex++] = (i + 1) * Rows + j + 1;

                        pIndices[DomeIndex++] = (i + 1) * Rows + j + 1;
                        pIndices[DomeIndex++] = i * Rows + j + 1;
                        pIndices[DomeIndex++] = i * Rows + j;
                    }
                }

                var pSubMesh = pDome.createSubset("main", akra.EPrimitiveTypes.TRIANGLELIST);

                var e = pSubMesh.data.allocateData([VE.float3("POSITION"), VE_VEC2("TEXCOORD0")], pVertices);
                pSubMesh.data.allocateIndex([VE.float("INDEX0")], pIndices);
                pSubMesh.data.index(e, "INDEX0");
                pSubMesh.shadow = false;

                var pMatrial = pSubMesh.renderMethod.surfaceMaterial.material;
                pMatrial.diffuse = Color.LIGHT_GRAY;
                pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
                pMatrial.specular = new Color(0.7, 0.7, 0.7, 1);
                pMatrial.emissive = new Color(0., 0., 0., 1.);
                pMatrial.shininess = 30.;

                if ((this.getEngine()).isDepsLoaded()) {
                    pSubMesh.renderMethod.effect.addComponent("akra.system.sky");
                } else {
                    this.getEngine().bind(SIGNAL(depsLoaded), function () {
                        pSubMesh.renderMethod.effect.addComponent("akra.system.sky");
                    });
                }

                this.connect(pSubMesh.getTechnique(), SIGNAL(akra.render), SLOT(_onDomeRender));

                return pDome;
            };

            // update(pModelView: IMat4, pProjection: IMat4, pPass: IRenderPass): void {
            Sky.prototype.update = function (pSceneObject, pCamera, pPass) {
                var pProjection = pCamera.projectionMatrix;
                var m4fModel = mat4(pSceneObject.worldMatrix);

                // pModelView.data[__41] = 0.0;
                // pModelView.data[__42] = 0.0;
                // pModelView.data[__43] = 0.0;
                m4fModel.setTranslation(Vec3.temp(0.0, -this._fInnerRadius - 1.0e-6, 0.0).add(pCamera.worldPosition));
                m4fModel.scaleRight(Vec3.temp(this._fOuterRadius * this.k));

                var pModelView = pCamera.viewMatrix.multiply(m4fModel, mat4());

                // var m4fTranslation: IMat4 = mat4(1.).setTranslation(Vec3.temp(0.0, -this._fInnerRadius - 1.0e-6, 0.0));
                // pModelView.multiply(m4fTranslation);
                var MP = pProjection.multiply(pModelView, mat4());

                pPass.setUniform("WorldViewProjection", MP);
                pPass.setUniform("fKrESun", this._fKrESun);
                pPass.setUniform("fKmESun", this._fKmESun);
                var v2fTemp = vec2(this._nSize, 1.0 / this._nSize);
                pPass.setUniform("Tex", v2fTemp);
                pPass.setUniform("vSunPos", this._v3fSunDir);
                pPass.setUniform("vHG", this._v3fHG);
                pPass.setUniform("vInvWavelength", this._v3fInvWavelength4);
                pPass.setUniform("vEye", this._v3fEye);
                pPass.setUniform("fOuterRadius", this._fOuterRadius);

                pPass.setTexture("tSkyBuffer", this.getRead());
            };

            Sky.prototype.setTime = function (T) {
                var time = this.time = T;
                var meridian = 56.48 * akra.math.RADIAN_RATIO;
                var longitude = 105.5 * akra.math.RADIAN_RATIO;
                var latitude = 0.762127107;
                var day = 172;

                var t, delta;
                var A, B, C, D, E, F;

                A = 4 * akra.math.PI * (day - 80) / 373;
                B = 2 * akra.math.PI * (day - 8) / 355;
                C = 2 * akra.math.PI * (day - 81) / 368;

                t = time + 0.170 * akra.math.sin(A) - 0.129 * akra.math.sin(B) + 12 * (meridian - longitude) / akra.math.PI;

                delta = 0.4093 * akra.math.sin(C);

                D = akra.math.PI * t / 12;

                E = akra.math.sin(latitude) * akra.math.sin(delta) - akra.math.cos(latitude) * akra.math.cos(delta) * akra.math.cos(D);

                F = (-akra.math.cos(delta) * akra.math.sin(D)) / (akra.math.cos(latitude) * akra.math.sin(delta) - akra.math.sin(latitude) * akra.math.cos(delta) * akra.math.cos(D));

                this._fSunTheta = akra.math.PI * 0.5 - akra.math.asin(E);
                this._fSunPhi = akra.math.atan(F);

                /*
                vSunDir.x = math.cos(this._fSunPhi) * math.sin(this._fSunTheta);
                vSunDir.y = math.sin(this._fSunPhi) * math.sin(this._fSunTheta);
                vSunDir.z = math.cos(this._fSunTheta);
                */
                this._v3fSunDir.x = 0.0;
                this._v3fSunDir.y = akra.math.cos(T * 0.1);
                this._v3fSunDir.z = akra.math.sin(T * 0.1);

                var Zenith = Vec3.temp(0, 1, 0);
                this._fSunTheta = akra.math.acos(this._v3fSunDir.dot(Zenith));

                this._v3fSunDir.normalize();

                this.updateSkyBuffer();
                this.updateSunLight();
            };

            Sky.prototype._onDomeRender = function (pTechnique, iPass, pRenderable, pSceneObject, pViewport) {
                var pPass = pTechnique.getPass(iPass);
                var pCamera = pViewport.getCamera();
                this.update(pSceneObject, pCamera, pPass);
            };
            return Sky;
        })();
        model.Sky = Sky;
    })(akra.model || (akra.model = {}));
    var model = akra.model;
})(akra || (akra = {}));
//# sourceMappingURL=Sky.js.map
