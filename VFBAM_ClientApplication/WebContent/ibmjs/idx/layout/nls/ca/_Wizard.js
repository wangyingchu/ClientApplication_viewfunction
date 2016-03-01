define({
//begin v1.x content
		next: "Següent",
		previous: "Anterior",
		finish: "Acaba",
		cancel: "Cancel·la",
		save: "Desa",
		// for accordion wizard
		leadingOverflowLabel: "${count} Més",
		trailingOverflowLabel: "${count} Més",
		a11yLabel: "Assistent de múltiples passos",
		accordionAnnouncement: "Assistent de múltiples passos. Premeu ALT+F12 si us cal ajuda. ",
		accordionHelp: "Modalitat estàndard de l'assistent de múltiples passos. "
					 + "Feu servir ALT+INTRO o ALT+BARRA ESPAIADORA per anunciar el pas actual. "
					 + "Feu servir ALT+AV PÁG per revisar els passos anterior i actual de l'assistent. Feu servir ALT+RE PÁG per revisar els "
					 + "passos de l'assistent que van després del pas actual de l'assistent. Feu servir ALT + TECLES DE FLETXA per anar "
					 + "als passos següent i anterior de l'assistent. Feu servir ALT+FIN per canviar l'activació al primer botó d'acció "
					 + "dels que té l'assistent. Feu servir la tecla TAB i MAJÚSCULES+TAB per anar i activar els elements anterior i posterior. ",
		leadingReviewHelp: "Modalitat de revisió d'inici de l'assistent de múltiples passos. "
					+ "Feu servir ALT+INTRO o ALT+BARRA ESPAIADORA per anunciar el pas actual. "
					+ "Feu servir la tecla ESC o ALT+AV PÁG per cancel·lar la modalitat de revisió d'inici i activar immediatament "
					+ "el pas actual de l'assistent. "
					+ "Premeu ALT+RE PÁG per cancel·lar la modalitat de revisió d'inici i commutar a la modalitat de revisió final. "
					+ "Mentre estigueu en modalitat de revisió d'inici, feu servir les tecles de fletxa per activar el diversos "
					+ "títols dels passos anterior i actual de l'assistent. "
					+ "Feu servir ALT+FIN per cancel·lar la modalitat de revisió d'inici i activar el primer botó d'acció de l'assistent. "
					+ "Feu servir la tecla TAB i MAJÚSCULES+TAB per dur a terme una navegació d'activació estàndard. "
					+ "Si l'activació va més enllà dels títols dels passos de l'assistent d'inici, aleshores la modalitat de revisió d'inici "
					+ "es cancel·larà. ",
		trailingReviewHelp: "Modalitat de revisió final de l'assistent de múltiples passos. "
					+ "Feu servir ALT+INTRO o ALT+BARRA ESPAIADORA per anunciar el pas actual. "
					+ "Feu servir la tecla ESC o ALT+RE PÁG per cancel·lar la modalitat de revisió final i activar immediatament "
					+ "el pas actual de l'assistent. "
					+ "Premeu ALT+AV PÁG per cancel·lar la modalitat de revisió final i commutar a la modalitat de revisió d'inici. "
					+ "Mentre estigueu en modalitat de revisió final, feu servir les tecles de fletxa per activar el diversos "
					+ "títols dels passos de l'assistent que van després del pas actual. "
					+ "Feu servir ALT+FIN per cancel·lar la modalitat de revisió final i activar el primer botó d'acció de l'assistent. "
					+ "Feu servir la tecla TAB i MAJÚSCULES+TAB per dur a terme una navegació d'activació estàndard. Si l'activació va més enllà "
					+ "dels títols dels passos de l'assistent d'inici, aleshores la modalitat de revisió d'inici es cancel·larà. ",
		leadingReviewModeAnnouncement: "Modalitat de revisió d'inici de l'assistent de múltiples passos. Premeu ALT+F12 si us cal ajuda. Hi ha ${count} passos principals de l'assistent "
					+ "d'inici i que inclouen el pas principal actual. ",
		trailingReviewModeAnnouncement: "Modalitat de revisió final de l'assistent de múltiples passos. Premeu ALT+F12 si us cal ajuda. Hi ha ${count} passos principals "
					+ "de l'assistent d'inici que van després del pas principal actual. ",
		leadingReviewModeWithSubstepsAnnouncement: "Modalitat de revisió d'inici de l'assistent de múltiples passos. Premeu ALT+F12 si us cal ajuda. Hi ha ${mainCount} "
					+ "passos principals de l'assistent d'inici i que inclouen el pas principal actual. El pas principal actual té ${count} subpassos "
					+ "d'inici i que inclouen el pas actual. ",
		trailingReviewModeWithSubstepsAnnouncement: "Modalitat de revisió final de l'assistent de múltiples passos. Premeu ALT+F12 si us cal ajuda. Hi ha ${mainCount} "
					+ "passos de l'assistent final que van després del pas principal actual. El pas principal actual té ${count} subpassos que van després "
					+ "del pas actual. ",
		trailingReviewOnLastError: "Us trobeu ara al darrer pas de l'assistent. La modalitat de revisió d'inici no està disponible. ",
		nextOnInvalidError: "No podeu anar al pas següent fins que no hagueu completat el pas actual. ",
		nextOnLastError: "No podeu anar al pas següent perquè us trobeu al darrer pas disponible. ",
		previousOnFirstError: "No podeu anar al pas anterior perquè us trobeu al primer pas disponible. ",
		currentMainStepAnnouncement: "El pas principal actual és ${index} de ${count}, anomenat ${title}. ",
		currentSubstepAnnouncement: "El subpas actual és ${index} de ${count}, anomenat ${title}. ",
		stepChangeAnnouncment: "S'ha canviat el pas de l'assistent. ",		
		reviewStepAnnouncement: "S'està revisant el pas principal ${index} de ${count}, anomenat ${title}. ",
		reviewStepCurrentAnnouncement: "Es tracta del pas principal actual. ",
		reviewStepVisitedAnnouncement: "Aquest pas principal s'ha marcat com a completat. ",
		reviewStepDisabledAnnouncement: "Aquest pas principal està inhabilitat en aquests moments. ",
		reviewStepClickAnnouncement: "Premeu INTRO o BARRA ESPAIADORA per tornar a aquest pas. ",
		reviewParentStepClickAnnouncement: "Premeu INTRO o BARRA ESPAIADORA per tornar a l'inici d'aquest pas. ",
		reviewStepUnvisitedAnnouncement: "Aquest pas principal està incomplet en aquests moments. ",
		reviewStepStartedAnnouncement: "Aquest pas principal s'ha iniciat però no s'ha completat del tot. ",
		reviewSubstepAnnouncement: "S'està revisant el subpas ${index} de ${count}, anomenat ${title}. Es tracta d'un subpas del pas principal ${mainIndex} de ${mainCount}, anomenat ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Es tracta del subpas actual. ",
		reviewSubstepVisitedAnnouncement: "Aquest subpas s'ha marcat com a completat. ",
		reviewSubstepDisabledAnnouncement: "Aquest subpas està inhabilitat en aquests moments. ",

		reviewSubstepClickAnnouncement: "Premeu INTRO o BARRA ESPAIADORA per tornar a aquest subpas. ",
		reviewSubstepUnvisitedAnnouncement: "Aquest subpas està incomplet en aquests moments. "
});

