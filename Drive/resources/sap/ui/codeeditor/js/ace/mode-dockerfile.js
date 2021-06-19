ace.define("ace/mode/sh_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text_highlight_rules").TextHighlightRules;var a=e.reservedKeywords=('!|{|}|case|do|done|elif|else|'+'esac|fi|for|if|in|then|until|while|'+'&|;|export|local|read|typeset|unset|'+'elif|select|set|function|declare|readonly');var l=e.languageConstructs=('[|]|alias|bg|bind|break|builtin|'+'cd|command|compgen|complete|continue|'+'dirs|disown|echo|enable|eval|exec|'+'exit|fc|fg|getopts|hash|help|history|'+'jobs|kill|let|logout|popd|printf|pushd|'+'pwd|return|set|shift|shopt|source|'+'suspend|test|times|trap|type|ulimit|'+'umask|unalias|wait');var S=function(){var k=this.createKeywordMapper({"keyword":a,"support.function.builtin":l,"invalid.deprecated":"debugger"},"identifier");var i="(?:(?:[1-9]\\d*)|(?:0))";var f="(?:\\.\\d+)";var b="(?:\\d+)";var p="(?:(?:"+b+"?"+f+")|(?:"+b+"\\.))";var c="(?:(?:"+p+"|"+b+")"+")";var d="(?:"+c+"|"+p+")";var g="(?:&"+b+")";var v="[a-zA-Z_][a-zA-Z0-9_]*";var h="(?:"+v+"(?==))";var j="(?:\\$(?:SHLVL|\\$|\\!|\\?))";var n="(?:"+v+"\\s*\\(\\))";this.$rules={"start":[{token:"constant",regex:/\\./},{token:["text","comment"],regex:/(^|\s)(#.*)$/},{token:"string.start",regex:'"',push:[{token:"constant.language.escape",regex:/\\(?:[$`"\\]|$)/},{include:"variables"},{token:"keyword.operator",regex:/`/},{token:"string.end",regex:'"',next:"pop"},{defaultToken:"string"}]},{token:"string",regex:"\\$'",push:[{token:"constant.language.escape",regex:/\\(?:[abeEfnrtv\\'"]|x[a-fA-F\d]{1,2}|u[a-fA-F\d]{4}([a-fA-F\d]{4})?|c.|\d{1,3})/},{token:"string",regex:"'",next:"pop"},{defaultToken:"string"}]},{regex:"<<<",token:"keyword.operator"},{stateName:"heredoc",regex:"(<<-?)(\\s*)(['\"`]?)([\\w\\-]+)(['\"`]?)",onMatch:function(q,s,t){var u=q[2]=='-'?"indentedHeredoc":"heredoc";var w=q.split(this.splitRegex);t.push(u,w[4]);return[{type:"constant",value:w[1]},{type:"text",value:w[2]},{type:"string",value:w[3]},{type:"support.class",value:w[4]},{type:"string",value:w[5]}];},rules:{heredoc:[{onMatch:function(q,s,t){if(q===t[1]){t.shift();t.shift();this.next=t[0]||"start";return"support.class";}this.next="";return"string";},regex:".*$",next:"start"}],indentedHeredoc:[{token:"string",regex:"^\t+"},{onMatch:function(q,s,t){if(q===t[1]){t.shift();t.shift();this.next=t[0]||"start";return"support.class";}this.next="";return"string";},regex:".*$",next:"start"}]}},{regex:"$",token:"empty",next:function(q,s){if(s[0]==="heredoc"||s[0]==="indentedHeredoc")return s[0];return q;}},{token:["keyword","text","text","text","variable"],regex:/(declare|local|readonly)(\s+)(?:(-[fixar]+)(\s+))?([a-zA-Z_][a-zA-Z0-9_]*\b)/},{token:"variable.language",regex:j},{token:"variable",regex:h},{include:"variables"},{token:"support.function",regex:n},{token:"support.function",regex:g},{token:"string",start:"'",end:"'"},{token:"constant.numeric",regex:d},{token:"constant.numeric",regex:i+"\\b"},{token:k,regex:"[a-zA-Z_][a-zA-Z0-9_]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|~|<|>|<=|=>|=|!=|[%&|`]"},{token:"punctuation.operator",regex:";"},{token:"paren.lparen",regex:"[\\[\\(\\{]"},{token:"paren.rparen",regex:"[\\]]"},{token:"paren.rparen",regex:"[\\)\\}]",next:"pop"}],variables:[{token:"variable",regex:/(\$)(\w+)/},{token:["variable","paren.lparen"],regex:/(\$)(\()/,push:"start"},{token:["variable","paren.lparen","keyword.operator","variable","keyword.operator"],regex:/(\$)(\{)([#!]?)(\w+|[*@#?\-$!0_])(:[?+\-=]?|##?|%%?|,,?\/|\^\^?)?/,push:"start"},{token:"variable",regex:/\$[*@#?\-$!0_]/},{token:["variable","paren.lparen"],regex:/(\$)(\{)/,push:"start"}]};this.normalizeRules();};o.inherits(S,T);e.ShHighlightRules=S;});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(r,e,a){"use strict";var o=r("../../lib/oop");var R=r("../../range").Range;var B=r("./fold_mode").FoldMode;var F=e.FoldMode=function(c){if(c){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+c.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+c.end));}};o.inherits(F,B);(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/;this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/;this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/;this._getFoldWidgetBase=this.getFoldWidget;this.getFoldWidget=function(s,f,b){var l=s.getLine(b);if(this.singleLineBlockCommentRe.test(l)){if(!this.startRegionRe.test(l)&&!this.tripleStarBlockCommentRe.test(l))return"";}var c=this._getFoldWidgetBase(s,f,b);if(!c&&this.startRegionRe.test(l))return"start";return c;};this.getFoldWidgetRange=function(s,f,b,c){var l=s.getLine(b);if(this.startRegionRe.test(l))return this.getCommentRegionBlock(s,l,b);var m=l.match(this.foldingStartMarker);if(m){var i=m.index;if(m[1])return this.openingBracketBlock(s,m[1],b,i);var d=s.getCommentFoldRange(b,i+m[0].length,1);if(d&&!d.isMultiLine()){if(c){d=this.getSectionRange(s,b);}else if(f!="all")d=null;}return d;}if(f==="markbegin")return;var m=l.match(this.foldingStopMarker);if(m){var i=m.index+m[0].length;if(m[1])return this.closingBracketBlock(s,m[1],b,i);return s.getCommentFoldRange(b,i,-1);}};this.getSectionRange=function(s,b){var l=s.getLine(b);var c=l.search(/\S/);var d=b;var f=l.length;b=b+1;var g=b;var m=s.getLength();while(++b<m){l=s.getLine(b);var i=l.search(/\S/);if(i===-1)continue;if(c>i)break;var h=this.getFoldWidgetRange(s,"all",b);if(h){if(h.start.row<=d){break;}else if(h.isMultiLine()){b=h.end.row;}else if(c==i){break;}}g=b;}return new R(d,f,g,s.getLine(g).length);};this.getCommentRegionBlock=function(s,l,b){var c=l.search(/\s*$/);var d=s.getLength();var f=b;var g=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;var h=1;while(++b<d){l=s.getLine(b);var m=g.exec(l);if(!m)continue;if(m[1])h--;else h++;if(!h)break;}var i=b;if(i>f){return new R(f,c,i,l.length);}};}).call(F.prototype);});ace.define("ace/mode/sh",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/sh_highlight_rules","ace/range","ace/mode/folding/cstyle","ace/mode/behaviour/cstyle"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text").Mode;var S=r("./sh_highlight_rules").ShHighlightRules;var R=r("../range").Range;var C=r("./folding/cstyle").FoldMode;var a=r("./behaviour/cstyle").CstyleBehaviour;var M=function(){this.HighlightRules=S;this.foldingRules=new C();this.$behaviour=new a();};o.inherits(M,T);(function(){this.lineCommentStart="#";this.getNextLineIndent=function(s,l,t){var i=this.$getIndent(l);var c=this.getTokenizer().getLineTokens(l,s);var d=c.tokens;if(d.length&&d[d.length-1].type=="comment"){return i;}if(s=="start"){var f=l.match(/^.*[\{\(\[:]\s*$/);if(f){i+=t;}}return i;};var b={"pass":1,"return":1,"raise":1,"break":1,"continue":1};this.checkOutdent=function(s,l,i){if(i!=="\r\n"&&i!=="\r"&&i!=="\n")return false;var t=this.getTokenizer().getLineTokens(l.trim(),s).tokens;if(!t)return false;do{var c=t.pop();}while(c&&(c.type=="comment"||(c.type=="text"&&c.value.match(/^\s+$/))));if(!c)return false;return(c.type=="keyword"&&b[c.value]);};this.autoOutdent=function(s,d,c){c+=1;var i=this.$getIndent(d.getLine(c));var t=d.getTabString();if(i.slice(-t.length)==t)d.remove(new R(c,i.length-t.length,c,i.length));};this.$id="ace/mode/sh";}).call(M.prototype);e.Mode=M;});ace.define("ace/mode/dockerfile_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/sh_highlight_rules"],function(r,e,m){"use strict";var o=r("../lib/oop");var S=r("./sh_highlight_rules").ShHighlightRules;var D=function(){S.call(this);var s=this.$rules.start;for(var i=0;i<s.length;i++){if(s[i].token=="variable.language"){s.splice(i,0,{token:"constant.language",regex:"(?:^(?:FROM|MAINTAINER|RUN|CMD|EXPOSE|ENV|ADD|ENTRYPOINT|VOLUME|USER|WORKDIR|ONBUILD|COPY|LABEL)\\b)",caseInsensitive:true});break;}}};o.inherits(D,S);e.DockerfileHighlightRules=D;});ace.define("ace/mode/dockerfile",["require","exports","module","ace/lib/oop","ace/mode/sh","ace/mode/dockerfile_highlight_rules","ace/mode/folding/cstyle"],function(r,e,m){"use strict";var o=r("../lib/oop");var S=r("./sh").Mode;var D=r("./dockerfile_highlight_rules").DockerfileHighlightRules;var C=r("./folding/cstyle").FoldMode;var M=function(){S.call(this);this.HighlightRules=D;this.foldingRules=new C();};o.inherits(M,S);(function(){this.$id="ace/mode/dockerfile";}).call(M.prototype);e.Mode=M;});(function(){ace.require(["ace/mode/dockerfile"],function(m){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=m;}});})();
