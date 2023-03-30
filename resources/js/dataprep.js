const dialects = [
	// "ag",
	"ar",
	"ai",
	// "bs",
	"be",
	"fr",
	// "ge",
	// "gl",
	// "gr",
	// "ju",
	"lu",
	// "ne",
	// "nw",
	// "ow",
	// "sh",
	// "sz",
	// "so",
	// "sg",
	// "ti",
	// "tg",
	// "ur",
	// "vd",
	// "vs",
	// "zg",
	"zh",
	"xx",
	"bl",
	"ag",
	"bs",
];

function loadCSVFile(filename, callback) {
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			callback(xhr.responseText);
		}
	};
	xhr.open("GET", filename, true);
	xhr.send();
}

function parseCSV(csv) {
	const lines = csv.trim().split("\n"); // split CSV into lines
	const headers = lines[0].split(","); // extract headers
	const data = lines.slice(1); // extract data rows
	const result = [];

	// iterate over each data row
	data.forEach((row) => {
		const [src, targetRaw] = row.split(","); // extract source and target values
		const target = targetRaw.trim(); // remove leading/trailing whitespace and carriage return character
		let entry = result.find((obj) => obj.src === src); // check if source already exists in result

		if (!entry) {
			// if not, create a new object and push it to the result array
			entry = { src: src, target: [] };
			result.push(entry);
		}

		const targetEntry = entry.target.find((obj) => obj.translation === target); // check if target already exists in the source object

		if (!targetEntry) {
			// if not, create a new target object with count 1
			entry.target.push({ translation: target, count: 1 });
		} else {
			// if yes, increment the count
			targetEntry.count++;
		}
	});

	return result;
}

function downloadJSON(data, filename) {
	const json = JSON.stringify(data);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");

	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function downloadJSON2(data, filename) {
	const json = JSON.stringify(data);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a2 = document.createElement("a");

	a2.href = url;
	a2.download = filename;
	document.body.appendChild(a2);
	a2.click();
	document.body.removeChild(a2);
	URL.revokeObjectURL(url);
}

function compressData(arr) {
	const result = [];
	const tempMap = new Map();

	for (let obj of arr) {
		const src = obj.src;

		if (!tempMap.has(src)) {
			tempMap.set(src, { src: src, target: [] });
			result.push(tempMap.get(src));
		}

		const tempObj = tempMap.get(src);

		for (let item of obj.target) {
			const translation = item.translation;
			const count = item.count;

			const index = tempObj.target.findIndex((t) => t.translation === translation);

			if (index === -1) {
				tempObj.target.push({ translation: translation, count: count });
			} else {
				tempObj.target[index].count += count;
			}
		}
	}

	return result;
}

document.getElementById("download").addEventListener("click", () => {
	let allData = []; // array to store all the parsed data

	// load and combine all the CSV files
	$.each(dialects, (i, dialect) => {
		loadCSVFile(`resources/data/${dialect}.csv`, function (csvString) {
			const data = parseCSV(csvString);
			allData.push(...data); // spread the parsed data into the allData array
			downloadJSON(data, `${dialect}Parsed.json`); // download the parsed data as a JSON file for this dialect

			// if this is the last iteration:
			if (i === dialects.length - 1) {
				allData = compressData(allData); // compress the data
				console.log(allData);
				downloadJSON2(allData, "allParsed.json"); // download the compressed data as a JSON file
			}
		});
	});
});
