import React, { useState } from "react";
import { Star, CheckCircle, Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  photoUrl?: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev_1",
    name: "Sunita Chatterjee",
    city: "Kolkata",
    rating: 5,
    date: "2 days ago",
    title: "Mesmerizing craftsmanship!",
    comment:
      "I ordered this for my sister's reception and literally everyone asked where I got it from. The antique polish has a rich, real gold luster and isn't overly yellow. Lightweight and did not hurt my ears all night!",
    verified: true,
  },
  {
    id: "rev_2",
    name: "Meera Subramanian",
    city: "Chennai",
    rating: 5,
    date: "1 week ago",
    title: "Heirloom finish at an affordable price",
    comment:
      "The pearls are neatly clustered and the kundan work is intact. Securely bubble wrapped with a lovely velvet pouch. Will definitely buy more pieces.",
    verified: true,
  },
  {
    id: "rev_3",
    name: "Ayesha Qureshi",
    city: "Delhi",
    rating: 4,
    date: "2 weeks ago",
    title: "Lovely statement piece",
    comment:
      "Looks regal with my black saree. Slightly heavier than daily studs as expected for royal jhumkas, but totally worth it.",
    verified: true,
  },
];

export function ReviewSection({ productName }: { productName: string }) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      const res = await uploadToCloudinary(file, (p) => setUploadProgress(p));
      setPreviewPhoto(res.url);
      toast.success("Photo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title || !comment) return;

    const newReview: Review = {
      id: "rev_" + Date.now(),
      name,
      city: city || "India",
      rating,
      date: "Just now",
      title,
      comment,
      verified: true,
      photoUrl: previewPhoto || undefined,
    };

    setReviews([newReview, ...reviews]);
    toast.success("Thank you! Your verified review has been published.");
    setShowForm(false);
    setName("");
    setCity("");
    setTitle("");
    setComment("");
    setPreviewPhoto(null);
  };

  return (
    <div className="mt-16 pt-12 border-t border-[#E8DFD5]">
      {/* Header & Write review button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-serif text-3xl font-bold text-stone-900">
            Customer Reviews & Styling
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Real feedback from verified lovers of {productName}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 rounded-full bg-[#3B1425] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#280D19] transition-colors self-start sm:self-auto"
        >
          {showForm ? "Cancel Review" : "Write a Verified Review"}
        </button>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C6] mb-8 space-y-4 max-w-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700">Your Overall Rating:</span>
            <div className="flex text-[#D4AF37] cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? "fill-current" : "stroke-stone-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priyadarshini Rao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">City / Location</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-stone-700 font-medium mb-1">Review Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Stunning jhumkas, exceeded expectations!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border rounded-lg bg-white"
            />
          </div>

          <div className="text-xs">
            <label className="block text-stone-700 font-medium mb-1">Detailed Experience</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the shine, weight, packaging and how you styled it..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2.5 border rounded-lg bg-white"
            />
          </div>

          {/* Photo Upload with Cloudinary skeleton */}
          <div className="text-xs">
            <label className="block text-stone-700 font-medium mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#C4683C]" />
              <span>Attach A Photo (Styled by You)</span>
            </label>

            <div className="flex items-center gap-3">
              <label className="px-4 py-2 border border-stone-300 rounded-lg bg-white text-stone-700 hover:bg-stone-50 cursor-pointer inline-flex items-center gap-1.5 font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? `Uploading ${uploadProgress}%...` : "Choose Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {previewPhoto && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-300">
                  <img src={previewPhoto} alt="Upload preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {!isCloudinaryConfigured && (
              <span className="text-[10px] text-stone-400 mt-1 block">
                ⚡ Cloudinary Ready: Photos are saved locally for preview until live Cloudinary keys are placed in .env.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#3B1425] text-white rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#280D19]"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="grid gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-[#EBE4DA] space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 text-sm">{rev.name}</span>
                <span className="text-xs text-stone-400">• {rev.city}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-400">{rev.date}</span>
            </div>

            <div className="flex text-[#D4AF37]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rev.rating ? "fill-current" : "stroke-stone-300"
                  }`}
                />
              ))}
            </div>

            <h4 className="font-serif text-base font-semibold text-stone-900 pt-1">
              "{rev.title}"
            </h4>

            <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

            {rev.photoUrl && (
              <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border border-stone-200">
                <img src={rev.photoUrl} alt="Customer photo" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
