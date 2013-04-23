<div id="IDE">
	<table style="width: 100%">
		<tr>
			<td colspan="3">
				<div id="menu">
					<component type="Menu" text="Create">
						<component type="Menu" text="light point" >
							<component type="Button" text="Project light" name="create-projectlight"/>
							<component type="Button" text="Omni light" name="create-omnilight"/>
						</component>
						<component type="Button" text="camera" name="create-camera"/>
					</component>
					<component type="Menu" text="Load" >
						<component type="Button" text="Collada Model" name="load-collada" 
							onclick="akra.ide.cmd(akra.ECMD.LOAD_COLLADA)"/>
					</component>
				</div>
			</td>
		</tr>
		<tr>
			<td>
				<div id="tree-node">
					<component type="Panel" title="Inspector" collapsible >
						<component type="Inspector" name="Inspector" />
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
					<div class="title" style="margin-bottom: -1px;">Work area</div>
					<component type="Tabs" name="WorkTabs" />
				</div>
			</td>
			<td>
				<div id="preview-area">
					<component type="Panel" title="Preview" >
						<component type="ViewportProperties" name="Preview" />
					</component>
				</div>
			</td>
		</tr>
	</table>
</div>