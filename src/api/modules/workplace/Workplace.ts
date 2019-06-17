export default interface IWorkplace {
  id: string;
  isCurrent?: string;
  workbookId: string;
  startDate: string;
  endDate?: string;
  company: string;
  country: string;
  city: string;
}
