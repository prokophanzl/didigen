// load the config.json file
const config = await $.getJSON("resources/config/config.json");

// set page title to the title property of config.json
document.title = config.text.title;

// set #config-title to the title property of config.json
$("#config-title").text(config.text.title);

// set #word-input to the placeholder property of config.json
$("#word-input").attr("placeholder", config.text.searchPlaceholder);

// set value of #submit to the translateButton property of config.json
$("#submit").val(config.text.translateButton);

// set .config-keyword to the keyword property of config.json
$(".config-keyword").text(config.text.keyword);

// set #config-word to the word property of config.json
$("#config-word").text(config.text.word);

// set match options to the match properties of config.json
$("#begins").text(config.text.matchBegins);
$("#match").text(config.text.matchExact);
$("#contains").text(config.text.matchContains);

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
