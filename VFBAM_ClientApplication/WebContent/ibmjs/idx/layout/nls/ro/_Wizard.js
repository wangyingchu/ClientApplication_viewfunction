define({
//begin v1.x content
		next: "Următor",
		previous: "Anterior",
		finish: "Sfârşit",
		cancel: "Anulare",
		save: "Salvare",
		// for accordion wizard
		leadingOverflowLabel: "Încă ${count}",
		trailingOverflowLabel: "Încă ${count}",
		a11yLabel: "Vrăjitor cu mai mulţi paşi",
		accordionAnnouncement: "Vrăjitor cu mai mulţi paşi. Apăsaţi ALT+F12 pentru ajutor.  ",
		accordionHelp: "Modul standard al vrăjitorului cu mai mulţi paşi.  "
					 + "Utilizaţi ALT+ENTER sau ALT+SPAŢIU pentru a anunţa pasul curent.  "
					 + "Utilizaţi ALT+PAGE UP pentru a examina paşii anteriori şi curent ai vrăjitorului. Utilizaţi ALT+PAGE DOWN pentru a examina "
					 + "paşii vrăjitorului care urmează după pasul curent. Utilizaţi ALT + TASTE CU SĂGEATĂ pentru a naviga prin "
					 + "paşii următori şi cei anteriori ai vrăjitorului. Utilizaţi ALT+END pentru a muta focalizarea la primul dintre "
					 + "butoanele de acţiune ale vrăjitorului. Utilizaţi tastele TAB şi SHIFT+TAB pentru a naviga la elementele următoare şi anterioare.  ",
		leadingReviewHelp: "Modul pre-examinare al vrăjitorului cu mai mulţi paşi.  "
					+ "Utilizaţi ALT+ENTER sau ALT+SPAŢIU pentru a anunţa pasul curent.  "
					+ "Utilizaţi tasta ESCAPE sau ALT+PAGE UP pentru a anula modul pre-examinare şi a readuce imediat "
					+ "focalizarea la pasul curent al vrăjitorului.  "
					+ "Apăsaţi ALT+PAGE DOWN pentru a anula modul pre-examinare şi a comuta la modul post-examinare.  "
					+ "Când vă aflaţi în modul pre-examinare, utilizaţi tastele cu săgeată pentru a cicla focalizarea prin "
					+ "titlurile paşilor anteriori şi curent ai vrăjitorului.  "
					+ "Utilizaţi ALT+END pentru a anula modul pre-examinare şi a muta focalizarea la primul dintre butoanele de acţiune ale vrăjitorului.  "
					+ "Utilizaţi tastele TAB şi SHIFT+TAB pentru a realiza navigarea de focalizare standard.  "
					+ "Dacă focalizarea se mută de la titlurile paşilor anteriori ai vrăjitorului, modul pre-examinare "
					+ "va fi anulat.  ",
		trailingReviewHelp: "Modul post-examinare al vrăjitorului cu mai mulţi paşi.  "
					+ "Utilizaţi ALT+ENTER sau ALT+SPAŢIU pentru a anunţa pasul curent.  "
					+ "Utilizaţi tasta ESCAPE sau ALT+PAGE DOWN pentru a anula modul post-examinare şi a readuce imediat "
					+ "focalizarea la pasul curent al vrăjitorului.  "
					+ "Apăsaţi ALT+PAGE UP pentru a anula modul post-examinare şi a comuta la modul pre-examinare.  "
					+ "Când vă aflaţi în modul post-examinare, utilizaţi tastele cu săgeată pentru a cicla focalizarea prin "
					+ "titlurile paşilor vrăjitorului care urmează după pasul curent.  "
					+ "Utilizaţi ALT+END pentru a anula modul post-examinare şi a muta focalizarea la primul dintre butoanele de acţiune ale vrăjitorului.  "
					+ "Utilizaţi tastele TAB şi SHIFT+TAB pentru a realiza navigarea de focalizare standard. Dacă focalizarea se mută "
					+ "de la titlurile paşilor următori ai vrăjitorului, modul post-examinare va fi anulat.  ",
		leadingReviewModeAnnouncement: "Modul pre-examinare al vrăjitorului cu mai mulţi paşi. Apăsaţi ALT+F12 pentru ajutor. Există ${count} paşi principali ai vrăjitorului "
					+ "anteriori pasului principal curent, inclusiv.  ",
		trailingReviewModeAnnouncement: "Modul post-examinare al vrăjitorului cu mai mulţi paşi. Apăsaţi ALT+F12 pentru ajutor. Există ${count} paşi principali "
					+ "ai vrăjitorului care urmează după pasul principal curent.  ",
		leadingReviewModeWithSubstepsAnnouncement: "Modul pre-examinare al vrăjitorului cu mai mulţi paşi. Apăsaţi ALT+F12 pentru ajutor. Există ${mainCount} "
					+ "paşi principali ai vrăjitorului anteriori pasului principal curent, inclusiv. Pasul principal curent are ${count} subpaşi "
					+ "anteriori pasului curent, inclusiv.  ",
		trailingReviewModeWithSubstepsAnnouncement: "Modul post-examinare al vrăjitorului cu mai mulţi paşi. Apăsaţi ALT+F12 pentru ajutor. Există ${mainCount} "
					+ "paşi principali ai vrăjitorului care urmează după pasul principal curent. Pasul principal curent are ${count} subpaşi care urmează "
					+ "după pasul curent.  ",
		trailingReviewOnLastError: "În prezent vă aflaţi în ultimul pas al vrăjitorului. Modul post-examinare nu este disponibil.  ",
		nextOnInvalidError: "Nu puteţi naviga la pasul următor decât după ce aţi finalizat pasul curent.  ",
		nextOnLastError: "Nu puteţi naviga la pasul următor, deoarece vă aflaţi în ultimul pas disponibil.  ",
		previousOnFirstError: "Nu puteţi naviga la pasul anterior, deoarece vă aflaţi în primul pas disponibil.  ",
		currentMainStepAnnouncement: "Pasul principal curent este ${index} din ${count}, intitulat ${title}.  ",
		currentSubstepAnnouncement: "Subpasul curent este ${index} din ${count}, intitulat ${title}.  ",
		stepChangeAnnouncment: "Pasul vrăjitorului s-a modificat.  ",		
		reviewStepAnnouncement: "Este examinat pasul principal ${index} din ${count}, intitulat ${title}.  ",
		reviewStepCurrentAnnouncement: "Acesta este pasul principal curent.  ",
		reviewStepVisitedAnnouncement: "Acest pas principal a fost marcat ca finalizat.  ",
		reviewStepDisabledAnnouncement: "Acest pas principal în prezent este dezactivat.  ",
		reviewStepClickAnnouncement: "Apăsaţi ENTER sau SPAŢIU pentru a reveni la acest pas.  ",
		reviewParentStepClickAnnouncement: "Apăsaţi ENTER sau SPAŢIU pentru a reveni la începutul acestui pas.  ",
		reviewStepUnvisitedAnnouncement: "Acest pas principal în prezent este nefinalizat.  ",
		reviewStepStartedAnnouncement: "Acest pas principal a fost început, dar nu a fost finalizat complet.  ",
		reviewSubstepAnnouncement: "Este examinat subpasul ${index} din ${count}, intitulat ${title}. Acesta este un subpas al pasului principal ${mainIndex} din ${mainCount}, intitulat ${mainTitle}.  ",
		reviewSubstepCurrentAnnouncement: "Acesta este subpasul curent.  ",
		reviewSubstepVisitedAnnouncement: "Acest subpas a fost marcat ca finalizat.  ",
		reviewSubstepDisabledAnnouncement: "Acest subpas în prezent este dezactivat.  ",

		reviewSubstepClickAnnouncement: "Apăsaţi ENTER sau SPAŢIU pentru a reveni la acest subpas.  ",
		reviewSubstepUnvisitedAnnouncement: "Acest subpas în prezent este nefinalizat.  "
});

