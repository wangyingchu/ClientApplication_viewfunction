define({
//begin v1.x content
		next: "Naslednji",
		previous: "Prejšnji",
		finish: "Dokončaj",
		cancel: "Prekliči",
		save: "Shrani",
		// for accordion wizard
		leadingOverflowLabel: "${count} več",
		trailingOverflowLabel: "${count} več",
		a11yLabel: "Čarovnik z več koraki",
		accordionAnnouncement: "Čarovnik z več koraki. Za pomoč pritisnite tipki ALT+F12. ",
		accordionHelp: "Standardni način čarovnika z več koraki. "
					 + "S tipkama ALT+ENTER ali ALT+SPACE najavite trenutni korak. "
					 + "S tipkama ALT+PAGE UP preglejte predhodne in trenutne korake čarovnika. S tipkama ALT+PAGE DOWN preglejte "
					 + "korake čarovnika, ki sledijo trenutnemu koraku čarovnika. S tipkami ALT+smerne tipke se pomaknite do "
					 + "naslednjih in prejšnjih korakov čarovnika. S tipkama ALT+END fokus premaknite na prvega od "
					 + "gumbov Dejanje v čarovniku. S tipkami TAB in SHIFT+TAB fokus premaknite na naslednje in prejšnje elemente. ",
		leadingReviewHelp: "Vodilni način pregleda čarovnika z več koraki. "
					+ "S tipkama ALT+ENTER ali ALT+SPACE najavite trenutni korak. "
					+ "S tipko ESCAPE ali tipkama ALT+PAGE UP zapustite vodilni način pregleda in fokus takoj vrnite "
					+ "trenutnemu koraku čarovnika. "
					+ "Pritisnite tipki ALT+PAGE DOWN, da zapustite vodilni način pregleda in preklopite v sledeči način pregleda. "
					+ "V vodilnem načinu pregleda s smernimi tipkami fokus premikajte med "
					+ "naslovi prejšnjih in trenutnih korakov čarovnika. "
					+ "S tipkama ALT+END zapustite vodilni način pregleda in fokus premaknite na prvega od gumbov Dejanje v čarovniku. "
					+ "S tipko TAB in tipkama SHIFT+TAB lahko fokus premikate kot običajno. "
					+ "Če se fokus oddalji od naslovov vodilnega koraka čarovnika, se vodilni način pregleda "
					+ "prekine. ",
		trailingReviewHelp: "Sledeči način pregleda čarovnika z več koraki. "
					+ "S tipkama ALT+ENTER ali ALT+SPACE najavite trenutni korak. "
					+ "S tipko ESCAPE ali tipkama ALT+PAGE DOWN zapustite sledeči način pregleda in fokus takoj vrnite "
					+ "trenutnemu koraku čarovnika. "
					+ "Pritisnite tipki ALT+PAGE UP, da zapustite sledeči način pregleda in preklopite v vodilni način pregleda. "
					+ "V sledečem načinu pregleda s smernimi tipkami fokus premikajte med "
					+ "naslovi korakov čarovnika, ki sledijo trenutnemu koraku čarovnika. "
					+ "S tipkama ALT+END zapustite sledeči način pregleda in fokus premaknite na prvega od gumbov Dejanje v čarovniku. "
					+ "S tipko TAB in tipkama SHIFT+TAB lahko fokus pomikate kot običajno. Če se fokus oddalji od "
					+ "naslovov sledečega koraka čarovnika, se sledeči način pregleda prekine. ",
		leadingReviewModeAnnouncement: "Vodilni način pregleda čarovnika z več koraki. Za pomoč pritisnite tipki ALT+F12. Vključno s trenutnim glavnim korakom obstaja ${count} glavnih korakov čarovnika, "
					+ "ki vodijo do trenutnega glavnega koraka. ",
		trailingReviewModeAnnouncement: "Sledeči način pregleda čarovnika z več koraki. Za pomoč pritisnite tipki ALT+F12. Obstaja ${count} sledečih "
					+ "glavnih korakov čarovnika, ki sledijo trenutnemu glavnemu koraku. ",
		leadingReviewModeWithSubstepsAnnouncement: "Vodilni način pregleda čarovnika z več koraki. Za pomoč pritisnite tipki ALT+F12. Vključno s trenutnim glavnim korakom obstaja ${mainCount} "
					+ "glavnih korakov čarovnika, ki vodijo do trenutnega glavnega koraka. Trenutni glavni korak vključno s samim sabo vsebuje ${count} podkorakov, "
					+ "ki vodijo do trenutnega koraka. ",
		trailingReviewModeWithSubstepsAnnouncement: "Sledeči način pregleda čarovnika z več koraki. Za pomoč pritisnite tipki ALT+F12. Obstaja ${mainCount} "
					+ "sledečih glavnih korakov čarovnika, ki sledijo trenutnemu glavnemu koraku. Trenutni glavni korak vsebuje ${count} podkorakov, ki sledijo "
					+ "trenutnemu koraku. ",
		trailingReviewOnLastError: "Trenutno ste v zadnjem koraku čarovnika.  Sledeči način čarovnika ni na voljo. ",
		nextOnInvalidError: "Dokler ne dokončate trenutnega koraka, se ne morete pomakniti do naslednjega koraka. ",
		nextOnLastError: "Ne morete se pomakniti do naslednjega koraka, ker ste na zadnjem razpoložljivem koraku. ",
		previousOnFirstError: "Ne morete se pomakniti do prejšnjega koraka, ker ste na prvem razpoložljivem koraku. ",
		currentMainStepAnnouncement: "Trenutni glavni korak je ${index} od ${count}, imenovan ${title}. ",
		currentSubstepAnnouncement: "Trenutni podkorak je ${index} od ${count}, imenovan ${title}. ",
		stepChangeAnnouncment: "Korak čarovnika se je spremenil. ",		
		reviewStepAnnouncement: "Pregledovanje glavnega koraka ${index} od ${count}, imenovanega ${title}. ",
		reviewStepCurrentAnnouncement: "To je trenutni glavni korak. ",
		reviewStepVisitedAnnouncement: "Ta glavni korak je bil označen kot dokončan. ",
		reviewStepDisabledAnnouncement: "Ta glavni korak je trenutno onemogočen. ",
		reviewStepClickAnnouncement: "Pritisnite tipko ENTER ali SPACE, da se vrnete na ta korak. ",
		reviewParentStepClickAnnouncement: "Pritisnite tipko ENTER ali SPACE, da se vrnete na začetek tega koraka. ",
		reviewStepUnvisitedAnnouncement: "Ta glavni korak je trenutno nedokončan. ",
		reviewStepStartedAnnouncement: "Ta glavni korak ste sicer začeli, vendar ga niste v celoti dokončali. ",
		reviewSubstepAnnouncement: "Pregledovanje podkoraka ${index} od ${count}, imenovanega ${title}.To je podkorak glavnega koraka ${mainIndex} od ${mainCount}, imenovan ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "To je trenutni podkorak. ",
		reviewSubstepVisitedAnnouncement: "Ta podkorak je bil označen kot dokončan. ",
		reviewSubstepDisabledAnnouncement: "Ta podkorak je trenutno onemogočen. ",

		reviewSubstepClickAnnouncement: "Pritisnite tipko ENTER ali SPACE, da se vrnete na ta podkorak. ",
		reviewSubstepUnvisitedAnnouncement: "Ta podkorak je trenutno nedokončan. "
});

