$("#submit").bind("click", () => {
	sessionStorage.removeItem("filtersOpen");
});

$(".filter-toggle").bind("click", () => {
	toggleFilters();
});

// load

function setSrc(src) {
	$("#src-input").val(src);
	// if src is 1, check #config-standard
	if (src == 1) {
		$("#config-dialect").prop("checked", true);
		$.getJSON("config/config.json", (data) => {
			$("#word-input").attr("placeholder", data.text.dialectToStandard);
		});
	} else {
		$("#config-standard").prop("checked", true);
		$.getJSON("config/config.json", (data) => {
			$("#word-input").attr("placeholder", data.text.standardToDialect);
		});
	}
}

$("#config-standard").bind("click", () => {
	setSrc(0);
});

$("#config-dialect").bind("click", () => {
	setSrc(1);
});

$("#begins").bind("click", () => {
	toggleMatch("begins");
});

$("#match").bind("click", () => {
	toggleMatch("match");
});

$("#contains").bind("click", () => {
	toggleMatch("contains");
});

$("#check-all").bind("click", () => {
	$(".checkbox-dialect").prop("checked", true);
});

$("#check-none").bind("click", () => {
	$(".checkbox-dialect").prop("checked", false);
});

$(document).ready(function () {
	$("#main-form").submit(function (event) {
		event.preventDefault(); // prevent default form action
		translate(); // call your function here
	});
});
