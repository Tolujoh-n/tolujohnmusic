import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PublicAPI } from '../lib/api';
import SocialLinks from '../components/SocialLinks';
import PageIntro from '../components/PageIntro';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getContactInfo, getPageCopy } from '../lib/siteContent';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { data: siteSettings } = useSiteSettings();
  const copy = getPageCopy(siteSettings, 'contact');
  const contact = getContactInfo(siteSettings);
  const { mutateAsync, isPending, isSuccess, data, isError, error, reset } = useMutation({
    mutationFn: PublicAPI.contact,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutateAsync(form);
      setForm({ name: '', email: '', message: '' });
    } catch {
      // Prevent React runtime error overlay for expected 4xx validations (e.g. 422).
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (isSuccess || isError) {
      reset();
    }
  };

  return (
    <div className="bg-slate-950 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
        <div>
          <PageIntro copy={copy} />
          <div className="mt-10 space-y-6 text-sm text-slate-300">
            {contact.bookingEmail && (
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {contact.bookingLabel || 'Bookings & Management'}
                </p>
                <a
                  href={`mailto:${contact.bookingEmail}`}
                  className="mt-2 inline-block text-base text-white hover:text-accent-200"
                >
                  {contact.bookingEmail}
                </a>
              </div>
            )}
            {contact.pressEmail && (
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {contact.pressLabel || 'Press & Media'}
                </p>
                <a
                  href={`mailto:${contact.pressEmail}`}
                  className="mt-2 inline-block text-base text-white hover:text-accent-200"
                >
                  {contact.pressEmail}
                </a>
              </div>
            )}
            {(contact.representationName || contact.representationLocations) && (
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {contact.representationLabel || 'Representation'}
                </p>
                {contact.representationName && (
                  <p className="mt-2 text-base text-white">{contact.representationName}</p>
                )}
                {contact.representationLocations && (
                  <p className="text-sm text-slate-400">{contact.representationLocations}</p>
                )}
              </div>
            )}
            <SocialLinks
              links={siteSettings?.socialLinks}
              showHeading
              label="Social"
              className="mt-4 flex flex-wrap gap-4 text-xl text-slate-400"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-8 w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {isPending ? 'Sending...' : 'Send Message'}
          </button>

          {isSuccess && data?.message && (
            <p className="mt-6 text-sm font-semibold text-accent-200">{data.message}</p>
          )}

          {isError && error instanceof Error && (
            <p className="mt-6 text-sm text-red-300">
              {(() => {
                if (axios.isAxiosError(error)) {
                  const payload = error.response?.data as
                    | { message?: string; errors?: { msg?: string }[] }
                    | undefined;
                  const firstValidation = payload?.errors?.[0]?.msg;
                  return (
                    firstValidation ||
                    payload?.message ||
                    'Something went wrong. Please try again later.'
                  );
                }

                return error.message || 'Something went wrong. Please try again later.';
              })()}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
