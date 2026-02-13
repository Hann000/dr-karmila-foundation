import React from "react";
import { Link } from "react-router-dom";
import { Shield, Heart, Star, GraduationCap, BookOpen } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-batik-gold text-white">
      {/* Hero - logo agak ke bawah agar tidak mengenai motif batik di atas */}
      <section className="relative pt-24 md:pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-6 animate-fade-in-up opacity-0">
            <img src="/logo-kemendikbud.png" alt="Kementerian Pendidikan dan Kebudayaan - Tut Wuri Handayani" className="h-20 md:h-24 w-auto object-contain drop-shadow-lg" />
            <img src="/logo-dpr-ri.png" alt="DPR RI" className="h-20 md:h-24 w-auto object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in-up opacity-0 delay-100">DR. KARMILA Foundation</h1>
          <p className="text-amber-200/90 mb-1 animate-fade-in-up opacity-0 delay-200">Portal Pendaftaran Bantuan Pendidikan</p>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto animate-fade-in-up opacity-0 delay-300">
            Mewujudkan mimpi generasi muda Indonesia melalui akses pendidikan yang merata dan berkualitas.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <div className="bg-white/95 backdrop-blur shape-curve-lg shadow-xl p-6 border border-[hsl(var(--karmila-sage))]/30 animate-fade-in-up opacity-0 delay-300 hover:animate-glow-pulse transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--karmila-sage))] flex items-center justify-center text-[hsl(var(--karmila-gold-soft))] mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">KIP Kuliah</h2>
            <p className="text-sm text-slate-600 mb-6">
              Program bantuan pendidikan untuk mahasiswa dari keluarga kurang mampu.
            </p>
            <Link
              to="/daftar/kip-kuliah"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(var(--karmila-sage))] text-white text-sm font-medium hover:opacity-90 transition-all duration-300"
            >
              Daftar Sekarang <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="bg-white/95 backdrop-blur shape-curve-lg shadow-xl p-6 border border-[hsl(var(--karmila-gold))]/40 animate-fade-in-up opacity-0 delay-400 hover:animate-glow-pulse transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--karmila-gold))] flex items-center justify-center text-slate-800 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">PIP</h2>
            <p className="text-sm text-slate-600 mb-6">
              Program Indonesia Pintar untuk siswa SD, SMP, SMA/SMK.
            </p>
            <Link
              to="/daftar/pip"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(var(--karmila-gold))] text-slate-800 text-sm font-medium hover:opacity-90 transition-all duration-300"
            >
              Daftar Sekarang <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mengapa Memilih - section dengan kurva atas */}
      <section className="relative py-16 px-4 bg-white/90 shape-wave-top shadow-2xl">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--karmila-sage))] mb-2">
            Mengapa Memilih DR. KARMILA Foundation?
          </h2>
          <p className="text-slate-600">
            Kami berkomitmen memberikan layanan terbaik untuk memudahkan akses bantuan pendidikan
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Proses Aman", desc: "Data Anda terlindungi dengan sistem keamanan terbaik" },
            { icon: Heart, title: "Gratis", desc: "Pendaftaran tidak dipungut biaya apapun" },
            { icon: Star, title: "Mudah", desc: "Proses pendaftaran yang sederhana dan cepat" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`text-center animate-fade-in-up opacity-0 ${i === 0 ? 'delay-500' : i === 1 ? 'delay-600' : 'delay-700'}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 shape-curve bg-[hsl(var(--karmila-gold-soft))] text-[hsl(var(--karmila-sage))] mb-4">
                <Icon className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tentang Program - bentuk berliku */}
      <section className="relative py-16 px-4 bg-[hsl(var(--karmila-sage))] shape-wave-bottom shape-wave-top">
        <div className="max-w-6xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Tentang Program Bantuan Pendidikan
            </h2>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              <span className="text-[hsl(var(--karmila-gold))] font-medium">KIP Kuliah</span> adalah bantuan biaya pendidikan dari pemerintah bagi lulusan SMA/SMK/sederajat yang memiliki potensi akademik baik namun memiliki keterbatasan ekonomi.
            </p>
            <p className="text-white/90 text-sm leading-relaxed">
              <span className="text-[hsl(var(--karmila-gold))] font-medium">PIP (Program Indonesia Pintar)</span> adalah bantuan berupa uang tunai, perluasan akses, dan kesempatan belajar dari pemerintah untuk peserta didik dan mahasiswa yang berasal dari keluarga miskin atau rentan miskin.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "100%", label: "Gratis Pendaftaran" },
              { value: "24/7", label: "Akses Online" },
              { value: "Aman", label: "Data Terlindungi" },
              { value: "Cepat", label: "Proses Mudah" },
            ].map((item) => (
              <div
                key={item.value}
                className="shape-curve p-4 text-center border-2 border-[hsl(var(--karmila-gold))]/50 bg-white/10"
              >
                <div className="text-xl md:text-2xl font-bold text-[hsl(var(--karmila-gold))] mb-1">
                  {item.value}
                </div>
                <div className="text-xs md:text-sm text-white/90">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-amber-900/30 bg-slate-900/80 backdrop-blur shape-wave-top">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-kemendikbud.png" alt="Kemendikbud" className="h-9 w-auto object-contain opacity-90" />
            <img src="/logo-dpr-ri.png" alt="DPR RI" className="h-9 w-auto object-contain opacity-90" />
            <div>
              <div className="font-semibold text-white">DR. KARMILA Foundation</div>
              <div className="text-xs text-slate-400">Portal Bantuan Pendidikan</div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} DR. KARMILA Foundation. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
