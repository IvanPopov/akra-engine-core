#ifndef SURFACEMATERIAL_TS
#define SURFACEMATERIAL_TS

#include "ISurfaceMaterial.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class SurfaceMaterial extends ResourcePoolItem implements ISurfaceMaterial {
		protected _pMaterial: IMaterial = new Material;
		protected _nTotalTextures: uint = 0;
		protected _iTextureFlags: int = 0;
		protected _iTextureMatrixFlags: int = 0;
		protected _pTextures: ITexture[] = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
		protected _pTexcoords: uint[] = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
		protected _pTextureMatrices: uint[] = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);



		inline get totalTextures(): uint { return this._nTotalTextures; }
    	inline get material(): IMaterial { return this._pMaterial; }
    	inline set material(pMaterial: IMaterial) { this._pMaterial.set(pMaterial); }
    	inline get textureFlags(): int { return this._iTextureFlags; }
    	inline get textureMatrixFlags(): int { return this._iTextureMatrixFlags; }

    	constructor () {
    		super();

    		for (var i: int = 0; i < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE; ++ i) {
    			this._pTexcoords[i] = i;
    		}
    	}

    	setTexture(iIndex: int, sTexture: string, iTexcoord: int = 0): bool;
    	setTexture(iIndex: int, pTexture: ITexture, iTexcoord: int = 0): bool;
    	setTexture(iIndex: int, pTexture: any, iTexcoord: int = 0): bool {

		    debug_assert(iIndex < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE,
		                 "invalid texture slot");

		    var pRmgr: IResourcePoolManager = this.getManager();
		    var pTexture: ITexture;

		    this._pTexcoords[iIndex] = iTexcoord;
		    
		    if (isString(arguments[0])) {
		    	pTexture = this._pTextures[iIndex];

		        if (pTexture) {
		            //realise first
        
		            if (pTexture.release() == 0) {
		            	pTexture.destroyResource();
		            }
		            else {
		            	debug_warning("cannot destroy resource...")
		            }

		            CLEAR_BIT(this._iTextureFlags, iIndex);
		            -- this._nTotalTextures;
		        }


		        this._pTextures[iIndex] = pRmgr.texturePool.loadResource(<string>arguments[0]);

		        if (this._pTextures[iIndex]) {
		            TRUE_BIT(this._iTextureFlags, iIndex);
		            
		            ++ this._nTotalTextures;

		            this.connect(this._pTextures[iIndex], EResourceItemEvents.LOADED);
		        }

		        return true;
		    }
		    else if (arguments[0] instanceof Texture) {
		        if (!this._pTextures[iIndex] || pTexture != this._pTextures[iIndex]) {
		            if (this._pTextures[iIndex]) {
		                // realise first
						// DisplayManager.texturePool().releaseResource(this._pTextures[iIndex]);
		                
		                if (this._pTextures[iIndex].release() == 0) {
		                	this._pTextureMatrices[iIndex].destroyResource();
		                }
		                else {
		                	debug_warning("cannot destroy resource...");
		                }

		                CLEAR_BIT(this._iTextureFlags, iIndex);
		                -- this._nTotalTextures;
		            }

		            this._pTextures[iIndex] = pTexture;

		            this._pTextures[iIndex].addRef();
		            TRUE_BIT(this._iTextureFlags, iIndex);
		            ++this._nTotalTextures;
		            this.connect(this._pTextures[iIndex], EResourceItemEvents.LOADED);

		            // var me = this;
		            // trace('me get texture :)');
		            // pTexture.setChangesNotifyRoutine(function() {
		            //                 if (pTexture.isResourceLoaded()) {
		            //                     trace(arguments);
		            //                     trace('Texture <', pTexture.findResourceName(), '> loaded');
		            //                     if (me.isResourceLoaded()) {
		            //                         trace('Surface material loaded too.')
		            //                     }
		            //                 }
		            //             });
		        }

		        return true;
		    }
		    //similar to [cPoolHandle texture]
		    else if (isNumber(arguments[0])) {
		        if (!this._pTexture[iIndex] || this._pTexture[iIndex].resourceHandle() != pTexture) {
		            if (this._pTexture[iIndex]) {
		                //TheGameHost.displayManager().texturePool().releaseResource(m_pTexture[index]);
		                if (this._pTexture[iIndex].release() === 0) {
		                	this._pTexture[iIndex].destroyResource();
		                }
		                else {
		                	debug_warning("cannot destroy resource...");
		                }

		                CLEAR_BIT(this._iTextureFlags, iIndex);
		                -- this._nTotalTextures;
		            }

		            this._pTexture[iIndex] = pDisplayManager.texturePool.getResource(pTexture);

		            if (this._pTexture[iIndex]) {
		                TRUE_BIT(this._iTextureFlags, iIndex);
		                ++ this._nTotalTextures;
		                this.connect(this._pTexture[iIndex], EResourceItemEvents.LOADED);
		            }
		        }

		        return true;
		    }

		    this._pTexcoord[iIndex] = iIndex;

		    return false;
    	}

    	setTextureMatrix(iIndex: int, m4fValue: IMat4): bool {
    		debug_assert(iIndex < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE,
                 "invalid texture slot");

		    if (!m4fValue) {
		        this._pTextureMatrices[iIndex] = new Mat4();
		    }
		    else {
		        this._pTextureMatrices[iIndex] = new Mat4(m4fValue);
		    }

		    this._textureMatrixFlags.setBit(iIndex);
		    return true;
    	}
    	
    	inline setMaterial(pMaterial: IMaterial): void {
    		this._pMaterial.set(pMaterial);
    	}

    	isEqual(pSurfaceMaterial: ISurfaceMaterial): bool {
    		if (this._nTotalTextures === pSurfaceMaterial.totalTextures && 
		        this._iTextureFlags === pSurfaceMaterial.textureFlags && 
		        this._iTextureMatrixFlags === pSurfaceMaterial.textureMatrixFlags) {
		        
		        if ((this._pMaterial && this._pMaterial.isEqual(pSurfaceMaterial.material))
		            || (pSurfaceMaterial.material === null)) {
		            
		            for (var i = 0; i < this._pTexture.length; i++) {
		                if (this._pTexture[i] !== pSurfaceMaterial.texture[i]) {
		                    return false;
		                }
		            };

		            for (var i = 0; i< this._pTextureMatrices; ++ i) {
		                for (var j = 0; j < this._pTextureMatrices[i].length; j++) {
		                    if (this._pTextureMatrices[i].data[j] !== pSurfaceMaterial.textureMatrix[i].data[j]) {
		                        return false;
		                    }
		                };
		            }

		            return true;
		        }
		    }

		    return false;
    	}
    	
    	inline texture(iSlot: int): ITexture {
    		debug_assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
                 "invalid texture slot");
    		return this._pTextures[iSlot];
    	}

    	inline texcoord(iSlot: int): uint {
    		debug_assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
                 "invalid texture slot");
    		return this._pTexcoords[iSlot];
    	}
    	
    	inline textureMatrix(iSlot: int): IMat4 {
    		debug_assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
                 "invalid texture slot");
    		return this._pTextureMatrices[iSlot];
    	}

    	static MAX_TEXTURES_PER_SURFACE: uint = 16;
	}
}

#endif