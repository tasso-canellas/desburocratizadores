import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LegalDocument, MOCK_DOCUMENTS, KeyPoint, CorrectionRequest } from '../data/mockData';

interface DocumentContextType {
  documents: LegalDocument[];
  updateKeyPoint: (docId: string, pointId: string, updatedFields: Partial<KeyPoint>) => void;
  markPointReviewed: (docId: string, pointId: string) => void;
  sendDocument: (docId: string) => void;
  addDocument: (doc: LegalDocument) => void;
  addCorrectionRequest: (docId: string, req: CorrectionRequest) => void;
  resolveCorrectionRequest: (docId: string, reqId: string, response: string) => void;
}

const DocumentContext = createContext<DocumentContextType | null>(null);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<LegalDocument[]>(MOCK_DOCUMENTS);

  const updateKeyPoint = (docId: string, pointId: string, updatedFields: Partial<KeyPoint>) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              keyPoints: doc.keyPoints.map(kp =>
                kp.id === pointId ? { ...kp, ...updatedFields } : kp
              ),
            }
          : doc
      )
    );
  };

  const markPointReviewed = (docId: string, pointId: string) => {
    updateKeyPoint(docId, pointId, { isReviewed: true });
  };

  const sendDocument = (docId: string) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === docId ? { ...doc, status: 'sent' } : doc))
    );
  };

  const addDocument = (doc: LegalDocument) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const addCorrectionRequest = (docId: string, req: CorrectionRequest) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, correctionRequests: [...doc.correctionRequests, req] }
          : doc
      )
    );
  };

  const resolveCorrectionRequest = (docId: string, reqId: string, response: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              correctionRequests: doc.correctionRequests.map(cr =>
                cr.id === reqId ? { ...cr, resolved: true, response } : cr
              ),
            }
          : doc
      )
    );
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        updateKeyPoint,
        markPointReviewed,
        sendDocument,
        addDocument,
        addCorrectionRequest,
        resolveCorrectionRequest,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocuments must be used within DocumentProvider');
  return ctx;
}
