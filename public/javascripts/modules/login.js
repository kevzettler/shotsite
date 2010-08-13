//Login Module
(function($){
  $.core.modules.login = function(){
    
    console.log('omg login private');
    
    return $.extend(Object.create($.core.module), {
      hide: function(){
        $(this.element).fadeOut('slow');
      },

    });
  };
})(jQuery);