import Papa from "papaparse";

export const fetchCarparkData = async () => {
    try {
        const response = await fetch("/HDBCarparkInformation.csv");
        const csvData = await response.text();

        return new Promise((resolve) => {
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
          });
        });
    } 
    catch (error) {
        console.error("Error reading CSV:", error);
        return [];
    }
};