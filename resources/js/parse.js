import sourceData from "../data/parsed/allParsed.json" assert { type: "json" };

// function that replaces all non-alphanumeric characters with an alphanumeric equivalent
const nonAlpha = (str) => {
	return str
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.replace(/[^a-z0-9]/gi, "");
};

// if "word" url parameter exists, filter dataParsed to only contain objects with "de" property containing "word"

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
