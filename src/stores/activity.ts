import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import resumeData from "@/helpers/constants/resume-data.json";
import { IActivityStore, IActivity } from "./activity.interface";
import { SetState } from "./store.interface";

const setAllcertificates =
  (set: SetState<IActivityStore>) => (activityItem: IActivity) => {
    set({
      activities: activityItem,
    });
  };

const updateAchievements =
  (set: SetState<IActivityStore>) => (achievements: string) => {
    set(
      produce((state: IActivityStore) => {
        state.activities.achievements = achievements;
      }),
    );
  };

const updateInvolvements =
  (set: SetState<IActivityStore>) => (involvements: string) => {
    set(
      produce((state: IActivityStore) => {
        state.activities.involvements = involvements;
      }),
    );
  };

export const useActivity = create<IActivityStore>()(
  persist(
    (set, get) => ({
      activities: resumeData.activities,

      get: () => get().activities,
      reset: setAllcertificates(set),
      updateAchievements: updateAchievements(set),
      updateInvolvements: updateInvolvements(set),
    }),
    { name: "activities" },
  ),
);
