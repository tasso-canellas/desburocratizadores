import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Send,
  Shield,
  Clock,
  MessageCircle,
  Info,
  X,
  Save,
  FileText,
  TrendingUp,
  DollarSign,
  ClipboardList,
  Ban,
  Wrench,
  Calendar,
  Pencil,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { Category, Confidence, KeyPoint, RiskLevel } from '../../data/mockData';
import { DocumentChatbot } from './DocumentChatbot';

const categoryConfig: Record<Category, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  pagamento: {
    icon: <DollarSign className="w-4 h-4" />,
    label: 'Pagamento',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  obrigacao: {
    icon: <ClipboardList className="w-4 h-4" />,
    label: 'Obrigação',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
  },
  multa: {
    icon: <Ban className="w-4 h-4" />,
    label: 'Multa / Penalidade',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
  },
  direito: {
    icon: <Shield className="w-4 h-4" />,
    label: 'Direito do Cliente',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  prazo: {
    icon: <Calendar className="w-4 h-4" />,
    label: 'Prazo',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  modificavel: {
    icon: <Wrench className="w-4 h-4" />,
    label: 'Pode ser negociado',
    color: 'text-slate-700',
    bg: 'bg-slate-50 border-slate-200',
  },
};

const confidenceConfig: Record<Confidence, { label: string; color: string; bar: string; icon: React.ReactNode }> = {
  alta: {
    label: 'Confiança Alta',
    color: 'text-emerald-700 bg-emerald-50',
    bar: 'bg-emerald-500',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  media: {
    label: 'Confiança Média',
    color: 'text-amber-700 bg-amber-50',
    bar: 'bg-amber-500',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  baixa: {
    label: 'Confiança Baixa — Revise com atenção',
    color: 'text-red-700 bg-red-50',
    bar: 'bg-red-500',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
};

const riskColors: Record<RiskLevel, string> = {
  alto: 'text-red-700 bg-red-50 border-red-200',
  medio: 'text-amber-700 bg-amber-50 border-amber-200',
  baixo: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

type Tab = 'pontos' | 'prazos' | 'riscos' | 'solicitacoes';

interface EditState {
  pointId: string;
  text: string;
}

function ConfidenceBar({ score, confidence }: { score: number; confidence: Confidence }) {
  const cfg = confidenceConfig[confidence];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${cfg.bar} rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-slate-500">{score}%</span>
    </div>
  );
}

function KeyPointCard({
  point,
  onReview,
  onEdit,
  onDelete,
}: {
  point: KeyPoint;
  onReview: () => void;
  onEdit: (id: string, text: string) => void;
  onDelete: () => void;
}) {
  const [showSource, setShowSource] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(point.editedDescription ?? point.simpleDescription);
  const cat = categoryConfig[point.category];
  const conf = confidenceConfig[point.confidence];
  const displayText = point.editedDescription ?? point.simpleDescription;

  const handleSaveEdit = () => {
    onEdit(point.id, editText);
    setIsEditing(false);
  };

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        point.isReviewed ? 'bg-white border-emerald-200' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border font-medium flex-shrink-0 ${cat.bg} ${cat.color}`}>
            {cat.icon}
            {cat.label}
          </div>
          {point.isReviewed && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-medium">
              <CheckCircle className="w-3 h-3" />
              Revisado
            </span>
          )}
          {point.editedDescription && (
            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 font-medium">
              <Pencil className="w-3 h-3" />
              Editado
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar descrição"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remover ponto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="text-slate-800 font-medium text-sm mb-2">{point.title}</p>

      {/* Description / Edit area */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            className="w-full text-sm text-slate-700 bg-slate-50 border border-blue-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className="flex items-center gap-1.5 text-xs bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar correção
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditText(point.editedDescription ?? point.simpleDescription); }}
              className="flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-600 text-sm leading-relaxed mb-3">{displayText}</p>
      )}

      {/* Confidence */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${conf.color}`}>
            {conf.icon}
            {conf.label}
          </span>
        </div>
        <ConfidenceBar score={point.confidenceScore} confidence={point.confidence} />
        {point.confidenceNote && (
          <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs leading-relaxed">{point.confidenceNote}</p>
          </div>
        )}
      </div>

      {/* Source citation */}
      <button
        onClick={() => setShowSource(!showSource)}
        className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors mb-2"
      >
        <FileText className="w-3.5 h-3.5" />
        Fonte: Página {point.page} — {point.section}
        {showSource ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {showSource && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-medium">Texto Original:</p>
          <p className="text-xs text-slate-600 leading-relaxed italic">"{point.legalText}"</p>
        </div>
      )}

      {/* Mark as reviewed */}
      {!point.isReviewed && (
        <button
          onClick={onReview}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 py-2 rounded-lg font-medium transition-colors mt-1"
        >
          <Eye className="w-4 h-4" />
          Marcar como revisado
        </button>
      )}
    </div>
  );
}

export function LawyerDocumentReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, markPointReviewed, updateKeyPoint, sendDocument, resolveCorrectionRequest } = useDocuments();
  const [activeTab, setActiveTab] = useState<Tab>('pontos');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<Record<string, string>>({});

  const doc = documents.find(d => d.id === id);

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <FileText className="w-12 h-12 mb-3 opacity-40" />
        <p>Documento não encontrado</p>
        <button onClick={() => navigate('/advogado')} className="mt-4 text-blue-600 text-sm">
          Voltar ao painel
        </button>
      </div>
    );
  }

  const reviewedCount = doc.keyPoints.filter(kp => kp.isReviewed).length;
  const totalPoints = doc.keyPoints.length;
  const allReviewed = reviewedCount === totalPoints;
  const pendingRequests = doc.correctionRequests.filter(cr => !cr.resolved);
  const hasLowConfidence = doc.keyPoints.some(kp => kp.confidence === 'baixa');

  const handleDeletePoint = (pointId: string) => {
    updateKeyPoint(doc.id, pointId, { isReviewed: true, editedDescription: '[PONTO REMOVIDO PELO ADVOGADO]' });
    setShowDeleteConfirm(null);
  };

  const handleSend = () => {
    sendDocument(doc.id);
    setShowSendModal(false);
    navigate('/advogado');
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'pontos', label: `Pontos Principais (${totalPoints})` },
    { id: 'prazos', label: `Prazos (${doc.deadlines.length})` },
    { id: 'riscos', label: `Riscos (${doc.risks.length})` },
    { id: 'solicitacoes', label: `Dúvidas (${doc.correctionRequests.length})`, count: pendingRequests.length },
  ];

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden -mx-0">
      {/* ===== LEFT: AI Chatbot ===== */}
      <div className="w-[360px] flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden">
        <DocumentChatbot doc={doc} />
      </div>

      {/* ===== RIGHT: Document Review ===== */}
      <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-5 py-6">
      {/* Back */}
      <button
        onClick={() => navigate('/advogado')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Document header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-slate-900 text-lg font-semibold">{doc.title}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${riskColors[doc.overallRisk]}`}>
                Risco {doc.overallRisk.charAt(0).toUpperCase() + doc.overallRisk.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span>Cliente: <strong className="text-slate-700">{doc.clientName}</strong></span>
              <span>·</span>
              <span>Enviado em {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</span>
              <span>·</span>
              <span>{doc.fileName}</span>
            </div>
          </div>
          {doc.status === 'sent' && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium flex-shrink-0">
              <Send className="w-3.5 h-3.5" />
              Enviado ao cliente
            </span>
          )}
        </div>

        {/* Overview */}
        <div className="mt-4 bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Resumo gerado pela IA</p>
          <p className="text-sm text-slate-600 leading-relaxed">{doc.overview}</p>
        </div>

        {/* Review progress */}
        {doc.status === 'review' && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500">Progresso de revisão</span>
              <span className={`font-medium ${allReviewed ? 'text-emerald-600' : 'text-slate-600'}`}>
                {reviewedCount}/{totalPoints} pontos revisados
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${allReviewed ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${(reviewedCount / totalPoints) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* AI warning banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-700 text-xs leading-relaxed">
          <strong>Revise cada ponto cuidadosamente.</strong> Você pode editar a linguagem, remover pontos incorretos ou adicionar notas. O cliente só verá este documento após você enviar.
          {hasLowConfidence && (
            <span className="block mt-1 text-red-600 font-medium">
              ⚠ Atenção: existem pontos com confiança baixa que requerem revisão especial.
            </span>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'pontos' && (
        <div className="space-y-3">
          {doc.keyPoints.map(point => (
            <KeyPointCard
              key={point.id}
              point={point}
              onReview={() => markPointReviewed(doc.id, point.id)}
              onEdit={(_, text) => updateKeyPoint(doc.id, point.id, { editedDescription: text, isReviewed: true })}
              onDelete={() => setShowDeleteConfirm(point.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'prazos' && (
        <div className="space-y-3">
          {doc.deadlines.map(dl => (
            <div key={dl.id} className={`bg-white border rounded-xl p-4 flex items-start gap-3 ${
              dl.importance === 'high' ? 'border-red-200' : 'border-slate-200'
            }`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                dl.importance === 'high' ? 'bg-red-50' : 'bg-amber-50'
              }`}>
                <Clock className={`w-5 h-5 ${dl.importance === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
              </div>
              <div>
                <p className="text-slate-800 text-sm font-medium">{dl.description}</p>
                <p className={`text-xs font-semibold mt-0.5 ${
                  dl.importance === 'high' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {new Date(dl.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {dl.importance === 'high' && (
                <span className="ml-auto text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  Urgente
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'riscos' && (
        <div className="space-y-3">
          {doc.risks.map(risk => (
            <div key={risk.id} className={`bg-white border rounded-xl p-4 ${riskColors[risk.level]}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  risk.level === 'alto' ? 'bg-red-100' : risk.level === 'medio' ? 'bg-amber-100' : 'bg-emerald-100'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    risk.level === 'alto' ? 'text-red-600' : risk.level === 'medio' ? 'text-amber-600' : 'text-emerald-600'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{risk.title}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full border font-medium capitalize">
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">{risk.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'solicitacoes' && (
        <div className="space-y-3">
          {doc.correctionRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma dúvida enviada pelo cliente</p>
            </div>
          ) : (
            doc.correctionRequests.map(req => (
              <div key={req.id} className={`bg-white border rounded-xl p-4 ${req.resolved ? 'border-emerald-200' : 'border-orange-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Dúvida sobre: <strong className="text-slate-700">{req.pointTitle}</strong>
                    </p>
                    <p className="text-xs text-slate-400">{new Date(req.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {req.resolved ? (
                    <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">Respondida</span>
                  ) : (
                    <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-medium">Pendente</span>
                  )}
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3">
                  <p className="text-xs text-slate-500 mb-1 font-medium">Mensagem do cliente:</p>
                  <p className="text-sm text-slate-700">"{req.clientMessage}"</p>
                </div>
                {!req.resolved && (
                  <div>
                    <textarea
                      placeholder="Digite sua resposta para o cliente..."
                      value={responseText[req.id] || ''}
                      onChange={e => setResponseText(prev => ({ ...prev, [req.id]: e.target.value }))}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      rows={2}
                    />
                    <button
                      onClick={() => {
                        resolveCorrectionRequest(doc.id, req.id, responseText[req.id] || '');
                        setResponseText(prev => ({ ...prev, [req.id]: '' }));
                      }}
                      disabled={!responseText[req.id]?.trim()}
                      className="mt-2 text-xs bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Enviar resposta
                    </button>
                  </div>
                )}
                {req.resolved && req.response && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1 font-medium">Sua resposta:</p>
                    <p className="text-sm text-slate-700">"{req.response}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom bar */}
      {doc.status !== 'sent' && (
        <div className="sticky bottom-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-700 text-sm font-medium">
                {allReviewed ? 'Todos os pontos revisados ✓' : `${reviewedCount} de ${totalPoints} pontos revisados`}
              </p>
              <p className="text-slate-400 text-xs">
                {allReviewed ? 'Você pode enviar ao cliente.' : 'Revise todos os pontos antes de enviar.'}
              </p>
            </div>
            <button
              onClick={() => setShowSendModal(true)}
              disabled={!allReviewed}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              Enviar ao Cliente
            </button>
          </div>
        </div>
      )}
      </div>{/* end max-w-3xl */}
      </div>{/* end right scroll panel */}

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-slate-800 font-semibold mb-2">Remover este ponto?</h3>
            <p className="text-slate-500 text-sm mb-5">
              Este ponto não será exibido ao cliente. Você pode adicionar uma nota sobre a remoção.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeletePoint(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                Remover
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send confirmation modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-slate-800 font-semibold text-lg mb-2">Confirmar envio ao cliente</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
              Você está prestes a enviar este resumo para <strong>{doc.clientName}</strong>. Ao confirmar, você declara que:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                'Revisou todos os pontos gerados pela IA',
                'As informações estão corretas e adequadas ao cliente',
                'Assume responsabilidade pelo conteúdo enviado',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs">
                A IA é apenas uma ferramenta. Você, Dr. {doc.lawyerName.replace('Dr. ', '')}, é o responsável pela interpretação jurídica enviada ao cliente.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSend}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-medium text-sm transition-colors"
              >
                Confirmar e Enviar
              </button>
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}