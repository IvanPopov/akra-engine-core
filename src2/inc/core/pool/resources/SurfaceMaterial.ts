#ifndef SURFACEMATERIAL_TS
#define SURFACEMATERIAL_TS

#include "ISurfaceMaterial.ts"
#include "../ResourcePoolItem.ts"
#include "material/Material.ts"

module akra.core.pool.resources {
	export class SurfaceMaterial extends ResourcePoolItem implements ISurfaceMaterial {
		protected _pMaterial: IMaterial = new Material;
		protected _nTotalTextures: uint = 0;
		protected _iTextureFlags: int = 0;
		protected _iTextureMatrixFlags: int = 0;
		protected _pTextures: ITexture[] = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
		protected _pTexcoords: uint[] = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
		protected _pTextureMatrices: IMat4[] = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);

		//For acceleration of composer
		protected _sLastHash: string = "";
		protected _isNeedToUpdateHash: bool = true;
		//For acceleration of PassInpuBlend.setSurfaceMaterial
		protected _fLastTimeChangeTexture: float = 0.;


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

    	createResource(): bool {
    		this.notifyLoaded();
    		return super.createResource();
    	}

    	setTexture(iIndex: int, iTextureHandle: int, iTexcoord: int = 0): bool;
    	setTexture(iIndex: int, sTexture: string, iTexcoord: int = 0): bool;
    	setTexture(iIndex: int, pTexture: ITexture, iTexcoord: int = 0): bool;
    	setTexture(iIndex: int, texture: any, iTexcoord: int = 0): bool {
    		//LOG(iIndex, pTexture, iTexcoord);
		    debug_assert(iIndex < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE,
		                 "invalid texture slot");

		    var pRmgr: IResourcePoolManager = this.getManager();
		    var pTexture: ITexture = null;

		    this._pTexcoords[iIndex] = iTexcoord;

		    if(iIndex !== iTexcoord) {
		    	this._isNeedToUpdateHash = true;
		    }

		    this._fLastTimeChangeTexture = pRmgr.getEngine().time;
		    
		    if (isString(texture)) {
		    	pTexture = this._pTextures[iIndex];

		        if (pTexture) {
		            //realise first
        
		            if (pTexture.release() == 0) {
		            	this._pTextures[iIndex] = null;
		            	//pTexture.destroyResource();
		            }
		            else {
		            	debug_warning("cannot destroy resource...")
		            }

		            CLEAR_BIT(this._iTextureFlags, iIndex);
		            -- this._nTotalTextures;
		        }


		        this._pTextures[iIndex] = <ITexture>pRmgr.texturePool.loadResource(<string>texture);

		        if (this._pTextures[iIndex]) {
		            TRUE_BIT(this._iTextureFlags, iIndex);
		            
		            ++ this._nTotalTextures;

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
		                	debug_warning("cannot destroy resource...");
		                }

		                CLEAR_BIT(this._iTextureFlags, iIndex);
		                -- this._nTotalTextures;
		            }

		            this._pTextures[iIndex] = pTexture;

		            this._pTextures[iIndex].addRef();
		            TRUE_BIT(this._iTextureFlags, iIndex);
		            ++this._nTotalTextures;
		            this.sync(this._pTextures[iIndex], EResourceItemEvents.LOADED);

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
		    else if (isNumber(texture)) {
		        if (!this._pTextures[iIndex] || this._pTextures[iIndex].resourceHandle != <int>texture) {
		            if (this._pTextures[iIndex]) {
		                //TheGameHost.displayManager().texturePool().releaseResource(m_pTextures[index]);
		                if (this._pTextures[iIndex].release() === 0) {
		                	// this._pTextures[iIndex].destroyResource();
		                	this._pTextures[iIndex] = null;
		                }
		                else {
		                	debug_warning("cannot destroy resource...");
		                }

		                CLEAR_BIT(this._iTextureFlags, iIndex);
		                -- this._nTotalTextures;
		            }

		            this._pTextures[iIndex] = <ITexture>pRmgr.texturePool.getResource(<int>texture);

		            if (this._pTextures[iIndex]) {
		                TRUE_BIT(this._iTextureFlags, iIndex);
		                ++ this._nTotalTextures;
		                this.sync(this._pTextures[iIndex], EResourceItemEvents.LOADED);
		            }
		        }

		        return true;
		    }

		    this._pTexcoords[iIndex] = iIndex;

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

		    TRUE_BIT(this._iTextureMatrixFlags, iIndex);
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
		            
		            for (var i = 0; i < this._pTextures.length; i++) {
		                if (this._pTextures[i] !== pSurfaceMaterial.texture[i]) {
		                    return false;
		                }
		            };

		            for (var i = 0; i< this._pTextureMatrices.length; ++ i) {
		                for (var j = 0; j < this._pTextureMatrices[i].data.length; j++) {
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
    		// debug_assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
      //            "invalid texture slot");
    		return this._pTextures[iSlot];
    	}

    	inline texcoord(iSlot: int): uint {
    		// debug_assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
      //            "invalid texture slot");
    		return this._pTexcoords[iSlot];
    	}
    	
    	inline textureMatrix(iSlot: int): IMat4 {
    		debug_assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
                 "invalid texture slot");
    		return this._pTextureMatrices[iSlot];
    	}

    	static MAX_TEXTURES_PER_SURFACE: uint = 16;

    	_getTimeOfLastChangeTextures(): float {
    		return this._fLastTimeChangeTexture;
    	}
    	
    	_getHash(): string {
    		if(this._isNeedToUpdateHash){
    			this._sLastHash = this.calcHash();
  				this._isNeedToUpdateHash = false;
    		}

    		return this._sLastHash;
    	}

    	private calcHash(): string {
    		// var iHash: uint = 0;
    		// for(var i: uint = 0; i < this._pTexcoords.length; i++){
    		// 	if(this._pTexcoords[i] !== i){
    		// 		iHash += (this._pTexcoords[i] + 1) << i;
    		// 	}
    		// }

    		// return iHash.toString();
    		var sHash: string = "";

    		for(var i = 0; i < this._pTexcoords.length; i++){
    			if(this._pTexcoords[i] !== i){
    				sHash += i.toString() + "<" + this._pTexcoords[i].toString() + ".";
    			}
    		}

	   		return sHash;
    	}
	}
}

#endif