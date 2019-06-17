export default interface IWorkbook {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passport: string;
  birthDate: string;
  currentWorkplaceId: string;
  workplacesIds: string[];
}
