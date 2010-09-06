/*
*
* Cool Form Bro
*
*/

(function($){
  $.core.modules.broForm = function(modal){
    
      /*
      *if were using the form in a modal. we have to make sure we are targeting the correct dom elements
      *facebox will clone them and we will be targeting the originals
      */
      function findRealForm(){
        var realForm = $(this.element);
        if(modal && $('#facebox').find('#'+this.element.id).length > 0){
          realForm = $('#facebox').find('#'+this.element.id);
        }
        return realForm;
      };
    
    return $.extend(Object.create($.core.module), {                  
      displayError: function(message){
        var $realForm = findRealForm.call(this);
        $actionHeader =  $realForm.find("p.action_header");
        
        if($actionHeader.length > 0){
          $actionHeader.after('<p class="error">'+message+'</p>');
        }else{
          $realForm.prepend('<p class="error">'+message+'</p>');
        }
        
      },
      
      clearErrors: function(){
        findRealForm.call(this).find('p.error').remove();
      }
    });
  }
})(jQuery);