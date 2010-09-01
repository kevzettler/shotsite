/*
*
* Cool Form Bro
*
*/

(function($){
  $.core.modules.broForm = function(){
    
    return $.extend(Object.create($.core.module), {            
      displayError: function(message){
        console.log("rendering error");
        $(this.element).find("p.action_header").after('<p class="error">'+message+'</p>');
      },
      
      clearErrors: function(){
        $(this.element).find('p.error').remove();
      }
    });
  }
})(jQuery);