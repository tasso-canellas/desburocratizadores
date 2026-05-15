import { useState, useRef, DragEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  Upload,
  FileText,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Bot,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { LegalDocument, MOCK_DOCUMENTS } from '../../data/mockData';

type UploadStep = 'idle' | 'selected' | 'processing' | 'done';

const PROCESSING_STEPS = [
  { label: 'Lendo o documento...', duration: 1000 },
  { label: 'Identificando cláusulas e seções...', duration: 1200 },
  { label: 'Traduzindo para linguagem simples...', duration: 1500 },
  { label: 'Calculando indicadores de risco...', duration: 1000 },
  { label: 'Marcando nível de confiança por trecho...', duration: 1000 },
  { label: 'Gerando resumo visual...', duration: 800 },
  { label: 'Preparando para revisão do advogado...', duration: 600 },
];

export function LawyerUpload() {
  const navigate = useNavigate();
  const { addDocument } = useDocuments();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<UploadStep>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [processingLabel, setProcessingLabel] = useState('');
  const [newDocId] = useState(() => `doc-${Date.now()}`);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      alert('Por favor, selecione um arquivo PDF.');
      return;
    }
    setFileName(file.name);
    setStep('selected');
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleProcess = async () => {
    if (!clientName.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }
    setStep('processing');
    setProcessingStep(0);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingLabel(PROCESSING_STEPS[i].label);
      setProcessingStep(i + 1);
      await new Promise(r => setTimeout(r, PROCESSING_STEPS[i].duration));
    }

    // Create a new document based on the first mock (for demo purposes)
    const baseDoc = MOCK_DOCUMENTS[0];
    const newDoc: LegalDocument = {
      ...baseDoc,
      id: newDocId,
      title: fileName.replace('.pdf', '').replace(/_/g, ' '),
      fileName,
      clientName: clientName,
      clientEmail: clientEmail,
      uploadedAt: new Date().toISOString(),
      status: 'review',
      keyPoints: baseDoc.keyPoints.map(kp => ({ ...kp, isReviewed: false })),
      correctionRequests: [],
    };

    addDocument(newDoc);
    setStep('done');
  };

  if (step === 'processing') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-slate-800 font-semibold text-xl mb-2">IA analisando o documento</h2>
          <p className="text-slate-500 text-sm mb-8">
            Isso pode levar alguns segundos...
          </p>

          {/* Progress */}
          <div className="mb-6">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(processingStep / PROCESSING_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-blue-600 font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {processingLabel}
            </p>
          </div>

          {/* Steps log */}
          <div className="text-left space-y-2">
            {PROCESSING_STEPS.slice(0, processingStep).map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {s.label}
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="mt-8 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs">
              <strong>Lembrete:</strong> O resultado da IA deve ser cuidadosamente revisado por você antes de ser enviado ao cliente. A IA pode cometer erros em interpretação jurídica.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-slate-800 font-semibold text-xl mb-2">Análise concluída!</h2>
          <p className="text-slate-500 text-sm mb-8">
            A IA gerou um resumo com {MOCK_DOCUMENTS[0].keyPoints.length} pontos principais, indicadores de risco e citações do documento original. Agora <strong>você precisa revisar cada ponto</strong> antes de enviar ao cliente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/advogado/documento/${newDocId}`)}
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Revisar análise agora
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/advogado')}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Revisar depois
            </button>
          </div>

          <div className="mt-6 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs">
              O documento só será visível para o cliente após sua validação. Revise todos os pontos com atenção.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-slate-800 font-semibold text-xl mb-1">Novo Documento</h2>
        <p className="text-slate-500 text-sm">
          Envie um PDF para a IA analisar. Você revisará o resultado antes de enviar ao cliente.
        </p>
      </div>

      {/* AI warning */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 text-sm font-medium mb-0.5">Responsabilidade do advogado</p>
          <p className="text-amber-700 text-xs leading-relaxed">
            A IA é uma ferramenta de apoio. Todo conteúdo gerado deve ser revisado e validado por você antes de chegar ao cliente. Você é responsável pela precisão das informações enviadas.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        {/* File drop zone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Arquivo PDF</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : step === 'selected'
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {step === 'selected' ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="text-emerald-700 font-medium">{fileName}</p>
                <button
                  onClick={e => { e.stopPropagation(); setStep('idle'); setFileName(''); }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Remover arquivo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-slate-300" />
                <p className="text-slate-600 font-medium">Arraste o PDF aqui ou clique para selecionar</p>
                <p className="text-slate-400 text-xs">Somente arquivos .PDF</p>
              </div>
            )}
          </div>
        </div>

        {/* Client info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nome do Cliente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="Ex: Maria Silva"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email do Cliente</label>
            <input
              type="email"
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              placeholder="Ex: maria@email.com"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* What will happen */}
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-slate-600 text-xs font-medium mb-2">O que a IA vai fazer:</p>
          <ul className="space-y-1">
            {[
              'Identificar cláusulas de pagamento, obrigações, multas e direitos',
              'Traduzir para linguagem simples com exemplos práticos',
              'Indicar o nível de confiança para cada ponto',
              'Citar a fonte exata no documento original',
              'Destacar prazos importantes e alertas de risco',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleProcess}
          disabled={step !== 'selected'}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          Processar com IA
        </button>
      </div>
    </div>
  );
}
