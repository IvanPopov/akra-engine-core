<component name="scene-node">
	<div class="node-type" style="margin-bottom: 5px; margin-top: -1px;">Scene node properties</div>
	<div class="row">
		<span>name:</span>
		<component type="Label" name="node-name" text="unknown" editable="true"/>;
	</div>
	<div class="row">
		<span>local position:</span>
		<component type="Vector" name="position" editable="true"/>;
	</div>
	<div class="row">
		<span>scale:</span>
		<component type="Vector" name="scale" editable="true"/>;
	</div>
	<div class="row">
		<span>rotation:</span>
		<component type="Vector" name="rotation" editable="true" postfix="&deg;" />;
	</div>
	<div class="row">
		<span>inheritance:</span>
		<component type="CheckboxList" name="inheritance" radio style="margin-bottom: -5px;">
			<component type="Checkbox" name="position" text="position" />
			<component type="Checkbox" name="rotscale" text="rotation/scale" />
			<component type="Checkbox" name="all" text=" all " />
		</component>
	</div>
	<div class="readonly">
		<div class="row">
			<span>world position:</span>
			<component type="Vector" name="worldPosition" />;
		</div>
	</div>
</component>

<component name="light-point">
	<div class="node-type">Light point properties</div>
	<div class="row">
		<component type="Panel" title="Light point" collapsible >
			<component type="light.Properties" name="light"/>
		</component>
	</div>
</component>

<component name="scene-model">
	<div class="node-type">Scene model properties</div>
	<div class="row">
		<component type="Panel" title="Mesh" collapsible >
			<component type="model.MeshProperties" name="mesh"/>
		</component>
	</div>
</component>


<component name="model-entry">
	<div class="node-type">Model entry properties</div>
	<div class="row">
		<component type="Panel" title="Resource" collapsible >
			<component type="resource.Properties" name="resource"/>
		</component>
	</div>
	<div class="row" style="padding-bottom: 5px;">
		<component type="Panel" title="Controller" collapsible >
			<component type="AnimationControllerProperties" name="controller"/>
		</component>
	</div>
</component>


<component name="animation-node">
	<div class="node-type">Animation node properties</div>
	<div class="row">
		<component type="Panel" title="Common" collapsible >
			<component type="animation.NodeProperties" name="animation-node-properties" />
		</component>
	</div>
	<div class="row animation-mask-properties-row" style="margin-bottom: 5px;">
		<component type="Panel" title="Mask" collapsible collapsed="true" >
			<component type="animation.MaskProperties" name="animation-mask-properties" />
		</component>
	</div>
</component>