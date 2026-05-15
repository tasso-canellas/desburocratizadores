import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Shield,
  Clock,
  X,
  Send,
  MessageCircle,
  FileText,
  Info,
  Pause,
  Play,
  Calendar,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { Category, Confidence, KeyPoint } from '../../data/mockData';
import { ClientChatbot } from './ClientChatbot';

// Category visual config - client-friendly, no emojis
const categoryDisplay: Record<Category, {
  label: string;
  shortLabel: string;
  bgCard: string;
  textColor: string;
  borderColor: string;
  iconBg: string;
}> = {
  pagamento: {
    label: 'QUANTO VOCE VAI PAGAR',
    shortLabel: 'Pagamento',
    bgCard: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
  },
  obrigacao: {
    label: 'O QUE VOCE DEVE FAZER',
    shortLabel: 'Obrigacao',
    bgCard: 'bg-purple-50',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
  },
  multa: {
    label: 'CUIDADO COM MULTAS',
    shortLabel: 'Multa',
    bgCard: 'bg-red-50',
    textColor: 'text-red-900',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
  },
  direito: {
    label: 'SEUS DIREITOS',
    shortLabel: 'Direito',
    bgCard: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  prazo: {
    label: 'DATAS IMPORTANTES',
    shortLabel: 'Prazo',
    bgCard: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
  },
  modificavel: {
    label: 'PODE SER NEGOCIADO',
    shortLabel: 'Negociavel',
    bgCard: 'bg-slate-50',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-200',
    iconBg: 'bg-slate-100',
  },
};

const confidenceClientLabel: Record<Confidence, { label: string; color: string; showNote: boolean }> = {
  alta: { label: 'Informacao confirmada', color: 'text-emerald-600', showNote: false },
  media: { label: 'Confirme com seu advogado', color: 'text-amber-600', showNote: true },
  baixa: { label: 'Fale com seu advogado sobre isso', color: 'text-red-600', showNote: true },
};

function AudioButton({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utteranceRef.current = utterance;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  return (
    <button
      onClick={handlePlay}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
        isPlaying
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
      }`}
      title="Ouvir este trecho"
    >
      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      {isPlaying ? 'Pausar' : 'Ouvir'}
    </button>
  );
}

function ClientKeyCard({
  point,
  onRequestHelp,
}: {
  point: KeyPoint;
  onRequestHelp: (point: KeyPoint) => void;
}) {
  const [showSource, setShowSource] = useState(false);
  const cat = categoryDisplay[point.category];
  const conf = confidenceClientLabel[point.confidence];
  const displayText = point.editedDescription ?? point.simpleDescription;

  return (
    <div className={`rounded-xl border p-4 ${cat.bgCard} ${cat.borderColor}`}>
      {/* Category header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${cat.iconBg} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-xs font-bold uppercase ${cat.textColor}`}>{cat.shortLabel.charAt(0)}</span>
        </div>
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${cat.textColor} opacity-50`}>
            {cat.label}
          </p>
          <p className={`font-medium text-sm ${cat.textColor} leading-tight`}>{point.title}</p>
        </div>
      </div>

      {/* Main description */}
      <p className={`text-sm leading-relaxed mb-3 ${cat.textColor}`}>
        {displayText}
      </p>

      {/* Confidence note (for low/medium confidence) */}
      {conf.showNote && point.confidenceNote && (
        <div className={`flex items-start gap-2 rounded-lg p-3 mb-3 ${
          point.confidence === 'baixa' ? 'bg-red-100 border border-red-200' : 'bg-amber-100 border border-amber-200'
        }`}>
          <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${point.confidence === 'baixa' ? 'text-red-600' : 'text-amber-600'}`} />
          <p className={`text-sm leading-relaxed ${point.confidence === 'baixa' ? 'text-red-800' : 'text-amber-800'}`}>
            {point.confidenceNote}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <AudioButton text={`${point.title}. ${displayText}`} />

          <button
            onClick={() => setShowSource(!showSource)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/60 border border-slate-200 text-slate-500 hover:bg-white transition-colors font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            Ver trecho original
            {showSource ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <button
          onClick={() => onRequestHelp(point)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white border border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-colors font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Nao entendi
        </button>
      </div>

      {/* Source citation (collapsed by default) */}
      {showSource && (
        <div className="mt-3 bg-white/80 border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
            Texto original — Pagina {point.page}
          </p>
          <p className="text-xs text-slate-500 italic leading-relaxed">"{point.legalText}"</p>
          <p className="text-xs text-slate-400 mt-1">{point.section}</p>
        </div>
      )}
    </div>
  );
}

function AudioPlayerBar({ docTitle }: { docTitle: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const summary = `Este documento se chama ${docTitle}. Aqui estão os pontos mais importantes do seu contrato, explicados de forma simples. Ouça com atenção.`;

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="bg-slate-700 text-white rounded-xl p-3 flex items-center gap-3">
      <button
        onClick={handlePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          isPlaying ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-500 hover:bg-slate-400'
        }`}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-0.5">
          {isPlaying ? 'Reproduzindo...' : 'Ouvir este documento'}
        </p>
        <p className="text-slate-400 text-xs">
          Clique para ouvir o resumo em voz alta
        </p>
      </div>
      {isPlaying && (
        <button
          onClick={() => { window.speechSynthesis.cancel(); setIsPlaying(false); }}
          className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function ClientDocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, addCorrectionRequest } = useDocuments();
  const [helpPoint, setHelpPoint] = useState<KeyPoint | null>(null);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSent, setHelpSent] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'todos'>('todos');

  const doc = documents.find(d => d.id === id);

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <FileText className="w-12 h-12 mb-3 opacity-40" />
        <p>Documento nao encontrado</p>
        <button onClick={() => navigate('/cliente')} className="mt-4 text-emerald-600 text-sm">
          Voltar
        </button>
      </div>
    );
  }

  const categories = [...new Set(doc.keyPoints.map(kp => kp.category))];
  const filteredPoints = activeCategory === 'todos'
    ? doc.keyPoints
    : doc.keyPoints.filter(kp => kp.category === activeCategory);

  const handleSendHelp = () => {
    if (!helpPoint || !helpMessage.trim()) return;
    addCorrectionRequest(doc.id, {
      id: `cr-${Date.now()}`,
      pointId: helpPoint.id,
      pointTitle: helpPoint.title,
      clientMessage: helpMessage,
      date: new Date().toISOString(),
      resolved: false,
    });
    setHelpSent(true);
    setTimeout(() => {
      setHelpPoint(null);
      setHelpMessage('');
      setHelpSent(false);
    }, 2000);
  };

  const riskBanner = doc.overallRisk === 'alto'
    ? { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: <AlertTriangle className="w-4 h-4 text-red-600" />, msg: 'Este contrato tem pontos importantes que precisam de atencao. Leia com cuidado e fale com seu advogado se tiver duvidas.' }
    : doc.overallRisk === 'medio'
    ? { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: <AlertTriangle className="w-4 h-4 text-amber-600" />, msg: 'Este contrato e normal, mas tem algumas clausulas que voce precisa entender bem. Se ficar em duvida, pergunte ao seu advogado.' }
    : { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, msg: 'Este contrato parece favoravel para voce. Mesmo assim, leia todos os pontos com atencao.' };

  const answeredQuestions = doc.correctionRequests.filter(cr => cr.resolved);

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      {/* ===== LEFT: Chatbot ===== */}
      <div className="w-[340px] flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden">
        <ClientChatbot doc={doc} />
      </div>

      {/* ===== RIGHT: Document Summary ===== */}
      <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 py-6 pb-20">
      {/* Back */}
      <button
        onClick={() => navigate('/cliente')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Document header */}
      <div className="mb-4">
        <h1 className="text-slate-900 text-xl font-semibold mb-1">{doc.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
            <Shield className="w-3.5 h-3.5" />
            Revisado por {doc.lawyerName}
          </span>
          <span className="text-xs text-slate-400">{doc.lawyerOAB}</span>
        </div>
      </div>

      {/* Audio player */}
      <div className="mb-4">
        <AudioPlayerBar docTitle={doc.title} />
      </div>

      {/* Risk banner */}
      <div className={`flex items-start gap-3 border rounded-xl p-4 mb-4 ${riskBanner.bg}`}>
        {riskBanner.icon}
        <p className={`text-sm leading-relaxed ${riskBanner.text}`}>{riskBanner.msg}</p>
      </div>

      {/* Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Resumo geral
        </p>
        <p className="text-slate-700 text-sm leading-relaxed">{doc.overview}</p>
        <div className="mt-3">
          <AudioButton text={doc.overview} />
        </div>
      </div>

      {/* Key deadlines highlight */}
      {doc.deadlines.filter(d => d.importance === 'high').length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-amber-800 font-semibold text-sm mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Datas que voce nao pode esquecer
          </p>
          <div className="space-y-2">
            {doc.deadlines.filter(d => d.importance === 'high').map(dl => (
              <div key={dl.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-amber-900 text-sm font-medium">
                    {new Date(dl.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-amber-700 text-xs">{dl.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answered questions */}
      {answeredQuestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
          <p className="text-blue-800 font-semibold text-sm mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Respostas do seu advogado
          </p>
          <div className="space-y-3">
            {answeredQuestions.map(cr => (
              <div key={cr.id} className="bg-white rounded-lg border border-blue-100 p-3">
                <p className="text-xs text-slate-500 mb-1">Sua duvida sobre: <strong>{cr.pointTitle}</strong></p>
                <p className="text-xs text-slate-500 mb-2 italic">"{cr.clientMessage}"</p>
                <p className="text-xs text-slate-400 font-medium mb-1">Resposta:</p>
                <p className="text-sm text-slate-700">"{cr.response}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="mb-4">
        <p className="text-slate-700 text-sm font-semibold mb-3">Pontos do contrato</p>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => setActiveCategory('todos')}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              activeCategory === 'todos'
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            Todos ({doc.keyPoints.length})
          </button>
          {categories.map(cat => {
            const cfg = categoryDisplay[cat];
            const count = doc.keyPoints.filter(kp => kp.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  activeCategory === cat
                    ? `${cfg.bgCard} ${cfg.textColor} ${cfg.borderColor}`
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {cfg.shortLabel} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Key points cards */}
      <div className="space-y-3">
        {filteredPoints.map(point => (
          <ClientKeyCard key={point.id} point={point} onRequestHelp={setHelpPoint} />
        ))}
      </div>

      {/* All deadlines */}
      <div className="mt-6">
        <p className="text-slate-700 text-sm font-semibold mb-3">Todas as datas do contrato</p>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {doc.deadlines.map((dl, i) => (
            <div key={dl.id} className={`flex items-start gap-3 p-4 ${i !== doc.deadlines.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                dl.importance === 'high' ? 'bg-red-500' : 'bg-amber-400'
              }`} />
              <div className="flex-1">
                <p className="text-slate-800 text-sm font-medium">{dl.description}</p>
                <p className={`text-xs mt-0.5 ${dl.importance === 'high' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                  {new Date(dl.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust footer */}
      <div className="mt-6 text-center text-slate-400 text-xs">
        <p className="flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          Revisado e validado por {doc.lawyerName} — {doc.lawyerOAB}
        </p>
        <p className="mt-1">Tem duvidas? Use o botao "Nao entendi" em qualquer ponto acima.</p>
      </div>

      {/* Help request modal */}
      {helpPoint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            {helpSent ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-800 font-semibold">Duvida enviada!</p>
                <p className="text-slate-500 text-sm mt-1">
                  Seu advogado vai responder em breve.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Duvida sobre:</p>
                    <p className="text-slate-800 font-semibold">{helpPoint.title}</p>
                  </div>
                  <button
                    onClick={() => setHelpPoint(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-slate-600 text-sm">{helpPoint.editedDescription ?? helpPoint.simpleDescription}</p>
                </div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  O que voce nao entendeu?
                </label>
                <textarea
                  value={helpMessage}
                  onChange={e => setHelpMessage(e.target.value)}
                  placeholder="Escreva aqui sua duvida, com suas proprias palavras..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 resize-none focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 placeholder:text-slate-400"
                  rows={3}
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSendHelp}
                    disabled={!helpMessage.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Enviar para o advogado
                  </button>
                  <button
                    onClick={() => setHelpPoint(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
