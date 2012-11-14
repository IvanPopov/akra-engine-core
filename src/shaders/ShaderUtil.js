/**
 * @file
 * @author sss
 * @email <sss@odserve.org>
 */
function RenderState(pEngine) {
    this._pEngine = pEngine;
    this._pDevice = pEngine.pDevice;
    this.pVertexBuffer = null;
    this.iVertexBufferState = -1;

    this.pIndexBuffer = null;
    this.iIndexBufferState = -1;

    this.iFrameBuffer = null;
    this.pFrameBuffer = null;
    this.pProgram = null;
    this.nAttrsUsed = 0;

    this.pTexture = null;
    this.iTextureSlot = -1;
    this.pTextureSlotStates = new Array(a.info.graphics.maxTextureImageUnits(this._pDevice));
    this.pTextureSlots = new Array(a.info.graphics.maxTextureImageUnits(this._pDevice));
    for (var i = 0; i < this.pTextureSlots.length; i++) {
        this.pTextureSlotStates[i] = false;
        this.pTextureSlots[i] = null;
    }
}
A_NAMESPACE(RenderState, fx);

function FrameBuffer(pEngine) {
    this._pEngine = pEngine;
    var pDevice = this._pDevice = pEngine.pDevice;
    this._pData = pDevice.createFramebuffer();
    this._pColorAttachments = new Array(a.MAX_COLOR_ATTACHMENT);
    this._eDepthAttachment = null;
    this._eStencilAttachment = null;
    this._iSystemId = a.sid();
}
FrameBuffer.prototype.toNumber = function () {
    return this._iSystemId;
};
FrameBuffer.prototype.bind = function () {
    this._pDevice.bindFramebuffer(this._pDevice.FRAMEBUFFER, this._pData);
};
FrameBuffer.prototype.release = function () {
    var i;
    var eTarget;
    var pDevice = this._pDevice;
    for (i = 0; i < this._pColorAttachments.length; i++) {
        eTarget = this._pColorAttachments[i];
        if (eTarget) {
            if (eTarget === pDevice.RENDERBUFFER) {
                pDevice.framebufferRenderbuffer(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0 + i, eTarget, null);
            }
            else {
                pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0 + i, eTarget, null, 0);
            }
        }
        this._pColorAttachments[i] = null;
    }
    eTarget = this._eDepthAttachment;
    if (eTarget) {
        if (eTarget === pDevice.RENDERBUFFER) {
            pDevice.framebufferRenderbuffer(pDevice.FRAMEBUFFER, pDevice.DEPTH_ATTACHMENT, eTarget, null);
        }
        else {
            pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.DEPTH_ATTACHMENT, eTarget, null, 0);
        }
    }
    this._eDepthAttachment = null;
    eTarget = this._eStencilAttachment;
    if (eTarget) {
        if (eTarget === pDevice.RENDERBUFFER) {
            pDevice.framebufferRenderbuffer(pDevice.FRAMEBUFFER, pDevice.STENCIL_ATTACHMENT, eTarget, null);
        }
        else {
            pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.STENCIL_ATTACHMENT, eTarget, null, 0);
        }
    }
    this._eStencilAttachment = null;
};
FrameBuffer.prototype.frameBufferTexture2D = function (eAttachment, eTexTarget, pTexture) {
    var pDevice = this._pDevice;
    if (eAttachment === pDevice.COLOR_ATTACHMENT0) {
        this._pColorAttachments[0] = eTexTarget;
        pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
                                     eTexTarget, pTexture, 0);
    }
    else if (eAttachment === pDevice.DEPTH_ATTACHMENT) {
        this._eDepthAttachment = eTexTarget;
        pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.DEPTH_ATTACHMENT,
                                     eTexTarget, pTexture, 0);
    }
    else if (eAttachment === pDevice.STENCIL_ATTACHMENT) {
        this._eStencilAttachment = eTexTarget;
        pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.STENCIL_ATTACHMENT,
                                     eTexTarget, pTexture, 0);
    }
    else {
        warning("Bad attachment for frame buffer");
        return false;
    }
    return true;
};
FrameBuffer.prototype.frameBufferRenderBuffer = function (eAttachment, eRenderBufferTarget, pRenderBuffer) {
    var pDevice = this._pDevice;
    if (eAttachment === pDevice.COLOR_ATTACHMENT0) {
        this._pColorAttachments[0] = eRenderBufferTarget;
        pDevice.framebufferRenderbuffer(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
                                        eRenderBufferTarget, pRenderBuffer);
    }
    else if (eAttachment === pDevice.DEPTH_ATTACHMENT) {
        this._eDepthAttachment = eRenderBufferTarget;
        pDevice.framebufferRenderbuffer(pDevice.FRAMEBUFFER, pDevice.DEPTH_ATTACHMENT,
                                        eRenderBufferTarget, pRenderBuffer);
    }
    else if (eAttachment === pDevice.STENCIL_ATTACHMENT) {
        this._eStencilAttachment = eRenderBufferTarget;
        pDevice.framebufferRenderbuffer(pDevice.FRAMEBUFFER, pDevice.STENCIL_ATTACHMENT,
                                        eRenderBufferTarget, pRenderBuffer);
    }
    else {
        warning("Bad attachment for frame buffer");
        return false;
    }
    return true;
};

A_NAMESPACE(FrameBuffer, fx);


function PreRenderState(pEngine) {
    this._pEngine = pEngine;
    this.pBlend = null;
    this.nShift = 0;
    this.pAttributeData = [
        [],
        [],
        [],
        [],
        []
    ];
    this.pRenderObject = null;
    this.pSurfaceMaterial = null;
    this.pSnapshot = null;

    this.pIndex = undefined;
    this.iLength = null;
    this.iOffset = null;
    this.eDrawPrimitive = null;

    this.pViewport = {};
}
PreRenderState.prototype.setViewport = function () {
    if (arguments.length === 1) {
        this.pViewport.x = arguments[0].x;
        this.pViewport.y = arguments[0].y;
        this.pViewport.width = arguments[0].width;
        this.pViewport.height = arguments[0].height;
    }
    else {
        this.pViewport.x = arguments[0];
        this.pViewport.y = arguments[1];
        this.pViewport.width = arguments[2];
        this.pViewport.height = arguments[3];
    }
};
PreRenderState.prototype.release = function () {
    var i;
    this.pBlend = null;
    this.nShift = 0;
    for (i = 0; i < this.pAttributeData.length; i++) {
        if (this.pAttributeData[i]) {
            this.pAttributeData[i].length = 0;
        }
    }
    this.pRenderObject = null;
    this.pSurfaceMaterial = null;
    this.pSnapshot = null;

    this.pIndex = undefined;
    this.iLength = null;
    this.iOffset = null;
    this.eDrawPrimitive = null;
};

A_NAMESPACE(PreRenderState, fx);
