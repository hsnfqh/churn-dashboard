import Papa from 'papaparse';

export const loadCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    fetch(filePath)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            resolve(result.data);
          },
          error: (error) => {
            reject(error);
          }
        });
      })
      .catch(error => reject(error));
  });
};