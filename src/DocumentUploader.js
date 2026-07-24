// // Enhanced DocumentUploader.js - Fixed Version
// import React, { useState, useEffect, useCallback } from 'react';
// import { supabase } from './supabaseClient';
// import { auth } from './Firebase/auth';
// import './DocumentUploader.css';

// function DocumentUploader() {
//   const [file, setFile] = useState(null);
//   const [docs, setDocs] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('date');
//   const [filterType, setFilterType] = useState('all');

//   // File type validation
//   const allowedTypes = {
//     'application/pdf': 'pdf',
//     'image/jpeg': 'jpg',
//     'image/jpg': 'jpg',
//     'image/png': 'png',
//     'image/gif': 'gif',
//     'text/plain': 'txt',
//     'application/msword': 'doc',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
//     'application/vnd.ms-excel': 'xls',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
//   };

//   const maxFileSize = 10 * 1024 * 1024; // 10MB

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         setUserId(user.uid);
//         setError(null);
//       } else {
//         setUserId(null);
//         setDocs([]);
//         setError('Please sign in to access your documents');
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       fetchDocs();
//     }
//   }, [userId]);

//   const fetchDocs = useCallback(async () => {
//     if (!userId) return;
    
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       console.log("Fetching files for user:", userId);
      
//       // First, let's try to list all files in the bucket to debug
//       const { data: allFiles, error: allFilesError } = await supabase
//         .storage
//         .from('mindpilot')
//         .list('', { 
//           limit: 1000,
//           sortBy: { column: 'created_at', order: 'desc' }
//         });

//       console.log("All files in bucket:", allFiles);
//       console.log("All files error:", allFilesError);

//       // Now try to list files for specific user
//       const { data, error } = await supabase
//         .storage
//         .from('mindpilot')
//         .list(userId, { // Remove the trailing slash
//           limit: 100, 
//           sortBy: { column: 'created_at', order: 'desc' }
//         });

//       console.log("User files data:", data);
//       console.log("User files error:", error);

//       if (error) {
//         throw new Error(`Failed to fetch files: ${error.message}`);
//       }

//       if (!data || data.length === 0) {
//         console.log("No files found for user:", userId);
//         setDocs([]);
//         return;
//       }

//       // Filter out folders (folders have no size and no metadata)
//       const files = data.filter(item => item.metadata && item.metadata.size > 0);
//       console.log("Filtered files:", files);

//       // Get metadata for each file with better error handling
//       const filesWithMeta = await Promise.all(
//         files.map(async (file) => {
//           try {
//             const filePath = `${userId}/${file.name}`;
//             const { data: urlData } = await supabase
//               .storage
//               .from('mindpilot')
//               .getPublicUrl(filePath);

//             return {
//               ...file,
//               uploadDate: file.created_at || file.updated_at || new Date().toISOString(),
//               url: urlData?.publicUrl,
//               fileType: getFileType(file.name),
//               fileExtension: file.name.split('.').pop()?.toLowerCase() || '',
//               size: file.metadata?.size || 0
//             };
//           } catch (err) {
//             console.warn(`Error processing ${file.name}:`, err);
//             return {
//               ...file,
//               uploadDate: file.created_at || file.updated_at || new Date().toISOString(),
//               url: null,
//               fileType: getFileType(file.name),
//               fileExtension: file.name.split('.').pop()?.toLowerCase() || '',
//               size: file.metadata?.size || 0
//             };
//           }
//         })
//       );
      
//       console.log("Files with metadata:", filesWithMeta);
//       setDocs(filesWithMeta);
      
//     } catch (error) {
//       console.error("Error fetching docs:", error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [userId]);

//   const getFileType = (fileName) => {
//     const ext = fileName.split('.').pop()?.toLowerCase();
//     const typeMap = {
//       pdf: 'document',
//       doc: 'document',
//       docx: 'document',
//       txt: 'document',
//       jpg: 'image',
//       jpeg: 'image',
//       png: 'image',
//       gif: 'image',
//       xls: 'spreadsheet',
//       xlsx: 'spreadsheet',
//       csv: 'spreadsheet'
//     };
//     return typeMap[ext] || 'other';
//   };

//   const validateFile = (file) => {
//     if (!file) return { valid: false, error: 'No file selected' };
    
//     if (file.size > maxFileSize) {
//       return { 
//         valid: false, 
//         error: `File size exceeds ${formatFileSize(maxFileSize)} limit` 
//       };
//     }
    
//     if (!allowedTypes[file.type] && !isAllowedByExtension(file.name)) {
//       return { 
//         valid: false, 
//         error: 'File type not supported. Allowed: PDF, Images, Documents, Spreadsheets' 
//       };
//     }
    
//     return { valid: true };
//   };

//   const isAllowedByExtension = (fileName) => {
//     const ext = fileName.split('.').pop()?.toLowerCase();
//     const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt', 'doc', 'docx', 'xls', 'xlsx'];
//     return allowedExtensions.includes(ext);
//   };

//   const handleFileSelect = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const validation = validateFile(selectedFile);
//       if (!validation.valid) {
//         setError(validation.error);
//         setFile(null);
//         e.target.value = '';
//         return;
//       }
//       setFile(selectedFile);
//       setError(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file || !userId) {
//       setError("Please select a file and make sure you are signed in.");
//       return;
//     }

//     const validation = validateFile(file);
//     if (!validation.valid) {
//       setError(validation.error);
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);
//     setError(null);

//     // Generate unique filename to prevent conflicts
//     const timestamp = Date.now();
//     const fileExtension = file.name.split('.').pop();
//     const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
//     const uniqueFileName = `${baseName}_${timestamp}.${fileExtension}`;
//     const filePath = `${userId}/${uniqueFileName}`;
    
//     try {
//       console.log("Uploading file to path:", filePath);
      
//       const { data, error } = await supabase
//         .storage
//         .from('mindpilot')
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: false
//         });

//       console.log("Upload result:", { data, error });

//       if (error) {
//         throw new Error(error.message);
//       } else {
//         console.log("File uploaded successfully:", data);
//         setFile(null);
//         document.querySelector('input[type="file"]').value = '';
        
//         // Refresh the file list after successful upload
//         setTimeout(() => {
//           fetchDocs();
//         }, 1000); // Give it a moment for the storage to update
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setError(`Upload failed: ${error.message}`);
//     } finally {
//       setUploadProgress(0);
//       setIsUploading(false);
//     }
//   };

//   const getDownloadLink = async (fileName) => {
//     try {
//       const { data, error } = await supabase
//         .storage
//         .from('mindpilot')
//         .createSignedUrl(`${userId}/${fileName}`, 60 * 60);

//       if (error) throw error;

//       if (data?.signedUrl) {
//         const link = document.createElement("a");
//         link.href = data.signedUrl;
//         link.download = fileName;
//         link.click();
//       } else {
//         throw new Error("Could not generate download link");
//       }
//     } catch (error) {
//       setError(`Download failed: ${error.message}`);
//     }
//   };

//   const deleteFile = async (fileName) => {
//     if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .storage
//         .from('mindpilot')
//         .remove([`${userId}/${fileName}`]);

//       if (error) throw error;

//       await fetchDocs();
//     } catch (error) {
//       setError(`Delete failed: ${error.message}`);
//     }
//   };

//   const isPreviewable = (fileName) => {
//     const previewableExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'];
//     const ext = fileName.split('.').pop()?.toLowerCase();
//     return previewableExtensions.includes(ext);
//   };

//   const previewFile = async (fileName) => {
//     try {
//       const { data, error } = await supabase
//         .storage
//         .from('mindpilot')
//         .createSignedUrl(`${userId}/${fileName}`, 60 * 60);

//       if (error) throw error;

//       if (data?.signedUrl) {
//         window.open(data.signedUrl, '_blank');
//       } else {
//         throw new Error("Preview not available");
//       }
//     } catch (error) {
//       setError(`Preview failed: ${error.message}`);
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (!bytes) return 'Unknown size';
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(1024));
//     return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Unknown date';
//     return new Date(dateString).toLocaleString();
//   };

//   const getFileIcon = (fileType, fileName) => {
//     const iconMap = {
//       document: '📄',
//       image: '🖼️',
//       spreadsheet: '📊',
//       other: '📁'
//     };
//     return iconMap[fileType] || '📁';
//   };

//   // Filter and sort documents
//   const filteredAndSortedDocs = docs
//     .filter(doc => {
//       const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesFilter = filterType === 'all' || doc.fileType === filterType;
//       return matchesSearch && matchesFilter;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return a.name.localeCompare(b.name);
//         case 'size':
//           return (b.size || 0) - (a.size || 0);
//         case 'type':
//           return a.fileType.localeCompare(b.fileType);
//         default: // date
//           return new Date(b.uploadDate) - new Date(a.uploadDate);
//       }
//     });

//   return (
//     <div className="uploader-container">
//       <h2>📁 Document Manager</h2>
//       <p className="user-id">
//         {userId ? `Signed in as: ${userId}` : 'Not signed in'}
//       </p>

//       <div className="upload-section">
//         <input 
//           type="file" 
//           onChange={handleFileSelect}
//           disabled={isUploading}
//           accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx,.xls,.xlsx"
//         />
//         <button 
//           onClick={handleUpload} 
//           disabled={!file || !userId || isUploading}
//         >
//           {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload'}
//         </button>
//       </div>

//       {file && (
//         <div className="file-preview">
//           <p>Selected: <strong>{file.name}</strong> ({formatFileSize(file.size)})</p>
//         </div>
//       )}

//       {uploadProgress > 0 && (
//         <div className="progress-bar">
//           <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
//           <span className="progress-text">{Math.round(uploadProgress)}%</span>
//         </div>
//       )}

//       {error && (
//         <div className="error-message">
//           <p>⚠️ {error}</p>
//           <button onClick={() => setError(null)} className="dismiss-btn">
//             ✕ Dismiss
//           </button>
//         </div>
//       )}

//       <div className="history-section">
//         <div className="section-header">
//           <h3>📋 Your Documents ({docs.length})</h3>
          
//           {docs.length > 0 && (
//             <div className="controls">
//               <input
//                 type="text"
//                 placeholder="Search files..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
              
//               <select 
//                 value={filterType} 
//                 onChange={(e) => setFilterType(e.target.value)}
//                 className="filter-select"
//               >
//                 <option value="all">All Types</option>
//                 <option value="document">Documents</option>
//                 <option value="image">Images</option>
//                 <option value="spreadsheet">Spreadsheets</option>
//                 <option value="other">Other</option>
//               </select>
              
//               <select 
//                 value={sortBy} 
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="sort-select"
//               >
//                 <option value="date">Sort by Date</option>
//                 <option value="name">Sort by Name</option>
//                 <option value="size">Sort by Size</option>
//                 <option value="type">Sort by Type</option>
//               </select>
//             </div>
//           )}
//         </div>
        
//         {isLoading ? (
//           <div className="loading-message">
//             <div className="loader"></div>
//             <p>Loading your files...</p>
//           </div>
//         ) : filteredAndSortedDocs.length === 0 ? (
//           <div className="empty-state">
//             {docs.length === 0 ? (
//               <>
//                 <p>No files uploaded yet.</p>
//                 <small>Upload your first document to see it here!</small>
//               </>
//             ) : (
//               <>
//                 <p>No files match your search criteria.</p>
//                 <small>Try adjusting your search or filter settings.</small>
//               </>
//             )}
//           </div>
//         ) : (
//           <ul className="file-list">
//             {filteredAndSortedDocs.map(doc => (
//               <li key={doc.name} className="file-item">
//                 <div className="file-info">
//                   <div className="file-name">
//                     <span className="file-icon">{getFileIcon(doc.fileType, doc.name)}</span>
//                     <strong>{doc.name}</strong>
//                     <span className="file-type-badge">{doc.fileExtension.toUpperCase()}</span>
//                   </div>
//                   <div className="file-meta">
//                     <span>Size: {formatFileSize(doc.size)}</span>
//                     <span>Type: {doc.fileType}</span>
//                     <span>Uploaded: {formatDate(doc.uploadDate)}</span>
//                   </div>
//                 </div>
//                 <div className="file-actions">
//                   {isPreviewable(doc.name) && (
//                     <button 
//                       onClick={() => previewFile(doc.name)}
//                       className="preview-btn"
//                       title="Preview file"
//                     >
//                       👁️ Preview
//                     </button>
//                   )}
//                   <button 
//                     onClick={() => getDownloadLink(doc.name)}
//                     className="download-btn"
//                     title="Download file"
//                   >
//                     ⬇️ Download
//                   </button>
//                   <button 
//                     onClick={() => deleteFile(doc.name)} 
//                     className="delete-btn"
//                     title="Delete file"
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Debug Section - Remove this in production */}
//       {process.env.NODE_ENV === 'development' && (
//         <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
//           <strong>Debug Info:</strong>
//           <p>User ID: {userId}</p>
//           <p>Files count: {docs.length}</p>
//           <p>Is Loading: {isLoading.toString()}</p>
//           <button onClick={fetchDocs} style={{ marginTop: '10px' }}>
//             🔄 Refresh Files
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DocumentUploader;