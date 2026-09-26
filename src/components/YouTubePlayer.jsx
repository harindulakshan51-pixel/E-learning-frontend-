import { useEffect, useEffectEvent, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import icons from '../../node_modules/plyr/dist/plyr.svg?url';
import { loadYouTubeApi } from '../utils/youtubeApi';
import { api, errorMessage } from '../utils/api';
import './YouTubePlayer.css';

// Provider-specific implementation lives here so Plyr can be replaced independently.
export default function YouTubePlayer({ video, resume = 0, onProgress }) {
  const host = useRef(null);
  const [status, setStatus] = useState('Loading player…');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const report = useEffectEvent((time, completed) => onProgress?.(time, completed));
  const tracksProgress = Boolean(onProgress);
  const initialPosition = useRef(resume);
  useEffect(() => {
    let disposed = false, player, ready = false, denied = false, checking = false;
    let saveTimer, readyTimer, accessTimer;
    const root = host.current;
    // Each effect owns a separate DOM subtree; delayed destroy cannot touch a new mount.
    const island = document.createElement('div');
    root.append(island);
    const listeners = [];
    const save = (completed = false) => {
      if (ready && !denied && tracksProgress && Number.isFinite(player.currentTime)) report(player.currentTime, completed);
    };
    const destroy = () => {
      if (!player) return;
      listeners.forEach(([event, fn]) => player.off(event, fn));
      if (player.ready) player.destroy();
      else {
        // Plyr 3.8.4 destroy() is a no-op before ready. Keep this compatibility
        // cleanup isolated here; never inspect or alter YouTube's iframe DOM.
        player.embed?.destroy?.();
        Object.values(player.timers || {}).forEach(timer => { clearInterval(timer); clearTimeout(timer); });
        (player.eventListeners || []).forEach(({ element, type, callback, options }) => element.removeEventListener(type, callback, options));
        player.eventListeners = [];
      }
      player = null;
    };
    const stop = message => {
      if (disposed) return;
      denied = true;
      clearInterval(saveTimer); clearInterval(accessTimer); clearTimeout(readyTimer);
      destroy(); ready = false;
      island.replaceChildren();
      setError(message); setStatus('');
    };
    const checkAccess = async () => {
      if (checking || disposed || denied) return;
      checking = true;
      try { await api.get('/course-videos/' + encodeURIComponent(video.videoId), { timeout: 10000 }); }
      catch (e) { stop(e.response ? errorMessage(e) : 'Access could not be verified. Check your connection and retry.'); }
      finally { checking = false; }
    };
    const hidden = () => { if (document.hidden) save(); else checkAccess(); };
    document.addEventListener('visibilitychange', hidden);
    const pagehide = () => save();
    window.addEventListener('pagehide', pagehide);
    async function setup() {
      try {
        await checkAccess();
        if (disposed || denied) return;
        if (!/^[A-Za-z0-9_-]{11}$/.test(video.youtubeVideoId || '')) throw new Error('This lesson needs a YouTube video. Please contact the instructor.');
        await loadYouTubeApi();
        if (disposed || denied) return;
        const element = document.createElement('div');
        element.dataset.plyrProvider = 'youtube'; element.dataset.plyrEmbedId = video.youtubeVideoId;
        island.append(element);
        player = new Plyr(element, {
          title: video.title, iconUrl: icons, autoplay: false, playsinline: true,
          controls: ['play', 'rewind', 'fast-forward', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'fullscreen'],
          settings: ['captions', 'speed'], seekTime: 10, invertTime: true, toggleInvert: false,
          hideControls: false, clickToPlay: false, keyboard: { focused: true, global: false },
          captions: { active: true, language: 'auto', update: true },
          speed: { selected: 1, options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
          youtube: { noCookie: true, controls: 0, cc_load_policy: 1, rel: 0, origin: window.location.origin, start: Math.floor(initialPosition.current || 0) },
        });
        const on = (event, fn) => { player.on(event, fn); listeners.push([event, fn]); };
        readyTimer = setTimeout(() => stop('YouTube did not respond. Check your connection or embedding settings and retry.'), 20000);
        on('ready', () => {
          if (disposed || denied) return;
          ready = true; clearTimeout(readyTimer); setStatus('Ready. Press play to start.');
          saveTimer = setInterval(() => { if (player?.playing) save(); }, 15000);
        });
        on('playing', () => setStatus(''));
        on('seeked', () => {
          if (!player || disposed) return;
          player.media.dispatchEvent(new Event('timeupdate', { bubbles: true }));
          setStatus(player.paused ? 'Paused. Press play to continue.' : '');
        });
        on('statechange', event => {
          if (!player || disposed) return;
          if (event.detail.code === 2) setStatus('Paused. Press play to continue.');
          else if (event.detail.code === 1) setStatus('');
        });
        on('waiting', () => setStatus('Buffering…'));
        on('pause', () => { save(); setStatus('Paused. Press play to continue.'); });
        on('ended', () => { save(true); setStatus('Lesson complete.'); });
        on('error', () => {
          const code = player?.media?.error?.code;
          stop([101, 150].includes(code) ? 'Embedding is disabled by the video owner. Ask the instructor to enable embedding or replace this video.' : code === 100 ? 'This video is unavailable, private, or removed. Please contact the instructor.' : code === 153 ? 'YouTube requires a valid site referrer. Check the site Referrer-Policy.' : 'YouTube playback failed. Check your connection or try another browser.');
        });
        // Plyr uses optimistic play state; reconcile with the official API when autoplay is blocked.
        player.embed.addEventListener('onAutoplayBlocked', () => {
          if (!disposed && player) { player.pause(); setStatus('Playback was blocked by your browser. Press play to start.'); }
        });
        accessTimer = setInterval(checkAccess, 15000);
      } catch (e) { stop(e.message); }
    }
    setup();
    return () => {
      save(); disposed = true;
      clearInterval(saveTimer); clearInterval(accessTimer); clearTimeout(readyTimer);
      document.removeEventListener('visibilitychange', hidden); window.removeEventListener('pagehide', pagehide);
      destroy();
      island.remove();
    };
  }, [video.videoId, video.youtubeVideoId, video.title, attempt, tracksProgress]);
  return <div className="scholarly-player bg-black text-white">
    <div ref={host} />
    <div className="px-4 py-2 text-sm text-slate-300" role={error ? 'alert' : 'status'}>{error || status}
      {error && <button className="ml-3 text-blue-300 underline" onClick={() => { setError(''); setStatus('Loading player…'); setAttempt(n => n + 1); }}>Retry</button>}
    </div>
  </div>;
}
