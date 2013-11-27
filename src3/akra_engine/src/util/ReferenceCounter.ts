/// <reference path="../idl/AIReferenceCounter.ts" />

import limit = require("limit");
import logger = require("logger");

class ReferenceCounter implements AIReferenceCounter {
    private nReferenceCount: uint = 0;

    /** Выстанавливает чило ссылок  на объект в ноль */
    constructor();
    /** 
     * Выстанавливает чило ссылок  на объект в ноль
     * количесвто ссылок привязаны к конкретному экземпляру, поэтому никогда не копируются 
     */
    constructor(pSrc: AIReferenceCounter);
    constructor(pSrc?) { }

    referenceCount(): uint {
        return this.nReferenceCount;
    }

    destructor(): void {
        logger.assert(this.nReferenceCount === 0, "object is used");
    }

    release(): uint {
        logger.assert(this.nReferenceCount > 0, "object is used");
        this.nReferenceCount--;
        return this.nReferenceCount;
    }

    addRef(): uint {
        logger.assert(this.nReferenceCount != limit.MIN_INT32, "reference fail");

        this.nReferenceCount++;

        return this.nReferenceCount;
    }

    eq(pSrc: AIReferenceCounter): AIReferenceCounter {
        return this;
    }
}


export = ReferenceCounter;