import { useRef } from "react";
import { Camera, User, Loader2 } from "lucide-react";

export default function CompleteProfileShell({
  title,
  subtitle,
  photoLabel = "Profile Photo",
  photoIcon: PhotoIcon = User,
  photoPreview,
  onPhotoChange,
  onSave,
  onSkip,
  saved,
  isSubmitting = false,
  canSave = true,
  children,
}) {
  const photoInputRef = useRef(null);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-2xl bg-surface-white border border-border-subtle rounded-xl shadow-card p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-inter text-caption font-semibold uppercase tracking-wide text-text-muted bg-canvas-bg px-2.5 py-1 rounded-full">
            Step 5 of 5
          </span>
          <span className="font-inter text-caption font-semibold uppercase tracking-wide text-text-muted">
            Final Completion
          </span>
        </div>
        <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden mb-6">
          <div
            className="bg-brand-black h-full rounded-full"
            style={{ width: "100%" }}
          />
        </div>

        <h1 className="font-poppins font-bold text-card text-text-heading mb-1.5 text-center">
          {title}
        </h1>
        <p className="font-inter text-small text-text-muted text-center mb-6">
          {subtitle}
        </p>

        <div className="flex flex-col items-center mb-8">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => photoInputRef.current?.click()}
            className="relative w-20 h-20 rounded-full bg-canvas-bg border border-border-subtle overflow-hidden group disabled:opacity-50"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <PhotoIcon size={28} strokeWidth={1.5} />
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-brand-black flex items-center justify-center border-2 border-surface-white">
              <Camera size={12} strokeWidth={2} className="text-white" />
            </span>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              className="hidden"
            />
          </button>
          <span className="font-inter text-caption text-text-muted mt-2">
            {photoLabel}
          </span>
        </div>

        <div className="flex flex-col gap-6">{children}</div>

        <div className="flex flex-col items-center gap-3 mt-8">
          <span
            className={`font-inter text-small text-success transition-opacity duration-150 ${
              saved ? "opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            Saved! Redirecting...
          </span>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-8 py-3 rounded-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save & Finish"
            )}
          </button>
          <button
            onClick={onSkip}
            type="button"
            disabled={isSubmitting}
            className="font-inter text-small text-text-muted hover:text-text-heading transition-colors disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
