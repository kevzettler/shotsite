/*
* accountManager
*
* Used for managing the login state in the header
*/
(function($){
  $.core.modules.accountManager = function(){
    
    function loginClick(event){
      $.facebox({div:'#login'});
      return false;
    }
    
    function registerClick(event){
      $.facebox({div:'#register'});
      return false;
    }
    
    function logoutClick(event){
      $.ajax({
        url : "/logout",
        method : "post",
        dataType : 'json'
      });
      return false;
    }
    
    return $.extend(Object.create($.core.module), {            
      render : function(){
        var $this = $(this.element)
        , $loginLink = $this.find('a:last')
        , $registerLink = $this.find('a:first')
        ;
        
        //attach the login link depending on user login status using text a check, bad? LOL wot?
        if($loginLink.text() == "Login"){
         $loginLink.click($.proxy(loginClick, this)); 
        }else{
         $logoutLink.click($.proxy(loginClick, this));  
        }
        
        //attach the register link function
        $registerLink.click($.proxy(registerClick, this));      
        
      }
    
    });
  }
})(jQuery);