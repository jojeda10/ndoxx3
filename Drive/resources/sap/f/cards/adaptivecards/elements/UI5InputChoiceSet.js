/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/thirdparty/adaptivecards"],function(A){"use strict";function U(){A.ChoiceSetInput.apply(this,arguments);}U.prototype=Object.create(A.ChoiceSetInput.prototype);U.prototype.internalRender=function(){if(!this.isMultiSelect){if(this.isCompact){this._selectElement=document.createElement("ui5-select");this._selectElement.setAttribute('ac-select','');this._selectElement.id=this.id;this._selectElement.addEventListener("change",function(){this.valueChanged();}.bind(this));var p=document.createElement("ui5-option");p.setAttribute('ac-select-placeholder','');p.selected=true;p.value="";if(this.placeholder){p.innerHTML=this.placeholder;}this._selectElement.appendChild(p);for(var i=0;i<this.choices.length;i++){var o=document.createElement("ui5-option");o.value=this.choices[i].value;o.innerHTML=this.choices[i].title;if(this.choices[i].value===this.defaultValue){o.selected=true;}this._selectElement.appendChild(o);}return this._selectElement;}var r=document.createElement("div");r.classList.add("sapFCardAdaptiveContentChoiceSetWrapper");r.id=this.id;r.addEventListener("select",function(){this.valueChanged();}.bind(this));this._toggleInputs=[];for(var j=0;j<this.choices.length;j++){var R=document.createElement("ui5-radiobutton");R.value=this.choices[j].value;R.text=this.choices[j].title;R.name=this.id;R.wrap=this.wrap;if(this.choices[j].value===this.defaultValue){R.selected=true;}this._toggleInputs.push(R);r.appendChild(R);}return r;}var d=this.defaultValue?this.defaultValue.split(","):null;var c=document.createElement("div");c.classList.add("sapFCardAdaptiveContentChoiceSetWrapper");c.id=this.id;c.addEventListener("change",function(){this.valueChanged();}.bind(this));this._toggleInputs=[];for(var k=0;k<this.choices.length;k++){var C=document.createElement("ui5-checkbox");C.value=this.choices[k].value;C.text=this.choices[k].title;C.name=this.id;C.wrap=this.wrap;if(d&&d.indexOf(this.choices[k].value)>=0){C.checked=true;}this._toggleInputs.push(C);c.appendChild(C);}return c;};Object.defineProperty(U.prototype,"value",{get:function value(){var i;if(!this.isMultiSelect){if(this.isCompact){return this._selectElement.selectedOption&&!this._selectElement.selectedOption.hasAttribute('ac-select-placeholder')?this._selectElement.selectedOption.value:null;}else{if(!this._toggleInputs||this._toggleInputs.length===0){return null;}for(i=0;i<this._toggleInputs.length;i++){if(this._toggleInputs[i].selected){return this._toggleInputs[i].value;}}return null;}}else{if(!this._toggleInputs||this._toggleInputs.length===0){return null;}var r="";for(i=0;i<this._toggleInputs.length;i++){if(this._toggleInputs[i].checked){if(r!==""){r+=this.hostConfig.choiceSetInputValueSeparator;}r+=this._toggleInputs[i].value;}}return r===""?null:r;}}});return U;});
