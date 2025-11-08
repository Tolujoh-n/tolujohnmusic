import { useQuery } from '@tanstack/react-query';
import HeroSection from '../sections/HeroSection';
import TourSection from '../sections/TourSection';
import AboutSection from '../sections/AboutSection';
import VideoSection from '../sections/VideoSection';
import MusicSection from '../sections/MusicSection';
import MerchSpotlightSection from '../sections/MerchSpotlightSection';
import SubscribeSection from '../sections/SubscribeSection';
import { PublicAPI } from '../lib/api';

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['home'],
    queryFn: PublicAPI.getHome,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-8">
          <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
          <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
          <div className="h-96 animate-pulse rounded-3xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="font-heading text-4xl font-semibold uppercase tracking-[0.6em] text-white">
          We hit a wrong note
        </h1>
        <p className="mt-6 text-sm text-slate-300">
          We couldn’t load the latest updates right now. Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  const { hero, about, tourDates, latestVideo, music, merch } = data;

  return (
    <>
      <HeroSection hero={hero} />
      <TourSection tourDates={tourDates} />
      <AboutSection about={about} />
      <VideoSection video={latestVideo} />
      <MusicSection tracks={music} />
      <MerchSpotlightSection items={merch} />
      <SubscribeSection />
    </>
  );
};

export default HomePage;

