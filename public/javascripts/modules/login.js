/*
* Login
*
* Submits login form
*/
(function($){
  $.core.modules.login = function(){
    
    function loginSubmit(event){
      var $form = $(event.target)
      , $button = $form.find('button')
      , buttonDefault = $button.find('span').text()
      , $inputs = $form.find('input')
      , params = {}
      ;
      
      //build our params object from the from inputs name : value
      $inputs.each(function(){
        var $this = $(this);
        params[$this.attr('name')] = $this.val();
      });
      
      $button.find('span').text('Loading..');
      $.ajax({
        url : $form.attr('action'),
        type : $form.attr('method'),
        data : params,
        dataType : 'json',
        success : function(user_session){
          $button.find('span').text(buttonDefault);
          if(user_session.errors.length === 0){
            $(document).trigger("loggedIn.accountManager");
          }
        },
        error : function(json){
          $button.find('span').text(buttonDefault);
        }
      });
      return false;
    }
    
    return $.extend(Object.create($.core.module), {
      render: function(){
        var $this = $(this.element);
        
        //render the button as a jquery UI button
        $this.find('button').button();
        
        //attach submit event to the form
        $this.find('form').submit($.proxy(loginSubmit, this));
        
        //bind public events
        $(document).bind('fadeOut.login', function(){ $this.fadeOut('fast').hide();});
        $(document).bind('fadeIn.login', function(){ $this.fadeIn('fast').show();});
      },

    });
  };
})(jQuery);