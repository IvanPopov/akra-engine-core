<div>
	<div style="border-bottom: 1px solid #CCC; padding-bottom: 5px;">
		<div class="row">
			<span>normal mult.:</span>
			<component type="Slider" name="nm" value="0" range="1000" />
		</div>
		<div class="row">
			<span>sun specular level:</span>
			<component type="Slider" name="spec" value="0" range="1000" />
		</div>
		<div class="row">
			<span>sun ambient level:</span>
			<component type="Slider" name="ambient" value="0" range="1000" />
		</div>
	</div>

	<div style="border-bottom: 1px solid #CCC; padding-bottom: 5px;  padding-top: 5px;">
		<div class="row">
			<span>cHeightFalloff:</span>
			<component type="Slider" name="cHeightFalloff" value="0.00000001" range="1000" />
		</div>
		<div class="row">
			<span>cGlobalDensity:</span>
			<component type="Slider" name="cGlobalDensity" value="0" range="1000" />
		</div>
	</div>

	<div class="row first">
		<span>time:</span>
		<component type="Slider" name="time" value="0" range="60.00" />
	</div>
	<div class="row">
		<span>horizon level:</span>
		<component type="Slider" name="_nHorinLevel" value="0" range="31" />
	</div>
	<div class="row">
		<span>inv wave length:</span>
		<component type="Vector" name="_v3fInvWavelength4" editable="true" />
	</div>
	<div class="row">
		<span>Rayleigh scattering constant:</span>
		<component type="Label" name="_fKr" editable />
	</div>
	<div class="row">
		<span>Mie scattering constant:</span>
		<component type="Label" name="_fKm" editable />
	</div>
	<div class="row">
		<span>Sun brightness constant:</span>
		<component type="Label" name="_fESun" editable />
	</div>
	<div class="row">
		<span>The Mie phase asymmetry factor:</span>
		<component type="Label" name="_fg" editable />
	</div>
	<div class="row">
		<span>Exposure constant:</span>
		<component type="Label" name="_fExposure" editable />
	</div>
	<div class="row">
		<span>Inner planetary radius:</span>
		<component type="Label" name="_fInnerRadius" editable />
	</div>
	<div class="row">
		<span>_fRayleighScaleDepth:</span>
		<component type="Label" name="_fRayleighScaleDepth" editable />
	</div>
	<div class="row">
		<span>_fMieScaleDepth:</span>
		<component type="Label" name="_fMieScaleDepth" editable />
	</div>
</div>