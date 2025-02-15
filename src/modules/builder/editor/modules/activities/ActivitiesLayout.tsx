import { Fragment } from "react";
import BasicPanel from "./components/BasicPanel";
import Achievements from "./components/Achievements";

export interface IActivityTab {
  key: string;
  label: string;
  component: () => JSX.Element;
}

export interface IAllActivityTabs {
  [key: string]: IActivityTab;
}

const allActivityTabs: IAllActivityTabs = {
  achievements: {
    key: "achievements",
    label: "Achievements",
    component: Achievements,
  },
};

const ActivitiesLayout = () => {
  const activeTab = allActivityTabs["achievements"];

  return (
    <Fragment>
      <BasicPanel activeTab={activeTab} />
    </Fragment>
  );
};

export default ActivitiesLayout;
