import type { CopyBlock } from '../types/content';

interface PageIntroProps {
  copy: CopyBlock;
  className?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
}

const PageIntro = ({ copy, className = 'max-w-3xl', align = 'left', as = 'h1' }: PageIntroProps) => {
  const TitleTag = as;
  const alignment = align === 'center' ? 'text-center mx-auto' : '';

  return (
    <header className={[className, alignment].filter(Boolean).join(' ')}>
      {copy.eyebrow && (
        <p className="text-sm uppercase tracking-[0.5em] text-accent-300">{copy.eyebrow}</p>
      )}
      <TitleTag
        className={[
          'font-heading font-semibold uppercase tracking-widest text-white',
          as === 'h1' ? 'mt-4 text-5xl' : 'mt-3 text-4xl',
        ].join(' ')}
      >
        {copy.title}
      </TitleTag>
      {copy.description && (
        <p className={['mt-4 text-sm text-slate-300', align === 'center' ? 'mx-auto max-w-2xl' : ''].join(' ')}>
          {copy.description}
        </p>
      )}
    </header>
  );
};

export default PageIntro;
