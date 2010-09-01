/*
* Step3 module
*
* Handles functionality for the interval selects
*
*/

(function($){
  $.core.modules.step3 = function(){
    
    function changeSelect(){
      $(document).trigger('updateFieldCount.step4', ['shot', getShotCount.call(this)]);
    }
    
    function getShotCount(){
      var $this = $(this.element);
      var shorts = $this.find('#short_time'),
      longs = 30 //$this.find('#long_time');
      
      return shorts.val() * longs;    
    }
    
    return $.extend(Object.create($.core.modules.broForm()), {            
      render : function(){      
        $(this.element).find('select').change($.proxy(changeSelect, this));
      }
    
    });
  }
})(jQuery);