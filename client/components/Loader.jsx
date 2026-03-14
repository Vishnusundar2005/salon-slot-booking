export default function Loader({ fullPage = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div 
      className={`animate-spin rounded-full border-t-transparent border-indigo-600 ${sizeClasses[size] || sizeClasses.md}`}
    ></div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center z-[100]">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center py-4">{spinner}</div>;
}
