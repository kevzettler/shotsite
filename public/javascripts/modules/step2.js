/*
* Step2 module
*
* Handles functionality for the browser buttons
*
*/

(function($){
  $.core.modules.step2 = function(){
    
    /*
    * update step4 with the new browser amount
    */
    function checkBoxClick(event){
      $(document).trigger('updateFieldCount.step4', ['browsers', getBrowserCount.call(this)]);
    }
    
    /*
    * return the amount of browsers the user has selected. don't include 'free' ones
    */ 
    function getBrowserCount(){
      return $(this.element).find('input:checked:not(.free)').length;
    }
    
    return $.extend(Object.create($.core.module), {            
      render : function(){
        //render the buttons using jquery UI buttonset
        $("#browser_buttons").buttonset();
        
        $(this.element).find('input').click($.proxy(checkBoxClick, this));
      }
    
    });
  }
})(jQuery);