<div>
	<div class="row">
		<span>parent node: </span>
		<component type="Label" text="root" editable/>
	</div>
	<div>
		<component type="CheckboxList" multiselect="true">
			<component type="Checkbox" text="geometry" checked />
			<component type="Checkbox" text="animation" checked />
		</component>
	</div>
	<input type="text" name="url" value="../../../data/models/WoodSoldier/WoodSoldier.DAE" style="width: 100%;">
	<component type="Button" text="Load" name="load"/>
</div>