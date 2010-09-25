/*
* Handles interaction of details module
*
*
*/
(function($){
    $.core.modules.details = function(){        
        function isLoggedIn() {
            return $('#login p:first').is(':visible');
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

            $.ajax({
                url : '/orders/create.json',
                type : 'post',
                dataType: 'json',
                data : {order : orderData},
                success : function(data, text, xhr){
                    $(document).trigger('createJob.stepControl', function(){ console.log('omg call back');});
                    window.location = "http://" + window.location.hostname + "/orders";
                },
                error : function(data, text, xhr){
                    $button.remove_attr("disabled");
                }
            });
        };

        function createJob(){
            
        };


        return $.extend(Object.create($.core.modules.broForm()), {
            render : function(){

                var $this = $(this.element),
                    $form = $this.find('#order_form'),
                    $button = $form.find("#checkout_btn");

                var $this = $(this.element);

                var out_this = this;
                
                $button.button();

                console.log("form:", $form, "button:", $button);
                
                $form.submit($.proxy(function(){

                    this.clearErrors();
                    
                    if (false == isLoggedIn()){
                        this.displayError('Please login or register to checkout');
                        alert('omg submit');
                        return false;
                    }else{
                        $button.attr("disabled", "disabled");
                        createOrder.call(out_this);
                    }
                    alert('omg submit');
                    return false;

                }, this));
            }
            
        });
    }
})(jQuery);
