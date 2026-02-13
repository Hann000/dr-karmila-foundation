import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "@/components/FileUploadField";
import { saveRegistration } from "@/lib/registration-store";
import { getOpenPeriodsForProgram } from "@/lib/period-store";
import { ArrowLeft, GraduationCap, User, Building2, CreditCard, Upload } from "lucide-react";

// Wrapper setiap kelompok form (Data Pribadi, Perguruan Tinggi, dst.)
// Dibuat seperti kartu terpisah dengan jarak yang jelas dari blok sebelumnya.
const sectionClass = "mt-6 md:mt-8 rounded-xl overflow-hidden border border-slate-200/70 bg-white shadow-sm";
const headerBlue = "bg-[hsl(var(--karmila-sage))] text-white px-4 py-3 flex items-center gap-2 text-sm font-medium";
const headerGold = "bg-[hsl(var(--karmila-gold))] text-slate-900 px-4 py-3 flex items-center gap-2 text-sm font-medium";
const headerPurple = "bg-violet-600 text-white px-4 py-3 flex items-center gap-2 text-sm font-medium";

const INITIAL = {
  periodId: "",
  namaLengkap: "",
  nik: "",
  jenisKelamin: "",
  tempatLahir: "",
  tanggalLahir: "",
  alamatLengkap: "",
  telepon: "",
  email: "",
  namaPerguruanTinggi: "",
  programStudi: "",
  nim: "",
  semester: "",
  nomorSK: "",
  namaBank: "",
  namaBankLainnya: "",
  noRekening: "",
  namaPemilikRekening: "",
  skKip: { files: [], error: null },
  suratPengantar: { files: [], error: null },
  paktaIntegritas: { files: [], error: null },
  ktp: { files: [], error: null },
  kartuKeluarga: { files: [], error: null },
  pernyataan: false,
};

export default function DaftarKIPKuliah() {
  const navigate = useNavigate();
  const openPeriods = useMemo(() => getOpenPeriodsForProgram("kip"), []);
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
    if (!form.namaLengkap?.trim()) {
      setSubmitError("Nama lengkap wajib diisi.");
      return;
    }
    if (!form.nik?.trim()) {
      setSubmitError("NIK wajib diisi.");
      return;
    }
    if (!form.skKip?.files?.length) {
      setSubmitError("SK KIP Kuliah wajib diunggah.");
      return;
    }
    if (!form.suratPengantar?.files?.length) {
      setSubmitError("Surat Pengantar wajib diunggah.");
      return;
    }
    if (!form.paktaIntegritas?.files?.length) {
      setSubmitError("Pakta Integritas wajib diunggah.");
      return;
    }
    if (!form.ktp?.files?.length) {
      setSubmitError("KTP wajib diunggah.");
      return;
    }
    if (!form.kartuKeluarga?.files?.length) {
      setSubmitError("Kartu Keluarga wajib diunggah.");
      return;
    }
    if (form.namaBank === "Lainnya" && !form.namaBankLainnya?.trim()) {
      setSubmitError("Isi nama bank jika memilih Lainnya.");
      return;
    }
    if (!form.pernyataan) {
      setSubmitError("Centang pernyataan data benar.");
      return;
    }
    setSubmitting(true);
    try {
      saveRegistration({
        type: "kip",
        periodId: form.periodId,
        periodName: selectedPeriod?.nama || selectedPeriod?.id,
        data: {
          namaLengkap: form.namaLengkap,
          nik: form.nik,
          jenisKelamin: form.jenisKelamin,
          tempatLahir: form.tempatLahir,
          tanggalLahir: form.tanggalLahir,
          alamatLengkap: form.alamatLengkap,
          telepon: form.telepon,
          email: form.email,
          namaPerguruanTinggi: form.namaPerguruanTinggi,
          programStudi: form.programStudi,
          nim: form.nim,
          semester: form.semester,
          nomorSK: form.nomorSK,
          namaBank: form.namaBank === "Lainnya" ? (form.namaBankLainnya || "Lainnya") : form.namaBank,
          noRekening: form.noRekening,
          namaPemilikRekening: form.namaPemilikRekening,
        },
        files: {
          skKipKuliah: (form.skKip && form.skKip.files ? form.skKip.files : []).map((f) => f.name),
          suratPengantar: (form.suratPengantar && form.suratPengantar.files ? form.suratPengantar.files : []).map((f) => f.name),
          paktaIntegritas: (form.paktaIntegritas && form.paktaIntegritas.files ? form.paktaIntegritas.files : []).map((f) => f.name),
          ktp: (form.ktp && form.ktp.files ? form.ktp.files : []).map((f) => f.name),
          kartuKeluarga: (form.kartuKeluarga && form.kartuKeluarga.files ? form.kartuKeluarga.files : []).map((f) => f.name),
        },
      });
      navigate("/terima-kasih", { state: { program: "KIP Kuliah" } });
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
            <div className="inline-flex w-14 h-14 rounded-full bg-[hsl(var(--karmila-sage))] text-[hsl(var(--karmila-gold-soft))] items-center justify-center mb-3 shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-base font-semibold text-slate-800 mb-2">
              Belum ada pembukaan KIP Kuliah
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Tidak ada periode pendaftaran KIP Kuliah yang sedang dibuka. Silakan cek kembali nanti atau hubungi admin.
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
          <div className="inline-flex w-12 h-12 rounded-xl bg-[hsl(var(--karmila-sage))] text-[hsl(var(--karmila-gold-soft))] items-center justify-center mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pendaftaran KIP Kuliah</h1>
          <p className="text-sm text-slate-300">Lengkapi formulir berikut dengan data yang benar</p>
        </div>
        <Card className="border-[hsl(var(--karmila-sage))]/20 shadow-xl overflow-hidden shape-curve-lg">
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
                <div className={headerBlue}>
                  <User className="w-4 h-4" /> Data Pribadi
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap *</label>
                    <Input value={form.namaLengkap} onChange={(e) => update("namaLengkap", e.target.value)} placeholder="Sesuai KTP" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIK *</label>
                    <Input value={form.nik} onChange={(e) => update("nik", e.target.value)} placeholder="16 digit NIK" required />
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
                    <Input type="date" value={form.tanggalLahir} onChange={(e) => update("tanggalLahir", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap *</label>
                    <textarea value={form.alamatLengkap} onChange={(e) => update("alamatLengkap", e.target.value)} placeholder="Alamat sesuai KTP" rows={2} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon/WhatsApp *</label>
                    <Input value={form.telepon} onChange={(e) => update("telepon", e.target.value)} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" required />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className={headerGold}>
                  <Building2 className="w-4 h-4" /> Data Perguruan Tinggi
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Perguruan Tinggi *</label>
                    <Input value={form.namaPerguruanTinggi} onChange={(e) => update("namaPerguruanTinggi", e.target.value)} placeholder="Nama universitas/institut/politeknik" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Studi *</label>
                    <Input value={form.programStudi} onChange={(e) => update("programStudi", e.target.value)} placeholder="Nama program studi" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIM *</label>
                    <Input value={form.nim} onChange={(e) => update("nim", e.target.value)} placeholder="Nomor Induk Mahasiswa" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester Saat Ini *</label>
                    <select value={form.semester} onChange={(e) => update("semester", e.target.value)} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                      <option value="">Pilih semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor SK *</label>
                    <Input value={form.nomorSK} onChange={(e) => update("nomorSK", e.target.value)} placeholder="Nomor SK KIP Kuliah" required />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className={headerBlue}>
                  <CreditCard className="w-4 h-4" /> Data Rekening Bank
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Bank *</label>
                    <select value={form.namaBank} onChange={(e) => update("namaBank", e.target.value)} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                      <option value="">Pilih bank</option>
                      <option value="BNI">BNI</option>
                      <option value="BRI">BRI</option>
                      <option value="Mandiri">Mandiri</option>
                      <option value="BTN">BTN</option>
                      <option value="BCA">BCA</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    {form.namaBank === "Lainnya" && (
                      <Input
                        value={form.namaBankLainnya}
                        onChange={(e) => update("namaBankLainnya", e.target.value)}
                        placeholder="Tulis nama bank"
                        className="mt-2"
                        required
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Rekening *</label>
                    <Input value={form.noRekening} onChange={(e) => update("noRekening", e.target.value)} placeholder="Nomor rekening" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pemilik Rekening *</label>
                    <Input value={form.namaPemilikRekening} onChange={(e) => update("namaPemilikRekening", e.target.value)} placeholder="Sesuai buku tabungan" required />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className={headerPurple}>
                  <Upload className="w-4 h-4" /> Upload Dokumen
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadField label="SK KIP Kuliah *" accept=".pdf,.jpg,.jpeg,.png" value={form.skKip} onChange={(v) => update("skKip", v)} />
                  <FileUploadField label="Surat Pengantar *" accept=".pdf,.jpg,.jpeg,.png" value={form.suratPengantar} onChange={(v) => update("suratPengantar", v)} />
                  <FileUploadField label="Pakta Integritas *" accept=".pdf,.jpg,.jpeg,.png" value={form.paktaIntegritas} onChange={(v) => update("paktaIntegritas", v)} />
                  <FileUploadField label="KTP *" accept=".pdf,.jpg,.jpeg,.png" value={form.ktp} onChange={(v) => update("ktp", v)} />
                  <FileUploadField label="Kartu Keluarga *" accept=".pdf,.jpg,.jpeg,.png" value={form.kartuKeluarga} onChange={(v) => update("kartuKeluarga", v)} className="md:col-span-2" />
                </div>
              </div>

              <div className="p-4 border-t">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pernyataan} onChange={(e) => update("pernyataan", e.target.checked)} className="mt-1" />
                  <span className="text-sm text-slate-600">
                    Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan. Saya bersedia menerima sanksi apabila data yang saya berikan tidak benar.
                  </span>
                </label>
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
