var bAnimationRunning = false;

var charIndex = -1;
var stringLength = 0;
var n = 0;
var blink = true;
var state = 0;
var msDelay = 50 / 1.5;
var lastNewLine = 0;
var prevCharIndex = 0;
var newLine = 0;
var bAnimationText = true;
var context = new (window.AudioContext || window.mozAudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();
var source; 
var audio0 = new Audio();   
audio0.src = 'assets/type.wav';
audio0.controls = true;
audio0.autoplay = false;
audio0.loop = false;
source = context.createMediaElementSource(audio0);
source.connect(analyser);
analyser.connect(context.destination);

var videoEnded = true;
var textEnded = false;
var isPlayed = false;

$(document).ready(function(){
	updateSlideScale();

	$(window).resize(function(){
		updateSlideScale();
	})
})



function updateSlideScale() {
	// Масиив из реальных размеров слайдов
	var aSlidesSizes = [{
		width: 1438,
		height: 831,
		borderLeft: 26,
		borderTop: 22
	},{
		width: 1150,
		height: 664,
		borderLeft: 20,
		borderTop: 18
	},{
		width: 1438,
		height: 831,
		borderLeft: 26,
		borderTop: 22
	}]

	$(".slide").each(function(){
		var iWindowWidth  = $(document).width();
		var iWindowHeight = $(document).height();

		var iSlideNum = $(this).data("num");
		
		var iOriginSlideWidth  = aSlidesSizes[iSlideNum].width;
		var iOriginSlideHeight = aSlidesSizes[iSlideNum].height;

		// Соотношение сторон
		var fRatio = iOriginSlideWidth / iOriginSlideHeight;

		// Минимальный отступ сверху окна
		var iMinTop = 140;
		// Минимальный отступ снизу окна
		var iMinBottom = 70;

		// Максимальная высота и ширина слайда с учетом рассчитанной высоты окна
		var iMaxSlideWidth  = iWindowWidth  - 100;
		var iMaxSlideHeight = iWindowHeight - iMinTop - iMinBottom;

		var iSlideHeight = 0;
		var iSlideWidth  = 0;

		// Считаем итоговые размеры слайдов
		// Если ширина больше - отталкиваемся от высоты, в обратном случае отталкиваемся от ширины.
		if(iMaxSlideWidth/iMaxSlideHeight >= fRatio) {
			// console.log(true, iMaxSlideWidth, iMaxSlideHeight)
			iSlideHeight = iMaxSlideHeight;
			iSlideWidth  = iMaxSlideHeight * fRatio;
		} else {
			// console.log(false, iMaxSlideWidth, iMaxSlideHeight)
			iSlideHeight = iMaxSlideWidth / fRatio;
			iSlideWidth  = iMaxSlideWidth;
		}

		// Если ширина и высота выходят за оригинальные размеры - используем оригинальные
		iSlideWidth  = iOriginSlideWidth  > iSlideWidth  ? iSlideWidth  : iOriginSlideWidth;
		iSlideHeight = iOriginSlideHeight > iSlideHeight ? iSlideHeight : iOriginSlideHeight;

		// магические числа. иначе как то неправильно выщитываются расстояния и отступы
		var iMAGIC_NUMBER_1 = 2;
		var iMAGIC_NUMBER_2 = 5;

		// Для внутреннего слоя выставляем отстыпы и ширину с высотой чтобы внутренный слой попал в рамку
		var iInnerLeft = Math.floor(aSlidesSizes[iSlideNum].borderLeft * (iSlideWidth / iOriginSlideWidth));
		var iInnerTop  = Math.floor(aSlidesSizes[iSlideNum].borderTop  * (iSlideHeight / iOriginSlideHeight) - iMAGIC_NUMBER_1);


		
		var pInner = $(this).find(".inner");
		pInner.css({
			"margin" : iInnerTop + "px " + iInnerLeft + "px",
			"width"  : Math.ceil(iSlideWidth - (2 * iInnerLeft)) + "px",
			"height" : Math.ceil(iSlideHeight - (2 * iInnerTop) - iMAGIC_NUMBER_2) + "px"
		})

		$(this).width(iSlideWidth);
		$(this).height(iSlideHeight);

		var iLeft = (iWindowWidth - iSlideWidth) / 2;
		var iTop  = iMinTop + (iWindowHeight - iMinTop - iMinBottom - iSlideHeight) / 2;

		$(this).css("left", iLeft + "px");
		$(this).css("top", iTop + "px");
	})
	
	//$(".slide.active").show();
}

function animateText(){

	function writeContent(inputText) {

	    if (charIndex == -1) {
	        charIndex = prevCharIndex = 0;
	        stringLength = inputText.length;
	        console.log("expected time: ", stringLength * msDelay, "ms");

	        setInterval(function(){
	        	if (charIndex == prevCharIndex) state ++;
	        	else state = 0;
			    if (state == 4) {
			    	state = 0;
			    }
	        }, 200);
	    }

	    prevCharIndex = charIndex;

	    var initString = document.getElementById('myContent').innerHTML;
	    initString = initString.replace(/<SPAN.*$/gi, "");

	    function getc(n) {
	    	n = n || 1;
	    	var s = inputText.charAt(charIndex, n);
	    	charIndex += n;
	    	return s || "";
	    }
	   
	    function seq(from, to, full) {
	    	if (ch == from) {
		    	var s = "";

		    	while (true) {
		    		ch = inputText[charIndex ++] || "";
		    		if (!ch.match(to)) {
		    			s += ch;	
		    			continue;
		    		}
		    		
		    		break;
		    	}
		    	if (full) {
		    		s = from + s + ch;
		    		ch = "";
		    	}
		    	return s;
		    }

		    return null;
	    }

	    function parseSpec(s) {
	    	switch (s) {
	    		case "\\t": return '\t';
	    		case "\\n": return '\n';
	    		case "\\r": return '\r';
	    		default:
	    			return "";
	    	}
	    }

	    var ch = '';

	    if (n > 0) {
	    	n --;
	    	//audio0.pause();
	    }
	    else {
	    	//audio0.play();

	    	ch = getc();
		    
		    var delay = seq("#", /[^\d]{1}/ig);
		    var tag = seq("<", ">", true);
		    var spec = seq("\\", /\w+/ig, true);
		    var rl = seq("$", /./ig, true);
			
		    // if (ch == " ") {
		    // 	n = 5;
		    // }

		    if (ch == '&') {
		    	lastNewLine = initString.length;
		    }

		    if (rl) {
		    	initString = initString.substr(0, lastNewLine);
		    	charIndex --;
		    }
		    
		    spec = parseSpec(spec);
		    
		    if (tag) ch += tag;
		    if (spec) ch += spec;
		    
		    //console.log(spec, tag);
		    
		    if (delay) {
		    	n = parseInt(delay) * 1.5;
		    }
			/*
			if (ch == '\n' || charIndex == 1){
				initString = initString.substr(0, newLine) + initString.substr(newLine + 4);
				newLine = charIndex;
				ch += ">"
			}*/
	    }
	    

	    blink = true;

	    initString = initString + ch.toUpperCase() + "<SPAN id='blink'>" + 
	    //(state == 0 || state == 2? "-": (state == 1? "\\": "/")) + 
	    "<span style=\"display: inline-block; background: #DDD; \">" + (state < 2? " ": "") + "</span>" + 
	    "</SPAN>";
	    
	    document.getElementById('myContent').innerHTML = initString;

	    //document.getElementById('blink').style.display = !blink? 'none': 'inline';

	    if (charIndex < stringLength - 2) {
	    	if(bAnimationText === true){
	    		setTimeout(writeContent, msDelay, inputText);
	    	} else {
	    		audio0.pause();
	    	}
	    } else {
	    	audio0.pause();
	    	console.log("stop");
				$(".console").animate({
		    		left: "-=555px"
		    	}, 1000)
		    	textEnded = true;
	    	
	        //blinkSpan();
	    }
	}

	console.log($(".console").css("left"))

	if(parseInt($(".console").css("left")) < 0 && videoEnded == false){
	
		$(".console").animate({
			left: "+=555px"
		}, 1000, function(){
			setTimeout(function(){
				writeContent(document.getElementById("source-text-eng").innerHTML);
				audio0.play();
			}, 200)
		})
	}else{
		writeContent(document.getElementById("source-text-eng").innerHTML);
		audio0.play();
	}
	


	// writeContent(document.getElementById("source-text-eng").innerHTML);
	// audio0.play();
	// var currentStyle = 'inline';

	// function blinkSpan() {
	// 	blink = !blink;
	//     if (currentStyle == 'inline') {
	//         currentStyle = 'none';
	//     } else {
	//         currentStyle = 'inline';
	//     }
	    

	//     document.getElementById('blink').style.display = currentStyle;
	    
	//     setTimeout(blinkSpan, 500);
	// }
}