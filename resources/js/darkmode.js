// borrowed from: https://codepen.io/kevinpowell/pen/EMdjOV

// load the config.json file
const config = await $.getJSON("config/config.json");

let darkMode = localStorage.getItem("darkMode");
const prefersDarkMode = window.matchMedia("(prefers-color-scheme:dark)").matches;

const enableDarkMode = () => {
	document.body.classList.add("darkmode");
	localStorage.setItem("darkMode", "enabled");
	$("#dark-mode-toggle").html(config.text.lightTheme);
	$("#logo-div").css("background-image", `url('config/img/${config.options.logoDark}')`);
};

const disableDarkMode = () => {
	document.body.classList.remove("darkmode");
	localStorage.setItem("darkMode", "disabled");
	$("#dark-mode-toggle").html(config.text.darkTheme);
	$("#logo-div").css("background-image", `url('config/img/${config.options.logoLight}')`);
};

if (darkMode === "enabled" || (darkMode !== "disabled" && prefersDarkMode)) {
	enableDarkMode();
}

$("#dark-mode-toggle").bind("click", () => {
	darkMode = localStorage.getItem("darkMode");
	if (darkMode !== "enabled") {
		enableDarkMode();
	} else {
		disableDarkMode();
	}
});
