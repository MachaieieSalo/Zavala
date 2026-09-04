// Local storage manager for user's authentic field photographs

const STORAGE_PREFIX = 'zavala_real_field_photo_';

export interface StoredPhotosMap {
  [photoId: string]: string; // photoId (e.g. 'foto_1') -> dataUrl (base64)
}

export function loadAllStoredPhotos(): StoredPhotosMap {
  const result: StoredPhotosMap = {};
  if (typeof window === 'undefined') return result;

  try {
    for (let i = 1; i <= 10; i++) {
      const id = `foto_${i}`;
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (saved) {
        result[id] = saved;
      }
    }
  } catch (e) {
    console.warn('Could not read stored photos from localStorage:', e);
  }
  return result;
}

export function saveStoredPhoto(photoId: string, dataUrl: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${photoId}`, dataUrl);
    return true;
  } catch (e) {
    console.warn('Could not save photo to localStorage (quota exceeded?):', e);
    return false;
  }
}

export function removeStoredPhoto(photoId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${photoId}`);
  } catch (e) {
    console.warn('Could not remove photo from localStorage:', e);
  }
}

export function clearAllStoredPhotos(): void {
  if (typeof window === 'undefined') return;
  try {
    for (let i = 1; i <= 10; i++) {
      localStorage.removeItem(`${STORAGE_PREFIX}foto_${i}`);
    }
  } catch (e) {
    console.warn('Could not clear stored photos:', e);
  }
}
