$(function(){
    'use strict';
    var users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "quin69","brunofin", "comster404" ];
    
    $(document).ready(function(){
        users.forEach(function(value){
            var logo = "";
            var status = "";
            var description = "";           
            $.getJSON('https://wind-bow.glitch.me/twitch-api/users/'+ value, function(data){
                    if(data.logo !== null && data.status !== 404){
                        logo = data.logo;
                    }else if(data.logo === null){
                        logo = 'images/no-image.jpg';
                    }else{
                        logo = 'images/no-account.png';
                    }
                    $.getJSON('https://wind-bow.glitch.me/twitch-api/streams/'+ value + '?callback=?', function(info){
                        if(info.stream === null && data.status !== 404){//If the users has not stream available but it exist set status offline
                            status = "offline";
                        }else if(data.status === 404){//If user has not been found set status no account
                            status = "no-account"; 
                                                     
                        }else{
                            status = "online";
                            description = info.stream.channel.status;
                        } 
                               
                        $('#users-panel').append('<a href="'+createUrl(data.name)+'" id="' + data.name + '"><section><div class="users"><img src="'+ logo + '"><span>' + value + '</span><div class="'+ status +'"></div></div><p>'+ description + '</p></section></a>');
                        $('.no-account').text('No account');          
                         
                        $('#users-panel a').click(function(){//Modify focus on users when click on it.                                                          
                            $('#users-panel section').each(function(){                                
                                if($(this).hasClass('active')){
                                    $(this).removeClass('active');
                                }
                            }) ;                                                                         
                            $('#'+ $(this).get(0).id + ' section').addClass('active'); 
                            if(window.innerWidth >= 768){//Make the anchor link being the source for iframe for no mobile screen
                                $('iframe').attr('src',$(this).attr('href')); 
                                return false;   
                            } 
                                                    
                        }); 
                        
                       $('#users-panel a').blur(function(e){//Avoid blur method happens to do not loose focus on user who is on 
                            e.preventDefault();
                            e.stopPropagation();                        
                       });
                      
                });                
                

            }); 
             
            
        });
        $('<style>section:hover{background-color:#b3b3ff;}</style>').appendTo('head');
        setTimeout(function(){$('#users-panel').find('.users div').sort(sorting);},6000);        
               
    });
    
    $('button#all').click(function(e){        
        $('.users div').each(function(){ 
            $(this).parent().parent().removeClass('no-display'); 
        }); 
        swapClass('button', 'highlight');
        $(this).addClass('highlight');   
    });
    $('button#available').click(function(){
        $('.users div').each(function(){           
            if(!($(this).hasClass('online'))){
                $(this).parent().parent().addClass('no-display');
            }else{
                $(this).parent().parent().removeClass('no-display');
            }
        });
        swapClass('button', 'highlight');
        $(this).addClass('highlight');  
    });
    $('button#off').click(function(){
        $('.users div').each(function(){           
            if(!($(this).hasClass('offline'))){
                $(this).parent().parent().addClass('no-display');
            }else{
                $(this).parent().parent().removeClass('no-display');
            }
        });
        swapClass('button', 'highlight');
        $(this).addClass('highlight');  
    });
    
    function sorting(a,b){
        return a.className > b.className;
    }
    function createUrl(userName){
        var url = 'https://player.twitch.tv/?channel=';
        var param = '&muted=false&pause=true&autoplay=true';
        return url + userName + param;
    }
    
    function swapClass(selector, typeClass){//Handle the focus on buttons all, offline and online. This way if button loose focus it doesn't loose the color unless another button has been clicked
        $(selector).each(function(){ 
            if($(this).hasClass(typeClass)){
                $(this).removeClass(typeClass);
            } 
        });
    }
})