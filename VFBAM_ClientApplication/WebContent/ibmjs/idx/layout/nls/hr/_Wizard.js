define({
//begin v1.x content
		next: "Sljedeće",
		previous: "Prethodno",
		finish: "Završi",
		cancel: "Opoziv",
		save: "Spremi",
		// for accordion wizard
		leadingOverflowLabel: "Još ${count}",
		trailingOverflowLabel: "Još ${count}",
		a11yLabel: "Čarobnjak s više koraka",
		accordionAnnouncement: "Čarobnjak s više koraka. Pritisnite ALT+F12 za pomoć. ",
		accordionHelp: "Standardni način čarobnjaka s više koraka. "
					 + "Upotrijebite ALT+ENTER ili ALT+SPACE da biste objavili trenutni korak. "
					 + "Upotrijebite ALT+PAGE UP za pregled prethodnog i trenutnog koraka čarobnjaka.  Upotrijebite ALT+PAGE DOWN za pregled "
					 + "koraka čarobnjaka koji slijede nakon trenutnog koraka čarobnjaka.  Upotrijebite ALT + STRELICE za prelazak "
					 + "na sljedeći i prethodni korak čarobnjaka.  Upotrijebite ALT+END za prebacivanje fokusa na prvi čarobnjakov "
					 + "gumb akcije.  Upotrijebite tipku TAB i SHIFT+TAB za prebacivanje fokusa na sljedeći i prethodni element. ",
		leadingReviewHelp: "Način vodećeg pregleda čarobnjaka s više koraka. "
					+ "Upotrijebite ALT+ENTER ili ALT+SPACE da biste objavili trenutni korak. "
					+ "Upotrijebite ESCAPE ili ALT+PAGE UP za otkazivanje načina vodećeg pregleda i povratak "
					+ "fokusa na trenutni korak čarobnjaka. "
					+ "Pritisnite ALT+PAGE DOWN za opoziv načina vodećeg pregleda i prebacivanje u način pratećeg pregleda.  "
					+ "Dok ste u načinu vodećeg pregleda, upotrijebite tipke sa strelicama za prebacivanje fokusa "
					+ "između naslova prethodnih koraka čarobnjaka i trenutnog koraka. "
					+ "Upotrijebite ALT+END za opoziv načina vodećeg pregleda i prebacivanje fokusa na prvi gumb akcije čarobnjaka.  "
					+ "Upotrijebite TAB i SHIFT+TAB za standardnu navigaciju pomoću fokusa.  "
					+ "Ako se fokus prebaci s vodećih naslova koraka čarobnjaka, otkazat će se način vodećeg "
					+ "pregleda. ",
		trailingReviewHelp: "Način pratećeg pregleda čarobnjaka s više koraka. "
					+ "Upotrijebite ALT+ENTER ili ALT+SPACE da biste objavili trenutni korak. "
					+ "Upotrijebite ESCAPE ili ALT+PAGE DOWN za otkazivanje načina pratećeg pregleda i povratak "
					+ "fokusa na trenutni korak čarobnjaka. "
					+ "Pritisnite ALT+PAGE UP za opoziv načina pratećeg pregleda i prebacivanje u način vodećeg pregleda.  "
					+ "Dok ste u načinu pratećeg pregleda, upotrijebite tipke sa strelicama za prebacivanje fokusa "
					+ "između koraka čarobnjaka koji slijede nakon trenutnog koraka.  "
					+ "Upotrijebite ALT+END za opoziv načina pratećeg pregleda i prebacivanje fokusa na prvi gumb akcije čarobnjaka.  "
					+ "Upotrijebite TAB i SHIFT+TAB za standardnu navigaciju pomoću fokusa.  Ako se fokus prebaci s "
					+ "naslova koraka pratećeg čarobnjaka, otkazat će se način pratećeg pregleda. ",
		leadingReviewModeAnnouncement: "Način vodećeg pregleda čarobnjaka s više koraka. Pritisnite ALT+F12 za pomoć. Postoji ${count} glavnih koraka čarobnjaka "
					+ "koji vode do trenutnog glavnog koraka, uključujući i trenutni glavni korak. ",
		trailingReviewModeAnnouncement: "Način pratećeg pregleda čarobnjaka s više koraka. Pritisnite ALT+F12 za pomoć. Postoji ${count} pratećih "
					+ "glavnih koraka čarobnjaka koji slijede nakon trenutnog glavnog koraka.  ",
		leadingReviewModeWithSubstepsAnnouncement: "Način vodećeg pregleda čarobnjaka s više koraka. Pritisnite ALT+F12 za pomoć. Postoji ${mainCount} "
					+ "glavnih koraka čarobnjaka koji vode do trenutnog glavnog koraka, uključujući i trenutni glavni korak.  Trenutni glavni korak ima ${count} podkoraka "
					+ "koji vode do trenutnog koraka, uključujući i trenutni korak. ",
		trailingReviewModeWithSubstepsAnnouncement: "Način pratećeg pregleda čarobnjaka s više koraka. Pritisnite ALT+F12 za pomoć. Postoji ${mainCount} "
					+ "pratećih glavnih koraka čarobnjaka koji slijede nakon trenutnog glavnog koraka.  Trenutni glavni korak ima ${count} podkoraka koji slijede "
					+ "nakon trenutnog koraka. ",
		trailingReviewOnLastError: "Trenutno ste na posljednjem koraku čarobnjaka.  Način pratećeg pregleda nije dostupan. ",
		nextOnInvalidError: "Ne možete ići na sljedeći korak dok ne završite trenutni korak. ",
		nextOnLastError: "Ne možete ići na sljedeći korak jer ste na posljednjem dostupnom koraku. ",
		previousOnFirstError: "Ne možete ići na prethodni korak jer ste na prvom dostupnom koraku. ",
		currentMainStepAnnouncement: "Trenutni glavni korak je ${index} od ${count}, s nazivom ${title}. ",
		currentSubstepAnnouncement: "Trenutni podkorak je ${index} od ${count}, s nazivom ${title}. ",
		stepChangeAnnouncment: "Promijenjen je korak čarobnjaka. ",		
		reviewStepAnnouncement: "Pregledava se glavni korak ${index} od ${count}, s nazivom ${title}. ",
		reviewStepCurrentAnnouncement: "Ovo je trenutni glavni korak. ",
		reviewStepVisitedAnnouncement: "Ovaj glavni korak je označen kao završen. ",
		reviewStepDisabledAnnouncement: "Ovaj glavni korak je trenutno onemogućen. ",
		reviewStepClickAnnouncement: "Pritisnite ENTER ili SPACE za povratak na ovaj korak. ",
		reviewParentStepClickAnnouncement: "Pritisnite ENTER ili SPACE za povratak na početak ovog koraka. ",
		reviewStepUnvisitedAnnouncement: "Ovaj glavni korak trenutno nije dovršen. ",
		reviewStepStartedAnnouncement: "Ovaj glavni korak je započet, ali nije u cijelosti dovršen. ",
		reviewSubstepAnnouncement: "Pregledava se podkorak ${index} od ${count}, s nazivom ${title}.  Ovo je podkorak glavnog koraka ${mainIndex} od ${mainCount}, s nazivom ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Ovo je trenutni podkorak. ",
		reviewSubstepVisitedAnnouncement: "Ovaj podkorak je označen kao završen. ",
		reviewSubstepDisabledAnnouncement: "Ovaj podkorak je trenutno onemogućen. ",

		reviewSubstepClickAnnouncement: "Pritisnite ENTER ili SPACE za povratak na ovaj podkorak. ",
		reviewSubstepUnvisitedAnnouncement: "Ovaj podkorak trenutno nije dovršen. "
});

