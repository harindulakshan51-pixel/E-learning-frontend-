const storageUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://wlbbtprbqprjphegkdtq.supabase.co').replace(/\/$/, '');
const bucket = import.meta.env.VITE_SUPABASE_IMAGE_BUCKET || 'Images';
export const publicImage = path => `${storageUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`;
export const DEFAULT_PROFILE_IMAGE = publicImage('defaultprofileBG .jpg');
export const LOGO_IMAGE = publicImage('logo.png');
export const HERO_IMAGE = publicImage('hero_image1.jpeg');
export const COURSE_IMAGES = {
  web: publicImage('1777212655835-Full Stack Web Development.jpg'),
  python: publicImage('1777212737123-Python for Data Science.jpg'),
  design: publicImage('1777212843073-UI-UX Design Fundamentals.jpg'),
};
export const DEFAULT_COURSE_IMAGE = COURSE_IMAGES.web;
