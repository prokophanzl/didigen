// load the config.json file
const config = await $.getJSON("config/config.json");

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
				<input type="checkbox" name="${item.code}" id="${item.code}" class="checkbox-dialect" />
				<span class="checkmark-span"></span>
			</label>
		</div>
	`);
});

const urlParams = new URLSearchParams(window.location.search);

// check if the url has the "word" parameter
if (!urlParams.has("word")) {
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

			// in htmlText, replace all instances of DATA_TOTAL with allGsw from meta.json, except inside <pre> or <code> tags
			htmlText = htmlText.replace(/(?<!<pre>|<code>)DATA_TOTAL(?!<\/pre>|<\/code>)/g, meta.allGsw);

			// replace all instances of DATA_UNIQUE with uniqueDe from meta.json, except inside <pre> or <code> tags
			htmlText = htmlText.replace(/(?<!<pre>|<code>)DATA_UNIQUE(?!<\/pre>|<\/code>)/g, meta.uniqueDe);

			// replace all instances of DATA_LASTUPDATE with date from meta.json, except inside <pre> or <code> tags
			htmlText = htmlText.replace(/(?<!<pre>|<code>)DATA_LASTUPDATE(?!<\/pre>|<\/code>)/g, meta.date);

			// Set the HTML as the contents of the "data-md" element
			document.getElementById("data-md").innerHTML = htmlText;
		}
	};

	// Send the AJAX request to load the Markdown file
	xhr.open("GET", url, true);
	xhr.send();
}
