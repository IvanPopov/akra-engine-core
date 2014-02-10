/// <reference path="../idl/IRenderEntry.ts" />
/// <reference path="../idl/IShaderInput.ts" />
var akra;
(function (akra) {
    (function (render) {
        var RenderEntry = (function () {
            function RenderEntry() {
                //target of rendering
                this.viewport = null;
                this.renderTarget = null;
                //wraper for shader program
                this.maker = null;
                //complex info of native shader data
                // + buffers
                // + uniforms
                // + samplers
                this.input = null;
                //needed for call direct render with index
                this.bufferMap = null;
            }
            RenderEntry.prototype.clear = function () {
                this.maker._releaseShaderInput(this.input);
                this.viewport = null;
                this.renderTarget = null;
                this.bufferMap = null;
                this.input = null;
                this.maker = null;
            };
            return RenderEntry;
        })();
        render.RenderEntry = RenderEntry;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=RenderEntry.js.map
