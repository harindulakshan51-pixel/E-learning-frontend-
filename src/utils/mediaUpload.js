import { api } from './api';
export default async function uploadFile(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Choose a PNG, JPEG or WebP image smaller than 5 MB');
  const { data } = await api.post('/media', file, { headers: { 'Content-Type': file.type } });
  return data.url;
}
