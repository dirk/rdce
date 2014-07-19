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
      var v = store[k], pair = [k, v]
      if(v > 0){
        used.push(pair)
      }else{
        unused.push(pair)
      }
    })
    var sorter = function(a, b){ return a[0].localeCompare(b[0]) }
    used   = used.sort(sorter)
    unused = unused.sort(sorter)
    // Build the report
    var printer = function(u){ report.push('  '+u[0]+' ('+u[1]+')') }
    var report = ['RDCE REPORT', 'Live functions:']
    used.forEach(printer)
    report.push('')
    report.push('Dead functions:')
    unused.forEach(printer)
    console.log(report.join('\n'))
  }
})();
