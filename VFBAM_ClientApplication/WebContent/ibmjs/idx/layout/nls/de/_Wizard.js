define({
//begin v1.x content
		next: "Weiter",
		previous: "Zurück",
		finish: "Beenden",
		cancel: "Abbrechen",
		save: "Speichern",
		// for accordion wizard
		leadingOverflowLabel: "${count} weitere",
		trailingOverflowLabel: "${count} weitere",
		a11yLabel: "Mehrschrittiger Assistent",
		accordionAnnouncement: "Mehrschrittiger Assistent. Zum Anzeigen der Hilfe drücken Sie die Tastenkombination ALT+F12. ",
		accordionHelp: "Standardmodus des mehrschrittigen Assistenten. "
					 + "Verwenden Sie die Tastenkombination ALT+Eingabetaste oder ALT+Leerzeichen, um den aktuellen Schritt anzukündigen. "
					 + "Verwenden Sie die Tastenkombination ALT+BILD HOCH, um die vorherigen und aktuellen Schritte im Assistenten zu prüfen. Verwenden Sie die Tastenkombination ALT+BILD AB, um die "
					 + "Schritte im Assistenten zu prüfen, die dem aktuellen Schritt folgen. Verwenden Sie die Taste ALT und die Pfeiltasten, um "
					 + "zu den nächsten und vorherigen Schritte zu navigieren. Verwenden Sie die Tastenkombination ALT+ENDE, um den Fokus auf die erste der "
					 + "Aktionsschaltflächen zu versetzen. Verwenden Sie die Tabulatortaste und die Tastenkombination Umschalttaste+Tabulatortaste, um den Fokus auf die nächsten und vorherigen Elemente zu versetzen. ",
		leadingReviewHelp: "Übersichtsmodus für führende Schritte des mehrschrittigen Assistenten. "
					+ "Verwenden Sie die Tastenkombinationen ALT+Eingabetaste oder ALT+Leertaste, um den aktuellen Schritt anzukündigen. "
					+ "Verwenden Sie die Taste Esc oder die Tastenkombination ALT+BILD AUF, um den Übersichtsmodus für führende Schritte abzubrechen und den Fokus sofort "
					+ "auf den aktuellen Schritt im Assistenten zurück zu versetzen. "
					+ "Drücken Sie die Tastenkombination ALT+BILD AB, um den Übersichtsmodus für führende Schritte abzubrechen und in den Übersichtsmodus für nachfolgende Schritte zu wechseln.  "
					+ "Verwenden Sie im Übersichtsmodus für führende Schritte die Pfeiltasten, um den Fokus nacheinander auf die einzelnen "
					+ "Titel der vorherigen und aktuellen Schritte im Assistenten zu versetzen. "
					+ "Verwenden Sie die Tastenkombination ALT+ENDE, um den Übersichtsmodus für führende Schritte abzubrechen und den Fokus auf die erste Aktionsschaltfläche des Assistenten zu versetzen. "
					+ "Verwenden Sie die Tabulatortaste und die Tastenkombination Umschalttaste+Tabulatortaste für die Standardfokusnavigation.  "
					+ "Wenn der Fokus die Gruppe der Titel führender Schritte im Assistenten verlässt, wird der Übersichtsmodus für führende Schritte "
					+ "abgebrochen. ",
		trailingReviewHelp: "Übersichtsmodus für nachfolgende Schritte des mehrschrittigen Assistenten. "
					+ "Verwenden Sie die Tastenkombination ALT+Eingabetaste oder ALT+Leertaste, um den aktuellen Schritt anzukündigen. "
					+ "Verwenden Sie die Taste Esc oder die Tastenkombination ALT+BILD AB, um den Übersichtsmodus für nachfolgende Schritte abzubrechen und den Fokus"
					+ "sofort auf den aktuellen Schritt im Assistenten zu versetzen. "
					+ "Drücken Sie die Tastenkombination ALT+BILD AUF, um den Übersichtsmodus für nachfolgende Schritte abzubrechen und in den Übersichtsmodus für führende Schritte zu wechseln.  "
					+ "Verwenden Sie im Übersichtsmodus für nachfolgende Schritte die Pfeiltasten, um den Fokus nacheinander auf die einzelnen "
					+ "Schritte im Assistenten zu versetzen, die dem aktuellen Schritt folgen. "
					+ "Verwenden Sie die Tastenkombination ALT+ENDE, um den Übersichtsmodus für nachfolgende Schritte abzubrechen und den Fokus auf die erste Aktionsschaltfläche des Assistenten zu versetzen. "
					+ "Verwenden Sie die Tabulatortaste und die Tastenkombination Umschalttaste+Tabulatortaste für die Standardfokusnavigation. Wenn der Fokus die Gruppe der Titel "
					+ "nachfolgender Schritte im Assistenten verlässt, wird der Übersichtsmodus für nachfolgende Schritte abgebrochen. ",
		leadingReviewModeAnnouncement: "Übersichtsmodus für führende Schritte des mehrschrittigen Assistenten. Zum Anzeigen der Hilfe drücken Sie die Tastenkombination ALT+F12. Es gibt ${count} Hauptschritte im Assistenten "
					+ "bis zum aktuellen Hauptschritt einschließlich. ",
		trailingReviewModeAnnouncement: "Übersichtsmodus für nachfolgende Schritte des mehrschrittigen Assistenten. Zum Anzeigen der Hilfe drücken Sie die Tastenkombination ALT+F12. Es gibt ${count} "
					+ "Hauptschritte im Assistenten nach dem aktuellen Hauptschritt. ",
		leadingReviewModeWithSubstepsAnnouncement: "Übersichtsmodus für führende Schritte des mehrschrittigen Assistenten. Zum Anzeigen der Hilfe drücken Sie die Tastenkombination ALT+F12. Es gibt ${mainCount} "
					+ "Hauptschritte bis zum aktuellen Hauptschritt einschließlich. Der aktuelle Hauptschritt hat ${count} Unterschritte "
					+ "bis zum aktuellen Schritt einschließlich. ",
		trailingReviewModeWithSubstepsAnnouncement: "Übersichtsmodus für nachfolgende Schritte des mehrschrittigen Assistenten. Zum Anzeigen der Hilfe drücken Sie die Tastenkombination ALT+F12. Es gibt ${mainCount} "
					+ "Hauptschritte im Assistenten nach dem aktuellen Hauptschritt. Der aktuelle Hauptschritt hat ${count} Unterschritte, die dem "
					+ "aktuellen Schritt folgen. ",
		trailingReviewOnLastError: "Sie befinden sich momentan im letzten Schritt des Assistenten. Der Übersichtsmodus für nachfolgende Schritte ist nicht verfügbar. ",
		nextOnInvalidError: "Sie können erst nach Abschluss des aktuellen Schritts zum nächsten Schritt navigieren. ",
		nextOnLastError: "Sie können nicht zum nächsten Schritt navigieren, weil Sie sich im letzten verfügbaren Schritt befinden. ",
		previousOnFirstError: "Sie können nicht zum vorherigen Schritt navigieren, weil Sie sich im ersten verfügbaren Schritt befinden. ",
		currentMainStepAnnouncement: "Der aktuelle Hauptschritt ist der Schritt ${index} von ${count} mit dem Titel ${title}. ",
		currentSubstepAnnouncement: "Der aktuelle Unterschritt ist der Schritt ${index} von ${count} mit dem Titel ${title}. ",
		stepChangeAnnouncment: "Assistentenschritt gewechselt. ",		
		reviewStepAnnouncement: "Hauptschritt ${index} von ${count} mit dem Titel ${title} wird geprüft. ",
		reviewStepCurrentAnnouncement: "Dies ist der aktuelle Hauptschritt. ",
		reviewStepVisitedAnnouncement: "Dieser Hauptschritt wurde als abgeschlossen markiert. ",
		reviewStepDisabledAnnouncement: "Dieser Hauptschritt ist momentan inaktiviert. ",
		reviewStepClickAnnouncement: "Drücken Sie die Eingabetaste oder die Leertaste, um zu diesem Schritt zurückzukehren. ",
		reviewParentStepClickAnnouncement: "Drücken Sie die Eingabetaste oder die Leertaste, um zum Anfang dieses Schritts zurückzukehren. ",
		reviewStepUnvisitedAnnouncement: "Dieser Hauptschritt ist momentan noch nicht abgeschlossen. ",
		reviewStepStartedAnnouncement: "Dieser Hauptschritt wurde gestartet, ist aber noch nicht vollständig abgeschlossen. ",
		reviewSubstepAnnouncement: "Unterschritt ${index} von ${count} mit dem Titel ${title} wird geprüft. Dieser Unterschritt ist ein Unterschritt von Hauptschritt ${mainIndex} von ${mainCount} mit dem Titel ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Dies ist der aktuelle Unterschritt. ",
		reviewSubstepVisitedAnnouncement: "Dieser Unterschritt wurde als abgeschlossen markiert. ",
		reviewSubstepDisabledAnnouncement: "Dieser Unterschritt ist momentan inaktiviert. ",

		reviewSubstepClickAnnouncement: "Drücken Sie die Eingabetaste oder die Leertaste, um zu diesem Unterschritt zurückzukehren. ",
		reviewSubstepUnvisitedAnnouncement: "Dieser Unterschritt ist momentan noch nicht abgeschlossen. "
});

