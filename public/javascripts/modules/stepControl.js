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
      var errors = {};
      $form.find('input[type="text"]').each(function(){
        var $this = $(this);
        if($this.val() == '' || !$this.val()){
          errors['#step1'] = "Please enter a URL";
        }
      });
      
      if($form.find('input:checked').length <= 0){
        errors['#step2'] = "Please pick a browser";
      }                                       
      
      if(errors['#step2'] || errors['#step1']){
        console.log('errors omg');
        for(error in errors){
          $.validationEngine.buildPrompt(error,errors[error],'error');
        }
      }else{
        $.validationEngine.closePrompt("#step1");
        $.validationEngine.closePrompt("#step2");
        if("/" == window.location.pathname){
          $form.disable();
          $button.find("span.ui-button-text").text('Edit Job?');
          $(document).trigger('show.credControl');
          $button.unbind('click');
          $button.click($.proxy(changeOrder, this));
        }else{
          createJob.call(objScope);
        }
     }   
      
    }
    
    function getUrls(){
      var $this = $(this.element),
      urls = [],
      $url_inputs = $this.find('#input_steps input');
      $url_inputs.each(function(){
        var url = $(this).val();
        if(url.substr(0,7) != 'http://'){
          url = 'http://' + url;
        }
        urls.push(url.trim());
      });
      return urls;
    }
    
    function getBrowsers(){
      var $this = $(this.element),
      $browser_inputs = $this.find('#browser_buttons input:checked'),
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
          //console.log(xhr, text, er);
        }
      });
    }
    
    
    return $.extend(Object.create($.core.module), {
      render : function(){
        var $this = $(this.element);

          $(".update_job_button").each(function(){
              var $this = $(this);
              $this.button();
          });

        $this.find('button')
          .button() //make the button a button
          .click($.proxy(checkout, this)); 
          
        $(document).bind('createJob.stepControl', $.proxy(createJob, this));

          var $job_form = $("#new_job_form"),
              $link = $("#new_job_expand");

          $link.click(function(e){
              e.preventDefault();
              if ($job_form.is(':visible')) {
                  // Change text and hide form
                  $link.text("Create new job?");
                  $job_form.slideUp();
              }else{
                  // Change text and show form
                  $link.text("Hide form");
                  $job_form.slideDown();
              }
          });
      }                      
    });
  };
})(jQuery);
