//Eric Birkner's JS

$.easing.smoothmove = function (x, t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
}; 		


var already = false;
var musica = true;
//velocidad background
var vel_nubes = 0.3;
var vel_plantas = 1;
var vel_ciudad = 0.1;
var vel_piso = 20;
//velocidad juego
var speed = 2100;

var score = 0;

var velocidad_elemento = 2100;

var line, compartir, crear, disfrutar, autonomia, conexion = false;

var jumping = false;

var estado = 'para';

var crea_elemento = null;

var crea_app = null;

//personajes del juego
var player      = $("#collider");
var obstaculo   = $(".obstacles");
var apps     	= $(".apps");
var crater     	= $(".crater");

	
var obstaculoSize = {
	height: obstaculo.height(),
	width : obstaculo.width()
};

var appsSize = {
	height: apps.height(),
	width : apps.width()
};

var craterSize = {
	height: crater.height(),
	width : crater.width()
};

var playerSize = {
	height: player.height(),
	width : player.width()
};


//array app
var appstack = ['social', 'fotos', 'musica', 'mapas', 'mensajes', 'marketplace'];


$(document).ready(function(e) {
		/*
		if($.browser.msie && $.browser.version <= 8){
			alert('soy ie < 9');
		}
		*/
		//botones acciones
		//inicio
		
		$('#zorro').sprite({fps: 12, no_of_frames: 7});
		
		$('#begin').click(function(e) {
			begin();
			$('#begin').fadeOut('fast');
		});
		
		//
		$('#fox_box .wrapper .btn_jugar').click(function(e) {
			$('#fox_box').animate({'left':'-688px'},100,function(){
				restart();
				begin();
			});
			
		});
		
		$('#modal').click(function(e) {
			$(this).fadeOut('fast');
			
			begin();
			
		});
		
		$('#logo').click(function(e) {
			back_sound.stop();			
		});
		
		
	
	
});

/*
esta shit no funciona quizas si hago un flappy bird quizás lo podría usar
var jump = false;
   
//evento de teclado
$(document).keydown(function(event) {
   //console.log("Key pressed: " + event.keyCode);
   
   if((event.keyCode == 32 || event.keyCode == 38) && !jump) {
   		event.preventDefault();
       	setTimeout(function() {
				//player.animate({"bottom":"120px"});
				jump=true;
				player.css({"bottom":"300px"});
				
			setTimeout(function() {
				//player.animate({"bottom":"20px"});
				player.css({"bottom":"60px"});
				jump=false;
			},400);},0);
		}
    
});
*/


$(document).keydown(function(event) {
  
   if((event.keyCode == 32 || event.keyCode == 38) && !jumping) {
      if(already){ 
      jumping = true;
	  salto.play();
        event.preventDefault();
        setTimeout(function() {
			
			$('#zorro').fps(7).css({'background-image':'url(img/salta.png)'});
			if($.browser.msie){
				$('#collider, #zorro').animate({"bottom":"340px"},600,'smoothmove');
			}else{
				
				$('#collider, #zorro').css({"bottom":"340px"});
				
			}
			
		setTimeout(function() {
			
			if($.browser.msie){
				$('#collider, #zorro').animate({"bottom":"50px"},600,'smoothmove');
			}else{
				$('#collider, #zorro').css({"bottom":"50px"});
			}
			
            setTimeout(function() {	
				jumping = false;
				$('#zorro').fps(12);
				//lo dejo en el estado
				las_cosas_como_son();
				
			},600);
        },600);},0); 
	  }
    }
});


//función para detectar colisiones
function testCollision(position1, size1, position2, size2) {
	if (((position1.left + size1.width)  > position2.left) &&
		((position1.top  + size1.height) > position2.top)  &&
		((position2.left + size2.width)  > position1.left) &&
		((position2.top  + size2.height) > position1.top)) {
		
		return true;
		
	}else{
		return false;
	}
}

function add_obstaculo(){
	var $new = $('.obstacles');
	var dead = false;
	//$('#escena').append($new);
	//$new.css('display','block');
	
	$new.animate({ left:'-150px' }, {
		duration: velocidad_elemento,
		step    : function(now, fx) {
			
			if(testCollision(obstaculo.position(), obstaculoSize, player.position(), playerSize)){
				
				dead = true;
				murio();
				$new.stop();
				$('#zorro').hide('fast');
				
			}
		},
		queue   : false,
		complete: function(){
			if(murio){
				//alert('Y murio!');
				console.log('murio');
			}
			$new.css('left','1000px');
		}
	});
}

function add_crater(){
	var $new = $('.crater');
	var cayo = false;
	
	$new.animate({ left:'-300px' }, {
		duration: velocidad_elemento,
		step    : function(now, fx) {
			
			if(testCollision(crater.position(), craterSize, player.position(), playerSize)){
				
				cayo = true;
				$new.stop();
				
				murio();
				
				/*
				player.animate({'left':'140px'},10,function(){
		
					player.animate({'bottom':'-300px'},10);
					
				});
				*/
				$('#zorro').animate({'left':'80px'},10,function(){
		
					$(this).animate({'bottom':'-300px'},500,function(){
						$(this).css({'display':'none'});
					});
					
				});
				
				
				
			
			}
		},
		queue   : false,
		complete: function(){
			if(murio){
				//alert('Y murio!');
				console.log('murio');
			}
			$new.css('left','1000px');
		}
	});
}


function add_apps(){
	
	var $new = $('.apps');
	var suma = false;
	//le pongo una clase al azar
	
	//var clase = appstack[Math.floor(Math.random() * appstack.length)];
	var pos = [Math.floor(Math.random() * 50)];
	//var pos = [Math.floor(Math.random() * 6)];
	
	var back_pos =0;
	
	back_pos = parseInt(pos-1);
	
	back_pos = 56 * back_pos;
	
	console.log('posicion:'+pos);
	//alert('add_apps:'+pos);
	
	//$('#escena').append($new);
	$new.css({'background-position':'-'+back_pos+'px'});
	
	$new.animate({ left:'-100px' }, {
		duration: velocidad_elemento,
		step    : function(now, fx) {
			
			if(testCollision(apps.position(), appsSize, player.position(), playerSize)){
				suma = true;
				
				$(this).css('display','none');
				moneda.play();
				//ventanas line, compartir, crear, disfrutar, autonomia, conexion
				
				if(pos == 0){
					if(!line){
						line = true;
						modal('line');
					}
				}
				
				if(pos == 1){
					if(!compartir){
						compartir = true;
						modal('compartir');
					}
				}
				
				if(pos == 2){
					if(!crear){
						crear = true;
						modal('crear');
					}
				}
				
				if(pos == 3){
					if(!disfrutar){
						disfrutar = true;
						modal('disfrutar');
					}
				}
				
				if(pos == 4){
					if(!autonomia){
						autonomia = true;
						modal('autonomia');
					}
				}
				
				if(pos == 5){
					if(!conexion){
						conexion = true;
						modal('conexion');
					}
				}
				
			}
			
			
		},
		queue   : false,
		complete: function(){
			
			if(suma){
				score++;
				
			}
			console.log('puntos' + score);
			
			
			
			
			$('#score').text(score);
			$('#fox_box .wrapper .puntaje span').text(score);
			
			
			//saco las clases que agregue			
			
			for (var i=0;i<appstack.length;i++){ 
				//console.log(appstack[i]);
				$('.apps').removeClass(appstack[i]);
			}
			
			$new.css({'display':'block','left':'1000px'});		
			
		}
	});
}


function stop_elemento(){
	clearInterval(crea_elemento);
	crea_elemento = null;
	
}



function begin(){
	
	console.log('begin()');
	
	estado = 'corre';
	las_cosas_como_son();
	
	//verifico si esta tocando la música
	if(!musica){
		back_sound.play();
		musica = true;
	}
	
	if(!already){
	//animación fondo
	
		already = true;
		$('#nubes').pan({fps: 25, speed: vel_nubes, dir: 'left'});
		$('#ciudad').pan({fps: 25, speed: vel_ciudad, dir: 'right'});
		$('#piso').pan({fps: 30, speed: vel_piso, dir: 'left'});
		$('#plantas').pan({fps: 25, speed: vel_plantas, dir: 'left'});
		$('#torre').animate({ left: "-300px" }, 15000 );
		
	}else{
		continuar();
		
	}
	
	
	
	//creacion de obstaculos
	crea_elemento = setInterval(function(){ 
		
		console.log('crea_elemento');
		
		var actor = [Math.floor(Math.random() * 3)];
		
		console.log('actor:'+actor);
		
		//test
		//actor = 1;
		
		if(actor==0){
			add_obstaculo();
		}
		
		if(actor==1){
			add_apps();
		}
		
		if(actor==2){
			add_crater();
		}
		
		
		if(speed>700){
			
			//aumento la velocidad
			speed = parseFloat(speed - 10);
			
			vel_piso = parseFloat(vel_piso + 0.1);
			
			velocidad_elemento = parseFloat(velocidad_elemento - 10);
			
		}else{
			/*
			velocidad_elemento = 700;
			$('#piso').spSpeed(18);
			*/
		}
		
		//velocidad_elemento = velocidad_elemento - 50;
		//vel_piso=vel_piso+0.5;
		console.log('speed:'+speed);
		console.log('velocidad_elemento:'+velocidad_elemento);
		console.log('piso:'+vel_piso);
		
	},speed);
	
	
}


function stop_game(){
	
	
	stop_elemento();
	estado = 'para';
	las_cosas_como_son();
	
	$('#nubes').spStop();
	$('#ciudad').spStop();
	$('#piso').spStop();
	$('#plantas').spStop();
	
	$('#torre').stop();
	
	
}

function restart(){
	
	speed = parseFloat(2100);
	score = 0;
	vel_piso= parseFloat(20);
	velocidad_elemento = parseFloat(2100);
	
	obstaculo.css({'bottom':'59px','left':'1000px'});
	crater.css({'bottom':'0','left':'1000px'});
	player.css({'bottom':'50px','left':'40px'});
	
	$('#score').text(score);
	$('#fox_box .wrapper .puntaje span').text(score);
	
	$('#piso').spSpeed(vel_piso);
	
	$('#zorro').css({'left':'-100px','bottom':'50px','display':'block'});
}

function murio(){
	estado = 'muere';
	musica = false;
	las_cosas_como_son();
	back_sound.stop();
	muricio.play();
	stop_game();
	
	
	
	$('#fox_box').animate({'left':'0'},500,'smoothmove',function(){
			
	});
}

function modal(app){
	$('#modal').html('<img src="img/'+app+'.png"/>').fadeIn('fast');
	stop_game();
}

function continuar(){
	//continuo las animaciones
	$('#nubes').spStart();
	$('#ciudad').spStart();
	$('#piso').spStart();
	$('#plantas').spStart();
	$("#torre").animate({ left: "-300px" }, 15000 );
	
}

function las_cosas_como_son(){
	//manejo de sprite
	console.log('sprite:'+estado);
	$('#zorro').css({'background-image':'url(img/'+estado+'.png)'});
}