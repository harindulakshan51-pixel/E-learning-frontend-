import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";

export default function AdminUpdateCoursePage() {

    const location = useLocation();
    const navigate = useNavigate();

    const item = location.state;

    const [courseId] = useState(item?.courseId || "");
    const [title, setTitle] = useState(item?.title || "");
    const [description, setDescription] = useState(item?.description || "");
    const [price, setPrice] = useState(item?.price || 0);
    const [labelledPrice, setLabelledPrice] = useState(item?.labelledPrice || 0);
    const [instructor, setInstructor] = useState(item?.instructor || "");
    const [duration, setDuration] = useState(item?.duration || "");
    const [category, setCategory] = useState(item?.category || "");
    const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    async function handleSubmit() {
        setUploading(true);
        let imageUrl = item?.thumbnail;

        try {
            if (files.length > 0) {
                imageUrl = await mediaUpload(files[0]);
            }

            const token = sessionStorage.getItem("token");

            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/courses/${courseId}`,
                {
                    title,
                    description,
                    price: Number(price),
                    labelledPrice: Number(labelledPrice),
                    instructor,
                    duration,
                    category,
                    thumbnail: imageUrl,
                    isAvailable,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Course updated successfully!");
            navigate("/admin/courses");

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 p-3 sm:p-6">
            <div className="w-full max-w-6xl bg-[#f4f7fc] border border-accent-100 rounded-2xl p-4 sm:p-8 shadow-sm">

                <h1 className="text-[#1a365d] font-bold text-xl sm:text-2xl mb-6 sm:mb-8">
                    Update Course
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 sm:gap-y-6">

                    <input
                        value={courseId}
                        disabled
                        className="border p-2.5 rounded-lg bg-gray-100 text-gray-400 text-sm"
                    />

                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2.5 rounded-lg text-sm bg-white" placeholder="Title" />
                    <input value={instructor} onChange={(e) => setInstructor(e.target.value)} className="border p-2.5 rounded-lg text-sm bg-white" placeholder="Instructor" />

                    <input value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2.5 rounded-lg text-sm bg-white" placeholder="Category" />
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2.5 rounded-lg text-sm bg-white" placeholder="Price" />
                    <input value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} className="border p-2.5 rounded-lg text-sm bg-white" placeholder="Labelled Price" />

                    <input value={duration} onChange={(e) => setDuration(e.target.value)} className="border p-2.5 rounded-lg text-sm bg-white" placeholder="Duration" />

                    <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {item?.thumbnail && (
                            <img src={item.thumbnail} className="w-16 h-16 object-cover rounded-lg border shrink-0" alt="Thumbnail" />
                        )}
                        <input
                            type="file"
                            className="border p-2 rounded-lg w-full text-sm bg-white"
                            onChange={(e) => setFiles(e.target.files)}
                        />
                    </div>

                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2.5 rounded-lg md:col-span-3 h-32 text-sm bg-white" placeholder="Description" />

                    <div className="md:col-span-3 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                        <label className="flex gap-2 items-center cursor-pointer text-sm font-medium text-slate-700">
                            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="rounded" />
                            Course Available & Active
                        </label>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/courses")}
                                className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={uploading}
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition cursor-pointer"
                            >
                                {uploading ? "Uploading..." : "Update Course"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
