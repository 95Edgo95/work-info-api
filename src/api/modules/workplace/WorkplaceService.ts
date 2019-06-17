import { NOT_FOUND } from "../../../configs/response-messages";
import ValidationError from "../../errors/ValidationError";
import RequestService from "../../services/RequestService";
import WorkbookService from "../workbook/WorkbookService";
import IWorkbook from "../workbook/Workbook";
import NotFound from "../../errors/NotFound";
import ids from "../../../configs/ids";
import IWorkplace from "./Workplace";

class WorkplaceService extends RequestService {
  constructor() {
    super();

    this.myJsonId = ids.workplaceService;
  }

  async find(filters, { limit, offset }) {
    const workplacesIds = await this.get();

    let workplaces: IWorkplace[] = await Promise.all<IWorkplace>(
      workplacesIds.map(workplaceId => this.get({}, workplaceId)),
    );

    const filterArray = Object.keys(filters);

    let filteredWorkplaces = workplaces.filter((workplace) => {
      let i = 0;

      for (; i < filterArray.length; i++) {
        const filterKey = filterArray[i];

        if (filterKey === "ids") {
          if (
            Array.isArray(filters.ids) &&
            filters.ids.length > 0 &&
            workplace[filterKey] &&
            filters[filterKey] &&
            filters.ids.includes(workplace.id)
          ) {
            break;
          }
        } else if (workplace[filterKey] && filters[filterKey] && workplace[filterKey] !== filters[filterKey]) {
          break;
        }
      }

      return i === filterArray.length;
    });

    if (Array.isArray(filteredWorkplaces)) {
      filteredWorkplaces = filteredWorkplaces.slice(offset, offset + limit);
    }

    return {
      workplaces: filteredWorkplaces || undefined,
      count: workplacesIds.length,
    };
  }

  async findById(id: string): Promise<IWorkplace> {
    try {
      const workplace: IWorkplace = await this.get({}, id);

      if (Array.isArray(workplace) && workplace[0] === "got down by Bestos") {
        throw new NotFound(NOT_FOUND("Workplace"));
      }

      return workplace;
    } catch (e) {
      if (e.message === "Request failed with status code 404") {
        throw new NotFound(NOT_FOUND("Workplace"));
      } else {
        throw e;
      }
    }
  }

  async create({ startDate, endDate, company, country, city, workbookId, isCurrent }): Promise<IWorkplace> {
    let workplace: IWorkplace | undefined;

    const { uri } = await this.post({ data: {} }, "");

    if (!isCurrent && !endDate) {
      throw new ValidationError({ endDate: "End Date is required if it's not current workplace." });
    }

    workplace = {
      workbookId,
      isCurrent,
      startDate,
      endDate,
      company,
      country,
      city,
      id: uri.split("/").pop(),
    };

    await this.put({ data: workplace }, workplace.id);

    const workbook: IWorkbook = await this.get({}, workbookId);
    workbook.workplacesIds.push(workplace.id);

    await WorkbookService.update(workbook);

    let workplacesIds = [];

    try {
      workplacesIds = await this.get();
    } catch (e) {
      throw e;
    }

    workplacesIds.push(workplace.id);

    try {
      await this.put({ data: workplacesIds });
    } catch (e) {
      throw e;
    }

    return workplace;
  }

  async update(workplace, id) {
    const workplaceId = id || workplace.id;

    try {
      const oldWorkplace = await this.findById(workplaceId);
      return this.put({ data: { ...oldWorkplace, ...workplace } }, id);
    } catch (e) {
      if (e.message === "Request failed with status code 404") {
        throw new NotFound(NOT_FOUND("Workplace"));
      } else {
        throw e;
      }
    }
  }

  async delete(id, ids = [], workbookPassedId = null) {
    let workplace: IWorkplace;
    let workbookId = workbookPassedId;

    if (id) {
      try {
        workplace = await this.findById(id);
      } catch (e) {
        throw e;
      }

      workbookId = workplace.workbookId;
    }

    let workplacesIds = await this.get();

    workplacesIds = workplacesIds
      .filter(workplaceId => workplaceId !== id || (ids.length > 0 && !ids.includes(id)));

    await this.put({ data: workplacesIds });

    if (id && ids.length === 0) {
      let workbook: IWorkbook;

      workbook = await WorkbookService.findById(workbookId);

      workbook.workplacesIds = workbook.workplacesIds.filter(workplaceId => workplaceId !== id);

      await WorkbookService.update(workbook);
    }
  }
}

export default new WorkplaceService();
