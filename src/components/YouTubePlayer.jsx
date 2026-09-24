import { useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../utils/api';

export default function YouTubePlayer({ video, resume = 0, onProgress }) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState('');
  const lastSaved = useRef(0);
  const checkInterval = useRef(null);
  const [studentEmail, setStudentEmail] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/users/me').then(res => {
      if (active && res.data) setStudentEmail(res.data.email);
    }).catch(() => {});

    // Load YouTube Iframe API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }
      
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: video.youtubeVideoId,
        playerVars: {
          start: Math.floor(resume),
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event) => {
            const time = event.target.getCurrentTime();
            // 0 = ended, 2 = paused
            if (event.data === 0) save(time, true, true);
            else if (event.data === 2) save(time, false, true);
          },
          onError: () => {
            setError('This video could not play. It may be private, removed, or have embedding disabled.');
          }
        }
      });

      checkInterval.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getPlayerState) {
          const state = playerRef.current.getPlayerState();
          // 1 = playing
          if (state === 1) {
            save(playerRef.current.getCurrentTime(), false, false);
          }
        }
      }, 5000);
    };

    initPlayer();

    return () => {
      active = false;
      if (checkInterval.current) clearInterval(checkInterval.current);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [video.youtubeVideoId]);

  function save(time, completed = false, force = false) {
    if (!onProgress || (!force && Date.now() - lastSaved.current < 15000)) return;
    lastSaved.current = Date.now();
    onProgress(time || 0, completed);
  }

  if (error) return <div role="alert" className="aspect-video flex items-center justify-center p-8 bg-gray-900 text-slate-200 text-center">{error}</div>;

  return (
    <div 
      className="relative aspect-video bg-black w-full"
      onContextMenu={e => e.preventDefault()}
    >
      <div ref={iframeRef} className="w-full h-full border-0"></div>
      
      {studentEmail && (
        <div 
          className="absolute top-4 right-4 opacity-30 text-white text-xs font-mono select-none"
          style={{ pointerEvents: 'none', textShadow: '1px 1px 2px black' }}
        >
          {studentEmail}
        </div>
      )}
    </div>
  );
}
