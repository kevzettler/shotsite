/*
* Login
*
* Submits login form
*/
(function($){
  $.core.modules.login = function(){
    
    function loginSubmit(){
      
    }
    
    return $.extend(Object.create($.core.module), {
      render: function(){
        $(this.element).find('button').button();
        
        $(this.element).find('form').submit($.proxy(loginSubmit, this));
      },

    });
  };
})(jQuery);