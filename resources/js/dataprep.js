import ai from "../data/ai.json" assert { type: "json" };
import xx from "../data/xx.json" assert { type: "json" };
import zh from "../data/zh.json" assert { type: "json" };
import fr from "../data/fr.json" assert { type: "json" };

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

// join all data into one array
let all = [...ai, ...xx, ...zh, ...fr];
// sort array by "de" value
all.sort((a, b) => (a.de > b.de ? 1 : -1));
// console.log(all);

let allParsed = compressData(all);
let aiParsed = compressData(ai);
let xxParsed = compressData(xx);
let zhParsed = compressData(zh);
let frParsed = compressData(fr);

// console log first 10 objects of allParsed
// console.log(allParsed.slice(0, 10));

// export allParsed to json and download it
// const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allParsed));
// const downloadAnchorNode = document.createElement("a");
// downloadAnchorNode.setAttribute("href", dataStr);
// downloadAnchorNode.setAttribute("download", "all.json");
// document.body.appendChild(downloadAnchorNode); // required for firefox
// downloadAnchorNode.click();
// downloadAnchorNode.remove();

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
	exportJson(allParsed, "all");
	exportJson(aiParsed, "ai");
	exportJson(xxParsed, "xx");
	exportJson(zhParsed, "zh");
	exportJson(frParsed, "fr");
});
