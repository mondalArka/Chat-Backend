import { FileType } from 'src/interfaces.enums/database.enums';

export const getFileType = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return FileType.IMAGE;
  if (mimetype.startsWith('video/')) return FileType.VIDEO;
  if (mimetype.startsWith('audio/')) return FileType.AUDIO;

  if (
    mimetype === 'application/pdf' ||
    mimetype.includes('word') ||
    mimetype.includes('document') ||
    mimetype.includes('excel') ||
    mimetype.includes('sheet') ||
    mimetype.includes('presentation')
  ) {
    return FileType.DOCUMENT;
  }

  return FileType.IMAGE;
};
