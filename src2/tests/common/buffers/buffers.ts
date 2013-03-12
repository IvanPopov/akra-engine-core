#include "util/testutils.ts"
#include "akra.ts"

module akra {
	var pEngine: IEngine = createEngine();
	var pResourcePool: IResourcePoolManager = pEngine.getResourceManager();

	if (pEngine.getRenderer().debug(true, true)) {
		LOG("context debugging enabled");
	}

	test("VertexDeclaration tests", () =>{
		var pVertexBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer' + <string>sid());
		pVertexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElement = new data.VertexElement(2, EDataTypes.FLOAT, DeclarationUsages.NORMAL);
		var pVE2: IVertexElementInterface = VE_FLOAT2(DeclarationUsages.BINORMAL);
		var pVE3: IVertexElementInterface = VE_FLOAT(DeclarationUsages.POSITION);

		shouldBeTrue("add single vertex element: NORMAL");
		check(pDecl.append(pVE));
		shouldBeTrue("add multiple vertex elements: BINORMAL, POSITION");
		check(pDecl.append(pVE2, pVE3));

		shouldBe("check stride", 20);
		check(pDecl.stride);

		shouldBe("check offsets: NORMAL", 0);
		check(pDecl.findElement(DeclarationUsages.NORMAL).offset);

		shouldBe("check offsets: BINORMAL", 8);
		check(pDecl.findElement(DeclarationUsages.BINORMAL).offset);

		shouldBe("check offsets: POSITION", 16);
		check(pDecl.findElement(DeclarationUsages.POSITION).offset);

		shouldBeNotNull("get empty vertex data")
		check(pVertexBuffer.getEmptyVertexData(3,pDecl));
	});

	test("VertexBuffer tests<br/>" + 
			"Declaration: NORMAL(FLOAT2), BINORMAL(FLOAT2), POSITION(FLOAT)", () => {

		var pVertexBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer' + <string>sid());
		pVertexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElement = new data.VertexElement(2, EDataTypes.FLOAT, DeclarationUsages.NORMAL);
		var pVE2: IVertexElementInterface = VE_FLOAT2(DeclarationUsages.BINORMAL);
		var pVE3: IVertexElementInterface = VE_FLOAT(DeclarationUsages.POSITION);

		pDecl.append(pVE, pVE2, pVE3);

		var pData: IVertexData = pVertexBuffer.getEmptyVertexData(3,pDecl);

		var pArray: Float32Array = new Float32Array([1,2,3,4]);

		shouldBeTrue("VertexData setData(ArrayBufferView)");
		check(pData.setData(pArray));

		shouldBeArray("readData(NORMAL, 0, 2)", pArray);
		check(new Float32Array(pData.getData(DeclarationUsages.NORMAL, 0, 2)));

		shouldBeArray("readData(NORMAL, 1, 2)", new Float32Array([3,4,0,0]));
		check(new Float32Array(pData.getData(DeclarationUsages.NORMAL, 1, 2)));

		shouldBeArray("getTypedData(NORMAL)", new Float32Array([1,2,3,4,0,0]));
		check(pData.getTypedData(DeclarationUsages.NORMAL));

		shouldBeArray("getTypedData(NORMAL, 1, 1)", new Float32Array([3,4]));
		check(pData.getTypedData(DeclarationUsages.NORMAL,1,1));

		shouldBeTrue("set data to element: POSITION");
		check(pData.setData(new Float32Array([134]), "POSITION", 4, 2, 1));

		shouldBeArray("check data: POSITION", new Float32Array([0, 0, 134]));
		check(pData.getTypedData("POSITION"));
	});

	test("VertexBuffer, VertexDeclaration with overlap<br/>" + 
			"Declaration: POSITION(FLOAT2), POSITION_X(FLOAT), POSITION_Y(FLOAT)", () => {
		var pVertexBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer' + <string>sid());
		pVertexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElement = new data.VertexElement(2, EDataTypes.FLOAT, DeclarationUsages.POSITION);
		var pVE2: IVertexElementInterface = VE_FLOAT("POSITION_X", 0);
		var pVE3: IVertexElementInterface = VE_FLOAT("POSITION_Y", 4);

		pDecl.append(pVE, pVE2, pVE3);

		shouldBe("check stride", 8);
		check(pDecl.stride);

		shouldBe("check offset: POSITION_X", 0);
		check(pDecl.findElement("POSITION_X").offset);

		shouldBe("check offset: POSITION_Y", 4);
		check(pDecl.findElement("POSITION_Y").offset);

		var pData: IVertexData = pVertexBuffer.getEmptyVertexData(2,pDecl);

		var pArray: Float32Array = new Float32Array([1,2,3,4]);

		pData.setData(pArray, 'POSITION');

		shouldBeArray("set to POSITION read POSITION_X", new Float32Array([1,3]));
		check(pData.getTypedData("POSITION_X"));

		shouldBeArray("set to POSITION read POSITION_Y", new Float32Array([2,4]));
		check(pData.getTypedData("POSITION_Y"));

		shouldBeTrue("set data to POSITION_X");
		check(pData.setData(new Float32Array([5,6]), 'POSITION_X'));

		shouldBeTrue("set data to POSITION_Y");
		check(pData.setData(new Float32Array([42,34]), 'POSITION_Y'));

		shouldBeArray("read data: POSITION", new Float32Array([5, 42, 6, 34]));
		check(pData.getTypedData("POSITION"));

		shouldBeTrue("set element to POSITION");
		check(pData.setData(new Float32Array([77.3, 44.2]), "POSITION", 8, 1, 1));

		shouldBeArray('read element: POSITION_X', new Float32Array([77.3]));
		check(pData.getTypedData("POSITION_X", 1, 1));

		shouldBeArray('read element: POSITION_Y', new Float32Array([44.2]));
		check(pData.getTypedData("POSITION_Y", 1, 1));
	});

	test("VertexBuffer, VertexDeclaration with overlap and different types<br/>" +
			"Declaration: TEST(FLOAT), TEST_XYZW(UINT8 4)", () => {

		var pVertexBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer' + <string>sid());
		pVertexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElement = new data.VertexElement(1, EDataTypes.FLOAT, "TEST");
		var pVE2: IVertexElementInterface = new data.VertexElement(4, EDataTypes.BYTE, "TEST_XYZW", 0);
		
		pDecl.append(pVE, pVE2);

		shouldBe("check stride", 4);
		check(pDecl.stride);

		shouldBe("check TEST offset", 0);
		check(pDecl.findElement("TEST").offset);

		shouldBe("check TEST_XYZW offset", 0);
		check(pDecl.findElement("TEST_XYZW").offset);

		var pData: IVertexData = pVertexBuffer.getEmptyVertexData(2,pDecl);

		var pU8: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
		var pF32: Float32Array = new Float32Array(pU8.buffer);

		shouldBeTrue("set data into TEST");
		check(pData.setData(pF32, "TEST"));

		shouldBeArray("check data TEST_XYZW", pU8);
		check(pData.getTypedData("TEST_XYZW"))

		pU8 = new Uint8Array([1, 2, 3, 4]);
		pF32 = new Float32Array(pU8.buffer);

		shouldBeTrue("set into element TEST_XYZW");
		check(pData.setData(pU8, "TEST_XYZW", 4, 1, 1));

		shouldBeArray("check element TEST", pF32);
		check(pData.getTypedData("TEST", 1, 1));
	});

	test("VertexBuffer, VertexDeclaration with VE_END<br/>" + 
		"Declaration: POSITION(FLOAT3), VE_END()", () => {

		var pVertexBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer' + <string>sid());
		pVertexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElementInterface = VE_FLOAT3("POSITION");
		var pVE2: IVertexElementInterface = VE_END(16);

		pDecl.append(pVE, pVE2);

		shouldBe("check stride", 16);
		check(pDecl.stride);

		shouldBe("check POSITION offset", 0);
		check(pDecl.findElement("POSITION").offset);

		var pData: IVertexData = pVertexBuffer.getEmptyVertexData(2,pDecl);

		var pArray: Float32Array = new Float32Array([1,2,3,4,5,6]);

		shouldBeTrue("write data to POSITION");
		check(pData.setData(pArray, "POSITION"));

		shouldBeArray("check data POSITION",pArray);
		check(pData.getTypedData("POSITION"));

	});

test("VideoBuffer tests<br/>" + 
			"Declaration: NORMAL(FLOAT2), BINORMAL(FLOAT2), POSITION(FLOAT)", () => {

		var pVideoBuffer: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElement = new data.VertexElement(2, EDataTypes.FLOAT, DeclarationUsages.NORMAL);
		var pVE2: IVertexElementInterface = VE_FLOAT2(DeclarationUsages.BINORMAL);
		var pVE3: IVertexElementInterface = VE_FLOAT(DeclarationUsages.POSITION);

		pDecl.append(pVE, pVE2, pVE3);

		var pData: IVertexData = pVideoBuffer.getEmptyVertexData(3,pDecl);

		var pArray: Float32Array = new Float32Array([1,2,3,4]);

		shouldBeTrue("VertexData setData(ArrayBufferView)");
		check(pData.setData(pArray));

		shouldBeArray("readData(NORMAL, 0, 2)", pArray);
		check(new Float32Array(pData.getData(DeclarationUsages.NORMAL, 0, 2)));

		shouldBeArray("readData(NORMAL, 1, 2)", new Float32Array([3,4,0,0]));
		check(new Float32Array(pData.getData(DeclarationUsages.NORMAL, 1, 2)));

		shouldBeArray("getTypedData(NORMAL)", new Float32Array([1,2,3,4,0,0]));
		check(pData.getTypedData(DeclarationUsages.NORMAL));

		shouldBeArray("getTypedData(NORMAL, 1, 1)", new Float32Array([3,4]));
		check(pData.getTypedData(DeclarationUsages.NORMAL,1,1));

		shouldBeTrue("set data to element: POSITION");
		check(pData.setData(new Float32Array([134]), "POSITION", 4, 2, 1));

		shouldBeArray("check data: POSITION", new Float32Array([0, 0, 134]));
		check(pData.getTypedData("POSITION"));
	});

	test("VideoBuffer, VertexDeclaration with overlap<br/>" + 
			"Declaration: POSITION(FLOAT2), POSITION_X(FLOAT), POSITION_Y(FLOAT)", () => {
		var pVideoBuffer: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElement = new data.VertexElement(2, EDataTypes.FLOAT, DeclarationUsages.POSITION);
		var pVE2: IVertexElementInterface = VE_FLOAT("POSITION_X", 0);
		var pVE3: IVertexElementInterface = VE_FLOAT("POSITION_Y", 4);

		pDecl.append(pVE, pVE2, pVE3);

		shouldBe("check stride", 8);
		check(pDecl.stride);

		shouldBe("check offset: POSITION_X", 0);
		check(pDecl.findElement("POSITION_X").offset);

		shouldBe("check offset: POSITION_Y", 4);
		check(pDecl.findElement("POSITION_Y").offset);

		var pData: IVertexData = pVideoBuffer.getEmptyVertexData(2,pDecl);

		var pArray: Float32Array = new Float32Array([1,2,3,4]);

		pData.setData(pArray, 'POSITION');

		shouldBeArray("set to POSITION read POSITION_X", new Float32Array([1,3]));
		check(pData.getTypedData("POSITION_X"));

		shouldBeArray("set to POSITION read POSITION_Y", new Float32Array([2,4]));
		check(pData.getTypedData("POSITION_Y"));

		shouldBeTrue("set data to POSITION_X");
		check(pData.setData(new Float32Array([5,6]), 'POSITION_X'));

		shouldBeTrue("set data to POSITION_Y");
		check(pData.setData(new Float32Array([42,34]), 'POSITION_Y'));

		shouldBeArray("read data: POSITION", new Float32Array([5, 42, 6, 34]));
		check(pData.getTypedData("POSITION"));

		shouldBeTrue("set element to POSITION");
		check(pData.setData(new Float32Array([77.3, 44.2]), "POSITION", 8, 1, 1));

		shouldBeArray('read element: POSITION_X', new Float32Array([77.3]));
		check(pData.getTypedData("POSITION_X", 1, 1));

		shouldBeArray('read element: POSITION_Y', new Float32Array([44.2]));
		check(pData.getTypedData("POSITION_Y", 1, 1));
	});

	test("VideoBuffer, VertexDeclaration with overlap and different types<br/>" +
			"Declaration: TEST(FLOAT), TEST_XYZW(UINT8 4)", () => {

		var pVideoBuffer: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);		

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElement = new data.VertexElement(1, EDataTypes.FLOAT, "TEST");
		var pVE2: IVertexElementInterface = new data.VertexElement(4, EDataTypes.BYTE, "TEST_XYZW", 0);
		
		pDecl.append(pVE, pVE2);

		shouldBe("check stride", 4);
		check(pDecl.stride);

		shouldBe("check TEST offset", 0);
		check(pDecl.findElement("TEST").offset);

		shouldBe("check TEST_XYZW offset", 0);
		check(pDecl.findElement("TEST_XYZW").offset);

		var pData: IVertexData = pVideoBuffer.getEmptyVertexData(2,pDecl);

		var pU8: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
		var pF32: Float32Array = new Float32Array(pU8.buffer);

		shouldBeTrue("set data into TEST");
		check(pData.setData(pF32, "TEST"));

		shouldBeArray("check data TEST_XYZW", pU8);
		check(pData.getTypedData("TEST_XYZW"))

		pU8 = new Uint8Array([1, 2, 3, 4]);
		pF32 = new Float32Array(pU8.buffer);

		shouldBeTrue("set into element TEST_XYZW");
		check(pData.setData(pU8, "TEST_XYZW", 4, 1, 1));

		shouldBeArray("check element TEST", pF32);
		check(pData.getTypedData("TEST", 1, 1));
	});

	test("VideoBuffer, VertexDeclaration with VE_END<br/>" + 
		"Declaration: POSITION(FLOAT3), VE_END()", () => {

		var pVideoBuffer: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);		

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElementInterface = VE_FLOAT3("POSITION");
		var pVE2: IVertexElementInterface = VE_END(16);

		pDecl.append(pVE, pVE2);

		shouldBe("check stride", 16);
		check(pDecl.stride);

		shouldBe("check POSITION offset", 0);
		check(pDecl.findElement("POSITION").offset);

		var pData: IVertexData = pVideoBuffer.getEmptyVertexData(2,pDecl);

		var pArray: Float32Array = new Float32Array([1,2,3,4,5,6]);

		shouldBeTrue("write data to POSITION");
		check(pData.setData(pArray, "POSITION"));

		shouldBeArray("check data POSITION",pArray);
		check(pData.getTypedData("POSITION"));

	});

	test("IndexBuffer tests", () => {
		var pIndexBuffer: IIndexBuffer = pResourcePool.createIndexBuffer('test-index-buffer' + <string>sid());
		pIndexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);		

		var pData: IIndexData = pIndexBuffer.getEmptyIndexData(10, EPrimitiveTypes.TRIANGLELIST, EDataTypes.UNSIGNED_SHORT);

		shouldBeNotNull("try receive indexData");
		check(pData);

		shouldBeTrue("set data");
		check(pData.setData(new Uint16Array([1,2,3,4])));

		shouldBeArray("read data", new Uint16Array([1,2,3,4]));
		check(new Uint16Array(pData.getData(0,8)));

		shouldBeTrue("set data to element");
		check(pData.setData(new Uint16Array([7]), 7));

		shouldBeArray("read element", new Uint16Array([7]));
		check(new Uint16Array(pData.getData(14, 2)))

		shouldBeTrue("set data");
		check(pData.setData(new Uint16Array([3,4]), 5));

		shouldBeArray("read typed array", new Uint16Array([3,4]));
		check(pData.getTypedData(5, 2));	
	});

	test("bufferMap test unmappable flow", () => {
		var pMap: IBufferMap = util.createBufferMap(pEngine);

		var pVertexBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer' + <string>sid());
		pVertexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();
		var pVE: IVertexElementInterface = VE_FLOAT4("POSITION");

		pDecl.append(pVE);

		var pVertexData: IVertexData = pVertexBuffer.getEmptyVertexData(4,pDecl);

		var pArr1: Float32Array = new Float32Array([1,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,16]);

		pVertexData.setData(pArr1, "POSITION");

		var pIndexBuffer: IIndexBuffer = pResourcePool.createIndexBuffer('test-index-buffer' + <string>sid());
		pIndexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);		

		var pIndexData: IIndexData = pIndexBuffer.getEmptyIndexData(15, EPrimitiveTypes.TRIANGLESTRIP, EDataTypes.UNSIGNED_SHORT);

		var pArr2: Uint16Array = new Uint16Array([0,1,2 ,3,0,2, 1,3,0, 1,2,3, 0,2,3]);
		pIndexData.setData(pArr2);

		var iFlow: uint;

		shouldBe("set vertexData from vertexBuffer, check flow", 0);
		check(iFlow = pMap.flow(pVertexData));

		pMap.index = pIndexData;

		shouldBe("set indexData, test prim type", EPrimitiveTypes.TRIANGLESTRIP);
		check(pMap.primType);

		shouldBe("test primitive count", 13);
		check(pMap.primCount);
	});

	test("bufferMap test mappable flow", () => {
		var pMap: IBufferMap = util.createBufferMap(pEngine);

		var pVideoBuffer: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl1: IVertexDeclaration = new data.VertexDeclaration();
		var pDecl2: IVertexDeclaration = new data.VertexDeclaration();
		var pVE1: IVertexElementInterface = VE_FLOAT4("POSITION");
		var pVE2: IVertexElementInterface = VE_FLOAT3("NORMAL");
		var pVE3: IVertexElementInterface = VE_FLOAT3("BINORMAL");
		var pVE4: IVertexElementInterface = VE_END(32);

		pDecl1.append(pVE1);
		pDecl2.append(pVE2, pVE3, pVE4);

		var pVertexData1: IVertexData = pVideoBuffer.getEmptyVertexData(4,pDecl1);
		var pVertexData2: IVertexData = pVideoBuffer.getEmptyVertexData(4,pDecl2);

		var pArr1: Float32Array = new Float32Array([1,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,16]);
		var pArr2: Float32Array = new Float32Array([1,2,3, 4,5,6, 7,8,9, 10,11,12]);
		var pArr3: Float32Array = new Float32Array([-1,-2,-3, -4,-5,-6, -7,-8,-9, -10,-11,-12]);

		pVertexData1.setData(pArr1, "POSITION");

		pVertexData2.setData(pArr2, "NORMAL");
		pVertexData2.setData(pArr3, "BINORMAL");

		var pMapBuffer: IVertexBuffer = pResourcePool.createVertexBuffer('test-vertex-buffer' + <string>sid());
		pMapBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDeclMap: IVertexDeclaration = new data.VertexDeclaration();
		var pVE1Index: IVertexElementInterface = VE_CUSTOM("INDEX_POSITION", EDataTypes.UNSIGNED_SHORT, 6);
		var pVE2Index: IVertexElementInterface = VE_CUSTOM("INDEX_NORMAL", EDataTypes.UNSIGNED_SHORT, 6);

		pDeclMap.append(pVE1Index, pVE2Index);

		var pIndex1: Uint16Array = new Uint16Array([1,2,3, 2,3,1]);
		var pIndex2: Uint16Array = new Uint16Array([3,2,0, 0,1,3]);

		var pMapData: IVertexData = pVideoBuffer.getEmptyVertexData(6,pDeclMap);
		pMapData.setData(pIndex1, "INDEX_POSITION");
		pMapData.setData(pIndex2, "INDEX_NORMAL");

		var iFlow1: uint;
		var iFlow2: uint;

		shouldBe("set vertexData from videoBuffer, check flow", 0);
		check(iFlow1 = pMap.flow(pVertexData1));

		shouldBe("set vertexData from videoBuffer, check flow", 1);
		check(iFlow2 = pMap.flow(pVertexData2));

		shouldBeTrue("try mapping first vertexData");
		check(pMap.mapping(iFlow1, pMapData, "INDEX_POSITION"));

		shouldBeTrue("try mapping second vertexData");
		check(pMap.mapping(iFlow2, pMapData, "INDEX_NORMAL"));

		shouldBe("test primitive count", 2);
		check(pMap.primCount);

		pMap.primType = EPrimitiveTypes.TRIANGLEFAN;

		shouldBe("change primitive type, check polygon count", 4);
		check(pMap.primCount);

		var pIndexBuffer: IIndexBuffer = pResourcePool.createIndexBuffer('test-index-buffer' + <string>sid());
		pIndexBuffer.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);		

		var pIndexData: IIndexData = pIndexBuffer.getEmptyIndexData(15, EPrimitiveTypes.POINTLIST, EDataTypes.UNSIGNED_SHORT);

		var pIndexArr: Uint16Array = new Uint16Array([0,1,2 ,3,0,2, 1,3,0, 1,2,3, 0,2,3]);
		pIndexData.setData(pIndexArr);

		pMap.index = pIndexData;

		shouldBe("set index, check primitive type", EPrimitiveTypes.POINTLIST);
		check(pMap.primType);

		shouldBe("check primitive count", 15);
		check(pMap.primCount);
	});

	var pContext: WebGLRenderingContext = (<any>pEngine.getRenderer())._pWebGLContext;

	var sVertexShader: string = 
	   "attribute float position;\n\
	   	\n\
		uniform sampler2D texture1;\n\
		uniform sampler2D texture2;\n\
		\n\
		uniform vec2 textureSize1;\n\
		uniform vec2 textureSize2;\n\
		uniform vec2 resultTextureSize;\n\
		\n\
		varying vec4 v4fResult;\n\
		\n\
		void main(void){\n\
			vec2 v2fPosition1 = vec2((mod(position,textureSize1.x) + 0.5)/textureSize1.x, (floor(position/textureSize1.x) + 0.5)/textureSize1.y);\n\
			vec2 v2fPosition2 = vec2((mod(position,textureSize2.x) + 0.5)/textureSize2.x, (floor(position/textureSize2.x) + 0.5)/textureSize2.y);\n\
			vec2 v2fResultPosition = vec2((mod(position,resultTextureSize.x) + 0.5)/resultTextureSize.x, (floor(position/resultTextureSize.x) + 0.5)/resultTextureSize.y);\n\
			\n\
			vec4 v4fColor1 = texture2D(texture1, v2fPosition1);\n\
			vec4 v4fColor2 = texture2D(texture2, v2fPosition2);\n\
			\n\
			v4fResult.x = (v4fColor1.x == v4fColor2.x) ? 1. : 0.;\n\
			v4fResult.y = (v4fColor1.y == v4fColor2.y) ? 1. : 0.;\n\
			v4fResult.z = (v4fColor1.z == v4fColor2.z) ? 1. : 0.;\n\
			v4fResult.w = (v4fColor1.w == v4fColor2.w) ? 1. : 0.;\n\
			\n\
			gl_PointSize = 1.;\n\
			gl_Position = vec4(v2fResultPosition * 2. - 1., 0. ,1.);\n\
		}\n\
		";

	var sFragmentShader: string = 
	   "#ifdef GL_ES                        				\n\
	   		precision highp float;\n\
	   	#endif\n\
	   	\n\
	   	varying vec4 v4fResult;\n\
	   	\n\
	   	void main(void){\n\
	   		gl_FragColor = v4fResult;\n\
	   	}\n\
	   ";

	var pVertexShader = pContext.createShader(pContext.VERTEX_SHADER);

	pContext.shaderSource(pVertexShader, sVertexShader);
    pContext.compileShader(pVertexShader);

    if(!pContext.getShaderParameter(pVertexShader, pContext.COMPILE_STATUS)){
    	alert(pContext.getShaderInfoLog(pVertexShader));
    	CRITICAL("can not compile vertex shader");
    }

	var pFragmentShader = pContext.createShader(pContext.FRAGMENT_SHADER);

	pContext.shaderSource(pFragmentShader, sFragmentShader);
    pContext.compileShader(pFragmentShader);

    if(!pContext.getShaderParameter(pFragmentShader, pContext.COMPILE_STATUS)){
    	alert(pContext.getShaderInfoLog(pFragmentShader));
    	CRITICAL("can not compile fragment shader");
    }


    var pPerPixelTextureComparison: any = pContext.createProgram();

    pContext.attachShader(pPerPixelTextureComparison, pVertexShader);
    pContext.attachShader(pPerPixelTextureComparison, pFragmentShader);
    pContext.linkProgram(pPerPixelTextureComparison);

    if (!pContext.getProgramParameter(pPerPixelTextureComparison, pContext.LINK_STATUS)) {
        CRITICAL("Could not initialise shaders");
    }

    pContext.useProgram(pPerPixelTextureComparison);

    pPerPixelTextureComparison.position = pContext.getAttribLocation(pPerPixelTextureComparison, "position");
    pContext.enableVertexAttribArray(pPerPixelTextureComparison.position);

    pPerPixelTextureComparison.texture1 = pContext.getUniformLocation(pPerPixelTextureComparison, "texture1");
    pPerPixelTextureComparison.texture2 = pContext.getUniformLocation(pPerPixelTextureComparison, "texture2");

    pPerPixelTextureComparison.textureSize1 = pContext.getUniformLocation(pPerPixelTextureComparison, "textureSize1");
    pPerPixelTextureComparison.textureSize2 = pContext.getUniformLocation(pPerPixelTextureComparison, "textureSize2");
    pPerPixelTextureComparison.resultTextureSize = pContext.getUniformLocation(pPerPixelTextureComparison, "resultTextureSize");

	test("resize videobuffers with backup copy",() => {

        var pVideoBuffer1: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer1.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pVideoBuffer2: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer2.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElementInterface = VE_FLOAT4("POSITION");
		var pVE: IVertexElementInterface = VE_FLOAT2("NORMAL");

		pDecl.append(pVE);

		var pData1: IVertexData = pVideoBuffer1.getEmptyVertexData(50,pDecl);
		var pData2: IVertexData = pVideoBuffer2.getEmptyVertexData(50,pDecl);

		var pArray1: Float32Array = new Float32Array(200);
		var pArray2: Float32Array = new Float32Array(100);

		for(var i:int = 0; i< 50 ;i++){
			pArray1[4*i+0] = math.random()*20 - 10.;
			pArray1[4*i+1] = math.random()*20 - 10.;
			pArray1[4*i+2] = math.random()*20 - 10.;
			pArray1[4*i+3] = math.random()*20 - 10.;

			pArray2[2*i+0] = math.random()*20 - 10.;
			pArray2[2*i+1] = math.random()*20 - 10.;
		}

		pData1.setData(pArray1, 'POSITION');
		pData1.setData(pArray2, 'NORMAL');

		pData2.setData(pArray1, 'POSITION');
		pData2.setData(pArray2, 'NORMAL');

		shouldBeTrue("try resize videobuffer");
		check(pVideoBuffer2.resize(32628));

		var pTexture1: any = (<any>pVideoBuffer1)._pWebGLTexture;
		var pTexture2: any = (<any>pVideoBuffer2)._pWebGLTexture;

		var iMaxIndex: int = math.ceil(50*pDecl.stride/4/4);/*4 - float; 4 - pixel */

		var pIndex = new Float32Array(iMaxIndex);

		for(var i:int = 0; i < iMaxIndex; i++){
			pIndex[i] = i+2; /*texture header*/
		};

		pContext.useProgram(pPerPixelTextureComparison);

		var pDrawBuffer = pContext.createBuffer();
		pContext.bindBuffer(pContext.ARRAY_BUFFER, pDrawBuffer);
		pContext.bufferData(pContext.ARRAY_BUFFER, pIndex, pContext.STATIC_DRAW);

		var pTestTextureSize: uint[] = math.calcPOTtextureSize(iMaxIndex + 2);

		var iTestSizeX: uint = pTestTextureSize[0];
		var iTestSizeY: uint = pTestTextureSize[1];

		pContext.activeTexture(pContext.TEXTURE0);

		var pResultTexture = pContext.createTexture();
		pContext.bindTexture(pContext.TEXTURE_2D, pResultTexture);
		pContext.texImage2D(pContext.TEXTURE_2D, 0, pContext.RGBA,iTestSizeX, iTestSizeY, 0, pContext.RGBA, pContext.UNSIGNED_BYTE, null);
		pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_MAG_FILTER, pContext.LINEAR);
	    pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_MIN_FILTER, pContext.LINEAR);
	    pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_WRAP_S, pContext.CLAMP_TO_EDGE);
	    pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_WRAP_T, pContext.CLAMP_TO_EDGE);

		var pFrameBuffer = pContext.createFramebuffer();
		pContext.bindFramebuffer(pContext.FRAMEBUFFER, pFrameBuffer);
		pContext.framebufferTexture2D(pContext.FRAMEBUFFER, pContext.COLOR_ATTACHMENT0, pContext.TEXTURE_2D, pResultTexture, 0);

		pContext.activeTexture(pContext.TEXTURE0);
		pContext.bindTexture(pContext.TEXTURE_2D, pResultTexture);

		pContext.activeTexture(pContext.TEXTURE1);
		pContext.bindTexture(pContext.TEXTURE_2D, pTexture1);

		pContext.activeTexture(pContext.TEXTURE2);
		pContext.bindTexture(pContext.TEXTURE_2D, pTexture2);

		pContext.enableVertexAttribArray(pPerPixelTextureComparison.position);
		pContext.vertexAttribPointer(pPerPixelTextureComparison.position, 1, pContext.FLOAT, false, 0, 0);

		pContext.uniform1i(pPerPixelTextureComparison.texture1, 1);
		pContext.uniform1i(pPerPixelTextureComparison.texture2, 2);

		pContext.uniform2f(pPerPixelTextureComparison.textureSize1, (<any>pVideoBuffer1)._iWidth, (<any>pVideoBuffer1)._iHeight);
		pContext.uniform2f(pPerPixelTextureComparison.textureSize2, (<any>pVideoBuffer2)._iWidth, (<any>pVideoBuffer2)._iHeight);
		pContext.uniform2f(pPerPixelTextureComparison.resultTextureSize, iTestSizeX, iTestSizeY);

		pContext.viewport(0, 0, iTestSizeX, iTestSizeY);

		pContext.bindFramebuffer(pContext.FRAMEBUFFER, pFrameBuffer);

		pContext.drawArrays(pContext.POINTS,0,iMaxIndex);

		pContext.flush();
		pContext.finish();

		var pPixelsResult: Uint8Array = new Uint8Array(iTestSizeX*iTestSizeY * 4);

		pContext.readPixels(0,0, iTestSizeX, iTestSizeY, pContext.RGBA, pContext.UNSIGNED_BYTE, pPixelsResult);

		pContext.bindFramebuffer(pContext.FRAMEBUFFER, null);

		var iResult: uint = 0;

		for(var i: uint = 2; i<iMaxIndex+2; i++){
			var iIndex = 4*i;

			iResult += (pPixelsResult[iIndex + 0] != 0) ? 1 : 0;
			iResult += (pPixelsResult[iIndex + 1] != 0) ? 1 : 0;
			iResult += (pPixelsResult[iIndex + 2] != 0) ? 1 : 0;
			iResult += (pPixelsResult[iIndex + 3] != 0) ? 1 : 0;
		}

		shouldBe("test data in texture after resize", 4*iMaxIndex);
		check(iResult);
		
	});

	test("resize videobuffers without backup copy",() => {

        var pVideoBuffer1: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer1.create(0, <uint>EHardwareBufferFlags.BACKUP_COPY);	

		var pVideoBuffer2: IVertexBuffer = pResourcePool.createVideoBuffer('test-video-buffer' + <string>sid());
		pVideoBuffer2.create(0, <uint>EHardwareBufferFlags.STATIC);	

		var pDecl: IVertexDeclaration = new data.VertexDeclaration();

		var pVE: IVertexElementInterface = VE_FLOAT4("POSITION");
		var pVE: IVertexElementInterface = VE_FLOAT2("NORMAL");

		pDecl.append(pVE);

		var pData1: IVertexData = pVideoBuffer1.getEmptyVertexData(50,pDecl);
		var pData2: IVertexData = pVideoBuffer2.getEmptyVertexData(50,pDecl);

		var pArray1: Float32Array = new Float32Array(200);
		var pArray2: Float32Array = new Float32Array(100);

		for(var i:int = 0; i< 50 ;i++){
			pArray1[4*i+0] = math.random()*20 - 10.;
			pArray1[4*i+1] = math.random()*20 - 10.;
			pArray1[4*i+2] = math.random()*20 - 10.;
			pArray1[4*i+3] = math.random()*20 - 10.;

			pArray2[2*i+0] = math.random()*20 - 10.;
			pArray2[2*i+1] = math.random()*20 - 10.;
		}

		pData1.setData(pArray1, 'POSITION');
		pData1.setData(pArray2, 'NORMAL');

		pData2.setData(pArray1, 'POSITION');
		pData2.setData(pArray2, 'NORMAL');

		shouldBeTrue("try resize videobuffer");
		check(pVideoBuffer2.resize(32628));

		var pTexture1: any = (<any>pVideoBuffer1)._pWebGLTexture;
		var pTexture2: any = (<any>pVideoBuffer2)._pWebGLTexture;

		var iMaxIndex: int = math.ceil(50*pDecl.stride/4/4);/*4 - float; 4 - pixel */

		var pIndex = new Float32Array(iMaxIndex);

		for(var i:int = 0; i < iMaxIndex; i++){
			pIndex[i] = i+2; /*texture header*/
		};

		pContext.useProgram(pPerPixelTextureComparison);

		var pDrawBuffer = pContext.createBuffer();
		pContext.bindBuffer(pContext.ARRAY_BUFFER, pDrawBuffer);
		pContext.bufferData(pContext.ARRAY_BUFFER, pIndex, pContext.STATIC_DRAW);

		var pTestTextureSize: uint[] = math.calcPOTtextureSize(iMaxIndex + 2);

		var iTestSizeX: uint = pTestTextureSize[0];
		var iTestSizeY: uint = pTestTextureSize[1];

		pContext.activeTexture(pContext.TEXTURE0);

		var pResultTexture = pContext.createTexture();
		pContext.bindTexture(pContext.TEXTURE_2D, pResultTexture);
		pContext.texImage2D(pContext.TEXTURE_2D, 0, pContext.RGBA,iTestSizeX, iTestSizeY, 0, pContext.RGBA, pContext.UNSIGNED_BYTE, null);
		pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_MAG_FILTER, pContext.LINEAR);
	    pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_MIN_FILTER, pContext.LINEAR);
	    pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_WRAP_S, pContext.CLAMP_TO_EDGE);
	    pContext.texParameterf(pContext.TEXTURE_2D, pContext.TEXTURE_WRAP_T, pContext.CLAMP_TO_EDGE);

		var pFrameBuffer = pContext.createFramebuffer();
		pContext.bindFramebuffer(pContext.FRAMEBUFFER, pFrameBuffer);
		pContext.framebufferTexture2D(pContext.FRAMEBUFFER, pContext.COLOR_ATTACHMENT0, pContext.TEXTURE_2D, pResultTexture, 0);

		pContext.activeTexture(pContext.TEXTURE0);
		pContext.bindTexture(pContext.TEXTURE_2D, pResultTexture);

		pContext.activeTexture(pContext.TEXTURE1);
		pContext.bindTexture(pContext.TEXTURE_2D, pTexture1);

		pContext.activeTexture(pContext.TEXTURE2);
		pContext.bindTexture(pContext.TEXTURE_2D, pTexture2);

		pContext.enableVertexAttribArray(pPerPixelTextureComparison.position);
		pContext.vertexAttribPointer(pPerPixelTextureComparison.position, 1, pContext.FLOAT, false, 0, 0);

		pContext.uniform1i(pPerPixelTextureComparison.texture1, 1);
		pContext.uniform1i(pPerPixelTextureComparison.texture2, 2);

		pContext.uniform2f(pPerPixelTextureComparison.textureSize1, (<any>pVideoBuffer1)._iWidth, (<any>pVideoBuffer1)._iHeight);
		pContext.uniform2f(pPerPixelTextureComparison.textureSize2, (<any>pVideoBuffer2)._iWidth, (<any>pVideoBuffer2)._iHeight);
		pContext.uniform2f(pPerPixelTextureComparison.resultTextureSize, iTestSizeX, iTestSizeY);

		pContext.viewport(0, 0, iTestSizeX, iTestSizeY);

		pContext.bindFramebuffer(pContext.FRAMEBUFFER, pFrameBuffer);

		pContext.drawArrays(pContext.POINTS,0,iMaxIndex);

		pContext.flush();
		pContext.finish();

		var pPixelsResult: Uint8Array = new Uint8Array(iTestSizeX*iTestSizeY * 4);

		pContext.readPixels(0,0, iTestSizeX, iTestSizeY, pContext.RGBA, pContext.UNSIGNED_BYTE, pPixelsResult);

		pContext.bindFramebuffer(pContext.FRAMEBUFFER, null);

		var iResult: uint = 0;

		for(var i: uint = 2; i<iMaxIndex+2; i++){
			var iIndex = 4*i;

			iResult += (pPixelsResult[iIndex + 0] != 0) ? 1 : 0;
			iResult += (pPixelsResult[iIndex + 1] != 0) ? 1 : 0;
			iResult += (pPixelsResult[iIndex + 2] != 0) ? 1 : 0;
			iResult += (pPixelsResult[iIndex + 3] != 0) ? 1 : 0;
		}

		shouldBe("test data in texture after resize", 4*iMaxIndex);
		check(iResult);
		
	});
}
