export interface ISidebarTab {
  id : string;
  title: string;
  widget?: () => Promise<any>;
  icon: string;
  tooltipMessage: string;
  border: boolean;
}
