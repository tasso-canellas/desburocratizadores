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
  "Quais as datas mais importantes deste contrato?",
  "O que acontece se eu atrasar o pagamento?",
  "Posso sair antes do prazo?",
  "Quais são meus direitos neste contrato?",
  "Tem algo que posso negociar?",
];

function buildClientResponse(question: string, doc: LegalDocument): string {
  const q = question.toLowerCase();

  if (q.includes("data") || q.includes("prazo") || q.includes("vencimento") || q.includes("quando")) {
    const urgent = doc.deadlines.filter(d => d.importance === "high");
    const others = doc.deadlines.filter(d => d.importance !== "high");
    const fmt = (d: { date: string }) =>
      new Date(d.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    return `Encontrei **${doc.deadlines.length} data(s)** neste contrato:\n\n${urgent.length > 0 ? `**Mais importantes:**\n${urgent.map(d => `- ${d.description} — ${fmt(d)}`).join("\n")}\n\n` : ""}${others.length > 0 ? `**Outras datas:**\n${others.map(d => `- ${d.description} — ${fmt(d)}`).join("\n")}` : ""}\n\nSe tiver dúvida sobre alguma data, pergunte ao seu advogado.`;
  }

  if (q.includes("atras") || q.includes("multa") || q.includes("pagar")) {
    const multas = doc.keyPoints.filter(kp => kp.category === "multa");
    if (multas.length > 0) {
      return `Sobre multas e pagamentos:\n\n${multas.map(m => `- **${m.title}**: ${m.simpleDescription}`).join("\n\n")}\n\nSe precisar de mais detalhes, use o botao "Nao entendi" no ponto que quiser.`;
    }
    return `Nao encontrei clausulas de multa neste contrato. Mas se voce tiver duvida sobre algum pagamento, pergunte ao seu advogado.`;
  }

  if (q.includes("sair") || q.includes("antes") || q.includes("rescis") || q.includes("cancelar")) {
    const rescisao = doc.keyPoints.filter(kp => kp.category === "multa" || kp.title.toLowerCase().includes("sair") || kp.title.toLowerCase().includes("rescis") || kp.title.toLowerCase().includes("antes"));
    if (rescisao.length > 0) {
      return `Sobre sair antes do prazo:\n\n${rescisao.map(r => `- **${r.title}**: ${r.simpleDescription}`).join("\n\n")}\n\nConverse com seu advogado antes de tomar qualquer decisao.`;
    }
    return `Nao encontrei clausulas especificas sobre saida antecipada. Pergunte ao seu advogado para ter certeza.`;
  }

  if (q.includes("direito") || q.includes("posso") || q.includes("meu")) {
    const direitos = doc.keyPoints.filter(kp => kp.category === "direito");
    if (direitos.length > 0) {
      return `Seus direitos neste contrato:\n\n${direitos.map(d => `- **${d.title}**: ${d.simpleDescription}`).join("\n\n")}\n\nLembre-se: se algo nao ficou claro, pergunte ao seu advogado.`;
    }
    return `Nao encontrei pontos especificos sobre direitos neste documento. Seu advogado pode explicar melhor.`;
  }

  if (q.includes("negoci") || q.includes("mudar") || q.includes("alterar")) {
    const negociaveis = doc.keyPoints.filter(kp => kp.category === "modificavel");
    if (negociaveis.length > 0) {
      return `Pontos que podem ser negociados:\n\n${negociaveis.map(n => `- **${n.title}**: ${n.simpleDescription}`).join("\n\n")}\n\nFale com seu advogado para saber como negociar esses pontos.`;
    }
    return `Nao identifiquei pontos claramente negociaveis. Converse com seu advogado sobre isso.`;
  }

  if (q.includes("resumo") || q.includes("documento") || q.includes("contrato") || q.includes("sobre")) {
    return `**Sobre este documento:**\n\n${doc.overview}\n\nO documento tem:\n- ${doc.keyPoints.length} pontos principais\n- ${doc.deadlines.length} datas importantes\n\nPosso explicar qualquer parte com mais detalhes.`;
  }

  // Generic fallback
  return `Posso ajudar com:\n\n- **Datas importantes** — quando voce precisa fazer algo\n- **Multas e pagamentos** — o que acontece se atrasar\n- **Seus direitos** — o que o contrato garante pra voce\n- **O que pode ser negociado** — antes de assinar\n\nFaca uma pergunta mais especifica ou use as sugestoes abaixo.`;
}

export function ClientChatbot({ doc }: { doc: LegalDocument }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Ola! Posso te ajudar a entender o documento **${doc.title}**.\n\nSe tiver alguma duvida sobre o contrato, e so perguntar aqui. Vou tentar explicar de forma simples.`,
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
      const response = buildClientResponse(text, doc);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatContent = (text: string) => {
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
            Tire suas duvidas
          </p>
          <p className="text-[11px] text-slate-400 truncate">Pergunte sobre o documento</p>
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
              Sugestoes
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
          placeholder="Escreva sua duvida..."
          disabled={isTyping}
          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 disabled:opacity-60 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
