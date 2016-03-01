define({
//begin v1.x content
		next: "Dalej",
		previous: "Wstecz",
		finish: "Zakończ",
		cancel: "Anuluj",
		save: "Zapisz",
		// for accordion wizard
		leadingOverflowLabel: "Jeszcze ${count}",
		trailingOverflowLabel: "Jeszcze ${count}",
		a11yLabel: "Kreator wielokrokowy",
		accordionAnnouncement: "Kreator wielokrokowy. Aby uzyskać pomoc, naciśnij ALT+F12. ",
		accordionHelp: "Tryb standardowy kreatora wielokrokowego. "
					 + "Użyj klawiszy ALT+ENTER lub ALT+SPACJA, aby zaanonsować bieżący krok. "
					 + "Użyj klawiszy ALT+PAGE UP, aby przeglądać poprzednie kroki i bieżący krok kreatora. Użyj klawiszy ALT+PAGE DOWN, aby przejrzeć "
					 + "kroki kreatora następujące po bieżącym kroku. Użyj klawiszy ALT + STRZAŁKI do nawigacji "
					 + "do następnego i poprzedniego kroku kreatora. Użyj klawiszy ALT+END, aby przenieść aktywność na pierwszy "
					 + "przycisk czynności w kreatorze. Używaj klawiszy TAB i SHIFT+TAB, aby przenosić aktywność do następnych i poprzednich elementów. ",
		leadingReviewHelp: "Tryb przeglądania wstecz w kreatorze wielokrokowym. "
					+ "Użyj klawiszy ALT+ENTER lub ALT+SPACJA, aby zaanonsować bieżący krok. "
					+ "Użyj klawisza ESCAPE lub ALT+PAGE UP, aby anulować tryb przeglądania wstecz i natychmiast "
					+ "przenieść aktywność z powrotem do bieżącego kroku kreatora.  "
					+ "Naciśnij klawisze ALT+PAGE DOWN, aby anulować tryb przeglądania wstecz i przejść do trybu przeglądania w przód. "
					+ "W trybie przeglądania wstecz używaj klawiszy ze strzałkami, aby przenosić aktywność między "
					+ "tytułami wcześniejszych kroków i bieżącego kroku kreatora. "
					+ "Użyj klawiszy ALT+END, aby anulować tryb przeglądania wstecz i przenieść aktywność do pierwszego przycisku czynności w kreatorze. "
					+ "Używaj klawiszy TAB i SHIFT+TAB do przenoszenia aktywności w zwykły sposób. "
					+ "Jeśli aktywność zostanie przeniesiona poza tytuły poprzednich kroków kreatora, to tryb przeglądania "
					+ "wstecz zostanie anulowany. ",
		trailingReviewHelp: "Tryb przeglądania w przód w kreatorze wielokrokowym. "
					+ "Użyj klawiszy ALT+ENTER lub ALT+SPACJA, aby zaanonsować bieżący krok. "
					+ "Użyj klawisza ESCAPE lub ALT+PAGE DOWN, aby anulować tryb przeglądania w przód i natychmiast "
					+ "przenieść aktywność z powrotem do bieżącego kroku kreatora. "
					+ "Naciśnij klawisze ALT+PAGE UP, aby anulować tryb przeglądania w przód i przejść do trybu przeglądania wstecz. "
					+ "W trybie przeglądania w przód używaj klawiszy ze strzałkami, aby przenosić aktywność między "
					+ "tytułami kroków kreatora następujących po bieżącym kroku. "
					+ "Użyj klawiszy ALT+END, aby anulować tryb przeglądania w przód i przenieść aktywność do pierwszego przycisku czynności w kreatorze. "
					+ "Używaj klawiszy TAB i SHIFT+TAB do przenoszenia aktywności w zwykły sposób. Jeśli aktywność zostanie przeniesiona "
					+ "poza tytuły następnych kroków kreatora, to tryb przeglądania w przód zostanie anulowany. ",
		leadingReviewModeAnnouncement: "Tryb przeglądania wstecz w kreatorze wielokrokowym. Aby uzyskać pomoc, naciśnij ALT+F12. Liczba kroków głównych kreatora "
					+ "do bieżącego kroku głównego, włącznie z nim, wynosi ${count}. ",
		trailingReviewModeAnnouncement: "Tryb przeglądania w przód w kreatorze wielokrokowym. Aby uzyskać pomoc, naciśnij ALT+F12. Liczba kroków głównych kreatora "
					+ "następujących po bieżącym kroku głównym wynosi ${count}. ",
		leadingReviewModeWithSubstepsAnnouncement: "Tryb przeglądania wstecz w kreatorze wielokrokowym. Aby uzyskać pomoc, naciśnij ALT+F12. Liczba kroków głównych kreatora "
					+ "do bieżącego kroku głównego, włącznie z nim, wynosi ${mainCount}. Bieżący krok główny ma kroki podrzędne w liczbie ${count} "
					+ "poprzedzające krok bieżący, włącznie z nim. ",
		trailingReviewModeWithSubstepsAnnouncement: "Tryb przeglądania w przód w kreatorze wielokrokowym. Aby uzyskać pomoc, naciśnij ALT+F12. Liczba kroków głównych kreatora "
					+ "następujących po bieżącym kroku głównym wynosi ${mainCount}. Bieżący krok główny ma kroki podrzędne w liczbie ${count} "
					+ "następujące po bieżącym kroku. ",
		trailingReviewOnLastError: "Jesteś obecnie w ostatnim kroku kreatora. Tryb przeglądania w przód nie jest dostępny. ",
		nextOnInvalidError: "Nie możesz przejść do następnego kroku, dopóki nie ukończysz bieżącego. ",
		nextOnLastError: "Nie możesz przejść do następnego kroku, ponieważ jesteś w ostatnim dostępnym kroku. ",
		previousOnFirstError: "Nie możesz przejść do poprzedniego kroku, ponieważ jesteś w pierwszym dostępnym kroku. ",
		currentMainStepAnnouncement: "Bieżący krok główny ${index} z ${count}, zatytułowany ${title}. ",
		currentSubstepAnnouncement: "Bieżący krok podrzędny ${index} z ${count}, zatytułowany ${title}. ",
		stepChangeAnnouncment: "Krok kreatora zmieniony. ",		
		reviewStepAnnouncement: "Przeglądanie głównego kroku ${index} z ${count}, zatytułowanego ${title}. ",
		reviewStepCurrentAnnouncement: "To jest bieżący krok główny. ",
		reviewStepVisitedAnnouncement: "Ten krok główny został oznaczony jako ukończony. ",
		reviewStepDisabledAnnouncement: "Ten krok główny jest obecnie dezaktywowany. ",
		reviewStepClickAnnouncement: "Naciśnij ENTER lub SPACJĘ, aby wrócić do tego kroku. ",
		reviewParentStepClickAnnouncement: "Naciśnij ENTER lub SPACJĘ, aby wrócić do początku tego kroku. ",
		reviewStepUnvisitedAnnouncement: "Ten krok główny nie jest obecnie ukończony. ",
		reviewStepStartedAnnouncement: "Ten krok główny został rozpoczęty, ale nie został ukończony. ",
		reviewSubstepAnnouncement: "Przeglądanie kroku podrzędnego ${index} z ${count}, zatytułowanego ${title}. To jest krok podrzędny głównego kroku ${mainIndex} z ${mainCount}, zatytułowanego ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "To jest bieżący krok podrzędny. ",
		reviewSubstepVisitedAnnouncement: "Ten krok podrzędny został oznaczony jako ukończony. ",
		reviewSubstepDisabledAnnouncement: "Ten krok podrzędny jest obecnie dezaktywowany. ",

		reviewSubstepClickAnnouncement: "Naciśnij ENTER lub SPACJĘ, aby wrócić do tego kroku podrzędnego. ",
		reviewSubstepUnvisitedAnnouncement: "Ten krok podrzędny obecnie nie jest ukończony. "
});

