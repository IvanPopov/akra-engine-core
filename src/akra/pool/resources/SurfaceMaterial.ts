/// <reference path="../../idl/ISurfaceMaterial.ts" />

/// <reference path="../ResourcePoolItem.ts" />
/// <reference path="../../material/Material.ts" />
/// <reference path="../../debug.ts" />
/// <reference path="Texture.ts" />

module akra.pool.resources {
	import Material = material.Material;
	import Mat4 = math.Mat4;

	export class SurfaceMaterial extends ResourcePoolItem implements ISurfaceMaterial {
		protected _pMaterial: IMaterial = new Material;
		protected _nTotalTextures: uint = 0;
		protected _iTextureFlags: int = 0;
		protected _iTextureMatrixFlags: int = 0;
		protected _pTextures: ITexture[] = new Array<ITexture>(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
		protected _pTexcoords: uint[] = new Array<uint>(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
		protected _pTextureMatrices: IMat4[] = new Array<IMat4>(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);

		//For acceleration of PassInpuBlend.setSurfaceMaterial and PassBlend.generateFXMaker
		protected _nTextureUpdates: uint = 0;
		protected _nTexcoordUpdates: uint = 0;

		
		notifyAltered(): void {
			super.notifyAltered();
			this._nTextureUpdates++;
			this._nTexcoordUpdates++;
		}

		getTotalUpdatesOfTextures(): uint {
			return this._nTextureUpdates;
		}

		getTotalUpdatesOfTexcoords(): uint {
			return this._nTexcoordUpdates;
		}

		getTotalTextures(): uint {
			return this._nTotalTextures;
		}

		getTextureFlags(): int {
			return this._iTextureFlags;
		}

		getTextureMatrixFlags(): int {
			return this._iTextureMatrixFlags;
		}

		getMaterial(): IMaterial {
			return this._pMaterial;
		}

		setMaterial(pMaterial: IMaterial): void {
			this._pMaterial = pMaterial;
		}

		constructor() {
			super();

			for (var i: int = 0; i < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE; ++i) {
				this._pTexcoords[i] = i;
			}
		}

		createResource(): boolean {
			this.notifyLoaded();
			this.notifyCreated();
			return true;
		}

		setTexture(iIndex: int, iTextureHandle: int, iTexcoord?: int): boolean;
		setTexture(iIndex: int, sTexture: string, iTexcoord?: int): boolean;
		setTexture(iIndex: int, pTexture: ITexture, iTexcoord?: int): boolean;
		setTexture(iIndex: int, texture: any, iTexcoord: int = 0): boolean {
			debug.assert(iIndex < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE,
				"invalid texture slot");

			var pRmgr: IResourcePoolManager = this.getManager();
			var pTexture: ITexture = null;

			this._pTexcoords[iIndex] = iTexcoord;

			if (iIndex !== iTexcoord) {
				this._nTexcoordUpdates = 0;
			}

			this._nTextureUpdates++;

			if (isString(texture)) {
				pTexture = this._pTextures[iIndex];

				if (pTexture) {
					//realise first

					if (pTexture.release() == 0) {
						this._pTextures[iIndex] = null;
						//pTexture.destroyResource();
					}
					else {
						debug.warn("cannot destroy resource...")
					}

					this._iTextureFlags = bf.clearBit(this._iTextureFlags, iIndex);
					this._nTotalTextures--;
				}


				this._pTextures[iIndex] = <ITexture>pRmgr.getTexturePool().loadResource(<string>texture);

				if (this._pTextures[iIndex]) {
					this._iTextureFlags = bf.setBit(this._iTextureFlags, iIndex);

					++this._nTotalTextures;

					this.sync(this._pTextures[iIndex], EResourceItemEvents.LOADED);
				}

				return true;
			}
			else if (texture instanceof Texture) {
				if (!this._pTextures[iIndex] || pTexture != this._pTextures[iIndex]) {
					pTexture = texture;
					if (this._pTextures[iIndex]) {
						// realise first
						// DisplayManager.texturePool().releaseResource(this._pTextures[iIndex]);

						if (this._pTextures[iIndex].release() == 0) {
							// this._pTextureMatrices[iIndex].destroyResource();
							this._pTextures[iIndex] = null;
						}
						else {
							debug.warn("cannot destroy resource...");
						}

						this._iTextureFlags = bf.clearBit(this._iTextureFlags, iIndex);
						--this._nTotalTextures;
					}

					this._pTextures[iIndex] = pTexture;

					this._pTextures[iIndex].addRef();
					this._iTextureFlags = bf.setBit(this._iTextureFlags, iIndex);

					this._nTotalTextures++;

					this.sync(this._pTextures[iIndex], EResourceItemEvents.LOADED);
				}

				return true;
			}
			//similar to [cPoolHandle texture]
			else if (isNumber(texture)) {
				if (!this._pTextures[iIndex] || this._pTextures[iIndex].getResourceHandle() != <int>texture) {
					if (this._pTextures[iIndex]) {
						//TheGameHost.displayManager().texturePool().releaseResource(m_pTextures[index]);
						if (this._pTextures[iIndex].release() === 0) {
							// this._pTextures[iIndex].destroyResource();
							this._pTextures[iIndex] = null;
						}
						else {
							debug.warn("cannot destroy resource...");
						}

						this._iTextureFlags = bf.clearBit(this._iTextureFlags, iIndex);
						--this._nTotalTextures;
					}

					this._pTextures[iIndex] = <ITexture>pRmgr.getTexturePool().getResource(<int>texture);

					if (this._pTextures[iIndex]) {
						this._iTextureFlags = bf.setBit(this._iTextureFlags, iIndex);
						++this._nTotalTextures;
						this.sync(this._pTextures[iIndex], EResourceItemEvents.LOADED);
					}
				}

				return true;
			}

			this._pTexcoords[iIndex] = iIndex;

			return false;
		}

		setTextureMatrix(iIndex: int, m4fValue: IMat4): boolean {
			debug.assert(iIndex < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE,
				"invalid texture slot");

			if (!m4fValue) {
				this._pTextureMatrices[iIndex] = new Mat4();
			}
			else {
				this._pTextureMatrices[iIndex] = new Mat4(m4fValue);
			}

			this._iTextureFlags = bf.setBit(this._iTextureMatrixFlags, iIndex);
			return true;
		}

		isEqual(pSurfaceMaterial: ISurfaceMaterial): boolean {
			if (this._nTotalTextures === pSurfaceMaterial.getTotalTextures() &&
				this._iTextureFlags === pSurfaceMaterial.getTextureFlags() &&
				this._iTextureMatrixFlags === pSurfaceMaterial.getTextureMatrixFlags()) {

				if ((this._pMaterial && this._pMaterial.isEqual(pSurfaceMaterial.getMaterial()))
					|| (pSurfaceMaterial.getMaterial() === null)) {

					for (var i = 0; i < this._pTextures.length; i++) {
						if (this._pTextures[i] !== pSurfaceMaterial.texture[i]) {
							return false;
						}
					};

					for (var i = 0; i < this._pTextureMatrices.length; ++i) {
						for (var j = 0; j < this._pTextureMatrices[i].data.length; j++) {
							if (this._pTextureMatrices[i].data[j] !== pSurfaceMaterial.textureMatrix[i].data[j]) {
								return false;
							}
						}
					}

					return true;
				}
			}

			return false;
		}

		texture(iSlot: int): ITexture {
			 debug.assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
			            "invalid texture slot");
			return this._pTextures[iSlot] || null;
		}

		texcoord(iSlot: int): uint {
			 debug.assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
			            "invalid texture slot");
			return this._pTexcoords[iSlot];
		}

		textureMatrix(iSlot: int): IMat4 {
			debug.assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
				"invalid texture slot");
			return this._pTextureMatrices[iSlot];
		}

		static MAX_TEXTURES_PER_SURFACE: uint = 16;
	}
}

