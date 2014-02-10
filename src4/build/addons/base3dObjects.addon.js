/// <reference path="../../../build/akra.d.ts" />
var akra;
(function (akra) {
    (function (addons) {
        var VE = akra.data.VertexElement;
        var Color = akra.color.Color;

        function createSceneSurface(pScene, nCellW, nCellH) {
            if (typeof nCellW === "undefined") { nCellW = 10; }
            if (typeof nCellH === "undefined") { nCellH = nCellW; }
            if (nCellW % 2 === 0) {
                nCellW += 1;
            }

            if (nCellH % 2 === 0) {
                nCellH += 1;
            }

            var nScaleX = nCellW - 1;
            var nScaleY = nCellH - 1;

            var pMesh = null, pSubMesh = null;
            var iPos = 0;
            var pVerticesData = new Float32Array((nCellW + nCellH) * 6);

            var fStepX = 1.0 / (nCellW - 1);
            var fStepY = 1.0 / (nCellH - 1);
            var n = 0;

            for (var z = 0; z < nCellH; ++z) {
                pVerticesData[n] = (-.5) * nScaleX;
                pVerticesData[n + 2] = (z * fStepY - .5) * nScaleY;
                n += 3;

                pVerticesData[n] = (.5) * nScaleX;
                pVerticesData[n + 2] = (z * fStepY - .5) * nScaleY;
                n += 3;
            }

            for (var x = 0; x < nCellW; ++x) {
                pVerticesData[n] = (x * fStepX - .5) * nScaleX;
                pVerticesData[n + 2] = (-.5) * nScaleY;
                n += 3;

                pVerticesData[n] = (x * fStepX - .5) * nScaleX;
                pVerticesData[n + 2] = (.5) * nScaleY;
                n += 3;
            }

            var pVertexIndicesData = new Float32Array((nCellW + nCellH) * 2);

            n = 0;
            for (var z = 0; z < nCellH; ++z) {
                pVertexIndicesData[n++] = z * 2;
                pVertexIndicesData[n++] = z * 2 + 1;
            }
            ;

            for (var x = 0; x < nCellW; ++x) {
                pVertexIndicesData[n++] = nCellH * 2 + x * 2;
                pVertexIndicesData[n++] = nCellH * 2 + x * 2 + 1;
            }
            ;

            var pEngine = pScene.getManager().getEngine();

            pMesh = akra.model.createMesh(pEngine, 'scene-surface', akra.EMeshOptions.HB_READABLE);
            pSubMesh = pMesh.createSubset('scene-surface::main', 1 /* LINELIST */);
            pSubMesh.getData().allocateData([VE.float3('POSITION')], pVerticesData);
            pSubMesh.getData().allocateIndex([VE.float('INDEX_POSITION')], pVertexIndicesData);
            pSubMesh.getData().index('POSITION', 'INDEX_POSITION');

            pSubMesh.setShadow(false);

            if (pEngine.isDepsLoaded()) {
                pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.plane");
            } else {
                pScene.getManager().getEngine().depsLoaded.connect(function () {
                    pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.plane");
                });
            }

            var pSceneModel = pScene.createModel("scene-surface");
            pSceneModel.setMesh(pMesh);

            return pSceneModel;
        }
        addons.createSceneSurface = createSceneSurface;

        function createQuad(pScene, fSize) {
            if (typeof fSize === "undefined") { fSize = 20.; }
            var pMesh = null, pSubMesh = null;

            var pVerticesData = new Float32Array([
                -fSize, 0., -fSize,
                fSize, 0., -fSize,
                -fSize, 0., fSize,
                fSize, 0., fSize
            ]);
            var pNormalsData = new Float32Array([
                0., 1., 0.
            ]);
            var pVertexIndicesData = new Float32Array([
                0., 1., 2., 3.
            ]);

            var pNormalIndicesData = new Float32Array([
                0., 0., 0., 0.
            ]);

            var iPos = 0, iNorm = 0;

            var pEngine = pScene.getManager().getEngine();

            pMesh = akra.model.createMesh(pEngine, 'quad', akra.EMeshOptions.HB_READABLE);
            pSubMesh = pMesh.createSubset('quad::main', 5 /* TRIANGLESTRIP */);

            iPos = pSubMesh.getData().allocateData([VE.float3('POSITION')], pVerticesData);
            pSubMesh.getData().allocateIndex([VE.float('INDEX0')], pVertexIndicesData);
            pSubMesh.getData().index('POSITION', 'INDEX0');

            iNorm = pSubMesh.getData().allocateData([VE.float3('NORMAL')], pNormalsData);
            pSubMesh.getData().allocateIndex([VE.float('INDEX1')], pNormalIndicesData);

            pSubMesh.getData().index('NORMAL', 'INDEX1');

            pSubMesh.setShadow(false);

            if (pEngine.isDepsLoaded()) {
                pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
            } else {
                pScene.getManager().getEngine().depsLoaded.connect(function () {
                    pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
                });
            }

            var pMatrial = pSubMesh.getRenderMethod().getSurfaceMaterial().getMaterial();
            pMatrial.diffuse = new Color(akra.color.LIGHT_GRAY);
            pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
            pMatrial.specular = new Color(0.7, 0.7, 0.7, 1);
            pMatrial.emissive = new Color(0., 0., 0., 1.);
            pMatrial.shininess = 30.;

            var pSceneModel = pScene.createModel("quad");
            pSceneModel.setMesh(pMesh);

            return pSceneModel;
        }
        addons.createQuad = createQuad;

        function basis(pScene, eOptions, fSize) {
            if (typeof eOptions === "undefined") { eOptions = akra.EMeshOptions.HB_READABLE; }
            if (typeof fSize === "undefined") { fSize = 1.; }
            var pMesh, pSubMesh, pMaterial;
            var iPos, iNorm;
            var pEngine = pScene.getManager().getEngine();

            pMesh = akra.model.createMesh(pEngine, "basis", eOptions);
            iNorm = pMesh.getData().allocateData([VE.float3("NORMAL")], new Float32Array([1, 0, 0]));

            function createAxis(sName, pCoords, pColor) {
                pSubMesh = pMesh.createSubset(sName, 1 /* LINELIST */);

                iPos = pSubMesh.getData().allocateData([VE.float3("POSITION")], pCoords);
                pSubMesh.getData().allocateIndex([VE.float("INDEX0")], new Float32Array([0, 1]));
                pSubMesh.getData().allocateIndex([VE.float("INDEX1")], new Float32Array([0, 0]));

                pSubMesh.getData().index(iPos, "INDEX0");
                pSubMesh.getData().index(iNorm, "INDEX1");

                pMaterial = pSubMesh.getMaterial();
                pMaterial.emissive = pColor;
                pMaterial.ambient = pColor;
                pMaterial.diffuse = pColor;
                pMaterial.shininess = 100.;

                pSubMesh.setShadow(false);

                if (pEngine.isDepsLoaded()) {
                    pSubMesh.getEffect().addComponent("akra.system.mesh_texture");
                } else {
                    pScene.getManager().getEngine().depsLoaded.connect(function () {
                        pSubMesh.getEffect().addComponent("akra.system.mesh_texture");
                    });
                }
            }

            createAxis('basis::X-axis', new Float32Array([0, 0, 0, 1 * fSize, 0, 0]), new Color(akra.color.RED));
            createAxis('basis::Y-axis', new Float32Array([0, 0, 0, 0, 1 * fSize, 0]), new Color(akra.color.GREEN));
            createAxis('basis::Z-axis', new Float32Array([0, 0, 0, 0, 0, 1 * fSize]), new Color(akra.color.BLUE));

            var pSceneModel = pScene.createModel("basis");
            pSceneModel.setMesh(pMesh);

            return pSceneModel;
        }
        addons.basis = basis;

        function bone(pJoint) {
            var pScene = pJoint.getScene();
            var pParent = pJoint.getParent();

            if (akra.isNull(pParent)) {
                return null;
            }

            pParent.update();
            pJoint.update();

            var pMesh, pSubMesh, pMaterial;
            var iPos, iNorm;
            var pEngine = pScene.getManager().getEngine();
            var v = pJoint.getWorldPosition().subtract(pParent.getWorldPosition(), akra.math.Vec3.temp());

            pMesh = akra.model.createMesh(pEngine, "bone-" + pJoint.getName(), akra.EMeshOptions.HB_READABLE);
            pSubMesh = pMesh.createSubset("bone", 1 /* LINELIST */);

            pSubMesh.getData().allocateData([VE.float3("POSITION")], new Float32Array([0, 0, 0, v.x, v.y, v.z]));
            pSubMesh.getData().allocateIndex([VE.float("INDEX0")], new Float32Array([0, 1]));

            pSubMesh.getData().index("POSITION", "INDEX0");

            pMaterial = pSubMesh.getMaterial();
            pMaterial.emissive.set(Color.WHITE);

            pSubMesh.setShadow(false);

            if (pEngine.isDepsLoaded()) {
                pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
            } else {
                pScene.getManager().getEngine().depsLoaded.connect(function () {
                    pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
                });
            }

            var pSceneModel = pScene.createModel("bone-" + pJoint.getName());
            pSceneModel.setMesh(pMesh);

            return pSceneModel;
        }
        addons.bone = bone;

        function lineCube(pScene, eOptions) {
            var pMesh, pSubMesh, pMaterial;
            var iPos, iNorm;
            var pEngine = pScene.getManager().getEngine();

            pMesh = akra.model.createMesh(pEngine, "line-cube", eOptions || akra.EMeshOptions.HB_READABLE);
            iNorm = pMesh.getData().allocateData([VE.float3("NORMAL")], new Float32Array([1, 0, 0]));

            pSubMesh = pMesh.createSubset("cube", 1 /* LINELIST */);

            pSubMesh.getData().allocateAttribute([VE.float3("POSITION")], new Float32Array([
                -1, -1, -1,
                1, -1, -1,
                1, -1, -1,
                1, 1, -1,
                1, 1, -1,
                -1, 1, -1,
                -1, 1, -1,
                -1, -1, -1,
                -1, -1, 1,
                1, -1, 1,
                1, -1, 1,
                1, 1, 1,
                1, 1, 1,
                -1, 1, 1,
                -1, 1, 1,
                -1, -1, 1,
                -1, -1, -1,
                -1, 1, -1,
                -1, 1, -1,
                -1, 1, 1,
                -1, 1, 1,
                -1, -1, 1,
                -1, -1, 1,
                -1, -1, -1,
                //right
                1, -1, -1,
                1, 1, -1,
                1, 1, -1,
                1, 1, 1,
                1, 1, 1,
                1, -1, 1,
                1, -1, 1,
                1, -1, -1
            ]));

            pMaterial = pSubMesh.getMaterial();
            pMaterial.emissive.set(1.);
            pMaterial.ambient.set(1.);
            pMaterial.diffuse.set(1.);
            pMaterial.shininess = 100.;

            pSubMesh.setShadow(false);

            if (pEngine.isDepsLoaded()) {
                pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
            } else {
                pScene.getManager().getEngine().depsLoaded.connect(function () {
                    pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
                });
            }

            var pSceneModel = pScene.createModel("line-cube");
            pSceneModel.setMesh(pMesh);

            return pSceneModel;
        }
        addons.lineCube = lineCube;
    })(akra.addons || (akra.addons = {}));
    var addons = akra.addons;
})(akra || (akra = {}));
