/// <reference path="../../../built/Lib/akra.d.ts" />

var akra;
(function (akra) {
    (function (_addons) {
        var addons = akra.config.addons;

        addons['progress'] = addons['progress'] || { "css": null };
        addons['progress']["css"] = addons['progress']["css"] || (akra.uri.currentPath() + "../../../src/akra-addons/addons/progress/full/progress.css");

        akra.debug.log("config['addons']['progress'] = ", JSON.stringify(addons['progress']));

        if (document.createStyleSheet) {
            document.createStyleSheet(addons['progress']["css"]);
        } else {
            var sStyles = "@import url(' " + addons['progress']["css"] + " ');";
            var pLink = document.createElement('link');

            pLink.rel = 'stylesheet';
            pLink.href = 'data:text/css,' + escape(sStyles);
            document.getElementsByTagName("head")[0].appendChild(pLink);
        }

        var code = true ? "<div class='ae-preloader'>" + "<div class='ae-title'>" + "LOADING" + "</div>" + "<div class='ae-circle'>" + "<div id='' class='circle_1 circle'></div>" + "<div id='' class='circle_2 circle'></div>" + "<div id='' class='circle_3 circle'></div>" + "<div id='' class='circle_4 circle'></div>" + "<div id='' class='circle_5 circle'></div>" + "<div id='' class='circle_6 circle'></div>" + "<div id='' class='circle_7 circle'></div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='ae-progress' style='margin-bottom: 20px;'>" + "<span class='ae-string'>Acquiring&nbsp;</span>" + "<span class='ae-string ae-tip'></span>" + "<div class='ae-bar'>" + "<div class='ae-complete'>" + "</div>" + "</div>" + "</div>" + "<div class='ae-progress' style='margin-bottom: 20px;'>" + "<span class='ae-string'>Applying&nbsp;</span>" + "<span class='ae-string ae-tip'></span>" + "<div class='ae-bar'>" + "<div class='ae-complete'>" + "</div>" + "</div>" + "</div>" + "</div>" : "<div class='ae-preloader'>" + "<div class='ae-progress'>" + "<div class='ae-bar'>" + "<div class='ae-complete'>" + "</div>" + "</div>" + "</div>" + "</div>";

        var Progress = (function () {
            function Progress(element, bRender) {
                if (typeof element === "undefined") { element = null; }
                if (typeof bRender === "undefined") { bRender = true; }
                this.element = element;
                if (bRender) {
                    this.render();
                }
            }
            Progress.prototype.render = function () {
                var el = akra.conv.parseHTML(code)[0];
                if (akra.isNull(this.element)) {
                    this.element = el;
                    document.body.appendChild(this.element);
                } else {
                    this.element.appendChild(el);
                }

                var pBars = document.getElementsByClassName('ae-complete');
                var pTips = document.getElementsByClassName('ae-tip');

                if (true) {
                    this.acquiring = pBars[0];
                    this.acquiringTip = pTips[0];

                    this.applying = pBars[1];
                    this.applyingTip = pTips[1];
                } else {
                    this.applying = pBars[0];
                }
            };

            Progress.prototype.destroy = function () {
                var _this = this;
                if (true) {
                    this.element.className += " bounceOutRight";
                    setTimeout(function () {
                        _this.element.parentNode.removeChild(_this.element);
                    }, 2000);
                } else {
                    this.element.parentNode.removeChild(this.element);
                }
            };

            Progress.prototype.getListener = function () {
                var _this = this;
                return function (e) {
                    if (true) {
                        _this.setAcquiring(e.bytesLoaded / e.bytesTotal);
                        _this.setAcquiringTip((e.bytesLoaded / 1000).toFixed(0) + ' / ' + (e.bytesTotal / 1000).toFixed(0) + ' kb');
                        _this.setApplyingTip(e.loaded + ' / ' + e.total);
                    }

                    _this.setApplying(e.unpacked);
                    // if (e.loaded === e.total) {
                    //this.destroy();
                    // }
                };
            };

            Progress.prototype.setAcquiring = function (fValue) {
                this.acquiring.style.width = (fValue * 100).toFixed(3) + '%';
            };

            Progress.prototype.setApplying = function (fValue) {
                this.applying.style.width = (fValue * 100).toFixed(3) + '%';
            };

            Progress.prototype.setApplyingTip = function (sTip) {
                this.applyingTip.innerHTML = sTip;
            };

            Progress.prototype.setAcquiringTip = function (sTip) {
                this.acquiringTip.innerHTML = sTip;
            };
            return Progress;
        })();
        _addons.Progress = Progress;
    })(akra.addons || (akra.addons = {}));
    var addons = akra.addons;
})(akra || (akra = {}));
