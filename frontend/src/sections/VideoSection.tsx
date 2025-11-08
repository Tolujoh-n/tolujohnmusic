import type { Video } from '../types/content';

interface VideoSectionProps {
  video?: Video;
}

const VideoSection = ({ video }: VideoSectionProps) => {
  if (!video) return null;

  const embedUrl = video.videoUrl.includes('watch?v=')
    ? video.videoUrl.replace('watch?v=', 'embed/')
    : video.videoUrl.includes('youtu.be/')
    ? video.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
    : video.videoUrl;

  return (
    <section id="videos" className="border-t border-white/5 bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Latest Visual</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold uppercase tracking-widest text-white">
              {video.title}
            </h2>
            {video.description && (
              <p className="mt-4 max-w-xl text-sm text-slate-300">{video.description}</p>
            )}
          </div>
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-accent-400"
          >
            Watch on YouTube
          </a>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-elevated">
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

