import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "@/components/FileUploadField";
import { saveRegistration } from "@/lib/registration-store";
import { getOpenPeriodsForProgram } from "@/lib/period-store";
import { ArrowLeft, BookOpen, User, Building2, Users, Wallet, Upload } from "lucide-react";

// Wrapper setiap kelompok form (Data Siswa, Data Sekolah, dst.)
// Dibuat seperti kartu terpisah dengan jarak yang jelas dari blok sebelumnya.
const sectionClass = "mt-6 md:mt-8 rounded-xl overflow-hidden border border-slate-200/70 bg-white shadow-sm";
const headerGold = "bg-[hsl(var(--karmila-gold))] text-slate-900 px-4 py-3 flex items-center gap-2 text-sm font-medium";
const headerBlue = "bg-[hsl(var(--karmila-sage))] text-white px-4 py-3 flex items-center gap-2 text-sm font-medium";
const headerPurple = "bg-violet-600 text-white px-4 py-3 flex items-center gap-2 text-sm font-medium";
const headerRed = "bg-rose-500 text-white px-4 py-3 flex items-center gap-2 text-sm font-medium";

const INITIAL = {
  periodId: "",
  namaSiswa: "",
  nikSiswa: "",
  nisn: "",
  jenisKelamin: "",
  tempatLahir: "",
  tanggalLahir: "",
  telepon: "",
  email: "",
  alamatLengkap: "",
  namaSekolah: "",
  npsn: "",
  jenjang: "",
  kelas: "",
  namaAyah: "",
  nikAyah: "",
  pekerjaanAyah: "",
  namaIbu: "",
  nikIbu: "",
  pekerjaanIbu: "",
  penghasilanBulanan: "",
  nomorKIP: "",
  nomorKKS: "",
  nomorPKH: "",
  ktpOrtu: { files: [], error: null },
  kartuKeluarga: { files: [], error: null },
  raporTerakhir: { files: [], error: null },
  sktm: { files: [], error: null },
  pasFoto: { files: [], error: null },
};

export default function DaftarPIP() {
  const navigate = useNavigate();
  const openPeriods = useMemo(() => getOpenPeriodsForProgram("pip"), []);
  const [form, setForm] = useState(INITIAL);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const selectedPeriod = openPeriods.find((p) => p.id === form.periodId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!form.periodId) {
      setSubmitError("Pilih periode pendaftaran.");
      return;
    }
    if (!form.namaSiswa?.trim()) {
      setSubmitError("Nama lengkap siswa wajib diisi.");
      return;
    }
    if (!form.nisn?.trim()) {
      setSubmitError("NISN wajib diisi.");
      return;
    }
    if (!form.ktpOrtu?.files?.length) {
      setSubmitError("KTP Orang Tua wajib diunggah.");
      return;
    }
    if (!form.kartuKeluarga?.files?.length) {
      setSubmitError("Kartu Keluarga wajib diunggah.");
      return;
    }
    if (!form.raporTerakhir?.files?.length) {
      setSubmitError("Rapor Terakhir wajib diunggah.");
      return;
    }
    if (!form.sktm?.files?.length) {
      setSubmitError("SKTM wajib diunggah.");
      return;
    }
    if (!form.pasFoto?.files?.length) {
      setSubmitError("Pas Foto 3x4 wajib diunggah.");
      return;
    }
    setSubmitting(true);
    try {
      saveRegistration({
        type: "pip",
        periodId: form.periodId,
        periodName: selectedPeriod?.nama || selectedPeriod?.id,
        data: {
          namaSiswa: form.namaSiswa,
          nikSiswa: form.nikSiswa,
          nisn: form.nisn,
          jenisKelamin: form.jenisKelamin,
          tempatLahir: form.tempatLahir,
          tanggalLahir: form.tanggalLahir,
          telepon: form.telepon,
          email: form.email,
          alamatLengkap: form.alamatLengkap,
          namaSekolah: form.namaSekolah,
          npsn: form.npsn,
          jenjang: form.jenjang,
          kelas: form.kelas,
          namaAyah: form.namaAyah,
          nikAyah: form.nikAyah,
          pekerjaanAyah: form.pekerjaanAyah,
          namaIbu: form.namaIbu,
          nikIbu: form.nikIbu,
          pekerjaanIbu: form.pekerjaanIbu,
          penghasilanBulanan: form.penghasilanBulanan,
          nomorKIP: form.nomorKIP,
          nomorKKS: form.nomorKKS,
          nomorPKH: form.nomorPKH,
        },
        files: {
          ktpOrtu: (form.ktpOrtu && form.ktpOrtu.files ? form.ktpOrtu.files : []).map((f) => f.name),
          kartuKeluarga: (form.kartuKeluarga && form.kartuKeluarga.files ? form.kartuKeluarga.files : []).map((f) => f.name),
          raporTerakhir: (form.raporTerakhir && form.raporTerakhir.files ? form.raporTerakhir.files : []).map((f) => f.name),
          sktm: (form.sktm && form.sktm.files ? form.sktm.files : []).map((f) => f.name),
          pasFoto: (form.pasFoto && form.pasFoto.files ? form.pasFoto.files : []).map((f) => f.name),
        },
      });
      navigate("/terima-kasih", { state: { program: "PIP" } });
    } catch (err) {
      setSubmitError("Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (openPeriods.length === 0) {
    return (
      <div className="min-h-screen bg-batik-gold py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-[hsl(var(--karmila-sage))]/20 shape-curve-lg shadow-xl animate-fade-in-up">
          <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
            <div className="inline-flex w-14 h-14 rounded-full bg-[hsl(var(--karmila-gold))] text-slate-900 items-center justify-center mb-3 shadow-md">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-base font-semibold text-slate-800 mb-2">
              Belum ada pembukaan PIP
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Tidak ada periode pendaftaran PIP yang sedang dibuka. Silakan cek kembali nanti atau hubungi admin.
            </p>
            <Button asChild className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold">
              <Link to="/">Kembali ke Beranda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-batik-gold py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-2.5 bg-white/95 text-slate-800 border border-slate-200/80 shadow-md hover:bg-white hover:shadow-lg transition-all mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[hsl(var(--karmila-gold))] text-slate-800 items-center justify-center mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pendaftaran PIP</h1>
          <p className="text-sm text-slate-300">Program Indonesia Pintar untuk SD, SMP, SMA/SMK</p>
        </div>
        <Card className="border-[hsl(var(--karmila-gold))]/30 shadow-xl overflow-hidden shape-curve-lg">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="p-4 border-b">
                <label className="block text-sm font-medium text-slate-700 mb-1">Periode Pendaftaran *</label>
                <select
                  value={form.periodId}
                  onChange={(e) => update("periodId", e.target.value)}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Pilih periode</option>
                  {openPeriods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama || `${p.tanggalMulai} - ${p.tanggalBerakhir}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className={sectionClass}>
                <div className={headerGold}>
                  <User className="w-4 h-4" /> Data Siswa
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                    <Input value={form.namaSiswa} onChange={(e) => update("namaSiswa", e.target.value)} placeholder="Sesuai akta kelahiran" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIK Siswa *</label>
                    <Input value={form.nikSiswa} onChange={(e) => update("nikSiswa", e.target.value)} placeholder="16 digit NIK" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NISN *</label>
                    <Input value={form.nisn} onChange={(e) => update("nisn", e.target.value)} placeholder="Nomor Induk Siswa Nasional" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin *</label>
                    <select value={form.jenisKelamin} onChange={(e) => update("jenisKelamin", e.target.value)} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir *</label>
                    <Input value={form.tempatLahir} onChange={(e) => update("tempatLahir", e.target.value)} placeholder="Kota/Kabupaten" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir *</label>
                    <Input type="date" value={form.tanggalLahir} onChange={(e) => update("tanggalLahir", e.target.value)} placeholder="mm/dd/yyyy" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon/WhatsApp *</label>
                    <Input value={form.telepon} onChange={(e) => update("telepon", e.target.value)} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap *</label>
                    <textarea value={form.alamatLengkap} onChange={(e) => update("alamatLengkap", e.target.value)} placeholder="Alamat tempat tinggal" rows={2} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" required />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className={headerBlue}>
                  <Building2 className="w-4 h-4" /> Data Sekolah
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah *</label>
                    <Input value={form.namaSekolah} onChange={(e) => update("namaSekolah", e.target.value)} placeholder="Nama lengkap sekolah" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NPSN Sekolah *</label>
                    <Input value={form.npsn} onChange={(e) => update("npsn", e.target.value)} placeholder="Nomor Pokok Sekolah Nasional" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenjang Pendidikan *</label>
                    <select value={form.jenjang} onChange={(e) => update("jenjang", e.target.value)} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                      <option value="">Pilih jenjang</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="SMK">SMK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kelas *</label>
                    <Input value={form.kelas} onChange={(e) => update("kelas", e.target.value)} placeholder="Contoh: VII-A" required />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className={headerBlue}>
                  <Users className="w-4 h-4" /> Data Orang Tua/Wali
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ayah *</label>
                    <Input value={form.namaAyah} onChange={(e) => update("namaAyah", e.target.value)} placeholder="Nama lengkap ayah" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIK Ayah *</label>
                    <Input value={form.nikAyah} onChange={(e) => update("nikAyah", e.target.value)} placeholder="16 digit NIK" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan Ayah</label>
                    <Input value={form.pekerjaanAyah} onChange={(e) => update("pekerjaanAyah", e.target.value)} placeholder="Pekerjaan" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ibu *</label>
                    <Input value={form.namaIbu} onChange={(e) => update("namaIbu", e.target.value)} placeholder="Nama lengkap ibu" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIK Ibu *</label>
                    <Input value={form.nikIbu} onChange={(e) => update("nikIbu", e.target.value)} placeholder="16 digit NIK" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan Ibu</label>
                    <Input value={form.pekerjaanIbu} onChange={(e) => update("pekerjaanIbu", e.target.value)} placeholder="Pekerjaan" />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className={headerPurple}>
                  <Wallet className="w-4 h-4" /> Data Ekonomi
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Penghasilan Bulanan Keluarga *</label>
                    <select value={form.penghasilanBulanan} onChange={(e) => update("penghasilanBulanan", e.target.value)} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                      <option value="">Pilih rentang penghasilan</option>
                      <option value="< 1 juta">&lt; Rp 1.000.000</option>
                      <option value="1-2 juta">Rp 1.000.000 - 2.000.000</option>
                      <option value="2-3 juta">Rp 2.000.000 - 3.000.000</option>
                      <option value="> 3 juta">&gt; Rp 3.000.000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor KIP (jika ada)</label>
                    <Input value={form.nomorKIP} onChange={(e) => update("nomorKIP", e.target.value)} placeholder="Nomor Kartu Indonesia Pintar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor KKS (jika ada)</label>
                    <Input value={form.nomorKKS} onChange={(e) => update("nomorKKS", e.target.value)} placeholder="Nomor Kartu Keluarga Sejahtera" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor PKH (jika ada)</label>
                    <Input value={form.nomorPKH} onChange={(e) => update("nomorPKH", e.target.value)} placeholder="Nomor Program Keluarga Harapan" />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className={headerRed}>
                  <Upload className="w-4 h-4" /> Upload Dokumen
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadField label="KTP Orang Tua *" accept=".pdf,.jpg,.jpeg,.png" value={form.ktpOrtu} onChange={(v) => update("ktpOrtu", v)} />
                  <FileUploadField label="Kartu Keluarga *" accept=".pdf,.jpg,.jpeg,.png" value={form.kartuKeluarga} onChange={(v) => update("kartuKeluarga", v)} />
                  <FileUploadField label="Rapor Terakhir *" accept=".pdf,.jpg,.jpeg,.png" value={form.raporTerakhir} onChange={(v) => update("raporTerakhir", v)} />
                  <FileUploadField label="SKTM (Surat Keterangan Tidak Mampu) *" accept=".pdf,.jpg,.jpeg,.png" value={form.sktm} onChange={(v) => update("sktm", v)} />
                  <FileUploadField label="Pas Foto 3x4 *" accept=".pdf,.jpg,.jpeg,.png" value={form.pasFoto} onChange={(v) => update("pasFoto", v)} className="md:col-span-2" />
                </div>
              </div>

              {submitError && <p className="px-4 pb-2 text-sm text-red-600">{submitError}</p>}
              <div className="p-4 flex flex-wrap gap-3">
                <Button type="submit" disabled={submitting} className="bg-[hsl(var(--karmila-sage))] hover:bg-[hsl(var(--karmila-sage))]/90 w-full md:w-auto">
                  {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/">Batal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
