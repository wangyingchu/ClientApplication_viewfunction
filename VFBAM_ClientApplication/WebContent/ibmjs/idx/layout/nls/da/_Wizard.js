define({
//begin v1.x content
		next: "Næste",
		previous: "Forrige",
		finish: "Udfør",
		cancel: "Annullér",
		save: "Gem",
		// for accordion wizard
		leadingOverflowLabel: "${count} mere",
		trailingOverflowLabel: "${count} mere",
		a11yLabel: "Guide med flere trin",
		accordionAnnouncement: "Guide med flere trin. Tryk på Alt+F12 for at få hjælp. ",
		accordionHelp: "Standardtilstand for guide med flere trin. "
					 + "Brug Alt+Enter eller Alt+mellemrumstast til at annoncere det aktuelle trin. "
					 + "Brug Alt+Page Up til at gennemgå de tidligere og det nuværende trin i guiden. Brug Alt+Page Down til at se de "
					 + "trin i guiden, som følger efter det aktuelle trin. Brug Alt+piltasterne til at navigere til "
					 + "de næste og forrige trin i guiden. Brug Alt+End til at flytte fokus til den første af guidens "
					 + "handlingsknapper. Brug tabulatortasten og Skift+tabulatortast til at flytte fokus til de næste og forrige elementer. ",
		leadingReviewHelp: "Forudgående gennemgangtilstand i guide med flere trin. "
					+ "Brug Alt+Enter eller Alt+mellemrumstast til at annoncere det aktuelle trin. "
					+ "Brug Escape-tasten eller Alt+Page Up til at annullere forudgående gennemgangtilstand og straks returnere "
					+ "fokus til det aktuelle trin i guiden. "
					+ "Tryk på Alt+Page Down for at annullere forudgående gennemgangstilstand og skifte til efterfølgende gennemgangstilstand. "
					+ "Mens du er i forudgående gennemgangstilstand, kan du bruge piltasterne til at skifte fokus mellem "
					+ "titlerne på det foregående og det aktuelle guidetrin. "
					+ "Brug Alt+End til at annullere forudgående gennemgangstilstand og flytte fokus til den første handlingsknap i guiden. "
					+ "Brug tabulatortasten og Skift+tabulatortast til at udføre almindelig fokusnavigering.  "
					+ "Hvis fokus flyttes væk fra titlerne på de forudgående trin i guiden, vil forudgående gennemgangstilstand "
					+ "blive annulleret. ",
		trailingReviewHelp: "Efterfølgende gennemgangstilstand i guide med flere trin. "
					+ "Brug Alt+Enter eller Alt+mellemrumstast til at annoncere det aktuelle trin. "
					+ "Brug Escape-tasten eller Alt+Page Down til at annullere efterfølgende gennemgangstilstand og straks returnere "
					+ "fokus til det aktuelle trin i guiden. "
					+ "Tryk på Alt+Page Up for at annullere efterfølgende gennemgangstilstand og skifte til forudgående gennemgangstilstand. "
					+ "Mens du er i efterfølgende gennemgangstilstand, kan du bruge piltasterne til at skifte fokus mellem "
					+ "titlerne på de trin i guiden, som følger efter det aktuelle trin. "
					+ "Brug Alt+End til at annullere efterfølgende gennemgangstilstand og flytte fokus til den første handlingsknap i guiden. "
					+ "Brug tabulatortasten og Skift+tabulatortast til at udføre almindelig fokusnavigering. Hvis fokus flyttes væk "
					+ "fra titlerne på de efterfølgende trin i guiden, vil efterfølgende gennemgangstilstand blive annulleret. ",
		leadingReviewModeAnnouncement: "Forudgående gennemgangtilstand i guide med flere trin. Tryk på Alt+F12 for at få hjælp. Der er ${count} hovedtrin i guiden "
					+ "frem til og inklusive det aktuelle hovedtrin. ",
		trailingReviewModeAnnouncement: "Efterfølgende gennemgangstilstand i guide med flere trin. Tryk på Alt+F12 for at få hjælp. Der er ${count} efterfølgende "
					+ "hovedtrin i guiden, som følger efter det aktuelle hovedtrin. ",
		leadingReviewModeWithSubstepsAnnouncement: "Forudgående gennemgangtilstand i guide med flere trin. Tryk på Alt+F12 for at få hjælp. Der er ${mainCount} "
					+ "hovedtrin i guiden frem til og inklusive det aktuelle hovedtrin. Det aktuelle hovedtrin har ${count} undertrin "
					+ "frem til og inklusive det aktuelle trin. ",
		trailingReviewModeWithSubstepsAnnouncement: "Efterfølgende gennemgangstilstand i guide med flere trin. Tryk på Alt+F12 for at få hjælp. Der er ${mainCount} "
					+ "efterfølgende hovedtrin i guiden, som følger efter det aktuelle hovedtrin. Det aktuelle hovedtrin har ${count} undertrin, der følger "
					+ "efter det aktuelle trin. ",
		trailingReviewOnLastError: "Du er i øjeblikket på det sidste trin i guiden. Efterfølgende gennemgangstilstand er ikke tilgængelig. ",
		nextOnInvalidError: "Du kan ikke navigere til det næste trin, før du har færdiggjort det aktuelle trin. ",
		nextOnLastError: "Du kan ikke navigere til det næste trin, fordi du er på det sidste tilgængelige trin. ",
		previousOnFirstError: "Du kan ikke navigere til det forrige trin, fordi du er på det første tilgængelige trin. ",
		currentMainStepAnnouncement: "Aktuelt hovedtrin er ${index} af ${count} og hedder ${title}. ",
		currentSubstepAnnouncement: "Aktuelt undertrin er ${index} af ${count} og hedder ${title}. ",
		stepChangeAnnouncment: "Guidetrin ændret. ",		
		reviewStepAnnouncement: "Gennemgår hovedtrin ${index} af ${count}, som hedder ${title}. ",
		reviewStepCurrentAnnouncement: "Dette er det aktuelle hovedtrin. ",
		reviewStepVisitedAnnouncement: "Dette hovedtrin er markeret som værende færdiggjort. ",
		reviewStepDisabledAnnouncement: "Dette hovedtrin er deaktiveret i øjeblikket. ",
		reviewStepClickAnnouncement: "Tryk på Enter eller mellemrumstasten for at vende tilbage til dette trin. ",
		reviewParentStepClickAnnouncement: "Tryk på Enter eller mellemrumstasten for at vende tilbage til starten af dette trin. ",
		reviewStepUnvisitedAnnouncement: "Dette hovedtrin er ufuldstændigt i øjeblikket. ",
		reviewStepStartedAnnouncement: "Dette hovedtrin er startet, men ikke færdiggjort. ",
		reviewSubstepAnnouncement: "Gennemgår undertrin ${index} af ${count}, som hedder ${title}. Dette er et undertrin til hovedtrin ${mainIndex} af ${mainCount}, som hedder ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Dette er det aktuelle undertrin. ",
		reviewSubstepVisitedAnnouncement: "Dette undertrin er markeret som værende færdiggjort. ",
		reviewSubstepDisabledAnnouncement: "Dette undertrin er deaktiveret i øjeblikket. ",

		reviewSubstepClickAnnouncement: "Tryk på Enter eller mellemrumstasten for at vende tilbage til dette undertrin. ",
		reviewSubstepUnvisitedAnnouncement: "Dette undertrin er ufuldstændigt i øjeblikket. "
});

