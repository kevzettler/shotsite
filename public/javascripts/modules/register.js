/*
* Register module
*
* Handles registration forms
*
*/

(function($){
  $.core.modules.register = function(){
    
    function registerSubmit(event){
      var $form = $(event.target)
      , $inputs = $form.find('input')
      , params = {}
      , objScope = this
      ;
      
      $inputs.each(function(){
        var $this = $(this);
        params[$this.attr('name')] = $this.val();
      });
      
      //ajax for the register
      $.ajax({
          url : $form.attr('action'),
          type : $form.attr('method'),
          data : params,
          dataType : "json",
          success : function(json){
              $(document).trigger("close.facebox");
              $(document).trigger('loggedIn.accountManager');

              //fade out the login form
              $(document).trigger('fadeOut.login');
              $(document).trigger('fadeOut.register');

              objScope.clearErrors();
          },
          error :function(xhr, txt, er){
            objScope.clearErrors();
            var errObj = JSON.parse(xhr.responseText);
            console.log(errObj);
            for(var i=0; i<errObj.length; i++){
              objScope.displayError(errObj[i][0]+" "+errObj[i][1]);
            }
          }
      });
      return false;
    }
    
    return $.extend(Object.create($.core.modules.broForm(true)), {            
      render : function(){
        var $this = $(this.element)
        , $form = $this.find('form');
        
        $form.submit($.proxy(registerSubmit, this));
        
        $this.find('button').button();
        
        $(document).bind("fadeOut.register", $.proxy(function(){ $this.find('*').fadeOut(); }));
        $(document).bind("fadeIn.register", $.proxy(function(){ $this.find('*').fadeIn(); }));
      }
    
    });
  }
})(jQuery);
