/*
* Payment module
*
* handles the payment forms and PayPal links
*
*/

(function($){
  $.core.modules.payment = function(){
    
    return $.extend(Object.create($.core.module), {            
      render : function(){
        var $this = $(this.element);
        $this.find('a').click(function(){
          console.log($('#login:visible #register:visible').length);
          if($('#login:visible, #register:visible').length >= 1){
            this.displayError('Please login or register to checkout');
          }else{
            return true;
          }
        });
      }
    
    });
  }
})(jQuery);