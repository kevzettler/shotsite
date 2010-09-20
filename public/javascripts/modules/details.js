/*
* Handles interaction of details module
*
*
*/
(function($){
  $.core.modules.details = function(){
    
    function createOrder(){
      
    }
    
    return $.extend(Object.create($.core.modules.broForm()), {            
      render : function(){
        var $this = $(this.element),
        $form = $this.find('form');
        
        $form.find("#checkout_btn").button();
        
        $form.submit($.proxy(function(){
          this.clearErrors();
          var orderData,
          priceText = $("div#payment span#price").text();
          
          if($('#login').css('opacity') > 0){
            this.displayError('Please login or register to checkout');
            return false;
          }else{         
            orderData = {
              price: priceText.substr(1, priceText.length),
              shots: parseInt($("#payment select").val(), 10),
              first_name: $form.find('input#first_name').val(),
              last_name: $form.find('input#last_name').val(),
              card_type: $form.find('#card_type').val(),
              card_expires_on : { 
                month: 9,
                year: 2015
              },
              card_number: $form.find("#card_number").val(),
              card_verification: $form.find("#card_verification").val()
            };
          
          
            $.ajax({
              url : '/orders/create',
              type : 'post',
              dataType: 'json',
              data : {order : orderData},
              success : function(data, text, xhr){
                $(document).trigger('createJob.stepControl', function(){ console.log('omg call back');});
              }
            }); 
          }
          return false;
 
        }, this));
      }
    
    });
  }
})(jQuery);