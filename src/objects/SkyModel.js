/**
 * @file
 * @brief IndexData class.
 * @author xoma
 * @email xoma@odserve.org
 **/
 
 
 /**
 * @enum eBufferFlagBits
 *
 * @memberof IndexBuffer
 **/
Enum([
        Box = 0,
		Hemisphere,
		Sphere,
		Dome
    ],
    SkyModel, a.SkyModel);
 
 /**
 * @property SkyModel()
 * @memberof SkyModel
 **/
/**
 * SkyModel Class
 * @ctor
 * Constructor of SkyModel class
 **/
 
function SkyModel(pEngine,eModelType)
{
	A_CLASS;
	
	this._pMesh=null;
	
	// this._pRenderMethod=null;
	
	this._eType=undefined;
	
	// this._pRenderMethod=null;
	
	this._v4fScaleOffset= new Vector4();
	
	this._iUVSettings = undefined;	
}

EXTENDS(SkyModel, a.SceneObject);
// SkyModel.prototype.pVertexDescription = new Array(1);
// SkyModel.prototype.pVertexDescription[0] = new a.VertexDeclaration(3, "POSITION0", a.DTYPE.FLOAT);


SkyModel.prototype.create=function(eType)
{	
	// var sModelPath=new String();
	SceneObject.prototype.create.call(this);
	safe_release(this._pMesh);
	
	this._eType=eType;
	
	switch(this._eType)
	{	
		case a.SkyModel.Box:
			// sModelPath = "unit_cube.dae";
			this._pMesh = a.geom.cube(this._pEngine, 0, 'skybox', 2.);
			break;

		case a.SkyModel.Hemisphere:
			TODO('a.SkyModel.Hemisphere');
			// sModelPath = "unit_sphere.dae";
			break;

		case a.SkyModel.Sphere:
			TODO('a.SkyModel.Sphere');
			// sModelPath = "unit_hemisphere.dae";
			break;

		case a.SkyModel.Dome:
			TODO('a.SkyModel.Dome');
			// sModelPath = "unit_dome.dae";
			break;
	}
	

	// sModelPath = MEDIA_PATH('models/'+sModelPath, '/media/');
	
	// var me = this;
	// a.COLLADA(this._pEngine, sModelPath, function (pFrameRoot, nTotalFrames) {
 //                if (!pFrameRoot) {
 //                    debug_error('model: ' + sModelPath + ' not loaded.');
 //                    return false;
 //                }

	// 			var pMeshContainer = pFrameRoot.pMeshContainer;
 //                var pMesh = pMeshContainer.pMeshData.pMesh;				
	// 			me._pMesh = pMesh;
 //            });
}

SkyModel.prototype.destroy=function()
{
	safe_release(this._pMesh);
	safe_release(this._pRenderMethod);
}

// SkyModel.prototype.setRenderMethod=function(pMethod)
// {
// 	safe_release(this._pRenderMethod);
// 	this._pRenderMethod = pMethod;

// 	if (this._pRenderMethod)
// 	{
// 		this._pRenderMethod.addRef();
// 	}
// }

SkyModel.prototype.update=function()
{
	SceneObject.prototype.update.call(this);
	this._v4fScaleOffset.x+=0.00025;
	this._v4fScaleOffset.y+=0.00035;
	this._v4fScaleOffset.z+=0.0004;
	this._v4fScaleOffset.w+=0.0005;
}
// var t = 0;
SkyModel.prototype.render=function()
{
	 parent.render(this);

 
    var pEngine = this._pEngine;
    var pCamera = pEngine.getActiveCamera();
    var pMesh = this._pMesh;
    var pProgram = pEngine.pSkyBoxProg;
    var pDevice = pEngine.pDevice;
    var pModel = this;
    var pSkyTexture = pEngine.pSkyMap;

    var pSubMesh = pMesh[0];

    pProgram.activate();
    pProgram.applyMatrix4('skyBoxMatrix', pCamera.skyBoxMatrix());
    // pProgram.applyFloat('INDEX_POSITION_OFFSET', 3);

    var iTexture = 12;
    pSkyTexture.activate(iTexture);
    pProgram.applySamplerCube('cubeMap', iTexture);


    // if (t < 1) {
    // 	trace(pProgram);
    // 	trace(pCamera.skyBoxMatrix().toString());
    // 	trace(pSubMesh);
    // 	t++;
    // }

    pSubMesh.draw();
}

a.SkyModel = SkyModel;
