/// <reference path="../../Lib/akra.d.ts" />
declare var AE_NAVIGATION_DEPENDENCIES: {
    path: string;
    type: string;
};
declare module akra.addons {
    interface INavigationsParameters {
        path?: string;
        rotationPoint?: akra.IVec3;
    }
    function getNavigationDependences(sPath?: string): akra.IDependens;
    /**
    * @param pGeneralViewport Target viewport.
    * @param pParameters Parameters.
    * @param pCallback Loading callback.
    */
    function navigation(pGeneralViewport: akra.IViewport, pParameters?: INavigationsParameters, pCallback?: (e: Error) => void): void;
}
