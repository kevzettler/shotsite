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
        var $this = $(this.element);
        $this.find('form').submit($.proxy(function(){
          var orderData,
          priceText = $("div#payment span#price").text()
                    
          orderData = {
            price: priceText.substr(1, priceText.length),
            shots: parseInt($("#payment select").val(), 10),
            first_name: "Test",
            last_name: "Guy",
            card_type: "MC",
            card_expires_on : { 
              month: 9,
              year: 2015
            },
            card_number: 5205312145674116 
          };
          
          console.log('omg payment details submit');
          //$(document).trigger('createJob.stepControl', function(){ console.log('omg call back');});
          
          $.ajax({
            url : '/orders/create',
            type : 'post',
            dataType: 'json',
            data : {order : orderData},
            success : function(data, text, xhr){
              console.log(data, text, xhr);
            }
          });
          
          return false;
          /*
          if($('#login').css('opacity') > 0){
            this.displayError('Please login or register to checkout');
            return false
          }else{
            return true;
          }
          */
        }, this));
      }
    
    });
  }
})(jQuery);