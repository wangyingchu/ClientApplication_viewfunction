define({
//begin v1.x content
		next: "Volgende",
		previous: "Vorige",
		finish: "Voltooien",
		cancel: "Annuleren",
		save: "Opslaan",
		// for accordion wizard
		leadingOverflowLabel: "${count} Meer",
		trailingOverflowLabel: "${count} Meer",
		a11yLabel: "Multistep Wizard",
		accordionAnnouncement: "Multistep Wizard.  Druk op ALT+F12 voor Help. ",
		accordionHelp: "Multistep Wizard standaardwerkstand. "
					 + "Met ALT+ENTER of ALT+SPATIEBALK maakt u de huidige stap bekend. "
					 + "Met ALT+PAGE UP controleert u de huidige en bestaande stappen van de wizard. Met ALT+PAGE DOWN "
					 + "kijkt u welke stappen er nog komen in de wizard. Met ALT + PIJLKNOPPEN gaat u naar de volgende"
					 + "en vorige stappen. Met ALT+END plaatst u de focus op de eerste actieknoppen in de wizard. "
					 + "Met de TABTOETS en SHIFT+TABTOETS plaatst u de focus op de vorige en volgende elementen. ",
		leadingReviewHelp: "Multistep Wizard werkstand Terugkijken.  "
					+ "Met ALT+ENTER of ALT+SPACE maakt u de huidige stap bekend. "
					+ "Met ESCAPE of ALT+PAGE UP annuleert u de werkstand Terugkijken en plaatst u de focus"
					+ "meteen weer op de huidige stap van de wizard. "
					+ "Met ALT+PAGE DOWN schakelt u van de werkstand Terugkijken over op Vooruitkijken. "
					+ "In de werkstand Terugkijken plaatst u de focus met behulp van de pijltoetsen"
					+ "achtereenvolgens op de titels van de voorafgaande en huidige stappen van de wizard. "
					+ "Met ALT+END annuleert u Terugkijken en gaat u naar de eerste actieknoppen van de wizard.  "
					+ "Met de TABTOETS en SHIFT+TABTOETS voert u standaard focusnavigatie uit. "
					+ "Als de focus niet meer op de titels van de voorafgaande stappen van de wizard staat, wordt de"
					+ "werkstand Terugkijken geannuleerd. ",
		trailingReviewHelp: "Multistep Wizard werkstand Vooruitkijken.  "
					+ "Met ALT+ENTER of ALT+SPACE maakt u de huidige stap bekend. "
					+ "Met ESCAPE of ALT+PAGE DOWN annuleert u de werkstand Vooruitkijken en plaatst u de focus"
					+ "meteen weer op de huidige stap van de wizard. "
					+ "Met ALT+PAGE UP schakelt u van de werkstand Vooruitkijken over op Terugkijken. "
					+ "In de werkstand Vooruitkijken plaatst u de focus met behulp van de pijltoetsen achtereenvolgens"
					+ "op de titels van de stappen die nog volgen in de wizard. "
					+ "Met ALT+END annuleert u Vooruitkijken en gaat u naar de eerste actieknoppen van de wizard.  "
					+ "Met de TABTOETS en SHIFT+TABTOETS voert u standaard focusnavigatie uit. Als de focus niet meer"
					+ "op de titels van de vervolgstappen van de wizard staat, wordt de werkstand Vooruitkijken geannuleerd. ",
		leadingReviewModeAnnouncement: "Multistep Wizard werkstand Terugkijken. Druk op ALT+F12 voor Help. Er zijn ${count} hoofdstappen in de wizard "
					+ "die tot de huidige hoofdstap leiden (deze stap inbegrepen). ",
		trailingReviewModeAnnouncement: "Multistep Wizard werkstand Vooruitkijken.  Druk op ALT+F12 voor Help. Er zijn ${count} hoofdstappen "
					+ "in de wizard die volgen op de huidige hoofdstap. ",
		leadingReviewModeWithSubstepsAnnouncement: "Multistep Wizard werkstand Terugkijken. Druk op ALT+F12 voor Help. Er zijn ${mainCount} "
					+ "hoofdstappen die tot de huidige hoofdstap leiden (deze stap inbegrepen). De huidige hoofdstap heeft ${count} substappen "
					+ "die tot de huidige stap leiden (deze stap inbegrepen). ",
		trailingReviewModeWithSubstepsAnnouncement: "Multistep Wizard werkstand Vooruitkijken. Druk op ALT+F12 voor Help. Er zijn ${mainCount} "
					+ "hoofdstappen in de wizard die volgen op de huidige hoofdstap. De huidige hoofdstap heeft ${count} substappen die volgen op "
					+ "de huidige stap. ",
		trailingReviewOnLastError: "U bevindt zich in de laatste stap van de wizard. De werkstand Vooruitkijken is niet beschikbaar. ",
		nextOnInvalidError: "U kunt pas naar de volgende stap gaan als u de huidige stap hebt voltooid. ",
		nextOnLastError: "U kunt niet naar de volgende stap gaan, want u bevindt zich in de laatste beschikbare stap. ",
		previousOnFirstError: "U kunt niet naar de vorige stap gaan, want u bevindt zich in de eerste beschikbare stap. ",
		currentMainStepAnnouncement: "De huidige hoofdstap is ${index} van ${count}, getiteld ${title}. ",
		currentSubstepAnnouncement: "De huidige substap is ${index} van ${count}, getiteld ${title}. ",
		stepChangeAnnouncment: "Stap van wizard gewijzigd. ",		
		reviewStepAnnouncement: "Review van hoofdstap ${index} van ${count}, getiteld ${title}. ",
		reviewStepCurrentAnnouncement: "Dit is de huidige hoofdstap. ",
		reviewStepVisitedAnnouncement: "Deze hoofdstap is gemarkeerd als Voltooid. ",
		reviewStepDisabledAnnouncement: "Deze hoofdstap is momenteel uitgeschakeld. ",
		reviewStepClickAnnouncement: "Druk op ENTER of SPATIEBALK om terug te gaan naar deze stap. ",
		reviewParentStepClickAnnouncement: "Druk op ENTER of SPATIEBALK om terug te gaan naar het begin van deze stap. ",
		reviewStepUnvisitedAnnouncement: "Deze hoofdstap is momenteel onvoltooid. ",
		reviewStepStartedAnnouncement: "Deze hoofdstap is wel gestart, maar is nog niet helemaal voltooid. ",
		reviewSubstepAnnouncement: "Review van substap ${index} van ${count}, getiteld ${title}. Dit is een substap van hoofdstap ${mainIndex} van ${mainCount}, getiteld ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Dit is de huidige substap. ",
		reviewSubstepVisitedAnnouncement: "Deze substap is gemarkeerd als Voltooid. ",
		reviewSubstepDisabledAnnouncement: "Deze substap is momenteel uitgeschakeld. ",

		reviewSubstepClickAnnouncement: "Druk op ENTER of SPATIEBALK om terug te gaan naar deze substap. ",
		reviewSubstepUnvisitedAnnouncement: "Deze substap is momenteel onvoltooid. "
});

