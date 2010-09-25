/*
* credControl
*
* Lots of pool events from credential steps
*
*/
(function($){
  $.core.modules.credControl = function(){
    
    function show(){
      $(this.element).slideDown();
    }
    
    function hide(){
      $(this.element).slideUp();
    }
        
    return $.extend(Object.create($.core.module), {
      render : function(){
        
        if(window.location.pathname == "/orders"){
          var $closeBtn = $('<a class="close" title="close">X</a>');
          $closeBtn.click($.proxy(hide, this));
          $(this.element).prepend($closeBtn);
        }
        
        $(document).bind('show.credControl', $.proxy(show, this));
        $(document).bind('hide.credControl', $.proxy(hide, this));
        
        $("#new_order_expand").click(function(){
           var $this = $(this);
           if($this.text() != 'Close Order Form'){
             $this.text("Close Order Form");
             $(document).trigger('show.credControl');
           }else{
             $this.text("New Order?");
             $(document).trigger('hide.credControl');
           }
           return false;
        });
        
      }      
    });
  };
})(jQuery);