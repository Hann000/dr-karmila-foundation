import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getRegistrations,
  updateRegistrationStatus,
  updateRegistrationAdminNotes,
  exportRegistrationsToCSV,
  STATUS_LABELS,
} from "@/lib/registration-store";
import {
  getPeriods,
  savePeriod,
  deletePeriod,
  togglePeriodActive,
} from "@/lib/period-store";
import {
  Lock,
  LogOut,
  Eye,
  Check,
  Clock,
  FileText,
  XCircle,
  Settings,
  Calendar,
  Filter,
  Search,
  Download,
  GraduationCap,
  BookOpen,
  User,
  Building2,
  FileCheck,
  Users,
  Wallet,
} from "lucide-react";

const ADMIN_PASSWORD = "admin123";

const FILE_LABELS = {
  skKipKuliah: "SK KIP Kuliah",
  suratPengantar: "Surat Pengantar",
  paktaIntegritas: "Pakta Integritas",
  ktp: "KTP",
  kartuKeluarga: "Kartu Keluarga",
  ktpOrtu: "KTP Orang Tua",
  raporTerakhir: "Rapor Terakhir",
  sktm: "SKTM",
  pasFoto: "Pas Foto 3x4",
};

function formatPeriodDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function Admin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    typeof localStorage !== "undefined" && localStorage.getItem("karmila_admin_session") === "1"
  );
  const [view, setView] = useState("dashboard"); // dashboard | periode
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState("kip"); // kip | pip
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriodId, setFilterPeriodId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [detailId, setDetailId] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [periodeModalOpen, setPeriodeModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formPeriod, setFormPeriod] = useState({
    nama: "",
    jenisProgram: "kip",
    tanggalMulai: "",
    tanggalBerakhir: "",
    keterangan: "",
    aktif: true,
  });

  const periods = useMemo(() => getPeriods(), [refreshKey]);
  const registrations = useMemo(() => getRegistrations(), [refreshKey]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("karmila_admin_session", "1");
      setIsLoggedIn(true);
    } else {
      setError("Kata sandi salah.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("karmila_admin_session");
    setIsLoggedIn(false);
    navigate("/");
  };

  const refresh = () => setRefreshKey((k) => k + 1);

  const filteredList = useMemo(() => {
    let list = registrations.filter((r) => r.type === tab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const nama =
          (r.type === "kip" ? r.data?.namaLengkap : r.data?.namaSiswa) || "";
        const nik = (r.data?.nik || r.data?.nikSiswa || "").toString();
        const email = (r.data?.email || "").toLowerCase();
        return (
          nama.toLowerCase().includes(q) ||
          nik.includes(q) ||
          email.includes(q)
        );
      });
    }
    if (filterPeriodId) list = list.filter((r) => r.periodId === filterPeriodId);
    if (filterStatus) list = list.filter((r) => r.status === filterStatus);
    return list;
  }, [registrations, tab, searchQuery, filterPeriodId, filterStatus]);

  const stats = useMemo(() => {
    const base = registrations.filter((r) => r.type === tab);
    return {
      total: base.length,
      menunggu: base.filter((r) => (r.status || "menunggu") === "menunggu").length,
      direview: base.filter((r) => r.status === "direview").length,
      disetujui: base.filter((r) => r.status === "disetujui").length,
      ditolak: base.filter((r) => r.status === "ditolak").length,
    };
  }, [registrations, tab]);

  const handleExport = () => {
    const csv = exportRegistrationsToCSV({
      periodId: filterPeriodId || undefined,
      status: filterStatus || undefined,
      type: tab,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const detailRegistration = detailId ? registrations.find((r) => r.id === detailId) : null;

  const openPeriodeModal = (period = null) => {
    setEditingPeriod(period);
    if (period) {
      setFormPeriod({
        nama: period.nama,
        jenisProgram: period.jenisProgram || "kip",
        tanggalMulai: period.tanggalMulai || "",
        tanggalBerakhir: period.tanggalBerakhir || "",
        keterangan: period.keterangan || "",
        aktif: period.aktif !== false,
      });
    } else {
      setFormPeriod({
        nama: "",
        jenisProgram: "kip",
        tanggalMulai: "",
        tanggalBerakhir: "",
        keterangan: "",
        aktif: true,
      });
    }
    setPeriodeModalOpen(true);
  };

  const savePeriode = (e) => {
    e.preventDefault();
    savePeriod(editingPeriod ? { ...editingPeriod, ...formPeriod } : formPeriod);
    setPeriodeModalOpen(false);
    refresh();
  };

  const handleDeletePeriod = (id) => {
    if (window.confirm("Hapus periode ini?")) {
      deletePeriod(id);
      refresh();
    }
  };

  const handleSaveAdminNote = () => {
    if (!detailId) return;
    updateRegistrationAdminNotes(detailId, adminNote);
    setAdminNote("");
    refresh();
    setDetailId(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-batik-gold flex items-center justify-center px-4">
        <Card className="w-full max-w-sm border-[hsl(var(--karmila-sage))]/20 shape-curve-lg shadow-xl bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--karmila-sage))]">
              <Lock className="w-5 h-5" /> Login Admin
            </CardTitle>
            <p className="text-sm text-slate-500">
              Masukkan kata sandi untuk mengakses panel admin.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-[hsl(var(--karmila-sage))] hover:bg-[hsl(var(--karmila-sage))]/90"
              >
                Masuk
              </Button>
            </form>
            <Link to="/" className="block text-center text-sm text-amber-700 mt-4 hover:text-amber-800 hover:underline font-medium">
              Kembali ke Beranda
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-batik-gold pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-[hsl(var(--karmila-sage))] text-white shadow-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo-kemendikbud.png" alt="Kemendikbud" className="h-9 w-auto object-contain" />
              <img src="/logo-dpr-ri.png" alt="DPR RI" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold">Admin Panel</div>
              <div className="text-xs text-white/80">DR. KARMILA Foundation</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs md:text-sm text-[hsl(var(--karmila-gold-soft))] hover:underline">
              Beranda
            </Link>
            <Button
              size="sm"
              onClick={() => setView(view === "periode" ? "dashboard" : "periode")}
              className="bg-[hsl(var(--karmila-gold))] text-[hsl(var(--karmila-sage))] hover:opacity-90"
            >
              <Settings className="w-4 h-4 mr-1" /> Kelola Periode
            </Button>
            <Button
              size="sm"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white shadow-sm rounded-full px-4 flex items-center gap-1 text-xs md:text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>

        {view === "periode" ? (
          <>
            <div className="mb-4 rounded-t-xl bg-[hsl(var(--karmila-sage))] text-white px-6 py-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Manajemen Periode Pendaftaran</span>
            </div>
            <Card className="rounded-t-none border-t-0 -mt-px border-[hsl(var(--karmila-sage))]/20 bg-white/95">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Periode Pendaftaran</h2>
                  <Button
                    onClick={() => openPeriodeModal()}
                    className="bg-[hsl(var(--karmila-sage))] hover:bg-[hsl(var(--karmila-sage))]/90"
                  >
                    + Tambah Periode
                  </Button>
                </div>
                <div className="space-y-4">
                  {periods.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">Belum ada periode. Klik Tambah Periode.</p>
                  ) : (
                    periods.map((p, idx) => (
                      <div
                        key={p.id}
                        className={`flex flex-wrap items-center gap-4 p-4 rounded-xl border-2 ${
                          p.aktif ? "border-green-300 bg-green-50/50" : "border-slate-200 bg-slate-50/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-700">{idx + 1}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {p.jenisProgram === "pip" ? "PIP" : "KIP Kuliah"}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {p.aktif ? "Sedang Dibuka" : "Ditutup"}
                        </span>
                        <span className="text-sm text-slate-600">
                          {formatPeriodDate(p.tanggalMulai)} - {formatPeriodDate(p.tanggalBerakhir)}
                        </span>
                        {p.nama && <span className="text-sm text-slate-500">({p.nama})</span>}
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePeriodActive(p.id) && refresh()}
                            className={`relative w-10 h-5 rounded-full transition-colors ${
                              p.aktif ? "bg-[hsl(var(--karmila-sage))]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                p.aktif ? "left-5" : "left-0.5"
                              }`}
                            />
                          </button>
                          <Button variant="ghost" size="icon" onClick={() => openPeriodeModal(p)}>
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePeriod(p.id)}>
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { key: "total", label: "Total Pendaftar", icon: User, color: "slate" },
                { key: "menunggu", label: "Menunggu", icon: Clock, color: "yellow" },
                { key: "direview", label: "Direview", icon: FileText, color: "blue" },
                { key: "disetujui", label: "Disetujui", icon: Check, color: "green" },
                { key: "ditolak", label: "Ditolak", icon: XCircle, color: "red" },
              ].map(({ key, label, icon: Icon }) => (
                <Card key={key} className="border-slate-200">
                  <CardContent className="pt-4 pb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{stats[key] || 0}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-[hsl(var(--karmila-sage))]/20 bg-white/95">
              <CardContent className="p-0">
                <div className="flex border-b">
                  <button
                    type="button"
                    onClick={() => setTab("kip")}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      tab === "kip"
                        ? "border-[hsl(var(--karmila-sage))] text-[hsl(var(--karmila-sage))]"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" /> KIP Kuliah ({stats.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("pip")}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      tab === "pip"
                        ? "border-[hsl(var(--karmila-sage))] text-[hsl(var(--karmila-sage))]"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" /> PIP ({registrations.filter((r) => r.type === "pip").length})
                  </button>
                </div>
                <div className="p-4 flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Cari nama, NIK, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={filterPeriodId}
                    onChange={(e) => setFilterPeriodId(e.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Semua Periode</option>
                    {periods
                      .filter((p) => p.jenisProgram === tab)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama || `${formatPeriodDate(p.tanggalMulai)} - ${formatPeriodDate(p.tanggalBerakhir)}`}
                        </option>
                      ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Semua Status</option>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <Button
                    onClick={handleExport}
                    className="bg-[hsl(var(--karmila-sage))] hover:bg-[hsl(var(--karmila-sage))]/90"
                  >
                    <Download className="w-4 h-4 mr-1" /> Export Laporan
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-left text-slate-600 font-medium">
                        <th className="p-3">NAMA</th>
                        <th className="p-3">NIK</th>
                        <th className="p-3">UNIVERSITAS</th>
                        <th className="p-3">PERIODE</th>
                        <th className="p-3">TANGGAL</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            Tidak ada data.
                          </td>
                        </tr>
                      ) : (
                        filteredList.map((r) => {
                          const period = periods.find((p) => p.id === r.periodId);
                          const nama = r.type === "kip" ? r.data?.namaLengkap : r.data?.namaSiswa;
                          const univ = r.type === "kip" ? r.data?.namaPerguruanTinggi : r.data?.namaSekolah;
                          const nik = (r.data?.nik || r.data?.nikSiswa || "-").toString();
                          return (
                            <tr key={r.id} className="border-b hover:bg-slate-50/50">
                              <td className="p-3">
                                <div className="font-medium text-slate-800">{nama || "—"}</div>
                                <div className="text-xs text-slate-500">{r.data?.email || ""}</div>
                              </td>
                              <td className="p-3 text-slate-600">{nik}</td>
                              <td className="p-3 text-slate-600">{univ || "—"}</td>
                              <td className="p-3 text-slate-600">{period?.nama || r.periodName || "-"}</td>
                              <td className="p-3 text-slate-600">
                                {r.submittedAt ? formatPeriodDate(r.submittedAt) : "-"}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                    r.status === "disetujui"
                                      ? "bg-green-100 text-green-800"
                                      : r.status === "ditolak"
                                      ? "bg-red-100 text-red-800"
                                      : r.status === "direview"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-[hsl(var(--karmila-gold-soft))] text-[hsl(var(--karmila-sage))]"
                                  }`}
                                >
                                  {STATUS_LABELS[r.status] || "Menunggu"}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setDetailId(r.id);
                                      setAdminNote(r.adminNotes || "");
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <select
                                    value={r.status || "menunggu"}
                                    onChange={(e) => {
                                      updateRegistrationStatus(r.id, e.target.value);
                                      refresh();
                                    }}
                                    className="h-8 rounded border border-input bg-transparent px-2 text-xs"
                                  >
                                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                      <option key={k} value={k}>{v}</option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Modal Tambah/Edit Periode */}
      <Dialog open={periodeModalOpen} onOpenChange={setPeriodeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPeriod ? "Edit Periode" : "Tambah Periode Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={savePeriode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Periode</label>
              <Input
                value={formPeriod.nama}
                onChange={(e) => setFormPeriod((p) => ({ ...p, nama: e.target.value }))}
                placeholder="Contoh: Gelombang 1 - 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Program</label>
              <select
                value={formPeriod.jenisProgram}
                onChange={(e) => setFormPeriod((p) => ({ ...p, jenisProgram: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="kip">KIP Kuliah</option>
                <option value="pip">PIP</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={formPeriod.tanggalMulai}
                  onChange={(e) => setFormPeriod((p) => ({ ...p, tanggalMulai: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Berakhir</label>
                <Input
                  type="date"
                  value={formPeriod.tanggalBerakhir}
                  onChange={(e) => setFormPeriod((p) => ({ ...p, tanggalBerakhir: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
              <textarea
                value={formPeriod.keterangan}
                onChange={(e) => setFormPeriod((p) => ({ ...p, keterangan: e.target.value }))}
                placeholder="Keterangan tambahan..."
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormPeriod((p) => ({ ...p, aktif: !p.aktif }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  formPeriod.aktif ? "bg-[hsl(var(--karmila-sage))]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    formPeriod.aktif ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-slate-700">Aktifkan Periode</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPeriodeModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-[hsl(var(--karmila-sage))] hover:bg-[hsl(var(--karmila-sage))]/90">
                {editingPeriod ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Detail Pendaftaran - layout seperti gambar */}
      <Dialog open={!!detailId} onOpenChange={(open) => !open && setDetailId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailRegistration && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Pendaftaran {detailRegistration.type === "kip" ? "KIP Kuliah" : "PIP"}</DialogTitle>
                <div className="flex items-center justify-between gap-4 mt-2">
                  <span className="text-sm text-slate-600">Status:</span>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                      detailRegistration.status === "disetujui" ? "bg-green-100 text-green-800" :
                      detailRegistration.status === "ditolak" ? "bg-red-100 text-red-800" :
                      detailRegistration.status === "direview" ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {STATUS_LABELS[detailRegistration.status] || "Menunggu"}
                  </span>
                  <select
                    value={detailRegistration.status || "menunggu"}
                    onChange={(e) => {
                      updateRegistrationStatus(detailRegistration.id, e.target.value);
                      refresh();
                    }}
                    className="h-8 rounded-md border border-input px-3 text-sm flex-1 max-w-[140px]"
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </DialogHeader>

              <div className="space-y-6 text-sm">
                {detailRegistration.type === "kip" ? (
                  <>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" /> Data Pribadi
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nama Lengkap</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaLengkap || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">NIK</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nik || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Tempat, Tgl Lahir</dt><dd className="font-medium text-slate-800 mt-0.5">{[detailRegistration.data?.tempatLahir, detailRegistration.data?.tanggalLahir].filter(Boolean).join(", ") || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Jenis Kelamin</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.jenisKelamin || "—"}</dd></div>
                        <div className="col-span-2"><dt className="text-xs text-slate-500 uppercase tracking-wide">Alamat</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.alamatLengkap || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Telepon</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.telepon || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Email</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.email || "—"}</dd></div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Data Perguruan Tinggi
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Universitas</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaPerguruanTinggi || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Program Studi</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.programStudi || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">NIM</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nim || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Semester</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.semester || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nomor SK</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nomorSK || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Bank</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaBank || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">No. Rekening</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.noRekening || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Atas Nama</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaPemilikRekening || "—"}</dd></div>
                      </dl>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" /> Data Siswa
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nama Lengkap Siswa</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaSiswa || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">NIK</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nikSiswa || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">NISN</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nisn || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Tempat, Tgl Lahir</dt><dd className="font-medium text-slate-800 mt-0.5">{[detailRegistration.data?.tempatLahir, detailRegistration.data?.tanggalLahir].filter(Boolean).join(", ") || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Jenis Kelamin</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.jenisKelamin || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Telepon</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.telepon || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Email</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.email || "—"}</dd></div>
                        <div className="col-span-2"><dt className="text-xs text-slate-500 uppercase tracking-wide">Alamat</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.alamatLengkap || "—"}</dd></div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Data Sekolah
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nama Sekolah</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaSekolah || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">NPSN</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.npsn || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Jenjang</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.jenjang || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Kelas</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.kelas || "—"}</dd></div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Data Orang Tua / Wali
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nama Ayah</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaAyah || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">NIK Ayah</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nikAyah || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Pekerjaan Ayah</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.pekerjaanAyah || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nama Ibu</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.namaIbu || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">NIK Ibu</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nikIbu || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Pekerjaan Ibu</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.pekerjaanIbu || "—"}</dd></div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Data Ekonomi
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Penghasilan Bulanan</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.penghasilanBulanan || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nomor KIP</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nomorKIP || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nomor KKS</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nomorKKS || "—"}</dd></div>
                        <div><dt className="text-xs text-slate-500 uppercase tracking-wide">Nomor PKH</dt><dd className="font-medium text-slate-800 mt-0.5">{detailRegistration.data?.nomorPKH || "—"}</dd></div>
                      </dl>
                    </div>
                  </>
                )}

                {detailRegistration.files && Object.keys(detailRegistration.files).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <FileCheck className="w-4 h-4" /> Dokumen
                    </h4>
                    <ul className="space-y-2">
                      {Object.entries(detailRegistration.files).flatMap(([key, names]) =>
                        (names || []).map((name) => (
                          <li key={`${key}-${name}`} className="flex items-center justify-between gap-2 text-slate-700 py-1">
                            <span>{FILE_LABELS[key] || key}: <span className="text-slate-500">{name}</span></span>
                            <span className="text-green-600 text-sm font-medium">Lihat Dokumen</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Catatan Admin</h4>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Tambahkan catatan..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-y"
                  />
                  <Button
                    size="sm"
                    className="mt-2 bg-[hsl(var(--karmila-sage))] hover:bg-[hsl(var(--karmila-sage))]/90"
                    onClick={handleSaveAdminNote}
                  >
                    Simpan Catatan
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
