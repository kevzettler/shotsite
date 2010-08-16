/*
* Register module
*
* Handles registration forms
*
*/

(function($){
  $.core.modules.register = function(){
    
    return $.extend(Object.create($.core.module), {            
      render : function(){
        var $this = $(this.element);
        $(document).bind("fadeOut.register", $.proxy(function(){ $this.fadeOut().show(); }));
        $(document).bind("fadeIn.register", $.proxy(function(){ $this.fadeIn().hide(); }));
      }
    
    });
  }
})(jQuery);