"use strict";

var TemplateProcessor = require('./template_processor'),
    templateVersion = require('root-require')('package.json').version,
    path = require('path'),
    util = require('util');

class SharePointProcessor extends TemplateProcessor
{
    constructor(file){
        super(file);
    }

   get placeholders() {
        var hash = {
            before_html: '<%@Master language="C#"%> \
                          <%@Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> \
                          <%@Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> \
                          <%@Register TagPrefix="wssucw" TagName="Welcome" Src="~/_controltemplates/15/Welcome.ascx"%> \
                          <%@Register TagPrefix="wssucmui" TagName="MUISelector" Src="~/_controltemplates/15/MUISelector.ascx"%> \
                          <%@Register TagPrefix="PublishingRibbon" TagName="PublishingRibbon" Src="~/_controltemplates/15/Ribbon.ascx"%> \
                          <%@Register TagPrefix="SearchWC" Namespace="Microsoft.Office.Server.Search.WebControls" Assembly="Microsoft.Office.Server.Search, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> \
                          <%@Register Tagprefix="spsswc"  Namespace="Microsoft.Office.Server.Search.WebControls" Assembly="Microsoft.Office.Server.Search, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> \
                         <%@Register Tagprefix="CQWPFooter"  Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>\
                         <%@Register Tagprefix="LCCAlerts"  Namespace="Microsoft.Office.Server.Search.WebControls" Assembly="Microsoft.Office.Server.Search, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>\
<%@Register Tagprefix="a2e8ead9d"  Namespace="Microsoft.Office.Server.Search.WebControls" Assembly="Microsoft.Office.Server.Search, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>',

            html_start_tag: '<SharePoint:SPHtmlTag lang="en" runat="server" id="SPHtmlTag" dir="&lt;%$Resources:wss,multipages_direction_dir_value%&gt;">',
            head_end: '<SharePoint:RobotsMetaTag runat="server"> \
                        </SharePoint:RobotsMetaTag> \
                        <SharePoint:CssRegistration Name="Themable/corev15.css" runat="server"> \
                        </SharePoint:CssRegistration> \
                        <SharePoint:CssLink runat="server" Version="15"> \
                        </SharePoint:CssLink> \
                        <SharePoint:PageTitle runat="server"> \
                            <asp:ContentPlaceHolder id="PlaceHolderPageTitle" runat="server"> \
                                <SharePoint:ProjectProperty Property="Title" runat="server"> \
                            </SharePoint:ProjectProperty> \
                        </asp:ContentPlaceHolder> \
                        </SharePoint:PageTitle> \
                        <SharePoint:StartScript runat="server"> \
                        </SharePoint:StartScript> \
                        <SharePoint:CacheManifestLink runat="server"> \
                        </SharePoint:CacheManifestLink> \
                        <SharePoint:PageRenderMode runat="server" RenderModeType="Standard"> \
                        </SharePoint:PageRenderMode> \
                        <SharePoint:ScriptLink language="javascript" name="core.js" OnDemand="true" runat="server" Localizable="false"> \
                        </SharePoint:ScriptLink> \
                        <SharePoint:ScriptLink language="javascript" name="menu.js" OnDemand="true" runat="server" Localizable="false"> \
                        </SharePoint:ScriptLink> \
                        <SharePoint:ScriptLink language="javascript" name="callout.js" OnDemand="true" runat="server" Localizable="false"> \
                        </SharePoint:ScriptLink> \
                        <SharePoint:ScriptLink language="javascript" name="sharing.js" OnDemand="true" runat="server" Localizable="false"> \
                        </SharePoint:ScriptLink> \
                        <SharePoint:ScriptLink language="javascript" name="suitelinks.js" OnDemand="true" runat="server" Localizable="false"> \
                        </SharePoint:ScriptLink> \
                        <SharePoint:CustomJSUrl runat="server"> \
                        </SharePoint:CustomJSUrl> \
                        <SharePoint:SoapDiscoveryLink runat="server"> \
                        </SharePoint:SoapDiscoveryLink> \
                        <SharePoint:AjaxDelta id="DeltaPlaceHolderAdditionalPageHead" Container="false" runat="server"> \
                        <asp:ContentPlaceHolder id="PlaceHolderAdditionalPageHead" runat="server"> \
                        </asp:ContentPlaceHolder> \
                        <SharePoint:DelegateControl runat="server" ControlId="AdditionalPageHead" AllowMultipleControls="true"> \
                        </SharePoint:DelegateControl> \
                        <asp:ContentPlaceHolder id="PlaceHolderBodyAreaClass" runat="server"> \
                        </asp:ContentPlaceHolder> \
                        </SharePoint:AjaxDelta> \
                        <SharePoint:AjaxDelta id="DeltaSPWebPartManager" runat="server"> \
                            <WebPartPages:SPWebPartManager runat="server"> \
                            </WebPartPages:SPWebPartManager> \
                        </SharePoint:AjaxDelta>',
            head_attribute: 'runat="server"',
            body_attribute: 'onhashchange="if (typeof(_spBodyOnHashChange) != \'undefined\') _spBodyOnHashChange();"',
            body_start: '<SharePoint:SPClientIDGenerator runat="server" ServerControlID="DeltaPlaceHolderMain;DeltaPlaceHolderPageTitleInTitleArea;DeltaPlaceHolderUtilityContent" /><SharePoint:ImageLink runat="server" /> \
                            <SharePoint:SharePointForm onsubmit="if (typeof (_spFormOnSubmitWrapper) != \'undefined\') {return _spFormOnSubmitWrapper();} else {return true;}" runat="server"><asp:ScriptManager id="ScriptManager" runat="server" EnablePageMethods="false" \ EnablePartialRendering="true" EnableScriptGlobalization="false" EnableScriptLocalization="true" /> \
                            <SharePoint:SPSecurityTrimmedControl runat="server" HideFromSearchCrawler="true" EmitDiv="true"> \
                                <div id="TurnOnAccessibility" style="display:none" class="s4-notdlg noindex"> \
                                    <a id="linkTurnOnAcc" href="#" class="ms-accessible ms-acc-button" onclick="SetIsAccessibilityFeatureEnabled(true);UpdateAccessibilityUI();document.getElementById(\'linkTurnOffAcc\').focus();return false;"> \
                                        <SharePoint:EncodedLiteral runat="server" text="&lt;%$Resources:wss,master_turnonaccessibility%&gt;" EncodeMethod="HtmlEncode"> \
                                        </SharePoint:EncodedLiteral> \
                                    </a> \
                                </div> \
                        <div id="TurnOffAccessibility" style="display:none" class="s4-notdlg noindex"> \
                            <a id="linkTurnOffAcc" href="#" class="ms-accessible ms-acc-button" onclick="SetIsAccessibilityFeatureEnabled(false);UpdateAccessibilityUI();document.getElementById(\'linkTurnOnAcc\').focus();return false;"> \
                                <SharePoint:EncodedLiteral runat="server" text="&lt;%$Resources:wss,master_turnoffaccessibility%&gt;" EncodeMethod="HtmlEncode"> \
                                </SharePoint:EncodedLiteral> \
                            </a> \
                        </div> \
                        </SharePoint:SPSecurityTrimmedControl> \
                        <div id="ms-designer-ribbon"> \
                            <PublishingRibbon:PublishingRibbon runat="server" />  \
                        </div>',
            signin: '  <SharePoint:SPSecurityTrimmedControl runat="server" AuthenticationRestrictions="AnonymousUsersOnly"> \
                            <wssucw:Welcome runat="server" EnableViewState="false"> \
                            </wssucw:Welcome> \
                        </SharePoint:SPSecurityTrimmedControl>',
            search_box: '<SearchWC:SearchBoxScriptWebPart UseSiteCollectionSettings="true" EmitStyleReference="false" ShowQuerySuggestions="false" ChromeType="None" UseSharedSettings="true" TryInplaceQuery="false" ServerInitialRender="true" runat="server"> \
                         </SearchWC:SearchBoxScriptWebPart>',
            main_nav: '<SharePoint:AjaxDelta ID="DeltaTopNavigation" BlockElement="true" CssClass="ms-displayInline ms-core-navigation ms-dialogHidden" runat="server"> \
                        <SharePoint:DelegateControl runat="server" ControlId="TopNavigationDataSource" Id="topNavigationDelegate"> \
                          <Template_Controls> \
                            <asp:SiteMapDataSource ShowStartingNode="True" SiteMapProvider="SPNavigationProvider" ID="topSiteMap" runat="server" StartingNodeUrl="sid:1002"> \
                            </asp:SiteMapDataSource></Template_Controls></SharePoint:DelegateControl> \
                        <a name="startNavigation"> \
                        </a> \
                        <asp:ContentPlaceHolder ID="PlaceHolderTopNavBar" runat="server"> \
                            <SharePoint:AspMenu ID="TopNavigationMenu" runat="server" EnableViewState="false" DataSourceID="topSiteMap" AccessKey="&lt;%$Resources:wss,navigation_accesskey%&gt;" UseSimpleRendering="true" UseSeparateCss="false" Orientation="Horizontal" StaticDisplayLevels="2"  \ AdjustForShowStartingNode="false" MaximumDynamicDisplayLevels="0" SkipLinkText="">\
                            </SharePoint:AspMenu> \
                        </asp:ContentPlaceHolder>  \
                    </SharePoint:AjaxDelta>',
            body_content: '<SharePoint:AjaxDelta ID="DeltaPlaceHolderMain" IsMainContent="true" runat="server"> \
                        <asp:ContentPlaceHolder ID="PlaceHolderMain" runat="server"> \
                        </asp:ContentPlaceHolder> \
                    </SharePoint:AjaxDelta>',
            footer_nav: '<SharePoint:AjaxDelta runat="server" CssClass="ms-displayInline ms-core-navigation ms-dialogHidden" BlockElement="True" ID="DeltaFooterNavigation"> \
                        <a name="startNavigation"></a> \
                        <asp:ContentPlaceHolder ID="PlaceHolderFooterNavBar" runat="server"> \
                            <SharePoint:AspMenu runat="server" UseSeparateCss="false" AdjustForShowStartingNode="False" StaticDisplayLevels="2" AccessKey="1" SkipLinkText="" EnableViewState="False" MaximumDynamicDisplayLevels="0" UseSimpleRendering="True" DataSourceID="topSiteMap" \ Orientation="Horizontal" ID="FooterNavigationMenu">   \
                            </SharePoint:AspMenu> \
                        </asp:ContentPlaceHolder> \
                    </SharePoint:AjaxDelta>',
            body_end: '<SharePoint:AjaxDelta id="DeltaFormDigest" BlockElement="true" runat="server"><asp:ContentPlaceHolder id="PlaceHolderFormDigest" runat="server"><SharePoint:formdigest runat="server" /></asp:ContentPlaceHolder></SharePoint:AjaxDelta></SharePoint:SharePointForm><SharePoint:AjaxDelta id="DeltaPlaceHolderUtilityContent" runat="server"><asp:ContentPlaceHolder id="PlaceHolderUtilityContent" runat="server" /></SharePoint:AjaxDelta><asp:ContentPlaceHolder id="PlaceHolderTitleAreaClass" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleBreadcrumb" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderGlobalNavigationSiteMap" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderGlobalNavigation" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderSearchArea" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBar" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderHorizontalNav" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBarDataSource" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderCalendarNavigator" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftActions" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBarTop" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderSiteName" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderPageTitleInTitleArea" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderPageDescription" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderPageImage" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleLeftBorder" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderMiniConsole" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleRightMargin" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleAreaSeparator" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderNavSpacer" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBarBorder" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderBodyLeftBorder" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderBodyRightMargin" Visible="False" runat="server" /><asp:ContentPlaceHolder id="WSSDesignConsole" Visible="False" runat="server" /><asp:ContentPlaceHolder id="SPNavigation" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderQuickLaunchTop" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderQuickLaunchBottom" Visible="False" runat="server" /><script type="text/javascript">if (typeof browseris !== "undefined") {browseris.ie = false;}</script>',
            html_end_tag: "</SharePoint:SPHtmlTag>",
            asset_path: this.asset_path,
            placeholder: this.placeholder,
            layout_begin_body:'<%@ Page language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=15.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %> \
                                <%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> \
                                <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> \
                                <%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> \
                                <%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> \
                                <%@ Register Tagprefix="Taxonomy" Namespace="Microsoft.SharePoint.Taxonomy" Assembly="Microsoft.SharePoint.Taxonomy, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> \
                                <%@ Register TagPrefix="LatestNews" Namespace="Microsoft.Office.Server.Search.WebControls" Assembly="Microsoft.Office.Server.Search, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> \
                                <asp:Content ContentPlaceholderID="PlaceHolderAdditionalPageHead" runat="server"> \
                                    <SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/> \
                                    <PublishingWebControls:EditModePanel runat="server"> \
                                        <!-- Styles for edit mode only--> \
                                        <SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>" \
                                            After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/> \
                                    </PublishingWebControls:EditModePanel> \
                                </asp:Content> \
                                <asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server"> \
                                    <SharePointWebControls:FieldValue FieldName="Title" runat="server"/> \
                                </asp:Content> \
                                <asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server"> \
                                    <SharePointWebControls:FieldValue FieldName="Title" runat="server" /> \
                                </asp:Content> \
                                <asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server"> \
                                    <SharePointWebControls:ProjectProperty Property="Description" runat="server"/> \
                                </asp:Content> \
                                <asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">',
            layout_breadcrumb:' <SharePointWebControls:ListSiteMapPath runat="server" \
                                SiteMapProviders="CurrentNavigationSwitchableProvider" \
                                RenderCurrentNodeAsLink="false" \
                                NodeStyle-CssClass=""\
                                CurrentNodeStyle-CssClass=""\
                                RootNodeStyle-CssClass=""\
                                HideInteriorRootNodes="true"\
                                SkipLinkText=""\
                                PathSeparator="">\
                                </SharePointWebControls:ListSiteMapPath>',
            layout_header:'<SharePointWebControls:TextField FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server" />',
            layout_pageContent:'<PublishingWebControls:RichHtmlField FieldName="f55c4d88-1f2e-4ad9-aaa8-819af4ee7ee8" runat="server"></PublishingWebControls:RichHtmlField>',
            layout_editPanel:'<div class="container-fluid"> \
                                <div class="row editPanel"> \
                                    <div class="col-md-12"> \
                                        <PublishingWebControls:EditModePanel runat=server id="EditModePanel1"> \
                                            <Taxonomy:TaxonomyFieldControl FieldName="PageCategory" runat="server"></Taxonomy:TaxonomyFieldControl> \
                                        </PublishingWebControls:EditModePanel> \
                                    </div> \
                                </div> \
                              </div>',
            layout_end_body: '</asp:Content>',
            logo:'<SharePoint:SPSimpleSiteLink runat="server" CssClass="logo img-responsive" ID="x7917ecc8c38d4bd69f58e338eab54c8c"><span></span></SharePoint:SPSimpleSiteLink>',
            layout_reuserblecontent_footer:'<CQWPFooter:ContentByQueryWebPart runat="server" ItemStyle="NoImage" GroupStyle="DefaultHeader" WebUrl="~sitecollection/" ItemXslLink="/Style Library/XSL Style Sheets/RC_ReusableContent.xsl" ListName="Reusable Content" FilterField1="Title" Filter2ChainingOperator="Or" FilterDisplayValue1="Footer" FilterValue1="Footer" FilterType1="Text" DataMappingViewFields="{fa564e0f-0c70-4ab9-b863-0177e6ddd247},Text;{82dd22bf-433e-4260-b26e-5b8360dd9105},HTML;" GroupByDirection="Desc" SortByDirection="Desc" ItemLimit="1" DataMappings="Description:{82dd22bf-433e-4260-b26e-5b8360dd9105},ReusableHtml,HTML;|ImageUrl:|Title:{fa564e0f-0c70-4ab9-b863-0177e6ddd247},Title,Text;|LinkUrl:|" ServerTemplate="100" UseCopyUtil="True" ShowUntargetedItems="False" EnableOriginalValue="False" ViewFlag="0" ViewContentTypeId="" ListId="00000000-0000-0000-0000-000000000000" PageSize="-1" UseSQLDataSourcePaging="True" DataSourceID="" ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False" AutoRefresh="False" AutoRefreshInterval="60" InitialAsyncDataFetch="False" Title="&lt;%$Resources:cmscore,ContentQueryWebPart_Title%&gt;" FrameType="None" SuppressWebPartChrome="False" Description="&lt;%$Resources:cmscore,ContentQueryWebPart_Description%&gt;" IsIncluded="True" ZoneID="ImportedPartZone" PartOrder="0" FrameState="Normal" AllowRemove="True" AllowZoneChange="True" AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" DetailLink="" HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="&lt;%$Resources:cmscore,WebPartImportError%&gt;" ImportErrorMessage="&lt;%$Resources:cmscore,WebPartImportError%&gt;" PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="True" ConnectionID="00000000-0000-0000-0000-000000000000" ID="g_64820d85_08aa_41d4_b223_3991f4fa728f" ChromeType="None" ExportMode="All" __MarkupType="vsattributemarkup" __WebPartId="{64820d85-08aa-41d4-b223-3991f4fa728f}" WebPart="true" Height="" Width=""> \
                <Xsl> \
                    <xsl:stylesheet version="1.0" exclude-result-prefixes="xsl cmswrt x"> \
                        <xsl:import href="/Style Library/Footer XSL Style Sheets/Header.xsl" /> \
                        <xsl:import href="/Style Library/XSL Style Sheets/RC_ReusableContent.xsl" /> \
                        <xsl:import href="/Style Library/Footer XSL Style Sheets/ContentQueryMain.xsl" /> \
                    </xsl:stylesheet> \
                </Xsl> \
                <SampleData></SampleData> \
                <DataFields /> \
                </CQWPFooter:ContentByQueryWebPart>', 
            layout_additional_page_scripts:'<asp:ContentPlaceHolder id="AdditionalPageScripts" runat="server"></asp:ContentPlaceHolder>',
            layout_alerts:'<LCCAlerts:ContentBySearchWebPart runat="server" AlwaysRenderOnServer="False" ResultType="" NumberOfItems="5" DataProviderJSON="{\'QueryGroupName\':\'Default\',\'QueryPropertiesTemplateUrl\':\'sitesearch://webroot\',\'IgnoreQueryPropertiesTemplateUrl\':false,\'SourceID\':\'8413cd39-2156-4e00-b54d-11efd9abdb89\',\'SourceName\':\'Local SharePoint Results\',\'SourceLevel\':\'Ssa\',\'CollapseSpecification\':\'\',\'QueryTemplate\':\'Path:{SiteCollection.URL} ContentTypeId:0x0100EE06D5CE5F987E41A12D509F5510A26600D47586CBEF918649982D8FABB00CAF03* AlertStatusOWSBOOL:1 (AlertGlobalOWSBOOL:1 OR owstaxIdAlertCategories:{Page.PageCategory}) \',\'FallbackSort\':[{\'d\':1,\'p\':\'PromoOrderByOWSNMBR\'}],\'FallbackSortJson\':\'[{\\\'p\\\':\\\'PromoOrderByOWSNMBR\\\',\\\'d\\\':1}]\',\'RankRules\':null,\'RankRulesJson\':\'null\',\'AsynchronousResultRetrieval\':false,\'SendContentBeforeQuery\':true,\'BatchClientQuery\':true,\'FallbackLanguage\':-1,\'FallbackRankingModelID\':\'\',\'EnableStemming\':true,\'EnablePhonetic\':false,\'EnableNicknames\':false,\'EnableInterleaving\':false,\'EnableQueryRules\':true,\'EnableOrderingHitHighlightedProperty\':false,\'HitHighlightedMultivaluePropertyLimit\':-1,\'IgnoreContextualScope\':true,\'ScopeResultsToCurrentSite\':false,\'TrimDuplicates\':false,\'Properties\':{\'TryCache\':true,\'Scope\':\'{Site.URL}\',\'UpdateLinksForCatalogItems\':true,\'EnableStacking\':true,\'ListId\':\'00000000-0000-0000-0000-000000000000\'},\'PropertiesJson\':\'{\\\'TryCache\\\':true,\\\'Scope\\\':\\\'{Site.URL}\\\',\\\'UpdateLinksForCatalogItems\\\':true,\\\'EnableStacking\\\':true,\\\'ListId\\\':\\\'00000000-0000-0000-0000-000000000000\\\'}\',\'ClientType\':\'ContentSearchRegular\',\'UpdateAjaxNavigate\':true,\'SummaryLength\':180,\'DesiredSnippetLength\':90,\'PersonalizedQuery\':false,\'FallbackRefinementFilters\':null,\'IgnoreStaleServerQuery\':false,\'RenderTemplateId\':\'DefaultDataProvider\',\'AlternateErrorMessage\':null,\'Title\':\'\'}" BypassResultTypes="True" ItemTemplateId="~sitecollection/_catalogs/masterpage/Display Templates/Content Web Parts/Item_Alert.js" GroupTemplateId="~sitecollection/_catalogs/masterpage/Display Templates/Content Web Parts/Group_Content.js" ResultsPerPage="5" SelectedPropertiesJson="[\'AlertLinkOWSURLH\',\'Path\',\'Title\',\'AlertContentOWSHTML\',\'AlertCSSOWSTEXT\',\'FileExtension\',\'SecondaryFileExtension\']" HitHighlightedPropertiesJson="[\'Title\',\'Path\',\'Author\',\'SectionNames\',\'SiteDescription\']" AvailableSortsJson="null" ShowBestBets="False" ShowPersonalFavorites="False" ShowDefinitions="False" ShowDidYouMean="False" PreloadedItemTemplateIdsJson="null" ShowAlertMe="False" QueryGroupName="Default" RenderTemplateId="~sitecollection/_catalogs/masterpage/Display Templates/Content Web Parts/Control_Alerts.js" StatesJson="{}" ServerIncludeScriptsJson="null" Title="Content Search" FrameType="None" SuppressWebPartChrome="False" Description="&lt;%$Resources:Microsoft.Office.Server.Search,CBS_Description;%&gt;" IsIncluded="True" ZoneID="ImportedPartZone" PartOrder="0" FrameState="Normal" AllowRemove="True" AllowZoneChange="True" AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" DetailLink="" HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="&lt;%$Resources:core,ImportErrorMessage;%&gt;" ImportErrorMessage="&lt;%$Resources:core,ImportErrorMessage;%&gt;" PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="True" ConnectionID="00000000-0000-0000-0000-000000000000" ID="g_571c4f3c_f8af_4203_b1da_f08004cdcbbf" ChromeType="None" ExportMode="All" __MarkupType="vsattributemarkup" __WebPartId="{571c4f3c-f8af-4203-b1da-f08004cdcbbf}" WebPart="true" Height="" Width=""></LCCAlerts:ContentBySearchWebPart>',
                             

            application_css: util.format('<!-- build:css --><link rel="stylesheet" href="/_catalogs/masterpage/public/stylesheets/application.css?%s" /><!-- endbuild -->', templateVersion)
        }

        return hash;
    }

    get templateEngine() {
       return "sharepoint";
    }

    placeholder(name) {
        return util.format('<WebPartPages:WebPartZone runat="server" Title="%s" AllowPersonalization="false" ID="placeholder%s" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>', name, name);
    }

    asset_path(file) {
        var query_string = templateVersion;
        switch(path.extname(file)) {
            case '.css':         
                return util.format('<link rel="stylesheet" href="/_catalogs/masterpage/public/stylesheets/%s?%s" />', file, query_string)
            case '.js':
                return util.format("/_catalogs/masterpage/public/javascripts/%s?%s", file, query_string)
            default:
                return util.format("/_catalogs/masterpage/public/images/%s?%s", file, query_string)
        }
   }
}

module.exports = SharePointProcessor; 