/// <reference path="../idl/ILightPoint.ts" />
/// <reference path="../idl/IShaderInput.ts" />
/// <reference path="../idl/IAFXSamplerState.ts" />
/// <reference path="../idl/IOmniLight.ts" />
/// <reference path="../idl/IProjectLight.ts" />
/// <reference path="../idl/ISunLight.ts" />
var akra;
(function (akra) {
    /// <reference path="../fx/PassInputBlend.ts" />
    (function (render) {
        

        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;
        var Mat4 = akra.math.Mat4;

        var LightData = (function () {
            function LightData() {
                this.DIFFUSE = new Vec4();
                this.AMBIENT = new Vec4();
                this.SPECULAR = new Vec4();
                this.POSITION = new Vec3();
                this.ATTENUATION = new Vec3();
            }
            LightData.prototype.set = function (pLightParam, v3fPosition) {
                this.DIFFUSE.set(pLightParam.diffuse);
                this.AMBIENT.set(pLightParam.ambient);
                this.SPECULAR.set(pLightParam.specular);
                this.ATTENUATION.set(pLightParam.attenuation);
                this.POSITION.set(v3fPosition);

                return this;
            };
            return LightData;
        })();
        render.LightData = LightData;

        //////////////////////////////////////
        var UniformOmni = (function () {
            function UniformOmni() {
                this.LIGHT_DATA = new LightData();
            }
            UniformOmni.prototype.setLightData = function (pLightParam, v3fPosition) {
                this.LIGHT_DATA.set(pLightParam, v3fPosition);

                return this;
            };

            UniformOmni.temp = function () {
                UniformOmni._iElement = (UniformOmni._iElement === UniformOmni._pBuffer.length - 1 ? 0 : UniformOmni._iElement);
                var p = UniformOmni._pBuffer[UniformOmni._iElement++];
                return p;
            };
            UniformOmni._pBuffer = akra.gen.array(200, UniformOmni);
            UniformOmni._iElement = 0;
            return UniformOmni;
        })();
        render.UniformOmni = UniformOmni;

        //////////////////////////////////////
        var UniformProject = (function () {
            function UniformProject() {
                this.LIGHT_DATA = new LightData();
                this.SHADOW_MATRIX = new Mat4();
            }
            UniformProject.prototype.setLightData = function (pLightParam, v3fPosition) {
                this.LIGHT_DATA.set(pLightParam, v3fPosition);

                return this;
            };

            UniformProject.prototype.setMatrix = function (m4fMatrix) {
                this.SHADOW_MATRIX.set(m4fMatrix);
                return this;
            };

            UniformProject.temp = function () {
                UniformProject._iElement = (UniformProject._iElement === UniformProject._pBuffer.length - 1 ? 0 : UniformProject._iElement);
                var p = UniformProject._pBuffer[UniformProject._iElement++];
                return p;
            };
            UniformProject._pBuffer = akra.gen.array(200, UniformProject);
            UniformProject._iElement = 0;
            return UniformProject;
        })();
        render.UniformProject = UniformProject;

        //////////////////////////////////////
        var UniformProjectShadow = (function () {
            function UniformProjectShadow() {
                this.LIGHT_DATA = new LightData();
                this.TO_LIGHT_SPACE = new Mat4();
                this.REAL_PROJECTION_MATRIX = new Mat4();
                this.OPTIMIZED_PROJECTION_MATRIX = new Mat4();
                this.SHADOW_SAMPLER = akra.render.createSamplerState();
            }
            UniformProjectShadow.prototype.setLightData = function (pLightParam, v3fPosition) {
                this.LIGHT_DATA.set(pLightParam, v3fPosition);
                return this;
            };

            UniformProjectShadow.prototype.setMatrix = function (m4fToLightSpace, m4fRealProj, m4fOptimizedProj) {
                this.TO_LIGHT_SPACE.set(m4fToLightSpace);
                this.REAL_PROJECTION_MATRIX.set(m4fRealProj);
                this.OPTIMIZED_PROJECTION_MATRIX.set(m4fOptimizedProj);

                return this;
            };

            UniformProjectShadow.prototype.setSampler = function (sTexture) {
                this.SHADOW_SAMPLER.textureName = sTexture;
                return this;
            };

            UniformProjectShadow.temp = function () {
                UniformProjectShadow._iElement = (UniformProjectShadow._iElement === UniformProjectShadow._pBuffer.length - 1 ? 0 : UniformProjectShadow._iElement);
                var p = UniformProjectShadow._pBuffer[UniformProjectShadow._iElement++];
                return p;
            };
            UniformProjectShadow._pBuffer = akra.gen.array(20, UniformProjectShadow);
            UniformProjectShadow._iElement = 0;
            return UniformProjectShadow;
        })();
        render.UniformProjectShadow = UniformProjectShadow;

        //////////////////////////////////////
        var UniformOmniShadow = (function () {
            function UniformOmniShadow() {
                this.LIGHT_DATA = new LightData;
                this.TO_LIGHT_SPACE = [
                    new Mat4, new Mat4, new Mat4,
                    new Mat4, new Mat4, new Mat4
                ];
                this.OPTIMIZED_PROJECTION_MATRIX = [
                    new Mat4, new Mat4, new Mat4,
                    new Mat4, new Mat4, new Mat4
                ];
                this.SHADOW_SAMPLER = [
                    akra.render.createSamplerState(), akra.render.createSamplerState(), akra.render.createSamplerState(),
                    akra.render.createSamplerState(), akra.render.createSamplerState(), akra.render.createSamplerState()
                ];
            }
            UniformOmniShadow.prototype.setLightData = function (pLightParam, v3fPosition) {
                this.LIGHT_DATA.set(pLightParam, v3fPosition);
                return this;
            };

            UniformOmniShadow.prototype.setMatrix = function (m4fToLightSpace, m4fOptimizedProj, index) {
                this.TO_LIGHT_SPACE[index].set(m4fToLightSpace);
                this.OPTIMIZED_PROJECTION_MATRIX[index].set(m4fOptimizedProj);
                return this;
            };

            UniformOmniShadow.prototype.setSampler = function (sTexture, index) {
                this.SHADOW_SAMPLER[index].textureName = sTexture;
                return this;
            };

            UniformOmniShadow.temp = function () {
                UniformOmniShadow._iElement = (UniformOmniShadow._iElement === UniformOmniShadow._pBuffer.length - 1 ? 0 : UniformOmniShadow._iElement);
                var p = UniformOmniShadow._pBuffer[UniformOmniShadow._iElement++];
                return p;
            };
            UniformOmniShadow._pBuffer = akra.gen.array(3, UniformOmniShadow);
            UniformOmniShadow._iElement = 0;
            return UniformOmniShadow;
        })();
        render.UniformOmniShadow = UniformOmniShadow;

        //////////////////////////////////////
        var UniformSun = (function () {
            function UniformSun() {
                this.SUN_DIRECTION = new Vec3();
                this.EYE_POSITION = new Vec3();
                this.GROUNDC0 = new Vec3();
                this.GROUNDC1 = new Vec3();
                this.HG = new Vec3;
                this.SKY_DOME_ID = 0;
            }
            UniformSun.prototype.setLightData = function (pSunParam, iSunDomeId) {
                this.SUN_DIRECTION.set(pSunParam.sunDir);
                this.EYE_POSITION.set(pSunParam.eyePosition);
                this.GROUNDC0.set(pSunParam.groundC0);
                this.GROUNDC1.set(pSunParam.groundC1);
                this.HG.set(pSunParam.hg);
                this.SKY_DOME_ID = iSunDomeId;

                return this;
            };

            UniformSun.temp = function () {
                UniformSun._iElement = (UniformSun._iElement === UniformSun._pBuffer.length - 1 ? 0 : UniformSun._iElement);
                var p = UniformSun._pBuffer[UniformSun._iElement++];
                return p;
            };
            UniformSun._pBuffer = akra.gen.array(3, UniformSun);
            UniformSun._iElement = 0;
            return UniformSun;
        })();
        render.UniformSun = UniformSun;

        //////////////////////////////////////
        var UniformSunShadow = (function () {
            function UniformSunShadow() {
                this.SUN_DIRECTION = new Vec3();
                this.EYE_POSITION = new Vec3();
                this.GROUNDC0 = new Vec3();
                this.GROUNDC1 = new Vec3();
                this.HG = new Vec3;
                this.SKY_DOME_ID = 0;
                this.SHADOW_SAMPLER = akra.render.createSamplerState();
                this.TO_LIGHT_SPACE = new Mat4();
                this.OPTIMIZED_PROJECTION_MATRIX = new Mat4();
            }
            UniformSunShadow.prototype.setLightData = function (pSunParam, iSunDomeId) {
                this.SUN_DIRECTION.set(pSunParam.sunDir);
                this.EYE_POSITION.set(pSunParam.eyePosition);
                this.GROUNDC0.set(pSunParam.groundC0);
                this.GROUNDC1.set(pSunParam.groundC1);
                this.HG.set(pSunParam.hg);
                this.SKY_DOME_ID = iSunDomeId;

                return this;
            };

            UniformSunShadow.prototype.setSampler = function (sTexture) {
                this.SHADOW_SAMPLER.textureName = sTexture;
                return this;
            };

            UniformSunShadow.prototype.setMatrix = function (m4fToLightSpace, m4fOptimizedProj) {
                this.TO_LIGHT_SPACE.set(m4fToLightSpace);
                this.OPTIMIZED_PROJECTION_MATRIX.set(m4fOptimizedProj);

                return this;
            };

            UniformSunShadow.temp = function () {
                UniformSunShadow._iElement = (UniformSunShadow._iElement === UniformSunShadow._pBuffer.length - 1 ? 0 : UniformSunShadow._iElement);
                var p = UniformSunShadow._pBuffer[UniformSunShadow._iElement++];
                return p;
            };
            UniformSunShadow._pBuffer = akra.gen.array(3, UniformSunShadow);
            UniformSunShadow._iElement = 0;
            return UniformSunShadow;
        })();
        render.UniformSunShadow = UniformSunShadow;

        
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=DSUniforms.js.map
