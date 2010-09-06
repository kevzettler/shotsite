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
        var $this = $(this.element),
        $select = $this.find('select'),
        $price = $this.find('#price cite');
        
        $select.change(function(){
          var $this = $(this),
          $options = $this.find('option'),
          $selected = $this.find('option:selected'),
          price = parseInt(($options.index($selected.get(0)) + 1), 10) * 5.00;
          $price.text(price.toFixed(2));
        });
      }
    
    });
  }
})(jQuery);