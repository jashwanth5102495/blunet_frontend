import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const SIDEBAR_VIDEO_SRC =
  'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

function canPlayHlsNatively(video: HTMLVideoElement): boolean {
  return (
    video.canPlayType('application/vnd.apple.mpegurl') !== '' ||
    video.canPlayType('application/x-mpegURL') !== ''
  );
}

function shouldEnableSidebarVideo(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return window.matchMedia('(min-width: 768px)').matches;
}

type SidebarVideoBackgroundProps = {
  className?: string;
};

export function SidebarVideoBackground({ className }: SidebarVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 768px)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => setEnabled(shouldEnableSidebarVideo());
    update();

    mqDesktop.addEventListener('change', update);
    mqMotion.addEventListener('change', update);
    return () => {
      mqDesktop.removeEventListener('change', update);
      mqMotion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {
        /* autoplay policy */
      });
    };

    if (canPlayHlsNatively(video)) {
      video.src = SIDEBAR_VIDEO_SRC;
      video.addEventListener('loadedmetadata', play, { once: true });
      return () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
    }

    if (!Hls.isSupported()) return;

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: 20,
      maxMaxBufferLength: 40,
      startLevel: -1,
    });
    hlsRef.current = hls;
    hls.loadSource(SIDEBAR_VIDEO_SRC);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, play);

    return () => {
      hls.destroy();
      hlsRef.current = null;
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [enabled]);

  return (
    <div
      className={className}
      aria-hidden
    >
      {enabled ? (
        <video
          ref={videoRef}
          className="sidebar-video-layer"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
        />
      ) : (
        <div className="sidebar-video-fallback" />
      )}
    </div>
  );
}
