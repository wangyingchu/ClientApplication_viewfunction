//business configuration data
var APPLICATION_ID="viewfunction_inc";

var APPLICATION_ROLEBASE_ACCESS_MATRIX={};
APPLICATION_ROLEBASE_ACCESS_MATRIX["APPLICATION_SUPERVISER"]=[{
    workspaceType:"ACTIVITIES_STATISTIC",
    workspaceTitle:"工作进度统计",
    dynamicPageTitle:"<i class='icon-bar-chart'></i> 工作进度统计",
    pageUniqueId:"ACTIVITIES_STATISTIC_UID"
    },{
        workspaceType:"USER_MANAGEMENT",
        workspaceTitle:"用户管理",
        dynamicPageTitle:"<i class='icon-user'></i> 用户管理",
        pageUniqueId:"ACTIVITIES_STATISTIC_UID"
    }
];
var APPLICATION_ROLE_DISPLAYNAME_MAP={};
APPLICATION_ROLE_DISPLAYNAME_MAP["APPLICATION_SUPERVISER"]="系统管理员";
APPLICATION_ROLE_DISPLAYNAME_MAP["APPLICATION_NORMALUSER"]="普通用户";

var PARTICIPANT_SERVICE_ROOT="/ParticipantManagementService/ws/";
var USER_TYPE_PARTICIPANT="PARTICIPANT";
var USER_TYPE_ROLE="ROLE";

var MESSAGE_SERVICE_ROOT="/MessageExchangeService/ws/";
var MESSAGESERVICE_MessageType_NOTICE="MESC_MessageType_NOTICE";
var MESSAGESERVICE_MessageType_MESSAGE="MESC_MessageType_MESSAGE";
var MESSAGESERVICE_NotificationType_COMMONNOTICE= "COMMON_NOTICE";
var MESSAGESERVICE_NotificationType_ACTIVITYTASK="ACTIVITY_TASK";
var MESSAGESERVICE_NotificationType_EXTERNALRESOURCE="EXTERNAL_RESOURCE";

var VFBAM_CORE_SERVICE_ROOT="/VFBAM_ServiceApplication/ws/";
var ACTIVITY_SERVICE_ROOT=VFBAM_CORE_SERVICE_ROOT+"activityManagementService/";
var USERMANAGEMENTSERVICE_ROOT=VFBAM_CORE_SERVICE_ROOT+"userManagementService/";
var CONTENT_SERVICE_ROOT=VFBAM_CORE_SERVICE_ROOT+"contentManagementService/";
var COMMENT_SERVICE_ROOT=VFBAM_CORE_SERVICE_ROOT+"commentManagementService/";

//Addon model service definition start
var QINHE_KNOWLEDGEBASE_SERVICE_ROOT="/KnowledgeBaseService/ws/";
var KNOWLEDGE_CATEGORY_SERVICE_ROOT=QINHE_KNOWLEDGEBASE_SERVICE_ROOT+"categoryManagementService/";
var KNOWLEDGE_OPERATION_SERVICE_ROOT=QINHE_KNOWLEDGEBASE_SERVICE_ROOT+"knowledgeOperationService/";
var KNOWLEDGE_DISPLAY_PREVIEW_BASELOCATION="/KnowledgeBaseService/knowledge_fileStorage/STORAGES_BASE_NODE/";
var KNOWLEDGE_DISPLAY_PREVIEW_THUMBNAIL_FOLDER="/thumbnail/";
var KNOWLEDGE_DISPLAY_PREVIEW_CONVERTED_FOLDER="/converted/";
//Addon model service definition end
var KNOWLEDGE_CONTENTSEARCH_ROOT="/KCSearch/rest/KCSEARCHREST/";

//application context attributes
var USER_PROFILE="USER_PROFILE";
var USER_APP_INFO_ROLE="USER_APP_INFO_ROLE";

//Global Application Event Definition
var APP_GLOBAL_MESSAGECENTER_CREATEMESSAGE_EVENT="APP_GLOBAL_MESSAGECENTER_CREATEMESSAGE_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT="APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT="APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT="APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADHISTORYDOCUMENT_EVENT="APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADHISTORYDOCUMENT_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_UPDATEDOCUMENT_EVENT="APP_GLOBAL_DOCUMENTOPERATION_UPDATEDOCUMENT_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT="APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_LOCKDOCUMENT_EVENT="APP_GLOBAL_DOCUMENTOPERATION_LOCKDOCUMENT_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_UNLOCKDOCUMENT_EVENT="APP_GLOBAL_DOCUMENTOPERATION_UNLOCKDOCUMENT_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_SHOWDOCUMENTDETAIL_EVENT="APP_GLOBAL_DOCUMENTOPERATION_SHOWDOCUMENTDETAIL_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_ADDTAG_EVENT="APP_GLOBAL_DOCUMENTOPERATION_ADDTAG_EVENT";
var APP_GLOBAL_DOCUMENTOPERATION_REMOVETAG_EVENT="APP_GLOBAL_DOCUMENTOPERATION_REMOVETAG_EVENT";
var APP_GLOBAL_TASKCENTER_DISPLAYTASK_EVENT="APP_GLOBAL_TASKCENTER_DISPLAYTASK_EVENT";
var APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT="APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT";
var APP_GLOBAL_TASKCENTER_ACCEPTTASK_EVENT="APP_GLOBAL_TASKCENTER_ACCEPTTASK_EVENT";
var APP_GLOBAL_TASKCENTER_ASSIGNTASK_EVENT="APP_GLOBAL_TASKCENTER_ASSIGNTASK_EVENT";
var APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT="APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT";
var APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT="APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT";
var APP_GLOBAL_TASKCENTER_TASKDATAUPDATED_EVENT="APP_GLOBAL_TASKCENTER_TASKDATAUPDATED_EVENT";
var APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT="APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT";
var APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT="APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT";
var APP_GLOBAL_TASKCENTER_COMPLETETASK_EVENT="APP_GLOBAL_TASKCENTER_COMPLETETASK_EVENT";

var idx_aliases = [
    ["idx/oneui/form/CheckBox", "idx/form/CheckBox"],
    ["idx/oneui/form/CheckBoxList", "idx/form/CheckBoxList"],
    ["idx/oneui/form/CheckBoxSelect", "idx/form/CheckBoxSelect"],
    ["idx/form/DropDownMultiSelect", "idx/form/CheckBoxSelect"],
    ["idx/oneui/form/ComboBox", "idx/form/ComboBox"],
    ["idx/oneui/form/CurrencyTextBox", "idx/form/CurrencyTextBox"],
    ["idx/oneui/form/DateTextBox", "idx/form/DateTextBox"],
    ["idx/oneui/form/TimeTextBox", "idx/form/TimeTextBox"],
    ["idx/form/DatePicker", "idx/form/DateTextBox"],
    ["idx/form/TimePicker", "idx/form/TimeTextBox"],
    ["idx/form/DateTimePicker", "idx/form/DateTimeTextBox"],
    ["idx/oneui/form/NumberSpinner", "idx/form/NumberSpinner"],
    ["idx/oneui/form/NumberTextBox", "idx/form/NumberTextBox"],
    ["idx/oneui/form/RadioButtonSet", "idx/form/RadioButtonSet"],
    ["idx/oneui/form/FilteringSelect", "idx/form/FilteringSelect"],
    ["idx/oneui/form/Select", "idx/form/Select"],
    ["idx/oneui/form/Textarea", "idx/form/Textarea"],
    ["idx/oneui/form/TextBox", "idx/form/TextBox"],
    ["idx/oneui/form/TriStateCheckBox", "idx/form/TriStateCheckBox"],
    ["idx/oneui/form/VerticalSlider", "idx/form/VerticalSlider"],
    ["idx/oneui/form/HorizontalSlider", "idx/form/HorizontalSlider"],

    ["idx/oneui/CheckBoxTree", "idx/widget/CheckBoxTree"],
    ["idx/oneui/Dialog", "idx/widget/Dialog"],
    ["idx/oneui/Header", "idx/app/Header"],
    ["idx/oneui/HoverHelpTooltip", "idx/widget/HoverHelpTooltip"],
    ["idx/oneui/_Preview", "idx/widget/_Preview"],
    ["idx/oneui/HoverCard", "idx/widget/HoverCard"],
    ["idx/oneui/Menu", "idx/widget/Menu"],
    ["idx/oneui/MenuBar", "idx/widget/MenuBar"],
    ["idx/oneui/MenuDialog", "idx/widget/MenuDialog"],
    ["idx/oneui/MenuHeading", "idx/widget/MenuHeading"],
    ["idx/widget/ECMBreadcrumb", "idx/widget/Breadcrumb"],
    ["idx/widget/SimpleIconDialog", "idx/widget/ModalDialog"],

    ["idx/oneui/layout/HighLevelTemplate", "idx/app/HighLevelTemplate"],
    ["idx/oneui/layout/ToggleBorderContainer", "idx/layout/BorderContainer"],

    ["idx/oneui/messaging/ConfirmationDialog", "idx/widget/ConfirmationDialog"],
    ["idx/oneui/messaging/ModalDialog", "idx/widget/ModalDialog"],
    ["idx/oneui/messaging/SingleMessage", "idx/widget/SingleMessage"],
    ["idx/oneui/messaging/Toaster", "idx/widget/Toaster"],
    [/^idx\/oneui\/gridx\/(.+)$/, function(match, p1){
        return "idx/gridx/" + p1;
    }],
    ["idx/gridx/Grid", "gridx/Grid"],
    [/^idx\/gridx\/core\/(.+)$/, function(match, p1){
        return "gridx/core/" + p1;
    }],
    [/^idx\/gridx\/modules\/(?!(Sort|dnd\/.*|filter\/(QuickFilter|FilterBar|FilterDialogPane|FilterPane)|pagination\/(PaginationBar(DD)?|GotoPagePane))$)/,
        //Transform all modules except those in oneui
        function(match){
            return match.substr(4);
        }
    ],
    ["dijit/robot", "internal/dijit/robot"],
    ["dijit/robotx", "internal/dijit/robotx"],
    ["dojo/robot", "internal/dojo/robot"],
    ["dojo/robotx", "internal/dojo/robotx"],
    ["dojox/robot/recorder", "internal/dojox/robot/recorder"]
];

var idx_packages = [
    {name: "dojo", location: "./" },
    {name: "dijit", location: "../dijit" },
    {name: "dojox", location: "../dojox" },
    {name: "gridx", location: "../gridx" },
    {name: "cbtree", location: "../cbtree" },
    {name: "idx", location: "../../ibmjs/idx" },
    {name: "idxx", location: "../../ibmjs/idxx" },
    {name: "ibm", location: "../../ibmjs/ibm" },
    {name: "app", location: "../../app" },
    {name: "vfbam", location: "../../vfbam" }
];

var dojoConfig =  {
    tlmSiblingOfDojo: false,
    parseOnLoad: false,
    async: true,
    has: {
        "dojo-firebug": true,
        "dojo-debug-messages": true
    },
    aliases: idx_aliases,
    packages: idx_packages
};

var modules = [	"dojo.parser",
    "dojo.i18n",
    "dojo/_base/xhr",
    "dojo/store/Observable",
    "dojo/data/ItemFileReadStore",
    "dijit.form.DropDownButton",
    "dijit.Menu",
    "dijit.CheckedMenuItem",
    "dijit.form.TextBox",
    "dijit.form.Form",
    "dijit.form.Textarea",
    "dijit.form.NumberSpinner",
    "dijit.form.NumberTextBox",
    "dijit.form.DropDownButton",
    "dijit.form.FilteringSelect",
    "dojox.form.Uploader",
    "dijit.form.RadioButton",
    "dijit.Tree",
    "dijit.form.DateTextBox",
    "dijit.form.TimeTextBox",
    "dijit.form.ValidationTextBox",
    "dijit.Calendar",
    "dijit.Editor",
    "dijit._editor.plugins.TextColor",
    //"dijit._editor.plugins.FontChoice",
    //"dijit._editor.plugins.LinkDialog",
    "dijit._editor.plugins.Print",
    "dijit.Menu",
    "dijit.MenuItem",
    "dijit.MenuSeparator",
    "dijit.PopupMenuItem",
    "dijit.Tooltip",
    "dijit.popup",
    "dijit.layout.TabContainer",
    "dijit.layout.ContentPane",
    "dojox.calendar.Calendar",
    "dojox.timing",
    "idx.ext",
    "idx.app.A11yPrologue",
    "idx.app.AppFrame",
    "idx.app.AppMarquee",
    "idx.string",
    "idx.resources",
    "idx.bus",
    "idx.app.Workspace",
    "idx.app._A11yAreaProvider",
    "idx.app._Launcher",
    "idx.a11y",
    "idx.app.WorkspaceType",
    "idx.app.TabMenuLauncher",
    "idx.form.DropDownLink",
    "idx.form.Link",
    "idx.dialogs",
    "idx.layout.HeaderPane",
    "idx.form.Select",
    "idx.form.DropDownLink",
    "idx.layout.BorderContainer",
    "idx.layout.TitlePane",
    "idx.form.CheckBoxSelect",
    "idx.layout.MoveableTabContainer",
    "idx.form.DatePicker",
    "idx.oneui.messaging.Toaster",
    "idx.layout.TitlePane",
    "idx.form.DropDownSelect",
    "idx.form.DropDownLink",
    "idx.form.DropDownSelect",
    "idx.widget.MenuDialog",
    "idx.data.JsonStore",
   
    "vfbam.userclient.common.UI.widgets.TextDropdownButton",
    "vfbam.userclient.common.UI.widgets.ParticipantSelector",
    "vfbam.userclient.common.UI.widgets.DateTimeSelector",
    "vfbam.userclient.common.UI.widgets.NonActionBarDialog",
    "vfbam.userclient.common.UI.widgets.NestedContentContainer",
    "vfbam.userclient.common.UI.components.participantsList.ParticipantListWidget",
    "vfbam.userclient.common.UI.components.participantsList.RoleGroupParticipantListWidget",
    "vfbam.userclient.common.UI.components.participantsList.GlobalParticipantsSearchWidget",
    "vfbam.userclient.common.UI.components.participantsList.RoleSelectListWidget",
    "vfbam.userclient.common.UI.components.participantsList.RoleSelectItemWidget",
    "vfbam.userclient.common.UI.components.participantsList.ParticipantInfoWidget",
    "vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget",
    "vfbam.userclient.common.UI.components.historyList.HistoryListWidget",
    "vfbam.userclient.common.UI.components.historyList.HistoryInfoWidget",
    "vfbam.userclient.common.UI.components.documentsList.DocumentsListWidget",
    "vfbam.userclient.common.UI.components.documentsList.DocumentInfoWidget",
    "vfbam.userclient.common.UI.components.documentsList.AddNewFolderWidget",
    "vfbam.userclient.common.UI.components.documentsList.AddNewDocumentWidget",
    "vfbam.userclient.common.UI.components.documentsList.GeneralDocumentViewerWidget",
    "vfbam.userclient.common.UI.components.documentsList.AddNewTagWidget",
    "vfbam.userclient.common.UI.components.documentsList.TaskDocumentsListWidget",
    "vfbam.userclient.common.UI.components.documentsList.AdvancedDocumentInfoWidget",
    "vfbam.userclient.common.UI.components.documentsList.UpdateDocumentWidget",
    "vfbam.userclient.common.UI.components.documentsList.DocumentDetailInfoWidget",
    "vfbam.userclient.common.UI.components.documentsList.DocumentVersionHistoryListWidget",
    "vfbam.userclient.common.UI.components.documentsList.DocumentVersionInfoItemWidget",
    "vfbam.userclient.common.UI.components.documentsList.DocumentCommentsWidget",
    "vfbam.userclient.common.UI.components.documentsList.DocumentPermissionControlWidget",

    "vfbam.userclient.common.UI.components.documentsList.PermissionControlItemWidget",
    "vfbam.userclient.common.UI.components.documentsList.PermissionGroupSelectionItemWidget",
    "vfbam.userclient.common.UI.components.documentsList.PermissionGroupSelectionListWidget",

    "vfbam.userclient.common.UI.components.commentsList.CommentsListWidget",
    "vfbam.userclient.common.UI.components.commentsList.CommentInfoWidget",
    "vfbam.userclient.common.UI.components.commentsList.CommentEditorWidget",

    "vfbam.userclient.common.UI.components.advancedCommentList.AdvancedCommentsListWidget",
    "vfbam.userclient.common.UI.components.advancedCommentList.AdvancedCommentItemWidget",

    "vfbam.userclient.common.UI.components.basicTaskDataEditor.BasicTaskDataEditorWidget",
    "vfbam.userclient.common.UI.components.basicTaskToolbar.BasicTaskToolbarWidget",
    "vfbam.userclient.common.UI.components.basicTaskDataEditor.BasicTaskDataFieldWidget",
    "vfbam.userclient.common.UI.components.basicTaskDataEditor.BinaryPropertyViewerWidget",
    "vfbam.userclient.common.UI.components.basicTaskDataEditor.MultipleValuePropertyEditorWidget",
    "vfbam.userclient.common.UI.components.basicTaskDataEditor.SingleValuePropertyEditorWidget",
    "vfbam.userclient.common.UI.components.activityLauncher.ActivityLauncherWidget",
    "vfbam.userclient.common.UI.components.activityLauncher.ActivityTypeDefinitionWidget",
    "vfbam.userclient.common.UI.components.activityLauncher.ActivityStarterWidget",
    "vfbam.userclient.common.UI.components.activityLauncher.ActivityStartDataEditorWidget",
    "vfbam.userclient.common.UI.components.participantProfile.ParticipantProfileEditorWidget",
    "vfbam.userclient.common.UI.components.participantProfile.ParticipantFacePhotoUploaderWidget",
    "vfbam.userclient.common.UI.components.participantProfile.ParticipantPasswordResetWidget",
    "vfbam.userclient.common.UI.components.participantDetailInfo.ParticipantDetailInfoWidget",
    "vfbam.userclient.common.UI.components.participantProfile.NewParticipantEditorWidget",

    "vfbam.userclient.common.LOGIC.notificationHandler.NotificationHandlerWidget",
    "vfbam.userclient.common.LOGIC.taskHandler.GlobalTaskOperationHandlerWidget",
    "vfbam.userclient.common.LOGIC.documentHandler.GlobalDocumentOperationHandlerWidget",
    "vfbam.userclient.common.LOGIC.documentHandler.DocumentContentMetaInfoHandleUtil",
    "vfbam.userclient.common.LOGIC.authorityHandler.GlobalAuthorityOperationHandlerWidget",

    "vfbam.userclient.components.messageCenter.widget.messageList.MessageListWidget",
    "vfbam.userclient.components.messageCenter.widget.messagePreview.MessagePreviewWidget",
    "vfbam.userclient.components.messageCenter.widget.messageList.MessageMagazineViewItemWidget",
    "vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget",
    "vfbam.userclient.components.messageCenter.widget.messageEditor.MessageViewerWidget",
    "vfbam.userclient.components.messageCenter.widget.messageEditor.MessageReceiverInfoWidget",
    "vfbam.userclient.components.messageCenter.widget.messageList.NotificationMagazineViewItemWidget",
    "vfbam.userclient.components.messageCenter.widget.messageList.TaskMagazineViewItemContainerWidget",
    "vfbam.userclient.components.messageCenter.widget.messageList.TaskMagazineViewItemWidget",
    "vfbam.userclient.components.taskDetails.widget.TaskDetailsDynamicPageWidget",
    "vfbam.userclient.components.taskCenter.widget.myTasksList.MyTaskMagazineViewItemWidget",
    "vfbam.userclient.components.taskCenter.widget.myTasksList.TaskPropertyWidget",
    "vfbam.userclient.components.taskCenter.widget.teamTasksQueue.SingleTeamTaskQueueWidget",
    "vfbam.userclient.components.taskCenter.widget.myTasksList.MyTaskListWidget",
    "vfbam.userclient.components.taskCenter.widget.teamTasksQueue.TeamTasksQueueWidget",

    "vfbam.userclient.components.calendarCenter.widget.CalendarDataPickerWidget",

    "vfbam.userclient.components.documentCenter.widget.documentManager.DocumentManagerWidget",
    "vfbam.userclient.components.documentCenter.widget.documentManager.DocumentListWidget",
    "vfbam.userclient.components.documentCenter.widget.documentManager.DocumentDetailInfoWidget",
    "vfbam.userclient.components.documentCenter.widget.documentManager.DocumentPreviewWidget",
    "vfbam.userclient.components.documentCenter.widget.documentManager.DocumentSearchWidget",
    "vfbam.userclient.components.documentCenter.widget.documentManager.DocumentTagInfoWidget",

    "vfbam.userclient.components.externalResource.widget.ExternalResourceDynamicPageWidget",

    "vfbam.userclient.components.userManagement.widget.userPreview.UserPreviewWidget",
    "vfbam.userclient.components.userManagement.widget.userList.UserListWidget",
    "vfbam.userclient.components.userManagement.widget.userList.UserBasicInfoMagazineViewItemWidget",

    "vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryEditorWidget",
    "vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryTreeWidget",
    "vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryInfoWidget",
    "vfbam.userclient.components.knowledgeBase.widget.categoryEditor.AddCategoryPropertyWidget",
    "vfbam.userclient.components.knowledgeBase.widget.categoryEditor.RemoveCategoryPropertyWidget",
    "vfbam.userclient.components.knowledgeBase.widget.categoryEditor.PropertyItemForDeleteWidget",
    "vfbam.userclient.components.knowledgeBase.widget.categoryEditor.AddCategoryWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.AdvancedSearchWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategorySelectorWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemSelectorWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemCheckboxSelectorWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemInfoWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SelectedCategoryTagWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SaveSelectedCategoriesWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SavedCategorySearchItemWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SavedCategorySearchInfoWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationBarWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationListWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationItemWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeDisplayPanelWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDisplayWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionMainDisplayItemWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionSecondaryDisplayItemWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeQueryHistoryListWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeQueryHistoryItemWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemDetailDisplayWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.GeneralKnowledgeViewerWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemMetaInfoWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.ItemRecommendedKnowledgeWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.RelatedCollectionListWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionCommentWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget",
    "vfbam.userclient.components.knowledgeBase.util.KnowledgeBaseDataHandleUtil",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionListWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.RecommendedKnowledgeIconWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionInfoWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemWallDisplayWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.SavedCategorySearchLinkListWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.SavedCategorySearchLinkWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDetailDisplayWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionMetaInfoWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemOverviewDisplayWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagSelectorWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.UpdateKnowledgeDescriptionWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.AddNewKnowledgeItemWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.AddNewKnowledgeCollectionWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNewAddedKnowledgeItemInfoListWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNewAddedKnowledgeItemInfoWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.UpdateKnowledgeItemPreviewFileWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionSelectListWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionSelectItemWidget",
    "vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNameFilterWidget",

    "app.util.Interface",
    "app.ApplicationBaseFunctionImpl",
    "app.AppBaseCore",
    "app.UIOperationBaseCore"
];

/***
 * Handles requiring of modules and i18n modules and does it either using the legacy
 * loader or the AMD loader depending the third paramter.  The first parameter is
 * an array of module names.  Modules names can be given in two forms:
 *   - legacy dot notation (e.g.: "idx.foo.bar")
 *   - AMD slash notation (e.g.: "idx/foo/bar")
 *
 * Any modules given with dot notation will be loaded for both legacy and AMD loaders,
 * however, the dot notation will be converted to slash notation for the AMD loader.
 * Any modules specified with slash notation will ONLY be loaded for the AMD loader.
 *
 * The second parameter is the i18n modules array and must be an array of objects with
 * two fields each:
 * 	  - package: The package containing the bundle specified in dot notation
 *    - bundle: The bundle name to be loaded.
 *
 * When using the legacy loader, the i18n modules are loaded via "dojo.requireLocalization"
 * and then obtained via "dojo.i18n.getLocalization".
 *
 * The third parameter is either true or false to indicate if we should use the AMD asynchronous
 * loader or the legacy synchronous loader, respectively.  Only the legacy synchronous loader
 * is supported for Dojo 1.6.x.
 *
 * The fourth and fifth parameters specify callback functions to call before and after parsing
 * or a boolean flag indicating if parsing should be skipped and then a single callback function
 * to call.  The callback functions (if specified) take a single parameter that is an
 * associative array of module names to the loaded module.  The module names are normalized
 * to the AMD loader format using slashes.  For i18n modules, the names are in the form:
 *    "dojo/i18n!" + package + "/nls/" + bundle
 * Where package is the slash-notation version of the "package" field from the respective
 * i18n module that was specified.  The fourth parameter is referred to as "preParse" because
 * it is typically called PRIOR to parsing the document (assuming the document will be parsed
 * by this function).
 *
 * @param modules
 * @param i18nModules
 * @param async
 * @param preParse
 * @param postParse
 */
function dojoRequireModules(modules, i18nModules, async, preParse, postParse) {
    // check if "pre-parse" is being used to indicate if parsing should be skipped
    var skipParsing = false;
    if ((preParse === true) || (preParse === false)) {
        skipParsing = preParse;
        preParse = null;
    }
    if (!modules) modules = [];
    if (!i18nModules) i18nModules = [];
    if (!async) {
        var requires = ["dojo.parser"];
        var postModules = {"dojo/parser": null};
        var keys     = [ ];
        if (modules) {
            for (var index = 0; index < modules.length; index++) {
                requires.push(modules[index]);
            }
        }
        var pre1_7 = ((dojo.version.major == 1) && (dojo.version.minor < 7));
        var post1_7 = ((dojo.version.major > 1) || ((dojo.version.major == 1) && (dojo.version.minor >= 7)));
        for (var index = 0; index < requires.length; index++) {
            var dependency = requires[index];
            var dependencyKey = dependency.replace(/\./g,"/");
            if (dependency.indexOf("/") < 0) {
                if ((post1_7) || ((pre1_7) && (!(dependency in _post_1_7_modules)))) {
                    var reqresult = dojo["require"](dependency);
                    postModules[dependencyKey] = dojo.getObject(dependency, false);
                }
            }
        }
        for (var index = 0; index < i18nModules.length; index++) {
            var dependency = i18nModules[index];
            var dependencyKey = "dojo/i18n!" + dependency["package"].replace(/\./g,"/") + "/nls/" + dependency.bundle;
            dojo["requireLocalization"](dependency["package"], dependency.bundle);
            var bundle = dojo.i18n.getLocalization(dependency["package"], dependency.bundle);
            postModules[dependencyKey] = bundle;
        }
        dojo.ready(function() {
            if (preParse) {
                preParse.call(null, postModules);
            }
            if (!skipParsing) dojo.parser.parse();
            if (postParse) {
                postParse.call(null, postModules);
            }
        });
    } else {
        var requires = ["dojo/parser","dojo/_base/declare","dojo/domReady!"];
        var offset = requires.length;
        var i18nArgs = "";
        var postModules = { };
        for (var index = 0; index < requires.length; index++) {
            postModules[requires[index]] = null;
        }
        for (var index = 0; index < modules.length; index++) {
            var dependency = modules[index];
            dependency = dependency.replace(/\./g,"/");
            if (! (dependency in postModules)) {
                requires.push(dependency);
                postModules[dependency] = null;
            }
        }
        var i18nOffset = requires.length;
        for (var index = 0; index < i18nModules.length; index++) {
            var dependency = i18nModules[index];
            dependency = "dojo/i18n!" + dependency["package"].replace(/\./g,"/") + "/nls/" + dependency.bundle;
            if (! (dependency in postModules)) {
                requires.push(dependency);
                postModules[dependency] = null;
            }
        }
        require(requires, function(parser) {
            for (var index = 0; index < requires.length; index++) {
                postModules[requires[index]] = arguments[index];
            }
            if (preParse) {
                preParse.call(null, postModules);
            }
            if (!skipParsing) parser.parse();
            if (postParse) {
                postParse.call(null, postModules);
            }
        });
    }
}

//method to apply theme
var themes = {
    oneui: {label: 'One UI', name: 'One UI', code: 'oneui', cssClass: 'oneui'},
    claro: {label: 'Claro', name: 'Claro', code: 'claro', cssClass: 'claro'},
    vienna: {label: 'Vienna', name: 'Vienna (on Claro)\u200e', code: 'vienna', cssClass: 'claro vienna'}
};

var bidiOptions = {
    def: {label: 'BiDi (default)\u200e', name: null, code: null, direction: null},
    ltr: {label: 'BiDi (LTR)\u200e', name: 'Left to Right', code: 'ltr', direction: 'ltr'},
    rtl: {label: 'BiDi (RTL)\u200e', name: 'Right to Left', code: 'rtl', direction: 'rtl'}
};

var a11yOptions = {
    def: {label: 'A11y (default)\u200e', name: null, code: null, activated: null},
    "true": {label: 'A11y (on)\u200e', name: 'On', code: 'true', activated: true},
    "false": {label: 'A11y (off)\u200e', name: 'Off', code: 'false', activated: false}
};

//permission denied issue for iframe cross domain
var currentTheme = themes.oneui;
try{
    if ((window.parent) && (window.parent.currentTheme)){
        currentTheme = window.parent.currentTheme;
    }
}catch(e){
    //console.log(e.message);
}
var bidiDirection = bidiOptions.def;
try{
    if ((window.parent) && (window.parent.bidiDirection)) {
        bidiDirection = window.parent.bidiDirection;
    }
}catch(e){
    //console.log(e.message);
}

var a11yMode = a11yOptions.def;
try{
    if ((window.parent) && (window.parent.a11yMode)){
        a11yMode = window.parent.a11yMode;
    }
}catch(e){
    //console.log(e.message);
}

function queryToObject(str) {
    // NOTE: The implementation below is taken directly from Dojo 1.7.2's dojo/io-query
    var dec = decodeURIComponent, qp = str.split("&"), ret = {}, name, val;
    for(var i = 0, l = qp.length, item; i < l; ++i){
        item = qp[i];
        if(item.length){
            var s = item.indexOf("=");
            if(s < 0){
                name = dec(item);
                val = "";
            }else{
                name = dec(item.slice(0, s));
                val  = dec(item.slice(s + 1));
            }
            if(typeof ret[name] == "string"){ // inline'd type check
                ret[name] = [ret[name]];
            }

            if(ret[name] && (ret[name] instanceof Array || typeof ret[name] == "array")){
                ret[name].push(val);
            }else{
                ret[name] = val;
            }
        }
    }
    return ret; // Object
}

function parseCurrentURL() {
    var result = {};
    result.wholeURL = "" + document.location;
    var currentURL  = result.wholeURL;
    result.queryParams = null;
    var anchorIndex = currentURL.indexOf('#');
    result.urlAnchors  = "";
    if ((anchorIndex > 0) && (anchorIndex < (currentURL.length - 1))) {
        result.urlAnchors = currentURL.substring(anchorIndex);
        currentURL = currentURL.substring(0, anchorIndex);
    }
    result.baseURL  = currentURL;
    var queryIndex  = currentURL.indexOf('?');
    if ((queryIndex > 0) && (queryIndex < (currentURL.length - 1))) {
        result.baseURL = currentURL.substring(0, queryIndex);
        var suffix = currentURL.substr(queryIndex+1);
        result.queryParams = queryToObject(suffix);
        if (themes[result.queryParams.theme]) {
            result.currentTheme = themes[result.queryParams.theme];
        }

        if (bidiOptions[result.queryParams.dir]) {
            result.bidiDirection = bidiOptions[result.queryParams.dir];
        }
        if (a11yOptions[result.queryParams.a11y]) {
            result.a11yMode = a11yOptions[result.queryParams.a11y];
        }
    }
    return result;
}

var initialURL = parseCurrentURL();
if (initialURL.currentTheme) currentTheme = initialURL.currentTheme;
if (initialURL.bidiDirection) bidiDirection = initialURL.bidiDirection;
if (initialURL.a11yMode) a11yMode = initialURL.a11yMode;

function applyThemeToBody(explicitThemeClass) {
    var doc = window["document"] || null;
    var className = "class";

    // sniffing code pulled from Dojo 1.7.2 dojo/_base/sniff.js
    var userAgent = navigator.userAgent;
    var ieVersion = parseFloat(userAgent.split("MSIE ")[1]) || undefined;

    if (ieVersion == 7) className = "className";

    var themeClass = null;
    if (currentTheme && currentTheme.cssClass) themeClass = currentTheme.cssClass;
    if (explicitThemeClass) themeClass = explicitThemeClass;

    var bodyTag = doc.body || document.getElementsByTagName("body")[0];
    if ((bidiDirection) && (bidiDirection.direction != null)) {
        bodyTag.setAttribute("dir", bidiDirection.direction);
    }
    if (themeClass) {
        var currentClass = bodyTag.getAttribute(className);
        if ( (!currentClass) || (currentClass.length = 0)) {
            currentClass = "";
        } else {
            currentClass = currentClass + " ";
        }
        bodyTag.setAttribute(className, currentClass + themeClass);
    }
    if ((a11yMode) && (a11yMode.code != null)) {
        var currentClass = bodyTag.getAttribute(className);
        if ( (!currentClass) || (currentClass.length = 0)) {
            currentClass = "";
        } else {
            currentClass = currentClass + " ";
        }
        if (a11yMode.activated) {
            if (currentClass.indexOf("dijit_a11y") < 0) {
                bodyTag.setAttribute(className, currentClass + "dijit_a11y");
            }
        } else {
            if (currentClass.indexOf("dijit_a11y") >= 0) {
                bodyTag.setAttribute(className, currentClass.replace("dijit_a11y", ""));
            }
        }
    }
}
