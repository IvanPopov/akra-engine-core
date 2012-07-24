Include('Uniq.js');
Include('SystemInfo.js');
Include('Libs.js');
Include('Ajax.js');
Include('DebugWindow.js');

Include('../resources/pool/ReferenceCounter.js')
Include('BufferMap.js');

Include('ObjModel.js');
//Include('collada/Collada.js');
Include('collada/Collada2.js');

Ifdef(__IDE)

Elseif()
Define(__IDE, true);
Endif();

Ifdef(__IDE)

Include('Parser.js');