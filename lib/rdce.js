var util = require('util')

// Matches "blah = function("
var varFunc   = /([\w.]+)\s*=\s*function\([^)]*\)[\w\n\r]*\{/g

// Matches "function blah("
var namedFunc = /(?:^|[\W])function\s+(\w+)\([^)]*\)[\w\n\r]*\{/g

// Applies one of the function matching regexes to the source and returns a
// new version of the source (updates `functions` with the signatures of
// found functions)
var applyRegex = function(regex, source, filename, functions){
  // Reset the regex
  regex.lastIndex = 0
  var match
  while((match = regex.exec(source)) !== null){
    var definition = match[0],// Entire match is the function definition
        name       = match[1],// Just the function's name
        sig        = util.inspect(filename+':'+name),// Build the signature
        index      = match.index
    // Append the `_rdce_called` call to the definition
    var newDefinition = definition+'_rdce_called('+sig+');'
    // Add the function to the registry
    functions[sig] = true
    // Then replace it
    source = source.substr(0, index) + newDefinition + source.substr(index + definition.length)
  }
  return source
}

var rdce = {
  process: function(filename, source){
    // Stores all the functions (using a hash to prevent duplicates easily)
    var functions = {}

    source = applyRegex(namedFunc, source, filename, functions)
    source = applyRegex(varFunc,   source, filename, functions)

    var preamble = Object.keys(functions).map(function(sig){
          return '_rdce_register('+sig+');'
        }).join('')
    return preamble+'\n'+source
  }//process
}

module.exports = rdce
