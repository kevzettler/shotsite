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
                    $(document).trigger('createJob.stepControl', function(){ console.log('omg call back');});
                    $button.removeAttr("disabled");
                    if(window.location != "/orders"){
                      window.location = "/orders";
                    }
                },
                error : function(data, text, xhr){
                    $button.removeAttr("disabled");
                    objectScope.displayError("Sorry, couldn't process your order. Please check the order information again.");
                }
            });
        };

        function createJob(){
            
        };


        return $.extend(Object.create($.core.modules.broForm()), {
            render : function(){
                $this = $(this.element);
                $form = $this.find('#order_form');
                $button = $form.find("#checkout_btn");
            
                var $this = $(this.element);
                
                var out_this = this;
                
                $button.button();

                console.log("form:", $form, "button:", $button);

                console.log("render 'this':", this);
                $form.submit($.proxy(function(e){
                    e.preventDefault();

                    this.clearErrors();
                    
                    if (isLoggedIn()){
                        alert('Logged in!');
                        $button.attr("disabled", "disabled");
                        createOrder.call(this);
                    }else{
                        alert('Not logged in!');
                        this.displayError('Please login or register to checkout');
                        return false;
                    }

                    alert("Shouldn't be here!");

                }, this));
            }
            
        });
    }
})(jQuery);
