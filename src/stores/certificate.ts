import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import resumeData from "@/helpers/constants/resume-data.json";
import { ICertificateItem, ICertificateStore } from "./certificate.interface";
import { GetState, SetState } from "./store.interface";

const addCertificate =
  (set: SetState<ICertificateStore>) =>
  ({ title, certificater, date, summary, id }: ICertificateItem) =>
    set(
      produce((state: ICertificateStore) => {
        state.certificates.push({
          title,
          certificater,
          date,
          summary,
          id,
        });
      }),
    );

const removeCertificate =
  (set: SetState<ICertificateStore>) => (index: number) =>
    set((state) => ({
      certificates: state.certificates
        .slice(0, index)
        .concat(state.certificates.slice(index + 1)),
    }));

const setAllCertificate =
  (set: SetState<ICertificateStore>) => (values: ICertificateItem[]) => {
    set({
      certificates: values,
    });
  };

const getAllCertificate =
  (get: GetState<ICertificateStore>) => (index: number) => {
    return get().certificates[index];
  };

const onMoveUp = (set: SetState<ICertificateStore>) => (index: number) => {
  set(
    produce((state: ICertificateStore) => {
      if (index > 0) {
        const currentCertificate = state.certificates[index];
        state.certificates[index] = state.certificates[index - 1];
        state.certificates[index - 1] = currentCertificate;
      }
    }),
  );
};
const onMoveDown = (set: SetState<ICertificateStore>) => (index: number) => {
  set(
    produce((state: ICertificateStore) => {
      const totalExp = state.certificates.length;
      if (index < totalExp - 1) {
        const currentCertificate = state.certificates[index];
        state.certificates[index] = state.certificates[index + 1];
        state.certificates[index + 1] = currentCertificate;
      }
    }),
  );
};

const updateCertificate =
  (set: SetState<ICertificateStore>) =>
  (index: number, updatedInfo: ICertificateItem) => {
    set(
      produce((state: ICertificateStore) => {
        state.certificates[index] = updatedInfo;
      }),
    );
  };

export const useCertificates = create<ICertificateStore>()(
  persist(
    (set, get) => ({
      certificates: resumeData.certificates,
      add: addCertificate(set),
      get: getAllCertificate(get),
      remove: removeCertificate(set),
      reset: setAllCertificate(set),
      onmoveup: onMoveUp(set),
      onmovedown: onMoveDown(set),
      updateCertificate: updateCertificate(set),
    }),
    { name: "certificates" },
  ),
);
