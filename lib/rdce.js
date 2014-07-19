var util = require('util')

// Matches "blah = function("
var varFunc   = /([\w.]+)\s*=\s*function\([^)]*\)\{/

// Matches "function blah("
var namedFunc = /(?:^|[\W])function\s+(\w+)\([^)]*\)\{/

var rdce = {
  process: function(filename, source){
    // Replace any whitespace between ) and { to make our lives easier.
    source = source.replace(/\)[\w\n\r]+\{/, '){')

    var functions = {},
        lines = source.split(/\r?\n/)
    // Find functions in every line
    lines = lines.map(function(line){
      var match = null
      if((match = line.match(namedFunc)) || (match = line.match(varFunc))){
        var defn = match[0],
            name = match[1],
            sig = util.inspect(filename+':'+name)
        newdefn = defn+'_rdce_called('+sig+');'
        // Add the function to the registry
        functions[sig] = true
        return line.replace(defn, newdefn)
      }
      return line
    })
    var newsource = lines.join('\n'),
        preamble = Object.keys(functions).map(function(sig){
          return '_rdce_register('+sig+');'
        }).join('')
    return preamble+'\n'+newsource
  }//process
}

module.exports = rdce
