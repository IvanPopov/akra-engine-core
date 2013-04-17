<div>
	<component type="GraphConnectionArea" name="in" mode="in" connections-limit="1" layout="horizontal" orientation="up"/>
	<div type="node">
		<div class="component-title">
			Player
			<component type="Switch" name="enabled" />
		</div>
		<div class="controls">
			<component type="Label" text="Title" name="name" editable />
			
			<div>
				<component type="CheckboxList" multiselect >
					<component type="Checkbox" img="ui/img/infinity16.png" name="left-inf" />
					<component type="Checkbox" img="ui/img/play16.png" name="play" />
					<component type="Checkbox" img="ui/img/loop16.png" name="loop" />
					<component type="Checkbox" img="ui/img/back16.png" name="reverse" />
					<component type="Checkbox" img="ui/img/infinity16.png" name="right-inf" />
				</component>
			</div>
			
			<div>Speed: <component type="Label" text="1" name="speed" editable="true" style="width: 20px;" postfix="x"/></div>
			
			<component type="Slider" name="state" />
			<div class="time">0.0</div>
		</div>
	</div>
	<component type="GraphConnectionArea" name="out" mode="out" layout="horizontal" orientation="down"/>
</div>
