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

// function that checks if the input is a number. if it is, turn into a string with a non-breaking space as a thousands separator
export const formatNumber = (num) => {
	if (isNaN(num)) {
		return num;
	} else {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}
};

const config = await $.getJSON("config/config.json");

// BASE

if (sessionStorage.getItem("filtersOpen")) {
	$("#filter-container").css("display", "block");
}

function printTranslation(item) {
	// add div to "#translation-parent"
	$("#translation-parent").append(`
	<div class="word-wrapper" style="--matches: ${item.count}; --count-first: ${item.target[0].count}">
		<div onclick="toggle('${nonAlpha(item.src)}')" class="word-header">
			<div class="word-menu" id="${nonAlpha(item.src)}-menu"></div>
			<div class="word-german header-word" id="${nonAlpha(item.src)}-g">
				<span class="word-german-span break-no-dis">${formatNumber(item.src)}</span><span class="primary50 matches-german-span break-dis"> (${
		item.count
	})</span>
			</div>
			<div class="word-swiss-german header-word" id="${nonAlpha(item.src)}-sg">
				<span class="word-swiss-german-span break-no-dis">${formatNumber(item.target[0].translation)}</span>
				<span class="primary50 matches-swiss-german-span break-dis">(${formatNumber(item.target[0].count)}/${formatNumber(item.count)})</span>
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
		<div class="translate-back" style="--count: ${item2.count}" onclick="translateBack('${item2.translation}')" title="übersetzungen von ${formatNumber(
			item2.translation
		)} anzeigen">
			<span class="translation-container">
				<span class="translation">${formatNumber(item2.translation)}</span>
				<span class="translation-count primary50">${formatNumber(item2.count)}</span>
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

	// replace non-breaking spaces with normal spaces
	str = str.replace(/\u00A0/g, " ");

	// replace repeating spaces with one space
	str = str.replace(/ +/g, " ");

	return wrongChars.reduce((acc, curr, index) => {
		return acc.replace(new RegExp(curr, "g"), correctChars[index]);
	}, str);
}

export function translate() {
	closeFilters();

	let tmpData = [];

	let length = 0;

	// set word to value of "#word-input", trimmed and converted to lowercase
	var word = $("#word-input").val().toLowerCase().trim();
	word = replaceWrongChars(word);

	// if word is only composed of numbers and spaces, remove the spaces
	if (/^[0-9 ]+$/.test(word)) {
		word = word.replace(/ /g, "");
	}

	// set src to value of "#src-input"
	// 0 is standard, 1 is dialect
	const src = $("#src-input").val();

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
			.replace("{result_count}", parsedData.length)
			.replace("{result_word}", parsedData.length === 1 ? config.text.resultWordSingular : config.text.resultWord)
			.replace("{query}", formatNumber(word))
			.replace(
				"{datapoint_count}",
				parsedData.reduce((acc, obj) => acc + obj.count, 0)
			)
			.replace(
				"{datapoint_word}",
				parsedData.reduce((acc, obj) => acc + obj.count, 0) === 1 ? config.text.dataPointWordSingular : config.text.dataPointWord
			)
	);
}

export function translateBack(translation) {
	$("#word-input").val(translation);
	toggleSrc();
	translate();
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
