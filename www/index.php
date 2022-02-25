<!DOCTYPE html>
<html>

<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width'>
	<link rel='stylesheet' type='text/css' href='resources/styles.css'>
	<link rel='icon' type='image/png' href='/resources/logo/logo_58.png'>
	<title>Deutsch-Schweizerdeutsches Wörterbuch</title>
	<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'></script>
</head>

<body>
	<section class='headSection'>
		<form method='get' autocomplete='off'>
			<h1 class='mainTitle'>Deutsch-Schweizerdeutsches Wörterbuch</h1>
			<div class='flexorP'>
				<div class='inputField'>
					<div class='logoDiv'>DS<br>W</div>
					<div class='inputWrapper'>
						<input type='text' name='word' placeholder='Deutsch → Schweizerdeutsch' id='wordInput' class='wordInput' />
					</div>
				</div>
				<div class='submitButtons'>
					<div id='filterButton' class='filterButton' onclick='toggleFilters()'>
					</div>
					<div class='flex1'>
						<input type='submit' class='submit' id='submit' value='übersetzen' onclick="sessionStorage.removeItem('filtersOpen');">
					</div>
				</div>
			</div>
			<div id='filterContainer' class='filterContainer'>
				<div class='filterTitleDiv'>
					Suchbegriff
				</div>
				<input type='text' name='match' id='termInput' class='termInput' value='begins'>
				<div class='searchOptionContainer filterSub'>
					<div>Wort</div>
					<div class='searchOptionButtonContainer'>
						<div class='searchOption searchOptionSelected' onclick='toggleMatch("begins");' id='begins'>beginnt mit</div>
						<div class='searchOption' onclick='toggleMatch("match");' id='match'>ist</div>
						<div class='searchOption' onclick='toggleMatch("contains");' id='contains'>enthält</div>
					</div>
					<div>Suchbegriff</div>
				</div>
				<div class='filterTitleDiv'>
					Kanton
					<small>
						(<a class='link' onclick='cantons.forEach(canton => document.getElementById(canton).checked = true);'>alle auswählen</a> | 
						<a class='link' onclick='cantons.forEach(canton => document.getElementById(canton).checked = false);'>keine auswählen</a>)
					</small>
				</div>
				<div class='cantonContainer filterSub'>
					<div>
						<label>
							Aargau
							<input type='checkbox' name='ag' id='ag'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Appenzell Ausserrhoden
							<input type='checkbox' name='ar' id='ar'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Appenzell Inerrhoden
							<input type='checkbox' name='ai' id='ai'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Basel-Landschaft
							<input type='checkbox' name='bl' id='bl'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Basel-Stadt
							<input type='checkbox' name='bs' id='bs'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Bern
							<input type='checkbox' name='be' id='be'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Freiburg
							<input type='checkbox' name='fr' id='fr'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Genf
							<input type='checkbox' name='ge' id='ge'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Glarus
							<input type='checkbox' name='gl' id='gl'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Graubünden
							<input type='checkbox' name='gr' id='gr'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Jura
							<input type='checkbox' name='ju' id='ju'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Luzern
							<input type='checkbox' name='lu' id='lu'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Neuenburg
							<input type='checkbox' name='ne' id='ne'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Nidwalden
							<input type='checkbox' name='nw' id='nw'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Obwalden
							<input type='checkbox' name='ow' id='ow'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Schaffhausen
							<input type='checkbox' name='sh' id='sh'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Schwyz
							<input type='checkbox' name='sz' id='sz'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Solothurn
							<input type='checkbox' name='so' id='so'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							St. Gallen
							<input type='checkbox' name='sg' id='sg'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Tessin
							<input type='checkbox' name='ti' id='ti'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Thurgau
							<input type='checkbox' name='tg' id='tg'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Uri
							<input type='checkbox' name='ur' id='ur'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Waadt
							<input type='checkbox' name='vd' id='vd'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Wallis
							<input type='checkbox' name='vs' id='vs'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Zug
							<input type='checkbox' name='zg' id='zg'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Zürich
							<input type='checkbox' name='zh' id='zh'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
					<div>
						<label>
							Unbekannt
							<input type='checkbox' name='xx' id='xx'>
							<span class='checkmarkSpan'></span>
						</label>
					</div>
				</div>
				<div class='closeFilters'>
					<span class='link' onclick='toggleFilters();'>schliessen</span>
				</div>
			</div>
		</form>
	</section>
	<section class='bodySection'>
		<h3>3 Suchergebnisse für &laquo;&nbsp;<span id='wordSearched'></span>&nbsp;&raquo;</span> <span class='primary50 normal-weight'>(145 Datenpunkte, <span id='filtersActive'></span> Filter aktiv)</span></h1>
		<div class='wordWrapper' style='--matches: 6; --count-first: 5'>
			<div class='wordHeader'>
				<div class='wordMenu' onclick='toggle("Weihnachten")' id='WeihnachtenMenu'></div>
				<div class='wordGerman headerWord' id='WeihnachtenG'>
					<span class='wordGermanSpan breakNoDis'>Weihnachten</span><span
						class='primary50 matchesGermanSpan breakDis'> (6)</span>
				</div>
				<div class='wordSwissGerman headerWord' id='WeihnachtenSG'>
					<span class='wordSwissGermanSpan breakNoDis'>Wiehnachte</span><span
						class='primary50 matchesSwissGermanSpan breakDis'>(5/6)</span>
				</div>
			</div>
			<div class='wordMoreInfo infoBar' id='Weihnachten'>
				<div class='translationBarWrapper'>
					<div style='--count: 5'>
						<span class='translationContainer'>
							<span class='translation'>Wiehnachte</span>
							<span class='translationCount primary50'> 5</span>
						</span>
					</div>
					<div style='--count: 1'>
						<span class='translationContainer'>
							<span class='translation'>Wienachte</span>
							<span class='translationCount primary50'> 1</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class='wordWrapper' style='--matches: 37; --count-first: 19'>
			<!-- weil: 37 treffen / 19x will, 12x wil, 6x well -->
			<div class='wordHeader'>
				<div class='wordMenu' onclick='toggle("weil")' id='weilMenu'></div>
				<div class='wordGerman headerWord' id='weilG'>
					<span class='wordGermanSpan breakNoDis'>weil</span><span
						class='primary50 matchesGermanSpan breakDis'> (37)</span>
				</div>
				<div class='wordSwissGerman headerWord' id='weilSG'>
					<span class='wordSwissGermanSpan breakNoDis'>will</span><span
						class='primary50 matchesSwissGermanSpan breakDis'>(19/37)</span>
				</div>
			</div>
			<div class='wordMoreInfo infoBar' id='weil'>
				<div class='translationBarWrapper'>
					<div style='--count: 19'>
						<span class='translationContainer'>
							<span class='translation'>will</span>
							<span class='translationCount primary50'> 19</span>
						</span>
					</div>
					<div style='--count: 12'>
						<span class='translationContainer'>
							<span class='translation'>wil</span>
							<span class='translationCount primary50'> 12</span>
						</span>
					</div>
					<div style='--count: 6'>
						<span class='translationContainer'>
							<span class='translation'>well</span>
							<span class='translationCount primary50'> 6</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class='wordWrapper' style='--matches: 102; --count-first: 53'>
			<!-- wir: 102 treffen / 53* mir, 37* mer, 7* mr, 4* mier -->
			<div class='wordHeader'>
				<div class='wordMenu' onclick='toggle("wir")' id='wirMenu'></div>
				<div class='wordGerman headerWord' id='wirG'>
					<span class='wordGermanSpan breakNoDis'>wir</span><span
						class='primary50 matchesGermanSpan breakDis'> (102)</span>
				</div>
				<div class='wordSwissGerman headerWord' id='wirSG'>
					<span class='wordSwissGermanSpan breakNoDis'>mir</span><span
						class='primary50 matchesSwissGermanSpan breakDis'>(53/102)</span>
				</div>
			</div>
			<div class='wordMoreInfo infoBar' id='wir'>
				<div class='translationBarWrapper'>
					<div style='--count: 53'>
						<span class='translationContainer'>
							<span class='translation'>mir</span>
							<span class='translationCount primary50'> 53</span>
						</span>
					</div>
					<div style='--count: 37'>
						<span class='translationContainer'>
							<span class='translation'>mer</span>
							<span class='translationCount primary50'> 37</span>
						</span>
					</div>
					<div style='--count: 7'>
						<span class='translationContainer'>
							<span class='translation'>mr</span>
							<span class='translationCount primary50'> 7</span>
						</span>
					</div>
					<div style='--count: 4'>
						<span class='translationContainer'>
							<span class='translation'>mier</span>
							<span class='translationCount primary50'> 4</span>
						</span>
					</div>
				</div>
			</div>
		</div>

	</section>
	<section class='footerSection'>
		<hr>
		<span id='copyright'>&copy; Prokop Hanzl</span><br>
		<a href='https://github.com/prokophanzl' target='_blank'>GitHub</a> | <a
			href='mailto:phanzl@dustah.com'>Kontakt</a>
	</section>

	<script type='text/javascript'>
		const urlParams = new URLSearchParams(window.location.search);

		var cantons = ['ag','ar','ai','bl','bs','be','fr','ge','gl','gr','ju','lu','ne','nw','ow','sh','sz','so','sg','ti','tg','ur','vd','vs','zg','zh','xx'];
		
		var cantonsSet = cantons.length;
		var filterCounter = 0;

		function checkCantons(canton) {
			if (!urlParams.get(canton)) {
				cantonsSet--;
			} else 
			if (urlParams.get(canton) == 'on') {
				document.getElementById(canton).checked = true;
			}
		}

		cantons.forEach(canton => checkCantons(canton));

		// if (cantonsSet == 0) {
		// 	cantons.forEach(canton => document.getElementById(canton).checked = true);
		// } else {
		if (cantonsSet != 0) {
			filterCounter ++;
		}

		if (urlParams.get('word')) {
			document.getElementById('wordInput').value = urlParams.get('word');
			$('#wordSearched').text(urlParams.get('word'))
		}

		if(urlParams.get('match')) {
			$('#termInput').value = urlParams.get('match');
			toggleMatch(urlParams.get('match'));
		}

		if (sessionStorage.getItem('filtersOpen')) {
			document.getElementById('filterContainer').style.display = 'block';
		}

		filtersActive = $('#filtersActive');
		if (filterCounter == 0) {
			filtersActive.text('keine');
		} else {
			filtersActive.text(filterCounter);
		}

		function toggleMatch(matchVal) {
			document.getElementById('termInput').value = matchVal;

			if (!document.getElementById(matchVal).classList.contains('searchOptionSelected')) {
				$('.searchOption').removeClass('searchOptionSelected');
				$('#' + matchVal).addClass('searchOptionSelected');
			}
		}

		function toggleFilters() {
			var filtersOpen = sessionStorage.getItem('filtersOpen');
			const filterContainer = document.getElementById('filterContainer');
			// const headSection = document.getElementById('headSection');
			// const filterButton = document.getElementById('filterButton');

			if (filtersOpen) {
				filterContainer.style.display = 'none';
				sessionStorage.removeItem('filtersOpen');
			} else {
				filterContainer.style.display = 'block';
				sessionStorage.setItem('filtersOpen', true);
			}
		}

		function toggle(infoId) {
			const thisMenu = document.getElementById(infoId);
			const thisToggle = document.getElementById(infoId + 'Menu');
			const g = document.getElementById(infoId + 'G');
			const sg = document.getElementById(infoId + 'SG');
			const menuOpen = thisToggle.classList.contains('menuEngaged');

			if (menuOpen) {
				thisMenu.classList.remove('infoDisplay');
				thisToggle.classList.remove('menuEngaged');
				g.style.background = 'var(--background)';
				g.style.setProperty('--inset-shadow-color', 'var(--background)');
				sg.style.display = 'block';
			} else {
				thisMenu.classList.add('infoDisplay');
				thisToggle.classList.add('menuEngaged');
				g.style.background = 'var(--accent)';
				g.style.setProperty('--inset-shadow-color', 'var(--accent)');
				sg.style.display = 'none';
			}
		}
	</script>
</body>

</html>