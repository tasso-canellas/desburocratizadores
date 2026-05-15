import { Outlet, useNavigate, useLocation } from "react-router";
import {
  Scale,
  LayoutDashboard,
  Upload,
  LogOut,
  Bell,
  ArrowLeft,
} from "lucide-react";
import { useDocuments } from "../../context/DocumentContext";

export function LawyerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { documents } = useDocuments();

  const pendingCorrections = documents.reduce(
    (acc, doc) =>
      acc +
      doc.correctionRequests.filter((cr) => !cr.resolved)
        .length,
    0,
  );

  const isSubPage =
    location.pathname !== "/advogado" &&
    location.pathname !== "/advogado/upload";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/advogado")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-800 font-semibold">
              Desburocratizadores
            </span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 text-sm">
            Painel do Advogado
          </span>
        </div>

        <div className="flex items-center gap-3">
          {pendingCorrections > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-full font-medium">
              <Bell className="w-3.5 h-3.5" />
              {pendingCorrections} solicitaç
              {pendingCorrections > 1 ? "ões" : "ão"} pendente
              {pendingCorrections > 1 ? "s" : ""}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
              CM
            </div>
            <span className="hidden sm:block">
              Dr. Carlos Mendes
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Sair</span>
          </button>
        </div>
      </header>

      {/* Breadcrumb nav */}
      <nav className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-1 text-sm">
        {isSubPage && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white/60 transition-colors mr-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        )}
        <button
          onClick={() => navigate("/advogado")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            location.pathname === "/advogado"
              ? "bg-white text-blue-700 font-medium shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Meus Documentos
        </button>
        <button
          onClick={() => navigate("/advogado/upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            location.pathname === "/advogado/upload"
              ? "bg-white text-blue-700 font-medium shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
          }`}
        >
          <Upload className="w-4 h-4" />
          Novo Documento
        </button>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}