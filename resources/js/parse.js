// function that replaces all non-alphanumeric characters with an alphanumeric equivalent
const nonAlpha = (str) => {
	return str
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.replace(/[^a-z0-9]/gi, "_");
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

// function to get dialects from config.json
async function getDialects() {
	const configPath = "resources/config/config.json";
	const response = await $.getJSON(configPath);
	return response.dialects.map((item) => item.code);
}

async function parse() {
	// if url contains "word" parameter, parse data
	if (urlParams.has("word")) {
		// get cantons from config.json
		const dialects = await getDialects();

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
			loadedData.sort((a, b) => (a.de > b.de ? 1 : -1));
			loadedData = compressData(loadedData);
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
		parsedData.forEach((item) => {
			item.count = item.translations.reduce((acc, current) => acc + current.count, 0);
		});

		// for each element in joined, print a div in "#translation-parent" with its data in it
		parsedData.forEach((item) => {
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
		document.querySelector("#search-results-info-de").innerHTML = parsedData.length;
		document.querySelector("#search-results-info-gsw").innerHTML = parsedData.reduce((acc, obj) => acc + obj.count, 0);
	} else {
		// set the contents of "#data-md" to the content of main.md
		document.querySelector("#data-md").innerHTML = `
			<zero-md src="resources/config/main.md">
				<template>
					<link rel="stylesheet" type="text/css" href="resources/css/compiled/base.css" />
				</template>
			</zero-md>`;

		// load meta.json
		const meta = await $.getJSON("resources/data/parsed/meta.json");
		document.querySelector("#search-results-heading").innerHTML = "";
		document.querySelector("#data-info").innerHTML = `
			<p>
				Dem Wörterbuch stehen ${meta.allGsw} Datenpunkte zur Verfügung (${meta.uniqueDe} verschiedene Wörter).
			</p>
			<p>
				Letzter Update: ${meta.date}.
			</p>
		`;
	}
}

// load the config.json file
const config = await $.getJSON("resources/config/config.json");

// set #config-title to the title property of config.json
document.querySelector("#config-title").innerHTML = config.text.title;

// set #word-input to the placeholder property of config.json
document.querySelector("#word-input").placeholder = config.text.searchPlaceholder;

parse();
