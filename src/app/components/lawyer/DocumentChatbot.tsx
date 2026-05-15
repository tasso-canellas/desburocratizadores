import { useState, useRef, useEffect } from "react";
import { Send, User, ChevronDown, Loader, MessageCircle } from "lucide-react";
import { LegalDocument } from "../../data/mockData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "Quais são os principais riscos deste contrato?",
  "Qual ponto tem menor confiança da IA?",
  "Sugira uma linguagem mais simples para o aluguel",
  "Existe alguma cláusula abusiva?",
  "Quais prazos são mais urgentes?",
];

function buildMockResponse(question: string, doc: LegalDocument): string {
  const q = question.toLowerCase();

  if (q.includes("risco") || q.includes("risks")) {
    const riskList = doc.risks.map(r => `• **${r.title}** (${r.level}): ${r.description}`).join("\n");
    return `Com base na análise do documento **${doc.title}**, identifiquei ${doc.risks.length} indicadores de risco:\n\n${riskList}\n\nO risco geral classificado é **${doc.overallRisk}**. Recomendo atenção especial às cláusulas de maior nível de risco antes de validar.`;
  }

  if (q.includes("confiança") || q.includes("confidence") || q.includes("menor")) {
    const lowConf = doc.keyPoints.filter(kp => kp.confidence === "baixa");
    const medConf = doc.keyPoints.filter(kp => kp.confidence === "media");
    if (lowConf.length > 0) {
      return `Encontrei **${lowConf.length} ponto(s) com confiança baixa** que exigem revisão especial:\n\n${lowConf.map(kp => `• **${kp.title}**: ${kp.confidenceNote || "Ambiguidade detectada no texto original."}`).join("\n")}\n\nAlém disso, há **${medConf.length} ponto(s) com confiança média**. Estes também merecem verificação cuidadosa.`;
    }
    return `Neste documento todos os pontos têm confiança média ou alta. O ponto com menor pontuação é **${doc.keyPoints.sort((a, b) => a.confidenceScore - b.confidenceScore)[0]?.title}** com ${doc.keyPoints.sort((a, b) => a.confidenceScore - b.confidenceScore)[0]?.confidenceScore}%.`;
  }

  if (q.includes("linguagem") || q.includes("simples") || q.includes("aluguel") || q.includes("suger")) {
    const paymentPoints = doc.keyPoints.filter(kp => kp.category === "pagamento");
    if (paymentPoints.length > 0) {
      const point = paymentPoints[0];
      return `Aqui está uma sugestão de linguagem mais simples para o ponto **"${point.title}"**:\n\n**Original (jurídico):**\n"${point.legalText}"\n\n**Sugestão simplificada:**\n"${point.simpleDescription}"\n\nVocê pode editar diretamente o card deste ponto clicando no ícone de lápis ✏️. A alteração ficará marcada como "Editado" para rastreabilidade.`;
    }
    return `Para simplificar a linguagem, foque nos pontos da categoria **Pagamento** e **Obrigação**. Evite termos como "inadimplemento", "cláusula resolutória" e "mora" — substitua por "atraso", "cancelamento" e "multa por atraso".`;
  }

  if (q.includes("abusiv") || q.includes("abuso")) {
    const multas = doc.keyPoints.filter(kp => kp.category === "multa");
    if (multas.length > 0) {
      return `Identifiquei **${multas.length} cláusula(s) de multa** que podem ser contestadas dependendo do contexto:\n\n${multas.map(m => `• **${m.title}**: ${m.simpleDescription}`).join("\n")}\n\nPelo Código de Defesa do Consumidor (CDC), multas superiores a 2% do valor da obrigação podem ser consideradas abusivas em relações de consumo. Verifique o contexto contratual antes de validar estes pontos.`;
    }
    return `Não identifiquei cláusulas claramente abusivas neste documento. No entanto, recomendo revisar os pontos classificados como **Multa/Penalidade** e verificar os limites legais aplicáveis ao tipo de contrato.`;
  }

  if (q.includes("prazo") || q.includes("urgente") || q.includes("vencimento")) {
    const urgent = doc.deadlines.filter(d => d.importance === "high");
    const others = doc.deadlines.filter(d => d.importance !== "high");
    const fmt = (d: { date: string }) => new Date(d.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    return `Encontrei **${doc.deadlines.length} prazo(s)** neste contrato:\n\n${urgent.length > 0 ? `🔴 **Urgentes:**\n${urgent.map(d => `• ${d.description} — ${fmt(d)}`).join("\n")}\n\n` : ""}${others.length > 0 ? `🟡 **Outros prazos:**\n${others.map(d => `• ${d.description} — ${fmt(d)}`).join("\n")}` : ""}\n\nRecomendo informar o cliente sobre os prazos urgentes antes de enviar o documento simplificado.`;
  }

  if (q.includes("documento") || q.includes("resumo") || q.includes("visão geral") || q.includes("overview")) {
    return `**Resumo do documento:**\n\n${doc.overview}\n\nO documento possui:\n• ${doc.keyPoints.length} pontos principais identificados\n• ${doc.deadlines.length} prazos relevantes\n• ${doc.risks.length} indicadores de risco\n• Nível de risco geral: **${doc.overallRisk}**\n\nPosso detalhar qualquer aspecto específico que desejar.`;
  }

  if (q.includes("cliente") || q.includes("maria") || q.includes("enviar")) {
    return `O documento está destinado à cliente **${doc.clientName}** (${doc.clientEmail || "e-mail não informado"}).\n\nAtualmente, **${doc.keyPoints.filter(kp => kp.isReviewed).length} de ${doc.keyPoints.length} pontos** foram revisados por você. Para enviar ao cliente, todos os pontos precisam ser marcados como revisados.\n\nLembre-se: ao enviar, você declara que revisou o conteúdo e assume responsabilidade pela interpretação jurídica.`;
  }

  // Generic fallback
  return `Analisando o documento **${doc.title}**...\n\nPosso ajudar com:\n• **Análise de risco** — identificar cláusulas problemáticas\n• **Simplificação de linguagem** — sugerir redações mais claras\n• **Verificação de prazos** — destacar datas importantes\n• **Confiança da IA** — explicar incertezas na extração\n• **Visão geral** — resumir o documento\n\nFaça uma pergunta mais específica ou use as sugestões rápidas abaixo.`;
}

export function DocumentChatbot({ doc }: { doc: LegalDocument }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Analisando **${doc.title}** — ${doc.keyPoints.length} pontos extraidos, risco **${doc.overallRisk}**.\n\nPosso ajudar com analise de clausulas, simplificacao de linguagem, verificacao de confianca. O que deseja saber?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowQuick(false);

    setTimeout(() => {
      const response = buildMockResponse(text, doc);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatContent = (text: string) => {
    // Simple markdown-ish rendering
    return text.split("\n").map((line, i) => {
      const boldLine = line.replace(/\*\*(.+?)\*\*/g, (_, match) => `<strong>${match}</strong>`);
      return (
        <span key={i} className="block">
          <span dangerouslySetInnerHTML={{ __html: boldLine || "&nbsp;" }} />
        </span>
      );
    });
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700">
            Chat sobre o documento
          </p>
          <p className="text-[11px] text-slate-400 truncate">Pergunte sobre clausulas, riscos, prazos</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                msg.role === "assistant" ? "bg-slate-100" : "bg-slate-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-600" />
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                    : "bg-slate-700 text-white rounded-tr-sm"
                }`}
              >
                {formatContent(msg.content)}
              </div>
              <span className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <Loader className="w-3.5 h-3.5 text-slate-400 animate-spin" />
              <span className="text-xs text-slate-400">Pensando...</span>
            </div>
          </div>
        )}

        {/* Quick questions */}
        {showQuick && !isTyping && (
          <div className="mt-2">
            <button
              onClick={() => setShowQuick(false)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 mb-2 transition-colors"
            >
              <ChevronDown className="w-3 h-3" />
              Perguntas rápidas
            </button>
            <div className="flex flex-col gap-1.5">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-3 py-3 border-t border-slate-200 bg-white flex-shrink-0 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pergunte sobre o documento..."
          disabled={isTyping}
          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 disabled:opacity-60 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white disabled:text-slate-400" />
        </button>
      </form>

      {/* Disclaimer */}
      <div className="px-3 pb-2 flex-shrink-0">
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Respostas automaticas — valide antes de enviar
        </p>
      </div>
    </div>
  );
}
