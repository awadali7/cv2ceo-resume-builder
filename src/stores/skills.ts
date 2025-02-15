import { create } from "zustand";
import { GetState, SetState } from "./store.interface";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { ISkillItem, ISkillState } from "./skill.interface";
import resumeData from "@/helpers/constants/resume-data.json";

const addSkill =
  (set: SetState<ISkillState>) =>
  ({ name, level }: ISkillItem) =>
    set(
      produce((state: ISkillState) => {
        state.values.push({ name, level });
      }),
    );

const removeSkill = (set: SetState<ISkillState>) => (index: number) =>
  set(
    produce((state: ISkillState) => {
      state.values.splice(index, 1);
    }),
  );

const editSkill =
  (set: SetState<ISkillState>) =>
  ({ name, level, index }: { name: string; level: number; index: number }) =>
    set(
      produce((state: ISkillState) => {
        state.values[index] = { name, level: level };
      }),
    );

const setSkills = (set: SetState<ISkillState>) => (values: ISkillItem[]) =>
  set(() => ({ values }));

const getSkills = (get: GetState<ISkillState>) => () =>
  get().isEnabled ? get().values : [];

const setIsEnabled = (set: SetState<ISkillState>) => (isEnabled: boolean) =>
  set(() => ({ isEnabled }));

const getMethods = (
  set: SetState<ISkillState>,
  get: GetState<ISkillState>,
) => ({
  get: getSkills(get),
  add: addSkill(set),
  remove: removeSkill(set),
  edit: editSkill(set),
  reset: setSkills(set),
  setIsEnabled: setIsEnabled(set),
});

export const useLanguages = create<ISkillState>()(
  persist(
    (set, get) => ({
      title: "Languages",
      hasLevel: true,
      values: resumeData.skills.languages,
      isEnabled: true,

      ...getMethods(set, get),
    }),
    { name: "languages" },
  ),
);

export const useTechnicalSkills = create<ISkillState>()(
  persist(
    (set, get) => ({
      title: "Technical Skills",
      hasLevel: true,
      values: resumeData.skills.technicalSkills,
      isEnabled: true,

      ...getMethods(set, get),
    }),
    { name: "technicalSkills" },
  ),
);

export const useSoftSkills = create<ISkillState>()(
  persist(
    (set, get) => ({
      title: "Soft Skills",
      hasLevel: false,
      values: resumeData.skills.softSkills,
      isEnabled: true,

      ...getMethods(set, get),
    }),
    { name: "softSkills" },
  ),
);
