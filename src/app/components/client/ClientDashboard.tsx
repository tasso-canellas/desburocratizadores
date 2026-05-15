import { useNavigate } from 'react-router';
import { FileText, CheckCircle, Clock, ChevronRight, Shield, AlertTriangle, MessageCircle } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { RiskLevel } from '../../data/mockData';

const riskEmoji: Record<RiskLevel, { emoji: string; label: string; color: string }> = {
  alto: { emoji: '🔴', label: 'Atenção alta', color: 'text-red-600 bg-red-50 border-red-200' },
  medio: { emoji: '🟡', label: 'Atenção média', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  baixo: { emoji: '🟢', label: 'Sem problemas graves', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
};

export function ClientDashboard() {
  const navigate = useNavigate();
  const { documents } = useDocuments();

  // Only show documents that are sent
  const clientDocs = documents.filter(d => d.status === 'sent' && d.clientName === 'Maria Silva');
  const pendingAnswers = clientDocs.reduce(
    (acc, doc) => acc + doc.correctionRequests.filter(cr => cr.resolved).length,
    0
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-slate-900 text-xl font-semibold mb-1">Olá, Maria! 👋</h1>
        <p className="text-slate-500 text-sm">
          Aqui estão seus documentos, explicados de forma simples pelo seu advogado.
        </p>
      </div>

      {/* Validated badge */}
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-800 text-sm font-medium">Documentos revisados por advogado</p>
          <p className="text-emerald-700 text-xs mt-0.5">
            Todos os resumos abaixo foram verificados e aprovados pelo seu advogado antes de chegarem até você.
          </p>
        </div>
      </div>

      {/* Answered questions */}
      {pendingAnswers > 0 && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-800 text-sm font-medium">Seu advogado respondeu suas dúvidas!</p>
            <p className="text-blue-700 text-xs mt-0.5">
              Abra o documento para ver as respostas.
            </p>
          </div>
        </div>
      )}

      {/* Documents */}
      <h2 className="text-slate-700 text-sm font-semibold mb-3 uppercase tracking-wide">
        Meus documentos ({clientDocs.length})
      </h2>

      {clientDocs.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-slate-500">Nenhum documento disponível ainda</p>
          <p className="text-sm mt-1">Seu advogado está preparando o resumo para você.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clientDocs.map(doc => {
            const risk = riskEmoji[doc.overallRisk];
            const myQuestions = doc.correctionRequests.filter(cr => !cr.resolved).length;
            const answeredQuestions = doc.correctionRequests.filter(cr => cr.resolved).length;

            return (
              <button
                key={doc.id}
                onClick={() => navigate(`/cliente/documento/${doc.id}`)}
                className="w-full flex items-start gap-4 bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm rounded-2xl p-5 text-left transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 font-semibold text-sm mb-1">{doc.title}</p>
                  <p className="text-slate-500 text-xs mb-2">
                    Enviado por {doc.lawyerName} · {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${risk.color}`}>
                      {risk.emoji} {risk.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Validado
                    </span>
                    {myQuestions > 0 && (
                      <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                        <MessageCircle className="w-3 h-3" />
                        {myQuestions} dúvida{myQuestions > 1 ? 's' : ''}
                      </span>
                    )}
                    {answeredQuestions > 0 && (
                      <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                        Respondido ✓
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0 self-center" />
              </button>
            );
          })}
        </div>
      )}

      {/* Help text */}
      <div className="mt-8 text-center text-slate-400 text-xs">
        <p>Tem dúvidas sobre um documento?</p>
        <p>Clique no documento e use o botão "Não entendi" em qualquer ponto.</p>
      </div>
    </div>
  );
}
