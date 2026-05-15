import { Outlet, useNavigate, useLocation } from "react-router";
import { Scale, LogOut, ArrowLeft } from "lucide-react";

export function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSubPage = location.pathname !== "/cliente";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {isSubPage && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-slate-800 font-semibold text-sm">
              Desburocratizadores
            </span>
            <span className="block text-slate-400 text-xs">
              {isSubPage ? "Detalhes do documento" : "Meus Documentos"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs">
              MS
            </div>
            <span className="hidden sm:block text-sm">
              Maria Silva
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}