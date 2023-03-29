$("#submit").bind("click", () => {
	sessionStorage.removeItem("filtersOpen");
});

$(".filter-toggle").bind("click", () => {
	toggleFilters();
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
