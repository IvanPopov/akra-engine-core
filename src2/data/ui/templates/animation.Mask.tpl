<div>
	<component type="GraphConnectionArea" name="in" mode="in" connections-limit="1" layout="horizontal" orientation="up"/>
	<div type="node">
		<div class="component-title">Mask</div>
		<div class="controls">
			<component type="Checkbox" name="enabled" img="{% filter data %}ui/img/switch16.png{% endfilter %}" />
		</div>
	</div>
	<component type="GraphConnectionArea" name="out" mode="out" layout="horizontal" orientation="down"/>
</div>