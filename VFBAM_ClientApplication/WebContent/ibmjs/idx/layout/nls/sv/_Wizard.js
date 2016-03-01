define({
//begin v1.x content
		next: "Nästa",
		previous: "Föregående",
		finish: "Slutför",
		cancel: "Avbryt",
		save: "Spara",
		// for accordion wizard
		leadingOverflowLabel: "${count} Mer ",
		trailingOverflowLabel: "${count} Mer ",
		a11yLabel: "Flerstegsguide",
		accordionAnnouncement: "Flerstegsguide. Tryck Alt+F12 om du vill ha hjälp. ",
		accordionHelp: "Standardläge för flerstegsguide. "
					 + "Tryck på Alt+Enter eller Alt+mellanslag för att öppna aktuellt steg. "
					 + "Tryck på Alt+PageUp för att granska det aktuella och föregående steg i guiden. Tryck på Alt+PageDown "
					 + "om du vill granska efterföljande steg i guiden. Tryck på Alt+piltangenterna om du vill flytta till "
					 + "nästa eller föregående steg i guiden. Tryck på Alt+End om du vill aktivera den första åtgärdsknappen "
					 + "i guiden. Tryck på tabb och skift+tabb för att gå till nästa och föregående element. ",
		leadingReviewHelp: "Förgranskningsläge för flerstegsguide. "
					+ "Tryck på Alt+Enter eller Alt+mellanslag för att öppna aktuellt steg. "
					+ "Tryck på Esc eller Alt+PageUp om du vill avbryta förgranskningsläget och direkt "
					+ "gå tillbaka till aktuellt steg i guiden. "
					+ "Tryck på Alt+PageDown om du vill avbryta förgranskningsläget och växla till eftergranskningsläget. "
					+ "Använd piltangenterna om du vill gå mellan titlarna på föregående och aktuellt "
					+ "guidesteg. "
					+ "Tryck på Alt+End om du vill avbryta förgranskningsläget och gå till den första åtgärdsknappen. "
					+ "Tryck på tabb och skift+tabb om du vill navigera på vanligt sätt. "
					+ "Om fokus flyttas från guidestegstitlarna från guidestegstitlarna avslutas "
					+ "förgranskningsläget. ",
		trailingReviewHelp: "Eftergranskningsläge för flerstegsguide. "
					+ "Tryck på Alt+Enter eller Alt+mellanslag för att öppna aktuellt steg. "
					+ "Tryck på Esc eller Alt+PageDown om du vill avbryta eftergranskningsläget och direkt "
					+ "gå tillbaka till aktuellt steg i guiden. "
					+ "Tryck på Alt+PageUp om du vill avbryta eftergranskningsläget och växla till förgranskningsläget. "
					+ "Använd piltangenterna om du vill gå mellan titlarna på föregående och aktuellt guidesteg. "
					+ " "
					+ "Tryck på Alt+End om du vill avbryta eftergranskningsläget och gå till den första åtgärdsknappen. "
					+ "Tryck på tabb och skift+tabb om du vill navigera på vanligt sätt. Om fokus flyttas från "
					+ "efterföljande guidestegstitlar avbryts eftergranskningsläget. ",
		leadingReviewModeAnnouncement: "Förgranskningsläge för flerstegsguide. Tryck Alt+F12 om du vill ha hjälp. Det finns ${count} huvudguidesteg "
					+ "till och med aktuellt huvudsteg. ",
		trailingReviewModeAnnouncement: "Eftergranskningsläge för flerstegsguide. Tryck Alt+F12 om du vill ha hjälp. Det finns ${count} efterföljande "
					+ "huvudguidesteg som kommer efter aktuellt huvudsteg. ",
		leadingReviewModeWithSubstepsAnnouncement: "Förgranskningsläge för flerstegsguide. Tryck Alt+F12 om du vill ha hjälp. Det finns ${mainCount} "
					+ "huvudguidesteg till och med aktuellt huvudsteg. Aktuellt huvudsteg innehåller ${count} delsteg "
					+ "till och med aktuellt steg. ",
		trailingReviewModeWithSubstepsAnnouncement: "Eftergranskningsläge för flerstegsguide. Tryck Alt+F12 om du vill ha hjälp. Det finns ${mainCount} "
					+ "efterföljande huvudguidesteg som kommer efter aktuellt huvudsteg. Aktuellt huvudsteg har ${count} delsteg som kommer efter "
					+ "aktuellt steg. ",
		trailingReviewOnLastError: "Du är på det sista steget i guiden. Eftergranskningsläge är inte tillgängligt. ",
		nextOnInvalidError: "Du kan inte gå till nästa steg förrän du har slutfört det här steget. ",
		nextOnLastError: "Du kan inte gå till nästa steg eftersom du är på det sista tillgängliga steget. ",
		previousOnFirstError: "Du kan inte gå till föregående steg eftersom du är på det första tillgängliga steget. ",
		currentMainStepAnnouncement: "Aktuellt huvudsteg är ${index} av ${count}, med titeln ${title}. ",
		currentSubstepAnnouncement: "Aktuellt delsteg är ${index} av ${count}, med titeln ${title}. ",
		stepChangeAnnouncment: "Guidesteget har ändrats. ",		
		reviewStepAnnouncement: "Granskar huvudsteg ${index} av ${count}, med titeln ${title}. ",
		reviewStepCurrentAnnouncement: "Det här är det aktuella huvudsteget. ",
		reviewStepVisitedAnnouncement: "Det här huvudsteget är markerat som slutfört. ",
		reviewStepDisabledAnnouncement: "Det här huvudsteget är avaktiverat. ",
		reviewStepClickAnnouncement: "Tryck på Enter eller mellanslag om du vill gå tillbaka till det här steget. ",
		reviewParentStepClickAnnouncement: "Tryck på Enter eller mellanslag om du vill gå tillbaka till början av det här steget. ",
		reviewStepUnvisitedAnnouncement: "Det här huvudsteget är inte slutfört. ",
		reviewStepStartedAnnouncement: "Det här huvudsteget har startats men inte slutförts. ",
		reviewSubstepAnnouncement: "Granskar delsteg ${index} av ${count}, med titeln ${title}. Det här är ett delsteg av huvudsteget ${mainIndex} av ${mainCount}, med titeln ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Det här är det aktuella delsteget. ",
		reviewSubstepVisitedAnnouncement: "Det här delsteget är markerat som slutfört. ",
		reviewSubstepDisabledAnnouncement: "Det här delsteget är avaktiverat. ",

		reviewSubstepClickAnnouncement: "Tryck på Enter eller mellanslag om du vill gå tillbaka till det här delsteget. ",
		reviewSubstepUnvisitedAnnouncement: "Det här delsteget är inte slutfört. "
});

