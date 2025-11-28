export const EDITOR_SETTINGS = {
  optimizeSfdt: false,
};

// ============================================================================
// TOOLBAR ITEMS
// ============================================================================

export const TOOLBAR_ITEMS = {
  SAVE: {
    prefixIcon: "e-save icon",
    tooltipText: "Save the Document",
    text: "Save",
    id: "save",
  },
  PRINT: {
    prefixIcon: "e-print icon",
    tooltipText: "Print the Document",
    text: "Print",
    id: "print",
  },
  WRAP_TEXT: {
    prefixIcon: "e-text-wrap icon",
    tooltipText: "Wrap Text",
    text: "Wrap Text",
    id: "wrap_text",
  },
  DOWNLOAD: {
    prefixIcon: "e-download icon",
    tooltipText: "Download the Document",
    text: "Download",
    id: "download",
  },
};

// ============================================================================
// EDITOR CONFIGURATION
// ============================================================================

export const EDITOR_TOOLBAR_CONFIG = [
  "New",
  "Open",
  TOOLBAR_ITEMS.SAVE,
  "Separator",
  TOOLBAR_ITEMS.PRINT,
  // "Separator",
  // // TOOLBAR_ITEMS.WRAP_TEXT,
  // "Separator",
  TOOLBAR_ITEMS.DOWNLOAD,
  "Separator",
  "Undo",
  "Redo",
  "Separator",
  "Image",
  "Table",
  "Hyperlink",
  "Bookmark",
  "TableOfContents",
  "Separator",
  "Header",
  "Footer",
  "PageSetup",
  "PageNumber",
  "Break",
  "InsertFootnote",
  "InsertEndnote",
  "Separator",
  "Find",
  "Separator",
  "Comments",
  "TrackChanges",
  "Separator",
  "LocalClipboard",
  "RestrictEditing",
  "Separator",
  "FormFields",
  "UpdateFields",
  "ContentControl",
];

export const SYNCFUSION_DOCUMENT_SERVICE_URL =
  "https://ej2services.syncfusion.com/production/web-services/api/documenteditor/";

export const SYNCFUSION_SPREADSHEET_SERVICE_URL =
  "https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/open";

export const SYNCFUSION_SAVE_URLS = [
  "https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/save",
  "https://ej2services.syncfusion.com/production/web-services/api/documenteditor/save",
];

// ============================================================================
// TOOLBAR ACTIONS
// ============================================================================

export const TOOLBAR_ACTIONS = {
  SAVE: "save",
  PRINT: "print",
  // WRAP_TEXT: "wrap_text",
  DOWNLOAD: "download",
};
