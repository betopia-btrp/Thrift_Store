"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, X, CheckCircle, ChevronRight, ImagePlus,
  DollarSign, Tag, AlignLeft, Package, MapPin
} from "lucide-react";
import { CATEGORIES, type Category, type Condition } from "@/lib/data";

type Step = 1 | 2 | 3 | 4;

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "" as Condition | "",
    category: "" as Category | "",
    location: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [paymentDone, setPaymentDone] = useState(false);

  const conditions: Condition[] = ["New", "Like New", "Good", "Fair"];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Simulate image upload with placeholder images
    const placeholders = [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400",
    ];
    setImages(placeholders.slice(0, 3));
  };

  const addSampleImages = () => {
    setImages([
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400",
    ]);
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const steps = [
    { n: 1, label: "Details" },
    { n: 2, label: "Images" },
    { n: 3, label: "Preview" },
    { n: 4, label: "Payment" },
  ];

  const isStep1Valid = form.title.length >= 5 && form.description.length >= 20 && form.price && form.condition && form.category;
  const isStep2Valid = images.length >= 3;

  const handlePayment = () => {
    setPaymentDone(true);
    setTimeout(() => router.push("/seller/dashboard"), 2000);
  };

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Create a Listing</h1>
      <p className="text-slate-500 text-sm mb-8">List your item and reach thousands of buyers.</p>

      {/* Progress stepper */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  step > s.n
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : step === s.n
                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                    : "border-slate-700 text-slate-600"
                }`}
              >
                {step > s.n ? <CheckCircle size={18} /> : s.n}
              </div>
              <span className={`text-xs mt-1 font-medium ${step >= s.n ? "text-slate-400" : "text-slate-600"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${step > s.n ? "bg-emerald-500" : "bg-slate-700"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/10 p-6">
        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-bold text-slate-200 text-lg mb-1">Item Details</h2>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                <Tag size={11} className="inline mr-1" />
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Vintage Levi's 501 Jeans - Size 32"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-base text-sm"
                maxLength={120}
              />
              <div className="flex justify-between mt-1">
                {form.title.length > 0 && form.title.length < 5 && (
                  <span className="text-xs text-red-400">Minimum 5 characters</span>
                )}
                <span className="text-xs text-slate-600 ml-auto">{form.title.length}/120</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                <AlignLeft size={11} className="inline mr-1" />
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe your item's condition, size, history, and any defects..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-base text-sm resize-none"
                maxLength={2000}
              />
              <div className="flex justify-between mt-1">
                {form.description.length > 0 && form.description.length < 20 && (
                  <span className="text-xs text-red-400">Minimum 20 characters</span>
                )}
                <span className="text-xs text-slate-600 ml-auto">{form.description.length}/2000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1.5">
                  <DollarSign size={11} className="inline mr-1" />
                  Price (USD) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-base text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1.5">
                  <MapPin size={11} className="inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, NY"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input-base text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                <Package size={11} className="inline mr-1" />
                Condition <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {conditions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, condition: c })}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                      form.condition === c
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setForm({ ...form, category: cat.name })}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                      form.category === cat.name
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                    {form.category === cat.name && <CheckCircle size={16} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              className={`btn btn-primary w-full mt-2 ${!isStep1Valid ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              Next: Add Images <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ── Step 2: Images ── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-bold text-slate-200 text-lg">Add Images</h2>
            <p className="text-slate-500 text-sm">Upload 3–5 photos. Clear, well-lit photos get more buyers.</p>

            {images.length < 5 && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-emerald-500/40 transition-colors cursor-pointer"
                onClick={addSampleImages}
              >
                <ImagePlus size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Drag & drop or <span className="text-emerald-400">click to upload</span></p>
                <p className="text-slate-600 text-xs mt-1">JPEG, PNG, WebP · Max 5MB each</p>
                <button className="btn btn-secondary text-xs px-4 py-2 mt-4">
                  <Upload size={14} /> Add Sample Photos
                </button>
              </div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-2 left-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">
                        Cover
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length > 0 && images.length < 3 && (
              <p className="text-amber-400 text-xs">Please add at least 3 images ({3 - images.length} more needed).</p>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">Back</button>
              <button
                disabled={!isStep2Valid}
                onClick={() => setStep(3)}
                className={`btn btn-primary flex-1 ${!isStep2Valid ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                Next: Preview <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Preview ── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-bold text-slate-200 text-lg">Preview Your Listing</h2>
            <p className="text-slate-500 text-sm">This is how your listing will appear to buyers.</p>

            <div className="glass rounded-xl border border-white/10 overflow-hidden">
              {images[0] && (
                <img src={images[0]} alt="Preview" className="w-full h-52 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-100 text-lg">{form.title || "Untitled"}</h3>
                  <span className="text-xl font-extrabold text-emerald-400">${form.price || "0.00"}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge text-xs px-2.5 py-1 rounded-full font-medium badge-like-new">
                    {form.condition || "—"}
                  </span>
                  <span className="text-xs text-slate-500">{form.category || "—"}</span>
                  {form.location && <span className="text-xs text-slate-600">· {form.location}</span>}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{form.description || "No description."}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(4)} className="btn btn-primary flex-1">
                Proceed to Payment <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Payment ── */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-bold text-slate-200 text-lg">Listing Fee Payment</h2>

            <div className="glass rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Listing fee (one-time)</span>
                <span className="text-2xl font-extrabold text-emerald-400">$4.99</span>
              </div>
              <p className="text-xs text-slate-600">Your listing will go live immediately after payment confirmation.</p>
            </div>

            {paymentDone ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-3 animate-pulse-glow" />
                <h3 className="text-xl font-bold text-slate-200">Payment Successful!</h3>
                <p className="text-slate-500 text-sm mt-1">Your listing is now Active. Redirecting...</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs text-slate-500 block mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["💳 Card", "🏦 Bank", "📱 Apple Pay", "🔷 Google Pay"].map((m) => (
                      <button
                        key={m}
                        className="px-4 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Card number" className="input-base text-sm" defaultValue="4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM / YY" className="input-base text-sm" defaultValue="12 / 28" />
                      <input type="text" placeholder="CVC" className="input-base text-sm" defaultValue="•••" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                  🔒 Your payment is processed securely by Stripe. We never store card details.
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="btn btn-secondary flex-1">Back</button>
                  <button onClick={handlePayment} className="btn btn-primary flex-1 animate-pulse-glow">
                    Pay $4.99 & Publish
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
