/*
*Step 1 module
*
* handles page additions
*/
(function($){
  $.core.modules.step1 = function(){
    
    //regex for validating urls not that flexible
    var  urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;
    
    /*
    * return the amount of urls the user has entered
    */ 
    function getPageCount(){
      return $(this.element).find('input[value!=""]').length;
    }
    
    /*
    * function for adding additional UI inputs for pages
    */
    function addInput(){
      var $this = $(this.element)
      , $lastInput = $(this.element).find('input[type="text"]:last');
      if(!$lastInput.val().match(urlRegex)){
        $lastInput.addClass('error');
        this.displayError("Please enter a valid URL");
      }else{
        $lastInput.removeClass('error');
        this.clearErrors();
        $this.find('div#input_steps').append('<input type="text" />');
        
        //update the page count
        $(document).trigger("updateFieldCount.step4", ['page', getPageCount.call(this)]);
      }
    }
    
    /*
    * handles blur for removing empty inputs
    */
    function blurCheck(event){
      var $input = $(event.target);
      if((!$input.val() || $input.val() == '') && $(this.element).find('input').length > 1){
        $input.remove();
        
        //update the page count
        $(document).trigger("updatePageCount.step4", [getPageCount.call(this)]);
      }
    }
    
    /*
    * Handles enter keydown for the inputs
    */
    function inputEnter(event){
      if(event.keyCode == '13'){
        var $input = $(event.target);
        if($input.is(":last")){
          addInput.call(this);
          $input.next().focus();
        }
        return false;
      }
    }
    
    /*
    * Iterate over the UI inputs and validate the entered URLs
    */
    function checkPages(){
      var $this
      , inputs = $(this.element).find("input[type='text']");
      inputs.each(function(){
        var $this = $(this)
        ,errors = false;
        $this.removeClass('error');
        if(!$this.val().match(urlRegex)){
          $this.addClass('error');
          errors = true;
        }
      });
      if(errors){
        //$this.find('.flash_message').show();
        $this.displayError("Please enter a valid URL");
      }else{
        //$this.find('.flash_message').hide();
        $this.clearErrors();
      }
    }
    
    return $.extend(Object.create($.core.modules.broForm()), {
      render : function(){
        var that = this,
        $modDom = $(this.element);
        
        //Assign click event for adding new fields
        $modDom.find('a').click($.proxy(addInput, this));
        
        //Event for bluring empty inputs
        $modDom.find('input').live('blur', $.proxy(blurCheck, this));
        
        //event for pressing enter on inputs
        $modDom.find('input').live('keydown', $.proxy(inputEnter, this));
        
      }
    });
  };
})(jQuery);