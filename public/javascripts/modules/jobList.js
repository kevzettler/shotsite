//= require <modules>
/*
* activates the job list 
*
*
*/
(function($){
  $.core.modules.jobList = function(){
    var objScope;
    
    function renderRow(){
      var $this = $(this);
      $this.find('.browser_buttons').buttonset();
      $this.find('button').click($.proxy(updateJob, this));
      $this.find('.delete_block a').click($.proxy(deleteJob, this));
    }
    
    function deleteJob(e){
      e.preventDefault();
      var $this = $(this),
      id = parseInt($this.find('.id_block').text(),10);
      $this.disable();
      $.ajax({
        url: '/jobs/' + id,
        type: "DELETE",
        dataType : 'json',
        success : function(data){
          $this.slideUp('slow');
          console.log('succes');
        },
        error : function(){
          $this.enable();
          console.log('error');
        }
      });
      return false;
    }
    
    function updateJob(){
     var $this = $(this),
     id = parseInt($this.find('.id_block').text(),10),
     rowScope = this,
     jobData = {
         job: {
             urls: JSON.stringify(getUrls.call(rowScope)),
             browsers: JSON.stringify(getBrowsers.call(rowScope)),
             interval: getInterval.call(rowScope)
         }
     };
     
     $this.disable();
     $.ajax({
       url :'/jobs/'+ id,
       type : "PUT",
       data : jobData,
       dataType : 'json',
       success : function(data){
        $this.enable(); 
       }
     }); 
    }
    
    function getUrls(){ 
      var $this = $(this),
      urls = [],
      $url_input = $this.find('textarea');
      urls = $url_input.val().split('/n');
      return urls;
    }
    
    function getBrowsers(){
      var $this = $(this),
      $browser_inputs = $this.find('input:checked'),
      browsers = [];
      
      $browser_inputs.each(function(){
        var chunks = $(this).val().split(':');
        browsers.push({
          name : chunks[0],
          version : chunks[1]
        });
      });
      return browsers;
    }
    
    function getInterval(){
      var $this = $(this);
      return $this.find('select').val();
    }
    
    return $.extend(Object.create($.core.modules.broForm()), {
                  
      render : function(){
        var $this = $(this.element),
        $rows = $this.find('tr:not(.header_row)');
        objScope = this;
        
        $rows.each(renderRow);
        
        
      }
    
    });
  }
})(jQuery);