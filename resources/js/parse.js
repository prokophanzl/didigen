import sourceData from "./dataParsed.json" assert { type: "json" };

// function that replaces all non-alphanumeric characters with an alphanumeric equivalent
const nonAlpha = (str) => {
	return str
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.replace(/[^a-z0-9]/gi, "");
};

// // join objects with same "de" values. for each object, create an array of objects containing the "gsw" and "canton" values. join duplicate objects and add a "count" property to each object. use pure javascript.
// const joined = data.reduce((acc, obj) => {
// 	// find index of object with same "de" value
// 	const index = acc.findIndex((item) => item.de === obj.de);
// 	// if no object with same "de" value exists, push new object to accumulator
// 	if (index === -1) {
// 		acc.push({
// 			de: obj.de,
// 			gsw: [
// 				{
// 					gsw: obj.gsw,
// 					canton: obj.canton,
// 					count: 1,
// 				},
// 			],
// 		});
// 	} else {
// 		// if object with same "de" value exists, find index of object with same "gsw" and "canton" values
// 		const index2 = acc[index].gsw.findIndex((item) => item.gsw === obj.gsw && item.canton === obj.canton);
// 		if (index2 === -1) {
// 			acc[index].gsw.push({
// 				gsw: obj.gsw,
// 				canton: obj.canton,
// 				count: 1,
// 			});
// 			// if object with same "gsw" and "canton" values exists, increment "count" property
// 		} else {
// 			acc[index].gsw[index2].count++;
// 		}
// 	}
// 	return acc;
// }, []);

// sort "gsw" arrays by "count" property
// dataParsed.forEach((item) => {
// 	item.gsw.sort((a, b) => b.count - a.count);
// });

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
	item.count = item.gsw.reduce((acc, obj) => acc + obj.count, 0);
});

// console.log(joined);

// for each element in joined, print a div in "#translation-parent" with its data in it
dataParsed.forEach((item) => {
	// const div = document.createElement("div");
	// div.classList.add("translation");
	document.querySelector("#translation-parent").innerHTML += `
		<div class="word-wrapper" style="--matches: ${item.count}; --count-first: ${item.gsw[0].count}">
			<div class="word-header">
				<div class="word-menu" onclick="toggle('${nonAlpha(item.de)}')" id="${nonAlpha(item.de)}-menu"></div>
				<div class="word-german header-word" id="${nonAlpha(item.de)}-g">
					<span class="word-german-span break-no-dis">${item.de}</span><span class="primary50 matches-german-span break-dis"> (${item.count})</span>
				</div>
				<div class="word-swiss-german header-word" id="${nonAlpha(item.de)}-sg">
					<span class="word-swiss-german-span break-no-dis">${item.gsw[0].gsw}</span
					><span class="primary50 matches-swiss-german-span break-dis">(${item.gsw[0].count}/${item.count})</span>
				</div>
			</div>
			<div class="word-more-info info-bar" id="${nonAlpha(item.de)}">
				<div class="translation-bar-wrapper" id="translation-bar-wrapper-${nonAlpha(item.de)}">
				</div>
			</div>
		</div>
	`;
	// document.querySelector("#translation-parent").appendChild(div);

	// for each "gsw" object, print a div in "#translation-bar-wrapper-${item.de}" with its data in it
	item.gsw.forEach((item2) => {
		// const bar = document.createElement("div");
		// bar.classList.add("translation-bar");
		document.querySelector(`#translation-bar-wrapper-${nonAlpha(item.de)}`).innerHTML += `
			<div style="--count: ${item2.count}">
				<span class="translation-container">
					<span class="translation">${item2.gsw}</span>
					<span class="translation-count primary50"> ${item2.count}</span>
				</span>
			</div>
		`;
		// bars.appendChild(bar);
	});
});

// fill in search results info
document.querySelector("#search-results-info-de").innerHTML = dataParsed.length;
document.querySelector("#search-results-info-gsw").innerHTML = dataParsed.reduce((acc, obj) => acc + obj.count, 0);
