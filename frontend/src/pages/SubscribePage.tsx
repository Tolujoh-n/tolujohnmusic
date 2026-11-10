import SubscribeSection from '../sections/SubscribeSection';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getPageCopy } from '../lib/siteContent';
import PageIntro from '../components/PageIntro';

const SubscribePage = () => {
  const { data: siteSettings } = useSiteSettings();
  const copy = getPageCopy(siteSettings, 'subscribe');

  return (
    <div className="bg-slate-950">
      <div className="mx-auto max-w-4xl px-6 pt-24">
        <PageIntro copy={copy} align="center" className="max-w-4xl" />
      </div>
      <SubscribeSection hideIntro />
    </div>
  );
};

export default SubscribePage;
