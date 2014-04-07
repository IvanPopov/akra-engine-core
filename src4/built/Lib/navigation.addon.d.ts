/// <reference path="akra.d.ts" />
declare var AE_NAVIGATION_DEPENDENCIES: {
  path: string;
  type: string;
};
declare module akra.addons {
  interface INavigationsParameters {
    path?: string;
    rotationPoint?: IVec3;
  }
  function getNavigationDependences(sPath?: string): IDependens;
  /**
  * @param pGeneralViewport Target viewport.
  * @param pParameters Parameters.
  * @param pCallback Loading callback.
  */
  function navigation(pGeneralViewport: IViewport, pParameters?: INavigationsParameters, pCallback?: (e: Error) => void): void;
}
