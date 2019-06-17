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
    },
    {
      "firstName": "Martin",
      "lastName": "Grigoryan",
      "email": "grigoryanm@gmail.com",
      "passport": "AM74136985",
      "birthDate": "23/06/1987",
      "workplacesIds": []
    },
    {
      "firstName": "Artur",
      "lastName": "Karapetyan",
      "email": "art.karapetyan@gmail.com",
      "passport": "AM75315982",
      "birthDate": "01/02/1984",
      "workplacesIds": []
    },
    {
      "firstName": "Karen",
      "lastName": "Poghosyan",
      "email": "karen.p@gmail.com",
      "passport": "AM1597532",
      "birthDate": "15/07/1996",
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
    },
    {
      "workbookId": 2,
      "startDate": "14/05/2016",
      "endDate": "01/06/2017",
      "company": "BeeWeb LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 2,
      "startDate": "02/06/2017",
      "endDate": "15/12/2017",
      "company": "Zangi LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 2,
      "startDate": "16/12/2017",
      "endDate": "30/06/2018",
      "company": "BetConstruct LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 2,
      "startDate": "01/07/2018",
      "endDate": "30/07/2019",
      "company": "SFL LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 2,
      "startDate": "30/07/2019",
      "endDate": "",
      "company": "Webb Fontaine LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": true
    },
    {
      "workbookId": 3,
      "startDate": "10/07/2004",
      "endDate": "12/03/2009",
      "company": "Synergy LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 3,
      "startDate": "13/03/2009",
      "endDate": "18/09/2013",
      "company": "EGS",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 3,
      "startDate": "19/09/2013",
      "endDate": "",
      "company": "Optym LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": true
    },
    {
      "workbookId": 4,
      "startDate": "13/04/2016",
      "endDate": "11/02/2018",
      "company": "BeeOnCode LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": false
    },
    {
      "workbookId": 4,
      "startDate": "11/02/2018",
      "endDate": "",
      "company": "BetConstruct LLC",
      "country": "Armenia",
      "city": "Yerevan",
      "isCurrent": true
    }
  ]
};

seeder(data)
  .then(() => {
    console.dir("Done");
  });
