/*
* accountManager
*
* Used for managing the login state in the header
*/
(function($){
  $.core.modules.accountManager = function(){
    
    function faceboxFocus(){
      $("#facebox input:first").focus();
    }
    
    function loginClick(event){
      $.facebox({div:'#login'});
      return false;
    }
    
    function registerClick(event){
      $.facebox({div:'#register'});
      return false;
    }
    
    function logoutClick(event){
      var $link = $(event.target)
      , objScope = this
      ;
            
      $.ajax({
        url : $link.attr('href'),
        type : "post",
        dataType : 'json',
        success : function(){
          loggedOut.call(objScope);
        }
      });
      return false;
    }
    
    /*
    * If the user logs in update the links and forms
    */
    function loggedIn(){
      var $this = $(this.element)
      , $loginLink = $this.find('a:last')
      , $regLink = $this.find('a:first')
      , objScope = this
      ;
      
      $(document).trigger('close.facebox');
      //fade it out
      $this.fadeOut('fast', function(){
        //change the links
        $loginLink.text('Logout')
          .attr('href', "/logout")
          .unbind('click')
          .bind('click', $.proxy(logoutClick, objScope));
        
        $regLink.text('Manage Account').unbind('click');
        
        //fade it in
        $this.fadeIn('fast');
      });
      
      //fade out the login form
      $(document).trigger('fadeOut.login');
      $(document).trigger('fadeOut.register');
    }
    
    function loggedOut(){
      var $this = $(this.element)
      , $loginLink = $this.find('a:last')
      , $regLink = $this.find('a:first')
      , objScope = this
      ;
            
      //fade it out
      $this.fadeOut('fast', function(){
        
        //change the links
        $loginLink.text('Login')
          .attr('href', '/login')
          .unbind('click')
          .bind('click', $.proxy(loginClick, objScope));
        
        $regLink.text('Register').bind('click', $.proxy(registerClick, objScope));
                
        //fade it in
        $this.fadeIn('fast');
      });
      $(document).trigger('fadeIn.login');
      $(document).trigger('fadeIn.register');
      
    }
    
    return $.extend(Object.create($.core.module), {            
      render : function(){
        var $this = $(this.element)
        , $loginLink = $this.find('a:last')
        , $registerLink = $this.find('a:first')
        ;
        
        //attach the login link depending on user login status using a text check, bad? LOL wot?
        if($loginLink.text() == "Login"){
         $loginLink.click($.proxy(loginClick, this)); 
        }else{
         $loginLink.click($.proxy(logoutClick, this));  
        }
        
        //attach the register link click event
        $registerLink.click($.proxy(registerClick, this));
        
        //bind public events
        $(document).bind('loggedIn.accountManager', $.proxy(loggedIn, this));      
        $(document).bind('loggedOut.accountManager', $.proxy(loggedOut, this));
        
        //focus on the facebox
        $(document).bind('reveal.facebox', function(){
          $('#facebox input:first').focus();
        });
      }
    
    });
  }
})(jQuery);