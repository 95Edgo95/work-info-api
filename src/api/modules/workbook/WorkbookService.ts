import { NOT_FOUND, NOT_UNIQUE } from "../../../configs/response-messages";
import WorkplaceService from "../workplace/WorkplaceService";
import RequestService from "../../services/RequestService";
import ValidationError from "../../errors/ValidationError";
import UniqueService from "../../services/UniqueService";
import NotFound from "../../errors/NotFound";
import ids from "../../../configs/ids";
import IWorkbook from "./Workbook";

class WorkbookService extends RequestService {
  constructor() {
    super();

    this.myJsonId = ids.workbookService;
  }

  async find(filters, { limit, offset }) {
    const workbooksIds: any = await this.get();

    const workbooks: IWorkbook[] = await Promise.all<IWorkbook>(
      workbooksIds.map(workbookId => this.get({}, workbookId)),
    );

    const filterArray = Object.keys(filters);

    let filteredWorkbooks = workbooks.filter((workbook) => {
      let i = 0;

      for (; i < filterArray.length; i++) {
        const filterKey = filterArray[i];

        if (workbook[filterKey] && filters[filterKey] && workbook[filterKey] !== filters[filterKey]) {
          break;
        }
      }

      return i === filterArray.length;
    });

    if (Array.isArray(filteredWorkbooks)) {
      filteredWorkbooks = filteredWorkbooks.slice(offset, offset + limit);
    }

    return {
      workbooks: filteredWorkbooks || undefined,
      count: workbooksIds.length,
    };
  }

  async findById(id: string): Promise<IWorkbook> {
    let workbook: IWorkbook;

    try {
      workbook = await this.get({}, id);
    } catch (e) {
      if (e.message === "Request failed with status code 404") {
        throw new NotFound(NOT_FOUND("Workbook"));
      } else {
        throw e;
      }
    }

    if (Array.isArray(workbook) && workbook[0] === "got down by Bestos") {
      throw new NotFound(NOT_FOUND("Workbook"));
    }

    return workbook;
  }

  async create({ firstName, lastName, email, passport, birthDate }): Promise<IWorkbook> {
    let workbook: IWorkbook | undefined;

    await UniqueService.init();

    if (!UniqueService.isUnique("email", email)) {
      throw new ValidationError({ email: NOT_UNIQUE("Email") });
    }

    if (!UniqueService.isUnique("passport", passport)) {
      throw new ValidationError({ passport: NOT_UNIQUE("Passport") });
    }

    const { uri } = await this.post({ data: {} }, "");

    workbook = {
      firstName,
      lastName,
      email,
      passport,
      birthDate,
      id: uri.split("/").pop(),
      workplacesIds: [],
      currentWorkplaceId: null,
    };

    let [,, workbooksIds] = await Promise.all([
      this.put({ data: workbook }, workbook.id),
      UniqueService.saveUniqueValues({ email, passport }),
      this.get()
    ]);

    workbooksIds.push(workbook.id);

    await this.put({ data: workbooksIds });

    return workbook;
  }

  async update(workbook, id?: string) {
    const workbookId = id || workbook.id;
    let oldWorkbook: IWorkbook;

    try {
      oldWorkbook = await this.findById(workbookId);
    } catch (e) {
      if (e.message === "Request failed with status code 404") {
        throw new NotFound(NOT_FOUND("Workbook"));
      } else {
        throw e;
      }
    }

    await UniqueService.init();

    const newWorkbook = await this.put({ data: { ...oldWorkbook, ...workbook } }, workbookId);
    const promises = [];

    if (oldWorkbook.passport !== newWorkbook.passport) {
      promises.push(UniqueService.updateUniqueValue("passport", oldWorkbook.passport, newWorkbook.passport));
    }

    if (oldWorkbook.email !== newWorkbook.email) {
      promises.push(UniqueService.updateUniqueValue("email", oldWorkbook.email, newWorkbook.email));
    }

    await Promise.all(promises);

    return newWorkbook;
  }

  async delete(id) {
    const workbook: IWorkbook = await this.findById(id);
    let workbooksIds = await this.get();

    await UniqueService.init();

    workbooksIds = workbooksIds.filter(workbookId => workbookId !== id);

    await Promise.all([
      this.put({ data: workbooksIds }),
      UniqueService.deleteUniqueValues(workbook)
    ]);

    return WorkplaceService.delete(undefined, workbook.workplacesIds, workbook.id);
  }
}

export default new WorkbookService();
