import fs from 'fs';
import { parse } from 'csv-parse';

const processFile = async () => {
  const parser = fs
  .createReadStream('csv-file.csv')
  .pipe(parse({ from_line: 2, }));

  for await (const record of parser) {
    const [title, description] = record;

    const response = await fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

(async () => {
  await processFile();
})();