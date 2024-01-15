const csv = require("csv-parser");
const fs = require("fs");

const categories = {};

fs.createReadStream("files/categorias.csv")
  .pipe(csv())
  .on("data", (data) => (categories[data.nome] = data.id))
  .on("end", () => {});

const time = {};

fs.createReadStream("files/data.csv")
  .pipe(csv())
  .on("data", (data) => {
    if (!time[data.ano]) {
      time[data.ano] = {};
    }

    time[data.ano][data.mes] = data.id;
  })
  .on("end", () => {});

const region = {
  PR: 1,
  RS: 2,
  SC: 3,
};

fs.readdir("files", (err, directories) => {
  if (err) throw err;

  directories
    .filter((directory) => !directory.endsWith("csv"))
    .forEach((directory) => {
      fs.readdir(`files/${directory}`, (err, files) => {
        if (err) throw err;

        const results = [];

        files.forEach((file) => {
          fs.createReadStream(`files/${directory}/${file}`)
            .pipe(csv())
            .on("data", (data) => {
              Object.entries(data)
                .filter(
                  ([key]) =>
                    key != "MÊS" && key != "ANO" && !key.endsWith("ACUMULADO")
                )
                .forEach(([key, value]) => {
                  results.push({
                    data: time[data["ANO"]][data["MÊS"]],
                    categoria: categories[key],
                    quantidade: value,
                    estado: region[directory],
                  });
                });
            })
            .on("end", () => {
              console.log(results);

              const line = results.reduce((acc, data) => {
                acc += `${data.data},${data.categoria},${data.estado},${data.quantidade}\n`;
                return acc;
              }, `data,categoria,estado,quantidade\n`);

              fs.writeFile(
                `output/${directory}-${file.slice(-3)}`,
                line,
                () => {}
              );

              fs.writeFile(`output/data.csv`, line, () => {});
            });
        });
      });
    });
});
