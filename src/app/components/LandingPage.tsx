import { useNavigate } from "react-router";
import {
  Scale,
  User,
  Shield,
  Eye,
  Headphones,
  AlertTriangle,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center gap-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-slate-900 font-semibold text-lg tracking-tight">
            Descburocratizadores
          </span>
          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            protótipo lo-fi
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center mb-10">
          <h1 className="text-3xl text-slate-900 mb-3 leading-snug">
            Documentos jurídicos em linguagem simples
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">
            Advogados traduzem contratos para seus clientes com
            transparência, indicadores de risco e validação
            humana.
          </p>
        </div>

        {/* Role selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-10">
          <button
            onClick={() => navigate("/advogado")}
            className="group flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Scale className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-slate-900 font-semibold text-lg mb-1">
                Sou Advogado(a)
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Envio documentos, reviso a análise da IA e
                valido antes de enviar ao cliente.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 text-sm font-medium">
              Entrar como advogado
              <span className="text-lg">→</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/cliente")}
            className="group flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <User className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-slate-900 font-semibold text-lg mb-1">
                Sou Cliente
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Vejo o resumo do meu contrato em linguagem
                simples, com áudio e ícones visuais.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
              Ver meus documentos
              <span className="text-lg">→</span>
            </div>
          </button>
        </div>

        {/* Values */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
          {[
            {
              icon: (
                <Shield className="w-4 h-4 text-blue-600" />
              ),
              label: "Validação humana",
              desc: "Advogado revisa antes de enviar",
            },
            {
              icon: <Eye className="w-4 h-4 text-purple-600" />,
              label: "Transparência",
              desc: "Toda conclusão tem fonte",
            },
            {
              icon: (
                <Headphones className="w-4 h-4 text-emerald-600" />
              ),
              label: "Acessibilidade",
              desc: "Áudio e linguagem simples",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2 p-4 bg-white/60 rounded-xl border border-slate-100"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                {item.icon}
              </div>
              <p className="text-slate-800 text-sm font-medium">
                {item.label}
              </p>
              <p className="text-slate-500 text-xs">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-2 max-w-md bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 text-xs leading-relaxed">
            <strong>A IA é copiloto, não piloto.</strong> Todo
            conteúdo gerado pela IA deve ser revisado e validado
            pelo advogado responsável antes de ser
            disponibilizado ao cliente.
          </p>
        </div>
      </main>

      <footer className="text-center text-slate-400 text-xs py-4 border-t border-slate-100 bg-white/50">
        Desburocratizadores — Protótipo de pesquisa IHC · Não usar com
        dados reais
      </footer>
    </div>
  );
}