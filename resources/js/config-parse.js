// load the config.json file
const config = await $.getJSON("resources/config/config.json");

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
