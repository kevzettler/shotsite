/*
* renders a job list 
*
*
*/
(function($){
  $.core.modules.jobList = function(){
    
    function showClick(e){
      var $this = $(this);
      e.preventDefault();
      $this.text("-" + $this.text().substr(1,$this.text().length));
      $this.next('ul').fadeIn('fast');
      $this.unbind('click');
      $this.click(hideClick, this);
      return false;
    }
    
    function hideClick(e){
      var $this = $(this);
      e.preventDefault();
      $this.text("+" + $this.text().substr(1,$this.text().length));
      $this.next('ul').fadeOut('fast');
      $this.unbind('click');
      $this.click(showClick, this);
      return false;
    }
    
    
    return $.extend(Object.create($.core.modules.broForm()), {            
      render : function(){
        var $this = $(this.element),
        $links = $this.find('.job_link, .batch_link');
      
        $this.find('a[rel="shot_link"]').colorbox({
          height: '100%',
           width: "100%"
        });
        
        $links.each(function(){
          var $this = $(this);
          $this.text("+"+$this.text());
          $this.next('ul').hide();
          $this.click($.proxy(showClick, this));
        });
        
        
      }
    
    });
  }
})(jQuery);