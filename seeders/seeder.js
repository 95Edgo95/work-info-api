"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const RequestService = require("../dist/api/services/RequestService").default;
const ids = require("../dist/configs/ids").default;

console.dir(ids);

const requestService = new RequestService();

exports.default = function seeder({ workbooks, workplaces }) {
  let newPromises;
  let promises;

  promises = workbooks.map(() => requestService.post({ data: {} }, ""));

  return Promise.all(promises)
    .then((responses) => {
      newPromises = responses.map(({ uri }, index) => {
        const id = uri.split("/").pop();

        return requestService.put({ data: { ...workbooks[index], id } }, id);
      });

      return Promise.all(newPromises)
        .then((dbWorkbooks) => {
          console.dir(dbWorkbooks, { colors: true, depth: 5 });
          promises = workplaces
            .map(() => requestService.post({ data: {} }, ""));

          return Promise.all(promises)
            .then(responses => {
              newPromises = responses.map(({ uri }, index) => {
                const id = uri.split("/").pop();

                return requestService.put({
                  data: {
                    ...workplaces[index],
                    id,
                    workbookId: dbWorkbooks[workplaces[index].workbookId].id
                  }
                }, id);
              });

              return Promise.all(newPromises)
                .then(dbWorkplaces => {
                  console.dir(dbWorkplaces, { colors: true, depth: 5 });
                  return Promise.all([
                    requestService.put({
                      data: {
                        passport: dbWorkbooks.map(workbook => workbook.passport),
                        email: dbWorkbooks.map(workbook => workbook.email),
                      }
                    }, ids.uniqueService),
                    requestService.put({
                      data: dbWorkbooks.map(workbook => workbook.id)
                    }, ids.workbookService),
                    requestService.put({
                      data: dbWorkplaces.map(workplace => workplace.id)
                    }, ids.workplaceService)
                  ]);
                })
            })
        })
    });
};
