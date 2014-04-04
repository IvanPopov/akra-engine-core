/// <reference path="akra.d.ts" />
declare var AE_PROGRESS_CSS: any;
declare module akra.addons {
    class Progress {
        private element;
        private acquiring;
        private acquiringTip;
        private applying;
        private applyingTip;
        constructor(element?: HTMLElement, bRender?: boolean);
        public render(): void;
        public destroy(): void;
        public getListener(): (e: IDepEvent) => void;
        private setAcquiring(fValue);
        private setApplying(fValue);
        private setApplyingTip(sTip);
        private setAcquiringTip(sTip);
    }
}
