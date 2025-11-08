import SubscribeSection from '../sections/SubscribeSection';

const SubscribePage = () => {
  return (
    <div className="bg-slate-950">
      <div className="mx-auto max-w-4xl px-6 pt-24 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Subscribe</p>
        <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
          Inner Circle Access
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300">
          Be the first to know about unreleased songs, exclusive merch drops, tour announcements, and
          backstage moments from the Heaven on Earth Tour.
        </p>
      </div>
      <SubscribeSection />
    </div>
  );
};

export default SubscribePage;

