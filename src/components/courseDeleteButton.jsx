import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CourseDeleteButton({ courseId, reload }) {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);

      const token = sessionStorage.getItem("token");

      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/courses/" + courseId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product Deleted Successfully");

      setIsDeleting(false);
      setIsMessageOpen(false);

      reload(); // refresh table
    } catch (err) {
      console.log(err);
      toast.error("Product Delete failed");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400 transition"
        onClick={() => setIsMessageOpen(true)}
      >
        Delete
      </button>

      {isMessageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-delete-title"
            aria-describedby="course-delete-description"
            className="relative w-full max-w-md whitespace-normal rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xl sm:p-8"
          >
            <button
              aria-label="Close delete confirmation"
              className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => setIsMessageOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 ring-4 ring-red-50/50">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m0 3h.01M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>
            <h2 id="course-delete-title" className="text-xl font-bold tracking-tight text-slate-900">
              Delete course?
            </h2>
            <p id="course-delete-description" className="mt-2 break-words text-sm leading-6 text-slate-500">
              Are you sure you want to delete course <b className="font-semibold text-slate-900">{courseId}</b>?
            </p>

            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
              <button
                className="flex-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-wait disabled:opacity-60"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>

              <button
                className="flex-1 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => setIsMessageOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
