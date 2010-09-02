(function($){
  var baseOpacity = 1.0;
  
  $.fn.disable = function(options){
    var config = {
      opacity : 0.4
    };
    
    if(options) $.extend(config, options);
    
    this.each(function(){
      var $this = $(this)
      , shield = $('<div class="shield"></div>');
      
      baseOpacity = $this.css('opacity');
      
      shield.css({
        display : 'block',
        position : 'absolute',
        width: $this.width(),
        height: $this.height(),
        'z-index' : 9000
      });
      
      $this
        .append(shield)
        .css({'opacity' : config.opacity});
    }); 
    return this;
  }
  
  $.fn.enable = function(){
    this.each(function(){
      var $this = $(this)
      ,shield = $this.find('.shield');
      
      if(shield.length > 0){
        shield.remove();
        $this.css({opacity : baseOpacity});
      }
    });
  }
  
})(jQuery)