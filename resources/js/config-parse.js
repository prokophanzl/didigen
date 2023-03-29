// load the config.json file
const config = await $.getJSON("config/config.json");

// set the site icon to the icon property of config.json
// $("link[rel='icon']").attr("href", `config/${config.options.siteIcon}`);

// for each X, set elements with data-config=X to the X property of config.json
$("[data-config]").each((index, item) => {
	const configKey = $(item).data("config");

	// if data-config-type is set to "text", set the text of the element to the X property of config.json
	// if data-config-type is set to placeholder, set the placeholder of the element to the X property of config.json
	// etc.

	switch ($(item).data("config-type")) {
		case "text":
			$(item).text(config.text[configKey]);
			break;
		case "placeholder":
			$(item).attr("placeholder", config.text[configKey]);
			break;
		case "value":
			$(item).val(config.text[configKey]);
			break;
		case "email":
			$(item).attr("href", `mailto:${config.text[configKey]}`);
			break;
		default:
			$(item).text(config.text[configKey]);
			break;
	}
});

// set #config-dialect-checkmarks to the dialects property of config.json
$.each(config.dialects, (index, item) => {
	$("#config-dialect-checkmarks").append(`
		<div>
			<label>
				${item.name}
				<input type="checkbox" name="${item.code}" id="${item.code}" class="checkbox-dialect" checked />
				<span class="checkmark-span"></span>
			</label>
		</div>
	`);
});

const urlParams = new URLSearchParams(window.location.search);
// load meta
const meta = await $.getJSON("resources/data/parsed/meta.json");

// create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// set the URL of the markdown file to load
var url = "config/main.md";

// set the callback function for when the AJAX request completes
xhr.onload = function () {
	// if the AJAX request was successful
	if (xhr.status === 200) {
		// get the Markdown text from the response
		var markdownText = xhr.responseText;

		// convert the Markdown to HTML using the marked library
		var htmlText = marked.parse(markdownText);

		// in htmlText, replace all instances of DATA_TOTAL with allGsw from meta.json
		htmlText = htmlText.replace("DATA_TOTAL", meta.allGsw);

		// replace all instances of DATA_UNIQUE with uniqueDe from meta.json
		htmlText = htmlText.replace("DATA_UNIQUE", meta.uniqueDe);

		// replace all instances of DATA_LASTUPDATE with date from meta.json
		htmlText = htmlText.replace("DATA_LASTUPDATE", meta.date);

		// replace all instances of DATA_DIALECTS with length of dialects from config.json. if config.options.includesUnknownDialect is true, subtract 1
		htmlText = htmlText.replace("DATA_DIALECTS", config.dialects.length - (config.options.includesUnknownDialect ? 1 : 0));

		// Set the HTML as the contents of the "data-md" element
		document.getElementById("data-md").innerHTML = htmlText;
	}
};

// Send the AJAX request to load the Markdown file
xhr.open("GET", url, true);
xhr.send();
