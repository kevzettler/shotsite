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
      $(this.options.newOrderLinkEle).text(this.options.newOrderLinkCloseText);
    }
    
    function hide(){
      $(this.element).slideUp();
      $(this.options.newOrderLinkEle).text(this.options.newOrderLinkTextDefault); 
    }
    
        
    return $.extend(Object.create($.core.module), {
      
      options : {
        newOrderLinkEle : "#new_order_expand",
        closeBtnHtml : '<a class="close" title="close">X</a>',
        newOrderLinkTextDefault : "New Order?",
        newOrderLinkCloseText : "Close Order Form",
        newOrderLinkNewText : this.newOrderLinkTextDefault
      },
      
      render : function(){
        var objScope = this; 
        
        if(window.location.pathname == "/orders"){
          var $closeBtn = $(this.options.closeBtnHtml);
          $closeBtn.click($.proxy(hide, this));
          $(this.element).prepend($closeBtn);
        }
        
        $(document).bind('show.credControl', $.proxy(show, this));
        $(document).bind('hide.credControl', $.proxy(hide, this));
         
                 
        $(this.options.newOrderLinkEle).click(function(){
           var $this = $(this);
           if($this.text() != objScope.options.newOrderLinkCloseText){
             $(document).trigger('show.credControl');
           }else{
             $(document).trigger('hide.credControl');
           }
           return false;
        });
        
      }      
    });
  };
})(jQuery);