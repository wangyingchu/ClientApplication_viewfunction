define({
//begin v1.x content
		next: "Seuraava",
		previous: "Edellinen",
		finish: "Valmis",
		cancel: "Peruuta",
		save: "Tallenna",
		// for accordion wizard
		leadingOverflowLabel: "${count} lisää",
		trailingOverflowLabel: "${count} lisää",
		a11yLabel: "Monivaiheinen ohjattu toiminto",
		accordionAnnouncement: "Monivaiheinen ohjattu toiminto. Avaa ohje painamalla näppäinyhdistelmää ALT+F12.  ",
		accordionHelp: "Monivaiheisen ohjatun toiminnon vakiotila. "
					 + "Ilmoita nykyinen vaihe painamalla näppäinyhdistelmää ALT+ENTER tai ALT+VÄLINÄPPÄIN. "
					 + "Tarkasta nykyinen ja edelliset ohjatun toiminnon vaiheet painamalla näppäinyhdistelmää ALT+PAGE UP. Tarkasta nykyisen vaiheen "
					 + "jälkeen tulevat ohjatun toiminnon vaiheet painamalla näppäinyhdistelmää ALT+PAGE DOWN. Siirry seuraavaan ja edelliseen "
					 + "ohjatun toiminnon vaiheeseen näppäinyhdistelmällä ALT+NUOLINÄPPÄIMET. Siirry ohjatun toiminnon ensimmäiseen "
					 + "toimintopainikkeeseen painamalla näppäinyhdistelmää ALT+END. Siirrä kohdistus seuraavaan ja edelliseen elementtiin painamalla SARKAIN-näppäintä ja VAIHTO+SARKAIN-näppäinyhdistelmää.  ",
		leadingReviewHelp: "Monivaiheisen ohjatun toiminnon edeltävien vaiheiden tarkastelutila.  "
					+ "Ilmoita nykyinen vaihe painamalla näppäinyhdistelmää ALT+ENTER tai ALT+VÄLINÄPPÄIN.  "
					+ "Peruuta edeltävien vaiheiden tarkastelutila painamalla ESCAPE-näppäintä tai ALT+PAGE UP -näppäinyhdistelmää, jolloin "
					+ "kohdistus palaa heti ohjatun toiminnon nykyiseen vaiheeseen. "
					+ "Peruuta edeltävien vaiheiden tarkastelutila näppäinyhdistelmällä ALT+PAGE DOWN ja vaihda seuraavien vaiheiden tarkastelutilaan.  "
					+ "Edeltävien vaiheiden tarkastelutilassa voit siirtää kohdistusta ohjatun toiminnon nykyisen ja edellisten vaiheiden "
					+ "otsikoiden välillä painamalla nuolinäppäimiä.  "
					+ "Peruuta edeltävien vaiheiden tarkastelutila ja siirrä kohdistus ohjatun toiminnon ensimmäiseen toimintopainikkeeseen painamalla näppäinyhdistelmää ALT+END.  "
					+ "Voit siirtää kohdistusta normaalisti painamalla SARKAIN-näppäintä tai VAIHTO+SARKAIN-näppäinyhdistelmää. "
					+ "Jos kohdistus siirtyy pois ohjatun toiminnon edeltävien vaiheiden otsikoista, edeltävien vaiheiden tarkastelutila "
					+ "sulkeutuu.  ",
		trailingReviewHelp: "Monivaiheisen ohjatun toiminnon seuraavien vaiheiden tarkastelutila.  "
					+ "Ilmoita nykyinen vaihe painamalla näppäinyhdistelmää ALT+ENTER tai ALT+VÄLINÄPPÄIN.  "
					+ "Peruuta seuraavien vaiheiden tarkastelutila painamalla ESCAPE-näppäintä tai ALT+PAGE DOWN -näppäinyhdistelmää, jolloin "
					+ "kohdistus palaa heti ohjatun toiminnon nykyiseen vaiheeseen.  "
					+ "Peruuta seuraavien vaiheiden tarkastelutila näppäinyhdistelmällä ALT+PAGE UP ja vaihda edeltävien vaiheiden tarkastelutilaan.  "
					+ "Seuraavien vaiheiden tarkastelutilassa voit siirtää kohdistusta ohjatun toiminnon "
					+ "nykyistä vaihetta seuraavien vaiheiden otsikoiden välillä painamalla nuolinäppäimiä.  "
					+ "Peruuta seuraavien vaiheiden tarkastelutila ja siirrä kohdistus ohjatun toiminnon ensimmäiseen toimintopainikkeeseen painamalla näppäinyhdistelmää ALT+END.  "
					+ "Voit siirtää kohdistusta normaalisti painamalla SARKAIN-näppäintä tai VAIHTO+SARKAIN-näppäinyhdistelmää.  Jos kohdistus siirtyy pois "
					+ "ohjatun toiminnon seuraavien vaiheiden otsikoista, seuraavien vaiheiden tarkastelutila sulkeutuu.  ",
		leadingReviewModeAnnouncement: "Monivaiheisen ohjatun toiminnon edeltävien vaiheiden tarkastelutila.  Avaa ohje painamalla näppäinyhdistelmää ALT+F12.  Ohjatun toiminnon päävaiheita on ${count} "
					+ "(nykyinen päävaihe ja edeltävät päävaiheet).  ",
		trailingReviewModeAnnouncement: "Monivaiheisen ohjatun toiminnon seuraavien vaiheiden tarkastelutila.  Avaa ohje painamalla näppäinyhdistelmää ALT+F12.  Ohjatun toiminnon päävaiheita on ${count} "
					+ "nykyisen päävaiheen jälkeen.  ",
		leadingReviewModeWithSubstepsAnnouncement: "Monivaiheisen ohjatun toiminnon edeltävien vaiheiden tarkastelutila.  Avaa ohje painamalla näppäinyhdistelmää ALT+F12.  Ohjatun toiminnon päävaiheita on ${mainCount} "
					+ "(nykyinen päävaihe ja edeltävät päävaiheet). Nykyisellä päävaiheella on ${count} alivaihetta "
					+ "(nykyinen vaihe ja edeltävät vaiheet).  ",
		trailingReviewModeWithSubstepsAnnouncement: "Monivaiheisen ohjatun toiminnon seuraavien vaiheiden tarkastelutila.  Avaa ohje painamalla näppäinyhdistelmää ALT+F12.  Ohjatun toiminnon päävaiheita on ${mainCount} "
					+ "nykyisen päävaiheen jälkeen. Nykyisellä päävaiheella on ${count} alivaihetta "
					+ "nykyisen vaiheen jälkeen.  ",
		trailingReviewOnLastError: "Olet ohjatun toiminnon viimeisessä vaiheessa.  Seuraavien vaiheiden tarkastelutoiminto ei ole käytettävissä.  ",
		nextOnInvalidError: "Et voi siirtyä seuraavaan vaiheeseen, ennen kuin olet tehnyt nykyisen vaiheen valmiiksi.  ",
		nextOnLastError: "Et voi siirtyä seuraavaan vaiheeseen, koska olet viimeisessä käytettävissä olevassa vaiheessa.  ",
		previousOnFirstError: "Et voi siirtyä edelliseen vaiheeseen, koska olet ensimmäisessä käytettävissä olevassa vaiheessa.  ",
		currentMainStepAnnouncement: "Nykyinen päävaihe on ${index}. ${count} vaiheesta, ja sen otsikko on ${title}.  ",
		currentSubstepAnnouncement: "Nykyinen alivaihe on ${index}. ${count} vaiheesta, ja sen otsikko on ${title}.  ",
		stepChangeAnnouncment: "Ohjatun toiminnon vaihe on muutettu.  ",		
		reviewStepAnnouncement: "Tarkastelet ${index}. päävaihetta ${count} vaiheesta, ja sen otsikko on ${title}.  ",
		reviewStepCurrentAnnouncement: "Tämä on nykyinen päävaihe.  ",
		reviewStepVisitedAnnouncement: "Tämä päävaihe on merkitty valmiiksi.  ",
		reviewStepDisabledAnnouncement: "Tämä päävaihe on tällä hetkellä poissa käytöstä.  ",
		reviewStepClickAnnouncement: "Palaa tähän vaiheeseen painamalla ENTER- tai VÄLI-näppäintä.  ",
		reviewParentStepClickAnnouncement: "Palaa tämän vaiheen alkuun painamalla ENTER- tai VÄLI-näppäintä.  ",
		reviewStepUnvisitedAnnouncement: "Tämä päävaihe on tällä hetkellä keskeneräinen.  ",
		reviewStepStartedAnnouncement: "Tämä päävaihe on aloitettu, mutta se ei ole vielä kokonaan valmis.  ",
		reviewSubstepAnnouncement: "Tarkastelet ${index}. alivaihetta ${count} vaiheesta, ja sen otsikko on ${title}.  Tämä on päävaiheen ${mainIndex} (yhteensä ${mainCount} vaihetta) alivaihe, ja päävaiheen otsikko on ${mainTitle}.  ",
		reviewSubstepCurrentAnnouncement: "Tämä on nykyinen alivaihe.  ",
		reviewSubstepVisitedAnnouncement: "Tämä alivaihe on merkitty valmiiksi.  ",
		reviewSubstepDisabledAnnouncement: "Tämä alivaihe on tällä hetkellä poissa käytöstä.  ",

		reviewSubstepClickAnnouncement: "Palaa tähän alivaiheeseen painamalla ENTER- tai VÄLI-näppäintä.  ",
		reviewSubstepUnvisitedAnnouncement: "Tämä alivaihe on tällä hetkellä keskeneräinen.  "
});

