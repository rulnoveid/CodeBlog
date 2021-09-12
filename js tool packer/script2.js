 //<![CDATA[
 /*
 Packer version 3.0 (final) - copyright 2004-2007, Dean Edwards
 http://www.opensource.org/licenses/mit-license
*/

eval(base2.namespace);
eval(JavaScript.namespace);

var IGNORE = RegGrp.IGNORE;
var REMOVE = "";
var SPACE = " ";
var WORDS = /\w+/g;

var Packer = Base.extend({
 minify: function(script) {
  script = script.replace(Packer.CONTINUE, "");
  script = Packer.data.exec(script);
  script = Packer.whitespace.exec(script);
  script = Packer.clean.exec(script);
  return script;
 },
 
 pack: function(script, base62, shrink) {
  script = this.minify(script + "\n");
  if (shrink) script = this._shrinkVariables(script);
  if (base62) script = this._base62Encode(script); 
  return script;
 },
 
 _base62Encode: function(script) {
  var words = new Words(script);
  var encode = function(word) {
   return words.get(word).encoded;
  };
  
  /* build the packed script */
  
  var p = this._escape(script.replace(WORDS, encode));  
  var a = Math.min(Math.max(words.size(), 2), 62);
  var c = words.size();
  var k = words;
  var e = Packer["ENCODE" + (a > 10 ? a > 36 ? 62 : 36 : 10)];
  var r = a > 10 ? "e(c)" : "c";
  
  // the whole thing
  return format(Packer.UNPACK, p,a,c,k,e,r);
 },
 
 _escape: function(script) {
  // single quotes wrap the final string so escape them
  // also escape new lines required by conditional comments
  return script.replace(/([\\'])/g, "\\$1").replace(/[\r\n]+/g, "\\n");
 },
 
 _shrinkVariables: function(script) {
  // Windows Scripting Host cannot do regexp.test() on global regexps.
  var global = function(regexp) {
   // This function creates a global version of the passed regexp.
   return new RegExp(regexp.source, "g");
  };
  
  var data = []; // encoded strings and regular expressions
  var REGEXP = /^[^'"]\//;
  var store = function(string) {
   var replacement = "#" + data.length;
   if (REGEXP.test(string)) {
    replacement = string.charAt(0) + replacement;
    string = string.slice(1);
   }
   data.push(string);
   return replacement;
  };
  
  // Base52 encoding (a-Z)
  var encode52 = function(c) {
   return (c < 52 ? '' : arguments.callee(parseInt(c / 52))) +
    ((c = c % 52) > 25 ? String.fromCharCode(c + 39) : String.fromCharCode(c + 97));
  };
    
  // identify blocks, particularly identify function blocks (which define scope)
  var BLOCK = /(function\s*[\w$]*\s*\(\s*([^\)]*)\s*\)\s*)?(\{([^{}]*)\})/;
  var VAR_ = /var\s+/g;
  var VAR_NAME = /var\s+[\w$]+/g;
  var COMMA = /\s*,\s*/;
  var blocks = []; // store program blocks (anything between braces {})
  // encoder for program blocks
  var encode = function(block, func, args) {
   if (func) { // the block is a function block
   
    // decode the function block (THIS IS THE IMPORTANT BIT)
    // We are retrieving all sub-blocks and will re-parse them in light
    // of newly shrunk variables
    block = decode(block);
    
    // create the list of variable and argument names 
    var vars = match(block, VAR_NAME).join(",").replace(VAR_, "");
    var ids = Array2.combine(args.split(COMMA).concat(vars.split(COMMA)));
    
    // process each identifier
    var count = 0, shortId;
    forEach (ids, function(id) {
     id = trim(id);
     if (id && id.length > 1) { // > 1 char
      id = rescape(id);
      // find the next free short name (check everything in the current scope)
      do shortId = encode52(count++);
      while (new RegExp("[^\\w$.]" + shortId + "[^\\w$:]").test(block));
      // replace the long name with the short name
      var reg = new RegExp("([^\\w$.])" + id + "([^\\w$:])");
      while (reg.test(block)) block = block.replace(global(reg), "$1" + shortId + "$2");
      var reg = new RegExp("([^{,\\w$.])" + id + ":", "g");
      block = block.replace(reg, "$1" + shortId + ":");
     }
    });
   }
   var replacement = "~" + blocks.length + "~";
   blocks.push(block);
   return replacement;
  };
  
  // decoder for program blocks
  var ENCODED = /~(\d+)~/;
  var decode = function(script) {
   while (ENCODED.test(script)) {
    script = script.replace(global(ENCODED), function(match, index) {
     return blocks[index];
    });
   }
   return script;
  };
  
  // encode strings and regular expressions
  script = Packer.data.exec(script, store);
  
  // remove closures (this is for base2 namespaces only)
  script = script.replace(/new function\(_\)\s*\{/g, "{;#;");
  
  // encode blocks, as we encode we replace variable and argument names
  while (BLOCK.test(script)) {
   script = script.replace(global(BLOCK), encode);
  }
  
  // put the blocks back
  script = decode(script);
  
  // put back the closure (for base2 namespaces only)
  script = script.replace(/\{;#;/g, "new function(_){");
  
  // put strings and regular expressions back
  script = script.replace(/#(\d+)/g, function(match, index) {  
   return data[index];
  });
  
  return script;
 }
}, {
 CONTINUE: /\\\r?\n/g,
 
 ENCODE10: "String",
 ENCODE36: "function(c){return c.toString(a)}",
 ENCODE62: "function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))}",
 
 UNPACK: "eval(function(p,a,c,k,e,r){e=%5;if(!''.replace(/^/,String)){while(c--)r[%6]=k[c]" +
         "||%6;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p." +
   "replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('%1',%2,%3,'%4'.split('|'),0,{}))",
 
 init: function() {
  this.data = reduce(this.data, function(data, replacement, expression) {
   data.put(this.javascript.exec(expression), replacement);
   return data;
  }, new RegGrp, this);
  this.clean = this.data.union(this.clean);
  this.whitespace = this.data.union(this.whitespace);
 },
 
 clean: {
  "\\(\\s*;\\s*;\\s*\\)": "(;;)", // for (;;) loops
  "throw[^};]+[};]": IGNORE, // a safari 1.3 bug
  ";+\\s*([};])": "$1"
 },
 
 data: {
  // strings
  "STRING1": IGNORE,
  'STRING2': IGNORE,
  "CONDITIONAL": IGNORE, // conditional comments
  "(COMMENT1)\\n\\s*(REGEXP)?": "\n$3",
  "(COMMENT2)\\s*(REGEXP)?": " $3",
  "([\\[(\\^=,{}:;&|!*?])\\s*(REGEXP)": "$1$2"
 },
 
 javascript: new RegGrp({
  COMMENT1:    /(\/\/|;;;)[^\n]*/.source,
  COMMENT2:    /\/\*[^*]*\*+([^\/][^*]*\*+)*\//.source,
  CONDITIONAL: /\/\*@|@\*\/|\/\/@[^\n]*\n/.source,
  REGEXP:      /\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*/.source,
  STRING1:     /'(\\.|[^'\\])*'/.source,
  STRING2:     /"(\\.|[^"\\])*"/.source
 }),
 
 whitespace: {
  "(\\d)\\s+(\\.\\s*[a-z\\$_\\[(])": "$1 $2", // http://dean.edwards.name/weblog/2007/04/packer3/#comment84066
  "([+-])\\s+([+-])": "$1 $2", // c = a++ +b;
  "\\b\\s+\\$\\s+\\b": " $ ", // var $ in
  "\\$\\s+\\b": "$ ", // object$ in
  "\\b\\s+\\$": " $", // return $object
  "\\b\\s+\\b": SPACE,
  "\\s+": REMOVE
 }
});
//]]>
 </script><script>
 //<![CDATA[
var Words = Collection.extend({
 constructor: function(script) {
  this.base();
  forEach (script.match(WORDS), this.add, this);
  this.encode();
 },
 
 add: function(word) {
  if (!this.has(word)) this.base(word);
  word = this.get(word);
  word.count++;
  return word;
 },
 
 encode: function() {
  // sort by frequency
  this.sort(function(word1, word2) {
   return word2.count - word1.count;
  });
  
  eval("var a=62,e=" + Packer.ENCODE62);
  var encode = e;  
  var encoded = new Collection; // a dictionary of base62 -> base10
  var count = this.size();
  for (var i = 0; i < count; i++) {
   encoded.put(encode(i), i);
  }
  
  var empty = function() {return ""};
  var index = 0;
  forEach (this, function(word) {
   if (encoded.has(word)) {
    word.index = encoded.get(word);
    word.toString = empty;
   } else {
    while (this.has(encode(index))) index++;
    word.index = index++;
   }
   word.encoded = encode(word.index);
  }, this);
  
  // sort by encoding
  this.sort(function(word1, word2) {
   return word1.index - word2.index;
  });
 },
 
 toString: function() {
  return this.getValues().join("|");
 }
}, {
 Item: {
  constructor: function(word) {
   this.toString = function() {return word};
  },
  
  count: 0,
  encoded: "",
  index: -1
 }
});
//]]>
 </script><br />
<script>
 //<![CDATA[
var packer = new Packer;

new base2.JSB.RuleList({
 "#form": {
  ondocumentready: function() {
   this.removeClass("disabled");
   output.value = "";
   this.ready();
  },
  
  ready: function() {
   message.write("ready");
   input.focus();
  }
 },
 "#input,#output": {
  disabled: false,
  spellcheck: false // for mozilla
 },
 "#clear-all": {
  disabled: false,
  
  onclick: function() {
   input.value = "";
   output.value = "";
   uploadScript.style.display = "";
   loadScript.style.display = "";
   uploadScript.disabled = true;
   saveScript.disabled = false;
   form.ready();
  }
 },
 "#pack-script": {
  disabled: false,
  
  onclick: function() {
   try {
    output.value = "";
    if (input.value) {
     var value = packer.pack(input.value, base62.checked, shrink.checked);
     output.value = value;
     message.update();
    }
   } catch (error) {
    message.error("error packing script", error);
   } finally {
    saveScript.disabled = !output.value;
    decodeScript.disabled = !output.value || !base62.checked;
   }
  }
 },
 "#load-script": {
  disabled: false,
  
  onclick: function() {
   uploadScript.style.display = "inline";
   uploadScript.disabled = false;
   this.style.display = "none";
  }
 },
 "#save-script": {
  onclick: function() {
   form.command.value = "save";
  }
 },
 "#decode-script": {  
  onclick: function() {
   try {
    if (output.value) {
     var start = new Date;
     eval("var value=String" + output.value.slice(4));
     var stop = new Date;
     output.value = value;
     message.update("unpacked in " + (stop - start) + " milliseconds");
    }
   } catch (error) {
    message.error("error decoding script", error);
   } finally {
    decodeScript.blur();
    decodeScript.disabled = true;
   }
  }
 },
 "#upload-script": {
  onchange: function() {
   form.encoding = "multipart/form-data";
   form.command.value = "load";
   form.submit();
  }
 },
 "#base62,#shrink": {
  disabled: false
 },
 "#message": {
  error: function(text, error) {
   this.write(text + ": " + error.message, "error");
  },
  
  update: function(message) {
   var length = input.value.length;
   if (!/\r/.test(input.value)) { // mozilla trims carriage returns
    length += match(input.value, /\n/g).length;
   }
   var calc = output.value.length + "/" + length;
   var ratio = (output.value.length / length).toFixed(3);
   this.write((message ? message + ", " : "") + format("compression ratio: %1=%2", calc, ratio));
  },
  
  write: function(text, className) {
   this.innerHTML = text;
   this.className = className || "";
  } 
 }
});

if (!(0).toFixed) Number.prototype.toFixed = function(n) {
 var e = Math.pow(10, n);
 var r = String(Math.round(this * e));
 if (r == 0) for (var i = 0; i < n; i++) r += "0";
 return r.slice(0, r.length - n) + "." + r.slice(r.length - n);
};
//]]>