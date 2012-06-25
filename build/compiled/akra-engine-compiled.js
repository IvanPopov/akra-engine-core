;
var a= {fx:  {}, util:  {}};
a.extend = function(pChild) {
var fnGet, fnSet, i, sKey;
var pParent=arguments[1];
var argv=arguments;
pChild.prototype = Object.create(pParent.prototype);
pChild.prototype.constructor = pChild;
pChild.superclass = pParent.prototype;
for (i = 2; i < (argv.length); ++i) {
for (sKey in argv[i].prototype) {
if (sKey === "constructor") {
continue ;

}

fnGet = argv[i].prototype.__lookupGetter__(sKey);
fnSet = argv[i].prototype.__lookupSetter__(sKey);
if ((!fnGet) && (!fnSet)) {
pChild.prototype[sKey] = argv[i].prototype[sKey];
continue ;

}

if (fnGet) {
a.defineProperty(pChild, sKey, fnGet);

}

if (fnSet) {
a.defineProperty(pChild, sKey, null, fnSet);

}


}


}

pChild.superclasses =  {};
for (var i=1; i < (argv.length); ++i) {
pChild.superclasses[arguments[i].toString().match(/function\s*(\w+)/)[1]] = arguments[i].prototype;

}

pChild.ctor = function() {
for (var i=1; i < (argv.length); ++i) {
argv[i].apply(this, arguments);

}


};

};
a.clone = function(pObject) {
if ((pObject == null) || ((typeof obj) != "object")) {
return pObject;

}

var tmp=pObject.constructor();
for (var i in pObject) {
tmp[i] = a.clone(pObject[i]);

}

return tmp;

};
a.getClass = function(pObj) {
if ((((pObj && ((typeof pObj) === "object")) && ((Object.prototype.toString.call(pObj)) !== "[object Array]")) && (pObj.constructor)) && (pObj != (this.window))) {
var arr=pObj.constructor.toString().match(/function\s*(\w+)/);
if (arr && ((arr.length) == 2)) {
return arr[1];

}


}

return false;

};
function parseJSON(sJSON) {
return eval(("(" + sJSON) + ")");

}

;
a.parseJSON = parseJSON;
function toDOM(sHTML, useDocFragment) {
useDocFragment = (useDocFragment === undefined? true : useDocFragment);
var pDivEl=document.createElement("div");
var pDocFrag=document.createDocumentFragment();
pDivEl.innerHTML = sHTML;
if (!useDocFragment) {
return pDivEl.childNodes;

}

for (var i=0, len=pDivEl.childNodes.length; i < len; ++i) {
if ((typeof (pDivEl.childNodes[i])) === "undefined") {
continue ;

}

pDocFrag.appendChild(pDivEl.childNodes[i]);

}

return pDocFrag;

}

;
a.toDOM = toDOM;
function sid() {
return ++sid.iValue;

}

sid.iValue = 0;
a.sid = sid;
function buf2str(pBuf) {
var s="";
for (var n=0; n < (pBuf.length); ++n) {
var c=String.fromCharCode(pBuf[n]);
s += c;

}

return s;

}

a.buf2str = buf2str;
function str2buf(s) {
var arr=new Array(len);
for (var i=0, len=s.length; i < len; ++i) {
arr[i] = s.charCodeAt(i);

}

return new Uint8Array(arr).buffer;

}

a.str2buf = str2buf;
ArrayBuffer.prototype.toTypedArray = function(eType) {
switch(eType) {
case 5126:
return new Float32Array(this);

case 5122:
return new Int16Array(this);

case 5123:
return new Uint16Array(this);

case 5124:
return new Int32Array(this);

case 5125:
return new Uint32Array(this);

case 5120:
return new Int8Array(this);

default:
;

case 5121:
return new Uint8Array(this);
}
return null;

};
console.log("/akra-engine-core/src/");
Number.prototype.printBinary = function(isPretty) {
var res="";
for (i = 0; i < 32; ++i) {
if ((i && ((i % 4) == 0)) && isPretty) {
res = " " + res;

}

(((this) >> i) & 1? res = "1" + res : res = "0" + res);

}

return res;

};
a.defineProperty = function(pObj, sProperty, fnGetter, fnSetter) {
if ((!fnGetter) && (!fnSetter))return ;

fnGetter = fnGetter || (pObj.prototype.__lookupGetter__(sProperty));
fnSetter = fnSetter || (pObj.prototype.__lookupSetter__(sProperty));
Object.defineProperty(pObj.prototype, sProperty,  {get: fnGetter, set: fnSetter, enumerable: true, configurable: true});

};
window["GEN_ARRAY"] = function(pType, nSize) {
var tmp=new Array(nSize);
for (var _i=0; _i < nSize; ++_i) {
tmp[_i] = (pType? new pType() : null);

}

return tmp;

};
function getTypeSize(eType) {
switch(eType) {
case 5120:
;

case 5121:
return 1;

case 5122:
;

case 5123:
;

case 32819:
;

case 32820:
;

case 33635:
return 2;

case 5124:
;

case 5125:
;

case 5126:
return 4;

default:
return undefined;
}

}

a.getTypeSize = getTypeSize;
function getIFormatNumElements(eFormat) {
switch(eFormat) {
case 6407:
;

case 32864:
;

case 32855:
;

case 32856:
;

case 36194:
;

case 36195:
;

case 33776:
return 3;

case 6408:
;

case 6409:
;

case 32854:
;

case 32857:
;

case 33777:
;

case 33780:
;

case 33778:
;

case 33781:
;

case 33779:
return 4;

default:
if (!0) {
var err=((((((("Error:: " + "unknown image format") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("unknown image format");

}


}

;
}

}

a.getIFormatNumElements = getIFormatNumElements;
function ParameterDesc() {
this.sName = null;
this.sSemantics = null;
this.eClass = 0;
this.eType = 0;
this.iRows = 0;
this.iColumns = 0;
this.iElements = 0;
this.iStructMembers = 0;

}

ParameterDesc.prototype.dump = function(pWriter) {
pWriter = pWriter || (new a.BinWriter());
pWriter.string(this.sName);
pWriter.string(this.sSemantic);
pWriter.int32(this.eClass);
pWriter.int32(this.eType);
pWriter.int32(this.iRows);
pWriter.int32(this.iColumns);
pWriter.int32(this.iElements);
pWriter.int32(this.iStructMembers);
return pWriter;

};
ParameterDesc.prototype.undump = function(pReader) {
this.sName = pReader.string();
this.sSemantic = pReader.string();
this.eClass = pReader.int32();
this.eType = pReader.int32();
this.iRows = pReader.int32();
this.iColumns = pReader.int32();
this.iElements = pReader.int32();
this.iStructMembers = pReader.int32();
return this;

};
a.ParameterDesc = ParameterDesc;
function calcPOTtextureSize(n, iElements) {
var w, h;
iElements = iElements || 4;
n /= iElements;
w = Math.ceil(((Math.log(n)) / (Math.LN2)) / 2);
h = Math.ceil((Math.log(n / (Math.pow(2, w)))) / (Math.LN2));
w = Math.pow(2, w);
h = Math.pow(2, h);
n = (w * h) * iElements;
return [w, h, n];

}

a.calcPOTtextureSize = calcPOTtextureSize;
function computeNormalMap(pDevice, pImage, pNormalTable, iChannel, fAmplitude) {
var vertexShaderSrc=(((((("" + "/*vertex shader*/") + "attribute vec2 position;") + "varying vec2 texturePosition;") + "void main(void){") + "texturePosition = (position + vec2(1.,1.))/2.;") + "gl_Position = vec4(position,0.,1.);") + "}";
var fragmentShaderSrc=(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((("" + "/*fragment shader*/\n") + "#ifdef GL_ES\n") + "precision highp float;\n") + "#endif\n") + "uniform vec2 steps; /*iverse texture size*/") + "uniform float booster; /*height boost*/") + "uniform sampler2D texture;") + "uniform float fChannel;") + "varying vec2 texturePosition;") + "void main(void){") + "/*generation normals;*/") + "float fHeight0,fHeight1,fHeight2,fHeight3,fHeight4,fHeight5,fHeight6,") + "fHeight7,fHeight8;") + "if(fChannel == 0.){") + "fHeight0 = (texture2D(texture,texturePosition)).r;") + "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).r;") + "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).r;") + "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).r;") + "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).r;") + "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).r;") + "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).r;") + "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).r;") + "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).r;") + "}") + "else if(fChannel == 1.){") + "fHeight0 = (texture2D(texture,texturePosition)).g;") + "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).g;") + "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).g;") + "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).g;") + "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).g;") + "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).g;") + "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).g;") + "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).g;") + "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).g;") + "}") + "else if(fChannel == 2.){") + "fHeight0 = (texture2D(texture,texturePosition)).b;") + "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).b;") + "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).b;") + "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).b;") + "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).b;") + "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).b;") + "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).b;") + "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).b;") + "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).b;") + "}") + "else{") + "fHeight0 = (texture2D(texture,texturePosition)).a;") + "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).a;") + "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).a;") + "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).a;") + "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).a;") + "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).a;") + "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).a;") + "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).a;") + "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).a;") + "}") + "vec3 dir1 = vec3(steps.x, 0., (fHeight1 - fHeight0)*booster);") + "vec3 dir2 = vec3(steps.x, steps.y, (fHeight2 - fHeight0)*booster);") + "vec3 dir3 = vec3(0., steps.y, (fHeight3 - fHeight0)*booster);") + "vec3 dir4 = vec3(-steps.x, steps.y, (fHeight4 - fHeight0)*booster);") + "vec3 dir5 = vec3(-steps.x, 0., (fHeight5 - fHeight0)*booster);") + "vec3 dir6 = vec3(-steps.x, -steps.y, (fHeight6 - fHeight0)*booster);") + "vec3 dir7 = vec3(0., -steps.y, (fHeight7 - fHeight0)*booster);") + "vec3 dir8 = vec3(steps.x, -steps.y, (fHeight8 - fHeight0)*booster);") + "vec3 normal1 = cross(dir1,dir2);") + "vec3 normal2 = cross(dir2,dir3);") + "vec3 normal3 = cross(dir3,dir4);") + "vec3 normal4 = cross(dir4,dir5);") + "vec3 normal5 = cross(dir5,dir6);") + "vec3 normal6 = cross(dir6,dir7);") + "vec3 normal7 = cross(dir7,dir8);") + "vec3 normal8 = cross(dir8,dir1);") + "vec3 normal = normalize(normal1 + normal2 + normal3 + normal4") + "+ normal5 + normal6 + normal7 + normal8);") + "gl_FragColor = vec4(normal/2. + vec3(0.5),1.);") + "}";
var progCalculateNormalMap=null;
if (!(pDevice.computeNormalMapFromHeightMap)) {
var vertexShader=pDevice.createShader(pDevice.VERTEX_SHADER);
pDevice.shaderSource(vertexShader, vertexShaderSrc);
pDevice.compileShader(vertexShader);
var fragmentShader=pDevice.createShader(pDevice.FRAGMENT_SHADER);
pDevice.shaderSource(fragmentShader, fragmentShaderSrc);
pDevice.compileShader(fragmentShader);
progCalculateNormalMap = pDevice.createProgram();
pDevice.attachShader(progCalculateNormalMap, vertexShader);
pDevice.attachShader(progCalculateNormalMap, fragmentShader);
pDevice.linkProgram(progCalculateNormalMap);
pDevice.computeNormalMapFromHeightMap = progCalculateNormalMap;

}
else  {
progCalculateNormalMap = pDevice.computeNormalMapFromHeightMap;

}

pDevice.useProgram(progCalculateNormalMap);
progCalculateNormalMap.position = pDevice.getAttribLocation(progCalculateNormalMap, "position");
pDevice.enableVertexAttribArray(progCalculateNormalMap.position);
progCalculateNormalMap.steps = pDevice.getUniformLocation(progCalculateNormalMap, "steps");
progCalculateNormalMap.booster = pDevice.getUniformLocation(progCalculateNormalMap, "booster");
progCalculateNormalMap.texture = pDevice.getUniformLocation(progCalculateNormalMap, "texture");
progCalculateNormalMap.fChannel = pDevice.getUniformLocation(progCalculateNormalMap, "fChannel");
if (!(pDevice.getProgramParameter(progCalculateNormalMap, pDevice.LINK_STATUS))) {
alert("Could not initialise create normal map shaders");
return ;

}

var index=pDevice.createBuffer();
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, index);
pDevice.bufferData(pDevice.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), pDevice.STREAM_DRAW);
var heightTexture=pDevice.createTexture();
pDevice.activeTexture(pDevice.TEXTURE0);
pDevice.bindTexture(pDevice.TEXTURE_2D, heightTexture);
pImage.convert(6408);
pDevice.texImage2D(3553, 0, 6408, pImage.getWidth(), pImage.getHeight(), 0, pImage.getFormatShort(), pImage.getType(), new Uint8Array(pImage.getData(0)));
pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_S, pDevice.CLAMP_TO_EDGE);
pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_T, pDevice.CLAMP_TO_EDGE);
pDevice.generateMipmap(pDevice.TEXTURE_2D);
var normalTexture=pDevice.createTexture();
pDevice.activeTexture(pDevice.TEXTURE1);
pDevice.bindTexture(pDevice.TEXTURE_2D, normalTexture);
pDevice.pixelStorei(pDevice.UNPACK_ALIGNMENT, 1);
pDevice.texImage2D(pDevice.TEXTURE_2D, 0, pDevice.RGB, pImage.getWidth(), pImage.getHeight(), 0, pDevice.RGB, pDevice.UNSIGNED_BYTE, null);
var normalTextureFrameBuffer=pDevice.createFramebuffer();
pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, normalTextureFrameBuffer);
pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0, pDevice.TEXTURE_2D, normalTexture, 0);
pDevice.uniform2f(progCalculateNormalMap.steps, 1 / (pImage.getWidth()), 1 / (pImage.getHeight()));
pDevice.uniform1f(progCalculateNormalMap.booster, fAmplitude / 255);
pDevice.uniform1f(progCalculateNormalMap.fChannel, iChannel);
pDevice.uniform1i(progCalculateNormalMap.texture, 0);
pDevice.vertexAttribPointer(progCalculateNormalMap.position, 2, pDevice.FLOAT, false, 0, 0);
pDevice.viewport(0, 0, pImage.getWidth(), pImage.getHeight());
pDevice.drawArrays(pDevice.TRIANGLE_STRIP, 0, 4);
pDevice.flush();
var pTemp=new Uint8Array((4 * (pImage.getWidth())) * (pImage.getHeight()));
pDevice.readPixels(0, 0, pImage.getWidth(), pImage.getHeight(), pDevice.RGBA, pDevice.UNSIGNED_BYTE, pTemp);
for (var i=0; i < ((pImage.getWidth()) * (pImage.getHeight())); i++) {
pNormalTable[i][0] = pTemp[4 * i];
pNormalTable[i][1] = pTemp[(4 * i) + 1];
pNormalTable[i][2] = pTemp[(4 * i) + 2];

}

pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);
pDevice.deleteBuffer(index);
pDevice.deleteFramebuffer(normalTextureFrameBuffer);
pDevice.deleteTexture(heightTexture);
pDevice.activeTexture(pDevice.TEXTURE0);
pDevice.bindTexture(pDevice.TEXTURE_2D, null);
pDevice.deleteTexture(normalTexture);
pDevice.activeTexture(pDevice.TEXTURE1);
pDevice.bindTexture(pDevice.TEXTURE_2D, null);

}

;
a.computeNormalMap = computeNormalMap;
function createSingleStripGrid(iXVerts, iYVerts, iXStep, iYStep, iSride, iFlags) {
var iTotalStrips=iYVerts - 1;
var iTotalIndexesPerStrip=iXVerts << 1;
var iTotalIndexes=((iTotalStrips * iTotalIndexesPerStrip) + (iTotalStrips << 1)) - 2;
var pIndexValues=new Array(iTotalIndexes);
var iIndex=0;
var iStartVert=0;
var iLineStep=iYStep * iSride;
for (j = 0; j < iTotalStrips; ++j) {
var k=0;
var iVert=iStartVert;
for (k = 0; k < iXVerts; ++k) {
pIndexValues[iIndex++] = iVert;
pIndexValues[iIndex++] = iVert + iLineStep;
iVert += iXStep;

}

iStartVert += iLineStep;
if ((j + 1) < iTotalStrips) {
pIndexValues[iIndex++] = (iVert - iXStep) + iLineStep;
pIndexValues[iIndex++] = iStartVert;

}


}

return pIndexValues;

}

a.createSingleStripGrid = createSingleStripGrid;
if (!(window.requestAnimationFrame)) {
window.requestAnimationFrame = (function() {
return ((((window.webkitRequestAnimationFrame) || (window.mozRequestAnimationFrame)) || (window.oRequestAnimationFrame)) || (window.msRequestAnimationFrame)) || (function(callback, element) {
window.setTimeout(callback, 1000 / 60);

}
);

}
)();

}

a.requestAnimFrame = window.requestAnimationFrame;
a.cancelRequestAnimFrame = (function() {
return (((((window.cancelCancelRequestAnimationFrame) || (window.webkitCancelRequestAnimationFrame)) || (window.mozCancelRequestAnimationFrame)) || (window.oCancelRequestAnimationFrame)) || (window.msCancelRequestAnimationFrame)) || (window.clearTimeout);

}
)();
a.checkTextureRequirements = function(pContext, iWidth, iHeigth, iMipLevels, eUsage, eFormat, ePool) {
return true;

};
a.checkCubeTextureRequirements = function(pContext, iWidth, iHeigth, iMipLevels, eUsage, eFormat, ePool) {
return true;

};
a.createTextureFromFile = function(pContext, sFilename, iWidth, iHeight, fnCallBack) {
var c=pContext;
var tex=c.createTexture();
tex.image = new Image();
tex.image.onload = function() {
c.bindTexture(c.TEXTURE_2D, tex);
c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, true);
c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, tex.image);
c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
c.bindTexture(c.TEXTURE_2D, null);
if (fnCallBack) {
fnCallBack();

}


};
tex.image.src = sFilename;
return tex;

};
a.createTexture = function(pContext, iWidth, iHeight, fCallBack, pTexture) {
var c=pContext;
pTexture._pTexture = c.createTexture();
tex = pTexture._pTexture;
tex.image = new Image(iWidth, iHeight);
tex.image.onload = function() {
c.bindTexture(c.TEXTURE_2D, tex);
c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, true);
c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, tex.image);
c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
c.bindTexture(c.TEXTURE_2D, null);

};
if (fCallBack) {
fCallBack();

}

return tex;

};
a.createDevice = function(pCanvas) {
var pContext;
try {
pContext = (pCanvas.getContext("webgl")) || (pCanvas.getContext("experimental-webgl"));
if (WebGLDebugUtils) {
pContext = WebGLDebugUtils.makeDebugContext(pContext);

}


}
catch(e) {

}
if (!pContext) {
if (!0) {
var err=((((((("Error:: " + "Your browser does not support WebGL") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Your browser does not support WebGL");

}


}

;
return null;

}
else  {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + " WebGL successfully initialized.");

}

a.initDevice(pContext);
return pContext;

};
a.deleteDevice = function(pDevice) {
delete pDevice;

};
a.initDevice = function(pDevice) {
pDevice._eSrcBlend = 1;
pDevice._eDstBlend = 0;
pDevice.setRenderState = function(type, value) {
switch(type) {
case 19:
this._eSrcBlend = value;
this.blendFunc(this._eSrcBlend, this._eDstBlend);
break ;

case 20:
this._eDstBlend = value;
this.blendFunc(this._eSrcBlend, this._eDstBlend);
break ;

case 22:
break ;

case 26:
if (value) {
this.enable(this.DITHER);

}
else  {
this.disable(this.DITHER);

}

break ;

case 7:
if (value) {
this.enable(this.DEPTH_TEST);

}
else  {
this.disable(this.DEPTH_TEST);

}

break ;

case 14:
this.depthMask(value);
break ;

case 23:
var sTmp;
switch(value) {
case 1:
sTmp = this.NEVER;
break ;

case 2:
sTmp = this.LESS;
break ;

case 3:
sTmp = this.EQUAL;
break ;

case 5:
sTmp = this.GREATER;
break ;

case 6:
sTmp = this.NOTEQUAL;
break ;

case 7:
sTmp = this.GEQUAL;
break ;

case 8:
sTmp = this.ALWAYS;
break ;

default:
sTmp = this.LEQUAL;
break ;
}
this.depthFunc(sTmp);
break ;

default:
break ;
}
return ;

};
var pExtentions=[2, 0];
var pExtentionsList= {};
for (var i=0, pExt; i < (pExtentions.length); ++i) {
if (pExt = a.info.graphics.getExtention(pDevice, pExtentions[i])) {
pExtentionsList[pExtentions[i]] = pExt;
for (var j in pExt) {
if ((typeof (pExt[j])) == "function") {
pDevice[j] = function() {
pDevice[j] = new Function((((("var tmp = this.pExtentionsList[" + (pExtentions[i])) + "];") + "tmp.") + j) + ".apply(tmp, arguments);");

};

}
else  {
pDevice[j] = pExtentionsList[pExtentions[i]][j];

}


}


}


}

pDevice.pExtentionsList = pExtentionsList;

};
a.UtilTimer = function(eCommand) {
if ((a.UtilTimer._isTimerInitialized) == false) {
a.UtilTimer._isTimerInitialized = true;
a.UtilTimer._fTicksPerSec = 1000;

}

var fTime=0;
var fElapsedTime=0;
var iTime;
if ((((a.UtilTimer._iStopTime) != 0) && (eCommand != (1))) && (eCommand != (4))) {
iTime = a.UtilTimer._iStopTime;

}
else  {
iTime = new Date().getTime();

}

if (eCommand == (6)) {
fElapsedTime = (iTime - (a.UtilTimer._iLastElapsedTime)) / (a.UtilTimer._fTicksPerSec);
a.UtilTimer._iLastElapsedTime = iTime;
return fElapsedTime;

}

if (eCommand == (5)) {
var fAppTime=(iTime - (a.UtilTimer._iBaseTime)) / (a.UtilTimer._fTicksPerSec);
return fAppTime;

}

if (eCommand == (0)) {
a.UtilTimer._iBaseTime = iTime;
a.UtilTimer._iLastElapsedTime = iTime;
a.UtilTimer._iStopTime = 0;
a.UtilTimer._isTimerStopped = false;
return 0;

}

if (eCommand == (1)) {
if (a.UtilTimer._isTimerStopped) {
a.UtilTimer._iBaseTime += iTime - (a.UtilTimer._iStopTime);

}

a.UtilTimer._iStopTime = 0;
a.UtilTimer._iLastElapsedTime = iTime;
a.UtilTimer._isTimerStopped = false;
return 0;

}

if (eCommand == (2)) {
if (!(a.UtilTimer._isTimerStopped)) {
a.UtilTimer._iStopTime = iTime;
a.UtilTimer._iLastElapsedTime = iTime;
a.UtilTimer._isTimerStopped = true;

}

return 0;

}

if (eCommand == (3)) {
a.UtilTimer._iStopTime += (a.UtilTimer._fTicksPerSec) / 10;
return 0;

}

if (eCommand == (4)) {
fTime = iTime / (a.UtilTimer._fTicksPerSec);
return fTime;

}

return -1;

};
a.UtilTimer._isTimerInitialized = false;
a.UtilTimer._isTimerStopped = true;
a.UtilTimer._fTicksPerSec = 0;
a.UtilTimer._iStopTime = 0;
a.UtilTimer._iLastElapsedTime = 0;
a.UtilTimer._iBaseTime = 0;
function Keymap(pElement) {
this.pMap = new Array(256);
this.isAlt = false;
this.isCtrl = false;
this.isShift = false;
this.isMouseDown = false;
this.v2iMousePos = new Int16Array(2);
this.v2iMouseLastPos = new Int16Array(2);
var me=this;
var fnCallback=function(e) {
me.dispatch(e);

};
if (pElement.addEventListener) {
pElement.addEventListener("keydown", fnCallback, false);
pElement.addEventListener("keyup", fnCallback, false);
pElement.addEventListener("mousemove", fnCallback, true);
pElement.addEventListener("mouseup", fnCallback, true);
pElement.addEventListener("mousedown", fnCallback, true);

}
else if (pElement.attachEvent) {
pElement.attachEvent("onkeydown", fnCallback);
pElement.attachEvent("onkeyup", fnCallback);
pElement.attachEvent("onmousemove", fnCallback);
pElement.attachEvent("onmouseup", fnCallback);
pElement.attachEvent("onmousedown", fnCallback);

}
else  {
pElement.onkeydown = pElement.onkeyup = fnCallback;
pElement.onmousemove = pElement.onmouseup = pElement.onmousedown = fnCallback;

}



}

Keymap.prototype.dispatch = function(pEvent) {
var e=pEvent || (window.event);
var code=e.keyCode;
if ((e.type) == "keydown") {
this.pMap[code] = true;
if (e.altKey) {
this.isAlt = true;

}

if (e.ctrlKey) {
this.isCtrl = true;

}

if (e.shiftKey) {
this.isShift = true;

}

if (((e.altKey) || (e.ctrlKey)) || (e.shiftKey)) {
this.pMap.splice(0);

}


}
else if ((e.type) == "keyup") {
this.pMap[code] = false;
if (e.altKey) {
this.isAlt = false;

}

if (e.ctrlKey) {
this.isCtrl = false;

}

if (e.shiftKey) {
this.isShift = false;

}


}


if ((e.type) == "mousemove") {
this.v2iMousePos[0] = e.pageX;
this.v2iMousePos[1] = e.pageY;

}
else if ((e.type) == "mouseup") {
this.isMouseDown = false;

}
else if ((e.type) == "mousedown") {
this.isMouseDown = true;

}




};
Keymap.prototype.isKeyPress = function(iCode) {
return this.pMap[iCode];

};
Keymap.prototype.mouseSnapshot = function() {
this.v2iMouseLastPos[0] = this.v2iMousePos[0];
this.v2iMouseLastPos[1] = this.v2iMousePos[1];
return this.v2iMousePos;

};
Keymap.prototype.isMouseMoved = function() {
return ((this.v2iMouseLastPos[0]) != (this.v2iMousePos[0])) || ((this.v2iMouseLastPos[1]) != (this.v2iMousePos[1]));

};
Keymap.prototype.mouseShitfX = function() {
return (this.v2iMousePos[0]) - (this.v2iMouseLastPos[0]);

};
Keymap.prototype.mouseShitfY = function() {
return (this.v2iMousePos[1]) - (this.v2iMouseLastPos[1]);

};
Keymap.prototype.isMousePress = function() {
return this.isMouseDown;

};
a.Keymap = Keymap;
function Timer() {
this._iStartTime = 0;
this._iStopTime = 0;
this._iTimeDelta = 0;
this._iElapsedCount = 0;
this._eState = 0;
this._setupTimerFrequency();

}

;
Timer.prototype._iSecondsFrequency = 0;
Timer.prototype._iMillisecondsFrequency = 0;
Timer.prototype._fInvSecFrequency = 0;
Timer.prototype.start = function() {
this._iStartTime = this._samplePerformanceCounter();
this._iElapsedCount = 0;
this._eState = 1;

};
Timer.prototype.stop = function() {
this._iElapsedCount = this.elapsedCount();
this._eState = 0;

};
Timer.prototype.suspend = function() {
if ((this._eState) == (1)) {
this._iElapsedCount = this.elapsedCount();
this._eState = 2;

}


};
Timer.prototype.resume = function() {
if ((this._eState) == (2)) {
this._iStartTime = this._samplePerformanceCounter();
this._iStartTime -= this._iTimeDelta;
this._iElapsedCount = 0;
this._eState = 1;

}


};
Timer.prototype.elapsedTime = function() {
if ((this._eState) != (1)) {
return (this._iElapsedCount) * (this._fInvSecFrequency);

}
else  {
this._iStopTime = this._samplePerformanceCounter();
this._iTimeDelta = (this._iStopTime) - (this._iStartTime);
var fReportedTime=(this._iTimeDelta) * (this._fInvSecFrequency);
return fReportedTime;

}


};
Timer.prototype.elapsedSeconds = function() {
if ((this._eState) != (1)) {
return (this._iElapsedCount) / (this._iSecondsFrequency);

}
else  {
this._iStopTime = this._samplePerformanceCounter();
this._iTimeDelta = (this._iStopTime) - (this._iStartTime);
var iReportedTime=(this._iTimeDelta) / (this._iSecondsFrequency);
return iReportedTime;

}


};
Timer.prototype.elapsedMilliseconds = function() {
if ((this._eState) != (1)) {
return (this._iElapsedCount) / (this._iMillisecondsFrequency);

}
else  {
this._iStopTime = this._samplePerformanceCounter();
this._iTimeDelta = (this._iStopTime) - (this._iStartTime);
var iReportedTime=(this._iTimeDelta) / (this._iMillisecondsFrequency);
return iReportedTime;

}


};
Timer.prototype.elapsedCount = function() {
if ((this._eState) != (1)) {
return this._iElapsedCount;

}
else  {
this._iStopTime = this._samplePerformanceCounter();
this._iTimeDelta = (this._iStopTime) - (this._iStartTime);
var iReportedTime=this._iTimeDelta;
return iReportedTime;

}


};
Timer.prototype._setupTimerFrequency = function() {
if (!(this._iSecondsFrequency)) {
this._iSecondsFrequency = 1000;
this._iMillisecondsFrequency = (this._iSecondsFrequency) / 1000;
this._fInvSecFrequency = 1 / (this._iSecondsFrequency);

}


};
Timer.prototype._samplePerformanceCounter = function() {
return new Date().getTime();

};
a.Timer = Timer;
function ApplicationTimer() {
ApplicationTimer.superclass.constructor.apply(this, arguments);

}

;
a.extend(ApplicationTimer, a.Timer);
ApplicationTimer.prototype.start = function() {
ApplicationTimer.superclass.start.apply(this, arguments);

};
ApplicationTimer.prototype.stop = function() {
ApplicationTimer.superclass.stop.apply(this, arguments);

};
a.ApplicationTimer = ApplicationTimer;
pApplicationTimer = new a.ApplicationTimer();
a.pApplicationTimer = pApplicationTimer;
function CodeTimer(sNameString) {
this._pNextProfile = null;
this._pLastProfile = this._pPreviousTimer;
this._fTotalTime = 0;
this._iTotalCalls = 0;
this._fMaximumTimeSample = 0;
this._fMinimumTimeSample = 3.4e+38;
this._fStartTime = 0;
if (!sNameString) {
var err=((((((("Error:: " + "A name must be provided to the code timer") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("A name must be provided to the code timer");

}


}

;
this._sName = sNameString;
if ((this._pPreviousTimer) != null) {
this._pPreviousTimer._pNextProfile = this;

}

this._pPreviousTimer = this;

}

;
CodeTimer.prototype.pRootTimer = new CodeTimer("_ROOT_");
CodeTimer.prototype._pPreviousTimer = null;
CodeTimer.prototype.averageTime = function() {
if ((this._iTotalCalls) != 0) {
return (this._fTotalTime) / (this._iTotalCalls);

}

return 0;

};
CodeTimer.prototype.totalTime = function() {
return this._fTotalTime;

};
CodeTimer.prototype.totalCalls = function() {
return this._iTotalCalls;

};
CodeTimer.prototype.maximumTimeSample = function() {
return this._fMaximumTimeSample;

};
CodeTimer.prototype.minimumTimeSample = function() {
return this._fMinimumTimeSample;

};
CodeTimer.prototype.name = function() {
return this._sName;

};
CodeTimer.prototype.beginSession = function() {
this._iTotalCalls++;
if ((this._fStartTime) == 0) {
this._fStartTime = a.pApplicationTimer.elapsedTime();

}


};
CodeTimer.prototype.endSession = function() {
if ((this._fStartTime) != 0) {
var fEndTime=a.pApplicationTimer.elapsedTime();
if (!(fEndTime >= (this._fStartTime))) {
var err=((((((("Error:: " + "we moved backwards in time!!!?") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("we moved backwards in time!!!?");

}


}

;
var fSample=fEndTime - (this._fStartTime);
this._fTotalTime += fSample;
this._fMaximumTimeSample = Math.max(this._fMaximumTimeSample, fSample);
this._fMinimumTimeSample = Math.min(this._fMinimumTimeSample, fSample);

}

this._fStartTime = 0;

};
CodeTimer.prototype.reset = function() {
this._fTotalTime = 0;
this._iTotalCalls = 0;
this._fMaximumTimeSample = 0;
this._fMinimumTimeSample = 3.4e+38;
this._fStartTime = 0;

};
CodeTimer.prototype.output = function() {
debug_assert(this._sName, this._fTotalTime, this._iTotalCalls, ((this._iTotalCalls) != 0? (this._fTotalTime) / (this._iTotalCalls) : 0), this._fMinimumTimeSample, this._fMaximumTimeSample);
this.reset();

};
CodeTimer.prototype.outputAllTimers = function(iMessageFlags) {
this.output(iMessageFlags);
if ((this._pNextProfile) != null) {
this._pNextProfile.outputAllTimers(iMessageFlags);

}


};
CodeTimer.prototype.resetAllTimers = function() {
this.reset();
if ((this._pNextProfile) != null) {
this._pNextProfile.resetAllTimers();

}


};
a.CodeTimer = CodeTimer;
function FunctionTimer(pTimer) {
this._pInternalTimerLink = pTimer;
if (!this._pInternalTimerLink) {
var err=((((((("Error:: " + "A timer link must be provided") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("A timer link must be provided");

}


}

;
this._pInternalTimerLink.beginSession();

}

FunctionTimer.prototype.destructor = function() {
this._pInternalTimerLink.endSession();

};
a.FunctionTimer = FunctionTimer;
function lowestBitSet(nValue) {
var temp;
if (nValue == 0) {
return null;

}

for (temp = 0; temp <= 31; temp++) {
if (nValue & (1 << temp)) {
return temp;

}


}

return null;

}

Math.lowestBitSet = lowestBitSet;
function nearestPowerOfTwo(nValue) {
if (nValue <= 1) {
return 1;

}

var highestBit=(nValue == 0? null : (nValue < 0? 31 : ((Math.log(nValue)) / (Math.LN2)) << 0));
var roundingTest=nValue & (1 << (highestBit - 1));
if (roundingTest != 0) {
++highestBit;

}

return 1 << highestBit;

}

Math.nearestPowerOfTwo = nearestPowerOfTwo;
function ceilingPowerOfTwo(nValue) {
if (nValue <= 1) {
return 1;

}

var highestBit=(nValue == 0? null : (nValue < 0? 31 : ((Math.log(nValue)) / (Math.LN2)) << 0));
var mask=nValue & ((1 << highestBit) - 1);
highestBit += mask && 1;
return 1 << highestBit;

}

Math.ceilingPowerOfTwo = ceilingPowerOfTwo;
function floorPowerOfTwo(nValue) {
if (nValue <= 1) {
return 1;

}

var highestBit=(nValue == 0? null : (nValue < 0? 31 : ((Math.log(nValue)) / (Math.LN2)) << 0));
return 1 << highestBit;

}

Math.floorPowerOfTwo = floorPowerOfTwo;
function alignUp(iValue, iAlignment) {
var iRemainder=iValue % iAlignment;
if (iRemainder == 0) {
return iValue;

}

return iValue + (iAlignment - iRemainder);

}

Math.alignUp = alignUp;
function alignDown(iValue, iAlignment) {
var remainder=iValue % iAlignment;
if (remainder == 0) {
return iValue;

}

return iValue - remainder;

}

Math.alignDown = alignDown;
function nod(n, m) {
var p=n % m;
while (p != 0) {
n = m;
m = p;
p = n % m;

}
return m;

}

Math.nod = nod;
function nok(n, m) {
return (Math.abs(n * m)) / (Math.nod(n, m));

}

Math.nok = nok;
a.BitFlags =  {totalSet: function(value) {
var count=0;
var total=32;
for (var i=total; i; --i) {
count += value & 1;
value >>= 1;

}

return count;

}
};
if ((typeof Float32Array) != "undefined") {
glMatrixArrayType = Float32Array;

}
else if ((typeof WebGLFloatArray) != "undefined") {
glMatrixArrayType = WebGLFloatArray;

}
else  {
glMatrixArrayType = Array;

}


;
var Vec2= {};
Vec2.create = function() {
var dest=new glMatrixArrayType(2);
switch(arguments.length) {
case 1:
dest[0] = arguments[0][0];
dest[1] = arguments[0][1];
break ;

case 2:
dest[0] = arguments[0];
dest[1] = arguments[1];
break ;
}
return dest;

};
Vec2.set = function(vec, dest) {
dest[0] = vec[0];
dest[1] = vec[1];
return dest;

};
Vec2.add = function(vec, vec2_, dest) {
if ((!dest) || (vec == dest)) {
vec[0] += vec2_[0];
vec[1] += vec2_[1];
return vec;

}

dest[0] = (vec[0]) + (vec2_[0]);
dest[1] = (vec[1]) + (vec2_[1]);
return dest;

};
Vec2.subtract = function(vec, vec2_, dest) {
if ((!dest) || (vec == dest)) {
vec[0] -= vec2_[0];
vec[1] -= vec2_[1];
return vec;

}

dest[0] = (vec[0]) - (vec2_[0]);
dest[1] = (vec[1]) - (vec2_[1]);
return dest;

};
Vec2.sub = Vec2.subtract;
Vec2.negate = function(vec, dest) {
if (!dest) {
dest = vec;

}

dest[0] = -(vec[0]);
dest[1] = -(vec[1]);
return dest;

};
Vec2.scale = function(vec, val, dest) {
if ((!dest) || (vec == dest)) {
vec[0] *= val;
vec[1] *= val;
return vec;

}

dest[0] = (vec[0]) * val;
dest[1] = (vec[1]) * val;
return dest;

};
Vec2.normalize = function(vec, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1];
var len=Math.sqrt((x * x) + (y * y));
if (!len) {
dest[0] = 0;
dest[1] = 0;
return dest;

}
else if (len == 1) {
dest[0] = x;
dest[1] = y;
return dest;

}


len = 1 / len;
dest[0] = x * len;
dest[1] = y * len;
return dest;

};
Vec2.cross = function(vec, vec2_, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1];
var x2=vec2_[0], y2=vec2_[1];
dest[0] = (y * z2) - (z * y2);
dest[1] = (z * x2) - (x * z2);
return dest;

};
Vec2.length = function(vec) {
var x=vec[0], y=vec[1];
return Math.sqrt((x * x) + (y * y));

};
Vec2.lengthSquare = function(vec) {
var x=vec[0], y=vec[1];
return (x * x) + (y * y);

};
Vec2.dot = function(vec, vec2_) {
return ((vec[0]) * (vec2_[0])) + ((vec[1]) * (vec2_[1]));

};
Vec2.direction = function(vec, vec2_, dest) {
if (!dest) {
dest = vec;

}

var x=(vec[0]) - (vec2_[0]);
var y=(vec[1]) - (vec2_[1]);
var len=Math.sqrt((x * x) + (y * y));
if (!len) {
dest[0] = 0;
dest[1] = 0;
return dest;

}

len = 1 / len;
dest[0] = x * len;
dest[1] = y * len;
return dest;

};
Vec2.lerp = function(vec, vec2_, lerp, dest) {
if (!dest) {
dest = vec;

}

dest[0] = (vec[0]) + (lerp * ((vec2_[0]) - (vec[0])));
dest[1] = (vec[1]) + (lerp * ((vec2_[1]) - (vec[1])));
return dest;

};
Vec2.str = function(vec) {
return ((("[" + (vec[0])) + ", ") + (vec[1])) + "]";

};
Vec2.isEqual = function(vec0, vec1) {
if ((vec0[0]) != (vec1[0])) {
return false;

}

if ((vec0[1]) != (vec1[1])) {
return false;

}

return true;

};
Vec2.isClear = function(vec) {
if ((vec[0]) != 0) {
return false;

}

if ((vec[1]) != 0) {
return false;

}

return true;

};
Vec2.clear = function(vec) {
vec[0] = 0;
vec[1] = 0;

};
var Vec3= {};
Vec3.create = function() {
var dest=new glMatrixArrayType(3);
switch(arguments.length) {
case 1:
dest[0] = arguments[0][0];
dest[1] = arguments[0][1];
dest[2] = arguments[0][2];
break ;

case 3:
dest[0] = arguments[0];
dest[1] = arguments[1];
dest[2] = arguments[2];
break ;
}
return dest;

};
Vec3.set = function(vec, dest) {
dest[0] = vec[0];
dest[1] = vec[1];
dest[2] = vec[2];
return dest;

};
Vec3.add = function(vec, vec2_, dest) {
if ((!dest) || (vec == dest)) {
vec[0] += vec2_[0];
vec[1] += vec2_[1];
vec[2] += vec2_[2];
return vec;

}

dest[0] = (vec[0]) + (vec2_[0]);
dest[1] = (vec[1]) + (vec2_[1]);
dest[2] = (vec[2]) + (vec2_[2]);
return dest;

};
Vec3.subtract = function(vec, vec2_, dest) {
if ((!dest) || (vec == dest)) {
vec[0] -= vec2_[0];
vec[1] -= vec2_[1];
vec[2] -= vec2_[2];
return vec;

}

dest[0] = (vec[0]) - (vec2_[0]);
dest[1] = (vec[1]) - (vec2_[1]);
dest[2] = (vec[2]) - (vec2_[2]);
return dest;

};
Vec3.toTranslationMatrix = function(vec, dest) {
if (!dest) {
dest = new glMatrixArrayType(16);

}

Mat4.identity(dest);
dest[12] = vec[0];
dest[13] = vec[1];
dest[14] = vec[2];
return dest;

};
Vec3.negate = function(vec, dest) {
if (!dest) {
dest = vec;

}

dest[0] = -(vec[0]);
dest[1] = -(vec[1]);
dest[2] = -(vec[2]);
return dest;

};
Vec3.scale = function(vec, val, dest) {
if ((!dest) || (vec == dest)) {
vec[0] *= val;
vec[1] *= val;
vec[2] *= val;
return vec;

}

dest[0] = (vec[0]) * val;
dest[1] = (vec[1]) * val;
dest[2] = (vec[2]) * val;
return dest;

};
Vec3.normalize = function(vec, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1], z=vec[2];
var len=Math.sqrt(((x * x) + (y * y)) + (z * z));
if (!len) {
dest[0] = 0;
dest[1] = 0;
dest[2] = 0;
return dest;

}
else if (len == 1) {
dest[0] = x;
dest[1] = y;
dest[2] = z;
return dest;

}


len = 1 / len;
dest[0] = x * len;
dest[1] = y * len;
dest[2] = z * len;
return dest;

};
Vec3.cross = function(vec, vec2_, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1], z=vec[2];
var x2=vec2_[0], y2=vec2_[1], z2=vec2_[2];
dest[0] = (y * z2) - (z * y2);
dest[1] = (z * x2) - (x * z2);
dest[2] = (x * y2) - (y * x2);
return dest;

};
Vec3.length = function(vec) {
var x=vec[0], y=vec[1], z=vec[2];
return Math.sqrt(((x * x) + (y * y)) + (z * z));

};
Vec3.lengthSquare = function(vec) {
var x=vec[0], y=vec[1], z=vec[2];
return ((x * x) + (y * y)) + (z * z);

};
Vec3.dot = function(vec, vec2_) {
return (((vec[0]) * (vec2_[0])) + ((vec[1]) * (vec2_[1]))) + ((vec[2]) * (vec2_[2]));

};
Vec3.direction = function(vec, vec2_, dest) {
if (!dest) {
dest = vec;

}

var x=(vec[0]) - (vec2_[0]);
var y=(vec[1]) - (vec2_[1]);
var z=(vec[2]) - (vec2_[2]);
var len=Math.sqrt(((x * x) + (y * y)) + (z * z));
if (!len) {
dest[0] = 0;
dest[1] = 0;
dest[2] = 0;
return dest;

}

len = 1 / len;
dest[0] = x * len;
dest[1] = y * len;
dest[2] = z * len;
return dest;

};
Vec3.lerp = function(vec, vec2_, lerp, dest) {
if (!dest) {
dest = vec;

}

dest[0] = (vec[0]) + (lerp * ((vec2_[0]) - (vec[0])));
dest[1] = (vec[1]) + (lerp * ((vec2_[1]) - (vec[1])));
dest[2] = (vec[2]) + (lerp * ((vec2_[2]) - (vec[2])));
return dest;

};
Vec3.str = function(vec) {
return ((((("[" + (vec[0])) + ", ") + (vec[1])) + ", ") + (vec[2])) + "]";

};
Vec3.isEqual = function(vec0, vec1) {
if ((vec0[0]) != (vec1[0])) {
return false;

}

if ((vec0[1]) != (vec1[1])) {
return false;

}

if ((vec0[2]) != (vec1[2])) {
return false;

}

return true;

};
Vec3.isClear = function(vec) {
if ((vec[0]) != 0) {
return false;

}

if ((vec[1]) != 0) {
return false;

}

if ((vec[2]) != 0) {
return false;

}

return true;

};
Vec3.clear = function(vec) {
vec[0] = 0;
vec[1] = 0;
vec[2] = 0;

};
var Vec4= {};
Vec4.create = function() {
var dest=new glMatrixArrayType(4);
switch(arguments.length) {
case 1:
dest[0] = arguments[0][0];
dest[1] = arguments[0][1];
dest[2] = arguments[0][2];
dest[3] = arguments[0][3];
break ;

case 4:
dest[0] = arguments[0];
dest[1] = arguments[1];
dest[2] = arguments[2];
dest[3] = arguments[3];
break ;
}
return dest;

};
Vec4.set = function(vec, dest) {
dest[0] = vec[0];
dest[1] = vec[1];
dest[2] = vec[2];
dest[3] = vec[3];
return dest;

};
Vec4.add = function(vec, vec2_, dest) {
if ((!dest) || (vec == dest)) {
vec[0] += vec2_[0];
vec[1] += vec2_[1];
vec[2] += vec2_[2];
vec[3] += vec2_[3];
return vec;

}

dest[0] = (vec[0]) + (vec2_[0]);
dest[1] = (vec[1]) + (vec2_[1]);
dest[2] = (vec[2]) + (vec2_[2]);
dest[3] = (vec[3]) + (vec2_[3]);
return dest;

};
Vec4.subtract = function(vec, vec2_, dest) {
if ((!dest) || (vec == dest)) {
vec[0] -= vec2_[0];
vec[1] -= vec2_[1];
vec[2] -= vec2_[2];
vec[3] -= vec2_[3];
return vec;

}

dest[0] = (vec[0]) - (vec2_[0]);
dest[1] = (vec[1]) - (vec2_[1]);
dest[2] = (vec[2]) - (vec2_[2]);
dest[3] = (vec[3]) - (vec2_[3]);
return dest;

};
Vec4.negate = function(vec, dest) {
if (!dest) {
dest = vec;

}

dest[0] = -(vec[0]);
dest[1] = -(vec[1]);
dest[2] = -(vec[2]);
dest[3] = -(vec[3]);
return dest;

};
Vec4.scale = function(vec, val, dest) {
if ((!dest) || (vec == dest)) {
vec[0] *= val;
vec[1] *= val;
vec[2] *= val;
vec[3] *= val;
return vec;

}

dest[0] = (vec[0]) * val;
dest[1] = (vec[1]) * val;
dest[2] = (vec[2]) * val;
dest[3] = (vec[3]) * val;
return dest;

};
Vec4.normalize = function(vec, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1], z=vec[2], w=vec[3];
var len=Math.sqrt((((x * x) + (y * y)) + (z * z)) + (w * w));
if (!len) {
dest[0] = 0;
dest[1] = 0;
dest[2] = 0;
dest[3] = 0;
return dest;

}
else if (len == 1) {
dest[0] = x;
dest[1] = y;
dest[2] = z;
dest[3] = w;
return dest;

}


len = 1 / len;
dest[0] = x * len;
dest[1] = y * len;
dest[2] = z * len;
dest[3] = w * len;
return dest;

};
Vec4.length = function(vec) {
var x=vec[0], y=vec[1], z=vec[2], w=vec[3];
return Math.sqrt((((x * x) + (y * y)) + (z * z)) + (w * w));

};
Vec4.lengthSquare = function(vec) {
var x=vec[0], y=vec[1], z=vec[2], w=vec[3];
return (((x * x) + (y * y)) + (z * z)) + (w * w);

};
Vec4.dot = function(vec, vec2_) {
return ((((vec[0]) * (vec2_[0])) + ((vec[1]) * (vec2_[1]))) + ((vec[2]) * (vec2_[2]))) + ((vec[3]) * (vec2_[3]));

};
Vec4.direction = function(vec, vec2_, dest) {
if (!dest) {
dest = vec;

}

var x=(vec[0]) - (vec2_[0]);
var y=(vec[1]) - (vec2_[1]);
var z=(vec[2]) - (vec2_[2]);
var w=(vec[3]) - (vec2_[3]);
var len=Math.sqrt((((x * x) + (y * y)) + (z * z)) + (w * w));
if (!len) {
dest[0] = 0;
dest[1] = 0;
dest[2] = 0;
dest[3] = 0;
return dest;

}

len = 1 / len;
dest[0] = x * len;
dest[1] = y * len;
dest[2] = z * len;
dest[3] = w * len;
return dest;

};
Vec4.lerp = function(vec, vec2_, lerp, dest) {
if (!dest) {
dest = vec;

}

dest[0] = (vec[0]) + (lerp * ((vec2_[0]) - (vec[0])));
dest[1] = (vec[1]) + (lerp * ((vec2_[1]) - (vec[1])));
dest[2] = (vec[2]) + (lerp * ((vec2_[2]) - (vec[2])));
dest[3] = (vec[3]) + (lerp * ((vec2_[3]) - (vec[3])));
return dest;

};
Vec4.str = function(vec) {
return ((((((("[" + (vec[0])) + ", ") + (vec[1])) + ", ") + (vec[2])) + ", ") + (vec[3])) + "]";

};
Vec4.isEqual = function(vec0, vec1) {
if ((vec0[0]) != (vec1[0])) {
return false;

}

if ((vec0[1]) != (vec1[1])) {
return false;

}

if ((vec0[2]) != (vec1[2])) {
return false;

}

if ((vec0[3]) != (vec1[3])) {
return false;

}

return true;

};
Vec4.isClear = function(vec) {
if ((vec[0]) != 0) {
return false;

}

if ((vec[1]) != 0) {
return false;

}

if ((vec[2]) != 0) {
return false;

}

if ((vec[3]) != 0) {
return false;

}

return true;

};
Vec4.clear = function(vec) {
vec[0] = 0;
vec[1] = 0;
vec[2] = 0;
vec[3] = 0;

};
var Mat3= {};
Mat3.create = function(mat) {
var dest=new glMatrixArrayType(9);
if (mat) {
dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = mat[3];
dest[4] = mat[4];
dest[5] = mat[5];
dest[6] = mat[6];
dest[7] = mat[7];
dest[8] = mat[8];

}

return dest;

};
Mat3.set = function(mat, dest) {
dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = mat[3];
dest[4] = mat[4];
dest[5] = mat[5];
dest[6] = mat[6];
dest[7] = mat[7];
dest[8] = mat[8];
return dest;

};
Mat3.identity = function(dest) {
dest[0] = 1;
dest[1] = 0;
dest[2] = 0;
dest[3] = 0;
dest[4] = 1;
dest[5] = 0;
dest[6] = 0;
dest[7] = 0;
dest[8] = 1;
return dest;

};
Mat3.transpose = function(mat, dest) {
if ((!dest) || (mat == dest)) {
var a01=mat[1], a02=mat[2];
var a12=mat[5];
mat[1] = mat[3];
mat[2] = mat[6];
mat[3] = a01;
mat[5] = mat[7];
mat[6] = a02;
mat[7] = a12;
return mat;

}

dest[0] = mat[0];
dest[1] = mat[3];
dest[2] = mat[6];
dest[3] = mat[1];
dest[4] = mat[4];
dest[5] = mat[7];
dest[6] = mat[2];
dest[7] = mat[5];
dest[8] = mat[8];
return dest;

};
Mat3.toMat4 = function(mat, dest) {
if (!dest) {
dest = Mat4.create();

}

dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = 0;
dest[4] = mat[3];
dest[5] = mat[4];
dest[6] = mat[5];
dest[7] = 0;
dest[8] = mat[6];
dest[9] = mat[7];
dest[10] = mat[8];
dest[11] = 0;
dest[12] = 0;
dest[13] = 0;
dest[14] = 0;
dest[15] = 1;
return dest;

};
Mat3.str = function(mat) {
return ((((((((((((((((("[" + (mat[0])) + ", ") + (mat[1])) + ", ") + (mat[2])) + ", ") + (mat[3])) + ", ") + (mat[4])) + ", ") + (mat[5])) + ", ") + (mat[6])) + ", ") + (mat[7])) + ", ") + (mat[8])) + "]";

};
var Mat4= {};
Mat4.create = function(mat) {
var dest=new glMatrixArrayType(16);
if (mat) {
dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = mat[3];
dest[4] = mat[4];
dest[5] = mat[5];
dest[6] = mat[6];
dest[7] = mat[7];
dest[8] = mat[8];
dest[9] = mat[9];
dest[10] = mat[10];
dest[11] = mat[11];
dest[12] = mat[12];
dest[13] = mat[13];
dest[14] = mat[14];
dest[15] = mat[15];

}

return dest;

};
Mat4.set = function(mat, dest) {
dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = mat[3];
dest[4] = mat[4];
dest[5] = mat[5];
dest[6] = mat[6];
dest[7] = mat[7];
dest[8] = mat[8];
dest[9] = mat[9];
dest[10] = mat[10];
dest[11] = mat[11];
dest[12] = mat[12];
dest[13] = mat[13];
dest[14] = mat[14];
dest[15] = mat[15];
return dest;

};
Mat4.identity = function(dest) {
dest[0] = 1;
dest[1] = 0;
dest[2] = 0;
dest[3] = 0;
dest[4] = 0;
dest[5] = 1;
dest[6] = 0;
dest[7] = 0;
dest[8] = 0;
dest[9] = 0;
dest[10] = 1;
dest[11] = 0;
dest[12] = 0;
dest[13] = 0;
dest[14] = 0;
dest[15] = 1;
return dest;

};
Mat4.transpose = function(mat, dest) {
if ((!dest) || (mat == dest)) {
var a01=mat[1], a02=mat[2], a03=mat[3];
var a12=mat[6], a13=mat[7];
var a23=mat[11];
mat[1] = mat[4];
mat[2] = mat[8];
mat[3] = mat[12];
mat[4] = a01;
mat[6] = mat[9];
mat[7] = mat[13];
mat[8] = a02;
mat[9] = a12;
mat[11] = mat[14];
mat[12] = a03;
mat[13] = a13;
mat[14] = a23;
return mat;

}

dest[0] = mat[0];
dest[1] = mat[4];
dest[2] = mat[8];
dest[3] = mat[12];
dest[4] = mat[1];
dest[5] = mat[5];
dest[6] = mat[9];
dest[7] = mat[13];
dest[8] = mat[2];
dest[9] = mat[6];
dest[10] = mat[10];
dest[11] = mat[14];
dest[12] = mat[3];
dest[13] = mat[7];
dest[14] = mat[11];
dest[15] = mat[15];
return dest;

};
Mat4.determinant = function(mat) {
var a00=mat[0], a01=mat[1], a02=mat[2], a03=mat[3];
var a10=mat[4], a11=mat[5], a12=mat[6], a13=mat[7];
var a20=mat[8], a21=mat[9], a22=mat[10], a23=mat[11];
var a30=mat[12], a31=mat[13], a32=mat[14], a33=mat[15];
return (((((((((((((((((((((((((a30 * a21) * a12) * a03) - (((a20 * a31) * a12) * a03)) - (((a30 * a11) * a22) * a03)) + (((a10 * a31) * a22) * a03)) + (((a20 * a11) * a32) * a03)) - (((a10 * a21) * a32) * a03)) - (((a30 * a21) * a02) * a13)) + (((a20 * a31) * a02) * a13)) + (((a30 * a01) * a22) * a13)) - (((a00 * a31) * a22) * a13)) - (((a20 * a01) * a32) * a13)) + (((a00 * a21) * a32) * a13)) + (((a30 * a11) * a02) * a23)) - (((a10 * a31) * a02) * a23)) - (((a30 * a01) * a12) * a23)) + (((a00 * a31) * a12) * a23)) + (((a10 * a01) * a32) * a23)) - (((a00 * a11) * a32) * a23)) - (((a20 * a11) * a02) * a33)) + (((a10 * a21) * a02) * a33)) + (((a20 * a01) * a12) * a33)) - (((a00 * a21) * a12) * a33)) - (((a10 * a01) * a22) * a33)) + (((a00 * a11) * a22) * a33);

};
Mat4.inverse = function(mat, dest) {
if (!dest) {
dest = mat;

}

var a00=mat[0], a01=mat[1], a02=mat[2], a03=mat[3];
var a10=mat[4], a11=mat[5], a12=mat[6], a13=mat[7];
var a20=mat[8], a21=mat[9], a22=mat[10], a23=mat[11];
var a30=mat[12], a31=mat[13], a32=mat[14], a33=mat[15];
var b00=(a00 * a11) - (a01 * a10);
var b01=(a00 * a12) - (a02 * a10);
var b02=(a00 * a13) - (a03 * a10);
var b03=(a01 * a12) - (a02 * a11);
var b04=(a01 * a13) - (a03 * a11);
var b05=(a02 * a13) - (a03 * a12);
var b06=(a20 * a31) - (a21 * a30);
var b07=(a20 * a32) - (a22 * a30);
var b08=(a20 * a33) - (a23 * a30);
var b09=(a21 * a32) - (a22 * a31);
var b10=(a21 * a33) - (a23 * a31);
var b11=(a22 * a33) - (a23 * a32);
var invDet=1 / ((((((b00 * b11) - (b01 * b10)) + (b02 * b09)) + (b03 * b08)) - (b04 * b07)) + (b05 * b06));
dest[0] = (((a11 * b11) - (a12 * b10)) + (a13 * b09)) * invDet;
dest[1] = ((((-a01) * b11) + (a02 * b10)) - (a03 * b09)) * invDet;
dest[2] = (((a31 * b05) - (a32 * b04)) + (a33 * b03)) * invDet;
dest[3] = ((((-a21) * b05) + (a22 * b04)) - (a23 * b03)) * invDet;
dest[4] = ((((-a10) * b11) + (a12 * b08)) - (a13 * b07)) * invDet;
dest[5] = (((a00 * b11) - (a02 * b08)) + (a03 * b07)) * invDet;
dest[6] = ((((-a30) * b05) + (a32 * b02)) - (a33 * b01)) * invDet;
dest[7] = (((a20 * b05) - (a22 * b02)) + (a23 * b01)) * invDet;
dest[8] = (((a10 * b10) - (a11 * b08)) + (a13 * b06)) * invDet;
dest[9] = ((((-a00) * b10) + (a01 * b08)) - (a03 * b06)) * invDet;
dest[10] = (((a30 * b04) - (a31 * b02)) + (a33 * b00)) * invDet;
dest[11] = ((((-a20) * b04) + (a21 * b02)) - (a23 * b00)) * invDet;
dest[12] = ((((-a10) * b09) + (a11 * b07)) - (a12 * b06)) * invDet;
dest[13] = (((a00 * b09) - (a01 * b07)) + (a02 * b06)) * invDet;
dest[14] = ((((-a30) * b03) + (a31 * b01)) - (a32 * b00)) * invDet;
dest[15] = (((a20 * b03) - (a21 * b01)) + (a22 * b00)) * invDet;
return dest;

};
Mat4.toRotationMat = function(mat, dest) {
if (!dest) {
dest = Mat4.create();

}

dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = mat[3];
dest[4] = mat[4];
dest[5] = mat[5];
dest[6] = mat[6];
dest[7] = mat[7];
dest[8] = mat[8];
dest[9] = mat[9];
dest[10] = mat[10];
dest[11] = mat[11];
dest[12] = 0;
dest[13] = 0;
dest[14] = 0;
dest[15] = 1;
return dest;

};
Mat4.toMat3 = function(mat, dest) {
if (!dest) {
dest = Mat3.create();

}

dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = mat[4];
dest[4] = mat[5];
dest[5] = mat[6];
dest[6] = mat[8];
dest[7] = mat[9];
dest[8] = mat[10];
return dest;

};
Mat4.toInverseMat3 = function(mat, dest) {
var a00=mat[0], a01=mat[1], a02=mat[2];
var a10=mat[4], a11=mat[5], a12=mat[6];
var a20=mat[8], a21=mat[9], a22=mat[10];
var b01=(a22 * a11) - (a12 * a21);
var b11=((-a22) * a10) + (a12 * a20);
var b21=(a21 * a10) - (a11 * a20);
var d=((a00 * b01) + (a01 * b11)) + (a02 * b21);
if (!d) {
return null;

}

var id=1 / d;
if (!dest) {
dest = Mat3.create();

}

dest[0] = b01 * id;
dest[1] = (((-a22) * a01) + (a02 * a21)) * id;
dest[2] = ((a12 * a01) - (a02 * a11)) * id;
dest[3] = b11 * id;
dest[4] = ((a22 * a00) - (a02 * a20)) * id;
dest[5] = (((-a12) * a00) + (a02 * a10)) * id;
dest[6] = b21 * id;
dest[7] = (((-a21) * a00) + (a01 * a20)) * id;
dest[8] = ((a11 * a00) - (a01 * a10)) * id;
return dest;

};
Mat4.multiply = function(mat, mat2, dest) {
if (!dest) {
dest = mat;

}

var a00=mat[0], a01=mat[1], a02=mat[2], a03=mat[3];
var a10=mat[4], a11=mat[5], a12=mat[6], a13=mat[7];
var a20=mat[8], a21=mat[9], a22=mat[10], a23=mat[11];
var a30=mat[12], a31=mat[13], a32=mat[14], a33=mat[15];
var b00=mat2[0], b01=mat2[1], b02=mat2[2], b03=mat2[3];
var b10=mat2[4], b11=mat2[5], b12=mat2[6], b13=mat2[7];
var b20=mat2[8], b21=mat2[9], b22=mat2[10], b23=mat2[11];
var b30=mat2[12], b31=mat2[13], b32=mat2[14], b33=mat2[15];
dest[0] = (((b00 * a00) + (b01 * a10)) + (b02 * a20)) + (b03 * a30);
dest[1] = (((b00 * a01) + (b01 * a11)) + (b02 * a21)) + (b03 * a31);
dest[2] = (((b00 * a02) + (b01 * a12)) + (b02 * a22)) + (b03 * a32);
dest[3] = (((b00 * a03) + (b01 * a13)) + (b02 * a23)) + (b03 * a33);
dest[4] = (((b10 * a00) + (b11 * a10)) + (b12 * a20)) + (b13 * a30);
dest[5] = (((b10 * a01) + (b11 * a11)) + (b12 * a21)) + (b13 * a31);
dest[6] = (((b10 * a02) + (b11 * a12)) + (b12 * a22)) + (b13 * a32);
dest[7] = (((b10 * a03) + (b11 * a13)) + (b12 * a23)) + (b13 * a33);
dest[8] = (((b20 * a00) + (b21 * a10)) + (b22 * a20)) + (b23 * a30);
dest[9] = (((b20 * a01) + (b21 * a11)) + (b22 * a21)) + (b23 * a31);
dest[10] = (((b20 * a02) + (b21 * a12)) + (b22 * a22)) + (b23 * a32);
dest[11] = (((b20 * a03) + (b21 * a13)) + (b22 * a23)) + (b23 * a33);
dest[12] = (((b30 * a00) + (b31 * a10)) + (b32 * a20)) + (b33 * a30);
dest[13] = (((b30 * a01) + (b31 * a11)) + (b32 * a21)) + (b33 * a31);
dest[14] = (((b30 * a02) + (b31 * a12)) + (b32 * a22)) + (b33 * a32);
dest[15] = (((b30 * a03) + (b31 * a13)) + (b32 * a23)) + (b33 * a33);
return dest;

};
Mat4.mult = Mat4.multiply;
Mat4.multiplyVec3 = function(mat, vec, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1], z=vec[2];
dest[0] = ((((mat[0]) * x) + ((mat[4]) * y)) + ((mat[8]) * z)) + (mat[12]);
dest[1] = ((((mat[1]) * x) + ((mat[5]) * y)) + ((mat[9]) * z)) + (mat[13]);
dest[2] = ((((mat[2]) * x) + ((mat[6]) * y)) + ((mat[10]) * z)) + (mat[14]);
return dest;

};
Mat4.multiplyVec4 = function(mat, vec, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1], z=vec[2], w=vec[3];
dest[0] = ((((mat[0]) * x) + ((mat[4]) * y)) + ((mat[8]) * z)) + ((mat[12]) * w);
dest[1] = ((((mat[1]) * x) + ((mat[5]) * y)) + ((mat[9]) * z)) + ((mat[13]) * w);
dest[2] = ((((mat[2]) * x) + ((mat[6]) * y)) + ((mat[10]) * z)) + ((mat[14]) * w);
dest[3] = ((((mat[3]) * x) + ((mat[7]) * y)) + ((mat[11]) * z)) + ((mat[15]) * w);
return dest;

};
Mat4.translate = function(mat, vec, dest) {
var x=vec[0], y=vec[1], z=vec[2];
if ((!dest) || (mat == dest)) {
mat[12] = ((((mat[0]) * x) + ((mat[4]) * y)) + ((mat[8]) * z)) + (mat[12]);
mat[13] = ((((mat[1]) * x) + ((mat[5]) * y)) + ((mat[9]) * z)) + (mat[13]);
mat[14] = ((((mat[2]) * x) + ((mat[6]) * y)) + ((mat[10]) * z)) + (mat[14]);
mat[15] = ((((mat[3]) * x) + ((mat[7]) * y)) + ((mat[11]) * z)) + (mat[15]);
return mat;

}

var a00=mat[0], a01=mat[1], a02=mat[2], a03=mat[3];
var a10=mat[4], a11=mat[5], a12=mat[6], a13=mat[7];
var a20=mat[8], a21=mat[9], a22=mat[10], a23=mat[11];
dest[0] = a00;
dest[1] = a01;
dest[2] = a02;
dest[3] = a03;
dest[4] = a10;
dest[5] = a11;
dest[6] = a12;
dest[7] = a13;
dest[8] = a20;
dest[9] = a21;
dest[10] = a22;
dest[11] = a23;
dest[12] = (((a00 * x) + (a10 * y)) + (a20 * z)) + (mat[12]);
dest[13] = (((a01 * x) + (a11 * y)) + (a21 * z)) + (mat[13]);
dest[14] = (((a02 * x) + (a12 * y)) + (a22 * z)) + (mat[14]);
dest[15] = (((a03 * x) + (a13 * y)) + (a23 * z)) + (mat[15]);
return dest;

};
Mat4.diagonal = function(mat, vec, dest) {
if (!dest) {
dest = mat;

}

dest[0] = vec[0];
dest[5] = vec[1];
dest[10] = vec[2];
dest[15] = vec[3];
if (mat !== dest) {
dest[4] = mat[4];
dest[8] = mat[8];
dest[12] = mat[12];
dest[1] = mat[1];
dest[9] = mat[9];
dest[13] = mat[13];
dest[2] = mat[2];
dest[6] = mat[6];
dest[14] = mat[14];
dest[3] = mat[3];
dest[7] = mat[7];
dest[11] = mat[11];

}

return dest;

};
Mat4.scale = function(mat, vec, dest) {
var x=vec[0], y=vec[1], z=vec[2];
if ((!dest) || (mat == dest)) {
mat[0] *= x;
mat[1] *= x;
mat[2] *= x;
mat[3] *= x;
mat[4] *= y;
mat[5] *= y;
mat[6] *= y;
mat[7] *= y;
mat[8] *= z;
mat[9] *= z;
mat[10] *= z;
mat[11] *= z;
return mat;

}

dest[0] = (mat[0]) * x;
dest[1] = (mat[1]) * x;
dest[2] = (mat[2]) * x;
dest[3] = (mat[3]) * x;
dest[4] = (mat[4]) * y;
dest[5] = (mat[5]) * y;
dest[6] = (mat[6]) * y;
dest[7] = (mat[7]) * y;
dest[8] = (mat[8]) * z;
dest[9] = (mat[9]) * z;
dest[10] = (mat[10]) * z;
dest[11] = (mat[11]) * z;
dest[12] = mat[12];
dest[13] = mat[13];
dest[14] = mat[14];
dest[15] = mat[15];
return dest;

};
Mat4.rotate = function(mat, angle, axis, dest) {
var x=axis[0], y=axis[1], z=axis[2];
var len=Math.sqrt(((x * x) + (y * y)) + (z * z));
if (!len) {
return null;

}

if (len != 1) {
len = 1 / len;
x *= len;
y *= len;
z *= len;

}

var s=Math.sin(angle);
var c=Math.cos(angle);
var t=1 - c;
var a00=mat[0], a01=mat[1], a02=mat[2], a03=mat[3];
var a10=mat[4], a11=mat[5], a12=mat[6], a13=mat[7];
var a20=mat[8], a21=mat[9], a22=mat[10], a23=mat[11];
var b00=((x * x) * t) + c, b01=((y * x) * t) + (z * s), b02=((z * x) * t) - (y * s);
var b10=((x * y) * t) - (z * s), b11=((y * y) * t) + c, b12=((z * y) * t) + (x * s);
var b20=((x * z) * t) + (y * s), b21=((y * z) * t) - (x * s), b22=((z * z) * t) + c;
if (!dest) {
dest = mat;

}
else if (mat != dest) {
dest[12] = mat[12];
dest[13] = mat[13];
dest[14] = mat[14];
dest[15] = mat[15];

}


dest[0] = ((a00 * b00) + (a10 * b01)) + (a20 * b02);
dest[1] = ((a01 * b00) + (a11 * b01)) + (a21 * b02);
dest[2] = ((a02 * b00) + (a12 * b01)) + (a22 * b02);
dest[3] = ((a03 * b00) + (a13 * b01)) + (a23 * b02);
dest[4] = ((a00 * b10) + (a10 * b11)) + (a20 * b12);
dest[5] = ((a01 * b10) + (a11 * b11)) + (a21 * b12);
dest[6] = ((a02 * b10) + (a12 * b11)) + (a22 * b12);
dest[7] = ((a03 * b10) + (a13 * b11)) + (a23 * b12);
dest[8] = ((a00 * b20) + (a10 * b21)) + (a20 * b22);
dest[9] = ((a01 * b20) + (a11 * b21)) + (a21 * b22);
dest[10] = ((a02 * b20) + (a12 * b21)) + (a22 * b22);
dest[11] = ((a03 * b20) + (a13 * b21)) + (a23 * b22);
return dest;

};
Mat4.rotateX = function(mat, angle, dest) {
var s=Math.sin(angle);
var c=Math.cos(angle);
var a10=mat[4], a11=mat[5], a12=mat[6], a13=mat[7];
var a20=mat[8], a21=mat[9], a22=mat[10], a23=mat[11];
if (!dest) {
dest = mat;

}
else if (mat != dest) {
dest[0] = mat[0];
dest[1] = mat[1];
dest[2] = mat[2];
dest[3] = mat[3];
dest[12] = mat[12];
dest[13] = mat[13];
dest[14] = mat[14];
dest[15] = mat[15];

}


dest[4] = (a10 * c) + (a20 * s);
dest[5] = (a11 * c) + (a21 * s);
dest[6] = (a12 * c) + (a22 * s);
dest[7] = (a13 * c) + (a23 * s);
dest[8] = (a10 * (-s)) + (a20 * c);
dest[9] = (a11 * (-s)) + (a21 * c);
dest[10] = (a12 * (-s)) + (a22 * c);
dest[11] = (a13 * (-s)) + (a23 * c);
return dest;

};
Mat4.rotateY = function(mat, angle, dest) {
var s=Math.sin(angle);
var c=Math.cos(angle);
var a00=mat[0], a01=mat[1], a02=mat[2], a03=mat[3];
var a20=mat[8], a21=mat[9], a22=mat[10], a23=mat[11];
if (!dest) {
dest = mat;

}
else if (mat != dest) {
dest[4] = mat[4];
dest[5] = mat[5];
dest[6] = mat[6];
dest[7] = mat[7];
dest[12] = mat[12];
dest[13] = mat[13];
dest[14] = mat[14];
dest[15] = mat[15];

}


dest[0] = (a00 * c) + (a20 * (-s));
dest[1] = (a01 * c) + (a21 * (-s));
dest[2] = (a02 * c) + (a22 * (-s));
dest[3] = (a03 * c) + (a23 * (-s));
dest[8] = (a00 * s) + (a20 * c);
dest[9] = (a01 * s) + (a21 * c);
dest[10] = (a02 * s) + (a22 * c);
dest[11] = (a03 * s) + (a23 * c);
return dest;

};
Mat4.rotateZ = function(mat, angle, dest) {
var s=Math.sin(angle);
var c=Math.cos(angle);
var a00=mat[0], a01=mat[1], a02=mat[2], a03=mat[3];
var a10=mat[4], a11=mat[5], a12=mat[6], a13=mat[7];
if (!dest) {
dest = mat;

}
else if (mat != dest) {
dest[8] = mat[8];
dest[9] = mat[9];
dest[10] = mat[10];
dest[11] = mat[11];
dest[12] = mat[12];
dest[13] = mat[13];
dest[14] = mat[14];
dest[15] = mat[15];

}


dest[0] = (a00 * c) + (a10 * s);
dest[1] = (a01 * c) + (a11 * s);
dest[2] = (a02 * c) + (a12 * s);
dest[3] = (a03 * c) + (a13 * s);
dest[4] = (a00 * (-s)) + (a10 * c);
dest[5] = (a01 * (-s)) + (a11 * c);
dest[6] = (a02 * (-s)) + (a12 * c);
dest[7] = (a03 * (-s)) + (a13 * c);
return dest;

};
Mat4.frustum = function(left, right, bottom, top, near, far, dest) {
if (!dest) {
dest = Mat4.create();

}

var rl=right - left;
var tb=top - bottom;
var fn=far - near;
dest[0] = (near * 2) / rl;
dest[1] = 0;
dest[2] = 0;
dest[3] = 0;
dest[4] = 0;
dest[5] = (near * 2) / tb;
dest[6] = 0;
dest[7] = 0;
dest[8] = (right + left) / rl;
dest[9] = (top + bottom) / tb;
dest[10] = (-(far + near)) / fn;
dest[11] = -1;
dest[12] = 0;
dest[13] = 0;
dest[14] = (-((far * near) * 2)) / fn;
dest[15] = 0;
return dest;

};
Mat4.perspective = function(fovy, aspect, near, far, dest) {
var top=near * (Math.tan((fovy * (Math.PI)) / 360));
var right=top * aspect;
return Mat4.frustum(-right, right, -top, top, near, far, dest);

};
Mat4.ortho = function(left, right, bottom, top, near, far, dest) {
if (!dest) {
dest = Mat4.create();

}

var rl=right - left;
var tb=top - bottom;
var fn=far - near;
dest[0] = 2 / rl;
dest[1] = 0;
dest[2] = 0;
dest[3] = 0;
dest[4] = 0;
dest[5] = 2 / tb;
dest[6] = 0;
dest[7] = 0;
dest[8] = 0;
dest[9] = 0;
dest[10] = (-2) / fn;
dest[11] = 0;
dest[12] = (-(left + right)) / rl;
dest[13] = (-(top + bottom)) / tb;
dest[14] = (-(far + near)) / fn;
dest[15] = 1;
return dest;

};
Mat4.lookAt = function(eye, center, up, dest) {
if (!dest) {
dest = Mat4.create();

}

var eyex=eye[0], eyey=eye[1], eyez=eye[2], upx=up[0], upy=up[1], upz=up[2], centerx=center[0], centery=center[1], centerz=center[2];
if (((eyex == centerx) && (eyey == centery)) && (eyez == centerz)) {
return Mat4.identity(dest);

}

var z0, z1, z2, x0, x1, x2, y0, y1, y2, len;
z0 = eyex - (center[0]);
z1 = eyey - (center[1]);
z2 = eyez - (center[2]);
len = 1 / (Math.sqrt(((z0 * z0) + (z1 * z1)) + (z2 * z2)));
z0 *= len;
z1 *= len;
z2 *= len;
x0 = (upy * z2) - (upz * z1);
x1 = (upz * z0) - (upx * z2);
x2 = (upx * z1) - (upy * z0);
len = Math.sqrt(((x0 * x0) + (x1 * x1)) + (x2 * x2));
if (!len) {
x0 = 0;
x1 = 0;
x2 = 0;

}
else  {
len = 1 / len;
x0 *= len;
x1 *= len;
x2 *= len;

}

;
y0 = (z1 * x2) - (z2 * x1);
y1 = (z2 * x0) - (z0 * x2);
y2 = (z0 * x1) - (z1 * x0);
len = Math.sqrt(((y0 * y0) + (y1 * y1)) + (y2 * y2));
if (!len) {
y0 = 0;
y1 = 0;
y2 = 0;

}
else  {
len = 1 / len;
y0 *= len;
y1 *= len;
y2 *= len;

}

dest[0] = x0;
dest[1] = y0;
dest[2] = z0;
dest[3] = 0;
dest[4] = x1;
dest[5] = y1;
dest[6] = z1;
dest[7] = 0;
dest[8] = x2;
dest[9] = y2;
dest[10] = z2;
dest[11] = 0;
dest[12] = -(((x0 * eyex) + (x1 * eyey)) + (x2 * eyez));
dest[13] = -(((y0 * eyex) + (y1 * eyey)) + (y2 * eyez));
dest[14] = -(((z0 * eyex) + (z1 * eyey)) + (z2 * eyez));
dest[15] = 1;
return dest;

};
Mat4.row = function(mat, n) {
switch(n) {
case 1:
return Vec4.create([mat[0], mat[4], mat[8], mat[12]]);

case 2:
return Vec4.create([mat[1], mat[5], mat[9], mat[13]]);

case 3:
return Vec4.create([mat[2], mat[6], mat[10], mat[14]]);

case 4:
return Vec4.create([mat[3], mat[7], mat[11], mat[15]]);
}

};
Mat4.str = function(mat) {
return ((((((((((((((((((((((((((((((((((("[\n" + (mat[0])) + ", ") + (mat[1])) + ", ") + (mat[2])) + ", ") + (mat[3])) + "\n") + ", ") + (mat[4])) + ", ") + (mat[5])) + ", ") + (mat[6])) + ", ") + (mat[7])) + "\n") + ", ") + (mat[8])) + ", ") + (mat[9])) + ", ") + (mat[10])) + ", ") + (mat[11])) + "\n") + ", ") + (mat[12])) + ", ") + (mat[13])) + ", ") + (mat[14])) + ", ") + (mat[15])) + "\n") + "]";

};
Quat4 =  {};
Quat4.create = function(quat) {
var dest=new glMatrixArrayType(4);
if (quat) {
dest[0] = quat[0];
dest[1] = quat[1];
dest[2] = quat[2];
dest[3] = quat[3];

}

return dest;

};
Quat4.set = function(quat, dest) {
dest[0] = quat[0];
dest[1] = quat[1];
dest[2] = quat[2];
dest[3] = quat[3];
return dest;

};
Quat4.calculateW = function(quat, dest) {
var x=quat[0], y=quat[1], z=quat[2];
if ((!dest) || (quat == dest)) {
quat[3] = -(Math.sqrt(Math.abs(((1 - (x * x)) - (y * y)) - (z * z))));
return quat;

}

dest[0] = x;
dest[1] = y;
dest[2] = z;
dest[3] = -(Math.sqrt(Math.abs(((1 - (x * x)) - (y * y)) - (z * z))));
return dest;

};
Quat4.inverse = function(quat, dest) {
if ((!dest) || (quat == dest)) {
quat[0] *= -1;
quat[1] *= -1;
quat[2] *= -1;
return quat;

}

dest[0] = -(quat[0]);
dest[1] = -(quat[1]);
dest[2] = -(quat[2]);
dest[3] = quat[3];
return dest;

};
Quat4.length = function(quat) {
var x=quat[0], y=quat[1], z=quat[2], w=quat[3];
return Math.sqrt((((x * x) + (y * y)) + (z * z)) + (w * w));

};
Quat4.normalize = function(quat, dest) {
if (!dest) {
dest = quat;

}

var x=quat[0], y=quat[1], z=quat[2], w=quat[3];
var len=Math.sqrt((((x * x) + (y * y)) + (z * z)) + (w * w));
if (len == 0) {
dest[0] = 0;
dest[1] = 0;
dest[2] = 0;
dest[3] = 0;
return dest;

}

len = 1 / len;
dest[0] = x * len;
dest[1] = y * len;
dest[2] = z * len;
dest[3] = w * len;
return dest;

};
Quat4.multiply = function(quat, quat2, dest) {
if (!dest) {
dest = quat;

}

var qax=quat[0], qay=quat[1], qaz=quat[2], qaw=quat[3];
var qbx=quat2[0], qby=quat2[1], qbz=quat2[2], qbw=quat2[3];
dest[0] = (((qax * qbw) + (qaw * qbx)) + (qay * qbz)) - (qaz * qby);
dest[1] = (((qay * qbw) + (qaw * qby)) + (qaz * qbx)) - (qax * qbz);
dest[2] = (((qaz * qbw) + (qaw * qbz)) + (qax * qby)) - (qay * qbx);
dest[3] = (((qaw * qbw) - (qax * qbx)) - (qay * qby)) - (qaz * qbz);
return dest;

};
Quat4.multiplyVec3 = function(quat, vec, dest) {
if (!dest) {
dest = vec;

}

var x=vec[0], y=vec[1], z=vec[2];
var qx=quat[0], qy=quat[1], qz=quat[2], qw=quat[3];
var ix=((qw * x) + (qy * z)) - (qz * y);
var iy=((qw * y) + (qz * x)) - (qx * z);
var iz=((qw * z) + (qx * y)) - (qy * x);
var iw=(((-qx) * x) - (qy * y)) - (qz * z);
dest[0] = (((ix * qw) + (iw * (-qx))) + (iy * (-qz))) - (iz * (-qy));
dest[1] = (((iy * qw) + (iw * (-qy))) + (iz * (-qx))) - (ix * (-qz));
dest[2] = (((iz * qw) + (iw * (-qz))) + (ix * (-qy))) - (iy * (-qx));
return dest;

};
Quat4.toMat3 = function(quat, dest) {
if (!dest) {
dest = Mat3.create();

}

var x=quat[0], y=quat[1], z=quat[2], w=quat[3];
var x2=x + x;
var y2=y + y;
var z2=z + z;
var xx=x * x2;
var xy=x * y2;
var xz=x * z2;
var yy=y * y2;
var yz=y * z2;
var zz=z * z2;
var wx=w * x2;
var wy=w * y2;
var wz=w * z2;
dest[0] = 1 - (yy + zz);
dest[1] = xy - wz;
dest[2] = xz + wy;
dest[3] = xy + wz;
dest[4] = 1 - (xx + zz);
dest[5] = yz - wx;
dest[6] = xz - wy;
dest[7] = yz + wx;
dest[8] = 1 - (xx + yy);
return dest;

};
Quat4.toMat4 = function(quat, dest) {
if (!dest) {
dest = Mat4.create();

}

var x=quat[0], y=quat[1], z=quat[2], w=quat[3];
var x2=x + x;
var y2=y + y;
var z2=z + z;
var xx=x * x2;
var xy=x * y2;
var xz=x * z2;
var yy=y * y2;
var yz=y * z2;
var zz=z * z2;
var wx=w * x2;
var wy=w * y2;
var wz=w * z2;
dest[0] = 1 - (yy + zz);
dest[1] = xy - wz;
dest[2] = xz + wy;
dest[3] = 0;
dest[4] = xy + wz;
dest[5] = 1 - (xx + zz);
dest[6] = yz - wx;
dest[7] = 0;
dest[8] = xz - wy;
dest[9] = yz + wx;
dest[10] = 1 - (xx + yy);
dest[11] = 0;
dest[12] = 0;
dest[13] = 0;
dest[14] = 0;
dest[15] = 1;
return dest;

};
Quat4.slerp = function(quat, quat2, slerp, dest) {
if (!dest) {
dest = quat;

}

var cosHalfTheta=((((quat[0]) * (quat2[0])) + ((quat[1]) * (quat2[1]))) + ((quat[2]) * (quat2[2]))) + ((quat[3]) * (quat2[3]));
if ((Math.abs(cosHalfTheta)) >= 1) {
if (dest != quat) {
dest[0] = quat[0];
dest[1] = quat[1];
dest[2] = quat[2];
dest[3] = quat[3];

}

return dest;

}

var halfTheta=Math.acos(cosHalfTheta);
var sinHalfTheta=Math.sqrt(1 - (cosHalfTheta * cosHalfTheta));
if ((Math.abs(sinHalfTheta)) < 0.001) {
dest[0] = ((quat[0]) * 0.5) + ((quat2[0]) * 0.5);
dest[1] = ((quat[1]) * 0.5) + ((quat2[1]) * 0.5);
dest[2] = ((quat[2]) * 0.5) + ((quat2[2]) * 0.5);
dest[3] = ((quat[3]) * 0.5) + ((quat2[3]) * 0.5);
return dest;

}

var ratioA=(Math.sin((1 - slerp) * halfTheta)) / sinHalfTheta;
var ratioB=(Math.sin(slerp * halfTheta)) / sinHalfTheta;
dest[0] = ((quat[0]) * ratioA) + ((quat2[0]) * ratioB);
dest[1] = ((quat[1]) * ratioA) + ((quat2[1]) * ratioB);
dest[2] = ((quat[2]) * ratioA) + ((quat2[2]) * ratioB);
dest[3] = ((quat[3]) * ratioA) + ((quat2[3]) * ratioB);
return dest;

};
Quat4.str = function(quat) {
return ((((((("[" + (quat[0])) + ", ") + (quat[1])) + ", ") + (quat[2])) + ", ") + (quat[3])) + "]";

};
function vec3TransformCoord(v3fIn, m4fM, v3fOut) {
if (!v3fOut) {
v3fOut = Vec3.create();

}

var x, y, z, w;
x = ((((v3fIn[0]) * (m4fM[0])) + ((v3fIn[1]) * (m4fM[4]))) + ((v3fIn[2]) * (m4fM[8]))) + (m4fM[12]);
y = ((((v3fIn[0]) * (m4fM[1])) + ((v3fIn[1]) * (m4fM[5]))) + ((v3fIn[2]) * (m4fM[9]))) + (m4fM[13]);
z = ((((v3fIn[0]) * (m4fM[2])) + ((v3fIn[1]) * (m4fM[6]))) + ((v3fIn[2]) * (m4fM[10]))) + (m4fM[14]);
w = ((((v3fIn[0]) * (m4fM[3])) + ((v3fIn[1]) * (m4fM[7]))) + ((v3fIn[2]) * (m4fM[11]))) + (m4fM[15]);
v3fOut[0] = x / w;
v3fOut[1] = y / w;
v3fOut[2] = z / w;
return v3fOut;

}

;
Vec3.vec3TransformCoord = vec3TransformCoord;
function matrixPerspectiveFovRH(fFovy, fAspect, fZn, fZf, m4fOut) {
if (!m4fOut) {
m4fOut = Mat4.create();

}

var fYScale=1 / (Math.tan(fFovy / 2));
var fXScale=fYScale / fAspect;
m4fOut[0] = fXScale;
m4fOut[4] = 0;
m4fOut[8] = 0;
m4fOut[12] = 0;
m4fOut[1] = 0;
m4fOut[5] = fYScale;
m4fOut[9] = 0;
m4fOut[13] = 0;
m4fOut[2] = 0;
m4fOut[6] = 0;
m4fOut[10] = (fZf + fZn) / (fZn - fZf);
m4fOut[14] = ((fZn * fZf) * 2) / (fZn - fZf);
m4fOut[3] = 0;
m4fOut[7] = 0;
m4fOut[11] = -1;
m4fOut[15] = 0;
return m4fOut;

}

;
Mat4.matrixPerspectiveFovRH = matrixPerspectiveFovRH;
function matrixOrthoRH(fW, fH, fZn, fZf, m4fOut) {
if (!m4fOut) {
m4fOut = Mat4.create();

}

m4fOut[0] = 2 / fW;
m4fOut[4] = 0;
m4fOut[8] = 0;
m4fOut[12] = 0;
m4fOut[1] = 0;
m4fOut[5] = 2 / fH;
m4fOut[9] = 0;
m4fOut[13] = 0;
m4fOut[2] = 0;
m4fOut[6] = 0;
m4fOut[10] = 1 / (fZn - fZf);
m4fOut[14] = 0;
m4fOut[3] = 0;
m4fOut[7] = 0;
m4fOut[11] = fZn / (fZn - fZf);
m4fOut[15] = 1;
return m4fOut;

}

;
Mat4.matrixOrthoRH = matrixOrthoRH;
function matrixOrthoOffCenterRH(fL, fR, fB, fT, fZn, fZf, m4fOut) {
if (!m4fOut) {
m4fOut = Mat4.create();

}

var fRL=fR - fL;
var fTB=fT - FB;
var fFN=fZf - fZn;
m4fOut[0] = 2 / fRL;
m4fOut[4] = 0;
m4fOut[8] = 0;
m4fOut[12] = (-(fL + fR)) / fRL;
m4fOut[1] = 0;
m4fOut[5] = 2 / fTB;
m4fOut[9] = 0;
m4fOut[13] = (-(fT + fB)) / FTB;
m4fOut[2] = 0;
m4fOut[6] = 0;
m4fOut[10] = (-2) / fFN;
m4fOut[14] = (-(fZf + fZn)) / fFN;
m4fOut[3] = 0;
m4fOut[7] = 0;
m4fOut[11] = 0;
m4fOut[15] = 1;
return m4fOut;

}

;
Mat4.matrixOrthoOffCenterRH = matrixOrthoOffCenterRH;
function Ray2d() {
this.v2fPoint = Vec2.create();
this.v2fNormal = Vec2.create();

}

;
function Ray3d() {
this.v3fPoint = Vec3.create();
this.v3fNormal = Vec3.create();

}

;
function Segment2d() {
this.pRay = new Ray2d();
this.fDistance = 0;

}

;
Object.defineProperty(Segment2d.prototype, "point",  {set: function(v2fPoint) {
this.pRay.v2fPoint[0] = v2fPoint[0];
this.pRay.v2fPoint[1] = v2fPoint[1];

}
, get: function() {
return this.pRay.v2fPoint;

}
});
Object.defineProperty(Segment2d.prototype, "normal",  {set: function(v2fNormal) {
this.pRray.v2fNormal[0] = v2fNormal[0];
this.pRray.v2fNormal[1] = v2fNormal[1];

}
, get: function() {
return this.pRay.v2fNormal;

}
});
function Segment3d() {
this.pRay = new Ray3d();
this.fDistance = 0;

}

;
Object.defineProperty(Segment3d.prototype, "point",  {set: function(v3fPoint) {
this.pRay.v3fPoint[0] = v3fPoint[0];
this.pRay.v3fPoint[1] = v3fPoint[1];
this.pRay.v3fPoint[2] = v3fPoint[2];

}
, get: function() {
return this.pRay.v3fPoint;

}
});
Object.defineProperty(Segment3d.prototype, "normal",  {set: function(v3fNormal) {
this.pRay.v3fNormal[0] = v3fNormal[0];
this.pRay.v3fNormal[1] = v3fNormal[1];
this.pRay.v3fNormal[2] = v3fNormal[2];

}
, get: function() {
return this.pRay.v3fNormal;

}
});
function Circle() {
this.fRadius = 0;
this.v2fCenter = null;
switch(arguments.length) {
case 0:
this.v2fCenter = Vec2.create();
break ;

case 1:
this.v2fCenter = Vec2.create(arguments[0].v2fCenter);
this.fRadius = arguments[0].fRadius;
break ;

case 2:
this.v2fCenter = Vec2.create(arguments[0]);
this.fRadius = arguments[1];
break ;

case 3:
this.v2fCenter = Vec2.create();
this.v2fCenter[0] = arguments[0];
this.v2fCenter[1] = arguments[1];
this.fRadius = arguments[2];
break ;
}

}

;
Circle.prototype.isEqual = function(pCircle) {
;
return (Vec2.isEqual(this.v2fCenter, pCircle.v2fCenter)) && ((this.fRadius) == (pCircle.fRadius));

};
Circle.prototype.eq = function(pCircle) {
;
this.v2fCenter[0] = pCircle.v2fCenter[0];
this.v2fCenter[1] = pCircle.v2fCenter[1];
this.fRadius = pCircle.fRadius;

};
Circle.prototype.clear = function() {
;
Vec2.clear(this.v2fCenter);
this.fRadius = 0;

};
Circle.prototype.isClear = function() {
;
return (this.v2fCenter.isClear()) && (0 == (this.fRadius));

};
Circle.prototype.set = function() {
;
switch(arguments.length) {
case 1:
this.v2fCenter[0] = arguments[0].v2fCenter[0];
this.v2fCenter[1] = arguments[0].v2fCenter[1];
this.fRadius = arguments[0].fRadius;
break ;

case 2:
this.v2fCenter[0] = arguments[0][0];
this.v2fCenter[1] = arguments[0][1];
this.fRadius = arguments[1];
break ;

case 3:
this.v2fCenter[0] = arguments[0];
this.v2fCenter[1] = arguments[1];
this.fRadius = arguments[2];
break ;
}

};
Circle.prototype.isValid = function() {
;
return (this.fRadius) >= 0;

};
Circle.prototype.assertValid = function() {
;
if (!((this.fRadius) >= 0)) {
var err=((((((("Error:: " + "sphere inverted") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("sphere inverted");

}


}

;

};
Circle.prototype.offset = function(v2fOffset) {
;
Vec2.add(this.v2fCenter, v2fOffset);

};
Circle.prototype.expand = function(fInc) {
;
this.fRadius += fInc;

};
Circle.prototype.normalize = function() {
;
this.fRadius = Math.abs(this.fRadius);

};
function Sphere() {
this.fRadius = 0;
this.v3fCenter = null;
switch(arguments.length) {
case 0:
this.v3fCenter = Vec3.create();
break ;

case 1:
this.v3fCenter = Vec3.create(arguments[0].v3fCenter);
this.fRadius = arguments[0].fRadius;
break ;

case 2:
this.v3fCenter = Vec3.create(arguments[0]);
this.fRadius = arguments[1];
break ;

case 4:
this.v3fCenter = Vec3.create();
this.v3fCenter[0] = arguments[0];
this.v3fCenter[1] = arguments[1];
this.v3fCenter[2] = arguments[2];
this.fRadius = arguments[3];
break ;
}

}

;
Object.defineProperty(Sphere.prototype, "circle",  {set: function(pCircle) {
this.v3fCenter[0] = pCircle.v2fCenter[0];
this.v3fCenter[1] = pCircle.v2fCenter[1];
this.fRadius = pCircle.fRadius;

}
, get: function() {
return new Circle(this.v3fCenter[0], this.v3fCenter[1], this.fRadius);

}
});
Object.defineProperty(Sphere.prototype, "z",  {set: function(fZ) {
this.v3fCenter[2] = fZ;

}
, get: function() {
return this.v3fCenter[2];

}
});
Sphere.prototype.isEqual = function(pSphere) {
;
return (Vec3.isEqual(pSphere.v3fCenter, this.v3fCenter)) && ((this.fRadius) == (pSphere.fRadius));

};
Sphere.prototype.eq = function(pSphere) {
;
this.v3fCenter[0] = pSphere.v3fCenter[0];
this.v3fCenter[1] = pSphere.v3fCenter[1];
this.v3fCenter[2] = pSphere.v3fCenter[2];
this.fRadius = pSphere.fRadius;

};
Sphere.prototype.clear = function() {
;
Vec3.clear(this.v3fCenter);
this.fRadius = 0;

};
Sphere.prototype.isClear = function() {
;
return (Vec3.isClear(this.v3fCenter)) && (0 == (this.fRadius));

};
Sphere.prototype.set = function() {
;
switch(arguments.length) {
case 1:
this.v3fCenter[0] = arguments[0].v3fCenter[0];
this.v3fCenter[1] = arguments[0].v3fCenter[1];
this.v3fCenter[2] = arguments[0].v3fCenter[2];
this.fRadius = arguments[0].fRadius;
break ;

case 2:
this.v3fCenter[0] = arguments[0][0];
this.v3fCenter[1] = arguments[0][1];
this.v3fCenter[2] = arguments[0][2];
this.fRadius = arguments[1];
break ;

case 4:
this.v3fCenter[0] = arguments[0];
this.v3fCenter[1] = arguments[1];
this.v3fCenter[2] = arguments[2];
this.fRadius = arguments[3];
break ;
}

};
Sphere.prototype.isValid = function() {
;
return (this.fRadius) >= 0;

};
Sphere.prototype.assertValid = function() {
;
if (!((this.fRadius) >= 0)) {
var err=((((((("Error:: " + "sphere inverted") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("sphere inverted");

}


}

;

};
Sphere.prototype.offset = function(v3fOffset) {
;
Vec3.add(this.v3fCenter, v3fOffset);

};
Sphere.prototype.expand = function(fInc) {
;
this.fRadius += fInc;

};
Sphere.prototype.normalize = function() {
;
this.fRadius = Math.abs(this.fRadius);

};
function Plane2d() {
this.fDistance = 0;
this.v2fNormal = null;
switch(arguments.length) {
case 0:
this.v2fNormal = Vec2.create();
break ;

case 1:
this.v2fNormal = Vec2.create(arguments[0].v2fNormal);
this.fDistance = arguments[0].fDistance;
break ;

case 2:
if ((typeof (arguments[1])) == "number") {
this.v2fNormal = Vec2.create(arguments[0]);
this.fDistance = arguments[1];

}
else  {
this.v2fNormal = Vec2.create();
var vec0=Vec2.subtract(arguments[1], arguments[0], this.v2fNormal);
var x=vec0[0];
var y=vec0[1];
vec0[0] = -y;
vec0[1] = x;
this.fDistance = -(Vec2.dot(vec0, arguments[0]));

}

break ;
}

}

;
Plane2d.prototype.eq = function(pPlane) {
;
this.v2fNormal[0] = pPlane[0];
this.v2fNormal[1] = pPlane[1];
this.fDistance = pPlane.fDistance;

};
Plane2d.prototype.isEqual = function(pPlane) {
;
return (Vec2.isEqual(this.v2fNormal, pPlane.v2fNormal)) && ((this.fDistance) == (pPlane.fDistance));

};
Plane2d.prototype.solveForX = function(fY) {
;
if (this.v2fNormal[0]) {
return (-(((this.v2fNormal[1]) * fY) + (this.fDistance))) / (this.v2fNormal[0]);

}

return 0;

};
Plane2d.prototype.solveForY = function(fX) {
;
if (this.v2fNormal[1]) {
return (-(((this.v2fNormal[0]) * fX) + (this.fDistance))) / (this.v2fNormal[1]);

}

return 0;

};
Plane2d.prototype.projectPointToPlane = function(v2fPoint) {
;
var distance=(Vec2.dot(this.v2fNormal, v2fPoint)) + (this.fDistance);
var v2fRes=Vec2.create();
v2fRes[0] = ((this.v2fNormal[0]) * (-distance)) + (v2fPoint[0]);
v2fRes[1] = ((this.v2fNormal[1]) * (-distance)) + (v2fPoint[1]);
return v2fRes;

};
Plane2d.prototype.set = function(arg1, arg2) {
;
if ((typeof arg2) == "number") {
this.v2fNormal[0] = arg1[0];
this.v2fNormal[1] = arg1[1];
this.fDistance = arg2;

}
else  {
var line=Vec2.subtract(arg2, arg1, this.v2fNormal);
var x=line[0];
var y=line[1];
line[0] = -y;
line[1] = x;
this.fDistance = -(Vec2.dot(line, arg1));

}


};
Plane2d.prototype.signedDistance = function(v2fPoint) {
return (Vec2.dot(this.v2fNormal, v2fPoint)) + (this.fDistance);

};
function Plane3d() {
this.fDistance = 0;
this.v3fNormal = null;
switch(arguments.length) {
case 0:
this.v3fNormal = Vec3.create();
break ;

case 1:
this.v3fNormal[0] = arguments[0].v3fNormal[0];
this.v3fNormal[1] = arguments[0].v3fNormal[1];
this.v3fNormal[2] = arguments[0].v3fNormal[2];
this.fDistance = arguments[0].fDistance;
break ;

case 2:
if ((typeof (arguments[1])) == "number") {
this.v3fNormal = Vec3.create();
this.v3fNormal[0] = arguments[0][0];
this.v3fNormal[1] = arguments[0][1];
this.v3fNormal[2] = arguments[0][2];
this.fDistance = arguments[1];

}
else  {
this.v3fNormal = Vec3.create(arguments[1]);
this.fDistance = -(Vec3.dot(arguments[0], arguments[1]));

}

break ;

case 3:
var sideA=Vec3.create();
var sideB=Vec3.create();
Vec3.subtract(arguments[1], arguments[0], sideA);
Vec3.subtract(arguments[2], arguments[0], sideB);
Vec3.cross(sideB, sideA);
Vec3.normalize(sideB);
this.v3fNormal = Vec3.create(sideB);
this.fDistance = -(Vec3.dot(this.v3fNormal, arguments[0]));
break ;
}

}

;
Plane3d.prototype.eq = function(pPlane) {
;
this.v3fNormal[0] = pPlane.v3fNormal[0];
this.v3fNormal[1] = pPlane.v3fNormal[1];
this.v3fNormal[2] = pPlane.v3fNormal[2];
this.fDistance = pPlane.fDistance;

};
Plane3d.prototype.isEqual = function(pPlane) {
;
return (Vec3.isEqual(this.v3fNormal, pPlane.v3fNormal)) && ((this.fDistance) == (pPlane.fDistance));

};
Plane3d.prototype.normalize = function() {
;
var len=1 / (Vec3.length(this.v3fNormal));
Vec3.scale(this.v3fNormal, len);
this.fDistance *= len;

};
Plane3d.prototype.solveForX = function(fY, fZ) {
;
if (this.v3fNormal[0]) {
return (-((((this.v3fNormal[1]) * fY) + ((this.v3fNormal[2]) * fZ)) + (this.fDistance))) / (this.v3fNormal[0]);

}

return 0;

};
Plane3d.prototype.solveForY = function(fX, fZ) {
;
if (this.v3fNormal[1]) {
return (-((((this.v3fNormal[0]) * fX) + ((this.v3fNormal[2]) * fZ)) + (this.fDistance))) / (this.v3fNormal[1]);

}

return 0;

};
Plane3d.prototype.solveForZ = function(fX, fY) {
;
if (this.v3fNormal[2]) {
return (-((((this.v3fNormal[1]) * fY) + ((this.v3fNormal[0]) * fX)) + (this.fDistance))) / (this.v3fNormal[2]);

}

return 0;

};
Plane3d.prototype.projectPointToPlane = function(v3fPoint) {
;
var distance=(Vec3.dot(this.v3fNormal, v3fPoint)) + (this.fDistance);
var v3fRes=Vec3.create();
v3fRes[0] = ((this.v3fNormal[0]) * (-distance)) + (v3fPoint[0]);
v3fRes[1] = ((this.v3fNormal[1]) * (-distance)) + (v3fPoint[1]);
v3fRes[2] = ((this.v3fNormal[2]) * (-distance)) + (v3fPoint[2]);
return v3fRes;

};
Plane3d.prototype.set = function() {
;
switch(arguments.length) {
case 2:
if ((typeof (arguments[1])) == "number") {
this.v3fNormal[0] = arguments[0][0];
this.v3fNormal[1] = arguments[0][1];
this.v3fNormal[2] = arguments[0][2];
this.fDistance = arguments[1];

}
else  {
this.v3fNormal[0] = arguments[1][0];
this.v3fNormal[1] = arguments[1][1];
this.v3fNormal[2] = arguments[1][2];
this.fDistance = -(Vec3.dot(this.v3fNormal, arguments[0]));

}

break ;

case 3:
var sideA=Vec3.create();
var sideB=this.v3fNormal;
Vec3.subtract(arguments[1], arguments[0], sideA);
Vec3.subtract(arguments[2], arguments[0], sideB);
Vec3.cross(sideB, sideA);
Vec3.normalize(sideB);
this.fDistance = -(Vec3.dot(this.v3fNormal, arguments[0]));
break ;
}

};
Plane3d.prototype.xForm = function(m4fMatrix) {
;
Vec3.vec3TransformCoord(this.v3fNormal, m4fMatrix, this.v3fNormal);
Vec3.normalize(this.v3fNormal);
var point=Vec3.create();
Vec3.scale(this.v3fNormal, this.fDistance, point);
Vec3.vec3TransformCoord(point, m4fMatrix, point);
this.fDistance = -(Vec3.dot(point, this.v3fNormal));

};
Plane3d.prototype.signedDistance = function(v3fPoint) {
;
return (Vec3.dot(this.v3fNormal, v3fPoint)) + (this.fDistance);

};
function Rect2d() {
this.fX0 = 0;
this.fX1 = 0;
this.fY0 = 0;
this.fY1 = 0;
switch(arguments.length) {
case 1:
if ((arguments[0]) instanceof Rect2d) {
this.fX0 = arguments[0].fX0;
this.fX1 = arguments[0].fX1;
this.fX0 = arguments[0].fY0;
this.fX1 = arguments[0].fY1;

}
else  {
this.fX1 = (arguments[0][0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[0][1]) * 0.5;
this.fY0 = -(this.fY1);

}

break ;

case 2:
this.fX1 = (arguments[0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[1]) * 0.5;
this.fY0 = -(this.fY1);
break ;

case 4:
this.fX0 = arguments[0];
this.fX1 = arguments[1];
this.fY0 = arguments[2];
this.fY1 = arguments[3];
break ;
}

}

;
Rect2d.prototype.isEqual = function(pRect) {
return ((((this.fX0) == (pRect.fX0)) && ((this.fX1) == (pRect.fX1))) && ((this.fY0) == (pRect.fY0))) && ((this.fY1) == (pRect.fY1));

};
Rect2d.prototype.eq = function(pRect) {
this.fX0 = pRect.fX0;
this.fX1 = pRect.fX1;
this.fY0 = pRect.fY0;
this.fY1 = pRect.fY1;

};
Rect2d.prototype.addSelf = function(value) {
if ((typeof value) == "number") {
this.fX0 += value;
this.fX1 += value;
this.fY0 += value;
this.fY1 += value;

}
else  {
this.fX0 += value[0];
this.fX1 += value[0];
this.fY0 += value[1];
this.fY1 += value[1];

}


};
Rect2d.prototype.neg = function() {
return new Rect2d(-(this.fX0), -(this.fX1), -(this.fY0), -(this.fY1));

};
Rect2d.prototype.subSelf = function(value) {
if ((typeof value) == "number") {
this.fX0 -= value;
this.fX1 -= value;
this.fY0 -= value;
this.fY1 -= value;

}
else  {
this.fX0 -= value[0];
this.fX1 -= value[0];
this.fY0 -= value[1];
this.fY1 -= value[1];

}


};
Rect2d.prototype.divSelf = function(value) {
if ((typeof value) == "number") {
if (!(value != 0)) {
var err=((((((("Error:: " + "divide by zero error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("divide by zero error");

}


}

;
this.fX0 /= value;
this.fX1 /= value;
this.fY0 /= value;
this.fY1 /= value;

}
else  {
if (!((value[0]) != 0)) {
var err=((((((("Error:: " + "divide by zero error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("divide by zero error");

}


}

;
if (!((value[1]) != 0)) {
var err=((((((("Error:: " + "divide by zero error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("divide by zero error");

}


}

;
this.fX0 /= value[0];
this.fX1 /= value[0];
this.fY0 /= value[1];
this.fY1 /= value[1];

}


};
Rect2d.prototype.multSelf = function(value) {
if ((typeof value) == "number") {
this.fX0 *= value;
this.fX1 *= value;
this.fY0 *= value;
this.fY1 *= value;

}
else  {
this.fX0 *= value[0];
this.fX1 *= value[0];
this.fY0 *= value[1];
this.fY1 *= value[1];

}


};
Rect2d.prototype.clear = function() {
this.fX0 = 0;
this.fX1 = 0;
this.fY0 = 0;
this.fY1 = 0;

};
Rect2d.prototype.isClear = function() {
return (((0 == (this.fX0)) && (0 == (this.fX1))) && (0 == (this.fY0))) && (0 == (this.fY1));

};
Rect2d.prototype.set = function() {
switch(arguments.length) {
case 1:
if ((arguments[0]) instanceof Rect2d) {
this.fX0 = arguments[0].fX0;
this.fX1 = arguments[0].fX1;
this.fY0 = arguments[0].fY0;
this.fY1 = arguments[0].fY1;

}
else  {
this.fX1 = (arguments[0][0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[0][1]) * 0.5;
this.fY0 = -(this.fY1);

}

break ;

case 2:
this.fX1 = (arguments[0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[1]) * 0.5;
this.fY0 = -(this.fY1);
break ;

case 4:
this.fX0 = arguments[0];
this.fX1 = arguments[1];
this.fY0 = arguments[2];
this.fY1 = arguments[3];
break ;
}

};
Rect2d.prototype.setFloor = function(pRect) {
this.fX0 = Math.floor(pRect.fX0);
this.fX1 = Math.floor(pRect.fX1);
this.fY0 = Math.floor(pRect.fY0);
this.fY1 = Math.floor(pRect.fY1);

};
Rect2d.prototype.setCeiling = function(pRect) {
this.fX0 = Math.ceil(pRect.fX0);
this.fX1 = Math.ceil(pRect.fX1);
this.fY0 = Math.ceil(pRect.fY0);
this.fY1 = Math.ceil(pRect.fY1);

};
Rect2d.prototype.isValid = function() {
return ((this.fX0) <= (this.fX1)) && ((this.fY0) <= (this.fY1));

};
Rect2d.prototype.assertValid = function() {
if (!((this.fX0) <= (this.fX1))) {
var err=((((((("Error:: " + "rectangle inverted on X axis") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("rectangle inverted on X axis");

}


}

;
if (!((this.fY0) <= (this.fY1))) {
var err=((((((("Error:: " + "rectangle inverted on Y axis") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("rectangle inverted on Y axis");

}


}

;

};
Rect2d.prototype.resizeX = function(fSize) {
this.fX1 = (((this.fX1) + (this.fX0)) + fSize) * 0.5;
this.fX0 = (this.fX1) - fSize;

};
Rect2d.prototype.resizeY = function(fSize) {
this.fY1 = (((this.fY1) + (this.fY0)) + fSize) * 0.5;
this.fY0 = (this.fY1) - fSize;

};
Rect2d.prototype.resize = function(v2fSize) {
this.fX1 = (((this.fX1) + (this.fX0)) + (v2fSize[0])) * 0.5;
this.fX0 = (this.fX1) - (v2fSize[0]);
this.fY1 = (((this.fY1) + (this.fY0)) + (v2fSize[1])) * 0.5;
this.fY0 = (this.fY1) - (v2fSize[1]);

};
Rect2d.prototype.resizeMaxX = function(fSpan) {
this.fX1 = (this.fX0) + fSpan;

};
Rect2d.prototype.resizeMaxY = function(fSpan) {
this.fY1 = (this.fY0) + fSpan;

};
Rect2d.prototype.resizeMax = function(v2fSize) {
this.fX1 = (this.fX0) + (v2fSize[0]);
this.fY1 = (this.fY0) + (v2fSize[1]);

};
Rect2d.prototype.resizeMinX = function(fSpan) {
this.fX0 = (this.fX1) - fSpan;

};
Rect2d.prototype.resizeMinY = function(fSpan) {
this.fY0 = (this.fY1) - fSpan;

};
Rect2d.prototype.resizeMin = function(v2fSize) {
this.fX0 = (this.fX1) - (v2fSize[0]);
this.fY0 = (this.fY1) - (v2fSize[1]);

};
Rect2d.prototype.midX = function() {
return ((this.fX0) + (this.fX1)) * 0.5;

};
Rect2d.prototype.midY = function() {
return ((this.fY0) + (this.fY1)) * 0.5;

};
Rect2d.prototype.midpoint = function() {
var v2fPoint=Vec2.create();
v2fPoint[0] = ((this.fX0) + (this.fX1)) * 0.5;
v2fPoint[1] = ((this.fY0) + (this.fY1)) * 0.5;
return v2fPoint;

};
Rect2d.prototype.sizeX = function() {
return (this.fX1) - (this.fX0);

};
Rect2d.prototype.sizeY = function() {
return (this.fY1) - (this.fY0);

};
Rect2d.prototype.size = function() {
var v2fSize=Vec2.create();
v2fSize[0] = (this.fX1) - (this.fX0);
v2fSize[1] = (this.fY1) - (this.fY0);
return v2fSize;

};
Rect2d.prototype.minPoint = function() {
var v2fPoint=Vec2.create();
v2fPoint[0] = this.fX0;
v2fPoint[1] = this.fY0;
return v2fPoint;

};
Rect2d.prototype.maxPoint = function() {
var v2fPoint=Vec2.create();
v2fPoint[0] = this.fX1;
v2fPoint[1] = this.fY1;
return v2fPoint;

};
Rect2d.prototype.area = function() {
return ((this.fX1) - (this.fX0)) * ((this.fY1) - (this.fY0));

};
Rect2d.prototype.unionPoint = function(v2fPoint) {
this.fX0 = Math.min(this.fX0, point[0]);
this.fY0 = Math.min(this.fY0, point[1]);
this.fX1 = Math.max(this.fX1, point[0]);
this.fY1 = Math.max(this.fY1, point[1]);

};
Rect2d.prototype.unionRect = function(pRect) {
this.assertValid();
pRect.assertValid();
this.fX0 = Math.min(this.fX0, pRect.fX0);
this.fY0 = Math.min(this.fY0, pRect.fY0);
this.fX1 = Math.max(this.fX1, pRect.fX1);
this.fY1 = Math.max(this.fY1, pRect.fY1);

};
Rect2d.prototype.offset = function(v2fOffset) {
this.fX0 += offset[0];
this.fX1 += offset[0];
this.fY0 += offset[1];
this.fY1 += offset[1];

};
Rect2d.prototype.expand = function(value) {
if ((typeof value) == "number") {
this.fX0 -= value;
this.fX1 += value;
this.fY0 -= value;
this.fY1 += value;

}
else  {
this.fX0 -= value[0];
this.fX1 += value[0];
this.fY0 -= value[1];
this.fY1 += value[1];

}


};
Rect2d.prototype.expandX = function(fN) {
this.fX0 -= fN;
this.fX1 += fN;

};
Rect2d.prototype.expandY = function(fN) {
this.fY0 -= fN;
this.fY1 += fN;

};
Rect2d.prototype.normalize = function() {
var temp;
if ((this.fX0) > (this.fX1)) {
temp = this.fX0;
this.fX0 = this.fX1;
this.fX1 = temp;

}

if ((this.fY0) > (this.fY1)) {
temp = this.fY0;
this.fY0 = this.fY1;
this.fY1 = temp;

}


};
Rect2d.prototype.corner = function(index) {
if (!((index >= 0) && (index < 4))) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
var v2fPoint=Vec2.create();
v2fPoint[0] = (index & 1? this.fX0 : this.fX1);
v2fPoint[1] = (index & 2? this.fY0 : this.fY1);
return v2fPoint;

};
Rect2d.prototype.isPointInRect = function(v2fPoint) {
return ((((v2fPoint[0]) >= (this.fX0)) && ((v2fPoint[1]) >= (this.fY0))) && ((v2fPoint[0]) <= (Rect3d.fX1))) && ((v2fPoint[1]) <= (this.fY1));

};
Rect2d.prototype.createBoundingCircle = function() {
return new Circle(((this.fX0) + (this.fX1)) * 0.5, ((this.fY0) + (this.fY1)) * 0.5, ((((this.fX1) - (this.fX0)) + (this.fY1)) - (this.fY0)) * 0.5);

};
function Rect3d() {
this.fX0 = 0;
this.fX1 = 0;
this.fY0 = 0;
this.fY1 = 0;
this.fZ0 = 0;
this.fZ1 = 0;
switch(arguments.length) {
case 1:
if ((arguments[0]) instanceof Rect3d) {
this.fX0 = arguments[0].fX0;
this.fX1 = arguments[0].fX1;
this.fY0 = arguments[0].fY0;
this.fY1 = arguments[0].fY1;
this.fZ0 = arguments[0].fZ0;
this.fZ1 = arguments[0].fZ1;

}
else  {
this.fX1 = (arguments[0][0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[0][1]) * 0.5;
this.fY0 = -(this.fY1);
this.fZ1 = (arguments[0][2]) * 0.5;
this.fZ0 = -(this.fZ1);

}

break ;

case 3:
this.fX1 = (arguments[0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[1]) * 0.5;
this.fY0 = -(this.fY1);
this.fZ1 = (arguments[2]) * 0.5;
this.fZ0 = -(this.fZ1);
break ;

case 6:
this.fX0 = arguments[0];
this.fX1 = arguments[1];
this.fY0 = arguments[2];
this.fY1 = arguments[3];
this.fZ0 = arguments[4];
this.fZ1 = arguments[5];
break ;
}

}

;
Object.defineProperty(Rect3d.prototype, "pRect2d",  {set: function(pRect2d) {
this.fX0 = pRect2d.fX0;
this.fX1 = pRect2d.fX1;
this.fY0 = pRect2d.fY0;
this.fY1 = pRect2d.fY1;

}
, get: function() {
return new Rect2d(this.fX0, this.fX1, this.fY0, this.fY1);

}
});
Rect3d.prototype.isEqual = function(pRect) {
return ((((((this.fX0) == (pRect.fX0)) && ((this.fX1) == (pRect.fX1))) && ((this.fY0) == (pRect.fY0))) && ((this.fY1) == (pRect.fY1))) && ((this.fZ0) == (pRect.fZ0))) && ((this.fZ1) == (pRect.fZ1));

};
Rect3d.prototype.eq = function(pRect) {
this.fX0 = pRect.fX0;
this.fX1 = pRect.fX1;
this.fY0 = pRect.fY0;
this.fY1 = pRect.fY1;
this.fZ0 = pRect.fZ0;
this.fZ1 = pRect.fZ1;

};
Rect2d.prototype.neg = function() {
return new Rect2d(-(this.fX0), -(this.fX1), -(this.fY0), -(this.fY1), -(this.fZ0), -(this.fZ1));

};
Rect3d.prototype.addSelf = function(value) {
if ((typeof value) == "number") {
this.fX0 += value;
this.fX1 += value;
this.fY0 += value;
this.fY1 += value;
this.fZ0 += value;
this.fZ1 += value;

}
else  {
this.fX0 += value[0];
this.fX1 += value[0];
this.fY0 += value[1];
this.fY1 += value[1];
this.fZ0 += value[2];
this.fZ1 += value[2];

}


};
Rect3d.prototype.subSelf = function(value) {
if ((typeof value) == "number") {
this.fX0 -= value;
this.fX1 -= value;
this.fY0 -= value;
this.fY1 -= value;
this.fZ0 -= value;
this.fZ1 -= value;

}
else  {
this.fX0 -= value[0];
this.fX1 -= value[0];
this.fY0 -= value[1];
this.fY1 -= value[1];
this.fZ0 -= value[2];
this.fZ1 -= value[2];

}


};
Rect3d.prototype.divSelf = function(value) {
if ((typeof value) == "number") {
if (!(value != 0)) {
var err=((((((("Error:: " + "divide by zero error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("divide by zero error");

}


}

;
this.fX0 /= value;
this.fX1 /= value;
this.fY0 /= value;
this.fY1 /= value;
this.fZ0 /= value;
this.fZ1 /= value;

}
else  {
if (!((value[0]) != 0)) {
var err=((((((("Error:: " + "divide by zero error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("divide by zero error");

}


}

;
if (!((value[1]) != 0)) {
var err=((((((("Error:: " + "divide by zero error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("divide by zero error");

}


}

;
if (!((value[2]) != 0)) {
var err=((((((("Error:: " + "divide by zero error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("divide by zero error");

}


}

;
this.fX0 /= value[0];
this.fX1 /= value[0];
this.fY0 /= value[1];
this.fY1 /= value[1];
this.fZ0 /= value[2];
this.fZ1 /= value[2];

}


};
Rect3d.prototype.multSelf = function(value) {
if ((typeof value) == "number") {
this.fX0 *= value;
this.fX1 *= value;
this.fY0 *= value;
this.fY1 *= value;
this.fZ0 *= value;
this.fZ1 *= value;

}
else  {
this.fX0 *= value[0];
this.fX1 *= value[0];
this.fY0 *= value[1];
this.fY1 *= value[1];
this.fZ0 *= value[2];
this.fZ1 *= value[2];

}


};
Rect3d.prototype.clear = function() {
this.fX0 = 0;
this.fX1 = 0;
this.fY0 = 0;
this.fY1 = 0;
this.fZ0 = 0;
this.fZ1 = 0;

};
Rect3d.prototype.isClear = function() {
return (((((0 == (this.fX0)) && (0 == (this.fX1))) && (0 == (this.fY0))) && (0 == (this.fY1))) && (0 == (this.fZ0))) && (0 == (this.fZ1));

};
Rect3d.prototype.set = function() {
switch(arguments.length) {
case 1:
if ((arguments[0]) instanceof Rect3d) {
this.fX0 = arguments[0].fX0;
this.fX1 = arguments[0].fX1;
this.fY0 = arguments[0].fY0;
this.fY1 = arguments[0].fY1;
this.fZ0 = arguments[0].fZ0;
this.fZ1 = arguments[0].fZ1;

}
else  {
this.fX1 = (arguments[0][0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[0][1]) * 0.5;
this.fY0 = -(this.fY1);
this.fZ1 = (arguments[0][2]) * 0.5;
this.fZ0 = -(this.fZ1);

}

break ;

case 3:
this.fX1 = (arguments[0]) * 0.5;
this.fX0 = -(this.fX1);
this.fY1 = (arguments[1]) * 0.5;
this.fY0 = -(this.fY1);
this.fZ1 = (arguments[2]) * 0.5;
this.fZ0 = -(this.fZ1);
break ;

case 6:
this.fX0 = arguments[0];
this.fX1 = arguments[1];
this.fY0 = arguments[2];
this.fY1 = arguments[3];
this.fZ0 = arguments[4];
this.fZ1 = arguments[5];
break ;
}

};
Rect3d.prototype.setFloor = function(pRect) {
this.fX0 = Math.floor(pRect.fX0);
this.fX1 = Math.floor(pRect.fX1);
this.fY0 = Math.floor(pRect.fY0);
this.fY1 = Math.floor(pRect.fY1);
this.fZ0 = Math.floor(pRect.fZ0);
this.fZ1 = Math.floor(pRect.fZ1);

};
Rect3d.prototype.setCeiling = function(pRect) {
this.fX0 = Math.ceil(pRect.fX0);
this.fX1 = Math.ceil(pRect.fX1);
this.fY0 = Math.ceil(pRect.fY0);
this.fY1 = Math.ceil(pRect.fY1);
this.fZ0 = Math.ceil(pRect.fZ0);
this.fZ1 = Math.ceil(pRect.fZ1);

};
Rect3d.prototype.isValid = function() {
return (((this.fX0) <= x1) && ((this.fY0) <= y1)) && ((this.fZ0) <= z1);

};
Rect3d.prototype.assertValid = function() {
if (!((this.fX0) <= (this.fX1))) {
var err=((((((("Error:: " + "rectangle inverted on X axis") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("rectangle inverted on X axis");

}


}

;
if (!((this.fY0) <= (this.fY1))) {
var err=((((((("Error:: " + "rectangle inverted on Y axis") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("rectangle inverted on Y axis");

}


}

;
if (!((this.fZ0) <= (this.fZ1))) {
var err=((((((("Error:: " + "rectangle inverted on Z axis") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("rectangle inverted on Z axis");

}


}

;

};
Rect3d.prototype.resizeX = function(fSize) {
this.fX1 = (((this.fX0) + (this.fX1)) + fSize) * 0.5;
this.fX0 = (this.fX1) - fSize;

};
Rect3d.prototype.resizeY = function(fSize) {
this.fY1 = (((this.fY0) + (this.fY1)) + fSize) * 0.5;
this.fY0 = (this.fY1) - fSize;

};
Rect3d.prototype.resizeZ = function(fSize) {
this.fZ1 = (((this.fZ0) + (this.fZ1)) + fSize) * 0.5;
this.fZ0 = (this.fZ1) - fSize;

};
Rect3d.prototype.resize = function(v3fSize) {
this.fX1 = (((this.fX0) + (this.fX1)) + (v3fSize[0])) * 0.5;
this.fX0 = (this.fX1) - (v2fSize[0]);
this.fY1 = (((this.fY0) + (this.fY1)) + (v3fSize[1])) * 0.5;
this.fY0 = (this.fY1) - (v2fSize[1]);
this.fZ1 = (((this.fZ0) + (this.fZ1)) + (v3fSize[2])) * 0.5;
this.fZ0 = (this.fZ1) - fSize;

};
Rect3d.prototype.resizeMaxX = function(fSpan) {
this.fX1 = (this.fX0) + fSpan;

};
Rect3d.prototype.resizeMaxY = function(fSpan) {
this.fY1 = (this.fY0) + fSpan;

};
Rect3d.prototype.resizeMaxZ = function(fSpan) {
this.fZ1 = (this.fZ0) + fSpan;

};
Rect3d.prototype.resizeMax = function(v3fSize) {
this.fX1 = (this.fX0) + (v3fSize[0]);
this.fY1 = (this.fY0) + (v3fSize[1]);
this.fZ1 = (this.fZ0) + (v3fSize[2]);

};
Rect3d.prototype.resizeMinX = function(fSpan) {
this.fX0 = (this.fX1) - fSpan;

};
Rect3d.prototype.resizeMinY = function(fSpan) {
this.fY0 = (this.fY1) - fSpan;

};
Rect3d.prototype.resizeMinZ = function(fSpan) {
this.fZ0 = (this.fZ1) - fSpan;

};
Rect3d.prototype.resizeMin = function(v3fSize) {
this.fX0 = (this.fX1) - (v3fSize[0]);
this.fY0 = (this.fY1) - (v3fSize[1]);
this.fZ0 = (this.fZ1) - (v3fSize[2]);

};
Rect3d.prototype.midX = function() {
return ((this.fX0) + (this.fX1)) * 0.5;

};
Rect3d.prototype.midY = function() {
return ((this.fY0) + (this.fY1)) * 0.5;

};
Rect3d.prototype.midZ = function() {
return ((this.fZ0) + (this.fZ1)) * 0.5;

};
Rect3d.prototype.midPoint = function() {
var vec=Vec3.create();
vec[0] = (((this.fX0) + (this.fX1)) * 0.5);
vec[1] = (((this.fY0) + (this.fY1)) * 0.5);
vec[2] = (((this.fZ0) + (this.fZ1)) * 0.5);
return vec;

};
Rect3d.prototype.sizeX = function() {
return (this.fX1) - (this.fX0);

};
Rect3d.prototype.sizeY = function() {
return (this.fY1) - (this.fY0);

};
Rect3d.prototype.sizeZ = function() {
return (this.fZ1) - (this.fZ0);

};
Rect3d.prototype.size = function() {
var vec=Vec3.create();
vec[0] = ((this.fX1) - (this.fX0));
vec[1] = ((this.fY1) - (this.fY0));
vec[2] = ((this.fZ1) - (this.fZ0));
return vec;

};
Rect3d.prototype.minPoint = function() {
var vec=Vec3.create();
vec[0] = this.fX0;
vec[1] = this.fY0;
vec[2] = this.fZ0;
return vec;

};
Rect3d.prototype.maxPoint = function() {
var vec=Vec3.create();
vec[0] = this.fX1;
vec[1] = this.fY1;
vec[2] = this.fZ1;
return vec;

};
Rect3d.prototype.area = function() {
return (((this.fX1) - (this.fX0)) * ((this.fY1) - (this.fY0))) * ((this.fZ1) - (this.fZ0));

};
Rect3d.prototype.unionPoint = function(v3fPoint) {
this.fX0 = Math.min(this.fX0, v3fPoint[0]);
this.fY0 = Math.min(this.fY0, v3fPoint[1]);
this.fZ0 = Math.min(this.fZ0, v3fPoint[2]);
this.fX1 = Math.max(this.fX1, v3fPoint[0]);
this.fY1 = Math.max(this.fY1, v3fPoint[1]);
this.fZ1 = Math.max(this.fZ1, v3fPoint[2]);

};
Rect3d.prototype.unionRect = function(pRect) {
this.assertValid();
pRect.assertValid();
this.fX0 = Math.min(this.fX0, pRect.fX0);
this.fY0 = Math.min(this.fY0, pRect.fY0);
this.fZ0 = Math.min(this.fZ0, pRect.fZ0);
this.fX1 = Math.max(this.fX1, pRect.fX1);
this.fY1 = Math.max(this.fY1, pRect.fY1);
this.fZ1 = Math.max(this.fZ1, pRect.fZ1);

};
Rect3d.prototype.offset = function(v3fOffset) {
this.fX0 += offset[0];
this.fX1 += offset[0];
this.fY0 += offset[1];
this.fY1 += offset[1];
this.fZ0 += offset[2];
this.fZ1 += offset[2];

};
Rect3d.prototype.expand = function(value) {
if ((typeof value) == "number") {
this.fX0 -= value;
this.fX1 += value;
this.fY0 -= value;
this.fY1 += value;
this.fZ0 -= value;
this.fZ1 += value;

}
else  {
this.fX0 -= value[0];
this.fX1 += value[0];
this.fY0 -= value[1];
this.fY1 += value[1];
this.fZ0 -= value[2];
this.fZ1 += value[2];

}


};
Rect3d.prototype.expandX = function(fN) {
this.fX0 -= fN;
this.fX1 += fN;

};
Rect3d.prototype.expandY = function(fN) {
this.fY0 -= fN;
this.fY1 += fN;

};
Rect3d.prototype.expandZ = function(fN) {
this.fZ0 -= fN;
this.fZ1 += fN;

};
Rect3d.prototype.normalize = function() {
var temp;
if ((this.fX0) > (this.fX1)) {
temp = this.fX0;
this.fX0 = this.fX1;
this.fX1 = temp;

}

if ((this.fY0) > (this.fY1)) {
temp = this.fY0;
this.fY0 = this.fY1;
this.fY1 = temp;

}

if ((this.fZ0) > (this.fZ1)) {
temp = this.fZ0;
this.fZ0 = this.fZ1;
this.fZ1 = temp;

}


};
Rect3d.prototype.corner = function(index) {
if (!((index >= 0) && (index < 8))) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
return Vector.create([(index & 1? this.fX0 : this.fX1), (index & 2? this.fY0 : this.fY1), (index & 4? this.fZ0 : this.fZ1)]);

};
Rect3d.prototype.unionPointCoord = function(fX, fY, fZ) {
this.fX0 = Math.min(this.fX0, fX);
this.fY0 = Math.min(this.fY0, fY);
this.fZ0 = Math.min(this.fZ0, fZ);
this.fX1 = Math.max(this.fX1, fX);
this.fY1 = Math.max(this.fY1, fY);
this.fZ1 = Math.max(this.fZ1, fZ);

};
Rect3d.prototype.transform = function(m4fMatrix) {
var x0, y0, z0;
var x1, y1, z1;
var x2, y2, z2;
var x3, y3, z3;
var fX0=this.fX0, fX1=this.fX1, fY0=this.fX0, fY1=this.fY1, fZ0=this.fZ0, fZ1=this.fZ1;
var m11=m4fMatrix[0], m12=m4fMatrix[4], m13=m4fMatrix[8], m14=m4fMatrix[12];
var m21=m4fMatrix[1], m22=m4fMatrix[5], m23=m4fMatrix[9], m24=m4fMatrix[13];
var m31=m4fMatrix[2], m32=m4fMatrix[6], m33=m4fMatrix[10], m34=m4fMatrix[14];
x0 = (((m11 * fX0) + (m12 * fY0)) + (m13 * fZ0)) + m14;
y0 = (((m21 * fX0) + (m22 * fY0)) + (m23 * fZ0)) + m24;
z0 = (((m31 * fX0) + (m32 * fY0)) + (m33 * fZ0)) + m34;
x1 = (((m11 * fX1) + (m12 * fY0)) + (m13 * fZ0)) + m14;
y1 = (((m21 * fX1) + (m22 * fY0)) + (m23 * fZ0)) + m24;
z1 = (((m31 * fX1) + (m32 * fY0)) + (m33 * fZ0)) + m34;
x2 = (((m11 * fX0) + (m12 * fY1)) + (m13 * fZ0)) + m14;
y2 = (((m21 * fX0) + (m22 * fY1)) + (m23 * fZ0)) + m24;
z2 = (((m31 * fX0) + (m32 * fY1)) + (m33 * fZ0)) + m34;
x3 = (((m11 * fX0) + (m12 * fY0)) + (m13 * fZ1)) + m14;
y3 = (((m21 * fX0) + (m22 * fY0)) + (m23 * fZ1)) + m24;
z3 = (((m31 * fX0) + (m32 * fY0)) + (m33 * fZ1)) + m34;
x1 -= x0;
y1 -= y0;
z1 -= z0;
x2 -= x0;
y2 -= y0;
z2 -= z0;
x3 -= x0;
y3 -= y0;
z3 -= z0;
var maxX=0, minX=0, maxY=0, minY=0, maxZ=0, minZ=0;
var tX, tY, tZ;
if (x1 > maxX) {
maxX = x1;

}
else if (x1 < minX) {
minX = x1;

}


;
if (y1 > maxY) {
maxY = y1;

}
else if (y1 < minY) {
minY = y1;

}


;
if (z1 > maxZ) {
maxZ = z1;

}
else if (z1 < minZ) {
minZ = z1;

}


;
if (x2 > maxX) {
maxX = x2;

}
else if (x2 < minX) {
minX = x2;

}


;
if (y2 > maxY) {
maxY = y2;

}
else if (y2 < minY) {
minY = y2;

}


;
if (z2 > maxZ) {
maxZ = z2;

}
else if (z2 < minZ) {
minZ = z2;

}


;
if (x3 > maxX) {
maxX = x3;

}
else if (x3 < minX) {
minX = x3;

}


;
if (y3 > maxY) {
maxY = y3;

}
else if (y3 < minY) {
minY = y3;

}


;
if (z3 > maxZ) {
maxZ = z3;

}
else if (z3 < minZ) {
minZ = z3;

}


;
tX = x1 + x2, tY = y1 + y2, tZ = z1 + z2;
if (tX > maxX) {
maxX = tX;

}
else if (tX < minX) {
minX = tX;

}


;
if (tY > maxY) {
maxY = tY;

}
else if (tY < minY) {
minY = tY;

}


;
if (tZ > maxZ) {
maxZ = tZ;

}
else if (tZ < minZ) {
minZ = tZ;

}


;
tX = x1 + x3, tY = y1 + y3, tZ = z1 + z3;
if (tX > maxX) {
maxX = tX;

}
else if (tX < minX) {
minX = tX;

}


;
if (tY > maxY) {
maxY = tY;

}
else if (tY < minY) {
minY = tY;

}


;
if (tZ > maxZ) {
maxZ = tZ;

}
else if (tZ < minZ) {
minZ = tZ;

}


;
tX = x3 + x2, tY = y3 + y2, tZ = z3 + z2;
if (tX > maxX) {
maxX = tX;

}
else if (tX < minX) {
minX = tX;

}


;
if (tY > maxY) {
maxY = tY;

}
else if (tY < minY) {
minY = tY;

}


;
if (tZ > maxZ) {
maxZ = tZ;

}
else if (tZ < minZ) {
minZ = tZ;

}


;
tX = (x1 + x2) + y3, tY = (y1 + y2) + y3, tZ = (z1 + z2) + z3;
if (tX > maxX) {
maxX = tX;

}
else if (tX < minX) {
minX = tX;

}


;
if (tY > maxY) {
maxY = tY;

}
else if (tY < minY) {
minY = tY;

}


;
if (tZ > maxZ) {
maxZ = tZ;

}
else if (tZ < minZ) {
minZ = tZ;

}


;
this.fX0 = x0 + minX;
this.fX1 = x0 + maxX;
this.fY0 = y0 + minY;
this.fY1 = y0 + maxY;
this.fZ0 = z0 + minZ;
this.fZ1 = z0 + maxZ;

};
Rect3d.prototype.isPointInRect = function(v3fPoint) {
return ((((((v3fPoint.x) >= (this.fX0)) && ((v3fPoint.y) >= (this.fY0))) && ((v3fPoint.z) >= (this.fZ0))) && ((v3fPoint.x) <= (this.fX1))) && ((v3fPoint.y) <= (this.fY1))) && ((v3fPoint.z) <= (this.fZ1));

};
Rect3d.prototype.createBoundingSphere = function() {
return new Sphere(((this.fX0) + (this.fX1)) * 0.5, ((this.fY0) + (this.fY1)) * 0.5, ((this.fZ0) + (this.fZ1)) * 0.5, ((((((this.fX1) - (this.fX0)) + (this.fY1)) - (this.fY0)) + (this.fZ1)) - (this.fZ0)) * 0.5);

};
function Frustum() {
switch(arguments.length) {
case 1:
this.leftPlane = new Plane3d(arguments[0].leftPlane);
this.rightPlane = new Plane3d(arguments[0].rightPlane);
this.topPlane = new Plane3d(arguments[0].topPlane);
this.bottomPlane = new Plane3d(arguments[0].bottomPlane);
this.nearPlane = new Plane3d(arguments[0].nearPlane);
this.farPlane = new Plane3d(arguments[0].farPlane);
break ;

default:
this.leftPlane = new Plane3d();
this.rightPlane = new Plane3d();
this.topPlane = new Plane3d();
this.bottomPlane = new Plane3d();
this.nearPlane = new Plane3d();
this.farPlane = new Plane3d();
}

}

;
Frustum.prototype.eq = function(pSrc) {
this.leftPlane.eq(pSrc.leftPlane);
this.rightPlane.eq(pSrc.rightPlane);
this.topPlane.eq(pSrc.topPlane);
this.bottomPlane.eq(pSrc.bottomPlane);
this.nearPlane.eq(pSrc.nearPlane);
this.farPlane.eq(pSrc.farPlane);

};
Frustum.prototype.isEqual = function(pSrc) {
return (((((this.leftPlane.isEqual(pSrc.leftPlane)) && (this.rightPlane.isEqual(pSrc.rightPlane))) && (this.topPlane.isEqual(pSrc.topPlane))) && (this.bottomPlane.isEqual(pSrc.bottomPlane))) && (this.nearPlane.isEqual(pSrc.nearPlane))) && (this.farPlane.isEqual(pSrc.farPlane));

};
Frustum.prototype.extractFromMatrix = function(m4fMatrix, isNormalizePlanes) {
this.leftPlane.v3fNormal[0] = (m4fMatrix[3]) + (m4fMatrix[0]);
this.leftPlane.v3fNormal[1] = (m4fMatrix[7]) + (m4fMatrix[4]);
this.leftPlane.v3fNormal[2] = (m4fMatrix[11]) + (m4fMatrix[8]);
this.leftPlane.fDistance = (m4fMatrix[15]) + (m4fMatrix[12]);
this.rightPlane.v3fNormal[0] = (m4fMatrix[3]) - (m4fMatrix[0]);
this.rightPlane.v3fNormal[1] = (m4fMatrix[7]) - (m4fMatrix[4]);
this.rightPlane.v3fNormal[2] = (m4fMatrix[11]) - (m4fMatrix[8]);
this.rightPlane.fDistance = (m4fMatrix[15]) - (m4fMatrix[12]);
this.topPlane.v3fNormal[0] = (m4fMatrix[3]) - (m4fMatrix[1]);
this.topPlane.v3fNormal[1] = (m4fMatrix[7]) - (m4fMatrix[5]);
this.topPlane.v3fNormal[2] = (m4fMatrix[11]) - (m4fMatrix[9]);
this.topPlane.fDistance = (m4fMatrix[15]) - (m4fMatrix[13]);
this.bottomPlane.v3fNormal[0] = (m4fMatrix[3]) + (m4fMatrix[1]);
this.bottomPlane.v3fNormal[1] = (m4fMatrix[7]) + (m4fMatrix[5]);
this.bottomPlane.v3fNormal[2] = (m4fMatrix[11]) + (m4fMatrix[9]);
this.bottomPlane.fDistance = (m4fMatrix[15]) + (m4fMatrix[13]);
this.nearPlane.v3fNormal[0] = m4fMatrix[2];
this.nearPlane.v3fNormal[1] = m4fMatrix[6];
this.nearPlane.v3fNormal[2] = m4fMatrix[10];
this.nearPlane.fDistance = m4fMatrix[14];
this.farPlane.v3fNormal[0] = (m4fMatrix[3]) - (m4fMatrix[2]);
this.farPlane.v3fNormal[1] = (m4fMatrix[7]) - (m4fMatrix[6]);
this.farPlane.v3fNormal[2] = (m4fMatrix[11]) - (m4fMatrix[10]);
this.farPlane.fDistance = (m4fMatrix[15]) - (m4fMatrix[14]);
if (isNormalizePlanes) {
this.leftPlane.normalize();
this.rightPlane.normalize();
this.topPlane.normalize();
this.bottomPlane.normalize();
this.nearPlane.normalize();
this.farPlane.normalize();

}


};
Frustum.prototype.extractPlane = function(pPlane, m4fMat, iRow) {
var iScale=(iRow < 0? -1 : 1);
iRow = (Math.abs(iRow)) - 1;
pPlane.v3fNormal[0] = (m4fMat[3]) + (iScale * (m4fMat[iRow]));
pPlane.v3fNormal[1] = (m4fMat[7]) + (iScale * (m4fMat[iRow + 4]));
pPlane.v3fNormal[2] = (m4fMat[11]) + (iScale * (m4fMat[iRow + 8]));
pPlane.fDistance = (m4fMat[15]) + (iScale * (m4fMat[iRow + 12]));
var fLength=Math.sqrt((((pPlane.v3fNormal[0]) * (pPlane.v3fNormal[0])) + ((pPlane.v3fNormal[1]) * (pPlane.v3fNormal[1]))) + ((pPlane.v3fNormal[2]) * (pPlane.v3fNormal[2])));
pPlane.v3fNormal[0] /= fLength;
pPlane.v3fNormal[1] /= fLength;
pPlane.v3fNormal[2] /= fLength;
pPlane.fDistance /= fLength;

};
Frustum.prototype.extractFromMatrixGL = function(m4fMatrix, isNormalizePlanes) {
this.extractPlane(this.leftPlane, m4fMatrix, 1);
this.extractPlane(this.rightPlane, m4fMatrix, -1);
this.extractPlane(this.bottomPlane, m4fMatrix, 2);
this.extractPlane(this.topPlane, m4fMatrix, -2);
this.extractPlane(this.nearPlane, m4fMatrix, 3);
this.extractPlane(this.farPlane, m4fMatrix, -3);
if (isNormalizePlanes) {
this.leftPlane.normalize();
this.rightPlane.normalize();
this.topPlane.normalize();
this.bottomPlane.normalize();
this.nearPlane.normalize();
this.farPlane.normalize();

}


};
Frustum.prototype.testPoint = function(v3fPoint) {
if (((((((this.leftPlane.signedDistance(v3fPoint)) < 0) || ((this.rightPlane.signedDistance(v3fPoint)) < 0)) || ((this.topPlane.signedDistance(v3fPoint)) < 0)) || ((this.bottomPlane.signedDistance(v3fPoint)) < 0)) || ((this.nearPlane.signedDistance(v3fPoint)) < 0)) || ((this.farPlane.signedDistance(v3fPoint)) < 0)) {
return false;

}

return true;

};
Frustum.prototype.testRect = function(pRect) {
if (((((((planeClassify_Rect3d_Plane(pRect, this.leftPlane)) == (1)) || ((planeClassify_Rect3d_Plane(pRect, this.rightPlane)) == (1))) || ((planeClassify_Rect3d_Plane(pRect, this.topPlane)) == (1))) || ((planeClassify_Rect3d_Plane(pRect, this.bottomPlane)) == (1))) || ((planeClassify_Rect3d_Plane(pRect, this.nearPlane)) == (1))) || ((planeClassify_Rect3d_Plane(pRect, this.farPlane)) == (1))) {
return false;

}

return true;

};
Frustum.prototype.testSphere = function(pSphere) {
if (((((((planeClassify_Sphere_Plane(pSphere, this.leftPlane)) == (1)) || ((planeClassify_Sphere_Plane(pSphere, this.rightPlane)) == (1))) || ((planeClassify_Sphere_Plane(pSphere, this.topPlane)) == (1))) || ((planeClassify_Sphere_Plane(pSphere, this.bottomPlane)) == (1))) || ((planeClassify_Sphere_Plane(pSphere, this.nearPlane)) == (1))) || ((planeClassify_Sphere_Plane(pSphere, this.farPlane)) == (1))) {
return false;

}

return true;

};
function intersect_Plane3d_Ray3d(pPlane, pRay) {
var fResult;
var NdotV=Vec3.dot(pPlane.v3fnormal, ray.v3fNormal);
if (NdotV != 0) {
fResult = (Vec3.dot(pPlane.v3fnormal, ray.v3fPoint)) + (pPlane.fDistance);
fResult /= NdotV;
if (fResult >= 0) {
return fResult;

}


}

return -1;

}

;
function intersect_Plane2d_Ray2d(pPlane, pRay) {
var fResult;
var NdotV=Vec2.dot(pPlane.v2fnormal, ray.v2fNormal);
if (NdotV != 0) {
fResult = (Vec2.dot(pPlane.v2fnormal, ray.v2fPoint)) + (pPlane.fDistance);
fResult /= NdotV;
if (fResult >= 0) {
return fResult;

}


}

return -1;

}

;
function intersect_Sphere_Ray3d(pSphere, pRay) {
var vecQ=Vec3.create();
vecQ[0] = (pRay.v3fPoint[0]) - (pSphere.v3fCenter[0]);
vecQ[1] = (pRay.v3fPoint[1]) - (pSphere.v3fCenter[1]);
vecQ[2] = (pRay.v3fPoint[2]) - (pSphere.v3fCenter[2]);
var c=(Vec3.lengthSquare(vecQ)) - ((pSphere.fRadius) * (pSphere.fRadius));
if (c < 0) {
return 0;

}

var b=Vec3.dot(vecQ.dot, pRay.v3fNormal);
if (b > 0) {
return -1;

}

var n=1;
var d=(b * b) - ((4 * n) * c);
if (d < 0) {
return -1;

}

var fResult=((-b) - (Math.sqrt(d))) / n;
if (fResult < 0) {
fResult = -1;

}

return fResult;

}

;
function intersect_Circle_Ray2d(pCircle, pRay) {
var vecQ=Vec2.create();
vecQ[0] = (pRay.v2fPoint[0]) - (pCircle.v2fCenter[0]);
vecQ[1] = (pRay.v2fPoint[1]) - (pCircle.v2fCenter[1]);
var c=(Vec2.lengthSquare(vecQ)) - ((pCircle.fRadius) * (pCircle.fRadius));
if (c < 0) {
return 0;

}

var b=Vec2.dot(vecQ.dot, pRay.v2fNormal);
if (b > 0) {
return -1;

}

var n=1;
var d=(b * b) - ((4 * n) * c);
if (d < 0) {
return -1;

}

var fResult=((-b) - (Math.sqrt(d))) / n;
if (fResult < 0) {
fResult = -1;

}

return fResult;

}

;
function intersect_Rect3d_Ray3d(pRect, pRay) {
if (((((((pRay.v3fpoint[0]) >= (pRect.fX0)) && ((pRay.v3fpoint[0]) <= (pRect.fX1))) && ((pRay.v3fpoint[1]) >= (pRect.fY0))) && ((pRay.v3fpoint[1]) <= (pRect.fY1))) && ((pRay.v3fpoint[2]) >= (pRect.fZ0))) && ((pRay.v3fpoint[2]) <= (pRect.fZ1))) {
return 0;

}

var maxT=Number.NEGATIVE_INFINITY;
var t=0;
if ((pRay.v3fnormal[0]) > 0) {
t = ((pRect.fX0) - (pRay.v3fpoint[0])) / (pRay.v3fnormal[0]);
maxT = Math.max(maxT, t);

}
else if ((pRay.v3fnormal[0]) < 0) {
t = ((pRect.fX1) - (pRay.v3fpoint[0])) / (pRay.v3fnormal[0]);
maxT = Math.max(maxT, t);

}


if ((pRay.v3fnormal[1]) > 0) {
t = ((pRect.fY0) - (pRay.v3fpoint[1])) / (pRay.v3fnormal[1]);
maxT = Math.max(maxT, t);

}
else if ((pRay.v3fnormal[1]) < 0) {
t = ((pRect.fY1) - (pRay.v3fpoint[1])) / (pRay.v3fnormal[1]);
maxT = Math.max(maxT, t);

}


if ((pRay.v3fnormal[2]) > 0) {
t = ((pRect.fZ0) - (pRay.v3fpoint[2])) / (pRay.v3fnormal[2]);
maxT = Math.max(maxT, t);

}
else if ((pRay.v3fnormal[2]) < 0) {
t = ((pRect.fZ1) - (pRay.v3fpoint[2])) / (pRay.v3fnormal[2]);
maxT = Math.max(maxT, t);

}


if (maxT < 0) {
maxT = -1;

}

return maxT;

}

;
function intersect_Rect2d_Ray2d(pRect, pRay) {
if (((((pRay.v3fpoint[0]) >= (pRect.fX0)) && ((pRay.v3fpoint[0]) <= (pRect.fX1))) && ((pRay.v3fpoint[1]) >= (pRect.fY0))) && ((pRay.v3fpoint[1]) <= (pRect.fY1))) {
return 0;

}

var maxT=Number.NEGATIVE_INFINITY;
var t=0;
if ((pRay.v3fnormal[0]) > 0) {
t = ((pRect.fX0) - (pRay.v3fpoint[0])) / (pRay.v3fnormal[0]);
maxT = Math.max(maxT, t);

}
else if ((pRay.v3fnormal[0]) < 0) {
t = ((pRect.fX1) - (pRay.v3fpoint[0])) / (pRay.v3fnormal[0]);
maxT = Math.max(maxT, t);

}


if ((pRay.v3fnormal[1]) > 0) {
t = ((pRect.fY0) - (pRay.v3fpoint[1])) / (pRay.v3fnormal[1]);
maxT = Math.max(maxT, t);

}
else if ((pRay.v3fnormal[1]) < 0) {
t = ((pRect.fY1) - (pRay.v3fpoint[1])) / (pRay.v3fnormal[1]);
maxT = Math.max(maxT, t);

}


if (maxT < 0) {
maxT = -1;

}

return maxT;

}

;
function intersect_Circle_Circle(pSphereA, pSphereB) {
var rx=(pSphereA.v2fCenter[0]) - (pSphereB.v2fCenter[0]);
var ry=(pSphereA.v2fCenter[1]) - (pSphereB.v2fCenter[1]);
return ((rx * rx) + (ry * ry)) < ((pSphereA.fRadius) + (pSphereB.fRadius));

}

;
function intersect_Sphere_Sphere(pSphereA, pSphereB) {
var rx=(pSphereA.v3fCenter[0]) - (pSphereB.v3fCenter[0]);
var ry=(pSphereA.v3fCenter[1]) - (pSphereB.v3fCenter[1]);
var rz=(pSphereA.v3fCenter[2]) - (pSphereB.v3fCenter[2]);
return (((rx * rx) + (ry * ry)) + (rz * rz)) < ((pSphereA.fRadius) + (pSphereB.fRadius));

}

;
function intersect_Rect2d_Circle(pRect, pSphere) {
var offset=Vec2.create();
var interior_count=0;
if ((pSphere.v2fCenter[0]) < (pRect.fX0)) {
offset[0] = (pRect.fX0) - (pSphere.v2fCenter[0]);

}
else if ((pSphere.v2fCenter[0]) >= (pRect.fX1)) {
offset[0] = (pSphere.v2fCenter[0]) - (pRect.fX1);

}
else  {
++interior_count;

}


if ((pSphere.v2fCenter[1]) < (pRect.fY0)) {
offset[1] = (pRect.fY0) - (pSphere.v2fCenter[1]);

}
else if ((pSphere.v2fCenter[1]) >= (pRect.fY1)) {
offset[1] = (pSphere.v2fCenter[1]) - (pRect.fY1);

}
else  {
++interior_count;

}


if (interior_count == 2) {
return true;

}

var distance_squared=Vec2.lengthSquare(offset);
var radius_squared=(pSphere.radius) * (pSphere.radius);
return distance_squared < radius_squared;

}

;
function intersect_Rect3d_Sphere(pRect, pSphere) {
var offset=Vec3.create();
var interior_count=0;
if ((pSphere.v3fCenter[0]) < (pRect.fX0)) {
offset[0] = (pRect.fX0) - (pSphere.v3fCenter[0]);

}
else if ((pSphere.v3fCenter[0]) >= (pRect.fX1)) {
offset[0] = (pSphere.v3fCenter[0]) - (pRect.fX1);

}
else  {
++interior_count;

}


if ((pSphere.v3fCenter[1]) < (pRect.fY0)) {
offset[1] = (pRect.fY0) - (pSphere.v3fCenter[1]);

}
else if ((pSphere.v3fCenter[1]) >= (pRect.fY1)) {
offset[1] = (pSphere.v3fCenter[1]) - (pRect.fY1);

}
else  {
++interior_count;

}


if ((pSphere.v3fCenter[2]) < (pRect.fZ0)) {
offset[2] = (pRect.fZ0) - (pSphere.v3fCenter[2]);

}
else if ((pSphere.v3fCenter[2]) >= (pRect.fZ1)) {
offset[2] = (pSphere.v3fCenter[2]) - (pRect.fZ1);

}
else  {
++interior_count;

}


if (interior_count == 3) {
return true;

}

var distance_squared=Vec3.lengthSquare(offset);
var radius_squared=(pSphere.radius) * (pSphere.radius);
return distance_squared < radius_squared;

}

;
function intersect_Rect2d_Rect2d(pRectA, pRectB, pResult) {
if (!pResult) {
var err=((((((("Error:: " + "a result address must be provided") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("a result address must be provided");

}


}

;
pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);
if ((pResult.fX0) < (pResult.fX1)) {
pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);
pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);
if ((pResult.fY0) < (pResult.fY1)) {
return true;

}


}

return false;

}

;
function intersect_Rect3d_Rect3d(pRectA, pRectB, pResult) {
if (!pResult) {
var err=((((((("Error:: " + "a result address must be provided") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("a result address must be provided");

}


}

;
pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);
if ((pResult.fX0) < (pResult.fX1)) {
pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);
pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);
if ((pResult.fY0) < (pResult.fY1)) {
pResult.fZ0 = Math.max(pRectA.fZ0, pRectB.fZ0);
pResult.fZ1 = Math.min(pRectA.fZ1, pRectB.fZ1);
if ((pResult.fZ0) < (pResult.fZ1)) {
return true;

}


}


}

return false;

}

;
function intersect() {
var arg1=arguments[0];
var arg2=arguments[1];
if ((arguments.length) == 3) {
var arg3=arguments[2];
if (arg3 instanceof Rect2d) {
return intersect_Rect2d_Rect2d(arg1, arg2, arg3);

}
else if (arg3 instanceof Rect3d) {
return intersect_Rect3d_Rect3d(arg1, arg2, arg3);

}



}
else if ((arguments.length) == 2) {
if (arg2 instanceof Ray3d) {
if (arg1 instanceof Plane3d) {
return intersect_Plane3d_Ray3d(arg1, arg2);

}
else if (arg1 instanceof Sphere) {
return intersect_Sphere_Ray3d(arg1, arg2);

}
else if (arg1 instanceof Rect3d) {
return intersect_Rect3d_Ray3d(arg1, arg2);

}




}
else if (arg2 instanceof Ray2d) {
if (arg1 instanceof Plane2d) {
return intersect_Plane2d_Ray2d(arg1, arg2);

}
else if (arg1 instanceof Circle) {
return intersect_Circle_Ray2d(arg1, arg2);

}
else if (arg1 instanceof Rect2d) {
return intersect_Rect2d_Ray2d(arg1, arg2);

}




}
else if ((arg1 instanceof Circle) && (arg2 instanceof Circle)) {
return intersect_Circle_Circle(arg1, arg2);

}
else if ((arg1 instanceof Sphere) && (arg2 instanceof Sphere)) {
return intersect_Sphere_Sphere(arg1, arg2);

}
else if ((arg1 instanceof Rect2d) && (arg2 instanceof Circle)) {
return intersect_Rect2d_Circle(arg1, arg2);

}
else if ((arg1 instanceof Rect3d) && (arg2 instanceof Sphere)) {
return intersect_Rect3d_Sphere(arg1, arg2);

}







}
else  {
if (!false) {
var err=((((((("Error:: " + "Incorrect number of arguments") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Incorrect number of arguments");

}


}

;

}



}

;
function planeClassify_Circle_Plane(pCircle, pPlane) {
var d=pPlane.signedDistance(pCircle.v2fCenter);
if ((Math.abs(d)) < (pCircle.fRadius)) {
return 2;

}
else if (d) {
return 0;

}


return 1;

}

;
function planeClassify_Sphere_Plane(pSphere, pPlane) {
var d=pPlane.signedDistance(pCircle.v3fCenter);
if ((Math.abs(d)) < (pCircle.fRadius)) {
return 2;

}
else if (d) {
return 0;

}


return 1;

}

;
function planeClassify_Rect2d_Plane(pRect, pPlane) {
var minPoint=Vec2.create();
var maxPoint=Vec2.create();
if ((pPlane.v2fNormal[0]) > 0) {
minPoint[0] = pRect.fX0;
maxPoint[0] = pRect.fX1;

}
else  {
minPoint[0] = pRect.fX1;
maxPoint[0] = pRect.fX0;

}

if ((pPlane.v2fNormal[1]) > 0) {
minPoint[1] = pRect.fY0;
maxPoint[1] = pRect.fY1;

}
else  {
minPoint[1] = pRect.fY1;
maxPoint[1] = pRect.fY0;

}

var dmin=pPlane.signedDistance(minPoint);
var dmax=pPlane.signedDistance(maxPoint);
if ((dmin * dmax) < 0) {
return 2;

}
else if (dmin) {
return 0;

}


return 1;

}

;
function planeClassify_Rect3d_Plane(pRect, pPlane) {
var minPoint=Vec3.create();
var maxPoint=Vec3.create();
if ((pPlane.v3fNormal[0]) > 0) {
minPoint[0] = pRect.fX0;
maxPoint[0] = pRect.fX1;

}
else  {
minPoint[0] = pRect.fX1;
maxPoint[0] = pRect.fX0;

}

if ((pPlane.v3fNormal[1]) > 0) {
minPoint[1] = pRect.fY0;
maxPoint[1] = pRect.fY1;

}
else  {
minPoint[1] = pRect.fY1;
maxPoint[1] = pRect.fY0;

}

if ((pPlane.v3fNormal[2]) > 0) {
minPoint[2] = pRect.fZ0;
maxPoint[2] = pRect.fZ1;

}
else  {
minPoint[2] = pRect.fZ1;
maxPoint[2] = pRect.fZ0;

}

var dmin=pPlane.signedDistance(minPoint);
var dmax=pPlane.signedDistance(maxPoint);
if ((dmin * dmax) < 0) {
return 2;

}
else if (dmin) {
return 0;

}


return 1;

}

;
function planeClassify(value, plane) {
if (plane instanceof Plane2d) {
if (value instanceof Circle) {
return planeClassify_Circle_Plane(value, plane);

}
else if (value instanceof Rect2d) {
return planeClassify_Rect2d_Plane(value, plane);

}



}
else if (plane instanceof Plane3d) {
if (value instanceof Sphere) {
return planeClassify_Sphere_Rect(value, plane);

}
else if (value instanceof Rect3d) {
return planeClassify_Rect3d_Plane(value, plane);

}



}



}

;
function intersectRect2d(pRectA, pRectB, pResult) {
pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);
pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);
pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);
return ((pResult.fX0) <= (pResult.fX1)) && ((pResult.fY0) <= (pResult.fY1));

}

;
function intersectRect3d(pRectA, pRectB, pResult) {
pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);
pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);
pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);
pResult.fZ0 = Math.max(pRectA.fZ0, pRectB.fZ0);
pResult.fZ1 = Math.min(pRectA.fZ1, pRectB.fZ1);
return (((pResult.fX0) <= (pResult.fX1)) && ((pResult.fY0) <= (pResult.fY1))) && ((pResult.fZ0) <= (pResult.fZ1));

}

;
function classifyRect2d(pRectA, pRectB, pResult) {
if (pRectA.isEqual(pRectB)) {
return 1;

}

if (intersectRect2d(pRectA, pRectB, pResult)) {
if (pRectB.isEqual(pResult)) {
return 2;

}

if (pRectA.isEqual(pResult)) {
return 3;

}

return 4;

}

return 0;

}

;
function classifyRect3d(pRectA, pRectB, pResult) {
if (pRectA.isEqual(pRectB)) {
return 1;

}

if (intersectRect3d(pRectA, pRectB, pResult)) {
if (pRectB.isEqual(pResult)) {
return 2;

}

if (pRectA.isEqual(pResult)) {
return 3;

}

return 4;

}

return 0;

}

a.Ray2d = Ray2d;
a.Ray2d = Ray2d;
a.Segment2d = Segment2d;
a.Segment3d = Segment3d;
a.Circle = Circle;
a.Sphere = Sphere;
a.Plane2d = Plane2d;
a.Plane3d = Plane3d;
a.Rect2d = Rect2d;
a.Rect3d = Rect3d;
a.Frustum = Frustum;
a.intersect = intersect;
a.planeClassify = planeClassify;
a.intersectRect3d = intersectRect3d;
a.classifyRect3d = classifyRect3d;
a.intersectRect2d = intersectRect2d;
a.classifyRect2d = classifyRect2d;
function PerlinNoise() {
;
this.m_pv2fTable = new Array(256);
this.m_piLut = new Uint8Array(256);
this.setup();

}

;
PerlinNoise.prototype.setup = function() {
var fStep=((Math.PI) * 2) / (256);
var fVal=0;
for (var i=0; i < (256); ++i) {
this.m_pv2fTable[i] = Vec2.create();
this.m_pv2fTable[i][0] = Math.sin(fVal);
this.m_pv2fTable[i][1] = Math.cos(fVal);
fVal += fStep;
this.m_piLut[i] = (Math.random()) * (255);

}


};
PerlinNoise.prototype.getVec = function(iX, iY) {
var iA=this.m_piLut[iX & (255)];
var iB=this.m_piLut[iY & (255)];
var iVal=this.m_piLut[(iA + iB) & (255)];
return this.m_pv2fTable[iVal];

};
PerlinNoise.prototype.noise = function(fX, fY, fScale) {
var v2fPos=Vec2.create();
v2fPos[0] = (fX * fScale);
v2fPos[1] = (fY * fScale);
var fX0=Math.floor(v2fPos[0]);
var fX1=fX0 + 1;
var fY0=Math.floor(v2fPos[1]);
var fY1=fY0 + 1;
var v0=this.getVec(fX0, fY0);
var v1=this.getVec(fX0, fY1);
var v2=this.getVec(fX1, fY0);
var v3=this.getVec(fX1, fY1);
var d0=Vec2.create();
d0[0] = ((v2fPos[0]) - fX0);
d0[1] = ((v2fPos[1]) - fY0);
var d1=Vec2.create();
d1[0] = ((v2fPos[0]) - fX0);
d1[1] = ((v2fPos[1]) - fY1);
var d2=Vec2.create();
d2[0] = ((v2fPos[0]) - fX1);
d2[1] = ((v2fPos[1]) - fY0);
var d3=Vec2.create();
d3[0] = ((v2fPos[0]) - fX1);
d3[1] = ((v2fPos[1]) - fY1);
var fH0=((d0[0]) * (v0[0])) + ((d0[1]) * (v0[1]));
var fH1=((d1[0]) * (v1[0])) + ((d1[1]) * (v1[1]));
var fH2=((d2[0]) * (v2[0])) + ((d2[1]) * (v2[1]));
var fH3=((d3[0]) * (v3[0])) + ((d3[1]) * (v3[1]));
var fSx, fSy;
fSx = ((6 * (Math.pow(d0[0], 5))) - (15 * (Math.pow(d0[0], 4)))) + (10 * (Math.pow(d0[0], 3)));
fSy = ((6 * (Math.pow(d0[1], 5))) - (15 * (Math.pow(d0[1], 4)))) + (10 * (Math.pow(d0[1], 3)));
var fAvgX0=fH0 + (fSx * (fH2 - fH0));
var fAvgX1=fH1 + (fSx * (fH3 - fH1));
var fResult=fAvgX0 + (fSy * (fAvgX1 - fAvgX0));
return fResult;

};
a.PerlinNoise = PerlinNoise;
a.get = function(sUrl, pData, fnSuccess, eDataType) {
return a.ajax( {url: sUrl, data: pData, success: fnSuccess, dataType: eDataType});

};
a.require = function(sUrl) {
eval(a.ajax( {url: sUrl, async: false}).data);

};
a.queryString = function(pObj, sPrefix) {
if ((typeof pObj) == "string") {
return pObj;

}

var str=[];
for (var p in pObj) {
var k=(sPrefix? ((sPrefix + "[") + p) + "]" : p), v=pObj[p];
str.push(((typeof v) == "object"? a.queryString(v, k) : ((encodeURIComponent(k)) + "=") + (encodeURIComponent(v))));

}

return str.join("&");

};
a.ajax = function(pSettings, pRequest) {
var sUrl=(pSettings.url === undefined? "" : pSettings.url);
var isAsync=(pSettings.async === undefined? true : pSettings.async);
var pStatusCode=(pSettings.statusCode === undefined?  {} : pSettings.statusCode);
var fnSuccess=(pSettings.success === undefined? null : pSettings.success);
var fnError=(pSettings.error === undefined? null : pSettings.error);
var fnBeforeSend=(pSettings.beforeSend === undefined? null : pSettings.beforeSend);
var pData=(pSettings.data === undefined?  {} : pSettings.data), sQueryString;
var useCache=(pSettings.cache === undefined? false : pSettings.cache);
var sContentType=(pSettings.contentType === undefined? "application/x-www-form-urlencoded" : pSettings.contentType);
var eDataType=(pSettings.dataType === undefined? 0 : pSettings.dataType);
var eMethod=(pSettings.type === undefined? 1 : pSettings.type);
var nTimeout=(pSettings.timeout === undefined? 0 : pSettings.timeout);
var iTimeoutId=null;
var isAborted=false;
if ((typeof eMethod) == "string") {
eMethod = eMethod.toLowerCase();
if (eMethod == "get") {
eMethod = 1;

}
else if (eMethod == "post") {
eMethod = 2;

}



}

if ((typeof eDataType) == "string") {
eDataType = eDataType.toLowerCase();
switch(eDataType) {
case "json":
eDataType = 1;
break ;

case "blob":
eDataType = 2;
break ;

case "html":
;

case "document":
eDataType = 4;
break ;

case "array_buffer":
;

case "arraybuffer":
eDataType = 3;
break ;

default:
eDataType = 0;
}

}

var fnInitRequest=function() {
if (window.XMLHttpRequest) {
return new XMLHttpRequest();

}
else if (window.ActiveXObject) {
return new ActiveXObject("Microsoft.XMLHTTP");

}


return null;

};
var fnConvData=function(pReq) {
switch(eDataType) {
case 0:
return window.String(pReq.responseText);

case 1:
return a.parseJSON(pReq.responseText);

case 2:
return (isAsync? pReq.response : new BlobBuilder().append(pReq.responseText));

case 3:
return (isAsync? pReq.response : pReq.responseText);

case 4:
return (isAsync? pReq.response : a.toDOM(pReq.responseText));
}

};
var fnProcRequest=function() {
if (isAborted) {
return ;

}

if ((pRequest.readyState) == (this.HEADERS_RECEIVED)) {
if (nTimeout > 0) {
clearTimeout(iTimeoutId);

}


}

if ((pRequest.readyState) == (this.DONE)) {
var iStatusCode=pRequest.status;
var fnStatusHandler=pStatusCode[iStatusCode];
if (fnStatusHandler) {
fnStatusHandler();

}

fnBeforeResult();
if (iStatusCode == (200)) {
if (fnSuccess) {
fnSuccess(fnConvData(pRequest), pRequest.textStatus, pRequest);

}


}
else if (!fnStatusHandler) {
fnCauseError(pRequest, new Error("Request is not completed " + "successfully"));

}



}


};
var fnCauseError=function(pReq, pErr) {
if (!fnError) {
throw pErr;

}
else  {
fnError(pReq, (pReq? pReq.textStatus : null), pErr);

}


};
var fnResponseType=function(eDataType) {
switch(eDataType) {
case 2:
return "blob";

case 3:
return "arraybuffer";

case 4:
return "document";

case 0:
return "text";
}
return "";

};
var fnBeforeResult=function() {
if (iTimeoutId !== null) {
clearTimeout(iTimeoutId);

}


};
pRequest = pRequest || (fnInitRequest());
pRequest.onreadystatechange = fnProcRequest;
if (!pRequest) {
fnCauseError(null, new Error("Invalid request object."));

}

if (nTimeout > 0) {
iTimeoutId = setTimeout(function() {
isAborted = true;
pRequest.abort();
fnCauseError(pRequest, new Error("Timeout is over."));

}
, nTimeout);

}

if (fnBeforeSend) {
if (!(fnBeforeSend(pRequest, pSettings))) {
return null;

}


}

if (!useCache) {
pData["TIMESTAMP"] = new Date().getTime();

}

sQueryString = a.queryString(pData);
if (isAborted) {
return null;

}

if (isAsync) {
try {
(eMethod == (1)? function() {
pRequest.open("GET", sUrl + ((sQueryString.length? "?" + sQueryString : "")), true);
pRequest.responseType = fnResponseType(eDataType);
pRequest.send(null);

}
 : function() {
pRequest.open("POST", sUrl, true);
pRequest.setRequestHeader("Content-Type", sContentType);
pRequest.responseType = fnResponseType(eDataType);
pRequest.send(sQueryString);

}
)();

}
catch(e) {
fnCauseError(pRequest, e);

}

}
else  {
return (eMethod == (1)? function() {
pRequest.open("GET", (sUrl + "?") + sQueryString, false);
pRequest.send(null);
fnBeforeResult();
return  {data: fnConvData(pRequest), textStatus: pRequest.textStatus, xhr: pRequest};

}
 : function() {
pRequest.open("POST", sUrl, false);
pRequest.setRequestHeader("Content-type", sContentType);
pRequest.send(sQueryString);
fnBeforeResult();
return  {data: fnConvData(pRequest), textStatus: pRequest.textStatus, xhr: pRequest};

}
)();

}

return null;

};
function BinReader(arrayBuffer) {
this.arrayBuffer = arrayBuffer;
this.arrayUint8Buffer = new Uint8Array(arrayBuffer);
this.arrayBufferLength = new Uint8Array(arrayBuffer).length;
this.iPosition = 0;

}

BinReader.prototype.string = function(str) {
var iStringLength=this.uint32();
if (iStringLength == 4294967295) {
return (str? str : null);

}

var iBitesToAdd=((4 - (iStringLength % 4)) == 4? 0 : 4 - (iStringLength % 4));
iStringLength += iBitesToAdd;
if (!((((this.iPosition) + iStringLength) - 1) < this.arrayBufferLength)) {
var err=((((((("Error:: " + "Выход за пределы массива") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выход за пределы массива");

}


}

;
var arrayStringUTF8=new Uint8Array(this.arrayBuffer, this.iPosition, iStringLength);
this.iPosition += iStringLength;
var sString="";
for (var n=0; n < (arrayStringUTF8.length); ++n) {
var charCode=String.fromCharCode(arrayStringUTF8[n]);
sString = sString + charCode;

}

return sString.fromUTF8();

};
BinReader.prototype._uintX = function(iX) {
if (!((((this.iPosition) + 4) - 1) < this.arrayBufferLength)) {
var err=((((((("Error:: " + "Выход за пределы массива") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выход за пределы массива");

}


}

;
switch(iX) {
case 8:
var iValue=new Uint8Array(this.arrayBuffer, this.iPosition, 4)[0];
break ;

case 16:
var iValue=new Uint16Array(this.arrayBuffer, this.iPosition, 2)[0];
break ;

case 32:
var iValue=new Uint32Array(this.arrayBuffer, this.iPosition, 1)[0];
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
this.iPosition += 4;
return iValue;

};
BinReader.prototype.uint8 = function() {
return this._uintX(8);

};
BinReader.prototype.uint16 = function() {
return this._uintX(16);

};
BinReader.prototype.uint32 = function() {
return this._uintX(32);

};
BinReader.prototype.bool = function() {
return (this._uintX(8)? true : false);

};
BinReader.prototype._readArrayElementUintX = function(iX) {
if (!((((this.iPosition) + (iX / 8)) - 1) < this.arrayBufferLength)) {
var err=((((((("Error:: " + "Выход за пределы массива") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выход за пределы массива");

}


}

;
switch(iX) {
case 8:
var iValue=new Uint8Array(this.arrayBuffer, this.iPosition, 1)[0];
this.iPosition += 1;
break ;

case 16:
var iValue=new Uint16Array(this.arrayBuffer, this.iPosition, 1)[0];
this.iPosition += 2;
break ;

case 32:
var iValue=new Uint32Array(this.arrayBuffer, this.iPosition, 1)[0];
this.iPosition += 4;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
return iValue;

};
BinReader.prototype._intX = function(iX) {
if (!((((this.iPosition) + 4) - 1) < this.arrayBufferLength)) {
var err=((((((("Error:: " + "Выход за пределы массива") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выход за пределы массива");

}


}

;
switch(iX) {
case 8:
var iValue=new Int8Array(this.arrayBuffer, this.iPosition, 4)[0];
break ;

case 16:
var iValue=new Int16Array(this.arrayBuffer, this.iPosition, 2)[0];
break ;

case 32:
var iValue=new Int32Array(this.arrayBuffer, this.iPosition, 1)[0];
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
this.iPosition += 4;
return iValue;

};
BinReader.prototype.int8 = function() {
return this._intX(8);

};
BinReader.prototype.int16 = function() {
return this._intX(16);

};
BinReader.prototype.int32 = function() {
return this._intX(32);

};
BinReader.prototype._readArrayElementIntX = function(iX) {
if (!((((this.iPosition) + (iX / 8)) - 1) < this.arrayBufferLength)) {
var err=((((((("Error:: " + "Выход за пределы массива") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выход за пределы массива");

}


}

;
switch(iX) {
case 8:
var iValue=new Int8Array(this.arrayBuffer, this.iPosition, 1)[0];
this.iPosition += 1;
break ;

case 16:
var iValue=new Int16Array(this.arrayBuffer, this.iPosition, 1)[0];
this.iPosition += 2;
break ;

case 32:
var iValue=new Int32Array(this.arrayBuffer, this.iPosition, 1)[0];
this.iPosition += 4;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
return iValue;

};
BinReader.prototype._floatX = function(iX) {
var tmpPosition=((this.iPosition) + (iX / 8)) - 1;
if (!((((this.iPosition) + (iX / 8)) - 1) < this.arrayBufferLength)) {
var err=((((((("Error:: " + "Выход за пределы массива") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выход за пределы массива");

}


}

;
switch(iX) {
case 32:
var fValue=new Float32Array(this.arrayBuffer, this.iPosition, 1)[0];
this.iPosition += 4;
break ;

case 64:
var arrUintTmp=new Uint8Array(8);
for (var i=0; i < 8; i++) {
arrUintTmp[i] = this.arrayUint8Buffer[(this.iPosition) + i];

}

var arrFloatTmp=new Float64Array(arrUintTmp.buffer);
var fValue=arrFloatTmp[0];
this.iPosition += 8;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 32, 64.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 32, 64.");

}


}

;
break ;
}
return fValue;

};
BinReader.prototype.float32 = function() {
return this._floatX(32);

};
BinReader.prototype.float64 = function() {
return this._floatX(64);

};
BinReader.prototype.stringArray = function() {
var arrStringLength=this.uint32();
if (arrStringLength == 4294967295) {
return null;

}

var arrStrings=[];
for (var i=0; i < arrStringLength; i++) {
arrStrings[i] = this.string();

}

return arrStrings;

};
BinReader.prototype._uintXArray = function(iX) {
var arrUintLength=this.uint32();
if (arrUintLength == 4294967295) {
return null;

}

switch(iX) {
case 8:
var iBitesToAdd=((4 - (arrUintLength % 4)) == 4? 0 : 4 - (arrUintLength % 4));
iBitesToAdd *= 1;
var arrUint=new Uint8Array(arrUintLength);
break ;

case 16:
var iBitesToAdd=((2 - (arrUintLength % 2)) == 2? 0 : 2 - (arrUintLength % 2));
iBitesToAdd *= 2;
var arrUint=new Uint16Array(arrUintLength);
break ;

case 32:
var iBitesToAdd=0;
var arrUint=new Uint32Array(arrUintLength);
break ;
}
for (var i=0; i < arrUintLength; i++) {
arrUint[i] = this._readArrayElementUintX(iX);

}

this.iPosition += iBitesToAdd;
return arrUint;

};
BinReader.prototype.uint8Array = function() {
return this._uintXArray(8);

};
BinReader.prototype.uint16Array = function() {
return this._uintXArray(16);

};
BinReader.prototype.uint32Array = function() {
return this._uintXArray(32);

};
BinReader.prototype._intXArray = function(iX) {
var arrIntLength=this.uint32();
if (arrIntLength == 4294967295) {
return null;

}

switch(iX) {
case 8:
var iBitesToAdd=((4 - (arrIntLength % 4)) == 4? 0 : 4 - (arrIntLength % 4));
iBitesToAdd *= 1;
var arrInt=new Int8Array(arrIntLength);
break ;

case 16:
var iBitesToAdd=((2 - (arrIntLength % 2)) == 2? 0 : 2 - (arrIntLength % 2));
iBitesToAdd *= 2;
var arrInt=new Int16Array(arrIntLength);
break ;

case 32:
var iBitesToAdd=0;
var arrInt=new Int32Array(arrIntLength);
break ;
}
for (var i=0; i < arrIntLength; i++) {
arrInt[i] = this._readArrayElementUintX(iX);

}

this.iPosition += iBitesToAdd;
return arrInt;

};
BinReader.prototype.int8Array = function() {
return this._intXArray(8);

};
BinReader.prototype.int16Array = function() {
return this._intXArray(16);

};
BinReader.prototype.int32Array = function() {
return this._intXArray(32);

};
BinReader.prototype._floatXArray = function(iX) {
var arrFloatLength=this.uint32();
if (arrFloatLength == 4294967295) {
return null;

}

switch(iX) {
case 32:
var arrFloat=new Float32Array(arrFloatLength);
break ;

case 64:
var arrFloat=new Float64Array(arrFloatLength);
break ;
}
for (var i=0; i < arrFloatLength; i++) {
arrFloat[i] = this._floatX(iX);

}

return arrFloat;

};
BinReader.prototype.float32Array = function() {
return this._floatXArray(32);

};
BinReader.prototype.float64Array = function() {
return this._floatXArray(64);

};
BinReader.prototype.data = function(data) {
var tmpArrBuffer=new Uint8Array(this.iCountData);
for (var i=0, k=0; i < (this.arrData.length); i++) {
for (var n=0; n < (this.arrData[i].length); n++) {
tmpArrBuffer[k++] = this.arrData[i][n];

}


}

return tmpArrBuffer.buffer;

};
BinReader.prototype.rawStringToBuffer = function(str) {
var idx, len=str.length, arr=new Array(len);
for (idx = 0; idx < len; ++idx) {
arr[idx] = str.charCodeAt(idx);

}

return new Uint8Array(arr);

};
a.BinReader = BinReader;
function BinWriter() {
this._pArrData = [];
this._iCountData = 0;

}

BinWriter.prototype.string = function(str) {
if ((str === null) || (str === undefined)) {
this.uint32(4294967295);
return ;

}

str = String(str);
var sUTF8String=str.toUTF8();
var iStrLen=sUTF8String.length;
var arrUTF8string=BinWriter.rawStringToBuffer(sUTF8String);
if (!(iStrLen <= ((Math.pow(2, 32)) - 1))) {
var err=((((((("Error:: " + "Это значение не влезет в тип string") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Это значение не влезет в тип string");

}


}

;
this.uint32(iStrLen);
var iBitesToAdd=((4 - (iStrLen % 4)) == 4? 0 : 4 - (iStrLen % 4));
this._pArrData[this._pArrData.length] = arrUTF8string;
this._iCountData += iStrLen + iBitesToAdd;

};
BinWriter.prototype._uintX = function(iValue, iX) {
if (iValue === null) {
iValue = 0;

}

if (!((typeof iValue) == "number")) {
var err=((((((("Error:: " + "Не является числом") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не является числом");

}


}

;
if (!((0 <= iValue) && (iValue <= (Math.pow(2, iX))))) {
var err=((((((("Error:: " + ("Это значение не влезет в тип uint" + iX)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Это значение не влезет в тип uint" + iX));

}


}

;
switch(iX) {
case 8:
var arrTmpBuf=new Uint8Array(4);
arrTmpBuf[0] = iValue;
break ;

case 16:
var arrTmpBuf=new Uint16Array(2);
arrTmpBuf[0] = iValue;
break ;

case 32:
var arrTmpBuf=new Uint32Array(1);
arrTmpBuf[0] = iValue;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
this._iCountData += 4;

};
BinWriter.prototype.uint8 = function(iValue) {
this._uintX(iValue, 8);

};
BinWriter.prototype.uint16 = function(iValue) {
this._uintX(iValue, 16);

};
BinWriter.prototype.uint32 = function(iValue) {
this._uintX(iValue, 32);

};
BinWriter.prototype.bool = function(bValue) {
this._uintX((bValue? 1 : 0), 8);

};
BinWriter.prototype._writeArrayElementUintX = function(iValue, iX) {
if (iValue === null) {
iValue = 0;

}

if (!((typeof iValue) == "number")) {
var err=((((((("Error:: " + "Не является числом") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не является числом");

}


}

;
if (!((0 <= iValue) && (iValue <= (Math.pow(2, iX))))) {
var err=((((((("Error:: " + ("Это значение не влезет в тип uint" + iX)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Это значение не влезет в тип uint" + iX));

}


}

;
switch(iX) {
case 8:
var arrTmpBuf=new Uint8Array(1);
arrTmpBuf[0] = iValue;
break ;

case 16:
var arrTmpBuf=new Uint16Array(1);
arrTmpBuf[0] = iValue;
break ;

case 32:
var arrTmpBuf=new Uint32Array(1);
arrTmpBuf[0] = iValue;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
if (iX == 8) {
this._pArrData[this._pArrData.length] = arrTmpBuf;

}
else  {
this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);

}

this._iCountData += iX / 8;

};
BinWriter.prototype._intX = function(iValue, iX) {
if (iValue === null) {
iValue = 0;

}

if (!((typeof iValue) == "number")) {
var err=((((((("Error:: " + "Не является числом") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не является числом");

}


}

;
if (!(((-(Math.pow(2, iX - 1))) <= iValue) && (iValue <= ((Math.pow(2, iX - 1)) - 1)))) {
var err=((((((("Error:: " + ("Это значение не влезет в тип int" + iX)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Это значение не влезет в тип int" + iX));

}


}

;
switch(iX) {
case 8:
var arrTmpBuf=new Int8Array(4);
arrTmpBuf[0] = iValue;
break ;

case 16:
var arrTmpBuf=new Int16Array(2);
arrTmpBuf[0] = iValue;
break ;

case 32:
var arrTmpBuf=new Int32Array(1);
arrTmpBuf[0] = iValue;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
this._iCountData += 4;

};
BinWriter.prototype.int8 = function(iValue) {
this._intX(iValue, 8);

};
BinWriter.prototype.int16 = function(iValue) {
this._intX(iValue, 16);

};
BinWriter.prototype.int32 = function(iValue) {
this._intX(iValue, 32);

};
BinWriter.prototype._writeArrayElementIntX = function(iValue, iX) {
if (iValue === null) {
iValue = 0;

}

if (!((typeof iValue) == "number")) {
var err=((((((("Error:: " + "Не является числом") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не является числом");

}


}

;
if (!(((-(Math.pow(2, iX - 1))) <= iValue) && (iValue <= ((Math.pow(2, iX - 1)) - 1)))) {
var err=((((((("Error:: " + ("Это значение не влезет в тип int" + iX)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Это значение не влезет в тип int" + iX));

}


}

;
switch(iX) {
case 8:
var arrTmpBuf=new Int8Array(1);
arrTmpBuf[0] = iValue;
break ;

case 16:
var arrTmpBuf=new Int16Array(1);
arrTmpBuf[0] = iValue;
break ;

case 32:
var arrTmpBuf=new Int32Array(1);
arrTmpBuf[0] = iValue;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");

}


}

;
break ;
}
this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
this._iCountData += iX / 8;

};
BinWriter.prototype._floatX = function(fValue, iX) {
if (fValue === null) {
fValue = 0;

}

if (!((typeof fValue) == "number")) {
var err=((((((("Error:: " + "Не является числом") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не является числом");

}


}

;
switch(iX) {
case 32:
var arrTmpBuf=new Float32Array(1);
arrTmpBuf[0] = fValue;
break ;

case 64:
var arrTmpBuf=new Float64Array(1);
arrTmpBuf[0] = fValue;
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Передано недопустимое значение длинны. Допустимые значения 32, 64.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передано недопустимое значение длинны. Допустимые значения 32, 64.");

}


}

;
break ;
}
this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
this._iCountData += iX / 8;

};
BinWriter.prototype.float32 = function(fValue) {
this._floatX(fValue, 32);

};
BinWriter.prototype.float64 = function(fValue) {
this._floatX(fValue, 64);

};
BinWriter.prototype.stringArray = function(arrString) {
if ((arrString === null) || (arrString === undefined)) {
this.uint32(4294967295);
return ;

}

this.uint32(arrString.length);
for (var i=0; i < (arrString.length); i++) {
this.string(arrString[i]);

}


};
BinWriter.prototype._uintXArray = function(arrUint, iX) {
if ((arrUint === null) || (arrUint === undefined)) {
this.uint32(4294967295);
return ;

}

var iUintArrLength=arrUint.length;
switch(iX) {
case 8:
var iBitesToAdd=((4 - (iUintArrLength % 4)) == 4? 0 : 4 - (iUintArrLength % 4));
if ((iBitesToAdd > 0) || (!(arrUint instanceof Uint8Array))) {
var arrTmpUint=new Uint8Array(iUintArrLength + iBitesToAdd);
arrTmpUint.set(arrUint);

}
else  {
arrTmpUint = arrUint;

}

break ;

case 16:
var iBitesToAdd=((2 - (iUintArrLength % 2)) == 2? 0 : 2 - (iUintArrLength % 2));
if ((iBitesToAdd > 0) || (!(arrUint instanceof Uint16Array))) {
var arrTmpUint=new Uint16Array(iUintArrLength + iBitesToAdd);
arrTmpUint.set(arrUint);

}
else  {
arrTmpUint = arrUint;

}

break ;

case 32:
if (!(arrUint instanceof Uint32Array)) {
arrTmpUint = new Uint32Array(arrUint);

}
else  {
arrTmpUint = arrUint;

}

break ;
}
this.uint32(iUintArrLength);
for (var i=0; i < (arrTmpUint.length); i++) {
this._writeArrayElementUintX(arrTmpUint[i], iX);

}


};
BinWriter.prototype.uint8Array = function(arrUint) {
this._uintXArray(arrUint, 8);

};
BinWriter.prototype.uint16Array = function(arrUint) {
this._uintXArray(arrUint, 16);

};
BinWriter.prototype.uint32Array = function(arrUint) {
this._uintXArray(arrUint, 32);

};
BinWriter.prototype._intXArray = function(arrInt, iX) {
if ((arrInt === null) || (arrInt === undefined)) {
this.uint32(4294967295);
return ;

}

var iIntArrLength=arrInt.length;
switch(iX) {
case 8:
var iBitesToAdd=((4 - (iIntArrLength % 4)) == 4? 0 : 4 - (iIntArrLength % 4));
if ((iBitesToAdd > 0) || (!(arrInt instanceof Int8Array))) {
var arrTmpInt=new Int8Array(iIntArrLength + iBitesToAdd);
arrTmpInt.set(arrInt);

}
else  {
arrTmpInt = arrInt;

}

break ;

case 16:
var iBitesToAdd=((2 - (iIntArrLength % 2)) == 2? 0 : 2 - (iIntArrLength % 2));
if ((iBitesToAdd > 0) || (!(arrInt instanceof Int16Array))) {
var arrTmpInt=new Int16Array(iIntArrLength + iBitesToAdd);
arrTmpInt.set(arrInt);

}
else  {
arrTmpInt = arrInt;

}

break ;

case 32:
if (!(arrInt instanceof Int32Array)) {
arrTmpInt = new Int32Array(arrInt);

}
else  {
arrTmpInt = arrInt;

}

break ;
}
this.uint32(iIntArrLength);
for (var i=0; i < (arrTmpInt.length); i++) {
this._writeArrayElementIntX(arrTmpInt[i], iX);

}


};
BinWriter.prototype.int8Array = function(arrInt) {
this._intXArray(arrInt, 8);

};
BinWriter.prototype.int16Array = function(arrInt) {
this._intXArray(arrInt, 16);

};
BinWriter.prototype.int32Array = function(arrInt) {
this._intXArray(arrInt, 32);

};
BinWriter.prototype._floatXArray = function(arrFloat, iX) {
if ((arrFloat === null) || (arrFloat === undefined)) {
this.uint32(4294967295);
return ;

}

switch(iX) {
case 32:
if (!(arrFloat instanceof Float32Array)) {
arrFloat = new Float32Array(arrFloat);

}

break ;

case 64:
if (!(arrFloat instanceof Float64Array)) {
arrFloat = new Float64Array(arrFloat);

}

break ;
}
var iFloatArrLength=arrFloat.length;
this.uint32(iFloatArrLength);
for (var i=0; i < (arrFloat.length); i++) {
this._floatX(arrFloat[i], iX);

}


};
BinWriter.prototype.float32Array = function(arrFloat) {
this._floatXArray(arrFloat, 32);

};
BinWriter.prototype.float64Array = function(arrFloat) {
this._floatXArray(arrFloat, 64);

};
BinWriter.prototype.data = function() {
var tmpArrBuffer=new Uint8Array(this._iCountData);
for (var i=0, k=0; i < (this._pArrData.length); i++) {
for (var n=0; n < (this._pArrData[i].length); n++) {
tmpArrBuffer[k++] = this._pArrData[i][n];

}


}

return tmpArrBuffer.buffer;

};
BinWriter.prototype.dataAsString = function() {
var tmpArrBuffer=new Uint8Array(this._iCountData);
for (var i=0, k=0; i < (this._pArrData.length); i++) {
for (var n=0; n < (this._pArrData[i].length); n++) {
tmpArrBuffer[k++] = this._pArrData[i][n];

}


}

var sString="";
for (var n=0; n < (tmpArrBuffer.length); ++n) {
var charCode=String.fromCharCode(tmpArrBuffer[n]);
sString = sString + charCode;

}

return sString;

};
BinWriter.prototype.dataAsUint8Array = function() {
var arrUint8=new Uint8Array(this._iCountData);
for (var i=0, k=0; i < (this._pArrData.length); i++) {
for (var n=0; n < (this._pArrData[i].length); n++) {
arrUint8[k++] = this._pArrData[i][n];

}


}

return arrUint8;

};
BinWriter.rawStringToBuffer = function(str) {
var idx;
var len=str.length;
var iBitesToAdd=((4 - (len % 4)) == 4? 0 : 4 - (len % 4));
var arr=new Array(len + iBitesToAdd);
for (idx = 0; idx < len; ++idx) {
arr[idx] = str.charCodeAt(idx);

}

return new Uint8Array(arr);

};
a.BinWriter = BinWriter;
function URI() {
this.sScheme = null;
this.sUserinfo = null;
this.sHost = null;
this.nPort = null;
this.sPath = null;
this.sQuery = null;
this.sFragment = null;
if (arguments.length) {
this.set(arguments[0]);

}


}

URI.prototype.regexpUri = /^([a-z0-9+.-]+:)?(?:\/\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$/i;
URI.prototype.set = function(sData) {
if ((typeof sData) == "string") {
var pUri=this.regexpUri.exec(sData);
if (!pUri) {
throw new Error("Invalid URI format used.\nused uri: " + sData);

}

this.sScheme = (pUri[1]) || null;
this.sUserinfo = (pUri[2]) || null;
this.sHost = (pUri[3]) || null;
this.nPort = (parseInt(pUri[4])) || null;
this.sPath = ((pUri[5]) || (pUri[6])) || null;
this.sQuery = (pUri[7]) || null;
this.sFragment = (pUri[8]) || null;

}
else if (sData instanceof URI) {
this.set(sData.toString());

}
else  {
throw new TypeError("Unexpected data type was used.");

}



};
URI.prototype.toString = function() {
return (this.url) + (this.urn);

};
Object.defineProperty(URI.prototype, "urn",  {get: function() {
return (((this.sPath? this.sPath : "")) + ((this.sQuery? "?" + (this.sQuery) : ""))) + ((this.sFragment? "#" + (this.sFragment) : ""));

}
});
Object.defineProperty(URI.prototype, "url",  {get: function() {
return ((this.sScheme? this.sScheme : "")) + (this.authority);

}
});
Object.defineProperty(URI.prototype, "authority",  {get: function() {
return (this.sHost? (("//" + ((this.sUserinfo? (this.sUserinfo) + "@" : ""))) + (this.sHost)) + ((this.nPort? ":" + (this.nPort) : "")) : "");

}
});
Object.defineProperty(URI.prototype, "scheme",  {get: function() {
return this.sScheme;

}
});
Object.defineProperty(URI.prototype, "protocol",  {get: function() {
if (!(this.sScheme)) {
return this.sScheme;

}

return this.sScheme.substr(0, this.sScheme.lastIndexOf(":"));

}
});
Object.defineProperty(URI.prototype, "userinfo",  {get: function() {
return this.sUserinfo;

}
});
Object.defineProperty(URI.prototype, "host",  {get: function() {
return this.sHost;

}
});
Object.defineProperty(URI.prototype, "port",  {get: function() {
return this.nPort;

}
});
Object.defineProperty(URI.prototype, "path",  {get: function() {
return this.sPath;

}
});
Object.defineProperty(URI.prototype, "query",  {get: function() {
return this.sQuery;

}
});
Object.defineProperty(URI.prototype, "fragment",  {get: function() {
return this.sFragment;

}
});
a.URI = URI;
a.uri = function(sUri) {
return new a.URI(sUri);

};
function Pathinfo() {
this.sDirname = null;
this.sExtension = null;
this.sFilename = null;
if (arguments.length) {
this.set(arguments[0]);

}


}

Pathinfo.prototype.set = function(sPath) {
if ((typeof sPath) == "string") {
var pParts=sPath.replace("\\", "/").split("/");
this.basename = pParts.pop();
this.sDirname = pParts.join("/");

}
else if (sPath instanceof Pathinfo) {
this.sDirname = sPath.sDirname;
this.sFilename = sPath.sFilename;
this.sExtension = sPath.sExtension;

}
else  {
throw new TypeError("Unexpected data type was used.");

}



};
Pathinfo.prototype.toString = function() {
return ((this.sDirname? (this.sDirname) + "/" : "")) + (this.basename);

};
Object.defineProperty(Pathinfo.prototype, "data",  {get: function() {
return this.toString();

}
, set: function(sPath) {
this.set(sPath);

}
});
Object.defineProperty(Pathinfo.prototype, "path",  {get: function() {
return this.toString();

}
, set: function(sPath) {
this.set(sPath);

}
});
Object.defineProperty(Pathinfo.prototype, "dirname",  {get: function() {
return this.sDirname;

}
});
Object.defineProperty(Pathinfo.prototype, "filename",  {get: function() {
return this.sFilename;

}
, set: function(sFilename) {
this.basename = (sFilename + ".") + (this.sExtension);

}
});
Object.defineProperty(Pathinfo.prototype, "ext",  {get: function() {
return this.sExtension;

}
});
Object.defineProperty(Pathinfo.prototype, "extention",  {get: function() {
return this.sExtension;

}
, set: function(sExt) {
this.basename = ((this.sFilename) + ".") + sExt;

}
});
Object.defineProperty(Pathinfo.prototype, "basename",  {get: function() {
return (this.sFilename? (this.sFilename) + ((this.sExtension? "." + (this.sExtension) : "")) : "");

}
, set: function(sBasename) {
var nPos=sBasename.lastIndexOf(".");
if (nPos < 0) {
this.sFilename = sBasename.substr(0);
this.sExtension = null;

}
else  {
this.sFilename = sBasename.substr(0, nPos);
this.sExtension = sBasename.substr(nPos + 1);

}


}
});
a.Pathinfo = Pathinfo;
a.pathinfo = function(sPath) {
return new a.Pathinfo(sPath);

};
a.io =  {};
a.io.stringTomode = function(sMode) {
switch(sMode.toLowerCase()) {
case "a+t":
return (((1) | (2)) | (8)) | (64);

case "w+t":
return (((1) | (2)) | (16)) | (64);

case "r+t":
return ((1) | (2)) | (64);

case "at":
return (8) | (64);

case "wt":
return (2) | (64);

case "rt":
return (1) | (64);

case "a+b":
return (((1) | (2)) | (8)) | (32);

case "w+b":
return (((1) | (2)) | (16)) | (32);

case "r+b":
return ((1) | (2)) | (32);

case "ab":
return (8) | (32);

case "wb":
return (2) | (32);

case "rb":
return (1) | (32);

case "a+":
return ((1) | (2)) | (8);

case "w+":
return ((1) | (2)) | (16);

case "r+":
return (1) | (2);

case "a":
return (8) | (2);

case "w":
return 2;

case "r":
;

default:
return 1;
}

};
function ThreadManager(sScript, pWorker) {
;
this._sScript = sScript || null;
this._pWorkers = [];
this._pWorkerStatus = [];
for (var i=0; i < (4); ++i) {
this.createThread(sScript, pWorker);

}


}

ThreadManager.prototype.createThread = function(sScript, pWorker) {
sScript = sScript || (this._sScript);
if ((this._pWorkers.length) == (32)) {
if (!0) {
var err=((((((("Error:: " + "Reached limit the number of threads.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Reached limit the number of threads.");

}


}

;

}

var pWorker;
pWorker = new (pWorker || Worker)(sScript);
pWorker.postMessage = (pWorker.webkitPostMessage) || (pWorker.postMessage);
this._pWorkers.push(pWorker);
this._pWorkerStatus.push(1);

};
ThreadManager.prototype.occupyThread = function() {
for (var i=0, n=this._pWorkers.length; i < n; ++i) {
if ((this._pWorkerStatus[i]) == (1)) {
this._pWorkerStatus[i] = 0;
return i;

}


}

this.createThread();
return this.occupyThread();

};
ThreadManager.prototype.releaseThread = function(i) {
this._pWorkerStatus[i] = 1;
return ;

};
ThreadManager.prototype.thread = function(id) {
return this._pWorkers[id];

};
function FileThread() {
;
this._eFileMode = ((typeof (arguments[1])) == "string"? a.io.stringTomode(arguments[1]) : (arguments[1]) || (1));
this._pFileName = (a.uri(arguments[0])) || null;
this._pFile = null;
this._nSeek = 0;
this._iThread = -1;
this._eTransferMode = (a.info.support.api.transferableObjects? 1 : ((a.info.browser.sBrowser) == "Opera"? 2 : 0));
if ((arguments.length) > 2) {
this.open(arguments[0], arguments[1], arguments[2], arguments[3]);

}


}

FileThread.prototype._thread = function(fnSuccess, fnError) {
var pFile=this;
var pManager=pFile._manager();
var iThread=pManager.occupyThread();
pFile._iThread = iThread;
function release() {
pManager.releaseThread(pFile._iThread);
pFile._iThread = -1;

}

function setup(pThread) {
var me= {};
me.onmessage = fnSuccess || null;
me.onerror = fnError || null;
pThread.onmessage = function(e) {
release();
if (me.onmessage) {
me.onmessage.call(pFile, e.data);

}


};
pThread.onerror = function(e) {
console.log("release thread(err)", e);
release();
if (me.onerror) {
me.onerror.call(pFile, e.data);

}


};
me.send = function(data) {
pThread.postMessage(data);

};
return me;

}

return setup(pManager.thread(this._iThread));

};
FileThread.prototype._manager = function() {
return this._pThreadManager;

};
FileThread.prototype._pThreadManager = null;
FileThread.prototype.open = function() {
if (!(((arguments.length) >= 0) && ((arguments.length) < 5))) {
var err=((((((("Error:: " + (("Invalid number(" + (arguments.length)) + ") of parameters.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Invalid number(" + (arguments.length)) + ") of parameters."));

}


}

;
var fnSuccess, fnError, hasMode=(typeof (arguments[1])) != "function";
if ((arguments.length) < 3) {
if ((typeof (arguments[0])) == "string") {
this._pFileName = arguments[0];
fnSuccess = arguments[1];
fnError = null;

}
else if ((typeof (arguments[0])) == "number") {
this._eFileMode = arguments[0];
fnSuccess = arguments[1];
fnError = null;

}
else  {
fnSuccess = arguments[0];
fnError = (arguments[1]) || null;

}


if (!this._pFileName) {
var err=((((((("Error:: " + "No filename provided.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("No filename provided.");

}


}

;
this.open(this._pFileName, this._eFileMode, fnSuccess, fnError);
return ;

}

fnSuccess = arguments[(hasMode? 2 : 1)];
fnError = (arguments[(hasMode? 3 : 2)]) || null;
if (this.isOpened()) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "file already opened.");
fnSuccess(this._pFile);

}

this._pFileName = a.uri(arguments[0]);
this._eFileMode = (hasMode? ((typeof (arguments[1])) == "string"? a.io.stringTomode(arguments[1]) : arguments[1]) : this._eFileMode);
this._update(function() {
if ((this._eFileMode & (1 << 3)) != 0) {
this.position = this.size;

}

fnSuccess.call(this);

}
, fnError);

};
Object.defineProperty(FileThread.prototype, "path",  {get: function() {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
return this._pFileName.toString();

}
});
FileThread.prototype.close = function() {
this._pFileName = null;
this._eFileMode = (1) | (2);
this._nLength = 0;
this._nSeek = 0;
 {
if (this._pFile) {
if (this._pFile.destructor) {
this._pFile.destructor();

}

delete this._pFile;
this._pFile = null;

}


};

};
FileThread.prototype.clear = function(fnSuccess, fnError) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.clear.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
this._thread(fnSuccess, fnError).send( {act: 4, name: this._pFileName.toString(), mode: this._eFileMode});

};
Object.defineProperty(FileThread.prototype, "name",  {get: function() {
return a.pathinfo(this._pFileName.path).basename;

}
, set: function(sFileName) {
if (!(!(this._pFile))) {
var err=((((((("Error:: " + "There is file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is file handle open.");

}


}

;
var pPath=a.pathinfo(this._pFileName.path);
pPath.basename = sFileName;
this._pFileName.sPath = pPath.toString();

}
});
FileThread.prototype.isOpened = function() {
return (this._pFile) != null;

};
Object.defineProperty(FileThread.prototype, "mode",  {set: function(pMode) {
this._eFileMode = ((typeof pMode) == "string"? a.io.stringTomode(pMode) : pMode);

}
, get: function() {
return this._eFileMode;

}
});
Object.defineProperty(FileThread.prototype, "onread",  {set: function(fn) {
this.read(fn);

}
});
Object.defineProperty(FileThread.prototype, "onopen",  {set: function(fn) {
this.read(fn);

}
});
FileThread.prototype._update = function(fnSuccess, fnError) {
var pThread=this._thread();
var me=this;
pThread.onmessage = function(e) {
me._pFile = e;
fnSuccess.call(me);

};
pThread.onerror = fnError;
pThread.send( {act: 1, name: this._pFileName.toString(), mode: this._eFileMode});

};
FileThread.prototype.read = function(fnSuccess, fnError) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.read.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
var pThread=this._thread();
var me=this;
if (!(this._eFileMode & (1 << 0)) != 0) {
var err=((((((("Error:: " + "The file is not readable.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The file is not readable.");

}


}

;
pThread.onerror = fnError;
pThread.onmessage = function(e) {
if (((me._eTransferMode) == (2)) && ((this._eFileMode & (1 << 5)) != 0)) {
e = new Uint8Array(e).buffer;

}

me.atEnd();
fnSuccess.call(me, e);

};
pThread.send( {act: 2, name: this._pFileName.toString(), mode: this._eFileMode, pos: this._nSeek, transfer: this._eTransferMode});

};
FileThread.prototype.write = function(pData, fnSuccess, fnError, sContentType) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.write.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
var pThread=this._thread();
var me=this;
var iMode=this._eFileMode;
if (!(iMode & (1 << 1)) != 0) {
var err=((((((("Error:: " + "The file is not writable.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The file is not writable.");

}


}

;
pThread.onerror = fnError;
pThread.onmessage = function(e) {
me._pFile = e;
me._nSeek += ((typeof pData) == "string"? pData.length : pData.byteLength);
fnSuccess.apply(me, arguments);

};
sContentType = sContentType || (((iMode & (1 << 5)) != 0? "application/octet-stream" : "text/plain"));
pThread.send( {act: 3, name: this._pFileName.toString(), mode: this._eFileMode, data: pData, contentType: sContentType, pos: this._nSeek});

};
FileThread.prototype.atEnd = function() {
this.position = this.size;

};
Object.defineProperty(FileThread.prototype, "position",  {get: function() {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
return this._nSeek;

}
, set: function(iOffset) {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
this._nSeek = iOffset;

}
});
Object.defineProperty(FileThread.prototype, "size",  {get: function() {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
return this._pFile.size;

}
});
FileThread.prototype.seek = function(iOffset) {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
var nSeek=(this._nSeek) + iOffset;
if (nSeek < 0) {
nSeek = (this.size) - ((Math.abs(nSeek)) % (this.size));

}

if (!((nSeek >= 0) && (nSeek <= (this.size)))) {
var err=((((((("Error:: " + "Invalid offset parameter") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Invalid offset parameter");

}


}

;
this._nSeek = nSeek;

};
FileThread.prototype.isExists = function(fnSuccess, fnError) {
this._thread(fnSuccess, fnError).send( {act: 5, name: this._pFileName.toString(), mode: this._eFileMode});

};
FileThread.prototype.move = function(pFileName, fnSuccess, fnError) {
var me=this;
this.copy(pFileName, function() {
me.remove(fnSuccess, fnError);

}
, fnError);

};
FileThread.prototype.rename = function(pFileName, fnSuccess, fnError) {
var pName=a.pathinfo(pFileName);
if (!(!(pName.dirname))) {
var err=((((((("Error:: " + "only filename can be specified.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("only filename can be specified.");

}


}

;
this.move(((a.pathinfo(this._pFileName.path).sDirname) + "/") + (pName.basename), fnSuccess, fnError);

};
FileThread.prototype.copy = function(pFileName, fnSuccess, fnError) {
var iMode=((1) | (2)) | (16);
if ((this._eFileMode & (1 << 5)) != 0) {
iMode |= 32;

}

var me=this;
var pFile=new this.constructor(pFileName, iMode, function() {
me.read(function(pData) {
pFile.write(pData, fnSuccess, fnError);

}
);

}
, fnError);

};
FileThread.prototype.getMetadata = function(fnSuccess, fnError) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.getMetadata.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
fnSuccess( {lastModifiedDate: this._pFile.lastModifiedDate});

};
FileThread.prototype.remove = function(fnSuccess, fnError) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.remove.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
var pThread=this._thread();
var me=this;
pThread.onerror = fnError;
pThread.onmessage = function(e) {
me.close();
if (fnSuccess) {
fnSuccess.call(me, e);

}


};
pThread.send( {act: 6, name: this._pFileName.toString(), mode: this._eFileMode});

};
a.FileThread = FileThread;
function BrowserInfo() {
this.sBrowser = null;
this.sVersion = null;
this.sOS = null;
this._sVersionSearch = null;
this.dataBrowser = [ {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},  {string: navigator.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb"},  {string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version"},  {prop: window.opera, identity: "Opera", versionSearch: "Version"},  {string: navigator.vendor, subString: "iCab", identity: "iCab"},  {string: navigator.vendor, subString: "KDE", identity: "Konqueror"},  {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},  {string: navigator.vendor, subString: "Camino", identity: "Camino"},  {string: navigator.userAgent, subString: "Netscape", identity: "Netscape"},  {string: navigator.userAgent, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE"},  {string: navigator.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv"},  {string: navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla"}];
this.dataOS = [ {string: navigator.platform, subString: "Win", identity: "Windows"},  {string: navigator.platform, subString: "Mac", identity: "Mac"},  {string: navigator.userAgent, subString: "iPhone", identity: "iPhone/iPod"},  {string: navigator.platform, subString: "Linux", identity: "Linux"}];
this.init();

}

BrowserInfo.prototype.init = function() {
this.sBrowser = (this._searchString(this.dataBrowser)) || "An unknown browser";
this.sVersion = ((this._searchVersion(navigator.userAgent)) || (this._searchVersion(navigator.appVersion))) || "an unknown version";
this.sOS = (this._searchString(this.dataOS)) || "an unknown OS";

};
BrowserInfo.prototype._searchString = function(sDataBrowser) {
for (var i=0; i < (sDataBrowser.length); i++) {
var sData=sDataBrowser[i].string;
var dataProp=sDataBrowser[i].prop;
this._sVersionSearch = (sDataBrowser[i].versionSearch) || (sDataBrowser[i].identity);
if (sData) {
if ((sData.indexOf(sDataBrowser[i].subString)) != (-1)) {
return sDataBrowser[i].identity;

}


}
else if (dataProp) {
return sDataBrowser[i].identity;

}



}

return null;

};
BrowserInfo.prototype._searchVersion = function(sData) {
var iStartIndex=sData.indexOf(this._sVersionSearch);
if (iStartIndex == (-1)) {
return null;

}

iStartIndex = sData.indexOf("/", iStartIndex + 1);
if (iStartIndex == (-1)) {
return null;

}

var iEndIndex=sData.indexOf(" ", iStartIndex + 1);
if (iEndIndex == (-1)) {
iEndIndex = sData.indexOf(";", iStartIndex + 1);
if (iEndIndex == (-1)) {
return null;

}

return sData.slice(iStartIndex + 1);

}
else  {
return sData.slice(iStartIndex + 1, iEndIndex);

}


};
Object.defineProperty(BrowserInfo.prototype, "name",  {get: function() {
return this.sBrowser;

}
});
Object.defineProperty(BrowserInfo.prototype, "version",  {get: function() {
return this.sVersion;

}
});
Object.defineProperty(BrowserInfo.prototype, "os",  {get: function() {
return this.sOS;

}
});
window.URL = (window.URL? window.URL : (window.webkitURL? window.webkitURL : null));
window.BlobBuilder = ((window.WebKitBlobBuilder) || (window.MozBlobBuilder)) || (window.BlobBuilder);
window.requestFileSystem = (window.requestFileSystem) || (window.webkitRequestFileSystem);
window.requestAnimationFrame = ((window.requestAnimationFrame) || (window.webkitRequestAnimationFrame)) || (window.mozRequestAnimationFrame);
function ApiInfo() {
this.webgl = ((window.WebGLRenderingContext) || (this.checkWebGL())? true : false);
this.webAudio = ((window.AudioContext) && (window.webkitAudioContext)? true : false);
this.file = ((((window.File) && (window.FileReader)) && (window.FileList)) && (window.Blob)? true : false);
this.fileSystem = (((this.file) && (window.URL)) && (window.requestFileSystem)? true : false);
this.webWorker = (typeof Worker) !== "undefined";
this.transferableObjects = ((this.webWorker) && (this.chechTransferableObjects())? true : false);
this.localStorage = (typeof localStorage) !== "undefined";

}

ApiInfo.prototype.checkWebGL = function() {
try {
var pCanvas=document.createElement("canvas");
var pContext=(pCanvas.getContext("webgl")) || (pCanvas.getContext("experimental-webgl"));
if (pContext) {
delete pContext;
return true;

}


}
catch(e) {

}
return false;

};
ApiInfo.prototype.chechTransferableObjects = function() {
var pWorker=new Worker(("/akra-engine-core/src/" + "files/threads/") + "EmptyThread.thread.js");
pWorker.postMessage = (pWorker.webkitPostMessage) || (pWorker.postMessage);
var ab=new ArrayBuffer(1);
try {
pWorker.postMessage(ab, [ab]);

}
catch(e) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "transferable objects not supported in your browser...");

}
pWorker.terminate();
if (ab.byteLength) {
return false;

}

return true;

};
a.browser = new BrowserInfo();
a.info =  {canvas: function(id) {
var pCanvas=((typeof id) == "string"? document.getElementById(id) : id);
return  {width: (pCanvas.width? pCanvas.width : pCanvas.style.width), height: (pCanvas.height? pCanvas.height : pCanvas.style.height), id: pCanvas.id};

}
, browser: a.browser, screen:  {width: function() {
return screen.width;

}
, height: function() {
return screen.height;

}
}, uri: a.uri(document.location.href), path:  {modules: "/akra-engine-core/src/"}, is:  {online: function() {
return navigator.onLine;

}
, mobile: /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()), linux: (a.browser.os) == "Linux", windows: (a.browser.os) == "Windows", mac: (a.browser.os) == "Mac", iPhone: (a.browser.os) == "iPhone"}, support:  {}, graphics:  {maxTextureSize: function(pContext) {
return pContext.getParameter(pContext.MAX_TEXTURE_SIZE);

}
, maxCubeMapTextureSize: function(pContext) {
return pContext.getParameter(pContext.MAX_CUBE_MAP_TEXTURE_SIZE);

}
, maxViewPortSize: function(pContext) {
return pContext.getParameter(pContext.MAX_VIEWPORT_DIMS);

}
, stencilBits: function(pContext) {
return pContext.getParameter(pContext.STENCIL_BITS);

}
, colorBits: function(pContext) {
return [pContext.getParameter(pContext.RED_BITS), pContext.getParameter(pContext.GREEN_BITS), pContext.getParameter(pContext.BLUE_BITS)];

}
, alphaBits: function(pContext) {
return pContext.getParameter(pContext.ALPHA_BITS);

}
, depthBits: function(pContext) {
return pContext.getParameter(pContext.DEPTH_BITS);

}
, multisampleType: function(pContext) {
return pContext.getParameter(pContext.SAMPLE_COVERAGE_VALUE);

}
, maxTextureImageUnits: function(pContext) {
return pContext.getParameter(pContext.MAX_TEXTURE_IMAGE_UNITS);

}
, maxVertexAttributes: function(pContext) {
return 16;

}
, maxVertexTextureImageUnits: function(pContext) {
return pContext.getParameter(pContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

}
, maxCombinedTextureImageUnits: function(pContext) {
return pContext.getParameter(pContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

}
, shaderVersion: function(pContext) {
var sVersion=pContext.getParameter(pContext.SHADING_LANGUAGE_VERSION);
var iTmp=sVersion.indexOf(sVersion.match(/\d/)[0]);
return parseFloat(sVersion.substr(iTmp));

}
, getExtention: function(pContext, eExtention) {
var pExtentions, sExtention, result=false, pExp;
pExtentions = pContext.getSupportedExtensions();
switch(eExtention) {
case 0:
pExp = "texture_float";
break ;

case 1:
pExp = "texture_half_float";
break ;

case 2:
pExp = "compressed_texture";
break ;

case 3:
pExp = "standard_derivatives";
break ;

default:
return null;
}
for (var i in pExtentions) {
sExtention = pExtentions[i];
if ((sExtention.search(pExp)) != (-1)) {
result = pContext.getExtension(sExtention);
console.log("extension successfuly loaded: " + sExtention);

}


}

return result;

}
, checkFormat: function(pContext, eFormat) {
switch(eFormat) {
case 33776:
;

case 33777:
;

case 33780:
;

case 33778:
;

case 33781:
;

case 33779:
for (var i in pContext) {
if (((typeof (pContext[i])) == "number") && ((pContext[i]) == eFormat)) {
return true;

}


}

return false;

case 6407:
;

case 6408:
;

case 32854:
;

case 32855:
;

case 36194:
return true;

default:
return false;
}

}
}};
a.info.support.api = new ApiInfo();
Object.defineProperty(a.info.is, "online",  {get: function() {
return navigator.onLine;

}
});
Object.defineProperty(a.info.support, "webgl",  {get: function() {
return a.info.support.api.webgl;

}
});
Object.defineProperty(a.info.support, "webAudio",  {get: function() {
return a.info.support.api.webAudio;

}
});
Object.defineProperty(a.info.support, "fs",  {get: function() {
return a.info.support.api.fileSystem;

}
});
Object.defineProperty(a.info.screen, "width",  {get: function() {
return screen.width;

}
});
Object.defineProperty(a.info.screen, "height",  {get: function() {
return screen.height;

}
});
if (a.info.support.api.webWorker) {
function RemoteFileThread() {
RemoteFileThread.superclass.constructor.apply(this, arguments);

}

a.extend(RemoteFileThread, a.FileThread);
RemoteFileThread.prototype._pThreadManager = new ThreadManager(("/akra-engine-core/src/" + "files/threads/") + "RemoteFile.thread.js");
a.RemoteFile = RemoteFileThread;
if (a.info.support.api.fileSystem) {
function LocalFileThread() {
LocalFileThread.superclass.constructor.apply(this, arguments);

}

a.extend(LocalFileThread, a.FileThread);
LocalFileThread.prototype._pThreadManager = new ThreadManager(("/akra-engine-core/src/" + "files/threads/") + "LocalFile.thread.js");
a.LocalFile = LocalFileThread;

}
else if (a.info.support.api.localStorage) {
;
function LocalFileSimplified() {
LocalFileSimplified.superclass.constructor.apply(this, arguments);

}

a.extend(LocalFileSimplified, a.FileThread);
LocalFileSimplified.prototype.clear = function(fnSuccess) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.clear.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
localStorage.setItem(this.path, "");
this._pFile.size = 0;
if (fnSuccess) {
fnSuccess.apply(this);

}


};
LocalFileSimplified.prototype._read = function() {
var pFile=this._pFile;
var pData=localStorage.getItem(this.path);
if (pData == null) {
pData = "";
if ((pData & (1 << 1)) != 0) {
localStorage.setItem(this.path, pData);

}


}

if ((this._eFileMode & (1 << 5)) != 0) {
pData = a.str2buf(pData);
pFile.size = pData.byteLength;

}
else  {
pFile.size = pData.length;

}

return pData;

};
LocalFileSimplified.prototype._update = function(fnSuccess) {
this._pFile =  {};
this._read();
fnSuccess.apply(this);

};
LocalFileSimplified.prototype.read = function(fnSuccess) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.read.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
if (!(this._eFileMode & (1 << 0)) != 0) {
var err=((((((("Error:: " + "The file is not readable.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The file is not readable.");

}


}

;
var pData=this._read();
var nPos=this._nSeek;
if (nPos) {
if ((this._eFileMode & (1 << 5)) != 0) {
pData = new Uint8Array(new Uint8Array(pData).subarray(nPos)).buffer;

}
else  {
pData = pData.substr(nPos);

}


}

this.atEnd();
if (fnSuccess) {
fnSuccess.apply(this, [pData]);

}


};
LocalFileSimplified.prototype.write = function(pData, fnSuccess, fnError, sContentType) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.write.apply(this, pArgs);

}
, fnError);
return ;

}

if (!((this._iThread) < 0)) {
var err=((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)));

}


}

;
var iMode=this._eFileMode;
if (!(iMode & (1 << 1)) != 0) {
var err=((((((("Error:: " + "The file is not writable.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The file is not writable.");

}


}

;
sContentType = sContentType || (((iMode & (1 << 5)) != 0? "application/octet-stream" : "text/plain"));
var sData=this._read();
if ((typeof sData) == "object") {
sData = a.buf2str(sData);

}

var nSeek=((typeof pData) == "string"? pData.length : pData.byteLength);
if ((typeof pData) == "object") {
pData = a.buf2str(pData);

}

pData = ((sData.substr(0, this._nSeek)) + pData) + (sData.substr((this._nSeek) + (pData.length)));
try {
localStorage.setItem(this.path, pData);

}
catch(e) {
if (fnError) {
fnError.apply(this, [e]);

}
else  {
throw e;

}


}
this._pFile.size = pData.length;
this._nSeek += nSeek;
if (fnSuccess) {
fnSuccess.apply(this);

}


};
LocalFileSimplified.prototype.isExists = function(fnSuccess) {
fnSuccess.apply(this, [(localStorage.getItem(this.path)) == null]);

};
LocalFileSimplified.prototype.remove = function(fnSuccess) {
localStorage.removeItem(this.path);
fnSuccess.apply(this);

};
a.LocalFile = LocalFileSimplified;

}
else  {
if (!0) {
var err=((((((("Error:: " + "Your browser not support file system!") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Your browser not support file system!");

}


}

;

}



}
else if (a.info.support.api.fileSystem) {
;
function LocalFile() {
this._eFileMode = ((typeof (arguments[1])) == "string"? a.io.stringTomode(arguments[1]) : (arguments[1]) || (1));
this._pFileName = (a.pathinfo(arguments[0])) || null;
this._pFile = null;
this._pFileReader = new FileReader();
this._nSeek = 0;
this._pFileHandle = null;
if ((arguments.length) > 2) {
this.open(arguments[0], arguments[1], arguments[2], arguments[3]);

}


}

function LocalFS() {
this._pFileSystem = null;
this._pCallbackQueue = [];

}

LocalFS.prototype.get = function(fnCallback) {
if (this._pFileSystem) {
fnCallback(this._pFileSystem);
return ;

}

var me=this;
var pQueue=me._pCallbackQueue;
pQueue.push(fnCallback);
if ((pQueue.length) > 1) {
return ;

}

var fnErrorHandler=function(e) {
var msg="Init filesystem: ";
switch(e.code) {
case FileError.QUOTA_EXCEEDED_ERR:
msg += "QUOTA_EXCEEDED_ERR";
break ;

case FileError.NOT_FOUND_ERR:
msg += "NOT_FOUND_ERR";
break ;

case FileError.SECURITY_ERR:
msg += "SECURITY_ERR";
break ;

case FileError.INVALID_MODIFICATION_ERR:
msg += "INVALID_MODIFICATION_ERR";
break ;

case FileError.INVALID_STATE_ERR:
msg += "INVALID_STATE_ERR";
break ;

default:
msg += "Unknown Error";
break ;
}
if (!0) {
var err=((((((("Error:: " + msg) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(msg);

}


}

;

};
window.requestFileSystem = (window.requestFileSystem) || (window.webkitRequestFileSystem);
window.webkitStorageInfo.requestQuota(window.TEMPORARY, (32 * 1024) * 1024, function(nGrantedBytes) {
window.requestFileSystem(window.TEMPORARY, nGrantedBytes, function(pFs) {
me._pFileSystem = pFs;
if (pQueue.length) {
for (var i=0; i < (pQueue.length); ++i) {
pQueue[i](pFs);

}


}


}
, fnErrorHandler);

}
);

};
LocalFile.prototype._pFileSystem = new LocalFS();
LocalFile.prototype._fs = function(fn) {
this._pFileSystem.get(fn);

};
Object.defineProperty(LocalFile.prototype, "mode",  {set: function(pMode) {
this._eFileMode = ((typeof pMode) == "string"? a.io.stringTomode(pMode) : pMode);

}
, get: function() {
return this._eFileMode;

}
});
LocalFile.prototype._errorHandler = function(e) {
var msg="";
switch(e.code) {
case FileError.QUOTA_EXCEEDED_ERR:
msg += "QUOTA_EXCEEDED_ERR";
break ;

case FileError.NOT_FOUND_ERR:
msg += "NOT_FOUND_ERR";
break ;

case FileError.SECURITY_ERR:
msg += "SECURITY_ERR";
break ;

case FileError.INVALID_MODIFICATION_ERR:
msg += "INVALID_MODIFICATION_ERR";
break ;

case FileError.INVALID_STATE_ERR:
msg += "INVALID_STATE_ERR";
break ;

default:
msg += "Unknown Error";
break ;
}
if (!0) {
var err=((((((("Error:: " + msg) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(msg);

}


}

;

};
LocalFile.prototype.open = function() {
if (!(((arguments.length) >= 0) && ((arguments.length) < 5))) {
var err=((((((("Error:: " + (("Invalid number(" + (arguments.length)) + ") of parameters.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Invalid number(" + (arguments.length)) + ") of parameters."));

}


}

;
var fnSuccess, fnError, hasMode=(typeof (arguments[1])) != "function";
if ((arguments.length) < 3) {
if ((typeof (arguments[0])) == "string") {
this._pFileName = arguments[0];
fnSuccess = arguments[1];
fnError = null;

}
else if ((typeof (arguments[0])) == "number") {
this._eFileMode = arguments[0];
fnSuccess = arguments[1];
fnError = null;

}
else  {
fnSuccess = arguments[0];
fnError = (arguments[1]) || null;

}


if (!this._pFileName) {
var err=((((((("Error:: " + "No filename provided.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("No filename provided.");

}


}

;
this.open(this._pFileName, this._eFileMode, fnSuccess, fnError);
return ;

}

fnSuccess = arguments[(hasMode? 2 : 1)];
fnError = (arguments[(hasMode? 3 : 2)]) || null;
if (this.isOpened()) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "file already opened.");
fnSuccess(this._pFile);

}

var me=this;
var pFileSystem=null;
this._pFileName = a.pathinfo(arguments[0]);
this._eFileMode = (hasMode? ((typeof (arguments[1])) == "string"? a.io.stringTomode(arguments[1]) : arguments[1]) : this._eFileMode);
var fnErrorHandler=function(e) {
var fn=(!fnError? me._errorHandler : fnError);
if (((e.code) == (FileError.NOT_FOUND_ERR)) && ((me._eFileMode & (1 << 1)) != 0)) {
LocalFile.createDir(pFileSystem.root, me._pFileName.dirname.split("/"), function() {
fnFSInited.apply(me, [pFileSystem]);

}
, function() {
fn.apply(me, arguments);

}
);

}
else  {
fn.apply(me, arguments);

}


};
var fnFSInited=function(pFs) {
if (!pFs) {
var err=((((((("Error:: " + "Local file system not initialized.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Local file system not initialized.");

}


}

;
pFileSystem = pFs;
pFs.root.getFile(this._pFileName,  {create: (this._eFileMode & (1 << 1)) != 0, exclusive: false}, function(fileEntry) {
me._pFileHandle = fileEntry;
fileEntry.file(function(file) {
me._pFile = file;
if (((me._eFileMode & (1 << 4)) != 0) && (me.size)) {
me.clear(function() {
fnSuccess.apply(me, [file]);

}
, fnError);
return ;

}

if ((me._eFileMode & (1 << 3)) != 0) {
me.position = me.size;

}

fnSuccess.apply(me, [file]);

}
, fnErrorHandler);

}
, fnErrorHandler);

};
this._fs(function(pFileSystem) {
fnFSInited.apply(me, [pFileSystem]);

}
);

};
Object.defineProperty(LocalFile.prototype, "path",  {get: function() {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
return this._pFileName.toString();

}
});
LocalFile.prototype.close = function() {
this._pFileName = null;
this._eFileMode = (1) | (2);
this._nLength = 0;
this._nSeek = 0;
 {
if (this._pFile) {
if (this._pFile.destructor) {
this._pFile.destructor();

}

delete this._pFile;
this._pFile = null;

}


};

};
LocalFile.prototype.clear = function(fnSuccess, fnError) {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open");

}


}

;
var me=this;
me._pFileHandle.createWriter(function(pWriter) {
pWriter.seek(0);
if (fnSuccess) {
pWriter.onwriteend = function() {
fnSuccess.apply(me, arguments);

};

}

pWriter.truncate(0);

}
, function() {
var fn=fnError || (this._errorHandler);
fn.apply(me.arguments);

}
);

};
Object.defineProperty(LocalFile.prototype, "name",  {get: function() {
return this._pFileName.basename;

}
, set: function(sFileName) {
if (!(!(this._pFile))) {
var err=((((((("Error:: " + "There is file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is file handle open.");

}


}

;
this._pFileName.basename = sFileName;

}
});
LocalFile.prototype.isOpened = function() {
return (this._pFile? true : false);

};
LocalFile.prototype.write = function(pData, fnSuccess, fnError, sContentType) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.write.apply(this, pArgs);

}
, fnError || null);
return ;

}

;
var iMode=this._eFileMode;
if (!(iMode & (1 << 1)) != 0) {
var err=((((((("Error:: " + "The file is not writable.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The file is not writable.");

}


}

;
sContentType = sContentType || (((iMode & (1 << 5)) != 0? "application/octet-stream" : "text/plain"));
var me=this;
me._pFileHandle.createWriter(function(pWriter) {
pWriter.seek(me._nSeek);
pWriter.onerror = function() {
if (fnError) {
fnError.apply(me, arguments);

}
else  {
if (!0) {
var err=((((((("Error:: " + ("Write failed: " + (e.toString()))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Write failed: " + (e.toString())));

}


}

;

}


};
if (fnSuccess) {
pWriter.onwriteend = function() {
if ((iMode & (1 << 5)) != 0) {
me.seek(pData.byteLength);

}
else  {
me.seek(pData.length);

}

fnSuccess.apply(me, arguments);

};

}

var bb=new BlobBuilder();
bb.append(pData);
pWriter.write(bb.getBlob(sContentType));

}
, function() {
(fnError || (this._errorHandler)).apply(me, arguments);

}
);

};
LocalFile.prototype.atEnd = function() {
this.position = this.size;

};
LocalFile.prototype.read = function(fnSuccess, fnError) {
if (!(this._eFileMode & (1 << 0)) != 0) {
var err=((((((("Error:: " + "The file is not readable.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The file is not readable.");

}


}

;
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.read.apply(this, pArgs);

}
, fnError || null);
return ;

}

;
var reader=this._pFileReader;
var me=this;
reader.onloadend = function(e) {
var pData=e.target.result;
var nPos=me._nSeek;
if (nPos) {
if ((me._eFileMode & (1 << 5)) != 0) {
pData = new Uint8Array(new Uint8Array(pData).subarray(nPos)).buffer;

}
else  {
pData = pData.substr(nPos);

}


}

me.atEnd();
fnSuccess.apply(me, [pData]);

};
if ((me._eFileMode & (1 << 5)) != 0) {
reader.readAsArrayBuffer(this._pFile);

}
else  {
reader.readAsText(this._pFile);

}


};
Object.defineProperty(LocalFile.prototype, "position",  {get: function() {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
return this._nSeek;

}
, set: function(iOffset) {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
this._nSeek = iOffset;

}
});
Object.defineProperty(LocalFile.prototype, "size",  {get: function() {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
return this._pFile.size;

}
});
LocalFile.prototype.seek = function(iOffset) {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
var nSeek=(this._nSeek) + iOffset;
if (nSeek < 0) {
nSeek = (this.size) - ((Math.abs(nSeek)) % (this.size));

}

if (!((nSeek >= 0) && (nSeek <= (this.size)))) {
var err=((((((("Error:: " + "Invalid offset parameter") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Invalid offset parameter");

}


}

;
this._nSeek = nSeek;

};
LocalFile.prototype.isExists = function(fnSuccess, fnError) {
var me=this;
this.open(function() {
fnSuccess(true);

}
, function(e) {
if ((e.code) == (FileError.NOT_FOUND_ERR)) {
fnSuccess.apply(me, [false]);

}
else  {
if (fnError) {
fnError.apply(me, arguments);

}
else  {
throw e;

}


}


}
);

};
LocalFile.prototype.move = function(pFileName, fnSuccess, fnError) {
var me=this;
this.copy(pFileName, function() {
me.remove(fnSuccess, fnError);

}
, fnError);

};
LocalFile.prototype.rename = function(pFileName, fnSuccess, fnError) {
var pName=a.pathinfo(pFileName);
if (!(!(pName.dirname))) {
var err=((((((("Error:: " + "only filename can be specified.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("only filename can be specified.");

}


}

;
this.move(((this._pFileName.sDirname) + "/") + (pName.basename), fnSuccess, fnError);

};
LocalFile.prototype.copy = function(pFileName, fnSuccess, fnError) {
var iMode=((1) | (2)) | (16);
if ((this._eFileMode & (1 << 5)) != 0) {
iMode |= 32;

}

var me=this;
var pFile=new LocalFile(pFileName, iMode, function() {
me.read(function(pData) {
pFile.write(pData, fnSuccess, fnError);

}
);

}
, fnError);

};
LocalFile.prototype.getMetadata = function(fnSuccess, fnError) {
if (!this._pFile) {
var err=((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("There is no file handle open.");

}


}

;
fnSuccess( {lastModifiedDate: this._pFile.lastModifiedDate});

};
LocalFile.prototype.remove = function(fnSuccess, fnError) {
if (!(this._pFile)) {
var pArgs=arguments;
this.open(function() {
this.remove.apply(this, pArgs);

}
, fnError || null);
return ;

}

;
var me=this;
var fnErr=(fnError? function() {
fnError.apply(this, arguments);

}
 : undefined);
this._pFileHandle.remove(function() {
me.close();
if (fnSuccess) {
fnSuccess.apply(me, arguments);

}


}
, fnErr);

};
LocalFile.isSupported = function() {
return (window.requestFileSystem !== undefined) || (window.webkitRequestFileSystem !== undefined);

};
LocalFile.createDir = function(pRootDirEntry, pFolders, fnSuccess, fnError) {
if (((pFolders[0]) == ".") || ((pFolders[0]) == "")) {
pFolders = pFolders.slice(1);

}

pRootDirEntry.getDirectory(pFolders[0],  {create: true}, function(dirEntry) {
if (pFolders.length) {
a.LocalFile.createDir(dirEntry, pFolders.slice(1), fnSuccess, fnError);

}
else if (fnSuccess) {
fnSuccess();

}



}
, fnError || (function(e) {
if (!0) {
var err=((((((("Error:: " + (("createDir:: cannot create folder. error code(" + (e.code)) + ")")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("createDir:: cannot create folder. error code(" + (e.code)) + ")"));

}


}

;

}
));

};
LocalFile.copy = function(pRootDirEntry, sFrom, sTo, fnSuccess, fnError) {
pRootDirEntry.getFile(sFrom,  {}, function(fileEntry) {
pRootDirEntry.getDirectory(sTo,  {}, function(dirEntry) {
fileEntry.copyTo(dirEntry, fnSuccess, fnError);

}
, fnError || (function(e) {
if (!0) {
var err=((((((("Error:: " + (((("copy:: cannot get directory(" + sTo) + "). error code(") + (e.code)) + ")")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((((("copy:: cannot get directory(" + sTo) + "). error code(") + (e.code)) + ")"));

}


}

;

}
));

}
, fnError || (function(e) {
if (!0) {
var err=((((((("Error:: " + (((("copy:: cannot get file(" + sFrom) + "). error code(") + (e.code)) + ")")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((((("copy:: cannot get file(" + sFrom) + "). error code(") + (e.code)) + ")"));

}


}

;

}
));

};
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "Not-thread remote file not implemented yet.");

}
else  {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "Your browser not support local files.");

}


a.fopen = function(sUri) {
var pMode=(arguments[1]) || (1);
var pUri=a.uri(sUri);
if ((pUri.protocol) == "filesystem") {
pUri = a.uri(pUri.path);
if (!(!((pUri.protocol) && ((pUri.host) != (a.info.uri.host))))) {
var err=((((((("Error:: " + "Поддерживаются только локальные файлы в пределах текущего домена.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Поддерживаются только локальные файлы в пределах текущего домена.");

}


}

;
var pFolders=pUri.path.split("/");
if (((pFolders[0]) == "") || ((pFolders[0]) == ".")) {
pFolders = pFolders.slice(1);

}

if (!((pFolders[0]) == "temporary")) {
var err=((((((("Error:: " + "Поддерживаются только файловые системы типа \"temporary\".") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Поддерживаются только файловые системы типа \"temporary\".");

}


}

;
return new a.LocalFile(pFolders.slice(1).join("/"), pMode);

}
else  {
return new a.RemoteFile(sUri, pMode);

}

return pUri;

};
function UniqueManager(pEngine) {
this._pEngine = pEngine;
this._pHashMap =  {};
for (var i=0; i < (a._pUniqObjects.length); ++i) {
this._pHashMap[a._pUniqObjects[i]] =  {};

}

;

}

UniqueManager.prototype.create = function(pObjectType, pHashData) {
var sType=pObjectType._sUniqType;
var sHash=pObjectType.uHash(pHashData);
var pObjectPool=this._pHashMap[sType];
var pObject=pObjectPool[sHash];
if (!pObject) {
pObject = pObjectType.uCreate(this._pEngine, pHashData);
pObject._sUniqHash = sHash;
pObjectPool[sHash] = pObject;

}

return pObject;

};
UniqueManager.prototype.update = function(pObject, pHashData) {
var pObjectType=pObject.constructor;
var sType=pObjectType._sUniqType;
var pObjectPool=this._pHashMap[sType];
var sHashNext=pObjectType.uHash(pHashData);
var pObjectNext=pObjectPool[sHashNext];
var sHashPrev=pObject._sUniqHash;
var pObjectPrev=pObject;
if (!(!pObjectNext)) {
var err=((((((("Error:: " + "you cannot use given hash, because it already in use.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("you cannot use given hash, because it already in use.");

}


}

;
pObject._sUniqHash = sHashNext;
pObjectPool[sHashNext] = pObject;
if (sHashPrev) {
delete (pObjectPool[sHashPrev]);

}

return true;

};
a._pUniqObjects = [];
a.registerUniqObject = function(pObjectType, fnHash, fnCreate) {
pObjectType._sUniqType = pObjectType.toString().match(/function\s*(\w+)/)[1];
if (!(pObjectType.uCreate)) {
pObjectType.uCreate = fnCreate || (function(pEngine, pHashData) {
return new pObjectType(pEngine, pHashData);

}
);

}

if (!(pObjectType.uHash)) {
pObjectType.uHash = fnHash || (pObjectType.prototype.uHash);

}

if (!pObjectType.uHash) {
var err=((((((("Error:: " + "you must specify hash function for uniq object") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("you must specify hash function for uniq object");

}


}

;
a._pUniqObjects.push(pObjectType._sUniqType);

};
function Unique(pEngine) {
this._sUniqHash = null;
this._pUniqManager = pEngine.pUniqManager;

}

a.UniqueManager = UniqueManager;
a.Unique = Unique;
(function() {
function utf8_encode(argString) {
if ((argString === null) || ((typeof argString) === "undefined")) {
return "";

}

var string=argString + "";
var utftext="", start, end, stringl=0;
start = end = 0;
stringl = string.length;
for (var n=0; n < stringl; n++) {
var c1=string.charCodeAt(n);
var enc=null;
if (c1 < 128) {
end++;

}
else if ((c1 > 127) && (c1 < 2048)) {
enc = (String.fromCharCode((c1 >> 6) | 192)) + (String.fromCharCode((c1 & 63) | 128));

}
else  {
enc = ((String.fromCharCode((c1 >> 12) | 224)) + (String.fromCharCode(((c1 >> 6) & 63) | 128))) + (String.fromCharCode((c1 & 63) | 128));

}


if (enc !== null) {
if (end > start) {
utftext += string.slice(start, end);

}

utftext += enc;
start = end = n + 1;

}


}

if (end > start) {
utftext += string.slice(start, stringl);

}

return utftext;

}

function utf8_decode(str_data) {
var tmp_arr=[], i=0, ac=0, c1=0, c2=0, c3=0;
str_data += "";
while (i < (str_data.length)) {
c1 = str_data.charCodeAt(i);
if (c1 < 128) {
tmp_arr[ac++] = String.fromCharCode(c1);
i++;

}
else if ((c1 > 191) && (c1 < 224)) {
c2 = str_data.charCodeAt(i + 1);
tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
i += 2;

}
else  {
c2 = str_data.charCodeAt(i + 1);
c3 = str_data.charCodeAt(i + 2);
tmp_arr[ac++] = String.fromCharCode((((c1 & 15) << 12) | ((c2 & 63) << 6)) | (c3 & 63));
i += 3;

}



}
return tmp_arr.join("");

}

;
String.prototype.toUTF8 = function() {
return utf8_encode(this);

};
String.prototype.fromUTF8 = function() {
return utf8_decode(this);

};
function md5(str) {
var xl, a, b, c, d, e;
var rotateLeft=function(lValue, iShiftBits) {
return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));

};
var addUnsigned=function(lX, lY) {
var lX4, lY4, lX8, lY8, lResult;
lX8 = lX & 2147483648;
lY8 = lY & 2147483648;
lX4 = lX & 1073741824;
lY4 = lY & 1073741824;
lResult = (lX & 1073741823) + (lY & 1073741823);
if (lX4 & lY4) {
return ((lResult ^ 2147483648) ^ lX8) ^ lY8;

}

if (lX4 | lY4) {
if (lResult & 1073741824) {
return ((lResult ^ 3221225472) ^ lX8) ^ lY8;

}
else  {
return ((lResult ^ 1073741824) ^ lX8) ^ lY8;

}


}
else  {
return (lResult ^ lX8) ^ lY8;

}


};
var _F=function(x, y, z) {
return (x & y) | ((~x) & z);

};
var _G=function(x, y, z) {
return (x & z) | (y & (~z));

};
var _H=function(x, y, z) {
return (x ^ y) ^ z;

};
var _I=function(x, y, z) {
return y ^ (x | (~z));

};
var _FF=function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);

};
var _GG=function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);

};
var _HH=function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);

};
var _II=function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);

};
var convertToWordArray=function(str) {
var lWordCount;
var lMessageLength=str.length;
var lNumberOfWords_temp1=lMessageLength + 8;
var lNumberOfWords_temp2=(lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
var lNumberOfWords=(lNumberOfWords_temp2 + 1) * 16;
var lWordArray=new Array(lNumberOfWords - 1);
var lBytePosition=0;
var lByteCount=0;
while (lByteCount < lMessageLength) {
lWordCount = (lByteCount - (lByteCount % 4)) / 4;
lBytePosition = (lByteCount % 4) * 8;
lWordArray[lWordCount] = (lWordArray[lWordCount]) | ((str.charCodeAt(lByteCount)) << lBytePosition);
lByteCount++;

}
lWordCount = (lByteCount - (lByteCount % 4)) / 4;
lBytePosition = (lByteCount % 4) * 8;
lWordArray[lWordCount] = (lWordArray[lWordCount]) | (128 << lBytePosition);
lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
return lWordArray;

};
var wordToHex=function(lValue) {
var wordToHexValue="", wordToHexValue_temp="", lByte, lCount;
for (lCount = 0; lCount <= 3; lCount++) {
lByte = (lValue >>> (lCount * 8)) & 255;
wordToHexValue_temp = "0" + (lByte.toString(16));
wordToHexValue = wordToHexValue + (wordToHexValue_temp.substr((wordToHexValue_temp.length) - 2, 2));

}

return wordToHexValue;

};
var x=[], k, AA, BB, CC, DD, a, b, c, d, S11=7, S12=12, S13=17, S14=22, S21=5, S22=9, S23=14, S24=20, S31=4, S32=11, S33=16, S34=23, S41=6, S42=10, S43=15, S44=21;
str = utf8_encode(str);
x = convertToWordArray(str);
a = 1732584193;
b = 4023233417;
c = 2562383102;
d = 271733878;
xl = x.length;
for (k = 0; k < xl; k += 16) {
AA = a;
BB = b;
CC = c;
DD = d;
a = _FF(a, b, c, d, x[k + 0], S11, 3614090360);
d = _FF(d, a, b, c, x[k + 1], S12, 3905402710);
c = _FF(c, d, a, b, x[k + 2], S13, 606105819);
b = _FF(b, c, d, a, x[k + 3], S14, 3250441966);
a = _FF(a, b, c, d, x[k + 4], S11, 4118548399);
d = _FF(d, a, b, c, x[k + 5], S12, 1200080426);
c = _FF(c, d, a, b, x[k + 6], S13, 2821735955);
b = _FF(b, c, d, a, x[k + 7], S14, 4249261313);
a = _FF(a, b, c, d, x[k + 8], S11, 1770035416);
d = _FF(d, a, b, c, x[k + 9], S12, 2336552879);
c = _FF(c, d, a, b, x[k + 10], S13, 4294925233);
b = _FF(b, c, d, a, x[k + 11], S14, 2304563134);
a = _FF(a, b, c, d, x[k + 12], S11, 1804603682);
d = _FF(d, a, b, c, x[k + 13], S12, 4254626195);
c = _FF(c, d, a, b, x[k + 14], S13, 2792965006);
b = _FF(b, c, d, a, x[k + 15], S14, 1236535329);
a = _GG(a, b, c, d, x[k + 1], S21, 4129170786);
d = _GG(d, a, b, c, x[k + 6], S22, 3225465664);
c = _GG(c, d, a, b, x[k + 11], S23, 643717713);
b = _GG(b, c, d, a, x[k + 0], S24, 3921069994);
a = _GG(a, b, c, d, x[k + 5], S21, 3593408605);
d = _GG(d, a, b, c, x[k + 10], S22, 38016083);
c = _GG(c, d, a, b, x[k + 15], S23, 3634488961);
b = _GG(b, c, d, a, x[k + 4], S24, 3889429448);
a = _GG(a, b, c, d, x[k + 9], S21, 568446438);
d = _GG(d, a, b, c, x[k + 14], S22, 3275163606);
c = _GG(c, d, a, b, x[k + 3], S23, 4107603335);
b = _GG(b, c, d, a, x[k + 8], S24, 1163531501);
a = _GG(a, b, c, d, x[k + 13], S21, 2850285829);
d = _GG(d, a, b, c, x[k + 2], S22, 4243563512);
c = _GG(c, d, a, b, x[k + 7], S23, 1735328473);
b = _GG(b, c, d, a, x[k + 12], S24, 2368359562);
a = _HH(a, b, c, d, x[k + 5], S31, 4294588738);
d = _HH(d, a, b, c, x[k + 8], S32, 2272392833);
c = _HH(c, d, a, b, x[k + 11], S33, 1839030562);
b = _HH(b, c, d, a, x[k + 14], S34, 4259657740);
a = _HH(a, b, c, d, x[k + 1], S31, 2763975236);
d = _HH(d, a, b, c, x[k + 4], S32, 1272893353);
c = _HH(c, d, a, b, x[k + 7], S33, 4139469664);
b = _HH(b, c, d, a, x[k + 10], S34, 3200236656);
a = _HH(a, b, c, d, x[k + 13], S31, 681279174);
d = _HH(d, a, b, c, x[k + 0], S32, 3936430074);
c = _HH(c, d, a, b, x[k + 3], S33, 3572445317);
b = _HH(b, c, d, a, x[k + 6], S34, 76029189);
a = _HH(a, b, c, d, x[k + 9], S31, 3654602809);
d = _HH(d, a, b, c, x[k + 12], S32, 3873151461);
c = _HH(c, d, a, b, x[k + 15], S33, 530742520);
b = _HH(b, c, d, a, x[k + 2], S34, 3299628645);
a = _II(a, b, c, d, x[k + 0], S41, 4096336452);
d = _II(d, a, b, c, x[k + 7], S42, 1126891415);
c = _II(c, d, a, b, x[k + 14], S43, 2878612391);
b = _II(b, c, d, a, x[k + 5], S44, 4237533241);
a = _II(a, b, c, d, x[k + 12], S41, 1700485571);
d = _II(d, a, b, c, x[k + 3], S42, 2399980690);
c = _II(c, d, a, b, x[k + 10], S43, 4293915773);
b = _II(b, c, d, a, x[k + 1], S44, 2240044497);
a = _II(a, b, c, d, x[k + 8], S41, 1873313359);
d = _II(d, a, b, c, x[k + 15], S42, 4264355552);
c = _II(c, d, a, b, x[k + 6], S43, 2734768916);
b = _II(b, c, d, a, x[k + 13], S44, 1309151649);
a = _II(a, b, c, d, x[k + 4], S41, 4149444226);
d = _II(d, a, b, c, x[k + 11], S42, 3174756917);
c = _II(c, d, a, b, x[k + 2], S43, 718787259);
b = _II(b, c, d, a, x[k + 9], S44, 3951481745);
a = addUnsigned(a, AA);
b = addUnsigned(b, BB);
c = addUnsigned(c, CC);
d = addUnsigned(d, DD);

}

var temp=(((wordToHex(a)) + (wordToHex(b))) + (wordToHex(c))) + (wordToHex(d));
return temp.toLowerCase();

}

;
function sha1(str) {
var rotate_left=function(n, s) {
var t4=(n << s) | (n >>> (32 - s));
return t4;

};
var cvt_hex=function(val) {
var str="";
var i;
var v;
for (i = 7; i >= 0; i--) {
v = (val >>> (i * 4)) & 15;
str += v.toString(16);

}

return str;

};
var blockstart;
var i, j;
var W=new Array(80);
var H0=1732584193;
var H1=4023233417;
var H2=2562383102;
var H3=271733878;
var H4=3285377520;
var A, B, C, D, E;
var temp;
str = utf8_encode(str);
var str_len=str.length;
var word_array=[];
for (i = 0; i < (str_len - 3); i += 4) {
j = ((((str.charCodeAt(i)) << 24) | ((str.charCodeAt(i + 1)) << 16)) | ((str.charCodeAt(i + 2)) << 8)) | (str.charCodeAt(i + 3));
word_array.push(j);

}

switch(str_len % 4) {
case 0:
i = 2147483648;
break ;

case 1:
i = ((str.charCodeAt(str_len - 1)) << 24) | 8388608;
break ;

case 2:
i = (((str.charCodeAt(str_len - 2)) << 24) | ((str.charCodeAt(str_len - 1)) << 16)) | 32768;
break ;

case 3:
i = ((((str.charCodeAt(str_len - 3)) << 24) | ((str.charCodeAt(str_len - 2)) << 16)) | ((str.charCodeAt(str_len - 1)) << 8)) | 128;
break ;
}
word_array.push(i);
while (((word_array.length) % 16) != 14) {
word_array.push(0);

}
word_array.push(str_len >>> 29);
word_array.push((str_len << 3) & 4294967295);
for (blockstart = 0; blockstart < (word_array.length); blockstart += 16) {
for (i = 0; i < 16; i++) {
W[i] = word_array[blockstart + i];

}

for (i = 16; i <= 79; i++) {
W[i] = rotate_left((((W[i - 3]) ^ (W[i - 8])) ^ (W[i - 14])) ^ (W[i - 16]), 1);

}

A = H0;
B = H1;
C = H2;
D = H3;
E = H4;
for (i = 0; i <= 19; i++) {
temp = (((((rotate_left(A, 5)) + ((B & C) | ((~B) & D))) + E) + (W[i])) + 1518500249) & 4294967295;
E = D;
D = C;
C = rotate_left(B, 30);
B = A;
A = temp;

}

for (i = 20; i <= 39; i++) {
temp = (((((rotate_left(A, 5)) + ((B ^ C) ^ D)) + E) + (W[i])) + 1859775393) & 4294967295;
E = D;
D = C;
C = rotate_left(B, 30);
B = A;
A = temp;

}

for (i = 40; i <= 59; i++) {
temp = (((((rotate_left(A, 5)) + (((B & C) | (B & D)) | (C & D))) + E) + (W[i])) + 2400959708) & 4294967295;
E = D;
D = C;
C = rotate_left(B, 30);
B = A;
A = temp;

}

for (i = 60; i <= 79; i++) {
temp = (((((rotate_left(A, 5)) + ((B ^ C) ^ D)) + E) + (W[i])) + 3395469782) & 4294967295;
E = D;
D = C;
C = rotate_left(B, 30);
B = A;
A = temp;

}

H0 = (H0 + A) & 4294967295;
H1 = (H1 + B) & 4294967295;
H2 = (H2 + C) & 4294967295;
H3 = (H3 + D) & 4294967295;
H4 = (H4 + E) & 4294967295;

}

temp = ((((cvt_hex(H0)) + (cvt_hex(H1))) + (cvt_hex(H2))) + (cvt_hex(H3))) + (cvt_hex(H4));
return temp.toLowerCase();

}

;
function crc32(str) {
str = utf8_encode(str);
var table="00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
var crc=0;
var x=0;
var y=0;
crc = crc ^ (-1);
for (var i=0, iTop=str.length; i < iTop; i++) {
y = (crc ^ (str.charCodeAt(i))) & 255;
x = "0x" + (table.substr(y * 9, 8));
crc = (crc >>> 8) ^ x;

}

return crc ^ (-1);

}

;
String.prototype.md5 = function() {
return md5(this);

};
String.prototype.sha1 = function() {
return sha1(this);

};
String.prototype.crc32 = function() {
return crc32(this);

};
String.prototype.replaceAt = function(n, chr) {
return ((this.substr(0, n)) + chr) + (this.substr(n + (chr.length)));

};
function xml2json(xml, tab) {
var X= {toObj: function(xml) {
var o= {};
if ((xml.nodeType) == 1) {
if (xml.attributes.length)for (var i=0; i < (xml.attributes.length); i++)o["@" + (xml.attributes[i].nodeName)] = ((xml.attributes[i].nodeValue) || "").toString();


if (xml.firstChild) {
var textChild=0, cdataChild=0, hasElementChild=false;
for (var n=xml.firstChild; n; n = n.nextSibling) {
if ((n.nodeType) == 1)hasElementChild = true;
else if (((n.nodeType) == 3) && (n.nodeValue.match(/[^ \f\n\r\t\v]/)))textChild++;
else if ((n.nodeType) == 4)cdataChild++;




}

if (hasElementChild) {
if ((textChild < 2) && (cdataChild < 2)) {
X.removeWhite(xml);
for (var n=xml.firstChild; n; n = n.nextSibling) {
if ((n.nodeType) == 3)o["#text"] = X.escape(n.nodeValue);
else if ((n.nodeType) == 4)o["#cdata"] = X.escape(n.nodeValue);
else if (o[n.nodeName]) {
if ((o[n.nodeName]) instanceof Array)o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
else o[n.nodeName] = [o[n.nodeName], X.toObj(n)];


}
else o[n.nodeName] = X.toObj(n);




}


}
else  {
if (!(xml.attributes.length))o = X.escape(X.innerXml(xml));
else o["#text"] = X.escape(X.innerXml(xml));


}


}
else if (textChild) {
if (!(xml.attributes.length))o = X.escape(X.innerXml(xml));
else o["#text"] = X.escape(X.innerXml(xml));


}
else if (cdataChild) {
if (cdataChild > 1)o = X.escape(X.innerXml(xml));
else for (var n=xml.firstChild; n; n = n.nextSibling)o["#cdata"] = X.escape(n.nodeValue);



}




}

if ((!(xml.attributes.length)) && (!(xml.firstChild)))o = null;


}
else if ((xml.nodeType) == 9) {
o = X.toObj(xml.documentElement);

}
else alert("unhandled node type: " + (xml.nodeType));


return o;

}
, toJson: function(o, name, ind) {
var json=(name? ("\"" + name) + "\"" : "");
if (o instanceof Array) {
for (var i=0, n=o.length; i < n; i++)o[i] = X.toJson(o[i], "", ind + "\t");

json += (((name? ":[" : "[")) + (((o.length) > 1? (((("\n" + ind) + "\t") + (o.join((",\n" + ind) + "\t"))) + "\n") + ind : o.join("")))) + "]";

}
else if (o == null)json += (name && ":") + "null";
else if ((typeof o) == "object") {
var arr=[];
for (var m in o)arr[arr.length] = X.toJson(o[m], m, ind + "\t");

json += (((name? ":{" : "{")) + (((arr.length) > 1? (((("\n" + ind) + "\t") + (arr.join((",\n" + ind) + "\t"))) + "\n") + ind : arr.join("")))) + "}";

}
else if ((typeof o) == "string")json += (((name && ":") + "\"") + (o.toString())) + "\"";
else json += (name && ":") + (o.toString());




return json;

}
, innerXml: function(node) {
var s="";
if ("innerHTML" in node)s = node.innerHTML;
else  {
var asXml=function(n) {
var s="";
if ((n.nodeType) == 1) {
s += "<" + (n.nodeName);
for (var i=0; i < (n.attributes.length); i++)s += (((" " + (n.attributes[i].nodeName)) + "=\"") + (((n.attributes[i].nodeValue) || "").toString())) + "\"";

if (n.firstChild) {
s += ">";
for (var c=n.firstChild; c; c = c.nextSibling)s += asXml(c);

s += ("</" + (n.nodeName)) + ">";

}
else s += "/>";


}
else if ((n.nodeType) == 3)s += n.nodeValue;
else if ((n.nodeType) == 4)s += ("<![CDATA[" + (n.nodeValue)) + "]]>";



return s;

};
for (var c=node.firstChild; c; c = c.nextSibling)s += asXml(c);


}

return s;

}
, escape: function(txt) {
return txt.replace(new RegExp("[\\\\]", "g"), "\\\\").replace(new RegExp("[\\\"]", "g"), "\\\"").replace(new RegExp("[\\n]", "g"), "\\n").replace(new RegExp("[\\r]", "g"), "\\r");

}
, removeWhite: function(e) {
e.normalize();
for (var n=e.firstChild; n; ) {
if ((n.nodeType) == 3) {
if (!(n.nodeValue.match(/[^ \f\n\r\t\v]/))) {
var nxt=n.nextSibling;
e.removeChild(n);
n = nxt;

}
else n = n.nextSibling;


}
else if ((n.nodeType) == 1) {
X.removeWhite(n);
n = n.nextSibling;

}
else n = n.nextSibling;



}

return e;

}
};
if ((xml.nodeType) == 9)xml = xml.documentElement;

return  {toObj: function() {
return X.toObj(X.removeWhite(xml));

}
, toJson: function() {
var json=X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
return (("{\n" + tab) + ((tab? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")))) + "\n}";

}
, toString: function() {
return this.toJson();

}
};

}

;
a.xml2json = xml2json;

}
)();
function DebugWindow(sCaption) {
this.win = window.open("", (sCaption? sCaption : "console"), "width=640,height=230,resizable=no,scrollbars=yes,status=no,menubar=no,location=no");
this.win.focus();
window.onunload = function() {
this.win.close();

};
this.print("<!DOCTYPE html><html><head>", 1);
this.print(("<title>" + ((sCaption? sCaption : "console"))) + "</title>", 1);
this.print("</head>", 1);
this.print("<body id='log' style=\"text-align:left;padding: 2px;margin:0px;\">", 1);
this.print("</body></html>", 1);
this.log = this.win.document.getElementById("log");

}

;
DebugWindow.prototype.print = function(sData, isHtml) {
if (isHtml) {
this.win.document.write(sData);

}
else  {
this.log.innerHTML += sData + "<div style=\"border-top: 1px dotted #999;width:100%;margin:0px;\" ></div>";

}


};
a.DebugWindow = DebugWindow;
function ReferenceCounter() {
this._nReferenceCount = 0;

}

ReferenceCounter.prototype.destructor = function() {
if (!((this._nReferenceCount) == 0)) {
var err=((((((("Error:: " + "") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("");

}


}

;

};
ReferenceCounter.prototype.addRef = function() {
if (!((this._nReferenceCount) != (Number.MAX_VALUE))) {
var err=((((((("Error:: " + "reference fail :(") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("reference fail :(");

}


}

;
this._nReferenceCount++;
return this._nReferenceCount;

};
ReferenceCounter.prototype.release = function() {
if (!((this._nReferenceCount) > 0)) {
var err=((((((("Error:: " + "") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("");

}


}

;
this._nReferenceCount--;
return this._nReferenceCount;

};
ReferenceCounter.prototype.referenceCount = function() {
return this._nReferenceCount;

};
ReferenceCounter.prototype.eq = function(pSrc) {
return this;

};
a.ReferenceCounter = ReferenceCounter;
function BufferMap(pEngine) {
this._pEngine = pEngine;
this._pFlows = null;
this._pMappers = null;
this._pIndex = null;
this._nLength = 0;
this._ePrimitiveType = 4;
this._pCompleteFlows = null;
this._nCompleteFlows = 0;
this._nCompleteVideoBuffers = 0;
this._pCompleteVideoBuffers = null;
this._nStartIndex = 0;
this._pBuffersCompatibleMap = null;
this.reset();

}

a.extend(BufferMap, a.ReferenceCounter);
a.defineProperty(BufferMap, "primType", function() {
return (this._pIndex? this._pIndex.getPrimitiveType() : this._ePrimitiveType);

}
, function(eType) {
this._ePrimitiveType = eType;

}
);
a.defineProperty(BufferMap, "primCount", function() {
if ((this.primType) === (4)) {
return (this.length) / 3;

}

return undefined;

}
);
a.defineProperty(BufferMap, "index", function() {
return this._pIndex;

}
, function(pIndexData) {
if ((this._pIndex) === pIndexData) {
return ;

}

this.draw = this.drawElements = pIndexData.drawElements;
this._pIndex = pIndexData;
this.update();

}
);
a.defineProperty(BufferMap, "limit", function() {
return this._pFlows.length;

}
);
a.defineProperty(BufferMap, "length", function() {
return (this._pIndex? this._pIndex.getCount() : this._nLength);

}
, function(nLength) {
this._nLength = Math.min(this._nLength, nLength);

}
);
a.defineProperty(BufferMap, "startIndex", function() {
return this._nStartIndex;

}
, function(nStartIndex) {
if (!(((this._nStartIndex) === nStartIndex) || ((this._nStartIndex) === 2147483647))) {
var err=((((((("Error:: " + "You can not use a maps or unmappable buffers having different starting index.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("You can not use a maps or unmappable buffers having different starting index.");

}


}

;
this._nStartIndex = nStartIndex;

}
);
a.defineProperty(BufferMap, "size", function() {
return this._nCompleteFlows;

}
);
a.defineProperty(BufferMap, "flows", function() {
return this._pCompleteFlows;

}
);
a.defineProperty(BufferMap, "mappers", function() {
return this._pMappers;

}
);
a.defineProperty(BufferMap, "offset", function() {
return (this._pIndex? this._pIndex.getOffset() : 0);

}
);
BufferMap.prototype.reset = function() {
this._pIndex = null;
this._ePrimitiveType = 4;
var pDevice=this._pEngine.pDevice;
var nFlowLimit=Math.min(a.info.graphics.maxVertexTextureImageUnits(pDevice), a.info.graphics.maxVertexAttributes(pDevice));
this._pMappers = [];
this._pFlows = new Array(nFlowLimit);
for (var i=0; i < nFlowLimit; i++) {
this._pFlows[i] =  {pData: null, eType: 0, pMapper: null};

}

this._nLength = 2147483647;
this._pCompleteFlows = new Array(nFlowLimit);
this._nCompleteFlows = 0;
this._nStartIndex = 2147483647;
this._pDevice = this._pEngine.pDevice;
this._pBuffersCompatibleMap =  {};
this._pCompleteVideoBuffers = new Array(nFlowLimit);
this._nCompleteVideoBuffers = 0;
this.draw = this.drawArrays;

};
BufferMap.prototype.flow = function(iFlow, pVertexData) {
var pFlow;
if ((arguments.length) < 2) {
iFlow = this._nCompleteFlows;
pVertexData = arguments[0];

}

pFlow = this._pFlows[iFlow];
if (!(iFlow < (this.limit))) {
var err=((((((("Error:: " + (("Invalid strem. Maximum allowable number of stream " + (this.limit)) + ".")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Invalid strem. Maximum allowable number of stream " + (this.limit)) + "."));

}


}

;
if ((!pVertexData) || ((pFlow.pData) === pVertexData)) {
return false;

}

if ((pVertexData.buffer) instanceof (a.VertexBuffer)) {
pFlow.eType = 0;
this.length = pVertexData.getCount();
this.startIndex = pVertexData.getStartIndex();
if (!this.checkData(pVertexData)) {
var err=((((((("Error:: " + "You can use several unmappable data flows from one buffer.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("You can use several unmappable data flows from one buffer.");

}


}

;
this._pushEtalon(pVertexData);

}
else  {
pFlow.eType = 1;

}

pFlow.pData = pVertexData;
return this.update();

};
BufferMap.prototype.checkData = function(pData) {
var pEtalon=this._pBuffersCompatibleMap[pData.resourceHandle()];
if ((!pEtalon) || ((pEtalon.offset) === (pData.offset))) {
return true;

}

return false;

};
BufferMap.prototype.findMapping = function(pMap, eSemantics) {
if (!this.checkData(pMap)) {
var err=((((((("Error:: " + "You can use several different maps from one buffer.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("You can use several different maps from one buffer.");

}


}

;
for (var i=0, pMappers=this._pMappers, pExistsMap; i < (pMappers.length); i++) {
pExistsMap = pMappers[i].pData;
if (pExistsMap === pMap) {
if ((pMappers[i].eSemantics) === eSemantics) {
return pMappers[i];

}


}
else  {
if (!((pExistsMap.getStartIndex()) === (pMap.getStartIndex()))) {
var err=((((((("Error:: " + "You can not use maps with different indexing") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("You can not use maps with different indexing");

}


}

;

}


}

return null;

};
BufferMap.prototype.mapping = function(iFlow, pMap, eSemantics) {
var pMapper=this.findMapping(pMap, eSemantics);
var pFlow=this._pFlows[iFlow];
if (!((pFlow.pData) && ((pFlow.eType) === (1)))) {
var err=((((((("Error:: " + "Cannot mapping empty/unmappable flow.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot mapping empty/unmappable flow.");

}


}

;
if (!pMap) {
var err=((((((("Error:: " + "Passed empty mapper.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Passed empty mapper.");

}


}

;
if (!eSemantics) {
eSemantics = pMap.getVertexDeclaration()[0].eUsage;

}
else if ((pMap.hasSemantics(eSemantics)) === false) {
if (!0) {
var err=((((((("Error:: " + (("Passed mapper does not have semantics: " + eSemantics) + ".")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Passed mapper does not have semantics: " + eSemantics) + "."));

}


}

;

}


if (pMapper) {
if ((pFlow.pMapper) === pMapper) {
return false;

}


}
else  {
pMapper =  {pData: pMap, eSemantics: eSemantics};
this._pMappers.push(pMapper);
this.length = pMap.getCount();
this.startIndex = pMap.getStartIndex();
this._pushEtalon(pMap);

}

pFlow.pMapper = pMapper;
return this.update();

};
BufferMap.prototype._pushEtalon = function(pData) {
this._pBuffersCompatibleMap[pData.resourceHandle()] = pData;

};
BufferMap.prototype.update = function() {
var pFlows=this._pFlows;
var pFlow, pMapper;
var isMappable=false;
var pCompleteFlows=this._pCompleteFlows;
var nCompleteFlows=0;
var pCompleteVideoBuffers=this._pCompleteVideoBuffers;
var nCompleteVideoBuffers=0;
var pVideoBuffer;
var isVideoBufferAdded=false;
for (var i=0; i < (pFlows.length); i++) {
pFlow = pFlows[i];
pMapper = pFlow.pMapper;
isMappable = (pFlow.eType) === (1);
if (((pFlow.pData) === null) || (isMappable && (pMapper === null))) {
continue ;

}

pCompleteFlows[nCompleteFlows++] = pFlow;
if (isMappable) {
pVideoBuffer = pFlow.pData.buffer;
for (var j=0; j < nCompleteVideoBuffers; j++) {
if ((pCompleteVideoBuffers[j]) === pVideoBuffer) {
isVideoBufferAdded = true;
break ;

}


}

if (!isVideoBufferAdded) {
pCompleteVideoBuffers[nCompleteVideoBuffers++] = pVideoBuffer;

}


}


}

this._nCompleteFlows = nCompleteFlows;
this._nCompleteVideoBuffers = nCompleteVideoBuffers;

};
BufferMap.prototype.draw = function() {

};
BufferMap.prototype.drawElements = function() {

};
BufferMap.prototype.drawArrays = function() {
this._pDevice.drawArrays(this._ePrimitiveType, this._nStartIndex, this._nLength);

};
a.BufferMap = BufferMap;
function ObjModel() {
this._pVertices = [];
this._pNormals = [];
this._pFaces = [];
this._pTextureCoords = [];
this._pIndexes = [];
this._pTextureIndexes = [];
this._pNormalIndexes = [];
this._isObjectHasUV = false;
this._isObjectHasNormals = false;
this._isPolyReaded = false;
this._pModel =  {};

}

ObjModel.prototype.load = function(sFilename, fnCallback) {
if (!sFilename) {
return ;

}

var me=this;
a.fopen(sFilename).read(function(pData) {
me.parse(pData);
if (!(me._pIndexes.length)) {
me._fillIndexes();

}

if (!(me._pNormals.length)) {
me.calcNormals();

}

me._isObjectHasNormals = true;
if (me._pTextureCoords.length) {
me._isObjectHasUV = true;

}

fnCallback.call(me, true);

}
, function() {
fnCallback.call(me, false);

}
);

};
ObjModel.prototype.hasNormals = function() {
return this._isObjectHasNormals;

};
ObjModel.prototype.hasTexCoords = function() {
return this._isObjectHasUV;

};
ObjModel.prototype.parse = function(pData) {
var c, p=0;
pData = pData.split("\n");
while (p != (pData.length)) {
c = pData[p].charAt(0);
switch(c) {
case "v":
if (this._isPolyReaded) {
this._fillInObjectInfo();

}

this._readVertexInfo(pData[p]);
break ;

case "f":
this._readFaceInfo(pData[p]);
break ;
}
p++;

}

};
ObjModel.prototype._fillIndexes = function() {
for (var i=0; i < (this._pVertices.length); ++i) {
this._pIndexes[i] = i;

}


};
ObjModel.prototype._readVertexInfo = function(s) {
var ch=s.charAt(1), pm;
if (ch == " ") {
pm = s.match(/^v[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)([\s]+[-+]?[\d]*[\.|\,]?[\de-]*?)?[\s]*$/i);
this._correctIndex(pm);
this._pVertices.push(pm[1], pm[2], pm[3]);

}
else if (ch == "t") {
pm = s.match(/^vt[\s]+([-+]?[\d]*[\.|\,][\d]*?)[\s]+([-+]?[\d]*[\.|\,][\d]*?)[\s]*.*$/i);
this._correctIndex(pm);
this._pTextureCoords.push(pm[1], pm[2]);
this._isObjectHasUV = true;

}
else if (ch == "n") {
pm = s.match(/^vn[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]*$/i);
this._correctIndex(pm);
this._pNormals.push(pm[1], pm[2], pm[3]);
this._isObjectHasNormals = true;

}




};
ObjModel.prototype._correctIndex = function(pm, d) {
d = d || 0;
for (var i=1; i < (pm.length); ++i) {
if (pm[i]) {
pm[i] = (parseFloat(pm[i].replace(/,/g, "."))) - d;

}


}


};
ObjModel.prototype._readFaceInfo = function(s) {
var pm;
if ((this._isObjectHasUV) && (!(this._isObjectHasNormals))) {
pm = s.match(/^f[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]*$/i);
this._correctIndex(pm, 1);
this._pIndexes.push(pm[1], pm[3], pm[5]);
this._pTextureIndexes.push(pm[2], pm[4], pm[6]);

}
else if ((!(this._isObjectHasUV)) && (this._isObjectHasNormals)) {
pm = s.match(/^f[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]*$/i);
if (!pm) {
this._isObjectHasNormals = false;
this._readFaceInfo(s);
return ;

}

this._correctIndex(pm, 1);
this._pIndexes.push(pm[1], pm[3], pm[5]);
this._pNormalIndexes.push(pm[2], pm[4], pm[6]);

}
else if ((this._isObjectHasUV) && (this._isObjectHasNormals)) {
pm = s.match(/^f[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]*$/i);
this._correctIndex(pm, 1);
this._pIndexes.push(pm[1], pm[4], pm[7]);
this._pTextureIndexes.push(pm[2], pm[5], pm[8]);
this._pNormalIndexes.push(pm[3], pm[6], pm[9]);

}
else  {
pm = s.match(/^f[\s]+([\d]+)[\s]+([\d]+)[\s]+([\d]+)[\s]*$/i);
this._correctIndex(pm, 1);
this._pIndexes.push(pm[1], pm[2], pm[3]);

}



this._pFaces.push(pm.slice(1));
this._isPolyReaded = true;

};
ObjModel.prototype._fillInObjectInfo = function(model) {

};
ObjModel.prototype.getVertices = function() {
return this._pVertices;

};
ObjModel.prototype.getNormals = function() {
return this._pNormals;

};
ObjModel.prototype.getIndexes = function() {
return this._pIndexes;

};
ObjModel.prototype.getFaces = function() {
return this._pFaces;

};
ObjModel.prototype.calcNormals = function(useSmoothing) {
useSmoothing = useSmoothing || true;
var v=new Array(3), p=new glMatrixArrayType(3), q=new glMatrixArrayType(3), i, j, n=new glMatrixArrayType(3), k;
for (i = 0; i < (this._pVertices.length); ++i) {
this._pNormals[i] = 0;

}

for (i = 0; i < (this._pIndexes.length); i += 3) {
for (k = 0; k < 3; ++k) {
j = (this._pIndexes[i + k]) * 3;
v[k] = Vec3.create([this._pVertices[j], this._pVertices[j + 1], this._pVertices[j + 2]]);

}

Vec3.subtract(v[1], v[2], p);
Vec3.subtract(v[0], v[2], q);
Vec3.cross(p, q, n);
Vec3.normalize(n);
for (k = 0; k < 3; ++k) {
j = (this._pIndexes[i + k]) * 3;
this._pNormals[j] = n[0];
this._pNormals[j + 1] = n[1];
this._pNormals[j + 2] = n[2];

}


}

this._isObjectHasNormals = true;

};
a.loadMeshFromOBJ = function(pEngine, sFilename, eMeshOptions, fnCallback) {
if (!(eMeshOptions == 0)) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "loadMeshFromOBJ:: Опции еще не поддерживаются");

}

;
var pModel=new a.ObjModel();
pModel.load(sFilename, function(isLoaded) {
if (!isLoaded) {
fnCallback(null);

}

var name=a.pathinfo(sFilename).filename;
var pMesh=new a.Mesh(pEngine);
var sTempName=(("obj_model_" + name) + "_") + (a.sid());
var pVertexBuffer=pEngine.displayManager().vertexBufferPool().createResource(sTempName);
var pIndexBuffer=pEngine.displayManager().indexBufferPool().createResource(sTempName);
var pVertexDescription=[new a.VertexDeclaration(3, "POSITION", 5126, "POSITION")];
var pVertices=this.getVertices();
var pIndexes=this.getIndexes();
var pNormals=null;
var pTexCoords=null;
var iStride=3;
var count=(pVertices.length) / 3;
var iElSize=a.getTypeSize(5126);
var nFaces=this.getFaces().length;
if (this.hasNormals()) {
pVertexDescription.push(new a.VertexDeclaration(3, "NORMAL", 5126, "NORMAL"));
pNormals = this.getNormals();
iStride += 3;

}

if (this.hasTexCoords()) {
pVertexDescription.push(new a.VertexDeclaration(2, "TEXCOORD", 5126, "TEXCOORD"));
pTexCoords = this.getTexCoords();
iStride += 2;

}

if (!(this.hasTexCoords())) {
pVertexDescription.push(new a.VertexDeclaration(2, "TEXCOORD", 5126, "TEXCOORD"));
pTexCoords = [];
for (var i=0; i < (count / 100); ++i) {
for (var j=0; j < 100; ++j) {
pTexCoords.push(i / (count / 100));
pTexCoords.push(j / 100);

}


}

iStride += 2;

}

var pData=new Float32Array(count * iStride);
var i, j, n;
for (i = 0, n = 0; i < count; ++i) {
for (var j=0; j < 3; ++j) {
pData[n] = pVertices[(i * 3) + j];
++n;

}

if (pNormals) {
for (j = 0; j < 3; ++j) {
pData[n] = pNormals[(i * 3) + j];
++n;

}


}

if (pTexCoords) {
for (j = 0; j < 2; ++j) {
pData[n] = pTexCoords[(i * 3) + j];
++n;

}


}


}

;
pVertexBuffer.create(count, iStride * iElSize, 1 << a.VertexBuffer.RamBackupBit, pData);
pVertexBuffer.setVertexDescription(pVertexDescription);
pIndexBuffer.create(5, pIndexes.length, 1 << 3, pIndexes, 2);
pMesh._nFaces = nFaces;
pMesh._nVertices = count;
pMesh._eOptions = eMeshOptions;
pMesh._pVertexBuffer = pVertexBuffer;
pMesh._pIndexBuffer = pIndexBuffer;
pMesh._pVertexDeclaration = pVertexDescription;
pMesh._pAreaTable = [new a.MeshArea(0, 0, nFaces, 0, count)];
pMesh._nBytesPerVertex = iStride * iElSize;
fnCallback(pMesh);

}
);

};
a.createFrameFromOBJMesh = function(pMesh, sName) {
var pFrame=new a.Frame(sName);
var pMeshContainer=new a.MeshContainer();
pMeshContainer.create(sName, new a.MeshData(a.MESHDATATYPE.MESH, pMesh), null, null, null);
pFrame.pMeshContainer = pMeshContainer;
return pFrame;

};
a.ObjModel = ObjModel;
function COLLADA(pEngine, sFilename, fnCallback) {
var COLLADA_REDUCE_MESH_INDECES=1;
var iTimeBegin=new Date().getTime();
function timestamp(msg) {
console.log(((new Date().getTime()) - iTimeBegin) + " ms  ", ("[ " + msg) + " ]");

}

timestamp(("loading model <" + sFilename) + " />");
var pSupportedVertexFormat=[ {sName: "X", sType: "float"},  {sName: "Y", sType: "float"},  {sName: "Z", sType: "float"}];
var pSupportedTextureFormat=[ {sName: "S", sType: "float"},  {sName: "T", sType: "float"},  {sName: "P", sType: "float"}];
var pLinks= {};
var pAsset=null;
var pEffects=null;
var pMaterials=null;
var pGeometries=null;
var pVisualScenes=null;
var pScene=null;
function link(id, pTarget) {
if ((typeof id) !== "string") {
pTarget = id;
id = pTarget.id;

}

pLinks["#" + id] = pTarget;

}

function source(key) {
if ((key.charAt(0)) !== "#") {
key = "#" + key;

}

return pLinks[key];

}

function printArray(pArr, nRow, nCol) {
var s="\n";
for (var i=0; i < (pArr.length); ++i) {
if ((i % nCol) == 0) {
s += "  ";

}

s += (pArr[i]) + ", ";
if (((i + 1) % nRow) == 0) {
s += "\n";

}


}

return s;

}

function parseBool(sValue) {
return sValue === "true";

}

function retrieve(pSrc, pDst, iStride, iFrom, iCount, iOffset, iLen) {
iStride = iStride || 1;
iOffset = iOffset || 0;
iLen = iLen || (iStride - iOffset);
iFrom = iFrom || 0;
iCount = iCount || (((pSrc.length) / iStride) - iFrom);
if ((iOffset + iLen) > iStride) {
iLen = iStride - iOffset;

}

var iBegin=iFrom * iStride;
var n=0;
for (var i=0; i < iCount; ++i) {
for (var j=0; j < iLen; ++j) {
pDst[n++] = pSrc[((iBegin + (i * iStride)) + iOffset) + j];

}


}

return n;

}

function string2Array(sData, ppData, fnConv, iFrom) {
fnConv = fnConv || parseFloat;
iFrom = iFrom || 0;
var pData=sData.split(/[\s]+/g);
for (var i=0, n=pData.length, j=0; i < n; ++i) {
if ((pData[i]) != "") {
ppData[iFrom + j] = fnConv(pData[i]);
j++;

}


}

return n;

}

function string2FloatArray(sData, ppData, iFrom) {
return string2Array(sData, ppData, parseFloat, iFrom);

}

function string2IntArray(sData, ppData, iFrom) {
return string2Array(sData, ppData, parseInt, iFrom);

}

function string2BoolArray(sData, ppData, iFrom) {
return string2Array(sData, ppData, parseBool, iFrom);

}

function eachChild(pXML, fnCallback) {
eachNode(pXML.childNodes, fnCallback);

}

function eachByTag(pXML, sTag, fnCallback, nMax) {
eachNode(pXML.getElementsByTagName(sTag), fnCallback, nMax);

}

function eachNode(pXMLList, fnCallback, nMax) {
var n=pXMLList.length;
nMax = (nMax? (nMax < n? nMax : n) : n);
var n=0, i=0;
while (n < (pXMLList.length)) {
if ((pXMLList[n++].nodeType) === 3) {
continue ;

}

var pXMLData=pXMLList[n - 1];
fnCallback(pXMLData, pXMLData.nodeName);
i++;
if (nMax === i) {
break ;

}


}

}

function firstChild(pXML, sTag) {
if (!sTag) {
for (var i=0; i < (pXML.childNodes.length); i++) {
if ((pXML.childNodes[i].nodeType) === 1) {
return pXML.childNodes[i];

}


}


}

return pXML.getElementsByTagName(sTag)[0];

}

function stringData(pXML) {
return (pXML? pXML.textContent : null);

}

function attr(pXML, sName) {
return pXML.getAttribute(sName);

}

function sortArrayByProperty(pData, pProperty) {
pProperty = pProperty || 0;
var tmp;
for (var i=(pData.length) - 1; i > 0; i--) {
for (var j=0; j < i; j++) {
if ((pData[j][pProperty]) > (pData[j + 1][pProperty])) {
tmp = pData[j];
pData[j] = pData[j + 1];
pData[j + 1] = tmp;

}


}


}

return pData;

}

function lastElement(pInput) {
return pInput[(pInput.length) - 1];

}

function COLLADAScale(pXML) {
var v3fScale=new glMatrixArrayType(3);
string2FloatArray(stringData(pXML), v3fScale);
return Mat4.diagonal(new glMatrixArrayType(16), [v3fScale[0], v3fScale[1], v3fScale[2], 1]);

}

function COLLADATranslate(pXML) {
var v3fTranslate=new glMatrixArrayType(3);
string2FloatArray(stringData(pXML), v3fTranslate);
return Vec3.toTranslationMatrix(v3fTranslate);

}

function COLLADARotate(pXML) {
var v4f=new glMatrixArrayType(4);
string2FloatArray(stringData(pXML), v4f);
return Mat4.rotate(Mat4.identity(new glMatrixArrayType(16)), ((v4f[3]) * (Math.PI)) / 180, [v4f[0], v4f[1], v4f[2]]);

}

function COLLADASampler2D(pXML) {
var pSampler= {sSource: stringData(firstChild(pXML, "source")), sWrapS: stringData(firstChild(pXML, "wrap_s")), sWrapT: stringData(firstChild(pXML, "wrap_t")), sMinFilter: stringData(firstChild(pXML, "minfilter")), sMipFilter: stringData(firstChild(pXML, "mipfilter")), sMagFilter: stringData(firstChild(pXML, "magfilter"))};
return pSampler;

}

function COLLADASurface(pXML) {
var pSurface= {sInitFrom: stringData(firstChild(pXML, "init_from"))};
return pSurface;

}

function COLLADAData(pXML) {
var sName=pXML.nodeName, pData;
var pConv= {"int": [Int32Array, string2IntArray], "float": [Float32Array, string2FloatArray], "bool": [Array, string2BoolArray]};
var fnData=function(n, sType) {
var pData=new pConv[sType][0](n);
pConv[sType][1](stringData(pXML), pData);
if (n == 1) {
return pData[0];

}

return pData;

};
switch(sName) {
case "bool":
return fnData(1, "bool");

case "int":
return fnData(1, "int");

case "float":
return fnData(1, "float");

case "float2":
return fnData(2, "float");

case "float3":
return fnData(3, "float");

case "float4":
;

case "color":
return fnData(4, "float");

case "rotate":
return COLLADARotate(pXML);

case "translate":
return COLLADATranslate(pXML);

case "scale":
return COLLADAScale(pXML);

case "matrix":
return Mat4.transpose(fnData(16, "float"));

case "float_array":
return fnData(parseInt(attr(pXML, "count")), "float");

case "int_array":
return fnData(parseInt(attr(pXML, "count")), "int");

case "bool_array":
return fnData(parseInt(attr(pXML, "count")), "bool");

case "sampler2D":
return COLLADASampler2D(pXML);

case "surface":
return COLLADASurface(pXML);

default:
if (!0) {
var err=((((((("Error:: " + (("unsupported COLLADA data type <" + sName) + " />")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("unsupported COLLADA data type <" + sName) + " />"));

}


}

;
}
return null;

}

function COLLADAAccessor(pXML) {
var pAccessor= {sSource: attr(pXML, "source"), iCount: parseInt(attr(pXML, "count")), iStride: parseInt(attr(pXML, "stride")), pParam: []};
eachChild(pXML, function(pXMLData, sName) {
pAccessor.pParam.push( {sName: attr(pXMLData, "name"), sType: attr(pXMLData, "type")});

}
);
return pAccessor;

}

function COLLADAInput(pXML, iOffset) {
var pInput= {sSemantic: attr(pXML, "semantic"), sSource: attr(pXML, "source"), iOffset: null, iSet: attr(pXML, "set")};
if (pXML.hasAttribute("offset")) {
pInput.iOffset = parseInt(attr(pXML, "offset"));

}

if (iOffset && ((pInput.iOffset) === null)) {
pInput.iOffset = iOffset;

}

return pInput;

}

function COLLADATechniqueCommon(pXML) {
var pTechniqueCommon= {pAccessor: null};
eachChild(pXML, function(pXMLData, sName) {
switch(sName) {
case "accessor":
pTechniqueCommon.pAccessor = COLLADAAccessor(pXMLData);
break ;
}

}
);
return pTechniqueCommon;

}

function COLLADASource(pXML) {
var pSource= {pArray:  {}, pTechniqueCommon: null};
eachChild(pXML, function(pXMLData, sName) {
var tmp, id;
switch(sName) {
case "int_array":
;

case "bool_array":
;

case "float_array":
tmp = COLLADAData(pXMLData);
id = attr(pXMLData, "id");
pSource.pArray[id] = tmp;
link(id, tmp);
break ;

case "technique_common":
pSource.pTechniqueCommon = COLLADATechniqueCommon(pXMLData);
break ;
}

}
);
return pSource;

}

function COLLADAVertices(pXML) {
var pVerices= {id: attr(pXML, "id"), pInput:  {}};
eachByTag(pXML, "input", function(pXMLData) {
switch(attr(pXMLData, "semantic")) {
case "POSITION":
pVerices.pInput["POSITION"] = COLLADAInput(pXMLData);
break ;

default:
if (!0) {
var err=((((((("Error:: " + "semantics are different from POSITION is not supported in the <vertices /> tag") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("semantics are different from POSITION is not supported in the <vertices /> tag");

}


}

;
}

}
);
return pVerices;

}

function polygonToTriangles(pXML, iStride) {
return trifanToTriangles(pXML, iStride);

}

function trifanToTriangles(pXML, iStride) {
var pFans2Tri=[0, 0, 0];
var pData=[];
var tmp=new Array(iStride), n;
var pIndexes=[];
eachByTag(pXML, "p", function(pXMLData) {
n = string2IntArray(stringData(pXMLData), pData);
for (var i=0; i < 3; i++) {
retrieve(pData, tmp, iStride, i, 1);
for (var j=0; j < iStride; ++j) {
pIndexes.push(tmp[j]);

}


}

for (var i=3, m=n / iStride; i < m; i++) {
pFans2Tri[1] = i - 1;
pFans2Tri[2] = i;
for (var j=0; j < (pFans2Tri.length); ++j) {
for (var k=0; k < iStride; ++k) {
pIndexes.push(pData[((pFans2Tri[j]) * iStride) + k]);

}


}


}


}
);
return pIndexes;

}

function tristripToTriangles(pXML, iStride) {
var pStrip2Tri=[0, 0, 0];
var pData=[];
var tmp=new Array(iStride), n;
var pIndexes=[];
eachByTag(pXML, "p", function(pXMLData) {
n = string2IntArray(stringData(pXMLData), pData);
for (var i=0; i < 3; i++) {
retrieve(pData, tmp, iStride, i, 1);
for (var j=0; j < iStride; ++j) {
pIndexes.push(tmp[j]);

}


}

for (var i=3, m=n / iStride; i < m; i++) {
pStrip2Tri[0] = i - 1;
pStrip2Tri[1] = i - 2;
pStrip2Tri[2] = i;
for (var j=0; j < (pStrip2Tri.length); ++j) {
for (var k=0; k < iStride; ++k) {
pIndexes.push(pData[((pStrip2Tri[j]) * iStride) + k]);

}


}


}


}
);
return pIndexes;

}

function polylistToTriangles(pXML, iStride) {
var pXMLvcount=firstChild(pXML, "vcount");
var pXMLp=firstChild(pXML, "p");
var pVcount=new Array(parseInt(attr(pXML, "count")));
var pData, pIndexes, n, h=0;
var tmp=new Array(128);
var buf=new Array(256);
var pPoly2Tri=[0, 0, 0];
string2IntArray(stringData(pXMLvcount), pVcount);
var nElements=0, nTotalElement=0;
for (var i=0; i < (pVcount.length); i++) {
nElements += pVcount[i];
nTotalElement += ((pVcount[i]) - 2) * 3;

}

pIndexes = new Array(iStride * nTotalElement);
pData = new Array(iStride * nElements);
string2IntArray(stringData(pXMLp), pData);
for (var i=0, m=0; i < (pVcount.length); i++) {
n = retrieve(pData, tmp, iStride, m, pVcount[i]);
for (var j=0; j < 3; j++) {
retrieve(tmp, buf, iStride, j, 1);
for (var k=0; k < iStride; ++k) {
pIndexes[h++] = buf[k];

}


}

for (var x=3, t=n / iStride; x < t; x++) {
pPoly2Tri[1] = x - 1;
pPoly2Tri[2] = x;
for (var j=0; j < (pPoly2Tri.length); ++j) {
for (var k=0; k < iStride; ++k) {
pIndexes[h++] = pData[((m + (pPoly2Tri[j])) * iStride) + k];

}


}


}

m += pVcount[i];

}

return pIndexes;

}

function COLLADAPolygons(pXML, sType) {
var pPolygons= {pInput: [], p: null, sMaterial: attr(pXML, "material"), sName: null};
var iOffset=0, n=0;
var iCount=parseInt(attr(pXML, "count"));
var iStride;
eachByTag(pXML, "input", function(pXMLData) {
pPolygons.pInput.push(COLLADAInput(pXMLData, iOffset));
iOffset++;

}
);
sortArrayByProperty(pPolygons.pInput, "iOffset");
iStride = (lastElement(pPolygons.pInput).iOffset) + 1;
switch(sType) {
case "polylist":
pPolygons.p = polylistToTriangles(pXML, iStride);
break ;

case "polygons":
pPolygons.p = polygonToTriangles(pXML, iStride);
eachByTag(pXML, "ph", function(pXMLData) {
if (!0) {
var err=((((((("Error:: " + "unsupported polygon[polygon] subtype founded: <ph>") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("unsupported polygon[polygon] subtype founded: <ph>");

}


}

;

}
);
break ;

case "triangles":
pPolygons.p = new Array((3 * iCount) * iStride);
eachByTag(pXML, "p", function(pXMLData) {
n += string2IntArray(stringData(pXMLData), pPolygons.p, n);

}
);
break ;

case "trifans":
pPolygons.p = trifanToTriangles(pXML, iStride);
break ;

case "tristrips":
pPolygons.p = tristripToTriangles(pXML, iStride);
break ;

default:
if (!0) {
var err=((((((("Error:: " + (("unsupported polygon[" + sType) + "] type founded")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("unsupported polygon[" + sType) + "] type founded"));

}


}

;
}
if ((pPolygons.eType) === undefined) {
pPolygons.eType = 4;

}

return pPolygons;

}

function prepareInput(pInput) {
switch(pInput.sSemantic) {
case "VERTEX":
;

case "NORMAL":
;

case "TANGENT":
;

case "BINORMAL":
;

case "POSITION":
pInput.sArrayId = getCOLLADASourceData(pInput.sSource, pSupportedVertexFormat);
break ;

case "TEXCOORD":
pInput.sArrayId = getCOLLADASourceData(pInput.sSource, pSupportedTextureFormat);
break ;

case "TEXTANGENT":
;

case "TEXBINORMAL":
;

case "WEIGHT":
;

case "UV":
;

case "OUT_TANGENT":
;

case "OUTPUT":
;

case "MORPH_WEIGHT":
;

case "MORPH_TARGET":
;

case "LINEAR_STEPS":
;

case "JOINT":
;

case "INV_BIND_MATRIX":
;

case "INTERPOLATION":
;

case "IN_TANGENT":
;

case "INPUT":
;

case "IMAGE":
;

case "CONTINUITY":
;

case "COLOR":
;

default:
if (!0) {
var err=((((((("Error:: " + (("unsupported semantic used <" + (pInput[i].sSemantic)) + ">")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("unsupported semantic used <" + (pInput[i].sSemantic)) + ">"));

}


}

;
}
pInput.pArray = source(pInput.sArrayId);
pInput.pAccessor = source(pInput.sSource).pTechniqueCommon.pAccessor;
return pInput;

}

function prepareMesh(pMesh) {
for (var i=0; i < (pMesh.pPolygons.length); i++) {
pMesh.pPolygons[i].pDeclarations = [];
for (var j=0, pInput=pMesh.pPolygons[i].pInput; j < (pInput.length); ++j) {
var pVertDecl=new VertexDeclaration(pInput[j].pAccessor.iStride, pInput[j].sSemantic, 5126, a.declarationSemanticFromString(pInput[j].sSemantic));
pVertDecl.iIndexOffset = pInput[j].iOffset;
pMesh.pPolygons[i].pDeclarations.push([pVertDecl]);

}

delete (pMesh.pPolygons[i].pInput);

}

pMesh.pData = [];
for (var i in pMesh.pSource) {
var pAccess=pMesh.pSource[i].pTechniqueCommon.pAccessor;
var pArr=source(pAccess.sSource);
pMesh.pData.push( {pData: pArr, nCount: pAccess.iCount, iStride: pAccess.iStride});

}

delete (pMesh.pSource);

}

function prepareMeshWithReducedIndices(pMesh) {
var pMem= {};
for (var i=0; i < (pMesh.pPolygons.length); i++) {
pMem = reduceToSingleIndex(pMesh.pPolygons[i], pMem);
pMesh.pPolygons[i].p = pMem.indices;
delete (pMesh.pPolygons[i].pInput);
var pVertexDeclaration=[];
for (var j=0, pInput=pMem.cache; j < (pInput.length); ++j) {
var pVertDecl=new VertexDeclaration(pInput[j].pAccessor.iStride, pInput[j].sSemantic, 5126, a.declarationSemanticFromString(pInput[j].sSemantic));
pVertDecl.iIndexOffset = 0;
pVertexDeclaration.push(pVertDecl);

}

pMesh.pPolygons[i].pDeclarations = [pVertexDeclaration];

}

pMesh.pData = [ {pData: pMem.pData, nCount: (pMem.pData.length) / (pMem.iStride), iStride: pMem.iStride}];
delete (pMesh.pSource);
pMem = null;

}

var getCOLLADASourceData=function(sSourceId, pFormat) {
var nStride=pFormat.length;
var pSource=source(sSourceId);
if (!pSource) {
var err=((((((("Error:: " + (("<source /> with id <" + sSourceId) + "> not founded")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("<source /> with id <" + sSourceId) + "> not founded"));

}


}

;
var pTech=pSource.pTechniqueCommon;
if (!pTech) {
var err=((((((("Error:: " + (("<source /> with id <" + sSourceId) + "> has no <technique_common />")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("<source /> with id <" + sSourceId) + "> has no <technique_common />"));

}


}

;
var pAccess=pTech.pAccessor;
if (!((pAccess.iStride) <= nStride)) {
var err=((((((("Error:: " + ((("<source /> width id" + sSourceId) + " has unsupported stride: ") + (pAccess.iStride))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(((("<source /> width id" + sSourceId) + " has unsupported stride: ") + (pAccess.iStride)));

}


}

;
for (var i in pAccess.param) {
if (((pAccess.param[i].sName) != (pFormat[i].sName)) || ((pAccess.param[i].sType) != (pFormat[i].sType))) {
if (!0) {
var err=((((((("Error:: " + "vertices accessor has unsupported format") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("vertices accessor has unsupported format");

}


}

;

}


}

return pAccess.sSource;

};
function reduceToSingleIndex(pPolygons, pMem) {
if ((pPolygons.eType) != (4)) {
if (!0) {
var err=((((((("Error:: " + (("cannot reduce index for type <" + (pPolygons.eType)) + ">")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("cannot reduce index for type <" + (pPolygons.eType)) + ">"));

}


}

;

}

var pInput=pPolygons.pInput;
var pVertices;
var n;
var iStride=0;
var pShoter=[];
if (pMem.cache) {
pShoter = pMem.cache;
iStride = pMem.iStride;

}

if ((pShoter.length) && ((pShoter.length) != (pInput.length))) {
if (!0) {
var err=((((((("Error:: " + "it is impossible to reduce to a single index of polygon with different numbers of indices") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("it is impossible to reduce to a single index of polygon with different numbers of indices");

}


}

;

}

if (iStride == 0) {
for (var i=0; i < (pInput.length); ++i) {
pShoter[i] =  {iOffset: pInput[i].iOffset, sSource: pInput[i].sSource, sSemantic: pInput[i].sSemantic, pArray: pInput[i].pArray, pAccessor: pInput[i].pAccessor};
iStride += pShoter[i].pAccessor.iStride;

}


}

n = 0;
pShoter[0].iStrideOffset = 0;
for (var i=1; i < (pShoter.length); i++) {
n += pShoter[i - 1].pAccessor.iStride;
pShoter[i].iStrideOffset = n;

}

var pRes=(pMem.pData) || ([]);
var pIndexRes=[];
pMem.indices = pIndexRes;
pMem.pData = pRes;
n = (pMem.n) || 0;
function glueIndex(pData, iFrom, iStride) {
var s="";
for (var i=0, n=iFrom * iStride; i < iStride; i++) {
s += pData[n + i];

}

return s;

}

for (var nIn=(lastElement(pShoter).iOffset) + 1, i=0, nEl=(pPolygons.p.length) / nIn; i < nEl; i++) {
var sHash=glueIndex(pPolygons.p, i, nIn);
var nPos=pMem[sHash];
if (nPos === undefined) {
for (var j=0, iNin=i * nIn; j < (pShoter.length); j++) {
var iIndexFrom=pPolygons.p[iNin + (pShoter[j].iOffset)];
var iShift=(n * iStride) + (pShoter[j].iStrideOffset);
for (var s=pShoter[j].pAccessor.iStride, iFrom=iIndexFrom * s, k=0; k < s; ++k) {
pRes[iShift + k] = pShoter[j].pArray[iFrom + k];

}


}

pMem[sHash] = n;
pIndexRes.push(n);
n++;

}
else  {
pIndexRes.push(nPos);

}


}

pMem.n = n;
pMem.cache = pShoter;
pMem.iStride = iStride;
return pMem;

}

function COLLADAMesh(pXML) {
var pMesh= {pSource:  {}, pPolygons: []};
var id, tmp, pVertices, pPos;
eachChild(pXML, function(pXMLData, sName) {
switch(sName) {
case "source":
id = attr(pXMLData, "id");
pMesh.pSource[id] = COLLADASource(pXMLData);
link(id, pMesh.pSource[id]);
break ;

case "vertices":
pVertices = COLLADAVertices(pXMLData);
break ;

case "lines":
;

case "linestrips":
;

case "tristrips":
;

case "trifans":
;

case "triangles":
;

case "polygons":
;

case "polylist":
tmp = COLLADAPolygons(pXMLData, sName);
for (var i=0; i < (tmp.pInput.length); ++i) {
if ((tmp.pInput[i].sSemantic) == "VERTEX") {
if ((tmp.pInput[i].sSource) == ("#" + (pVertices.id))) {
pPos = pVertices.pInput["POSITION"];
tmp.pInput[i].sSource = pPos.sSource;
tmp.pInput[i].sSemantic = pPos.sSemantic;

}
else  {
if (!0) {
var err=((((((("Error:: " + "<input /> with semantic VERTEX must refer to <vertices /> tag in same mesh.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("<input /> with semantic VERTEX must refer to <vertices /> tag in same mesh.");

}


}

;

}


}

prepareInput(tmp.pInput[i]);

}

pMesh.pPolygons.push(tmp);
break ;
}

}
);
if (COLLADA_REDUCE_MESH_INDECES) {
prepareMeshWithReducedIndices(pMesh);

}
else  {
prepareMesh(pMesh);

}

return pMesh;

}

function COLLADAGeometrie(pXML) {
var pGeometrie= {pMesh: null, pConvexMesh: null, pSpline: null, id: attr(pXML, "id"), sName: attr(pXML, "name")};
link(pGeometrie);
var pXMLData=firstChild(pXML);
var sName=pXMLData.nodeName;
if (sName == "mesh") {
pGeometrie.pMesh = COLLADAMesh(pXMLData);

}

return pGeometrie;

}

function COLLADAInstanceEffect(pXML) {
var pInstance= {pParameters:  {}, pTechniqueHint:  {}, sUrl: attr(pXML, "url")};
eachByTag(pXML, "technique_hint", function(pXMLData) {
pInstance.pTechniqueHint[attr(pXMLData, "platform")] = attr(pXMLData, "ref");
console.log("technique_hint used!!!!");

}
);
eachByTag(pXML, "setparam", function(pXMLData) {
pParameters[attr(pXMLData, "ref")] = COLLADAData(pXMLData);
console.log("setparam used!!!!");

}
);
return pInstance;

}

function COLLADAMaterial(pXML) {
var pMaterial= {id: attr(pXML, "id"), sName: attr(pXML, "name"), pInstanceEffect: COLLADAInstanceEffect(firstChild(pXML, "instance_effect"))};
link(pMaterial);
return pMaterial;

}

function COLLADANewParam(pXML) {
var pParam= {sid: attr(pXML, "sid"), pAnnotate: null, sSemantic: null, sModifier: null, pValue: null, sType: null};
link(pParam.sid, pParam);
eachChild(pXML, function(pXMLData, sName) {
switch(sName) {
case "semantic":
pParam.sSemantic = stringData(pXMLData);
break ;

case "modifier":
pParam.sModifier = stringData(pXMLData);

case "annotate":
pParam.pAnnotate =  {sName: attr(pXMLData, "name"), sValue: stringData(pXMLData)};

case "float":
;

case "float2":
;

case "float3":
;

case "float4":
;

case "surface":
;

case "sampler2D":
pParam.sType = sName;
pParam.pValue = COLLADAData(pXMLData);
break ;

default:
pParam.pValue = COLLADAData(pXMLData);
}

}
);
return pParam;

}

function COLLADATexture(pXML) {
var pTexture= {sSampler: attr(pXML, "texture"), sTexcoord: attr(pXML, "texcoord"), pSampler: null, pSurface: null, pImage: null};
pTexture.pSampler = source(pTexture.sSampler);
pTexture.pSurface = source(pTexture.pSampler.pValue.sSource);
pTexture.pImage = source(pTexture.pSurface.pValue.sInitFrom);
return pTexture;

}

function COLLADAPhong(pXML) {
var pMat=new a.MaterialEx();
var pXMLData;
var pList=["pEmission", "pAmbient", "pDiffuse", "fShininess", "pReflective", "fReflectivity", "pTransparent", "fTransparency", "pSpecular"];
pMat.pCTexture =  {};
for (var i=0; i < (pList.length); i++) {
pXMLData = firstChild(pXML, pList[i].substr(1).toLowerCase());
if (pXMLData) {
eachChild(pXMLData, function(pXMLData, sName) {
switch(sName) {
case "color":
pMat[pList[i]] = COLLADAData(pXMLData);
break ;

case "texture":
var pTexture=COLLADATexture(pXMLData);
pMat.pCTexture[pTexture.sTexcoord] = pTexture;
}

}
);

}


}

return pMat;

}

function COLLADAEffectTechnique(pXML) {
var pTech= {sid: attr(pXML, "sid"), sType: null, pValue: null};
link(pTech.sid, pTech);
var pValue=firstChild(pXML);
pTech.sType = pValue.nodeName;
switch(pTech.sType) {
case "blinn":
;

case "phong":
pTech.pValue = COLLADAPhong(pValue);
break ;

default:
if (!0) {
var err=((((((("Error:: " + (("unsupported technique <" + (pTech.sType)) + " /> founded")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("unsupported technique <" + (pTech.sType)) + " /> founded"));

}


}

;
}
return pTech;

}

function COLLADAProfileCommon(pXML) {
var pProfile= {pTechnique: null, pNewParam:  {}};
eachByTag(pXML, "newparam", function(pXMLData) {
pProfile.pNewParam[attr(pXMLData, "sid")] = COLLADANewParam(pXMLData);

}
);
pProfile.pTechnique = COLLADAEffectTechnique(firstChild(pXML, "technique"));
return pProfile;

}

function COLLADAEffect(pXML) {
var pEffect= {id: attr(pXML, "id"), pProfileCommon: null};
eachChild(pXML, function(pXMLData, sName) {
switch(sName) {
case "profile_COMMON":
pEffect.pProfileCommon = COLLADAProfileCommon(pXMLData);
break ;

case "extra":
break ;

default:
if (!0) {
var err=((((((("Error:: " + (("<" + sName) + " /> unsupported in effect section")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("<" + sName) + " /> unsupported in effect section"));

}


}

;
}

}
);
link(pEffect);
return pEffect;

}

function COLLADAInstanceGeometry(pXML) {
var pInst= {pGeometry: source(attr(pXML, "url")), pMaterials:  {}};
var pSourceMat=null, pMat=null;
eachByTag(pXML, "bind_material", function(pXMLData) {
var pTech=firstChild(pXMLData, "technique_common");
eachByTag(pTech, "instance_material", function(pInstMat) {
pSourceMat = source(attr(pInstMat, "target"));
pMat =  {sUrl: pSourceMat.pInstanceEffect.sUrl, pVertexInput: []};
eachByTag(pInstMat, "bind_vertex_input", function(pXMLVertexInput) {
var sInputSemantic=attr(pXMLVertexInput, "input_semantic");
if (sInputSemantic !== "TEXCOORD") {
if (!0) {
var err=((((((("Error:: " + ("unsupported vertex input semantics founded: " + sSemantic)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("unsupported vertex input semantics founded: " + sSemantic));

}


}

;

}

var sSemantic=attr(pXMLVertexInput, "semantic");
var sInputSet=parseInt(attr(pXMLVertexInput, "input_set"));
pMat.pVertexInput.push( {"sSemantic": sSemantic, "sInputSet": sInputSet, "sInputSemantic": sInputSemantic});

}
);
pInst.pMaterials[attr(pInstMat, "symbol")] = pMat;

}
);

}
);
return pInst;

}

function COLLADANode(pXML) {
var pNode= {id: attr(pXML, "id"), sid: attr(pXML, "sid"), sName: attr(pXML, "name"), sType: attr(pXML, "type"), sLayer: attr(pXML, "layer"), m4fTransform: Mat4.identity(new glMatrixArrayType(16)), pGeometry: null, pChildNodes: []};
var m4fTransform=Mat4.identity(new glMatrixArrayType(16)), m4fMatrix;
var sType, id;
link(pNode);
eachChild(pXML, function(pXMLData, sName) {
switch(sName) {
case "matrix":
;

case "translate":
;

case "rotate":
;

case "scale":
m4fMatrix = COLLADAData(pXMLData);
Mat4.mult(pNode.m4fTransform, m4fMatrix);
break ;

case "instance_geometry":
pNode.pGeometry = COLLADAInstanceGeometry(pXMLData);
break ;

case "node":
pNode.pChildNodes.push(COLLADANode(pXMLData));
break ;
}

}
);
if ((!(pNode.pGeometry)) && (!(pNode.pChildNodes.length))) {
return null;

}

return pNode;

}

function COLLADAVisualScene(pXML) {
var pNode;
var pScene= {id: attr(pXML, "id"), name: attr(pXML, "name"), pNodes: []};
link(pScene);
eachChild(pXML, function(pXMLData, sName) {
switch(sName) {
case "node":
pNode = COLLADANode(pXMLData);
if (pNode) {
pScene.pNodes.push(pNode);

}

break ;
}

}
);
return pScene;

}

function COLLADAImage(pXML) {
var pImage= {id: attr(pXML, "id"), sName: attr(pXML, "name"), iDepth: 1, pData: null, sImagePath: null};
link(pImage);
var pXMLInitData, pXMLData;
if (pXMLInitData = firstChild(pXML, "init_from")) {
pImage.sImagePath = stringData(pXMLInitData);

}
else if (pXMLData = firstChild(pXML, "data")) {
if (!0) {
var err=((((((("Error:: " + "image loading from <data /> tag unsupported yet.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("image loading from <data /> tag unsupported yet.");

}


}

;

}
else  {
if (!0) {
var err=((((((("Error:: " + (("image with id: " + (pImage.id)) + " has no data.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("image with id: " + (pImage.id)) + " has no data."));

}


}

;

}


return pImage;

}

function COLLADAAsset(pXML) {
var pAsset= {pUnit:  {fMeter: 1, sName: "meter"}, sUPaxis: "Y_UP", sTitle: null, sCreated: null, sModified: null, pContributor: null};
eachChild(pXML, function(pXMLNode, sName) {
var sValue=stringData(pXMLNode);
switch(sName) {
case "up_axis":
pAsset.sUPaxis = sValue;
break ;

case "created":
pAsset.sCreated = sValue;
break ;

case "modified":
pAsset.sModified = sValue;
break ;

case "title":
pAsset.sTitle = sValue;
break ;

case "contributor":
break ;

case "unit":
pAsset.pUnit.fMeter = parseFloat(attr(pXMLNode, "meter"));
pAsset.pUnit.sName = attr(pXMLNode, "name");
break ;
}

}
);
return pAsset;

}

function COLLADALibrary(pXML, sTag, fnLoader) {
if (!pXML) {
return null;

}

var pLib= {};
pLib[sTag] =  {};
eachByTag(pXML, sTag, function(pXMLData) {
pLib[sTag][attr(pXMLData, "id")] = fnLoader(pXMLData);

}
);
return pLib;

}

function COLLADAScene(pXML) {
var pXMLData=firstChild(pXML, "instance_visual_scene");
var pScene=source(attr(pXMLData, "url"));
if ((!pXMLData) || (!pScene)) {
if (!0) {
var err=((((((("Error:: " + (("collada model: " + sFilename) + " has no visual scenes.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("collada model: " + sFilename) + " has no visual scenes."));

}


}

;

}

return pScene;

}

function buildAssetMatrix() {
var fUnit=pAsset.pUnit.fMeter;
var sUPaxis=pAsset.sUPaxis;
var m4fAsset=Mat4.diagonal(new glMatrixArrayType(16), [fUnit, fUnit, fUnit, 1]);
if ((sUPaxis.toUpperCase()) == "Z_UP") {
Mat4.rotate(m4fAsset, (-0.5) * (Math.PI), [1, 0, 0]);

}

return m4fAsset;

}

var nTotalFrames=0;
function buildFrame(pNodes) {
if (!pNodes)return null;

var pFrameSibling=null;
var pNode=null;
var pFrame=null;
for (var i=(pNodes.length) - 1; i >= 0; i--) {
pNode = pNodes[i];
pFrameSibling = pFrame;
pFrame = new a.Frame(pNode.sName);
pFrame.pFrameSibling = pFrameSibling;
pFrame.pFrameFirstChild = buildFrame(pNode.pChildNodes);
if (pNode.pGeometry) {
pFrame.pMeshContainer = buildMeshContainer(pNode.pGeometry);

}

pFrame.m4fTransformationMatrix[0] = pNode.m4fTransform[0];
pFrame.m4fTransformationMatrix[1] = pNode.m4fTransform[1];
pFrame.m4fTransformationMatrix[2] = pNode.m4fTransform[2];
pFrame.m4fTransformationMatrix[3] = pNode.m4fTransform[3];
pFrame.m4fTransformationMatrix[4] = pNode.m4fTransform[4];
pFrame.m4fTransformationMatrix[5] = pNode.m4fTransform[5];
pFrame.m4fTransformationMatrix[6] = pNode.m4fTransform[6];
pFrame.m4fTransformationMatrix[7] = pNode.m4fTransform[7];
pFrame.m4fTransformationMatrix[8] = pNode.m4fTransform[8];
pFrame.m4fTransformationMatrix[9] = pNode.m4fTransform[9];
pFrame.m4fTransformationMatrix[10] = pNode.m4fTransform[10];
pFrame.m4fTransformationMatrix[11] = pNode.m4fTransform[11];
pFrame.m4fTransformationMatrix[12] = pNode.m4fTransform[12];
pFrame.m4fTransformationMatrix[13] = pNode.m4fTransform[13];
pFrame.m4fTransformationMatrix[14] = pNode.m4fTransform[14];
pFrame.m4fTransformationMatrix[15] = pNode.m4fTransform[15];
nTotalFrames++;

}

return pFrame;

}

function buildMesh(pGeometry) {
var pMesh=new a.Mesh(pEngine);
var pCMesh=pGeometry.pMesh;
var sUniqName=(pGeometry.sName) + (a.sid());
if (!pCMesh) {
var err=((((((("Error:: " + "buildMesh:: mesh not founded.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("buildMesh:: mesh not founded.");

}


}

;
if (!((pCMesh.pData.length) == 1)) {
var err=((((((("Error:: " + "multi index mesh unsupported") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("multi index mesh unsupported");

}


}

;
var pData=pCMesh.pData[0];
var pPolygons=pCMesh.pPolygons;
var pVertexBuffer=pEngine.displayManager().vertexBufferPool().createResource(sUniqName);
var pIndexBuffer=pEngine.displayManager().indexBufferPool().createResource(sUniqName);
var pMeshAreas=[];
var pIndexes=[];
var iElSize=a.getTypeSize(5126);
var pVertexDescription=pPolygons[0].pDeclarations[0];
for (var i=0, iFaceStart=0; i < (pPolygons.length); i++) {
var pPolyGroup=pPolygons[i];
if (!((pPolyGroup.pDeclarations.length) == 1)) {
var err=((((((("Error:: " + "multiply vertex declarations unsupported") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("multiply vertex declarations unsupported");

}


}

;
var pArea=new a.MeshArea(i, iFaceStart, (pPolyGroup.p.length) / 3, 0, 0);
iFaceStart += pArea.iFaceCount;
pMeshAreas.push(pArea);
pIndexes = pIndexes.concat(pPolyGroup.p);

}

pVertexBuffer.create(pData.nCount, (pData.iStride) * iElSize, 1 << a.VertexBuffer.RamBackupBit, new Float32Array(pData.pData));
pVertexBuffer.setVertexDescription(pVertexDescription);
pIndexBuffer.create(4, pIndexes.length, 1 << 3, pIndexes, 2);
pMesh._nFaces = (pIndexes.length) / 3;
pMesh._nVertices = pData.nCount;
pMesh._eOptions = 0;
pMesh._pVertexBuffer = pVertexBuffer;
pMesh._pIndexBuffer = pIndexBuffer;
pMesh._pVertexDeclaration = pVertexDescription;
pMesh._pAreaTable = pMeshAreas;
pMesh._nBytesPerVertex = (pData.iStride) * iElSize;
return pMesh;

}

function buildMeshContainer(pGeometry) {
var pMeshContainer=new a.MeshContainer();
var pMesh=buildMesh(pGeometry.pGeometry);
var pMeshData=new a.MeshData(a.MESHDATATYPE.MESH, pMesh);
var pMaterials=[], pMat, pSourceMat, pCMaterial, pCTexture;
var pPolygons=pGeometry.pGeometry.pMesh.pPolygons;
for (var i=0; i < (pPolygons.length); i++) {
var pPolyGroup=pPolygons[i];
pMaterials[i] = null;
if (pPolyGroup.sMaterial) {
pCMaterial = pGeometry.pMaterials[pPolyGroup.sMaterial];
pSourceMat = source(pCMaterial.sUrl).pProfileCommon.pTechnique.pValue;
pMat = new a.MaterialBase();
a.MaterialBase.set(pSourceMat, pMat);
if ((pCMaterial.pVertexInput.length) > 0) {
if ((pCMaterial.pVertexInput.length) > 1) {
if (!0) {
var err=((((((("Error:: " + "supported only one vertex input...") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("supported only one vertex input...");

}


}

;

}

pCTexture = pSourceMat.pCTexture[pCMaterial.pVertexInput[0].sSemantic];
if (pCTexture) {
pMat.sTextureFilename = pCTexture.pImage.sImagePath;

}


}

pMaterials[i] = pMat;

}


}

pMeshContainer.create(pGeometry.sName, pMeshData, pMaterials, null, null);
return pMeshContainer;

}

function buildMaterial(pMaterial) {
timestamp("building material: " + (pMaterial.id));
return pMaterial;

}

function buildFramList() {
var m4fRootTransform=buildAssetMatrix();
for (var i=0; i < (pScene.pNodes.length); i++) {
var pNode=pScene.pNodes[i];
Mat4.mult(pNode.m4fTransform, m4fRootTransform);

}

return buildFrame(pScene.pNodes);

}

a.fopen(sFilename).read(function(sXMLData) {
var pParser=new DOMParser();
var pXMLRootNode=pParser.parseFromString(sXMLData, "application/xml");
var pXMLCollada=pXMLRootNode.getElementsByTagName("COLLADA")[0];
var pLib= {};
var pTemplate=[ {sLib: "library_images", sElement: "image", fn: COLLADAImage},  {sLib: "library_effects", sElement: "effect", fn: COLLADAEffect},  {sLib: "library_materials", sElement: "material", fn: COLLADAMaterial},  {sLib: "library_geometries", sElement: "geometry", fn: COLLADAGeometrie},  {sLib: "library_visual_scenes", sElement: "visual_scene", fn: COLLADAVisualScene}];
pAsset = COLLADAAsset(firstChild(pXMLCollada, "asset"));
for (var i=0; i < (pTemplate.length); i++) {
pLib[pTemplate[i].sLib] = COLLADALibrary(firstChild(pXMLCollada, pTemplate[i].sLib), pTemplate[i].sElement, pTemplate[i].fn);

}

pScene = COLLADAScene(firstChild(pXMLCollada, "scene"));
fnCallback(buildFramList(), nTotalFrames);

}
);

}

a.COLLADA = COLLADA;
function Collada(pEngine, sFilename) {
;
this._eState = 0;
this._fnCallback = null;
if (sFilename) {
this.load(sFilename);

}


}

;
Collada.prototype.load = function(sFilename) {
a.fopen(sFilename).read(function(sXMLData) {
var pParser=new DOMParser();
var pXMLRootNode=pParser.parseFromString(sXMLData, "application/xml");
var pXMLCollada=pXMLRootNode.getElementsByTagName("COLLADA")[0];
var begin=new Date().getTime();
var pSourceModel=a.xml2json(pXMLCollada).toObj();
console.log((new Date().getTime()) - begin, "ms needed for translating xml to json.");

}
);

};
Collada.prototype.isLoaded = function() {
return (this._eFlags & (1 << 1)) != 0;

};
Collada.prototype._event = function(eEvent) {
this._fnCallback(eEvent, this);

};
a.defineProperty(Collada, "onload", null, function(fnCallback) {
this._fnCallback = fnCallback;
if (this.isLoaded()) {
this._event(1);

}


}
);
a.Collada = Collada;
function PoolGroup(pEngine, fnTemplate, iMaxCount) {
if (!pEngine) {
var err=((((((("Error:: " + "Engine не передан в PoolGroup") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Engine не передан в PoolGroup");

}


}

;
if (!(fnTemplate != undefined)) {
var err=((((((("Error:: " + "Type data not defined") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Type data not defined");

}


}

;
this._pEngine = pEngine;
this._fnTemplate = fnTemplate;
this._iTotalOpen = 0;
this._iFirstOpen = 0;
this._iMaxCount = iMaxCount;
this._pNextOpenList = null;
this._pMemberList = null;

}

PoolGroup.prototype.create = function() {
var i;
if (!(((this._pMemberList) == null) && ((this._pNextOpenList) == null))) {
var err=((((((("Error:: " + "Group has already been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group has already been created");

}


}

;
this._pNextOpenList = new Array(this._iMaxCount);
if (!((this._pNextOpenList) != null)) {
var err=((((((("Error:: " + "tragic memory allocation failure!") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("tragic memory allocation failure!");

}


}

;
this._pMemberList = new Array(this._iMaxCount);
for (i = 0; i < (this._iMaxCount); i++) {
this._pMemberList[i] = new this._fnTemplate(this._pEngine);

}

if (!((this._pNextOpenList) != null)) {
var err=((((((("Error:: " + "tragic memory allocation failure!") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("tragic memory allocation failure!");

}


}

;
for (i = 0; i < ((this._iMaxCount) - 1); i++) {
this._pNextOpenList[i] = i + 1;

}

this._pNextOpenList[i] = i;
this._iTotalOpen = this._iMaxCount;
this._iFirstOpen = 0;

};
PoolGroup.prototype.destroy = function() {
if (!(((this._pMemberList) != null) && ((this._pNextOpenList) != null))) {
var err=((((((("Error:: " + "Group has not been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group has not been created");

}


}

;
if (!((this._iTotalOpen) == (this._iMaxCount))) {
var err=((((((("Error:: " + "Group is not empty") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group is not empty");

}


}

;
delete (this._pMemberList);
this._pMemberList = null;
delete (this._pNextOpenList);
this._pNextOpenList = null;
this._iTotalOpen = 0;
this._iMaxCount = 0;

};
PoolGroup.prototype.nextMember = function() {
if (!(((this._pMemberList) != null) && ((this._pNextOpenList) != null))) {
var err=((((((("Error:: " + "Group has not been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group has not been created");

}


}

;
if (!((this._iTotalOpen) != null)) {
var err=((((((("Error:: " + "no open slots") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("no open slots");

}


}

;
var iSlot=this._iFirstOpen;
this._iFirstOpen = this._pNextOpenList[iSlot];
this._iTotalOpen--;
if (!((this._iFirstOpen) != 65535)) {
var err=((((((("Error:: " + "Invalid Open Index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Invalid Open Index");

}


}

;
if (!this.isOpen(iSlot)) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
this._pNextOpenList[iSlot] = 65535;
return iSlot;

};
PoolGroup.prototype.addMember = function(pMember) {
var iSlot=this.nextMember();
this._pMemberList[iSlot] = pMember;
return iSlot;

};
PoolGroup.prototype.release = function(iIndex) {
if (!(((this._pMemberList) != null) && ((this._pNextOpenList) != null))) {
var err=((((((("Error:: " + "Group has not been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group has not been created");

}


}

;
if (!(iIndex < (this._iMaxCount))) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
if (!((this.isOpen(iIndex)) == false)) {
var err=((((((("Error:: " + "invalid index to release") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index to release");

}


}

;
this._pNextOpenList[iIndex] = ((this._iTotalOpen) > 0? this._iFirstOpen : iIndex);
this._iTotalOpen++;
this._iFirstOpen = iIndex;

};
PoolGroup.prototype.totalOpen = function(pMember) {
return this._iTotalOpen;

};
PoolGroup.prototype.totalUsed = function(pMember) {
return (this._iMaxCount) - (this._iTotalOpen);

};
PoolGroup.prototype.firstOpen = function(pMember) {
return this._iFirstOpen;

};
PoolGroup.prototype.isOpen = function(iIndex) {
if (!(((this._pMemberList) != null) && ((this._pNextOpenList) != null))) {
var err=((((((("Error:: " + "Group has not been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group has not been created");

}


}

;
if (!(iIndex < (this._iMaxCount))) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
return (this._pNextOpenList[iIndex]) != 65535;

};
PoolGroup.prototype.member = function(iIndex) {
if (!(((this._pMemberList) != null) && ((this._pNextOpenList) != null))) {
var err=((((((("Error:: " + "Group has not been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group has not been created");

}


}

;
if (!(iIndex < (this._iMaxCount))) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
return this._pMemberList[iIndex];

};
PoolGroup.prototype.memberPtr = function(iIndex) {
if (!(((this._pMemberList) != null) && ((this._pNextOpenList) != null))) {
var err=((((((("Error:: " + "Group has not been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Group has not been created");

}


}

;
if (!(iIndex < (this._iMaxCount))) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
return this._pMemberList[iIndex];

};
function DataPoolInterface(pEngine, fnTemplate) {
if (!(fnTemplate != undefined)) {
var err=((((((("Error:: " + "Type data not defined") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Type data not defined");

}


}

;
this._pEngine = pEngine;
this._fnTemplate = fnTemplate;
this._iInitialized = false;

}

DataPoolInterface.prototype.initialize = function(iGrowSize) {

};
DataPoolInterface.prototype.initialize = null;
DataPoolInterface.prototype.destroy = function() {

};
DataPoolInterface.prototype.destroy = null;
DataPoolInterface.prototype.clear = function() {

};
DataPoolInterface.prototype.clear = null;
DataPoolInterface.prototype.nextHandle = function() {

};
DataPoolInterface.prototype.nextHandle = null;
DataPoolInterface.prototype.release = function(iHandle) {

};
DataPoolInterface.prototype.release = null;
DataPoolInterface.prototype.forEach = function(fFunction) {

};
DataPoolInterface.prototype.forEach = null;
DataPoolInterface.prototype.getGenericPtr = function(iHandle) {

};
DataPoolInterface.prototype.getGenericPtr = null;
DataPoolInterface.prototype.isInitialized = function() {
return this._iInitialized;

};
a.DataPoolInterface = DataPoolInterface;
function DataPool(pEngine, fnTemplate) {
this._pGroupList = new Array();
this._iTotalMembers = 0;
this._iTotalOpen = 0;
this._iGroupCount;
this._iIndexMask;
this._iIndexShift;
DataPool.superclass.constructor.apply(this, arguments);

}

a.extend(DataPool, a.DataPoolInterface);
DataPool.prototype.initialize = function(iGrowSize) {
if (!((this.isInitialized()) == false)) {
var err=((((((("Error:: " + "the cDataPool is already initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is already initialized");

}


}

;
this._iInitialized = true;
this._iGroupCount = Math.nearestPowerOfTwo(iGrowSize);
this._iIndexShift = Math.lowestBitSet(this._iGroupCount);
this._iIndexShift = Math.max(1, Math.min(this._iIndexShift, 15));
this._iGroupCount = 1 << (this._iIndexShift);
this._iIndexMask = (this._iGroupCount) - 1;

};
DataPool.prototype.destroy = function() {
this.clear();
this._iInitialized = false;

};
DataPool.prototype._getGroupNumber = function(iHandle) {
return iHandle >> (this._iIndexShift);

};
DataPool.prototype._getItemIndex = function(iHandle) {
return iHandle & (this._iIndexMask);

};
DataPool.prototype._buildHandle = function(iGroup, iIndex) {
return (iGroup << (this._iIndexShift)) + iIndex;

};
DataPool.prototype.forEach = function(fFunction) {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
var iGroupNumber=0;
for (GroupIter = 0; GroupIter < (this._pGroupList.length); GroupIter++) {
var nCallbackCount=this._pGroupList[GroupIter].totalUsed();
var iItemIndex=0;
while ((nCallbackCount != 0) && (iItemIndex < (this._iGroupCount))) {
if ((this._pGroupList[GroupIter].isOpen(iItemIndex)) == false) {
fFunction(this, this._buildHandle(iGroupNumber, iItemIndex), this._pGroupList[GroupIter].member(iItemIndex));
nCallbackCount--;

}

++iItemIndex;

}
++iGroupNumber;

}


};
DataPool.prototype.clear = function() {
for (var GroupIter in this._pGroupList) {
this._pGroupList[GroupIter].destroy();

}

this._pGroupList.splice(0);

};
DataPool.prototype._addGroup = function() {
var pNewGroup=new PoolGroup(this._pEngine, this._fnTemplate, this._iGroupCount);
this._pGroupList.push(pNewGroup);
pNewGroup.create();
this._iTotalMembers += this._iGroupCount;
this._iTotalOpen += this._iGroupCount;
return pNewGroup;

};
DataPool.prototype._findOpenGroup = function(pGroupNumber) {
pGroupNumber.value = 0;
for (GroupIter = 0; GroupIter < (this._pGroupList.length); GroupIter++) {
if ((this._pGroupList[GroupIter].totalOpen()) > 0) {
return this._pGroupList[GroupIter];

}

pGroupNumber.value++;

}

if (!(((this._pGroupList.length) + 1) < 65535)) {
var err=((((((("Error:: " + "the cDataPool is full!!!!") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is full!!!!");

}


}

;
return this._addGroup();

};
DataPool.prototype._getGroup = function(iIndex) {
if (!(iIndex < (this._pGroupList.length))) {
var err=((((((("Error:: " + "Invalid group index requested") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Invalid group index requested");

}


}

;
return this._pGroupList[iIndex];

};
DataPool.prototype.add = function(pMembers) {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
var iGroupNumber= {};
iGroupNumber.value = 0;
var pOpenGroup=this._findOpenGroup(iGroupNumber);
var iIndex=pOpenGroup.addMember(pMembers);
this._iTotalOpen--;
return this._buildHandle(iGroupNumber.value, iIndex);

};
DataPool.prototype.nextHandle = function() {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
var iGroupNumber= {};
iGroupNumber.value = 0;
var pOpenGroup=this._findOpenGroup(iGroupNumber);
var iIndex=pOpenGroup.nextMember();
this._iTotalOpen--;
return this._buildHandle(iGroupNumber.value, iIndex);

};
DataPool.prototype.release = function(iHandle) {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
if ((this.isHandleValid(iHandle)) == true) {
if (!((this._pGroupList.length) != 0)) {
var err=((((((("Error:: " + "The cDataPool has not been properly created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The cDataPool has not been properly created");

}


}

;
var iGroupIndex=this._getGroupNumber(iHandle);
var iItemIndex=this._getItemIndex(iHandle);
pGroup = this._getGroup(iGroupIndex);
pGroup.release(iItemIndex);
pGroupBack = this._pGroupList[(this._pGroupList.length) - 1];
if ((pGroupBack.totalOpen()) == (this._iGroupCount)) {
pGroupBack.destroy();
this._pGroupList.splice((this._pGroupList.length) - 1, 1);

}

this._iTotalOpen++;

}


};
DataPool.prototype.isHandleValid = function(iHandle) {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
if ((iHandle != 65535) == true) {
if (!((this._pGroupList.length) != 0)) {
var err=((((((("Error:: " + "The cDataPool has not been properly created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The cDataPool has not been properly created");

}


}

;
var pGroup=this._getGroup(this._getGroupNumber(iHandle));
return !(pGroup.isOpen(this._getItemIndex(iHandle)));

}

return false;

};
DataPool.prototype.get = function(iHandle) {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
if (!((this._pGroupList.length) != 0)) {
var err=((((((("Error:: " + "The cDataPool has not been properly created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The cDataPool has not been properly created");

}


}

;
var pGroup=this._getGroup(this._getGroupNumber(iHandle));
var iItemIndex=this._getItemIndex(iHandle);
return pGroup.member(iItemIndex);

};
DataPool.prototype.getPtr = function(iHandle) {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
if (!((this._pGroupList.length) != 0)) {
var err=((((((("Error:: " + "The cDataPool has not been properly created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The cDataPool has not been properly created");

}


}

;
var pGroup=this._getGroup(this._getGroupNumber(iHandle));
var iItemIndex=this._getItemIndex(iHandle);
return pGroup.memberPtr(iItemIndex);

};
DataPool.prototype.getGenericPtr = function(iHandle) {
if (!((this.isInitialized()) == true)) {
var err=((((((("Error:: " + "the cDataPool is not initialized") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the cDataPool is not initialized");

}


}

;
return this.getPtr(iHandle);

};
a.DataPool = DataPool;
function ResourceCode() {
switch(arguments.length) {
case 0:
this.iValue = 4294967295;
break ;

case 1:
if ((arguments[0]) instanceof ResourceCode) {
this.iValue = arguments[0].iValue;

}
else  {
this.iValue = arguments[0];

}

break ;

case 2:
this.iFamily = arguments[0];
this.iType = arguments[1];
break ;
}

}

a.defineProperty(ResourceCode, "iFamily", function() {
return (this.iValue) >> 16;

}
, function(iNewFamily) {
this.iValue &= 65535;
this.iValue |= iNewFamily << 16;

}
);
a.defineProperty(ResourceCode, "iType", function() {
return (this.iValue) & 65535;

}
, function(iNewType) {
this.iValue &= 4294901760;
this.iValue |= iNewType & 65535;

}
);
ResourceCode.prototype.setInvalid = function() {
this.iValue = 4294967295;

};
ResourceCode.prototype.less = function(pSrc) {
return (this.iValue) < (pSrc.iValue);

};
ResourceCode.prototype.eq = function(pSrc) {
this.iValue = pSrc.iValue;
return this;

};
ResourceCode.prototype.valueOf = function() {
return this.iValue;

};
a.ResourceCode = ResourceCode;
function ResourcePoolItem(pEngine) {
;
if (!pEngine) {
var err=((((((("Error:: " + "Engine не передан") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Engine не передан");

}


}

;
this._pResourceCode = new a.ResourceCode(0);
this._pResourcePool = null;
this._iResourceHandle = 0;
this._iResourceFlags = 0;
this._pEngine = pEngine;
this._pCallbackFunctions = [];
this._fnStateWatcher = [];
this._pCallbackSlots = null;
this._pCallbackSlots = [];
for (var _i=0; _i < 4; ++_i) {
this._pCallbackSlots[_i] = (null? new null() : null);

}

;
ResourcePoolItem.superclass.constructor.apply(this, arguments);

}

a.extend(ResourcePoolItem, a.ReferenceCounter);
ResourcePoolItem.prototype.getDevice = function() {
return this._pEngine.pDevice;

};
ResourcePoolItem.prototype.getEngine = function() {
return this._pEngine;

};
ResourcePoolItem.prototype.createResource = function() {

};
ResourcePoolItem.prototype.destroyResource = function() {

};
ResourcePoolItem.prototype.disableResource = function() {

};
ResourcePoolItem.prototype.restoreResource = function() {

};
ResourcePoolItem.prototype.loadResource = function(sFileName) {
sFileName = sFileName || "";

};
ResourcePoolItem.prototype.saveResource = function(sFileName) {
sFileName = sFileName || "";

};
ResourcePoolItem.prototype._setResourceCode = function(pCode) {
this._pResourceCode.eq(pCode);

};
ResourcePoolItem.prototype._setResourcePool = function(pPool) {
this._pResourcePool = pPool;

};
ResourcePoolItem.prototype._setResourceHandle = function(iHandle) {
this._iResourceHandle = iHandle;

};
ResourcePoolItem.prototype.setChangesNotifyRoutine = function(fn) {
if (!((typeof fn) == "function")) {
var err=((((((("Error:: " + "Передана не функция") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передана не функция");

}


}

;
for (var i=0; i < (this._pCallbackFunctions.length); i++) {
if ((this._pCallbackFunctions[i]) == fn) {
return ;

}


}

this._pCallbackFunctions.push(fn);

};
ResourcePoolItem.prototype.delChangesNotifyRoutine = function(fn) {
if (!((typeof fn) == "function")) {
var err=((((((("Error:: " + "Передана не функция") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Передана не функция");

}


}

;
for (var i=0; i < (this._pCallbackFunctions.length); i++) {
if ((this._pCallbackFunctions[i]) == fn) {
this._pCallbackFunctions.splice(i - 1, 1);

}


}


};
ResourcePoolItem.parseEvent = function(pEvent) {
if ((typeof pEvent) == "number") {
return pEvent;

}

switch(pEvent.toLowerCase()) {
case "loaded":
return 1;

case "created":
return 0;

case "disabled":
return 2;

case "altered":
return 3;

default:
if (!0) {
var err=((((((("Error:: " + "Использовано неизвестное событие для ресурса.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Использовано неизвестное событие для ресурса.");

}


}

;
}
return 0;

};
ResourcePoolItem.prototype.setStateWatcher = function(eState, fnWatcher) {
this._fnStateWatcher[eState] = fnWatcher;

};
ResourcePoolItem.prototype._notifyStateChange = function(eSlot, pTarget) {
if (!(this._fnStateWatcher[eSlot])) {
return ;

}

var pSignSlots=this._pCallbackSlots[eSlot];
var nTotal=pSignSlots.length, nLoaded=0;
for (var i=0; i < nTotal; ++i) {
if (pSignSlots[i].bState) {
++nLoaded;

}


}

this._fnStateWatcher[eSlot](nLoaded, nTotal, pTarget);

};
ResourcePoolItem.prototype.disconnect = function(pResourceItem, eSignal, eSlot) {
eSlot = (eSlot === undefined? eSignal : eSlot);
eSlot = ResourcePoolItem.parseEvent(eSlot);
eSignal = ResourcePoolItem.parseEvent(eSignal);
if (!((0 <= eSlot) && (eSlot < (4)))) {
var err=((((((("Error:: " + (("Invalid slot used(" + eSlot) + ").")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Invalid slot used(" + eSlot) + ")."));

}


}

;
var pSlots=this._pCallbackSlots, pSignSlots;
var me=this;
var isRem=false;
pSignSlots = pSlots[eSlot];
for (var i=0, n=pSignSlots.length; i < n; ++i) {
if ((pSignSlots[i].pResourceItem) === pResourceItem) {
pSignSlots[i].pResourceItem.delChangesNotifyRoutine(pSignSlots[i].fn);
pSignSlots.splice(i, 1);
--n;
--i;
isRem = true;

}


}

return isRem;

};
ResourcePoolItem.prototype.connect = function(pResourceItem, eSignal, eSlot) {
eSlot = (eSlot === undefined? eSignal : eSlot);
eSlot = ResourcePoolItem.parseEvent(eSlot);
eSignal = ResourcePoolItem.parseEvent(eSignal);
if (!((0 <= eSlot) && (eSlot < (4)))) {
var err=((((((("Error:: " + (("Invalid slot used(" + eSlot) + ").")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Invalid slot used(" + eSlot) + ")."));

}


}

;
var pSlots=this._pCallbackSlots, pSignSlots;
var me=this, n, fn, bState;
if ((pSlots[eSlot]) === null) {
pSlots[eSlot] = [];

}

pSignSlots = pSlots[eSlot];
n = pSignSlots.length;
bState = (pResourceItem._iResourceFlags & (1 << eSignal)) != 0;
fn = function(eFlag, iResourceFlags, isSet) {
if (eFlag == eSignal) {
pSignSlots[n].bState = isSet;
me._notifyStateChange(eSlot, this);
for (var i=0; i < (pSignSlots.length); ++i) {
if ((pSignSlots[i].bState) === false) {
if ((me._iResourceFlags & (1 << eFlag)) != 0) {
me._setResourceFlag(eFlag, false);

}

return ;

}


}

me._setResourceFlag(eFlag, true);

}


};
pSignSlots.push( {bState: bState, fn: fn, pResourceItem: pResourceItem});
fn.call(pResourceItem, eSignal, pResourceItem._iResourceFlags, bState);
pResourceItem.setChangesNotifyRoutine(fn);
return true;

};
ResourcePoolItem.prototype._setResourceFlag = function(iFlagBit, isSetting) {
var iTempFlags=this._iResourceFlags;
(isSetting? this._iResourceFlags |= 1 << iFlagBit : this._iResourceFlags &= ~(1 << iFlagBit));
if (iTempFlags != (this._iResourceFlags)) {
for (var i=0; i < (this._pCallbackFunctions.length); i++) {
this._pCallbackFunctions[i].call(this, iFlagBit, this._iResourceFlags, isSetting);

}


}


};
ResourcePoolItem.prototype.notifyCreated = function() {
this._setResourceFlag(0, true);

};
ResourcePoolItem.prototype.notifyDestroyed = function() {
this._setResourceFlag(0, false);

};
ResourcePoolItem.prototype.notifyLoaded = function() {
this.setAlteredFlag(false);
this._setResourceFlag(1, true);

};
ResourcePoolItem.prototype.notifyUnloaded = function() {
this._setResourceFlag(1, false);

};
ResourcePoolItem.prototype.notifyRestored = function() {
this._setResourceFlag(2, false);

};
ResourcePoolItem.prototype.notifyDisabled = function() {
this._setResourceFlag(2, true);

};
ResourcePoolItem.prototype.notifySaved = function() {
this.setAlteredFlag(false);

};
ResourcePoolItem.prototype.resourceCode = function() {
return this._pResourceCode;

};
ResourcePoolItem.prototype.resourcePool = function() {
return this._pResourcePool;

};
ResourcePoolItem.prototype.resourceHandle = function() {
return this._iResourceHandle;

};
ResourcePoolItem.prototype.resourceFlags = function() {
return this._iResourceFlags;

};
ResourcePoolItem.prototype.isResourceCreated = function() {
return (this._iResourceFlags & (1 << 0)) != 0;

};
ResourcePoolItem.prototype.isResourceLoaded = function() {
return (this._iResourceFlags & (1 << 1)) != 0;

};
ResourcePoolItem.prototype.isResourceDisabled = function() {
return (this._iResourceFlags & (1 << 2)) != 0;

};
ResourcePoolItem.prototype.setAlteredFlag = function(isOn) {
this._setResourceFlag(3, isOn);

};
ResourcePoolItem.prototype.alteredFlag = function() {
return (this._iResourceFlags & (1 << 3)) != 0;

};
ResourcePoolItem.prototype.setResourceName = function(sName) {
if ((this._pResourcePool) != null) {
this._pResourcePool.setResourceName(this._iResourceHandle, sName);

}


};
ResourcePoolItem.prototype.findResourceName = function() {
if ((this._pResourcePool) != null) {
return this._pResourcePool.findResourceName(this._iResourceHandle);

}

return null;

};
ResourcePoolItem.prototype.release = function() {
var iRefCount=ResourcePoolItem.superclass.release.apply(this, arguments);
if (iRefCount == 0) {
if ((this._pResourcePool) != null) {
this._pResourcePool.destroyResource(this);

}


}

return iRefCount;

};
a.ResourcePoolItem = ResourcePoolItem;
function ResourcePoolManager() {
this._pResourceFamilyList = new Array(3);
for (var i=0; i < (3); i++) {
this._pResourceFamilyList[i] = new Array();
this._pResourceFamilyList[i].splice(0);

}

this._pResourceTypeMap = new Array();
this._pResourceTypeMap.splice(0);
this.pTypedResourseTotal = [10, 0, 0];
this._pWaiterResource = new ResourcePoolItem( {});
if (!((ResourcePoolManager.prototype._isSingleton) == true)) {
var err=((((((("Error:: " + "This class is singleton") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("This class is singleton");

}


}

;
ResourcePoolManager.prototype._isSingleton = false;

}

ResourcePoolManager.prototype._isSingleton = true;
ResourcePoolManager.prototype.registerResourcePool = function(pCode, pInterface) {
if (!(pInterface != null)) {
var err=((((((("Error:: " + "invalid cResourcePoolInterface pointer") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid cResourcePoolInterface pointer");

}


}

;
if (!((pCode.iFamily) >= 0)) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
if (!((pCode.iFamily) < (3))) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
if (!((this._pResourceTypeMap[pCode.valueOf()]) == undefined)) {
var err=((((((("Error:: " + "Resource type code already registered") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Resource type code already registered");

}


}

;
this._pResourceTypeMap[pCode.valueOf()] = pInterface;
this._pResourceFamilyList[pCode.iFamily].push(pInterface);

};
ResourcePoolManager.prototype.unregisterResourcePool = function(pCode) {
if (!((pCode.iFamily) >= 0)) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
if (!((pCode.iFamily) < (3))) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
var pInterface=null;
if ((this._pResourceTypeMap[pCode.valueOf()]) != undefined) {
pInterface = this._pResourceTypeMap[pCode.valueOf()];
delete (this._pResourceTypeMap[pCode.valueOf()]);

}

if (pInterface != null) {
for (var pIter in this._pResourceFamilyList[pCode.iFamily]) {
if ((this._pResourceFamilyList[pCode.iFamily][pIter]) == pInterface) {
delete (this._pResourceFamilyList[pCode.iFamily][pIter]);
return pInterface;

}


}


}

return pInterface;

};
ResourcePoolManager.prototype.destroyAll = function() {
for (var i=0; i < (3); i++) {
this.destroyResourceFamily(i);

}


};
ResourcePoolManager.prototype.restoreAll = function() {
for (var i=0; i < (3); i++) {
this.restoreResourceFamily(i);

}


};
ResourcePoolManager.prototype.disableAll = function() {
for (var i=0; i < (3); i++) {
this.disableResourceFamily(i);

}


};
ResourcePoolManager.prototype.clean = function() {
for (var i=0; i < (3); i++) {
this.cleanResourceFamily(i);

}


};
ResourcePoolManager.prototype.destroyResourceFamily = function(iFamily) {
if (!(iFamily >= 0)) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
if (!(iFamily < (3))) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
for (var iIter in this._pResourceFamilyList[iFamily]) {
this._pResourceFamilyList[iFamily][iIter].destroyAll();

}


};
ResourcePoolManager.prototype.restoreResourceFamily = function(iFamily) {
if (!(iFamily >= 0)) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
if (!(iFamily < (3))) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
for (var iIter in this._pResourceFamilyList[iFamily]) {
this._pResourceFamilyList[iFamily][iIter].restoreAll();

}


};
ResourcePoolManager.prototype.disableResourceFamily = function(iFamily) {
if (!(iFamily >= 0)) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
if (!(iFamily < (3))) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
for (var iIter in this._pResourceFamilyList[iFamily]) {
this._pResourceFamilyList[iFamily][iIter].disableAll();

}


};
ResourcePoolManager.prototype.cleanResourceFamily = function(iFamily) {
if (!(iFamily >= 0)) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
if (!(iFamily < (3))) {
var err=((((((("Error:: " + "invalid family index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid family index");

}


}

;
for (var iIter in this._pResourceFamilyList[iFamily]) {
this._pResourceFamilyList[iFamily][iIter].clean();

}


};
ResourcePoolManager.prototype.destroyResourceType = function(pCode) {
if ((this._pResourceTypeMap[pCode.valueOf()]) != undefined) {
this._pResourceTypeMap[pCode.valueOf()].destroyAll();

}


};
ResourcePoolManager.prototype.destroyResourceType = function(pCode) {
if ((this._pResourceTypeMap[pCode.valueOf()]) != undefined) {
this._pResourceTypeMap[pCode.valueOf()].restoreAll();

}


};
ResourcePoolManager.prototype.disableResourceType = function(pCode) {
if ((this._pResourceTypeMap[pCode.valueOf()]) != undefined) {
this._pResourceTypeMap[pCode.valueOf()].disableAll();

}


};
ResourcePoolManager.prototype.cleanResourceType = function(pCode) {
if ((this._pResourceTypeMap[pCode.valueOf()]) != undefined) {
this._pResourceTypeMap[pCode.valueOf()].clean();

}


};
ResourcePoolManager.prototype.findResourcePool = function(pCode) {
if ((this._pResourceTypeMap[pCode.valueOf()]) != undefined) {
return this._pResourceTypeMap[pCode.valueOf()];

}
else  {
return null;

}


};
ResourcePoolManager.prototype.findResourceHandle = function(pCode, sName) {
var pPool=this.findResourcePool(pCode);
var iHandle;
iHandle = 65535;
if (pPool != null) {
iHandle = pPool.findResourceHandle(sName);

}

return iHandle;

};
ResourcePoolManager.prototype.findResource = function(pCode, sName) {
if ((typeof (arguments[1])) == "string") {
var pPool=this.findResourcePool(pCode);
var pResult=null;
var iHandle;
if (pPool != null) {
iHandle = pPool.findResourceHandle(sName);
if (iHandle != 65535) {
pResult = pPool.getResource(iHandle);

}


}

return pResult;

}
else if ((typeof (arguments[1])) == "number") {
var pPool=this.findResourcePool(pCode);
var pResult=null;
if (pPool != null) {
if (sName != 65535) {
pResult = pPool.getResource(sName);

}


}


}
else  {
if (!(1 == 0)) {
var err=((((((("Error:: " + "invalid type 2 parameter") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid type 2 parameter");

}


}

;
return null;

}



};
ResourcePoolManager.prototype.monitorInitResources = function(fnMonitor) {
var me=this;
this._pWaiterResource.setStateWatcher(1, function() {
fnMonitor.apply(me, arguments);

}
);

};
ResourcePoolManager.prototype.setLoadedAllRoutine = function(fnCallback) {
var pPool;
var pResource;
var iHandleResource;
var pWaiterResouse=this._pWaiterResource;
var fnResCallback=function(iFlagBit, iResourceFlags, isSetting) {
if ((iFlagBit == (1)) && (isSetting == true)) {
fnCallback();

}


};
pWaiterResouse.notifyLoaded();
for (var n=0; n < (3); n++) {
for (var i=0; i < (this.pTypedResourseTotal[n]); i++) {
pPool = this.findResourcePool(new a.ResourceCode(n, i));
if (pPool) {
for (var iHandleResource in pPool._pNameMap) {
pResource = pPool.getResource(iHandleResource);
pWaiterResouse.connect(pResource, 1);

}


}


}


}

(pWaiterResouse.isResourceLoaded()? fnCallback() : pWaiterResouse.setChangesNotifyRoutine(fnResCallback));

};
a.ResourcePoolManager = ResourcePoolManager;
function ResourcePoolInterface(pEngine, fnTemplate) {
if (!(fnTemplate != undefined)) {
var err=((((((("Error:: " + "Type data not defined") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Type data not defined");

}


}

;
this._pEngine = pEngine;
this._fnTemplate = fnTemplate;
this.sExt;
this._pRegistrationCode = new a.ResourceCode(4294967295);
this._pNameMap = new Array();
this._pNameMap.splice(0);

}

;
ResourcePoolInterface.prototype.initialize = function(iGrowSize) {

};
ResourcePoolInterface.prototype.destroy = function() {

};
ResourcePoolInterface.prototype.isInitialized = function() {

};
ResourcePoolInterface.prototype.destroyAll = function() {

};
ResourcePoolInterface.prototype.disableAll = function() {

};
ResourcePoolInterface.prototype.restoreAll = function() {

};
ResourcePoolInterface.prototype.clean = function() {

};
ResourcePoolInterface.prototype._internalCreateResource = function(sResourceName) {

};
ResourcePoolInterface.prototype._internalDestroyResource = function(iHandle) {

};
ResourcePoolInterface.prototype._internalGetResource = function(iHandle) {

};
Object.defineProperty(ResourcePoolInterface.prototype, "iFourcc",  {set: function(iNewFourcc) {
this.sExt = String.fromCharCode(iNewFourcc & 255, (iNewFourcc & 65280) >>> 8, (iNewFourcc & 16711680) >>> 16, (iNewFourcc & 4278190080) >>> 24);

}
, get: function() {
return ((((this.sExt.charCodeAt(3)) << 24) | ((this.sExt.charCodeAt(2)) << 16)) | ((this.sExt.charCodeAt(1)) << 8)) | (this.sExt.charCodeAt(0));

}
});
ResourcePoolInterface.prototype.registerResourcePool = function(pCode) {
this._pRegistrationCode.eq(pCode);
this._pEngine.pResourceManager.registerResourcePool(this._pRegistrationCode, this);

};
ResourcePoolInterface.prototype.unregisterResourcePool = function(pCode) {
this._pEngine.pResourceManager.unregisterResourcePool(this._pRegistrationCode);
this._pRegistrationCode.setInvalid();

};
ResourcePoolInterface.prototype.findResourceHandle = function(sName) {
var iNewHandle=0;
iNewHandle = 65535;
for (var iHandle in this._pNameMap) {
if ((this._pNameMap[iHandle]) == sName) {
return iHandle;

}


}

return iNewHandle;

};
ResourcePoolInterface.prototype.findResourceName = function(iHandle) {
return this._pNameMap[iHandle];

};
ResourcePoolInterface.prototype.setResourceName = function(iHandle, sName) {
this._pNameMap[iHandle] = sName;

};
ResourcePoolInterface.prototype.createResource = function(sResourceName) {
var iHandle=this._internalCreateResource(sResourceName);
if (iHandle != 65535) {
var pResource=this.getResource(iHandle);
pResource._setResourcePool(this);
pResource._setResourceHandle(iHandle);
pResource._setResourceCode(this._pRegistrationCode);
return pResource;

}

return null;

};
ResourcePoolInterface.prototype.loadResource = function(sResourceName) {
var pResource=this.findResource(sResourceName);
if (pResource == null) {
pResource = this.createResource(sResourceName);
if (pResource != null) {
if (pResource.loadResource()) {
return pResource;

}

pResource.release();
pResource = null;

}


}

return pResource;

};
ResourcePoolInterface.prototype.saveResource = function(pResource) {
if (pResource != null) {
return pResource.saveResource(0);

}

return false;

};
ResourcePoolInterface.prototype.findResource = function(sName) {
for (var iHandle in this._pNameMap) {
if ((this._pNameMap[iHandle]) == sName) {
if (iHandle != 65535) {
var pResource=this.getResource(iHandle);
return pResource;

}


}


}

return null;

};
ResourcePoolInterface.prototype.getResource = function(iHandle) {
var pResource=this._internalGetResource(iHandle);
if (pResource != null) {
pResource.addRef();

}

return pResource;

};
ResourcePoolInterface.prototype.destroyResource = function(pResource) {
if (pResource != null) {
var iReferenceCount=pResource.referenceCount();
if (!(iReferenceCount == 0)) {
var err=((((((("Error:: " + "destruction of non-zero reference count!") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("destruction of non-zero reference count!");

}


}

;
if (iReferenceCount <= 0) {
var iHandle=pResource.resourceHandle();
this._internalDestroyResource(iHandle);

}


}


};
a.ResourcePoolInterface = ResourcePoolInterface;
function ResourcePool(pEngine, fnTemplate) {
ResourcePool.superclass.constructor.apply(this, arguments);
this._pEngine = pEngine;
this._fnTemplate = fnTemplate;
this._pDataPool = new a.DataPool(this._pEngine, this._fnTemplate);

}

a.extend(ResourcePool, a.ResourcePoolInterface);
ResourcePool.prototype.initialize = function(iGrowSize) {
this._pDataPool.initialize(iGrowSize);

};
ResourcePool.prototype.destroy = function() {
this._pDataPool.destroy();

};
ResourcePool.prototype.isInitialized = function() {
return this._pDataPool.isInitialized();

};
ResourcePool.prototype._internalCreateResource = function(sResourceName) {
var iHandle=this._pDataPool.nextHandle();
for (var iter in this._pNameMap) {
if (!((this._pNameMap[iter]) != sResourceName)) {
var err=((((((("Error:: " + ("A resource with this name already exists: " + sResourceName)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("A resource with this name already exists: " + sResourceName));

}


}

;

}

this._pNameMap[iHandle] = sResourceName;
var pResource=this._pDataPool.getPtr(iHandle);
pResource.createResource();
return iHandle;

};
ResourcePool.prototype._internalDestroyResource = function(iHandle) {
var pResource=this._pDataPool.getPtr(iHandle);
pResource.destroyResource();
delete (this._pNameMap[iHandle]);
this._pDataPool.release(iHandle);

};
ResourcePool.callbackDestroy = function(pPool, iHandle, pResource) {
pResource.destroyResource();

};
ResourcePool.callbackDisable = function(pPool, iHandle, pResource) {
pResource.disableResource();

};
ResourcePool.callbackRestore = function(pPool, iHandle, pResource) {
pResource.restoreResource();

};
ResourcePool.callbackClean = function(pPool, iHandle, pResource) {
if ((pResource.referenceCount()) == 0) {
pPool.release(iHandle);

}


};
ResourcePool.prototype.destroyAll = function() {
this._pDataPool.forEach(ResourcePool.callbackDestroy);

};
ResourcePool.prototype.restoreAll = function() {
this._pDataPool.forEach(ResourcePool.callbackRestore);

};
ResourcePool.prototype.disableAll = function() {
this._pDataPool.forEach(ResourcePool.callbackDisable);

};
ResourcePool.prototype.clean = function() {
this._pDataPool.forEach(ResourcePool.callbackClean);

};
ResourcePool.prototype._internalGetResource = function(iHandle) {
return this._pDataPool.getPtr(iHandle);

};
ResourcePool.prototype.createResource = function(sResourceName) {
return ResourcePool.superclass.createResource.apply(this, arguments);

};
ResourcePool.prototype.loadResource = function(sResourceName) {
return ResourcePool.superclass.loadResource.apply(this, arguments);

};
ResourcePool.prototype.findResource = function(sName) {
return ResourcePool.superclass.findResource.apply(this, arguments);

};
ResourcePool.prototype.getResource = function(iHandle) {
return ResourcePool.superclass.getResource.apply(this, arguments);

};
a.ResourcePool = ResourcePool;
var TEMPSCENEVECTOR3FORCALC0=Vec3.create();
var TEMPSCENEMATRIX4FORCALC0=Mat4.create();
function SceneNode(pEngine) {
;
if (!pEngine) {
var err=((((((("Error:: " + "SceneNode. Engine не передан") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("SceneNode. Engine не передан");

}


}

;
this._pEngine = pEngine;
this._m4fLocalMatrix = Mat4.create();
this._m4fWorldMatrix = Mat4.create();
this._m4fInverseWorldMatrix = Mat4.create();
this._m3fNormalMatrix = Mat3.create();
this._iUpdateFlags = 0;
this._pParent = null;
this._pSibling = null;
this._pChild = null;
this._pSubNodeGroupData = null;
this._pSubNodeGroupOwner = null;
this._iInheritance = 0;
this._v3fWorldPosition = Vec3.create();
this._v3fWorldRight = Vec3.create();
this._v3fWorldUp = Vec3.create();
this._v3fWorldForward = Vec3.create();
SceneNode.superclass.constructor.apply(this);

}

a.extend(SceneNode, a.ReferenceCounter);
SceneNode.prototype.parent = function() {
;
return this._pParent;

};
SceneNode.prototype.sibling = function() {
;
return this._pSibling;

};
SceneNode.prototype.child = function() {
;
return this._pChild;

};
SceneNode.prototype.worldMatrix = function() {
;
return this._m4fWorldMatrix;

};
SceneNode.prototype.normalMatrix = function() {
;
return Mat3.transpose(Mat4.toInverseMat3(this._m4fWorldMatrix, this._m3fNormalMatrix));

};
SceneNode.prototype.localMatrix = function() {
;
return this._m4fLocalMatrix;

};
SceneNode.prototype.inverseWorldMatrix = function() {
;
if ((this._iUpdateFlags & (1 << 3)) != 0) {
Mat4.inverse(this._m4fWorldMatrix, this._m4fInverseWorldMatrix);
this._iUpdateFlags &= ~(1 << 3);

}

return this._m4fInverseWorldMatrix;

};
SceneNode.prototype.updateFlags = function() {
;
return this._iUpdateFlags;

};
SceneNode.prototype.subNodeGroupData = function() {
;
return this._pSubNodeGroupData;

};
SceneNode.prototype.subNodeGroupOwner = function() {
;
return this._pSubNodeGroupOwner;

};
SceneNode.prototype.setSubNodeGroupOwner = function(pOwner) {
;
this._pSubNodeGroupOwner = pOwner;

};
SceneNode.prototype.hasParent = function() {
;
if (this._pParent) {
return true;

}

return false;

};
SceneNode.prototype.hasChild = function() {
;
if (this._pChild) {
return true;

}

return false;

};
SceneNode.prototype.hasSibling = function() {
;
if (this._pSibling) {
return true;

}

return false;

};
SceneNode.prototype.setUpdatedLocalMatrixFlag = function() {
;
this._iUpdateFlags |= 1 << 1;

};
SceneNode.prototype.accessLocalMatrix = function() {
;
this.setUpdatedLocalMatrixFlag();
this._iUpdateFlags |= 1 << 5;
return this._m4fLocalMatrix;

};
SceneNode.prototype.isWorldMatrixNew = function() {
;
return (this._iUpdateFlags & (1 << 2)) != 0;

};
SceneNode.prototype.create = function() {
Mat4.identity(this._m4fLocalMatrix);
Mat4.identity(this._m4fWorldMatrix);
return true;

};
SceneNode.prototype.createFromResource = function(iModelResource) {
this.releaseGroupData();
this._pSubNodeGroupData = new SubNodeGroup();
if (this._pSubNodeGroupData.create(this, iModelResource)) {
return true;

}
else  {
delete (this._pSubNodeGroupData);

}

return false;

};
SceneNode.prototype.releaseGroupData = function() {
if (this._pSubNodeGroupData) {
this._pSubNodeGroupData.destroy();
delete (this._pSubNodeGroupData);

}


};
SceneNode.prototype.destroy = function() {
this.releaseGroupData();
this.promoteChildren();
this.detachFromParent();
if (!((this.referenceCount()) == 0)) {
var err=((((((("Error:: " + "Attempting to delete a scene node which is still in use") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Attempting to delete a scene node which is still in use");

}


}

;
if (!((this._pSibling) == null)) {
var err=((((((("Error:: " + "Failure Destroying Node") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Failure Destroying Node");

}


}

;
if (!((this._pChild) == null)) {
var err=((((((("Error:: " + "Failure Destroying Node") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Failure Destroying Node");

}


}

;
this._pSubNodeGroupOwner = null;

};
SceneNode.prototype.setSibling = function(pNode) {
this._pSibling = pNode;

};
SceneNode.prototype.setChild = function(pNode) {
this._pChild = pNode;

};
SceneNode.prototype.addSibling = function(pSibling) {
if (pSibling) {
pSibling.setSibling(this._pSibling);
this.setSibling(pSibling);

}


};
SceneNode.prototype.addChild = function(pChild) {
if (pChild) {
pChild.setSibling(this._pChild);
this._pChild = pChild;

}


};
SceneNode.prototype.removeChild = function(pChild) {
if ((this._pChild) && pChild) {
if ((this._pChild) == pChild) {
this._pChild = pChild.sibling();
pChild.setSibling(null);

}
else  {
var pTempNode=this._pChild;
while (pTempNode && ((pTempNode.sibling()) != pChild)) {
pTempNode = pTempNode.sibling();

}
if (pTempNode) {
pTempNode.setSibling(pChild.sibling());
pChild.setSibling(null);

}


}


}


};
SceneNode.prototype.removeAllChildren = function() {
while ((this._pChild) != 0) {
var NextSibling=this._pChild.sibling();
this._pChild.detachFromParent();
this._pChild = NextSibling;

}

};
SceneNode.prototype.attachToParent = function(pParent) {
if (pParent != (this._pParent)) {
this.detachFromParent();
if (pParent) {
this._pParent = pParent;
this._pParent.addChild(this);
var invertedParentMatrix=Mat4.inverse(this._pParent._m4fWorldMatrix);
Mat4.multiply(this._m4fLocalMatrix, invertedParentMatrix);

}


}


};
SceneNode.prototype.setInheritance = function(iSetting) {
this._iInheritance = iSetting;

};
SceneNode.prototype.detachFromParent = function() {
if (this._pParent) {
this._pParent.removeChild(this);
if (this._pParent) {
this._pParent.release();

}

this._pParent = null;
this._m4fLocalMatrix = this._m4fWorldMatrix;
this._m4fWorldMatrix = Mat4.create();
Mat4.identity(this._m4fWorldMatrix);

}


};
SceneNode.prototype.promoteChildren = function() {
while ((this._pChild) != null) {
var NextSibling=this._pChild.sibling();
this._pChild.attachToParent(this._pParent);
this._pChild = NextSibling;

}

};
SceneNode.prototype.relocateChildren = function(pParent) {
if (pParent != (this)) {
while ((this._pChild) != 0) {
var NextSibling=this._pChild.sibling();
this._pChild.attachToParent(pParent);
this._pChild = NextSibling;

}

}


};
SceneNode.prototype.isASibling = function(pSibling) {
if (!pSibling) {
return false;

}

if (((this) == pSibling) || ((this._pSibling) == pSibling)) {
return true;

}

if (this._pSibling) {
return this._pSibling.isASibling(pSibling);

}

return false;

};
SceneNode.prototype.isAChild = function(pChild) {
if (!pChild) {
return false;

}

if ((this._pChild) == pChild) {
return true;

}

if (this._pChild) {
return this._pChild.isASibling(pChild);

}

return false;

};
SceneNode.prototype.isInFamily = function(pNode, SearchEntireTree) {
if (!pNode) {
return false;

}

if ((((this) == pNode) || ((this._pChild) == pNode)) || ((this._pSibling) == pNode)) {
return true;

}

if (!SearchEntireTree) {
if (this.isASibling(pNode)) {
return true;

}

if ((this._pChild) && (this._pChild.isASibling(pNode))) {
return true;

}


}
else  {
if ((this._pSibling) && (this._pSibling.isInFamily(pNode, SearchEntireTree))) {
return true;

}

if ((this._pChild) && (this._pChild.isInFamily(pNode, SearchEntireTree))) {
return true;

}


}

return false;

};
SceneNode.prototype.siblingCount = function() {
var count=0;
if (this._pParent) {
var pNextSibling=this._pParent.child();
if (pNextSibling) {
while (pNextSibling) {
pNextSibling = pNextSibling.sibling();
++count;

}

}


}

return count;

};
SceneNode.prototype.childCount = function() {
var count=0;
pNextChild = this.child();
if (pNextChild) {
++count;
while (pNextChild) {
pNextChild = pNextChild.sibling();
++count;

}

}

return count;

};
SceneNode.prototype.update = function() {
this.recalcWorldMatrix();
if (this._pSubNodeGroupData) {
this._pSubNodeGroupData.update();

}

;

};
SceneNode.prototype.prepareForUpdate = function() {
this._iUpdateFlags &= ~((1 << 1) | (1 << 2));

};
SceneNode.prototype.prepareForRender = function() {

};
SceneNode.prototype.recursiveUpdate = function() {
this.update();
if (this._pSibling) {
this._pSibling.recursiveUpdate();

}

if (this._pChild) {
this._pChild.recursiveUpdate();

}

this.prepareForUpdate();

};
SceneNode.prototype.recursiveRender = function() {
this.prepareForRender();
this.render();
if (this.sibling()) {
this.sibling().recursiveRender();

}

if (this.child()) {
this.child().recursiveRender();

}


};
SceneNode.prototype.recalcWorldMatrix = function() {
var isParentMoved=(this._pParent) && (this._pParent.isWorldMatrixNew());
var isWeMoved=(this._iUpdateFlags & (1 << 1)) != 0;
if (isWeMoved || isParentMoved) {
var m4fLocal=this._m4fLocalMatrix;
var m4fWorld=this._m4fWorldMatrix;
var m4fParent=this._pParent.worldMatrix();
if (this._pParent) {
if ((this._iInheritance) === (2)) {
Mat4.multiply(m4fParent, m4fLocal, m4fWorld);

}
else if ((this._iInheritance) === (0)) {
m4fWorld[0] = m4fLocal[0];
m4fWorld[1] = m4fLocal[1];
m4fWorld[2] = m4fLocal[2];
m4fWorld[4] = m4fLocal[4];
m4fWorld[5] = m4fLocal[5];
m4fWorld[6] = m4fLocal[6];
m4fWorld[8] = m4fLocal[8];
m4fWorld[9] = m4fLocal[9];
m4fWorld[10] = m4fLocal[10];
m4fWorld[12] = m4fLocal[12];
m4fWorld[13] = m4fLocal[13];
m4fWorld[14] = m4fLocal[14];
m4fWorld[3] = m4fLocal[3];
m4fWorld[7] = m4fLocal[7];
m4fWorld[11] = m4fLocal[11];
m4fWorld[12] = (m4fParent[12]) + (m4fLocal[12]);
m4fWorld[13] = (m4fParent[13]) + (m4fLocal[13]);
m4fWorld[14] = (m4fParent[14]) + (m4fLocal[14]);
m4fWorld[15] = m4fLocal[15];

}
else if ((this._iInheritance) === (1)) {
var p11=m4fParent[0], p12=m4fParent[4], p13=m4fParent[8];
var p21=m4fParent[1], p22=m4fParent[5], p23=m4fParent[9];
var p31=m4fParent[2], p32=m4fParent[6], p33=m4fParent[10];
var l11=m4fLocal[0], l12=m4fLocal[4], l13=m4fLocal[8];
var l21=m4fLocal[1], l22=m4fLocal[5], l23=m4fLocal[9];
var l31=m4fLocal[2], l32=m4fLocal[6], l33=m4fLocal[10];
m4fWorld[0] = ((p11 * l11) + (p12 * l21)) + (p13 * l31);
m4fWorld[4] = ((p11 * l12) + (p12 * l22)) + (p13 * l32);
m4fWorld[8] = ((p11 * l13) + (p12 * l23)) + (p13 * l33);
m4fWorld[12] = m4fLocal[12];
m4fWorld[1] = ((p21 * l11) + (p22 * l21)) + (p23 * l31);
m4fWorld[5] = ((p21 * l12) + (p22 * l22)) + (p23 * l32);
m4fWorld[9] = ((p21 * l13) + (p22 * l23)) + (p23 * l33);
m4fWorld[13] = m4fLocal[13];
m4fWorld[2] = ((p31 * l11) + (p32 * l21)) + (p33 * l31);
m4fWorld[6] = ((p31 * l12) + (p32 * l22)) + (p33 * l32);
m4fWorld[10] = ((p31 * l13) + (p32 * l23)) + (p33 * l33);
m4fWorld[14] = m4fLocal[14];
m4fWorld[3] = m4fLocal[3];
m4fWorld[7] = m4fLocal[7];
m4fWorld[11] = m4fLocal[11];
m4fWorld[15] = m4fLocal[15];

}




}
else  {
this._m4fWorldMatrix[0] = this._m4fLocalMatrix[0];
this._m4fWorldMatrix[1] = this._m4fLocalMatrix[1];
this._m4fWorldMatrix[2] = this._m4fLocalMatrix[2];
this._m4fWorldMatrix[3] = this._m4fLocalMatrix[3];
this._m4fWorldMatrix[4] = this._m4fLocalMatrix[4];
this._m4fWorldMatrix[5] = this._m4fLocalMatrix[5];
this._m4fWorldMatrix[6] = this._m4fLocalMatrix[6];
this._m4fWorldMatrix[7] = this._m4fLocalMatrix[7];
this._m4fWorldMatrix[8] = this._m4fLocalMatrix[8];
this._m4fWorldMatrix[9] = this._m4fLocalMatrix[9];
this._m4fWorldMatrix[10] = this._m4fLocalMatrix[10];
this._m4fWorldMatrix[11] = this._m4fLocalMatrix[11];
this._m4fWorldMatrix[12] = this._m4fLocalMatrix[12];
this._m4fWorldMatrix[13] = this._m4fLocalMatrix[13];
this._m4fWorldMatrix[14] = this._m4fLocalMatrix[14];
this._m4fWorldMatrix[15] = this._m4fLocalMatrix[15];

}

if (true) {
this._iUpdateFlags |= 1 << 2;

}
else  {
this._iUpdateFlags &= ~(1 << 2);

}

;
if (true) {
this._iUpdateFlags |= 1 << 3;

}
else  {
this._iUpdateFlags &= ~(1 << 3);

}

;
if (true) {
this._iUpdateFlags |= 1 << 4;

}
else  {
this._iUpdateFlags &= ~(1 << 4);

}

;

}


};
SceneNode.prototype.createSubNode = function() {
switch(arguments.length) {
case 2:
var node=new a.SceneModel();
node.create();
node.setModelResource(pModelResource, frameIndex);
node._pSubNodeGroupOwner = this;
return node;

default:
var node=new cSceneNode();
node.create();
node._pSubNodeGroupOwner = this;
return node;
}

};
SceneNode.prototype.destroySubNode = function(pSubNode) {
pSubNode.destroy();
pSubNode._pSubNodeGroupOwner = null;
delete pSubNode;
pSubNode = null;

};
SceneNode.prototype.updateWorldVectors = function() {
if ((this._iUpdateFlags & (1 << 4)) != 0) {
var fX, fY, fZ, fW;
fX = this._m4fWorldMatrix[0];
fY = this._m4fWorldMatrix[1];
fZ = this._m4fWorldMatrix[2];
fW = this._m4fWorldMatrix[3];
if (fW != 0) {
fX /= fW;
fY /= fW;
fZ /= fW;

}

this._v3fWorldRight[0] = fX;
this._v3fWorldRight[1] = fY;
this._v3fWorldRight[2] = fZ;
Vec3.normalize(this._v3fWorldRight);
fX = this._m4fWorldMatrix[4];
fY = this._m4fWorldMatrix[5];
fZ = this._m4fWorldMatrix[6];
fW = this._m4fWorldMatrix[7];
if (fW != 0) {
fX /= fW;
fY /= fW;
fZ /= fW;

}

this._v3fWorldUp[0] = fX;
this._v3fWorldUp[1] = fY;
this._v3fWorldUp[2] = fZ;
Vec3.normalize(this._v3fWorldUp);
fX = this._m4fWorldMatrix[8];
fY = this._m4fWorldMatrix[9];
fZ = this._m4fWorldMatrix[10];
fW = this._m4fWorldMatrix[11];
if (fW != 0) {
fX /= fW;
fY /= fW;
fZ /= fW;

}

this._v3fWorldForward[0] = fX;
this._v3fWorldForward[1] = fY;
this._v3fWorldForward[2] = fZ;
Vec3.normalize(this._v3fWorldForward);
fX = this._m4fWorldMatrix[12];
fY = this._m4fWorldMatrix[13];
fZ = this._m4fWorldMatrix[14];
fW = this._m4fWorldMatrix[15];
if (fW != 0) {
fX /= fW;
fY /= fW;
fZ /= fW;

}

this._v3fWorldPosition[0] = fX;
this._v3fWorldPosition[1] = fY;
this._v3fWorldPosition[2] = fZ;
this._iUpdateFlags &= ~(1 << 4);

}


};
SceneNode.prototype.worldPosition = function() {
this.updateWorldVectors();
return this._v3fWorldPosition;

};
SceneNode.prototype.worldRight = function() {
this.updateWorldVectors();
return this._v3fWorldRight;

};
SceneNode.prototype.worldUp = function() {
this.updateWorldVectors();
return this._v3fWorldUp;

};
SceneNode.prototype.worldForward = function() {
this.updateWorldVectors();
return this._v3fWorldForward;

};
SceneNode.prototype.getUp = SceneNode.prototype.worldUp;
SceneNode.prototype.getRight = SceneNode.prototype.worldRight;
SceneNode.prototype.getForward = SceneNode.prototype.worldForward;
SceneNode.prototype.getPosition = SceneNode.prototype.worldPosition();
SceneNode.prototype.setPosition = function(pPos) {
var m4fLocal=this._m4fLocalMatrix;
m4fLocal[12] = pPos[0];
m4fLocal[13] = pPos[1];
m4fLocal[14] = pPos[2];
m4fLocal[15] = 1;
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
SceneNode.prototype.setRelPosition = function(pPos) {
var m4fLocal=this._m4fLocalMatrix;
var fX=pPos[0], fY=pPos[1], fZ=pPos[2];
m4fLocal[12] = (((m4fLocal[0]) * fX) + ((m4fLocal[4]) * fY)) + ((m4fLocal[8]) * fZ);
m4fLocal[13] = (((m4fLocal[1]) * fX) + ((m4fLocal[5]) * fY)) + ((m4fLocal[9]) * fZ);
m4fLocal[14] = (((m4fLocal[2]) * fX) + ((m4fLocal[6]) * fY)) + ((m4fLocal[10]) * fZ);
m4fLocal[15] = 1;
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
SceneNode.prototype.addPosition = function(pPos) {
var m4fLocal=this._m4fLocalMatrix;
m4fLocal[12] += pPos[0];
m4fLocal[13] += pPos[1];
m4fLocal[14] += pPos[2];
m4fLocal[15] = 1;
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
SceneNode.prototype.addRelPosition = function(pPos) {
var m4fLocal=this._m4fLocalMatrix;
var fX=pPos[0], fY=pPos[1], fZ=pPos[2];
m4fLocal[12] += (((m4fLocal[0]) * fX) + ((m4fLocal[4]) * fY)) + ((m4fLocal[8]) * fZ);
m4fLocal[13] += (((m4fLocal[1]) * fX) + ((m4fLocal[5]) * fY)) + ((m4fLocal[9]) * fZ);
m4fLocal[14] += (((m4fLocal[2]) * fX) + ((m4fLocal[6]) * fY)) + ((m4fLocal[10]) * fZ);
m4fLocal[15] = 1;
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
SceneNode.prototype.setRotation = function() {
var m4fRot;
var m4fLocal=this._m4fLocalMatrix;
switch(arguments.length) {
case 1:
m4fRot = arguments[0];
m4fLocal[0] = m4fRot[0];
m4fLocal[1] = m4fRot[1];
m4fLocal[2] = m4fRot[2];
m4fLocal[4] = m4fRot[4];
m4fLocal[5] = m4fRot[5];
m4fLocal[6] = m4fRot[6];
m4fLocal[8] = m4fRot[8];
m4fLocal[9] = m4fRot[9];
m4fLocal[10] = m4fRot[10];
break ;

case 2:
var ar1=arguments[0];
var ar2=arguments[1];
if ((typeof ar2) == "number") {
m4fRot = TEMPSCENEMATRIX4FORCALC0;
Mat4.identity(m4fRot);
Mat4.rotate(m4fRot, ar2, ar1);
m4fLocal[0] = m4fRot[0];
m4fLocal[1] = m4fRot[1];
m4fLocal[2] = m4fRot[2];
m4fLocal[4] = m4fRot[4];
m4fLocal[5] = m4fRot[5];
m4fLocal[6] = m4fRot[6];
m4fLocal[8] = m4fRot[8];
m4fLocal[9] = m4fRot[9];
m4fLocal[10] = m4fRot[10];

}
else  {
Vec3.cross(ar2, ar1, TEMPSCENEVECTOR3FORCALC0);
m4fLocal[0] = TEMPSCENEVECTOR3FORCALC0[0];
m4fLocal[1] = TEMPSCENEVECTOR3FORCALC0[1];
m4fLocal[2] = TEMPSCENEVECTOR3FORCALC0[2];
m4fLocal[4] = ar2[0];
m4fLocal[5] = ar2[1];
m4fLocal[6] = ar2[2];
m4fLocal[8] = ar1[0];
m4fLocal[9] = ar1[1];
m4fLocal[10] = ar1[2];

}

break ;

case 3:
var yaw=arguments[0], pitch=arguments[1], roll=arguments[2];
m4fRot = TEMPSCENEMATRIX4FORCALC0;
Mat4.identity(m4fRot);
Mat4.rotateY(m4fRot, yaw);
Mat4.rotateX(m4fRot, pitch);
Mat4.rotateZ(m4fRot, roll);
m4fLocal[0] = m4fRot[0];
m4fLocal[1] = m4fRot[1];
m4fLocal[2] = m4fRot[2];
m4fLocal[4] = m4fRot[4];
m4fLocal[5] = m4fRot[5];
m4fLocal[6] = m4fRot[6];
m4fLocal[8] = m4fRot[8];
m4fLocal[9] = m4fRot[9];
m4fLocal[10] = m4fRot[10];
break ;
}
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
SceneNode.prototype.addRelRotation = function() {
var m4fRot;
var m4fLocal=this._m4fLocalMatrix;
switch(arguments.length) {
case 1:
m4fRot = arguments[0];
break ;

case 2:
Mat4.rotate(m4fLocal, arguments[1], arguments[0]);
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;
return ;

case 3:
var yaw=arguments[0], pitch=arguments[1], roll=arguments[2];
m4fRot = TEMPSCENEMATRIX4FORCALC0;
Mat4.identity(m4fRot);
Mat4.rotateY(m4fRot, yaw);
Mat4.rotateX(m4fRot, pitch);
Mat4.rotateZ(m4fRot, roll);
break ;
}
var a11=m4fLocal[0], a21=m4fLocal[1], a31=m4fLocal[2];
var a12=m4fLocal[4], a22=m4fLocal[5], a32=m4fLocal[6];
var a13=m4fLocal[8], a23=m4fLocal[9], a33=m4fLocal[10];
var b11=m4fRot[0], b21=m4fRot[1], b31=m4fRot[2];
var b12=m4fRot[4], b22=m4fRot[5], b32=m4fRot[6];
var b13=m4fRot[8], b23=m4fRot[9], b33=m4fRot[10];
m4fLocal[0] = ((a11 * b11) + (a12 * b21)) + (a13 * b31);
m4fLocal[1] = ((a21 * b11) + (a22 * b21)) + (a23 * b31);
m4fLocal[2] = ((a31 * b11) + (a32 * b21)) + (a33 * b31);
m4fLocal[4] = ((a11 * b12) + (a12 * b22)) + (a13 * b32);
m4fLocal[5] = ((a21 * b12) + (a22 * b22)) + (a23 * b32);
m4fLocal[6] = ((a31 * b12) + (a32 * b22)) + (a33 * b32);
m4fLocal[8] = ((a11 * b13) + (a12 * b23)) + (a13 * b33);
m4fLocal[9] = ((a21 * b13) + (a22 * b23)) + (a23 * b33);
m4fLocal[10] = ((a31 * b13) + (a32 * b23)) + (a33 * b33);
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
SceneNode.prototype.addRotation = function() {
var m4fRot;
var m4fLocal=this._m4fLocalMatrix;
switch(arguments.length) {
case 1:
m4fRot = arguments[0];
break ;

case 2:
var ar1=arguments[0];
var ar2=arguments[1];
if ((typeof ar2) == "number") {
m4fRot = TEMPSCENEMATRIX4FORCALC0;
Mat4.identity(m4fRot);
Mat4.rotate(m4fRot, ar2, ar1);

}
else  {
m4fRot = TEMPSCENEMATRIX4FORCALC0;
Vec3.cross(ar2, ar1, TEMPSCENEVECTOR3FORCALC0);
m4fRot[0] = TEMPSCENEVECTOR3FORCALC0[0];
m4fRot[1] = TEMPSCENEVECTOR3FORCALC0[1];
m4fRot[2] = TEMPSCENEVECTOR3FORCALC0[2];
m4fRot[4] = ar2[0];
m4fRot[5] = ar2[1];
m4fRot[6] = ar2[2];
m4fRot[8] = ar1[0];
m4fRot[9] = ar1[1];
m4fRot[10] = ar1[2];

}

break ;

case 3:
var yaw=arguments[0], pitch=arguments[1], roll=arguments[2];
m4fRot = TEMPSCENEMATRIX4FORCALC0;
Mat4.identity(m4fRot);
Mat4.rotateY(m4fRot, yaw);
Mat4.rotateX(m4fRot, pitch);
Mat4.rotateZ(m4fRot, roll);
break ;
}
var a11=m4fRot[0], a21=m4fRot[1], a31=m4fRot[2];
var a12=m4fRot[4], a22=m4fRot[5], a32=m4fRot[6];
var a13=m4fRot[8], a23=m4fRot[9], a33=m4fRot[10];
var b11=m4fLocal[0], b21=m4fLocal[1], b31=m4fLocal[2];
var b12=m4fLocal[4], b22=m4fLocal[5], b32=m4fLocal[6];
var b13=m4fLocal[8], b23=m4fLocal[9], b33=m4fLocal[10];
m4fLocal[0] = ((a11 * b11) + (a12 * b21)) + (a13 * b31);
m4fLocal[1] = ((a21 * b11) + (a22 * b21)) + (a23 * b31);
m4fLocal[2] = ((a31 * b11) + (a32 * b21)) + (a33 * b31);
m4fLocal[4] = ((a11 * b12) + (a12 * b22)) + (a13 * b32);
m4fLocal[5] = ((a21 * b12) + (a22 * b22)) + (a23 * b32);
m4fLocal[6] = ((a31 * b12) + (a32 * b22)) + (a33 * b32);
m4fLocal[8] = ((a11 * b13) + (a12 * b23)) + (a13 * b33);
m4fLocal[9] = ((a21 * b13) + (a22 * b23)) + (a23 * b33);
m4fLocal[10] = ((a31 * b13) + (a32 * b23)) + (a33 * b33);
if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
SceneNode.prototype.setScale = function(scale) {
var m4fLocal=this._m4fLocalMatrix;
if ((typeof scale) == "number") {
m4fLocal[0] *= scale;
m4fLocal[5] *= scale;
m4fLocal[10] *= scale;

}
else  {
m4fLocal[0] *= scale[0];
m4fLocal[5] *= scale[1];
m4fLocal[10] *= scale[2];

}

if (true) {
this._iUpdateFlags |= 1 << 1;

}
else  {
this._iUpdateFlags &= ~(1 << 1);

}

;

};
function SubNodeGroup() {
this._pParentNode = null;
this._pModelResource = null;
this._totalSubNodes = 0;
this._ppSubNodePtrList = null;
this._totalNamedSubNodes = 0;
this._ppNamedSubNodePtrList = null;
this._animController = null;

}

;
SubNodeGroup.prototype.modelResource = function() {
;
return this._pModelResource;

};
SubNodeGroup.prototype.totalSubNodes = function() {
;
return this._totalSubNodes;

};
SubNodeGroup.prototype.subNodePtr = function(index) {
;
if (!(index < (this._totalSubNodes))) {
var err=((((((("Error:: " + "invalid subnode index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid subnode index");

}


}

;
return this._ppSubNodePtrList[index];

};
SubNodeGroup.prototype.totalNamedSubNodes = function() {
;
return this._totalNamedSubNodes;

};
SubNodeGroup.prototype.namedSubNodePtr = function(index) {
;
if (!(index < (this._totalNamedSubNodes))) {
var err=((((((("Error:: " + "invalid subnode index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid subnode index");

}


}

;
return this._ppNamedSubNodePtrList[index];

};
SubNodeGroup.prototype.animController = function() {
;
return this._animController;

};
SubNodeGroup.prototype.create = function(pRootNode, iModelResource) {
this.destroy();
this._pParentNode = pRootNode;
this._pModelResource = a.displayManager().modelPool().getResource(ModelResource);
if (this._pModelResource) {
this._totalSubNodes = this._pModelResource.totalFrames();
this._totalNamedSubNodes = 0;
this._ppSubNodePtrList = new Array();
this._ppNamedSubNodePtrList = new Array();
for (var i=0; i < (this._totalSubNodes); ++i) {
var pMeshContainer=this._pModelResource.frame(i).pMeshContainer;
if (pMeshContainer) {
this._ppSubNodePtrList[i] = pRootNode.createSubNode(this._pModelResource, i);

}
else  {
this._ppSubNodePtrList[i] = pRootNode.createSubNode();

}

var parentIndex=this._pModelResource.frame(i).parentIndex;
debug_assert(parentIndex == (a.define.MAXUINT16), parentIndex < (this._pModelResource.frame(i).frameIndex), "invalid model resource");
if (parentIndex == (a.define.MAXUINT16)) {
this._ppSubNodePtrList[i].attachToParent(pRootNode);

}
else  {
this._ppSubNodePtrList[i].attachToParent(this._ppSubNodePtrList[parentIndex]);

}

var pLocalMatrix=this._pSubNodePtrList[i].accessLocalMatrix();
pLocalMatrix[0] = this._pModelResource.frame(i).TransformationMatrix[0];
pLocalMatrix[1] = this._pModelResource.frame(i).TransformationMatrix[1];
pLocalMatrix[2] = this._pModelResource.frame(i).TransformationMatrix[2];
pLocalMatrix[3] = this._pModelResource.frame(i).TransformationMatrix[3];
pLocalMatrix[4] = this._pModelResource.frame(i).TransformationMatrix[4];
pLocalMatrix[5] = this._pModelResource.frame(i).TransformationMatrix[5];
pLocalMatrix[6] = this._pModelResource.frame(i).TransformationMatrix[6];
pLocalMatrix[7] = this._pModelResource.frame(i).TransformationMatrix[7];
pLocalMatrix[8] = this._pModelResource.frame(i).TransformationMatrix[8];
pLocalMatrix[9] = this._pModelResource.frame(i).TransformationMatrix[9];
pLocalMatrix[10] = this._pModelResource.frame(i).TransformationMatrix[10];
pLocalMatrix[11] = this._pModelResource.frame(i).TransformationMatrix[11];
pLocalMatrix[12] = this._pModelResource.frame(i).TransformationMatrix[12];
pLocalMatrix[13] = this._pModelResource.frame(i).TransformationMatrix[13];
pLocalMatrix[14] = this._pModelResource.frame(i).TransformationMatrix[14];
pLocalMatrix[15] = this._pModelResource.frame(i).TransformationMatrix[15];
if (this._pModelResource.frame(i).Name) {
this._ppNamedSubNodePtrList[this._totalNamedSubNodes] = this._ppSubNodePtrList[i];
++this._totalNamedSubNodes;

}


}

this._animController.create(this, iModelResource);
return true;

}

return false;

};
SubNodeGroup.prototype.destroy = function() {
this._animController.destroy();
if (this._ppSubNodePtrList) {
for (var i=0; i < (this._totalSubNodes); ++i) {
this._pParentNode.destroySubNode(this._ppSubNodePtrList[i]);

}


}

;
delete (this._ppSubNodePtrList);
delete (this._ppNamedSubNodePtrList);
this._totalSubNodes = 0;
this._totalNamedSubNodes = 0;
this._pModelResource.release();
this._pModelResource = null;

};
SubNodeGroup.prototype.update = function() {
this._animController.update();

};
SubNodeGroup.prototype.adjustForAnimationStep = function() {
for (var i=0; i < (this._totalNamedSubNodes); ++i) {
this._ppNamedSubNodePtrList[i].setUpdatedLocalMatrixFlag();

}


};
function SceneObject(pEngine) {
SceneObject.superclass.constructor.apply(this, arguments);
this._iObjectFlags = 0;
this._pLocalBounds = new a.Rect3d();
this._pWorldBounds = new a.Rect3d();
this._pOcTree = null;
this._pOcTreeNode = null;
this._pForwardTreeLink = null;
this._pRearTreeLink = null;
this._pForwardSearchLink = null;
this._pRearSearchLink = null;

}

;
a.extend(SceneObject, SceneNode);
SceneObject.prototype.setWorldBounds = function(pBox) {
;
this._pWorldBounds = pBox;

};
SceneObject.prototype.setForwardSearchLink = function(pForwardLink) {
;
this._pForwardSearchLink = pForwardLink;

};
SceneObject.prototype.setRearSearchLink = function(pRearLink) {
;
this._pRearSearchLink = pRearLink;

};
SceneObject.prototype.objectFlags = function() {
;
return this._iObjectFlags;

};
SceneObject.prototype.accessLocalBounds = function() {
;
if (true) {
this._iObjectFlags |= 1 << 0;

}
else  {
this._iObjectFlags &= ~(1 << 0);

}

;
return this._pLocalBounds;

};
SceneObject.prototype.treeNode = function() {
;
return this._pOcTreeNode;

};
SceneObject.prototype.forwardTreeLink = function() {
;
return this._pForwardTreeLink;

};
SceneObject.prototype.rearTreeLink = function() {
;
return this._pRearTreeLink;

};
SceneObject.prototype.setOcTreeData = function(pParentNode) {
;
this._pOcTreeNode = pParentNode;

};
SceneObject.prototype.setForwardTreeLink = function(pLink) {
;
this._pForwardTreeLink = pLink;

};
SceneObject.prototype.setRearTreeLink = function(pLink) {
;
this._pRearTreeLink = pLink;

};
SceneObject.prototype.localBounds = function() {
;
return this._pLocalBounds;

};
SceneObject.prototype.worldBounds = function() {
;
return this._pWorldBounds;

};
SceneObject.prototype.isWorldBoundsNew = function() {
;
return (this._iObjectFlags & (1 << 1)) != 0;

};
SceneObject.prototype.nextSearchLink = function() {
;
return this._pForwardSearchLink;

};
SceneObject.prototype.create = function() {
var result=SceneObject.superclass.create.apply(this, arguments);
if (result) {
this.attachToOcTree(this._pEngine.getSceneTree());

}

return result;

};
SceneObject.prototype.destroy = function() {
this.detachFromOcTree();
SceneObject.superclass.destroy.apply(this, arguments);

};
SceneObject.prototype.prepareForUpdate = function() {
SceneObject.superclass.prepareForUpdate.apply(this, arguments);
this._iObjectFlags &= ~((1 << 0) | (1 << 1));

};
SceneObject.prototype.update = function() {
SceneObject.superclass.update.apply(this, arguments);
this.recalcWorldBounds();
this.refreshOcTreeMembership();

};
SceneObject.prototype.recalcWorldBounds = function() {
if (((this._iObjectFlags & (1 << 0)) != 0) || (this.isWorldMatrixNew())) {
this._pWorldBounds.set(this._pLocalBounds);
if (this._pOcTree) {
this._pWorldBounds.fX1 = Math.max(this._pWorldBounds.fX1, (this._pWorldBounds.fX0) + 0.01);
this._pWorldBounds.fY1 = Math.max(this._pWorldBounds.fY1, (this._pWorldBounds.fY0) + 0.01);
this._pWorldBounds.fZ1 = Math.max(this._pWorldBounds.fZ1, (this._pWorldBounds.fZ0) + 0.01);

}

this._pWorldBounds.transform(this.worldMatrix());
if (true) {
this._iObjectFlags |= 1 << 1;

}
else  {
this._iObjectFlags &= ~(1 << 1);

}

;

}


};
SceneObject.prototype.refreshOcTreeMembership = function() {
if ((this._pOcTree) && ((this._iObjectFlags & (1 << 1)) != 0)) {
this._pOcTree.addOrUpdateSceneObject(this);

}


};
SceneObject.prototype.attachToOcTree = function(pParentTree) {
this.detachFromOcTree();
this._pOcTree = pParentTree;
this._pOcTree.addOrUpdateSceneObject(this);

};
SceneObject.prototype.detachFromOcTree = function() {
if (this._pOcTreeNode) {
this._pOcTreeNode.removeMember(this);
this._pOcTreeNode = null;

}

this._pOcTree = null;
this._pForwardTreeLink = null;
this._pRearTreeLink = null;

};
SceneObject.prototype.attachToSearchResult = function(pRearLink, pForwardLink) {
this._pForwardSearchLink = pForwardLink;
this._pRearSearchLink = pRearLink;
if (this._pForwardSearchLink) {
this._pForwardSearchLink.setRearSearchLink(this);

}

if (this._pRearSearchLink) {
this._pRearSearchLink.setForwardSearchLink(this);

}


};
SceneObject.prototype.detachFromSearchResult = function() {
if (this._pForwardSearchLink) {
this._pForwardSearchLink.setRearSearchLink(this._pRearSearchLink);

}

if (this._pRearSearchLink) {
this._pRearSearchLink.setForwardSearchLink(this._pForwardSearchLink);

}

this._pForwardSearchLink = null;
this._pRearSearchLink = null;

};
SceneObject.prototype.clearSearchResults = function() {
this._pRearSearchLink = null;
this._pForwardSearchLink = null;

};
SceneObject.prototype.prepareForRender = function() {

};
SceneObject.prototype.render = function() {
SceneObject.superclass.render.apply(this, arguments);

};
SceneObject.prototype.renderCallback = function(entry, activationFlags) {

};
a.SceneNode = SceneNode;
a.SubNodeGroup = SubNodeGroup;
a.SceneObject = SceneObject;
function Camera() {
Camera.superclass.constructor.apply(this, arguments);
this.iType = 0;
this.m4fView = Mat4.create();
this.m4fProj = Mat4.create();
this.m4fUnitProj = Mat4.create();
this.m4fViewProj = Mat4.create();
this.m4fBillboard = Mat4.create();
this.m4fSkyBox = Mat4.create();
this.m4fRenderStageProj = Mat4.create();
this.m4fRenderStageViewProj = Mat4.create();
this.pSearchRect = new a.Rect3d();
this.v3fTargetPos = Vec3.create();
this.fFOV = (Math.PI) / 5;
this.fAspect = 640 / 480;
this.fNearPlane = 0.1;
this.fFarPlane = 500;
this.fWidth = 0;
this.fHeight = 0;
this.fMinX = 0;
this.fMaxX = 0;
this.fMinY = 0;
this.fMaxY = 0;
this.pv3fFarPlanePoints = new Array(8);
for (var i=0; i < 8; ++i) {
this.pv3fFarPlanePoints[i] = Vec3.create();

}

this.pFrustum = new a.Frustum();

}

;
a.extend(Camera, SceneNode);
Camera.prototype.create = function() {
var result=Camera.superclass.create.apply(this, arguments);
if (result) {
this.v3fTargetPos[0] = this._m4fLocalMatrix[8];
this.v3fTargetPos[1] = this._m4fLocalMatrix[9];
this.v3fTargetPos[2] = this._m4fLocalMatrix[10];
Vec3.negate(this.v3fTargetPos);
this.setProjParams(this.fFOV, this.fAspect, this.fNearPlane, this.fFarPlane);
this.recalcMatrices();

}

return result;

};
Camera.prototype.setProjParams = function(fFOV, fAspect, fNearPlane, fFarPlane) {
this.fFOV = fFOV;
this.fAspect = fAspect;
this.fNearPlane = fNearPlane;
this.fFarPlane = fFarPlane;
this.iType = 0;
Mat4.matrixPerspectiveFovRH(fFOV, fAspect, fNearPlane, fFarPlane, this.m4fProj);
Mat4.matrixPerspectiveFovRH(fFOV, fAspect, 0.01, 2, this.m4fUnitProj);

};
Camera.prototype.setOrthoParams = function(fWidth, fHeight, fNearPlane, fFarPlane) {
this.fWidth = fWidth;
this.fHeight = fHeight;
this.fNearPlane = fNearPlane;
this.fFarPlane = fFarPlane;
this.iType = 1;
Mat4.matrixOrthoRH(fWidth, fHeight, fNearPlane, fFarPlane, this.m4fProj);
Mat4.matrixOrthoRH(fWidth, fHeight, 0.01, 2, this.m4fUnitProj);

};
Camera.prototype.setOffsetOrthoParams = function(fMinX, fMaxX, fMinY, fMaxY, fNearPlane, fFarPlane) {
this.fMinX = fMinX;
this.fMaxX = fMaxX;
this.fMinY = fMinY;
this.fMaxY = fMaxY;
this.fNearPlane = fNearPlane;
this.fFarPlane = fFarPlane;
this.iType = 2;
Mat4.matrixOrthoOffCenterRH(fMinX, fMaxX, fMinY, fMaxY, fNearPlane, fFarPlane, this.m4fProj);
Mat4.matrixOrthoOffCenterRH(fMinX, fMaxX, fMinY, fMaxY, 0.01, 2, this.m4fUnitProj);

};
Camera.prototype.recalcMatrices = function() {
this.v3fTargetPos[0] = this._m4fLocalMatrix[8];
this.v3fTargetPos[1] = this._m4fLocalMatrix[9];
this.v3fTargetPos[2] = this._m4fLocalMatrix[10];
Vec3.negate(this.v3fTargetPos);
this.m4fView[0] = this.inverseWorldMatrix()[0];
this.m4fView[1] = this.inverseWorldMatrix()[1];
this.m4fView[2] = this.inverseWorldMatrix()[2];
this.m4fView[3] = this.inverseWorldMatrix()[3];
this.m4fView[4] = this.inverseWorldMatrix()[4];
this.m4fView[5] = this.inverseWorldMatrix()[5];
this.m4fView[6] = this.inverseWorldMatrix()[6];
this.m4fView[7] = this.inverseWorldMatrix()[7];
this.m4fView[8] = this.inverseWorldMatrix()[8];
this.m4fView[9] = this.inverseWorldMatrix()[9];
this.m4fView[10] = this.inverseWorldMatrix()[10];
this.m4fView[11] = this.inverseWorldMatrix()[11];
this.m4fView[12] = this.inverseWorldMatrix()[12];
this.m4fView[13] = this.inverseWorldMatrix()[13];
this.m4fView[14] = this.inverseWorldMatrix()[14];
this.m4fView[15] = this.inverseWorldMatrix()[15];
this.m4fSkyBox[0] = this.m4fView[0];
this.m4fSkyBox[1] = this.m4fView[1];
this.m4fSkyBox[2] = this.m4fView[2];
this.m4fSkyBox[3] = this.m4fView[3];
this.m4fSkyBox[4] = this.m4fView[4];
this.m4fSkyBox[5] = this.m4fView[5];
this.m4fSkyBox[6] = this.m4fView[6];
this.m4fSkyBox[7] = this.m4fView[7];
this.m4fSkyBox[8] = this.m4fView[8];
this.m4fSkyBox[9] = this.m4fView[9];
this.m4fSkyBox[10] = this.m4fView[10];
this.m4fSkyBox[11] = this.m4fView[11];
this.m4fSkyBox[12] = this.m4fView[12];
this.m4fSkyBox[13] = this.m4fView[13];
this.m4fSkyBox[14] = this.m4fView[14];
this.m4fSkyBox[15] = this.m4fView[15];
this.m4fSkyBox[12] = 0;
this.m4fSkyBox[13] = 0;
this.m4fSkyBox[14] = 0;
Mat4.multiply(this.m4fSkyBox, this.m4fUnitProj, this.m4fSkyBox);
this.m4fBillboard[0] = this.worldMatrix()[0];
this.m4fBillboard[1] = this.worldMatrix()[1];
this.m4fBillboard[2] = this.worldMatrix()[2];
this.m4fBillboard[3] = this.worldMatrix()[3];
this.m4fBillboard[4] = this.worldMatrix()[4];
this.m4fBillboard[5] = this.worldMatrix()[5];
this.m4fBillboard[6] = this.worldMatrix()[6];
this.m4fBillboard[7] = this.worldMatrix()[7];
this.m4fBillboard[8] = this.worldMatrix()[8];
this.m4fBillboard[9] = this.worldMatrix()[9];
this.m4fBillboard[10] = this.worldMatrix()[10];
this.m4fBillboard[11] = this.worldMatrix()[11];
this.m4fBillboard[12] = this.worldMatrix()[12];
this.m4fBillboard[13] = this.worldMatrix()[13];
this.m4fBillboard[14] = this.worldMatrix()[14];
this.m4fBillboard[15] = this.worldMatrix()[15];
this.m4fBillboard[12] = 0;
this.m4fBillboard[13] = 0;
this.m4fBillboard[14] = 0;
Mat4.multiply(this.m4fProj, this.m4fView, this.m4fViewProj);
var m4fInvProj=Mat4.create();
var m4fInvCamera=Mat4.create();
Mat4.inverse(this.m4fProj, m4fInvProj);
Mat4.multiply(this.worldMatrix(), m4fInvProj, m4fInvCamera);
var v3fWorldPos=Vec3.create(this.worldPosition());
var p0=new glMatrixArrayType(3);
var p1=new glMatrixArrayType(3);
var p2=new glMatrixArrayType(3);
var p3=new glMatrixArrayType(3);
var p4=new glMatrixArrayType(3);
var p5=new glMatrixArrayType(3);
var p6=new glMatrixArrayType(3);
var p7=new glMatrixArrayType(3);
p0[0] = (-1);
p0[1] = 1;
p0[2] = 1;
p1[0] = (-1);
p1[1] = (-1);
p1[2] = 1;
p2[0] = 1;
p2[1] = (-1);
p2[2] = 1;
p3[0] = 1;
p3[1] = 1;
p3[2] = 1;
p4[0] = (-1);
p4[1] = 1;
p4[2] = 0;
p5[0] = (-1);
p5[1] = (-1);
p5[2] = 0;
p6[0] = 1;
p6[1] = (-1);
p6[2] = 0;
p7[0] = 1;
p7[1] = 1;
p7[2] = 0;
Vec3.vec3TransformCoord(p0, m4fInvCamera, this.pv3fFarPlanePoints[0]);
Vec3.vec3TransformCoord(p1, m4fInvCamera, this.pv3fFarPlanePoints[1]);
Vec3.vec3TransformCoord(p2, m4fInvCamera, this.pv3fFarPlanePoints[2]);
Vec3.vec3TransformCoord(p3, m4fInvCamera, this.pv3fFarPlanePoints[3]);
Vec3.vec3TransformCoord(p4, m4fInvCamera, this.pv3fFarPlanePoints[4]);
Vec3.vec3TransformCoord(p5, m4fInvCamera, this.pv3fFarPlanePoints[5]);
Vec3.vec3TransformCoord(p6, m4fInvCamera, this.pv3fFarPlanePoints[6]);
Vec3.vec3TransformCoord(p7, m4fInvCamera, this.pv3fFarPlanePoints[7]);
this.pSearchRect.set(v3fWorldPos[0], v3fWorldPos[0], v3fWorldPos[1], v3fWorldPos[1], v3fWorldPos[2], v3fWorldPos[2]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[0]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[1]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[2]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[3]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[4]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[5]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[6]);
this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[7]);
this.pFrustum.extractFromMatrixGL(this.m4fViewProj);
this.m4fRenderStageProj[0] = this.m4fProj[0];
this.m4fRenderStageProj[1] = this.m4fProj[1];
this.m4fRenderStageProj[2] = this.m4fProj[2];
this.m4fRenderStageProj[3] = this.m4fProj[3];
this.m4fRenderStageProj[4] = this.m4fProj[4];
this.m4fRenderStageProj[5] = this.m4fProj[5];
this.m4fRenderStageProj[6] = this.m4fProj[6];
this.m4fRenderStageProj[7] = this.m4fProj[7];
this.m4fRenderStageProj[8] = this.m4fProj[8];
this.m4fRenderStageProj[9] = this.m4fProj[9];
this.m4fRenderStageProj[10] = this.m4fProj[10];
this.m4fRenderStageProj[11] = this.m4fProj[11];
this.m4fRenderStageProj[12] = this.m4fProj[12];
this.m4fRenderStageProj[13] = this.m4fProj[13];
this.m4fRenderStageProj[14] = this.m4fProj[14];
this.m4fRenderStageProj[15] = this.m4fProj[15];
this.m4fRenderStageViewProj[0] = this.m4fViewProj[0];
this.m4fRenderStageViewProj[1] = this.m4fViewProj[1];
this.m4fRenderStageViewProj[2] = this.m4fViewProj[2];
this.m4fRenderStageViewProj[3] = this.m4fViewProj[3];
this.m4fRenderStageViewProj[4] = this.m4fViewProj[4];
this.m4fRenderStageViewProj[5] = this.m4fViewProj[5];
this.m4fRenderStageViewProj[6] = this.m4fViewProj[6];
this.m4fRenderStageViewProj[7] = this.m4fViewProj[7];
this.m4fRenderStageViewProj[8] = this.m4fViewProj[8];
this.m4fRenderStageViewProj[9] = this.m4fViewProj[9];
this.m4fRenderStageViewProj[10] = this.m4fViewProj[10];
this.m4fRenderStageViewProj[11] = this.m4fViewProj[11];
this.m4fRenderStageViewProj[12] = this.m4fViewProj[12];
this.m4fRenderStageViewProj[13] = this.m4fViewProj[13];
this.m4fRenderStageViewProj[14] = this.m4fViewProj[14];
this.m4fRenderStageViewProj[15] = this.m4fViewProj[15];

};
Camera.prototype.update = function() {
Camera.superclass.update.apply(this, arguments);
if (this.isWorldMatrixNew()) {
this.recalcMatrices();

}


};
Camera.prototype.applyRenderStageBias = function(iStage) {
var fZ_bias=(iStage > 1? 0.001 : 0);
this.m4fRenderStageProj[0] = this.m4fProj[0];
this.m4fRenderStageProj[1] = this.m4fProj[1];
this.m4fRenderStageProj[2] = this.m4fProj[2];
this.m4fRenderStageProj[3] = this.m4fProj[3];
this.m4fRenderStageProj[4] = this.m4fProj[4];
this.m4fRenderStageProj[5] = this.m4fProj[5];
this.m4fRenderStageProj[6] = this.m4fProj[6];
this.m4fRenderStageProj[7] = this.m4fProj[7];
this.m4fRenderStageProj[8] = this.m4fProj[8];
this.m4fRenderStageProj[9] = this.m4fProj[9];
this.m4fRenderStageProj[10] = this.m4fProj[10];
this.m4fRenderStageProj[11] = this.m4fProj[11];
this.m4fRenderStageProj[12] = this.m4fProj[12];
this.m4fRenderStageProj[13] = this.m4fProj[13];
this.m4fRenderStageProj[14] = this.m4fProj[14];
this.m4fRenderStageProj[15] = this.m4fProj[15];
this.m4fRenderStageViewProj[0] = this.m4fViewProj[0];
this.m4fRenderStageViewProj[1] = this.m4fViewProj[1];
this.m4fRenderStageViewProj[2] = this.m4fViewProj[2];
this.m4fRenderStageViewProj[3] = this.m4fViewProj[3];
this.m4fRenderStageViewProj[4] = this.m4fViewProj[4];
this.m4fRenderStageViewProj[5] = this.m4fViewProj[5];
this.m4fRenderStageViewProj[6] = this.m4fViewProj[6];
this.m4fRenderStageViewProj[7] = this.m4fViewProj[7];
this.m4fRenderStageViewProj[8] = this.m4fViewProj[8];
this.m4fRenderStageViewProj[9] = this.m4fViewProj[9];
this.m4fRenderStageViewProj[10] = this.m4fViewProj[10];
this.m4fRenderStageViewProj[11] = this.m4fViewProj[11];
this.m4fRenderStageViewProj[12] = this.m4fViewProj[12];
this.m4fRenderStageViewProj[13] = this.m4fViewProj[13];
this.m4fRenderStageViewProj[14] = this.m4fViewProj[14];
this.m4fRenderStageViewProj[15] = this.m4fViewProj[15];
this.m4fRenderStageProj[14] -= fZ_bias;
this.m4fRenderStageViewProj[14] -= fZ_bias;

};
Camera.prototype.viewMatrix = function() {
;
return this.m4fView;

};
Camera.prototype.projectionMatrix = function() {
;
return this.m4fRenderStageProj;

};
Camera.prototype.viewProjMatrix = function() {
;
return this.m4fRenderStageViewProj;

};
Camera.prototype.billboardMatrix = function() {
;
return this.m4fBillboard;

};
Camera.prototype.skyBoxMatrix = function() {
;
return this.m4fSkyBox;

};
Camera.prototype.internalProjectionMatrix = function() {
;
return this.m4fProj;

};
Camera.prototype.internalViewProjMatrix = function() {
;
return this.m4fViewProj;

};
Camera.prototype.targetPos = function() {
;
return this.v3fTargetPos;

};
Camera.prototype.fov = function() {
;
return this.fFOV;

};
Camera.prototype.aspect = function() {
;
return this.fAspect;

};
Camera.prototype.nearPlane = function() {
;
return this.fNearPlane;

};
Camera.prototype.farPlane = function() {
;
return this.fFarPlane;

};
Camera.prototype.viewDistance = function() {
;
return (this.fFarPlane) - (this.fNearPlane);

};
Camera.prototype.searchRect = function() {
;
return this.pSearchRect;

};
Camera.prototype.farPlanePoints = function() {
;
return this.pv3fFarPlanePoints;

};
Camera.prototype.frustum = function() {
;
return this.pFrustum;

};
a.Camera = Camera;
function OcTree() {
;
this._ppLevelNodes = null;
this.pFirstNode = null;
this._v3fWorldExtents = Vec3.create();
this._v3fWorldScale = Vec3.create();
this._v3fWorldOffset = Vec3.create();
this._iDepth = 0;
this._pFreeNodePool = null;
this.pTestLocalRect = null;

}

;
OcTree.prototype.getAndSetFreeNode = function(iLevel, iX, iY, iZ, iIndex) {
var pNode=this._pFreeNodePool.pop();
if (!pNode) {
pNode = new a.OcTreeNode(this);

}

pNode.iLevel = iLevel;
pNode.iX = iX;
pNode.iY = iY;
pNode.iZ = iZ;
pNode.iIndex = iIndex;
pNode.pNodeTrueRect.clear();
this._ppLevelNodes[iLevel][iIndex] = pNode;
if (this.pFirstNode) {
this.pFirstNode.pRearNodeLink = pNode;

}

pNode.pForwardNodeLink = this.pFirstNode;
pNode.pRearNodeLink = null;
this.pFirstNode = pNode;
return pNode;

};
OcTree.prototype.isReady = function() {
return (this._iDepth) && (this._ppLevelNodes);

};
OcTree.prototype.getNodeFromLevelXYZ = function(iLevel, iIndex) {
if (!this.isReady()) {
var err=((((((("Error:: " + "the Oc tree has not been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the Oc tree has not been created");

}


}

;
if ((iLevel >= 0) && (iLevel < (this._iDepth))) {
return this._ppLevelNodes[iLevel][iIndex];

}

return -1;

};
OcTree.prototype.create = function(pWorldBoundingBox, iDepth, nNode) {
if (!(!(this.isReady()))) {
var err=((((((("Error:: " + "the Oc tree has already been created") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("the Oc tree has already been created");

}


}

;
if (!(iDepth >= (1))) {
var err=((((((("Error:: " + "invalid tree iDepth") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid tree iDepth");

}


}

;
if (!(iDepth <= (11))) {
var err=((((((("Error:: " + "invalid tree iDepth") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid tree iDepth");

}


}

;
this._iDepth = iDepth;
var v3fTemp;
v3fTemp = pWorldBoundingBox.size();
this._v3fWorldExtents[0] = v3fTemp[0];
this._v3fWorldExtents[1] = v3fTemp[1];
this._v3fWorldExtents[2] = v3fTemp[2];
v3fTemp = Vec3.negate(pWorldBoundingBox.minPoint());
this._v3fWorldOffset[0] = v3fTemp[0];
this._v3fWorldOffset[1] = v3fTemp[1];
this._v3fWorldOffset[2] = v3fTemp[2];
this._v3fWorldScale[0] = 1024 / (this._v3fWorldExtents[0]);
this._v3fWorldScale[1] = 1024 / (this._v3fWorldExtents[1]);
this._v3fWorldScale[2] = 1024 / (this._v3fWorldExtents[2]);
this._ppLevelNodes = new Array(iDepth);
var i=0;
for (i = 0; i < iDepth; ++i) {
this._ppLevelNodes[i] = new Array();

}

this.pTestLocalRect = new Array(iDepth);
for (i = 0; i < iDepth; ++i) {
this.pTestLocalRect[i] = new OcTreeRect();

}

this._pFreeNodePool = new Array();
var nodes=((arguments.length) == 3? nNode : 10);
for (i = 0; i < nodes; ++i) {
this._pFreeNodePool.push(new a.OcTreeNode(this));

}


};
OcTree.prototype.destroy = function() {
var i;
for (i = 0; i < (this._iDepth); ++i) {
delete (this._ppLevelNodes[i]);

}

delete (this._ppLevelNodes);
for (i = 0; i < (this._pFreeNodePool.length); ++i) {
delete (this._pFreeNodePool[i]);

}

delete (this._pFreeNodePool);
this._iDepth = 0;

};
OcTree.prototype.findTreeNode = function(iX0, iX1, iY0, iY1, iZ0, iZ1) {
var level, levelX, levelY, levelZ;
var xPattern=iX0 ^ iX1;
var yPattern=iY0 ^ iY1;
var zPattern=iZ0 ^ iZ1;
var bitPattern=Math.max(zPattern, Math.max(xPattern, yPattern));
var highBit=(bitPattern? ((bitPattern == 0? null : (bitPattern < 0? 31 : ((Math.log(bitPattern)) / (Math.LN2)) << 0))) + 1 : 0);
level = ((11) - highBit) - 1;
level = Math.min(level, (this._iDepth) - 1);
var shift=((11) - level) - 1;
levelX = iX1 >> shift;
levelY = iY1 >> shift;
levelZ = iZ1 >> shift;
var iIndex=(((levelZ << level) << level) + (levelY << level)) + levelX;
var pNode=this.getNodeFromLevelXYZ(level, iIndex);
if (!pNode) {
return this.getAndSetFreeNode(level, levelX, levelY, levelZ, iIndex);

}

return pNode;

};
OcTree.prototype.buildByteRect = function(pWorldRect, pWorldByteRect) {
pWorldByteRect.convert(pWorldRect, this._v3fWorldOffset, this._v3fWorldScale);

};
OcTree.prototype.addOrUpdateSceneObject = function(pNewNode) {
var pRect=pNewNode._pWorldBounds;
var iX0=pRect.fX0, iX1=pRect.fX1, iY0=pRect.fY0, iY1=pRect.fY1, iZ0=pRect.fZ0, iZ1=pRect.fZ1;
iX0 += this._v3fWorldOffset[0];
iX1 += this._v3fWorldOffset[0];
iY0 += this._v3fWorldOffset[1];
iY1 += this._v3fWorldOffset[1];
iZ0 += this._v3fWorldOffset[2];
iZ1 += this._v3fWorldOffset[2];
iX0 *= this._v3fWorldScale[0];
iX1 *= this._v3fWorldScale[0];
iY0 *= this._v3fWorldScale[1];
iY1 *= this._v3fWorldScale[1];
iZ0 *= this._v3fWorldScale[2];
iZ1 *= this._v3fWorldScale[2];
iX0 = iX0 << 0;
iX1 = iX1 << 0;
iY0 = iY0 << 0;
iY1 = iY1 << 0;
iZ0 = iZ0 << 0;
iZ1 = iZ1 << 0;
iX0 = Math.max(0, Math.min(iX0, 1022));
iY0 = Math.max(0, Math.min(iY0, 1022));
iZ0 = Math.max(0, Math.min(iZ0, 1022));
iX1 = Math.max((iX0 + 1), Math.min(iX1, 1023));
iY1 = Math.max((iY0 + 1), Math.min(iY1, 1023));
iZ1 = Math.max((iZ0 + 1), Math.min(iZ1, 1023));
var pNode=this.findTreeNode(iX0, iX1, iY0, iY1, iZ0, iZ1);
return pNode.addOrUpdateMember(pNewNode);

};
OcTree.prototype.deleteNodeFromTree = function(pNode) {
if (pNode.pRearNodeLink) {
pNode.pRearNodeLink.pForwardNodeLink = pNode.pForwardNodeLink;

}

if (pNode.pForwardNodeLink) {
pNode.pForwardNodeLink.pRearNodeLink = pNode.pRearNodeLink;

}

if ((this.pFirstNode) == pNode) {
this.pFirstNode = pNode.pForwardNodeLink;

}

var iLevel=pNode.iLevel;
this._ppLevelNodes[iLevel][pNode.iIndex] = null;
pNode.pForwardNodeLink = null;
pNode.pRearNodeLink = null;
this._pFreeNodePool.push(pNode);

};
OcTree.prototype.buildSearchResults = function(pWorldRect, pOptionalFrustum) {
var pResultListStart=null;
var pResultListEnd=null;
var pByteRect=new OcTreeRect();
this.buildByteRect(pWorldRect, pByteRect);
var iLevel=0;
var iX, iY, iZ;
var pLocalRect;
var pObject=null;
var pResult=new a.Rect3d();
var pNode=null;
var i;
for (i = 0; i < (this._iDepth); ++i) {
var shift_count=10 - i;
this.pTestLocalRect[i].set((pByteRect.iX0) >> shift_count, (pByteRect.iX1) >> shift_count, (pByteRect.iY0) >> shift_count, (pByteRect.iY1) >> shift_count, (pByteRect.iZ0) >> shift_count, (pByteRect.iZ1) >> shift_count);

}

for (pNode = this.pFirstNode; pNode; pNode = pNode.pForwardNodeLink) {
iLevel = pNode.iLevel;
iX = pNode.iX;
iY = pNode.iY;
iZ = pNode.iZ;
pLocalRect = this.pTestLocalRect[iLevel];
if ((((((iY < (pLocalRect.iY0)) || (iY > (pLocalRect.iY1))) || (iX < (pLocalRect.iX0))) || (iX > (pLocalRect.iX1))) || (iZ < (pLocalRect.iZ0))) || (iZ > (pLocalRect.iZ1))) {
continue ;

}

if ((((((iY == (pLocalRect.iY0)) || (iY == (pLocalRect.iY1))) || (iX == (pLocalRect.iX0))) || (iX == (pLocalRect.iX1))) || (iZ == (pLocalRect.iZ0))) || (iZ == (pLocalRect.iZ1))) {
pObject = null;
if (!pOptionalFrustum) {
for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
if (a.intersectRect3d(pWorldRect, pObject.worldBounds(), pResult)) {
if (pResultListEnd) {
pObject.attachToSearchResult(pResultListEnd, null);
pResultListEnd = pObject;

}
else  {
pObject.clearSearchResults();
pResultListEnd = pObject;
pResultListStart = pObject;

}


}


}

continue ;

}

if (pNode.pNodeTrueRect.isClear()) {
pNode.nodeCoords();

}

if (!(pOptionalFrustum.testRect(pNode.pNodeTrueRect))) {
continue ;

}

for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
if (a.intersectRect3d(pWorldRect, pObject.worldBounds(), pResult)) {
if (pOptionalFrustum.testRect(pObject.worldBounds())) {
if (pResultListEnd) {
pObject.attachToSearchResult(pResultListEnd, null);
pResultListEnd = pObject;

}
else  {
pObject.clearSearchResults();
pResultListEnd = pObject;
pResultListStart = pObject;

}


}


}


}

continue ;

}
else  {
pObject = null;
if (!pOptionalFrustum) {
for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
if (pResultListEnd) {
pObject.attachToSearchResult(pResultListEnd, null);
pResultListEnd = pObject;

}
else  {
pObject.clearSearchResults();
pResultListEnd = pObject;
pResultListStart = pObject;

}


}

continue ;

}

if (pNode.pNodeTrueRect.isClear()) {
pNode.nodeCoords();

}

if (!(pOptionalFrustum.testRect(pNode.pNodeTrueRect))) {
continue ;

}

for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
if (pOptionalFrustum.testRect(pObject.worldBounds())) {
if (pResultListEnd) {
pObject.attachToSearchResult(pResultListEnd, null);
pResultListEnd = pObject;

}
else  {
pObject.clearSearchResults();
pResultListEnd = pObject;
pResultListStart = pObject;

}


}


}

continue ;

}


}

return pResultListStart;

};
function OcTreeRect() {
this.iX0 = 0;
this.iX1 = 0;
this.iY0 = 0;
this.iY1 = 0;
this.iZ0 = 0;
this.iZ1 = 0;
switch(arguments.length) {
case 1:
this.iX0 = arguments[0].iX0;
this.iX1 = arguments[0].iX1;
this.iY0 = arguments[0].iY0;
this.iY1 = arguments[0].iY1;
this.iZ0 = arguments[0].iZ0;
this.iZ1 = arguments[0].iZ1;
break ;

case 6:
this.iX0 = arguments[0];
this.iX1 = arguments[1];
this.iY0 = arguments[2];
this.iY1 = arguments[3];
this.iZ0 = arguments[4];
this.iZ1 = arguments[5];
break ;
}

}

;
OcTreeRect.prototype.convert = function(pWorldRect, v3fOffset, v3fScale) {
var convertedRect=new a.Rect3d(pWorldRect);
convertedRect.addSelf(v3fOffset);
convertedRect.multSelf(v3fScale);
convertedRect.fX1 = Math.max((convertedRect.fX1) - 0.01, convertedRect.fX0);
convertedRect.fY1 = Math.max((convertedRect.fY1) - 0.01, convertedRect.fY0);
convertedRect.fZ1 = Math.max((convertedRect.fZ1) - 0.01, convertedRect.fZ0);
this.iX0 = (convertedRect.fX0) << 0;
this.iX1 = (convertedRect.fX1) << 0;
this.iY0 = (convertedRect.fY0) << 0;
this.iY1 = (convertedRect.fY1) << 0;
this.iZ0 = (convertedRect.fZ0) << 0;
this.iZ1 = (convertedRect.fZ1) << 0;
this.iX0 = Math.max(0, Math.min(this.iX0, 1022));
this.iY0 = Math.max(0, Math.min(this.iY0, 1022));
this.iZ0 = Math.max(0, Math.min(this.iZ0, 1022));
this.iX1 = Math.max(((this.iX0) + 1), Math.min(this.iX1, 1023));
this.iY1 = Math.max(((this.iY0) + 1), Math.min(this.iY1, 1023));
this.iZ1 = Math.max(((this.iZ0) + 1), Math.min(this.iZ1, 1023));

};
OcTreeRect.prototype.set = function(iX0, iX1, iY0, iY1, iZ0, iZ1) {
this.iX0 = iX0;
this.iX1 = iX1;
this.iY0 = iY0;
this.iY1 = iY1;
this.iZ0 = iZ0;
this.iZ1 = iZ1;

};
function OcTreeNode(pTree) {
this.pTree = pTree;
this.iLevel = 0;
this.iX = 0;
this.iY = 0;
this.iZ = 0;
this.iIndex = 0;
this.pFirstMember = null;
this.pNodeTrueRect = new Rect3d();
this.pForwardNodeLink = null;
this.pRearNodeLink = null;
if ((arguments.length) == 4) {
this.iLevel = arguments[0];
this.iX = arguments[1];
this.iY = arguments[2];
this.iZ = arguments[3];

}


}

;
OcTreeNode.prototype.addOrUpdateMember = function(pMember) {
if ((pMember._pOcTreeNode) != (this)) {
if (pMember._pOcTreeNode) {
pMember._pOcTreeNode.removeMember(pMember);

}

if (!(this.pFirstMember)) {
this.pFirstMember = pMember;

}
else  {
pMember._pRearTreeLink = null;
pMember._pForwardTreeLink = this.pFirstMember;
this.pFirstMember._pRearTreeLink = pMember;
this.pFirstMember = pMember;

}

pMember._pOcTreeNode = this;

}


};
OcTreeNode.prototype.removeMember = function(pMember) {
if (!((pMember._pOcTreeNode) == (this))) {
var err=((((((("Error:: " + "error removing Oc tree pMember") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("error removing Oc tree pMember");

}


}

;
if (pMember._pForwardTreeLink) {
pMember._pForwardTreeLink._pRearTreeLink = pMember._pRearTreeLink;

}

if (pMember._pRearTreeLink) {
pMember._pRearTreeLink._pForwardTreeLink = pMember._pForwardTreeLink;

}

if ((this.pFirstMember) == pMember) {
this.pFirstMember = pMember._pForwardTreeLink;

}

pMember._pRearTreeLink = null;
pMember._pForwardTreeLink = null;
pMember._pOcTreeNode = null;
if (!(this.pFirstMember)) {
pMember._pOcTree.deleteNodeFromTree(this);

}


};
OcTreeNode.prototype.nodeCoords = function() {
var w=1 << (10 - (this.iLevel));
this.pNodeTrueRect.fX0 = (this.iX) * w;
this.pNodeTrueRect.fX1 = ((this.iX) + 1) * w;
this.pNodeTrueRect.fY0 = (this.iY) * w;
this.pNodeTrueRect.fY1 = ((this.iY) + 1) * w;
this.pNodeTrueRect.fZ0 = (this.iZ) * w;
this.pNodeTrueRect.fZ1 = ((this.iZ) + 1) * w;
this.pNodeTrueRect.divSelf(this.pTree._v3fWorldScale);
this.pNodeTrueRect.subSelf(this.pTree._v3fWorldOffset);

};
a.OcTree = OcTree;
a.OcTreeNode = OcTreeNode;
a.OcTreeRect = OcTreeRect;
function ShaderProgram() {
ShaderProgram.ctor.apply(this, arguments);

}

ShaderProgram.prototype.activate = null;
ShaderProgram.prototype.isActive = null;
ShaderProgram.prototype.isValid = null;
ShaderProgram.prototype.build = null;
ShaderProgram.prototype.setup = null;
ShaderProgram.prototype.getSourceCode = null;
ShaderProgram.prototype.setSourceCode = null;
ShaderProgram.prototype.applyBuffer = null;
ShaderProgram.prototype.applyBufferMap = null;
ShaderProgram.prototype.applyMatrix4 = null;
ShaderProgram.prototype.createResource = function() {
if (!(!(this.isResourceCreated()))) {
var err=((((((("Error:: " + "The resource has already been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has already been created.");

}


}

;
this.notifyCreated();
this.notifyDisabled();
return true;

};
ShaderProgram.prototype.destroyResource = function() {
if (this.isResourceCreated()) {
this.disableResource();
this.notifyUnloaded();
this.notifyDestroyed();
return true;

}

return false;

};
ShaderProgram.prototype.disableResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyDisabled();
return true;

};
ShaderProgram.prototype.restoreResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyRestored();
return true;

};
ShaderProgram.prototype.loadResource = function() {
return true;

};
ShaderProgram.prototype.saveResource = function() {
return true;

};
a.extend(ShaderProgram, a.ResourcePoolItem);
function GLSLProgram(pEngine) {
GLSLProgram.ctor.apply(this, arguments);
this._pEngine = pEngine;
this._pDevice = pEngine.pDevice;
this._pManager = pEngine.pShaderManager;
this._pHarwareProgram = null;
this._pAttributesByName =  {};
this._sVertexCode = "void main(void){gl_Position = vec4(vec3(0.), 1.);}";
this._sPixelCode = "#ifdef GL_ES\nprecision lowp float;\n#endif\n" + "void main(void){gl_FragColor = vec4(vec3(0.), 1.);}";
this._pDeclaration = null;
this._pAttributes = new Array(16);
this._nAttrsUsed = 0;
this._isValid = false;
this._pUniformList =  {};
for (var i=0; i < 16; ++i) {
this._pAttributes[i] =  {iLocation: -1, sName: null, pCurrentData: null};

}


}

a.extend(GLSLProgram, ShaderProgram);
GLSLProgram.prototype.isActive = function() {
return (this._pDevice.getParameter(this._pDevice.CURRENT_PROGRAM)) === (this._pHarwareProgram);

};
GLSLProgram.prototype.getSourceCode = function(eType) {
return (eType === (35633)? this._sVertexCode : this._sPixelCode);

};
GLSLProgram.prototype.setSourceCode = function(eType, sCode) {
switch(eType) {
case 35633:
this._sVertexCode = sCode;
return true;

case 35632:
this._sPixelCode = sCode;
return true;
}
return false;

};
GLSLProgram.prototype._shaderInfoLog = function(pShader, eType) {
var sCode=this.getSourceCode(eType), sLog;
var tmp=sCode.split("\n");
sCode = "";
for (var i=0; i < (tmp.length); i++) {
sCode += (((i + 1) + "| ") + (tmp[i])) + "\n";

}

sLog = this._pDevice.getShaderInfoLog(pShader);
return (((((("<div style=\"background: #FCC\">" + "<pre>") + sLog) + "</pre>") + "</div>") + "<pre style=\"background-color: #EEE;\">") + sCode) + "</pre>";

};
GLSLProgram.prototype._programInfoLog = function() {
return (((((((("<pre style=\"background-color: #FFCACA;\">" + (this._pDevice.getProgramInfoLog(this._pHarwareProgram))) + "</pre>") + "<hr />") + "<pre>") + (this.getSourceCode(35633))) + "</pre><hr />") + "<pre>") + (this.getSourceCode(35632))) + "</pre>";

};
GLSLProgram.prototype._buildShader = function(eType, sCode) {
var pDevice=this._pDevice;
var pShader=pDevice.createShader(eType);
pDevice.shaderSource(pShader, sCode);
pDevice.compileShader(pShader);
if (!pDevice.getShaderParameter(pShader, pDevice.COMPILE_STATUS)) {
var err=((((((("Error:: " + "cannot compile shader") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
new a.DebugWindow("cannot compile shader").print(this._shaderInfoLog(pShader, eType));

}


}

;
return pShader;

};
GLSLProgram.prototype.create = function(sVertexCode, sPixelCode, bSetup) {
var pHardwareProgram, pDevice=this._pDevice;
this._sVertexCode = sVertexCode = sVertexCode || (this._sVertexCode);
this._sPixelCode = sPixelCode = sPixelCode || (this._sPixelCode);
pHardwareProgram = this._pHarwareProgram = pDevice.createProgram();
pDevice.attachShader(pHardwareProgram, this._buildShader(35633, sVertexCode));
pDevice.attachShader(pHardwareProgram, this._buildShader(35632, sPixelCode));
pDevice.linkProgram(pHardwareProgram);
if (!(pDevice.getProgramParameter(pHardwareProgram, pDevice.VALIDATE_STATUS))) {
console.log("program not valid", this.findResourceName());
console.log(pDevice.getProgramInfoLog(pHardwareProgram));

}

if (!pDevice.getProgramParameter(pHardwareProgram, pDevice.LINK_STATUS)) {
var err=((((((("Error:: " + "cannot link program") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
new a.DebugWindow("cannot link program").print(this._programInfoLog());

}


}

;
this._isValid = true;
return (bSetup? this.setup() : true);

};
GLSLProgram.prototype.isValid = function() {
return this._isValid;

};
a.defineProperty(GLSLProgram, "declaration", function() {
return this._pDeclaration;

}
, function(pDeclaration) {
this._pVertexDeclaration = pDeclaration;

}
);
GLSLProgram.prototype._setupUniforms = function(pUniformList) {
var pUniforms=this._pUniformList;
var pDevice=this._pDevice;
var pProgram=this._pHarwareProgram;
for (var k=0; k < (pUniformList.length); k++) {
pUniforms[pUniformList[k]] = pDevice.getUniformLocation(pProgram, pUniformList[k]);
console.log(pUniformList[k], pUniforms[pUniformList[k]]);

}


};
GLSLProgram.prototype.autoSetup = function() {
var pDevice=this._pDevice;
var pUniformList=[];
var pProgram=this._pHarwareProgram;
var pVertexDeclaration=[];
var k, n;
for (k = 0, n = pDevice.getProgramParameter(pProgram, pDevice.ACTIVE_UNIFORMS); k < n; ++k) {
var pUniformInfo=pDevice.getActiveUniform(pProgram, k);
pUniformList.push(pUniformInfo.name);

}

for (k = 0, n = pDevice.getProgramParameter(pProgram, pDevice.ACTIVE_ATTRIBUTES); k < n; ++k) {
var pAttrInfo=pDevice.getActiveAttrib(pProgram, k);
pVertexDeclaration.push( {eUsage: pAttrInfo.name, nCount: pAttrInfo.size, eType: pAttrInfo.type});

}

pVertexDeclaration = new a.VertexDeclaration(pVertexDeclaration);
console.log(pUniformList);
console.log(pVertexDeclaration);
return this.setup(pVertexDeclaration, pUniformList);

};
GLSLProgram.prototype.setup = function(pVertexDeclaration, pUniformList) {
if (!this.isValid()) {
var err=((((((("Error:: " + "Cannot setup invalid program.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot setup invalid program.");

}


}

;
if (!(arguments.length)) {
return this.autoSetup();

}

pVertexDeclaration = this._pDeclaration = pVertexDeclaration || (this._pDeclaration);
var isOk=this._setupUniforms(pUniformList);
var pDevice=this._pDevice;
var sAttrName, pAttr, iLocation;
var pAttrs=this._pAttributes, pAttrsByName=this._pAttributesByName;
var iAttrUsed=0;
for (var i=0; i < (pVertexDeclaration.length); i++) {
sAttrName = pVertexDeclaration[i].eUsage;
iLocation = pDevice.getAttribLocation(this._pHarwareProgram, sAttrName);
pAttr = pAttrs[iAttrUsed];
if (iLocation == (-1)) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + ("Unable to obtain the shader attribute " + (pVertexDeclaration[i].eUsage)));
isOk = false;
continue ;

}

pAttr.iLocation = iLocation;
pAttr.sName = sAttrName;
iAttrUsed++;
pAttrsByName[sAttrName] = pAttr;
pDevice.enableVertexAttribArray(iLocation);

}

this._nAttrsUsed = iAttrUsed;
return isOk;

};
GLSLProgram.prototype.detach = function() {
var pAttrs=this._pAttributes;
var pDevice=this._pDevice;
this.activate();
for (var i=0; i < (this._nAttrsUsed); i++) {
pDevice.disableVertexAttribArray(pAttrs[i].iLocation);

}


};
GLSLProgram.prototype.bind = function() {
this._pDevice.useProgram(this._pHarwareProgram);

};
GLSLProgram.prototype.unbind = function(pPrevProgram) {
this._pDevice.useProgram((pPrevProgram? pPrevProgram._pHarwareProgram : null));

};
GLSLProgram.prototype.activate = function() {
this._pManager.activateProgram(this);

};
GLSLProgram.prototype.deactivate = function() {
this._pManager.deactivateProgram(this);

};
GLSLProgram.prototype.applyMatrix4 = function(sName, pValue) {
this._pDevice.uniformMatrix4fv(this._pUniformList[sName], false, pValue);

};
GLSLProgram.prototype.applyBufferMap = function(pBufferMap) {
var i=0;
var pFlow;
for (i = 0; i < (pBufferMap._nCompleteFlows); i++) {
pFlow = pBufferMap._pCompleteFlows[i];
if ((pFlow.eType) === (1)) {
this.applyBuffer(pFlow.pMapper.pData);

}
else  {
this.applyBuffer(pFlow.pData);

}


}

for (i = 0; i < (pBufferMap._nCompleteVideoBuffers); i++) {
pBufferMap._pCompleteVideoBuffers[i].activate(i);
this._pDevice.uniform1i(this._pUniformList["A_buffer_" + i], i);

}


};
GLSLProgram.prototype.applyBuffer = function(pVertexData) {
var pDevice=this._pDevice;
var iOffset=0;
var iStride=pVertexData.getStride();
var pAttrs=this._pAttributesByName, pAttr;
var pVertexElement;
var pVertexBuffer=pVertexData.buffer;
var isActive=(this._pManager.latestBuffer) !== pVertexBuffer;
for (i = 0; i < (pVertexData.getVertexElementCount()); i++) {
pVertexElement = pVertexData._pVertexDeclaration[i];
pAttr = pAttrs[pVertexElement.eUsage];
if (pAttr && ((pAttr.pCurrentData) !== pVertexData)) {
if (isActive) {
isActive = true;
pVertexBuffer.activate();
this._pManager.latestBuffer = pVertexBuffer;

}

pAttr.pCurrentData = pVertexData;
pDevice.vertexAttribPointer(pAttr.iLocation, pVertexElement.nCount, pVertexElement.eType, false, iStride, ((iOffset + (pVertexElement.iOffset)) >= 0? iOffset + (pVertexElement.iOffset) : 0));

}

iOffset += (pVertexElement.nCount) * (a.getTypeSize(pVertexElement.eType));
pAttr.pCurrentData = pVertexData;

}


};
GLSLProgram.prototype.applyVector2 = function(sName) {
var pDevice=this._pDevice;
switch(arguments.length) {
case 2:
pDevice.uniform2fv(this._pUniformList[sName], arguments[1]);
break ;

case 3:
pDevice.uniform2f(this._pUniformList[sName], arguments[1], arguments[2]);
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Invalid number of arguments.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Invalid number of arguments.");

}


}

;
}

};
GLSLProgram.prototype.applyVector3 = function(sName) {
var pDevice=this._pDevice;
switch(arguments.length) {
case 2:
pDevice.uniform3fv(this._pUniformList[sName], arguments[1]);
break ;

case 4:
pDevice.uniform3f(this._pUniformList[sName], arguments[1], arguments[2], arguments[3]);
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Invalid number of arguments.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Invalid number of arguments.");

}


}

;
}

};
GLSLProgram.prototype.applyVector4 = function(sName) {
var pDevice=this._pDevice;
switch(arguments.length) {
case 2:
pDevice.uniform4fv(this._pUniformList[sName], arguments[1]);
break ;

case 5:
pDevice.uniform4f(this._pUniformList[sName], arguments[1], arguments[2], arguments[3], arguments[4]);
break ;

default:
if (!0) {
var err=((((((("Error:: " + "Invalid number of arguments.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Invalid number of arguments.");

}


}

;
}

};
GLSLProgram.prototype.applyInt = function(sName, iValue) {
this._pDevice.uniform1i(this._pUniformList[sName], iValue);

};
GLSLProgram.prototype.applyFloat = function(sName, fValue) {
this._pDevice.uniform1f(this._pUniformList[sName], fValue);

};
a.GLSLProgram = GLSLProgram;
function ShaderParam() {
this._pType = null;
ShaderParam.superclass.constructor.apply(this, arguments);

}

a.extend(ShaderParam, a.ParameterDesc);
ShaderParam.prototype.str = function(useName, useSemicolon) {
useName = (useName === undefined? true : useName);
useSemicolon = (useSemicolon === undefined? true : useSemicolon);
var sName=(useName? " " + (this.sName) : "");
if (this.isBasic) {
return ((this._pType) + sName) + ((useSemicolon? ";" : ""));

}

var pType=this._pType;
var str="struct {\n";
for (var i=0; i < (pType.length); ++i) {
str += (pType[i].str()) + "\n";

}

str += "}" + ((useSemicolon? ";" : ""));
return str;

};
ShaderParam.prototype.dump = function(pWriter) {
pWriter = pWriter || (new a.BinWriter());
ShaderParam.superclass.dump.call(this, pWriter);
var tmp=this._pType;
if ((!(this.isBasic)) && tmp) {
pWriter.uint16(tmp.length);
for (var i=0; i < (tmp.length); ++i) {
tmp[i].dump(pWriter);

}


}
else  {
pWriter.string(tmp);

}

return pWriter;

};
ShaderParam.prototype.undump = function(pReader) {
ShaderParam.superclass.undump.call(this, pReader);
if (!(this.isBasic)) {
this._pType = [];
var n=pReader.uint16();
var tmp=this._pType;
for (var i=0; i < n; ++i) {
tmp[i] = new a.ShaderParam().undump(pReader);

}


}
else  {
this._pType = pReader.string();

}

return this;

};
Object.defineProperty(ShaderParam.prototype, "code",  {get: function() {
return this._iBasic;

}
});
Object.defineProperty(ShaderParam.prototype, "iStructMembers",  {get: function() {
return (!(this.isBasic)? this._pType.length : 0);

}
});
Object.defineProperty(ShaderParam.prototype, "isBasic",  {set: function() {
if (!0) {
var err=((((((("Error:: " + "You cannot set isBasic attribute for ShaderParam class.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("You cannot set isBasic attribute for ShaderParam class.");

}


}

;

}
, get: function() {
return (this.eClass) != (5);

}
});
Object.defineProperty(ShaderParam.prototype, "name",  {get: function() {
return this.sName;

}
, set: function(str) {
this.sName = str;

}
});
Object.defineProperty(ShaderParam.prototype, "type",  {get: function() {
return this._pType;

}
, set: function(pVal) {
if ((typeof pVal) == "string") {
this.eType = a.Shader.getSLTypeCode(pVal);
this.eClass = a.Shader.getSLTypeClass(pVal);
this.iRows = a.Shader.getSLTypeRowsNum(pVal);
this.iColumns = a.Shader.getSLTypeColumnsNum(pVal);
this._pType = pVal;

}
else  {
this.eClass = 5;
this.eType = 19;
this._pType = pVal;

}


}
});
Object.defineProperty(ShaderParam.prototype, "size",  {get: function() {
return this.iElements;

}
, set: function(n) {
this.iElements = n;

}
});
function ShaderConstant() {
this._sName = null;
this._sType = null;
this._fStep = 0;
this._pDefaultValue = null;
this._pValue = null;
this._pMinValue = null;
this._pMaxValue = null;
this._sComment = null;

}

ShaderConstant.prototype.undump = function(pReader) {
this._sName = pReader.string();
this._sType = pReader.string();
this._fStep = pReader.float32();
var n=a.Shader.typeLength(this._sType);
if (n > 1) {
this._pDefaultValue = pReader.float32Array();
this._pValue = pReader.float32Array();
this._pMinValue = pReader.float32Array();
this._pMaxValue = pReader.float32Array();

}
else  {
this._pDefaultValue = pReader.float32();
this._pValue = pReader.float32();
this._pMinValue = pReader.float32();
this._pMaxValue = pReader.float32();

}

this._sComment = pReader.string();
return this;

};
ShaderConstant.prototype.dump = function(pWriter) {
pWriter = pWriter || (new a.BinWriter());
pWriter.string(this._sName);
pWriter.string(this._sType);
pWriter.float32(this._fStep);
var n=a.Shader.typeLength(this._sType);
if (n > 1) {
pWriter.float32Array(this._pDefaultValue);
pWriter.float32Array(this._pValue);
pWriter.float32Array(this._pMinValue);
pWriter.float32Array(this._pMaxValue);

}
else  {
pWriter.float32(this._pDefaultValue);
pWriter.float32(this._pValue);
pWriter.float32(this._pMinValue);
pWriter.float32(this._pMaxValue);

}

pWriter.string(this._sComment);
return pWriter;

};
Object.defineProperty(ShaderConstant.prototype, "name",  {get: function() {
return this._sName;

}
, set: function(str) {
this._sName = str;

}
});
Object.defineProperty(ShaderConstant.prototype, "type",  {get: function() {
return this._sType;

}
, set: function(str) {
if (!a.Shader.typeLength(str)) {
var err=((((((("Error:: " + (("Тип '" + str) + "' не поддерживается.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Тип '" + str) + "' не поддерживается."));

}


}

;
this._sType = str;

}
});
Object.defineProperty(ShaderConstant.prototype, "comment",  {get: function() {
return this._sComment;

}
, set: function(str) {
this._sComment = str;

}
});
Object.defineProperty(ShaderConstant.prototype, "value",  {get: function() {
return this._pValue;

}
, set: function(pVal) {
this._pValue = a.Shader.typedValue(this._sType, pVal);

}
});
Object.defineProperty(ShaderConstant.prototype, "def",  {get: function() {
return this._pDefaultValue;

}
, set: function(pVal) {
this._pDefaultValue = a.Shader.typedValue(this._sType, pVal);

}
});
Object.defineProperty(ShaderConstant.prototype, "min",  {get: function() {
return this._pMinValue;

}
, set: function(pVal) {
this._pMinValue = a.Shader.typedValue(this._sType, pVal);

}
});
Object.defineProperty(ShaderConstant.prototype, "max",  {get: function() {
return this._pMaxValue;

}
, set: function(pVal) {
this._pMaxValue = a.Shader.typedValue(this._sType, pVal);

}
});
Object.defineProperty(ShaderConstant.prototype, "step",  {get: function() {
return this._fStep;

}
, set: function(fVal) {
this._fStep = parseFloat(fVal);

}
});
function ShaderFlag() {
this._sName = null;
this._pValues = [];
this._sComment = null;

}

ShaderFlag.prototype.str = function(n) {
if (n === null) {
return ("#define " + (this._sName)) + " ";

}
else  {
return ((("#define " + (this._sName)) + " ") + (this._pValues[n].value)) + " ";

}


};
ShaderFlag.prototype.dump = function(pWriter) {
pWriter = pWriter || (new a.BinWriter());
pWriter.string(this._sName);
var tmp=this._pValues;
pWriter.uint16(tmp.length);
for (var i=0; i < (tmp.length); ++i) {
pWriter.string(tmp[i].name);
pWriter.string(tmp[i].value);

}

pWriter.string(this._sComment);
return pWriter;

};
ShaderFlag.prototype.undump = function(pReader) {
this._sName = pReader.string();
var n=pReader.uint16();
var tmp=this._pValues;
for (var i=0; i < n; ++i) {
tmp[i] =  {"name": pReader.string(), "value": pReader.string()};

}

this._sComment = pReader.string();
return this;

};
Object.defineProperty(ShaderFlag.prototype, "comment",  {get: function() {
return this._sComment;

}
, set: function(str) {
this._sComment = str;

}
});
Object.defineProperty(ShaderFlag.prototype, "name",  {get: function() {
return this._sName;

}
, set: function(str) {
this._sName = str;

}
});
ShaderFlag.prototype.value = function(n) {
return this._pValues[n].value;

};
ShaderFlag.prototype.valueName = function(n) {
return this._pValues[n].name;

};
Object.defineProperty(ShaderFlag.prototype, "size",  {get: function() {
return this._pValues.length;

}
});
ShaderFlag.prototype.addValue = function(sValue, sName) {
sName = sName || "";
this._pValues.push( {name: sName, value: sValue});

};
function ShaderVarying() {
ShaderVarying.superclass.constructor.apply(this, arguments);

}

;
ShaderVarying.prototype.str = function() {
return "varying " + (pVary.superclass.str());

};
a.extend(ShaderVarying, ShaderParam);
function ShaderAttribute() {
ShaderAttribute.superclass.constructor.apply(this, arguments);

}

;
a.extend(ShaderAttribute, ShaderParam);
ShaderAttribute.prototype.str = function() {
return ((("attribute " + (ShaderAttribute.superclass.str.call(this, 0, 0))) + " ") + (this.sName)) + ";";

};
Object.defineProperty(ShaderAttribute.prototype, "semantics",  {get: function() {
return this.sSemantic;

}
, set: function(str) {
this.sSemantic = str;

}
});
Object.defineProperty(ShaderAttribute.prototype, "name",  {get: function() {
return this.sName;

}
, set: function(str) {
this.sName = str;

}
});
function ShaderUniform() {
ShaderUniform.superclass.constructor.apply(this, arguments);

}

a.extend(ShaderUniform, ShaderParam);
ShaderUniform.prototype.str = function() {
return ((("uniform " + (ShaderUniform.superclass.str.call(this, 0, 0))) + " ") + (this.sName)) + ";";

};
Object.defineProperty(ShaderUniform.prototype, "semantics",  {get: function() {
return this.sSemantic;

}
, set: function(str) {
this.sSemantic = str;

}
});
function ShaderFragment(eType) {
;
this._pFlags = [];
this._pConstants = [];
this._pUniforms = [];
this._pAttrs = [];
this._pVaryings = [];
this._eType = eType || (0);
this._pCode = new Array(3);

}

ShaderFragment.prototype.applyPrefix = function(sPrefix) {
sPrefix = sPrefix || " ";
this._substCode("$", sPrefix);

};
ShaderFragment.prototype._substCode = function(sFrom, sTo) {
var pCode=this._pCode;
for (var i=0; i < (pCode.length); ++i) {
if (pCode[i]) {
pCode[i] = pCode[i].split(sFrom).join(sTo);

}


}


};
ShaderFragment.prototype.applyConstants = function() {
var pConsts=this._pConstants;
for (var i=0; i < (pConsts.length); ++i) {
this._substCode(pConsts.name, pConsts.def);

}


};
ShaderFragment.prototype.dump = function(pWriter) {
pWriter = pWriter || (new a.BinWriter());
var fnWriteObject=function(pObj) {
pWriter.uint16(pObj.length);
for (var i=0; i < (pObj.length); ++i) {
pObj[i].dump(pWriter);

}


};
fnWriteObject(this._pFlags);
fnWriteObject(this._pConstants);
fnWriteObject(this._pUniforms);
fnWriteObject(this._pAttrs);
fnWriteObject(this._pVaryings);
pWriter.int8(this._eType);
pWriter.stringArray(this._pCode);
return pWriter;

};
ShaderFragment.prototype.undump = function(pReader) {
var fnReadObject=function(pObj, pType) {
var n=pReader.uint16();
for (var i=0; i < n; ++i) {
pObj[i] = new pType().undump(pReader);

}


};
fnReadObject(this._pFlags, a.ShaderFlag);
fnReadObject(this._pConstants, a.ShaderConstant);
fnReadObject(this._pUniforms, a.ShaderUniform);
fnReadObject(this._pAttrs, a.ShaderAttribute);
fnReadObject(this._pVaryings, a.ShaderVarying);
this._eType = pReader.int8();
this._pCode = pReader.stringArray();
return this;

};
ShaderFragment.prototype.hasVarying = function(sName) {
var src=this._pVaryings;
for (var i=0; i < (src.length); ++i) {
if ((src[i].name) == sName) {
return true;

}


}

return false;

};
ShaderFragment.prototype.addFlag = function(pFlag) {
this._pFlags.push(pFlag);

};
ShaderFragment.prototype.addConstant = function(pConst) {
this._pConstants.push(pConst);

};
ShaderFragment.prototype.addUniform = function(pUniform) {
this._pUniforms.push(pUniform);

};
ShaderFragment.prototype.addVarying = function(pVarying) {
this._pVaryings.push(pVarying);

};
ShaderFragment.prototype.addAttr = function(pAttr) {
if (!((this._eType) == (1))) {
var err=((((((("Error:: " + ("Только вершинные шейдеры " + "поддерживают атрибуты.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Только вершинные шейдеры " + "поддерживают атрибуты."));

}


}

;
this._pAttrs.push(pAttr);

};
Object.defineProperty(ShaderFragment.prototype, "flags",  {get: function() {
return this._pFlags;

}
});
Object.defineProperty(ShaderFragment.prototype, "attrs",  {get: function() {
return this._pAttrs;

}
});
Object.defineProperty(ShaderFragment.prototype, "uniforms",  {get: function() {
return this._pUniforms;

}
});
Object.defineProperty(ShaderFragment.prototype, "varyings",  {get: function() {
return this._pVaryings;

}
});
Object.defineProperty(ShaderFragment.prototype, "type",  {get: function() {
return this._eType;

}
, set: function(eType) {
this._eType = eType;

}
});
Object.defineProperty(ShaderFragment.prototype, "mainCode",  {get: function() {
var str=this._pCode[2];
return (str === null? "" : str);

}
, set: function(str) {
this._pCode[2] = str;

}
});
Object.defineProperty(ShaderFragment.prototype, "declCode",  {get: function() {
var str=this._pCode[1];
return (str === null? "" : str);

}
, set: function(str) {
this._pCode[1] = str;

}
});
Object.defineProperty(ShaderFragment.prototype, "globalCode",  {get: function() {
var str=this._pCode[0];
return (str === null? "" : str);

}
, set: function(str) {
this._pCode[0] = str;

}
});
Object.defineProperty(ShaderFragment.prototype, "code",  {get: function() {
return this._pCode;

}
});
function Shader(sName) {
this._sName = sName || null;
this._sSource = null;
this._pShaderFragments = new Array(2);

}

Shader.prototype.dump = function(pWriter) {
pWriter = pWriter || (new a.BinWriter());
pWriter.string(this._sName);
pWriter.string(this._sSource);
var fnWriteObject=function(pObj) {
pWriter.uint16(pObj.length);
for (var i=0; i < (pObj.length); ++i) {
pObj[i].dump(pWriter);

}


};
fnWriteObject(this._pShaderFragments);
return pWriter;

};
Shader.prototype.undump = function(pReader) {
this._sName = pReader.string();
this._sSource = pReader.string();
var fnReadObject=function(pObj, pType) {
var n=pReader.uint16();
for (var i=0; i < n; ++i) {
pObj[i] = new pType().undump(pReader);

}


};
fnReadObject(this._pShaderFragments, a.ShaderFragment);
return this;

};
Object.defineProperty(Shader.prototype, "name",  {get: function() {
return this._sName;

}
, set: function(str) {
this._sName = str;

}
});
Object.defineProperty(Shader.prototype, "vertex",  {get: function() {
return this._pShaderFragments[(1) - 1];

}
, set: function(pShaderFrag) {
this._pShaderFragments[(1) - 1] = pShaderFrag;

}
});
Object.defineProperty(Shader.prototype, "pixel",  {get: function() {
return this._pShaderFragments[(2) - 1];

}
, set: function(pShaderFrag) {
this._pShaderFragments[(2) - 1] = pShaderFrag;

}
});
Object.defineProperty(Shader.prototype, "fragments",  {get: function() {
return this._pShaderFragments;

}
});
Shader.typeLength = function(sType) {
switch(sType) {
case "float":
return 1;

case "int":
return 1;

case "bool":
return 1;

case "vec2":
return 2;

case "vec3":
return 3;

case "vec4":
return 4;

case "ivec2":
return 2;

case "ivec3":
return 3;

case "ivec4":
return 4;

case "bvec2":
return 2;

case "bvec3":
return 3;

case "bvec4":
return 4;

case "mat2":
return 2;

case "mat3":
return 3;

case "mat4":
return 4;

case "sampler2D":
return 1;
}
return 0;

};
Shader.typedValue = function(sType, pData) {
var nLen=a.Shader.typeLength(sType);
if (!nLen) {
var err=((((((("Error:: " + "Недопустимый тип для преобразования данных.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Недопустимый тип для преобразования данных.");

}


}

;
if ((typeof pData) != "string") {
return pData;

}

var dest=null;
if (nLen > 1) {
dest = new Array(nLen);
pData = pData.split(",");
for (var i=0; i < nLen; ++i) {
dest[i] = parseFloat(pData[i]);
if (isNaN(dest[i])) {
if (!0) {
var err=((((((("Error:: " + (((("Для типа данных \"" + sType) + "\", данные \"") + pData) + "\" не подходят.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((((("Для типа данных \"" + sType) + "\", данные \"") + pData) + "\" не подходят."));

}


}

;

}


}


}
else  {
dest = parseFloat(pData);

}

return dest;

};
Shader.getSLTypeCode = function(sType) {
switch(sType) {
case "int":
return 2;

case "float":
return 3;

case "vec2":
return 3;

case "vec3":
return 3;

case "vec4":
return 3;

case "mat3":
return 3;

case "mat4":
return 3;

case "sampler2D":
return 12;

default:
if (!0) {
var err=((((((("Error:: " + (("Unsupported type " + sType) + " used.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Unsupported type " + sType) + " used."));

}


}

;
return 0;
}

};
Shader.getSLTypeClass = function(sType) {
switch(sType) {
case "int":
return 0;

case "float":
return 0;

case "vec2":
return 1;

case "vec3":
return 1;

case "vec4":
return 1;

case "mat3":
return 3;

case "mat4":
return 3;

case "sampler2D":
return 0;

default:
if (!0) {
var err=((((((("Error:: " + (("Unsupported type " + sType) + " used.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Unsupported type " + sType) + " used."));

}


}

;
return 0;
}

};
Shader.getSLTypeColumnsNum = function(sType) {
switch(sType) {
case "vec4":
;

case "vec3":
;

case "vec2":
return 1;

case "mat2":
return 2;

case "mat3":
return 3;

case "mat4":
return 4;

default:
return 0;
}

};
Shader.getSLTypeRowsNum = function(sType) {
switch(sType) {
case "vec4":
return 4;

case "vec3":
return 3;

case "vec2":
return 2;

case "mat2":
return 2;

case "mat3":
return 3;

case "mat4":
return 4;

default:
return 0;
}

};
a.ShaderParam = ShaderParam;
a.ShaderConstant = ShaderConstant;
a.ShaderFlag = ShaderFlag;
a.ShaderVarying = ShaderVarying;
a.ShaderFragment = ShaderFragment;
a.ShaderUniform = ShaderUniform;
a.ShaderAttribute = ShaderAttribute;
a.Shader = Shader;
function ShaderBlend(pEngine) {
this._pEngine = pEngine;
this._pDevice = pEngine.pDevice;
this._pSet = [];
this._pBreakers = [];
this._pCompilied = [];
this._sActivator = "";

}

;
ShaderBlend.prototype._prepareShaderFragment = function(id, pFrag, sPrefix) {
var pBreakers=this._pBreakers;
var i, j, n, tmp;
var pFlags;
var eType=((pFrag.type) == (1)? 0 : 1);
pFrag.applyPrefix(sPrefix);
pFrag.applyConstants();
pFlags = pFrag.flags;
for (i = 0; i < (pFlags.length); ++i) {
tmp = pFlags[i];
n = tmp.size;
if (n) {
for (j = 0; j < n; ++j) {
pBreakers.push([eType, tmp, j]);

}


}
else  {
pBreakers.push([eType, tmp, null]);

}


}


};
ShaderBlend.prototype.appendShader = function(pShader) {
var pSet=this._pSet;
var pBreakers=this._pBreakers;
var id=pShader.id = pSet.length;
var sPrefix=("s" + id) + "_";
var pVertex, pPixel, pFlags;
pBreakers.push([-1, id, pShader._sName]);
pSet.push(pShader);
pVertex = pShader.vertex;
pPixel = pShader.pixel;
this._prepareShaderFragment(id, pVertex, sPrefix);
this._prepareShaderFragment(id, pPixel, sPrefix);
var sActivator=this.genEmptyActivator();
for (var n=this._sActivator.length; n < (sActivator.length); ++n) {
this._sActivator += "0";

}

console.log((((("[DEBUG][" + "") + "][") + "") + "]") + (("Shader program '" + (pShader.name)) + "' is loaded."));

};
ShaderBlend.prototype._buildProgram = function(sActivator) {
var pCompilied=this._pCompilied;
var pBreakers=this._pBreakers;
var pSet=this._pSet;
var pCur, eType;
var pVertex, pPixel, pFlag, pVarys, pVary, pAttrs, pUnis, pAttr, pUni;
var pDevice=this._pDevice;
var pShader, pProgram;
var i, k, len, id;
var pCode=[["", "", ""], ["", "", ""]];
pCompilied[sActivator] = pCur = [pDevice.createProgram(),  {},  {},  {}];
for (i = 0, len = sActivator.length; i < len; ++i) {
if (((sActivator[i]) != "0") && (pBreakers[i])) {
eType = pBreakers[i][0];
if (eType < 0) {
id = pBreakers[i][1];
pVertex = pSet[id].vertex;
pPixel = pSet[id].pixel;
pAttrs = pVertex.attrs;
for (k = 0; k < (pAttrs.length); ++k) {
pAttr = pAttrs[k];
if (!(pCur[1][pAttr.name])) {
pCode[0][1] += (pAttr.str()) + "\n";
pCur[1][pAttr.name] = pAttr;

}


}

pUnis = pVertex.uniforms;
for (k = 0; k < (pUnis.length); ++k) {
pUni = pUnis[k];
if (!(pCur[2][pUni.name])) {
pCode[0][1] += (pUni.str()) + "\n";
pCur[2][pUni.name] = pUni;

}


}

pVarys = pVertex.varyings;
for (k = 0; k < (pVarys.length); ++k) {
pVary = pVarys[k];
if (!(pCur[3][pVary.name])) {
pCode[0][0] += ("varying " + (pVary.str())) + "\n";
pCode[1][0] += ("varying " + (pVary.str())) + "\n";
pCur[3][pVary.name] = pVary;

}


}

var pPixlUni= {};
pUnis = pPixel.uniforms;
for (k = 0; k < (pUnis.length); ++k) {
pUni = pUnis[k];
if ((!(pCur[2][pUni.name])) || (!(pPixlUni[pUni.name]))) {
pCode[1][1] += (pUni.str()) + "\n";
pCur[2][pUni.name] = pUni;
pPixlUni[pUni.name] = true;

}


}

pVarys = pPixel.varyings;
for (k = 0; k < (pVarys.length); ++k) {
pVary = pVarys[k];
if (!(pCur[3][pVary.name])) {
pCode[1][0] += (pVary.str()) + "\n";
pCur[3][pVary.name] = pVary;

}


}

pCode[0][0] += pVertex.globalCode;
pCode[0][2] += pVertex.mainCode;
pCode[1][0] += pPixel.globalCode;
pCode[1][2] += pPixel.mainCode;

}
else  {
pFlag = pBreakers[i][1];
pCode[eType][0] = ((pFlag.str(pBreakers[i][2])) + "\n") + (pCode[eType][0]);

}


}


}

pCur.push(this._finalCode(0, pCode[0]));
pCur.push(this._finalCode(1, pCode[1]));
pProgram = pCur[0];
for (var n=0; n < 2; ++n) {
pShader = pDevice.createShader((n? pDevice.FRAGMENT_SHADER : pDevice.VERTEX_SHADER));
pDevice.shaderSource(pShader, pCur[n + 4]);
pDevice.compileShader(pShader);
if (!(pDevice.getShaderParameter(pShader, pDevice.COMPILE_STATUS))) {
if (1) {
var pDbgWin=new a.DebugWindow("shader errors:");
var pLines=pCur[n + 4].split("\n"), z=1;
pCur[n + 4] = "";
for (var i in pLines) {
pCur[n + 4] += (("\n" + ((z < 10? "0" + z : z))) + " | ") + (pLines[i]);
z++;

}

pDbgWin.print((((("<div style=\"background: #FCC\"><pre>" + (pDevice.getShaderInfoLog(pShader))) + "</pre></div>") + "<pre style=\"background-color: #EEE;\">") + (pCur[n + 4])) + "</pre>");

}
else  {
if (!0) {
var err=((((((("Error:: " + pDevice.getShaderInfoLog(pShader)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(pDevice.getShaderInfoLog(pShader));

}


}

;

}

return false;

}

pDevice.attachShader(pProgram, pShader);

}

pDevice.linkProgram(pProgram);
for (var sName in pCur[2]) {
pUni = pCur[2][sName];
if ((pUni.eClass) == (5)) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "get uniforms location from struct unifroms"));
throw new Error("TODO::\n" + "get uniforms location from struct unifroms");

}
else  {
pUni._pLocation = this._pDevice.getUniformLocation(pCur[0], sName);

}


}

return pCur;

};
ShaderBlend.prototype.getUniformLocation = function(sName, sActivator) {
sActivator = sActivator || (this._sActivator);
var pCur;
if (!(pCur = this._pCompilied[sActivator])) {
return null;

}

return (pCur[2][sName]? pCur[2][sName]._pLocation : -1);

};
ShaderBlend.prototype.uniformList = function(sActivator) {
sActivator = sActivator || (this._sActivator);
var pCur;
if (!(pCur = this._pCompilied[sActivator])) {
return null;

}

return pCur[2];

};
ShaderBlend.prototype.program = function(sActivator) {
sActivator = sActivator || (this._sActivator);
return this._pCompilied[sActivator][0];

};
ShaderBlend.prototype._finalCode = function(eType, pCode) {
if (eType == (0)) {
return ((((pCode[0]) + (pCode[1])) + "\nvoid main(void) {\nvec4 vertex = vec4(0., 0., 0., 0.);\n") + (pCode[2])) + "\ngl_Position = vertex;\n}";

}
else  {
return (((("#ifdef GL_ES\nprecision highp float;\n#endif\n" + (pCode[0])) + (pCode[1])) + "\nvoid main(void) {\nvec4 color = vec4(0., 0., 0., 1.);\n") + (pCode[2])) + "\ngl_FragColor = color;\n}";

}


};
ShaderBlend.prototype.genEmptyActivator = function() {
var pBreakers=this._pBreakers;
var sActivator="";
for (var i=0; i < (pBreakers.length); ++i) {
sActivator += "0";

}

return sActivator;

};
ShaderBlend.prototype.deactivate = function(sName, nValue) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "deactivate [shader fragment / flag]"));
throw new Error("TODO::\n" + "deactivate [shader fragment / flag]");

};
ShaderBlend.prototype.activate = function(sName, nValue) {
--nValue;
var sActivator=this._sActivator;
var pBreakers=this._pBreakers;
for (var i=0; i < (pBreakers.length); ++i) {
if ((pBreakers[i][0]) >= 0) {
if (((pBreakers[i][1]._sName) == sName) && (((nValue !== undefined) && ((pBreakers[i][2]) == nValue)) || (nValue === undefined))) {
sActivator = sActivator.replaceAt(i, "1");

}


}
else if (!nValue) {
if ((pBreakers[i][2]) == sName) {
sActivator = sActivator.replaceAt(i, "1");

}


}



}

this._sActivator = sActivator;

};
ShaderBlend.prototype.hasUniform = function(sName, sActivator) {
sActivator = sActivator || (this._sActivator);
var pCur;
if (!(pCur = this._pCompilied[sActivator])) {
return null;

}

return pCur[2][sName];

};
ShaderBlend.prototype.forcedAssemble = function(sActivator) {
sActivator = sActivator || (this._sActivator);
var pCompilied=this._pCompilied;
if (!(pCompilied[sActivator])) {
this._buildProgram(sActivator);
return true;

}

return false;

};
ShaderBlend.prototype.useProgram = function(sActivator) {
sActivator = sActivator || (this._sActivator);
var pCompilied=this._pCompilied;
var pCur;
if (!(pCur = pCompilied[sActivator])) {
pCur = this._buildProgram(sActivator);

}
else  {

}

if ((a.Shader.pLastShaderProgram) !== (pCur[0])) {
this._pDevice.useProgram(pCur[0]);

}


};
ShaderBlend.prototype.loadCollection = function(sServerUri, sCollection, fnCallback, sPath) {
sPath = sPath || "";
sPath += (sPath.length? "/" : "");
fnCallback = fnCallback || (function(isOk, sErr) {
if (!isOk) {
if (!0) {
var err=((((((("Error:: " + ("Shader collection loading error.\n" + sErr)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Shader collection loading error.\n" + sErr));

}


}

;

}


}
);
var pCollFile=new a.SynchroFile(sServerUri);
var me=this;
pCollFile.open(sCollection, function(e) {
if (!(a.SynchroFile.isPrimaryEvent(e))) {
return ;

}

if (e == (a.SynchroFile.EVENT_FIRST_READING)) {
var pCollection=arguments[1];
if (((pCollection.type) != "collection") || ((pCollection.name) === undefined)) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "Unable to load the collection.");
fnCallback(0);

}

var pShaderList=pCollection.data;
var pCollData=new Array(pShaderList.length);
var fnCheckFin=function() {
for (var i=0; i < (pCollData.length); ++i) {
if (!(pCollData[i])) {
return ;

}


}

for (var i=0; i < (pCollData.length); ++i) {
me.appendShader(new a.Shader().undump(new a.BinReader(pCollData[i])));

}

fnCallback(1);

};
for (var i=0; i < (pShaderList.length); ++i) {
var pFile=new SynchroFile(sServerUri, a.SynchroFile.TYPE_ARRAY_BUFFER);
var sShaderPath=((sPath.length? sPath : a.File.getPath(sCollection))) + (pShaderList[i]);
pFile.i = i;
pFile.open(sShaderPath, function(e) {
if (!(a.SynchroFile.isPrimaryEvent(e))) {
return ;

}

if (e == (a.SynchroFile.EVENT_FIRST_READING)) {
pCollData[this.i] = arguments[1];
fnCheckFin();

}
else if (e == (a.SynchroFile.EVENT_FAILURE)) {
fnCallback(0, ("Cannot load shader resource: " + sShaderPath) + ".");

}



}
);

}


}
else if (e == (a.SynchroFile.EVENT_FAILURE)) {
fnCallback(0, (("Cannot load shader collection resource: " + sServerUri) + sCollection) + ".");

}



}
, a.SynchroFile.FORMAT_JSON);

};
a.Shader.pLastShaderProgram = null;
a.ShaderBlend = ShaderBlend;
function ShaderPrecompiler() {
;

}

ShaderPrecompiler._pSyntax =  {constantWord: "var", constant:  {comment: "comment", min: "min", max: "max", def: "default", step: "step"}, flagWord: "flag", flag:  {comment: "comment"}, typeWord: "type", type:  {vertex: "vertex", pixel: "pixel", fragment: "fragment"}, section:  {global: "global", decl: "declaration", main: "main"}, specComment: "//--", namedSectionExp: function(sName) {
return new RegExp("\\/\\/\\-\\-\\s*" + sName);

}
, rulesExp: /[\n\r]{1}.*\/\/\-\-.+?(?=\/\/|\n|\r|$)|\/\/\-\-.+?(?=\/\/|\n|\r|$)|\/\*\-\-[\s\S]+?\*\//g, descriptionsExp: /[\b\t\n\r]*\/\*.*/g, semanticsExp: /\/\/\-\-.+?(?=\/\/|\n|\r|$)|\/\*\-\-[\s\S]+?\*\//g, propertyExp: /^\s*([a-zA-Z]+)[\s]*.*$/, constExp: /^\s*([a-zA-Z]+)\s+([a-zA-Z0-9\_]+)\s+([a-zA-Z0-9]+)\s*$/, typeExp: /^\s*([a-zA-Z]+)\s+(vertex|pixel|fragment)\s*$/, flagExp: /^\s*([a-zA-Z]+)\s+([a-zA-Z0-9\_]+)(.*)\s*$/, flagValuesExp: /([a-zA-Z0-9\.\-\|]+)/g, flagValueExp: /^([0-9\.\-]+)(\|([a-zA-Z\_0-9]*))?$/, sectionExp: /^\s*\/\/\-\-\s*([a-zA-Z]+)\s*$/, ruleNameExp: /^\s*\\([a-zA-Z]+)\s*(.*)$/, framedStringExp: /^\s*{(.*)}$/, singleStructExp: /\}\s*(\$[\w]+)\s*(\[(\d+)\])?\s*\;/i, isVarDeclExp: /\w[\w\d]+\s+\w[\w\d]*\s*(\[\d+\])?\s*\;/gi, varDeclExp: /(\w[\w\d]+)\s+(\w[\w\d]*)\s*(\[(\d+)\])?\s*\;/, uniformDeclExp: /^\s*uniform.*$/, attrDeclExp: /^[\s]*attribute.*$/, semanticsDataExp: /^\s*([^\s]+)\s*$/, beforeSemicolonExp: /^([^;\s]*).*$/, uniformTypeExp: /^\s*uniform[\s]*([^\s]+).*$/, attrTypeExp: /^[\s]*attribute[\s]*([^\s]+).*$/, isVariableHasSizeExp: /^([^\[]+)\[.+\]$/, variableSizeExp: /\[\s*([\d]+)\s*\]/, indexerExp: /\@(\@?)\s*([\w\$][\w\d]*)\s*\(\s*(\$?\w[\w\.\d]*)\s*\,\s*(\$?\w[\w\.\d]*)\s*\);?/g};
ShaderPrecompiler.extract = function(pShader, sSource, eType) {
var i, j, n, tmp;
var eSection=-1;
var pSyntax=ShaderPrecompiler._pSyntax;
var fnGetRule=function(str) {
return sSource.match(pSyntax.namedSectionExp(str));

};
var pFrag=new a.ShaderFragment(eType);
if (eType == (1)) {
pShader.vertex = pFrag;

}
else if (eType == (2)) {
pShader.pixel = pFrag;

}


var pRules=sSource.match(pSyntax.rulesExp);
if (!pRules) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "Отсутствует разметка шейдера.");
return false;

}

var fnCleanCode=function(sData) {
return sData.replace(pSyntax.semanticsExp, "");

};
function isEmpty(pValue) {
return (((((pValue === "") || (pValue === 0)) || (pValue === "0")) || (pValue === null)) || (pValue === false)) || ((pValue instanceof Array) && ((pValue.length) === 0));

}

function fromframedStringExp(str) {
var pMatch=str.match(pSyntax.framedStringExp);
if (!pMatch) {
return str;

}

return pMatch[1];

}

var pCur=null;
var mainRule=fnGetRule(pSyntax.section.main), declRule=fnGetRule(pSyntax.section.decl), globRule=fnGetRule(pSyntax.section.global);
for (i = 0; i < (pRules.length); ++i) {
if (pRules[i].match(pSyntax.descriptionsExp)) {
var pLines=pRules[i].split("\n"), sLine;
for (n = 0; n < (pLines.length); ++n) {
var pMatches;
if (!(pMatches = pLines[n].match(/^\s*\;(.*)$/))) {
continue ;

}

sLine = pMatches[1];
if ((!(pShader.name)) && ((sLine.charAt(0)) == ";")) {
pShader.name = sLine.substr(1);

}

var pProperty=sLine.match(pSyntax.propertyExp);
if (!(isEmpty(pProperty))) {
var sType=String(pProperty[1]).toLowerCase();
if (sType == (pSyntax.constantWord)) {
pProperty = sLine.match(pSyntax.constExp);
if ((pProperty.length) < 4) {
if (!0) {
var err=((((((("Error:: " + "Неверное объявление константы.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Неверное объявление константы.");

}


}

;
return false;

}

pCur = new a.ShaderConstant();
a.ShaderPrecompiler = ShaderPrecompiler;
pFrag.addConstant(pCur);
pCur.name = pProperty[2];
pCur.type = pProperty[3];

}
else if (sType == (pSyntax.flagWord)) {
pProperty = sLine.match(pSyntax.flagExp);
if (isEmpty(pProperty)) {
if (!0) {
var err=((((((("Error:: " + "Неверный синтаксис флага.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Неверный синтаксис флага.");

}


}

;
return false;

}

pCur = new a.ShaderFlag();
pFrag.addFlag(pCur);
pCur.name = pProperty[2];
if (pProperty[3]) {
pProperty = pProperty[3].match(pSyntax.flagValuesExp);
for (j = 0; j < (pProperty.length); ++j) {
var pFlagValue=pProperty[j].match(pSyntax.flagValueExp);
if (!(isEmpty(pFlagValue))) {
pCur.addValue(pFlagValue[1], pFlagValue[3]);

}


}


}


}
else if (sType == (pSyntax.typeWord)) {

}
else  {
if (!0) {
var err=((((((("Error:: " + (sType + " не поддерживается!")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((sType + " не поддерживается!"));

}


}

;
return false;

}




}
else if (pCur instanceof (a.ShaderConstant)) {
pProperty = sLine.match(pSyntax.ruleNameExp);
if ((isEmpty(pProperty)) || (isEmpty(pProperty[1]))) {
if (!0) {
var err=((((((("Error:: " + "Неверный формат свойства константы.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Неверный формат свойства константы.");

}


}

;
return false;

}

var sValue=pProperty[2];
switch(pProperty[1]) {
case pSyntax.constant.comment:
pCur.comment = fromframedStringExp(sValue);
break ;

case pSyntax.constant.def:
pCur.def = sValue;
break ;

case pSyntax.constant.max:
pCur.max = sValue;
break ;

case pSyntax.constant.min:
pCur.min = sValue;
break ;

case pSyntax.constant.step:
pCur.step = sValue;
break ;

default:
if (!0) {
var err=((((((("Error:: " + (("Свойство константы: \"" + (pProperty[1])) + "\" не подерживается.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Свойство константы: \"" + (pProperty[1])) + "\" не подерживается."));

}


}

;
return false;
}

}
else if (pCur instanceof (a.ShaderFlag)) {
pProperty = sLine.match(pSyntax.ruleNameExp);
if ((isEmpty(pProperty)) || (isEmpty(pProperty[1]))) {
if (!0) {
var err=((((((("Error:: " + "Неверный формат свойства флага.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Неверный формат свойства флага.");

}


}

;

}

switch(pProperty[1]) {
case pSyntax.flag.comment:
pCur.comment = fromframedStringExp(pProperty[2]);
break ;

default:
if (!0) {
var err=((((((("Error:: " + (("Свойство флага: \"" + (pProperty[1])) + "\" не подерживается.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Свойство флага: \"" + (pProperty[1])) + "\" не подерживается."));

}


}

;
return false;
}

}




}


}

if (!(isEmpty(tmp = pRules[i].match(pSyntax.sectionExp)))) {
var sSection=tmp[1];
var nFrom, nTo;
nFrom = (sSource.indexOf(pRules[i])) + (pRules[i].length);
switch(sSection) {
case pSyntax.section.decl:
eSection = 1;
nTo = sSource.indexOf(mainRule);
break ;

case pSyntax.section.global:
eSection = 0;
nTo = sSource.indexOf(declRule);
nTo = (nTo >= 0? nTo : sSource.indexOf(mainRule));
break ;

case pSyntax.section.main:
eSection = 2;
nTo = sSource.length;
break ;
}
pFrag.code[eSection] = fnCleanCode(sSource.substr(nFrom, nTo - nFrom));

}

if (eSection == (1)) {
if (!(isEmpty(tmp = pRules[i].match(pSyntax.singleStructExp)))) {
var sUStructName=tmp[1];
var sUStructSize=(tmp[2]? parseInt(tmp[3]) : 0);
var sCode=pFrag.declCode;
var n=sCode.indexOf(sUStructName), e=n, nScopes=0;
var c=null;
var canQuit=0;
while (!(e < 0)) {
e--;
c = sCode[e];
if (c == "{") {
nScopes--;

}

if (c == "}") {
nScopes++, canQuit = 1;

}

if (canQuit && (!nScopes)) {
break ;

}


}
var sStruct=sCode.substr(e + 1, (n - e) - 3);
var pUniform=ShaderPrecompiler._buildStructVar(sUStructName, sUStructSize, sStruct, a.ShaderUniform);
var iPos=pRules[i].indexOf(pSyntax.specComment);
var sSemantics=pRules[i].substr(iPos + 4, pRules[i].length);
pUniform.name = sSemantics.match(pSyntax.semanticsDataExp)[1];
pFrag.addUniform(pUniform);

}

if (!(isEmpty(pRules[i].match(pSyntax.uniformDeclExp)))) {
var iPos=pRules[i].indexOf(pSyntax.specComment);
var sSemantics=pRules[i].substr(iPos + 4, pRules[i].length);
var iPos2=pRules[i].indexOf("$");
var sUName=pRules[i].substr(iPos2, iPos - iPos2).match(pSyntax.beforeSemicolonExp)[1];
var sUType=pRules[i].match(pSyntax.uniformTypeExp)[1];
var sUSize=0;
var pUniform=new a.ShaderUniform();
if (tmp = sUName.match(pSyntax.isVariableHasSizeExp)) {
sUSize = sUName.substr(tmp[1].length, sUName.length);
sUSize = sUName.match(pSyntax.variableSizeExp);
if ((sUSize.length) && ((sUSize.length) > 0)) {
sUSize = sUSize[1];

}

sUName = tmp[1];
sUSize = parseInt(sUSize);

}

pUniform.usage = sUName;
pUniform.type = sUType;
pUniform.size = sUSize;
pUniform.name = sSemantics.match(pSyntax.semanticsDataExp)[1];
pFrag.addUniform(pUniform);

}

if (!(isEmpty(pRules[i].match(pSyntax.attrDeclExp)))) {
var iPos=pRules[i].indexOf(pSyntax.specComment);
var sSemantics=pRules[i].substr(iPos + 4, pRules[i].length);
var iPos2=pRules[i].indexOf("$");
var sAName=pRules[i].substr(iPos2, iPos - iPos2).match(pSyntax.beforeSemicolonExp)[1];
var sAType=pRules[i].match(pSyntax.attrTypeExp)[1];
var sASize=0;
var pAttr=new a.ShaderAttribute();
if (tmp = sAName.match(pSyntax.isVariableHasSizeExp)) {
sASize = sAName.substr(tmp[1].length, sAName.length);
sASize = sAName.match(pSyntax.variableSizeExp);
if ((sASize.length) && ((sASize.length) > 0)) {
sASize = sASize[1];

}

sAName = tmp[1];
sASize = parseInt(sASize);

}

pAttr.usage = sAName;
pAttr.type = sAType;
pAttr.size = sASize;
pAttr.name = sSemantics.match(pSyntax.semanticsDataExp)[1];
pFrag.addAttr(pAttr);

}


}


}

var fnIndexer=function(str, sVarying, sVarName, sIndexerName, sAttr) {
var sConst=("__" + sVarName) + "_MI_";
var dest=(("#ifndef " + sConst) + "\n#define ") + sConst;
dest += ((((((((((((((("\nvec4 " + sVarName) + " = texture2D (") + sIndexerName) + ".d, vec2(mod(") + sAttr) + ", ") + sIndexerName) + ".p.x)*") + sIndexerName) + ".p.y, floor(") + sAttr) + " * ") + sIndexerName) + ".p.y) * ") + sIndexerName) + ".p.z));";
dest += "\n#endif";
if (sVarying) {
dest += ("\n#ifndef " + sConst) + "v";
dest += ("\n#define " + sConst) + "v";
var sName="v" + sVarName;
if (!(pFrag.hasVarying(sName))) {
var pVaryng=new a.ShaderVarying();
pVaryng.name = "v" + sVarName;
pVaryng.type = "vec4";
pFrag.addVarying(pVaryng);

}

dest += ((("\nv" + sVarName) + " = ") + sVarName) + ";";
dest += "\n#endif";

}

return dest;

};
var pUniforms=pFrag.uniforms;
var pAttrs=pFrag.attrs;
var pCode=pFrag.code;
var fnVar2Semantics=function(pObj, sCode) {
for (var n=0, iLen=pObj.length; n < iLen; ++n) {
tmp = pObj[n].name;
sCode = sCode.split(pObj[n].usage).join(tmp);

}

return sCode;

};
for (i = 0; i < (pCode.length); ++i) {
sCode = pCode[i];
if (sCode) {
if ((i == (2)) && (eType == (1))) {
sCode = sCode.replace(pSyntax.indexerExp, fnIndexer);

}

sCode = fnVar2Semantics(pAttrs, sCode);
sCode = fnVar2Semantics(pUniforms, sCode);
pCode[i] = sCode;

}


}

for (var n=0, iLen=pAttrs.length; n < iLen; ++n) {
delete (pAttrs[n].usage);

}

for (var n=0, iLen=pUniforms.length; n < iLen; ++n) {
delete (pUniforms[n].usage);

}

return true;

};
ShaderPrecompiler.create = function(pShader, sVertex, sPixel) {
if ((!(ShaderPrecompiler.extract(pShader, sVertex, 1))) || (!(ShaderPrecompiler.extract(pShader, sPixel, 2)))) {
return false;

}

return true;

};
ShaderPrecompiler._buildStructVar = function(sName, nSize, sContent, pType) {
var pVar=new pType();
var pSyntax=ShaderPrecompiler._pSyntax;
var pDefs=sContent.match(pSyntax.isVarDeclExp);
var pMatchResult, pMember;
pVar.usage = sName;
pVar.size = nSize;
pVar.type = [];
for (var key in pDefs) {
pMatchResult = pDefs[key].match(pSyntax.varDeclExp);
pMember = new pType();
pMember.name = pMatchResult[2];
pMember.type = pMatchResult[1];
pMember.size = (pMatchResult[4]? parseInt(pMatchResult[4]) : 0);
pVar.type.push(pMember);

}

return pVar;

};
a.ShaderPrecompiler = ShaderPrecompiler;
function SystemRequirement() {
this._eType;
this._eTarget;
this._pAccess = [];
this._pDenied = [];

}

SystemRequirement.prototype.test = function() {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "проверять все системные требования."));
throw new Error("TODO::\n" + "проверять все системные требования.");
return true;

};
function EffectPassState(eType, eValue) {
this.eType = (eType === undefined? null : eType);
this.eValue = (eValue === undefined? null : eValue);

}

EffectPassState.renderStateTypeFromString = function(sType) {
switch(sType.toUpperCase()) {
case "ZENABLE":
return 7;

case "ZWRITEENABLE":
return 14;

case "SRCBLEND":
return 19;

case "DESTBLEND":
return 20;

case "CULLMODE":
return 22;

case "ZFUNC":
return 23;

case "DITHERENABLE":
return 26;

case "ALPHABLENDENABLE":
return 27;

case "ALPHATESTENABLE":
return 28;

default:
if (!0) {
var err=((((((("Error:: " + (("Unsupported render state type used: " + sType) + ".")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Unsupported render state type used: " + sType) + "."));

}


}

;
return null;
}

};
EffectPassState.renderStateValueFromString = function(eState, sValue) {
switch(eState) {
case 27:
;

case 28:
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "ALPHABLENDENABLE/ALPHATESTENABLE not supported in WebGL.");

case 26:
;

case 7:
;

case 14:
switch(String(sValue).toUpperCase()) {
case "TRUE":
return true;

case "FALSE":
return false;

default:
if (!0) {
var err=((((((("Error:: " + (("Unsupported render state ALPHABLENDENABLE/ZENABLE/ZWRITEENABLE/DITHERENABLE value used: " + sValue) + ".")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Unsupported render state ALPHABLENDENABLE/ZENABLE/ZWRITEENABLE/DITHERENABLE value used: " + sValue) + "."));

}


}

;
return null;
}
break ;

case 19:
;

case 20:
switch(String(sValue).toUpperCase()) {
case "ZERO":
return 0;

case "ONE":
return 1;

case "SRCCOLOR":
return 768;

case "INVSRCCOLOR":
return 769;

case "SRCALPHA":
return 770;

case "INVSRCALPHA":
return 771;

case "DESTALPHA":
return 772;

case "INVDESTALPHA":
return 773;

case "DESTCOLOR":
return 774;

case "INVDESTCOLOR":
return 775;

case "SRCALPHASAT":
return 776;

default:
if (!0) {
var err=((((((("Error:: " + (("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue) + ".")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue) + "."));

}


}

;
return null;
}
break ;

case 22:
switch(String(sValue).toUpperCase()) {
case "NONE":
return 0;

case "CW":
return 1028;

case "CCW":
return 1029;

case "FRONT_AND_BACK":
return 1032;

default:
if (!0) {
var err=((((((("Error:: " + (("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue) + ".")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue) + "."));

}


}

;
return null;
}
break ;

case 23:
switch(String(sValue).toUpperCase()) {
case "NEVER":
return 1;

case "LESS":
return 2;

case "EQUAL":
return 3;

case "LESSEQUAL":
return 4;

case "GREATER":
return 5;

case "NOTEQUAL":
return 6;

case "GREATEREQUAL":
return 7;

case "ALWAYS":
return 8;

default:
if (!0) {
var err=((((((("Error:: " + (("Unsupported render state ZFUNC value used: " + sValue) + ".")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Unsupported render state ZFUNC value used: " + sValue) + "."));

}


}

;
return null;
}
break ;
}

};
function EffectDesc(sDesc, nParams, nTechniques) {
this.sDesc = sDesc || null;
this.nParameters = nParams || 0;
this.nTechniques = nTechniques || 0;

}

function EffectTechniqueDesc(sName, nPasses) {
this.sName = sName || "";
this.nPasses = nPasses || 0;

}

function EffectParam(sName, eClass, eType, iRows, iColumns, iElements, iStructMembers) {
EffectParam.superclass.constructor.apply(this, arguments);
var sSemantics;
var tmp;
if (tmp = sName.match(/^\s*([\w+]+)\s*(\:\s*([\w]+))?\s*$/)) {
sName = tmp[1];
sSemantics = (tmp[3]) || null;

}

this._pValue = null;
this.sName = sName;
this.sSemantics = sSemantics || null;
this.eClass = eClass;
this.eType = eType;
this.iRows = iRows || 0;
this.iColumns = iColumns || 0;
this.iElements = iElements || 0;
this.iStructMembers = iStructMembers || 0;
this._pDevice = null;
this._pEngine = null;

}

a.extend(EffectParam, a.ParameterDesc);
function EffectFloat32(sName) {
EffectFloat32.superclass.constructor.call(this, sName, 0, 3, 0, 1, 1, 0);
this._pValue = 0;
this._isModified = true;

}

a.extend(EffectFloat32, EffectParam);
EffectFloat32.prototype.set = function(pShaderBlend, pValue) {
pValue = pValue || 0;
if (pValue != (this._pValue)) {
this._pValue = pValue;
this._isModified = true;

}

var pLoc=pShaderBlend.getUniformLocation(this.sName);
if ((this._isModified) && (pLoc != (-1))) {
this._pDevice.uniform1f(pLoc, pValue);
this._isModified = false;

}


};
Object.defineProperty(EffectFloat32.prototype, "val",  {set: function(pValue) {
this._pValue = pValue;

}
, get: function() {
return this._pValue;

}
});
function EffectMat3(sName, iElements) {
iElements = iElements || 0;
EffectMat3.superclass.constructor.call(this, sName, 3, 3, 3, 3, iElements, 0);
this._pValue = new glMatrixArrayType(9);
this._isModified = true;

}

a.extend(EffectMat3, EffectParam);
EffectMat3.prototype.set = function(pShaderBlend, pMatrix) {
if (!pMatrix) {
return ;

}

var pVal=this._pValue;
for (var i=0, n=pMatrix.length; i < n; ++i) {
if ((pVal[i]) !== (pMatrix[i])) {
this._isModified = true;
pVal[0] = pMatrix[0];
pVal[1] = pMatrix[1];
pVal[2] = pMatrix[2];
pVal[3] = pMatrix[3];
pVal[4] = pMatrix[4];
pVal[5] = pMatrix[5];
pVal[6] = pMatrix[6];
pVal[7] = pMatrix[7];
pVal[8] = pMatrix[8];
pVal[9] = pMatrix[9];
break ;

}


}

var pLoc=pShaderBlend.getUniformLocation(this.sName);
if ((this._isModified) && (pLoc != (-1))) {
this._pDevice.uniformMatrix3fv(pLoc, false, pVal);
this._isModified = false;

}


};
Object.defineProperty(EffectMat3.prototype, "val",  {set: function(pValue) {
if (pValue instanceof Array) {
if (!(pValue.length)) {
this._pValue = Mat4.identity(new Float32Array(9));

}
else  {
this._pValue = new Float32Array(pValue);

}


}
else  {
this._pValue = pValue;

}


}
, get: function() {
return this._pValue;

}
});
function EffectMat4(sName, iElements) {
iElements = iElements || 0;
EffectMat4.superclass.constructor.call(this, sName, 3, 3, 4, 4, iElements, 0);
this._pValue = new glMatrixArrayType(16);
this._isModified = true;

}

a.extend(EffectMat4, EffectParam);
EffectMat4.prototype.set = function(pShaderBlend, pMatrix) {
if (!pMatrix) {
return ;

}

var pVal=this._pValue;
for (var i=0, n=pMatrix.length; i < n; ++i) {
if ((pVal[i]) != (pMatrix[i])) {
this._isModified = true;
pVal[0] = pMatrix[0];
pVal[1] = pMatrix[1];
pVal[2] = pMatrix[2];
pVal[3] = pMatrix[3];
pVal[4] = pMatrix[4];
pVal[5] = pMatrix[5];
pVal[6] = pMatrix[6];
pVal[7] = pMatrix[7];
pVal[8] = pMatrix[8];
pVal[9] = pMatrix[9];
pVal[10] = pMatrix[10];
pVal[11] = pMatrix[11];
pVal[12] = pMatrix[12];
pVal[13] = pMatrix[13];
pVal[14] = pMatrix[14];
pVal[15] = pMatrix[15];
break ;

}


}

var pLoc=pShaderBlend.getUniformLocation(this.sName);
if ((this._isModified) && (pLoc != (-1))) {
this._pDevice.uniformMatrix4fv(pLoc, false, pVal);
this._isModified = false;

}


};
Object.defineProperty(EffectMat4.prototype, "val",  {set: function(pValue) {
if (pValue instanceof Array) {
if (!(pValue.length)) {
this._pValue = Mat4.identity(new Float32Array(16));

}
else  {
this._pValue = new Float32Array(pValue);

}


}
else  {
this._pValue = pValue;

}


}
, get: function() {
return this._pValue;

}
});
function EffectVec3(sName, iElements) {
iElements = iElements || 0;
EffectVec3.superclass.constructor.call(this, sName, 1, 3, 3, 1, iElements, 0);
this._pValue = new glMatrixArrayType(3);
this._isModified = true;

}

a.extend(EffectVec3, EffectParam);
EffectVec3.prototype.set = function(pShaderBlend, pVector) {
if (!pVector) {
return ;

}

var pVal=this._pValue;
for (var i=0, n=pVector.length; i < n; i++) {
if ((pVal[i]) != (pVector[i])) {
this._isModified = true;
pVal[0] = pVector[0];
pVal[1] = pVector[1];
pVal[2] = pVector[2];
break ;

}


}

var pLoc=pShaderBlend.getUniformLocation(this.sName);
if ((this._isModified) && (pLoc != (-1))) {
this._pDevice.uniform3fv(pLoc, pVal);
this._isModified = false;

}


};
Object.defineProperty(EffectVec3.prototype, "val",  {set: function(pValue) {
if (pValue instanceof Array) {
if (!(pValue.length)) {
this._pValue = new Float32Array([0, 0, 0]);

}
else  {
this._pValue = new Float32Array(pValue);

}


}
else  {
this._pValue = pValue;

}


}
, get: function() {
return this._pValue;

}
});
function EffectVec4(sName, iElements) {
iElements = iElements || 0;
EffectVec4.superclass.constructor.call(this, sName, 1, 3, 4, 1, iElements, 0);
this._pValue = new glMatrixArrayType(4);
this._isModified = true;

}

a.extend(EffectVec4, EffectParam);
EffectVec4.prototype.set = function(pShaderBlend, pVector) {
if (!pVector) {
return ;

}

var pVal=this._pValue;
for (var i=0, n=pVector.length; i < n; i++) {
if ((pVal[i]) != (pVector[i])) {
this._isModified = true;
pVal[0] = pVector[0];
pVal[1] = pVector[1];
pVal[2] = pVector[2];
pVal[3] = pVector[3];
break ;

}


}

var pLoc=pShaderBlend.getUniformLocation(this.sName);
if ((this._isModified) && (pLoc != (-1))) {
switch(this.iRows) {
case 4:
this._pDevice.uniform4fv(pLoc, pVal);
break ;

case 3:
this._pDevice.uniform3fv(pLoc, pVal);
break ;

case 2:
this._pDevice.uniform2fv(pLoc, pVal);
break ;

default:
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "only vec4, vec3, vec2 supported!"));
throw new Error("TODO::\n" + "only vec4, vec3, vec2 supported!");
}
this._isModified = false;

}


};
Object.defineProperty(EffectVec4.prototype, "val",  {set: function(pValue) {
if (pValue instanceof Array) {
if (!(pValue.length)) {
this._pValue = new Float32Array([0, 0, 0, 0]);

}
else  {
this._pValue = new Float32Array(pValue);

}


}
else  {
this._pValue = pValue;

}


}
, get: function() {
return this._pValue;

}
});
function EffectTexture(sName, eType) {
eType = eType || (7);
EffectTexture.superclass.constructor.call(this, sName, 4, eType);
this._pValue = null;
this._pSamplers = [];
this._pLastSampler = null;
this._nActiveSlot = -1;

}

a.extend(EffectTexture, EffectParam);
EffectTexture.prototype.set = function(pBlend, pTexture, isCubeTexture) {
if ((this._pValue) != pTexture) {
this._pValue = pTexture;
if (!(this._pValue)) {
return ;

}

if (isCubeTexture) {
this.eType = 9;

}

var pSamplers=this._pSamplers;
for (var i=0, n=pSamplers.length; i < n; i++) {
if (pBlend.hasUniform(pSamplers[i].sName)) {
pSamplers[i].eType = 14;
pSamplers[i].use(pBlend, this._pValue);
this._pLastSampler = pSamplers[i];
break ;

}


}


}


};
function EffectShader(sName) {
EffectShader.superclass.constructor.apply(this, arguments);
this._pValue = null;

}

a.extend(EffectShader, EffectParam);
Object.defineProperty(EffectShader.prototype, "val",  {set: function(pValue) {
var pEffect=this._pEffect;
if (pEffect._pShaders[this.sName] !== undefined) {
return ;

}

var sVertexName=pValue.vertex;
var sPixelName=pValue.pixel;
var sVertex=pEffect._pVertexFragments[sVertexName]._sCode;
var sPixel=pEffect._pPixelFragments[sPixelName]._sCode;
if ((!(sVertex !== undefined)) || (!(sPixel !== undefined))) {
if (!0) {
var err=((((((("Error:: " + "Шейдерные фрагменты не найдены.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Шейдерные фрагменты не найдены.");

}


}

;

}

var pShader=new a.Shader(this.sName);
if ((a.ShaderPrecompiler.create(pShader, sVertex, sPixel)) == true) {
this._pValue = pShader;
var pFrags=pShader._pShaderFragments;
for (var n=0; n < (pFrags.length); ++n) {
var pUniforms=pFrags[n]._pUniforms;
for (var i=0; i < (pUniforms.length); ++i) {
var pParameter=pUniforms[i];
if (!(pEffect._pParametersByName[pParameter.sName] !== undefined)) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("add parameter: " + (pParameter.sName)));
pParameter._isUsed = true;
pEffect._pParametersByName[pParameter.sName] = pParameter;

}
else  {
pEffect._pParametersByName[pParameter.sName]._isUsed = true;

}


}


}


}
else  {
if (!0) {
var err=((((((("Error:: " + ("Невозможно прекомпилировать шейдер: " + (this.sName))) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Невозможно прекомпилировать шейдер: " + (this.sName)));

}


}

;

}


}
});
function EffectSamplerParam(pName, pValue) {
this.eName = 0;
this.eValue = 0;
if (arguments.length) {
this.apply(pName, pValue);

}


}

EffectSamplerParam.prototype.apply = function(pName, pValue) {
if ((typeof pName) == "string") {
pName = a.EffectSamplerParam.paramTypeFromString(pName);

}

if ((typeof pValue) == "string") {
pValue = a.EffectSamplerParam.paramValueFromString(pName, pValue);

}

this.eName = pName;
this.eValue = pValue;
return this;

};
EffectSamplerParam.paramTypeFromString = function(sType) {
switch(sType.toUpperCase()) {
case "MAGFILTER":
return a.Texture.Param.MAG_FILTER;

case "MINFILTER":
return a.Texture.Param.MIN_FILTER;

case "ADDRESSU":
return a.Texture.Param.WRAP_S;

case "ADDRESSV":
return a.Texture.Param.WRAP_T;

default:
if (!0) {
var err=((((((("Error:: " + ("Unsupported sampler parameter: " + sType)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Unsupported sampler parameter: " + sType));

}


}

;
return null;
}

};
EffectSamplerParam.paramValueFromString = function(eType, sValue) {
switch(eType) {
case a.Texture.Param.MAG_FILTER:
switch(sValue.toUpperCase()) {
case "LINEAR":
return a.Texture.MagFilter.LINEAR;

case "NEAREST":
return a.Texture.MagFilter.NEAREST;
}
break ;

case a.Texture.Param.MIN_FILTER:
switch(sValue.toUpperCase()) {
case "LINEAR":
return 9987;

case "LINEAR_NEAREST":
return 9985;

case "NEAREST_LINEAR":
return 9986;

case "NEAREST":
return 9984;
}
break ;

case a.Texture.Param.WRAP_T:
;

case a.Texture.Param.WRAP_S:
switch(sValue.toUpperCase()) {
case "WRAP":
return a.Texture.WrapMode.REPEAT;

case "CLAMP":
return a.Texture.WrapMode.CLAMP_TO_EDGE;

case "MIRROR":
return a.Texture.WrapMode.MIRRORED_REPEAT;
}
break ;

default:
if (!0) {
var err=((((((("Error:: " + ("Unsupported sampler parameter: " + str)) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error(("Unsupported sampler parameter: " + str));

}


}

;
return null;
}

};
function EffectSampler(sName) {
EffectSampler.superclass.constructor.apply(this, arguments);
this._pParameters = [];
this._pTexture = null;
this.sName = sName;
this.eClass = 0;
this.eType = 12;

}

a.extend(EffectSampler, EffectParam);
Object.defineProperty(EffectSampler.prototype, "val",  {set: function(pValue) {
var sValue, pTexture;
for (var sName in pValue) {
sValue = pValue[sName];
sName = sName.toLowerCase();
if (sName == "texture") {
pTexture = this._pEffect._pParametersByName[sValue];
pTexture._isUsed = true;
pTexture._pSamplers.push(this);
this._pTexture = pTexture;

}
else  {
this._pParameters.push(new a.EffectSamplerParam(sName, sValue));

}


}


}
, get: function() {
return this;

}
});
EffectSampler.prototype.use = function(pBlend, pTexture) {
return ;
var pParams=this._pParameters;
var pDevice=this._pDevice;
var eTarget=pDevice.TEXTURE_2D;
pDevice.bindTexture(eTarget, pTexture);
for (var i=0, n=pParams.length; i < n; ++i) {
pDevice.texParameteri(eTarget, pParams[i].eName, pParams[i].eValue);

}

pDevice.bindTexture(eTarget, null);

};
function EffectPass(sName, pEffect) {
this._pEffect = pEffect || null;
this._pEngine = pEffect._pEngine;
this.pStates = [];
this.pShaderBlend = null;
this.sName = sName || null;

}

Object.defineProperty(EffectPass.prototype, "val",  {set: function(pValue) {
var pEffect=this._pEffect;
var pBlender=this.pShaderBlend = new a.ShaderBlend(this._pEngine);
var pEffectShaders=pEffect._pShadersByName;
var pShader, sParams, pParams;
var pStates, eState, eValue, pShaders;
var tmp, pMatches;
if (pValue instanceof Object) {
for (var key in pValue) {
switch(key) {
case "state":
pStates = pValue[key];
for (var sState in pStates) {
var pVal=pStates[sState];
eState = a.EffectPassState.renderStateTypeFromString(sState);
if ((typeof pValue) == "string") {
eValue = a.EffectPassState.renderStateValueFromString(eState, pValue);

}
else  {
eValue = pVal;

}

this.pStates.push(new a.EffectPassState(eState, eValue));

}

break ;

case "shaders":
pShaders = pValue[key];
for (var i in pShaders) {
pShader = pEffectShaders[pShaders[i]]._pValue;
pBlender.appendShader(pShader);
pBlender.activate(pShader._sName);

}

break ;

case "params":
sParams = pValue[key];
pParams = sParams.split(",");
for (i = 0; i < (pParams.length); ++i) {
if (pMatches = pParams[i].match(/^\s*set\s*([\w\d\_]+)(\s*\=([\d]+))?\s*$/)) {
pBlender.activate(pMatches[1], pMatches[3]);

}
else  {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + ("ignored effect pass parameter: " + (pParams[i])));

}


}

break ;
}

}

pBlender.forcedAssemble();

}
else  {
if (!0) {
var err=((((((("Error:: " + "Incorrect input value for effect pass.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Incorrect input value for effect pass.");

}


}

;

}


}
});
function EffectTechnique(sName) {
this._pPasses = [];
this._sName = sName || null;
this._pRequirements = [];
this._nCurrentPass = 0;

}

EffectTechnique.prototype.currentBlend = function() {
return this._pPasses[this._nCurrentPass].pShaderBlend;

};
EffectTechnique.prototype.getPass = function(iPass) {
return this._pPasses[iPass];

};
EffectTechnique.prototype.isValid = function() {
var pReqs=this._pRequirements;
for (var i=0, n=pReqs.length; i < n; ++i) {
if (!(pReqs[i].test())) {
return false;

}


}

return true;

};
Object.defineProperty(EffectTechnique.prototype, "val",  {set: function(pValue) {
if (pValue instanceof Array) {
for (var i=0; i < (pValue.length); ++i) {
this._pPasses.push(pValue[i]);
pValue[i]._pTechnique = this;
pValue[i]._pDevice = this._pDevice;
pValue[i]._pEngine = this._pEngine;

}


}
else  {
if (!0) {
var err=((((((("Error:: " + "Incorrect input value for effect technique.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Incorrect input value for effect technique.");

}


}

;

}


}
});
function EffectFragment(sName, eType) {
EffectFragment.superclass.constructor.apply(this, arguments);
this.eType = eType || (19);
this.sName = sName || null;
this.eClass = 4;
this._sCode = null;

}

a.extend(EffectFragment, a.ParameterDesc);
Object.defineProperty(EffectFragment.prototype, "val",  {set: function(sCode) {
this._sCode = sCode;

}
});
function Effect(pEngine) {
this._pEngine = pEngine;
this._pDevice = pEngine.pDevice;
this._pTechniques = [];
this._pTechniquesByName =  {};
this._pActiveTechnique = null;
this._pParameters = [];
this._pParametersByName =  {};
this._pShaders = [];
this._pShadersByName =  {};
this._pPixelFragments =  {};
this._pVertexFragments =  {};
this._sDesc = null;

}

Object.defineProperty(Effect.prototype, "param",  {set: function(pParam) {
pParam._pEffect = this;
pParam._pDevice = this._pDevice;
pParam._pEngine = this._pEngine;
this._pParametersByName[pParam.sName] = pParam;

}
});
Effect.prototype.setValue = function(sName, pData) {
if (pData instanceof Float32Array) {
if (((pData.length) === 16) || ((pData.length) === 9)) {
this.setMatrix(sName, pData);

}
else if (((pData.length) === 4) || ((pData.length) === 3)) {
this.setVector(sName, pData);

}
else  {
console.log(arguments);
throw new Error("setValue() support only Matrix & Vector");

}



}
else if ((typeof pData) == "number") {
this.setFloat32(sName, pData);

}
else  {
throw new Error(("setValue(" + sName) + ") support only Float32Array/Float32 data type.");

}


return true;

};
Effect.prototype.setMatrix = function(sName, pMatrix) {
this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(), pMatrix);

};
Effect.prototype.setVector = function(sName, pVector) {
this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(), pVector);

};
Effect.prototype.setFloat32 = function(sName, pValue) {
this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(), pValue);

};
Effect.prototype.setTexture = function(sName, pTexture, isCubeTexture) {
this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(), pTexture, isCubeTexture);

};
Effect.prototype.verify = function() {
var pParams=this._pParametersByName;
for (var i in pParams) {
if (!(pParams[i]._isUsed)) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + ("Unused parameter in effect file: " + (pParams[i].sName)));

}

this._pParameters.push(pParams[i]);

}


};
Effect.prototype.getParameterDesc = function(sParameter) {
var pParameter=this._pParametersByName[sParameter];
if (pParameter !== undefined) {
return pParameter;

}

return null;

};
Effect.prototype.begin = function(eFlags) {
return true;

};
Effect.prototype.end = function() {
return true;

};
Effect.prototype.beginPass = function(nPass) {
this._pActiveTechnique._nCurrentPass = nPass;
var pPass=this._pActiveTechnique._pPasses[nPass];
var pDevice=this._pDevice;
if (!pPass) {
var err=((((((("Error:: " + "Данный проход не существует.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Данный проход не существует.");

}


}

;
for (var i=0, n=pPass.pStates.length; i < n; i++) {
var pState=pPass.pStates[i];
pDevice.setRenderState(pState.eType, pState.eValue);

}

pPass.pShaderBlend.useProgram();
return true;

};
Effect.prototype.endPass = function() {
var pDevice=this._pDevice;
var pBlend=this._pActiveTechnique.currentBlend();
for (i = 0, n = this._pParameters.length; i < n; i++) {
var pParam=this._pParameters[i];
if (pParam.set) {
if (pBlend.hasUniform(pParam.sName)) {
pParam.set(pBlend, pParam._pValue);

}


}


}

var pUniforms=pBlend.uniformList();
for (var i in pUniforms) {
if ((((((pUniforms[i].eType) === (12)) || ((pUniforms[i].eType) === (11))) || ((pUniforms[i].eType) === (10))) || ((pUniforms[i].eType) === (13))) || ((pUniforms[i].eType) == (14))) {
var pSampler=this._pParametersByName[pUniforms[i].sName];
var pTexture=pSampler._pTexture;
if ((pTexture._pValue) == null) {
continue ;

}

if ((pTexture._pLastSampler) !== pSampler) {
pSampler.use(pBlend, pTexture._pValue);

}

if ((Effect.pActiveTextures[pTexture._nActiveSlot]) != pTexture) {
if ((Effect.nLastActiveTexture) == 15) {
Effect.nLastActiveTexture = 0;

}
else  {
Effect.nLastActiveTexture++;

}

var nActiveTex=Effect.nLastActiveTexture;
pDevice.activeTexture((33984) + nActiveTex);
if ((pTexture.eType) == (9)) {
pDevice.bindTexture(34067, pTexture._pValue);

}
else  {
pDevice.bindTexture(pDevice.TEXTURE_2D, pTexture._pValue);

}

Effect.pActiveTextures[nActiveTex] = pTexture;
pTexture._nActiveSlot = nActiveTex;

}

pDevice.uniform1i(pUniforms[i]._pLocation, pTexture._nActiveSlot);

}


}


};
Effect.prototype.shaderProgram = function() {
var pTech=this._pActiveTechnique;
return pTech._pPasses[pTech._nCurrentPass].pShaderBlend.program();

};
Effect.prototype.mat4 = function(sName, iElements) {
var t=new a.EffectMat4(sName, iElements);
this.param = t;
return t;

};
Effect.prototype.mat3 = function(sName, iElements) {
var t=new a.EffectMat3(sName, iElements);
this.param = t;
return t;

};
Effect.prototype.vec4 = function(sName, iElements) {
var t=new a.EffectVec4(sName, iElements);
this.param = t;
return t;

};
Effect.prototype.vec3 = function(sName, iElements) {
var t=new a.EffectVec3(sName, iElements);
this.param = t;
return t;

};
Effect.prototype.float32 = function(sName) {
var t=new a.EffectFloat32(sName);
this.param = t;
return t;

};
Effect.prototype.texture = function(sName, iElements) {
var t=new a.EffectTexture(sName, iElements);
this.param = t;
return t;

};
Effect.prototype.sampler = function(sName) {
var t=new a.EffectSampler(sName);
this.param = t;
return t;

};
Effect.prototype.vertex = function(sName) {
var t=new a.EffectFragment(sName, 18);
this._pVertexFragments[sName] = t;
return t;

};
Effect.prototype.pixel = function(sName) {
var t=new a.EffectFragment(sName, 17);
this._pPixelFragments[sName] = t;
return t;

};
Effect.prototype.technique = function(sName) {
var t=new a.EffectTechnique(sName);
t._pEffect = this;
t._pDevice = this._pDevice;
t._pEngine = this._pEngine;
this._pTechniques.push(t);
this._pTechniquesByName[sName] = t;
return t;

};
Effect.prototype.shader = function(sName) {
var t=new a.EffectShader(sName);
t._pEffect = this;
this._pShaders.push(t);
this._pShadersByName[sName] = t;
return t;

};
Effect.prototype.getDesc = function(pEffectDesc) {
if (pEffectDesc instanceof (a.EffectDesc)) {
pEffectDesc.nTechniques = this._pTechniques.length;
pEffectDesc.nParameters = this._pParameters.length;
pEffectDesc.sDesc = this._sDesc;
return pEffectDesc;

}
else  {
return new a.EffectDesc(this._sDesc, this._pParameters.length, this._pTechniques.length);

}


};
Effect.prototype.findNextValidTechnique = function(sTechnique) {
sTechnique = (sTechnique === undefined? null : sTechnique);
var pTechs=this._pTechniques;
var isFindNext=true;
for (var i=0, n=pTechs.length; i < n; ++i) {
if (sTechnique && isFindNext) {
if ((pTechs[i]._sName) == sTechnique) {
isFindNext = false;

}
else  {
continue ;

}


}

if (pTechs[i].isValid()) {
return pTechs[i]._sName;

}


}

return null;

};
Effect.prototype.getTechnique = function(iTechnique) {
var pTechs=this._pTechniques;
return (pTechs[iTechnique]? pTechs[iTechnique]._sName : null);

};
Effect.prototype.getTechniqueDesc = function(sTechnique, pTechniqueDesc) {
var pTech=this._pTechniquesByName[sTechnique];
if (pTechniqueDesc instanceof (a.EffectTechniqueDesc)) {
pTechniqueDesc.nPasses = pTech._pPasses.length;
pTechniqueDesc.sName = pTech._sName;
return pTechniqueDesc;

}
else  {
return new a.EffectTechniqueDesc(pTech._sName, pTech._pPasses.length);

}


};
Effect.prototype.getPass = function(sTechnique, iPass) {
var pTech=this._pTechniquesByName[sTechnique];
var pPass=null;
return (pTech && (pPass = pTech.getPass(iPass))? pPass.sName : null);

};
Effect.prototype.getPassDesc = function(sPass, pPassDesc) {
return  {nVSSemanticsUsed: 0};

};
Effect.prototype.setTechnique = function(sTechnique) {
var res=this._pActiveTechnique = this._pTechniquesByName[sTechnique];
return (res? true : false);

};
Effect.prototype.applyVertexBuffer = function(pBuffer) {
var pBlend=this._pActiveTechnique.currentBlend();
var pLastProg=pBuffer.getShaderProgram();
var pCurProg=pBlend.program();
if (pLastProg != pCurProg) {
pBuffer.setShaderProgram(pCurProg);
if (!(pBuffer.loadAttribLocation())) {
console.log("cannot load attrib location");

}


}

pBuffer.activate();

};
Effect.prototype.getParameter = function(sParameter, nIndex) {
sParameter = (sParameter === undefined? null : sParameter);
if (sParameter == null) {
return this._pParameters[nIndex].sName;

}
else  {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "get struct member"));
throw new Error("TODO::\n" + "get struct member");

}


};
Effect.prototype.getDevice = function() {
return this._pDevice;

};
a.createEffectFromFile = function(pEngine, sSrcFile, fnCallback) {
var sFilename;
if (a.fx[sSrcFile]) {
fnCallback(true, new a.fx[sSrcFile](pEngine));
return ;

}

a.fopen(sSrcFile).read(function(pData) {
eval((Preprocessor? Preprocessor.code(pData) : pData));
a.fx[sSrcFile] = a.fx.LastEffect;
a.createEffectFromFile(pEngine, sSrcFile, fnCallback);

}
, function() {
fnCallback(false, null);

}
);

};
Effect.pLoadedEffects =  {};
Effect.pActiveTextures = new Array(32);
Effect.nLastActiveTexture = -1;
a.EffectPass = EffectPass;
a.EffectTechnique = EffectTechnique;
a.Effect = Effect;
a.EffectDesc = EffectDesc;
a.EffectParam = EffectParam;
a.EffectTechniqueDesc = EffectTechniqueDesc;
a.EffectTexture = EffectTexture;
a.EffectVec4 = EffectVec4;
a.EffectVec3 = EffectVec3;
a.EffectMat4 = EffectMat4;
a.EffectMat3 = EffectMat3;
a.EffectFloat32 = EffectFloat32;
a.EffectSampler = EffectSampler;
a.EffectShader = EffectShader;
a.EffectSamplerParam = EffectSamplerParam;
a.EffectFragment = EffectFragment;
a.EffectPassState = EffectPassState;
function MaterialBase() {
this._sName = null;

}

window.$$enum_MATERIAL_COMPONENTS$_keys = ['DIFFUSE', 'AMBIENT', 'SPECULAR', 'EMISSION', 'SHININESS', 'REFLECTIVE', 'REFLECTIVITY', 'TRANSPARENT', 'TRANSPARENCY', 'INDEXOFREFRACTION'];
a.defineProperty(MaterialBase, "value", function() {
return this;

}
, function(pMaterialBase) {
var pPoperties=$$enum_MATERIAL_COMPONENTS$_keys;
for (var i in pPoperties) {
this.setProperty(pPoperties[i], pMaterialBase.getProperty(pPoperties[i]));

}


}
);
a.defineProperty(MaterialBase, "name", function() {
return this._sName;

}
, function(sName) {
this._sName = sName;

}
);
a.defineProperty(MaterialBase, "data", function() {
return null;

}
, function(sName) {

}
);
MaterialBase.prototype.getProperty = function(eProperty) {
return null;

};
MaterialBase.prototype.setProperty = function(eProperty, pValue) {
return false;

};
a.MaterialBase = MaterialBase;
a.defineProperty(MaterialBase, "DIFFUSE", function() {
return this.getProperty("DIFFUSE");

}
, function(c4fColor) {
this.setProperty("DIFFUSE");

}
);
a.defineProperty(MaterialBase, "AMBIENT", function() {
return this.getProperty("AMBIENT");

}
, function(c4fColor) {
this.setProperty("AMBIENT");

}
);
a.defineProperty(MaterialBase, "SPECULAR", function() {
return this.getProperty("SPECULAR");

}
, function(c4fColor) {
this.setProperty("SPECULAR");

}
);
a.defineProperty(MaterialBase, "EMISSION", function() {
return this.getProperty("EMISSION");

}
, function(c4fColor) {
this.setProperty("EMISSION");

}
);
a.defineProperty(MaterialBase, "SHININESS", function() {
return this.getProperty("SHININESS");

}
, function(c4fColor) {
this.setProperty("SHININESS");

}
);
a.defineProperty(MaterialBase, "REFLECTIVE", function() {
return this.getProperty("REFLECTIVE");

}
, function(c4fColor) {
this.setProperty("REFLECTIVE");

}
);
a.defineProperty(MaterialBase, "REFLECTIVITY", function() {
return this.getProperty("REFLECTIVITY");

}
, function(c4fColor) {
this.setProperty("REFLECTIVITY");

}
);
a.defineProperty(MaterialBase, "TRANSPARENT", function() {
return this.getProperty("TRANSPARENT");

}
, function(c4fColor) {
this.setProperty("TRANSPARENT");

}
);
a.defineProperty(MaterialBase, "TRANSPARENCY", function() {
return this.getProperty("TRANSPARENCY");

}
, function(c4fColor) {
this.setProperty("TRANSPARENCY");

}
);
a.defineProperty(MaterialBase, "INDEXOFREFRACTION", function() {
return this.getProperty("INDEXOFREFRACTION");

}
, function(c4fColor) {
this.setProperty("INDEXOFREFRACTION");

}
);
function Material() {
Material.ctor.apply(this, arguments);
this.pDiffuse = new Float32Array(4);
this.pAmbient = new Float32Array(4);
this.pSpecular = new Float32Array(4);
this.pEmission = new Float32Array(4);
this.pShininess = 0;

}

a.extend(Material, a.MaterialBase);
Material.prototype.getProperty = function(eProperty) {
switch(eProperty) {
case "DIFFUSE":
return this.pDiffuse;

case "AMBIENT":
return this.pAmbient;

case "SPECULAR":
return this.pSpecular;

case "EMISSION":
return this.pEmission;

case "SHININESS":
return this.pShininess;
}
return null;

};
Material.prototype.setProperty = function(eProperty, pValue) {
switch(eProperty) {
case "DIFFUSE":
this.pDiffuse = pValue;

case "AMBIENT":
this.pAmbient = pValue;

case "SPECULAR":
this.pSpecular = pValue;

case "EMISSION":
this.pEmission = pValue;

case "SHININESS":
this.pShininess = pValue;
}
return null;

};
function MeshMaterial(sName, pVertexData) {
this._pData = pVertexData;
this._sName = sName;

}

MeshMaterial.vertexDeclaration = function() {
return new a.VertexDeclaration([ {nCount: 17, eType: 5126, eUsage: "MATERIAL"},  {nCount: 4, eType: 5126, eUsage: "DIFFUSE", iOffset: -68},  {nCount: 4, eType: 5126, eUsage: "AMBIENT"},  {nCount: 4, eType: 5126, eUsage: "SPECULAR"},  {nCount: 4, eType: 5126, eUsage: "EMISSION"},  {nCount: 1, eType: 5126, eUsage: "SHININESS"}]);

};
MeshMaterial.prototype.getProperty = function(eProperty) {
switch(eProperty) {
case "DIFFUSE":
return this._pData.getTypedData("DIFFUSE", 0, 1);

case "AMBIENT":
return this._pData.getTypedData("AMBIENT", 0, 1);

case "SPECULAR":
return this._pData.getTypedData("SPECULAR", 0, 1);

case "EMISSION":
return this._pData.getTypedData(a.DECLUSAGE.EMISSION, 0, 1);

case "SHININESS":
return this._pData.getTypedData("SHININESS", 0, 1)[0];
}
return null;

};
MeshMaterial.prototype.setProperty = function(eProperty, pValue) {
switch(eProperty) {
case "DIFFUSE":
this._pData.setData(pValue, "DIFFUSE");

case "AMBIENT":
this._pData.setData(pValue, "AMBIENT");

case "SPECULAR":
this._pData.setData(pValue, "SPECULAR");

case "EMISSION":
this._pData.setData(pValue, a.DECLUSAGE.EMISSION);

case "SHININESS":
this._pData.setData(new Float32Array([fValue]), "SHININESS");
}
return null;

};
a.defineProperty(MeshMaterial, "data", function() {
return this._pData.getTypedData("MATERIAL", 0, 1);

}
, function(pData) {
this._pData.setData(pData, "MATERIAL");

}
);
a.MeshMaterial = MeshMaterial;
function SurfaceMaterial(pEngine) {
SurfaceMaterial.ctor.apply(this, arguments);
this._pMaterial = new a.Material();
this._nTotalTextures = 0;
this._iTextureFlags = 0;
this._iTextureMatrixFlags = 0;
this._pTexture = new Array(16);
this._pTextureMatrix = new Array(16);
this.setMaterial(0);

}

a.extend(SurfaceMaterial, a.ResourcePoolItem, a.Unique);
a.defineProperty(SurfaceMaterial, "material", function() {
return this._pMaterial;

}
, function(pMaterial) {
if (pMaterial) {
this._pMaterial.value = pMaterial;

}
else  {
this._pMaterial.pDiffuse = new Float32Array([0.5, 0.5, 0.5, 1]);
this._pMaterial.pSpecular = new Float32Array([0.5, 0.5, 0.5, 1]);

}

return true;

}
);
a.defineProperty(SurfaceMaterial, "totalTextures", function() {
return this._nTotalTextures;

}
);
a.defineProperty(SurfaceMaterial, "textureFlags", function() {
return this._iTextureFlags;

}
);
SurfaceMaterial.prototype.texture = function(iSlot) {
if (!((iSlot >= 0) && (iSlot < (16)))) {
var err=((((((("Error:: " + "invalid texture slot") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid texture slot");

}


}

;
return this._pTexture[iSlot];

};
SurfaceMaterial.prototype.textureMatrix = function(iSlot) {
if (!(iSlot < (16))) {
var err=((((((("Error:: " + "invalid texture slot") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid texture slot");

}


}

;
return this._pTextureMatrix[iSlot];

};
SurfaceMaterial.prototype.textureMatrixFlags = function() {
return this._iTextureMatrixFlags;

};
SurfaceMaterial.prototype.createResource = function() {
if (!(!(this.isResourceCreated()))) {
var err=((((((("Error:: " + "The resource has already been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has already been created.");

}


}

;
this.material = 0;
this.notifyLoaded();
this.notifyCreated();
this.notifyDisabled();
return true;

};
SurfaceMaterial.prototype.destroyResource = function() {
for (var i=0; i < (16); ++i) {
delete (this._pTexture[i]);
delete (this._pTextureMatrix[i]);
this._iTextureFlags &= ~(1 << i);
this._iTextureMatrixFlags &= ~(1 << i);

}

this._nTotalTextures = 0;
if (this.isResourceCreated()) {
this.disableResource();
this.notifyUnloaded();
this.notifyDestroyed();
return true;

}

return false;

};
SurfaceMaterial.prototype.restoreResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyRestored();
return true;

};
SurfaceMaterial.prototype.disableResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyDisabled();
return true;

};
SurfaceMaterial.prototype.loadResource = function(sFileName, sURI) {
sFileName = sFileName || (this.findResourceName());
var isResult=false;
return isResult;

};
SurfaceMaterial.prototype.saveResource = function(sFileName) {
sFileName = sFileName || (this.findResourceName());
var isResult=false;
return isResult;

};
SurfaceMaterial.prototype.setTexture = function(iIndex, pTexture) {
if (!(iIndex < (16))) {
var err=((((((("Error:: " + "invalid texture slot") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid texture slot");

}


}

;
var pDisplayManager=this._pEngine.pDisplayManager;
if ((typeof pTexture) == "string") {
if (this._pTexture[iIndex]) {
a.safeRelease(this._pTexture[iIndex]);
this._iTextureFlags &= ~(1 << iIndex);
--this._nTotalTextures;

}

this._pTexture[iIndex] = pDisplayManager.texturePool().loadResource(pTexture);
if (this._pTexture[iIndex]) {
this._iTextureFlags |= 1 << iIndex;
++this._nTotalTextures;
this.connect(this._pTexture[iIndex], 1);

}

return true;

}
else if (pTexture instanceof (a.Texture)) {
if ((!(this._pTexture[iIndex])) || (pTexture != (this._pTexture[iIndex]))) {
if (this._pTexture[iIndex]) {
a.safeRelease(this._pTexture[iIndex]);
this._iTextureFlags &= ~(1 << iIndex);
--this._nTotalTextures;

}

this._pTexture[iIndex] = pTexture;
this._pTexture[iIndex].addRef();
this._iTextureFlags |= 1 << iIndex;
++this._nTotalTextures;
this.connect(this._pTexture[iIndex], 1);

}

return true;

}
else if ((typeof pTexture) == "number") {
if ((!(this._pTexture[iIndex])) || ((this._pTexture[iIndex].resourceHandle()) != pTexture)) {
if (this._pTexture[iIndex]) {
a.safeRelease(this._pTexture[iIndex]);
this._iTextureFlags &= ~(1 << iIndex);
--this._nTotalTextures;

}

this._pTexture[iIndex] = pDisplayManager.texturePool().getResource(pTexture);
if (this._pTexture[iIndex]) {
this._iTextureFlags |= 1 << iIndex;
++this._nTotalTextures;
this.connect(this._pTexture[iIndex], 1);

}


}

return true;

}



return false;

};
SurfaceMaterial.prototype.setTextureMatrix = function(index, matrix) {
if (!(index < (16))) {
var err=((((((("Error:: " + "invalid texture slot") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid texture slot");

}


}

;
if (!matrix) {
this._pTextureMatrix[index] = new glMatrixArrayType(16);

}
else  {
this._pTextureMatrix[index] = Mat4.create(matrix);

}

this._textureMatrixFlags.setBit(index);
return true;

};
a.SurfaceMaterial = SurfaceMaterial;
function EffectResource(pEngine) {
EffectResource.superclass.constructor.apply(this, arguments);
this._pShaderManager = pEngine.pShaderManager;
this._nTotalPasses = 0;
this._iMode = 0;
this._pPassStates = [];
this._pModificationCallbacks = [];

}

a.extend(EffectResource, a.ResourcePoolItem, a.Unique);
EffectResource.prototype.getManager = function() {
return this._pShaderManager;

};
a.defineProperty(EffectResource, "totalPasses", function() {
return this._nTotalPasses;

}
);
EffectResource.prototype.setModificationRoutine = function(fn) {
for (var i=0; i < (this._pModificationCallbacks.length); i++) {
if ((this._pModificationCallbacks[i]) == fn) {
return true;

}


}

;
this._pModificationCallbacks.push(fn);

};
EffectResource.prototype.delModificationRoutine = function(fn) {
for (var i=0; i < (this._pModificationCallbacks.length); i++) {
if ((this._pModificationCallbacks[i]) == fn) {
this._pModificationCallbacks.splice(i, 1);
return true;

}


}

;
return false;

};
EffectResource.prototype.replicable = function(bValue) {
bValue = bValue || true;
(bValue? this._iMode |= 1 << 1 : this._iMode &= ~(1 << 1));

};
EffectResource.prototype.isReplicated = function() {
return (this._iMode & (1 << 1)) != 0;

};
EffectResource.prototype.miscible = function(bValue) {
bValue = bValue || true;
(bValue? this._iMode |= 1 << 2 : this._iMode &= ~(1 << 2));

};
EffectResource.prototype.isMixid = function() {
return (this._iMode & (1 << 2)) != 0;

};
EffectResource.prototype.isParameterUsed = function(pParameter, iPass) {
return (this.findParameter(pParameter, iPass)? true : false);

};
EffectResource.prototype.totalComponents = function() {
return this._pShaderManager.getComponentCount(this);

};
EffectResource.prototype.getComponent = function(i) {
return this._pShaderManager.getComponent(this, i);

};
EffectResource.prototype.findParameter = function(pParameter, iPass) {
iPass = (iPass === undefined? (-1) : iPass);
return this._pShaderManager.findParameter(this, pParameter, iPass, 1);

};
EffectResource.prototype.createResource = function() {
this._pShaderManager.registerEffect(this);
this.miscible();
this.notifyCreated();
this.notifyDisabled();
this.notifyLoaded();
return true;

};
EffectResource.prototype.destroyResource = function() {
if (this.isResourceCreated()) {
this.disableResource();
this.notifyUnloaded();
this.notifyDestroyed();
return true;

}

return false;

};
EffectResource.prototype.disableResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyDisabled();
return true;

};
EffectResource.prototype.restoreResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyRestored();
return true;

};
EffectResource.prototype.loadResource = function(sFileName) {
this.notifyUnloaded();
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Загрузка эффект ресурса"));
throw new Error("TODO::\n" + "Загрузка эффект ресурса");
return true;

};
EffectResource.prototype.use = function(iComponentHandle, nShift, isSet) {
nShift = (nShift === undefined? 0 : nShift);
isSet = (isSet === undefined? true : isSet);
if (!((this._iCurrentPass) === (-1))) {
var err=((((((("Error:: " + "нельзя добавить компонентов во время активированного пасса.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("нельзя добавить компонентов во время активированного пасса.");

}


}

;
var pManager=this._pShaderManager;
if ((typeof iComponentHandle) === "object") {
iComponentHandle = iComponentHandle.resourceHandle();

}

if (isSet) {
if (!(pManager.activateComponent(this, iComponentHandle, nShift))) {
if (!0) {
var err=((((((("Error:: " + "Невозможно добавить ингридиент.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Невозможно добавить ингридиент.");

}


}

;
return false;

}


}
else  {
if (!(pManager.deactivateComponent(this, iComponentHandle, nShift))) {
if (!0) {
var err=((((((("Error:: " + "Невозможно убрать ингридиент.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Невозможно убрать ингридиент.");

}


}

;
return false;

}


}

if (((this.totalComponents()) == 1) && isSet) {
this.notifyRestored();

}
else if (((this.totalComponents()) == 0) && (!isSet)) {
this.notifyDisabled();

}


return this._updateParameterList(iComponentHandle, isSet);

};
EffectResource.prototype.unUse = function(iComponentHandle, nShift) {
return this.use(iComponentHandle, nShift, false);

};
EffectResource.prototype._updateParameterList = function(iComponentHandle, isSet) {
var pManager=this._pShaderManager;
var pParameterList, pParameter, pReservedParameter;
var nTotalPasses;
var pPassState=this._pPassStates;
var i;
nTotalPasses = pManager.getTotalPasses(iComponentHandle);
this._nTotalPasses = Math.max(this._nTotalPasses, nTotalPasses);
for (i = 0; i < nTotalPasses; i++) {
pParameterList = pManager.getParameterList(iComponentHandle, i, a.ShaderManager.PARAMETER_FLAG_NONSYTEM);
if (!pParameterList) {
continue ;

}

if (!(pPassState[i])) {
pPassState[i] = pPassState =  {};

}

for (var j=0; j < (pParameterList.length); ++j) {
pParameter = pParameterList[j];
pReservedParameter = pPassState[pParameter.name];
if ((pReservedParameter === undefined) && isSet) {
pReservedParameter =  {nUses: 0, pValue: null};
if (pParameter.isArray()) {
pReservedParameter.pValue = GEN_ARRAY(null, pParameter.numElements());

}

pPassState[pParameter.name] = pReservedParameter;

}

pReservedParameter.nUses += (isSet? 1 : -1);
if ((pReservedParameter.nUses) === 0) {
delete (pPassState[pParameter.name]);

}


}


}

for (var i=0; i < (this._pModificationCallbacks.length); i++) {
if ((this._pModificationCallbacks[i]) == fn) {
this._pModificationCallbacks(this);

}


}

;
return true;

};
EffectResource.prototype.saveResource = function(sFileName) {
return true;

};
a.EffectResource = EffectResource;
function EffectAccessor(pEngine) {
this._pShaderManager = pEngine.pShaderManager;
this._pEffectResource = null;

}

EffectAccessor.prototype.addComponent = function(sComponentName, nShift) {

};
function RenderEntry() {
this.hEffectFile = 0;
this.renderPass = 0;
this.boneCount = 0;
this.modelType = 0;
this.detailLevel = 0;
this.hModel = 0;
this.modelParamA = 0;
this.modelParamB = 0;
this.hSurfaceMaterial = 0;
this.pSceneNode = null;
this.userData = 0;

}

RenderEntry.prototype.clear = function() {
this.hEffectFile = 0;
this.renderPass = 0;
this.boneCount = 0;
this.modelType = 0;
this.detailLevel = 0;
this.hModel = 0;
this.modelParamA = 0;
this.modelParamB = 0;
this.hSurfaceMaterial = 0;

};
function RenderQueue(pEngine) {
;
this._entryPool = GEN_ARRAY(a.RenderEntry, 2048);
this._entryList = new Array(a.RenderEntry, 2048);
this._activeEntries = 0;
this._pEngine = pEngine;

}

RenderQueue.prototype.lockRenderEntry = function() {
if (((this._activeEntryes) + 1) == (2048)) {
this.execute();

}

var pEntry=this._entryPool[this._activeEntries];
pEntry.clear();
return pEntry;

};
RenderQueue.prototype.unlockRenderEntry = function(pEntry) {
this._entryList[this._activeEntries] = pEntry;
++this._activeEntries;

};
RenderQueue.prototype.sortEntryList = function() {
;
var h=1;
while (((h * 3) + 1) < this._activeEntries) {
h = (3 * h) + 1;

}
while (h > 0) {
for (var i=h - 1; i < this._activeEntries; i++) {
var B=this._entryPool[i];
var j=i;
for (j = i; (j >= h) && (((B.hEffectFile) < (this._entryPool[j - h].hEffectFile)? !0 : ((B.hEffectFile) === (this._entryPool[j - h].hEffectFile)? ((B.renderPass) < (this._entryPool[j - h].renderPass)? !0 : ((B.renderPass) === (this._entryPool[j - h].renderPass)? ((B.boneCount) < (this._entryPool[j - h].boneCount)? !0 : ((B.boneCount) === (this._entryPool[j - h].boneCount)? ((B.modelType) < (this._entryPool[j - h].modelType)? !0 : ((B.modelType) === (this._entryPool[j - h].modelType)? ((B.detailLevel) < (this._entryPool[j - h].detailLevel)? !0 : ((B.detailLevel) === (this._entryPool[j - h].detailLevel)? ((B.hModel) < (this._entryPool[j - h].hModel)? !0 : ((B.hModel) === (this._entryPool[j - h].hModel)? ((B.modelParamA) < (this._entryPool[j - h].modelParamA)? !0 : ((B.modelParamA) === (this._entryPool[j - h].modelParamA)? ((B.modelParamB) < (this._entryPool[j - h].modelParamB)? !0 : ((B.modelParamB) === (this._entryPool[j - h].modelParamB)? ((B.hSurfaceMaterial) < (this._entryPool[j - h].hSurfaceMaterial)? !0 : !1) : !1)) : !1)) : !1)) : !1)) : !1)) : !1)) : !1)) : !1))); j -= h) {
this._entryPool[j] = this._entryPool[j - h];

}

this._entryPool[j] = B;

}

h = (h / 3) << 0;

};

};
RenderQueue.prototype.reset = function() {
;
this._activeEntries = 0;

};
RenderQueue.prototype.execute = function() {
if (this._activeEntries) {
var pLastMethod=null;
var pDisplayManager=this._pEngine.pDisplayManager;
this.sortEntryList();
var iActivationFlags=4294967295;
this._entryList[0].pSceneNode.renderCallback(this._entryList[0], iActivationFlags);
for (var i=1; i < (this._activeEntries); i++) {
var currentEntry=this._entryList[i];
var previousEntry=this._entryList[i - 1];
iActivationFlags = 0;
if ((previousEntry.hEffectFile) != (currentEntry.hEffectFile)) {
pLastMethod = pDisplayManager.effectPool().getResource(previousEntry.hEffectFile);
if (pLastMethod) {
pLastMethod.end();
if (pLastMethod) {
var safe_release_refcount=pLastMethod.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pLastMethod = 0;

}

;

}

iActivationFlags |= 1 << 0;
iActivationFlags |= 1 << 1;
iActivationFlags |= 1 << 2;

}
else if ((previousEntry.renderPass) != (currentEntry.renderPass)) {
iActivationFlags |= 1 << 1;
iActivationFlags |= 1 << 2;

}
else  {
if ((previousEntry.boneCount) != (currentEntry.boneCount)) {
iActivationFlags |= 1 << 2;

}

if ((previousEntry.detailLevel) != (currentEntry.detailLevel)) {
iActivationFlags |= 1 << 3;

}


}


if (((previousEntry.hModel) != (currentEntry.hModel)) || ((previousEntry.modelType) != (currentEntry.modelType))) {
iActivationFlags |= 1 << 4;
iActivationFlags |= 1 << 5;
iActivationFlags |= 1 << 6;

}
else  {
if ((previousEntry.modelParamA) != (currentEntry.modelParamA)) {
iActivationFlags |= 1 << 5;

}

if ((previousEntry.modelParamB) != (currentEntry.modelParamB)) {
iActivationFlags |= 1 << 6;

}


}

if ((previousEntry.hSurfaceMaterial) != (currentEntry.hSurfaceMaterial)) {
iActivationFlags |= 1 << 7;

}

currentEntry.pSceneNode.renderCallback(currentEntry, iActivationFlags);

}

var lastEntry=this._entryList[(this._activeEntries) - 1];
pLastMethod = pDisplayManager.effectPool().getResource(lastEntry.hEffectFile);
if (pLastMethod) {
pLastMethod.end();
pLastMethod = null;

}


}

this.reset();

};
a.RenderEntry = RenderEntry;
a.RenderQueue = RenderQueue;
function findPosX(pObj) {
var curleft=0;
if (pObj.offsetParent) {
while (1) {
curleft += pObj.offsetLeft;
if (!(pObj.offsetParent)) {
break ;

}

pObj = pObj.offsetParent;

}

}
else if (pObj.x) {
curleft += pObj.x;

}


return curleft;

}

;
function findPosY(pObj) {
var curtop=0;
if (pObj.offsetParent) {
while (1) {
curtop += pObj.offsetTop;
if (!(pObj.offsetParent)) {
break ;

}

pObj = pObj.offsetParent;

}

}
else if (pObj.y) {
curtop += pObj.y;

}


return curtop;

}

;
function Font2D(iSize, sColor, sFontFamily, isBold, isItalic) {
iSize = iSize || 12;
sColor = sColor || "#000000";
sFontFamily = sFontFamily || "times";
isBold = isBold || false;
isItalic = isItalic || false;
this._sFontSize = (String(iSize)) + "px";
if ((sColor[0]) != "#") {
this._sFontColor = "#" + sColor;

}
else  {
this._sFontColor = sColor;

}

this._sFontFamily = sFontFamily;
if (isBold) {
this._sBold = "bold";

}
else  {
this._sBold = "normal";

}

if (isItalic) {
this._sItalic = "italic";

}
else  {
this._sItalic = "normal";

}


}

;
function String2D(iX, iY, pFont, sStr, pDiv) {
var pSpan=document.createElement("span");
pSpan.style.position = "absolute";
pSpan.style.left = (String(iX)) + "px";
pSpan.style.top = (String(iY)) + "px";
pSpan.style.fontSize = pFont._sFontSize;
pSpan.style.color = pFont._sFontColor;
pSpan.style.fontFamily = pFont._sFontFamily;
pSpan.style.fontWeight = pFont._sBold;
pSpan.style.fontStyle = pFont._sItalic;
pSpan.style.webkitUserSelect = "none";
pSpan.style.mozUserSelect = "none";
pSpan.innerHTML = sStr;
pDiv.appendChild(pSpan);
this._pSpan = pSpan;
this._pLastSpan = pSpan;

}

;
String2D.prototype.append = function(sStr, pFont) {
if (pFont != undefined) {
var pStyle=this._pLastSpan.style;
if ((((((pStyle.fontSize) != (pFont._sFontSize)) || ((pStyle.color) != (pFont._sFontColor))) || ((pStyle.fontFamily) != (pFont._sFontFamily))) || ((pStyle.fontWeight) != (pFont._sFontWeight))) || ((pStyle.fontStyle) != (pFont._sFontStyle))) {
this._addSpan(sStr, pFont);

}
else  {
this._pLastSpan.innerHTML += sStr;

}


}
else  {
this._pLastSpan.innerHTML += sStr;

}


};
String2D.prototype._addSpan = function(sStr, pFont) {
var pSpan=document.createElement("span");
pSpan.style.fontSize = pFont._sFontSize;
pSpan.style.color = pFont._sFontColor;
pSpan.style.fontFamily = pFont._sFontFamily;
pSpan.style.fontWeight = pFont._sBold;
pSpan.style.fontStyle = pFont._sItalic;
pSpan.style.webkitUserSelect = "none";
pSpan.style.mozUserSelect = "none";
pSpan.innerHTML = sStr;
this._pSpan.appendChild(pSpan);
this._pLastSpan = pSpan;

};
String2D.prototype.hide = function() {
this._pSpan.style.visibility = "hidden";

};
String2D.prototype.show = function() {
this._pSpan.style.visibility = "visible";

};
String2D.prototype.clear = function() {
this._pSpan.innerHTML = null;
this._pLastSpan = this._pSpan;

};
String2D.prototype.toString = function() {
return this._pSpan.innerHTML;

};
String2D.prototype.edit = function(sStr) {
this._pSpan.innerHTML = sStr;
this._pLastSpan = this._pSpan;

};
function DisplayManager(pEngine) {
this._pEngine = pEngine;
this._pDevice = pEngine.pDevice;
this._pCanvas = pEngine.pCanvas;
this._pResourceManager = pEngine.pResourceManager;
this._bEnabled = false;
this._bClearEachFrame = true;
this._texturePool = new a.ResourcePool(pEngine, a.Texture);
this._texturePool.initialize(16);
this._surfaceMaterialPool = new a.ResourcePool(pEngine, a.SurfaceMaterial);
this._surfaceMaterialPool.initialize(16);
this._effectPool = new a.ResourcePool(pEngine, a.EffectResource);
this._effectPool.initialize(16);
this._renderMethodPool = new a.ResourcePool(pEngine, a.RenderMethod);
this._renderMethodPool.initialize(16);
this._vertexBufferPool = new a.ResourcePool(pEngine, a.VertexBuffer);
this._vertexBufferPool.initialize(16);
this._indexBufferPool = new a.ResourcePool(pEngine, a.IndexBuffer);
this._indexBufferPool.initialize(16);
this._modelPool = new a.ResourcePool(pEngine, a.ModelResource);
this._modelPool.initialize(16);
this._imagePool = new a.ResourcePool(pEngine, a.Img);
this._imagePool.initialize(16);
this._videoBufferPool = new a.ResourcePool(pEngine, a.VideoBuffer);
this._videoBufferPool.initialize(16);
this._shaderProgramPool = new a.ResourcePool(pEngine, a.GLSLProgram);
this._shaderProgramPool.initialize(1);
this._pFontTexture = null;
this._renderQueue = new a.RenderQueue(pEngine);
this._pTextDiv = null;

}

;
DisplayManager.prototype.texturePool = function() {
;
return this._texturePool;

};
DisplayManager.prototype.surfaceMaterialPool = function() {
;
return this._surfaceMaterialPool;

};
DisplayManager.prototype.vertexBufferPool = function() {
;
return this._vertexBufferPool;

};
DisplayManager.prototype.videoBufferPool = function() {
;
return this._videoBufferPool;

};
DisplayManager.prototype.shaderProgramPool = function() {
;
return this._shaderProgramPool;

};
DisplayManager.prototype.indexBufferPool = function() {
;
return this._indexBufferPool;

};
DisplayManager.prototype.effectPool = function() {
;
return this._effectPool;

};
DisplayManager.prototype.renderMethodPool = function() {
;
return this._renderMethodPool;

};
DisplayManager.prototype.modelPool = function() {
;
return this._modelPool;

};
DisplayManager.prototype.imagePool = function() {
;
return this._imagePool;

};
DisplayManager.prototype.queue = function() {
;
return this._renderQueue;

};
DisplayManager.prototype.enable = function() {
;
this._bEnabled = true;

};
DisplayManager.prototype.disable = function() {
;
this._bEnabled = false;

};
DisplayManager.prototype.enableFrameClearing = function(isCleared) {
;
this._bClearEachFrame = isCleared;

};
DisplayManager.prototype.draw2DText = function(iX, iY, pFont, sStr) {
;
return new a.String2D(iX, iY, pFont, sStr, this._pTextDiv);

};
DisplayManager.prototype.initialize = function() {
this._pDevice.clearColor(0.5, 0.5, 0.5, 1);
this._pDevice.clearStencil(0);
this._pDevice.clearDepth(1);
this.registerDeviceResources();
this.initText2Dlayer();
return true;

};
DisplayManager.prototype.initText2Dlayer = function() {
var x=findPosX(this._pCanvas);
var y=findPosY(this._pCanvas);
var pDiv=document.createElement("div");
pDiv.setAttribute("id", "text-layer");
var pStyle=pDiv.style;
pStyle.width = (String(this._pCanvas.width)) + "px";
pStyle.height = (String(this._pCanvas.height)) + "px";
var iBorder=0;
if ((this._pCanvas.style.border) != "none") {
iBorder = parseInt(this._pCanvas.style.border);

}

pStyle.position = "absolute";
pStyle.left = (String(x + iBorder)) + "px";
pStyle.top = (String(y + iBorder)) + "px";
pStyle.overflow = "hidden";
pStyle.whiteSpace = "nowrap";
if (this._pCanvas.style.zIndex) {
pStyle.zIndex = (this._pCanvas.style.zIndex) + 1;

}
else  {
pStyle.zIndex = 2;

}

document.body.appendChild(pDiv);
this._pTextDiv = pDiv;

};
DisplayManager.prototype.destroy = function() {
this.unregisterDeviceResources();

};
DisplayManager.prototype.clearRenderSurface = function() {
if (this._pDevice) {
this._pDevice.clear(((this._pDevice.COLOR_BUFFER_BIT) | (this._pDevice.DEPTH_BUFFER_BIT)) | (this._pDevice.STENCIL_BUFFER_BIT));

}


};
DisplayManager.prototype.clearDepthBuffer = function() {
if (this._pDevice) {
this._pDevice.clear((this._pDevice.DEPTH_BUFFER_BIT) | (this._pDevice.STENCIL_BUFFER_BIT));

}


};
DisplayManager.prototype.clearScreen = function() {
if (this._pDevice) {
this.clearRenderSurface();

}


};
DisplayManager.prototype.registerDeviceResources = function() {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "Registering Video Device Resources\n");
this._texturePool.registerResourcePool(new a.ResourceCode(0, 0));
this._vertexBufferPool.registerResourcePool(new a.ResourceCode(0, 2));
this._indexBufferPool.registerResourcePool(new a.ResourceCode(0, 3));
this._effectPool.registerResourcePool(new a.ResourceCode(0, 4));
this._renderMethodPool.registerResourcePool(new a.ResourceCode(0, 5));
this._modelPool.registerResourcePool(new a.ResourceCode(0, 6));
this._imagePool.registerResourcePool(new a.ResourceCode(0, 7));
this._surfaceMaterialPool.registerResourcePool(new a.ResourceCode(0, 8));
this._videoBufferPool.registerResourcePool(new a.ResourceCode(0, 1));
this._shaderProgramPool.registerResourcePool(new a.ResourceCode(0, 9));

};
DisplayManager.prototype.unregisterDeviceResources = function() {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "Unregistering Video Device Resources\n");
this._texturePool.unregisterResourcePool();
this._vertexBufferPool.unregisterResourcePool();
this._videoBufferPool.unregisterResourcePool();
this._indexBufferPool.unregisterResourcePool();
this._effectPool.unregisterResourcePool();
this._renderMethodPool.unregisterResourcePool();
this._modelPool.unregisterResourcePool();
this._imagePool.unregisterResourcePool();
this._surfaceMaterialPool.unregisterResourcePool();
this._shaderProgramPool.unregisterResourcePool();

};
DisplayManager.prototype.createDeviceResources = function() {
return true;

};
DisplayManager.prototype.destroyDeviceResources = function() {
this.disableDeviceResources();
if (this._pFontTexture) {
var safe_release_refcount=this._pFontTexture.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pFontTexture = 0;

}

;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "Destroying Video Device Resources\n");
this._pResourceManager.destroyResourceFamily(0);
return true;

};
DisplayManager.prototype.restoreDeviceResources = function() {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "Restoring Video Device Resources\n");
this._pResourceManager.restoreResourceFamily(0);
return true;

};
DisplayManager.prototype.disableDeviceResources = function() {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "Disabling Video Device Resources\n");
this._pResourceManager.disableResourceFamily(0);
return true;

};
DisplayManager.prototype.beginRenderSession = function() {
this.setViewPort(0, 0, this._pEngine.pCanvas.width, this._pEngine.pCanvas.height);
if (this._bClearEachFrame) {
this.clearRenderSurface();

}

this.setDefaultRenderStates();
this._renderQueue.reset();
return true;

};
DisplayManager.prototype.setViewPort = function(fX0, fY0, fXSize, fYSize) {
this._pDevice.viewport(fX0, fY0, fXSize, fYSize);

};
DisplayManager.prototype.endRenderSession = function() {
this._pDevice.flush();
return true;

};
DisplayManager.prototype.setDefaultRenderStates = function() {
this._pDevice.setRenderState(19, 1);
this._pDevice.setRenderState(20, 1);
this._pDevice.setRenderState(22, 1029);
this._pDevice.setRenderState(26, false);
this._pDevice.setRenderState(7, true);
this._pDevice.setRenderState(14, true);
this._pDevice.setRenderState(23, 2);

};
function TLVertex() {
this.fX = 0;
this.fY = 0;
this.fZ = 0;
this.fW = 1;
this.v4fSpecular = new Float32Array([0, 0, 0, 1]);
this.v4fColor = new Float32Array([0, 0, 0, 1]);
this.fTu = 0;
this.fTv = 0;

}

Object.defineProperty(TLVertex.prototype, "v4fSpecular",  {set: function(value) {
this.v4fSpecular[0] = value[0], this.v4fSpecular[1] = value[1], this.v4fSpecular[2] = value[2], this.v4fSpecular[3] = value[3];

}
, get: function() {
return this.v4fSpecular;

}
});
Object.defineProperty(TLVertex.prototype, "v4fColor",  {set: function(value) {
this.v4fColor[0] = value[0], this.v4fColor[1] = value[1], this.v[2] = value[2], this.v4fColor[3] = value[3];

}
, get: function() {
return this.v4fColor;

}
});
a.TLVertex = TLVertex;
DisplayManager.prototype.openRenderQueue = function() {
return this._renderQueue.lockRenderEntry();

};
DisplayManager.prototype.closeRenderQueue = function(pEntry) {
this._renderQueue.unlockRenderEntry(pEntry);

};
DisplayManager.prototype.processRenderQueue = function() {
this._renderQueue.execute();

};
DisplayManager.prototype.checkResourceFormatSupport = function(fmt, resType, dwUsage) {
return true;

};
a.DisplayManager = DisplayManager;
a.String2D = String2D;
a.Font2D = Font2D;
function ShaderManager(pEngine) {
;
this.pEngine = pEngine;

}

ShaderManager.prototype.activateProgram = function(pProgram) {
pProgram.bind();

};
ShaderManager.prototype.deactivateProgram = function(pProgram) {
pProgram.unbind();

};
ShaderManager.prototype.activeTextures = new Array(32);
ShaderManager.prototype.registerEffect = function(pEffectResource) {
return false;

};
ShaderManager.prototype.findEffect = function() {
return new EffectResource(this.pEngine);

};
ShaderManager.prototype.registerComponent = function(pEffectComponent) {
return false;

};
ShaderManager.prototype.activateComponent = function(pEffectResource, iComponentHandle, nShift) {
return false;

};
ShaderManager.prototype.begin = function(iEffectHandle) {
return false;

};
ShaderManager.prototype.end = function(iEffectHandle) {
return false;

};
ShaderManager.prototype.activatePass = function(iEffectHandle, iPass) {
return false;

};
ShaderManager.prototype.deactivatePass = function(iEffectHandle) {
return false;

};
ShaderManager.prototype.deactivateComponent = function(pEffectResource, iComponentHandle, nShift) {
return false;

};
ShaderManager.prototype.getParameters = function(iComponentHandle, iPass, eFlag) {
iPass = (iPass === undefined? (-1) : iPass);
eFlag = eFlag || (1);
if (iPass === (-1)) {

}
else  {

}

return null;

};
ShaderManager.prototype.findParameter = function(iEffectHandle, pParameter, iPass, eFlag) {
return null;

};
ShaderManager.prototype.isValidComponent = function(iComponent) {
return false;

};
ShaderManager.prototype.findTechnique = function(sTechnique) {
return (-1);

};
ShaderManager.prototype.addEffect = function(pData) {
return (-1);

};
ShaderManager.prototype.setShadowTexture = function(pTexture) {
return false;

};
ShaderManager.prototype.getComponentCount = function(iEffectHandle) {
return 0;

};
ShaderManager.prototype.getComponent = function(iEffectHandle, iComponent) {
return null;

};
ShaderManager.prototype.initialize = function() {
return true;

};
ShaderManager.prototype.destroy = function() {
return true;

};
ShaderManager.prototype.restoreDeviceResources = function() {
return true;

};
ShaderManager.prototype.destroyDeviceResources = function() {
return true;

};
ShaderManager.prototype.createDeviceResources = function() {
return true;

};
ShaderManager.prototype.disableDeviceResources = function() {
return true;

};
ShaderManager.prototype.createBuffer = function() {

};
a.ShaderManager = ShaderManager;
function Img(pEngine) {
Img.superclass.constructor.apply(this, arguments);
this._iFlags = 0;
this._pData = new Array(0);
this._iWidth = 0;
this._iHeight = 0;
this._eFormat = 0;
this._iCubeFlags = 0;

}

;
a.extend(Img, a.ResourcePoolItem);
Img.prototype.createResource = function() {
if (!(!(this.isResourceCreated()))) {
var err=((((((("Error:: " + "The resource has already been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has already been created.");

}


}

;
this.notifyCreated();
this.notifyDisabled();
return true;

};
Img.prototype.destroyResource = function() {
if (this.isResourceCreated()) {
this.disableResource();
this.releaseImg();
this.notifyUnloaded();
this.notifyDestroyed();
return true;

}

return false;

};
Img.prototype.releaseImg = function() {
this._iFlags = 0;
this._pData = null;
this._iWidth = 0;
this._iHeight = 0;
this._eFormat = 0;
this._iCubeFlags = 0;

};
Img.prototype.restoreResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyRestored();
return true;

};
Img.prototype.disableResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyDisabled();
return true;

};
Img.prototype.saveResource = function(sFilename) {
var pBaseTexture;
var isOk;
if (!sFilename) {
var pString=this.findResourceName();
if (pString) {
sFilename = pString;

}


}

pBaseTexture = this.getTexture();
isOk = false;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::saveResource()"));
throw new Error("TODO::\n" + "Texture::saveResource()");
return isOk;

};
Img.prototype.getDivSize = function() {
if (((((((this._eFormat) == (33776)) || ((this._eFormat) == (33777))) || ((this._eFormat) == (33780))) || ((this._eFormat) == (33778))) || ((this._eFormat) == (33781))) || ((this._eFormat) == (33779))) {
return 4;

}
else  {
return 1;

}


};
Img.prototype.getBlockBytes = function() {
if (((((this._eFormat) == (33780)) || ((this._eFormat) == (33778))) || ((this._eFormat) == (33781))) || ((this._eFormat) == (33779))) {
return 16;

}

if (((this._eFormat) == (33776)) || ((this._eFormat) == (33777))) {
return 8;

}
else if (((this._eFormat) == (6408)) || ((this._eFormat) == (6409))) {
return 4;

}
else if (((this._eFormat) == (32864)) || ((this._eFormat) == (6407))) {
return 3;

}
else if (((((((this._eFormat) == (32854)) || ((this._eFormat) == (32857))) || ((this._eFormat) == (32855))) || ((this._eFormat) == (32856))) || ((this._eFormat) == (36194))) || ((this._eFormat) == (36195))) {
return 2;

}
else  {
return 0;

}





};
Img.prototype.getWidth = function(iMipLevel) {
if ((iMipLevel == undefined) || (iMipLevel == 0)) {
return this._iWidth;

}
else  {
if (!(iMipLevel < (this.getMipLevels()))) {
var err=((((((("Error:: " + "Запрашивается размер митмап которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается размер митмап которого нет");

}


}

;
return (this._iWidth) / (1 << iMipLevel);

}


};
Img.prototype.getHeight = function(iMipLevel) {
if ((iMipLevel == undefined) || (iMipLevel == 0)) {
return this._iHeight;

}
else  {
if (!(iMipLevel < (this.getMipLevels()))) {
var err=((((((("Error:: " + "Запрашивается размер митмапа которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается размер митмапа которого нет");

}


}

;
return (this._iHeight) / (1 << iMipLevel);

}


};
Img.prototype.getMipLevels = function() {
if ((this._iFlags & (1 << 2)) != 0) {
if ((this._iFlags & (1 << 1)) != 0) {
return this._pData[0][Math.lowestBitSet(this._iCubeFlags)].length;

}
else  {
return this._pData[0][0].length;

}


}

return undefined;

};
Img.prototype.getCubeFlags = function() {
if ((this._iFlags & (1 << 1)) != 0) {
return this._iCubeFlags;

}

return undefined;

};
Img.prototype.getVolumeLevels = function() {
if ((this._iFlags & (1 << 0)) != 0) {
return this._pData.length;

}

return undefined;

};
Img.prototype.getData = function(iMipLevel, eCubeFlag, iVolumeLevel) {
if (iMipLevel == undefined) {
iMipLevel = 0;

}

if ((this.getMipLevels()) == undefined) {
if (!(iMipLevel == 0)) {
var err=((((((("Error:: " + "Запрашивается мипмап, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается мипмап, которого нет");

}


}

;

}
else  {
if (!(iMipLevel < (this.getMipLevels()))) {
var err=((((((("Error:: " + "Запрашивается мипмап, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается мипмап, которого нет");

}


}

;

}

if (eCubeFlag == undefined) {
eCubeFlag = 0;

}

if ((this._iFlags & (1 << 1)) != 0) {
if (!(this._iCubeFlags & (1 << eCubeFlag)) != 0) {
var err=((((((("Error:: " + "Запрашивается часть кубической текстуры которой нет, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть кубической текстуры которой нет, которого нет");

}


}

;

}
else  {
if (!(eCubeFlag == 0)) {
var err=((((((("Error:: " + "Запрашивается часть кубической текстуры которой нет, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть кубической текстуры которой нет, которого нет");

}


}

;

}

if (iVolumeLevel == undefined) {
iVolumeLevel = 0;

}

if ((this._iFlags & (1 << 0)) != 0) {
if (!(iVolumeLevel < (this.getVolumeLevels()))) {
var err=((((((("Error:: " + "Запрашивается часть объемной картинки, которой нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть объемной картинки, которой нет");

}


}

;

}
else  {
if (!(iVolumeLevel == 0)) {
var err=((((((("Error:: " + "Запрашивается часть объемной картинки, которой нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть объемной картинки, которой нет");

}


}

;

}

return this._pData[iVolumeLevel][eCubeFlag][iMipLevel];

};
Img.prototype.isCompressed = function() {
if (((((((this._eFormat) == (33776)) || ((this._eFormat) == (33777))) || ((this._eFormat) == (33780))) || ((this._eFormat) == (33778))) || ((this._eFormat) == (33781))) || ((this._eFormat) == (33779))) {
return true;

}
else  {
return false;

}


};
Img.prototype.isAlpha = function() {
if ((((((((((((this._eFormat) == (33777)) || ((this._eFormat) == (33780))) || ((this._eFormat) == (33778))) || ((this._eFormat) == (33781))) || ((this._eFormat) == (33779))) || ((this._eFormat) == (6408))) || ((this._eFormat) == (6409))) || ((this._eFormat) == (32854))) || ((this._eFormat) == (32857))) || ((this._eFormat) == (32855))) || ((this._eFormat) == (32856))) {
return true;

}
else  {
return false;

}


};
Img.prototype.getFormat = function() {
return this._eFormat;

};
Img.prototype.getFormatShort = function() {
if (((((((this._eFormat) == (33780)) || ((this._eFormat) == (33778))) || ((this._eFormat) == (33781))) || ((this._eFormat) == (33779))) || ((this._eFormat) == (33776))) || ((this._eFormat) == (33777))) {
return this._eFormat;

}
else if (((((((this._eFormat) == (6408)) || ((this._eFormat) == (6409))) || ((this._eFormat) == (32854))) || ((this._eFormat) == (32857))) || ((this._eFormat) == (32855))) || ((this._eFormat) == (32856))) {
return 6408;

}
else if (((((this._eFormat) == (32864)) || ((this._eFormat) == (6407))) || ((this._eFormat) == (36194))) || ((this._eFormat) == (36195))) {
return 6407;

}
else  {
return null;

}




};
Img.prototype.getType = function() {
if (((((((this._eFormat) == (33776)) || ((this._eFormat) == (33777))) || ((this._eFormat) == (33780))) || ((this._eFormat) == (33778))) || ((this._eFormat) == (33781))) || ((this._eFormat) == (33779))) {
return null;

}
else if (((((this._eFormat) == (32864)) || ((this._eFormat) == (6407))) || ((this._eFormat) == (6408))) || ((this._eFormat) == (6409))) {
return 5121;

}
else if (((this._eFormat) == (32854)) || ((this._eFormat) == (32857))) {
return 32819;

}
else if (((this._eFormat) == (32855)) || ((this._eFormat) == (32856))) {
return 32820;

}
else if (((this._eFormat) == (36194)) || ((this._eFormat) == (36195))) {
return 33635;

}
else  {
return null;

}






};
Img.prototype.create = function(iWidth, iHeight, eFormat, iFlags, nVolume) {
var pBuffer;
var nTemp=0;
this._eFormat = eFormat;
this._iWidth = (Math.ceil(iWidth / (this.getDivSize()))) * (this.getDivSize());
this._iHeight = (Math.ceil(iHeight / (this.getDivSize()))) * (this.getDivSize());
this._pData = null;
nTemp = 1;
if ((((iFlags & (1 << 0)) != 0) && (nVolume > 0)) && (nVolume != undefined)) {
this._iFlags |= 1 << 0;
nTemp = nVolume;

}

this._pData = new Array(nTemp);
nTemp = 1;
if ((iFlags & (1 << 1)) != 0) {
this._iFlags |= 1 << 1;
nTemp = 6;

}

for (var i=0; i < (this._pData.length); i++) {
this._pData[i] = new Array(nTemp);

}

nTemp = 1;
if ((iFlags & (1 << 2)) != 0) {
this._iFlags |= 1 << 2;
nTemp = (Math.ceil(Math.max((Math.log(this._iWidth)) / (Math.LN2), (Math.log(this._iHeight)) / (Math.LN2)))) + 1;

}

for (var i=0; i < (this._pData.length); i++) {
for (var k=0; k < (this._pData[i].length); k++) {
this._pData[i][k] = new Array(nTemp);

}


}

for (var i=0; i < (this._pData.length); i++) {
for (var k=0; k < (this._pData[i].length); k++) {
for (var l=0; l < (this._pData[i][k].length); l++) {
this._pData[i][k][l] = new ArrayBuffer((((Math.ceil(iWidth / (this.getDivSize()))) * (Math.ceil(iHeight / (this.getDivSize())))) * (this.getBlockBytes())) >>> (l * 2));

}


}


}

;
this.notifyLoaded();
return true;

};
Img.prototype.loadResource = function(sFileName) {
if (!sFileName) {
var sResourceName=this.findResourceName();
if (sResourceName) {
sFileName = sResourceName;

}


}

var me=this;
this.load(sFileName, function() {
me.notifyLoaded();

}
);

};
Img.prototype.load = function(sFileName, fnCallBack) {
var me=this;
var nMipMap=1;
var nCubeMap=1;
var nVolume=1;
a.fopen(sFileName, "rb").onread = function(pData) {
var iOffset=0;
var isOk=false;
var pData8=new Uint8Array(pData);
var pDataTemp;
me._iFlags = 0;
var dwMagic=new Uint32Array(pData, 0, 1)[0];
if (dwMagic == 542327876) {
var pDDSHeader=new Uint32Array(pData, 4, 31);
var header= {};
header.dwSize = pDDSHeader[0];
header.dwFlags = pDDSHeader[1];
header.dwHeight = pDDSHeader[2];
header.dwWidth = pDDSHeader[3];
header.dwPitchOrLinearSize = pDDSHeader[4];
header.dwDepth = pDDSHeader[5];
header.dwMipMapCount = pDDSHeader[6];
header.dwReserved1 = [];
header.dwReserved1[0] = pDDSHeader[7];
header.dwReserved1[1] = pDDSHeader[8];
header.dwReserved1[2] = pDDSHeader[9];
header.dwReserved1[3] = pDDSHeader[10];
header.dwReserved1[4] = pDDSHeader[11];
header.dwReserved1[5] = pDDSHeader[12];
header.dwReserved1[6] = pDDSHeader[13];
header.dwReserved1[7] = pDDSHeader[14];
header.dwReserved1[8] = pDDSHeader[15];
header.dwReserved1[9] = pDDSHeader[16];
header.dwReserved1[10] = pDDSHeader[17];
header.ddspf =  {};
header.ddspf.dwSize = pDDSHeader[18];
header.ddspf.dwFlags = pDDSHeader[19];
header.ddspf.dwFourCC = pDDSHeader[20];
header.ddspf.dwRGBBitCount = pDDSHeader[21];
header.ddspf.dwRBitMask = pDDSHeader[22];
header.ddspf.dwGBitMask = pDDSHeader[23];
header.ddspf.dwBBitMask = pDDSHeader[24];
header.ddspf.dwABitMask = pDDSHeader[25];
header.dwCaps = pDDSHeader[26];
header.dwCaps2 = pDDSHeader[27];
header.dwCaps3 = pDDSHeader[28];
header.dwCaps4 = pDDSHeader[29];
header.dwReserved2 = pDDSHeader[30];
iOffset += 128;
if ((header.dwSize) != 124)if (!0) {
var err=((((((("Error:: " + "Размер заголовка DDS всегда должэен равняться 124") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Размер заголовка DDS всегда должэен равняться 124");

}


}

;

if (!((header.dwFlags) & 1))if (!0) {
var err=((((((("Error:: " + "Флаг DDSD_CAPS в заголовке DDS всегда должен быть") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDSD_CAPS в заголовке DDS всегда должен быть");

}


}

;

if (!((header.dwFlags) & 2))if (!0) {
var err=((((((("Error:: " + "Флаг DDSD_HEIGHT в заголовке DDS всегда должен быть") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDSD_HEIGHT в заголовке DDS всегда должен быть");

}


}

;

if (!((header.dwFlags) & 4))if (!0) {
var err=((((((("Error:: " + "Флаг DDSD_WIDTH в заголовке DDS всегда должен быть") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDSD_WIDTH в заголовке DDS всегда должен быть");

}


}

;

if (!((header.dwFlags) & 4096))if (!0) {
var err=((((((("Error:: " + "Флаг DDSD_PIXELFORMAT в заголовке DDS всегда должен быть") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDSD_PIXELFORMAT в заголовке DDS всегда должен быть");

}


}

;

me._iWidth = header.dwWidth;
me._iHeight = header.dwHeight;
if ((header.dwFlags) & 131072) {
me._iFlags |= 1 << 2;
nMipMap = header.dwMipMapCount;

}
else  {
nMipMap = 1;

}

if (((me._iFlags & (1 << 2)) != 0) && ((((me._iWidth) >>> (nMipMap - 1)) != 1) || (((me._iHeight) >>> (nMipMap - 1)) != 1))) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + (((((("Количество мипмапов не такое чтобы уменьшить размер картинки до 1x1" + nMipMap) + ",") + (me._iWidth)) + "x") + (me._iHeight)) + ")"));

}

if ((header.ddspf.dwSize) != 32) {
if (!0) {
var err=((((((("Error:: " + "Размер DDS_PIXELFORMAT всегда должен равняться 32") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Размер DDS_PIXELFORMAT всегда должен равняться 32");

}


}

;

}

if ((header.ddspf.dwFlags) & 4) {
if ((header.ddspf.dwFourCC) == 827611204) {
me._eFormat = 33777;

}
else if ((header.ddspf.dwFourCC) == 844388420) {
me._eFormat = 33780;

}
else if ((header.ddspf.dwFourCC) == 861165636) {
me._eFormat = 33778;

}
else if ((header.ddspf.dwFourCC) == 877942852) {
me._eFormat = 33781;

}
else if ((header.ddspf.dwFourCC) == 894720068) {
me._eFormat = 33779;

}
else if ((header.ddspf.dwFourCC) == 808540228) {
var pDDS10Header=new Uint32Array(pData, 128, 5);
var header10= {};
header10.dxgiFormat = pDDS10Header[0];
header10.resourceDimension = pDDS10Header[1];
header10.miscFlag = pDDS10Header[2];
header10.arraySize = pDDS10Header[3];
header10.reserved = pDDS10Header[4];
if (!0) {
var err=((((((("Error:: " + "Формат D3DFMT_DX10 не поддерживается") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Формат D3DFMT_DX10 не поддерживается");

}


}

;
iOffset += 20;

}
else  {
if (!0) {
var err=((((((("Error:: " + "Флаг DDPF_FOURCC стоит, а подходящего dwFourCC нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDPF_FOURCC стоит, а подходящего dwFourCC нет");

}


}

;

}







}

if ((header.ddspf.dwFlags) & 64) {
if ((((((me._eFormat) == (33777)) || ((me._eFormat) == (33780))) || ((me._eFormat) == (33778))) || ((me._eFormat) == (33781))) || ((me._eFormat) == (33779))) {
if (!0) {
var err=((((((("Error:: " + "Флаг DDPF_RGB стоит при сжатом формате картинки") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDPF_RGB стоит при сжатом формате картинки");

}


}

;

}

if ((header.ddspf.dwFlags) & 1) {
if ((((((header.ddspf.dwRGBBitCount) == 32) && ((header.ddspf.dwRBitMask) == 16711680)) && ((header.ddspf.dwGBitMask) == 65280)) && ((header.ddspf.dwBBitMask) == 255)) && ((header.ddspf.dwABitMask) == 4278190080)) {
me._eFormat = 6409;

}
else if ((((((header.ddspf.dwRGBBitCount) == 16) && ((header.ddspf.dwRBitMask) == 31744)) && ((header.ddspf.dwGBitMask) == 992)) && ((header.ddspf.dwBBitMask) == 31)) && ((header.ddspf.dwABitMask) == 32768)) {
me._eFormat = 32856;

}
else if ((((((header.ddspf.dwRGBBitCount) == 16) && ((header.ddspf.dwRBitMask) == 3840)) && ((header.ddspf.dwGBitMask) == 240)) && ((header.ddspf.dwBBitMask) == 15)) && ((header.ddspf.dwABitMask) == 61440)) {
me._eFormat = 32857;

}
else if ((((((header.ddspf.dwRGBBitCount) == 32) && ((header.ddspf.dwRBitMask) == 255)) && ((header.ddspf.dwGBitMask) == 65280)) && ((header.ddspf.dwBBitMask) == 16711680)) && ((header.ddspf.dwABitMask) == 4278190080)) {
me._eFormat = 6408;

}
else  {
if (!0) {
var err=((((((("Error:: " + "Флаг DDS_RGBA стоит, а подходящего формата не найдено") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDS_RGBA стоит, а подходящего формата не найдено");

}


}

;

}





}
else  {
if ((((((header.ddspf.dwRGBBitCount) == 24) && ((header.ddspf.dwRBitMask) == 16711680)) && ((header.ddspf.dwGBitMask) == 65280)) && ((header.ddspf.dwBBitMask) == 255)) && ((header.ddspf.dwABitMask) == 0)) {
me._eFormat = 32864;

}
else if ((((((header.ddspf.dwRGBBitCount) == 16) && ((header.ddspf.dwRBitMask) == 63488)) && ((header.ddspf.dwGBitMask) == 2016)) && ((header.ddspf.dwBBitMask) == 31)) && ((header.ddspf.dwABitMask) == 0)) {
me._eFormat = 36195;

}
else  {
if (!0) {
var err=((((((("Error:: " + "Флаг DDS_RGB стоит, а подходящего формата не найдено") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаг DDS_RGB стоит, а подходящего формата не найдено");

}


}

;

}



}


}

if (((!(header.ddspf.dwFlags)) & 64) && ((!(header.ddspf.dwFlags)) & 4)) {
if (!0) {
var err=((((((("Error:: " + "Флаги DDPF_RGB или DDPF_FOURCC не выставлены, остальные являются устаревшими") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Флаги DDPF_RGB или DDPF_FOURCC не выставлены, остальные являются устаревшими");

}


}

;

}

nCubeMap = 1;
me._iCubeFlags = 0;
if ((header.dwCaps2) & 512) {
nCubeMap = 0;
me._iFlags |= 1 << 1;
if ((header.dwCaps2) & 1024) {
nCubeMap++;
me._iCubeFlags |= 1 << 0;

}

if ((header.dwCaps2) & 2048) {
nCubeMap++;
me._iCubeFlags |= 1 << 1;

}

if ((header.dwCaps2) & 4096) {
nCubeMap++;
me._iCubeFlags |= 1 << 2;

}

if ((header.dwCaps2) & 8192) {
nCubeMap++;
me._iCubeFlags |= 1 << 3;

}

if ((header.dwCaps2) & 16384) {
nCubeMap++;
me._iCubeFlags |= 1 << 4;

}

if ((header.dwCaps2) & 32768) {
nCubeMap++;
me._iCubeFlags |= 1 << 5;

}

if (!(nCubeMap != 0)) {
var err=((((((("Error:: " + "Выставлен фдлаг с кубической текстурой, а самих текстур нету") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выставлен фдлаг с кубической текстурой, а самих текстур нету");

}


}

;

}

isOk = true;

}
else  {
if (!0) {
var err=((((((("Error:: " + (("Данный тип графического файла не поддерживается(" + dwMagic) + ")")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("Данный тип графического файла не поддерживается(" + dwMagic) + ")"));

}


}

;
isOk = false;

}

if (me.isCompressed()) {
if ((!(header.dwFlags)) & 524288) {
if (!0) {
var err=((((((("Error:: " + "У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");

}


}

;

}


}

var iX=me._iWidth;
var iY=me._iHeight;
var iSizeData=((Math.ceil(iX / (me.getDivSize()))) * (Math.ceil(iY / (me.getDivSize())))) * (me.getBlockBytes());
if (iSizeData != (header.dwPitchOrLinearSize)) {
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + (((("Несовпадают размеры картинки вычисленный и в файле(" + iSizeData) + ",") + (header.dwPitchOrLinearSize)) + ")"));

}

if ((!(header.dwFlags)) & 524288) {
if (!0) {
var err=((((((("Error:: " + "У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");

}


}

;

}

if ((me._iFlags & (1 << 1)) != 0) {
me._pData = new Array(nVolume);
for (k = 0; k < nVolume; k++) {
me._pData[k] = new Array(6);
for (l = 0; l < 6; l++) {
if ((me._iCubeFlags & (1 << ((0) + l))) != 0) {
me._pData[k][l] = new Array(nMipMap);

}


}


}

for (k = 0; k < nVolume; k++) {
console.log("Уровень", k);
for (l = 0; l < 6; l++) {
if ((me._iCubeFlags & (1 << ((0) + l))) != 0) {
console.log("Куб", l);
iX = me._iWidth;
iY = me._iHeight;
iSizeData = ((Math.ceil(iX / (me.getDivSize()))) * (Math.ceil(iY / (me.getDivSize())))) * (me.getBlockBytes());
for (var b=0; b < nMipMap; b++) {
console.log("МипМап", b);
me._pData[k][l][b] = new ArrayBuffer(iSizeData);
pDataTemp = new Uint8Array(me._pData[k][l][b]);
for (var a=0; a < iSizeData; a++) {
pDataTemp[a] = pData8[a + iOffset];

}

iOffset += iSizeData;
iX = Math.ceil(iX / 2);
iY = Math.ceil(iY / 2);
iSizeData = (Math.ceil((iX * iY) / ((me.getDivSize()) * (me.getDivSize())))) * (me.getBlockBytes());

}


}


}


}


}
else  {
me._pData = new Array(nVolume);
for (k = 0; k < nVolume; k++) {
me._pData[k] = new Array(6);
me._pData[k][0] = new Array(nMipMap);

}

for (k = 0; k < nVolume; k++) {
console.log("Уровень", k);
console.log("Картинка", 0);
iX = me._iWidth;
iY = me._iHeight;
iSizeData = ((Math.ceil(iX / (me.getDivSize()))) * (Math.ceil(iY / (me.getDivSize())))) * (me.getBlockBytes());
for (var b=0; b < nMipMap; b++) {
console.log("МипМап", b);
me._pData[k][0][b] = new ArrayBuffer(iSizeData);
pDataTemp = new Uint8Array(me._pData[k][0][b]);
for (var a=0; a < iSizeData; a++) {
pDataTemp[a] = pData8[a + iOffset];

}

iOffset += iSizeData;
iX = Math.ceil(iX / 2);
iY = Math.ceil(iY / 2);
iSizeData = (Math.ceil((iX * iY) / ((me.getDivSize()) * (me.getDivSize())))) * (me.getBlockBytes());

}


}


}

console.log("Результат: Общая длинна", iOffset, "iFlags", me._iFlags, "iCubeFlags", me._iCubeFlags);
if (fnCallBack) {
fnCallBack(isOk);

}


};

};
Img.prototype.getPixelRGBA = function(iX, iY, pPixel, iMipLevel, eCubeFlag, iVolumeLevel) {
if (iMipLevel == undefined) {
iMipLevel = 0;

}
else  {
if (!(this._iFlags & (1 << 2)) != 0) {
var err=((((((("Error:: " + "Запрашиваются мипмапы, а их нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашиваются мипмапы, а их нет");

}


}

;
if (!(iMipLevel < (this.getMipMapLevels()))) {
var err=((((((("Error:: " + "Запрашивается мипмап, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается мипмап, которого нет");

}


}

;

}

if (eCubeFlag == undefined) {
if (!(!((this._iFlags & (1 << 1)) != 0))) {
var err=((((((("Error:: " + "Не выставлена часть кубической картинки") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не выставлена часть кубической картинки");

}


}

;
eCubeFlag = 0;

}
else  {
if (!(this._iFlags & (1 << 1)) != 0) {
var err=((((((("Error:: " + "Выставлена часть кубической куртинки, хотя картинка не является кубической") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выставлена часть кубической куртинки, хотя картинка не является кубической");

}


}

;
if (!(this._iCubeFlags & (1 << eCubeFlag)) != 0) {
var err=((((((("Error:: " + "Запрашивается часть кубической текстуры которой нет, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть кубической текстуры которой нет, которого нет");

}


}

;

}

if (iVolumeLevel == undefined) {
iVolumeLevel = 0;

}
else  {
if (!(this._iFlags & (1 << 0)) != 0) {
var err=((((((("Error:: " + "Запрашивается часть объемной картинки, а картинка не объемная") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть объемной картинки, а картинка не объемная");

}


}

;
if (!(iVolumeLevel < (this.getVolumeLevels()))) {
var err=((((((("Error:: " + "Запрашивается часть объемной картинки, которой нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть объемной картинки, которой нет");

}


}

;

}

return this._getPixelRGBA(iX, iY, pPixel, iMipLevel, eCubeFlag, iVolumeLevel);

};
Img.prototype._getPixelRGBA = function(iX, iY, pPixel, iMipLevel, eCubeFlag, iVolumeLevel) {
var iOffset;
var pColor;
var iOffset;
if ((this._eFormat) == (6409)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = (pColor & 16711680) >>> 16;
pPixel[1] = (pColor & 65280) >>> 8;
pPixel[2] = pColor & 255;
pPixel[3] = (pColor & 4278190080) >>> 24;

}
else if ((this._eFormat) == (6408)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = pColor & 255;
pPixel[1] = (pColor & 65280) >>> 8;
pPixel[2] = (pColor & 16711680) >>> 16;
pPixel[3] = (pColor & 4278190080) >>> 24;

}
else if ((this._eFormat) == (32856)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = ((pColor & 31744) >>> 10) * 7;
pPixel[1] = ((pColor & 992) >>> 5) * 7;
pPixel[2] = (pColor & 31) * 7;
pPixel[3] = ((pColor & 32768) >>> 15) * 255;

}
else if ((this._eFormat) == (32855)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = (pColor & 31) * 7;
pPixel[1] = ((pColor & 992) >>> 5) * 7;
pPixel[2] = ((pColor & 31744) >>> 10) * 7;
pPixel[3] = ((pColor & 32768) >>> 15) * 255;

}
else if ((this._eFormat) == (32857)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = ((pColor & 3840) >>> 8) * 15;
pPixel[1] = ((pColor & 240) >>> 4) * 15;
pPixel[2] = (pColor & 15) * 15;
pPixel[3] = ((pColor & 61440) >>> 12) * 15;

}
else if ((this._eFormat) == (32854)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = (pColor & 15) * 15;
pPixel[1] = ((pColor & 240) >>> 4) * 15;
pPixel[2] = ((pColor & 3840) >>> 8) * 15;
pPixel[3] = ((pColor & 61440) >>> 12) * 15;

}
else if ((this._eFormat) == (32864)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 3);
pPixel[0] = pColor[2];
pPixel[1] = pColor[1];
pPixel[2] = pColor[0];
pPixel[3] = 255;

}
else if ((this._eFormat) == (32864)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 3);
pPixel[0] = pColor[0];
pPixel[1] = pColor[1];
pPixel[2] = pColor[2];
pPixel[3] = 255;

}
else if ((this._eFormat) == (36195)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = ((pColor & 63488) >>> 11) * 7;
pPixel[1] = ((pColor & 2016) >>> 5) * 3;
pPixel[2] = (pColor & 31) * 7;
pPixel[3] = 255;

}
else if ((this._eFormat) == (36194)) {
iOffset = ((iY * (this.getWidth(iMipLevel))) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
pPixel[0] = (pColor & 31) * 7;
pPixel[1] = ((pColor & 2016) >>> 5) * 3;
pPixel[2] = ((pColor & 63488) >>> 11) * 7;
pPixel[3] = 255;

}
else if ((this._eFormat) == (33777)) {
iOffset = (((Math.ceil((this.getWidth(iMipLevel)) / (this.getDivSize()))) * (Math.floor(iY / (this.getDivSize())))) + (Math.floor(iX / (this.getDivSize())))) * (this.getBlockBytes());
var pColor0=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
var pColor1=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 2, 1)[0];
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 4, 1)[0];
var iX0=iX % (this.getDivSize());
var iY0=iY % (this.getDivSize());
var iCode=(pColor >>> (2 * (((this.getDivSize()) * iY0) + iX0))) & 3;
if (pColor0 > pColor1) {
if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 2) {
pPixel[0] = ((((2 * (pColor0 & 63488)) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor0 & 2016)) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor0 & 31)) * 8) + ((pColor1 & 31) * 8)) / 3;
pPixel[3] = 255;

}
else if (iCode == 3) {
pPixel[0] = ((((2 * (pColor1 & 63488)) >>> 11) * 8) + (((pColor0 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor1 & 2016)) >>> 5) * 4) + (((pColor0 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor1 & 31)) * 8) + ((pColor0 & 31) * 8)) / 3;
pPixel[3] = 255;

}





}
else  {
if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 2) {
pPixel[0] = ((((pColor0 & 63488) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 2;
pPixel[1] = ((((pColor0 & 2016) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 2;
pPixel[2] = (((pColor0 & 31) * 8) + ((pColor1 & 31) * 8)) / 2;
pPixel[3] = 255;

}
else if (iCode == 3) {
pPixel[0] = 0;
pPixel[1] = 0;
pPixel[2] = 0;
pPixel[3] = 0;

}





}


}
else if ((this._eFormat) == (33776)) {
iOffset = (((Math.ceil((this.getWidth(iMipLevel)) / (this.getDivSize()))) * (Math.floor(iY / (this.getDivSize())))) + (Math.floor(iX / (this.getDivSize())))) * (this.getBlockBytes());
var pColor0=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
var pColor1=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 2, 1)[0];
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 4, 1)[0];
var iX0=iX % (this.getDivSize());
var iY0=iY % (this.getDivSize());
var iCode=(pColor >>> (2 * (((this.getDivSize()) * iY0) + iX0))) & 3;
if (pColor0 > pColor1) {
if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 2) {
pPixel[0] = ((((2 * (pColor0 & 63488)) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor0 & 2016)) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor0 & 31)) * 8) + ((pColor1 & 31) * 8)) / 3;
pPixel[3] = 255;

}
else if (iCode == 3) {
pPixel[0] = ((((2 * (pColor1 & 63488)) >>> 11) * 8) + (((pColor0 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor1 & 2016)) >>> 5) * 4) + (((pColor0 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor1 & 31)) * 8) + ((pColor0 & 31) * 8)) / 3;
pPixel[3] = 255;

}





}
else  {
if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;
pPixel[3] = 255;

}
else if (iCode == 2) {
pPixel[0] = ((((pColor0 & 63488) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 2;
pPixel[1] = ((((pColor0 & 2016) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 2;
pPixel[2] = (((pColor0 & 31) * 8) + ((pColor1 & 31) * 8)) / 2;
pPixel[3] = 255;

}
else if (iCode == 3) {
pPixel[0] = 0;
pPixel[1] = 0;
pPixel[2] = 0;
pPixel[3] = 255;

}





}


}
else if ((this._eFormat) == (33780)) {
iOffset = (((Math.ceil((this.getWidth(iMipLevel)) / (this.getDivSize()))) * (Math.floor(iY / (this.getDivSize())))) + (Math.floor(iX / (this.getDivSize())))) * (this.getBlockBytes());
var pColor0=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 8, 1)[0];
var pColor1=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 10, 1)[0];
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 12, 1)[0];
var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 8);
var iX0=iX % (this.getDivSize());
var iY0=iY % (this.getDivSize());
var iCode=(pColor >>> (2 * (((this.getDivSize()) * iY0) + iX0))) & 3;
pPixel[3] = (((pAlpha[Math.floor((((this.getDivSize()) * iY0) + iX0) / 2)]) >>> (4 * ((((this.getDivSize()) * iY0) + iX0) % 2))) & 15) * 15;
if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;

}
else if (iCode == 2) {
pPixel[0] = ((((2 * (pColor0 & 63488)) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor0 & 2016)) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor0 & 31)) * 8) + ((pColor1 & 31) * 8)) / 3;

}
else if (iCode == 3) {
pPixel[0] = ((((2 * (pColor1 & 63488)) >>> 11) * 8) + (((pColor0 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor1 & 2016)) >>> 5) * 4) + (((pColor0 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor1 & 31)) * 8) + ((pColor0 & 31) * 8)) / 3;

}




pPixel[0] = ((pPixel[0]) * 255) / (pPixel[3]);
pPixel[1] = ((pPixel[1]) * 255) / (pPixel[3]);
pPixel[2] = ((pPixel[2]) * 255) / (pPixel[3]);

}
else if ((this._eFormat) == (33778)) {
iOffset = (((Math.ceil((this.getWidth(iMipLevel)) / (this.getDivSize()))) * (Math.floor(iY / (this.getDivSize())))) + (Math.floor(iX / (this.getDivSize())))) * (this.getBlockBytes());
var pColor0=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 8, 1)[0];
var pColor1=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 10, 1)[0];
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 12, 1)[0];
var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 8);
var iX0=iX % (this.getDivSize());
var iY0=iY % (this.getDivSize());
var iCode=(pColor >>> (2 * (((this.getDivSize()) * iY0) + iX0))) & 3;
if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;
pPixel[3] = (((pAlpha[Math.floor((((this.getDivSize()) * iY0) + iX0) / 2)]) >>> (4 * ((((this.getDivSize()) * iY0) + iX0) % 2))) & 15) * 15;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;
pPixel[3] = (((pAlpha[Math.floor((((this.getDivSize()) * iY0) + iX0) / 2)]) >>> (4 * ((((this.getDivSize()) * iY0) + iX0) % 2))) & 15) * 15;

}
else if (iCode == 2) {
pPixel[0] = ((((2 * (pColor0 & 63488)) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor0 & 2016)) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor0 & 31)) * 8) + ((pColor1 & 31) * 8)) / 3;
pPixel[3] = (((pAlpha[Math.floor((((this.getDivSize()) * iY0) + iX0) / 2)]) >>> (4 * ((((this.getDivSize()) * iY0) + iX0) % 2))) & 15) * 15;

}
else if (iCode == 3) {
pPixel[0] = ((((2 * (pColor1 & 63488)) >>> 11) * 8) + (((pColor0 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor1 & 2016)) >>> 5) * 4) + (((pColor0 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor1 & 31)) * 8) + ((pColor0 & 31) * 8)) / 3;
pPixel[3] = (((pAlpha[Math.floor((((this.getDivSize()) * iY0) + iX0) / 2)]) >>> (4 * ((((this.getDivSize()) * iY0) + iX0) % 2))) & 15) * 15;

}





}
else if ((this._eFormat) == (33781)) {
iOffset = (((Math.ceil((this.getWidth(iMipLevel)) / (this.getDivSize()))) * (Math.floor(iY / (this.getDivSize())))) + (Math.floor(iX / (this.getDivSize())))) * (this.getBlockBytes());
var pColor0=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 8, 1)[0];
var pColor1=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 10, 1)[0];
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 12, 1)[0];
var pAlpha0=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
var pAlpha1=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 1, 1)[0];
var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 2, 6);
var iX0=iX % (this.getDivSize());
var iY0=iY % (this.getDivSize());
var iCode=(pColor >>> (2 * (((this.getDivSize()) * iY0) + iX0))) & 3;
var iAlphaCode;
switch((iY0 * (this.getDivSize())) + iX0) {
case 0:
iAlphaCode = (pAlpha[0]) & 7;
break ;

case 1:
iAlphaCode = ((pAlpha[0]) & 56) >>> 3;
break ;

case 2:
iAlphaCode = (((pAlpha[0]) & 192) >> 6) + (((pAlpha[1]) & 1) << 2);
break ;

case 3:
iAlphaCode = ((pAlpha[1]) & 14) >>> 1;
break ;

case 4:
iAlphaCode = ((pAlpha[1]) & 112) >>> 4;
break ;

case 5:
iAlphaCode = (((pAlpha[1]) & 128) >>> 7) + (((pAlpha[2]) & 3) << 1);
break ;

case 6:
iAlphaCode = ((pAlpha[2]) & 28) >>> 2;
break ;

case 7:
iAlphaCode = ((pAlpha[2]) & 224) >>> 5;
break ;

case 8:
iAlphaCode = (pAlpha[3]) & 7;
break ;

case 9:
iAlphaCode = ((pAlpha[3]) & 56) >>> 3;
break ;

case 10:
iAlphaCode = (((pAlpha[3]) & 192) >> 6) + (((pAlpha[4]) & 1) << 2);
break ;

case 11:
iAlphaCode = ((pAlpha[4]) & 14) >>> 1;
break ;

case 12:
iAlphaCode = ((pAlpha[4]) & 112) >>> 4;
break ;

case 13:
iAlphaCode = (((pAlpha[4]) & 128) >>> 7) + (((pAlpha[5]) & 3) << 1);
break ;

case 14:
iAlphaCode = ((pAlpha[5]) & 28) >>> 2;
break ;

case 15:
iAlphaCode = ((pAlpha[5]) & 224) >>> 5;
break ;
}
if (pAlpha0 > pAlpha1) {
if (iAlphaCode == 0) {
pPixel[3] = pAlpha0;

}
else if (iAlphaCode == 1) {
pPixel[3] = pAlpha1;

}
else if (iAlphaCode == 2) {
pPixel[3] = ((6 * pAlpha0) + (1 * pAlpha1)) / 7;

}
else if (iAlphaCode == 3) {
pPixel[3] = ((5 * pAlpha0) + (2 * pAlpha1)) / 7;

}
else if (iAlphaCode == 4) {
pPixel[3] = ((4 * pAlpha0) + (3 * pAlpha1)) / 7;

}
else if (iAlphaCode == 5) {
pPixel[3] = ((3 * pAlpha0) + (4 * pAlpha1)) / 7;

}
else if (iAlphaCode == 6) {
pPixel[3] = ((2 * pAlpha0) + (5 * pAlpha1)) / 7;

}
else if (iAlphaCode == 7) {
pPixel[3] = ((1 * pAlpha0) + (6 * pAlpha1)) / 7;

}









}
else  {
if (iAlphaCode == 0) {
pPixel[3] = pAlpha0;

}
else if (iAlphaCode == 1) {
pPixel[3] = pAlpha1;

}
else if (iAlphaCode == 2) {
pPixel[3] = ((4 * pAlpha0) + (1 * pAlpha1)) / 5;

}
else if (iAlphaCode == 3) {
pPixel[3] = ((3 * pAlpha0) + (2 * pAlpha1)) / 5;

}
else if (iAlphaCode == 4) {
pPixel[3] = ((2 * pAlpha0) + (3 * pAlpha1)) / 5;

}
else if (iAlphaCode == 5) {
pPixel[3] = ((1 * pAlpha0) + (4 * pAlpha1)) / 5;

}
else if (iAlphaCode == 6) {
pPixel[3] = 0;

}
else if (iAlphaCode == 7) {
pPixel[3] = 1;

}









}

if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;

}
else if (iCode == 2) {
pPixel[0] = ((((2 * (pColor0 & 63488)) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor0 & 2016)) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor0 & 31)) * 8) + ((pColor1 & 31) * 8)) / 3;

}
else if (iCode == 3) {
pPixel[0] = ((((2 * (pColor1 & 63488)) >>> 11) * 8) + (((pColor0 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor1 & 2016)) >>> 5) * 4) + (((pColor0 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor1 & 31)) * 8) + ((pColor0 & 31) * 8)) / 3;

}




pPixel[0] = ((pPixel[0]) * 255) / (pPixel[3]);
pPixel[1] = ((pPixel[1]) * 255) / (pPixel[3]);
pPixel[2] = ((pPixel[2]) * 255) / (pPixel[3]);

}
else if ((this._eFormat) == (33779)) {
iOffset = (((Math.ceil((this.getWidth(iMipLevel)) / (this.getDivSize()))) * (Math.floor(iY / (this.getDivSize())))) + (Math.floor(iX / (this.getDivSize())))) * (this.getBlockBytes());
var pColor0=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 8, 1)[0];
var pColor1=new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 10, 1)[0];
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 12, 1)[0];
var pAlpha0=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1)[0];
var pAlpha1=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 1, 1)[0];
var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset + 2, 6);
var iX0=iX % (this.getDivSize());
var iY0=iY % (this.getDivSize());
var iCode=(pColor >>> (2 * (((this.getDivSize()) * iY0) + iX0))) & 3;
var iAlphaCode;
switch((iY0 * (this.getDivSize())) + iX0) {
case 0:
iAlphaCode = (pAlpha[0]) & 7;
break ;

case 1:
iAlphaCode = ((pAlpha[0]) & 56) >>> 3;
break ;

case 2:
iAlphaCode = (((pAlpha[0]) & 192) >> 6) + (((pAlpha[1]) & 1) << 2);
break ;

case 3:
iAlphaCode = ((pAlpha[1]) & 14) >>> 1;
break ;

case 4:
iAlphaCode = ((pAlpha[1]) & 112) >>> 4;
break ;

case 5:
iAlphaCode = (((pAlpha[1]) & 128) >>> 7) + (((pAlpha[2]) & 3) << 1);
break ;

case 6:
iAlphaCode = ((pAlpha[2]) & 28) >>> 2;
break ;

case 7:
iAlphaCode = ((pAlpha[2]) & 224) >>> 5;
break ;

case 8:
iAlphaCode = (pAlpha[3]) & 7;
break ;

case 9:
iAlphaCode = ((pAlpha[3]) & 56) >>> 3;
break ;

case 10:
iAlphaCode = (((pAlpha[3]) & 192) >> 6) + (((pAlpha[4]) & 1) << 2);
break ;

case 11:
iAlphaCode = ((pAlpha[4]) & 14) >>> 1;
break ;

case 12:
iAlphaCode = ((pAlpha[4]) & 112) >>> 4;
break ;

case 13:
iAlphaCode = (((pAlpha[4]) & 128) >>> 7) + (((pAlpha[5]) & 3) << 1);
break ;

case 14:
iAlphaCode = ((pAlpha[5]) & 28) >>> 2;
break ;

case 15:
iAlphaCode = ((pAlpha[5]) & 224) >>> 5;
break ;
}
if (pAlpha0 > pAlpha1) {
if (iAlphaCode == 0) {
pPixel[3] = pAlpha0;

}
else if (iAlphaCode == 1) {
pPixel[3] = pAlpha1;

}
else if (iAlphaCode == 2) {
pPixel[3] = ((6 * pAlpha0) + (1 * pAlpha1)) / 7;

}
else if (iAlphaCode == 3) {
pPixel[3] = ((5 * pAlpha0) + (2 * pAlpha1)) / 7;

}
else if (iAlphaCode == 4) {
pPixel[3] = ((4 * pAlpha0) + (3 * pAlpha1)) / 7;

}
else if (iAlphaCode == 5) {
pPixel[3] = ((3 * pAlpha0) + (4 * pAlpha1)) / 7;

}
else if (iAlphaCode == 6) {
pPixel[3] = ((2 * pAlpha0) + (5 * pAlpha1)) / 7;

}
else if (iAlphaCode == 7) {
pPixel[3] = ((1 * pAlpha0) + (6 * pAlpha1)) / 7;

}









}
else  {
if (iAlphaCode == 0) {
pPixel[3] = pAlpha0;

}
else if (iAlphaCode == 1) {
pPixel[3] = pAlpha1;

}
else if (iAlphaCode == 2) {
pPixel[3] = ((4 * pAlpha0) + (1 * pAlpha1)) / 5;

}
else if (iAlphaCode == 3) {
pPixel[3] = ((3 * pAlpha0) + (2 * pAlpha1)) / 5;

}
else if (iAlphaCode == 4) {
pPixel[3] = ((2 * pAlpha0) + (3 * pAlpha1)) / 5;

}
else if (iAlphaCode == 5) {
pPixel[3] = ((1 * pAlpha0) + (4 * pAlpha1)) / 5;

}
else if (iAlphaCode == 6) {
pPixel[3] = 0;

}
else if (iAlphaCode == 7) {
pPixel[3] = 1;

}









}

if (iCode == 0) {
pPixel[0] = ((pColor0 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor0 & 2016) >>> 5) * 4;
pPixel[2] = (pColor0 & 31) * 8;

}
else if (iCode == 1) {
pPixel[0] = ((pColor1 & 63488) >>> 11) * 8;
pPixel[1] = ((pColor1 & 2016) >>> 5) * 4;
pPixel[2] = (pColor1 & 31) * 8;

}
else if (iCode == 2) {
pPixel[0] = ((((2 * (pColor0 & 63488)) >>> 11) * 8) + (((pColor1 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor0 & 2016)) >>> 5) * 4) + (((pColor1 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor0 & 31)) * 8) + ((pColor1 & 31) * 8)) / 3;

}
else if (iCode == 3) {
pPixel[0] = ((((2 * (pColor1 & 63488)) >>> 11) * 8) + (((pColor0 & 63488) >>> 11) * 8)) / 3;
pPixel[1] = ((((2 * (pColor1 & 2016)) >>> 5) * 4) + (((pColor0 & 2016) >>> 5) * 4)) / 3;
pPixel[2] = (((2 * (pColor1 & 31)) * 8) + ((pColor0 & 31) * 8)) / 3;

}





}
















return pPixel;

};
Img.prototype.convert = function(eFormat) {
var iLength;
var iOffset;
var iColor1;
var iColor2;
var iColor3;
var iColor4;
var pOldBuffer;
var pNewBuffer;
var pNewData;
var pPixel=new Uint8Array(4);
var nMipMap=this.getMipLevels();
if (nMipMap == undefined) {
nMipMap = 1;

}

var nVolume=this.getVolumeLevels();
if (nVolume == undefined) {
nVolume = 1;

}

var iCubeFlags=this._iCubeFlags;
if (!((this._iFlags & (1 << 1)) != 0)) {
iCubeFlags = 1;

}

if ((this._eFormat) == eFormat) {
return 1;

}

if ((this._eFormat) == (32864)) {
if (eFormat == (6407)) {
for (k = 0; k < nVolume; k++) {
for (l = 0; l < 6; l++) {
if ((iCubeFlags & (1 << ((0) + l))) != 0) {
for (var m=0; m < nMipMap; m++) {
iLength = this._pData[k][l][b].length;
pNewBuffer = new Uint8Array(this._pData[k][l][b]);
for (var b=0; b < iLength; b += 3) {
iColor1 = pNewBuffer[b];
pNewBuffer[b] = pNewBuffer[b + 2];
pNewBuffer[b + 2] = iColor1;

}


}


}


}


}

this._eFormat = 6407;
return 1;

}
else if (eFormat == (6408)) {
pNewData = new Array(nVolume);
for (k = 0; k < nVolume; k++) {
pNewData[k] = new Array(6);
for (l = 0; l < 6; l++) {
if ((iCubeFlags & (1 << ((0) + l))) != 0) {
pNewData[k][l] = new Array(nMipMap);
for (var m=0; m < nMipMap; m++) {
iLength = this._pData[k][l][m].length;
pNewData[k][l][m] = new ArrayBuffer((iLength * 4) / 3);
pNewBuffer = new Uint8Array(pNewData[k][l][m]);
pOldBuffer = new Uint8Array(this._pData[k][l][m]);
for (var b=0, d=0; b < iLength; b += 3, d += 4) {
pNewBuffer[d] = pOldBuffer[b + 2];
pNewBuffer[d + 1] = pOldBuffer[b + 1];
pNewBuffer[d + 2] = pOldBuffer[b];
pNewBuffer[d + 3] = 256;

}


}


}


}


}

this._pData = pNewData;
this._eFormat = 6408;
return 1;

}
else if (eFormat == (6409)) {
pNewData = new Array(nVolume);
for (k = 0; k < nVolume; k++) {
pNewData[k] = new Array(6);
for (l = 0; l < 6; l++) {
if ((iCubeFlags & (1 << ((0) + l))) != 0) {
pNewData[k][l] = new Array(nMipMap);
for (var m=0; m < nMipMap; m++) {
iLength = this._pData[k][l][m].length;
pNewData[k][l][m] = new ArrayBuffer((iLength * 4) / 3);
pNewBuffer = new Uint8Array(pNewData[k][l][m]);
pOldBuffer = new Uint8Array(this._pData[k][l][m]);
for (var b=0, d=0; b < iLength; b += 3, d += 4) {
pNewBuffer[d] = pOldBuffer[b];
pNewBuffer[d + 1] = pOldBuffer[b + 1];
pNewBuffer[d + 2] = pOldBuffer[b + 2];
pNewBuffer[d + 3] = 256;

}


}


}


}


}

this._pData = pNewData;
this._eFormat = 6409;
return 1;

}
else if (eFormat == (32854)) {
pNewData = new Array(nVolume);
for (k = 0; k < nVolume; k++) {
pNewData[k] = new Array(6);
for (l = 0; l < 6; l++) {
if ((iCubeFlags & (1 << ((0) + l))) != 0) {
pNewData[k][l] = new Array(nMipMap);
for (var m=0; m < nMipMap; m++) {
iLength = this._pData[k][l][m].length;
pOldBuffer = new Uint8Array(this._pData[k][l][m]);
pNewData[k][l][m] = new ArrayBuffer((iLength * 2) / 3);
pNewBuffer = new Uint16Buffer(pNewData[k][l][m]);
for (var b=0, d=0; b < iLength; b += 3, d += 1) {
pNewBuffer[d] = 0;
pNewBuffer[d] |= ((pOldBuffer[b + 2]) / 16) << 12;
pNewBuffer[d] |= ((pOldBuffer[b + 1]) / 16) << 8;
pNewBuffer[d] |= ((pOldBuffer[b]) / 16) << 4;
pNewBuffer[d] |= 15;

}


}


}


}


}

this._pData = pNewData;
this._eFormat = 32854;
return 1;

}
else  {
if (!0) {
var err=((((((("Error:: " + (((("Перевод из формата " + (this._eFormat)) + " в ") + eFormat) + " не поддерживается")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((((("Перевод из формата " + (this._eFormat)) + " в ") + eFormat) + " не поддерживается"));

}


}

;
return 0;

}





}
else if (((((((this._eFormat) == (33779)) || ((this._eFormat) == (33781))) || ((this._eFormat) == (33778))) || ((this._eFormat) == (33780))) || ((this._eFormat) == (33777))) || ((this._eFormat) == (33776))) {
if (eFormat == (6408)) {
pNewData = new Array(nVolume);
for (k = 0; k < nVolume; k++) {
pNewData[k] = new Array(6);
for (l = 0; l < 6; l++) {
if ((iCubeFlags & (1 << ((0) + l))) != 0) {
pNewData[k][l] = new Array(nMipMap);
for (var m=0; m < nMipMap; m++) {
iHeight = this.getHeight(m, l, k);
iWidth = this.getWidth(m, l, k);
iLength = (iWidth * iHeight) * 4;
pNewData[k][l][m] = new ArrayBuffer(iLength);
pNewBuffer = new Uint8Array(pNewData[k][l][m]);
for (var y=0; y < iHeight; y++) {
for (var x=0; x < iWidth; x++) {
iOffset = ((y * iWidth) + x) * 4;
this._getPixelRGBA(x, y, pPixel, m, l, k);
pNewBuffer[iOffset + 0] = pPixel[0];
pNewBuffer[iOffset + 1] = pPixel[1];
pNewBuffer[iOffset + 2] = pPixel[2];
pNewBuffer[iOffset + 3] = pPixel[3];

}


}


}


}


}


}

this._pData = pNewData;
this._eFormat = 6408;
return 1;

}

if (eFormat == (6407)) {
var iHeight;
var iWidth;
pNewData = new Array(nVolume);
for (k = 0; k < nVolume; k++) {
pNewData[k] = new Array(6);
for (l = 0; l < 6; l++) {
if ((iCubeFlags & (1 << ((0) + l))) != 0) {
pNewData[k][l] = new Array(nMipMap);
for (var m=0; m < nMipMap; m++) {
iHeight = this.getHeight(m, l, k);
iWidth = this.getWidth(m, l, k);
iLength = (iWidth * iHeight) * 3;
pNewData[k][l][m] = new ArrayBuffer(iLength);
pNewBuffer = new Uint8Array(pNewData[k][l][m]);
for (var y=0; y < iHeight; y++) {
for (var x=0; x < iWidth; x++) {
iOffset = ((y * iWidth) + x) * 3;
this._getPixelRGBA(x, y, pPixel, m, l, k);
pNewBuffer[iOffset + 0] = pPixel[0];
pNewBuffer[iOffset + 1] = pPixel[1];
pNewBuffer[iOffset + 2] = pPixel[2];

}


}


}


}


}


}

this._pData = pNewData;
this._eFormat = 6407;
return 1;

}
else  {
if (!0) {
var err=((((((("Error:: " + (((("Перевод из формата " + (this._eFormat)) + " в ") + eFormat) + " не поддерживается")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((((("Перевод из формата " + (this._eFormat)) + " в ") + eFormat) + " не поддерживается"));

}


}

;
return 0;

}


}


if (!0) {
var err=((((((("Error:: " + (((("Перевод из формата " + (this._eFormat)) + " в ") + eFormat) + " не поддерживается")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((((("Перевод из формата " + (this._eFormat)) + " в ") + eFormat) + " не поддерживается"));

}


}

;
return 0;

};
Img.prototype.setPixelRGBA = function(iX, iY, pPixel, iMipLevel, eCubeFlag, iVolumeLevel) {
if (iMipLevel == undefined) {
iMipLevel = 0;

}
else  {
if (!(this._iFlags & (1 << 2)) != 0) {
var err=((((((("Error:: " + "Запрашиваются мипмапы, а их нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашиваются мипмапы, а их нет");

}


}

;
if (!(iMipLevel < (this.getMipMapLevels()))) {
var err=((((((("Error:: " + "Запрашивается мипмап, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается мипмап, которого нет");

}


}

;

}

if (eCubeFlag == undefined) {
if (!(!((this._iFlags & (1 << 1)) != 0))) {
var err=((((((("Error:: " + "Не выставлена часть кубической картинки") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не выставлена часть кубической картинки");

}


}

;
eCubeFlag = 0;

}
else  {
if (!(this._iFlags & (1 << 1)) != 0) {
var err=((((((("Error:: " + "Выставлена часть кубической куртинки, хотя картинка не является кубической") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Выставлена часть кубической куртинки, хотя картинка не является кубической");

}


}

;
if (!(this._iCubeFlags & (1 << eCubeFlag)) != 0) {
var err=((((((("Error:: " + "Запрашивается часть кубической текстуры которой нет, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть кубической текстуры которой нет, которого нет");

}


}

;

}

if (iVolumeLevel == undefined) {
iVolumeLevel = 0;

}
else  {
if (!(this._iFlags & (1 << 0)) != 0) {
var err=((((((("Error:: " + "Запрашивается часть объемной картинки, а картинка не объемная") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть объемной картинки, а картинка не объемная");

}


}

;
if (!(iVolumeLevel < (this.getVolumeLevels()))) {
var err=((((((("Error:: " + "Запрашивается часть объемной картинки, которой нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается часть объемной картинки, которой нет");

}


}

;

}

return this._setPixelRGBA(iX, iY, pPixel, iMipLevel, eCubeFlag, iVolumeLevel);

};
Img.prototype._setPixelRGBA = function(iX, iY, pPixel, iMipLevel, eCubeFlag, iVolumeLevel) {
var iOffset;
var pColor;
var iOffset;
if ((this._eFormat) == (6409)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor[0] = 0;
pColor[0] |= (pPixel[0]) << 16;
pColor[0] |= (pPixel[1]) << 8;
pColor[0] |= pPixel[2];
pColor[0] |= (pPixel[3]) << 24;

}
else if ((this._eFormat) == (6408)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor[0] = 0;
pColor[0] |= pPixel[0];
pColor[0] |= (pPixel[1]) << 8;
pColor[0] |= (pPixel[2]) << 16;
pColor[0] |= (pPixel[3]) << 24;

}
else if ((this._eFormat) == (32856)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor = 0;
pColor |= ([0]((pPixel[0]) / 7)) << 10;
pColor |= ([0]((pPixel[1]) / 7)) << 5;
pColor |= [0]((pPixel[2]) / 7);
pColor |= ([0]((pPixel[3]) / 255)) << 15;

}
else if ((this._eFormat) == (32855)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor[0] = 0;
pColor[0] |= (pPixel[0]) / 7;
pColor[0] |= ((pPixel[1]) / 7) << 5;
pColor[0] |= ((pPixel[2]) / 7) << 10;
pColor[0] |= ((pPixel[3]) / 255) << 15;

}
else if ((this._eFormat) == (32857)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor[0] = 0;
pColor[0] |= ((pPixel[0]) / 15) << 8;
pColor[0] |= ((pPixel[1]) / 15) << 4;
pColor[0] |= (pPixel[2]) / 15;
pColor[0] |= ((pPixel[3]) / 15) << 12;

}
else if ((this._eFormat) == (32854)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor[0] = 0;
pColor[0] |= (pPixel[0]) / 15;
pColor[0] |= ((pPixel[1]) / 15) << 4;
pColor[0] |= ((pPixel[2]) / 15) << 8;
pColor[0] |= ((pPixel[3]) / 15) << 12;

}
else if ((this._eFormat) == (6407)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 3);
pColor[0] = pPixel[0];
pColor[1] = pPixel[1];
pColor[2] = pPixel[2];

}
else if ((this._eFormat) == (32864)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 3);
pColor[2] = pPixel[2];
pColor[1] = pPixel[1];
pColor[0] = pPixel[0];

}
else if ((this._eFormat) == (36195)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor[0] = 0;
pColor[0] |= ((pPixel[0]) / 7) << 11;
pColor[0] |= ((pPixel[1]) / 3) << 5;
pColor[0] |= (pPixel[2]) / 7;

}
else if ((this._eFormat) == (36194)) {
iOffset = ((iY * (this._iWidth)) + iX) * (this.getBlockBytes());
pColor = new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel], iOffset, 1);
pColor[0] = 0;
pColor[0] |= (pPixel[0]) / 7;
pColor[0] |= ((pPixel[1]) / 3) << 5;
pColor[0] |= ((pPixel[2]) / 7) << 11;

}
else  {
if (!0) {
var err=((((((("Error:: " + "Установка цвета в такой формат не поддерживается") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Установка цвета в такой формат не поддерживается");

}


}

;

}











};
Img.prototype.generatePerlinNoise = function(fScale, iOctaves, fFalloff) {
var pPerlin=new PerlinNoise();
var pColor=new Uint8Array(4);
if (!((this._pData) != null)) {
var err=((((((("Error:: " + "Картинка еще не cоздана") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Картинка еще не cоздана");

}


}

;
if (!((this._iFlags) == 0)) {
var err=((((((("Error:: " + "Картинка не является простой") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Картинка не является простой");

}


}

;
for (var y=0; y < (this.getHeight()); y++) {
for (var x=0; x < (this.getWidth()); x++) {
var fX=x;
var fY=y;
var fAccum=0;
var fFrequency=fScale;
var fAmplitude=1;
for (var i=0; i < iOctaves; ++i) {
fAccum += (pPerlin.noise(fX, fY, fFrequency)) * fAmplitude;
fAmplitude *= fFalloff;
fFrequency *= 2;

}

fAccum = Math.max((-1), Math.min(fAccum, 1));
fAccum *= 0.5;
fAccum += 0.5;
fAccum *= 255;
pColor[0] = fAccum;
pColor[1] = fAccum;
pColor[2] = fAccum;
pColor[3] = 255;
this._setPixelRGBA(x, y, pColor, 0, 0, 0);

}


}


};
Img.prototype.randomChannelNoise = function(iChannel, iMinRange, iMaxRange) {
if (!(iChannel < 4)) {
var err=((((((("Error:: " + "invalid image channel") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid image channel");

}


}

;
if (!((this._pData) != null)) {
var err=((((((("Error:: " + "Картинка еще не cоздана") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Картинка еще не cоздана");

}


}

;
if (!((this._iFlags) == 0)) {
var err=((((((("Error:: " + "Картинка не является простой") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Картинка не является простой");

}


}

;
var pColor=new Uint8Array(4);
var iNoise;
var iHeight=this.getHeight();
var iWidth=this.getWidth();
for (var y=0; y < iHeight; y++) {
for (var x=0; x < iWidth; x++) {
this._getPixelRGBA(x, y, pColor, 0, 0, 0);
iNoise = iMinRange + ((Math.random()) * (iMaxRange - iMinRange));
pColor[iChannel] = iNoise;
this._setPixelRGBA(x, y, pColor, 0, 0, 0);

}


}


};
a.Img = Img;
function Texture(pEngine) {
Texture.ctor.apply(this, arguments);
this._pDevice = pEngine.pDevice;
this._iFlags = 0;
this._pTexture = null;
this._pFrameBuffer = null;
this._iWidth = 0;
this._iHeight = 0;
this._eFormat = 6408;
this._eType = 5121;

}

a.extend(Texture, a.ResourcePoolItem);
a.defineProperty(Texture, "texture", function() {
return this._pTexture;

}
);
a.defineProperty(Texture, "height", function() {
if (this._pTexture) {
return this._iHeight;

}

return 0;

}
, function(iValue) {
this.resize(this._iWidth, iValue);

}
);
a.defineProperty(Texture, "width", function() {
if (this._pTexture) {
return this._iWidth;

}

return 0;

}
, function(iValue) {
this.resize(iValue, this.height);

}
);
a.defineProperty(Texture, "typeSize", function() {
return a.getTypeSize(this._eType);

}
);
a.defineProperty(Texture, "numElementsPerPixel", function() {
return a.getIFormatNumElements(this._eFormat);

}
);
a.defineProperty(Texture, "type", function() {
return this._eType;

}
, function(eValue) {
if (this._pTexture) {
this.repack(this._iWidth, this._iHeight, this.format, eValue);

}

this._eType = eValue;

}
);
a.defineProperty(Texture, "format", function() {
return this._eFormat;

}
, function(eValue) {
if (this._pTexture) {
this.repack(this._iWidth, this._iHeight, eValue, this.type);

}

this._eFormat = eValue;

}
);
a.defineProperty(Texture, "magFilter", function() {
return this._getParameter(10240);

}
, function(eValue) {
this.applyParameter(10240, eValue);

}
);
a.defineProperty(Texture, "minFilter", function() {
return this._getParameter(10241);

}
, function(eValue) {
this.applyParameter(10241, eValue);

}
);
a.defineProperty(Texture, "wraps", function() {
return this._getParameter(10242);

}
, function(eValue) {
this.applyParameter(10242, eValue);

}
);
a.defineProperty(Texture, "wrapt", function() {
return this._getTexParameter(10243);

}
, function(eValue) {
this.applyParameter(10243, eValue);

}
);
a.defineProperty(Texture, "target", function() {
return ((this._iFlags & (1 << 1)) != 0? 34067 : 3553);

}
);
Texture.prototype.flipY = function(bValue) {
this._pDevice.pixelStorei(37440, (bValue === undefined? true : bValue));

};
Texture.prototype._getParameter = function(eName) {
return this._pDevice.getTexParameter(this.target, eName);

};
Texture.prototype.applyParameter = function(eParam, eValue) {
var pDevice=this._pDevice;
if (this._pTexture) {
var eTarget=this.target;
pDevice.bindTexture(eTarget, this._pTexture);
pDevice.texParameteri(eTarget, eParam, eValue);
pDevice.bindTexture(eTarget, null);

}


};
Texture.prototype.isCubeTexture = function() {
return (this._iFlags & (1 << 1)) != 0;

};
Texture.prototype.is2DTexture = function() {
return !((this._iFlags & (1 << 1)) != 0);

};
Texture.prototype.isCompressed = function() {
return ((this._eFormat) >= (33776)) && ((this._eFormat) <= (33781));

};
Texture.prototype.getMipLevels = function() {
if ((this._iFlags & (1 << 2)) != 0) {
return (Math.ceil(Math.max((Math.log(this._iWidth)) / (Math.LN2), (Math.log(this._iHeight)) / (Math.LN2)))) + 1;

}
else  {
return undefined;

}


};
Texture.prototype.getPixelRGBA = function(iX, iY, iWidth, iHeight, pPixel, iMipMap, eCubeFlag) {
var pDevice=this._pEngine.pDevice;
if ((!((this._iFlags & (1 << 2)) != 0)) && (iMipMap != undefined)) {
if (!0) {
var err=((((((("Error:: " + "Запрашивается уровень мип мапа, хотя текстура их не содрежит") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается уровень мип мапа, хотя текстура их не содрежит");

}


}

;

}

if (iMipMap == undefined) {
iMipMap = 0;

}

if ((this._iFlags & (1 << 2)) != 0) {
if (!(iMipMap < (Math.ceil((Math.max((Math.log(this._iWidth)) / (Math.LN2), (Math.log(this._iHeight)) / (Math.LN2))) + 1)))) {
var err=((((((("Error:: " + "Запрашивается уровень мип мапа, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается уровень мип мапа, которого нет");

}


}

;

}

if ((this._pFrameBuffer) && (this._pTexture)) {
pDevice.bindFramebuffer(36160, this._pFrameBuffer);
if (this.isCubeTexture()) {
if (!(eCubeFlag != undefined)) {
var err=((((((("Error:: " + "тип текстуры кубическая,а eCubeFlag - undefined") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("тип текстуры кубическая,а eCubeFlag - undefined");

}


}

;
pDevice.framebufferTexture2D(36160, 36064, eCubeFlag, this._pTexture, iMipMap);

}
else  {
if (!(eCubeFlag == undefined)) {
var err=((((((("Error:: " + "тип текстуры 2D,а eCubeFlag выставлен") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("тип текстуры 2D,а eCubeFlag выставлен");

}


}

;
pDevice.framebufferTexture2D(36160, 36064, 3553, this._pTexture, iMipMap);

}

pDevice.readPixels(iX, iY, iWidth, iHeight, 6408, 5121, pPixel);
pDevice.bindFramebuffer(36160, null);
return pPixel;

}
else  {
return null;

}


};
Texture.prototype.setPixelRGBA = function(iX, iY, iWidth, iHeight, pPixel, iMipMap, eCubeFlag) {
iMipMap = iMipMap || 0;
eCubeFlag = eCubeFlag || 0;
var pDevice=this._pEngine.pDevice;
if (!(!((!((this._iFlags & (1 << 2)) != 0)) && iMipMap))) {
var err=((((((("Error:: " + "Запрашивается уровень мип мапа, хотя текстура их не содрежит") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается уровень мип мапа, хотя текстура их не содрежит");

}


}

;
if ((this._iFlags & (1 << 2)) != 0) {
if (!(iMipMap < (Math.ceil((Math.max((Math.log(this._iWidth)) / (Math.LN2), (Math.log(this._iHeight)) / (Math.LN2))) + 1)))) {
var err=((((((("Error:: " + "Запрашивается уровень мип мапа, которого нет") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Запрашивается уровень мип мапа, которого нет");

}


}

;

}

if ((this._pTexture) === null) {
return false;

}

if (this.isCubeTexture()) {
if (!(eCubeFlag != undefined)) {
var err=((((((("Error:: " + "тип текстуры кубическая,а eCubeFlag - undefined") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("тип текстуры кубическая,а eCubeFlag - undefined");

}


}

;
pDevice.bindTexture(34067, this._pTexture);
pDevice.texSubImage2D(eCubeFlag, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, this._eType, pPixel);
pDevice.bindTexture(34067, null);

}
else  {
pDevice.bindTexture(3553, this._pTexture);
if (this.isCompressed()) {
pDevice.compressedTexSubImage2D(3553, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, pPixel);

}
else  {
pDevice.texSubImage2D(3553, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, this._eType, pPixel);

}

pDevice.bindTexture(3553, null);

}

return true;

};
Texture.prototype.createResource = function() {
if (!(!(this.isResourceCreated()))) {
var err=((((((("Error:: " + "The resource has already been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has already been created.");

}


}

;
this.notifyCreated();
this.notifyDisabled();
return true;

};
Texture.prototype.releaseTexture = function() {
var pDevice=this._pEngine.pDevice;
if (pDevice.isTexture(this._pTexture)) {
pDevice.deleteTexture(this._pTexture);

}

if (pDevice.isFramebuffer(this._pFrameBuffer)) {
pDevice.deleteFramebuffer(this._pFrameBuffer);

}

this._pTexture = null;
this._pFrameBuffer = null;

};
Texture.prototype.generateNormalMap = function(pHeightMap, iChannel, fAmplitude) {
var pDevice=this._pEngine.pDevice;
this.releaseTexture();
this._pTexture = pDevice.createTexture();
this._pFrameBuffer = pDevice.createFramebuffer();
this._iWidth = pHeightMap.getWidth();
this._iHeight = pHeightMap.getHeight();
pDevice.bindTexture(3553, this._pTexture);
pDevice.texImage2D(3553, 0, 6408, this._iWidth, this._iHeight, 0, 6408, 5121, null);
pDevice.bindTexture(3553, null);
var pColor=new Uint8Array(((this._iWidth) * (this._iHeight)) * 4);
var pNormalTable=new Array((this._iWidth) * (this._iHeight));
for (var i=0; i < ((this._iWidth) * (this._iHeight)); i++) {
pNormalTable[i] = Vec3.create();

}

a.computeNormalMap(pDevice, pHeightMap, pNormalTable, iChannel, fAmplitude, 4);
var iIndex;
var iOffset;
for (var y=0; y < (this.height); y++) {
for (var x=0; x < (this._iWidth); x++) {
iIndex = (y * (this._iWidth)) + x;
iOffset = iIndex * 4;
pColor[iOffset + 0] = pNormalTable[iIndex][0];
pColor[iOffset + 1] = pNormalTable[iIndex][1];
pColor[iOffset + 2] = pNormalTable[iIndex][2];
pColor[iOffset + 3] = 255;

}


}

this.setPixelRGBA(0, 0, this._iWidth, this._iHeight, pColor);
delete pNormalTable;

};
Texture.prototype.generateNormalizationCubeMap = function() {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::generateNormalizationCubeMap()"));
throw new Error("TODO::\n" + "Texture::generateNormalizationCubeMap()");

};
Texture.prototype.maskWithImage = function(pImage) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::maskWithImage()"));
throw new Error("TODO::\n" + "Texture::maskWithImage()");

};
Texture.prototype.convertToNormalMap = function(iChannel, iFlags, fAmplitude) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::convertToNormalMap()"));
throw new Error("TODO::\n" + "Texture::convertToNormalMap()");

};
Texture.prototype.getSurfaceLevel = function(iLevel, ppSurface) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::getSurfaceLevel()"));
throw new Error("TODO::\n" + "Texture::getSurfaceLevel()");

};
Texture.prototype._loadFromResourceFile = function(InputFile) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::_loadFromResourceFile()"));
throw new Error("TODO::\n" + "Texture::_loadFromResourceFile()");

};
Texture.prototype._checkCubeTextureRequirements = function() {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::_checkCubeTextureRequirements()"));
throw new Error("TODO::\n" + "Texture::_checkCubeTextureRequirements()");

};
Texture.prototype.destroyResource = function() {
if (this.isResourceCreated()) {
this.disableResource();
this.releaseTexture();
this.notifyUnloaded();
this.notifyDestroyed();
return true;

}

return false;

};
Texture.prototype.restoreResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyRestored();
return true;

};
Texture.prototype.disableResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyDisabled();
return true;

};
Texture.prototype._checkTextureRequirements = function(iWidth, iHeight, iMipLevels, eFormat) {
return true;

};
Texture.prototype._loadTextureFromMemory = function(pMemory) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::_loadTextureFromMemory()"));
throw new Error("TODO::\n" + "Texture::_loadTextureFromMemory()");

};
Texture.prototype._loadCubeTextureFromImageFile = function(sFilename) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::_loadCubeTextureFromImageFile()"));
throw new Error("TODO::\n" + "Texture::_loadCubeTextureFromImageFile()");

};
Texture.prototype._loadCubeTextureFromMemory = function(pMemory) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::_loadCubeTextureFromMemory()"));
throw new Error("TODO::\n" + "Texture::_loadCubeTextureFromMemory()");

};
Texture.prototype.loadResource = function(sFileName) {
if (!sFileName) {
var sResourceName=this.findResourceName();
if (sResourceName) {
sFileName = sResourceName;

}


}

var pImage=new a.Img(this._pEngine);
var me=this;
pImage.load(sFileName, function() {
me.uploadImage(pImage);

}
);
return true;

};
Texture.prototype.saveResource = function(sFilename) {
var pBaseTexture;
var isOk;
if (!sFilename) {
var pString=this.findResourceName();
if (pString) {
sFilename = pString;

}


}

pBaseTexture = this._pTexture;
isOk = false;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::saveResource()"));
throw new Error("TODO::\n" + "Texture::saveResource()");
return isOk;

};
Texture.prototype.uploadCubeFace = function(pImage, eFace, isCopyAll) {
isCopyAll = isCopyAll || true;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::uploadCubeFace()"));
throw new Error("TODO::\n" + "Texture::uploadCubeFace()");

};
Texture.prototype.uploadImage = function(pImage) {
var pDevice=this._pEngine.pDevice;
var nMipMaps;
var iCubeFlags;
this.releaseTexture();
this._pTexture = pDevice.createTexture();
this._pFrameBuffer = pDevice.createFramebuffer();
if (!(a.info.graphics.checkFormat(pDevice, pImage.getFormat()))) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "Формат не поддерживается, происходит переконвертация");
pImage.convert(6408);

}

this._iWidth = pImage.getWidth();
this._iHeight = pImage.getHeight();
this._eFormat = pImage.getFormatShort();
this._eType = pImage.getType();
nMipMaps = pImage.getMipLevels();
if ((nMipMaps == undefined) || (nMipMaps != ((Math.ceil(Math.max((Math.log(this._iWidth)) / (Math.LN2), (Math.log(this._iHeight)) / (Math.LN2)))) + 1))) {
this._iFlags &= ~(1 << 2);
nMipMaps = 1;

}
else  {
this._iFlags |= 1 << 2;

}

iCubeFlags = pImage.getCubeFlags();
if ((iCubeFlags == undefined) || (iCubeFlags != ((((((1 << 0) | (1 << 1)) | (1 << 2)) | (1 << 3)) | (1 << 4)) | (1 << 5)))) {
this._iFlags &= ~(1 << 1);
this.bind();
this.flipY();
for (var i=0; i < nMipMaps; i++) {
if (!(pImage.isCompressed())) {
pDevice.texImage2D(3553, i, this._eFormat, pImage.getWidth(i), pImage.getHeight(i), 0, this._eFormat, this._eType, new Uint8Array(pImage.getData(i)));

}
else  {
pDevice.compressedTexImage2D(3553, i, this._eFormat, pImage.getWidth(i), pImage.getHeight(i), 0, new Uint8Array(pImage.getData(i)));

}


}


}
else  {
this._iFlags |= 1 << 1;
this.bind();
this.flipY();
for (var k=0; k < 6; k++) {
for (var i=0; i < nMipMaps; i++) {
if (!(pImage.isCompressed())) {
pDevice.texImage2D((34069) + k, i, this._eFormat, pImage.getWidth(i), pImage.getHeight(i), 0, this._eFormat, this._eType, new Uint8Array(pImage.getData(i, k)));

}
else  {
pDevice.compressedTexImage2D((34069) + k, i, this._eFormat, pImage.getWidth(i), pImage.getHeight(i), 0, new Uint8Array(pImage.getData(i, k)));

}


}


}


}

if (((this._iFlags & (1 << 2)) != 0) && (((this.minFilter) == (9729)) || ((this.minFilter) == (9728)))) {
this.applyParameter(10241, 9987);

}
else if (((!((this._iFlags & (1 << 2)) != 0)) && ((this.minFilter) != (9729))) && ((this.minFilter) != (9728))) {
this.applyParameter(10241, ((Math.floor((this.minFilter) - (9984))) / 2) + (9728));

}


this.applyParameter(10240, 9729);
this.applyParameter(10242, 10497);
this.applyParameter(10243, 10497);
this.unbind();
this.notifyLoaded();
this.notifyRestored();

};
Texture.prototype.resize = function(iWidth, iHeight) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture:: resize with scale"));
throw new Error("TODO::\n" + "Texture:: resize with scale");
return false;

};
Texture.prototype.extend = function(iWidth, iHeight) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "extend texture"));
throw new Error("TODO::\n" + "extend texture");
return false;

};
Texture.prototype.repack = function(iWidth, iHeight, eFormat, eType) {
if (!this._pTexture) {
var err=((((((("Error:: " + "Cannot repack, because texture not created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot repack, because texture not created.");

}


}

;
eFormat = eFormat || (this._eFormat);
eType = eType || (this._eType);
var pDevice=this._pEngine.pDevice;
if (!(this._pRepackProgram)) {
this._pRepackProgram = this._pEngine.displayManager().shaderProgramPool().createResource("A_repackTexture");
this._pRepackProgram.create("                                   \n            attribute float SERIALNUMBER;       \n            uniform vec2 sourceTextureSize;     \n            uniform vec2 destinationTextureSize;\n            uniform sampler2D sourceTexture;    \n                                                \n            varying vec4 vData;                 \n                                                \n            void main(void){                    \n                vData = texture2D(sourceTexture,                vec2(mod(SERIALNUMBER,sourceTextureSize.x)/sourceTextureSize.x,                (floor(SERIALNUMBER/sourceTextureSize.x))/sourceTextureSize.y));\n                                                \n                gl_Position = vec4(2.*                mod(SERIALNUMBER,destinationTextureSize.x)/destinationTextureSize.x - 1.,\n                2.*floor(SERIALNUMBER/destinationTextureSize.x)/destinationTextureSize.y                 - 1.,0.,1.);\n            }                                   \n            ", "                                   \n            #ifdef GL_ES                        \n                precision highp float;          \n            #endif                              \n                                                \n            varying vec4 vData;                 \n                                                \n            void main(void){                    \n                gl_FragColor = vData;           \n            }                                   \n    ", true);

}

var pProgram=this._pRepackProgram;
pProgram.activate();
var pDestinationTexture=pDevice.createTexture();
pDevice.activeTexture(pDevice.TEXTURE1);
pDevice.bindTexture(pDevice.TEXTURE_2D, pDestinationTexture);
pDevice.texImage2D(pDevice.TEXTURE_2D, 0, eFormat, iWidth, iHeight, 0, eFormat, eType, null);
pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MAG_FILTER, pDevice.NEAREST);
pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MIN_FILTER, pDevice.NEAREST);
pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_S, pDevice.CLAMP_TO_EDGE);
pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_T, pDevice.CLAMP_TO_EDGE);
var pDestinationFrameBuffer=pDevice.createFramebuffer();
pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, pDestinationFrameBuffer);
pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0, pDevice.TEXTURE_2D, pDestinationTexture, 0);
var pRenderIndexData=new Float32Array((this._iWidth) * (this._iHeight));
for (var i=0; i < (pRenderIndexData.length); i++) {
pRenderIndexData[i] = i;

}

var pRenderIndexBuffer=pDevice.createBuffer();
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pRenderIndexBuffer);
pDevice.bufferData(pDevice.ARRAY_BUFFER, pRenderIndexData, pDevice.STREAM_DRAW);
pDevice.activeTexture(pDevice.TEXTURE0);
pDevice.bindTexture(pDevice.TEXTURE_2D, this._pTexture);
pProgram.applyVector2("sourceTextureSize", this._iWidth, this._iHeight);
pProgram.applyVector2("destinationTextureSize", iWidth, iHeight);
pProgram.applyInt("sourceTexture", 0);
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pRenderIndexBuffer);
pDevice.vertexAttribPointer(pProgram._pAttributesByName["SERIALNUMBER"].iLocation, 1, pDevice.FLOAT, false, 0, 0);
pDevice.viewport(0, 0, iWidth, iHeight);
pDevice.drawArrays(0, 0, pRenderIndexData.length);
pDevice.flush();
pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);
pDevice.deleteBuffer(pRenderIndexBuffer);
pDevice.deleteTexture(this._pTexture);
pDevice.deleteFramebuffer(pDestinationFrameBuffer);
pProgram.deactivate();
this._pTexture = pDestinationTexture;
this._eFormat = eFormat;
this._eType = eType;
this._iWidth = iWidth;
this._iHeight = iHeight;
return false;

};
Texture.prototype.createTexture = function(iWidth, iHeight, eFlags, eFormat, eType, pData) {
var pDevice=this._pEngine.pDevice;
var nMipMaps=1;
this._iWidth = iWidth;
this._iHeight = iHeight;
if (eFlags == undefined) {
eFlags = 0;

}

this.releaseTexture();
this._pTexture = pDevice.createTexture();
this._pFrameBuffer = pDevice.createFramebuffer();
this._iFlags = eFlags;
this._eFormat = eFormat || (this._eFormat);
this._eType = eType || (this._eType);
if (!(pData instanceof Array)) {
pData = [pData];

}

this.bind();
pDevice.pixelStorei(pDevice.UNPACK_ALIGNMENT, 1);
if ((eFlags & (1 << 2)) != 0) {
nMipMaps = (Math.ceil(Math.max((Math.log(this._iWidth)) / (Math.LN2), (Math.log(this._iHeight)) / (Math.LN2)))) + 1;

}

if ((eFlags & (1 << 1)) != 0) {
for (var k=0; k < 6; k++) {
for (var i=0; i < nMipMaps; i++) {
pDevice.texImage2D((34069) + k, i, this._eFormat, this._iWidth, this._iHeight, 0, this._eFormat, this._eType, (pData[i]? pData[i] : null));

}


}


}
else  {
if (this.isCompressed()) {
for (var i=0; i < nMipMaps; i++) {
pDevice.compressedTexImage2D(3553, i, this._eFormat, this._iWidth, this._iHeight, 0, (pData[i]? pData[i] : null));

}


}
else  {
for (var i=0; i < nMipMaps; i++) {
console.log("Texture:: creating texture miplevel:", i);
pDevice.texImage2D(3553, i, this._eFormat, this._iWidth, this._iHeight, 0, this._eFormat, this._eType, (pData[i]? pData[i] : null));

}


}


}

this.applyParameter(10242, 10497);
this.applyParameter(10243, 10497);
this.applyParameter(10240, 9729);
this.applyParameter(10241, 9729);
this.unbind();
this.notifyLoaded();
this.notifyRestored();
return true;

};
Texture.prototype.bind = function() {
this._pEngine.pDevice.bindTexture(this.target, this._pTexture);

};
Texture.prototype.unbind = function() {
this._pEngine.pDevice.bindTexture(this.target, null);

};
Texture.prototype.activate = function(iSlot) {
var pManager=this._pEngine.pShaderManager;
if ((pManager.activeTextures[iSlot]) !== (this)) {
this._pEngine.pDevice.activeTexture((33984) + (iSlot || 0));
this.bind();
pManager.activeTextures[iSlot] = this;

}


};
Texture.prototype.createCubeTexture = function(iSize, iMipLevels, eFormat) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::createCubeTexture()"));
throw new Error("TODO::\n" + "Texture::createCubeTexture()");

};
Texture.prototype.convertToNormalMap = function(iChannel, iFlags, fAmplitude) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + ("TODO:: " + "Texture::convertToNormalMap()"));
throw new Error("TODO::\n" + "Texture::convertToNormalMap()");

};
Texture.prototype.useAlignment = function() {

};
a.Texture = Texture;
function VBufferBase() {
this._pBuffer = null;
this._pBackupCopy = null;
this._iTypeFlags = 0;
this._pVertexDataArray = new Array();
this._iNextID = 0;

}

;
VBufferBase.prototype.create = function(iByteSize, iFlags, pData) {

};
VBufferBase.prototype.destroy = function() {

};
VBufferBase.prototype.getData = function(iOffset, iSize) {

};
VBufferBase.prototype.setData = function(pData, iOffset, iSize, nCountStart, nCount) {

};
VBufferBase.prototype.resize = function(iSize) {

};
VBufferBase.prototype.getNextID = function() {
return this._iNextID++;

};
VBufferBase.prototype.clone = function(pSrc) {
var isSuccess=false;
this.destroy();
isSuccess = this.create(pSrc.getCount(), pSrc.getStride(), pSrc.getTypeFlags(), pSrc.getData());
return isSuccess;

};
VBufferBase.prototype.isValid = function() {
return ((this._pBuffer) != null? true : false);

};
VBufferBase.prototype.isDynamic = function() {
return TEST_BIT((this._iTypeFlags, 0) && ((this._iTypeFlags & (1 << 1)) != 0));

};
VBufferBase.prototype.isStatic = function() {
return (!((this._iTypeFlags & (1 << 0)) != 0)) && ((this._iTypeFlags & (1 << 1)) != 0);

};
VBufferBase.prototype.isStream = function() {
return (!((this._iTypeFlags & (1 << 0)) != 0)) && (!((this._iTypeFlags & (1 << 1)) != 0));

};
VBufferBase.prototype.isReadable = function() {
return (this._iTypeFlags & (1 << 2)) != 0;

};
VBufferBase.prototype.isRAMBufferPresent = function() {
return ((this._pBackupCopy) != null? true : false);

};
VBufferBase.prototype.isSoftware = function() {
return (this._iTypeFlags & (1 << 4)) != 0;

};
VBufferBase.prototype.isAlignment = function() {
return (this._iTypeFlags & (1 << 5)) != 0;

};
VBufferBase.prototype.getBuffer = function() {
return this._pBuffer;

};
VBufferBase.prototype.getTypeFlags = function() {
return this._iTypeFlags;

};
VBufferBase.prototype.getVertexData = function(iOffset, iCount, pVertexDeclaration) {
pVertexDeclaration = a.normalizeVertexDecl(pVertexDeclaration);
var pVertexData=new a.VertexData(this, iOffset, iCount, pVertexDeclaration);
this._pVertexDataArray.push(pVertexData);
return pVertexData;

};
VBufferBase.prototype.freeVertexData = function(pVertexData) {
if ((arguments.length) == 0) {
for (var i in this._pVertexDataArray) {
this._pVertexDataArray[i].destroy();

}

this._pVertexDataArray = null;

}
else  {
for (var i=0; i < (this._pVertexDataArray.length); i++) {
if ((this._pVertexDataArray[i]) == pVertexData) {
this._pVertexDataArray.splice(i, 1);
return true;

}


}

pVertexData.destroy();
return false;

}


};
VBufferBase.prototype.allocateData = function(pVertexDecl, pData) {
pVertexDecl = a.normalizeVertexDecl(pVertexDecl);
var pVertexData;
var iCount=(pData.byteLength) / (pVertexDecl.stride);
if (!(iCount === (Math.floor(iCount)))) {
var err=((((((("Error:: " + "Data size should be a multiple of the vertex declaration.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Data size should be a multiple of the vertex declaration.");

}


}

;
pVertexData = this.getEmptyVertexData(iCount, pVertexDecl);
pVertexData.setData(pData, 0, pVertexDecl.stride);
return pVertexData;

};
VBufferBase.prototype.getEmptyVertexData = function(iCount, pVertexDeclaration, pVertexDataIn) {
while (1) {
var pHole=new Array();
var i;
var pVertexData;
pHole[0] =  {start: 0, end: this.size};
for (var k in this._pVertexDataArray) {
pVertexData = this._pVertexDataArray[k];
for (i = 0; i < (pHole.length); i++) {
if (((pVertexData.getOffset()) > (pHole[i].start)) && (((pVertexData.getOffset()) + (pVertexData.size)) < (pHole[i].end))) {
var iTemp=pHole[i].end;
pHole[i].end = pVertexData.getOffset();
pHole.splice(i + 1, 0,  {start: (pVertexData.getOffset()) + (pVertexData.size), end: iTemp});
i--;

}
else if (((pVertexData.getOffset()) == (pHole[i].start)) && (((pVertexData.getOffset()) + (pVertexData.size)) < (pHole[i].end))) {
pHole[i].start = (pVertexData.getOffset()) + (pVertexData.size);

}
else if (((pVertexData.getOffset()) > (pHole[i].start)) && (((pVertexData.getOffset()) + (pVertexData.size)) == (pHole[i].end))) {

}
else if (((pVertexData.getOffset()) == (pHole[i].start)) && ((pVertexData.size) == (pHole[i].size))) {
pHole.splice(i, 1);
i--;

}
else if ((((pVertexData.getOffset()) < (pHole[i].start)) && (((pVertexData.getOffset()) + (pVertexData.size)) > (pHole[i].start))) && (((pVertexData.getOffset()) + (pVertexData.size)) < (pHole[i].end))) {
pHole.start = (pVertexData.getOffset()) + (pVertexData.size);

}
else if ((((pVertexData.getOffset()) < (pHole[i].start)) && (((pVertexData.getOffset()) + (pVertexData.size)) > (pHole[i].start))) && (((pVertexData.getOffset()) + (pVertexData.size)) == (pHole[i].end))) {
pHole.splice(i, 1);
i--;

}
else if (((((pVertexData.getOffset()) + (pVertexData.size)) > (pHole[i].end)) && ((pVertexData.getOffset()) > (pHole[i].start))) && ((pVertexData.getOffset()) < (pHole[i].end))) {
pHole.end = pVertexData.getOffset();

}
else if (((((pVertexData.getOffset()) + (pVertexData.size)) > (pHole[i].end)) && ((pVertexData.getOffset()) == (pHole[i].start))) && ((pVertexData.getOffset()) < (pHole[i].end))) {
pHole.splice(i, 1);
i--;

}
else if (((pVertexData.getOffset()) < (pHole[i].start)) && (((pVertexData.getOffset()) + (pVertexData.size)) > (pHole[i].end))) {
i--;

}










}


}

function order(a, b) {
return ((a.end) - (a.start)) - ((b.end) - (b.start));

}

pHole.sort(order);
var iStride=0;
if ((typeof pVertexDeclaration) != "number") {
pVertexDeclaration = a.normalizeVertexDecl(pVertexDeclaration);
iStride = pVertexDeclaration.iStride;

}
else  {
iStride = pVertexDeclaration;

}

for (i = 0; i < (pHole.length); i++) {
var iAligStart=(this.isAlignment()? Math.alignUp(pHole[i].start, Math.nok(iStride, 4)) : Math.alignUp(pHole[i].start, iStride));
if (((pHole[i].end) - iAligStart) >= (iCount * iStride)) {
if ((arguments.length) == 2) {
var pVertexData=new a.VertexData(this, iAligStart, iCount, pVertexDeclaration);
this._pVertexDataArray.push(pVertexData);
return pVertexData;

}
else if ((arguments.length) == 3) {
pVertexDataIn.constructor.call(pVertexDataIn, this, iAligStart, iCount, pVertexDeclaration);
this._pVertexDataArray.push(pVertexDataIn);
return pVertexDataIn;

}
else  {
return null;

}



}


}

if ((this.resize(Math.max((this.size) * 2, (this.size) + (iCount * iStride)))) == false) {
break ;

}


}
return null;

};
a.VBufferBase = VBufferBase;
function IndexBuffer(pEngine) {
this._pEngine = pEngine;
this._pDevice = pEngine.pDevice;
this._pBuffer = null;
this._pBackupCopy = null;
this._iTypeFlags = 0;
this._iByteSize = undefined;
this._pIndexDataArray = new Array();
IndexBuffer.superclass.constructor.apply(this, arguments);

}

a.extend(IndexBuffer, a.ResourcePoolItem);
IndexBuffer.prototype.isValid = function() {
return ((this._pBuffer) != null? true : false);

};
IndexBuffer.prototype.isDynamic = function() {
return ((this._iTypeFlags & (1 << 0)) != 0) && ((this._iTypeFlags & (1 << 1)) != 0);

};
IndexBuffer.prototype.isStatic = function() {
return (!((this._iTypeFlags & (1 << 0)) != 0)) && ((this._iTypeFlags & (1 << 1)) != 0);

};
IndexBuffer.prototype.isStream = function() {
return (!((this._iTypeFlags & (1 << 0)) != 0)) && (!((this._iTypeFlags & (1 << 1)) != 0));

};
IndexBuffer.prototype.isReadable = function() {
return (this._iTypeFlags & (1 << 2)) != 0;

};
IndexBuffer.prototype.isRAMBufferPresent = function() {
return ((this._pBackupCopy) != null? true : false);

};
IndexBuffer.prototype.isSoftware = function() {
return (this._iTypeFlags & (1 << 4)) != 0;

};
IndexBuffer.prototype.getBuffer = function() {
return this._pBuffer;

};
IndexBuffer.prototype.getUsage = function() {
return this._iTypeFlags;

};
IndexBuffer.prototype.getSize = function() {
return this._iByteSize;

};
IndexBuffer.prototype.create = function(iByteSize, iFlags, pData) {
if (!((this._pBuffer) == null)) {
var err=((((((("Error:: " + "d3d buffer already allocated") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("d3d buffer already allocated");

}


}

;
if (!((this._pBackupCopy) == null)) {
var err=((((((("Error:: " + "backup buffer already allocated") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("backup buffer already allocated");

}


}

;
var eUsage=0;
this._iByteSize = iByteSize;
this._iTypeFlags = iFlags;
if (!(!((this._iTypeFlags & (1 << 4)) != 0))) {
var err=((((((("Error:: " + "no sftware rendering") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("no sftware rendering");

}


}

;
if (((this._iTypeFlags & (1 << 0)) != 0) && (!((this._iTypeFlags & (1 << 1)) != 0))) {
if (!(this._iTypeFlags & (1 << 4)) != 0) {
var err=((((((("Error:: " + "crazy... more update bun one draw") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("crazy... more update bun one draw");

}


}

;

}

if ((this._iTypeFlags & (1 << 3)) != 0) {
this._iTypeFlags |= 1 << 2;

}
else  {
if ((this._iTypeFlags & (1 << 2)) != 0) {
this._iTypeFlags |= 1 << 3;

}


}

if (pData) {
if (!((pData.byteLength) <= iByteSize)) {
var err=((((((("Error:: " + "Размер переданного массива больше переданного размера буфера") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Размер переданного массива больше переданного размера буфера");

}


}

;

}

if ((this._iTypeFlags & (1 << 3)) != 0) {
this._pBackupCopy = new Uint8Array(this._iByteSize);
if (pData) {
this._pBackupCopy.set(pData.buffer, 0);

}


}

if (((this._iTypeFlags & (1 << 0)) != 0) && ((this._iTypeFlags & (1 << 1)) != 0)) {
eUsage = 35048;

}
else if ((!((this._iTypeFlags & (1 << 0)) != 0)) && ((this._iTypeFlags & (1 << 1)) != 0)) {
eUsage = 35044;

}
else  {
eUsage = 35040;

}


this._pBuffer = this._pDevice.createBuffer();
if (!(this._pBuffer)) {
this._pBuffer = null;
if (!0) {
var err=((((((("Error:: " + "Не удалось создать буфер") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не удалось создать буфер");

}


}

;
this.destroy();
return false;

}

this._pDevice.bindBuffer(34963, this._pBuffer);
this._pDevice.bufferData(34963, this._iByteSize, eUsage);
if (pData) {
this._pDevice.bufferSubData(34963, 0, new Uint16Array(pData.buffer));

}

this._pDevice.bindBuffer(34963, null);
return true;

};
IndexBuffer.prototype.destroy = function() {
if (this._pDevice.isBuffer(this._pBuffer)) {
this._pDevice.deleteBuffer(this._pBuffer);

}

this._pBuffer = null;
this._pBackupCopy = null;
this._iByteSize = undefined;
for (var i in this._pIndexDataArray) {
this._pIndexDataArray[i].destroy();

}

this._pIndexDataArray = null;
this._iTypeFlags = 0;
this.notifyUnloaded();

};
IndexBuffer.prototype.clone = function(pSrc) {
var isSuccess=false;
this.destroy();
this.create(pSrc.getByteSize(), pSrc.getUsage(), pSrc.getData(0, pSrc.getByteSize()));
return isSuccess;

};
IndexBuffer.prototype.getData = function(iOffset, iSize) {
if (!this._pBuffer) {
var err=((((((("Error:: " + "Буффер еще не создан") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Буффер еще не создан");

}


}

;
if (!(((this._iTypeFlags & (1 << 3)) != 0) == true)) {
var err=((((((("Error:: " + "Нельзя отдать данные если они не храняться локально") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Нельзя отдать данные если они не храняться локально");

}


}

;
return this._pBackupCopy.buffer.slice(iOffset, iOffset + iSize);

};
IndexBuffer.prototype.setData = function(pData, iOffset, iSize) {
if (!this._pBuffer) {
var err=((((((("Error:: " + "Буффер еще не создан") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Буффер еще не создан");

}


}

;
this._pDevice.bindBuffer(34963, this._pBuffer);
if (!((pData.byteLength) <= iSize)) {
var err=((((((("Error:: " + "Размер переданного массива больше переданного размера") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Размер переданного массива больше переданного размера");

}


}

;
this._pDevice.bufferSubData(34963, iOffset, pData.slice(0, iSize));
this._pDevice.bindBuffer(34963, null);
if ((this._iTypeFlags & (1 << a.VertexBuffer.RamBackupBit)) != 0) {
this._pBackupCopy.set(new Uint8Array(pData.slice(0, iSize)), iOffset);

}

return true;

};
IndexBuffer.prototype.activate = function() {
if (!this.isValid()) {
var err=((((((("Error:: " + "Attempting to activate an invalid buffer") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Attempting to activate an invalid buffer");

}


}

;
this._pDevice.bindBuffer(34963, this._pBuffer);

};
IndexBuffer.prototype.createResource = function() {
this.notifyCreated();
return true;

};
IndexBuffer.prototype.destroyResource = function() {
this.destroy();
this.notifyDestroyed();
return true;

};
IndexBuffer.prototype.restoreResource = function() {
this.notifyRestored();
return true;

};
IndexBuffer.prototype.disableResource = function() {
this.notifyDisabled();
return true;

};
IndexBuffer.prototype.loadResource = function() {
return true;

};
IndexBuffer.prototype.saveResource = function() {
return true;

};
IndexBuffer.prototype.getIndexData = function(iOffset, iCount, ePrimitiveType, eElementsType) {
var pIndexData=new a.IndexData(this, iOffset, iCount, ePrimitiveType, eElementsType);
this._pIndexDataArray.push(pIndexData);
return pIndexData;

};
IndexBuffer.prototype.freeIndexData = function(pIndexData) {
for (var i=0; i < (this._pIndexDataArray.length); i++) {
if ((this._pIndexDataArray[i]) == pIndexData) {
this._pIndexDataArray.splice(i, 1);
return true;

}


}

pIndexData.destroy();
return false;

};
IndexBuffer.prototype.getEmptyIndexData = function(iCount, ePrimitiveType, eElementsType) {
var pHole=new Array();
var i;
var pIndexData;
pHole[0] =  {start: 0, end: this.getSize()};
for (var k in this._pIndexDataArray) {
pIndexData = this._pIndexDataArray[k];
for (i = 0; i < (pHole.length); i++) {
if (((pIndexData.getOffset()) > (pHole[i].start)) && (((pIndexData.getOffset()) + (pIndexData.getSize())) < (pHole[i].end))) {
var iTemp=pHole[i].end;
pHole[i].end = pIndexData.getOffset();
pHole.splice(i + 1, 0,  {start: (pIndexData.getOffset()) + (pIndexData.getSize()), end: iTemp});
i--;

}
else if (((pIndexData.getOffset()) == (pHole[i].start)) && (((pIndexData.getOffset()) + (pIndexData.getSize())) < (pHole[i].end))) {
pHole[i].start = (pIndexData.getOffset()) + (pIndexData.getSize());

}
else if (((pIndexData.getOffset()) > (pHole[i].start)) && (((pIndexData.getOffset()) + (pIndexData.getSize())) == (pHole[i].end))) {

}
else if (((pIndexData.getOffset()) == (pHole[i].start)) && ((pIndexData.getSize()) == (pHole[i].size))) {
pHole.splice(i, 1);
i--;

}
else if ((((pIndexData.getOffset()) < (pHole[i].start)) && (((pIndexData.getOffset()) + (pIndexData.getSize())) > (pHole[i].start))) && (((pIndexData.getOffset()) + (pIndexData.getSize())) < (pHole[i].end))) {
pHole.start = (pIndexData.getOffset()) + (pIndexData.getSize());

}
else if ((((pIndexData.getOffset()) < (pHole[i].start)) && (((pIndexData.getOffset()) + (pIndexData.getSize())) > (pHole[i].start))) && (((pIndexData.getOffset()) + (pIndexData.getSize())) == (pHole[i].end))) {
pHole.splice(i, 1);
i--;

}
else if (((((pIndexData.getOffset()) + (pIndexData.getSize())) > (pHole[i].end)) && ((pIndexData.getOffset()) > (pHole[i].start))) && ((pIndexData.getOffset()) < (pHole[i].end))) {
pHole.end = pIndexData.getOffset();

}
else if (((((pIndexData.getOffset()) + (pIndexData.getSize())) > (pHole[i].end)) && ((pIndexData.getOffset()) == (pHole[i].start))) && ((pIndexData.getOffset()) < (pHole[i].end))) {
pHole.splice(i, 1);
i--;

}
else if (((pIndexData.getOffset()) < (pHole[i].start)) && (((pIndexData.getOffset()) + (pIndexData.getSize())) > (pHole[i].end))) {
i--;

}










}


}

function order(a, b) {
return ((a.end) - (a.start)) - ((b.end) - (b.start));

}

pHole.sort(order);
for (i = 0; i < (pHole.length); i++) {
if (((pHole[i].end) - (pHole[i].start)) >= (iCount * (a.getTypeSize(eElementsType)))) {
var pIndexData=new a.IndexData(this, pHole[i].start, iCount, ePrimitiveType, eElementsType);
this._pIndexDataArray.push(pIndexData);
return pIndexData;

}


}

return null;

};
IndexBuffer.prototype.getCountIndexForStripGrid = function(iXVerts, iYVerts) {
var iTotalStrips=iYVerts - 1;
var iTotalIndexesPerStrip=iXVerts << 1;
var iTotalIndexes=((iTotalStrips * iTotalIndexesPerStrip) + (iTotalStrips << 1)) - 2;
return iTotalIndexes;

};
a.IndexBuffer = IndexBuffer;
function VertexBuffer() {
VertexBuffer.ctor.apply(this, arguments);
this._pDevice = this._pEngine.pDevice;
this._iByteSize = undefined;

}

a.extend(VertexBuffer, a.ResourcePoolItem, a.VBufferBase);
a.defineProperty(VertexBuffer, "size", function() {
return this._iByteSize;

}
);
VertexBuffer.prototype.create = function(iByteSize, iFlags, pData) {
iByteSize = iByteSize || 0;
iFlags = iFlags || 0;
var i;
if (!((this._pBuffer) == null)) {
var err=((((((("Error:: " + "d3d buffer already allocated") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("d3d buffer already allocated");

}


}

;
if (!((this._pBackupCopy) == null)) {
var err=((((((("Error:: " + "backup buffer already allocated") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("backup buffer already allocated");

}


}

;
var eUsage=0;
if (iByteSize < 100)iByteSize = 1000;

this._iByteSize = iByteSize;
this._iTypeFlags = iFlags;
if (!(!((this._iTypeFlags & (1 << 4)) != 0))) {
var err=((((((("Error:: " + "no sftware rendering") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("no sftware rendering");

}


}

;
if (((this._iTypeFlags & (1 << 0)) != 0) && (!((this._iTypeFlags & (1 << 1)) != 0))) {
if (!(this._iTypeFlags & (1 << 4)) != 0) {
var err=((((((("Error:: " + "crazy... more update bun one draw") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("crazy... more update bun one draw");

}


}

;

}

if ((this._iTypeFlags & (1 << 3)) != 0) {
this._iTypeFlags |= 1 << 2;

}
else  {
if ((this._iTypeFlags & (1 << 2)) != 0) {
this._iTypeFlags |= 1 << 3;

}


}

if (pData) {
if (!((pData.byteLength) <= iByteSize)) {
var err=((((((("Error:: " + "Размер переданного массива больше переданного размера буфера") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Размер переданного массива больше переданного размера буфера");

}


}

;

}

if ((this._iTypeFlags & (1 << 3)) != 0) {
this._pBackupCopy = new Uint8Array(this._iByteSize);
if (pData) {
this._pBackupCopy.set(new Uint8Array(pData.buffer), 0);

}


}

if (((this._iTypeFlags & (1 << 0)) != 0) && ((this._iTypeFlags & (1 << 1)) != 0)) {
eUsage = 35048;

}
else if ((!((this._iTypeFlags & (1 << 0)) != 0)) && ((this._iTypeFlags & (1 << 1)) != 0)) {
eUsage = 35044;

}
else  {
eUsage = 35040;

}


this._pBuffer = this._pDevice.createBuffer();
if (!(this._pBuffer)) {
this._pBuffer = null;
if (!0) {
var err=((((((("Error:: " + "Не удалось создать буфер") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не удалось создать буфер");

}


}

;
this.destroy();
return false;

}

this._pDevice.bindBuffer(34962, this._pBuffer);
this._pDevice.bufferData(34962, this._iByteSize, eUsage);
if (pData) {
this._pDevice.bufferSubData(34962, 0, pData.buffer);

}

this._pDevice.bindBuffer(34962, null);
this.notifyRestored();
this.notifyLoaded();
return true;

};
VertexBuffer.prototype.destroy = function() {
if (this._pDevice.isBuffer(this._pBuffer)) {
this._pDevice.deleteBuffer(this._pBuffer);

}

this._pBuffer = null;
this._pBackupCopy = null;
this._iByteSize = undefined;
this.freeVertexData();
this._iTypeFlags = undefined;
this.notifyUnloaded();

};
VertexBuffer.prototype.getData = function(iOffset, iSize) {
if (!this._pBuffer) {
var err=((((((("Error:: " + "Буффер еще не создан") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Буффер еще не создан");

}


}

;
if (!(((this._iTypeFlags & (1 << 3)) != 0) == true)) {
var err=((((((("Error:: " + "Нельзя отдать данные если они не храняться локально") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Нельзя отдать данные если они не храняться локально");

}


}

;
if ((arguments.length) === 0) {
return this._pBackupCopy.buffer;

}

return this._pBackupCopy.buffer.slice(iOffset, iOffset + iSize);

};
VertexBuffer.prototype.setData = function(pData, iOffset, iSize) {
if (!this._pBuffer) {
var err=((((((("Error:: " + "Буффер еще не создан") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Буффер еще не создан");

}


}

;
this._pDevice.bindBuffer(34962, this._pBuffer);
if (!((pData.byteLength) <= iSize)) {
var err=((((((("Error:: " + "Размер переданного массива больше переданного размера") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Размер переданного массива больше переданного размера");

}


}

;
if (!((this.size) >= (iOffset + iSize))) {
var err=((((((("Error:: " + "Данные выйдут за предел буфера") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Данные выйдут за предел буфера");

}


}

;
this._pDevice.bufferSubData(34962, iOffset, new Uint8Array(pData.slice(0, iSize)));
this._pDevice.bindBuffer(34962, null);
if ((this._iTypeFlags & (1 << 3)) != 0) {
this._pBackupCopy.set(new Uint8Array(pData.slice(0, iSize)), iOffset);

}

return true;

};
VertexBuffer.prototype.resize = function(iSize) {
var eUsage;
var pData;
var iMax=0;
var pVertexData;
if (((this._iTypeFlags & (1 << 3)) != 0) != true) {
return false;

}

if (iSize < (this.size)) {
for (var k in this._pVertexDataArray) {
pVertexData = this._pVertexDataArray[k];
if (((pVertexData.getOffset()) + (pVertexData.size)) > iMax) {
iMax = (pVertexData.getOffset()) + (pVertexData.size);

}


}

if (!(iMax <= iSize)) {
var err=((((((("Error:: " + "Уменьшение невозможно. Страая разметка не укладывается в новый размер") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Уменьшение невозможно. Страая разметка не укладывается в новый размер");

}


}

;

}

if (this._pDevice.isBuffer(this._pBuffer)) {
this._pDevice.deleteBuffer(this._pBuffer);

}

if (((this._iTypeFlags & (1 << 0)) != 0) && ((this._iTypeFlags & (1 << 1)) != 0)) {
eUsage = 35048;

}
else if ((!((this._iTypeFlags & (1 << 0)) != 0)) && ((this._iTypeFlags & (1 << 1)) != 0)) {
eUsage = 35044;

}
else  {
eUsage = 35040;

}


this._pBuffer = this._pDevice.createBuffer();
if (!(this._pBuffer)) {
this._pBuffer = null;
if (!0) {
var err=((((((("Error:: " + "Не удалось создать буфер") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Не удалось создать буфер");

}


}

;
this.destroy();
return false;

}

this._pDevice.bindBuffer(34962, this._pBuffer);
this._pDevice.bufferData(34962, iSize, eUsage);
pData = this.getData(0, this._iByteSize);
this._pDevice.bufferSubData(34962, 0, pData);
this._pBackupCopy = new Uint8Array(iSize);
this.setData(pData, 0, this._iByteSize);
this._pDevice.bindBuffer(34962, null);
this._iByteSize = iSize;
return true;

};
VertexBuffer.prototype.activate = function() {
if (!this.isValid()) {
var err=((((((("Error:: " + "Attempting to activate  an invalid buffer") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Attempting to activate  an invalid buffer");

}


}

;
this._pDevice.bindBuffer(34962, this._pBuffer);

};
VertexBuffer.prototype.bind = function() {
this._pDevice.bindBuffer(34962, this._pBuffer);

};
VertexBuffer.prototype.unbind = function() {
this._pDevice.bindBuffer(34962, null);

};
VertexBuffer.prototype.createResource = function() {
this.notifyCreated();
return true;

};
VertexBuffer.prototype.destroyResource = function() {
this.notifyDestroyed();
this.destroy();
return true;

};
VertexBuffer.prototype.restoreResource = function() {
this.notifyRestored();
return true;

};
VertexBuffer.prototype.disableResource = function() {
this.notifyDisabled();
if (((this._iStateFlags & (1 << a.VBufferBase.Volatile)) != 0) && ((this._iTypeFlags & (1 << 3)) != 0)) {
this._pDevice.deleteBuffer(this._pBuffer);
this._pBuffer = null;

}

return true;

};
VertexBuffer.prototype.loadResource = function() {
return false;

};
VertexBuffer.prototype.saveResource = function() {
return false;

};
a.VertexBuffer = VertexBuffer;
function computeBoundingBox(pVertexBuffer, nCount, nStride, v3fMin, v3fMax) {
if ((pVertexBuffer && (nCount !== undefined)) && (nStride !== undefined)) {
var fX0=0, fY0=0, fZ0=0, fX1=0, fY1=0, fZ1=0;
var fTemp;
var i=0;
var pData=pVertexBuffer.getData();
if (pData) {
var pTempData;
pTempData = new Float32Array(pData, i, 3);
fX0 = fX1 = pTempData[0];
fX1 = fY1 = pTempData[1];
fZ0 = fZ1 = pTempData[2];
for (i = nStride; i < (nStride * nCount); i += nStride) {
pTempData = new Float32Array(pData, i, 3);
fTemp = pTempData[0];
fX0 = (fX0 > fTemp? fTemp : fX0);
fX1 = (fX1 > fTemp? fX1 : fTemp);
fTemp = pTempData[1];
fY0 = (fY0 > fTemp? fTemp : fY0);
fY1 = (fY1 > fTemp? fY1 : fTemp);
fTemp = pTempData[2];
fZ0 = (fZ0 > fTemp? fTemp : fZ0);
fZ1 = (fZ1 > fTemp? fZ1 : fTemp);

}

v3fMin[0] = fX0;
v3fMin[1] = fY0;
v3fMin[2] = fZ0;
v3fMax[0] = fX1;
v3fMax[1] = fY1;
v3fMax[2] = fZ1;
return true;

}


}

return false;

}

;
a.computeBoundingBox = computeBoundingBox;
function computeBoundingSphereFast(pVertexBuffer, nCount, pRect, v4fOut) {
var fX0=0, fY0=0, fZ0=0, fX1=0, fY1=0, fZ1=0;
var i=0;
var data=pVertexBuffer.getData();
if (pRect) {
fX0 = pRect.fX0;
fY0 = pRect.fY0;
fZ0 = pRect.fZ0;
fX1 = pRect.fX1;
fY1 = pRect.fY1;
fZ1 = pRect.fZ1;

}

if ((!pRect) || (pRect.isClear())) {
var fTemp;
if (nCount) {
fX0 = fX1 = data[i];
fX1 = fY1 = data[i + 1];
fZ0 = fZ1 = data[i + 2];
for (i = 3; i < (3 * nCount); i += 3) {
fTemp = data[i];
fX0 = (fX0 > fTemp? fTemp : fX0);
fX1 = (fX1 > fTemp? fX1 : fTemp);
fTemp = data[i + 1];
fY0 = (fY0 > fTemp? fTemp : fY0);
fY1 = (fY1 > fTemp? fY1 : fTemp);
fTemp = data[i + 2];
fZ0 = (fZ0 > fTemp? fTemp : fZ0);
fZ1 = (fZ1 > fTemp? fZ1 : fTemp);

}


}

if (pRect) {
pRect.fX0 = fX0;
pRect.fY0 = fY0;
pRect.fZ0 = fZ0;
pRect.fX1 = fX1;
pRect.fY1 = fY1;
pRect.fZ1 = fZ1;

}


}

if (!v4fOut) {
v4fOut = Vec4.create();

}

var fCenterX=(fX0 + fX1) / 2;
var fCenterY=(fY0 + fY1) / 2;
var fCenterZ=(fZ0 + fZ1) / 2;
var fRadius=0;
var fDistance=0;
for (i = 0; i < (3 * nCount); i += 3) {
fDistance = ((((data[i]) - fCenterX) * ((data[i]) - fCenterX)) + (((data[i + 1]) - fCenterY) * ((data[i + 1]) - fCenterY))) + (((data[i + 2]) - fCenterZ) * ((data[i + 2]) - fCenterZ));
fRadius = (fDistance > fRadius? fDistance : fRadius);

}

v4fOut[0] = fCenterX;
v4fOut[1] = fCenterY;
v4fOut[2] = fCenterZ;
v4fOut[3] = Math.sqrt(fRadius);
return v4fOut;

}

;
a.computeBoundingSphereFast = computeBoundingSphereFast;
function computeBoundingSphereMinimal(pVertexBuffer, nCount, nStride, pSphere) {
var pData=pVertexBuffer.getData();
if ((!pData) || (!pSphere)) {
return false;

}

var i=0, j=0, k=0;
var points=[];
var length=0;
var isAdd=false;
var isNew=true;
var fDiametr=0;
var fDistance=0;
var pTempData1;
var pTempData2;
for (i = 0; i < (nStride * nCount); i += nStride) {
isNew = true;
isAdd = false;
pTempData1 = new Float32Array(pData.buffer, i, 3);
for (k = 0; k < (points.length); k += 3) {
if ((((points[k]) == (pTempData1[0])) && ((points[k + 1]) == (pTempData1[1]))) && ((points[k + 2]) == (pTempData1[2]))) {
isNew = false;
break ;

}


}

if (isNew) {
for (j = i + nStride; j < (nStride * nCount); j += nStride) {
pTempData2 = new Float32Array(pData.buffer, j, 3);
fDistance = ((((pTempData1[0]) - (pTempData2[0])) * ((pTempData1[0]) - (pTempData2[0]))) + (((pTempData1[1]) - (pTempData2[1])) * ((pTempData1[1]) - (pTempData2[1])))) + (((pTempData1[2]) - (pTempData2[2])) * ((pTempData1[2]) - (pTempData2[2])));
if (fDistance > fDiametr) {
fDiametr = fDistance;
isAdd = true;
points[0] = pTempData2[0];
points[1] = pTempData2[1];
points[2] = pTempData2[2];
length = 3;

}
else if ((fDistance.toFixed(7)) == (fDiametr.toFixed(7))) {
isAdd = true;
for (k = 0; k < (points.length); k += 3) {
if ((((points[k]) == (pTempData2[0])) && ((points[k + 1]) == (pTempData2[1]))) && ((points[k + 2]) == (pTempData2[2]))) {
isNew = false;
break ;

}


}

if (isNew) {
points[length] = pTempData2[0];
points[length + 1] = pTempData2[1];
points[length + 2] = pTempData2[2];
length += 3;

}


}



}

if (isAdd) {
points[length] = pTempData1[0];
points[length + 1] = pTempData1[1];
points[length + 2] = pTempData1[2];
length += 3;

}


}


}

var fX=0, fY=0, fZ=0;
for (i = 0; i < (points.length); i += 3) {
fX += points[i];
fY += points[i + 1];
fZ += points[i + 2];

}

var x=pSphere.v3fCenter[0] = (fX / (points.length)) * 3;
var y=pSphere.v3fCenter[1] = (fY / (points.length)) * 3;
var z=pSphere.v3fCenter[2] = (fZ / (points.length)) * 3;
pSphere.fRadius = Math.sqrt(((((points[0]) - x) * ((points[0]) - x)) + (((points[1]) - y) * ((points[1]) - y))) + (((points[2]) - z) * ((points[2]) - z)));
return true;

}

;
a.computeBoundingSphereMinimal = computeBoundingSphereMinimal;
function computeGeneralizingSphere(pSphereA, pSphereB, pSphereDest) {
if (!pSphereDest) {
pSphereDest = pSphereA;

}

var fR1=pSphereA.fRadius;
var fR2=pSphereB.fRadius;
var v3fC1=pSphereA.v3fCenter;
var v3fC2=pSphereB.v3fCenter;
var v3fD=new glMatrixArrayType(3);
Vec3.subtract(v3fC1, v3fC2, v3fD);
var fD=Vec3.length(v3fD);
if ((fD < fR1) && (fR1 > fR2)) {
pSphereDest.set(pSphereA);
return ;

}

if (fD < fR2) {
pSphereDest.set(pSphereB);
return ;

}

var v3fN=new glMatrixArrayType(3);
Vec3.normalize(v3fD, v3fN);
pSphereDest.fRadius = (Vec3.length(Vec3.add(v3fD, Vec3.scale(v3fN, fR1 + fR2)))) / 2;
var v3fTemp=v3fD;
pSphereDest.v3fCenter = Vec3.scale(Vec3.add(Vec3.add(v3fC1, v3fC2, v3fTemp), Vec3.scale(v3fN, (fR1 - fR2) / (fR1 + fR2))), 0.5);

}

a.computeGeneralizingSphere = computeGeneralizingSphere;
function IndexData(pIndexBuffer, iOffset, iCount, ePrimitiveType, eElementsType) {
if (!pIndexBuffer) {
var err=((((((("Error:: " + "������ ������ �� ������� ��� �������� IndexData") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("������ ������ �� ������� ��� �������� IndexData");

}


}

;
this._pIndexBuffer = pIndexBuffer;
this._iOffset = iOffset;
this._iCount = iCount;
if (ePrimitiveType != undefined) {
this._ePrimitiveType = ePrimitiveType;

}
else  {
this._ePrimitiveType = 4;

}

if (eElementsType != undefined) {
this._eElementsType = eElementsType;

}
else  {
this._eElementsType = 5123;

}

if (!(((this._eElementsType) == (5121)) || ((this._eElementsType) == (5123)))) {
var err=((((((("Error:: " + "��� �������� �� ���������� ���� ��� ���") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("��� �������� �� ���������� ���� ��� ���");

}


}

;
if (!((this._pIndexBuffer.getSize()) >= ((this.getSize()) + (this.getOffset())))) {
var err=((((((("Error:: " + "IndexData ������� �� ������� IndexBuffer") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("IndexData ������� �� ������� IndexBuffer");

}


}

;

}

IndexData.prototype.destroy = function() {
this._pIndexBuffer = null;
this._iOffset = undefined;
this._iCount = undefined;
this._ePrimitiveType = undefined;
this._eElementsType = undefined;

};
IndexData.prototype.getOffset = function() {
return this._iOffset;

};
IndexData.prototype.getPrimitiveType = function() {
return this._ePrimitiveType;

};
IndexData.prototype.getType = function() {
return this._eElementsType;

};
IndexData.prototype.getCount = function() {
return this._iCount;

};
IndexData.prototype.getIndexSize = function() {
return a.getTypeSize(this.getType());

};
IndexData.prototype.getSize = function() {
return (this.getCount()) * (a.getTypeSize(this.getType()));

};
IndexData.prototype.getData = function(iOffset, iSize) {
if (!((iOffset + iSize) <= (this.getSize()))) {
var err=((((((("Error:: " + "������������� �������� ������� �� ������� IndexData") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("������������� �������� ������� �� ������� IndexData");

}


}

;
return this._pIndexBuffer.getData((this.getOffset()) + iOffset, iSize);

};
IndexData.prototype.setData = function(pData, iOffset, iCount) {
if (!(((iOffset + iCount) * (this.getIndexSize())) <= (this.getSize()))) {
var err=((((((("Error:: " + "�������� ������� �� ������� IndexData") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("�������� ������� �� ������� IndexData");

}


}

;
return this._pIndexBuffer.setData(pData.buffer, (this.getOffset()) + (iOffset * (this.getIndexSize())), iCount * (this.getIndexSize()));

};
IndexData.prototype.activate = function() {
return this._pIndexBuffer.activate();

};
IndexData.prototype.drawElements = function() {
return this._pIndexBuffer.getDevice().drawElements(this.getPrimitiveType(), this.getCount(), this.getType(), this.getOffset());

};
IndexData.prototype.getPrimitiveCount = function() {
switch(arguments.length) {
case 0:
return this.getPrimitiveCount(this.getCount());
break ;

case 1:
var count=(arguments[0]) / 3;
if (((this._ePrimitiveType) == (5)) || ((this._ePrimitiveType) == (6))) {
count = (arguments[0]) - 2;

}

return count;
break ;
}
return undefined;

};
a.IndexData = IndexData;
function VertexElement(nCount, eType, eUsage, iOffset) {
this.nCount = nCount || 1;
this.eType = eType || (5126);
this.eUsage = eUsage || ("POSITION");
this.eUsage = this.eUsage.toString().toUpperCase();
this.iOffset = iOffset;
this.update();

}

a.defineProperty(VertexElement, "size", function() {
return this.iSize;

}
);
VertexElement.prototype.update = function() {
this.iSize = (this.nCount) * (a.getTypeSize(this.eType));

};
VertexElement.prototype.clone = function() {
return new a.VertexElement(this.nCount, this.eType, this.eUsage, this.iOffset);

};
a.VertexElement = VertexElement;
function VertexDeclaration(pArrayElements) {
this.iStride = 0;
if (arguments.length) {
this.append(pArrayElements);

}


}

a.extend(VertexDeclaration, Array);
a.defineProperty(VertexDeclaration, "stride", function() {
return this.iStride;

}
);
VertexDeclaration.prototype.update = function() {
this.iStride = this.offsetOf();

};
VertexDeclaration.prototype.offsetOf = function(eSemantics) {
var iStride=0;
var iNegativeStride=0;
var t;
if (eSemantics) {
eSemantics = eSemantics.toUpperCase();

}

for (i = 0; i < (this.length); i++) {
t = (iStride + (this[i].iSize)) + (this[i].iOffset);
if (iStride < t) {
iStride = t;
iNegativeStride = 0;

}
else  {
iNegativeStride += this[i].iSize;

}

t = ((iNegativeStride? iNegativeStride + (this[i].iOffset) : 0)) + iStride;
if ((this[i].eUsage) === eSemantics) {
return t - (this[i].iSize);

}

if (iStride < t) {
iStride = t;

}


}

return iStride;

};
VertexDeclaration.prototype.append = function(pArrayElements) {
var iOffset;
for (var i=0; i < (pArrayElements.length); i++) {
iOffset = pArrayElements[i].iOffset;
if (iOffset === undefined) {
if (i != 0) {
iOffset = this[i - 1].iOffset;

}
else  {
iOffset = 0;

}


}

this.push(new VertexElement(pArrayElements[i].nCount, pArrayElements[i].eType, pArrayElements[i].eUsage, iOffset));

}

this.update();

};
VertexDeclaration.prototype.extend = function(pVertexDecl) {
for (var i=0; i < (pVertexDecl.length); i++) {
this.push(pVertexDecl[i].clone());

}

;
this.update();

};
VertexDeclaration.prototype.hasSemantics = function(eSemantics) {
for (i = 0; i < (this.length); i++) {
if ((this[i].eUsage.toString().toUpperCase()) == (eSemantics.toString().toUpperCase())) {
return true;

}


}

return false;

};
VertexDeclaration.prototype.element = function(eSemantics) {
eSemantics = eSemantics.toUpperCase();
for (var i=0; i < (this.length); ++i) {
if ((this[i].eUsage) === eSemantics) {
return this[i];

}


}

return null;

};
VertexDeclaration.prototype.clone = function() {
var pDecl=new a.VertexDeclaration();
for (var i=0; i < (this.length); i++) {
pDecl.push(this[i].clone());

}

;
pDecl.update();
return pDecl;

};
a.VertexDeclaration = VertexDeclaration;
function normalizeVertexDecl(pDataDecl) {
if (!(pDataDecl instanceof (a.VertexDeclaration))) {
if (!(pDataDecl instanceof Array)) {
pDataDecl = [pDataDecl];

}

pDataDecl = new a.VertexDeclaration(pDataDecl);

}

return pDataDecl;

}

a.normalizeVertexDecl = normalizeVertexDecl;
function VertexData(pVertexBuffer, iOffset, iCount, pVertexDeclaration) {
if (!pVertexBuffer) {
var err=((((((("Error:: " + "Вертекс буффер не передан при создании VertexData") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Вертекс буффер не передан при создании VertexData");

}


}

;
this._pVertexBuffer = pVertexBuffer;
this._iOffset = iOffset;
this._nMemberCount = iCount;
this._pVertexDeclaration = null;
this._iStride = undefined;
if ((typeof pVertexDeclaration) == "number") {
this._iStride = pVertexDeclaration;

}
else  {
this._iStride = pVertexDeclaration.stride;
this.setVertexDescription(pVertexDeclaration);

}

this._iID = this._pVertexBuffer.getNextID();
if (!((this._pVertexBuffer.size) >= ((this.size) + (this.getOffset())))) {
var err=((((((("Error:: " + "IndexData выходит за пределы IndexBuffer") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("IndexData выходит за пределы IndexBuffer");

}


}

;

}

VertexData.prototype.toNumber = function() {
return this._iID;

};
a.defineProperty(VertexData, "declaration", function() {
return this._pVertexDeclaration;

}
);
VertexData.prototype.getOffset = function() {
return this._iOffset;

};
a.defineProperty(VertexData, "buffer", function() {
return this._pVertexBuffer;

}
);
VertexData.prototype.getVertexBuffer = function() {
return this._pVertexBuffer;

};
VertexData.prototype.getStartIndex = function() {
var iIndex=(this.getOffset()) / (this.getStride());
if (!((iIndex % 1) == 0)) {
var err=((((((("Error:: " + "Вычислить значенеи индекса указывающего на первый элемен нельзя)") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Вычислить значенеи индекса указывающего на первый элемен нельзя)");

}


}

;
return iIndex;

};
VertexData.prototype.destroy = function() {
this._pVertexDeclaration = null;
this._nMemberCount = undefined;

};
a.defineProperty(VertexData, "size", function() {
return (this.getStride()) * (this.getCount());

}
);
a.defineProperty(VertexData, "length", function() {
return this._nMemberCount;

}
);
a.defineProperty(VertexData, "stride", function() {
return this._iStride;

}
);
VertexData.prototype.extend = function(pVertexDecl, pData) {
pVertexDecl = a.normalizeVertexDecl(pVertexDecl);
pData = new Uint8Array(pData.buffer);
if (!((this.length) === ((pData.byteLength) / (pVertexDecl.stride)))) {
var err=((((((("Error:: " + "invalid data size for extending") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid data size for extending");

}


}

;
var nCount=this._nMemberCount;
var nStrideNew=pVertexDecl.stride;
var nStridePrev=this.stride;
var nStrideNext=nStridePrev + nStrideNew;
var nTotalSize=nStrideNext * (this.length);
var pDecl=this.getVertexDeclaration().clone();
var pDataPrev=new Uint8Array(this.getData());
var pDataNext=new Uint8Array(nTotalSize);
for (var i=0, iOffset; i < nCount; ++i) {
iOffset = i * nStrideNext;
pDataNext.set(pDataPrev.subarray(i * nStridePrev, (i + 1) * nStridePrev), iOffset);
pDataNext.set(pData.subarray(i * nStrideNew, (i + 1) * nStrideNew), iOffset + nStridePrev);

}

pDecl.extend(pVertexDecl);
if (!(this.resize(nCount, pDecl))) {
return false;

}

return this.setData(pDataNext, 0, nStrideNext);

};
VertexData.prototype.resize = function(nCount, pVertexDeclaration) {
var iStride=0;
if ((arguments.length) == 2) {
if ((typeof pVertexDeclaration) == "number") {
iStride = pVertexDeclaration;

}
else  {
iStride = pVertexDeclaration.stride;

}

if ((nCount * iStride) <= (this.size)) {
this._nMemberCount = nCount;
this._iStride = iStride;
this._pVertexDeclaration = null;
if ((typeof pVertexDeclaration) != "number") {
this.setVertexDescription(pVertexDeclaration);

}

return true;

}
else  {
var pOldVertexBuffer=this.getVertexBuffer();
this._pVertexBuffer.freeVertexData(this);
if ((pOldVertexBuffer.getEmptyVertexData(nCount, pVertexDeclaration, this)) !== (this)) {
return false;

}

return true;

}


}
else if ((arguments.length) == 1) {
if (nCount <= (this.size)) {
this._nMemberCount = nCount;
return true;

}
else  {
var pOldVertexBuffer=this.getVertexBuffer();
var pOldVertexDeclaration=this.getVertexDeclaration();
var iOldStride=this.getStride();
this._pVertexBuffer.freeVertexData(this);
if ((pOldVertexBuffer.getEmptyVertexData(nCount, iOldStride, this)) == null) {
return false;

}

this.setVertexDescription(pOldVertexDeclaration);
return true;

}


}


return false;

};
VertexData.prototype.setData = function(pData, iOffset, iSize, nCountStart, nCount) {
var iCalcSize=0;
switch(arguments.length) {
case 5:
var iStride=this.getStride();
if (iStride != iSize) {
for (var i=nCountStart; i < (nCount + nCountStart); i++) {
this._pVertexBuffer.setData(pData.buffer.slice(iSize * (i - nCountStart), (iSize * (i - nCountStart)) + iSize), ((iStride * i) + iOffset) + (this.getOffset()), iSize);

}


}
else  {
this._pVertexBuffer.setData(pData.buffer.slice(0, iStride * nCount), iOffset + (this.getOffset()), iStride * nCount);

}

return true;

case 4:
var pDeclaration=this._pVertexDeclaration, pElement=null;
if ((typeof (arguments[1])) == "string") {
pElement = pDeclaration.element(arguments[1]);
if (pElement) {
return this.setData(pData, pDeclaration.offsetOf(arguments[1]), pElement.size, arguments[2], arguments[3]);

}

return false;

}
else  {
nCountStart = nCountStart || 0;
if (!nCount) {
nCount = (pData.buffer.byteLength) / iSize;

}

return this.setData(pData, iOffset, iSize, nCountStart, nCount);

}

return false;

case 2:
;

case 3:
var pDeclaration=this._pVertexDeclaration, pElement=null;
if ((typeof (arguments[1])) == "string") {
pElement = pDeclaration.element(arguments[1]);
if (pElement) {
iCalcSize = pElement.size;
arguments[2] = (arguments[2]) || 0;
if (!(arguments[3])) {
arguments[3] = (pData.buffer.byteLength) / iCalcSize;

}

return this.setData(pData, pDeclaration.offsetOf(arguments[1]), iCalcSize, arguments[2], arguments[3]);

}

return false;

}
else if ((arguments.length) === 3) {
nCountStart = nCountStart || 0;
if (!nCount) {
nCount = (pData.buffer.byteLength) / iSize;

}

return this.setData(pData, iOffset, iSize, nCountStart, nCount);

}


return false;

case 1:
return this.setData(pData, this._pVertexDeclaration[0].eUsage);

default:
return false;
}
return false;

};
VertexData.prototype.getTypedData = function(eUsage, iFrom, iCount) {
eUsage = eUsage || (this._pVertexDeclaration[0].eUsage);
var pVertexElement=this._pVertexDeclaration.element(eUsage);
if (pVertexElement) {
return this.getData(eUsage, iFrom, iCount).toTypedArray(pVertexElement.eType);

}

return null;

};
VertexData.prototype.getData = function(iOffset, iSize, iFrom, iCount) {
switch(arguments.length) {
case 4:
;

case 2:
if ((typeof (arguments[0])) === "string") {
return this.getData(arguments[0], arguments[1], 0, this._nMemberCount);

}

iFrom = iFrom || 0;
iCount = iCount || (this._nMemberCount);
iCount = Math.min(iCount, this._nMemberCount);
var iStride=this.getStride();
var pBufferData=new Uint8Array(iSize * (this.getCount()));
for (var i=iFrom; i < iCount; i++) {
pBufferData.set(new Uint8Array(this._pVertexBuffer.getData(((iStride * i) + iOffset) + (this.getOffset()), iSize)), i * iSize);

}

return pBufferData.buffer;

case 3:
;

case 1:
var iCalcSize=0;
var pDeclaration=this._pVertexDeclaration, pElement=null;
if ((typeof (arguments[0])) == "string") {
pElement = pDeclaration.element(arguments[0]);
if (pElement) {
iCalcSize = pElement.size;
return this.getData(pDeclaration.offsetOf(arguments[0]), iCalcSize, arguments[1], arguments[2]);

}

return null;

}

return null;

case 0:
return this.getData(0, this._pVertexDeclaration.stride);

default:
return null;
}
return null;

};
VertexData.prototype.activate = function() {
this._pVertexBuffer.activate();
return true;

};
VertexData.prototype.setVertexDescription = function(pVertexDeclaration, iElementCount) {
if (!(!(this._pVertexDeclaration))) {
var err=((((((("Error:: " + "pVertexDeclaration уже выставлен") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("pVertexDeclaration уже выставлен");

}


}

;
var iStride=0;
var nVertexElementCount;
if (iElementCount == undefined) {
nVertexElementCount = pVertexDeclaration.length;

}
else  {
nVertexElementCount = iElementCount;

}

if (!(nVertexElementCount <= (pVertexDeclaration.length))) {
var err=((((((("Error:: " + "iElementCount больше размера pVertexDeclaration") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("iElementCount больше размера pVertexDeclaration");

}


}

;
this._pVertexDeclaration = new VertexDeclaration(pVertexDeclaration);
iStride = this._pVertexDeclaration.stride;
if (!(iStride < (256))) {
var err=((((((("Error:: " + "stride max is 255 bytes") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("stride max is 255 bytes");

}


}

;
if (!(iStride <= (this.getStride()))) {
var err=((((((("Error:: " + "stride in VertexDeclaration больше чем stride in construtor") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("stride in VertexDeclaration больше чем stride in construtor");

}


}

;
return true;

};
VertexData.prototype.getStride = function() {
return this._iStride;

};
VertexData.prototype.getCount = function() {
return this._nMemberCount;

};
VertexData.prototype.getVertexElementCount = function() {
return this._pVertexDeclaration.length;

};
VertexData.prototype.getVertexDeclaration = function() {
return this._pVertexDeclaration;

};
VertexData.prototype.hasSemantics = function(eSemantics) {
if ((this._pVertexDeclaration) != null) {
return this._pVertexDeclaration.hasSemantics(eSemantics);

}

return false;

};
VertexData.prototype.resourceHandle = function() {
return this._pVertexBuffer.resourceHandle();

};
a.VertexData = VertexData;
function alignBytes(iByteSize, iTypeSize) {
var m=iByteSize % iTypeSize;
return (m? iByteSize + (iTypeSize - (iByteSize % iTypeSize)) : iByteSize);

}

;
function VideoBuffer(pEngine) {
VideoBuffer.ctor.apply(this, arguments);
this._pUpdateEffect = null;
this._pRepackEffect = null;

}

a.extend(VideoBuffer, a.VBufferBase, a.Texture);
a.defineProperty(VideoBuffer, "buffer", function() {
return this._pTexture;

}
);
a.defineProperty(VideoBuffer, "size", function() {
return (((this._iWidth) * (this._iHeight)) * (this._numElementsPerPixel)) * (this.typeSize);

}
);
a.defineProperty(VideoBuffer, "_numElementsPerPixel", function() {
return this.constructor.superclasses["Texture"].__lookupGetter__("numElementsPerPixel").apply(this);

}
);
VideoBuffer.prototype.getMipLevels = undefined;
VideoBuffer.prototype.getPixelRGBA = undefined;
VideoBuffer.prototype.setPixelRGBA = undefined;
VideoBuffer.prototype.generateNormalMap = undefined;
VideoBuffer.prototype.generateNormalizationCubeMap = undefined;
VideoBuffer.prototype.maskWithImage = undefined;
VideoBuffer.prototype.convertToNormalMap = undefined;
VideoBuffer.prototype.getSurfaceLevel = undefined;
VideoBuffer.prototype.uploadCubeFace = undefined;
VideoBuffer.prototype.uploadImage = undefined;
VideoBuffer.prototype.resize = undefined;
VideoBuffer.prototype.extend = undefined;
VideoBuffer.prototype.repack = undefined;
VideoBuffer.prototype.createTexture = undefined;
VideoBuffer.prototype.createCubeTexture = undefined;
VideoBuffer.prototype.convertToNormalMap = undefined;
a.defineProperty(VideoBuffer, "texture", undefined, undefined);
a.defineProperty(VideoBuffer, "height", undefined, undefined);
a.defineProperty(VideoBuffer, "width", undefined, undefined);
a.defineProperty(VideoBuffer, "numElementsPerPixel", undefined, undefined);
a.defineProperty(VideoBuffer, "type", undefined, undefined);
a.defineProperty(VideoBuffer, "format", undefined, undefined);
a.defineProperty(VideoBuffer, "magFilter", undefined, undefined);
a.defineProperty(VideoBuffer, "minFilter", undefined, undefined);
VideoBuffer.prototype.create = function(iByteSize, iFlags, pData) {
iByteSize = iByteSize || 0;
iFlags = iFlags || 0;
var pSize, pTextureData, pHeader;
if (!((this._pBuffer) == null)) {
var err=((((((("Error:: " + "buffer already allocated") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("buffer already allocated");

}


}

;
if (!((this._pBackupCopy) == null)) {
var err=((((((("Error:: " + "backup buffer already allocated") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("backup buffer already allocated");

}


}

;
iFlags |= 1 << 5;
iByteSize = Math.max(iByteSize, 32);
if (!(!((iFlags & (1 << 4)) != 0))) {
var err=((((((("Error:: " + "no sftware rendering") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("no sftware rendering");

}


}

;
if ((iFlags & (1 << 3)) != 0) {
iFlags |= 1 << 2;

}

if ((iFlags & (1 << 2)) != 0) {
iFlags |= 1 << 3;

}

if (pData) {
if (!((pData.byteLength) <= iByteSize)) {
var err=((((((("Error:: " + "The size of the array passed more than passed the size of the buffer.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The size of the array passed more than passed the size of the buffer.");

}


}

;

}

if ((iFlags & (1 << 3)) != 0) {
this._pBackupCopy = new Uint8Array(iByteSize);
if (pData) {
this._pBackupCopy.set(new Uint8Array(pData.buffer), 0);

}


}

console.log("POT texture size:", ((alignBytes(iByteSize, this.typeSize)) + 8) / (Float32Array.BYTES_PER_ELEMENT));
pSize = a.calcPOTtextureSize(((alignBytes(iByteSize, this.typeSize)) + 8) / (Float32Array.BYTES_PER_ELEMENT), this._numElementsPerPixel);
pHeader = this._header(pSize[0], pSize[1]);
pTextureData = new Float32Array(pSize[2]);
pTextureData.set(pHeader, 0);
if (pData) {
new Uint8Array(pTextureData.buffer).set(new Uint8Array(pData.buffer), new Uint8Array(pHeader.buffer).length);

}

console.log("creating texture: ", pSize[0], "x", pSize[1]);
if (!(this.constructor.superclasses["Texture"].createTexture.call(this, pSize[0], pSize[1], 0, 6408, 5126, pTextureData))) {
if (!0) {
var err=((((((("Error:: " + "Cannot create video buffer.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot create video buffer.");

}


}

;
this.destroy();
return false;

}

this.bind();
this._pEngine.pDevice.generateMipmap(this.target);
this.unbind();
this.wraps = 33071;
this.wrapt = 33071;
this.minFilter = 9728;
this.magFilter = 9728;
this._pBuffer = this._pTexture;
this._iByteSize = iByteSize;
this._iTypeFlags = iFlags;
return true;

};
VideoBuffer.prototype.resize = function(iByteSize) {
var pSize, pBackupCopy;
console.log("resize request for", iByteSize, "bytes");
iByteSize = alignBytes(iByteSize, this.typeSize);
pSize = a.calcPOTtextureSize((iByteSize + 8) / (Float32Array.BYTES_PER_ELEMENT), this._numElementsPerPixel);
if ((this._iTypeFlags & (1 << 3)) != 0) {
pBackupCopy = new Uint8Array(iByteSize);
pBackupCopy.set(this._pBackupCopy);
this._pBackupCopy = pBackupCopy;
console.log("backup copy size", pBackupCopy.byteLength, "bytes");

}

if (((pSize[0]) <= (this._iWidth)) && ((pSize[1]) <= (this._iHeight))) {
return true;

}

console.log("resize buffer from", this._iWidth, "x", this._iHeight, " to", pSize[0], "x", pSize[1]);
this.constructor.superclasses["Texture"].repack.call(this, pSize[0], pSize[1]);
this.constructor.superclasses["Texture"].setPixelRGBA.call(this, 0, 0, 2, 1, this._header(), 0);
return true;

};
VideoBuffer.prototype.repack = function(iWidth, iHeight) {

};
VideoBuffer.prototype._header = function(iWidth, iHeight) {
iWidth = iWidth || (this._iWidth);
iHeight = iHeight || (this._iHeight);
var pHeader=new Float32Array(8);
pHeader[0] = iWidth;
pHeader[1] = iHeight;
pHeader[2] = 1 / iWidth;
pHeader[3] = 1 / iHeight;
pHeader[4] = iWidth * iHeight;
pHeader[5] = (pHeader[4]) * (this._numElementsPerPixel);
return pHeader;

};
VideoBuffer.prototype.setData = function(pData, iOffset, iSize) {
var iTypeSize=this.typeSize, nElementsPerPix=this.numElementsPerPixel, iFrom, iCount, pBufferData;
var iLeftShift, iRightShift, iBeginPix, iEndPix, nPixels, nElements;
iOffset = iOffset || 0;
iSize = iSize || (pData.byteLength);
if ((this.size) < (iOffset + iSize)) {
this.resize(iOffset + iSize);

}

if (this.isRAMBufferPresent()) {
this._pBackupCopy.set(new Uint8Array(pData.slice(0, iSize)), iOffset);

}

if (!(((iOffset % iTypeSize) === 0) && ((iSize % iTypeSize) === 0))) {
var err=((((((("Error:: " + "Incorrect data size or offset") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Incorrect data size or offset");

}


}

;
iFrom = (iOffset / iTypeSize) + 8;
iCount = iSize / iTypeSize;
iLeftShift = iFrom % nElementsPerPix;
iRightShift = (iFrom + iCount) % nElementsPerPix;
iBeginPix = Math.floor(iFrom / nElementsPerPix);
iEndPix = Math.ceil((iFrom + iCount) / nElementsPerPix);
nPixels = iEndPix - iBeginPix;
nElements = nPixels * nElementsPerPix;
pBufferData = new Float32Array(pData.slice(0, iSize));
if ((iLeftShift === 0) && (iRightShift === 0)) {
var iWidth=this.width;
var iYmin=Math.floor(iBeginPix / iWidth);
var iYmax=Math.ceil(iEndPix / iWidth);
var iXbegin=iBeginPix % iWidth;
var iXend=iEndPix % iWidth;
var iHeight=iYmax - iYmin;
var iBeginElement=0, iEndElement=0;
var pParent=this.constructor.superclasses["Texture"];
var me=this;
iXend = (iXend === 0? iWidth : iXend);
var fnWriteRect=function(iX, iY, iW, iH) {
iBeginElement = iEndElement;
iEndElement = ((iW * iH) * nElementsPerPix) + iEndElement;
pParent.setPixelRGBA.call(me, iX, iY, iW, iH, new Float32Array(pBufferData.subarray(iBeginElement, iEndElement)));

};
if (iHeight === 1) {
fnWriteRect(iXbegin, iYmin, iXend - iXbegin, 1);

}
else  {
fnWriteRect(iXbegin, iYmin, iWidth - iXbegin, 1);
if (iHeight > 2) {
fnWriteRect(0, iYmin + 1, iWidth, iHeight - 2);

}

fnWriteRect(0, iYmax - 1, iXend, 1);

}


}
else if (this.isReadable()) {
var iBackShift=((iOffset / iTypeSize) % nElementsPerPix) * iTypeSize;
var iRealOffset=iOffset - iBackShift;
var iRealSize=iSize + iBackShift;
var iFrontShift=(iRealSize / iTypeSize) % nElementsPerPix;
if (iFrontShift > 0) {
iRealSize += (nElementsPerPix - iFrontShift) * iTypeSize;

}

if ((this._pBackupCopy.byteLength) < (iRealOffset + iRealSize)) {
this.resize(iRealOffset + iRealSize);

}

return this.setData(this._pBackupCopy.buffer.slice(iRealOffset, iRealOffset + iRealSize), iRealOffset, iRealSize);

}
else  {
console.log("update via rendering...");
var pMarkupData=new Float32Array(nPixels * 2);
var pRealData=new Float32Array(nElements);
for (var i=0, n=0, f, t, u=0; i < nPixels; ++i) {
n = 2 * i;
if (i === 0) {
pMarkupData[n + 1] = iLeftShift;

}
else if ((i === (nPixels - 1)) && iLeftShift) {
pMarkupData[n + 1] = -iRightShift;

}
else  {
pMarkupData[n + 1] = 0;

}


if ((pMarkupData[n + 1]) >= 0) {
f = i * nElementsPerPix;
if (n == 0) {
f += iLeftShift;

}

t = Math.min(((i + 1) * nElementsPerPix) - f, pBufferData.length);

}
else  {
f = i * nElementsPerPix;
t = Math.min(Math.abs(pMarkupData[n + 1]), (pBufferData.length) - u);

}

for (var e=0; e < t; ++e) {
pRealData[f + e] = pBufferData[u++];

}

pMarkupData[n] = iBeginPix + i;

}

console.log("writing", iCount, "elements from", iFrom, "with data", pBufferData);
console.log("markup  data:", pMarkupData, pMarkupData.length, "first element:", pMarkupData.subarray(0, 2), "end element:", pMarkupData.subarray((pMarkupData.length) - 2, pMarkupData.length));
console.log("buffer data:", pRealData, pRealData.length);
var pDevice=this._pEngine.pDevice;
if (!(this._pUpdateProgram)) {
this._pUpdateProgram = this._pEngine.displayManager().shaderProgramPool().createResource("A_updateVideoBuffer");
this._pUpdateProgram.create("                 uniform sampler2D sourceTexture;                                                \n                attribute vec4  VALUE;                                                          \n                attribute float INDEX;                                                          \n                attribute float SHIFT;                                                          \n                                                                                                \n                uniform vec2 size;                                                              \n                                                                                                \n                varying vec4 color;                                                            \n                                                                                                \n                void main(void){                                                                \n                    vec4 value = VALUE;                                                         \n                    float  serial = float(INDEX);                                               \n                                                                                                \n                    int shift = int(SHIFT);                                                     \n                    if (shift != 0) {                         color = texture2D(sourceTexture, vec2(mod(serial, size.x) /            \n                            size.x + .5 / size.x, floor(serial / size.x) / size.y + .5 / size.y));                              \n                        if (shift == 1) {               \n                            color = vec4(color.r, value.gba);      \n                        }                               \n                        else if (shift == 2) {          \n                            color = vec4(color.rg, value.ba);        \n                        }                               \n                        else if (shift == 3) {          \n                            color = vec4(color.rgb, value.a);          \n                        }                               \n                        else if (shift == -1) {         \n                            color = vec4(value.r, color.gba);      \n                        }                               \n                        else if (shift == -2) {         \n                            color = vec4(value.rg, color.ba);        \n                        }                               \n                        else {                          \n                            color = vec4(value.rgb, color.a);          \n                        }                                                                       \n                    }                    else                                                                                               \n                        color = value;                                                              \n                    gl_Position = vec4(2. * mod(serial, size.x) / size.x - 1. + .5 / size.x,                  \n                                    2. * floor(serial / size.x) / size.y - 1. + .5 / size.y, 0., 1.);        \n                }                                                                               \n                ", "                                   \n                #ifdef GL_ES                        \n                    precision highp float;          \n                #endif                              \n                                                    \n                varying vec4 color;                 \n                                                    \n                void main(void){                    \n                    gl_FragColor = color;           \n                }                                   \n            ", true);

}

var pProgram=this._pUpdateProgram;
pProgram.activate();
var pFramebuffer=pDevice.createFramebuffer();
pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, pFramebuffer);
pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0, pDevice.TEXTURE_2D, this._pTexture, 0);
var pValueBuffer=pDevice.createBuffer();
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pValueBuffer);
pDevice.bufferData(pDevice.ARRAY_BUFFER, pRealData, pDevice.STREAM_DRAW);
var pMarkupBuffer=pDevice.createBuffer();
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pMarkupBuffer);
pDevice.bufferData(pDevice.ARRAY_BUFFER, pMarkupData, pDevice.STREAM_DRAW);
this.activate(0);
pProgram.applyVector2("size", this._iWidth, this._iHeight);
pProgram.applyInt("sourceTexture", 0);
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pValueBuffer);
pDevice.vertexAttribPointer(pProgram._pAttributesByName["VALUE"].iLocation, 4, pDevice.FLOAT, false, 0, 0);
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pMarkupBuffer);
pDevice.vertexAttribPointer(pProgram._pAttributesByName["INDEX"].iLocation, 1, pDevice.FLOAT, false, 8, 0);
pDevice.vertexAttribPointer(pProgram._pAttributesByName["SHIFT"].iLocation, 1, pDevice.FLOAT, false, 8, 4);
pDevice.viewport(0, 0, this._iWidth, this._iHeight);
pDevice.drawArrays(0, 0, nPixels);
pDevice.flush();
pDevice.bindBuffer(pDevice.ARRAY_BUFFER, null);
pDevice.deleteBuffer(pValueBuffer);
pDevice.deleteBuffer(pMarkupBuffer);
pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);
pDevice.deleteFramebuffer(pFramebuffer);
pProgram.deactivate();

}


return true;

};
VideoBuffer.prototype.getData = function(iOffset, iSize) {
if (!this._pBuffer) {
var err=((((((("Error:: " + "Buffer not created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Buffer not created.");

}


}

;
if (!(((this._iTypeFlags & (1 << 3)) != 0) == true)) {
var err=((((((("Error:: " + "You can not give data unless they are stored locally.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("You can not give data unless they are stored locally.");

}


}

;
if ((arguments.length) === 0) {
return this._pBackupCopy.buffer;

}

return this._pBackupCopy.buffer.slice(iOffset, iOffset + iSize);

};
VideoBuffer.prototype.destroy = function() {
this.constructor.superclasses["Texture"].destroyResource.call(this);
this.freeVertexData();
this._pBuffer = null;
this._pBackupCopy = null;
this._pUpdateEffect = null;
this._iByteSize = undefined;
this._iTypeFlags = undefined;

};
VideoBuffer.prototype.destroyResource = function() {
this.destroy();
return true;

};
VideoBuffer.prototype.disableResource = function() {
this.constructor.superclasses["Texture"].disableResource.call(this);
this.notifyDisabled();
return true;

};
VideoBuffer.prototype.restoreResource = function() {
this.constructor.superclasses["Texture"].restoreResource.call(this);
this.notifyRestored();
return true;

};
VideoBuffer.prototype.loadResource = function() {
return false;

};
VideoBuffer.prototype.saveResource = function() {
return false;

};
VideoBuffer.prototype.createResource = function() {
this._pUpdateEffect = this._pEngine.pShaderManager.findEffect("akra:updateTexture");
this._pRepackEffect = this._pEngine.pShaderManager.findEffect("akra:repackTextureWithHeader");
this._eType = 5126;
this.notifyCreated();
this.notifyLoaded();
return true;

};
a.VideoBuffer = VideoBuffer;
function RenderMethod() {
RenderMethod.ctor.apply(this, arguments);
this._pEffect = null;
this._pMaterial = null;

}

a.extend(RenderMethod, a.ResourcePoolItem, a.Unique);
a.defineProperty(RenderMethod, "effect", function() {
return this._pEffect;

}
, function(pValue) {
var pEffect=null;
this.disconnect(this._pEffect, 1);
if (this._pEffect) {
var safe_release_refcount=this._pEffect.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pEffect = 0;

}

;
if ((typeof pValue) === "string") {
pEffect = this._pEngine.pDisplayManager.effectPool().loadResource(pValue);

}
else  {
pEffect = pValue;

}

this._pEffect = pEffect;
this.connect(this._pEffect, 1);
pEffect.addRef();

}
);
a.defineProperty(RenderMethod, "material", function() {
return this._pMaterial;

}
, function(pValue) {
var pMaterial=null;
this.disconnect(this._pMaterial, 1);
if (this._pMaterial) {
var safe_release_refcount=this._pMaterial.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pMaterial = 0;

}

;
if ((typeof pValue) === "string") {
pMaterial = this._pEngine.pDisplayManager.materialPool().loadResource(pValue);

}
else  {
pMaterial = pValue;

}

this._pMateria = pMaterial;
this.connect(pMaterial, 1);
pMaterial.addRef();

}
);
a.RenderMethod = RenderMethod;
RenderMethod.prototype.createResource = function() {
if (!(!(this.isResourceCreated()))) {
var err=((((((("Error:: " + "The resource has already been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has already been created.");

}


}

;
this.notifyCreated();
this.notifyDisabled();
return true;

};
RenderMethod.prototype.destroyResource = function() {
if (this._pEffectList) {
var safe_release_refcount=this._pEffectList.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pEffectList = 0;

}

;
if (this._pMaterialList) {
var safe_release_refcount=this._pMaterialList.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pMaterialList = 0;

}

;
if (this.isResourceCreated()) {
this.disableResource();
this.notifyUploaded();
this.notifyDestroyed();
return true;

}

return false;

};
RenderMethod.prototype.restoreResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyRestored();
return true;

};
RenderMethod.prototype.disableResource = function() {
if (!this.isResourceCreated()) {
var err=((((((("Error:: " + "The resource has not been created.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("The resource has not been created.");

}


}

;
this.notifyDisabled();
return true;

};
RenderMethod.prototype.loadResource = function(sFileName) {
return false;

};
RenderMethod.prototype.saveResource = function(sFileName) {
return false;

};
function RenderSnapshot() {
this._sName = null;
this._pRenderMethod = null;
this._pShaderManager = null;
this._iCurrentPass = (-1);
this._pPassStates = [];
if (arguments.length) {
this.method = arguments[0];

}


}

RenderSnapshot.prototype.destructor = function() {
if (this._pRenderMethod) {
var safe_release_refcount=this._pRenderMethod.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pRenderMethod = 0;

}

;
 {
if (this._pPassStates) {
for (var _s=0; _s < (this._pPassStates.length); ++_s) {
 {
if (this._pPassStates[_s]) {
if (this._pPassStates[_s].destructor) {
this._pPassStates[_s].destructor();

}

delete this._pPassStates[_s];
this._pPassStates[_s] = null;

}


};

}

delete this._pPassStates;
this._pPassStates = null;

}


};

};
a.defineProperty(RenderSnapshot, "pass", function() {
return this._iCurrentPass;

}
, function(iPass) {
if (iPass > 0) {
this.activatePass(iPass);

}
else  {
this.deactivatePass();

}


}
);
a.defineProperty(RenderSnapshot, "totalPasses", function() {
return this._pRenderMethod._pEffect._nTotalPasses;

}
);
a.defineProperty(RenderSnapshot, "name", function() {
return this._sName;

}
, function(sName) {
if (sName) {
this._sName = sName;

}


}
);
a.defineProperty(RenderSnapshot, "method", function() {
return this._pRenderMethod;

}
, function(pValue) {
var pMethod=null;
this.destructor();
if ((typeof pValue) === "string") {
pMethod = this._pEngine.pDisplayManager.renderMethodPool().loadResource(pValue);

}
else  {
pMethod = pValue;

}

this._pRenderMethod = pMethod;
this._sName = (this._sName) || (pMethod.findResourceName());
this._pShaderManager = pMethod.getEngine().shaderManager();
pMethod.addRef();

}
);
a.defineProperty(RenderSnapshot, "surfaceMaterial", function() {
return this._pRenderMethod._pMaterial;

}
);
RenderSnapshot.prototype._updatePassStates = function() {

};
RenderSnapshot.prototype.setParameter = function(sName, pData) {
var pPass=this._pPassStates[this._iCurrentPass];
if (pPass[sName]) {
pPass[sName] = pData;
return true;

}

return false;

};
RenderSnapshot.prototype.setParameterInArray = function(sName, pData, iElement) {
var pPass=this._pPassStates[this._iCurrentPass];
if (pPass[sName]) {
pPass[sName][iElement] = pData;
return true;

}

return false;

};
RenderSnapshot.prototype.activatePass = function(iPass) {
if (this._pShaderManager.activatePass(this, iPass)) {
this._iCurrentPass = iPass;
return true;

}

return false;

};
RenderSnapshot.prototype.deactivatePass = function() {
if (this._pShaderManager.deactivatePass(this)) {
this._iCurrentPass = (-1);
return true;

}

return false;

};
RenderSnapshot.prototype.begin = function() {
this._pShaderManager.push(this);

};
RenderSnapshot.prototype.end = function() {
this._pShaderManager.pop(this);

};
RenderSnapshot.prototype.prepareForRender = function() {
var pPass=this._pPassStates[this._iCurrentPass];
var pManager=this._pShaderManager;
for (var sParam in pPass) {
var pParam=pPass[sParam];
if (pParam !== null) {
pManager.setParameter(sParam, pParam);

}


}

pManager.prepareForRender();

};
RenderSnapshot.prototype.applySurfaceMaterial = function(pSurfaceMaterial) {
this._pShaderManager.applySurfaceMaterial(pSurfaceMaterial);

};
RenderSnapshot.prototype.applyCamera = function(pCamera) {
this._pShaderManager.applyCamera(pCamera);

};
RenderSnapshot.prototype.applyBuffer = function(pVertexData) {
this._pShaderManager.applyVertexData(pData);

};
RenderSnapshot.prototype.applyBufferMap = function(pBufferMap) {
this._pShaderManager.applyBufferMap(pBufferMap);

};
RenderSnapshot.prototype.isMethodLoaded = function() {
return (this._pRenderMethod) && (this._pRenderMethod.isResourceLoaded());

};
RenderSnapshot.prototype.hasRenderMethod = function() {
return (this._pRenderMethod) !== null;

};
RenderSnapshot.prototype.isReady = function() {
return (this._pRenderMethod.isResourceLoaded()) && (!(this._pRenderMethod.isResourceDisabled()));

};
a.RenderSnapshot = RenderSnapshot;
function RenderableObject(pEngine) {
this._pEngine = pEngine;
this._pSnapshots = [];
this._pActiveSnaphot = null;

}

a.defineProperty(RenderableObject, "renderMethod", function() {
return this._pActiveSnaphot._pRenderMethod;

}
, function(pRenderMethod) {
this.switchRenderMethod(this.addRenderMethod(pRenderMethod));

}
);
a.defineProperty(RenderableObject, "effect", function() {
return this._pActiveSnaphot._pRenderMethod._pEffect;

}
);
a.defineProperty(RenderableObject, "surfaceMaterial", function() {
return this._pActiveSnaphot._pRenderMethod._pMaterial;

}
);
RenderableObject.prototype.destructor = function() {
this._pShaderManager = null;
this._pActiveSnaphot = null;
 {
if (this._pSnapshots) {
for (var _s=0; _s < (this._pSnapshots.length); ++_s) {
 {
if (this._pSnapshots[_s]) {
if (this._pSnapshots[_s].destructor) {
this._pSnapshots[_s].destructor();

}

delete this._pSnapshots[_s];
this._pSnapshots[_s] = null;

}


};

}

delete this._pSnapshots;
this._pSnapshots = null;

}


};

};
RenderableObject.prototype.addRenderMethod = function(pRenderMethod, sName) {
var pRenderSnapshot=new a.RenderSnapshot();
if (!((pRenderMethod.getEngine()) === (this._pEngine))) {
var err=((((((("Error:: " + "Render method should belong to the same engine instance that the renderable object.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Render method should belong to the same engine instance that the renderable object.");

}


}

;
pRenderSnapshot.method = pRenderMethod;
pRenderSnapshot.name = sName;
for (var i=0; i < (this._pSnapshots.length); i++) {
if ((this._pSnapshots[i]) === null) {
this._pSnapshots[i] = pRenderSnapshot;
return i;

}


}

;
this._pSnapshots[i].push(pRenderSnapshot);
return (this._pSnapshots.length) - 1;

};
RenderableObject.prototype.findRenderMethod = function() {
var iMethod;
if ((typeof (arguments[0])) === "string") {
for (var i=0; i < (this._pSnapshots.length); i++) {
if ((this._pSnapshots[i].name) === sMethodName) {
return i;

}


}

;
return -1;

}

iMethod = arguments[0];
if (iMethod < 0) {
iMethod = Math.abs((this._pSnapshots.length) + iMethod);

}

if (iMethod < (this._pSnapshots.length)) {
return -1;

}

return iMethod;

};
RenderableObject.prototype.switchRenderMethod = function() {
var iSnapshot=this.findRenderMethod(arguments[0]);
if (iSnapshot < 0) {
return false;

}

this._pActiveSnaphot = this._pSnapshots[iSnapshot];
return true;

};
RenderableObject.prototype.removeRenderMethod = function() {
var iSnapshot=this.findRenderMethod(arguments[0]);
if (iSnapshot < 0) {
return false;

}

 {
if (this._pSnapshots[iSnapshot]) {
if (this._pSnapshots[iSnapshot].destructor) {
this._pSnapshots[iSnapshot].destructor();

}

delete this._pSnapshots[iSnapshot];
this._pSnapshots[iSnapshot] = null;

}


};
return true;

};
RenderableObject.prototype.isReadyForRender = function() {
return this._pActiveSnaphot.isReady();

};
RenderableObject.prototype.isAllMethodsLoaded = function() {
for (var i=0; i < (this._pSnapshots); ++i) {
if (!(this._pSnapshots[i].isMethodLoaded())) {
return false;

}


}

return true;

};
RenderableObject.prototype.getRenderMethod = function() {
var iMethod=this.findRenderMethod(arguments[0]);
return this._pSnapshots[iMethod]._pRenderMethod;

};
RenderableObject.prototype.render = function() {

};
RenderableObject.prototype.renderCallback = function(pEntry, iActivationFlags) {

};
a.RenderableObject = RenderableObject;
function Mesh(pEngine, sName, eOptions) {
;
this._sName = sName || null;
this._pDataBuffer = null;
this._pSubsets = [];
this._pMaterials = [];
this._eOptions = 0;
this._pEngine = pEngine;
this.setup(sName, eOptions);

}

;
a.defineProperty(Mesh, "materials", function() {
return this._pMaterials;

}
);
Mesh.prototype.material = function() {
if ((typeof (arguments[0])) === "number") {
return (this._pMaterials[arguments[0]]) || null;

}
else  {
for (var i=0, pMaterials=this._pMaterials; i < (pMaterials.length); ++i) {
if ((pMaterials[i]._sName) === (arguments[0])) {
return pMaterials[i];

}


}


}

return null;

};
Mesh.prototype.addMaterial = function(sName, pMaterialData) {
if (!((arguments.length) < 7)) {
var err=((((((("Error:: " + "only base material supported now...") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("only base material supported now...");

}


}

;
if (!((this.meterial(sName)) === null)) {
var err=((((((("Error:: " + (("material with name <" + sName) + "> already exists")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("material with name <" + sName) + "> already exists"));

}


}

;
sName = sName || "unknown";
var pMaterial=new a.MeshMaterial(sName, this._pDataBuffer.getEmptyVertexData(1, a.MeshMaterial.vertexDeclaration()));
pMaterial.value = pMaterialData || (this.surfaceMaterial.material);
this._pMaterials.push(pMaterial);

};
Mesh.prototype.getData = function(sSemantics) {
var pData=pData = this.pDataBuffer._pVertexDataArray;
for (var i=0; i < (pData.length); i++) {
if (pData[i].hasSemantics(sSemantics)) {
return pData[i];

}


}

;
return null;

};
Mesh.prototype.setData = function(pDataDecl, pData) {
var pVertexData;
pDataDecl = normalizeVertexDecl(pDataDecl);
for (var i=0; i < (pDataDecl.length); i++) {
if (!((this.getData(pDataDecl[i])) === null)) {
var err=((((((("Error:: " + "mesh already contains data with similar  vertex decloration.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("mesh already contains data with similar  vertex decloration.");

}


}

;

}

;
pVertexData = this._allocateData(pDataDecl, pData);
for (var i=0; i < (this._pSubsets.length); ++i) {
this._pSubsets[i]._addData(pVertexData);

}

return pVertexData;

};
Mesh.prototype._allocateData = function(pVertexDecl, pData) {
return this._pDataBuffer.allocateData(pVertexDecl, pData);

};
Mesh.prototype.allocateSubset = function(ePrimType, sName) {
var sName=sName || ("Subset_" + (this._pSubsets.length));
var iSubsetId=this._pSubsets.length;
var pMeshSubset=new a.MeshSubset(this._pEngine);
if (!pMeshSubset.setup(this, iSubsetId, sName, ePrimType)) {
var err=((((((("Error:: " + "cannot setup submesh...") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("cannot setup submesh...");

}


}

;
this._pSubsets.push(pMeshSubset);

};
Mesh.prototype.setup = function(sName, eOptions) {
this._sName = sName || "unknown";
this._pDataBuffer = this._pEngine.displayManager().videoBufferPool().createResource((sName + "_") + (a.sid()));
this._pDataBuffer.create(0, 1 << 3);

};
function buildCubeMesh(pEngine, eOptions) {
var pMesh, pSubMesh;
var iPos, iNorm;
var pVerticesData=new Float32Array([-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5]);
var pNormalsData=new Float32Array([1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1]);
var pVertexIndicesData=new Float32Array([0, 2, 3, 0, 3, 1, 0, 1, 5, 0, 5, 4, 6, 7, 3, 6, 3, 2, 0, 4, 6, 0, 6, 2, 3, 7, 5, 3, 5, 1, 5, 7, 6, 5, 6, 4]);
var pNormalIndicesData=new Float32Array([4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5]);
var pMaterialIndicesData=new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
pMesh = new a.Mesh(pEngine, "cube");
pMesh.addMaterial("default");
pSubMesh = pMesh.allocateSubset();
iPos = pSubMesh.setData([new Object( {nCount: 3, eType: 5126, eUsage: "POSITION", iOffset: undefined})], pVerticesData);
iNorm = pSubMesh.setData([new Object( {nCount: 3, eType: 5126, eUsage: "NORMAL", iOffset: undefined})], pNormalsData);
pSubMesh.allocateIndex([new Object( {nCount: 1, eType: 5126, eUsage: "INDEX1", iOffset: undefined})], pVertexIndicesData);
pSubMesh.allocateIndex([new Object( {nCount: 1, eType: 5126, eUsage: "INDEX2", iOffset: undefined})], pNormalIndicesData);
pSubMesh.index(iPos, "INDEX1");
pSubMesh.index(iNorm, "INDEX2");
return pMesh;

}

a.Mesh = Mesh;
a.buildCubeMesh = buildCubeMesh;
function ModelResource(pEngine) {
ModelResource.superclass.constructor.apply(this, arguments);
this._nTotalFrames = 0;
this._nTotalBoneMatrices = 0;
this._pFrameRoot = null;
this._pFrameList = null;
this._pAnimController = null;
this._pBoundingSphere = new a.Sphere();
this._pBoundingBox = new a.Rect3d();
this._isProgressive = false;
this._eCurrentLOD = 3;

}

a.extend(ModelResource, a.ResourcePoolItem);
ModelResource.prototype.totalFrames = function() {
return this._nTotalFrames;

};
ModelResource.prototype.totalBoneMatrices = function() {
return this._nTotalBoneMatrices;

};
ModelResource.prototype.animationController = function() {
return this._pAnimController;

};
ModelResource.prototype.frame = function(i) {
if (!(i < (this._nTotalFrames))) {
var err=((((((("Error:: " + "invalid frame index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid frame index");

}


}

;
return this._pFrameList[i];

};
ModelResource.prototype.boundingSphere = function() {
return this._pBoundingSphere;

};
ModelResource.prototype.boundingBox = function() {
return this._pBoundingBox;

};
ModelResource.prototype.getLOD = function() {
return this._eCurrentLOD;

};
ModelResource.prototype.getLODScale = function() {
return (this._eCurrentLOD) / (this.eLODLevels.k_maxLOD);

};
ModelResource.prototype.getRootFrame = function() {
return this._pFrameRoot;

};
ModelResource.prototype.containsProgressiveMesh = function() {
return this._isProgressive;

};
ModelResource.prototype.createResource = function() {
return true;

};
ModelResource.prototype.destroyResource = function() {
if (this._pFrameRoot) {
this._pFrameRoot = 0;

}

if (this._pAnimController) {
var safe_release_refcount=this._pAnimController.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pAnimController = 0;

}

;
return true;

};
ModelResource.prototype.disableResource = function() {
return true;

};
ModelResource.prototype.restoreResource = function() {
return true;

};
ModelResource.prototype.loadResource = function(sFilename) {
if (!sFilename) {
var sResourceName=this.findResourceName();
if (sResourceName) {
sFilename = sResourceName;

}


}

var pEngine=this._pEngine;
var res;
var me=this;
this._isProgressive = false;
this._pFrameRoot = null;
switch(a.pathinfo(sFilename).ext.toLowerCase()) {
case "dae":
a.COLLADA(pEngine, sFilename, function(pFrameRoot, nTotalFrames) {
if (!pFrameRoot) {
if (!0) {
var err=((((((("Error:: " + (("model: " + sFilename) + " not loaded.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("model: " + sFilename) + " not loaded."));

}


}

;
return false;

}

me._pFrameRoot = pFrameRoot;
me._nTotalFrames = nTotalFrames;
me._nTotalBoneMatrices = 0;
me._isProgressive = false;
console.log(sFilename, " :: frames total:", me._nTotalFrames, "root:", me._pFrameRoot);
me._setup();

}
);
break ;

case "obj":
a.loadMeshFromOBJ(pEngine, sFilename, a.MESH.MANAGED, function(pMesh) {
if (!pMesh) {
if (!0) {
var err=((((((("Error:: " + (("mesh: " + sFilename) + " not loaded.")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("mesh: " + sFilename) + " not loaded."));

}


}

;
return false;

}

me._pFrameRoot = a.createFrameFromOBJMesh(pMesh, sFilename);
me._nTotalFrames = 1;
me._isProgressive = false;
me._nTotalBoneMatrices = 0;
me._setup();

}
);
break ;

default:
console.warn((((("[WARNING][" + "") + "][") + "") + "]") + "Unknown model format used.");
return false;
}
return true;

};
ModelResource.prototype._setup = function() {
if (!(this.buildFrameList())) {
if (!0) {
var err=((((((("Error:: " + "Cannot build frame list.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot build frame list.");

}


}

;
return false;

}

this.enumMeshContainers(a.prepLoadedMesh, this);
if (!(this.setupBoneMatrixPointers(this._pFrameRoot))) {
if (!0) {
var err=((((((("Error:: " + "Cannot setup bone matrix pointers.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot setup bone matrix pointers.");

}


}

;
return false;

}

this._pBoundingBox.clear();
if (!(this.calculateBoundingRect(this._pFrameRoot, this._pBoundingBox))) {
if (!0) {
var err=((((((("Error:: " + "Cannot calculate mesh bounding Box.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot calculate mesh bounding Box.");

}


}

;
return false;

}

if (!(a.computeFrameBoundingSphere(this._pFrameRoot, this._pBoundingSphere))) {
if (!0) {
var err=((((((("Error:: " + "Cannot calculate mesh bounding sphere.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot calculate mesh bounding sphere.");

}


}

;
return false;

}

if ((this._pBoundingSphere.fRadius) == 0) {
this._pBoundingSphere.v3fCenter = this._pBoundingBox.midPoint();
var v3fCornerOffset=Vec3.subtract(this._pBoundingBox.maxPoint(), this._pBoundingBox.midPoint());
this._pBoundingSphere.fRadius = Vec3.length(v3fCornerOffset);

}

this._eCurrentLOD = 0;
this.setLOD(3);

};
a.prepLoadedMesh = function(pEngine, pFrame, pMeshContainer, pUserData) {
var pRenderMethod;
var pModelResource=pUserData;
var pDisplayManager=pEngine.pDisplayManager;
if (pMeshContainer) {
var fnSetupRenderMethod=function(pRenderMethod, pMeshContainer, iMaterial) {
var fn;
pRenderMethod.setChangesNotifyRoutine(fn = function() {
if (this.isResourceLoaded()) {
this.delChangesNotifyRoutine(fn);
pModelResource.setRenderMethod(pMeshContainer, iMaterial, pRenderMethod);

}


}
);

};
for (var iMaterial=0; iMaterial < (pMeshContainer.nMaterials); ++iMaterial) {
var iSid=a.sid();
if (!(pMeshContainer.ppRenderMethodList[iMaterial])) {
pRenderMethod = pDisplayManager.renderMethodPool().createResource("method_" + iSid);
var pEffectFile=null;
if ((pMeshContainer.pSkinInfo) != null) {
pEffectFile = pDisplayManager.effectPool().loadResource("/sources/" + "effects/default_skinned_mesh.fx.js");

}
else  {
pEffectFile = pEngine.pDisplayManager.effectPool().loadResource("/sources/" + "effects/default_mesh.fx.js");

}

var pMaterial=pDisplayManager.surfaceMaterialPool().createResource("material_" + iSid);
if (pMeshContainer.pMaterials[iMaterial].sTextureFilename) {
var sTexturePath=pMeshContainer.pMaterials[iMaterial].sTextureFilename;
var pTexture=pDisplayManager.texturePool().loadResource(sTexturePath);
if (pTexture) {
pMaterial.setTexture(0, pTexture);

}


}

pMaterial.setMaterial(pMeshContainer.pMaterials[iMaterial]);
pRenderMethod.setEffect(0, pEffectFile);
pRenderMethod.setMaterial(0, pMaterial);
fnSetupRenderMethod(pRenderMethod, pMeshContainer, iMaterial);

}
else  {
pRenderMethod = pMeshContainer.ppRenderMethodList[iMaterial];
pRenderMethod.addRef();
fnSetupRenderMethod(pRenderMethod, pMeshContainer, iMaterial);

}


}


}

return true;

};
ModelResource.prototype.calculateBoundingRect = function(pFrame, pRect) {
if ((pFrame.pMeshContainer) != null) {
var pBaseMesh=null;
pBaseMesh = pFrame.pMeshContainer.pMeshData.pMesh;
if (pBaseMesh) {
var nVertices=pBaseMesh.getNumVertices();
var nBytesPerVertex=pBaseMesh.getNumBytesPerVertex();
if (pVerts = pBaseMesh.getVertexBuffer()) {
var boxResult;
var minPoint=new glMatrixArrayType(3);
var maxPoint=new glMatrixArrayType(3);
boxResult = a.computeBoundingBox(pVerts, nVertices, nBytesPerVertex, minPoint, maxPoint);
if (boxResult) {
pRect.unionPoint(minPoint);
pRect.unionPoint(maxPoint);

}
else  {
if (!0) {
var err=((((((("Error:: " + "Cannot compute bounding box.") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot compute bounding box.");

}


}

;

}


}


}


}

if ((pFrame.pFrameSibling) != null) {
if (!(this.calculateBoundingRect(pFrame.pFrameSibling, pRect))) {
return false;

}


}

if ((pFrame.pFrameFirstChild) != null) {
if (!(this.calculateBoundingRect(pFrame.pFrameFirstChild, pRect))) {
return false;

}


}

return true;

};
ModelResource.prototype.setupBoneMatrixPointersOnMesh = function(pMeshContainerBase) {
var iBone, nBones;
var pFrame=null;
var pMeshContainer=pMeshContainerBase;
if ((pMeshContainer.pSkinInfo) != null) {
nBones = pMeshContainer.pSkinInfo.getNumBones();
pMeshContainer.pBoneIndexList = new Array(nBones);
if ((pMeshContainer.pBoneIndexList) == null) {
return false;

}

for (iBone = 0; iBone < nBones; iBone++) {
pFrame = a.FindFrame(this._pFrameRoot, pMeshContainer.pSkinInfo.getBoneName(iBone));
if (pFrame == null) {
return false;

}

pMeshContainer.pBoneIndexList[iBone] = pFrame.frameIndex;

}


}

return true;

};
ModelResource.prototype.setupBoneMatrixPointers = function(pFrame) {
var hr;
if ((pFrame.pMeshContainer) != null) {
hr = this.setupBoneMatrixPointersOnMesh(pFrame.pMeshContainer);
if (!hr) {
return false;

}


}

if ((pFrame.pFrameSibling) != null) {
hr = this.setupBoneMatrixPointers(pFrame.pFrameSibling);
if (!hr) {
return false;

}


}

if ((pFrame.pFrameFirstChild) != null) {
hr = this.setupBoneMatrixPointers(pFrame.pFrameFirstChild);
if (!hr) {
return false;

}


}

return true;

};
ModelResource.prototype.enumerateFrames = function(pFrame, pParent, index) {
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + "enumerate frames");
var iLocalIndex=index;
index++;
pFrame.iFrameIndex = iLocalIndex;
pFrame.iParentIndex = pParent;
this._pFrameList[iLocalIndex] = pFrame;
if ((pFrame.pFrameSibling) != null) {
if (!(this.enumerateFrames(pFrame.pFrameSibling, pParent, index))) {
return false;

}


}

if ((pFrame.pFrameFirstChild) != null) {
pParent = index;
if (!(this.enumerateFrames(pFrame.pFrameFirstChild, iLocalIndex, index))) {
return false;

}


}

return true;

};
ModelResource.prototype.buildFrameList = function() {
 {
if (this._pFrameList) {
if (this._pFrameList.destructor) {
this._pFrameList.destructor();

}

delete this._pFrameList;
this._pFrameList = null;

}


};
this._pFrameList = new Array(this._nTotalFrames);
return this.enumerateFrames(this._pFrameRoot, 65535, 0);

};
ModelResource.prototype.setRenderMethod = function(pMeshContainer, iMaterial, pRenderMethod) {
var res=true;
var pEngine=this._pEngine;
if (pMeshContainer.ppRenderMethodList[iMaterial]) {
var safe_release_refcount=pMeshContainer.ppRenderMethodList[iMaterial].release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pMeshContainer.ppRenderMethodList[iMaterial] = 0;

}

;
pMeshContainer.ppRenderMethodList[iMaterial] = pRenderMethod;
if (pRenderMethod) {
pRenderMethod.addRef();
var bUsesTangents=false;
var bUsesBinormal=false;
for (var iMethod=0; iMethod < (a.RenderMethod.maxRenderStages); ++iMethod) {
var pEffectFile=pRenderMethod.getEffect(iMethod);
if (pEffectFile && (pEffectFile.effect())) {
pEffect = pEffectFile.effect();
var pEffectDesc=pEffect.getDesc();
var sTechnique;
var pTechniqueDesc;
var sPass;
var pPassDesc;
for (var iTech=0; iTech < (pEffectDesc.nTechniques); iTech++) {
sTechnique = pEffect.getTechnique(iTech);
pTechniqueDesc = pEffect.getTechniqueDesc(sTechnique);
for (var iPass=0; iPass < (pTechniqueDesc.nPasses); iPass++) {
sPass = pEffect.getPass(sTechnique, iPass);
pPassDesc = pEffect.getPassDesc(sPass);
for (var iSem=0; iSem < (pPassDesc.nVSSemanticsUsed); iSem++) {
if ((pPassDesc.pVSSemantics[iSem].eUsage) == ("TANGENT")) {
bUsesTangents = true;

}

if ((PassDesc.pVSSemantics[iSem].eUsage) == ("BINORMAL")) {
bUsesBinormal = true;

}


}


}


}


}


}

var pOrigMesh=null;
pOrigMesh = pMeshContainer.pMeshData.pMesh;
var bRebuildRenderMesh=!(pMeshContainer.pRenderMeshData.pMesh);
if (bUsesTangents || bUsesBinormal) {
var pDeclaration=pOrigMesh.getDeclaration();
var iElem;
var bHasTangents=false;
var bHasBinormal=false;
for (iElem = 0; iElem < (pDeclaration.length); iElem++) {
if ((pDeclaration[iElem].eUsage) == ("TANGENT")) {
bHasTangents = true;

}

if ((pDeclaration[iElem].eUsage) == ("BINORMAL")) {
bHasBinormal = true;

}


}

var cloneMesh=false;
var currentOffset=pOrigMesh.getNumBytesPerVertex();
if (bUsesTangents && (!bHasTangents)) {
pDeclaration[iElem].Stream = 0;
pDeclaration[iElem].Offset = currentOffset;
pDeclaration[iElem].Type = a.DECLTYPE.FLOAT3;
pDeclaration[iElem].Method = a.DECLMETHOD.DEFAULT;
pDeclaration[iElem].Usage = "TANGENT";
pDeclaration[iElem].UsageIndex = 0;
currentOffset += 32 * 3;
cloneMesh = true;

}

if (bUsesBinormal && (!bHasBinormal)) {
pDeclaration[iElem].Stream = 0;
pDeclaration[iElem].Offset = currentOffset;
pDeclaration[iElem].Type = a.DECLTYPE.FLOAT3;
pDeclaration[iElem].Method = a.DECLMETHOD.DEFAULT;
pDeclaration[iElem].Usage = "BINORMAL";
pDeclaration[iElem].UsageIndex = 0;
currentOffset += 32 * 3;
cloneMesh = true;

}

if (cloneMesh) {
if ((pMeshContainer.pMeshData.eType) == (a.MESHDATATYPE.PMESH)) {
pMeshContainer.pMeshData.pMesh.SetNumVertices(4294967295);

}

if ((pMeshContainer.pMeshData.eType) == (a.MESHDATATYPE.MESH)) {
var pTempMesh=null;
pTempMesh = pMeshContainer.pMeshData.pMesh.CloneMesh(pEngine, a.MESH.SYSTEMMEM, pDeclaration);
if (pTempMesh) {
if (!(a.computeTangent(pTempMesh, 0, 0, 0, true, pMeshContainer.pAdjacency))) {
if (!0) {
var err=((((((("Error:: " + "Cannot compute tangent for mesh") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Cannot compute tangent for mesh");

}


}

;
res = false;

}

if (pOrigMesh) {
var safe_release_refcount=pOrigMesh.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pOrigMesh = 0;

}

;
pMeshContainer.pMeshData.pMesh = pTempMesh;
pOrigMesh = pTempMesh;

}
else  {
res = false;

}


}

bRebuildRenderMesh = true;

}


}

if (bRebuildRenderMesh) {
pMeshContainer.pRenderMeshData.pMesh = null;
pMeshContainer.pBoneCombinationBuf = null;
if ((pMeshContainer.pSkinInfo) != null) {
if ((pMeshContainer.pMeshData.eType) == (a.MESHDATATYPE.PMESH)) {
pMeshContainer.pMeshData.pMesh.setNumVertices(4294967295);

}

var pDeclaration=pOrigMesh.getDeclaration();
var pTempMesh=null;
pTempMesh = pOrigMesh.cloneMesh(pEngine, a.MESH.SYSTEMMEM, pDeclaration);
if (pTempMesh) {
var nMaxMatrices=26;
pMeshContainer.nBoneMatrices = Math.min(nMaxMatrices, pMeshContainer.pSkinInfo.getNumBones());
var eFlags=(((a.MESHOPTIONS.COMPACT) | (a.MESHOPTIONS.VERTEXCACHE)) | (a.MESH.MANAGED)) | (a.MESH.WRITEONLY);
var pNewMesh=null;
pNewMesh = pMeshContainer.pSkinInfo.convertToIndexedBlendedMesh(pTempMesh, eFlags, pMeshContainer.nBoneMatrices, pMeshContainer.pAdjacency, null, null, null, pMeshContainer.nBoneInfluences, pMeshContainer.nAttributeGroups, pMeshContainer.pBoneCombinationBuf);
if (pNewMesh) {
var pDecl=pNewMesh.getDeclaration();
var pDeclCur=null;
if (pDecl) {
for (var n=0; n < (pDecl.length); ++n) {
pDeclCur = pDecl[n];
if (((pDeclCur.eUsage) == ("BLENDINDICES")) && ((pDeclCur.eUsageIndex) == 0)) {
pDeclCur.eType = a.DECLTYPE.COLOR;

}


}

res = pNewMesh.updateSemantics(pDecl);
if ((pMeshContainer.pMeshData.eType) == (a.MESHDATATYPE.MESH)) {
pMeshContainer.pRenderMeshData.pMesh = pNewMesh;

}
else  {
pMeshContainer.pRenderMeshData.pMesh = a.generatePMesh(pNewMesh, pMeshContainer.pAdjacency, null, null, pMeshContainer.MeshData.pMesh.getMinFaces(), a.MESHSIMP.FACE);
if (pMeshContainer.RenderMeshData.pMesh) {
pMeshContainer.pRenderMeshData.eType = pMeshContainer.pMeshData.eType;
if (pNewMesh) {
var safe_release_refcount=pNewMesh.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pNewMesh = 0;

}

;

}
else  {
res = false;
pMeshContainer.pRenderMeshData.eType = a.MESHDATATYPE.MESH;
pMeshContainer.pRenderMeshData.pMesh = pNewMesh;

}


}


}
else  {
res = false;

}


}
else  {
res = false;

}

if (pTempMesh) {
var safe_release_refcount=pTempMesh.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pTempMesh = 0;

}

;

}
else  {
res = false;

}


}
else  {
var eFlags=((a.MESHOPTIONS.COMPACT) | (a.MESHOPTIONS.VERTEXCACHE)) | (a.MESH.MANAGED);
if ((pMeshContainer.pMeshData.eType) == (a.MESHDATATYPE.MESH)) {
var pDeclaration=pMeshContainer.pMeshData.pMesh.getDeclaration();
pMeshContainer.pRenderMeshData.pMesh = pMeshContainer.pMeshData.pMesh.cloneMesh(pEngine, a.MESH.MANAGED, pDeclaration);

}
else  {
var pDeclaration=pMeshContainer.pMeshData.pMesh.getDeclaration();
pMeshContainer.pRenderMeshData.pMesh = pMeshContainer.pMeshData.pMesh.clonePMesh(pEngine, a.MESH.MANAGED, pDeclaration);
res = (pMeshContainer.pRenderMeshData.pMesh) !== null;

}

pMeshContainer.pRenderMeshData.eType = pMeshContainer.pMeshData.eType;

}


}

if (!res) {
if (!0) {
var err=((((((("Error:: " + "ModelResource::SetRenderMethod FAILED") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("ModelResource::SetRenderMethod FAILED");

}


}

;

}


}

this.connect(pRenderMethod, 1);
return res;

};
ModelResource.prototype.enumMeshContainers = function(fnCallback, pUserData) {
if (this._pFrameList) {
for (var i=0; i < (this._nTotalFrames); ++i) {
var pFrame=this._pFrameList[i];
if ((pFrame.pMeshContainer) != null) {
if (!(fnCallback(this._pEngine, pFrame, pFrame.pMeshContainer, pUserData))) {
return false;

}


}


}


}

return true;

};
ModelResource.prototype.totalAnimations = function() {
var nTotal=0;
if (this._pAnimController) {
nTotal = this._pAnimController.getNumAnimationSets();

}

return nTotal;

};
ModelResource.prototype.animationName = function(iSlot) {
if (!(iSlot < (this.totalAnimations()))) {
var err=((((((("Error:: " + "invalid animation slot") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid animation slot");

}


}

;
var name=null;
if (this._pAnimController) {
var pAnimationSet=null;
pAnimationSet = this._pAnimController.getAnimationSet(iSlot);
if (pAnimationSet) {
name = pAnimationSet.getName();
if (pAnimationSet) {
var safe_release_refcount=pAnimationSet.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pAnimationSet = 0;

}

;

}


}

return name;

};
ModelResource.prototype.insertAnimation = function(iInsertBefore, pAnimSet) {
var nAnimationCount=this.totalAnimations();
if (this._pAnimController) {
var res;
var nMaxCount=this._pAnimController.getMaxNumAnimationSets();
if ((nAnimationCount + 1) >= nMaxCount) {
var pNewController=null;
pNewController = this._pAnimController.cloneAnimationController(this._pAnimController.getMaxNumMatrices(), nAnimationCount + 1, this._pAnimController.getMaxNumTracks(), this._pAnimController.getMaxNumEvents());
if (!pNewController) {
return ;

}

if (this._pAnimController) {
var safe_release_refcount=this._pAnimController.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pAnimController = 0;

}

;
this._pAnimController = pNewController;

}

if (iInsertBefore >= nAnimationCount) {
this._pAnimController.registerAnimationSet(pAnimSet);

}
else  {
var iStorageCount=nAnimationCount - iInsertBefore;
var pStorage=new Array(iStorageCount);
var count;
for (count = 0; count < iStorageCount; ++count) {
var iStorage=iInsertBefore + count;
pStorage[count] = this._pAnimController.getAnimationSet(iStorage);

}

for (count = 0; count < iStorageCount; ++count) {
this._pAnimController.unregisterAnimationSet(pStorage[count]);

}

this._pAnimController.registerAnimationSet(pAnimSet);
for (count = 0; count < iStorageCount; ++count) {
var iStorage=iInsertBefore + count;
this._pAnimController.registerAnimationSet(pStorage[count]);
if (pStorage[count]) {
var safe_release_refcount=pStorage[count].release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pStorage[count] = 0;

}

;

}

 {
if (pStorage) {
for (var _s=0; _s < (pStorage.length); ++_s) {
 {
if (pStorage[_s]) {
if (pStorage[_s].destructor) {
pStorage[_s].destructor();

}

delete pStorage[_s];
pStorage[_s] = null;

}


};

}

delete pStorage;
pStorage = null;

}


};

}


}


};
ModelResource.prototype.moveAnimation = function(iFrom, iTo) {
if (!(iFrom < (this.totalAnimations()))) {
var err=((((((("Error:: " + "invalid animation slot") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid animation slot");

}


}

;
if (this._pAnimController) {
var pAnimationSet=0;
pAnimationSet = this._pAnimController.getAnimationSet(iFrom);
this._pAnimController.unregisterAnimationSet(pAnimationSet);
this.insertAnimation(iTo, pAnimationSet);
if (pAnimationSet) {
var safe_release_refcount=pAnimationSet.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pAnimationSet = 0;

}

;

}


};
ModelResource.prototype.addAnimations = function(pExternalController) {
if (!pExternalController) {
var err=((((((("Error:: " + "invalid animation controller") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid animation controller");

}


}

;
if (this._pAnimController) {
var res;
var nAnimationCount=this.totalAnimations();
var nCountToAdd=pExternalController.getNumAnimationSets();
var nMaxCount=this._pAnimController.getMaxNumAnimationSets();
if ((nAnimationCount + nCountToAdd) >= nMaxCount) {
var pNewController=null;
pNewController = this._pAnimController.cloneAnimationController(this._pAnimController.getMaxNumMatrices(), nAnimationCount + nCountToAdd, this._pAnimController.getMaxNumTracks(), this._pAnimController.getMaxNumEvents());
if (!pNewController) {
return ;

}

if (this._pAnimController) {
var safe_release_refcount=this._pAnimController.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pAnimController = 0;

}

;
this._pAnimController = pNewController;

}

var iAnimSet;
for (iAnimSet = 0; iAnimSet < nCountToAdd; ++iAnimSet) {
var pAnimationSet=0;
pAnimationSet = pExternalController.getAnimationSet(iAnimSet);
this._pAnimController.registerAnimationSet(pAnimationSet);
if (pAnimationSet) {
var safe_release_refcount=pAnimationSet.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pAnimationSet = 0;

}

;

}


}


};
ModelResource.prototype.removeAnimation = function(iSlot) {
if (!(iSlot < (this.totalAnimations()))) {
var err=((((((("Error:: " + "invalid animation slot") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid animation slot");

}


}

;
var name=null;
if (this._pAnimController) {
var pAnimationSet=null;
pAnimationSet = this._pAnimController.getAnimationSet(iSlot);
if (pAnimationSet) {
this._pAnimController.unregisterAnimationSet(pAnimationSet);
if (pAnimationSet) {
var safe_release_refcount=pAnimationSet.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

pAnimationSet = 0;

}

;

}


}


};
ModelResource.prototype.renderModelSubset = function(iFrame, iSubset) {
var pMeshContainer=this.frame(iFrame).pMeshContainer;
if (pMeshContainer) {
if (pMeshContainer.pRenderMeshData.pMesh) {
pMeshContainer.pRenderMeshData.pMesh.renderArea(iSubset);

}


}


};
ModelResource.prototype.findFirstModelFrame = function() {
for (var i=0; i < (this._nTotalFrames); ++i) {
var pFrame=this._pFrameList[i];
if (pFrame.pMeshContainer) {
return i;

}


}

return -1;

};
ModelResource.prototype.findNextModelFrame = function(iLastFrame) {
for (var i=iLastFrame + 1; i < (this._nTotalFrames); ++i) {
var pFrame=this._pFrameList[i];
if (pFrame.pMeshContainer) {
return i;

}


}

return -1;

};
ModelResource.prototype.setLODScale = function(fZeroToOne) {
if (!(this._isProgressive)) {
return ;

}

var iNewLOD=Math.round((fZeroToOne * (3)));
this.setLOD(iNewLOD);

};
ModelResource.prototype.setLOD = function(iNewLOD) {
if (!(this._isProgressive)) {
return ;

}

iNewLOD = Math.max(0, Math.min(iNewLOD, 3));
var fDetailScale=iNewLOD / (3);
if ((this._currentLOD) != iNewLOD) {
this._currentLOD = iNewLOD;
for (var i=0; i < (this._nTotalFrames); ++i) {
var pFrame=this._pFrameList[i];
if (pFrame.pMeshContainer) {
var pMeshContainer=pFrame.pMeshContainer;
if ((pMeshContainer.pRenderMeshData.eType) == (a.MESHDATATYPE.PMESH)) {
var pMesh=pMeshContainer.pRenderMeshData.pMesh;
if (pMesh) {
var iMinFaces=pMesh.getMinFaces();
var iMaxFaces=pMesh.getMaxFaces();
var fDelta=(iMaxFaces - iMinFaces) * fDetailScale;
var nFaceCount=(Math.round(fDelta)) + iMinFaces;
pMesh.setNumFaces(nFaceCount);

}


}


}


}


}


};
a.ModelResource = ModelResource;
function TerrainSection(pEngine) {
this._pTerrainSystem = null;
this._pSectorVerts = null;
this._iHeightMapX;
this._iHeightMapY;
this._iSectorX;
this._iSectorY;
this._iXVerts = 0;
this._iYVerts = 0;
this._pWorldRect = new a.Rect3d();
TerrainSection.superclass.constructor.apply(this, arguments);

}

;
a.extend(TerrainSection, a.SceneObject);
TerrainSection.prototype.pVertexDescription = new Array(2);
TerrainSection.prototype.pVertexDescription[0] = new VertexDeclaration(1, "POSITION1", 5126, "POSITION");
TerrainSection.prototype.pVertexDescription[1] = new VertexDeclaration(3, "NORMAL", 5126, "NORMAL");
TerrainSection.prototype.sectorX = function() {
return this._iSectorX;

};
TerrainSection.prototype.sectorY = function() {
return this._iSectorY;

};
TerrainSection.prototype.terrainSystem = function() {
return this._pTerrainSystem;

};
TerrainSection.prototype.sectorVertices = function() {
return this._pSectorVerts;

};
TerrainSection.prototype.create = function(pRootNode, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect) {
bResult = TerrainSection.superclass.create.apply(this, arguments);
this.attachToParent(pRootNode);
if (bResult) {
this._pTerrainSystem = pParentSystem;
this._iXVerts = iXVerts;
this._iYVerts = iYVerts;
this._iSectorX = iSectorX;
this._iSectorY = iSectorY;
this._pWorldRect.fX0 = pWorldRect.fX0;
this._pWorldRect.fX1 = pWorldRect.fX1;
this._pWorldRect.fY0 = pWorldRect.fY0;
this._pWorldRect.fY1 = pWorldRect.fY1;
this._iHeightMapX = iHeightMapX;
this._iHeightMapY = iHeightMapY;
bResult = this.buildVertexBuffer();
this.accessLocalBounds().set(this._pWorldRect.fX0, this._pWorldRect.fX1, this._pWorldRect.fY0, this._pWorldRect.fY1, this._pWorldRect.fZ0, this._pWorldRect.fZ1);

}

return bResult;

};
TerrainSection.prototype.buildVertexBuffer = function() {
var bResult=true;
var sTempName;
sTempName = (("terrain_section_" + (this._iSectorX)) + "_") + (this._iSectorY);
this._pSectorVerts = this._pEngine.pDisplayManager.vertexBufferPool().createResource(sTempName);
this._pWorldRect.fZ0 = 3.4e+38;
this._pWorldRect.fZ1 = (-3.4e+38);
if (this._pSectorVerts) {
var pVerts=new Array(((this._iXVerts) * (this._iYVerts)) * 4);
var v3fNormal=null;
for (var y=0; y < (this._iYVerts); ++y) {
for (var x=0; x < (this._iXVerts); ++x) {
fHeight = this._pTerrainSystem.readWorldHeight((this._iHeightMapX) + x, (this._iHeightMapY) + y);
pVerts[(((y * (this._iXVerts)) + x) * 4) + 0] = fHeight;
v3fNormal = this._pTerrainSystem.readWorldNormal((this._iHeightMapX) + x, (this._iHeightMapY) + y);
pVerts[(((y * (this._iXVerts)) + x) * 4) + 1] = v3fNormal[0];
pVerts[(((y * (this._iXVerts)) + x) * 4) + 2] = v3fNormal[1];
pVerts[(((y * (this._iXVerts)) + x) * 4) + 3] = v3fNormal[2];
this._pWorldRect.fZ0 = Math.min(this._pWorldRect.fZ0, fHeight);
this._pWorldRect.fZ1 = Math.max(this._pWorldRect.fZ1, fHeight);

}


}

bResult = this._pSectorVerts.create((this._iXVerts) * (this._iYVerts), 16, 1 << a.VertexBuffer.RamBackupBit, new Float32Array(pVerts));
pVerts = null;

}
else  {
bResult = false;

}

return bResult;

};
TerrainSection.prototype.render = function() {
this._pTerrainSystem.submitSection(this);

};
TerrainSection.prototype.renderCallback = function(entry, activationFlags) {
this._pTerrainSystem.renderSection(this, activationFlags, entry);

};
TerrainSection.prototype.setVertexDescription = function() {
bSuccess = this._pSectorVerts.setVertexDescription(a.TerrainSection.prototype.pVertexDescription, a.TerrainSection.prototype.pVertexDescription.length);
if (!(bSuccess == true)) {
var err=((((((("Error:: " + "TerrainSection.setVertexDescription _pVertexGrid.setVertexDescription is false") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("TerrainSection.setVertexDescription _pVertexGrid.setVertexDescription is false");

}


}

;
return bSuccess;

};
a.TerrainSection = TerrainSection;
function Terrain(pEngine) {
this._pEngine = pEngine;
this._pDevice = pEngine.pDevice;
this._pRootNode = null;
this._pWorldExtents = new a.Rect3d();
this._v3fWorldSize = Vec3.create();
this._v3fMapScale = Vec3.create();
this._iSectorCountX;
this._iSectorCountY;
this._pSectorArray = null;
this._pVertexGrid = null;
this._pTriangles = null;
this._pRenderMethod = null;
this._v2fSectorSize = Vec2.create();
this._pActiveCamera = null;
this._iSectorShift;
this._iSectorUnits;
this._iSectorVerts;
this._iTableWidth;
this._iTableHeight;
this._pHeightTable = null;
this._pv3fNormalTable = null;
this._fVScale = 1;
this._fVLimit = 1;
this.fVRatioLimit = 0.03;
this.fVErrorScale = 1.33;

}

;
Terrain.prototype.pVertexDescription = new Array(2);
Terrain.prototype.pVertexDescription[0] = new a.VertexDeclaration(2, "POSITION0", 5126, "POSITION");
Terrain.prototype.pVertexDescription[1] = new a.VertexDeclaration(2, "TEXCOORD0", 5126, "TEXCOORD");
Terrain.prototype.tableWidth = function() {
return this._iTableWidth;

};
Terrain.prototype.tableHeight = function() {
return this._iTableHeight;

};
Terrain.prototype.mapScale = function() {
return this._v3fMapScale;

};
Terrain.prototype.worldExtents = function() {
return this._pWorldExtents;

};
Terrain.prototype.lodErrorScale = function() {
return this._fVScale;

};
Terrain.prototype.lodRatioLimit = function() {
return this._fVLimit;

};
Terrain.prototype.sectorShift = function() {
return this._iSectorShift;

};
Terrain.sSectorVertex = function() {
this.fHeight;
this.v3fNormal = Vec3.create();

};
Terrain.prototype.elevationData = function() {
this.fMinElevation;
this.fMaxElevation;
this.fMinNormalZ;
this.fMaxNormalZ;
this.fStrength;

};
Terrain.prototype.terrainTextureData = function() {
this.pImage;
this.fUvScale;
this.pElevation = new this.elevationData();

};
Terrain.prototype.sample_data = function() {
this.iColor;
this.fScale;

};
Terrain.prototype.create = function(pRootNode, pHeightMap, worldExtents, iShift) {
var bResult=false;
this._iSectorShift = iShift;
this._iSectorUnits = 1 << iShift;
this._iSectorVerts = (this._iSectorUnits) + 1;
this._pRootNode = pRootNode;
this._pWorldExtents = worldExtents;
this._v3fWorldSize = worldExtents.size();
this._iTableWidth = pHeightMap.getWidth();
this._iTableHeight = pHeightMap.getHeight();
this._v3fMapScale[0] = (this._v3fWorldSize[0]) / (this._iTableWidth);
this._v3fMapScale[1] = (this._v3fWorldSize[1]) / (this._iTableHeight);
this._v3fMapScale[2] = (this._v3fWorldSize[2]) / 255;
this.buildHeightAndNormalTables(pHeightMap);
this._iSectorCountX = (this._iTableWidth) >> (this._iSectorShift);
this._iSectorCountY = (this._iTableHeight) >> (this._iSectorShift);
this._v2fSectorSize[0] = ((this._v3fWorldSize[0]) / (this._iSectorCountX));
this._v2fSectorSize[1] = ((this._v3fWorldSize[1]) / (this._iSectorCountY));
if (this.buildVertexBuffer()) {
if (this.buildIndexBuffer()) {
bResult = this.allocateSectors();
this.setVertexDescription();

}


}

return bResult;

};
Terrain.prototype.allocateSectors = function() {
this._pSectorArray = new Array((this._iSectorCountX) * (this._iSectorCountY));
for (var y=0; y < (this._iSectorCountY); ++y) {
for (var x=0; x < (this._iSectorCountX); ++x) {
v2fSectorPos = Vec2.create();
v2fSectorPos[0] = ((this._pWorldExtents.fX0) + (x * (this._v2fSectorSize[0])));
v2fSectorPos[1] = ((this._pWorldExtents.fY0) + (y * (this._v2fSectorSize[1])));
r2fSectorRect = new a.Rect2d();
r2fSectorRect.set(v2fSectorPos[0], (v2fSectorPos[0]) + (this._v2fSectorSize[0]), v2fSectorPos[1], (v2fSectorPos[1]) + (this._v2fSectorSize[1]));
iXPixel = x << (this._iSectorShift);
iYPixel = y << (this._iSectorShift);
iIndex = (y * (this._iSectorCountX)) + x;
this._pSectorArray[iIndex] = new a.TerrainSection(this._pEngine);
if (!(this._pSectorArray[iIndex].create(this._pRootNode, this, x, y, iXPixel, iYPixel, this._iSectorVerts, this._iSectorVerts, r2fSectorRect))) {
return false;

}


}


}

return true;

};
Terrain.prototype.setRenderMethod = function(pRenderMethod) {
this._pRenderMethod = null;
this._pRenderMethod = pRenderMethod;
if (this._pRenderMethod) {
this._pRenderMethod.addRef();

}


};
Terrain.prototype.buildHeightAndNormalTables = function(pImage) {
var pColor=new Uint8Array(4);
this._pHeightTable = null;
this._pv3fNormalTable = null;
var iMaxY=this._iTableHeight;
var iMaxX=this._iTableWidth;
var x, y;
this._pHeightTable = new Array(iMaxX * iMaxY);
this._pv3fNormalTable = new Array(iMaxX * iMaxY);
for (var i=0; i < (iMaxX * iMaxY); i++) {
this._pv3fNormalTable[i] = Vec3.create();

}

if (pImage.isResourceLoaded()) {
var fHeight;
var iHeight;
for (y = 0; y < iMaxY; y++) {
for (x = 0; x < iMaxX; x++) {
pImage.getPixelRGBA(x, y, pColor);
iHeight = pColor[0];
fHeight = (iHeight * (this._v3fMapScale[2])) + (this._pWorldExtents.fZ0);
this._pHeightTable[(y * iMaxX) + x] = fHeight;

}


}


}

temp = new a.Texture(this._pEngine);
fScale = ((this._iTableWidth) * (this._pWorldExtents.sizeZ())) / (this._pWorldExtents.sizeX());
temp.generateNormalMap(pImage, 0, fScale);
var pColorData=new Uint8Array((4 * iMaxY) * iMaxX);
temp.getPixelRGBA(0, 0, iMaxX, iMaxY, pColorData);
var i=0;
for (y = 0; y < iMaxY; y++) {
for (x = 0; x < iMaxX; x++) {
i++;
this._pv3fNormalTable[(y * iMaxX) + x][0] = (pColorData[(((y * iMaxX) + x) * 4) + 0]) - 127.5;
this._pv3fNormalTable[(y * iMaxX) + x][1] = (pColorData[(((y * iMaxX) + x) * 4) + 1]) - 127.5;
this._pv3fNormalTable[(y * iMaxX) + x][2] = (pColorData[(((y * iMaxX) + x) * 4) + 2]) - 127.5;
Vec3.normalize(this._pv3fNormalTable[(y * iMaxX) + x]);

}


}

temp.releaseTexture();

};
Terrain.prototype.readWorldHeight = function() {
if ((arguments.length) == 2) {
var iMapX=arguments[0];
var iMapY=arguments[1];
if (iMapX >= (this._iTableWidth)) {
iMapX = (this._iTableWidth) - 1;

}

if (iMapY >= (this._iTableHeight)) {
iMapY = (this._iTableHeight) - 1;

}

return this._pHeightTable[(iMapY * (this._iTableWidth)) + iMapX];

}
else  {
var iMapIndex=arguments[0];
if (!(iMapIndex < ((this._iTableWidth) * (this._iTableHeight)))) {
var err=((((((("Error:: " + "invalid index") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid index");

}


}

;
return this._pHeightTable[iMapIndex];

}


};
Terrain.prototype.tableIndex = function(iMapX, iMapY) {
if (iMapX >= (this._iTableWidth)) {
iMapX = (this._iTableWidth) - 1;

}

if (iMapY >= (this._iTableHeight)) {
iMapY = (this._iTableHeight) - 1;

}

return (iMapY * (this._iTableWidth)) + iMapX;

};
Terrain.prototype.readWorldNormal = function(iMapX, iMapY) {
if (iMapX >= (this._iTableWidth)) {
iMapX = (this._iTableWidth) - 1;

}

if (iMapY >= (this._iTableHeight)) {
iMapY = (this._iTableHeight) - 1;

}

return this._pv3fNormalTable[(iMapY * (this._iTableWidth)) + iMapX];

};
Terrain.prototype.calcWorldHeight = function(fWorldX, fWorldY) {
fMapX = (fWorldX - (this._pWorldExtents.fX0)) / (this._pWorldExtents.sizeX());
fMapY = (fWorldY - (this._pWorldExtents.fY0)) / (this._pWorldExtents.sizeY());
return this.calcMapHeight(fMapX, fMapY);

};
Terrain.prototype.calcWorldNormal = function(v3fNormal, fWorldX, fWorldY) {
fMapX = (fWorldX - (this._pWorldExtents.fX0)) / (this._pWorldExtents.sizeX());
fMapY = (fWorldY - (this._pWorldExtents.fY0)) / (this._pWorldExtents.sizeY());
this.calcMapNormal(v3fNormal, fMapX, fMapY);

};
Terrain.prototype.calcMapHeight = function(fMapX, fMapY) {
var fTempMapX=fMapX * ((this._iTableWidth) - 1);
var fTempMapY=fMapY * ((this._iTableHeight) - 1);
var iMapX0=Math.floor(fTempMapX);
var iMapY0=Math.floor(fTempMapY);
fTempMapX -= iMapX0;
fTempMapY -= iMapY0;
iMapX0 = Math.max(0, Math.min(iMapX0, ((this._iTableWidth) - 1)));
iMapY0 = Math.max(0, Math.min(iMapY0, ((this._iTableHeight) - 1)));
var iMapX1=Math.max(0, Math.min((iMapX0 + 1), ((this._iTableWidth) - 1)));
var iMapY1=Math.max(0, Math.min((iMapY0 + 1), ((this._iTableHeight) - 1)));
var fH0=this.readWorldHeight(iMapX0, iMapY0);
var fH1=this.readWorldHeight(iMapX1, iMapY0);
var fH2=this.readWorldHeight(iMapX0, iMapY1);
var fH3=this.readWorldHeight(iMapX1, iMapY1);
var fAvgLo=(fH1 * fTempMapX) + (fH0 * (1 - fTempMapX));
var fAvgHi=(fH3 * fTempMapX) + (fH2 * (1 - fTempMapX));
return (fAvgHi * fTempMapY) + (fAvgLo * (1 - fTempMapY));

};
Terrain.prototype.calcMapNormal = function(v3fNormal, fTempMapX, fTempMapY) {
var fMapX=fTempMapX * ((this._iTableWidth) - 1);
var fMapY=fTempMapY * ((this._iTableHeight) - 1);
var iMapX0=Math.floor(fMapX);
var iMapY0=Math.floor(fMapY);
fMapX -= iMapX0;
fMapY -= iMapY0;
iMapX0 = Math.max(0, Math.min(iMapX0, ((this._iTableWidth) - 1)));
iMapY0 = Math.max(0, Math.min(iMapY0, ((this._iTableHeight) - 1)));
var iMapX1=Math.max(0, Math.min((iMapX0 + 1), ((this._iTableWidth) - 1)));
var iMapY1=Math.max(0, Math.min((iMapY0 + 1), ((this._iTableHeight) - 1)));
v3fH0 = Vec3.create();
v3fH0[0] = this.readWorldNormal(iMapX0, iMapY0)[0];
v3fH0[1] = this.readWorldNormal(iMapX0, iMapY0)[1];
v3fH0[2] = this.readWorldNormal(iMapX0, iMapY0)[2];
v3fH1 = Vec3.create();
v3fH1[0] = this.readWorldNormal(iMapX1, iMapY0)[0];
v3fH1[1] = this.readWorldNormal(iMapX1, iMapY0)[1];
v3fH1[2] = this.readWorldNormal(iMapX1, iMapY0)[2];
v3fH2 = Vec3.create();
v3fH2[0] = this.readWorldNormal(iMapX0, iMapY1)[0];
v3fH2[1] = this.readWorldNormal(iMapX0, iMapY1)[1];
v3fH2[2] = this.readWorldNormal(iMapX0, iMapY1)[2];
v3fH3 = Vec3.create();
v3fH3[0] = this.readWorldNormal(iMapX1, iMapY1)[0];
v3fH3[1] = this.readWorldNormal(iMapX1, iMapY1)[1];
v3fH3[2] = this.readWorldNormal(iMapX1, iMapY1)[2];
v3fAvgLo = Vec3.create();
Vec3.add(Vec3.scale(v3fH1, fMapX), Vec3.scale(v3fH0, 1 - fMapX), v3fAvgLo);
v3fAvgHi = Vec3.create();
Vec3.add(Vec3.scale(v3fH3, fMapX), Vec3.scale(v3fH2, 1 - fMapX), v3fAvgHi);
Vec3.add(Vec3.scale(v3fAvgHi, fMapY), Vec3.scale(v3fAvgLo, 1 - fMapY), v3fNormal);
Vec3.normalize(v3fNormal);

};
Terrain.prototype.generateTerrainImage = function(pTerrainImage, pTextureList, iTextureCount) {
var bSuccess=false;
var x, y, i;
var iImage_width=pTerrainImage.getWidth();
var iImage_height=pTerrainImage.getHeight();
var fUStep=1 / (iImage_width - 1);
var fVStep=1 / (iImage_height - 1);
var pSamples=new Array(iTextureCount);
pTerrainImage.lock();
for (i = 0; i < iTextureCount; ++i) {
pTextureList[i].pImage.lock();

}

for (y = 0; y < iImage_height; ++y) {
for (x = 0; x < iImage_width; ++x) {
var fU=x * fUStep;
var fV=y * fVStep;
var fTotalBlend=0;
var fMap_height=this.calcMapHeight(fU, fV);
var v3fNormal=Vec3.create();
this.calcMapNormal(v3fNormal, fU, fV);
for (i = 0; i < iTextureCount; ++i) {
var fElevationScale=0;
var fSlopeScale=0;
if ((fMap_height >= (pTextureList[i].elevation.minElevation)) && (fMap_height <= (pTextureList[i].elevation.maxElevation))) {
var fSpan=(pTextureList[i].elevation.maxElevation) - (pTextureList[i].elevation.minElevation);
fElevationScale = fMap_height - (pTextureList[i].elevation.minElevation);
fElevationScale *= 1 / fSpan;
fElevationScale -= 0.5;
fElevationScale *= 2;
fElevationScale *= fElevationScale;
fElevationScale = 1 - fElevationScale;

}

if (((v3fNormal[2]) >= (pTextureList[i].elevation.minNormalZ)) && ((v3fNormal[2]) <= (pTextureList[i].elevation.maxNormalZ))) {
var fSpan=(pTextureList[i].elevation.maxNormalZ) - (pTextureList[i].elevation.minNormalZ);
fSlopeScale = (v3fNormal[2]) - (pTextureList[i].elevation.minNormalZ);
fSlopeScale *= 1 / fSpan;
fSlopeScale -= 0.5;
fSlopeScale *= 2;
fSlopeScale *= fSlopeScale;
fSlopeScale = 1 - fSlopeScale;

}

pSamples[i] = new this.sample_data();
pSamples[i].fScale = ((pTextureList[i].elevation.strength) * fElevationScale) * fSlopeScale;
fTotalBlend += pSamples[i].fScale;
pTextureList[i].pImage.sampleColor(fU * (pTextureList[i].fUvScale), fV * (pTextureList[i].fUvScale), pSamples[i].iColor);

}

var fBlendScale=1 / fTotalBlend;
var fRed=0;
var fGreen=0;
var fBlue=0;
var fAlpha=0;
for (i = 0; i < iTextureCount; ++i) {
var fScale=(pSamples[i].fScale) * fBlendScale;
fBlue += ((pSamples[i].iColor) & 255) * fScale;
fGreen += (((pSamples[i].iColor) >> 8) & 255) * fScale;
fRed += (((pSamples[i].iColor) >> 16) & 255) * fScale;
fAlpha += (((pSamples[i].iColor) >> 24) & 255) * fScale;

}

var iR=Math.max(0, Math.min(fRed, 255));
var iG=Math.max(0, Math.min(fGreen, 255));
var iB=Math.max(0, Math.min(fBlue, 255));
var iA=Math.max(0, Math.min(fAlpha, 255));
var iColor=(((iA << 24) + (fR << 16)) + (iG << 8)) + iB;
pTerrainImage.setColor(x, y, iColor);

}


}

pTerrainImage.unlock();
for (i = 0; i < iTextureCount; ++i) {
pTextureList[i].pImage.unlock();

}


};
Terrain.prototype.computeWeight = function(fValue, fMinExtent, fMaxExtent) {
var fWeight=0;
if ((fValue >= fMinExtent) && (fValue <= fMaxExtent)) {
var fSpan=fMaxExtent - fMinExtent;
fWeight = fValue - fMinExtent;
fWeight *= 1 / fSpan;
fWeight -= 0.5;
fWeight *= 2;
fWeight *= fWeight;
fWeight = 1 - (Math.abs(fWeight));
fWeight = Math.max(0.001, Math.min(fWeight, 1));

}

return fWeight;

};
Terrain.prototype.generateBlendImage = function(pBlendImage, pElevationData, iElevationDataCount, fnCallback) {
var bSuccess=false;
var x, y, i;
var pColor=new Uint8Array(4);
if (!(pBlendImage != null)) {
var err=((((((("Error:: " + "pBlendImage is not valid") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("pBlendImage is not valid");

}


}

;
iElevationDataCount = Math.min(iElevationDataCount, 4);
var iImg_width=pBlendImage.getWidth();
var iImg_height=pBlendImage.getHeight();
var fUStep=1 / (iImg_width - 1);
var fVStep=1 / (iImg_height - 1);
v4fMask = new Array(4);
v4fMask[0] = Vec4.create();
v4fMask[0][0] = 1;
v4fMask[0][1] = 0;
v4fMask[0][2] = 0;
v4fMask[0][3] = 0;
v4fMask[1] = Vec4.create();
v4fMask[1][0] = 0;
v4fMask[1][1] = 1;
v4fMask[1][2] = 0;
v4fMask[1][3] = 0;
v4fMask[2] = Vec4.create();
v4fMask[2][0] = 0;
v4fMask[2][1] = 0;
v4fMask[2][2] = 1;
v4fMask[2][3] = 0;
v4fMask[3] = Vec4.create();
v4fMask[3][0] = 0;
v4fMask[3][1] = 0;
v4fMask[3][2] = 0;
v4fMask[3][3] = 1;
for (y = 0; y < iImg_height; y++) {
for (x = 0; x < iImg_width; x++) {
var fTotalBlend=0;
var v4fBlendFactors=Vec4.create();
v4fBlendFactors[0] = 0;
v4fBlendFactors[1] = 0;
v4fBlendFactors[2] = 0;
v4fBlendFactors[3] = 0;
if (iElevationDataCount == 3) {
v4fBlendFactors[3] = 255;

}

var fU=x * fUStep;
var fV=y * fVStep;
var fMap_height=this.calcMapHeight(fU, fV);
var v3fNormal=Vec3.create();
var v4fTemp=Vec4.create();
this.calcMapNormal(v3fNormal, fU, fV);
for (i = 0; i < iElevationDataCount; ++i) {
var fElevationScale=this.computeWeight(fMap_height, pElevationData[i].fMinElevation, pElevationData[i].fMaxElevation);
var fSlopeScale=this.computeWeight(v3fNormal[2], pElevationData[i].fMinNormalZ, pElevationData[i].fMaxNormalZ);
var fScale=((pElevationData[i].fStrength) * fElevationScale) * fSlopeScale;
Vec4.add(v4fBlendFactors, Vec4.scale(v4fMask[i], fScale, v4fTemp));
fTotalBlend += fScale;

}

var fBlendScale=255 / fTotalBlend;
v4fBlendFactors = Vec4.scale(v4fBlendFactors, fBlendScale);
pColor[0] = Math.max(0, Math.min(v4fBlendFactors[0], 255));
pColor[1] = Math.max(0, Math.min(v4fBlendFactors[1], 255));
pColor[2] = Math.max(0, Math.min(v4fBlendFactors[2], 255));
pColor[3] = Math.max(0, Math.min(v4fBlendFactors[3], 255));
pBlendImage.setPixelRGBA(x, (iImg_height - y) - 1, pColor);

}


}


};
Terrain.prototype.pCodeTimerTerrainSystemRenderSection = new a.CodeTimer("cTerrainSystem_renderSection");
Terrain.prototype.renderSection = function(pSection, iActivationFlags, pEntry) {
var pEffectFile=this._pRenderMethod.getActiveEffect();
var pSurfaceMaterial=this._pRenderMethod.getActiveMaterial();
if (pEffectFile) {
var pFunctionTimer=new a.FunctionTimer(this.pCodeTimerTerrainSystemRenderSection);
if ((iActivationFlags & (1 << 1)) != 0) {
pEffectFile.activatePass(pEntry.renderPass);

}

if ((iActivationFlags & (1 << 0)) != 0) {
pEffectFile.begin();

}

if ((iActivationFlags & (1 << 4)) != 0) {
pEffectFile.applyVertexBuffer(this._pVertexGrid);

}

if ((iActivationFlags & (1 << 5)) != 0) {
pEffectFile.applyVertexBuffer(pSection.sectorVertices());

}

if ((iActivationFlags & (1 << 6)) != 0) {
this._pTriangles.activate();

}

if ((iActivationFlags & (1 << 7)) != 0) {
pEffectFile.applySurfaceMaterial(pSurfaceMaterial);

}

var iSectorX=pSection.sectorX();
var iSectorY=pSection.sectorY();
var v4fSectorOffset=Vec4.create();
v4fSectorOffset[0] = 1;
v4fSectorOffset[1] = 1;
v4fSectorOffset[2] = ((this._pWorldExtents.fX0) + ((this._v2fSectorSize[0]) * iSectorX));
v4fSectorOffset[3] = ((this._pWorldExtents.fY0) + ((this._v2fSectorSize[1]) * iSectorY));
var v4fUvScaleOffset=Vec4.create();
v4fUvScaleOffset[0] = (1 / (this._iSectorCountX));
v4fUvScaleOffset[1] = (1 / (this._iSectorCountY));
v4fUvScaleOffset[2] = iSectorX;
v4fUvScaleOffset[3] = iSectorY;
pEffectFile.setParameter(a.EffectResource.posScaleOffset, v4fSectorOffset);
pEffectFile.setParameter(a.EffectResource.uvScaleOffset, v4fUvScaleOffset);
if ((iActivationFlags & (1 << 1)) != 0) {
pEffectFile.deactivatePass();

}

this._pDevice.drawElements(this._pTriangles.getPrimitiveType(), this._pTriangles.getCount(), this._pTriangles.getElementType(), 0);
pFunctionTimer.destructor();

}


};
Terrain.prototype.pCodeTimerTerrainSystemSubmitSection = new a.CodeTimer("cTerrainSystem_submitSection");
Terrain.prototype.submitSection = function(pSection) {
if (!(this._pRenderMethod.isResourceLoaded())) {
return ;

}

var pRenderEntry;
var pEffectFile=this._pRenderMethod.getActiveEffect();
var pSurfaceMaterial=this._pRenderMethod.getActiveMaterial();
if (pEffectFile) {
var pFunctionTimer=new a.FunctionTimer(this.pCodeTimerTerrainSystemSubmitSection);
var iTotalPasses=pEffectFile.totalPasses();
var iSX=pSection.sectorX();
var iSY=pSection.sectorY();
var index=(iSY * (this._iSectorCountX)) + iSX;
for (var iPass=0; iPass < iTotalPasses; ++iPass) {
pRenderEntry = this._pEngine.pDisplayManager.openRenderQueue();
pRenderEntry.hEffectFile = pEffectFile.resourceHandle();
pRenderEntry.hSurfaceMaterial = pSurfaceMaterial.resourceHandle();
pRenderEntry.modelType = 0;
pRenderEntry.hModel = this._pVertexGrid.resourceHandle();
pRenderEntry.modelParamA = pSection.sectorVertices().resourceHandle();
pRenderEntry.modelParamB = this._pTriangles.resourceHandle();
pRenderEntry.renderPass = iPass;
pRenderEntry.pSceneNode = pSection;
pRenderEntry.userData = 0;
this._pEngine.pDisplayManager.closeRenderQueue(pRenderEntry);

}

pFunctionTimer.destructor();

}


};
Terrain.prototype.setTessellationParameters = function(fVScale, fVLimit) {
this._fVScale = fVScale;
this._fVLimit = fVLimit;

};
Terrain.prototype.computeErrorMetricOfGrid = function(iXVerts, iYVerts, iXStep, iYStep, iXOffset, iYOffset) {
var fResult=0;
var iTotalRows=iYVerts - 1;
var iTotalCells=iXVerts - 1;
var iStartVert=(iYOffset * (this._iTableWidth)) + iXOffset;
var iLineStep=iYStep * (this._iTableWidth);
var fInvXStep=1 / iXStep;
var fInvYStep=1 / iYStep;
for (var j=0; j < iTotalRows; ++j) {
var iIndexA=iStartVert;
var iIndexB=iStartVert + iLineStep;
var fCornerA=this.readWorldHeight(iIndexA);
var fCornerB=this.readWorldHeight(iIndexB);
for (var i=0; i < iTotalCells; ++i) {
var iIndexC=iIndexA + iXStep;
var iIndexD=iIndexB + iXStep;
var fCornerC=this.readWorldHeight(iIndexC);
var fCornerD=this.readWorldHeight(iIndexD);
var fStepX0=(fCornerD - fCornerA) * fInvXStep;
var fStepY0=(fCornerB - fCornerA) * fInvYStep;
var fStepX1=(fCornerB - fCornerC) * fInvXStep;
var fStepY1=(fCornerD - fCornerC) * fInvYStep;
var iSubIndex=iIndexA;
for (var y=0; y < iYStep; ++y) {
for (var x=0; x < iXStep; ++x) {
var fTrueHeight=this.readWorldHeight(iSubIndex);
++iSubIndex;
var fIntepolatedHeight;
if (y < (iXStep - x)) {
fIntepolatedHeight = (fCornerA + (fStepX0 * x)) + (fStepY0 * y);

}
else  {
fIntepolatedHeight = (fCornerC + (fStepX1 * x)) + (fStepY1 * y);

}

var fDelta=Math.abs((fTrueHeight - fIntepolatedHeight));
fResult = Math.max(fResult, fDelta);

}

iSubIndex = iIndexA + (y * (this._iTableWidth));

}

iIndexA = iIndexC;
iIndexB = iIndexD;
fCornerA = fCornerC;
fCornerB = fCornerD;

}

iStartVert += iLineStep;

}

return fResult;

};
Terrain.prototype.buildVertexBuffer = function() {
var sTempName;
sTempName = "terrain_system_" + (a.sid());
this._pVertexGrid = this._pEngine.pDisplayManager.vertexBufferPool().createResource(sTempName);
v2fCellSize = Vec2.create();
v2fCellSize[0] = ((this._v2fSectorSize[0]) / (this._iSectorUnits));
v2fCellSize[1] = ((this._v2fSectorSize[1]) / (this._iSectorUnits));
v2fVert = Vec2.create();
v2fVert[0] = 0;
v2fVert[1] = 0;
var pVerts=new Array(((this._iSectorVerts) * (this._iSectorVerts)) * 4);
for (var y=0; y < (this._iSectorVerts); ++y) {
v2fVert[0] = 0;
v2fVert[1] = (y * (v2fCellSize[1]));
for (var x=0; x < (this._iSectorVerts); ++x) {
pVerts[(((y * (this._iSectorVerts)) + x) * 4) + 0] = v2fVert[0];
pVerts[(((y * (this._iSectorVerts)) + x) * 4) + 1] = v2fVert[1];
pVerts[(((y * (this._iSectorVerts)) + x) * 4) + 2] = x / ((this._iSectorVerts) - 1);
pVerts[(((y * (this._iSectorVerts)) + x) * 4) + 3] = y / ((this._iSectorVerts) - 1);
v2fVert[0] += v2fCellSize[0];

}


}

bResult = this._pVertexGrid.create((this._iSectorVerts) * (this._iSectorVerts), 16, 0, new Float32Array(pVerts));
return bResult;

};
Terrain.prototype.setVertexDescription = function() {
bSuccess = this._pVertexGrid.setVertexDescription(a.Terrain.prototype.pVertexDescription, a.Terrain.prototype.pVertexDescription.length);
if (!(bSuccess == true)) {
var err=((((((("Error:: " + "Terrain.setVertexDescription _pVertexGrid.setVertexDescription is false") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Terrain.setVertexDescription _pVertexGrid.setVertexDescription is false");

}


}

;
if (bSuccess == false) {
return bSuccess;

}

for (var iIndex=0; iIndex < ((this._iSectorCountX) * (this._iSectorCountY)); iIndex++) {
bSuccess = this._pSectorArray[iIndex].setVertexDescription();
if (!(bSuccess == true)) {
var err=((((((("Error:: " + "Terrain.setVertexDescription pSectorArray[iIndex].setRenderMethod is false") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Terrain.setVertexDescription pSectorArray[iIndex].setRenderMethod is false");

}


}

;

}

return bSuccess;

};
Terrain.prototype.buildIndexBuffer = function() {
var sTempName;
sTempName = "terrain_system_" + (a.sid());
this._pTriangles = this._pEngine.pDisplayManager.indexBufferPool().createResource(sTempName);
return this._pTriangles.createSingleStripGrid(this._iSectorVerts, this._iSectorVerts, 1, 1, this._iSectorVerts, 0);

};
Terrain.prototype.readUserInput = function() {
if (this._pEngine.pKeymap.isKeyPress(107)) {
this.fVRatioLimit += 0.001;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + (("vRatioLimit: " + (this.fVRatioLimit)) + "\n"));

}
else if (this._pEngine.pKeymap.isKeyPress(109)) {
this.fVRatioLimit -= 0.001;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + (("vRatioLimit: " + (this.fVRatioLimit)) + "\n"));

}


if (this._pEngine.pKeymap.isKeyPress(106)) {
this.fVErrorScale += 0.001;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + (("vErrorScale: " + (this.fVErrorScale)) + "\n"));

}
else if (this._pEngine.pKeymap.isKeyPress(111)) {
this.fVErrorScale -= 0.001;
console.log((((("[DEBUG][" + "") + "][") + "") + "]") + (("vErrorScale: " + (this.fVErrorScale)) + "\n"));

}


if ((this.fVRatioLimit) < 0.001) {
this.fVRatioLimit = 0.001;

}

if ((this.fVErrorScale) < 0.001) {
this.fVErrorScale = 0.001;

}

this.setTessellationParameters(this.fVErrorScale, this.fVRatioLimit);

};
a.Terrain = Terrain;
function UserData() {
this.iMaterial = 0;
this.iSubset = 0;

}

;
a.UserData = UserData;
function SceneModel(pEngine) {
SceneModel.superclass.constructor.apply(this, arguments);
this._pModelResource = null;
this._iModelFrameIndex = 0;
this._nTotalBoneMatrices = 0;
this._pBoneMatrixList = 0;
this._iLod = 0;
this._m3fWorldViewProj = new glMatrixArrayType(16);

}

a.extend(SceneModel, a.SceneObject);
SceneModel.prototype.create = function() {
SceneModel.superclass.create.apply(this);

};
SceneModel.prototype.destroy = function() {
if (this._pModelResource) {
var safe_release_refcount=this._pModelResource.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pModelResource = 0;

}

;
 {
if (this._pBoneMatrixList) {
for (var _s=0; _s < (this._pBoneMatrixList.length); ++_s) {
 {
if (this._pBoneMatrixList[_s]) {
if (this._pBoneMatrixList[_s].destructor) {
this._pBoneMatrixList[_s].destructor();

}

delete this._pBoneMatrixList[_s];
this._pBoneMatrixList[_s] = null;

}


};

}

delete this._pBoneMatrixList;
this._pBoneMatrixList = null;

}


};
this._nTotalBoneMatrices = 0;
this._iModelFrameIndex = 0;
SceneModel.superclass.destroy.apply(this);

};
SceneModel.prototype.prepareForRender = function() {
if ((this._pModelResource) && (this._pModelResource.containsProgressiveMesh())) {
var pCamera=this._pEngine.getActiveCamera();
var v3fWorldPos=this.worldPosition();
var v3fCamPos=pCamera.worldPosition();
var fDist=(Vec3.lengthSquare(v3fCamPos)) / ((pCamera.farPlane()) * (pCamera.farPlane()));
this._iLod = Math.round(((1 - fDist) * (3)));

}


};
SceneModel.prototype.render = function() {
SceneModel.superclass.render.apply(this);
var pMeshContainer=this.meshContainer();
var pDisplayManager=this._pEngine.pDisplayManager;
if ((pMeshContainer != null) && (pMeshContainer.ppRenderMethodList)) {
if ((pMeshContainer.pSkinInfo) != null) {
var pAnimationOwner=this.subNodeGroupOwner();
if (!pAnimationOwner) {
var err=((((((("Error:: " + "no animation owner found for skin") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("no animation owner found for skin");

}


}

;
var pAnimData=pAnimationOwner.subNodeGroupData();
if (!pAnimData) {
var err=((((((("Error:: " + "no animation data found for skin") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("no animation data found for skin");

}


}

;
for (var iBone=0; iBone < (this._nTotalBoneMatrices); ++iBone) {
var iBoneIndex=pMeshContainer.pBoneIndexList[iBone];
var pSceneNode=pAnimData.subNodePtr(iBoneIndex);
var m4fBoneMatrix=pSceneNode.worldMatrix();
Mat4.mult(pMeshContainer.pBoneOffsetMatrices[iBone], m4fBoneMatrix, this._pBoneMatrixList[iBone]);

}

var nBoneInfluences=(pMeshContainer.nBoneInfluences) - 1;
var pBoneComb=pMeshContainer.pBoneCombinationBuf;
for (var iAttrib=0; iAttrib < (pMeshContainer.nAttributeGroups); iAttrib++) {
var iMaterial=pBoneComb[iAttrib].id;
var pMethod=pMeshContainer.ppRenderMethodList[iMaterial];
if (pMethod) {
var pEffect=pMethod.getEffect(this._pEngine.getCurrentRenderStage());
var pMaterial=pMethod.getMaterial(this._pEngine.getCurrentRenderStage());
if (pEffect && pMaterial) {
var nPasses=pEffect.totalPasses();
for (var iPass=0; iPass < nPasses; iPass++) {
var pRenderEntry=pDisplayManager.openRenderQueue();
pRenderEntry.hEffectFile = pEffect.resourceHandle();
pRenderEntry.boneCount = nBoneInfluences;
pRenderEntry.detailLevel = this._iLod;
pRenderEntry.hSurfaceMaterial = pMaterial.resourceHandle();
pRenderEntry.modelType = 1;
pRenderEntry.hModel = this._pModelResource.resourceHandle();
pRenderEntry.modelParamA = this._iModelFrameIndex;
pRenderEntry.modelParamB = iAttrib;
pRenderEntry.renderPass = iPass;
pRenderEntry.object = this;
pRenderEntry.userData = iMaterial;
pDisplayManager.closeRenderQueue(pRenderEntry);

}


}


}


}


}
else  {
for (var iMaterial=0; iMaterial < (pMeshContainer.nMaterials); iMaterial++) {
var pMethod=pMeshContainer.ppRenderMethodList[iMaterial];
if (pMethod) {
var pEffect=pMethod.getEffect(this._pEngine.getCurrentRenderStage());
var pMaterial=pMethod.getMaterial(this._pEngine.getCurrentRenderStage());
if (pEffect && pMaterial) {
var nPasses=pEffect.totalPasses();
for (var iPass=0; iPass < nPasses; iPass++) {
var pRenderEntry=pDisplayManager.openRenderQueue();
pRenderEntry.hEffectFile = pEffect.resourceHandle();
pRenderEntry.hSurfaceMaterial = pMaterial.resourceHandle();
pRenderEntry.detailLevel = this._iLod;
pRenderEntry.modelType = 1;
pRenderEntry.hModel = this._pModelResource.resourceHandle();
pRenderEntry.modelParamA = this._iModelFrameIndex;
pRenderEntry.modelParamB = iMaterial;
pRenderEntry.renderPass = iPass;
pRenderEntry.pSceneNode = this;
pRenderEntry.userData = iMaterial;
pDisplayManager.closeRenderQueue(pRenderEntry);

}


}


}


}


}


}


};
SceneModel.prototype.renderCallback = function(pEntry, iActivationFlags) {
var pMeshContainer=this.meshContainer();
var hasSkinModel=(pMeshContainer.pSkinInfo) != null;
var iMaterial=pEntry.userData;
var pMethod=pMeshContainer.ppRenderMethodList[iMaterial];
var pEffect=pMethod.getEffect(this._pEngine.getCurrentRenderStage());
var pMaterial=pMethod.getMaterial(this._pEngine.getCurrentRenderStage());
var bDeactivatePass=false;
if (pEffect && pMaterial) {
if ((((iActivationFlags & (1 << 1)) != 0) || ((iActivationFlags & (1 << 2)) != 0)) || ((iActivationFlags & (1 << 3)) != 0)) {
this._pModelResource.setLOD(this._iLod);
if (hasSkinModel) {
nBoneInfluences = (pMeshContainer.nBoneInfluences) - 1;
pEffect.setParameter(a.EffectResource.boneInfluenceCount, nBoneInfluences);

}

pEffect.activatePass(pEntry.renderPass);
bDeactivatePass = true;

}

if ((iActivationFlags & (1 << 0)) != 0) {
pEffect.begin();

}

if ((iActivationFlags & (1 << 7)) != 0) {
pEffect.applySurfaceMaterial(pMaterial);

}

if (hasSkinModel) {
var pBoneComb=pMeshContainer.pBoneCombinationBuf;
var iAttrib=pEntry.modelParamB;
var iMaterial=pEntry.userData;
var iMatrixIndex;
var iPaletteEntry;
for (iPaletteEntry = 0; iPaletteEntry < (pMeshContainer.NumBoneMatrices); ++iPaletteEntry) {
iMatrixIndex = pBoneComb[iAttrib].BoneId[iPaletteEntry];
if (iMatrixIndex != 4294967295) {
pEffect.setMatrixInArray(a.EffectResource.worldMatrixArray, iPaletteEntry, this._boneMatrixList[iMatrixIndex]);

}


}

var nBoneInfluences=(pMeshContainer.nBoneInfluences) - 1;
pEffect.setParameter(a.EffectResource.boneInfluenceCount, nBoneInfluences);

}
else  {
var pCamera=this._pEngine.getActiveCamera();
var m3fWorldViewProj=this._m3fWorldViewProj;
Mat4.mult(pCamera.viewProjMatrix(), this.worldMatrix(), m3fWorldViewProj);
pEffect.setMatrix(a.EffectResource.worldViewProjMatrix, m3fWorldViewProj);
pEffect.applyCameraMatrices(pCamera);

}

pEffect.setMatrix(a.EffectResource.worldMatrix, this.worldMatrix());
pEffect.setMatrix(a.EffectResource.normalMatrix, this.normalMatrix());
var pMesh=pMeshContainer.pMeshData.pMesh;
pEffect.applyVertexBuffer(pMesh.getVertexBuffer());
pMesh.getIndexBuffer().activate();
if (bDeactivatePass) {
pEffect.deactivatePass();

}

this._pModelResource.renderModelSubset(pEntry.modelParamA, pEntry.modelParamB);

}


};
SceneModel.prototype.setModelResource = function(pModel, iFrameIndex) {
if (this._pModelResource) {
var safe_release_refcount=this._pModelResource.release();
if (safe_release_refcount != 0) {
if (!0) {
var err=((((((("Error:: " + (("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n")) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error((("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n"));

}


}

;

}

this._pModelResource = 0;

}

;
 {
if (this._pBoneMatrixList) {
for (var _s=0; _s < (this._pBoneMatrixList.length); ++_s) {
 {
if (this._pBoneMatrixList[_s]) {
if (this._pBoneMatrixList[_s].destructor) {
this._pBoneMatrixList[_s].destructor();

}

delete this._pBoneMatrixList[_s];
this._pBoneMatrixList[_s] = null;

}


};

}

delete this._pBoneMatrixList;
this._pBoneMatrixList = null;

}


};
iFrameIndex = iFrameIndex || 0;
this._nTotalBoneMatrices = 0;
this._iModelFrameIndex = iFrameIndex;
this._pModelResource = pModel;
if (this._pModelResource) {
this._pModelResource.addRef();
var pContainer=this.meshContainer();
if (pContainer && (pContainer.pSkinInfo)) {
this._nTotalBoneMatrices = pContainer.pSkinInfo.getNumBones();
this._pBoneMatrixList = GEN_ARRAY(Matrix4, this._nTotalBoneMatrices);

}

this.accessLocalBounds().eq(pModel.boundingBox());

}


};
SceneModel.prototype.meshContainer = function() {
;
if (this._pModelResource) {
return this._pModelResource.frame(this._iModelFrameIndex).pMeshContainer;

}
else  {
return null;

}


};
a.SceneModel = SceneModel;
function Engine() {
this._isWindowed = true;
this._isActive = false;
this._isDeviceLost = false;
this._isObjectsInited = false;
this._isObjectsRestored = false;
this._isFrameMoving = true;
this._isSingleStep = false;
this.fTime = 0;
this.fElapsedTime = 0;
this.fFPS = 0;
this.fUpdateTimeCount = 0;
this.sWindowTitle = "Akra Engine";
this.sDeviceStats = "";
this.sFrameStats = "";
this.pFont = null;
this._isShowStats = false;
this.pKeymap = null;
this.pCanvas = null;
this.pDevice = null;
this.pResourceManager = null;
this.pDisplayManager = null;
this.pShaderManager = null;
this.pUniqManager = null;
this._pRootNode = null;
this._pDefaultCamera = null;
this._pActiveCamera = null;
this._pSceneTree = null;
this._pWorldExtents = null;
this._isFrameReady = false;
this._iActiveRenderStage = 0;
this._isShowCursorWhenFullscreen = false;
this._isStartFullscreen = false;
this.pause(true);
this.iCreationWidth = 0;
this.iCreationHeight = 0;

}

Engine.prototype.create = function(sCanvasId) {
this.pKeymap = new a.Keymap(window);
this.pCanvas = document.getElementById(sCanvasId);
this._pRootNode = new a.SceneNode(this);
this._pDefaultCamera = new a.Camera(this);
this._pActiveCamera = this._pDefaultCamera;
this._pSceneTree = new a.OcTree();
this.iCreationWidth = this.pCanvas.width;
this.iCreationHeight = this.pCanvas.height;
this.pDevice = a.createDevice(this.pCanvas);
if (!(this.pDevice)) {
if (!0) {
var err=((((((("Error:: " + "Объект устроства не создан, создание завершилось") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Объект устроства не создан, создание завершилось");

}


}

;
a.deleteDevice(this.pDevice);
return false;

}

this.pResourceManager = new a.ResourcePoolManager();
this.pDisplayManager = new a.DisplayManager(this);
this.pShaderManager = new a.ShaderManager(this);
this.pUniqManager = new a.UniqueManager(this);
a.UtilTimer(1);
if (!(this.oneTimeSceneInit())) {
if (!0) {
var err=((((((("Error:: " + "Engine.oneTimeSceneInit") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Engine.oneTimeSceneInit");

}


}

;
a.deleteDevice(this.pDevice);
return false;

}

var me=this;
this.pResourceManager.setLoadedAllRoutine(function() {
if (!(me.initialize3DEnvironment())) {
if (!0) {
var err=((((((("Error:: " + "Engine.Initialize3DEnvironment") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Engine.Initialize3DEnvironment");

}


}

;
a.deleteDevice(me.pDevice);
return false;

}

me.pause(false);

}
);
return true;

};
Engine.prototype.pause = function(isPause) {
this.pause.iAppPausedCount += (isPause? +1 : -1);
this._isActive = (this.pause.iAppPausedCount? false : true);
if (isPause && (1 == (this.pause.iAppPausedCount))) {
if (this._isFrameMoving) {
a.UtilTimer(2);

}


}

if (0 == (this.pause.iAppPausedCount)) {
if (this._isFrameMoving) {
a.UtilTimer(1);

}


}


};
Engine.prototype.pause.iAppPausedCount = 0;
Engine.prototype.notifyOneTimeSceneInit = function() {
if (this.pDisplayManager.initialize()) {
return true;

}

if (this.pShaderManager.initialize()) {
return true;

}

return false;

};
Engine.prototype.showStats = function(isShow) {
if ((isShow == true) && ((this._isShowStats) == false)) {
this.pFont = new a.Font2D(22, "00FF00", "Arial", true);
this.sFrameStats = this.pDisplayManager.draw2DText(2, 0, this.pFont, "");
this.sDeviceStats = this.pDisplayManager.draw2DText(2, 20, this.pFont, "");
this._isShowStats = true;

}
else if ((isShow == false) && ((this._isShowStats) == true)) {
this.sDeviceStats.clear();
this.sFrameStats.clear();
this.sDeviceStats = null;
this.sFrameStats = null;
this.pFont = null;
this._isShowStats = false;

}



};
Engine.prototype.notifyRestoreDeviceObjects = function() {
this.pDisplayManager.restoreDeviceResources();
this.pShaderManager.restoreDeviceResources();
return true;

};
Engine.prototype.setupWorldOcTree = function(pWorldExtents) {
this._pWorldExtents = pWorldExtents;
this._pSceneTree.create(this._pWorldExtents, 10);

};
Engine.prototype.notifyDeleteDeviceObjects = function() {
this.pDisplayManager.destroyDeviceResources();
this.pShaderManager.destroyDeviceResources();
this._pDefaultCamera.destroy();
this._pRootNode.destroy();
return true;

};
Engine.prototype.notifyUpdateScene = function() {
this._pRootNode.recursiveUpdate();
this._isFrameReady = true;
return true;

};
Engine.prototype.getRootNode = function() {
return this._pRootNode;

};
Engine.prototype.getSceneTree = function() {
return this._pSceneTree;

};
Engine.prototype.getDefaultCamera = function() {
return this._pDefaultCamera;

};
Engine.prototype.getActiveCamera = function() {
return this._pActiveCamera;

};
Engine.prototype.displayManager = function() {
return this.pDisplayManager;

};
Engine.prototype.uniqManager = function() {
return this.pUniqManager;

};
Engine.prototype.shaderManager = function() {
return this.pShaderManager;

};
Engine.prototype.notifyInitDeviceObjects = function() {
this.pDisplayManager.createDeviceResources();
this.pShaderManager.createDeviceResources();
this._pRootNode.create();
this._pDefaultCamera.create();
this._pDefaultCamera.attachToParent(this._pRootNode);
this._pDefaultCamera.setPosition(Vec3.create(0, 0, 0));
this._pDefaultCamera.setProjParams((Math.PI) / 3, (this.pCanvas.width) / (this.pCanvas.height), 0.1, 3000);
return true;

};
Engine.prototype.renderScene = function() {
var pFirstMember=this._pSceneTree.buildSearchResults(this.getActiveCamera().searchRect(), this.getActiveCamera().frustum());
var pRenderList=pFirstMember;
while (pFirstMember) {
pFirstMember.prepareForRender();
pFirstMember = pFirstMember.nextSearchLink();

}
pFirstMember = pRenderList;
while (pFirstMember) {
pFirstMember.render();
pFirstMember = pFirstMember.nextSearchLink();

}
if (this.littleRender) {
this.littleRender();

}

return true;

};
Engine.prototype.run = function() {
var me=this;
var fnRender=function() {
window.requestAnimationFrame(fnRender, me.pCanvas);
if (me._isDeviceLost) {
if (!0) {
var err=((((((("Error:: " + "Девайс потерян") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Девайс потерян");

}


}

;

}

if (me._isActive) {
if (!(me.render3DEnvironment())) {
if (!0) {
var err=((((((("Error:: " + "a.render3DEnvironmen error") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("a.render3DEnvironmen error");

}


}

;

}


}


};
fnRender();
return true;

};
Engine.prototype.setActiveCamera = function(pCamera) {
this._pActiveCamera = pCamera;
if (!(this._pActiveCamera)) {
this._pActiveCamera = this._pDefaultCamera;

}


};
Engine.prototype.confirmDevice = function(pCaps, iBehavior, pDisplay, pBackBuffer) {
if ((a.pSystemInfo.getShaderVersion()) >= 1) {
return true;

}

return false;

};
Engine.prototype.initialize3DEnvironment = function() {
if (!(this.initDeviceObjects())) {
this.deleteDeviceObjects();

}
else  {
this._isDeviceObjectsInited = true;
if (!(this.restoreDeviceObjects())) {
this.invalidateDeviceObjects();

}
else  {
this._isDeviceObjectsRestored = true;
return true;

}


}

this.cleanup3DEnvironment();
return false;

};
Engine.prototype.invalidateDeviceObjects = function() {
this.pDisplayManager.disableDeviceResources();
this.pShaderManager.disableDeviceResources();
return true;

};
Engine.prototype.cleanup3DEnvironment = function() {
if (this.pDevice) {
if (this.pDevice._isDeviceObjectsRestored) {
this.pDevice._isDeviceObjectsRestored = false;
this.pDevice.invalidateDeviceObjects();

}

if (this.pDevice._isDeviceObjectsInited) {
this.pDevice._isDeviceObjectsInited = false;
this.pDevice.deleteDeviceObjects();

}


}


};
Engine.prototype.render3DEnvironment = function() {
if (this._isDeviceLost) {
if (!0) {
var err=((((((("Error:: " + "Девайс потерян") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("Девайс потерян");

}


}

;

}

var fAppTime=a.UtilTimer(5);
var fElapsedAppTime=a.UtilTimer(6);
if ((0 == fElapsedAppTime) && (this._isFrameMoving)) {
return true;

}

if ((this._isFrameMoving) || (this._isSingleStep)) {
this.fTime = fAppTime;
this.fElapsedTime = fElapsedAppTime;
if (!(this.frameMove())) {
return false;

}

this._isSingleStep = false;

}

if (!(this.render())) {
return false;

}

if (this._isShowStats) {
this.updateStats();

}

this.pKeymap.mouseSnapshot();
this._isDeviceLost = false;
return true;

};
Engine.prototype.frameMove = function() {
this.fUpdateTimeCount += this.fElapsedTime;
while ((this.fUpdateTimeCount) > (0.0333)) {
if (!(this.updateScene())) {
return false;

}

this.fUpdateTimeCount -= 0.0333;

}
return true;

};
Engine.prototype.render = function() {
if (!(this._isFrameReady)) {
return true;

}

if (this.pDisplayManager.beginRenderSession()) {
this.renderScene();
this.pDisplayManager.processRenderQueue();
this.pDisplayManager.endRenderSession();

}

return true;

};
Engine.prototype.beginRenderStage = function(iStage) {
if (!(iStage < (a.RenderMethod.max_render_stages))) {
var err=((((((("Error:: " + "invalid render stage") + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";
if (confirm(err + "Accept to exit, refuse to continue.")) {
throw new Error("invalid render stage");

}


}

;
this._iActiveRenderStage = iStage;
if ((this._iActiveRenderStage) === (a.RenderMethod.bumpMapStage)) {
this.pDevice.colorMask(false, false, false, true);

}
else if ((this._iActiveRenderStage) === (a.RenderMethod.lightingStage)) {
this.pDevice.colorMask(true, true, true, false);

}


this._pActiveCamera.applyRenderStageBias(iStage);

};
Engine.prototype.endRenderStage = function() {
if ((this._iActiveRenderStage) == (a.RenderMethod.bumpMapStage)) {
this.pDevice.colorMask(true, true, true, true);

}

this._iActiveRenderStage = 0;

};
Engine.prototype.updateStats = function() {
var fTime=a.UtilTimer(4);
this.updateStats.iFrames++;
if ((fTime - (this.updateStats.fLastTime)) > 1) {
this.fFPS = (this.updateStats.iFrames) / (fTime - (this.updateStats.fLastTime));
this.updateStats.fLastTime = fTime;
this.updateStats.iFrames = 0;
var sMultiSample="Multisamples " + (a.info.graphics.multisampleType(this.pDevice));
this.sFrameStats.edit(((("" + (this.fFPS.toFixed(1))) + " fps (") + sMultiSample) + ")");

}


};
Engine.prototype.updateStats.fLastTime = 0;
Engine.prototype.updateStats.iFrames = 0;
Engine.prototype.getWorldExtents = function() {
return this._pWorldExtents;

};
Engine.prototype.getDevice = function() {
return this.pDevice;

};
Engine.prototype.getWindowTitle = function() {
return this.sWindowTitle;

};
Engine.prototype.getCurrentRenderStage = function() {
return this._iActiveRenderStage;

};
Engine.prototype.finalCleanup = function() {
this.pDisplayManager.destroy();
this.pShaderManager.destroy();
this._pSceneTree.destroy();
return true;

};
Engine.prototype.updateCamera = function(fLateralSpeed, fRotationSpeed, pTerrain, fGroundOffset, isForceUpdate) {
var v3fCameraUp=this._pDefaultCamera.getUp();
if (this.pKeymap.isKeyPress(39)) {
this._pDefaultCamera.addRelRotation(0, 0, -fRotationSpeed);

}
else if (this.pKeymap.isKeyPress(37)) {
this._pDefaultCamera.addRelRotation(0, 0, fRotationSpeed);

}


if (this.pKeymap.isKeyPress(38)) {
this._pDefaultCamera.addRelRotation(0, fRotationSpeed, 0);

}
else if (this.pKeymap.isKeyPress(40)) {
this._pDefaultCamera.addRelRotation(0, -fRotationSpeed, 0);

}


var v3fOffset=Vec3.create([0, 0, 0]);
var isCameraMoved=false;
if (this.pKeymap.isKeyPress(68)) {
v3fOffset[0] = fLateralSpeed;
isCameraMoved = true;

}
else if (this.pKeymap.isKeyPress(65)) {
v3fOffset[0] = -fLateralSpeed;
isCameraMoved = true;

}


if (this.pKeymap.isKeyPress(82)) {
v3fOffset[1] = fLateralSpeed;
isCameraMoved = true;

}
else if (this.pKeymap.isKeyPress(70)) {
v3fOffset[1] = -fLateralSpeed;
isCameraMoved = true;

}


if (this.pKeymap.isKeyPress(87)) {
v3fOffset[2] = -fLateralSpeed;
isCameraMoved = true;

}
else if (this.pKeymap.isKeyPress(83)) {
v3fOffset[2] = fLateralSpeed;
isCameraMoved = true;

}


if (isCameraMoved || isForceUpdate) {
if (pTerrain) {
var v3fCameraWorldPos=Vec3.create();
v3fCameraWorldPos[0] = this._pDefaultCamera.worldPosition()[0];
v3fCameraWorldPos[1] = this._pDefaultCamera.worldPosition()[1];
v3fCameraWorldPos[2] = this._pDefaultCamera.worldPosition()[2];
var fGroundLevel=pTerrain.calcWorldHeight(v3fCameraWorldPos[0], v3fCameraWorldPos[1]);
var fMinCameraZ=fGroundLevel + fGroundOffset;
if (fMinCameraZ > (v3fCameraWorldPos[2])) {
v3fOffset[1] = fMinCameraZ - (v3fCameraWorldPos[2]);

}


}

this._pDefaultCamera.addRelPosition(v3fOffset);

}


};
a.Engine = Engine;
window["a"] = window["AKRA"] = a;
