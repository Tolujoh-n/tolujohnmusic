import { useRef, useState } from 'react';
import { AdminAPI } from '../lib/api';

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
}

const ImageUploadField = ({
  label = 'Image',
  value = '',
  onChange,
  helperText = 'Upload from your computer or paste an image link.',
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const result = await AdminAPI.uploadImage(file);
      onChange(result.url);
    } catch (err: unknown) {
      const axiosMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(axiosMessage || (err instanceof Error ? err.message : 'Upload failed. Please try again.'));
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">{label}</label>

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-500">
          No image selected
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full bg-accent-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Upload Image'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              onChange('');
            }}
            className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-red-400 hover:text-red-300"
          >
            Clear
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div>
        <label className="block text-xs uppercase tracking-[0.3em] text-slate-500">
          Or paste image URL
        </label>
        <input
          type="url"
          value={value}
          onChange={(event) => {
            setError(null);
            onChange(event.target.value);
          }}
          placeholder="https://..."
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
        />
      </div>

      <p className="text-xs text-slate-500">{helperText}</p>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
};

export default ImageUploadField;
