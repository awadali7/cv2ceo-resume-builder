export interface ISkillItem {
  name: string;
  level: number;
}

export interface ISkillState {
  title: string;
  hasLevel: boolean;
  values: ISkillItem[];
  isEnabled: boolean;

  add: ({ name, level }: { name: string; level: number }) => void;
  edit: ({
    name,
    level,
    index,
  }: {
    name: string;
    level: number;
    index: number;
  }) => void;
  remove: (index: number) => void;
  get: () => void;
  reset: (name: ISkillItem[]) => void;
  setIsEnabled: (enabled: boolean) => void;
}
