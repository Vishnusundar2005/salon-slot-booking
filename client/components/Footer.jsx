export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] dark:shadow-none mt-auto border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Slotify Salon Booking. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
