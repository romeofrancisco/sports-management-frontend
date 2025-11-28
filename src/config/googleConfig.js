/**
 * Google API Configuration
 * Required for Google Docs/Sheets embedding
 */

export const GOOGLE_CONFIG = {
  // Client ID from Google Cloud Console
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  
  // API Key for Google APIs
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  
  // Scopes required for Google Drive and Docs/Sheets
  scopes: [
    'https://www.googleapis.com/auth/drive.file',        // Access files created by app
    'https://www.googleapis.com/auth/documents',         // Google Docs access
    'https://www.googleapis.com/auth/spreadsheets',      // Google Sheets access
  ].join(' '),
  
  // Discovery docs for Google APIs
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    'https://docs.googleapis.com/$discovery/rest?version=v1',
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
  ],
};

// Google Docs/Sheets embed URL patterns
export const GOOGLE_EMBED_URLS = {
  docs: (fileId) => `https://docs.google.com/document/d/${fileId}/edit?embedded=true`,
  sheets: (fileId) => `https://docs.google.com/spreadsheets/d/${fileId}/edit?embedded=true`,
  docsPreview: (fileId) => `https://docs.google.com/document/d/${fileId}/preview`,
  sheetsPreview: (fileId) => `https://docs.google.com/spreadsheets/d/${fileId}/preview`,
};

// MIME types for Google file conversion
export const GOOGLE_MIME_TYPES = {
  // Google native formats
  GOOGLE_DOC: 'application/vnd.google-apps.document',
  GOOGLE_SHEET: 'application/vnd.google-apps.spreadsheet',
  
  // Microsoft Office formats
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
  
  // Export formats
  PDF: 'application/pdf',
};

// File extension to MIME type mapping
export const EXTENSION_TO_MIME = {
  '.docx': GOOGLE_MIME_TYPES.DOCX,
  '.doc': GOOGLE_MIME_TYPES.DOC,
  '.xlsx': GOOGLE_MIME_TYPES.XLSX,
  '.xls': GOOGLE_MIME_TYPES.XLS,
};

export default GOOGLE_CONFIG;
