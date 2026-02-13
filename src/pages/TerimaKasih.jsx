import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TerimaKasih() {
  const location = useLocation();
  const program =
    (location.state && location.state.program) || "pendaftaran";

  return (
    <div className="min-h-screen bg-batik-gold flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white/95 backdrop-blur shape-curve-lg shadow-xl p-8 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--karmila-sage-light))] text-[hsl(var(--karmila-sage))] mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-[hsl(var(--karmila-sage))] mb-2">
          Pendaftaran Diterima
        </h1>
        <p className="text-slate-600 mb-2">
          Terima kasih. Data pendaftaran <strong>{program}</strong> Anda telah berhasil kami terima.
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Notifikasi konfirmasi akan dikirim ke email Anda (jika layanan email terhubung). Admin akan memproses dan menghubungi Anda jika ada yang perlu dilengkapi.
        </p>
        <Button asChild className="bg-[hsl(var(--karmila-sage))] hover:bg-[hsl(var(--karmila-sage))]/90 rounded-xl">
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
