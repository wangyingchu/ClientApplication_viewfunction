define({
//begin v1.x content
		next: "Neste",
		previous: "Forrige",
		finish: "Fullfør",
		cancel: "Avbryt",
		save: "Lagre",
		// for accordion wizard
		leadingOverflowLabel: "${count} flere",
		trailingOverflowLabel: "${count} flere",
		a11yLabel: "Veiviser med flere trinn",
		accordionAnnouncement: "Veiviser med flere trinn. Trykk på ALT+F12 for å få hjelp. ",
		accordionHelp: "Standardmodus for veiviser med flere trinn.  "
					 + "Bruk ALT+ENTER eller ALT+MELLOMROM for å vise gjeldende trinn. "
					 + "Bruk ALT+PAGE UP til å se gjennom tidligere og gjeldende veivisertrinn. Bruk ALT+PAGE DOWN til å "
					 + "se gjennom veivisertrinnene etter gjeldende veivisertrinn. Bruk ALT + PILTASTER til å navigere "
					 + "til neste og forrige veivisertrinn. Bruk ALT+END til å sette fokus til den første av veiviserens "
					 + "handlingsknapper. Bruk TAB og SKIFT+TAB til å flytte fokus til neste og forrige element.  ",
		leadingReviewHelp: "Modus for før-kontroll for veiviser med flere trinn.  "
					+ "Bruk ALT+ENTER eller ALT+MELLOMROM for å vise gjeldende trinn.  "
					+ "Bruk ESC eller ALT+PAGE UP for å avbryte modus for før-kontroll og umiddelbart sette "
					+ "fokus til gjeldende veivisertrinn. "
					+ "Trykk på ALT+PAGE DOWN for å avbryte modus for før-kontroll og gå til modus for etter-kontroll. "
					+ "I modus for før-kontroll kan du bruke piltastene til å flytte fokus mellom "
					+ "titlene på foregående og gjeldende veivisertrinn.  "
					+ "Bruk ALT+END for å avbryte modus for før-kontroll og flytte fokus til den første handlingsknappen i veiviseren. "
					+ "Bruk TAB og SKIFT+TAB til å utføre standard fokusnavigering.  "
					+ "Hvis fokus flyttes bort fra trinntitlene for før-veiviseren, vil modus for før-kontroll "
					+ "bli avbrutt.  ",
		trailingReviewHelp: "Modus for etter-kontroll for veiviser med flere trinn.  "
					+ "Bruk ALT+ENTER eller ALT+MELLOMROM for å vise gjeldende trinn.  "
					+ "Bruk ESC eller ALT+PAGE DOWN for å avbryte modus for etter-kontroll og umiddelbart sette "
					+ "fokus til gjeldende veivisertrinn.  "
					+ "Trykk på ALT+PAGE UP for å avbryte modus for etter-kontroll og gå til modus for før-kontroll.  "
					+ "I modus for etter-kontroll kan du bruke piltastene til å flytte fokus mellom "
					+ "titlene på veivisertrinnene som etterfølger gjeldende trinn. "
					+ "Bruk ALT+END for å avbryte modus for etter-kontroll og flytte fokus til den første handlingsknappen i veiviseren.  "
					+ "Bruk TAB og SKIFT+TAB til å utføre standard fokusnavigering. Hvis fokus flyttes bort "
					+ "fra trinntitlene for etter-veiviseren, blir modus for etter-kontroll avbrutt.  ",
		leadingReviewModeAnnouncement: "Modus for før-kontroll for veiviser med flere trinn. Trykk på ALT+F12 for å få hjelp. Det er ${count} hovedveivisertrinn "
					+ "før og inklusiv gjeldende hovedtrinn.  ",
		trailingReviewModeAnnouncement: "Modus for etter-kontroll for veiviser med flere trinn. Trykk på ALT+F12 for å få hjelp. Det er ${count} ettefølgende "
					+ "hovedveivisertrinn etter det gjeldende hovedtrinnet.  ",
		leadingReviewModeWithSubstepsAnnouncement: "Modus for før-kontroll for veiviser med flere trinn. Trykk på ALT+F12 for å få hjelp. Det er ${mainCount} "
					+ "hovedveivisertrinn før og inklusiv gjeldende hovedtrinn. Det gjeldende hovedtrinnet har ${count} deltrinn "
					+ "før og inklusiv gjeldende trinn. ",
		trailingReviewModeWithSubstepsAnnouncement: "Modus for etter-kontroll for veiviser med flere trinn. Trykk på ALT+F12 for å få hjelp. Det er ${mainCount} "
					+ "etterfølgende hovedveivisertrinn etter det gjeldende hovedtrinnet. Det gjeldende hovedtrinnet har ${count} deltrinn etter "
					+ "det gjeldende trinnet. ",
		trailingReviewOnLastError: "Du er nå på det siste trinnet i veiviseren. Modus for etter-kontroll er ikke tilgjengelig. ",
		nextOnInvalidError: "Du kan ikke navigere til det neste trinnet før du har fullført det gjeldende trinnet. ",
		nextOnLastError: "Du kan ikke navigere til det neste trinnet fordi du er på det siste tilgjengelige trinnet. ",
		previousOnFirstError: "Du kan ikke navigere til det forrige trinnet fordi du er på det første tilgjengelige trinnet. ",
		currentMainStepAnnouncement: "Gjeldende hovedtrinn er ${index} av ${count}, med tittelen ${title}. ",
		currentSubstepAnnouncement: "Gjeldende deltrinn er ${index} av ${count}, med tittelen ${title}. ",
		stepChangeAnnouncment: "Veivisertrinn endret. ",		
		reviewStepAnnouncement: "Gjennomgår hovedtrinn ${index} av ${count}, med tittelen ${title}. ",
		reviewStepCurrentAnnouncement: "Dette er det gjeldende hovedtrinnet. ",
		reviewStepVisitedAnnouncement: "Dette hovedtrinnet er merket som fullført. ",
		reviewStepDisabledAnnouncement: "Dette hovedtrinnet er i øyeblikket deaktivert. ",
		reviewStepClickAnnouncement: "Trykk på ENTER eller MELLOMROMSTASTEN for å gå tilbake til dette trinnet. ",
		reviewParentStepClickAnnouncement: "Trykk på ENTER eller MELLOMROMSTASTEN for å gå tilbake til begynnelsen av dette trinnet. ",
		reviewStepUnvisitedAnnouncement: "Dette hovedtrinnet er i øyeblikket ikke fullført. ",
		reviewStepStartedAnnouncement: "Dette hovedtrinnet er påbegynt, men ikke helt fullført. ",
		reviewSubstepAnnouncement: "Gjennomgår deltrinn ${index} av ${count}, med tittelen ${title}. Dette er et deltrinn i hovedtrinn ${mainIndex} av ${mainCount}, med tittelen ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Dette er det gjeldende deltrinnet. ",
		reviewSubstepVisitedAnnouncement: "Dette deltrinnet er merket som fullført. ",
		reviewSubstepDisabledAnnouncement: "Dette deltrinnet er i øyeblikket deaktivert. ",

		reviewSubstepClickAnnouncement: "Trykk på ENTER eller MELLOMROMSTASTEN for å gå tilbake til dette deltrinnet. ",
		reviewSubstepUnvisitedAnnouncement: "Dette deltrinnet er i øyeblikket ikke fullført. "
});

