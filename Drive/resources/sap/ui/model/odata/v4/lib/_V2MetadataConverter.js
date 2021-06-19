/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Helper","./_MetadataConverter","sap/base/Log","sap/ui/thirdparty/jquery"],function(_,a,L,q){"use strict";var c="sap.ui.model.odata.v4.lib._V2MetadataConverter",r=/^(?:DELETE|GET|MERGE|PATCH|POST|PUT)$/,e="http://schemas.microsoft.com/ado/2007/06/edmx",m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata",s="http://www.sap.com/Protocols/SAPData",v={"creatable":{"property":"Insertable","term":"@Org.OData.Capabilities.V1.InsertRestrictions"},"deletable":{"property":"Deletable","term":"@Org.OData.Capabilities.V1.DeleteRestrictions"},"deletable-path":{"property":"Deletable","term":"@Org.OData.Capabilities.V1.DeleteRestrictions"},"field-control":{"term":"@com.sap.vocabularies.Common.v1.FieldControl"},"heading":{"term":"@com.sap.vocabularies.Common.v1.Heading"},"label":{"term":"@com.sap.vocabularies.Common.v1.Label"},"precision":{"term":"@Org.OData.Measures.V1.Scale"},"quickinfo":{"term":"@com.sap.vocabularies.Common.v1.QuickInfo"},"requires-filter":{"property":"RequiresFilter","term":"@Org.OData.Capabilities.V1.FilterRestrictions"},"searchable":{"property":"Searchable","term":"@Org.OData.Capabilities.V1.SearchRestrictions"},"text":{"term":"@com.sap.vocabularies.Common.v1.Text"},"topable":{"term":"@Org.OData.Capabilities.V1.TopSupported"},"updatable":{"property":"Updatable","term":"@Org.OData.Capabilities.V1.UpdateRestrictions"},"updatable-path":{"property":"Updatable","term":"@Org.OData.Capabilities.V1.UpdateRestrictions"}},V={"bday":{TermName:"Contact"},"city":{Path:"adr",TermName:"Contact",V4Attribute:"locality"},"country":{Path:"adr",TermName:"Contact"},"email":{Path:"address",TermName:"Contact",V4Attribute:"uri",typeMapping:{"home":"home","pref":"preferred","work":"work"},v4EnumType:"com.sap.vocabularies.Communication.v1.ContactInformationType",v4PropertyAnnotation:"@com.sap.vocabularies.Communication.v1.IsEmailAddress"},"familyname":{Path:"n",TermName:"Contact",V4Attribute:"surname"},"givenname":{Path:"n",TermName:"Contact",V4Attribute:"given"},"honorific":{Path:"n",TermName:"Contact",V4Attribute:"prefix"},"middlename":{Path:"n",TermName:"Contact",V4Attribute:"additional"},"name":{TermName:"Contact",V4Attribute:"fn"},"nickname":{TermName:"Contact"},"note":{TermName:"Contact"},"org":{TermName:"Contact"},"org-role":{TermName:"Contact",V4Attribute:"role"},"org-unit":{TermName:"Contact",V4Attribute:"orgunit"},"photo":{TermName:"Contact"},"pobox":{Path:"adr",TermName:"Contact"},"region":{Path:"adr",TermName:"Contact"},"street":{Path:"adr",TermName:"Contact"},"suffix":{Path:"n",TermName:"Contact"},"tel":{Path:"tel",TermName:"Contact",V4Attribute:"uri",typeMapping:{"cell":"cell","fax":"fax","home":"home","pref":"preferred","video":"video","voice":"voice","work":"work"},v4EnumType:"com.sap.vocabularies.Communication.v1.PhoneType",v4PropertyAnnotation:"@com.sap.vocabularies.Communication.v1.IsPhoneNumber"},"title":{TermName:"Contact"},"zip":{Path:"adr",TermName:"Contact",V4Attribute:"code"},"class":{TermName:"Event"},"dtend":{TermName:"Event"},"dtstart":{TermName:"Event"},"duration":{TermName:"Event"},"fbtype":{TermName:"Event"},"location":{TermName:"Event"},"status":{TermName:"Event"},"transp":{TermName:"Event"},"wholeday":{TermName:"Event"},"body":{TermName:"Message"},"from":{TermName:"Message"},"received":{TermName:"Message"},"sender":{TermName:"Message"},"subject":{TermName:"Message"},"completed":{TermName:"Task"},"due":{TermName:"Task"},"percent-complete":{TermName:"Task",V4Attribute:"percentcomplete"},"priority":{TermName:"Task"}},b={"fiscalyear":"@com.sap.vocabularies.Common.v1.IsFiscalYear","fiscalyearperiod":"@com.sap.vocabularies.Common.v1.IsFiscalYearPeriod","year":"@com.sap.vocabularies.Common.v1.IsCalendarYear","yearmonth":"@com.sap.vocabularies.Common.v1.IsCalendarYearMonth","yearmonthday":"@com.sap.vocabularies.Common.v1.IsCalendarDate","yearquarter":"@com.sap.vocabularies.Common.v1.IsCalendarYearQuarter","yearweek":"@com.sap.vocabularies.Common.v1.IsCalendarYearWeek","url":"@Org.OData.Core.V1.IsURL"};function A(C,t){var p=C.oAnnotatable;if(p){t=_.buildPath(p.sPath,t);}this.oConverter=C;this.sPath=t;this.oParent=p;this.mSapAttributes=C.mSapAttributes;this.mAnnotationsForTarget=null;}A.prototype.annotate=function(t,g){this.getTarget()[t]=g;};A.prototype.consume=function(n){return this.oConverter.consumeSapAnnotation(n);};A.prototype.convert=function(g,h){var o,i;if(h===undefined||h===""){return;}i=v[g];if(i.property){o=this.getOrCreateAnnotationRecord(i.term);o[i.property]=h;}else{this.annotate(i.term,h);}};A.prototype.getOrCreateAnnotationRecord=function(t){return this.oConverter.getOrCreateObject(this.getTarget(),t);};A.prototype.getTarget=function(){if(!this.mAnnotationsForTarget){this.mAnnotationsForTarget=this.oConverter.convertedV2Annotations[this.sPath]={};}return this.mAnnotationsForTarget;};A.prototype.peek=function(n){return this.oConverter.mSapAnnotations[n];};function d(){this.association=null;this.associations={};this.associationSet=null;this.associationSets=[];this.aBoundOperations=[];this.constraintRole=null;this.convertedV2Annotations={};this.defaultEntityContainer=null;this.mEntityContainersOfSchema={};this.mEntityType2EntitySetAnnotation={};this.mProperty2Semantics={};this.sPropertyName=null;this.navigationProperties=[];this.mSapAnnotations={};this.sTypeName=null;this.mProperty2Unit={};a.call(this);}d.prototype=Object.create(a.prototype);d.prototype.collectSapAnnotations=function(E){var o,g=E.attributes,i,n;this.mSapAnnotations={};for(i=0,n=g.length;i<n;i+=1){o=g.item(i);if(o.namespaceURI===s&&o.localName!=="content-version"){this.mSapAnnotations[o.localName]=o.value;}}};d.prototype.consumeSapAnnotation=function(n){var g=this.mSapAnnotations[n];delete this.mSapAnnotations[n];return g;};d.prototype.convertEntitySetAnnotation=function(o,n){var C,g;switch(n){case"creatable":case"deletable":case"updatable":if(o.peek(n)==="false"){o.convert(n,false);}break;case"deletable-path":case"updatable-path":C=n.slice(0,9);g=o.consume(n);if(o.peek(C)){o.convert(n,false);L.warning("Inconsistent metadata in '"+this.url+"'","Use either 'sap:"+C+"' or 'sap:"+C+"-path'"+" at entity set '"+o.sPath+"'",c);}else{o.convert(n,{$Path:g});}break;case"label":this.convertLabel(o);break;case"pageable":g=o.consume(n);if(g==="false"){o.annotate("@Org.OData.Capabilities.V1.SkipSupported",false);o.annotate("@Org.OData.Capabilities.V1.TopSupported",false);}break;case"requires-filter":g=o.consume(n);if(g==="true"){o.convert(n,true);}break;case"topable":g=o.consume(n);if(g==="false"){o.convert(n,false);}break;default:}};d.prototype.convertLabel=function(o){o.convert("label",o.consume("label"));};d.prototype.convertPropertyAnnotation=function(o,n){var g;switch(n){case"heading":case"label":case"quickinfo":o.convert(n,o.consume(n));break;case"field-control":case"precision":case"text":o.convert(n,{$Path:o.consume(n)});break;case"aggregation-role":g=o.consume(n);if(g==="dimension"){o.annotate("@com.sap.vocabularies.Analytics.v1.Dimension",true);}else if(g==="measure"){o.annotate("@com.sap.vocabularies.Analytics.v1.Measure",true);}break;case"display-format":g=o.consume(n);if(g==="NonNegative"){o.annotate("@com.sap.vocabularies.Common.v1.IsDigitSequence",true);}else if(g==="UpperCase"){o.annotate("@com.sap.vocabularies.Common.v1.IsUpperCase",true);}break;case"semantics":this.convertPropertySemanticsAnnotation(o);break;case"unit":this.mProperty2Unit[o.sPath]=o.consume("unit");break;case"visible":g=o.consume(n);if(g==="false"){o.annotate("@com.sap.vocabularies.UI.v1.Hidden",true);o.annotate("@com.sap.vocabularies.Common.v1.FieldControl",{$EnumMember:"com.sap.vocabularies.Common.v1.FieldControlType/Hidden"});}break;default:}};d.prototype.convertPropertySemanticsAnnotation=function(o){var g,E,p,R,S,h=o.peek("semantics").split(";"),i=h[0],j=V[i];if(i==="unit-of-measure"||i==="currency-code"){this.mProperty2Semantics[o.sPath]=o.consume("semantics");}else if(b[i]){o.annotate(b[i],true);o.consume("semantics");}else if(j){p={"$Path":this.sPropertyName};g=o.oParent.getOrCreateAnnotationRecord("@com.sap.vocabularies.Communication.v1."+j.TermName);if(j.Path){S=this.getOrCreateObject(g,j.Path);S[j.V4Attribute||i]=p;if(j.v4PropertyAnnotation){o.annotate(j.v4PropertyAnnotation,true);if(h[1]){R=[];E=h[1].split("=")[1];E.split(",").forEach(function(t){var T=j.typeMapping[t];if(T){R.push(j.v4EnumType+"/"+T);}else{L.warning("Unsupported semantic type: "+t,undefined,c);}});if(R.length>0){S.type={"EnumMember":R.join(" ")};}}g[j.Path]=[S];}else{g[j.Path]=S;}}else{g[j.V4Attribute||i]=p;}o.consume("semantics");}};d.prototype.finalize=function(){this.result.$Version="4.0";this.setDefaultEntityContainer();this.updateNavigationPropertiesAndCreateBindings();this.processBoundOperations();this.processUnitConversion();};d.prototype.mergeAnnotations=function(C,g){var h;for(h in C){if(h in g){g[h]=q.extend(C[h],g[h]);}else{g[h]=C[h];}}};d.prototype.postProcessSchema=function(E,R){var g,o,h,i,j,t;for(h in this.mEntityContainersOfSchema){o=this.mEntityContainersOfSchema[h];for(j in o){i=o[j];if(i.$kind!=="EntitySet"){continue;}t=h+"/"+j;g=q.extend(true,this.convertedV2Annotations[t]||{},this.mEntityType2EntitySetAnnotation[i.$Type]);if(Object.keys(g).length){this.convertedV2Annotations[t]=g;}}}if(this.schema.$Annotations){this.mergeAnnotations(this.convertedV2Annotations,this.schema.$Annotations);}else if(Object.keys(this.convertedV2Annotations).length>0){this.schema.$Annotations=this.convertedV2Annotations;}this.convertedV2Annotations={};this.mEntityContainersOfSchema={};};d.prototype.processAssociation=function(E){var n=this.namespace+E.getAttribute("Name");this.associations[n]=this.association={referentialConstraint:null,roles:{}};};d.prototype.processAssociationEnd=function(E){var n=E.getAttribute("Role");this.association.roles[n]={multiplicity:E.getAttribute("Multiplicity"),propertyName:undefined,typeName:this.resolveAlias(E.getAttribute("Type"))};};d.prototype.processAssociationSet=function(E){var o={associationName:this.resolveAlias(E.getAttribute("Association")),ends:[],entityContainer:this.entityContainer};this.associationSet=o;this.associationSets.push(o);this.consumeSapAnnotation("creatable");this.consumeSapAnnotation("deletable");this.consumeSapAnnotation("updatable");};d.prototype.processAssociationSetEnd=function(E){this.associationSet.ends.push({entitySetName:E.getAttribute("EntitySet"),roleName:E.getAttribute("Role")});};d.prototype.processComplexType=function(E){this.processType(E,{"$kind":"ComplexType"});};d.prototype.processDataServices=function(E){if(E.getAttributeNS(m,"DataServiceVersion")!=="2.0"){throw new Error(this.url+": expected DataServiceVersion=\"2.0\": "+f(E));}};d.prototype.processDependent=function(E){var C=this.association.referentialConstraint;this.constraintRole=C.dependent={roleName:E.getAttribute("Role")};};d.prototype.processElement=function(E,p){this.collectSapAnnotations(E);if(p){p.call(this,E);}this.warnUnsupportedSapAnnotations(E);};d.prototype.processEntityContainer=function(E){var Q=this.namespace+E.getAttribute("Name");this.mEntityContainersOfSchema[Q]=this.entityContainer={"$kind":"EntityContainer"};this.addToResult(Q,this.entityContainer);if(E.getAttributeNS(m,"IsDefaultEntityContainer")==="true"){this.defaultEntityContainer=Q;}this.v2annotatable(Q);};d.prototype.processEntitySet=function(E){var o,n=E.getAttribute("Name");this.entityContainer[n]=this.entitySet={$kind:"EntitySet",$Type:this.resolveAlias(E.getAttribute("EntityType"))};o=this.v2annotatable(n,this.convertEntitySetAnnotation);o.consume("creatable");o.consume("deletable");o.consume("updatable");if(o.consume("searchable")!=="true"){o.convert("searchable",false);}};d.prototype.processEntityType=function(E){var t={$kind:"EntityType"},g=this;this.processType(E,t);this.processAttributes(E,t,{"Abstract":this.setIfTrue,"BaseType":function(T){return T?g.resolveAlias(T):undefined;}});this.convertLabel(this.oAnnotatable);};d.prototype.processEntityTypeKeyPropertyRef=function(E){var n=E.getAttribute("Name");this.getOrCreateArray(this.type,"$Key").push(n);};d.prototype.processFacetAttributes=function(E,R){var t=this;this.processAttributes(E,R,{"DefaultValue":this.setValue,"MaxLength":function(g){return g==="Max"?undefined:t.setNumber(g);},"Nullable":this.setIfFalse,"Precision":this.setNumber,"Scale":this.setNumber,"Unicode":this.setIfFalse});if(E.getAttribute("FixedLength")==="false"){R.$Scale="variable";}};d.prototype.processFunctionImport=function(E){var g,h=E.getAttributeNS(m,"HttpMethod"),k=h!=="GET"?"Action":"Function",l,n=E.getAttribute("Name"),o={$kind:k},O={$kind:k+"Import"},Q=this.namespace+n,R=E.getAttribute("ReturnType"),i;O["$"+k]=Q;this.processAttributes(E,O,{"EntitySet":this.setValue});if(R){o.$ReturnType=i={};this.processTypedCollection(R,i);}if(!r.test(h)){L.warning("Unsupported HttpMethod at FunctionImport '"+n+"', removing this FunctionImport",undefined,c);this.consumeSapAnnotation("action-for");this.consumeSapAnnotation("applicable-path");}else{if(h!=="GET"&&h!=="POST"){o.$v2HttpMethod=h;}this.addToResult(Q,[o]);g=this.consumeSapAnnotation("action-for");if(g){o.$IsBound=true;o.$Parameter=[{"$Name":null,"$Nullable":false,"$Type":this.resolveAlias(g)}];this.aBoundOperations.push(o);this.consumeSapAnnotation("applicable-path");l=this.consumeSapAnnotation("label");if(l){o[v["label"].term]=l;}}else{this.entityContainer[n]=O;this.v2annotatable(n);this.convertLabel(this.oAnnotatable);}}this.oOperation=o;};d.prototype.processParameter=function(E){var l,o=this.oOperation,p={$Name:E.getAttribute("Name")};this.processFacetAttributes(E,p);this.processTypedCollection(E.getAttribute("Type"),p);this.getOrCreateArray(o,"$Parameter").push(p);l=this.consumeSapAnnotation("label");if(l){p[v["label"].term]=l;}};d.prototype.processPrincipal=function(E){var C=this.association.referentialConstraint;this.constraintRole=C.principal={roleName:E.getAttribute("Role")};};d.prototype.processReferentialConstraint=function(E){this.association.referentialConstraint={};};d.prototype.processReferentialConstraintPropertyRef=function(E){this.constraintRole.propertyRef=E.getAttribute("Name");};d.prototype.processSchema=function(E){var S=this.consumeSapAnnotation("schema-version");this.namespace=E.getAttribute("Namespace")+".";this.schema={"$kind":"Schema"};this.addToResult(this.namespace,this.schema);if(S){this.schema["@Org.Odata.Core.V1.SchemaVersion"]=S;}};d.prototype.processType=function(E,t){var Q=this.namespace+E.getAttribute("Name");this.sTypeName=Q;this.type=t;this.addToResult(Q,t);this.v2annotatable(Q);};d.prototype.processTypedCollection=function(t,p){var M=this.rCollection.exec(t);if(M){p.$isCollection=true;t=M[1];}if(t.indexOf(".")<0){t="Edm."+t;}switch(t){case"Edm.DateTime":p.$v2Type=t;if(this.mSapAnnotations["display-format"]==="Date"){t="Edm.Date";delete p.$Precision;}else{t="Edm.DateTimeOffset";}break;case"Edm.Float":p.$v2Type=t;t="Edm.Single";break;case"Edm.Time":p.$v2Type=t;t="Edm.TimeOfDay";break;default:t=this.resolveAlias(t);}p.$Type=t;};d.prototype.processTypeNavigationProperty=function(E){var C=this.consumeSapAnnotation("creatable"),g=this.consumeSapAnnotation("creatable-path"),F=this.consumeSapAnnotation("filterable"),o,h,n=E.getAttribute("Name"),N,p={$kind:"NavigationProperty"},t=this;function i(T,P,j){h=t.getOrCreateObject(t.mEntityType2EntitySetAnnotation,t.sTypeName);h=t.getOrCreateObject(h,T);h=t.getOrCreateArray(h,P);h.push(j);}this.type[n]=p;this.navigationProperties.push({associationName:this.resolveAlias(E.getAttribute("Relationship")),fromRoleName:E.getAttribute("FromRole"),property:p,propertyName:n,toRoleName:E.getAttribute("ToRole")});this.v2annotatable(n);if(C){N={"$NavigationPropertyPath":n};if(g){L.warning("Inconsistent metadata in '"+this.url+"'","Use either 'sap:creatable' or 'sap:creatable-path' at navigation property '"+this.oAnnotatable.sPath+"'",c);}else if(C==="true"){N=null;}}else if(g){N={"$If":[{"$Not":{"$Path":g}},{"$NavigationPropertyPath":n}]};}if(N){i("@Org.OData.Capabilities.V1.InsertRestrictions","NonInsertableNavigationProperties",N);}if(F==="false"){o={"NavigationProperty":{"$NavigationPropertyPath":n},"FilterRestrictions":{"Filterable":false}};i("@Org.OData.Capabilities.V1.NavigationRestrictions","RestrictedProperties",o);}};d.prototype.processTypeProperty=function(E){var o,g,F,h,n=E.getAttribute("Name"),p={"$kind":"Property"},t=this;function i(T,P,j){if(t.type.$kind==="EntityType"){h=t.getOrCreateObject(t.mEntityType2EntitySetAnnotation,t.sTypeName);h=t.getOrCreateObject(h,T);h=t.getOrCreateArray(h,P);h.push({"$PropertyPath":n});}else{L.warning("Unsupported SAP annotation at a complex type in '"+t.url+"'","sap:"+j+" at property '"+o.sPath+"'",c);}}this.sPropertyName=n;this.type[n]=p;this.processFacetAttributes(E,p);this.processTypedCollection(E.getAttribute("Type"),p);o=this.v2annotatable(n,this.convertPropertyAnnotation);if(o.consume("updatable")==="false"){if(o.consume("creatable")==="false"){o.annotate("@Org.OData.Core.V1.Computed",true);}else{o.annotate("@Org.OData.Core.V1.Immutable",true);}}if(o.consume("filterable")==="false"){i("@Org.OData.Capabilities.V1.FilterRestrictions","NonFilterableProperties","filterable");}F=o.consume("filter-restriction");if(F){switch(F){case"interval":g="SingleInterval";break;case"multi-value":g="MultiValue";break;case"single-value":g="SingleValue";break;default:L.warning("Inconsistent metadata in '"+this.url+"'","Unsupported sap:filter-restriction=\""+F+"\" at property '"+o.sPath+"'",c);}if(g){if(this.type.$kind==="EntityType"){h=this.getOrCreateObject(this.mEntityType2EntitySetAnnotation,this.sTypeName);h=this.getOrCreateArray(h,"@com.sap.vocabularies.Common.v1.FilterExpressionRestrictions");h.push({"AllowedExpressions":{"EnumMember":"com.sap.vocabularies.Common.v1.FilterExpressionType/"+g},"Property":{"$PropertyPath":n}});}else{L.warning("Unsupported SAP annotation at a complex type in '"+this.url+"'","sap:filter-restriction at property '"+o.sPath+"'",c);}}}if(o.consume("required-in-filter")==="true"){i("@Org.OData.Capabilities.V1.FilterRestrictions","RequiredProperties","required-in-filter");}if(o.consume("sortable")==="false"){i("@Org.OData.Capabilities.V1.SortRestrictions","NonSortableProperties","sortable");}};d.prototype.processBoundOperations=function(){var t=this;this.aBoundOperations.forEach(function(o){var E=t.result[o.$Parameter[0].$Type];E.$Key.forEach(function(k){o.$Parameter.some(function(p,i){if(p.$Name===k){o.$Parameter.splice(i,1);return true;}});});});};d.prototype.processUnitConversion=function(){var t=this;Object.keys(this.mProperty2Unit).forEach(function(p){var h,T,g=p.split("/")[0],u,U=t.mProperty2Unit[p],j=U.split("/"),o,k,i,n=j.length;for(i=0;i<n;i+=1){T=t.result[g];o=T[j[i]];if(!o){L.warning("Path '"+U+"' for sap:unit cannot be resolved",p,c);return;}if(i<n-1){g=o.$Type;}}k=t.mProperty2Semantics[g+"/"+j[n-1]];if(!k){L.warning("Unsupported sap:semantics at sap:unit='"+U+"'; expected 'currency-code' or 'unit-of-measure'",p,c);return;}u=k==="currency-code"?"ISOCurrency":"Unit";u="@Org.OData.Measures.V1."+u;h=t.getOrCreateObject(t.result[_.namespace(p)+"."],"$Annotations");h=t.getOrCreateObject(h,p);if(!(u in h)){h[u]={"$Path":U};}});};function f(E){var o,g=E.attributes,t="<"+E.nodeName,i,n;for(i=0,n=g.length;i<n;i+=1){o=g.item(i);t+=" "+o.name+'="'+o.value+'"';}return t+(E.childNodes.length?">":"/>");}d.prototype.setDefaultEntityContainer=function(){var D=this.defaultEntityContainer,E,R=this.result;if(D){R.$EntityContainer=D;}else{E=Object.keys(R).filter(function(Q){return R[Q].$kind==="EntityContainer";});if(E.length===1){R.$EntityContainer=E[0];}}};d.prototype.updateNavigationPropertiesAndCreateBindings=function(){var t=this;this.navigationProperties.forEach(function(n){var o=t.associations[n.associationName],C=o.referentialConstraint,N=n.property,T=o.roles[n.toRoleName];N.$Type=T.typeName;T.propertyName=n.propertyName;if(T.multiplicity==="1"){N.$Nullable=false;}if(T.multiplicity==="*"){N.$isCollection=true;}if(C&&C.principal.roleName===n.toRoleName){N.$ReferentialConstraint={};N.$ReferentialConstraint[C.dependent.propertyRef]=C.principal.propertyRef;}});this.associationSets.forEach(function(o){var g=t.associations[o.associationName],E=o.entityContainer;function h(i,j){var k=E[i.entitySetName],T=g.roles[j.roleName];if(T.propertyName){k.$NavigationPropertyBinding=k.$NavigationPropertyBinding||{};k.$NavigationPropertyBinding[T.propertyName]=j.entitySetName;}}h(o.ends[0],o.ends[1]);h(o.ends[1],o.ends[0]);});};d.prototype.v2annotatable=function(n,p){var o=new A(this,n);this.oAnnotatable=o;if(p){p=p.bind(this);Object.keys(this.mSapAnnotations).forEach(function(n){p(o,n);});}return o;};d.prototype.warnUnsupportedSapAnnotations=function(E){Object.keys(this.mSapAnnotations).forEach(function(n){L.warning("Unsupported annotation 'sap:"+n+"'",f(E),c);});};(function($){var S;$.sRootNamespace=e;$.oAliasConfig={"Reference":{__xmlns:a.sEdmxNamespace,"Include":{__processor:$.processAlias}},"DataServices":{"Schema":{__processor:$.processAlias}}};S={"NavigationProperty":{__processor:$.processTypeNavigationProperty},"Property":{__processor:$.processTypeProperty}};$.oFullConfig={__include:[$.oReferenceInclude],"DataServices":{__processor:$.processDataServices,"Schema":{__postProcessor:$.postProcessSchema,__processor:$.processSchema,__include:[$.oAnnotationsConfig],"Association":{__processor:$.processAssociation,"End":{__processor:$.processAssociationEnd},"ReferentialConstraint":{__processor:$.processReferentialConstraint,"Dependent":{__processor:$.processDependent,"PropertyRef":{__processor:$.processReferentialConstraintPropertyRef}},"Principal":{__processor:$.processPrincipal,"PropertyRef":{__processor:$.processReferentialConstraintPropertyRef}}}},"ComplexType":{__processor:$.processComplexType,__include:[S]},"EntityContainer":{__processor:$.processEntityContainer,"AssociationSet":{__processor:$.processAssociationSet,"End":{__processor:$.processAssociationSetEnd}},"EntitySet":{__processor:$.processEntitySet},"FunctionImport":{__processor:$.processFunctionImport,"Parameter":{__processor:$.processParameter}}},"EntityType":{__processor:$.processEntityType,__include:[S],"Key":{"PropertyRef":{__processor:$.processEntityTypeKeyPropertyRef}}}}}};})(d.prototype);return d;},false);