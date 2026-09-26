let pending;
// Load once before constructing Plyr, including concurrent/Strict Mode mounts.
export function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    const created = !script;
    if (!script) { script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; }
    const finish = error => {
      clearInterval(poll); clearTimeout(timeout); script.removeEventListener('error', failed);
      if (error) { pending = undefined; if (created) script.remove(); reject(error); } else resolve();
    };
    const failed = () => finish(new Error('YouTube API could not load. Check your connection and retry.'));
    const poll = setInterval(() => { if (window.YT?.Player) finish(); }, 100);
    const timeout = setTimeout(failed, 15000);
    script.addEventListener('error', failed, { once: true });
    if (created) document.head.append(script);
  });
  return pending;
}
