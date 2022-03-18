// borrowed from: https://codepen.io/kevinpowell/pen/EMdjOV

let darkMode = localStorage.getItem("darkMode");
const prefersDarkMode = window.matchMedia("(prefers-color-scheme:dark)").matches;

const enableDarkMode = () => {
	document.body.classList.add("darkmode");
	localStorage.setItem("darkMode", "enabled");
	$("#dark-mode-toggle").html("Hellmodus");
};

const disableDarkMode = () => {
	document.body.classList.remove("darkmode");
	localStorage.setItem("darkMode", "disabled");
	$("#dark-mode-toggle").html("Dunkelmodus");
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
