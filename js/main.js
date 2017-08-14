// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Eric Birkner JS's.
//cargo el saun mayaner

var moneda = null;
var muricio = null;
var salto = null;
var back_sound = null;

soundManager.setup({
  url: 'swf/',
  onready: function() {
    
	moneda = soundManager.createSound({
      id: 'moneda',
      url: 'audio/smb_coin.mp3'
    });
	
	muricio = soundManager.createSound({
      id: 'muricio',
      url: 'audio/fin.mp3'
    });
	
	salto = soundManager.createSound({
      id: 'salto',
      url: 'audio/smb_jump-small.mp3'
    });
	
	
	back_sound = soundManager.createSound({
      id: 'back_sound',
      url: 'audio/loop.mp3',
	  volume: 25,
	  onfinish:function() { 
	  	back_sound.play();
	  }
    });
	
	
	back_sound.play();
	
	
	
   
  },
  ontimeout: function() {
    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
  }
});

$('#connect').click(function(e) {
    	/*
		window.location = window.location+"/1";
		console.log('holi');
    	*/
		FB.login(function(response) {
		   if (response.authResponse) {
			 console.log('Welcome!  Fetching your information.... ');
			 FB.api('/me', function(response) {
			   //console.log('Good to see you, ' + response.name + '.');
			   //console.log(response);
			   $.post('../save_user.php',response,function(data){
					console.log(data);
					$('#formulario #fb_uid').val(response.id);
					
					window.location.hash = '#Inicio/1';
					//window.location = '/#Inicio/1';
				});	 
			});
		   } else {
			 //console.log('User cancelled login or did not fully authorize.');
		   	 alert('Debes conectar con facebook para participar.');	
		   }
		 }, {scope: 'email,user_likes'});
	});
	
	
	$('.btn-enviar').click(function(e) {
        
		var error = false;
		
		if($('#formulario #nombre').val()==''){
			error = true;
		}
		
		if($('#formulario #tu-hazana').val()==''){
			error = true;
		}
		
		if(!error){
			 $.post('../save_hazana.php',$('#formulario').serialize(),function(data){
					console.log(data);
					$('#formulario #nombre, #formulario #tu-hazana').val('');
					
					window.location.hash = '#Inicio/2';
					$('.controlArrow').fadeIn('slow');
			});	 
		}
		
 	});