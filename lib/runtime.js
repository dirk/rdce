// Leaking globals
var _rdce_called, _rdce_register, _rdce
// Closed functionality
(function(){
  if(typeof _rdce === 'undefined'){
    _rdce = {}
  }else{
    // Don't redefine rdce
    return
  }
  var store = _rdce.store = {}
  _rdce_register = function(sig){
    _rdce.store[sig] = 0
  }
  _rdce_called = function(sig){
    _rdce.store[sig] = (_rdce.store[sig] ? _rdce.store[sig] : 0) + 1
  }
  _rdce.buildReportData = function(){
    var used = [], unused = [], keys = Object.keys(store)
    keys.forEach(function(k){
      var v = store[k], item = {sig: k, count: v}
      if(v > 0){
        used.push(item)
      }else{
        unused.push(item)
      }
    })
    return {used: used, unused: unused}
  }
  _rdce.report = function(){
    var data = this.buildReportData(),
        sorter = function(a, b){ return a.sig.localeCompare(b.sig) },
        used   = data.used.sort(sorter)
        unused = data.unused.sort(sorter)
    // Build the report
    var printer = function(u){ report.push('  '+u.sig+' ('+u.count+')') }
    var report = ['RDCE REPORT', 'Live functions:']
    used.forEach(printer)
    report.push('')
    report.push('Dead functions:')
    unused.forEach(printer)
    console.log(report.join('\n'))
  }
})();
