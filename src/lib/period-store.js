const PERIOD_STORAGE_KEY = "karmila_periods";

export function getPeriods() {
  try {
    const raw = localStorage.getItem(PERIOD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePeriod(period) {
  const list = getPeriods();
  const generatedId =
    period.id ||
    ((typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36)));
  const id = generatedId;
  const entry = {
    id,
    nama: period.nama || "",
    jenisProgram: period.jenisProgram || "kip",
    tanggalMulai: period.tanggalMulai || "",
    tanggalBerakhir: period.tanggalBerakhir || "",
    keterangan: period.keterangan || "",
    aktif: period.aktif !== false,
    createdAt: period.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) list[idx] = entry;
  else list.unshift(entry);
  localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(list));
  return entry;
}

export function deletePeriod(id) {
  const list = getPeriods().filter((p) => p.id !== id);
  localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function togglePeriodActive(id) {
  const list = getPeriods();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    aktif: !list[idx].aktif,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(list));
  return list[idx];
}

export function getOpenPeriodsForProgram(jenisProgram) {
  const now = new Date().toISOString().slice(0, 10);
  return getPeriods().filter(
    (p) =>
      p.jenisProgram === jenisProgram &&
      p.aktif &&
      p.tanggalMulai &&
      p.tanggalBerakhir &&
      p.tanggalMulai <= now &&
      p.tanggalBerakhir >= now
  );
}
