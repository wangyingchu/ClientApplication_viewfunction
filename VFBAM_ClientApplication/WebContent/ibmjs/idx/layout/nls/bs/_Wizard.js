define({
//begin v1.x content
		next: "Hurrengoa",
		previous: "Aurrekoa",
		finish: "Amaitu",
		cancel: "Utzi",
		save: "Gorde",
		// for accordion wizard
		leadingOverflowLabel: "${count} gehiago",
		trailingOverflowLabel: "${count} gehiago",
		a11yLabel: "Hainbat urratsetako morroia",
		accordionAnnouncement: "Hainbat urratsetako morroia.  Sakatu ALT+F12 laguntza eskuratzeko. ",
		accordionHelp: "Hainbat urratsetako morroiaren modu estandarra.  "
					 + "Erabili ALT+SARTU edo ALT+ZURIUNEA uneko urratsa adierazteko.  "
					 + "Erabili ALT+ORR GOR aurreko eta uneko urratsak berrikusteko.  Erabili ALT+ORR BEH "
					 + "uneko urratsaren ondoren datozenak berrikusteko.  Erabili ALT + GEZI TEKLAK "
					 + "aurreko eta hurrengo urratsetara nabigatzeko. Erabili ALT+AMAI fokua morroiaren lehenengo ekintza"
					 + "botoira eramateko.  Erabili TAB eta MAIUS+TAB teklak fokua hurrengo edo aurreko elementuetara eramateko. ",
		leadingReviewHelp: "Aurreko urratsak berrikusteko modua.  "
					+ "Erabili ALT+SARTU edo ALT+ZURIUNEA uneko urratsa adierazteko.  "
					+ "Erabili ESCAPE tekla edo ALT+ORR GOR aurreko urratsak berrikusteko modua uzteko eta fokua"
					+ "uneko urratsera ekartzeko.  "
					+ "Erabili ALT+ORR BEH tekla aurreko urratsak berrikusteko modua uzteko eta hurrengo urratsak berrikusteko modura pasatzeko.  "
					+ "Aurreko urratsak berrikusteko moduan, erabili gezi-teklak fokua "
					+ "aurreko eta uneko urratsen tituluen artean pasatzeko. "
					+ "Sakatu ALT+AMAI aurreko urratsak berrikusteko modua uzteko eta fokua morroiaren ekintzen lehenengo botoira eramateko.  "
					+ "Erabili TAB eta MAIUS+TAB teklak fokuarekin modu estandarrean nabigatzeko.  "
					+ "Fokua aurreko urratsen izenburuetatik at irteten bada, aurreko urratsak berrikusteko modua "
					+ "utzi egingo da. ",
		trailingReviewHelp: "Hurrengo urratsak berrikusteko modua.  "
					+ "Erabili ALT+SARTU edo ALT+ZURIUNEA uneko urratsa adierazteko.  "
					+ "Erabili ESCAPE tekla edo ALT+ORR BEH hurrengo urratsak berrikusteko modua uzteko eta fokua "
					+ "uneko urratsera itzultzeko.  "
					+ "Erabili ALT+ORR GOR tekla hurrengo urratsak berrikusteko modua uzteko eta aurreko urratsak berrikusteko modura pasatzeko.  "
					+ "Hurrengo urratsak berrikusteko moduan, erabili gezi-teklak fokua "
					+ "uneko urratsaren ondoren datozen urratsen izenburu batetik bestera pasatzeko.  "
					+ "Sakatu ALT+AMAI hurrengo urratsak berrikusteko modua uzteko eta fokua morroiaren ekintzen lehenengo botoira eramateko.  "
					+ "Erabili TAB eta MAIUS+TAB teklak fokuarekin modu estandarrean nabigatzeko.  Fokua"
					+ "hurrengo urratsen izenburuetatik at irteten bada, hurrengo urratsak berrikusteko modua utzi egingo da. ",
		leadingReviewModeAnnouncement: "Aurreko urratsak berrikusteko modua.  Sakatu ALT+F12 laguntza eskuratzeko.  Uneko urratsa eta haren aurretik daudenak ${count} "
					+ "dira. ",
		trailingReviewModeAnnouncement: "Hurrengo urratsak berrikusteko modua.  Sakatu ALT+F12 laguntza eskuratzeko.  ${count} urrats nagusi daude "
					+ "uneko urratsaren ondoren. ",
		leadingReviewModeWithSubstepsAnnouncement: "Aurreko urratsak berrikusteko modua.  Sakatu ALT+F12 laguntza eskuratzeko.  ${mainCount} "
					+ "urrats nagusi daude honen aurretik, uneko urrats nagusia barne.  Uneko urrats nagusiaren barnean ${count} bigarren mailako urrats daude"
					+ "uneko urratsaren aurretik (hau barne). ",
		trailingReviewModeWithSubstepsAnnouncement: "Hurrengo urratsak berrikusteko modua.  Sakatu ALT+F12 laguntza eskuratzeko.  ${mainCount} "
					+ "urrats nagusi daude unekoaren ostean.  Uneko urrats nagusiaren barnean ${count} bigarren mailako urrats daude,"
					+ "uneko urratsaren ondoren. ",
		trailingReviewOnLastError: "Morroiaren azken urratsean zaude.  Ezin duzu hurrengo urratsak berrikusteko modua erabili.",
		nextOnInvalidError: "Ezin zara hurrengo urratsera pasa unekoa burutu arte. ",
		nextOnLastError: "Ezin zara hurrengo urratsera pasa, azken urrats eskuragarrian baitzaude.",
		previousOnFirstError: "Ezin zara aurreko urratsera pasa, lehenengo urrats eskuragarrian baitzaude. ",
		currentMainStepAnnouncement: "Uneko urrats nagusia ${index}.a da ${count}(e)tik eta hau da bere izenburua: ${title}. ",
		currentSubstepAnnouncement: "Uneko bigarren mailako urratsa ${index}.a da ${count}(e)tik eta hau da bere izenburua: ${title}. ",
		stepChangeAnnouncment: "Urratsa aldatu egin da.",		
		reviewStepAnnouncement: "${index}. urrats nagusia berrikusten ari zara ${count}(e)tik; hau da bere izenburua: ${title}. ",
		reviewStepCurrentAnnouncement: "Hau da uneko urrats nagusia. ",
		reviewStepVisitedAnnouncement: "Urrats nagusi hau burutu bezala markatu da.",
		reviewStepDisabledAnnouncement: "Une honetan urrats nagusi hau desgaituta dago. ",
		reviewStepClickAnnouncement: "Sakatu SARTU edo ZURIUNEA urrats honetara itzultzeko.",
		reviewParentStepClickAnnouncement: "Sakatu SARTU edo ZURIUNEA urrats honen hasierara itzultzeko. ",
		reviewStepUnvisitedAnnouncement: "Une honetan urrats nagusi hau osatu gabe dago. ",
		reviewStepStartedAnnouncement: "Urrats nagusi hau hasi da baina ez da erabat osatu. ",
		reviewSubstepAnnouncement: "${index}. bigarren mailako urratsa berrikusten ari zara ${count}(e)tik; hau da bere izenburua: ${title}.  Hau ${mainCount}(e)tik ${mainIndex}. urrats nagusiko bigarren mailako urratsa da, eta hau da bere izenburua: ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Hau da uneko bigarren mailako urratsa. ",
		reviewSubstepVisitedAnnouncement: "Bigarren mailako urrats hau burutu bezala markatu da. ",
		reviewSubstepDisabledAnnouncement: "Une honetan bigarren mailako urrats hau desgaituta dago. ",

		reviewSubstepClickAnnouncement: "Sakatu SARTU edo ZURIUNEA bigarren mailako urrats honetara itzultzeko. ",
		reviewSubstepUnvisitedAnnouncement: "Une honetan bigarren mailako urrats hau osatu gabe dago. "
});

