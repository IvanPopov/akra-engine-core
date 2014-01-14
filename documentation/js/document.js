/**
 * Created with JetBrains PhpStorm.
 * User: Diman
 * Date: 17.04.13
 * Time: 12:26
 * http://sijeko.ru
 * http://свирский.рф
 */

jQuery(document).ready(function($){

	//Hide/show sidebar
	var sidebar = [];
	sidebar.animateSpeed = 200;
	sidebar.self = $('.j-sidebar');
	sidebar.content = $('.j-content');
	sidebar.switcher = $('.j-left-bar');
	sidebar.width = sidebar.self.width();

	sidebar.switcher.click(function(){
		if (sidebar.switcher.hasClass('opened')){
			//hide sidebar
			sidebar.self.animate({
				'left': -sidebar.width+'px'
			}, sidebar.animateSpeed);
			//move the button to the left
			sidebar.switcher.animate({
				'left': 0
			}, sidebar.animateSpeed, function(){
				sidebar.switcher.removeClass('opened').addClass('closed');
			});
			//move content to the left
			sidebar.content.animate({
				'marginLeft': 0
			}, sidebar.animateSpeed);

		} else if (sidebar.switcher.hasClass('closed')) {
			//show sidebar
			sidebar.self.animate({
				'left': 0
			}, sidebar.animateSpeed);
			//move the button to the right
			sidebar.switcher.animate({
				'left': (sidebar.width-18)+'px'
			}, sidebar.animateSpeed, function(){
				sidebar.switcher.removeClass('closed').addClass('opened');
			});
			//move content to the right
			sidebar.content.animate({
				'marginLeft': sidebar.width+'px'
			}, sidebar.animateSpeed);

		}
	});

	enableSideScroll(sidebar);

	$(window).resize(function(){
		enableSideScroll(sidebar);
		hideTreeMenu();
	});

	$('body').click(function(e){
		if ( ($(e.target).parents('.j-tree-menu').length==0) && (! $(e.target).hasClass('j-tree-button')) ){
			hideTreeMenu();
		}
	});
});

$(document).load(function(){setupHiders();});

function setupHiders() {

	/* tree-popup-menu */
	$('.j-tree-button').click(function(){
		var self = $(this);
		var treeMenu = self.parent().find('.j-tree-menu');

		if(treeMenu.hasClass('opened')) {
			hideTreeMenu();
		} else {
			hideTreeMenu();
			treeMenu.addClass('opened');
			$.scrollbar({
				scrollpane:    treeMenu, // parent element
				scrollcontent: treeMenu.find('.j-tree-list')  // inner content
			});
		}
	});

	/* Single Method Close/Open */
	$('.j-single-method-arrow').click(function(){
		var self = $(this);
		var singleMethod = self.parents('.j-single-method');
		if (singleMethod.hasClass('opened')){
			singleMethod.removeClass('opened').addClass('closed');
		} else if (singleMethod.hasClass('closed')){
			singleMethod.removeClass('closed').addClass('opened');
		}
	});

	// leftColumn, switch chapters
	$('.j-sm-button').click(function(){
		var self = $(this);
		if (!self.hasClass('disabled')){
			var selfName = self.data('name');
			var menuList = $('.j-sm-sub-list[data-name="'+ selfName +'"]');

			if (self.hasClass('inactive')) {
				self.removeClass('inactive');
				menuList.show();
			} else {
				self.addClass('inactive');
				menuList.hide();
			}
		}
	});

	// content, switch chapters
	$('.j-content-chapter-button').click(function(){
		var self = $(this);
		if (!self.hasClass('disabled')){
			var selfName = self.data('name');
			var menuList = $('.j-content-chapter[data-name="'+ selfName +'"]');

			if (self.hasClass('inactive')) {
				self.removeClass('inactive');
				menuList.show();
			} else {
				self.addClass('inactive');
				menuList.hide();
			}
		}
	});
}

function enableSideScroll(sidebar){
	//Таймер для того, чтобы браузер успел нормально отобразить левую колонку и вычислить её высоту.
	//Без него высота вычисляется неверно.
	setTimeout(function(){
		var sideMenu = $('.j-side-menu');
		sideMenu.css({
			'paddingRight': '',
			'marginTop': ''
		});
		if (sidebar.self.height()<sideMenu.height()){
			$('.w-srcollbar-wrap').remove();
			$.scrollbar({
				scrollpane:    sidebar.self, // parent element
				scrollcontent: sideMenu  // inner content
			}).renew();
		} else {
			$('.w-srcollbar-wrap').remove();
			sideMenu.css({
				'paddingRight':0,
				'marginTop': 0
			});
		}
	},50);
}

function hideTreeMenu(){
	$('.j-tree-menu').removeClass('opened').find('.w-srcollbar-wrap').remove();
}

function alphabeticColumnSort() {
	// console.log("Alphabetic sorting");
	var section = $(".b-description-wrap .row");
	var section_cursor;
	for (var i = 0; i < section.length; i++) {
		section_cursor = $(section[i]);
		var section_name = $(section_cursor.parents(".j-content-chapter")[0]).find(".b-description-title").html().toUpperCase();
		console.log(section_name);
		// console.log(section_cursor[0]);
		var entries = section_cursor.find(".content .title").clone();
		section_cursor.find(".col-md-3").remove();
		var column_len = 10;
		var columns_in_row = 4;
		var col_num = 1;
		var new_column, cursor;
		for (var j = 0; j < entries.length; j++) {
			// console.log(entries[j],j,entries.length);
			if(j % column_len == 0) {
				if(++col_num > columns_in_row) {
					var new_row = $("<div class='row'></div>");
					section_cursor.after(new_row);
					section_cursor = new_row;
					col_num = 1;
				}
				// console.log("Creating new column");
				new_column = $("<div class=\"col-md-3\"><div class=\"b-alphabet-column\"></div></div>");
				var first_entry_name = $(entries[j]).find("a").html().toUpperCase();
				new_column.find(".b-alphabet-column").append($("<div class='header'><span class='main'>"+(first_entry_name[0]==section_name[0] ? first_entry_name[1] : first_entry_name[0])+"</span></div>")).append($("<div class='content'></div>"));
				section_cursor.append(new_column);
				cursor = new_column.find(".content");
			}
			$(entries[j]).clone().appendTo(cursor);
			$("<p class='text'>&nbsp;</p>").appendTo(cursor);
		}
	}
}