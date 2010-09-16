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
          var orderData;
          
          orderData = {
            price: $("div#payment span#price").text(),
            shots: $("select#order[shots]").val(),
            first_name: "Kev",
            last_name: "Zettler",
            card_type: "MC",
            card_expires_on : "date",
            card_number: "12098239057" 
          };
          
          console.log('omg payment details submit');
          $(document).trigger('createJob.stepControl', function(){ console.log('omg call back');});
          
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