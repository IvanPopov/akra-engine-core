<div>
	<component type="GraphConnectionArea" name="in" mode="in" connections-limit="1" layout="horizontal" />
	<div type="node">
		<div class="component-title">Animation Player</div>
		<div class="controls">
			<component type="Label" text="Title" name="name" editable />
			
			<div>
				<component type="CheckboxList" multiselect >
					<component type="Checkbox" text="Play" name="play" />
					<component type="Checkbox" text="Loop" name="loop" />
					<component type="Checkbox" text="Reverse" name="reverse" />
				</component>
			</div>
			
			<div>Speed: <component type="Label" text="1" name="speed" editable="true" style="width: 20px;"/>x</div>
			
			<component type="Slider" name="state" />
		</div>
	</div>
	<component type="GraphConnectionArea" name="out" mode="out" connections-limit="1" layout="horizontal" />
</div>