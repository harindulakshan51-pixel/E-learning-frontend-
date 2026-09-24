export default function uploadFile() {
  return Promise.reject(new Error('Direct video uploads are disabled. Use a verified DRM playback ID.'));
}
