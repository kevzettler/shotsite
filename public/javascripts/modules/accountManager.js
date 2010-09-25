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
      , $loginLink = $this.find(this.options.loginLink)
      , $regLink = $this.find(this.options.registerLink)
      , objScope = this
      ;
      
        var $navLinks = $(this.options.navLinks);
      
      $(document).trigger('close.facebox');
      //fade it out
      $this.fadeOut('fast', function(){
        //change the links
        $loginLink.text('Logout')
          .attr('href', "/logout")
          .unbind('click')
          .bind('click', $.proxy(logoutClick, objScope))
          .removeClass('login_link')
          .addClass('logout_link');
        
        $regLink.text('Manage Account')
          .unbind('click')
          .removeClass('register_link')
          .addClass('manage_account_link');
        
        //fade it in
        $this.fadeIn('fast');
      });


        console.log("navLinks: ", $navLinks);
        $navLinks.show();
      
      //fade out the login form
      $(document).trigger('fadeOut.login');
      $(document).trigger('fadeOut.register');
    }
    
    function loggedOut(){
      var $this = $(this.element)
      , $loginLink = $this.find(this.options.logoutLink)
      , $regLink = $this.find(this.options.manageAccountLink)
      , objScope = this
      ;
            
        var $navLinks = $(this.options.navLinks);
      //fade it out
      $this.fadeOut('fast', function(){
        
        //change the links
        $loginLink.text('Login')
          .attr('href', '/login')
          .unbind('click')
          .bind('click', $.proxy(loginClick, objScope))
          .removeClass('logout_link')
          .addClass('login_link');
        
        $regLink.text('Register')
          .bind('click', $.proxy(registerClick, objScope))
          .removeClass('manage_account_link')
          .addClass('register_link');

        $navLinks.hide();

        
                
        //fade it in
        $this.fadeIn('fast');
      });

      $(document).trigger('fadeIn.login');
      $(document).trigger('fadeIn.register');
    }
    
    return $.extend(Object.create($.core.module), {
      options : {
          loginLink : 'a.login_link',
          registerLink : 'a.register_link',
          logoutLink : 'a.logout_link',
          manageAccountLink : 'a.manage_account_link',
          navLinks: 'div#nav_links'
      },
                  
      render : function(){
        var $this = $(this.element)
        , $loginLink = $this.find(this.options.loginLink)
        , $registerLink = $this.find(this.options.registerLink)
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
