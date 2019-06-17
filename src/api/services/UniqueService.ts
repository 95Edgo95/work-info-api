import RequestService from "./RequestService";
import ids from "../../configs/ids";

class UniqueService extends RequestService {
  constructor() {
    super();

    this.myJsonId = ids.uniqueService;
    this.uniqueValues = {
      email: [],
      passport: [],
    };
  }

  uniqueValues: any;

  async init() {
    this.uniqueValues = await this.get();
  }

  isUnique(key: "email" | "passport", value: string): boolean {
    return !this.uniqueValues[key].includes(value);
  }

  async saveUniqueValues(data: any) {
    this.uniqueValues.email.push(data.email);
    this.uniqueValues.passport.push(data.passport);

    await this.save();
  }

  async updateUniqueValue(key: "email" | "passport", oldData: string, data: string) {
    const uniqueValues = { ...this.uniqueValues,  [key]: [...this.uniqueValues[key]] };
    uniqueValues[key] = uniqueValues[key].map(value => value === oldData ? data : value);
    this.uniqueValues = uniqueValues;

    await this.save();
  }

  async deleteUniqueValues(data: any) {
    this.uniqueValues.passport = this.uniqueValues.passport.filter(value => value !== data.passport);
    this.uniqueValues.email = this.uniqueValues.email.filter(value => value !== data.email);

    await this.save();
  }

  async save() {
    await this.put({ data: this.uniqueValues });
  }
}

export default new UniqueService();
