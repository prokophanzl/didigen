import words from "./data.json" assert { type: "json" };
console.log(words);

// join objects with same "de" values. for each object, create an array of objects containing the "gsw" and "canton" values. join duplicate objects and add a "count" property to each object. use pure javascript.
const joinedWords = words.reduce((acc, obj) => {
	// find index of object with same "de" value
	const index = acc.findIndex((item) => item.de === obj.de);
	// if no object with same "de" value exists, push new object to accumulator
	if (index === -1) {
		acc.push({
			de: obj.de,
			gsw: [
				{
					gsw: obj.gsw,
					canton: obj.canton,
					count: 1,
				},
			],
		});
	} else {
		// if object with same "de" value exists, find index of object with same "gsw" and "canton" values
		const index2 = acc[index].gsw.findIndex((item) => item.gsw === obj.gsw && item.canton === obj.canton);
		if (index2 === -1) {
			acc[index].gsw.push({
				gsw: obj.gsw,
				canton: obj.canton,
				count: 1,
			});
			// if object with same "gsw" and "canton" values exists, increment "count" property
		} else {
			acc[index].gsw[index2].count++;
		}
	}
	return acc;
}, []);

// sort "gsw" arrays by "count" property
joinedWords.forEach((item) => {
	item.gsw.sort((a, b) => b.count - a.count);
});

// export joinedWords to json file and download it
// const joinedWordsString = JSON.stringify(joinedWords);
// const joinedWordsBlob = new Blob([joinedWordsString], { type: "application/json" });
// const joinedWordsUrl = URL.createObjectURL(joinedWordsBlob);
// const joinedWordsLink = document.createElement("a");
// joinedWordsLink.href = joinedWordsUrl;
// joinedWordsLink.download = "joinedWords.json";
// joinedWordsLink.click();
