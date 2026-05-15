import { useState } from "react";
import { useNavigate } from "react-router";
import { Scale, Eye, EyeOff, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

type Mode = "login" | "register";
type Role = "advogado" | "cidadao";

const roles: { id: Role; label: string; desc: string; color: string; border: string; activeBg: string; activeText: string }[] = [
  {
    id: "advogado",
    label: "Advogado(a)",
    desc: "Reviso contratos e envio resumos para meus clientes",
    color: "text-blue-600",
    border: "border-blue-400",
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
  },
  {
    id: "cidadao",
    label: "Cidadão",
    desc: "Quero entender o contrato que recebi em linguagem simples",
    color: "text-emerald-600",
    border: "border-emerald-400",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
  },
];

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // register state
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState("");

  const validateRegister = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Nome é obrigatório";
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail))
      errors.email = "E-mail inválido";
    if (regPassword.length < 8) errors.password = "Mínimo de 8 caracteres";
    if (regPassword !== regConfirm) errors.confirm = "As senhas não coincidem";
    if (!role) errors.role = "Selecione um cargo";
    return errors;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Preencha e-mail e senha");
      return;
    }
    // Mock: route based on email pattern
    if (loginEmail.toLowerCase().includes("adv") || loginEmail.toLowerCase().includes("dr")) {
      navigate("/advogado");
    } else {
      navigate("/cliente");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegister();
    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }
    navigate(role === "advogado" ? "/advogado" : "/cliente");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) setForgotSent(true);
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return null;
    if (pw.length < 6) return { level: "fraca", color: "bg-red-400", width: "w-1/4" };
    if (pw.length < 10 && !/[^a-zA-Z0-9]/.test(pw)) return { level: "média", color: "bg-amber-400", width: "w-2/4" };
    if (pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw))
      return { level: "forte", color: "bg-emerald-500", width: "w-full" };
    return { level: "boa", color: "bg-blue-400", width: "w-3/4" };
  };

  const strength = passwordStrength(regPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center gap-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-slate-900 font-semibold text-lg tracking-tight">LexSimples</span>
          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            protótipo lo-fi
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setLoginError(""); setRegErrors({}); }}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    mode === m
                      ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50/40"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {m === "login" ? "Entrar" : "Criar conta"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ---- LOGIN ---- */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }}
                      placeholder="seu@email.com"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Senha</label>
                    <div className="relative">
                      <input
                        type={showLoginPw ? "text" : "password"}
                        value={loginPassword}
                        onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
                        placeholder="••••••••"
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPw(!showLoginPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {loginError}
                    </p>
                  )}

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600"
                      />
                      <span className="text-xs text-slate-600">Lembrar meu acesso</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl font-medium text-sm transition-colors mt-2"
                  >
                    Entrar
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-slate-400 pt-1">
                    Ainda não tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-blue-600 hover:underline"
                    >
                      Criar conta
                    </button>
                  </p>
                </form>
              )}

              {/* ---- REGISTER ---- */}
              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Nome completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); setRegErrors(p => ({ ...p, name: "" })); }}
                      placeholder="Seu nome"
                      className={`w-full text-sm bg-slate-50 border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                        regErrors.name ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                      }`}
                    />
                    {regErrors.name && <p className="text-xs text-red-500 mt-1">{regErrors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => { setRegEmail(e.target.value); setRegErrors(p => ({ ...p, email: "" })); }}
                      placeholder="seu@email.com"
                      className={`w-full text-sm bg-slate-50 border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                        regErrors.email ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                      }`}
                    />
                    {regErrors.email && <p className="text-xs text-red-500 mt-1">{regErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Senha</label>
                    <div className="relative">
                      <input
                        type={showRegPw ? "text" : "password"}
                        value={regPassword}
                        onChange={e => { setRegPassword(e.target.value); setRegErrors(p => ({ ...p, password: "" })); }}
                        placeholder="Mínimo 8 caracteres"
                        className={`w-full text-sm bg-slate-50 border rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          regErrors.password ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPw(!showRegPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {regPassword && strength && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                        </div>
                        <span className="text-[10px] text-slate-500">Senha {strength.level}</span>
                      </div>
                    )}
                    {regErrors.password && <p className="text-xs text-red-500 mt-1">{regErrors.password}</p>}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Confirmar senha</label>
                    <div className="relative">
                      <input
                        type={showRegConfirm ? "text" : "password"}
                        value={regConfirm}
                        onChange={e => { setRegConfirm(e.target.value); setRegErrors(p => ({ ...p, confirm: "" })); }}
                        placeholder="Repita a senha"
                        className={`w-full text-sm bg-slate-50 border rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          regErrors.confirm ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirm(!showRegConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {regErrors.confirm && <p className="text-xs text-red-500 mt-1">{regErrors.confirm}</p>}
                    {regConfirm && regPassword === regConfirm && !regErrors.confirm && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Senhas coincidem
                      </p>
                    )}
                  </div>

                  {/* Role selection */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Cargo / Perfil</label>
                    <div className="grid grid-cols-2 gap-2">
                      {roles.map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => { setRole(r.id); setRegErrors(p => ({ ...p, role: "" })); }}
                          className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 text-left transition-all ${
                            role === r.id
                              ? `${r.border} ${r.activeBg}`
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <span className={`text-sm font-medium ${role === r.id ? r.activeText : "text-slate-700"}`}>
                            {r.label}
                          </span>
                          <span className="text-[11px] text-slate-500 leading-tight">{r.desc}</span>
                          {role === r.id && (
                            <CheckCircle className={`w-4 h-4 ${r.color}`} />
                          )}
                        </button>
                      ))}
                    </div>
                    {regErrors.role && <p className="text-xs text-red-500 mt-1">{regErrors.role}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl font-medium text-sm transition-colors mt-1"
                  >
                    Criar conta
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-slate-400 pt-1">
                    Já tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-blue-600 hover:underline"
                    >
                      Entrar
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-xs leading-relaxed">
              <strong>Protótipo de pesquisa.</strong> Não use dados reais. A IA é copiloto — todo conteúdo é validado pelo advogado responsável.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-slate-400 text-xs py-4 border-t border-slate-100 bg-white/50">
        LexSimples — Protótipo de pesquisa IHC · Não usar com dados reais
      </footer>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-slate-800 font-semibold mb-2">Recuperar senha</h3>
            {!forgotSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-slate-500 text-sm">
                  Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
                  >
                    Enviar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(false); setForgotEmail(""); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-medium text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Se <strong>{forgotEmail}</strong> estiver cadastrado, você receberá um e-mail com as instruções.
                </p>
                <button
                  onClick={() => { setShowForgot(false); setForgotEmail(""); setForgotSent(false); }}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-medium text-sm transition-colors"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
