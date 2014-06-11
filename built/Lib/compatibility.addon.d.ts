/// <reference path="akra.d.ts" />
declare module akra.addons.compatibility {
  function ignoreWebGLExtension(extension: string): void;
  /**
  * @param id View element with @id if compatibility tests failed.
  */
  function verify(id?: string): boolean;
  function log(): string;
}
