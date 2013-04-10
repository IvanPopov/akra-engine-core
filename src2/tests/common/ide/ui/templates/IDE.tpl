<div id="IDE">
	<table style="width: 100%">
		<tr>
			<td>
				<div id="tree-node">
					<component type="Panel" title="Node properties" collapsible >
						<component type="SceneNodeProperties" name="NodeProperties" />
					</component>
				</div>
				<div id="tree">
					<component type="Panel" title="Scene tree" collapsible >
						<component type="SceneTree" name="SceneTree" />
					</component>
				</div>
			</td>
			<td style="width: 100%;">
				<div id="work-area">
					<div class="title">Work area</div>
				</div>
			</td>
			<td>
				<div id="preview-area">
					<div class="title">Preview</div>
					<div class="chose-resolution">
						<a id="fullscreen-btn" href="#fs">[FS]</a>
						<a href="javascript:akra.ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 800, 600);">[800x600]</a>
						<a href="javascript:akra.ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 640, 480);">[640x480]</a>
						<a href="javascript:akra.ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 320, 240);">[320x240]</a>
					</div>
				</div>
			</td>
		</tr>
	</table>
</div>