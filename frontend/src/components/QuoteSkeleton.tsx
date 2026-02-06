export default function QuoteSkeleton() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-pulse space-y-2">
      <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-blue-100 dark:bg-blue-800 rounded w-2/3 mb-1"></div>
      <div className="h-3 bg-blue-100 dark:bg-blue-800 rounded w-1/4 mb-1"></div>
      <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-1/2"></div>
    </div>
  );
}
