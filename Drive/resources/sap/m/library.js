/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device','sap/ui/base/DataType','sap/ui/base/EventProvider','sap/ui/core/Control','sap/base/util/ObjectPath','sap/ui/core/library',"sap/base/strings/capitalize","sap/ui/thirdparty/jquery","sap/base/assert","sap/base/Log","sap/base/util/defineLazyProperty","sap/base/security/encodeCSS","./AvatarShape","./AvatarSize","./AvatarType","./AvatarColor","./AvatarImageFitType",'./Support'],function(D,a,E,C,O,b,d,q,e,L,f,g,A,h,n,o,p){"use strict";sap.ui.getCore().initLibrary({name:"sap.m",version:"1.74.0",dependencies:["sap.ui.core"],designtime:"sap/m/designtime/library.designtime",types:["sap.m.AvatarImageFitType","sap.m.AvatarShape","sap.m.AvatarSize","sap.m.AvatarType","sap.m.AvatarColor","sap.m.BackgroundDesign","sap.m.BarDesign","sap.m.BreadcrumbsSeparatorStyle","sap.m.ButtonType","sap.m.CarouselArrowsPlacement","sap.m.DateTimeInputType","sap.m.DeviationIndicator","sap.m.DialogRoleType","sap.m.DialogType","sap.m.DraftIndicatorState","sap.m.FacetFilterListDataType","sap.m.FacetFilterType","sap.m.FlexAlignContent","sap.m.FlexAlignItems","sap.m.FlexAlignSelf","sap.m.FlexDirection","sap.m.FlexJustifyContent","sap.m.FlexRendertype","sap.m.FlexWrap","sap.m.FrameType","sap.m.GenericTagDesign","sap.m.GenericTagValueState","sap.m.GenericTileMode","sap.m.GenericTileScope","sap.m.HeaderLevel","sap.m.IBarHTMLTag","sap.m.IconTabDensityMode","sap.m.IconTabFilterDesign","sap.m.IconTabHeaderMode","sap.m.ImageMode","sap.m.InputTextFormatMode","sap.m.InputType","sap.m.LabelDesign","sap.m.LightBoxLoadingStates","sap.m.LinkConversion","sap.m.ListGrowingDirection","sap.m.ListHeaderDesign","sap.m.ListKeyboardMode","sap.m.ListMode","sap.m.ListSeparators","sap.m.ListType","sap.m.LoadState","sap.m.MenuButtonMode","sap.m.ObjectHeaderPictureShape","sap.m.ObjectMarkerType","sap.m.ObjectMarkerVisibility","sap.m.OverflowToolbarPriority","sap.m.P13nPanelType","sap.m.P13nConditionOperation","sap.m.PageBackgroundDesign","sap.m.PanelAccessibleRole","sap.m.PDFViewerDisplayType","sap.m.PlacementType","sap.m.PlanningCalendarBuiltInView","sap.m.PlanningCalendarStickyMode","sap.m.PopinDisplay","sap.m.PopinLayout","sap.m.QuickViewGroupElementType","sap.m.RatingIndicatorVisualMode","sap.m.ScreenSize","sap.m.SelectionDetailsActionLevel","sap.m.SelectListKeyboardNavigationMode","sap.m.SelectType","sap.m.Size","sap.m.SplitAppMode","sap.m.StandardTileType","sap.m.StepInputStepModeType","sap.m.StepInputValidationMode","sap.m.Sticky","sap.m.StringFilterOperator","sap.m.SwipeDirection","sap.m.SwitchType","sap.m.TileSizeBehavior","sap.m.TimePickerMaskMode","sap.m.TitleAlignment","sap.m.ToolbarDesign","sap.m.ToolbarStyle","sap.m.UploadState","sap.m.ValueColor","sap.m.ValueCSSColor","sap.m.VerticalPlacementType","sap.m.WrappingType","sap.m.semantic.SemanticRuleSetType"],interfaces:["sap.m.IBar","sap.m.IBreadcrumbs","sap.m.IconTab","sap.m.IScale","sap.m.semantic.IGroup","sap.m.semantic.IFilter","sap.m.semantic.ISort","sap.m.ObjectHeaderContainer","sap.m.IOverflowToolbarContent","sap.m.IOverflowToolbarFlexibleContent","sap.m.IHyphenation"],controls:["sap.m.ActionListItem","sap.m.ActionSelect","sap.m.ActionSheet","sap.m.App","sap.m.Avatar","sap.m.Bar","sap.m.BusyDialog","sap.m.BusyIndicator","sap.m.Button","sap.m.Breadcrumbs","sap.m.Carousel","sap.m.CheckBox","sap.m.ColumnHeaderPopover","sap.m.ColumnListItem","sap.m.ColorPalette","sap.m.ColorPalettePopover","sap.m.ComboBox","sap.m.ComboBoxTextField","sap.m.ComboBoxBase","sap.m.CustomListItem","sap.m.CustomTile","sap.m.CustomTreeItem","sap.m.DatePicker","sap.m.DateRangeSelection","sap.m.DateTimeField","sap.m.DateTimeInput","sap.m.DateTimePicker","sap.m.Dialog","sap.m.DisplayListItem","sap.m.DraftIndicator","sap.m.FacetFilter","sap.m.FacetFilterItem","sap.m.FacetFilterList","sap.m.FeedContent","sap.m.FeedInput","sap.m.FeedListItem","sap.m.FlexBox","sap.m.FormattedText","sap.m.GenericTag","sap.m.GenericTile","sap.m.GroupHeaderListItem","sap.m.GrowingList","sap.m.HBox","sap.m.HeaderContainer","sap.m.IconTabBar","sap.m.IconTabBarSelectList","sap.m.IconTabHeader","sap.m.Image","sap.m.ImageContent","sap.m.Input","sap.m.InputBase","sap.m.InputListItem","sap.m.Label","sap.m.LightBox","sap.m.Link","sap.m.List","sap.m.ListBase","sap.m.ListItemBase","sap.m.MaskInput","sap.m.Menu","sap.m.MenuButton","sap.m.MessagePage","sap.m.MessagePopover","sap.m.MessageView","sap.m.MessageStrip","sap.m.MultiComboBox","sap.m.MultiEditField","sap.m.MultiInput","sap.m.NavContainer","sap.m.NewsContent","sap.m.NumericContent","sap.m.NotificationListBase","sap.m.NotificationListItem","sap.m.NotificationListGroup","sap.m.PagingButton","sap.m.PlanningCalendarLegend","sap.m.ObjectAttribute","sap.m.ObjectHeader","sap.m.ObjectIdentifier","sap.m.ObjectListItem","sap.m.ObjectMarker","sap.m.ObjectNumber","sap.m.ObjectStatus","sap.m.OverflowToolbar","sap.m.OverflowToolbarButton","sap.m.OverflowToolbarToggleButton","sap.m.P13nColumnsPanel","sap.m.P13nGroupPanel","sap.m.P13nSelectionPanel","sap.m.P13nDimMeasurePanel","sap.m.P13nConditionPanel","sap.m.P13nDialog","sap.m.P13nFilterPanel","sap.m.P13nPanel","sap.m.P13nSortPanel","sap.m.Page","sap.m.Panel","sap.m.PDFViewer","sap.m.PlanningCalendar","sap.m.PlanningCalendarHeader","sap.m.Popover","sap.m.ProgressIndicator","sap.m.PullToRefresh","sap.m.QuickView","sap.m.QuickViewBase","sap.m.QuickViewCard","sap.m.QuickViewPage","sap.m.RadioButton","sap.m.RadioButtonGroup","sap.m.RangeSlider","sap.m.RatingIndicator","sap.m.ResponsivePopover","sap.m.ScrollContainer","sap.m.SearchField","sap.m.SegmentedButton","sap.m.Select","sap.m.SelectDialog","sap.m.SelectList","sap.m.SelectionDetails","sap.m.Shell","sap.m.SimpleFixFlex","sap.m.SinglePlanningCalendar","sap.m.SinglePlanningCalendarGrid","sap.m.SinglePlanningCalendarMonthGrid","sap.m.Slider","sap.m.SliderTooltip","sap.m.SliderTooltipBase","sap.m.SliderTooltipContainer","sap.m.SlideTile","sap.m.StepInput","sap.m.SplitApp","sap.m.SplitContainer","sap.m.StandardListItem","sap.m.StandardTreeItem","sap.m.StandardTile","sap.m.Switch","sap.m.Table","sap.m.TableSelectDialog","sap.m.TabContainer","sap.m.TabStrip","sap.m.Text","sap.m.TextArea","sap.m.Tile","sap.m.TileContainer","sap.m.TileContent","sap.m.TimePicker","sap.m.TimePickerSliders","sap.m.Title","sap.m.ToggleButton","sap.m.Token","sap.m.Tokenizer","sap.m.Toolbar","sap.m.ToolbarSpacer","sap.m.ToolbarSeparator","sap.m.Tree","sap.m.TreeItemBase","sap.m.UploadCollection","sap.m.UploadCollectionToolbarPlaceholder","sap.m.upload.UploadSet","sap.m.VBox","sap.m.ViewSettingsDialog","sap.m.WheelSlider","sap.m.WheelSliderContainer","sap.m.Wizard","sap.m.WizardStep","sap.m.semantic.DetailPage","sap.m.semantic.SemanticPage","sap.m.semantic.ShareMenuPage","sap.m.semantic.FullscreenPage","sap.m.semantic.MasterPage"],elements:["sap.m.Column","sap.m.ColumnPopoverActionItem","sap.m.ColumnPopoverCustomItem","sap.m.ColumnPopoverItem","sap.m.ColumnPopoverSortItem","sap.m.FlexItemData","sap.m.FeedListItemAction","sap.m.IconTabFilter","sap.m.IconTabSeparator","sap.m.LightBoxItem","sap.m.OverflowToolbarLayoutData","sap.m.MaskInputRule","sap.m.MenuItem","sap.m.MessageItem","sap.m.MessagePopoverItem","sap.m.PageAccessibleLandmarkInfo","sap.m.P13nFilterItem","sap.m.P13nItem","sap.m.PlanningCalendarRow","sap.m.PlanningCalendarView","sap.m.P13nColumnsItem","sap.m.P13nDimMeasureItem","sap.m.P13nGroupItem","sap.m.P13nSortItem","sap.m.QuickViewGroup","sap.m.QuickViewGroupElement","sap.m.ResponsiveScale","sap.m.SegmentedButtonItem","sap.m.SelectionDetailsItem","sap.m.SelectionDetailsItemLine","sap.m.SinglePlanningCalendarDayView","sap.m.SinglePlanningCalendarWeekView","sap.m.SinglePlanningCalendarWorkWeekView","sap.m.SinglePlanningCalendarView","sap.m.SuggestionItem","sap.m.TabContainerItem","sap.m.TabStripItem","sap.m.ToolbarLayoutData","sap.m.UploadCollectionItem","sap.m.UploadCollectionParameter","sap.m.upload.Uploader","sap.m.upload.UploadSetItem","sap.m.ViewSettingsCustomItem","sap.m.ViewSettingsCustomTab","sap.m.ViewSettingsFilterItem","sap.m.ViewSettingsItem","sap.m.plugins.DataStateIndicator","sap.m.plugins.PluginBase","sap.m.semantic.AddAction","sap.m.semantic.CancelAction","sap.m.semantic.DeleteAction","sap.m.semantic.DiscussInJamAction","sap.m.semantic.EditAction","sap.m.semantic.FavoriteAction","sap.m.semantic.FilterAction","sap.m.semantic.FilterSelect","sap.m.semantic.FlagAction","sap.m.semantic.ForwardAction","sap.m.semantic.GroupAction","sap.m.semantic.GroupSelect","sap.m.semantic.MainAction","sap.m.semantic.MessagesIndicator","sap.m.semantic.MultiSelectAction","sap.m.semantic.NegativeAction","sap.m.semantic.OpenInAction","sap.m.semantic.PositiveAction","sap.m.semantic.PrintAction","sap.m.semantic.SaveAction","sap.m.semantic.SemanticButton","sap.m.semantic.SemanticControl","sap.m.semantic.SemanticSelect","sap.m.semantic.SemanticToggleButton","sap.m.semantic.SendEmailAction","sap.m.semantic.SendMessageAction","sap.m.semantic.ShareInJamAction","sap.m.semantic.SortAction","sap.m.semantic.SortSelect"],extensions:{flChangeHandlers:{"sap.m.ActionSheet":{"moveControls":"default"},"sap.m.Avatar":"sap/m/flexibility/Avatar","sap.m.Bar":"sap/m/flexibility/Bar","sap.m.Button":"sap/m/flexibility/Button","sap.m.CheckBox":"sap/m/flexibility/CheckBox","sap.m.ColumnListItem":{"hideControl":"default","unhideControl":"default"},"sap.m.CustomListItem":{"hideControl":"default","unhideControl":"default","moveControls":"default"},"sap.m.DatePicker":{"hideControl":"default","unhideControl":"default"},"sap.m.Dialog":"sap/m/flexibility/Dialog","sap.m.FlexBox":{"hideControl":"default","unhideControl":"default","moveControls":"default"},"sap.m.HBox":{"hideControl":"default","unhideControl":"default","moveControls":"default"},"sap.m.IconTabBar":{"moveControls":"default"},"sap.m.IconTabFilter":"sap/m/flexibility/IconTabFilter","sap.m.Image":{"hideControl":"default","unhideControl":"default"},"sap.m.Input":{"hideControl":"default","unhideControl":"default"},"sap.m.InputBase":{"hideControl":"default","unhideControl":"default"},"sap.m.InputListItem":"sap/m/flexibility/InputListItem","sap.m.Label":"sap/m/flexibility/Label","sap.m.MultiInput":{"hideControl":"default","unhideControl":"default"},"sap.m.ListItemBase":{"hideControl":"default","unhideControl":"default"},"sap.m.Link":"sap/m/flexibility/Link","sap.m.List":{"hideControl":"default","unhideControl":"default","moveControls":"default"},"sap.m.ListBase":{"hideControl":"default","unhideControl":"default","moveControls":"default"},"sap.m.MaskInput":{"hideControl":"default","unhideControl":"default"},"sap.m.MenuButton":"sap/m/flexibility/MenuButton","sap.m.OverflowToolbar":"sap/m/flexibility/OverflowToolbar","sap.m.OverflowToolbarButton":"sap/m/flexibility/OverflowToolbarButton","sap.m.Page":"sap/m/flexibility/Page","sap.m.Panel":"sap/m/flexibility/Panel","sap.m.Popover":"sap/m/flexibility/Popover","sap.m.RadioButton":"sap/m/flexibility/RadioButton","sap.m.RatingIndicator":{"hideControl":"default","unhideControl":"default"},"sap.m.RangeSlider":{"hideControl":"default","unhideControl":"default"},"sap.m.ScrollContainer":{"hideControl":"default","moveControls":"default","unhideControl":"default"},"sap.m.Slider":{"hideControl":"default","unhideControl":"default"},"sap.m.StandardListItem":"sap/m/flexibility/StandardListItem","sap.m.Table":"sap/m/flexibility/Table","sap.m.Column":{"hideControl":"default","unhideControl":"default"},"sap.m.Text":"sap/m/flexibility/Text","sap.m.Title":"sap/m/flexibility/Title","sap.m.Toolbar":"sap/m/flexibility/Toolbar","sap.m.VBox":{"hideControl":"default","unhideControl":"default","moveControls":"default"}},"sap.ui.support":{publicRules:true,internalRules:true}}});var t=sap.m;t.BackgroundDesign={Solid:"Solid",Transparent:"Transparent",Translucent:"Translucent"};t.BarDesign={Auto:"Auto",Header:"Header",SubHeader:"SubHeader",Footer:"Footer"};t.BreadcrumbsSeparatorStyle={Slash:"Slash",BackSlash:"BackSlash",DoubleSlash:"DoubleSlash",DoubleBackSlash:"DoubleBackSlash",GreaterThan:"GreaterThan",DoubleGreaterThan:"DoubleGreaterThan"};t.ButtonType={Default:"Default",Back:"Back",Accept:"Accept",Reject:"Reject",Transparent:"Transparent",Ghost:"Ghost",Up:"Up",Unstyled:"Unstyled",Emphasized:"Emphasized",Critical:"Critical",Negative:"Negative",Success:"Success",Neutral:"Neutral"};t.CarouselArrowsPlacement={Content:"Content",PageIndicator:"PageIndicator"};t.PlanningCalendarBuiltInView={Hour:"Hour",Day:"Day",Month:"Month",Week:"Week",OneMonth:"One Month"};t.DateTimeInputType={Date:"Date",DateTime:"DateTime",Time:"Time"};t.DialogType={Standard:"Standard",Message:"Message"};t.DialogRoleType={Dialog:"dialog",AlertDialog:"alertdialog"};t.DeviationIndicator={Up:"Up",Down:"Down",None:"None"};t.DraftIndicatorState={Clear:"Clear",Saving:"Saving",Saved:"Saved"};t.FacetFilterListDataType={Date:"Date",DateTime:"DateTime",Time:"Time",Integer:"Integer",Float:"Float",String:"String",Boolean:"Boolean"};t.FacetFilterType={Simple:"Simple",Light:"Light"};t.FlexAlignItems={Start:"Start",End:"End",Center:"Center",Baseline:"Baseline",Stretch:"Stretch",Inherit:"Inherit"};t.FlexAlignSelf={Auto:"Auto",Start:"Start",End:"End",Center:"Center",Baseline:"Baseline",Stretch:"Stretch",Inherit:"Inherit"};t.FlexDirection={Row:"Row",Column:"Column",RowReverse:"RowReverse",ColumnReverse:"ColumnReverse",Inherit:"Inherit"};t.FlexJustifyContent={Start:"Start",End:"End",Center:"Center",SpaceBetween:"SpaceBetween",SpaceAround:"SpaceAround",Inherit:"Inherit"};t.FlexWrap={NoWrap:"NoWrap",Wrap:"Wrap",WrapReverse:"WrapReverse"};t.FlexAlignContent={Start:"Start",End:"End",Center:"Center",SpaceBetween:"SpaceBetween",SpaceAround:"SpaceAround",Stretch:"Stretch",Inherit:"Inherit"};t.FlexRendertype={Div:"Div",List:"List",Bare:"Bare"};t.FrameType={OneByOne:"OneByOne",TwoByOne:"TwoByOne",TwoThirds:"TwoThirds",Auto:"Auto"};t.LinkConversion={None:"None",ProtocolOnly:"ProtocolOnly",All:"All"};t.InputTextFormatMode={Value:"Value",Key:"Key",ValueKey:"ValueKey",KeyValue:"KeyValue"};t.GenericTagDesign={Full:"Full",StatusIconHidden:"StatusIconHidden"};t.GenericTagValueState={None:"None",Error:"Error"};t.GenericTileMode={ContentMode:"ContentMode",HeaderMode:"HeaderMode",LineMode:"LineMode"};t.GenericTileScope={Display:"Display",Actions:"Actions"};t.TileSizeBehavior={Responsive:"Responsive",Small:"Small"};t.HeaderLevel={H1:"H1",H2:"H2",H3:"H3",H4:"H4",H5:"H5",H6:"H6"};t.IBarHTMLTag={Div:"Div",Header:"Header",Footer:"Footer"};t.IconTabHeaderMode={Standard:"Standard",Inline:"Inline"};t.IconTabDensityMode={Inherit:"Inherit",Compact:"Compact",Cozy:"Cozy"};t.IconTabFilterDesign={Horizontal:"Horizontal",Vertical:"Vertical"};t.ImageMode={Image:"Image",Background:"Background"};t.Size={XS:"XS",S:"S",M:"M",L:"L",Auto:"Auto",Responsive:"Responsive"};t.ValueColor={Neutral:"Neutral",Good:"Good",Critical:"Critical",Error:"Error"};t.ValueCSSColor=a.createType('sap.m.ValueCSSColor',{isValid:function(v){var r=t.ValueColor.hasOwnProperty(v);if(r){return r;}else{r=b.CSSColor.isValid(v);if(r){return r;}else{var P=sap.ui.requireSync("sap/ui/core/theming/Parameters");return b.CSSColor.isValid(P.get(v));}}}},a.getType('string'));t.InputType={Text:"Text",Date:"Date",Datetime:"Datetime",DatetimeLocale:"DatetimeLocale",Email:"Email",Month:"Month",Number:"Number",Tel:"Tel",Time:"Time",Url:"Url",Week:"Week",Password:"Password"};t.LabelDesign={Bold:"Bold",Standard:"Standard"};t.ListHeaderDesign={Standard:"Standard",Plain:"Plain"};t.ListMode={None:"None",SingleSelect:"SingleSelect",SingleSelectLeft:"SingleSelectLeft",SingleSelectMaster:"SingleSelectMaster",MultiSelect:"MultiSelect",Delete:"Delete"};t.ListKeyboardMode={Navigation:"Navigation",Edit:"Edit"};t.ListGrowingDirection={Downwards:"Downwards",Upwards:"Upwards"};t.ListSeparators={All:"All",Inner:"Inner",None:"None"};t.ListType={Inactive:"Inactive",Detail:"Detail",Navigation:"Navigation",Active:"Active",DetailAndActive:"DetailAndActive"};t.SelectListKeyboardNavigationMode={None:"None",Delimited:"Delimited"};t.LoadState={Loading:"Loading",Loaded:"Loaded",Failed:"Failed",Disabled:"Disabled"};t.MenuButtonMode={Regular:"Regular",Split:"Split"};t.OverflowToolbarPriority={NeverOverflow:"NeverOverflow",Never:"Never",High:"High",Low:"Low",Disappear:"Disappear",AlwaysOverflow:"AlwaysOverflow",Always:"Always"};t.ObjectHeaderPictureShape={Circle:"Circle",Square:"Square"};t.P13nPanelType={sort:"sort",filter:"filter",group:"group",columns:"columns",dimeasure:"dimeasure",selection:"selection"};t.P13nConditionOperation={BT:"BT",EQ:"EQ",Contains:"Contains",StartsWith:"StartsWith",EndsWith:"EndsWith",LT:"LT",LE:"LE",GT:"GT",GE:"GE",Initial:"Initial",Empty:"Empty",NotEmpty:"NotEmpty",Ascending:"Ascending",Descending:"Descending",GroupAscending:"GroupAscending",GroupDescending:"GroupDescending",Total:"Total",Average:"Average",Minimum:"Minimum",Maximum:"Maximum"};t.PageBackgroundDesign={Standard:"Standard",List:"List",Solid:"Solid",Transparent:"Transparent"};t.PanelAccessibleRole={Complementary:"Complementary",Form:"Form",Region:"Region"};t.PDFViewerDisplayType={Auto:"Auto",Embedded:"Embedded",Link:"Link"};t.PlacementType={Left:"Left",Right:"Right",Top:"Top",Bottom:"Bottom",Vertical:"Vertical",VerticalPreferedTop:"VerticalPreferedTop",VerticalPreferredTop:"VerticalPreferredTop",VerticalPreferedBottom:"VerticalPreferedBottom",VerticalPreferredBottom:"VerticalPreferredBottom",Horizontal:"Horizontal",HorizontalPreferedRight:"HorizontalPreferedRight",HorizontalPreferredRight:"HorizontalPreferredRight",HorizontalPreferedLeft:"HorizontalPreferedLeft",HorizontalPreferredLeft:"HorizontalPreferredLeft",PreferredLeftOrFlip:"PreferredLeftOrFlip",PreferredRightOrFlip:"PreferredRightOrFlip",PreferredTopOrFlip:"PreferredTopOrFlip",PreferredBottomOrFlip:"PreferredBottomOrFlip",Auto:"Auto"};t.QuickViewGroupElementType={phone:"phone",mobile:"mobile",email:"email",link:"link",text:"text",pageLink:"pageLink"};t.VerticalPlacementType={Top:"Top",Bottom:"Bottom",Vertical:"Vertical"};t.PopinDisplay={Block:"Block",Inline:"Inline",WithoutHeader:"WithoutHeader"};t.PopinLayout={Block:"Block",GridSmall:"GridSmall",GridLarge:"GridLarge"};t.Sticky={ColumnHeaders:"ColumnHeaders",HeaderToolbar:"HeaderToolbar",InfoToolbar:"InfoToolbar"};t.RatingIndicatorVisualMode={Full:"Full",Half:"Half"};t.ScreenSize={Phone:"Phone",Tablet:"Tablet",Desktop:"Desktop",XXSmall:"XXSmall",XSmall:"XSmall",Small:"Small",Medium:"Medium",Large:"Large",XLarge:"XLarge",XXLarge:"XXLarge"};t.SelectionDetailsActionLevel={Item:"Item",List:"List",Group:"Group"};t.SelectType={Default:"Default",IconOnly:"IconOnly"};t.SplitAppMode={ShowHideMode:"ShowHideMode",StretchCompressMode:"StretchCompressMode",PopoverMode:"PopoverMode",HideMode:"HideMode"};t.StandardTileType={Create:"Create",Monitor:"Monitor",None:"None"};t.semantic=t.semantic||{};t.semantic.SemanticRuleSetType={Classic:"Classic",Optimized:"Optimized"};t.ObjectMarkerType={Flagged:"Flagged",Favorite:"Favorite",Draft:"Draft",Locked:"Locked",Unsaved:"Unsaved",LockedBy:"LockedBy",UnsavedBy:"UnsavedBy"};t.ObjectMarkerVisibility={IconOnly:"IconOnly",TextOnly:"TextOnly",IconAndText:"IconAndText"};t.SwipeDirection={LeftToRight:"LeftToRight",RightToLeft:"RightToLeft",BeginToEnd:"BeginToEnd",EndToBegin:"EndToBegin",Both:"Both"};t.SwitchType={Default:"Default",AcceptReject:"AcceptReject"};t.ToolbarDesign={Auto:"Auto",Transparent:"Transparent",Info:"Info",Solid:"Solid"};t.ToolbarStyle={Standard:"Standard",Clear:"Clear"};t.TimePickerMaskMode={On:"On",Off:"Off"};t.StringFilterOperator={Equals:"Equals",Contains:"Contains",StartsWith:"StartsWith",AnyWordStartsWith:"AnyWordStartsWith"};t.LightBoxLoadingStates={Loading:"LOADING",Loaded:"LOADED",TimeOutError:"TIME_OUT_ERROR",Error:"ERROR"};t.StepInputValidationMode={FocusOut:"FocusOut",LiveChange:"LiveChange"};t.StepInputStepModeType={AdditionAndSubtraction:"AdditionAndSubtraction",Multiple:"Multiple"};t.UploadState={Complete:"Complete",Error:"Error",Ready:"Ready",Uploading:"Uploading"};t.WrappingType={Normal:"Normal",Hyphenated:"Hyphenated"};t.PlanningCalendarStickyMode={None:"None",All:"All",NavBarAndColHeaders:"NavBarAndColHeaders"};t.TitleAlignment={Auto:"Auto",Start:"Start",Center:"Center"};t.AvatarShape=A;t.AvatarSize=h;t.AvatarType=n;t.AvatarColor=o;t.AvatarImageFitType=p;sap.ui.lazyRequire("sap.m.MessageToast","show");sap.ui.lazyRequire("sap.m.routing.RouteMatchedHandler");sap.ui.lazyRequire("sap.m.routing.Router");sap.ui.lazyRequire("sap.m.routing.Target");sap.ui.lazyRequire("sap.m.routing.TargetHandler");sap.ui.lazyRequire("sap.m.routing.Targets");if(D.os.ios&&D.os.version>=7&&D.os.version<8&&D.browser.name==="sf"){sap.ui.requireSync("sap/m/ios7");}if(/sap-ui-xx-formfactor=compact/.test(location.search)){q("html").addClass("sapUiSizeCompact");t._bSizeCompact=true;}if(/sap-ui-xx-formfactor=condensed/.test(location.search)){q("html").addClass("sapUiSizeCondensed");t._bSizeCondensed=true;}t.getInvalidDate=function(){return null;};t.getLocale=function(){var l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();t.getLocale=function(){return l;};return l;};t.getLocaleData=function(){var l=sap.ui.requireSync("sap/ui/core/LocaleData").getInstance(t.getLocale());t.getLocaleData=function(){return l;};return l;};t.isDate=function(v){return v&&Object.prototype.toString.call(v)=="[object Date]"&&!isNaN(v);};t.getIScroll=function(c){if(typeof window.iScroll!="function"||!(c instanceof C)){return;}var i,s;for(i=c;i=i.oParent;){s=i.getScrollDelegate?i.getScrollDelegate()._scroller:null;if(s&&s instanceof window.iScroll){return s;}}};t.getScrollDelegate=function(i,G){if(!(i instanceof C)){return;}var U=sap.ui.require("sap/ui/core/UIComponent");function j(c){if(!c){return;}return G&&U&&(c instanceof U)?c.oContainer:c.oParent;}for(var k=i;k=j(k);){if(k&&typeof k.getScrollDelegate=="function"){return k.getScrollDelegate();}}};t.ScreenSizes={phone:240,tablet:600,desktop:1024,xxsmall:240,xsmall:320,small:480,medium:560,large:768,xlarge:960,xxlarge:1120};f(t,"BaseFontSize",function(){t.BaseFontSize=q(document.documentElement).css("font-size")||"16px";return t.BaseFontSize;});t.closeKeyboard=function(){var c=document.activeElement;if(!D.system.desktop&&c&&/(INPUT|TEXTAREA)/i.test(c.tagName)){c.blur();}};t.touch=t.touch||{};t.touch.find=function(T,c){var i,j;if(!T){return;}if(c&&typeof c.identifier!=="undefined"){c=c.identifier;}else if(typeof c!=="number"){e(false,'sap.m.touch.find(): oTouch must be a touch object or a number');return;}j=T.length;for(i=0;i<j;i++){if(T[i].identifier===c){return T[i];}}};t.touch.countContained=function(T,v){var i,c=0,j,k,$;if(!T){return 0;}if(v instanceof Element){v=q(v);}else if(typeof v==="string"){v=q(document.getElementById(v));}else if(!(v instanceof q)){e(false,'sap.m.touch.countContained(): vElement must be a jQuery object or Element reference or a string');return 0;}k=v.children().length;j=T.length;for(i=0;i<j;i++){$=q(T[i].target);if((k===0&&$.is(v))||(v[0].contains($[0]))){c++;}}return c;};t.URLHelper=(function(){function i(v){return v&&Object.prototype.toString.call(v)=="[object String]";}function c(T){if(!i(T)){return"";}return T.replace(/[^0-9\+\*#]/g,"");}function j(T){if(!i(T)){return"";}T=T.split(/\r\n|\r|\n/g).join("\r\n");return encodeURIComponent(T);}return q.extend(new E(),{normalizeTel:function(T){return"tel:"+c(T);},normalizeSms:function(T){return"sms:"+c(T);},normalizeEmail:function(s,S,B,k,l){var P=[],u="mailto:",m=encodeURIComponent;i(s)&&(u+=m(q.trim(s)));i(S)&&P.push("subject="+m(S));i(B)&&P.push("body="+j(B));i(l)&&P.push("bcc="+m(q.trim(l)));i(k)&&P.push("cc="+m(q.trim(k)));if(P.length){u+="?"+P.join("&");}return u;},redirect:function(u,N){e(i(u),this+"#redirect: URL must be a string");this.fireEvent("redirect",u);if(!N){window.location.href=u;}else{var w=window.open(u,"_blank");if(!w){L.error(this+"#redirect: Could not open "+u);if(D.os.windows_phone||(D.browser.edge&&D.browser.mobile)){L.warning("URL will be enforced to open in the same window as a fallback from a known Windows Phone system restriction. Check the documentation for more information.");window.location.href=u;}}}},attachRedirect:function(F,l){return this.attachEvent("redirect",F,l);},detachRedirect:function(F,l){return this.detachEvent("redirect",F,l);},triggerTel:function(T){this.redirect(this.normalizeTel(T));},triggerSms:function(T){this.redirect(this.normalizeSms(T));},triggerEmail:function(s,S,B,k,l){this.redirect(this.normalizeEmail.apply(0,arguments));},toString:function(){return"sap.m.URLHelper";}});}());t.BackgroundHelper={addBackgroundColorStyles:function(r,B,s,c){r.addClass(c||"sapUiGlobalBackgroundColor");if(B&&!a.getType("sap.ui.core.CSSColor").isValid(B)){L.warning(B+" is not a valid sap.ui.core.CSSColor type");B="";}if(B||s){r.addStyle("background-image","none");r.addStyle("filter","none");}if(B){r.addStyle("background-color",B);}},renderBackgroundImageTag:function(r,c,v,B,R,j){r.write("<div id='"+c.getId()+"-BG' ");if(Array.isArray(v)){for(var i=0;i<v.length;i++){r.addClass(v[i]);}}else{r.addClass(v);}r.addClass("sapUiGlobalBackgroundImage");if(B){r.addStyle("display","block");r.addStyle("background-image","url("+g(B)+")");r.addStyle("background-repeat",R?"repeat":"no-repeat");if(!R){r.addStyle("background-size","cover");r.addStyle("background-position","center");}else{r.addStyle("background-position","left top");}}if(j!==1){if(j>1){j=1;}r.addStyle("opacity",j);}r.writeClasses(false);r.writeStyles();r.write("></div>");}};t.ImageHelper=(function(){function c(j,k,v){if(v!==undefined){var s=j['set'+d(k)];if(typeof(s)==="function"){s.call(j,v);return true;}}return false;}var i={getImageControl:function(I,j,P,m,r,s){e(m.src,"sap.m.ImageHelper.getImageControl: mProperties do not contain 'src'");if(j&&(j.getSrc()!=m.src)){j.destroy();j=undefined;}if(j&&(j instanceof sap.m.Image||j instanceof sap.ui.core.Icon)){for(var u in m){c(j,u,m[u]);}}else{var v=sap.ui.require("sap/m/Image")||sap.ui.requireSync("sap/m/Image");var S=Object.assign({},m,{id:I});j=sap.ui.core.IconPool.createControlByURI(S,v);j.setParent(P,null,true);}if(s){for(var l=0,w=s.length;l!==w;l++){j.removeStyleClass(s[l]);}}if(r){for(var k=0,x=r.length;k!==x;k++){j.addStyleClass(r[k]);}}return j;}};return i;}());t.PopupHelper={calcPercentageSize:function(P,B){if(typeof P!=="string"){L.warning("sap.m.PopupHelper: calcPercentageSize, the first parameter"+P+"isn't with type string");return null;}if(P.indexOf("%")<=0){L.warning("sap.m.PopupHelper: calcPercentageSize, the first parameter"+P+"is not a percentage string (for example '25%')");return null;}var c=parseFloat(P)/100,i=parseFloat(B);return Math.floor(c*i)+"px";}};t.InputODataSuggestProvider=(function(){var _=function(i){var j=i.getSource();var v=j.data(j.getId()+"-#valueListAnnotation");var m=j.getModel();var k=j.getBinding("value");var s=m.resolve(k.getPath(),k.getContext());if(!v){return;}var r=i.getParameter("selectedRow");q.each(r.getCells(),function(l,u){var w=u.getBinding("text");q.each(v.outParameters,function(K,x){if(!x.displayOnly&&x.value==w.getPath()){var V=w.getValue();var y=m.resolve(K,k.getContext());if(V&&y!==s){m.setProperty(y,V);}}});});return true;};var c=function(l,r){var M=l.getModel();var s=M.oMetadata;var P=M.resolve(l.getBindingPath("value"),l.getBindingContext());var v={};v.searchSupported=false;v.collectionPath="";v.outParameters={};v.inParameters={};v.selection=[];var u=M.getProperty(P+"/#com.sap.vocabularies.Common.v1.ValueList");if(!u){return false;}var w=P.substr(P.lastIndexOf('/')+1);v.inProperty=w;q.each(u.record,function(i,x){q.each(x,function(j,y){if(y.property==="SearchSupported"&&y.bool){v.searchSupported=true;}if(y.property==="CollectionPath"){v.collectionPath=y.string;}if(y.property==="Parameters"){q.each(y.collection.record,function(k,R){if(R.type==="com.sap.vocabularies.Common.v1.ValueListParameterIn"){var z;q.each(R.propertyValue,function(m,B){if(B.property==="LocalDataProperty"){z=B.propertyPath;}});q.each(R.propertyValue,function(m,B){if(B.property==="ValueListProperty"){v.inParameters[z]={value:B.string};}});}else if(R.type==="com.sap.vocabularies.Common.v1.ValueListParameterInOut"){var z;q.each(R.propertyValue,function(m,B){if(B.property==="LocalDataProperty"){z=B.propertyPath;}});q.each(R.propertyValue,function(m,B){if(B.property==="ValueListProperty"){v.outParameters[z]={value:B.string};v.inParameters[z]={value:B.string};}});}else if(R.type==="com.sap.vocabularies.Common.v1.ValueListParameterOut"){var z;q.each(R.propertyValue,function(m,B){if(B.property==="LocalDataProperty"){z=B.propertyPath;}});q.each(R.propertyValue,function(m,B){if(B.property==="ValueListProperty"){v.outParameters[z]={value:B.string};}});}else if(R.type==="com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"){var z;q.each(R.propertyValue,function(m,B){if(B.property==="ValueListProperty"){v.outParameters[B.string]={value:B.string,displayOnly:true};}});}});}});});v.resultEntity=s._getEntityTypeByPath("/"+v.collectionPath);v.listItem=new sap.m.ColumnListItem();q.each(v.outParameters,function(k,i){v.listItem.addCell(new sap.m.Text({text:"{"+i.value+"}",wrapping:false}));l.addSuggestionColumn(new sap.m.Column({header:new sap.m.Text({text:"{/#"+v.resultEntity.name+"/"+i.value+"/@sap:label}",wrapping:false})}));v.selection.push(i.value);});l.data(l.getId()+"-#valueListAnnotation",v);if(r){l.attachSuggestionItemSelected(_);}};var I={suggest:function(i,r,R,l){var v,j=i.getSource();r=r===undefined?true:r;R=R===undefined?true:R;if(!j.data(j.getId()+"-#valueListAnnotation")){c(j,R);}v=j.data(j.getId()+"-#valueListAnnotation");if(!v){return;}var k=function(i){var B=this.getLength();if(B&&B<=l){j.setShowTableSuggestionValueHelp(false);}else{j.setShowTableSuggestionValueHelp(true);}};if(v.searchSupported){var F=[];var s,m={};if(r){q.each(v.inParameters,function(K,u){if(K==v.inProperty){s=u.value;}else if(r){var V=j.getModel().getProperty(K,j.getBinding("value").getContext());if(V){F.push(new sap.ui.model.Filter(u.value,sap.ui.model.FilterOperator.StartsWith,V));}}});}m.search=i.getParameter("suggestValue");if(v.inParameters.length){if(s){m["search-focus"]=s;}else{e(false,'no search-focus defined');}}j.bindAggregation("suggestionRows",{path:"/"+v.collectionPath,length:l,filters:F,parameters:{select:v.selection.join(','),custom:m},events:{dataReceived:k},template:v.listItem});}else{var F=[];q.each(v.inParameters,function(K,u){if(K==v.inProperty){F.push(new sap.ui.model.Filter(u.value,sap.ui.model.FilterOperator.StartsWith,i.getParameter("suggestValue")));}else if(r){var V=j.getModel().getProperty(K,j.getBinding("value").getContext());if(V){F.push(new sap.ui.model.Filter(u.value,sap.ui.model.FilterOperator.StartsWith,V));}}});j.bindAggregation("suggestionRows",{path:"/"+v.collectionPath,filters:F,template:v.listItem,length:l,parameters:{select:v.selection.join(',')},events:{dataReceived:k}});}}};return I;}());O.set("sap.ui.layout.form.FormHelper",{createLabel:function(T,i){return new sap.m.Label(i,{text:T});},createButton:function(i,P,c){var j=this;var _=function(k){var l=new k(i,{type:t.ButtonType.Transparent});l.attachEvent('press',P,j);c.call(j,l);};var B=sap.ui.require("sap/m/Button");if(B){_(B);}else{sap.ui.require(["sap/m/Button"],_);}},setButtonContent:function(B,T,s,i,I){B.setText(T);B.setTooltip(s);B.setIcon(i);B.setActiveIcon(I);},addFormClass:function(){return"sapUiFormM";},setToolbar:function(T){var c=this.getToolbar();if(c&&c.setDesign){c.setDesign(c.getDesign(),true);}if(T&&T.setDesign){T.setDesign(sap.m.ToolbarDesign.Transparent,true);}return T;},bArrowKeySupport:false,bFinal:true});O.set("sap.ui.unified.FileUploaderHelper",{createTextField:function(i){var T=new sap.m.Input(i);return T;},setTextFieldContent:function(T,w){T.setWidth(w);},createButton:function(i){var B=new sap.m.Button(i);return B;},addFormClass:function(){return"sapUiFUM";},bFinal:true});O.set("sap.ui.unified.ColorPickerHelper",{isResponsive:function(){return true;},factory:{createLabel:function(c){return new sap.m.Label(c);},createInput:function(i,c){return new sap.m.InputBase(i,c);},createSlider:function(i,c){return new sap.m.Slider(i,c);},createRadioButtonGroup:function(c){return new sap.m.RadioButtonGroup(c);},createRadioButtonItem:function(c){return new sap.m.RadioButton(c);},createButton:function(i,c){return new sap.m.Button(i,c);}},bFinal:true});O.set("sap.ui.table.TableHelper",{createLabel:function(c){return new sap.m.Label(c);},createTextView:function(c){return new sap.m.Label(c);},addTableClass:function(){return"sapUiTableM";},bFinal:true});O.set("sap.ui.layout.GridHelper",{getLibrarySpecificClass:function(){return"";},bFinal:true});if(D.os.blackberry||D.os.android&&D.os.version>=4){q(window).on("resize",function(){var c=document.activeElement;var T=c?c.tagName:"";if(T=="INPUT"||T=="TEXTAREA"){setTimeout(function(){c.scrollIntoViewIfNeeded();},0);}});}if(!Number.MAX_SAFE_INTEGER){Number.MAX_SAFE_INTEGER=Math.pow(2,53)-1;}return t;});
