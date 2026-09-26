export default function uploadFile() {
  return Promise.reject(new Error('Direct video uploads are disabled. Use a YouTube URL or video ID in Admin lessons.'));
}
