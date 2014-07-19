// Leaking globals
var _rdce_called, _rdce_register, _rdce = {};
// Closed functionality
(function(){
  var store = _rdce.store = {}
  _rdce_register = function(sig){
    _rdce.store[sig] = 0
  }
  _rdce_called = function(sig){
    _rdce.store[sig] = (_rdce.store[sig] ? _rdce.store[sig] : 0) + 1
  }
})();
