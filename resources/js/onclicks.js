$("#submit").bind("click", () => {
	sessionStorage.removeItem("filtersOpen");
});

$(".filter-toggle").bind("click", () => {
	toggleFilters();
});

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

function toggleSrc() {
	if ($("#src-input").val() == 0) {
		setSrc(1);
	} else {
		setSrc(0);
	}
	console.log($("#src-input").val());
}

$("#language-button").bind("click", () => {
	// swap class lists of flag1 and flag2
	let flag1 = $("#flag1");
	let flag2 = $("#flag2");
	let temp = flag1.attr("class");
	flag1.attr("class", flag2.attr("class"));
	flag2.attr("class", temp);

	toggleSrc();
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
		translate();
	});
});
