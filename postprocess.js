// This can be a typescript file as well

// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files
import { readCSV, writeCSV } from 'https://deno.land/x/flat/mod.ts'

// Step 1: Read the downloaded_filename JSON
const filename = Deno.args[0]
const records = await readCSV(filename)

// Step 2: build history by adding new and updating existing records
const allrecords = await readCSV(`data-history.csv`)
console.log(records.length, allrecords.length);
records.forEach(record => {
    const existing = allrecords.find(obj => {
        return String(obj.datum) === String(record.datum)
    });
    if (existing) {
        // update
        Object.assign(existing, record)
    } else {
        // push
        allrecords.push(record)
    }
});
await writeCSV(`data-history.csv`, allrecords)

// Step 3: Filter specific data we want to keep and write to a new CSV file
const processedRecords = allrecords.map(record => {
    const picked = {};
    for (let prop of Object.keys(record)) {
		if (/^(datumstd|anzahlM|verstorben|krankKumuliert|rateM7Tage)$/gi.test(prop)) picked[prop] = record[prop];
	}
    return picked;
});
console.log(processedRecords);
// Step 3. Write a new JSON file with our filtered data
const newFilename = `data-postprocessed.csv`
await writeCSV(newFilename, processedRecords)
console.log("Wrote a post process file")
