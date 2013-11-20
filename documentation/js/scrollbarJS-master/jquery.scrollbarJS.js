/*
*
* scrollbarJS 1.0.0
* Copyright 2012, Egor Skorobogatov
* egor.skorobogatov@gmail.com
*
* Released under the MIT.
*
* Change of standart scrollbar in html elements in browser.
*
*/

(function ($) {
    var loc_document = $(document);

    $.scrollbar = function (data) {

        var def_opt = {
            // (scrolling button width) scrollbar width
            btnsWidth: 19,
            // (scrolling button height) scrollbar width
            btnsHeight: 16,
            // scrollbar bounds depth
            bordersWidth: 1
        };

        // Slider proportions according to the scrolled content setup
        function sizeSlider(scrollpane, scrollcontent, slider) {
            
            var scrollpane_h     = scrollpane.height(),
                scrollcontent_h  = scrollcontent.height()+30,
                scrollbar_wrap_h = scrollpane_h,
                diff1	         = scrollcontent_h - scrollpane_h,
                prop	         = diff1 / scrollcontent_h,
                scroll_area      = scrollbar_wrap_h - def_opt.btnsWidth * 2,
                stopScroll       = Math.floor(scroll_area * prop),
                size_slider      = scrollbar_wrap_h - def_opt.btnsWidth * 2 - stopScroll - def_opt.bordersWidth * 2,
                //multiple         = diff1 / (scrollbar_wrap_h - def_opt.btnsWidth * 2 - size_slider),
                multiple         = scrollcontent_h / scroll_area,
                percentContent   = diff1 / 100,
                percentSlider    = stopScroll / 100;

            /*if (slider !== undefined) {
                size_slider = height2;
                slider.height(height2);
            }*/

            return {
                // container height
                scrollpane_h:       scrollpane_h,
                // content height
                scrollcontent_h:    scrollcontent_h,
                // content stop coordinates
                scrollcontent_stop: scrollpane_h - scrollcontent_h,
                // scrollbar container height
                scrollbar_wrap_h:   scrollbar_wrap_h,
                // slider height
                size_slider:        size_slider,
                // content height growth while scrolling index
                multiple:           multiple,
                // when the coordinate limit is reached than stop the scrollbar
                stopScroll:         stopScroll,
                // the number of pixels in one percent of movement by the content
                percentContent:     percentContent,
                // the number of pixels in one percent of movement by the slider
                percentSlider:      percentSlider
            };
       }
       
       
       function Scrollbar(data) {
            var self = this,
                interval;

            // content container
            this.scrollpane    = data.scrollpane;
            // content
            this.scrollcontent = data.scrollcontent;
            // data
            this.params        = sizeSlider(this.scrollpane, this.scrollcontent);
            // scroll up button
            this.scroll_top = $('<div>').addClass('w-srcoll-top w-srcoll-btn').css({
                width: def_opt.btnsWidth + 'px',
                height: def_opt.btnsWidth + 'px'
            });
            // scroll down button
            this.scroll_bottom = $('<div>').addClass('w-srcoll-bottom w-srcoll-btn').css({
                width: def_opt.btnsWidth + 'px',
                height: def_opt.btnsWidth + 'px'
            });
            // scrollbar container
            this.scrollbar_wrap = $('<div>').addClass('w-srcollbar-wrap').css({
                height: this.params.scrollbar_wrap_h,
                width: def_opt.btnsWidth
            });
            // scrollbar
            this.scrollbar = $('<div>').addClass('w-srcollbar').css({
                position: 'relative',
                height: this.params.scrollbar_wrap_h - def_opt.btnsWidth*2,
                //marginTop: def_opt.btnsWidth + 'px',
                top: def_opt.btnsWidth + 'px',
                width: def_opt.btnsWidth + 'px'
            });
            // slider
            this.slider = $('<div>').addClass('w-slider').css({
                top:	0,
                width: def_opt.btnsWidth - 2 + 'px',
                height: this.params.size_slider + 'px'
            }).append("<span style='margin:" + this.params.size_slider / 2 +"px auto;'></span>");

            // Elements adjustment
            this.scrollbar_wrap.append(this.scroll_top);
            this.scrollbar_wrap.append(this.scrollbar);
            this.scrollbar_wrap.append(this.scroll_bottom);
            this.scrollbar.append(this.slider);
            this.scrollbar_wrap.appendTo(this.scrollpane);

            // Slider initialization
            (function draggable() {
                var top,
                    y;
		    
		// the slider position relative to it`s start position and the current cursor position calculation
                function moveSlider(e) {
                                
                    e.preventDefault();
		    
                    if (top + e.clientY - y < 1) {
                        self.slider.css({
                            'top': 0
                        });
                        self.scrollcontent.css({
                            'margin-top': 0
                        });
                        return false;
                    } else if (top + e.clientY - y > self.params.stopScroll - 1) {
                        self.slider.css({
			    'top': self.params.stopScroll
                        });
                        self.scrollcontent.css({
			    'margin-top': self.params.scrollcontent_stop + 'px'
                        });
                        return false;
                    } else {
                        self.slider.css({
                            'top': (top + e.clientY - y) + 'px'
                        });
                        self.scrollcontent.css({
                            'margin-top': self.params.multiple * (-1 * (top + e.clientY - y)) + 'px'
                        });
                    }
                }
		
                // the slider movement stop
                function mouseupSlider(e) {
                    loc_document.unbind('mousemove', moveSlider);
                }
                
                // When click on slider – start the movement
                self.slider.mousedown(function (e) {
                    // forbid the default action in order to prevent the text highlighting
                    e.preventDefault();
                    // the slider should move when the cursor is moving along the whole document
                    // while the left mouse button is pressed
                    loc_document.bind('mousemove', moveSlider);
                    // stop the slider movement when the left mouse button is unpressed at any place of the document
                    loc_document.one('mouseup', mouseupSlider);
                    top = parseInt(self.slider.css('top'), 10);
                    y = e.clientY;
                });
                
            })();

            // Prevent the event`s scrollbar bounds leave
            this.scrollbar_wrap.click(function (e) {
                e.stopPropagation();
            });

            // Scrolling when press the button
            this.scroll_top.add(this.scroll_bottom).bind({
                'mousedown': function (e) {
                    //e.stopPropagation();
                    var it,
		        im,
			stop;
                    
                    if (e.target == self.scroll_top[0]) {
                        it = -1;
                        stop = 0;
                    } else {
                        it = 1;
                        stop = self.params.stopScroll;
                    }
                    interval = setInterval(function () {
                        var top = parseInt(self.slider.css('top'), 10);
                        
                        if (top == stop) {
                            clearInterval(interval);
                            self.slider.css('top', stop + 'px');
                            return;
                        }
                        
                        self.slider.css('top', top + it + 'px');
                        self.scrollcontent.css('margin-top', -1 * self.params.multiple * (top + it) + 'px');
                        /*if (listeners.drag != undefined) {
                        listeners.drag(-1*multiple*(top + it));
                        }*/
                    }, 4);
                },
                'mouseup': function (e) {
                    //e.stopPropagation();
                    clearInterval(interval);
                },
	            'mousewheel': function(event, delta, deltaX, deltaY) {
		       event.preventDefault();
		       if (deltaY<0){
			       self.scroll_bottom.mouseup();
			       self.scroll_bottom.mousedown();
			       setTimeout(function(){self.scroll_bottom.mouseup();},200);
		       } else if (deltaY>0){
			       self.scroll_top.mouseup();
			       self.scroll_top.mousedown();
			       setTimeout(function(){self.scroll_top.mouseup()},200);
		       }
	       }
            });

	       self.scrollpane.bind('mousewheel',function(event, delta, deltaX, deltaY) {
		       event.preventDefault();
		       var startScroll = 0;
		       if($(event.target).parents('.j-tree-menu').length>0) {
			       if(self.scrollpane.hasClass('j-tree-menu')){
				       startScroll = 1;
			       } else {
				       startScroll = 0
			       }
		       } else {
			       startScroll = 1;
		       }

		       if (startScroll==1){
			       if (deltaY<0){
				       self.scroll_bottom.mouseup();
				       self.scroll_bottom.mousedown();
				       setTimeout(function(){self.scroll_bottom.mouseup();},200);
			       } else if (deltaY>0){
				       self.scroll_top.mouseup();
				       self.scroll_top.mousedown();
				       setTimeout(function(){self.scroll_top.mouseup()},200);
			       }
		       }
	       });

            //Scrolling when click at free scrollbar place
            this.scrollbar.bind('click', function (e) {
                
                if (e.target != self.scrollbar[0]) {
                    return false;
                }
                
                // Place for click
                var clickY = e.pageY,
                    // highest slider bound
                    posY = self.slider.offset().top,
                    //highest content bound
                    contentY = parseInt(self.scrollcontent.css('margin-top'), 10),
                    // stop coordinates
                    target,
                    i = 0,
                    j;
                    
                // Scrolling up or down
                if (clickY < posY) {
                    target = clickY - posY;
                    j = -1 * Math.round(self.params.scrollcontent_h / self.params.scrollpane_h * 2);
                } else {
                    target = clickY - posY - self.params.size_slider;
                    j = 1 * Math.round(self.params.scrollcontent_h / self.params.scrollpane_h * 2);
                }
                
                interval = setInterval(function () {
                    if ((i + j >= target && j > 0) || (i + j <= target && j < 0)) {
                        clearInterval(interval);
                        self.slider.offset({top: posY + target});
                        self.scrollcontent.css('margin-top', contentY - self.params.multiple*target + 'px');
                        return false;
                    }
                    self.slider.offset({top: self.slider.offset().top + j});
                    self.scrollcontent.css('margin-top', parseInt(self.scrollcontent.css('margin-top'), 10) - j * self.params.multiple + 'px');
                    i += j;
                }, 1);
                
            });

        }
        // select scrolling to the pointed place
        // scrollbar is setup proportionally
        Scrollbar.prototype.move = function (margin, set) {
            var loc_margin,
                params = this.params,
                top;
                
            // If the content scrolling leaves the container bounds than scroll
            if (margin < params.scrollpane_h - params.scrollcontent_h) {
                loc_margin = params.scrollpane_h - params.scrollcontent_h;
            } else {
                loc_margin = margin;
            }

            top = (Math.abs(loc_margin) / params.percentContent)*params.percentSlider;


            this.slider.css('top', top + 'px');
            // Scroll
            if (set == undefined) {
                this.scrollcontent.animate({
                    'margin-top': loc_margin + 'px'
                }, 800);
            // Immediate setup
            } else {
                this.scrollcontent.css({
                    'margin-top': set === true ? margin : loc_margin + 'px'
                });
            }
        };
        // show the slider
        Scrollbar.prototype.show = function () {
            this.scrollbar_wrap.css('display', 'block');
        };
        // Hide the slider
        Scrollbar.prototype.hide = function () {
            this.scrollbar_wrap.css('display', 'none');
        };
        // Renew the slider
        Scrollbar.prototype.renew = function (slider) {
            sizeSlider(this.scrollpane, this.scrollcontent, this.slider);
        };
       
        return new Scrollbar(data);
    };

})(window.jQuery);
