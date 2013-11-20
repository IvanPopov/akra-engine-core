// AIDocument interface
// [write description here...]
/// <reference path="AIUnique.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIFrame.ts" />
var AEDocumentEntry;
(function (AEDocumentEntry) {
    AEDocumentEntry[AEDocumentEntry["k_Unknown"] = 0] = "k_Unknown";

    AEDocumentEntry[AEDocumentEntry["k_Instance"] = 1] = "k_Instance";
    AEDocumentEntry[AEDocumentEntry["k_Controller"] = 2] = "k_Controller";
    AEDocumentEntry[AEDocumentEntry["k_Animation"] = 3] = "k_Animation";
    AEDocumentEntry[AEDocumentEntry["k_AnimationBlend"] = 4] = "k_AnimationBlend";
    AEDocumentEntry[AEDocumentEntry["k_AnimationContainer"] = 5] = "k_AnimationContainer";
    AEDocumentEntry[AEDocumentEntry["k_SceneNode"] = 6] = "k_SceneNode";
})(AEDocumentEntry || (AEDocumentEntry = {}));

var AEDocumentFormat;
(function (AEDocumentFormat) {
    AEDocumentFormat[AEDocumentFormat["JSON"] = 0] = "JSON";
    AEDocumentFormat[AEDocumentFormat["BINARY_JSON"] = 1] = "BINARY_JSON";
})(AEDocumentFormat || (AEDocumentFormat = {}));
