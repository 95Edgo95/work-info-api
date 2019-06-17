const seeder = require("./seeder").default;

const data = {
  "workbooks": [
    {
      "firstName": "Aram",
      "lastName": "Mkrtchyan",
      "email": "aram95@gmail.com",
      "passport": "AM87654123",
      "birthDate": "14/11/1995",
      "workplacesIds": []
    },
    {
      "firstName": "Gevorg",
      "lastName": "Harutyunyan",
      "email": "g.harutyunyan@gmail.com",
      "passport": "AM12345678",
      "birthDate": "04/03/1991",
      "workplacesIds": []
    }
  ],
  "workplaces": [
    {
      "workbookId": 0,
      "startDate": "06/11/2016",
      "endDate": "12/07/2018",
      "company": "GITC",
      "country": "Armenia",
      "city": "Gyumri",
      "isCurrent": false
    },
    {
      "workbookId": 0,
      "startDate": "15/07/2018",
      "endDate": "12/02/2019",
      "company": "BeeWeb LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 0,
      "startDate": "13/02/2019",
      "endDate": "",
      "company": "BetConstruct LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": true
    },
    {
      "workbookId": 1,
      "startDate": "13/02/2015",
      "endDate": "03/06/2017",
      "company": "Zangi LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 1,
      "startDate": "05/06/2017",
      "endDate": "",
      "company": "SoftCode LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": true
    }
  ]
};

seeder(data)
  .then(() => console.dir("Done"))
  .catch(err => console.dir(err));
