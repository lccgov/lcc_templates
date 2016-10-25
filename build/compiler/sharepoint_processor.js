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
                          <%@Register TagPrefix="SearchWC" Namespace="Microsoft.Office.Server.Search.WebControls" Assembly="Microsoft.Office.Server.Search, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>',
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
                        </div> \
                        <SharePoint:SPSecurityTrimmedControl runat="server" AuthenticationRestrictions="AnonymousUsersOnly"> \
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
            body_end: '<SharePoint:AjaxDelta id="DeltaFormDigest" BlockElement="true" runat="server"><asp:ContentPlaceHolder id="PlaceHolderFormDigest" runat="server"><SharePoint:formdigest runat="server" /></asp:ContentPlaceHolder></SharePoint:AjaxDelta></SharePoint:SharePointForm><SharePoint:AjaxDelta id="DeltaPlaceHolderUtilityContent" runat="server"><asp:ContentPlaceHolder id="PlaceHolderUtilityContent" runat="server" /></SharePoint:AjaxDelta><asp:ContentPlaceHolder id="PlaceHolderTitleAreaClass" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleBreadcrumb" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderGlobalNavigationSiteMap" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderGlobalNavigation" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderSearchArea" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBar" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderHorizontalNav" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBarDataSource" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderCalendarNavigator" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftActions" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBarTop" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderSiteName" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderPageTitleInTitleArea" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderPageDescription" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderPageImage" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleLeftBorder" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderMiniConsole" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleRightMargin" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderTitleAreaSeparator" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderNavSpacer" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderLeftNavBarBorder" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderBodyLeftBorder" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderBodyRightMargin" Visible="False" runat="server" /><asp:ContentPlaceHolder id="WSSDesignConsole" Visible="False" runat="server" /><asp:ContentPlaceHolder id="SPNavigation" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderQuickLaunchTop" Visible="False" runat="server" /><asp:ContentPlaceHolder id="PlaceHolderQuickLaunchBottom" Visible="False" runat="server" />',
            html_end_tag: "</SharePoint:SPHtmlTag>",
            asset_path: this.asset_path,
            placeholder: this.placeholder,
            layout_begin_body:'',
            layout_breadcrumb:'<ASP:SITEMAPPATH runat="server" sitemapproviders="SPSiteMapProvider,SPXmlContentMapProvider" rendercurrentnodeaslink="false" hideinteriorrootnodes="true" RootNodeStyle-CssClass="bc-root"><PATHSEPARATORTEMPLATE><ASP:IMAGE id="Image1" runat="Server" imageurl="/_catalogs/masterpage/images/breadcrumb_line.png"></ASP:IMAGE></PATHSEPARATORTEMPLATE></ASP:SITEMAPPATH>',
            layout_header:'<PageFieldTextField:TextField FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server" />',
            layout_end_body: '',
            application_css: ''
        }

        return hash;
    }

    get templateEngine() {
       return "sharepoint";
    }

    placeholder(name) {
        return util.format('<WebPartPages:WebPartZone runat="server" AllowPersonalization="false" ID="placeholder%s" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>', name);
    }

    asset_path(file) {
        var query_string = templateVersion;
        switch(path.extname(file)) {
            case '.css':
                return util.format("/_catalogs/masterpage/public/stylesheets/%s?%s", file, query_string)
            case '.js':
                return util.format("/_catalogs/masterpage/public/javascripts/%s?%s", file, query_string)
            default:
                return util.format("/_catalogs/masterpage/public/img/%s?%s", file, query_string)
        }
   }
}

module.exports = SharePointProcessor; 