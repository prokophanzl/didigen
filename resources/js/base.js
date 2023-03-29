// UTILS

// function that replaces all non-alphanumeric characters with an alphanumeric equivalent
export const nonAlpha = (str) => {
	return str
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.replace(/\)/g, "_")
		.replace(/\(/g, "_")
		.replace(/[^a-z0-9_]/gi, "-");
};

// function to get dialects from config.json
// export async function getDialects() {
// 	const configPath = "config/config.json";
// 	const response = await $.getJSON(configPath);
// 	return response.dialects.map((item) => item.code);
// }

// const dialects = await getDialects();

// PARAMETER PARSING

const urlParams = new URLSearchParams(window.location.search);

// function that sets the word input field to the word parameter
if (urlParams.get("word")) {
	$("#word-input").val(urlParams.get("word"));
	$("#word-searched").text(urlParams.get("word"));
}

// function that selects the correct match option
if (urlParams.get("match")) {
	$("#term-input").value = urlParams.get("match");
	toggleMatch(urlParams.get("match"));
}

// function that checks url parameters and sets the correct dialect checkboxes
// $.each(dialects, (index, dialect) => {
// 	if (urlParams.get(dialect) == "on") {
// 		$("#" + dialect).prop("checked", true);
// 	}
// });

// BASE

if (sessionStorage.getItem("filtersOpen")) {
	$("#filter-container").css("display", "block");
}

function printTranslation(item) {
	// add div to "#translation-parent"
	$("#translation-parent").append(`
	<div class="word-wrapper" style="--matches: ${item.count}; --count-first: ${item.translations[0].count}">
		<div class="word-header">
			<div class="word-menu" onclick="toggle('${nonAlpha(item.de)}')" id="${nonAlpha(item.de)}-menu"></div>
			<div class="word-german header-word" id="${nonAlpha(item.de)}-g">
				<span class="word-german-span break-no-dis">${item.de}</span><span class="primary50 matches-german-span break-dis"> (${item.count})</span>
			</div>
			<div class="word-swiss-german header-word" id="${nonAlpha(item.de)}-sg">
				<span class="word-swiss-german-span break-no-dis">${item.translations[0].gsw}</span>
				<span class="primary50 matches-swiss-german-span break-dis">(${item.translations[0].count}/${item.count})</span>
			</div>
		</div>
		<div class="word-more-info info-bar" id="${nonAlpha(item.de)}">
			<div class="translation-bar-wrapper" id="translation-bar-wrapper-${nonAlpha(item.de)}">
			</div>
		</div>
	</div>
	`);

	// for each "translations" object, print a div in "#translation-bar-wrapper-${item.de}" with its data in it
	$.each(item.translations, (index, item2) => {
		$(`#translation-bar-wrapper-${nonAlpha(item.de)}`).append(`
		<div style="--count: ${item2.count}">
			<span class="translation-container">
				<span class="translation">${item2.gsw}</span>
				<span class="translation-count primary50"> ${item2.count}</span>
			</span>
		</div>
		`);
	});
}

function clearTranslations() {
	$("#translation-parent").empty();
}

async function getDialects() {
	const configPath = "config/config.json";
	const response = await $.getJSON(configPath);
	return response.dialects.map((item) => item.code);
}

const dialects = await getDialects();

// load all dialects into data object
let data = {};

$.each(dialects, async (index, dialect) => {
	data[dialect] = await $.getJSON(`resources/data/parsed/${dialect}Parsed.json`);
});

data.all = await $.getJSON(`resources/data/parsed/allParsed.json`);

// export data object
export { data };

let test = [];

let i = 0;

function printlength(tmpData) {
	let length = 0;
	$.each(tmpData, (index, item) => {
		// for each translation, add its count to the length
		$.each(item.translations, (index, item2) => {
			length += item2.count;
		});
	});
	console.log("length " + i + ": " + length);
	i++;
}

export function translate() {
	closeFilters();

	let tmpData = [];

	let length = 0;

	// set length to the sum of all translation counts in tmpData

	// set word to value of "#word-input"
	const word = $("#word-input").val().toLowerCase();

	// set match to value of "#term-input"
	const match = $("#term-input").val();

	// set dialectsUsed to array of checked dialects
	const dialectsUsed = dialects.filter((dialect) => $("#" + dialect).prop("checked"));
	clearTranslations();

	// if all checkboxes are unchecked, check all of them and load all data into tmpData
	if (dialectsUsed.length == 0) {
		$.each(dialects, async (index, dialect) => {
			await $("#" + dialect).prop("checked", true);
		});
		tmpData = data.all;
	} else if (dialectsUsed.length == dialects.length) {
		// if all checkboxes are checked, load all data into tmpData
		tmpData = data.all;
	} else {
		// else, load only the checked dialects into tmpData

		// for each dialect, add its data to tmpData
		$.each(dialectsUsed, (index, dialect) => {
			tmpData = tmpData.concat(data[dialect]);
		});

		tmpData = parseData(tmpData);
	}

	let parsedData = [];

	// filter data by word parameter

	switch (match) {
		case "begins":
			// parsedData = loadedData.filter((item) => item.de.toLowerCase().startsWith(word));
			parsedData = $.grep(tmpData, (item) => item.de.toLowerCase().startsWith(word));
			break;
		case "match":
			// parsedData = loadedData.filter((item) => nonAlpha(item.de.toLowerCase()) === nonAlpha(word));
			parsedData = $.grep(tmpData, (item) => nonAlpha(item.de.toLowerCase()) === nonAlpha(word));
			break;
		case "contains":
			// parsedData = loadedData.filter((item) => item.de.toLowerCase().includes(word));
			parsedData = $.grep(tmpData, (item) => item.de.toLowerCase().includes(word));
			break;
		default:
			// parsedData = loadedData.filter((item) => item.de.toLowerCase().startsWith(word));
			parsedData = $.grep(tmpData, (item) => item.de.toLowerCase().startsWith(word));
			break;
	}

	test = parsedData;

	$("#data-md").remove();

	// add "count" property to each "de" object, containing the sum of all "count" properties of the "gsw" objects
	$.each(parsedData, (index, item) => {
		item.count = item.translations.reduce((acc, current) => acc + current.count, 0);

		// for each element in joined, print a div in "#translation-parent" with its data in it

		printTranslation(item);
	});

	// fill in search results info
	$("#search-results-info-de").text(parsedData.length);
	$("#search-results-info-gsw").text(parsedData.reduce((acc, obj) => acc + obj.count, 0));

	// <span id="search-results-info-de"></span> Suchergebnisse für &laquo;<span id="word-searched"></span>&raquo;
	// <span class="primary50 normal-weight">(<span id="search-results-info-gsw"></span> Datenpunkte)</span>

	$("#search-results-heading").html(
		`
		${parsedData.length} Suchergebnisse für &laquo;${word}&raquo;
		<span class="primary50 normal-weight">(${parsedData.reduce((acc, obj) => acc + obj.count, 0)} Datenpunkte)</span>
		`
	);
}

function compressData(arr) {
	const result = [];
	const tempMap = new Map();

	for (let obj of arr) {
		const de = obj.de;

		if (!tempMap.has(de)) {
			tempMap.set(de, { de: de, translations: [] });
			result.push(tempMap.get(de));
		}

		const tempObj = tempMap.get(de);

		for (let translation of obj.translations) {
			const gsw = translation.gsw;
			const count = translation.count;

			const index = tempObj.translations.findIndex((t) => t.gsw === gsw);

			if (index === -1) {
				tempObj.translations.push({ gsw: gsw, count: count });
			} else {
				tempObj.translations[index].count += count;
			}
		}
	}

	return result;
}

function parseData(data) {
	let output = data;
	output.sort((a, b) => (a.de > b.de ? 1 : -1));

	output = compressData(output);

	// sort data by "de" value
	output.sort((a, b) => (a.de.toLowerCase() > b.de.toLowerCase() ? 1 : -1));

	// sort "translations" arrays by "count" property, case insensitive
	$.each(output, (index, item) => {
		item.translations.sort((a, b) => b.count - a.count);
	});

	return output;
}

async function parse() {
	// if url contains "word" parameter, parse data
	if (urlParams.has("word")) {
		// get url parameters
		const dialectsUsed = dialects.filter((dialect) => urlParams.get(dialect) === "on");
		let jsonsToLoad = [];

		// get all json files loaded for the dialects used
		if (dialectsUsed.length === dialects.length) {
			// if all dialects are used, load the allParsed.json file
			jsonsToLoad.push("resources/data/parsed/allParsed.json");
		} else {
			// if not all dialects are used, load the individual files
			jsonsToLoad = dialectsUsed.map((dialect) => `resources/data/parsed/${dialect}Parsed.json`);
		}

		// load all json files
		let loadedData = [];
		for (let i = 0; i < jsonsToLoad.length; i++) {
			const url = jsonsToLoad[i];
			const jsonArray = await $.getJSON(url);
			loadedData = loadedData.concat(jsonArray);
		}

		if (jsonsToLoad.length > 1) {
			loadedData = parseData(loadedData);
		}

		// get word parameter
		const word = urlParams.get("word").toLowerCase();

		// get match parameter
		const match = urlParams.get("match");

		let parsedData;

		// filter data by word parameter

		switch (match) {
			case "begins":
				// parsedData = loadedData.filter((item) => item.de.toLowerCase().startsWith(word));
				parsedData = $.grep(loadedData, (item) => item.de.toLowerCase().startsWith(word));
				break;
			case "match":
				// parsedData = loadedData.filter((item) => nonAlpha(item.de.toLowerCase()) === nonAlpha(word));
				parsedData = $.grep(loadedData, (item) => nonAlpha(item.de.toLowerCase()) === nonAlpha(word));
				break;
			case "contains":
				// parsedData = loadedData.filter((item) => item.de.toLowerCase().includes(word));
				parsedData = $.grep(loadedData, (item) => item.de.toLowerCase().includes(word));
				break;
			default:
				// parsedData = loadedData.filter((item) => item.de.toLowerCase().startsWith(word));
				parsedData = $.grep(loadedData, (item) => item.de.toLowerCase().startsWith(word));
				break;
		}

		// add "count" property to each "de" object, containing the sum of all "count" properties of the "gsw" objects
		$.each(parsedData, (index, item) => {
			item.count = item.translations.reduce((acc, current) => acc + current.count, 0);
		});

		// for each element in joined, print a div in "#translation-parent" with its data in it
		$.each(parsedData, (index, item) => {
			printTranslation(item);
		});

		// fill in search results info
		$("#search-results-info-de").text(parsedData.length);
		$("#search-results-info-gsw").text(parsedData.reduce((acc, obj) => acc + obj.count, 0));
	} else {
		// load meta.json
		const meta = await $.getJSON("resources/data/parsed/meta.json");
		$("#search-results-heading").remove();
	}
}

// if no dialects are selected, select all
// if ($(".checkbox-dialect:checked").length === 0) {
// 	$(".checkbox-dialect").prop("checked", true);
// }

// parse();
