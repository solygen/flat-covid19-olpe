// This can be a typescript file as well

// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files
import { readCSV, writeCSV } from 'https://deno.land/x/flat@0.0.10/mod.ts'

// Step 1: Read the downloaded_filename JSON
const filename = Deno.args[0]
const records = await readCSV(filename)
console.log(records)

// Step 2: Filter specific data we want to keep and write to a new CSV file
const processedRecords = records.map(record => {
    const picked = {};
    for (let prop of Object.keys(record)) {
		if (!/(Kumuliert|7Tage|Vortag)/gi.test(prop)) picked[prop] = record[prop];
	}
    return picked;
});

// Step 3. Write a new JSON file with our filtered data
const newFilename = `data-postprocessed.csv`
await writeCSV(newFilename, processedRecords)
console.log("Wrote a post process file")
