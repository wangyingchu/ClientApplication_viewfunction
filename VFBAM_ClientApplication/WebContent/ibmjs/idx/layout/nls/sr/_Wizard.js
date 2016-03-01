define({
//begin v1.x content
		next: "Sledeće",
		previous: "Prethodno",
		finish: "Dovrši",
		cancel: "Otkaži",
		save: "Sačuvaj",
		// for accordion wizard
		leadingOverflowLabel: "${count} Više",
		trailingOverflowLabel: "${count} Više",
		a11yLabel: "Čarobnjak u više koraka",
		accordionAnnouncement: "Čarobnjak u više koraka.  Pritisnite ALT+F12 za pomoć. ",
		accordionHelp: "Standardni režim čarobnjaka u više koraka.  "
					 + "Koristite ALT+ENTER ili ALT+RAZMAKNICA za saopštavanje trenutnog koraka.  "
					 + "Koristite ALT+PAGE UP za pregled prethodnih i trenutnih koraka čarobnjaka.  Koristite ALT+PAGE DOWN za pregled "
					 + "koraka čarobnjaka koji slede nakon trenutnog koraka.  Koristite ALT + ARROW KEYS za kretanje "
					 + "kroz sledeće i prethodne korake čarobnjaka.  Koristite ALT+END za skok na fokus prvog "
					 + "dugmeta radnje čarobnjaka.  Koristite TAB i SHIFT+TAB tastere za kretanje fokusa kroz sledeće i prethodne elemente. ",
		leadingReviewHelp: "Čarobnjak u više koraka sa vodećim režimom pregleda.  "
					+ "Koristite ALT+ENTER ili ALT+RAZMAKNICA za saopštavanje trenutnog koraka.  "
					+ "Koristite taster ESCAPE ili ALT+PAGE UP za otkazivanje vodećeg režima pregleda i trenutni povratak "
					+ "fokusa na aktuelni korak čarobnjaka.  "
					+ "Pritisnite ALT+PAGE DOWN za otkazivanje vodećeg režima pregleda i prebacivanje na prateći režim pregleda.  "
					+ "Dok ste u vodećem režimu pregleda, koristite tastere strelica za pomeranje fokusa kroz "
					+ "naslove prethodnih i trenutnih koraka čarobnjaka. "
					+ "Koristite ALT+END za otkazivanje vodećeg režima pregleda i skok fokusa na prvo dugme radnje čarobnjaka.  "
					+ "Koristite tastere TAB i SHIFT+TAB za standardnu navigaciju fokusa.  "
					+ "Ako fokus prelazi izvan naslova koraka vodećeg čarobnjaka, vodeći režim pregleda "
					+ "će biti otkazan. ",
		trailingReviewHelp: "Prateći režim pregleda čarobnjaka u više koraka.  "
					+ "Koristite ALT+ENTER ili ALT+RAZMAKNICA za saopštavanje trenutnog koraka.  "
					+ "Koristite taster ESCAPE ili ALT+PAGE DOWN za otkazivanje režima pregleda i trenutni povratak "
					+ "fokusa na aktuelni korak čarobnjaka.  "
					+ "Pritisnite ALT+PAGE UP za otkazivanje pratećeg režima pregleda i prebacivanje na vodeći režim pregleda.  "
					+ "Dok ste u pratećem režimu pregleda, koristite tastere strelica za pomeranje fokusa kroz "
					+ "naslove koraka čarobnjaka koji slede nakon trenutnog koraka.  "
					+ "Koristite ALT+END za otkazivanje pratećeg režima pregleda i skok fokusa na prvo dugme radnje čarobnjaka.  "
					+ "Koristite tastere TAB i SHIFT+TAB za standardnu navigaciju fokusa.  Ako fokus prelazi izvan "
					+ "naslova koraka pratećeg čarobnjaka, prateći režim pregleda će biti otkazan. ",
		leadingReviewModeAnnouncement: "Čarobnjak u više koraka sa vodećim režimom pregleda.  Pritisnite ALT+F12 za pomoć. Postoji ${count} glavnih koraka čarobnjaka "
					+ "koji vode aktuelnog glavnog koraka, uključujući i njega. ",
		trailingReviewModeAnnouncement: "Prateći režim pregleda čarobnjaka u više koraka.  Pritisnite ALT+F12 za pomoć. Postoji ${count} pratećih "
					+ "koraka glavnog čarobnjaka koji slede nakon trenutnog glavnog koraka. ",
		leadingReviewModeWithSubstepsAnnouncement: "Čarobnjak u više koraka sa vodećim režimom pregleda.  Pritisnite ALT+F12 za pomoć. Postoji ${mainCount} "
					+ "glavnih koraka čarobnjaka koji vode do aktuelnog glavnog koraka, uključujući i njega.  Trenutni glavni korak ima ${count} potkoraka "
					+ "koji vode do aktuelnog koraka, uključujući i njega. ",
		trailingReviewModeWithSubstepsAnnouncement: "Prateći režim pregleda čarobnjaka u više koraka.  Pritisnite ALT+F12 za pomoć. Postoji ${mainCount} "
					+ "pratećih koraka glavnog čarobnjaka koji slede nakon trenutnog glavnog koraka.  Trenutni glavni korak ima ${count} potkoraka koji slede nakon "
					+ "trenutnog koraka. ",
		trailingReviewOnLastError: "Trenutno ste na zadnjem koraku čarobnjaka.  Režim pratećeg pregleda nije dostupan. ",
		nextOnInvalidError: "Ne možete ići na sledeći korak dok ne završite aktuelni korak. ",
		nextOnLastError: "Ne možete ići na sledeći korak jer ste na poslednjem dostupnom koraku. ",
		previousOnFirstError: "Ne možete ići na prethodni korak jer ste na prvom dostupnom koraku. ",
		currentMainStepAnnouncement: "Trenutni glavni korak je ${index} od ${count}, koji se zove ${title}. ",
		currentSubstepAnnouncement: "Trenutni potkorak je ${index} od ${count}, koji se zove ${title}. ",
		stepChangeAnnouncment: "Korak čarobnjaka je promenjen. ",		
		reviewStepAnnouncement: "Pregled glavnog koraka ${index} od ${count}, koji se zove ${title}. ",
		reviewStepCurrentAnnouncement: "Ovo je trenutni glavni korak. ",
		reviewStepVisitedAnnouncement: "Ovaj glavni korak je označen kao dovršen. ",
		reviewStepDisabledAnnouncement: "Ovaj glavni korak je trenutno onemogućen. ",
		reviewStepClickAnnouncement: "Pritisnite ENTER ili SPACE za povratak na ovaj korak. ",
		reviewParentStepClickAnnouncement: "Pritisnite ENTER ili SPACE za povratak na početak ovog koraka. ",
		reviewStepUnvisitedAnnouncement: "Ovaj glavni korak je trenutno nedovršen. ",
		reviewStepStartedAnnouncement: "Ovaj glavni korak je započet ali nije u potpunosti dovršen. ",
		reviewSubstepAnnouncement: "Pregled potkoraka ${index} od ${count}, koji se zove ${title}.  Ovo je potkorak glavnog koraka ${mainIndex} od ${mainCount}, koji se zove ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Ovo je trenutni potkorak. ",
		reviewSubstepVisitedAnnouncement: "Ovaj potkorak je označen kao dovršen. ",
		reviewSubstepDisabledAnnouncement: "Ovaj potkorak je trenutno onemogućen. ",

		reviewSubstepClickAnnouncement: "Pritisnite ENTER ili SPACE za povratak na ovaj potkorak. ",
		reviewSubstepUnvisitedAnnouncement: "Ovaj potkorak je trenutno nedovršen. "
});

