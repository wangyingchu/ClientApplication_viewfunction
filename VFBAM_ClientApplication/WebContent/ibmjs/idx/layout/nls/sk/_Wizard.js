define({
//begin v1.x content
		next: "Ďalej",
		previous: "Predchádzajúce",
		finish: "Dokončiť",
		cancel: "Zrušiť",
		save: "Uložiť",
		// for accordion wizard
		leadingOverflowLabel: "Ďalších ${count}",
		trailingOverflowLabel: "Ďalších ${count}",
		a11yLabel: "Sprievodca viacerými krokmi",
		accordionAnnouncement: "Sprievodca viacerými krokmi. Ak potrebujete pomoc, stlačte kombináciu klávesov Alt + F12. ",
		accordionHelp: "Štandardný režim sprievodcu viacerými krokmi. "
					 + "Ak chcete oznámiť aktuálny krok, použite kombináciu klávesov Alt + Enter alebo Alt + medzerník. "
					 + "Ak chcete posúdiť predošlé kroky a aktuálny krok sprievodcu, použite kombináciu klávesov Alt + Page Up. Ak chcete posúdiť kroky sprievodcu, "
					 + "ktoré nasledujú po aktuálnom kroku sprievodcu, použite kombináciu klávesov Alt + Page Down. Ak chcete prejsť na ďalšie a predošlé kroky "
					 + "sprievodcu, použite kombináciu klávesov Alt + kurzorové klávesy. Ak chcete presunúť zameranie na prvé z tlačidiel akcií sprievodcu, "
					 + "použite kombináciu klávesov Alt + End. Ak chcete presunúť zameranie na ďalšie a predošlé elementy, použite kláves Tab a kombináciu klávesov Shift + Tab. ",
		leadingReviewHelp: "Režim začiatočného posúdenia sprievodcu viacerými krokmi. "
					+ "Ak chcete oznámiť aktuálny krok, použite kombináciu klávesov Alt + Enter alebo Alt + medzerník.  "
					+ "Pomocou klávesu Escape alebo kombinácie klávesov Alt + Page Up môžete zrušiť režim začiatočného posúdenia a okamžite presunúť "
					+ "zameranie na aktuálny krok sprievodcu. "
					+ "Ak chcete zrušiť režim začiatočného posúdenia a aktivovať režim koncového posúdenia, stlačte kombináciu klávesov Alt + Page Down. "
					+ "Kým ste v režime začiatočného posúdenia, na prechod medzi nadpismi predošlých krokov a aktuálneho kroku "
					+ "použite kurzorové klávesy. "
					+ "Ak chcete zrušiť režim začiatočného posúdenia a presunúť zameranie na prvé z tlačidiel akcií sprievodcu, použite kombináciu klávesov Alt + End. "
					+ "Ak chcete vykonať štandardný presun zamerania, použite kláves Tab a kombináciu klávesov Shift + Tab. "
					+ "Ak sa zameranie presunie preč z nadpisov začiatočných krokov sprievodcu, zruší sa "
					+ "režim začiatočného posúdenia. ",
		trailingReviewHelp: "Režim koncového posúdenia sprievodcu viacerými krokmi.  "
					+ "Ak chcete oznámiť aktuálny krok, použite kombináciu klávesov Alt + Enter alebo Alt + medzerník.  "
					+ "Pomocou klávesu Escape alebo kombinácie klávesov Alt + Page Down môžete zrušiť režim koncového posúdenia a okamžite presunúť "
					+ "zameranie na aktuálny krok sprievodcu.  "
					+ "Ak chcete zrušiť režim koncového posúdenia a aktivovať režim začiatočného posúdenia, stlačte kombináciu klávesov Alt + Page Up. "
					+ "Kým ste v režime koncového posúdenia, na prechod medzi nadpismi krokov sprievodcu, "
					+ "ktoré nasledujú po aktuálnom kroku, použite kurzorové klávesy. "
					+ "Ak chcete zrušiť režim koncového posúdenia a presunúť zameranie na prvé z tlačidiel akcií sprievodcu, použite kombináciu klávesov Alt + End. "
					+ "Ak chcete vykonať štandardný presun zamerania, použite kláves Tab a kombináciu klávesov Shift + Tab. Ak sa zameranie presunie preč "
					+ "z nadpisov koncových krokov sprievodcu, zruší sa režim koncového posúdenia. ",
		leadingReviewModeAnnouncement: "Režim začiatočného posúdenia sprievodcu viacerými krokmi.  Ak potrebujete pomoc, stlačte kombináciu klávesov Alt + F12.  Existuje ${count} hlavných krokov sprievodcu "
					+ "vrátane aktuálneho hlavného kroku, ktoré vedú k aktuálnemu hlavného kroku. ",
		trailingReviewModeAnnouncement: "Režim koncového posúdenia sprievodcu viacerými krokmi. Ak potrebujete pomoc, stlačte kombináciu klávesov Alt + F12.  Existuje ${count} koncových "
					+ "hlavných krokov sprievodcu, ktoré nasledujú po aktuálnom hlavnom kroku. ",
		leadingReviewModeWithSubstepsAnnouncement: "Režim začiatočného posúdenia sprievodcu viacerými krokmi.  Ak potrebujete pomoc, stlačte kombináciu klávesov Alt + F12.  Existuje ${mainCount} "
					+ "hlavných krokov sprievodcu vrátane aktuálneho hlavného kroku, ktoré vedú k aktuálnemu hlavného kroku. Aktuálny hlavný krok má ${count} podkrokov vrátane aktuálneho kroku, "
					+ "ktoré vedú k aktuálnemu kroku. ",
		trailingReviewModeWithSubstepsAnnouncement: "Režim koncového posúdenia sprievodcu viacerými krokmi. Ak potrebujete pomoc, stlačte kombináciu klávesov Alt + F12.  Existuje ${mainCount} "
					+ "koncových hlavných krokov sprievodcu, ktoré nasledujú po aktuálnom hlavnom kroku. Aktuálny hlavný krok má ${count} podkrokov, ktoré nasledujú "
					+ "po aktuálnom kroku. ",
		trailingReviewOnLastError: "Aktuálne ste v poslednom kroku sprievodcu. Režim koncového posúdenia nie je k dispozícii. ",
		nextOnInvalidError: "Nemôžete prejsť na ďalší krok, kým nedokončíte aktuálny krok. ",
		nextOnLastError: "Nemôžete prejsť na ďalší krok, pretože ste na poslednom dostupnom kroku. ",
		previousOnFirstError: "Nemôžete prejsť na predošlý krok, pretože ste na prvom dostupnom kroku. ",
		currentMainStepAnnouncement: "Aktuálny hlavný krok je ${index} z ${count} s nadpisom ${title}. ",
		currentSubstepAnnouncement: "Aktuálny podkrok je ${index} z ${count} s nadpisom ${title}. ",
		stepChangeAnnouncment: "Krok sprievodcu bol zmenený. ",		
		reviewStepAnnouncement: "Posudzuje sa hlavný krok ${index} z ${count} s nadpisom ${title}. ",
		reviewStepCurrentAnnouncement: "Toto je aktuálny hlavný krok. ",
		reviewStepVisitedAnnouncement: "Tento hlavný krok bol označený ako dokončený. ",
		reviewStepDisabledAnnouncement: "Tento hlavný krok je aktuálne zakázaný. ",
		reviewStepClickAnnouncement: "Ak sa chcete vrátiť do tohto kroku, stlačte kláves Enter alebo medzerník. ",
		reviewParentStepClickAnnouncement: "Ak sa chcete vrátiť na začiatok tohto kroku, stlačte kláves Enter alebo medzerník. ",
		reviewStepUnvisitedAnnouncement: "Hlavný krok je aktuálne nedokončený. ",
		reviewStepStartedAnnouncement: "Tento hlavný krok bol spustený, ale nie je úplne dokončený. ",
		reviewSubstepAnnouncement: "Posudzuje sa podkrok ${index} z ${count} s nadpisom ${title}.  Toto je podkrok hlavného kroku ${mainIndex} z ${mainCount} s nadpisom ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Toto je aktuálny podkrok. ",
		reviewSubstepVisitedAnnouncement: "Tento podkrok bol označený ako dokončený. ",
		reviewSubstepDisabledAnnouncement: "Tento podkrok je aktuálne zakázaný. ",

		reviewSubstepClickAnnouncement: "Ak sa chcete vrátiť do tohto podkroku, stlačte kláves Enter alebo medzerník. ",
		reviewSubstepUnvisitedAnnouncement: "Tento podkrok je aktuálne nedokončený. "
});

