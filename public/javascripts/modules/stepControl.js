/*
* StepControl module
*
* Lots of pool events from handling checkout flow
*
*/
(function($){
  $.core.modules.stepControl = function(){
    
    var jobData;
    
    function changeOrder(event){
      var $this = $(this.element) 
      ,$button = $this.find('button#checkout_btn')
      , $form = $this.find('form')
      ;
      
      $form.enable();
      $button.find("span.ui-button-text").text('Check Out');
      $button.unbind('click');
      $button.click($.proxy(checkout, this));
    }
    
    /*
    * Rough draft check out
    */
    function checkout(event){
      var $this = $(this.element) 
      ,$button = $this.find("button#checkout_btn")
      , $form = $this.find('form')
      , objScope = this
      ;
      
      /*
      *total = $(document).trigger("calculateTotal.step4");
      * whoops, event pooling with jquery directly is a mistake. it only returns the jquery obj
      * here we want a simple value from the calculateTotal method on step4
      * may have to add it to the jquery object $.calculateTotal
      * fugly
      * calling step4s dom elements directly, not lossely coupled but getting the job done
      */
      var total = $this.find("#total_price").text();
      
      //update job data
      jobData = {
        urls: JSON.stringify(getUrls.call(objScope)),
        browsers: JSON.stringify(getBrowsers.call(objScope)),
        interval: getInterval.call(objScope)
      };
      
      //Random conditional for now not sure on error handling for empty or free orders yet
      if(total > 0){
        $form.disable();
        $button.find("span.ui-button-text").text('Edit Job?');
        $(document).trigger('show.credControl');
        $button.unbind('click');
        $button.click($.proxy(changeOrder, this));
      }
      
    }
    
    function getUrls(){
      var $this = $(this.element),
      urls = [],
      $url_inputs = $this.find('#input_steps input');
      $url_inputs.each(function(){
        urls.push($(this).val());
      });
      return urls;
    }
    
    function getBrowsers(){
      var $this = $(this.element),
      $browser_inputs = $this.find('#browser_buttons input'),
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
      var $this = $(this.element);
      return $this.find('#short_time').val();
    }
    
    function createJob(callback){
      
      $.ajax({
        url : '/jobs/create',
        type : 'post',
        dataType: 'json',
        data : {job : jobData},
        success : function(data){
          if(typeof callback == 'function'){
            callback();
          }
        },
        error : function(xhr, text, er){
          console.log(xhr, text, er);
        }
      });
    }
    
    
    return $.extend(Object.create($.core.module), {
      render : function(){
        var $this = $(this.element);
        
        $this.find('button')
          .button() //make the button a button
          .click($.proxy(checkout, this)); 
          
        $(document).bind('createJob.stepControl', $.proxy(createJob, this));
      }      
    });
  };
})(jQuery);