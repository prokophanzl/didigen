<!DOCTYPE html>
<html lang="de">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;700&display=swap" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="resources/styles.css">
	<link rel="icon" type="image/png" href="/resources/logo/logo_58.png">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<title>Deutsch-Schweizerdeutsches Wörterbuch</title>
</head>

<body>
	<section class="head-section">
		<form method="get" autocomplete="off">
			<h1 class="main-title">Deutsch-Schweizerdeutsches Wörterbuch</h1>
			<div class="flexor-parent">
				<div class="input-field">
					<div class="logo-div">DS<br>W</div>
					<div class="input-wrapper">
						<input type="text" name="word" placeholder="Deutsch → Schweizerdeutsch" id="word-input" class="word-input" required />
					</div>
				</div>
				<div class="submit-buttons">
					<div id="filter-button" class="filter-button" onclick="toggleFilters()"></div>
					<div class="flex1 focus-outline">
						<input type="submit" class="submit" id="submit" value="übersetzen" onclick="sessionStorage.removeItem('filtersOpen');">
					</div>
				</div>
			</div>
			<div id="filter-container" class="filter-container">
				<div class="filter-title-div">
					Suchbegriff
				</div>
				<input type="text" name="match" id="term-input" class="term-input" value="begins">
				<div class="search-option-container filter-sub">
					<div>Wort</div>
					<div class="search-option-button-container">
						<div class="search-option search-option-selected" onclick="toggleMatch('begins');" id="begins">beginnt mit</div>
						<div class="search-option" onclick="toggleMatch('match');" id="match">ist</div>
						<div class="search-option" onclick="toggleMatch('contains');" id="contains">enthält</div>
					</div>
					<div>Suchbegriff</div>
				</div>
				<div class="filter-title-div">
					Kanton
					<small>
						(<a class="link" onclick="$('.checkbox-canton').prop('checked', true);">alle auswählen</a> | 
						<a class="link" onclick="$('.checkbox-canton').prop('checked', false);">keine auswählen</a>)
					</small>
				</div>
				<div class="canton-container filter-sub">
					<div>
						<label>
							Aargau
							<input type="checkbox" name="ag" id="ag" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Appenzell Ausserrhoden
							<input type="checkbox" name="ar" id="ar" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Appenzell Inerrhoden
							<input type="checkbox" name="ai" id="ai" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Basel-Landschaft
							<input type="checkbox" name="bl" id="bl" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Basel-Stadt
							<input type="checkbox" name="bs" id="bs" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Bern
							<input type="checkbox" name="be" id="be" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Freiburg
							<input type="checkbox" name="fr" id="fr" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Genf
							<input type="checkbox" name="ge" id="ge" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Glarus
							<input type="checkbox" name="gl" id="gl" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Graubünden
							<input type="checkbox" name="gr" id="gr" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Jura
							<input type="checkbox" name="ju" id="ju" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Luzern
							<input type="checkbox" name="lu" id="lu" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Neuenburg
							<input type="checkbox" name="ne" id="ne" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Nidwalden
							<input type="checkbox" name="nw" id="nw" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Obwalden
							<input type="checkbox" name="ow" id="ow" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Schaffhausen
							<input type="checkbox" name="sh" id="sh" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Schwyz
							<input type="checkbox" name="sz" id="sz" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Solothurn
							<input type="checkbox" name="so" id="so" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							St. Gallen
							<input type="checkbox" name="sg" id="sg" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Tessin
							<input type="checkbox" name="ti" id="ti" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Thurgau
							<input type="checkbox" name="tg" id="tg" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Uri
							<input type="checkbox" name="ur" id="ur" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Waadt
							<input type="checkbox" name="vd" id="vd" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Wallis
							<input type="checkbox" name="vs" id="vs" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Zug
							<input type="checkbox" name="zg" id="zg" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Zürich
							<input type="checkbox" name="zh" id="zh" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
					<div>
						<label>
							Unbekannt
							<input type="checkbox" name="xx" id="xx" class="checkbox-canton">
							<span class="checkmark-span"></span>
						</label>
					</div>
				</div>
				<div class="close-filters">
					<span class="link" onclick="toggleFilters();">schliessen</span>
				</div>
			</div>
		</form>
	</section>
	<section class="body-section">
		<h3>
			3 Suchergebnisse für &laquo;&nbsp;<span id="word-searched"></span>&nbsp;&raquo;
			<span class="primary50 normal-weight">(145 Datenpunkte, <span id="filters-active"></span> Filter aktiv)</span>
		</h3>
		<div id="translation-parent">
			<div class="word-wrapper" style="--matches: 6; --count-first: 5">
				<div class="word-header">
					<div class="word-menu" onclick="toggle('Weihnachten')" id="Weihnachten-menu"></div>
					<div class="word-german header-word" id="Weihnachten-g">
						<span class="word-german-span break-no-dis">Weihnachten</span>
						<span class="primary50 matches-german-span break-dis">(6)</span>
					</div>
					<div class="word-swiss-german header-word" id="Weihnachten-sg">
						<span class="word-swiss-german-span break-no-dis">Wiehnachte</span>
						<span class="primary50 matches-swiss-german-span break-dis">(5/6)</span>
					</div>
				</div>
				<div class="word-more-info info-bar" id="Weihnachten">
					<div class="translation-bar-wrapper">
						<div style="--count: 5">
							<span class="translation-container">
								<span class="translation">Wiehnachte</span>
								<span class="translation-count primary50">5</span>
							</span>
						</div>
						<div style="--count: 1">
							<span class="translation-container">
								<span class="translation">Wienachte</span>
								<span class="translation-count primary50">1</span>
							</span>
						</div>
					</div>
				</div>
			</div>
			
			<div class="word-wrapper" style="--matches: 37; --count-first: 19">
				<div class="word-header">
					<div class="word-menu" onclick="toggle('weil')" id="weil-menu"></div>
					<div class="word-german header-word" id="weil-g">
						<span class="word-german-span break-no-dis">weil</span><span
						class="primary50 matches-german-span break-dis"> (37)</span>
					</div>
					<div class="word-swiss-german header-word" id="weil-sg">
						<span class="word-swiss-german-span break-no-dis">will</span><span
						class="primary50 matches-swiss-german-span break-dis">(19/37)</span>
					</div>
				</div>
				<div class="word-more-info info-bar" id="weil">
					<div class="translation-bar-wrapper">
						<div style="--count: 19">
							<span class="translation-container">
								<span class="translation">will</span>
								<span class="translation-count primary50"> 19</span>
							</span>
						</div>
						<div style="--count: 12">
							<span class="translation-container">
								<span class="translation">wil</span>
								<span class="translation-count primary50"> 12</span>
							</span>
						</div>
						<div style="--count: 6">
							<span class="translation-container">
								<span class="translation">well</span>
								<span class="translation-count primary50"> 6</span>
							</span>
						</div>
					</div>
				</div>
			</div>
			
			<div class="word-wrapper" style="--matches: 102; --count-first: 53">
				<div class="word-header">
					<div class="word-menu" onclick="toggle('wir')" id="wir-menu"></div>
					<div class="word-german header-word" id="wir-g">
						<span class="word-german-span break-no-dis">wir</span><span
						class="primary50 matches-german-span break-dis"> (102)</span>
					</div>
					<div class="word-swiss-german header-word" id="wir-sg">
						<span class="word-swiss-german-span break-no-dis">mir</span><span
						class="primary50 matches-swiss-german-span break-dis">(53/102)</span>
					</div>
				</div>
				<div class="word-more-info info-bar" id="wir">
					<div class="translation-bar-wrapper">
						<div style="--count: 53">
							<span class="translation-container">
								<span class="translation">mir</span>
								<span class="translation-count primary50"> 53</span>
							</span>
						</div>
						<div style="--count: 37">
							<span class="translation-container">
								<span class="translation">mer</span>
								<span class="translation-count primary50"> 37</span>
							</span>
						</div>
						<div style="--count: 7">
							<span class="translation-container">
								<span class="translation">mr</span>
								<span class="translation-count primary50"> 7</span>
							</span>
						</div>
						<div style="--count: 4">
							<span class="translation-container">
								<span class="translation">mier</span>
								<span class="translation-count primary50"> 4</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</section>
	<section class="footer-section">
		<hr>
		<span id="copyright">&copy; 2022 Prokop Hanzl</span>
		<br>
		<a href="https://github.com/prokophanzl" target="_blank">GitHub</a> |
		<a href="https://github.com/ProkopHanzl/dsw/issues/new/choose">Fehler melden</a> |
		<a href="mailto:phanzl@dustah.com">Kontakt</a>
	</section>

	<script src="resources/base.js"></script>
</body>

</html>