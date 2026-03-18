export default function LoadingSpinner({ size = 'md', text = 'Analyzing your loan...' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-[3px] border-primary-200 dark:border-primary-900`} />
        <div className={`${sizes[size]} rounded-full border-[3px] border-transparent border-t-primary-500 animate-spin absolute inset-0`} />
      </div>
      {text && (
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}
