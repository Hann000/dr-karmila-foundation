import Home from "./pages/Home.jsx";
import DaftarKIPKuliah from "./pages/DaftarKIPKuliah.jsx";
import DaftarPIP from "./pages/DaftarPIP.jsx";
import TerimaKasih from "./pages/TerimaKasih.jsx";
import Admin from "./pages/Admin.jsx";

export const pagesConfig = {
  mainPage: "Home",
  Pages: {
    Home,
    "daftar/kip-kuliah": DaftarKIPKuliah,
    "daftar/pip": DaftarPIP,
    "terima-kasih": TerimaKasih,
    admin: Admin,
  },
};


