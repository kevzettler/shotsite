/*
* StepControl module
*
* Lots of pool events from handling checkout flow
*
*/
(function($){
  $.core.modules.stepControl = function(){
    
    /*
    * Rough draft check out
    */
    function checkout(event){
      var $this = $(this.element) 
      ,$button = $(event.target)
      , $form = $this.find('form')
      /*
      *total = $(document).trigger("calculateTotal.step4");
      * whoops, event pooling with jquery directly is a mistake. it only returns the jquery obj
      * here we want a simple value from the calculateTotal method on step4
      * may have to add it to the jquery object $.calculateTotal
      * fugly
      * calling step4s dom elements directly, not lossely coupled but getting the job done
      */
      var total = $this.find("#total_price").text();
      total = parseFloat(total.substring(1, total.length));
      
      //Random conditional for now not sure on error handling for empty or free orders yet
      if(total > 0){
        $form.disable();
        $button.find("span").text('Change Order?');
      }
      
    }
    
    
    return $.extend(Object.create($.core.module), {
      render : function(){
        var $this = $(this.element);
        
        $this.find('button')
          .button() //make the button a button
          .click($.proxy(checkout, this)); 
      }      
    });
  };
})(jQuery);