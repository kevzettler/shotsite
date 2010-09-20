/*
* credControl
*
* Lots of pool events from credential steps
*
*/
(function($){
  $.core.modules.credControl = function(){
    
    function show(){
      $(this.element).slideDown();
    }
        
    return $.extend(Object.create($.core.module), {
      render : function(){
        $(document).bind('show.credControl', $.proxy(show, this));
        
        $("#new_order_expand").click(function(){
           $(document).trigger('show.credControl');
           return false;
        });
        
      }      
    });
  };
})(jQuery);