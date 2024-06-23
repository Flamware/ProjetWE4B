// src/environments/environment.ts
export const environment = {
  production: false,
  baseUrl: 'http://localhost:3000/src', // Remplacez par votre URL de base pour servir les fichiers upload
  mediaTypeMapping: {
    'jpeg': 'image',
    'jpg': 'image',
    'png': 'image',
    'gif': 'image',
    'bmp': 'image',
    'webp': 'image',
    'mp4': 'video',
    'mov': 'video',
    'avi': 'video',
    'mkv': 'video',
    'flv': 'video',
    'webm': 'video',
    'mp3': 'audio',
    'wav': 'audio',
    'ogg': 'audio',
    'pdf': 'document',
    'doc': 'document',
    'docx': 'document',
    'xls': 'document',
    'xlsx': 'document',
    'ppt': 'document',
    'pptx': 'document',
    'txt': 'document',
    'zip': 'archive',
    'tar': 'archive',
    'gz': 'archive',
    '7z': 'archive',
    'json': 'other',
    'xml': 'other',
    'bin': 'other',
  }
};