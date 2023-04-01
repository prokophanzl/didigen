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

const config = await $.getJSON("config/config.json");

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

// BASE

if (sessionStorage.getItem("filtersOpen")) {
	$("#filter-container").css("display", "block");
}

function printTranslation(item) {
	// add div to "#translation-parent"
	$("#translation-parent").append(`
	<div class="word-wrapper" style="--matches: ${item.count}; --count-first: ${item.target[0].count}">
		<div class="word-header">
			<div class="word-menu" onclick="toggle('${nonAlpha(item.src)}')" id="${nonAlpha(item.src)}-menu"></div>
			<div class="word-german header-word" id="${nonAlpha(item.src)}-g">
				<span class="word-german-span break-no-dis">${item.src}</span><span class="primary50 matches-german-span break-dis"> (${item.count})</span>
			</div>
			<div class="word-swiss-german header-word" id="${nonAlpha(item.src)}-sg">
				<span class="word-swiss-german-span break-no-dis">${item.target[0].translation}</span>
				<span class="primary50 matches-swiss-german-span break-dis">(${item.target[0].count}/${item.count})</span>
			</div>
		</div>
		<div class="word-more-info info-bar" id="${nonAlpha(item.src)}">
			<div class="translation-bar-wrapper" id="translation-bar-wrapper-${nonAlpha(item.src)}">
			</div>
		</div>
	</div>
	`);

	// for each "translations" object, print a div in "#translation-bar-wrapper-${item.src}" with its data in it
	$.each(item.target, (index, item2) => {
		$(`#translation-bar-wrapper-${nonAlpha(item.src)}`).append(`
		<div style="--count: ${item2.count}">
			<span class="translation-container">
				<span class="translation">${item2.translation}</span>
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
	return config.dialects.map((item) => item.code);
}

const dialects = await getDialects();

// load all dialects into data object
let data = [];
let sta = {};
let dia = {};

$.each(dialects, async (index, dialect) => {
	sta[dialect] = await $.getJSON(`resources/data/parsed/${dialect}Standard.json`);
	dia[dialect] = await $.getJSON(`resources/data/parsed/${dialect}Dialect.json`);
});

sta.all = await $.getJSON(`resources/data/parsed/allStandard.json`);
dia.all = await $.getJSON(`resources/data/parsed/allDialect.json`);

data[0] = sta;
data[1] = dia;

// export data object
export { data };

let i = 0;

function replaceWrongChars(str) {
	// replace wrong umlauts (ü, ö, ä, ß, capital wrong umlauts) with correct ones (ü, ö, ä, ss, capital correct umlauts)
	const wrongChars = ["ü", "ö", "ä", "ß", "Ü", "Ö", "Ä", "ẞ"];
	const correctChars = ["ü", "ö", "ä", "ss", "Ü", "Ö", "Ä", "SS"];

	return wrongChars.reduce((acc, curr, index) => {
		return acc.replace(new RegExp(curr, "g"), correctChars[index]);
	}, str);
}

export function translate() {
	closeFilters();

	let tmpData = [];

	let length = 0;

	// set word to value of "#word-input"
	var word = $("#word-input").val().toLowerCase();
	word = replaceWrongChars(word);

	// set src to 1 if "#config-dialect" is checked, else 0
	const src = $("#config-dialect").prop("checked") ? 1 : 0;

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
		tmpData = data[src].all;
	} else if (dialectsUsed.length == dialects.length) {
		// if all checkboxes are checked, load all data into tmpData
		tmpData = data[src].all;
	} else {
		// else, load only the checked dialects into tmpData

		// for each dialect, add its data to tmpData
		$.each(dialectsUsed, (index, dialect) => {
			tmpData = tmpData.concat(data[src][dialect]);
		});

		tmpData = parseData(tmpData);
	}

	let parsedData = [];

	// filter data by word parameter

	switch (match) {
		case "begins":
			parsedData = $.grep(tmpData, (item) => item.src.toLowerCase().startsWith(word));
			break;
		case "match":
			parsedData = $.grep(tmpData, (item) => nonAlpha(item.src.toLowerCase()) === nonAlpha(word));
			break;
		case "contains":
			parsedData = $.grep(tmpData, (item) => item.src.toLowerCase().includes(word));
			break;
		default:
			parsedData = $.grep(tmpData, (item) => item.src.toLowerCase().startsWith(word));
			break;
	}

	$("#data-md").remove();

	// add "count" property to each "de" object, containing the sum of all "count" properties of the "translation" objects
	$.each(parsedData, (index, item) => {
		item.count = item.target.reduce((acc, current) => acc + current.count, 0);

		// for each element in joined, print a div in "#translation-parent" with its data in it
		printTranslation(item);
	});

	// fill in search results info
	$("#search-results-info-de").text(parsedData.length);
	$("#search-results-info-gsw").text(parsedData.reduce((acc, obj) => acc + obj.count, 0));

	$("#search-results-heading").text(
		config.text.resultText
			.replace("DATA_RESULT_COUNT", parsedData.length)
			.replace("DATA_RESULT_WORD", parsedData.length === 1 ? config.text.resultWordSingular : config.text.resultWord)
			.replace("DATA_QUERY", word)
			.replace(
				"DATA_DATAPOINT_COUNT",
				parsedData.reduce((acc, obj) => acc + obj.count, 0)
			)
			.replace(
				"DATA_DATAPOINT_WORD",
				parsedData.reduce((acc, obj) => acc + obj.count, 0) === 1 ? config.text.dataPointWordSingular : config.text.dataPointWord
			)
	);
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

function parseData(data) {
	let output = data;
	output.sort((a, b) => (a.src > b.src ? 1 : -1));

	output = compressData(output);

	// sort data by "src" value
	output.sort((a, b) => (a.src.toLowerCase() > b.src.toLowerCase() ? 1 : -1));

	// sort "translations" arrays by "count" property, case insensitive
	$.each(output, (index, item) => {
		item.target.sort((a, b) => b.count - a.count);
	});

	return output;
}
