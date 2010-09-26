//= require <vendor/json2>

(function($){

  $.core = (function(){ 
       
    // Site config variables go here.
    var moduleData = {}
    ,debug = true;
    
    
    // Error logging.
    function log(sev, msg) {
      if (!debug) {
        var img = new Image();
        img.src = "/log.php?sev=" + encodeURIComponent(sev) + "&msg=" + encodeURIComponent(msg);
      } else {
        if (window.console) {
          console.log(sev + " " + msg);
        } else {
          alert(sev + " " + msg);
        }
      }
    } // End log()
    
    if(!window.console){
      window.console = {log : function(){}};
    }
    
    // createInstance()
    // The instantation function for modules.
    function createInstance(moduleName){
      var instance = moduleData[moduleName].creator()
          ,method;
            
      // Test all the methods on this instance, log any that are broken.
      for (var name in instance) {
          if(instance.hasOwnProperty(name)){
          method = instance[name];
                    
          if (typeof method == "function") {
            instance[name] = function(name, method){
              return function(){
                try {
                  return method.apply(this, arguments);
                } catch(ex) {
                  log(1, moduleName + ": " + name + "(): " + ex.message);
                }
              };
            }(name, method);
          }
        }
      }
      return instance;
    }
    
    /*
    // Start of public api for core
    */
    return{
      // Global init function calls a controller and method.
      init: function() {
        // Start the modules once the page controller action has been initialized.
        this.startAllModules();
      },
      
      log : function(sev, msg){
        log(sev, msg);
      },

      toggleDebug : function(){
        debug = (debug === false) ? true : false;
      },
      
      modules : {},
      
      /******************************************
      * Base module class. Most modules should extend this
      *
      *
      */
      module : (function(){
        
        /*
        * private plugin setup
        * lets us call the modules as jquery plugins $('module_element').moduleName()
        */
          function pluginify(className){
            var pluginObj = {};
            pluginObj[className] = function(options) {
              return this.each(function(){
                
                  // Create a new module object
                  var moduleObj = Object.create(moduleData[className].instance);
                  
                  //initialize our object for the plugin
                  moduleObj.init(options, this);

                  // Save the reference to the feeder in the elem's data object
                  $(this).data(className, moduleObj);
              });
            }
            $.fn.extend(pluginObj);
          }
        
        /*
        * Default module api
        *
        */
        return{
         options : {
             className: "module"
          },
          
          register : function(){
            pluginify(this.options.className);
            moduleData[this.options.className].status = "plugin ready";
          },
          
          init : function(options, elem){
            moduleData[this.options.className].status = "init";
            // Overload the passed in options with any default options
            this.options = $.extend({}, this.options, options);
                        
            // Set the relative element as the passed in element
            this.element = elem;

            // render this module on the DOM
            this.render();
          },
          
          render: function(){
            $(this.element).addClass(this.options.className);
          }

        };
      
      })(),
      /***************
      * end module base
      */
      
      registerModules: function(moduleNames) {
        var that = this;
        if(typeof moduleNames == "string"){
          moduleNames = moduleNames.split(',');
        }
        
        $.each(moduleNames, function(index, moduleName){
          moduleName = moduleName.trim();
          if (typeof that.modules[moduleName] == "function") {
            moduleData[moduleName] = {
              creator: that.modules[moduleName],
              status : 'registered'
            };
          } else {
            log(1, "module '" + moduleName + "' does not exist or was not loaded properly.");
          }
        });
      },
      
            
      startModule: function(moduleName){
        moduleData[moduleName].instance = createInstance.call(this, moduleName);
        moduleData[moduleName].instance.options.className = moduleName;
        try {
          moduleData[moduleName].instance.register();
        } catch(ex) {
          log(1, "failed to initialize " + moduleName + ", " + ex.message);
        }
      },
      
      stopModule: function(moduleName){
        if(moduleName){
          var data = moduleData[moduleName];
          if(data.instance){
            try{
              data.instance.destroy();
              data.instance = null;
            }
            catch(ex){
              log(1, "could not destroy "+moduleName+"  "+ex.message);
            }
          }
        }
      },
      
      startAllModules : function(){
        for (var moduleName in moduleData){
          if(moduleData.hasOwnProperty(moduleName)){
            this.startModule(moduleName);
          }
        }
      },
      
      stopAllModules: function(){
        for(var moduleName in moduleData){
          if(moduleData.hasOwnProperty(moduleName)){
            this.stopModule(moduleName);
          }
        }
      },
      
      listLoadedModules : function(){
        for(var moduleName in moduleData){
          if(moduleData.hasOwnProperty(moduleName)){
            log(moduleName, moduleData[moduleName].status);
          }
        }
      }
      
    };
  })();
  
}(jQuery));