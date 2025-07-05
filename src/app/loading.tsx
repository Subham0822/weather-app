export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        type="button"
        className="px-6 py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg flex items-center gap-2 cursor-not-allowed opacity-80"
        disabled
      >
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        Loading weather...
      </button>
    </div>
  );
}
