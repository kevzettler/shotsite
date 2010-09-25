/*
* Handles interaction of details module
*
*
*/
(function($){
    $.core.modules.details = function(){
        var $this,
            $form,
            $button;

        function isLoggedIn() {
            return $('.logout_link').is(':visible');
        };
        
        function formSubmit(){
          this.clearErrors();
          
          if (isLoggedIn()){
              $button.attr("disabled", "disabled");
              createOrder.call(this);
          }else{
              alert('Not logged in!');
              this.displayError('Please login or register to checkout');
          }
            
          return false;
        }
         

        function addOrderEntry(orderData){
          var $table = $(this.options.tableEle),
          $jobEntry = $('<tr style="display:none;"><td>'+orderData.created_at.substring(0, 10)+'</td><td>'+orderData.price+'</td><td>'+orderData.shots+'</td</tr>');
          $table.find('tr:first').after($jobEntry);
          $jobEntry.fadeIn('slow');
        }

        function createOrder(){
            var orderData,
                priceText = $("div#payment span#price").text();

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

            var objectScope = this;

            $.ajax({
                url : '/orders',
                type : 'POST',
                dataType: 'json',
                data : {order : orderData},
                success : function(data, text, xhr){
                    $(document).trigger('createJob.stepControl');
                    $button.removeAttr("disabled");
                    if(window.location.pathname != "/orders"){
                      window.location = "/orders";
                    }else{
                      $(document).trigger("hide.credControl", [function(){addOrderEntry.call(objectScope, data)}]);
                    }
                    
                },
                error : function(data, text, xhr){
                    $button.removeAttr("disabled");
                    objectScope.displayError("Sorry, couldn't process your order. Please check the order information again.");
                }
            });
        };


        return $.extend(Object.create($.core.modules.broForm()), {
            options : {
              tableEle : "table"
            },
            
            render : function(){
                $this = $(this.element);
                $form = $this.find('#order_form');
                $button = $form.find("#checkout_btn");
            
                
                var objScope = this;
                
                $button.button();

                $form.validationEngine({
                  success: $.proxy(formSubmit, objScope),
                  unbindEngine: false
                });

            }
            
        });
    }
})(jQuery);
