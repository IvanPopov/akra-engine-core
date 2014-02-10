/// <reference path="../idl/ISprite.ts" />
/// <reference path="../idl/ISpriteManager.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="SceneObject.ts" />
    /// <reference path="../render/RenderableObject.ts" />
    (function (scene) {
        var VE = akra.data.VertexElement;

        var SpriteManager = (function () {
            function SpriteManager(pEngine) {
                this._pSprites = [];
                this._pDataFactory = pEngine.createRenderDataCollection(4 /* READABLE */);
            }
            SpriteManager.prototype._allocateSprite = function (pSprite) {
                var pDataSubset = this._pDataFactory.getEmptyRenderData(5 /* TRIANGLESTRIP */, 0);

                this._pSprites.push(pSprite);

                return pDataSubset;
            };
            return SpriteManager;
        })();
        scene.SpriteManager = SpriteManager;

        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            function Sprite(pScene) {
                _super.call(this, pScene, 71 /* SPRITE */);

                var pEngine = pScene.getManager().getEngine();
                var pRsmgr = pEngine.getResourceManager();
                var pManager = pEngine.getSpriteManager();
                var pRenderer = pEngine.getRenderer();
                var pRenderable = new akra.render.RenderableObject(3 /* SPRITE */);

                pRenderable._setup(pRenderer);

                var iGuid = this.guid;
                var pRenderMethod = pRenderable.getRenderMethod();
                var pEffect = pRenderMethod.getEffect();

                pEffect.addComponent("akra.system.mesh_texture");

                pRenderable.getTechnique().setMethod(pRenderMethod);

                this._pManager = pManager;
                this._pRenderable = pRenderable;

                this.create(2, 2);
            }
            Sprite.prototype.getTotalRenderable = function () {
                return 1;
            };

            Sprite.prototype.getSpriteManager = function () {
                return this._pManager;
            };

            Sprite.prototype.create = function (fSizeX, fSizeY) {
                if (typeof fSizeX === "undefined") { fSizeX = 2; }
                if (typeof fSizeY === "undefined") { fSizeY = 2; }
                _super.prototype.create.call(this);

                //4 vertex * (4 coords + 3 texcoords)
                var pGeometry = new Float32Array(4 * 4);
                var pTexCoords = new Float32Array(4 * 3);
                var pNormals = new Float32Array([0., 0., 1., 0.]);

                for (var i = 0; i < 4; i++) {
                    //-1, -1, -1, 1, 1, -1, 1, 1
                    //0, 0, 0, 1, 1, 0, 1, 1
                    var signX = akra.math.floor(i / 2) * 2 - 1;
                    var signY = (i % 2) * 2 - 1;

                    pGeometry[4 * i] = signX * fSizeX / 2;
                    pGeometry[4 * i + 1] = signY * fSizeY / 2;
                    pGeometry[4 * i + 2] = 0;
                    pGeometry[4 * i + 3] = 0;

                    pTexCoords[3 * i + 0] = (signX + 1) / 2;
                    pTexCoords[3 * i + 1] = (signY + 1) / 2;
                    pTexCoords[3 * i + 2] = 0;
                }

                var fMaxSize = (fSizeX > fSizeY) ? fSizeX : fSizeY;

                this.accessLocalBounds().set(fMaxSize, fMaxSize, fMaxSize);

                var pData = this.getSpriteManager()._allocateSprite(this);

                pData.allocateData([VE.float4("POSITION")], pGeometry);
                pData.allocateData([VE.float3("TEXCOORD0")], pTexCoords);
                pData.allocateData([VE.float4("NORMAL")], pNormals);
                pData.allocateIndex([VE.float('INDEX0')], new Float32Array([0, 1, 2, 3]));
                pData.allocateIndex([VE.float('INDEX1')], new Float32Array([0, 1, 2, 3]));
                pData.allocateIndex([VE.float('INDEX2')], new Float32Array([0, 0, 0, 0]));
                pData.index('POSITION', 'INDEX0');
                pData.index('TEXCOORD0', 'INDEX1');
                pData.index('NORMAL', 'INDEX2');

                this._pRenderable._setRenderData(pData);

                return true;
            };

            Sprite.prototype.setTexture = function (pTex) {
                var pSurfaceMaterial = this._pRenderable.getSurfaceMaterial();
                pSurfaceMaterial.setTexture(3 /* EMISSIVE */, pTex, 0);

                pSurfaceMaterial.getMaterial().emissive.set(0.);
                pSurfaceMaterial.getMaterial().diffuse.set(0.);
                pSurfaceMaterial.getMaterial().ambient.set(0.);
                pSurfaceMaterial.getMaterial().specular.set(0.);

                this._pRenderable.wireframe(true);
            };

            Sprite.prototype.getRenderable = function () {
                return this._pRenderable;
            };
            return Sprite;
        })(akra.scene.SceneObject);
        scene.Sprite = Sprite;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=Sprite.js.map
