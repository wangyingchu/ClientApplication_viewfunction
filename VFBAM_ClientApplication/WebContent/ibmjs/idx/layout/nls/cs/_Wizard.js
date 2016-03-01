define({
//begin v1.x content
		next: "Další",
		previous: "Předchozí",
		finish: "Dokončit",
		cancel: "Storno",
		save: "Uložit",
		// for accordion wizard
		leadingOverflowLabel: "${count} dalších",
		trailingOverflowLabel: "${count} dalších",
		a11yLabel: "Vícekrokový průvodce",
		accordionAnnouncement: "Vícekrokový průvodce. Nápovědu získáte stisknutím kláves ALT+F12. ",
		accordionHelp: "Standardní režim vícekrokového průvodce. "
					 + "Pomocí kláves ALT+ENTER nebo ALT+MEZERA ohlásíte aktuální krok. "
					 + "Pomocí kláves ALT+PAGE UP zkontrolujete předchozí a aktuální kroky průvodce. Pomocí kláves ALT+PAGE DOWN zkontrolujete "
					 + "kroky průvodce, které následují za aktuálním krokem průvodce. Pomocí kláves ALT+ŠIPKA přejdete "
					 + "na další nebo předchozí krok průvodce. Pomocí kláves ALT+END přenesete fokus na první "
					 + "tlačítko akce průvodce. Pomocí kláves TAB a SHIFT+TAB přenesete fokus na další nebo předchozí prvek. ",
		leadingReviewHelp: "Režim úvodní kontroly vícekrokového průvodce. "
					+ "Pomocí kláves ALT+ENTER nebo ALT+MEZERA ohlásíte aktuální krok. "
					+ "Pomocí kláves ESCAPE nebo ALT+PAGE UP zrušíte režim úvodní kontroly a okamžitě vrátíte "
					+ "fokus na aktuální krok průvodce. "
					+ "Pomocí kláves ALT+PAGE DOWN zrušíte režim úvodní kontroly a přepnete se do režimu koncové kontroly. "
					+ "V režimu úvodní kontroly používejte kurzorové klávesy k přesouvání fokusu mezi "
					+ "nadpisy předchozího a aktuálního kroku průvodce. "
					+ "Pomocí kláves ALT+END zrušíte režim úvodní kontroly a přenesete fokus na první tlačítko akce průvodce. "
					+ "Pomocí kláves TAB a SHIFT+TAB provedete standardní navigaci fokusu. "
					+ "Pokud se fokus dostane mimo nadpisy úvodních kroků průvodce, pak bude režim úvodní kontroly "
					+ "zrušen. ",
		trailingReviewHelp: "Režim koncové kontroly vícekrokového průvodce. "
					+ "Pomocí kláves ALT+ENTER nebo ALT+MEZERA ohlásíte aktuální krok. "
					+ "Pomocí kláves ESCAPE nebo ALT+PAGE DOWN zrušíte režim koncové kontroly a okamžitě vrátíte "
					+ "fokus na aktuální krok průvodce. "
					+ "Pomocí kláves ALT+PAGE UP zrušíte režim koncové kontroly a přepnete se do režimu úvodní kontroly. "
					+ "V režimu koncové kontroly používejte kurzorové klávesy k přesouvání fokusu mezi "
					+ "nadpisy kroků průvodce, které následují za aktuálním krokem. "
					+ "Pomocí kláves ALT+END zrušíte režim koncové kontroly a přenesete fokus na první tlačítko akce průvodce. "
					+ "Pomocí kláves TAB a SHIFT+TAB provedete standardní navigaci fokusu. Pokud se fokus dostane mimo "
					+ "nadpisy koncových kroků průvodce, pak bude režim koncové kontroly zrušen. ",
		leadingReviewModeAnnouncement: "Režim úvodní kontroly vícekrokového průvodce. Nápovědu získáte stisknutím kláves ALT+F12. Existuje ${count} hlavních kroků průvodce, "
					+ "které vedou k aktuálnímu hlavnímu kroku a obsahují ho. ",
		trailingReviewModeAnnouncement: "Režim koncové kontroly vícekrokového průvodce. Nápovědu získáte stisknutím kláves ALT+F12. Existuje ${count} koncových "
					+ "kroků průvodce, které následují za aktuálním hlavním krokem. ",
		leadingReviewModeWithSubstepsAnnouncement: "Režim úvodní kontroly vícekrokového průvodce. Nápovědu získáte stisknutím kláves ALT+F12. Existuje ${mainCount} "
					+ "hlavních kroků průvodce, které vedou k aktuálnímu hlavnímu kroku a obsahují ho. Aktuální hlavní krok má ${count} dílčích kroků, "
					+ "které vedou k aktuálnímu kroku a obsahují ho. ",
		trailingReviewModeWithSubstepsAnnouncement: "Režim koncové kontroly vícekrokového průvodce. Nápovědu získáte stisknutím kláves ALT+F12. Existuje ${mainCount} "
					+ "koncových kroků průvodce, které následují za aktuálním hlavním krokem. Aktuální hlavní krok má ${count} dílčích kroků, které následují "
					+ "za aktuálním krokem. ",
		trailingReviewOnLastError: "Nacházíte se nyní na posledním kroku průvodce. Režim koncové kontroly není k dispozici. ",
		nextOnInvalidError: "Nemůžete přejít na další krok, dokud nedokončíte aktuální krok. ",
		nextOnLastError: "Nemůžete přejít na další krok, protože jste na posledním dostupném kroku. ",
		previousOnFirstError: "Nemůžete přejít na předchozí krok, protože jste na prvním dostupném kroku. ",
		currentMainStepAnnouncement: "Aktuální hlavní krok je ${index} z ${count} a má název ${title}. ",
		currentSubstepAnnouncement: "Aktuální dílčí krok je ${index} z ${count} a má název ${title}. ",
		stepChangeAnnouncment: "Krok průvodce se změnil. ",		
		reviewStepAnnouncement: "Kontrola hlavního kroku ${index} z ${count} s názvem ${title}. ",
		reviewStepCurrentAnnouncement: "Toto je aktuální hlavní krok. ",
		reviewStepVisitedAnnouncement: "Tento hlavní krok je označen jako dokončený. ",
		reviewStepDisabledAnnouncement: "Tento hlavní krok je aktuálně zakázán. ",
		reviewStepClickAnnouncement: "Stisknutím klávesy ENTER nebo MEZERA se vrátíte k tomuto kroku. ",
		reviewParentStepClickAnnouncement: "Stisknutím klávesy ENTER nebo MEZERA se vrátíte na začátek tohoto kroku. ",
		reviewStepUnvisitedAnnouncement: "Tento hlavní krok je aktuálně nedokončený. ",
		reviewStepStartedAnnouncement: "Tento hlavní krok byl zahájen, ale ne zcela dokončen. ",
		reviewSubstepAnnouncement: "Kontrola dílčího kroku ${index} z ${count} s názvem ${title}. Jedná se o dílčí krok hlavního kroku ${mainIndex} z ${mainCount} s názvem ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Toto je aktuální dílčí krok. ",
		reviewSubstepVisitedAnnouncement: "Tento dílčí krok je označen jako dokončený. ",
		reviewSubstepDisabledAnnouncement: "Tento dílčí krok je aktuálně zakázán. ",

		reviewSubstepClickAnnouncement: "Stisknutím klávesy ENTER nebo MEZERA se vrátíte k tomuto dílčímu kroku. ",
		reviewSubstepUnvisitedAnnouncement: "Tento dílčí krok je aktuálně nedokončený. "
});

