// function that selects the correct match option
function toggleMatch(matchVal) {
	$("#term-input").val(matchVal);

	if (!$("#" + matchVal).hasClass("search-option-selected")) {
		$(".search-option").removeClass("search-option-selected");
		$("#" + matchVal).addClass("search-option-selected");
	}
}

// function that toggles the filter menu
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

// function that toggles a word's info menu
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
