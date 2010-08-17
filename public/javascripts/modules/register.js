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
          }
      });
      return false;
    }
    
    return $.extend(Object.create($.core.module), {            
      render : function(){
        var $this = $(this.element)
        , $form = $this.find('form');
        
        $form.submit($.proxy(registerSubmit, this));
        
        $(document).bind("fadeOut.register", $.proxy(function(){ $this.fadeOut().hide(); }));
        $(document).bind("fadeIn.register", $.proxy(function(){ $this.fadeIn().show(); }));
      }
    
    });
  }
})(jQuery);