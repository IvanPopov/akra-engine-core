/// <reference path="../idl/IUITabs.ts" />
/// <reference path="../idl/IUIPanel.ts" />

/// <reference path="Component.ts" />

module akra.ui {
	export class Tabs extends Component implements IUITabs {
		protected _pTabs: IUIPanel[] = [];
		protected _iActiveTab: int = -1;

		protected $bookmarks: JQuery;

		constructor(parent, options?, eType: EUIComponents = EUIComponents.TABS) {
			super(parent, options, eType, $("<div class=\"component-tabs\"><div class=\"bookmarks\"></div></div>"));

			this.$bookmarks = this.getElement().find(".bookmarks:first");
		}

		getActiveTab(): IUIPanel {
			return this._pTabs[this._iActiveTab] || null;
		}

		getLength(): int {
			return this._pTabs.length;
		}

		addChild(pEntity: IEntity): IEntity {
			logger.assert(isPanel(pEntity), "only panels can be added to Tabs");

			var pPanel: IUIPanel = <IUIPanel>pEntity;

			logger.assert(!pPanel.isCollapsible(), "panel cannot be collapsible!");

			this.createBookmarkFor(pPanel);

			// this.connect(pPanel, SIGNAL(titleUpdated), SLOT(_tabTitleUpdated));
			pPanel.titleUpdated.connect(this, this._tabTitleUpdated);

			pPanel.index = this._pTabs.length;

			this._pTabs.push(pPanel);


			if (this._pTabs.length > 1) {
				pPanel.hide();
			}
			else {
				this.select(0);
			}

			return super.addChild(pEntity);
		}

		tabIndex(pPanel: IUIPanel): uint {
			for (var i: int = 0; i < this._pTabs.length; ++i) {
				if (pPanel == this._pTabs[i]) {
					return i;
				}
			}

			return -1;
		}

		findTabByTitle(sName: string): int {
			for (var i = 0; i < this._pTabs.length; ++i) {
				if (this._pTabs[i].getTitle() === sName) {
					return i;
				}
			}

			return -1;
		}

		findTab(sName: string): int {
			for (var i = 0; i < this._pTabs.length; ++i) {
				if (this._pTabs[i].getName() === sName) {
					return i;
				}
			}

			return -1;
		}

		tab(iTab: int): IUIPanel {
			return this._pTabs[iTab];
		}

		select(panel): void {
			var n: uint = 0;

			if (isInt(panel)) {
				n = <uint>panel;
			}
			else {
				n = this.tabIndex(<IUIPanel>panel);
			}

			if (n == this._iActiveTab || n < 0 || n > this._pTabs.length) {
				return;
			}

			if (!isNull(this.getActiveTab())) {
				this.getActiveTab().hide();
				this.bookmarkFor(this.getActiveTab()).removeClass("active");
			}

			this.bookmarkFor(this._pTabs[n]).addClass("active");
			this._pTabs[n].show();
			this._pTabs[n].selected.emit();

			this._iActiveTab = n;
		}


		_tabTitleUpdated(pPanel: IUIPanel, sTitle: string): void {
			this.bookmarkFor(pPanel).html(sTitle);
		}

		protected  bookmarkFor(pPanel: IUIPanel): JQuery {
			return this.$bookmarks.find("#tab-" + pPanel.guid);
		}

		protected createBookmarkFor(pPanel: IUIPanel): void {
			var $bookmark: JQuery = $("<div class=\"bookmark\" id=\"tab-" + pPanel.guid + "\">" + pPanel.getTitle() + "</div>");
			this.$bookmarks.append($bookmark);

			var pTabs: Tabs = this;
			$bookmark.click((e: IUIEvent) => {
				pTabs.select(pPanel.index);
			});
		}
	}

	register("Tabs", Tabs);
}



