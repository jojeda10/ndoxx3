/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/base/assert','sap/ui/Device','sap/ui/commons/library'],function(a,D,c){"use strict";var S=c.layout.Separation;var P=c.layout.Padding;var B=c.layout.BackgroundDesign;var V=c.layout.VAlign;var H=c.layout.HAlign;var M={};M.render=function(r,m){var R=sap.ui.getCore().getConfiguration().getRTL();var i=0;var j=0;var b=0;var l=0;var o;var C;var d;var e;var f;var s;var v;var g;r.write("<table role=\"presentation\"");r.writeControlData(m);r.write(" cellpadding=\"0\" cellspacing=\"0\"");r.addStyle("border-collapse","collapse");var h=m.getWidth();if(h){r.addStyle("width",h);}var k=m.getHeight();if(k&&k!='auto'){r.addStyle("height",k);e=M.getValueUnit(k);}if(m.getLayoutFixed()){r.addStyle("table-layout","fixed");if(!h){r.addStyle("width","100%");}}r.addClass("sapUiMlt");r.writeStyles();r.writeClasses();if(m.getTooltip_AsString()){r.writeAttributeEscaped('title',m.getTooltip_AsString());}r.write('>');var n=m.getRows();var p=m.getColumns();if(p<1){for(i=0;i<n.length;i++){o=n[i];C=o.getCells();if(p<C.length){p=C.length;}}}if(p>0){var w=m.getWidths();r.write("<colgroup>");for(j=0;j<p;j++){r.write("<col");if(w&&w[j]&&w[j]!="auto"){r.addStyle('width',w[j]);r.writeStyles();}r.write(">");}r.write("</colgroup>");}var q=true;var t=false;r.write('<tbody style="width: 100%; height: 100%">');for(i=0;i<n.length;i++){o=n[i];var u=o.getHeight();if(u=="auto"){u="";}if(u&&e){f=M.getValueUnit(u);if(f.Unit=='%'&&e.Unit!='%'){u=(e.Value*f.Value/100)+e.Unit;}}r.write("<tr");r.writeElementData(o);r.writeClasses(o);if(o.getTooltip_AsString()){r.writeAttributeEscaped('title',o.getTooltip_AsString());}g=D.browser.edge||D.browser.msie&&D.browser.version>=9;if(g&&u){r.addStyle("height",u);r.writeStyles();}r.write(">");C=o.getCells();var y=p;if(p<1){y=C.length;}t=false;var z=0;if(!o.RowSpanCells){o.RowSpanCells=0;}else{t=true;}for(j=0;j<y;j++){if(j>=(y-z-o.RowSpanCells)){break;}var A=C[j];r.write("<td");if(u&&(!A||A.getRowSpan()==1)){r.addStyle("height",u);}if(A){r.writeElementData(A);if(A.getTooltip_AsString()){r.writeAttributeEscaped('title',A.getTooltip_AsString());}if(m.getLayoutFixed()&&A.getContent().length>0){r.addStyle("overflow","hidden");}var E=M.getHAlignClass(A.getHAlign(),R);if(E){r.addClass(E);}v=M.getVAlign(A.getVAlign());if(v){r.addStyle("vertical-align",v);}if(A.getColSpan()>1){r.writeAttribute("colspan",A.getColSpan());z=z+A.getColSpan()-1;t=true;}if(A.getRowSpan()>1){r.writeAttribute("rowspan",A.getRowSpan());var F=0;var U="";for(var x=0;x<A.getRowSpan();x++){var G=n[i+x];if(!G){U=false;break;}if(!G.RowSpanCells){G.RowSpanCells=0;}if(x>0){G.RowSpanCells=G.RowSpanCells+A.getColSpan();}var I=G.getHeight();if(!I||I=="auto"){U=false;}else{var J=M.getValueUnit(I);if(J.Unit=='%'&&e.Unit!='%'){J.Value=(e.Value*f.Value/100);J.Unit=e.Unit;}if(U==""){U=J.Unit;}else if(U!=J.Unit){U=false;}F=F+J.Value;}}if(U!=false){s=F+U;r.addStyle("height",s);}}r.addClass(M.getBackgroundClass(A.getBackgroundDesign()));r.addClass(M.getSeparationClass(A.getSeparation()));if(!m.getLayoutFixed()||!u){r.addClass(M.getPaddingClass(A.getPadding()));r.addClass("sapUiMltCell");}else{r.addStyle("white-space","nowrap");}r.writeClasses(A);}r.writeStyles();r.write(">");if(A){if(m.getLayoutFixed()&&u){r.write('<div');if(A.getRowSpan()!=1&&s&&s.search('%')==-1){r.addStyle("height",s);}else if(u.search('%')!=-1||(A.getRowSpan()!=1&&!s)){r.addStyle("height",'100%');}else{r.addStyle("height",u);}r.addStyle("display","inline-block");if(v){r.addStyle("vertical-align",v);}r.writeStyles();r.writeClasses(false);r.write("></div>");r.write('<div');r.addStyle("display","inline-block");if(v){r.addStyle("vertical-align",v);}if(A.getRowSpan()!=1&&s&&s.search('%')==-1){r.addStyle("max-height",s);}else if(u.search('%')!=-1||(A.getRowSpan()!=1&&!s)){r.addStyle("max-height",'100%');}else{r.addStyle("max-height",u);}var K="0";var L="";var N="0";d=A.getContent();for(b=0,l=d.length;b<l;b++){if(d[b].getHeight&&d[b].getHeight()!=""){var O=M.getValueUnit(d[b].getHeight());if(O){if(L==""){L=O.Unit;}if(L!=O.Unit){L="%";K="100";break;}if(O.Unit=="%"){if(parseFloat(K)<parseFloat(O.Value)){K=O.Value;if(K!="100"){N=10000/parseFloat(K);}}}}}}if(K!="0"){r.addStyle("height",K+L);}r.addStyle("white-space","normal");r.addStyle("width","100%");r.writeStyles();r.writeClasses(false);r.write("><div");r.addStyle("overflow","hidden");r.addStyle("text-overflow","inherit");if(K!="0"){if(N!="0"){r.addStyle("height",N+"%");}else{r.addStyle("height","100%");}}r.addClass("sapUiMltCell");r.addClass(M.getPaddingClass(A.getPadding()));r.writeStyles();r.writeClasses(false);r.write(">");}d=A.getContent();for(b=0,l=d.length;b<l;b++){r.renderControl(d[b]);}if(m.getLayoutFixed()&&u){r.write("</div></div>");}}r.write("</td>");}r.write("</tr>");o.RowSpanCells=undefined;if(!t){q=false;}}if(q&&D.browser.msie&&D.browser.version>=9){r.write("<tr style='height:0;'>");for(i=0;i<p;i++){r.write("<td></td>");}r.write("</tr>");}r.write("</tbody></table>");};M.getHAlignClass=function(h,r){var C="sapUiMltCellHAlign";switch(h){case H.Begin:return null;case H.Center:return C+"Center";case H.End:return C+(r?"Left":"Right");case H.Left:return r?C+"Left":null;case H.Right:return r?null:C+"Right";default:a(false,"MatrixLayoutRenderer.getHAlign: oHAlign must be a known value");return null;}};M.getVAlign=function(v){switch(v){case V.Bottom:return"bottom";case V.Middle:return"middle";case V.Top:return"top";default:a(false,"MatrixLayoutRenderer.getVAlign: oVAlign must be a known value");return null;}};M.getBackgroundClass=function(b){switch(b){case B.Border:return"sapUiMltBgBorder";case B.Fill1:return"sapUiMltBgFill1";case B.Fill2:return"sapUiMltBgFill2";case B.Fill3:return"sapUiMltBgFill3";case B.Header:return"sapUiMltBgHeader";case B.Plain:return"sapUiMltBgPlain";case B.Transparent:return null;default:a(false,"MatrixLayoutRenderer.getBackgroundClass: oBackgroundDesign must be a known value");return null;}};M.getPaddingClass=function(p){switch(p){case P.None:return"sapUiMltPadNone";case P.Begin:return"sapUiMltPadLeft";case P.End:return"sapUiMltPadRight";case P.Both:return"sapUiMltPadBoth";case P.Neither:return"sapUiMltPadNeither";default:a(false,"MatrixLayoutRenderer.getPaddingClass: oPadding must be a known value");return null;}};M.getSeparationClass=function(s){switch(s){case S.None:return null;case S.Small:return"sapUiMltSepS";case S.SmallWithLine:return"sapUiMltSepSWL";case S.Medium:return"sapUiMltSepM";case S.MediumWithLine:return"sapUiMltSepMWL";case S.Large:return"sapUiMltSepL";case S.LargeWithLine:return"sapUiMltSepLWL";default:a(false,"MatrixLayoutRenderer.getSeparationClass: oSeparation must be a known value");return null;}};M.getValueUnit=function(s){var v=0;var u="";var p=s.search('px');if(p>-1){u="px";v=parseInt(s.slice(0,p));return({Value:v,Unit:u});}p=s.search('pt');if(p>-1){u="pt";v=parseFloat(s.slice(0,p));return({Value:v,Unit:u});}p=s.search('in');if(p>-1){u="in";v=parseFloat(s.slice(0,p));return({Value:v,Unit:u});}p=s.search('mm');if(p>-1){u="mm";v=parseFloat(s.slice(0,p));return({Value:v,Unit:u});}p=s.search('cm');if(p>-1){u="cm";v=parseFloat(s.slice(0,p));return({Value:v,Unit:u});}p=s.search('em');if(p>-1){u="em";v=parseFloat(s.slice(0,p));return({Value:v,Unit:u});}p=s.search('ex');if(p>-1){u="ex";v=parseFloat(s.slice(0,p));return({Value:v,Unit:u});}p=s.search('%');if(p>-1){u="%";v=parseFloat(s.slice(0,p));return({Value:v,Unit:u});}};return M;},true);
