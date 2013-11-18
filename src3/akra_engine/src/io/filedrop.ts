#ifndef IOFILEDROP_TS
#define IOFILEDROP_TS



module akra {
	enum AEFileDataTypes {
		ARRAY_BUFFER,
		DATA_URL,
		TEXT
	}

	interface AIDropFunc {{
		(file: File, content: string, format: AEFileDataTypes, e: DragEvent): void;
		(file: File, content: Blob, format: AEFileDataTypes, e: DragEvent): void;
		(file: File, content: ArrayBuffer, format: AEFileDataTypes, e: DragEvent): void;
	}

	interface AIFileDropAreaOptions {{
		beforedrop?: Function;
		drop?: AIDropFunc;
		dragover?: Function;
		dragleave?: Function;
		dragenter?: Function;
		//cls?: string;
		format?: AEFileDataTypes;
		verify?: (file: File, e: DragEvent) => boolean;
	}
}

module akra.io {
	

	const FILE_DROP_OPTIONS = {
		//cls: "file-drag-over",
		format: AEFileDataTypes.TEXT
	};

	// function addClass(pElement: HTMLElement, sClass: string): void {
	// 	var pClasses: string[] = pElement.className.split(' ');
		
	// 	if (pClasses.indexOf(sClass) != -1) {
	// 		return;
	// 	}

	// 	pElement.className += " " + sClass;
	// }

	// function removeClass(pElement: HTMLElement, sClass: string): void {
	// 	var pClasses: string[] = pElement.className.split(' ');
	// 	var n: int = 0;

	// 	if ((n = pClasses.indexOf(sClass)) == -1) {
	// 		return;
	// 	}

	// 	pClasses.splice(n, 1);
	// 	pElement.className = pClasses.join(' ');
	// }

	function createFileDropArea(element: HTMLElement, options: AIFileDropAreaOptions): boolean;
	function createFileDropArea(element: HTMLElement, ondrop: AIDropFunc): boolean;
	
	function createFileDropArea(el, options): boolean {
		// console.log("create file drop area !!!", __CALLSTACK__);
		if (!info.api.file) {
			WARNING("File drop area has not been created, because File API unsupported.");
			return false;
		}

		var pElement: HTMLElement = el || document.body;
		var pOptions: AIFileDropAreaOptions = null;

		if (isFunction(arguments[1])) {
			pOptions = FILE_DROP_OPTIONS;
			pOptions.drop = arguments[1];
		}
		else {
			pOptions = arguments[1];

			for (var i in FILE_DROP_OPTIONS) {
				if (!isDef(pOptions[i])) {
					pOptions[i] = FILE_DROP_OPTIONS[i];
				}
			}
		}

		function dragenter(e: DragEvent) {
			e.stopPropagation();
			e.preventDefault();

			pOptions.dragenter && pOptions.dragenter(e);
		}

		function dragleave(e: DragEvent): void {
			e.stopPropagation();
			e.preventDefault();

			// pOptions.cls && removeClass(pElement, pOptions.cls);
			pOptions.dragleave && pOptions.dragleave(e);
		}

		function dragover(e: DragEvent): void {
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";

			// pOptions.cls && addClass(pElement, pOptions.cls);
			pOptions.dragover && pOptions.dragover(e);
		}

		function drop(e: DragEvent): void {
			e.stopPropagation();
			e.preventDefault();

			var files: FileList = e.dataTransfer.files;
			
			for (var i = 0, f; f = files[i]; i++) {
				if (isFunction(pOptions.verify) && !pOptions.verify(files[i], e)) {
					continue;
				}

				var reader = new FileReader();

				reader.onload = ((pFile: File) => {
					return (evt) => {
						// console.log("content loaded for", pFile.name);
					  	pOptions.drop && pOptions.drop(pFile, evt.target.result, pOptions.format, e);
					};
				})(f);

				switch (pOptions.format) {
					case AEFileDataTypes.TEXT: reader.readAsText(f); break;
					case AEFileDataTypes.ARRAY_BUFFER: reader.readAsArrayBuffer(f); break;
					case AEFileDataTypes.DATA_URL: reader.readAsDataURL(f); break;
				}
			}

			// pOptions.cls && removeClass(pElement, pOptions.cls);
		}

		pOptions.dragenter && pElement.addEventListener('dragenter', dragenter, false);
		pOptions.dragleave && pElement.addEventListener('dragleave', dragleave, false);
		
		pElement.addEventListener('dragover', dragover, false);
		pElement.addEventListener('drop', drop, false);

		(<any>pElement).removeFileDrop = (): void => {
			pElement.removeEventListener('dragenter', dragenter, false);
			pElement.removeEventListener('dragleave', dragleave, false);
			pElement.removeEventListener('dragover', dragover, false);
			pElement.removeEventListener('drop', drop, false);
		}

		return true;
	}

	/** inline */ function removeFileDropArea(element: HTMLElement): void {
		((<any>element).removeFileDrop && (<any>element).removeFileDrop());
	}
}

#endif