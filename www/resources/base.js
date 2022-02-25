function checkCantons(canton) {
    if (!urlParams.get(canton)) {
        cantonsSet--;
    } else 
    if (urlParams.get(canton) == "on") {
        $("#" + canton).prop("checked", true);
    }
}
function toggleMatch(matchVal) {
    $("#termInput").val(matchVal);
    
    if (!$("#" + matchVal).hasClass("searchOptionSelected")) {
        $(".searchOption").removeClass("searchOptionSelected");
        $("#" + matchVal).addClass("searchOptionSelected");
    }
}

function toggleFilters() {
    const filtersOpen = sessionStorage.getItem("filtersOpen");
    const filterContainer = $("#filterContainer");
    
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
    const thisToggle = $("#" + infoId + "Menu");
    const g = $("#" + infoId + "G");
    const sg = $("#" + infoId + "SG");
    
    const menuOpen = thisToggle.hasClass("menuEngaged");
    
    if (menuOpen) {
        thisMenu.removeClass("infoDisplay");
        thisToggle.removeClass("menuEngaged");
        g.css("background", "var(--background)");
        g.css("--inset-shadow-color", "var(--background)");
        sg.css("display", "block");
    } else {
        thisMenu.addClass("infoDisplay");
        thisToggle.addClass("menuEngaged");
        g.css("background", "var(--accent)");
        g.css("--inset-shadow-color", "var(--accent)");
        sg.css("display", "none");
    }
}

const urlParams = new URLSearchParams(window.location.search);

var cantons = [
    "ag",
    "ar",
    "ai",
    "bl",
    "bs",
    "be",
    "fr",
    "ge",
    "gl",
    "gr",
    "ju",
    "lu",
    "ne",
    "nw",
    "ow",
    "sh",
    "sz",
    "so",
    "sg",
    "ti",
    "tg",
    "ur",
    "vd",
    "vs",
    "zg",
    "zh",
    "xx"
];

var cantonsSet = cantons.length;
var filterCounter = 0;

cantons.forEach(canton => checkCantons(canton));

if (cantonsSet == 0) {
    $(".checkbox-canton").prop("checked", true);
} else {
    filterCounter ++;
}

if (urlParams.get("word")) {
    $("#wordInput").val(urlParams.get("word"));
    $("#wordSearched").text(urlParams.get("word"))
}

if(urlParams.get("match")) {
    $("#termInput").value = urlParams.get("match");
    toggleMatch(urlParams.get("match"));
}

if (sessionStorage.getItem("filtersOpen")) {
    $("#filterContainer").css("display", "block");
}

filtersActive = $("#filtersActive");
if (filterCounter == 0) {
    filtersActive.text("keine");
} else {
    filtersActive.text(filterCounter);
}
