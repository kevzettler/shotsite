/*
* Handles interaction of details module
*
*
*/
(function($){
  $.core.modules.details = function(){
    
    
    return $.extend(Object.create($.core.modules.broForm()), {            
      render : function(){
        var $this = $(this.element);
        $this.find('a').click($.proxy(function(){
          $(document).trigger('createJob.stepControl', function(){ console.log('omg call back');});
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