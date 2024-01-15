import fs from "fs";
import { PdfReader } from "pdfreader";
import { stringify } from "csv-stringify";

function read({ year, position }) {
  let files = fs.readdirSync(`files`);

  files = files
    .filter((file) => file.endsWith(".pdf"))
    .map((file) => {
      const buffer = fs.readFileSync(`files/${file}`);

      return new Promise((resolve, rejects) => {
        const result = [];

        new PdfReader().parseBuffer(buffer, (err, item) => {
          if (err) rejects(err);
          else if (!item) resolve(result);
          else if (item.text) {
            result.push(item.text);
          }
        });
      });
    });

  Promise.all(files)
    .then((values) => {
      let results = [];

      for (let item of values) {
        let offset = item.findIndex((elem) =>
          elem.match("Nº DE VÍTIMAS DE MORTES VIOLENTAS.*")
        );

        while (isNaN(item[offset])) offset++;

        console.log(
          `[${year}][${parseInt(item[35].slice(-3, -1))}]: ${
            position + offset + 12
          }`
        );

        results.push({
          MES: parseInt(item[35].slice(-3, -1)),
          ANO: parseInt(year),
          ROUBO: parseInt(item[position + 18].replace(".", "")),
          FURTO: parseInt(item[position + 33].replace(".", "")),
          HOMICÍDIO: parseInt(item[position + offset + 13].replace(".", "")),
          FEMINICÍDIO: parseInt(item[position + offset + 20].replace(".", "")),
          LATROCÍNIO: parseInt(item[position + offset + 27].replace(".", "")),
          "LESÃO CORPORAL SEGUIDA DE MORTE": parseInt(
            item[position + offset + 34].replace(".", "")
          ),
          "CONFRONTO POLICIA CIVIL": parseInt(
            item[position + offset + 41].replace(".", "")
          ),
          "CONFRONTO POLICIA MILITAR": parseInt(
            item[position + offset + 48].replace(".", "")
          ),
        });
      }

      results = results.sort((a, b) => a.MES - b.MES);

      for (let index = results.length - 1; index >= 0; index--) {
        results[index] = {
          MES: results[index].MES,
          ANO: results[index].ANO,
          ROUBO: !index
            ? results[index].ROUBO
            : results[index].ROUBO - results[index - 1].ROUBO,
          FURTO: !index
            ? results[index].FURTO
            : results[index].FURTO - results[index - 1].FURTO,
          HOMICÍDIO: !index
            ? results[index]["HOMICÍDIO"]
            : results[index]["HOMICÍDIO"] - results[index - 1]["HOMICÍDIO"],
          FEMINICÍDIO: !index
            ? results[index]["FEMINICÍDIO"]
            : results[index]["FEMINICÍDIO"] - results[index - 1]["FEMINICÍDIO"],
          LATROCÍNIO: !index
            ? results[index]["LATROCÍNIO"]
            : results[index]["LATROCÍNIO"] - results[index - 1]["LATROCÍNIO"],
          "LESÃO CORPORAL SEGUIDA DE MORTE": !index
            ? results[index]["LESÃO CORPORAL SEGUIDA DE MORTE"]
            : results[index]["LESÃO CORPORAL SEGUIDA DE MORTE"] -
              results[index - 1]["LESÃO CORPORAL SEGUIDA DE MORTE"],
          "CONFRONTO POLICIA CIVIL": !index
            ? results[index]["CONFRONTO POLICIA CIVIL"]
            : results[index]["CONFRONTO POLICIA CIVIL"] -
              results[index - 1]["CONFRONTO POLICIA CIVIL"],
          "CONFRONTO POLICIA MILITAR": !index
            ? results[index]["CONFRONTO POLICIA MILITAR"]
            : results[index]["CONFRONTO POLICIA MILITAR"] -
              results[index - 1]["CONFRONTO POLICIA MILITAR"],
          "ROUBO ACUMULADO": results[index].ROUBO,
          "FURTO ACUMULADO": results[index].FURTO,
          "HOMICÍDIO ACUMULADO": results[index]["HOMICÍDIO"],
          "FEMINICÍDIO ACUMULADO": results[index]["FEMINICÍDIO"],
          "LATROCÍNIO ACUMULADO": results[index]["LATROCÍNIO"],
          "LESÃO CORPORAL SEGUIDA DE MORTE ACUMULADO":
            results[index]["LESÃO CORPORAL SEGUIDA DE MORTE"],
          "CONFRONTO POLICIA CIVIL ACUMULADO":
            results[index]["CONFRONTO POLICIA CIVIL"],
          "CONFRONTO POLICIA MILITAR ACUMULADO":
            results[index]["CONFRONTO POLICIA MILITAR"],
        };
      }

      return Promise.resolve(results);
    })
    .then((values) => {
      const writableStream = fs.createWriteStream(`${year}.csv`);

      const columns = [
        "MES",
        "ANO",
        "ROUBO",
        "FURTO",
        "HOMICÍDIO",
        "FEMINICÍDIO",
        "LATROCÍNIO",
        "LESÃO CORPORAL SEGUIDA DE MORTE",
        "CONFRONTO POLICIA CIVIL",
        "CONFRONTO POLICIA MILITAR",
        "ROUBO ACUMULADO",
        "FURTO ACUMULADO",
        "HOMICÍDIO ACUMULADO",
        "FEMINICÍDIO ACUMULADO",
        "LATROCÍNIO ACUMULADO",
        "LESÃO CORPORAL SEGUIDA DE MORTE ACUMULADO",
        "CONFRONTO POLICIA CIVIL ACUMULADO",
        "CONFRONTO POLICIA MILITAR ACUMULADO",
      ];

      const stringifier = stringify({ header: true, columns });

      for (let item of values) {
        stringifier.write(item);
      }

      stringifier.pipe(writableStream);
    })
    .catch((error) => {
      console.log("Failed");
      console.log(error);
    });
}

[
  { year: "2019", position: -3 },
  { year: "2020", position: -2 },
  { year: "2021", position: -1 },
  { year: "2022", position: 0 },
].forEach(read);
