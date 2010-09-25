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

    /*
    * Rough draft newJob
    */
    function newJob(event){
      var $this = $(this.element) 
      ,$button = $this.find("button#create_job")
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
          job: {
              urls: JSON.stringify(getUrls.call(objScope)),
              browsers: JSON.stringify(getBrowsers.call(objScope)),
              interval: getInterval.call(objScope)
          }
      };

        // Create job
        $.ajax({
            url : $form.attr('action'),
            type : 'POST',
            data : jobData,
            dataType : "json",
            success : function(json){
                console.log("Job created!");
                //objScope.clearErrors();
            },
            error :function(xhr, txt, er){
                console.log("failed to create job");

            }
        });
        return false;
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
        urls.push(url);
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
          console.log(xhr, text, er);
        }
      });
    }
    
    
    return $.extend(Object.create($.core.module), {
      render : function(){
        var $this = $(this.element);

          // TODO:
          // Ugh. Don't hardcode urls like this. Make it nicer.
          var func;

          console.log(window.location.pathname);
          if ("/" == window.location.pathname) {
              console.log("We're at the root url, using checkout");
              func = checkout;
          }else{
              console.log("We're *not* at the root url, using newJob");
              func = newJob;
          }

          $(".update_job_button").each(function(){
              var $this = $(this);
              $this.button();
          });

        $this.find('button')
          .button() //make the button a button
          .click($.proxy(func, this)); 
          
        $(document).bind('createJob.stepControl', $.proxy(createJob, this));

          var $job_form = $("#new_job_form"),
              $link = $("#new_job_expand");

          console.log("New job link: ", $link);

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
