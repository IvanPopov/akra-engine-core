#ifndef IDEPSMANAGER_TS
#define IDEPSMANAGER_TS

#include "IEventProvider.ts"

module akra {
    export enum EDependenceStatuses {
        NOT_LOADED,
        LOADING,
        CHECKING,
        UNPACKING,
        LOADED
    }

    export interface IDep {
        //system
        index?: int;
        deps?: IDependens;

        //additional
        status?: EDependenceStatuses;
        content?: any;

        //user
        path: string;
        name?: string;
        comment?: string;
        type?: string;
    }

	export interface IDependens {
        parent?: IDependens;
        depth?: uint;
        
        loaded?: uint;
        total?: uint;

        //user
        files?: IDep[];
        deps?: IDependens;
        root?: string;
    }

    export interface IDepsManager extends IEventProvider {
    	load(pDeps: IDependens, sRoot?: string): bool;
    }
}

#endif