import { Tab, Tabs, TabList } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./styles.scss";
import { ReactNode, useState } from 'react';

type TabSwitcherProp = { 
  titles: string[];
  activeTab?: string | null;
  onTabChange: (tabTitle: string)=> void;
  children: ReactNode;
}

const TabSwitcher = (props: TabSwitcherProp) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <Tabs 
      defaultFocus
      onSelect={(index)=> {
        props.onTabChange(props.titles[index]);
        setActiveTabIndex(index);
      }}
      selectedIndex={props?.activeTab?
        props.titles.findIndex(title=> title.toLowerCase() === props.activeTab?.toLowerCase())
        : activeTabIndex
      }
    >
      <TabList>
      {
        props.titles.map((item, index)=> {
          return (
            <Tab 
              key={index}
            >
              {item}
            </Tab>
          )
        })
      }
      </TabList>
      {props.children}
    </Tabs>
  );
}

export default TabSwitcher;