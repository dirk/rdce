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
  _rdce.report = function(){
    var used = [], unused = [], keys = Object.keys(store)
    keys.forEach(function(k){
      var v = store[k]
      if(v > 0){
        used.push(k)
      }else{
        unused.push(k)
      }
    })
    var sorter = function(a, b){ return a.localeCompare(b) }
    used   = used.sort(sorter)
    unused = unused.sort(sorter)
    // Build the report
    var report = ['RDCE REPORT', 'Live functions:']
    used.forEach(function(u){ report.push('  '+u) })
    report.push('')
    report.push('Dead functions:')
    unused.forEach(function(u){ report.push('  '+u) })
    console.log(report.join('\n'))
  }
})();
