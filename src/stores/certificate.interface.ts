export interface ICertificateItem {
  title: string;
  certificater: string;
  date: string | null;
  summary: string;
  id: string;
}

export interface ICertificateStore {
  certificates: ICertificateItem[];
  add: (newEducation: ICertificateItem) => void;
  get: (index: number) => void;
  remove: (index: number) => void;
  reset: (values: ICertificateItem[]) => void;
  onmoveup: (index: number) => void;
  onmovedown: (index: number) => void;
  updateCertificate: (index: number, updatedInfo: ICertificateItem) => void;
}
