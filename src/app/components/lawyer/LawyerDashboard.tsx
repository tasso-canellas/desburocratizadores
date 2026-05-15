import { useNavigate } from 'react-router';
import {
  FileText,
  Upload,
  Clock,
  CheckCircle,
  Send,
  AlertTriangle,
  Eye,
  Users,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { DocumentStatus, RiskLevel } from '../../data/mockData';

const statusConfig: Record<DocumentStatus, { label: string; color: string; icon: React.ReactNode }> = {
  processing: {
    label: 'Processando',
    color: 'bg-slate-100 text-slate-600',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  review: {
    label: 'Aguardando revisão',
    color: 'bg-amber-100 text-amber-700',
    icon: <Eye className="w-3.5 h-3.5" />,
  },
  validated: {
    label: 'Validado',
    color: 'bg-blue-100 text-blue-700',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  sent: {
    label: 'Enviado ao cliente',
    color: 'bg-emerald-100 text-emerald-700',
    icon: <Send className="w-3.5 h-3.5" />,
  },
};

const riskConfig: Record<RiskLevel, { label: string; color: string }> = {
  alto: { label: 'Risco Alto', color: 'text-red-600 bg-red-50 border-red-200' },
  medio: { label: 'Risco Médio', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  baixo: { label: 'Risco Baixo', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
};

export function LawyerDashboard() {
  const navigate = useNavigate();
  const { documents } = useDocuments();

  const reviewCount = documents.filter(d => d.status === 'review').length;
  const sentCount = documents.filter(d => d.status === 'sent').length;
  const totalCorrections = documents.reduce((acc, d) => acc + d.correctionRequests.filter(cr => !cr.resolved).length, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <FileText className="w-5 h-5 text-blue-600" />, value: documents.length, label: 'Total de documentos', bg: 'bg-blue-50' },
          { icon: <Eye className="w-5 h-5 text-amber-600" />, value: reviewCount, label: 'Aguardando revisão', bg: 'bg-amber-50' },
          { icon: <Users className="w-5 h-5 text-emerald-600" />, value: sentCount, label: 'Enviados a clientes', bg: 'bg-emerald-50' },
          { icon: <MessageCircle className="w-5 h-5 text-orange-600" />, value: totalCorrections, label: 'Dúvidas pendentes', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl text-slate-900 font-semibold">{stat.value}</p>
              <p className="text-slate-500 text-xs">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-800 font-semibold">Documentos</h2>
        <button
          onClick={() => navigate('/advogado/upload')}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          Novo Documento
        </button>
      </div>

      {/* Alert for pending reviews */}
      {reviewCount > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm font-medium">
              {reviewCount} documento{reviewCount > 1 ? 's' : ''} aguardando sua revisão
            </p>
            <p className="text-amber-700 text-xs mt-0.5">
              Revise e valide antes de enviar ao cliente. Você é responsável pela precisão do conteúdo.
            </p>
          </div>
        </div>
      )}

      {/* Documents list */}
      <div className="space-y-3">
        {documents.map(doc => {
          const status = statusConfig[doc.status];
          const risk = riskConfig[doc.overallRisk];
          const pendingRequests = doc.correctionRequests.filter(cr => !cr.resolved).length;
          const reviewedPoints = doc.keyPoints.filter(kp => kp.isReviewed).length;
          const totalPoints = doc.keyPoints.length;

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => navigate(`/advogado/documento/${doc.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-slate-900 font-medium text-sm">{doc.title}</h3>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.color} font-medium`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span>Cliente: <strong className="text-slate-700">{doc.clientName}</strong></span>
                      <span>·</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</span>
                      <span>·</span>
                      <span>{doc.fileName}</span>
                    </div>

                    {/* Progress bar for review */}
                    {doc.status === 'review' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Pontos revisados</span>
                          <span>{reviewedPoints}/{totalPoints}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${(reviewedPoints / totalPoints) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${risk.color}`}>
                    {risk.label}
                  </span>
                  {pendingRequests > 0 && (
                    <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                      <MessageCircle className="w-3 h-3" />
                      {pendingRequests} dúvida{pendingRequests > 1 ? 's' : ''}
                    </span>
                  )}
                  <TrendingUp className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum documento ainda</p>
          <p className="text-sm mt-1">Clique em "Novo Documento" para começar</p>
        </div>
      )}
    </div>
  );
}
