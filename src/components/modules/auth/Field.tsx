export default function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  className,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={[
          "h-11 w-full rounded-lg border bg-background px-3.5 text-[14px] text-foreground outline-none transition-colors",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-border focus:border-foreground",
        ].join(" ")}
      />
      {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
