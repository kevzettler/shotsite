/*
* Handles interaction of details module
*
*
*/
(function($){
  $.core.modules.details = function(){
    
    return $.extend(Object.create($.core.modules.broForm()), {            
      render : function(){
        var $this = $(this.element);
        $this.find('a').click($.proxy(function(){
          if($('#login:visible, #register:visible').length >= 1){
            this.displayError('Please login or register to checkout');
            return false
          }else{
            return true;
          }
        }, this));
      }
    
    });
  }
})(jQuery);