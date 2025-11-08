import { useQuery } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';

const VideosPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['videos'],
    queryFn: PublicAPI.getVideos,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-video animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="font-heading text-4xl font-semibold uppercase tracking-[0.6em] text-white">
          Visual Catalogue
        </h1>
        <p className="mt-6 text-sm text-slate-300">We could not load the videos right now.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Videos</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
            Visual Storytelling
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            Relive electric live moments and cinematic stories from the Heaven on Earth experience.
          </p>
        </header>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {data.map((video) => {
            const embedUrl = video.videoUrl.includes('watch?v=')
              ? video.videoUrl.replace('watch?v=', 'embed/')
              : video.videoUrl.includes('youtu.be/')
              ? video.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
              : video.videoUrl;

            return (
              <article
                key={video._id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-elevated"
              >
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-white">{video.title}</h3>
                  {video.description && (
                    <p className="mt-3 text-sm text-slate-300">{video.description}</p>
                  )}
                  {video.releaseDate && (
                    <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                      Released {new Date(video.releaseDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;

