"use client";

import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Header } from "@/components/dashboard/Header";
import { MapPin, Plus, Trash2, ExternalLink, QrCode, Check } from "lucide-react";
import Link from "next/link";

export default function LocationsPage() {
  const { business, locations, addLocation, deleteLocation, feedback } = useWorkspace();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await addLocation(name.trim(), address.trim());
      setName("");
      setAddress("");
      setModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = (locSlug: string, id: string) => {
    const url = `${window.location.origin}/f/${business?.slug}?loc=${locSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Business Locations"
        subtitle="Manage branches, table sections, and location-specific QR codes"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Location</span>
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {locations.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-300 rounded-lg bg-white">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">No locations added yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              If your business has multiple stores, cafés, or table sections, add them here to track feedback per location.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add your first location</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((loc) => {
              const locFeedback = feedback.filter((f) => f.location_id === loc.id);
              const count = locFeedback.length;
              const avg = count > 0 ? (locFeedback.reduce((a, b) => a + b.rating, 0) / count).toFixed(1) : "—";
              const locUrl = `${business?.slug}?loc=${loc.slug}`;

              return (
                <div
                  key={loc.id}
                  className="p-5 rounded-lg border border-slate-200 bg-white shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-slate-100 text-slate-700">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900">{loc.name}</h4>
                          <span className="text-[10px] text-slate-400">/{loc.slug}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteLocation(loc.id)}
                        className="p-1 text-slate-300 hover:text-red-600 transition"
                        title="Delete location"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {loc.address && (
                      <p className="text-xs text-slate-500 mb-3">{loc.address}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-100 my-3">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Feedback</span>
                        <span className="font-bold text-slate-800">{count} responses</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Avg Rating</span>
                        <span className="font-bold text-slate-800">{avg} / 5</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleCopyLink(loc.slug, loc.id)}
                      className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                    >
                      {copiedId === loc.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied link
                        </>
                      ) : (
                        "Copy URL"
                      )}
                    </button>

                    <Link
                      href={`/dashboard/qr-codes?location=${loc.id}`}
                      className="text-slate-700 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Get QR
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Location Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Location / Branch</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a physical branch or table section to receive localized customer feedback.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downtown Gran Vía, Terrace, Bar Counter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Physical Address (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Calle Gran Vía 42, Madrid"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition shadow-sm"
                >
                  {isSubmitting ? "Adding..." : "Add Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
