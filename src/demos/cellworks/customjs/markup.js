var setMarkup = function() {
	akra.pCanvas.resize(500);
	$('body').css({background:'#eee',minHeight:'100%',fontFamily:'sans-serif',color:'#333',fontSize:'20px'});
	$('canvas').css({border:'1px solid #ddd'});
	$('<div id="container"></div>').appendTo('body');
	$('<div id="left"></div>').appendTo('#container');
	$('<div id="right"></div>').appendTo('#container');
	$('<div id="copyright"></div>').appendTo('#container');
	$('<div id="logo-text"></div>').appendTo('#copyright');
	$('<div id="logo"></div>').appendTo('#copyright');
	$('#container').css({background:'#fff',position:'relative',fontSize:0,width:1000,margin:'0px auto',padding:'20px 20px 140px','box-sizing': 'border-box', borderRadius:10, boxShadow:'0px 5px 20px #aaa', marginBottom:35});
	$('#left').css({display:'inline-block',width:'60%',fontSize:'20px',verticalAlign:'top'});
	$('#right').css({display:'inline-block',width:'40%',fontSize:'20px',verticalAlign:'top'});
	$('canvas').appendTo('#right');
	akra.pCanvas.resize($('#right').width()-2,($('#right').width()-2)*1.5);
	$(window).resize(function() {akra.pCanvas.resize($('#right').width()-2,($('#right').width()-2)*1.5);});
	$('<h1>Cellphone sales example</h1>').css({textAlign:'center'}).insertBefore('#container');
	$('#left').append($('<h2>Some phone brand</h2>')).append($('<p></p>').css({paddingRight:20,textAlign:'justify'}).html('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil incidunt beatae id nesciunt tempora atque ipsum culpa modi ullam, hic tempore vel alias provident unde odit aliquam, aspernatur praesentium deserunt.</div><div>Eaque voluptates beatae quam voluptatum ullam soluta dicta pariatur suscipit repellendus esse ipsum, earum odio tenetur, optio officia itaque id perferendis neque nam sunt laboriosam? Tempore, debitis soluta ex laudantium.</div><div>Id vero dicta tempore esse iste, earum. Non iure tempora, facere illum sunt! Unde reiciendis minus nostrum hic est soluta maiores aliquid, temporibus dicta doloremque architecto facere, dolorum dolore cum.</div><div>Iste ipsam eveniet quaerat rem ea dolore asperiores est inventore corporis illo sit nam doloremque, aperiam! Doloribus aspernatur beatae perferendis, repellendus assumenda saepe explicabo. Perferendis in, cupiditate delectus accusantium explicabo.'));
	$('#left').append($('<h4>Specs:</h4>').css({paddingLeft:20})).append($('<ul></ul>').css({paddingLeft:40})
		.append($('<li><small>prop 1</small></li>').css({listStyle:'none'}))
		.append($('<li><small>prop 2</small></li>').css({listStyle:'none'}))
		.append($('<li><small>prop 3</small></li>').css({listStyle:'none'}))
		.append($('<li><small>prop 4</small></li>').css({listStyle:'none'}))
		.append($('<li><small>prop 5</small></li>').css({listStyle:'none'}))
		.append($('<li><small>prop 6</small></li>').css({listStyle:'none'})));
	$('#copyright').css({display:'inline-block',position:'absolute',bottom:30,right:20,width:200,height:70,fontSize:'16px'});
	$('#logo').css({width:196,height:67,background:'url("http://dev.odserve.org/demos/img/showcase/logo.png") 0 0 no-repeat',
		'-webkit-filter': 'drop-shadow(0px 0px 1px rgba(0,0,0,0.8))',
	    'filter': 'url(#drop-shadow)',
	    '-ms-filter': "progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#222')",
	    'filter': "progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#222')"
	});
	$('body').append(
		'<svg height="0" xmlns="http://www.w3.org/2000/svg">'+
		'    <filter id="drop-shadow">'+
		'        <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>'+
		'        <feOffset dx="0" dy="0" result="offsetblur"/>'+
		'        <feFlood flood-color="rgba(0,0,0,0.8)"/>'+
		'        <feComposite in2="offsetblur" operator="in"/>'+
		'        <feMerge>'+
		'            <feMergeNode/>'+
		'            <feMergeNode in="SourceGraphic"/>'+
		'        </feMerge>'+
		'    </filter>'+
		'</svg>')
};