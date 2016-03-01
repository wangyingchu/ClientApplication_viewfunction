define({
//begin v1.x content
		next: "Következő",
		previous: "Előző",
		finish: "Befejezés",
		cancel: "Mégse",
		save: "Mentés",
		// for accordion wizard
		leadingOverflowLabel: "${count} további",
		trailingOverflowLabel: "${count} további",
		a11yLabel: "Többlépéses varázsló",
		accordionAnnouncement: "Többlépéses varázsló.  A súgóért nyomja meg az ALT+F12 billentyűkombinációt. ",
		accordionHelp: "Többlépéses varázsló normál mód.  "
					 + "Az ALT+ENTER vagy ALT+SZÓKÖZ használatával hirdetheti az aktuális lépést.  "
					 + "Az ALT+PAGE UP használatával tekintheti át az előző és az aktuális varázslólépést.  Az ALT+PAGE DOWN használatával "
					 + "tekintheti át az aktuális varázslólépést követő varázslólépéseket.  Az ALT + NYÍL BILLENTYŰK használatával "
					 + "navigálhat a következő és előző varázslólépésekhez.  Az ALT+END használatával helyezheti a fókuszt a varázsló "
					 + "első gombjára.  A TAB és a SHIFT+TAB használatával helyezheti át a fókuszt a következő, illetve előző elemekre. ",
		leadingReviewHelp: "Többlépéses varázsló bevezető áttekintő mód.  "
					+ "Az ALT+ENTER vagy ALT+SPACE használatával hirdetheti az aktuális lépést.  "
					+ "Az ESCAPE vagy az ALT+PAGE UP használatával szakíthatja meg a bevezető áttekintő módot és azonnal "
					+ "visszaállíthatja a fókuszt az aktuális varázslólépésre.  "
					+ "Az ALT+PAGE DOWN használatával szakíthatja meg a bevezető áttekintő módot és válthat lezáró áttekintő módra.  "
					+ "Bevezető áttekintő módban a nyíl billentyűkkel válthatja a fókuszt ciklikusan az "
					+ "előző és az aktuális varázslólépések címei között. "
					+ "Az ALT+END használatával szakíthatja meg a bevezető áttekintő módot és helyezheti a fókuszt a legelső varázslógombra.  "
					+ "A TAB és a SHIFT+TAB használatával hajthat végre normál fókusznavigációt.  "
					+ "Ha a fókusz elkerül a bbevezető varázslólépés címekről, akkor a bevezető áttekintő mód "
					+ "megszakításra kerül. ",
		trailingReviewHelp: "Többlépéses varázsló lezáró áttekintő mód.  "
					+ "Az ALT+ENTER vagy ALT+SPACE használatával hirdetheti az aktuális lépést.  "
					+ "Az ESCAPE vagy az ALT+PAGE DOWN használatával szakíthatja meg a lezáró áttekintő módot és azonnal "
					+ "visszaállíthatja a fókuszt az aktuális varázslólépésre.  "
					+ "Az ALT+PAGE UP használatával szakíthatja meg a lezáró áttekintő módot és válthat bevezető áttekintő módra.  "
					+ "Lezáró áttekintő módban a nyíl billentyűkkel válthatja a fókuszt ciklikusan az "
					+ "aktuális lépést követő varázslólépések címe között.  "
					+ "Az ALT+END használatával szakíthatja meg a lezáró áttekintő módot és helyezheti a fókuszt a legelső varázslógombra.  "
					+ "A TAB és a SHIFT+TAB használatával hajthat végre normál fókusznavigációt.  Ha a fókusz elkerül "
					+ "a lezáró varázslólépés címekről, akkor a lezáró áttekintő mód megszakításra kerül. ",
		leadingReviewModeAnnouncement: "Többlépéses varázsló bevezető áttekintő mód.  A súgóért nyomja meg az ALT+F12 billentyűkombinációt. Az aktuális fő lépést ${count} "
					+ "fő varázslólépés vezeti be, az aktuális fő lépést is beleértve. ",
		trailingReviewModeAnnouncement: "Többlépéses varázsló lezáró áttekintő mód.  A súgóért nyomja meg az ALT+F12 billentyűkombinációt. Az aktuális fő lépést ${count} "
					+ "lezáró fő varázslólépés követi.  ",
		leadingReviewModeWithSubstepsAnnouncement: "Többlépéses varázsló bevezető áttekintő mód.  A súgóért nyomja meg az ALT+F12 billentyűkombinációt. Az aktuális fő lépést ${mainCount} "
					+ "fő varázslólépés vezeti be, az aktuális fő lépést is beleértve.  Az aktuális fő lépésben ${count} allépés "
					+ "vezeti be az aktuális lépést, az aktuális lépést is beleértve. ",
		trailingReviewModeWithSubstepsAnnouncement: "Többlépéses varázsló lezáró áttekintő mód.  A súgóért nyomja meg az ALT+F12 billentyűkombinációt. Az aktuális fő lépést ${mainCount} "
					+ "lezáró fő varázslólépés követi.  Az aktuális fő lépésben ${count} allépés követi "
					+ "az aktuális lépést. ",
		trailingReviewOnLastError: "Jelenleg a varázsló utolsó lépésén tartózkodik.  A lezáró áttekintő mód nem érhető el. ",
		nextOnInvalidError: "Nem navigálhat a következő lépéshez, amíg be nem fejezte az aktuális lépést. ",
		nextOnLastError: "Nem navigálhat a következő lépéshez, mert az utolsó elérhető lépésen tartózkodik. ",
		previousOnFirstError: "Nem navigálhat az előző lépéshez, mert az első elérhető lépésen tartózkodik. ",
		currentMainStepAnnouncement: "Az aktuális lépés: ${count}/${index}. (cím: ${title}). ",
		currentSubstepAnnouncement: "Az aktuális allépés: ${count}/${index}. (cím: ${title}). ",
		stepChangeAnnouncment: "Varázsló lépés módosítva. ",		
		reviewStepAnnouncement: "${count}/${index}. lépés (cím: ${title}) áttekintése.  ",
		reviewStepCurrentAnnouncement: "Ez az aktuális fő lépés. ",
		reviewStepVisitedAnnouncement: "Ez a fő lépés befejezettként jelölt. ",
		reviewStepDisabledAnnouncement: "Ez a fő lépés pillanatnyilag tiltott. ",
		reviewStepClickAnnouncement: "Az ENTER vagy SZÓKÖZ használatával térhet vissza ehhez a lépéshez. ",
		reviewParentStepClickAnnouncement: "Az ENTER vagy a SZÓKÖZ használatával térhet vissza a lépés kezdetéhez. ",
		reviewStepUnvisitedAnnouncement: "Ez a fő lépés pillanatnyilag befejezetlen. ",
		reviewStepStartedAnnouncement: "Ez a fő lépés elindult, de nem fejeződött be. ",
		reviewSubstepAnnouncement: "${count}/${index}. allépés (cím: ${title}) áttekintése.  Ez a(z) ${mainCount}/${mainIndex}. lépés (cím: ${mainTitle}) allépése. ",
		reviewSubstepCurrentAnnouncement: "Ez az aktuális allépés. ",
		reviewSubstepVisitedAnnouncement: "Ez az allépés befejezettként van megjelölve. ",
		reviewSubstepDisabledAnnouncement: "Ez az allépés pillanatnyilag tiltott. ",

		reviewSubstepClickAnnouncement: "Az ENTER vagy SZÓKÖZ használatával térhet vissza ehhez az allépéshez. ",
		reviewSubstepUnvisitedAnnouncement: "Ez az allépés pillanatnyilag befejezetlen. "
});

