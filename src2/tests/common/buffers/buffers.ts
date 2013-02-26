#include "util/testutils.ts"
#include "akra.ts"

module akra {
	var pEngine: IEngine = createEngine();
	var pResourcePool: IResourcePoolManager = pEngine.getResourceManager();

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

		console.log(pDecl);
		console.log(pDecl.toString());

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

		console.log(pDecl);
		console.log(pDecl.toString());

		var pData: IVertexData = pVideoBuffer.getEmptyVertexData(2,pDecl);

		var pArray: Float32Array = new Float32Array([1,2,3,4,5,6]);

		shouldBeTrue("write data to POSITION");
		check(pData.setData(pArray, "POSITION"));

		shouldBeArray("check data POSITION",pArray);
		check(pData.getTypedData("POSITION"));

	});
}
