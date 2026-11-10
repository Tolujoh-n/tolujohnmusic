import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthAPI, AdminAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { SocialLinks, SocialPlatform } from '../../types/content';
import { emptySocialLinks, SOCIAL_PLATFORM_META, SOCIAL_PLATFORM_ORDER } from '../../lib/socialLinks';
import SocialLinksPreview from '../../components/SocialLinks';

const AdminProfilePage = () => {
  const queryClient = useQueryClient();
  const { updateAdmin } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: AuthAPI.getProfile,
  });
  const { data: siteSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: AdminAPI.getSiteSettings,
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });
  const [socialForm, setSocialForm] = useState<SocialLinks>(emptySocialLinks());

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (siteSettings?.socialLinks) {
      setSocialForm({
        ...emptySocialLinks(),
        ...siteSettings.socialLinks,
      });
    }
  }, [siteSettings]);

  const profileMutation = useMutation({
    mutationFn: () =>
      AuthAPI.updateProfile({
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      }),
    onSuccess: (updated) => {
      updateAdmin(updated);
      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    },
  });

  const socialMutation = useMutation({
    mutationFn: () => AdminAPI.saveSiteSettings({ socialLinks: socialForm }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: SocialPlatform, value: string) => {
    setSocialForm((prev) => ({ ...prev, [platform]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    profileMutation.mutate();
  };

  const handleSocialSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    socialMutation.mutate();
  };

  if ((isLoading && !data) || (settingsLoading && !siteSettings)) {
    return <div className="h-48 animate-pulse rounded-3xl bg-white/5" />;
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Profile</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Account Settings
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Update your personal details, secure your admin access, and manage public social links.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
      >
        <div>
          <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Account</h2>
          <p className="mt-2 text-sm text-slate-300">Name, email, and password for this admin login.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Required to set new password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {profileMutation.isSuccess && (
            <p className="text-sm font-semibold text-accent-200">Profile updated successfully.</p>
          )}
          {profileMutation.isError && (
            <p className="text-sm text-red-300">
              {(profileMutation.error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
                (profileMutation.error instanceof Error
                  ? profileMutation.error.message
                  : 'Unable to update profile.')}
            </p>
          )}
          <button
            type="submit"
            disabled={profileMutation.isPending}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {profileMutation.isPending ? 'Saving...' : 'Save Account'}
          </button>
        </div>
      </form>

      <form
        onSubmit={handleSocialSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
      >
        <div>
          <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Social Media Links</h2>
          <p className="mt-2 text-sm text-slate-300">
            These appear in the site footer. Leave a field blank to hide that icon. Facebook and X are
            supported alongside Spotify, Apple Music, Instagram, and YouTube.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {SOCIAL_PLATFORM_ORDER.map((platform) => {
            const meta = SOCIAL_PLATFORM_META[platform];
            const Icon = meta.Icon;
            return (
              <div key={platform}>
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <Icon className="h-4 w-4 text-accent-300" />
                  {meta.label}
                </label>
                <input
                  type="url"
                  value={socialForm[platform]}
                  onChange={(event) => handleSocialChange(platform, event.target.value)}
                  placeholder={meta.placeholder}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live preview</p>
          <div className="mt-4">
            <SocialLinksPreview links={socialForm} showHeading />
            {!SOCIAL_PLATFORM_ORDER.some((key) => socialForm[key]?.trim()) && (
              <p className="text-sm text-slate-500">No icons will show until at least one link is set.</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {socialMutation.isSuccess && (
            <p className="text-sm font-semibold text-accent-200">Social links saved.</p>
          )}
          {socialMutation.isError && (
            <p className="text-sm text-red-300">
              {(socialMutation.error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
                (socialMutation.error instanceof Error
                  ? socialMutation.error.message
                  : 'Unable to save social links.')}
            </p>
          )}
          <button
            type="submit"
            disabled={socialMutation.isPending}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {socialMutation.isPending ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfilePage;
