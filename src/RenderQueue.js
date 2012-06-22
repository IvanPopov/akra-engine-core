/**
 * @file
 * @brief file contains renderQueue and renderEntry classes
 * @author reinor
 *
 * Details
 */

/**
 * these flags are passed to the render callbacks to let the
 * object know which of it's render components need to be activated
 */

Enum([
         activateRenderMethod = 0,
         activateRenderMethodPass,
         activateRenderMethodParam,
         activateRenderMethodLOD,
         activateModel,
         activateModelParamA,
         activateModelParamB,
         activateSurfaceMaterial,

         totalActivationFlags
     ], eActivationFlagBits, a.RenderQueue);

//-------------------Start RenderEntry---------------------\\

/**
 * RenderEntry class
 * @ctor
 */

function RenderEntry () {
    //fields for sorting render entry
    /*this.sortValueA = 0;
    this.sortValueB = 0;
    this.sortValueC = 0;*/

    //param A
    this.hEffectFile = 0;
    this.renderPass = 0;
    this.boneCount = 0;
    this.modelType = 0;
    this.detailLevel = 0;
    //param B
    this.hModel = 0;
    this.modelParamA = 0;
    //param C
    this.modelParamB = 0;
    this.hSurfaceMaterial = 0;


    /**
     * these enum values are used to set
     * the modelType value above. This
     * tells the queue if the model
     * data represents a model resource
     * or a set of vertex and index buffers
     */
    Enum([
             bufferEntry = 0,
             modelEntry
         ], eTypeFlags, a.RenderEntry);

    this.pSceneNode = null;
    this.userData = 0;

}

/**
 * The following members map to
 * sortValueA (first 32 bits)
 */
/*
Object.defineProperty(RenderEntry.prototype, "hEffectFile", {
    set: function (value) {
        this.sortValueA = (0x0000FFFF & this.sortValueA) | (value & 0xFFFF) << 16;
    },
    get: function () {
        return (this.sortValueA & 0xFFFF0000) >>> 16;
    }
});
Object.defineProperty(RenderEntry.prototype, "renderPass", {
    set: function (value) {
        this.sortValueA = (0xFFFF00FF & this.sortValueA) | (value & 0xFF) << 8;
    },
    get: function () {
        return (this.sortValueA & 0x0000FF00) >>> 8;
    }
});
Object.defineProperty(RenderEntry.prototype, "boneCount", {
    set: function (value) {
        this.sortValueA = (0xFFFFFF3F & this.sortValueA) | (value & 3) << 6;
    },
    get: function () {
        return (this.sortValueA & 0x000000C0) >>> 6;
    }
});
Object.defineProperty(RenderEntry.prototype, "modelType", {
    set: function (value) {
        this.sortValueA = (0xFFFFFFCF & this.sortValueA) | (value & 3) << 4;
    },
    get: function () {
        return (this.sortValueA & 0x00000030) >>> 4;
    }
});
Object.defineProperty(RenderEntry.prototype, "detailLevel", {
    set: function (value) {
        this.sortValueA = (0xFFFFFFF0 & this.sortValueA) | (value & 0xF);
    },
    get: function () {
        return (this.sortValueA & 0x0000000F);
    }
});
*/
/**
 * The following members map to sortValueB
 */
/*
Object.defineProperty(RenderEntry.prototype, "hModel", {
    set: function (value) {
        this.sortValueB = (0x0000FFFF & this.sortValueB) | (value & 0xFFFF) << 16;
    },
    get: function () {
        return (this.sortValueB & 0xFFFF0000) >>> 16;
    }
});
Object.defineProperty(RenderEntry.prototype, "modelParamA", {
    set: function (value) {
        this.sortValueB = (0xFFFF0000 & this.sortValueB) | (value & 0xFFFF);
    },
    get: function () {
        return (this.sortValueB & 0x0000FFFF);
    }
});
 */
/**
 * The following members map to sortValueC
 */
/*
Object.defineProperty(RenderEntry.prototype, "modelParamB", {
    set: function (value) {
        this.sortValueC = (0x0000FFFF & this.sortValueC) | (value & 0xFFFF) << 16;
    },
    get: function () {
        return (this.sortValueC & 0xFFFF0000) >>> 16;
    }
});
Object.defineProperty(RenderEntry.prototype, "hSurfaceMaterial", {
    set: function (value) {
        this.sortValueC = (0xFFFF0000 & this.sortValueC) | (value & 0xFFFF);
    },
    get: function () {
        return (this.sortValueC & 0x0000FFFF);
    }
});*/

RenderEntry.prototype.clear = function () {
    /*sortValueA = 0;
    sortValueB = 0;
    sortValueC = 0;*/

    //param A
    this.hEffectFile = 0;
    this.renderPass = 0;
    this.boneCount = 0;
    this.modelType = 0;
    this.detailLevel = 0;
    //param B
    this.hModel = 0;
    this.modelParamA = 0;
    //param C
    this.modelParamB = 0;
    this.hSurfaceMaterial = 0;
};

//-------------------End RenderEntry-----------------------\\

//-------------------Start RenderQueue---------------------\\
/**
 * The render queue is a collection of render entries which
 * are submitted by the program, then sorted for more
 * optimal rendering.
 */

/**
 * RenderQueue class
 * RenderQueue constructor
 * @ctor
 */
function RenderQueue (pEngine) {
    // 1k of render entries max (32k total mem)
    Enum([maxRenderEntries = 2048], eConstants, a.RenderQueue);//1024

    this._entryPool = GEN_ARRAY(a.RenderEntry, a.RenderQueue.maxRenderEntries);
    this._entryList = new Array(a.RenderEntry, a.RenderQueue.maxRenderEntries);
    this._activeEntries = 0;

    this._pEngine = pEngine;
}


/**
 * return first free entry if exist, otherwise execute rendering queue
 * and return free element
 * @treturn a.RenderEntry
 */
RenderQueue.prototype.lockRenderEntry = function () {
    if (this._activeEntryes + 1 == a.RenderQueue.maxRenderEntries) {

        /*
         * we are out of space.
         * execute (and reset)
         * the current queue
         */

        this.execute();
    }

    var pEntry = this._entryPool[this._activeEntries];
    pEntry.clear();
    return pEntry;
};

/**
 * unlock entry
 */
RenderQueue.prototype.unlockRenderEntry = function (pEntry) {
    this._entryList[this._activeEntries] = pEntry;
    ++this._activeEntries;
};
/*
function compare(a, b) {
    if (a.hEffectFile < b.hEffectFile) {
        return true;
    }
    else if (a.hEffectFile === b.hEffectFile) {
        if (a.renderPass < b.renderPass) {
            return true;
        }
        else if (a.renderPass === b.renderPass) {
            if (a.boneCount < b.boneCount) {
                return true;
            }
            else if (a.boneCount === b.boneCount) {
                if (a.modelType < b.modelType) {
                    return true;
                }
                else if (a.modelType === b.modelType) {
                    if (a.detailLevel < b.detailLevel) {
                        return true;
                    }
                    else if (a.detailLevel === b.detailLevel) {
                        //--
                        if (a.hModel < b.hModel) {
                            return true;
                        }
                        else if (a.hModel === b.hModel) {
                            if (a.modelParamA < b.modelParamA) {
                                return true;
                            }
                            else if (a.modelParamA === b.modelParamA) {
                                //----
                                if (a.modelParamB < b.modelParamB) {
                                    return true;
                                }
                                else if (a.modelParamB === b.modelParamB) {
                                    if (a.hSurfaceMaterial < b.hSurfaceMaterial) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                }
                                else {
                                    return false;
                                }
                                //----
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                        //--
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
*/

/**
 * @def
 * compare two render entries a and b
 */

Define (RenderEntry.compare(a, b), function () {
    (a.hEffectFile < b.hEffectFile ? !0 : a.hEffectFile === b.hEffectFile ? a.renderPass < b.renderPass ? !0
        : a.renderPass === b.renderPass ? a.boneCount < b.boneCount ? !0 : a.boneCount === b.boneCount ? a.modelType
        < b.modelType ? !0 : a.modelType === b.modelType ? a.detailLevel < b.detailLevel ? !0 : a.detailLevel
        === b.detailLevel ? a.hModel < b.hModel ? !0 : a.hModel === b.hModel ? a.modelParamA < b.modelParamA ? !0
        : a.modelParamA === b.modelParamA ? a.modelParamB < b.modelParamB ? !0 : a.modelParamB === b.modelParamB
        ? a.hSurfaceMaterial < b.hSurfaceMaterial ?
        !0 : !1 : !1 : !1 : !1 : !1 : !1 : !1 : !1 : !1)
});

/*
Define(RenderEntry.compare(a, b), function () {
    ((a.sortValueA >>> 0) < (b.sortValueA >>> 0) ?
        true :
        ((a.sortValueA >>> 0) === (b.sortValueA >>> 0) ?
            ((a.sortValueB >>> 0) < (b.sortValueB >>> 0) ?
                true :
                ((a.sortValueB >>> 0) === (b.sortValueB >>> 0) ?
                    ((a.sortValueC >>> 0) < (b.sortValueC >>> 0) ?
                        true :
                        false
                        ) : //so sad ...
                    false
                    )
                ) :
            false
            )
        )
});
*/

/**
 * @def
 * implement quick sorting list of entries
 */

Define(RenderQueue.quickSortEntryList(pArr, nMembers), function () {
    var h = 1;

    //find the largest h value possible 
    while ((h * 3 + 1) < nMembers) {
        h = 3 * h + 1;
    }


    //while h remains larger than 0 
    while (h > 0) {
        // for each set of elements (there are h sets)
        for (var i = h - 1; i < nMembers; i++) {
            //pick the last element in the set
            var B = pArr[i];
            var j = i;

            //compare the element at B to the one before it in the set
            //if they are out of order continue this loop, moving
            //elements "back" to make room for B to be inserted.

            for (j = i; (j >= h) && RenderEntry.compare(B, pArr[j - h]); j -= h) {
                pArr[j] = pArr[j - h];
            }

            //  insert B into the correct place
            pArr[j] = B;
        }

        //all sets h-sorted, now decrease set size
        h = (h / 3) << 0;
    }
});

/**
 * sorting list of render enties
 */
RenderQueue.prototype.sortEntryList = function () {
    INLINE();
    RenderQueue.quickSortEntryList(this._entryPool, this._activeEntries);
};

/*
 * reset of render queue
 */
RenderQueue.prototype.reset = function () {
    INLINE();
    this._activeEntries = 0;
};

/*
 * executing render queue
 */
RenderQueue.prototype.execute = function () {
    if (this._activeEntries) {

        var pLastMethod = null;

        var pDisplayManager = this._pEngine.pDisplayManager;

        // sort the entry list
        this.sortEntryList();

        // issue the callback to render
        // the first item in the queue with all
        // activation flags set

        var iActivationFlags = 0xFFFFFFFF;


        this._entryList[0].pSceneNode.
            renderCallback(this._entryList[0], iActivationFlags);

        // render any additional items,
        // sending only the flags for resources
        // which must be activated

        for (var i = 1; i < this._activeEntries; i++) {
            var currentEntry = this._entryList[i];
            var previousEntry = this._entryList[i - 1];

            iActivationFlags = 0;

            //
            // check for effect changes
            //

            if (previousEntry.hEffectFile !=
                currentEntry.hEffectFile) {

                // end the last render method
                pLastMethod = pDisplayManager.effectPool().getResource(previousEntry.hEffectFile);
                if (pLastMethod) {
                    pLastMethod.end();
                    safe_release(pLastMethod);
                }

                SET_BIT(iActivationFlags, a.RenderQueue.activateRenderMethod);
                SET_BIT(iActivationFlags, a.RenderQueue.activateRenderMethodPass);
                SET_BIT(iActivationFlags, a.RenderQueue.activateRenderMethodParam);
            }
            else if (previousEntry.renderPass !=
                currentEntry.renderPass) {

                SET_BIT(iActivationFlags,
                        a.RenderQueue.activateRenderMethodPass);
                SET_BIT(iActivationFlags,
                        a.RenderQueue.activateRenderMethodParam);
            }
            else {
                if (previousEntry.boneCount !=
                    currentEntry.boneCount) {
                    SET_BIT(iActivationFlags,
                            a.RenderQueue.activateRenderMethodParam);
                }

                if (previousEntry.detailLevel !=
                    currentEntry.detailLevel) {
                    SET_BIT(iActivationFlags,
                            a.RenderQueue.activateRenderMethodLOD);
                }

            }

            // check for model changes
            if (previousEntry.hModel != currentEntry.hModel
                || previousEntry.modelType !=
                currentEntry.modelType) {

                SET_BIT(iActivationFlags,
                        a.RenderQueue.activateModel);
                SET_BIT(iActivationFlags,
                        a.RenderQueue.activateModelParamA);
                SET_BIT(iActivationFlags,
                        a.RenderQueue.activateModelParamB);

            }
            else {
                if (previousEntry.modelParamA !=
                    currentEntry.modelParamA) {
                    SET_BIT(iActivationFlags,
                            a.RenderQueue.activateModelParamA);
                }

                if (previousEntry.modelParamB !=
                    currentEntry.modelParamB) {
                    SET_BIT(iActivationFlags,
                            a.RenderQueue.activateModelParamB);
                }

            }

            // Check for surface material changes

            if (previousEntry.hSurfaceMaterial !=
                currentEntry.hSurfaceMaterial) {
                SET_BIT(iActivationFlags,
                        a.RenderQueue.activateSurfaceMaterial);
            }

            // issue the callback to render

            currentEntry.pSceneNode.
                renderCallback(currentEntry, iActivationFlags);
        }

        // end the last render method

        var lastEntry = this._entryList[this._activeEntries - 1];

        pLastMethod = pDisplayManager.effectPool().
            getResource(lastEntry.hEffectFile);

        if (pLastMethod) {
            pLastMethod.end();
            pLastMethod = null;
        }
    }

    // reset for the next frame
    this.reset();
};

a.RenderEntry = RenderEntry;
a.RenderQueue = RenderQueue;