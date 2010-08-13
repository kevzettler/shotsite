/*
*Step 4 module
*
* Calculate totals and submit the form
*
*/
(function($){
  $.core.modules.step4 = function(){
    
    function updateFieldCount(event, field, count){
      $(this.element).find("#"+field+"_total").text(parseInt(count, 10));
      updateTotal.call(this);
    }
    
    function calculateTotal(){
      var $this = $(this.element)
      ,pages = parseInt($this.find('#page_total').text(),10)
      ,browsers = parseInt($this.find('#browsers_total').text(),10)
      ,shots = parseInt($this.find('#shot_total').text(),10)
      ,price = $this.find('#shot_price').text()
      
      price = parseFloat(price.substr(1, price.length), 10);
      
      var total = ((browsers * shots) * pages) * price;
      
      return total;      
    }
    
    function updateTotal(){
      var $this = $(this.element)
      ,total = calculateTotal.call(this);
      if(!isNaN(total) && total > 0){
        $this.find("#total_price").text("$"+total.toFixed(2));
      }else{
        $this.find("#total_price").text('$0.00');
      }
    }
    
    return $.extend(Object.create($.core.module), {
      render : function(){
        $(document).bind('updateFieldCount.step4', $.proxy(updateFieldCount, this));
        $(document).bind('calculateTotal.step4', $.proxy(calculateTotal, this));     
      }      
    });
  };
})(jQuery);