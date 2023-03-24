// function that replaces all non-alphanumeric characters with an alphanumeric equivalent
const nonAlpha = (str) => {
	return str
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.replace(/[^a-z0-9]/gi, "");
};

function compressData(data) {
	const output = [];

	// join objects with same "de" value into one object with an array of "gsw" values with "count" property for duplicate gsw values
	data.forEach((item) => {
		// find index of object with same "de" value
		const index = output.findIndex((obj) => nonAlpha(obj.de) === nonAlpha(item.de));
		// if no object with same "de" value exists, push new object to output
		if (index === -1) {
			output.push({
				de: item.de,
				translations: item.translations,
			});
		} else {
			// if object with same "de" value exists, merge "translations" arrays
			output[index].translations = output[index].translations.concat(item.translations);
			// go through "translations" array and remove duplicates, incrementing "count" property for duplicates
			output[index].translations = output[index].translations.reduce((acc, current) => {
				const x = acc.find((item) => item.gsw === current.gsw);
				if (!x) {
					return acc.concat([current]);
				} else {
					x.count += current.count;
					return acc;
				}
			}, []);
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

const cantons = [
	// "ag",
	// "ar",
	"ai",
	// "bl",
	// "bs",
	// "be",
	"fr",
	// "ge",
	// "gl",
	// "gr",
	// "ju",
	// "lu",
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
];

let allData;
let sourceData = [];
let filesToLoad = [];

function loadJson(url) {
	return fetch(url).then((response) => response.json());
}

async function loadAllJsonFiles() {
	for (let i = 0; i < filesToLoad.length; i++) {
		const url = filesToLoad[i];
		const jsonArray = await loadJson(url);
		sourceData = sourceData.concat(jsonArray);
	}
	// console.log(sourceData); // do something with the big array here

	if (filesToLoad.length > 1) {
		sourceData.sort((a, b) => (a.de > b.de ? 1 : -1));
		sourceData = compressData(sourceData);
	}

	// console.log(sourceData); // do something with the big array here

	var dataParsed;
	const word = urlParams.get("word").toLowerCase();

	switch (urlParams.get("match")) {
		case "begins":
			dataParsed = sourceData.filter((item) => item.de.toLowerCase().startsWith(word));
			break;
		case "match":
			dataParsed = sourceData.filter((item) => item.de.toLowerCase() === word);
			break;
		case "contains":
			// console.log(sourceData);
			dataParsed = sourceData.filter((item) => item.de.toLowerCase().includes(word));
			break;
		default:
			break;
	}

	// add "count" property to each "de" object, containing the sum of all "count" properties of the "gsw" objects
	dataParsed.forEach((item) => {
		item.count = item.translations.reduce((acc, obj) => acc + obj.count, 0);
	});

	// for each element in joined, print a div in "#translation-parent" with its data in it
	dataParsed.forEach((item) => {
		document.querySelector("#translation-parent").innerHTML += `
		<div class="word-wrapper" style="--matches: ${item.count}; --count-first: ${item.translations[0].count}">
			<div class="word-header">
				<div class="word-menu" onclick="toggle('${nonAlpha(item.de)}')" id="${nonAlpha(item.de)}-menu"></div>
				<div class="word-german header-word" id="${nonAlpha(item.de)}-g">
					<span class="word-german-span break-no-dis">${item.de}</span><span class="primary50 matches-german-span break-dis"> (${item.count})</span>
				</div>
				<div class="word-swiss-german header-word" id="${nonAlpha(item.de)}-sg">
					<span class="word-swiss-german-span break-no-dis">${item.translations[0].gsw}</span
					><span class="primary50 matches-swiss-german-span break-dis">(${item.translations[0].count}/${item.count})</span>
				</div>
			</div>
			<div class="word-more-info info-bar" id="${nonAlpha(item.de)}">
				<div class="translation-bar-wrapper" id="translation-bar-wrapper-${nonAlpha(item.de)}">
				</div>
			</div>
		</div>
	`;

		// for each "gsw" object, print a div in "#translation-bar-wrapper-${item.de}" with its data in it
		item.translations.forEach((item2) => {
			document.querySelector(`#translation-bar-wrapper-${nonAlpha(item.de)}`).innerHTML += `
			<div style="--count: ${item2.count}">
				<span class="translation-container">
					<span class="translation">${item2.gsw}</span>
					<span class="translation-count primary50"> ${item2.count}</span>
				</span>
			</div>
		`;
		});
	});

	// fill in search results info
	document.querySelector("#search-results-info-de").innerHTML = dataParsed.length;
	document.querySelector("#search-results-info-gsw").innerHTML = dataParsed.reduce((acc, obj) => acc + obj.count, 0);
}

if (urlParams.get("word")) {
	loadAllJsonFiles();
	const cantonsUsed = cantons.filter((canton) => urlParams.get(canton) === "on");
	let joinCantons;
	if (cantonsUsed.length === 1) {
		filesToLoad = [`resources/data/parsed/${cantonsUsed[0]}Parsed.json`];
	} else if (cantonsUsed.length === 0 || cantonsUsed.length === cantons.length) {
		filesToLoad = ["resources/data/parsed/allParsed.json"];
	} else {
		filesToLoad = cantonsUsed.map((canton) => `resources/data/parsed/${canton}Parsed.json`);
		joinCantons = true;
	}

	loadAllJsonFiles();
} else {
	// load meta.json and set "#search-results-heading" to the values in it
	loadJson("resources/data/parsed/meta.json").then((data) => {
		document.querySelector("#search-results-heading").innerHTML = "Geben Sie einen Suchbegriff ein.";
		document.querySelector("#data-info").innerHTML = `
			<p>
				Dem Wörterbuch stehen ${data.allGsw} Datenpunkte zur Verfügung (${data.uniqueDe} verschiedene Wörter).
			</p>
			<p>
				Letzter Update: ${data.date}.
			</p>
		`;
	});
}
