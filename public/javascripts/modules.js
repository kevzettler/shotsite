//= require <jCore>

//modules is actually the sandbox object where the modules play.
//modules controlls the modules in an observer role
/*
core.modules is the sandbox that the modules play in
it plays an event pool/observer role with listen and notify methods so the modules
can interact with eachother in a loosely coupled environment
*/
jCore.modules = function(){
  var events = {};
  
  return{
    //register a listener with the sandbox
    listen: function(eventArray, callback, module){
      for (var i = 0; i<eventArray.length; i++) {
        if (typeof events[eventArray[i]] !== 'object') {
          events[eventArray[i]] = [];
        }
        
        events[eventArray[i]].push({ 
          scope: module,
          method: callback
        });
      }
    },
    // Notifiy any listeners that some event has been called
    notify: function(eventObj, callback){
      var sandboxEvent = events[eventObj.type];
      
      if (typeof sandboxEvent !== 'object') {
        core.log(1, eventObj.type+" is not a registered sandbox event");
      } else {
        for (var i=0; i<sandboxEvent.length; i++) {
          try{
            sandboxEvent[i].method.call(sandboxEvent[i].scope, eventObj.data);
          }catch (ex){
            core.log(1, "sandbox fail: "+ eventObj.data.type);
          }
        }
      }
      
      if(typeof callback == 'function'){
        callback();
      }
    },
    listEvents: function(){
      for (var event in events) {
        core.log(event, events[event]);
      }
    },
    findEvent : function(event_name){
      if(typeof events[event_name] == 'object'){
        for(var i=0; i< events[event_name].length; i++){
          console.log(events[event_name][i].scope, events[event_name][i].method.call(events[event_name][i].scope));
        }
      }else{
        core.log(4, event_name + " is not registered ");
      }
    }
  };
}();