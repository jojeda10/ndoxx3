/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/context/BaseContextProvider"],function(B){"use strict";var S=B.extend("sap.ui.fl.context.SwitchContextProvider",{metadata:{properties:{text:{type:"String",defaultValue:"Switch"},description:{type:"String",defaultValue:"Returns the values of switches received in the flexibility response from the back end"}}}});S.prototype.loadData=function(){return Promise.resolve({});};S.prototype.getValueHelp=function(){return Promise.resolve({});};S.prototype.validate=function(){return Promise.resolve(true);};return S;});
