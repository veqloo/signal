"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useWorkspace } from "@/lib/workspace-context";
import { CONFIG } from "@/lib/config";
import { Header } from "@/components/dashboard/Header";
import { Download, Printer, Copy, Check, QrCode as QrIcon, Sparkles } from "lucide-react";

export default function QRStudioPage() {
  const { business, locations, isLoading, workspaceError } = useWorkspace();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [template, setTemplate] = useState<"tent" | "counter" | "badge">("tent");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute public feedback link
  const getPublicUrl = () => {
    if (typeof window === "undefined" || !business) return "";
    let url = `${CONFIG.appUrl}/f/${business.slug}`;
    if (selectedLocation !== "all") {
      const loc = locations.find((l) => l.id === selectedLocation);
      if (loc) url += `?loc=${loc.slug}`;
    }
    return url;
  };

  const publicUrl = getPublicUrl();

  useEffect(() => {
    if (!publicUrl) return;
    setQrDataUrl("");
    QRCode.toDataURL(publicUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error("QR Code generation error", err);
        setErrorMsg("The QR code could not be generated. Please try again.");
      });
  }, [publicUrl]);

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setErrorMsg(null);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMsg("Clipboard access was blocked. You can still select and copy the URL above.");
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `signal-qr-${business?.slug || "code"}.png`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const activeLocObj = locations.find((l) => l.id === selectedLocation);

  if (isLoading) return <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-10"><div className="h-8 w-48 animate-pulse rounded bg-zinc-200"/><div className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white"/></div>;
  if (workspaceError) return <div className="mx-auto max-w-xl px-4 py-16 text-center"><QrIcon className="mx-auto h-9 w-9 text-zinc-300"/><h2 className="mt-4 text-lg font-semibold text-zinc-950">QR Studio is waiting for your workspace</h2><p className="mt-2 text-sm text-zinc-500">Fix the workspace connection before generating a customer QR code.</p></div>;
  if (!business) return <div className="mx-auto max-w-xl px-4 py-16 text-center"><QrIcon className="mx-auto h-9 w-9 text-zinc-300"/><h2 className="mt-4 text-lg font-semibold text-zinc-950">Set up your business first</h2><p className="mt-2 text-sm text-zinc-500">Your QR code will be generated from your real business and first location.</p><a href="/dashboard/settings" className="mt-5 inline-flex rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white">Set up business</a></div>;

  return (
    <div className="flex-1 pb-16">
      <div className="no-print">
        <Header
          title="QR Studio & Print Templates"
          subtitle="Generate high-resolution QR codes and ready-to-print table stands"
          actions={
            <div className="flex items-center gap-2">
              <button
                disabled={!qrDataUrl}
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Stand</span>
              </button>
              <button
                disabled={!qrDataUrl || !business}
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
            </div>
          }
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {errorMsg && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}
        {/* Controls Bar */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-card flex flex-wrap items-center justify-between gap-4 no-print">
          {/* Location picker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-800 focus:outline-none"
            >
              <option value="all">Main Business QR (All)</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Template format */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Display Template:</span>
            <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => setTemplate("tent")}
                className={`px-3 py-1 rounded font-medium transition ${
                  template === "tent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Table Tent Stand
              </button>
              <button
                onClick={() => setTemplate("counter")}
                className={`px-3 py-1 rounded font-medium transition ${
                  template === "counter" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Counter Card
              </button>
              <button
                onClick={() => setTemplate("badge")}
                className={`px-3 py-1 rounded font-medium transition ${
                  template === "badge" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Compact Sticker
              </button>
            </div>
          </div>
        </div>

        {/* Public Link Box */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-card flex items-center justify-between gap-3 no-print">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Customer Feedback URL
            </div>
            <div className="text-xs font-mono text-slate-800 truncate mt-0.5">
              {publicUrl}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy URL
              </>
            )}
          </button>
        </div>

        {/* Printable Stand Preview Area */}
        <div className="flex justify-center">
          {/* Table Tent Format */}
          {template === "tent" && (
            <div className="print-area w-full max-w-md bg-white border-2 border-slate-900 rounded-xl p-8 shadow-xl text-center space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
                  {business?.category || "Customer feedback"}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {business?.name || "Your business"}
                </h2>
                {activeLocObj && (
                  <p className="text-xs font-medium text-slate-500">{activeLocObj.name}</p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 inline-block mx-auto shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Feedback QR code"
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 animate-pulse rounded" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-base font-bold text-slate-900 tracking-tight">
                  How was your experience today?
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Scan to rate your visit in 5 seconds. No download, registration, or app required.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                <span>signal.</span>
                <span>·</span>
                <span>Powered by Veqlo</span>
              </div>
            </div>
          )}

          {/* Counter Card Format */}
          {template === "counter" && (
            <div className="print-area w-full max-w-sm bg-white border border-slate-300 rounded-lg p-6 shadow-md text-center space-y-4">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pb-2 border-b border-slate-100">
                <span>{business?.name}</span>
                <span>Rate your visit</span>
              </div>

              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-40 h-40 mx-auto border border-slate-100 rounded p-1"
                />
              )}

              <p className="text-xs font-semibold text-slate-900">
                Scan to share quick feedback
              </p>
              <p className="text-[10px] text-slate-500">
                Help us serve you better.
              </p>
            </div>
          )}

          {/* Compact Badge Format */}
          {template === "badge" && (
            <div className="print-area w-full max-w-xs bg-slate-900 text-white rounded-xl p-6 shadow-xl text-center space-y-4">
              <h3 className="text-sm font-bold tracking-tight text-white">
                {business?.name}
              </h3>

              <div className="bg-white rounded-lg p-3 inline-block">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-36 h-36 mx-auto"
                  />
                )}
              </div>

              <p className="text-xs text-slate-300 font-medium">
                Scan to rate your coffee & service
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
