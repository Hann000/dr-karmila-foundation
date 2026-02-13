const STORAGE_KEY = "karmila_registrations";
const FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB

export const STATUS_LABELS = {
  menunggu: "Menunggu",
  direview: "Direview",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

export function getRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegistration(payload) {
  const list = getRegistrations();
  const generatedId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36);
  const entry = {
    id: generatedId,
    status: payload.status != null ? payload.status : "menunggu",
    periodId: payload.periodId != null ? payload.periodId : null,
    adminNotes: payload.adminNotes != null ? payload.adminNotes : "",
    ...payload,
    submittedAt: new Date().toISOString(),
  };
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return entry;
}

export function getRegistrationById(id) {
  const found = getRegistrations().find((r) => r.id === id);
  return found || null;
}

export function updateRegistrationStatus(id, status) {
  const list = getRegistrations();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list[idx];
}

export function updateRegistrationAdminNotes(id, adminNotes) {
  const list = getRegistrations();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    adminNotes: adminNotes != null ? adminNotes : "",
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list[idx];
}

export function validateFileSize(file) {
  return file.size <= FILE_SIZE_LIMIT;
}

export function getFileSizeLimitMB() {
  return 2;
}

export function exportRegistrationsToCSV(options = {}) {
  const { periodId = null, status = null, type = null } = options;
  let list = getRegistrations();
  if (periodId) list = list.filter((r) => r.periodId === periodId);
  if (status) list = list.filter((r) => r.status === status);
  if (type) list = list.filter((r) => r.type === type);

  const headers = [
    "No",
    "Tipe",
    "Periode ID",
    "Nama",
    "NIK",
    "Email",
    "Universitas/Sekolah",
    "Periode",
    "Tanggal Daftar",
    "Status",
    "Catatan Admin",
  ];
  const rows = list.map((r, i) => {
    const nama = r.type === "kip" ? r.data?.namaLengkap : r.data?.namaSiswa;
    const nik = (r.data?.nik || r.data?.nikSiswa || "").toString();
    const email = r.data?.email || "";
    const univ =
      r.type === "kip"
        ? r.data?.namaPerguruanTinggi
        : r.data?.namaSekolah;
    return [
      i + 1,
      r.type === "kip" ? "KIP Kuliah" : "PIP",
      r.periodId || "-",
      nama || "-",
      nik,
      email,
      univ || "-",
      r.periodName || "-",
      r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("id-ID") : "-",
      STATUS_LABELS[r.status] || r.status || "Menunggu",
      (r.adminNotes || "").replace(/"/g, '""'),
    ];
  });
  const BOM = "\uFEFF";
  const csv =
    BOM +
    [headers.join(","), ...rows.map((row) => row.map((c) => `"${String(c)}"`).join(","))].join("\r\n");
  return csv;
}

export { FILE_SIZE_LIMIT };
