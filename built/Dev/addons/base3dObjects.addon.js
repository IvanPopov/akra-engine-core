/// <reference path="../../../built/Lib/akra.d.ts" />
var akra;
(function (akra) {
    (function (addons) {
        var VE = akra.data.VertexElement;
        var Usage = akra.data.Usages;
        var Color = akra.color.Color;

        function createModelFromMesh(pScene, pMesh, name) {
            var pSceneModel = pScene.createModel(name || pMesh.getName() || akra.config.defaultName);
            pSceneModel.setMesh(pMesh);

            return pSceneModel;
        }

        function createSimpleMeshFromUnknownData(pEngine, name, pDecl, pData, eType, pIndices, pMaterial) {
            pDecl = akra.data.VertexDeclaration.normalize(pDecl);

            var pMesh = null;
            var pSubMesh = null;

            pMesh = akra.model.createMesh(pEngine, name, akra.EMeshOptions.HB_READABLE);
            pSubMesh = pMesh.createSubset(name + "-subset_1", eType, akra.ERenderDataBufferOptions.RD_SINGLE_INDEX);

            pSubMesh.getData().allocateData(pDecl, pData);

            if (akra.isDefAndNotNull(pIndices)) {
                pSubMesh.getData().allocateIndex(null, pIndices);
            }

            if (pEngine.isLoaded()) {
                pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
            } else {
                pEngine.depsLoaded.connect(function () {
                    pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
                });
            }

            if (akra.isDefAndNotNull(pMaterial)) {
                pSubMesh.getRenderMethod().getSurfaceMaterial().getMaterial().set(pMaterial);
            }

            return pMesh;
        }
        addons.createSimpleMeshFromUnknownData = createSimpleMeshFromUnknownData;

        function createSimpleMeshFromSimpleGeometry(pEngine, pGeometry, pMaterial, name) {
            name = name || akra.config.defaultName;

            var pDeclData = [];
            var iByteLength = 0;
            var pLoop = { vertices: Usage.POSITION, normals: Usage.NORMAL, texcoords: "TEXCOORD0" };

            Object.keys(pLoop).forEach(function (sProperty) {
                if (akra.isDefAndNotNull(pGeometry[sProperty])) {
                    var sSemantics = pLoop[sProperty];
                    pDeclData.push(sSemantics === "TEXCOORD0" ? VE.float2(sSemantics) : VE.float3(sSemantics));

                    if (!akra.isArrayBuffer(pGeometry[sProperty])) {
                        pGeometry[sProperty] = new Float32Array(pGeometry[sProperty]);
                    }

                    iByteLength += pGeometry[sProperty].byteLength;
                    return;
                }

                pGeometry[sProperty] = null;
            });

            var pData = new Float32Array(iByteLength);
            var pDecl = akra.data.VertexDeclaration.normalize(pDeclData);
            var iStride = pDecl.stride / Float32Array.BYTES_PER_ELEMENT;

            for (var i = 0; i < pGeometry.vertices.length / 3; i++) {
                var i3 = i * 3;
                var i2 = i * 2;
                var n = i * iStride;
                var e = 0;

                pData[n + (e++)] = pGeometry.vertices[i3];
                pData[n + (e++)] = pGeometry.vertices[i3 + 1];
                pData[n + (e++)] = pGeometry.vertices[i3 + 2];

                if (!akra.isNull(pGeometry.normals)) {
                    pData[n + (e++)] = pGeometry.normals[i3];
                    pData[n + (e++)] = pGeometry.normals[i3 + 1];
                    pData[n + (e++)] = pGeometry.normals[i3 + 2];
                }

                if (!akra.isNull(pGeometry.texcoords)) {
                    pData[n + (e++)] = pGeometry.texcoords[i2];
                    pData[n + (e++)] = pGeometry.texcoords[i2 + 1];
                }
            }

            if (akra.isDefAndNotNull(pGeometry.indices)) {
                if (!akra.isArrayBuffer(pGeometry.indices)) {
                    pGeometry.indices = new Uint16Array(pGeometry.indices);
                }
            }

            return createSimpleMeshFromUnknownData(pEngine, name, pDecl, pData, pGeometry.type, pGeometry.indices, pMaterial);
        }
        addons.createSimpleMeshFromSimpleGeometry = createSimpleMeshFromSimpleGeometry;

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

            var pVertexIndicesData = new Uint16Array((nCellW + nCellH) * 2);

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
            pSubMesh = pMesh.createSubset('scene-surface::main', 1 /* LINELIST */, akra.ERenderDataBufferOptions.RD_SINGLE_INDEX);
            pSubMesh.getData().allocateData([VE.float3('POSITION')], pVerticesData);
            pSubMesh.getData().allocateIndex([VE.float('INDEX_POSITION')], pVertexIndicesData);

            //pSubMesh.getData().index('POSITION', 'INDEX_POSITION');
            pSubMesh.setShadow(false);

            if (pEngine.isLoaded()) {
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

        function createQuad(pScene, fSize, v2UV) {
            if (typeof fSize === "undefined") { fSize = 20.; }
            if (typeof v2UV === "undefined") { v2UV = akra.Vec2.temp(1.); }
            var pData = new Float32Array([
                -fSize, 0., -fSize, 0., 0., 0., 1., 0.,
                fSize, 0., -fSize, v2UV.x, 0., 0., 1., 0.,
                -fSize, 0., fSize, 0., v2UV.y, 0., 1., 0.,
                fSize, 0., fSize, v2UV.x, v2UV.y, 0., 1., 0.
            ]);

            var pMatrial = akra.material.create();
            pMatrial.diffuse = new Color(akra.color.LIGHT_GRAY);
            pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
            pMatrial.specular = new Color(0.7, 0.7, 0.7, 1);
            pMatrial.emissive = new Color(0., 0., 0., 1.);
            pMatrial.shininess = 30. / 128.;

            var pMesh = createSimpleMeshFromUnknownData(pScene.getManager().getEngine(), "quad", [VE.float3('POSITION'), VE.float2('TEXCOORD0'), VE.float3('NORMAL')], pData, 5 /* TRIANGLESTRIP */, null, pMatrial);
            pMesh.setShadow(false);

            return createModelFromMesh(pScene, pMesh);
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

                if (pEngine.isLoaded()) {
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

            var pMesh, pMaterial;
            var v = pJoint.getWorldPosition().subtract(pParent.getWorldPosition(), akra.math.Vec3.temp());

            pMesh = createSimpleMeshFromSimpleGeometry(pScene.getManager().getEngine(), { vertices: [0, 0, 0, v.x, v.y, v.z], indices: [0, 1], type: 1 /* LINELIST */ }, null, "bone-" + pJoint.getName());

            pMaterial = pMesh.getSubset(0).getMaterial();
            pMaterial.emissive.set(Color.WHITE);

            pMesh.setShadow(false);

            return createModelFromMesh(pScene, pMesh);
        }
        addons.bone = bone;

        function lineCube(pScene, eOptions) {
            var pMesh, pMaterial;

            pMesh = createSimpleMeshFromSimpleGeometry(pScene.getManager().getEngine(), {
                vertices: [
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
                ], type: 1 /* LINELIST */
            }, null, "line-cube");

            pMaterial = pMesh.getSubset(0).getMaterial();
            pMaterial.emissive.set(1.);
            pMaterial.ambient.set(1.);
            pMaterial.diffuse.set(1.);
            pMaterial.shininess = 100.;

            pMesh.setShadow(false);

            return createModelFromMesh(pScene, pMesh);
        }
        addons.lineCube = lineCube;

        function cube(pScene) {
            var pEngine = pScene.getManager().getEngine();

            var pMesh = createSimpleMeshFromSimpleGeometry(pEngine, {
                type: 4 /* TRIANGLELIST */,
                vertices: [
                    -1.0, -1.0, 1.0,
                    1.0, -1.0, 1.0,
                    1.0, 1.0, 1.0,
                    -1.0, 1.0, 1.0,
                    -1.0, -1.0, -1.0,
                    -1.0, 1.0, -1.0,
                    1.0, 1.0, -1.0,
                    1.0, -1.0, -1.0,
                    -1.0, 1.0, -1.0,
                    -1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0,
                    1.0, 1.0, -1.0,
                    -1.0, -1.0, -1.0,
                    1.0, -1.0, -1.0,
                    1.0, -1.0, 1.0,
                    -1.0, -1.0, 1.0,
                    // Right face
                    1.0, -1.0, -1.0,
                    1.0, 1.0, -1.0,
                    1.0, 1.0, 1.0,
                    1.0, -1.0, 1.0,
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0, 1.0,
                    -1.0, 1.0, 1.0,
                    -1.0, 1.0, -1.0
                ],
                normals: [
                    // Front face
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    // Back face
                    0.0, 0.0, -1.0,
                    0.0, 0.0, -1.0,
                    0.0, 0.0, -1.0,
                    0.0, 0.0, -1.0,
                    // Top face
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                    // Bottom face
                    0.0, -1.0, 0.0,
                    0.0, -1.0, 0.0,
                    0.0, -1.0, 0.0,
                    0.0, -1.0, 0.0,
                    // Right face
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    -1.0, 0.0, 0.0,
                    -1.0, 0.0, 0.0,
                    -1.0, 0.0, 0.0,
                    -1.0, 0.0, 0.0
                ],
                indices: [
                    0, 1, 2, 0, 2, 3,
                    4, 5, 6, 4, 6, 7,
                    8, 9, 10, 8, 10, 11,
                    12, 13, 14, 12, 14, 15,
                    16, 17, 18, 16, 18, 19,
                    20, 21, 22, 20, 22, 23
                ]
            }, null, "cube");

            var pMat = pMesh.getSubset(0).getMaterial();
            pMat.diffuse.set(1.);
            pMat.shininess = 1.;

            return createModelFromMesh(pScene, pMesh);
        }
        addons.cube = cube;

        function cylinder(pScene3d, radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded) {
            if (typeof radiusTop === "undefined") { radiusTop = 2.5; }
            if (typeof radiusBottom === "undefined") { radiusBottom = 2.5; }
            if (typeof height === "undefined") { height = 5; }
            if (typeof segmentsRadius === "undefined") { segmentsRadius = 8; }
            if (typeof segmentsHeight === "undefined") { segmentsHeight = 1; }
            if (typeof openEnded === "undefined") { openEnded = true; }
            var heightHalf = height / 2;
            var segmentsX = segmentsRadius || 8;
            var segmentsY = segmentsHeight || 1;

            radiusTop = akra.math.max(1e-10, radiusTop);
            radiusBottom = akra.math.max(1e-10, radiusBottom);

            var x, y, vertices = [], uvs = [], normals = [], indices = [];

            for (y = 0; y <= segmentsY; y++) {
                var v = y / segmentsY;
                var radius = v * (radiusBottom - radiusTop) + radiusTop;

                for (x = 0; x <= segmentsX; x++) {
                    var u = x / segmentsX;

                    var xpos = radius * Math.sin(u * Math.PI * 2);
                    var ypos = -v * height + heightHalf;
                    var zpos = radius * Math.cos(u * Math.PI * 2);

                    vertices.push(xpos, ypos, zpos);
                    uvs.push(u, v);
                }
            }

            //function vert(x, y): IVec3 {
            //	var x0 = x;
            //	if (x > segmentsX) x = x % (segmentsX + 1);
            //	if (x < 0) x = (segmentsX + 1) + x;
            //	var n = (y * (segmentsX + 1) + x) * 3;
            //	return Vec3.temp(vertices[n], vertices[n + 1], vertices[n + 2]);
            //}
            normals.length = vertices.length;

            var Y = height;
            var X = (radiusBottom - radiusTop);

            for (x = 0; x <= segmentsX; x++) {
                //var V = vert(x, 0);
                //var Vyu = vert(x, 1)
                //var Vxl = vert(x - 1, 0);
                //var Vxr = vert(x + 1, 0);
                var u = x / segmentsX;
                var n = akra.Vec3.temp(Y * akra.math.sin(u * Math.PI * 2), X, Y * akra.math.cos(u * Math.PI * 2)).normalize();

                //var t = Vyu.subtract(V, Vec3.temp());
                //var nl = Vxl.subtract(V, Vec3.temp()).cross(t, Vec3.temp());
                //var nr = t.cross(Vxr.subtract(V, Vec3.temp()), Vec3.temp());
                //var n = nl.add(nr).normalize();
                var i = x * 3;

                normals[i] = n.x;
                normals[i + 1] = n.y;
                normals[i + 2] = n.z;
            }

            for (y = 1; y <= segmentsY; y++) {
                for (x = 0; x <= segmentsX; x++) {
                    var i = (y * (segmentsX + 1) + x) * 3;

                    normals[i] = normals[x * 3];
                    normals[i + 1] = normals[x * 3 + 1];
                    normals[i + 2] = normals[x * 3 + 2];
                }
            }

            for (y = 0; y < segmentsY; y++) {
                for (x = 0; x < segmentsX; x++) {
                    var x0y0 = y * (segmentsX + 1) + x;
                    var x1y0 = y * (segmentsX + 1) + x + 1;
                    var x0y1 = (y + 1) * (segmentsX + 1) + x;
                    var x1y1 = (y + 1) * (segmentsX + 1) + x + 1;

                    indices.push(x0y0, x0y1, x1y1);
                    indices.push(x0y0, x1y1, x1y0);
                }
            }

            var pMat = akra.material.create();
            pMat.diffuse.set(1., 0., 0., 1.);
            pMat.ambient.set(0.);
            pMat.emissive.set(0.);

            return createModelFromMesh(pScene3d, createSimpleMeshFromSimpleGeometry(pScene3d.getManager().getEngine(), {
                "type": 4 /* TRIANGLELIST */,
                "vertices": vertices,
                "normals": normals,
                "texcoords": uvs,
                "indices": indices
            }, pMat, "cylinder"));
        }
        addons.cylinder = cylinder;

        function trifan(pScene3d, radius, segments) {
            if (typeof radius === "undefined") { radius = 2.5; }
            if (typeof segments === "undefined") { segments = 8; }
            var segments = segments || 8;

            radius = akra.math.max(1e-10, radius);

            var x, y, u, v, vertices = [], uvs = [], normals = [], indices = [];

            vertices.push(0., 0., 0.);
            uvs.push(.5, .5);

            for (var i = 0; i < segments; i++) {
                x = Math.sin(Math.PI * 2 * i / segments);
                y = Math.cos(Math.PI * 2 * i / segments);
                u = .5 + .5 * x;
                v = .5 + .5 * y;

                vertices.push(radius * x, 0., radius * y);
                uvs.push(u, v);
            }

            for (var i = 0; i <= segments; i++) {
                normals.push(0., 1., 0.);
            }

            for (var i = 0; i < segments; i++) {
                indices.push(0, i + 1, (i + 1) % segments + 1);
            }

            var pMat = akra.material.create();
            pMat.diffuse.set(0.5, 0.5, 0.5, 1.);
            pMat.ambient.set(0.);
            pMat.emissive.set(0.);

            return createModelFromMesh(pScene3d, createSimpleMeshFromSimpleGeometry(pScene3d.getManager().getEngine(), {
                "type": 4 /* TRIANGLELIST */,
                "vertices": vertices,
                "normals": normals,
                "texcoords": uvs,
                "indices": indices
            }, pMat, "trifan"));
        }
        addons.trifan = trifan;
    })(akra.addons || (akra.addons = {}));
    var addons = akra.addons;
})(akra || (akra = {}));
