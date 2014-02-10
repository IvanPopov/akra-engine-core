/// <reference path="../akra.d.ts" />
declare module akra.addons {
    interface INavigationsParameters {
        path?: string;
        rotationPoint?: akra.IVec3;
    }
    /**
    * @param pGeneralViewport Target viewport.
    * @param pParameters Parameters.
    * @param pCallback Loading callback.
    */
    function navigation(pGeneralViewport: akra.IViewport, pParameters?: INavigationsParameters, pCallback?: (e: Error) => void): void;
}
