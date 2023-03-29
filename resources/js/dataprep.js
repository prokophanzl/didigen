const cantons = [
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
];

function csvToArray(csv) {
	const lines = csv.replace(/\r/g, "").split("\n");
	const headers = lines[0].split(",").map((header) => header.trim().replace(/\s+/g, "_"));
	const result = [];

	for (let i = 1; i < lines.length; i++) {
		const obj = {};
		const currentLine = lines[i].split(",");

		for (let j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentLine[j];
		}

		result.push(obj);
	}

	return result;
}

function loadCsvFromServer(url) {
	return fetch(url)
		.then((response) => response.text())
		.then((csv) => csvToArray(csv));
}

function compressData(data) {
	const output = [];
	// make all gsw values lowercase
	data.forEach((item) => {
		item.gsw = item.gsw.toLowerCase();
	});

	// join objects with same "de" value into one object with an array of "gsw" values with "count" property for duplicate gsw values
	data.forEach((item) => {
		// find index of object with same "de" value
		const index = output.findIndex((obj) => obj.de === item.de);
		// if no object with same "de" value exists, push new object to output
		if (index === -1) {
			output.push({
				de: item.de,
				translations: [
					{
						gsw: item.gsw,
						count: 1,
					},
				],
			});
		} else {
			// if object with same "de" value exists, find index of object with same "gsw" and "canton" values
			const index2 = output[index].translations.findIndex((obj) => obj.gsw === item.gsw);
			if (index2 === -1) {
				output[index].translations.push({
					gsw: item.gsw,
					count: 1,
				});
				// if object with same "gsw" and "canton" values exists, increment "count" property
			} else {
				output[index].translations[index2].count++;
			}
		}
	});

	// sort data by "de" value
	output.sort((a, b) => (a.de.toLowerCase() > b.de.toLowerCase() ? 1 : -1));

	// sort "translations" arrays by "count" property, case insensitive
	output.forEach((item) => {
		item.translations.sort((a, b) => b.count - a.count);
	});

	return output;
}

let allParsed;
let aiParsed;
let xxParsed;
let arParsed;
let zhParsed;
let frParsed;
let beParsed;
let luParsed;
let blParsed;
let agParsed;

// load csv files from server for all cantons in cantons array
Promise.all(
	cantons.map((canton) => {
		return loadCsvFromServer(`/resources/data/${canton}.csv`);
	})
).then((data) => {
	let ar = data[0];
	let ai = data[1];
	let be = data[2];
	let fr = data[3];
	let lu = data[4];
	let zh = data[5];
	let xx = data[6];
	let bl = data[7];
	let ag = data[8];

	// join all data into one array
	let all = [...ai, ...xx, ...zh, ...fr, ...be, ...lu, ...ar, ...bl, ...ag];
	// sort array by "de" value
	all.sort((a, b) => (a.de > b.de ? 1 : -1));

	allParsed = compressData(all);
	aiParsed = compressData(ai);
	xxParsed = compressData(xx);
	arParsed = compressData(ar);
	zhParsed = compressData(zh);
	frParsed = compressData(fr);
	beParsed = compressData(be);
	luParsed = compressData(lu);
	blParsed = compressData(bl);
	agParsed = compressData(ag);
});

// function that accepts an objects and downloads it as a json named after the object
function exportJson(obj, name) {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", `${name}.json`);
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

// when #button is clicked, run exportJson function for each parsed data array
document.getElementById("download").addEventListener("click", () => {
	exportJson(allParsed, "allParsed");
	exportJson(aiParsed, "aiParsed");
	exportJson(xxParsed, "xxParsed");
	exportJson(zhParsed, "zhParsed");
	exportJson(frParsed, "frParsed");
	exportJson(beParsed, "beParsed");
	exportJson(luParsed, "luParsed");
	exportJson(arParsed, "arParsed");
	exportJson(blParsed, "blParsed");
	exportJson(agParsed, "agParsed");

	let meta = {
		uniqueDe: allParsed.length,
		// sum of all "count" properties in all "translations" arrays
		allGsw: allParsed.reduce((acc, cur) => {
			return acc + cur.translations.reduce((acc, cur) => acc + cur.count, 0);
		}, 0),

		// date in German format
		date: new Date().toLocaleDateString("de-DE", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}),
	};

	exportJson(meta, "meta");
});
