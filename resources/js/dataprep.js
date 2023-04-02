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

function replaceWrongChars(str) {
	// replace wrong umlauts (ü, ö, ä, ß, capital wrong umlauts) with correct ones (ü, ö, ä, ss, capital correct umlauts)
	const wrongChars = ["ü", "ö", "ä", "ß", "Ü", "Ö", "Ä", "ẞ"];
	const correctChars = ["ü", "ö", "ä", "ss", "Ü", "Ö", "Ä", "SS"];

	// replace non-breaking spaces with normal spaces
	str = str.replace(/\u00A0/g, " ");

	// replace repeating spaces with one space
	str = str.replace(/ +/g, " ");

	return str.replace(/ü/g, "ü").replace(/ö/g, "ö").replace(/ä/g, "ä");
}

function parseCSV(csv) {
	csv = replaceWrongChars(csv);

	const lines = csv.trim().split("\n"); // split CSV into lines
	const data = lines.slice(1); // extract data rows
	const result = [];

	// iterate over each data row
	data.forEach((row) => {
		const [src, targetRaw] = row.split(","); // extract source and target values
		// remove leading/trailing whitespace and carriage return character and make lowercase
		var target = targetRaw.trim().toLowerCase();

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

	// sort all target arrays by value
	result.forEach((obj) => {
		obj.target.sort((a, b) => (a.translation > b.translation ? 1 : -1));
	});

	// sort all target arrays by count
	result.forEach((obj) => {
		obj.target.sort((a, b) => b.count - a.count);
	});

	// sort result by source
	result.sort((a, b) => (a.src > b.src ? 1 : -1));

	return result;
}

function parseCSVDialect(csv) {
	const lines = csv.trim().split("\n"); // split CSV into lines
	const data = lines.slice(1); // extract data rows
	const result = [];

	// iterate over each data row
	data.forEach((row) => {
		const [target, srcRaw] = row.split(","); // extract source and target values
		// remove leading/trailing whitespace and carriage return character and make lowercase
		const src = srcRaw.trim().toLowerCase();
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

	// sort all target arrays by value
	result.forEach((obj) => {
		obj.target.sort((a, b) => (a.translation > b.translation ? 1 : -1));
	});

	// sort all target arrays by count
	result.forEach((obj) => {
		obj.target.sort((a, b) => b.count - a.count);
	});

	// sort result by source

	result.sort((a, b) => (a.src > b.src ? 1 : -1));

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

function downloadJSON3(data, filename) {
	const json = JSON.stringify(data);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a3 = document.createElement("a");

	a3.href = url;
	a3.download = filename;
	document.body.appendChild(a3);
	a3.click();
	document.body.removeChild(a3);
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

	// sort all target arrays by value
	result.forEach((obj) => {
		obj.target.sort((a, b) => (a.translation > b.translation ? 1 : -1));
	});

	// sort all target arrays by count
	result.forEach((obj) => {
		obj.target.sort((a, b) => b.count - a.count);
	});

	// sort result by source
	result.sort((a, b) => (a.src > b.src ? 1 : -1));

	// sort result by source, case insensitive
	result.sort((a, b) => (a.src.toLowerCase() > b.src.toLowerCase() ? 1 : -1));

	return result;
}

document.getElementById("download-standard").addEventListener("click", async () => {
	let allData = []; // array to store all the parsed data

	// load and combine all the CSV files
	await $.each(dialects, async (i, dialect) => {
		await loadCSVFile(`resources/data/${dialect}.csv`, async function (csvString) {
			const data = parseCSV(csvString);
			allData.push(...data); // spread the parsed data into the allData array
			await downloadJSON(data, `${dialect}Standard.json`); // download the parsed data as a JSON file for this dialect
		});
	});
});

document.getElementById("download-standard-all").addEventListener("click", async () => {
	let allData = []; // array to store all the parsed data

	// load and combine all the CSV files
	await $.each(dialects, async (i, dialect) => {
		await loadCSVFile(`resources/data/${dialect}.csv`, async function (csvString) {
			const data = parseCSV(csvString);
			allData.push(...data); // spread the parsed data into the allData array
			// await downloadJSON(data, `${dialect}Standard.json`); // download the parsed data as a JSON file for this dialect

			// if this is the last iteration:
			if (i === dialects.length - 1) {
				allData = compressData(allData); // compress the data
				await downloadJSON2(allData, "allStandard.json"); // download the compressed data as a JSON file
				// await downloadJSON3(meta, "meta.json"); // download the meta data as a JSON file
			}
		});
	});
});

document.getElementById("download-meta").addEventListener("click", async () => {
	let allData = []; // array to store all the parsed data

	// load and combine all the CSV files
	await $.each(dialects, async (i, dialect) => {
		await loadCSVFile(`resources/data/${dialect}.csv`, async function (csvString) {
			const data = parseCSV(csvString);
			allData.push(...data); // spread the parsed data into the allData array
			// await downloadJSON(data, `${dialect}Standard.json`); // download the parsed data as a JSON file for this dialect

			// if this is the last iteration:
			if (i === dialects.length - 1) {
				allData = compressData(allData); // compress the data
				const meta = {
					uniqueStandard: allData.length,
					// sum of all "count" properties in all "translations" arrays
					allWords: allData.reduce((acc, cur) => {
						return acc + cur.target.reduce((acc, cur) => acc + cur.count, 0);
					}, 0),

					// date in German format
					date: new Date().toLocaleDateString("de-DE", {
						year: "numeric",
						month: "long",
						day: "numeric",
					}),
				};
				// await downloadJSON2(allData, "allStandard.json"); // download the compressed data as a JSON file
				await downloadJSON3(meta, "meta.json"); // download the meta data as a JSON file
			}
		});
	});
});

document.getElementById("download-dialect").addEventListener("click", async () => {
	let allData2 = []; // array to store all the parsed data

	// load and combine all the CSV files
	await $.each(dialects, async (i, dialect) => {
		await loadCSVFile(`resources/data/${dialect}.csv`, async function (csvString) {
			const data = parseCSVDialect(csvString);
			allData2.push(...data); // spread the parsed data into the allData array
			await downloadJSON(data, `${dialect}Dialect.json`); // download the parsed data as a JSON file for this dialect
		});
	});
});

document.getElementById("download-dialect-all").addEventListener("click", async () => {
	let allData2 = []; // array to store all the parsed data

	// load and combine all the CSV files
	await $.each(dialects, async (i, dialect) => {
		await loadCSVFile(`resources/data/${dialect}.csv`, async function (csvString) {
			const data = parseCSVDialect(csvString);
			allData2.push(...data); // spread the parsed data into the allData array
			// await downloadJSON(data, `${dialect}Dialect.json`); // download the parsed data as a JSON file for this dialect

			// if this is the last iteration:
			if (i === dialects.length - 1) {
				allData2 = compressData(allData2); // compress the data
				await downloadJSON2(allData2, "allDialect.json"); // download the compressed data as a JSON file
			}
		});
	});
});
