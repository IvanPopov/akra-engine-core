/// <reference path="../../../../build/akra.d.ts" />
var akra;
(function (akra) {
    (function (addons) {
        /// <reference path="../../idl/IFileDropArea.ts" />
        (function (filedrop) {
            /** @const */
            var FILE_DROP_OPTIONS = {
                //cls: "file-drag-over",
                format: 2 /* TEXT */
            };

            function addHandler(el, options) {
                if (!akra.info.api.getFile()) {
                    akra.logger.warn("File drop area has not been created, because File API unsupported.");
                    return false;
                }

                var pElement = el || document.body;
                var pOptions = null;

                if (akra.isFunction(arguments[1])) {
                    pOptions = FILE_DROP_OPTIONS;
                    pOptions.drop = arguments[1];
                } else {
                    pOptions = arguments[1];

                    for (var i in FILE_DROP_OPTIONS) {
                        if (!akra.isDef(pOptions[i])) {
                            pOptions[i] = FILE_DROP_OPTIONS[i];
                        }
                    }
                }

                function dragenter(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    pOptions.dragenter && pOptions.dragenter(e);
                }

                function dragleave(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    // pOptions.cls && removeClass(pElement, pOptions.cls);
                    pOptions.dragleave && pOptions.dragleave(e);
                }

                function dragover(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";

                    // pOptions.cls && addClass(pElement, pOptions.cls);
                    pOptions.dragover && pOptions.dragover(e);
                }

                function drop(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var files = e.dataTransfer.files;

                    for (var i = 0, f; f = files[i]; i++) {
                        if (akra.isFunction(pOptions.verify) && !pOptions.verify(files[i], e)) {
                            continue;
                        }

                        var reader = new FileReader();

                        reader.onload = (function (pFile) {
                            return function (evt) {
                                // console.log("content loaded for", pFile.name);
                                pOptions.drop && pOptions.drop(pFile, evt.target.result, pOptions.format, e);
                            };
                        })(f);

                        switch (pOptions.format) {
                            case 2 /* TEXT */:
                                reader.readAsText(f);
                                break;
                            case 0 /* ARRAY_BUFFER */:
                                reader.readAsArrayBuffer(f);
                                break;
                            case 1 /* DATA_URL */:
                                reader.readAsDataURL(f);
                                break;
                        }
                    }
                    // pOptions.cls && removeClass(pElement, pOptions.cls);
                }

                pOptions.dragenter && pElement.addEventListener('dragenter', dragenter, false);
                pOptions.dragleave && pElement.addEventListener('dragleave', dragleave, false);

                pElement.addEventListener('dragover', dragover, false);
                pElement.addEventListener('drop', drop, false);

                pElement.removeFileDrop = function () {
                    pElement.removeEventListener('dragenter', dragenter, false);
                    pElement.removeEventListener('dragleave', dragleave, false);
                    pElement.removeEventListener('dragover', dragover, false);
                    pElement.removeEventListener('drop', drop, false);
                };

                return true;
            }
            filedrop.addHandler = addHandler;

            function removeHandler(element) {
                (element.removeFileDrop && element.removeFileDrop());
            }
            filedrop.removeHandler = removeHandler;
        })(addons.filedrop || (addons.filedrop = {}));
        var filedrop = addons.filedrop;
    })(akra.addons || (akra.addons = {}));
    var addons = akra.addons;
})(akra || (akra = {}));
//# sourceMappingURL=filedrop.js.map
