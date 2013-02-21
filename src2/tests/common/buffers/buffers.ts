// #include "util/testutils.ts"
#include "akra.ts"

module akra {
	var pEngine: IEngine = createEngine();
	var pResourcePool: IResourcePoolManager = pEngine.getResourceManager();
	var pVertexBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer');
	pVertexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);

	var pDecl: IVertexDeclaration = new data.VertexDeclaration();

	var pVE: IVertexElement = new data.VertexElement(2, EDataTypes.FLOAT, DeclarationUsages.NORMAL);
	var pVE2: IVertexElementInterface = VE_FLOAT2(DeclarationUsages.BINORMAL);
	var pVE3: IVertexElementInterface = VE_FLOAT(DeclarationUsages.POSITION);

	pDecl.append(pVE);
	pDecl.append(pVE2);
	pDecl.append(pVE3);

	var pData: IVertexData = pVertexBuffer.getEmptyVertexData(100,pDecl);

	console.warn(pVE, pVE2, pVE3);

	console.warn(pData);

	console.log(pDecl.toString());

	console.log(pVertexBuffer/*, pVertexBuffer.getEmptyVertexData(0)*/);
}