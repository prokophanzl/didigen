function checkCantons(canton) {
	if (!urlParams.get(canton)) {
		cantonsSet--;
	} else if (urlParams.get(canton) == "on") {
		$("#" + canton).prop("checked", true);
	}
}
function toggleMatch(matchVal) {
	$("#term-input").val(matchVal);

	if (!$("#" + matchVal).hasClass("search-option-selected")) {
		$(".search-option").removeClass("search-option-selected");
		$("#" + matchVal).addClass("search-option-selected");
	}
}

function toggleFilters() {
	const filtersOpen = sessionStorage.getItem("filtersOpen");
	const filterContainer = $("#filter-container");

	if (filtersOpen) {
		filterContainer.css("display", "none");
		sessionStorage.removeItem("filtersOpen");
	} else {
		filterContainer.css("display", "block");
		sessionStorage.setItem("filtersOpen", true);
	}
}

function toggle(infoId) {
	const thisMenu = $("#" + infoId);
	const thisToggle = $("#" + infoId + "-menu");
	const g = $("#" + infoId + "-g");
	const sg = $("#" + infoId + "-sg");

	const menuOpen = thisToggle.hasClass("menu-engaged");

	if (menuOpen) {
		thisMenu.removeClass("info-display");
		thisToggle.removeClass("menu-engaged");
		g.css("background", "var(--background)");
		g.css("--inset-shadow-color", "var(--background)");
		sg.css("display", "block");
	} else {
		thisMenu.addClass("info-display");
		thisToggle.addClass("menu-engaged");
		g.css("background", "var(--accent)");
		g.css("--inset-shadow-color", "var(--accent)");
		sg.css("display", "none");
	}
}

const urlParams = new URLSearchParams(window.location.search);

const cantons = ["ag", "ar", "ai", "bl", "bs", "be", "fr", "ge", "gl", "gr", "ju", "lu", "ne", "nw", "ow", "sh", "sz", "so", "sg", "ti", "tg", "ur", "vd", "vs", "zg", "zh", "xx"];

let cantonsSet = cantons.length;
let filterCounter = 0;

cantons.forEach((canton) => checkCantons(canton));

if (cantonsSet == 0) {
	$(".checkbox-canton").prop("checked", true);
} else {
	filterCounter++;
}

if (urlParams.get("word")) {
	$("#word-input").val(urlParams.get("word"));
	$("#word-searched").text(urlParams.get("word"));
}

if (urlParams.get("match")) {
	$("#term-input").value = urlParams.get("match");
	toggleMatch(urlParams.get("match"));
}

if (sessionStorage.getItem("filtersOpen")) {
	$("#filter-container").css("display", "block");
}

filtersActive = $("#filters-active");
if (filterCounter == 0) {
	filtersActive.text("keine");
} else {
	filtersActive.text(filterCounter);
}
