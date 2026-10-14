import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import { FiUploadCloud, FiX } from "react-icons/fi"; // Added Icons

export default function AdminAddCoursePage() {
    const [courseId, setCourseId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");
    const [instructor, setInstructor] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("Development");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    // Handle Image Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!courseId || !title || !price || !instructor || !duration) {
            toast.error("Please fill in all required fields!");
            return;
        }

        setUploading(true);
        let imageUrl = "";

        try {
            if (image) {
                imageUrl = await mediaUpload(image);
            }

            const courseData = {
                courseId,
                title,
                description,
                price: Number(price),
                labelledPrice: labelledPrice ? Number(labelledPrice) : Number(price),
                instructor,
                duration,
                category,
                thumbnail: imageUrl,
                isAvailable
            };

            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/courses", 
                courseData, 
                {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    }
                }
            );

            toast.success("Course created successfully!");
            navigate("/admin/courses");

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-3 sm:p-6 md:p-12 flex justify-center items-start font-sans overflow-y-auto">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-8 relative">
                
                {/* ── Header & Close Button ── */}
                <div className="flex justify-between items-center mb-6 pb-4 sm:mb-8 sm:pb-6 border-b border-slate-100">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Add New Course</h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">Fill in the details below to create a new course.</p>
                    </div>
                    <button 
                        onClick={() => navigate("/admin/courses")}
                        className="p-2 sm:p-2.5 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200 cursor-pointer"
                        title="Close"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* ── Form Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6">
                    
                    {/* Course ID */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Course ID <span className="text-red-500">*</span></label>
                        <input
                            placeholder="e.g. CRS-101"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all"
                        />
                    </div>

                    {/* Course Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Course Title <span className="text-red-500">*</span></label>
                        <input
                            placeholder="e.g. Master React & Tailwind"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all"
                        />
                    </div>

                    {/* Instructor */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Instructor Name <span className="text-red-500">*</span></label>
                        <input
                            placeholder="e.g. Jane Doe"
                            value={instructor}
                            onChange={(e) => setInstructor(e.target.value)}
                            className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all"
                        />
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Duration <span className="text-red-500">*</span></label>
                        <input
                            placeholder="e.g. 12 Hours, 4 Weeks"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all"
                        />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Actual Price (LKR) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rs.</span>
                            <input
                                type="number"
                                placeholder="4500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Labelled Price (Discount Price) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Labelled Price <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rs.</span>
                            <input
                                type="number"
                                placeholder="6000"
                                value={labelledPrice}
                                onChange={(e) => setLabelledPrice(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all cursor-pointer"
                        >
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="Business">Business</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Music">Music</option>
                        </select>
                    </div>

                    {/* Thumbnail Image Upload Section */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">Course Thumbnail</label>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30 hover:bg-slate-50 transition-colors">
                            {/* Preview Area */}
                            <div className="w-full sm:w-36 h-28 bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium">No Image</span>
                                )}
                            </div>

                            {/* Upload Button */}
                            <div className="flex flex-col items-center sm:items-start gap-2">
                                <label className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm">
                                    <FiUploadCloud size={18} className="text-accent" />
                                    <span>Choose Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-slate-400">PNG, JPG or WEBP up to 5MB</span>
                            </div>
                        </div>
                    </div>

                    {/* Course Description */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">Course Description</label>
                        <textarea
                            rows="4"
                            placeholder="Provide a comprehensive summary of what students will achieve..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all resize-none"
                        ></textarea>
                    </div>

                </div>

                {/* ── Footer / Status & Action Buttons ── */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mt-8 pt-6 border-t border-slate-100">
                    
                    {/* Visibility Toggle Switch */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                            />
                            <div className={`block w-12 h-7 rounded-full transition-colors ${isAvailable ? 'bg-accent' : 'bg-slate-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${isAvailable ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                            {isAvailable ? 'Course is Active & Visible' : 'Course is Hidden'}
                        </span>
                    </label>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate("/admin/courses")}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            className="flex-1 sm:flex-none px-8 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer text-sm"
                        >
                            {uploading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Uploading...
                                </>
                            ) : (
                                "Save Course"
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
