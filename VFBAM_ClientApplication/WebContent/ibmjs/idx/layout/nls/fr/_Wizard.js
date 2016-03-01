define({
//begin v1.x content
		next: "Suivant",
		previous: "Précédent",
		finish: "Terminer",
		cancel: "Annuler",
		save: "Enregistrer",
		// for accordion wizard
		leadingOverflowLabel: "${count} de plus",
		trailingOverflowLabel: "${count} de plus",
		a11yLabel: "Assistant multi-étapes",
		accordionAnnouncement: "Assistant multi-étapes.  Appuyez sur ALT+F12 pour obtenir de l'aide. ",
		accordionHelp: "Mode standard de l'assistant multi-étapes.  "
					 + "Utilisez ALT+ENTREE ou ALT+ESPACE pour annoncer l'étape en cours.  "
					 + "Utilisez ALT+PAGE VERS LE HAUT pour voir les étapes précédentes et en cours de l'assistant.  Utilisez ALT+PAGE VERS LE BAS pour voir les "
					 + "étapes de l'assistant qui suivent celle en cours.  Utilisez ALT + TOUCHES DE DEPLACEMENT DU CURSEUR pour aller "
					 + "aux étapes suivantes et précédentes de l'assistant.  Utilisez ALT+FIN pour zoomer sur le premier des boutons "
					 + "d'action de l'assistant.  Utilisez les touches TAB et SHIFT+TAB pour zoomer sur les éléments suivants et précédents. ",
		leadingReviewHelp: "Mode de révision principale de l'assistant multi-étapes.  "
					+ "Utilisez ALT+ENTREE ou ALT+ESPACE pour annoncer l'étape en cours.  "
					+ "Utilisez les touches ECHAP ou ALT+PAGE VERS LE HAUT pour annuler le mode de révision principale et revenir immédiatement "
					+ "à l'étape en cours de l'assistant.  "
					+ "Appuyez sur ALT+PAGE VERS LE BAS pour annuler le mode de révision principale et basculer sur le mode de révision en suivi.  "
					+ "En mode de révision principale, utilisez les touches de déplacement pour zoomer sur les "
					+ "titres des étapes précédentes et en cours de l'assistant. "
					+ "Utilisez ALT+FIN pour annuler le mode de révision principale et zoomer sur le premier des boutons d'action de l'assistant.  "
					+ "Utilisez les touches TAB et SHIFT+TAB pour effectuer une navigation standard.  "
					+ "Si le zoom quitte les titres d'étapes de l'assistant de révision principale, le mode de révision principale "
					+ "sera annulé. ",
		trailingReviewHelp: "Mode de révision en suivi de l'assistant multi-étapes.  "
					+ "Utilisez ALT+ENTREE ou ALT+ESPACE pour annoncer l'étape en cours.  "
					+ "Utilisez les touches ECHAP ou ALT+PAGE VERS LE BAS pour annuler le mode de révision en suivi et revenir immédiatement "
					+ "à l'étape en cours de l'assistant.  "
					+ "Appuyez sur ALT+PAGE VERS LE HAUT pour annuler le mode de révision en suivi et basculer sur le mode de révision principale.  "
					+ "En mode de révision en suivi, utilisez les touches de déplacement pour zoomer sur les "
					+ "titres des étapes de l'assistant qui suivent l'étape en cours.  "
					+ "Utilisez ALT+FIN pour annuler le mode de révision en suivi et zoomer sur le premier des boutons d'action de l'assistant.  "
					+ "Utilisez les touches TAB et SHIFT+TAB pour effectuer une navigation standard.  Si le zoom quitte "
					+ "les titres d'étapes de l'assistant de révision en suivi, le mode de révision en suivi sera annulé. ",
		leadingReviewModeAnnouncement: "Mode de révision principale de l'assistant multi-étapes.  Appuyez sur ALT+F12 pour obtenir de l'aide.  ${count} étape(s) principale(s) de l'assistant "
					+ "mènent à l'étape principale en cours (incluse). ",
		trailingReviewModeAnnouncement: "Mode de révision en suivi de l'assistant multi-étapes.  Appuyez sur ALT+F12 pour obtenir de l'aide.  ${count} étape(s) principale(s) "
					+ "de l'assistant suivent l'étape principale en cours. ",
		leadingReviewModeWithSubstepsAnnouncement: "Mode de révision principale de l'assistant multi-étapes.  Appuyez sur ALT+F12 pour obtenir de l'aide.  ${mainCount} "
					+ "étapes principales de l'assistant mènent à l'étape principale en cours (incluse).  L'étape principale en cours compte ${count} sous-étapes "
					+ "qui mènent à l'étape en cours (incluse). ",
		trailingReviewModeWithSubstepsAnnouncement: "Mode de révision en suivi de l'assistant multi-étapes.  Appuyez sur ALT+F12 pour obtenir de l'aide.  ${mainCount} "
					+ "étapes de l'assistant suivent l'étape principale en cours.  L'étape principale en cours compte ${count} sous-étapes qui suivent "
					+ "l'étape en cours. ",
		trailingReviewOnLastError: "Vous êtes à la dernière étape de l'assistant.  Le mode de révision en suivi n'est pas disponible. ",
		nextOnInvalidError: "Vous ne pouvez pas aller à l'étape suivante avant d'avoir terminé l'étape en cours. ",
		nextOnLastError: "Vous ne pouvez pas aller à l'étape suivante, car vous êtes à la dernière étape disponible. ",
		previousOnFirstError: "Vous ne pouvez pas aller à l'étape précédente, car vous êtes à la première étape disponible. ",
		currentMainStepAnnouncement: "L'étape principale en cours est ${index} sur ${count}, intitulée ${title}. ",
		currentSubstepAnnouncement: "La sous-étape en cours est ${index} sur ${count}, intitulée ${title}. ",
		stepChangeAnnouncment: "L'étape de l'assistant a changé. ",		
		reviewStepAnnouncement: "Révision de l'étape principale ${index} sur ${count}, intitulée ${title}. ",
		reviewStepCurrentAnnouncement: "Il s'agit de l'étape principale en cours. ",
		reviewStepVisitedAnnouncement: "Cette étape principale est marquée terminée. ",
		reviewStepDisabledAnnouncement: "Cette étape principale est actuellement désactivée. ",
		reviewStepClickAnnouncement: "Appuyez sur ENTREE ou ESPACE pour revenir à cette étape. ",
		reviewParentStepClickAnnouncement: "Appuyez sur ENTREE ou ESPACE pour revenir au début de cette étape.  ",
		reviewStepUnvisitedAnnouncement: "Cette étape principale est actuellement incomplète.  ",
		reviewStepStartedAnnouncement: "Cette étape principale est commencée, mais pas complètement terminée. ",
		reviewSubstepAnnouncement: "Révision de la sous-étape ${index} sur ${count}, intitulée ${title}.  Il s'agit d'une sous-étape de l'étape principale ${mainIndex} sur ${mainCount}, intitulée ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Il s'agit de la sous-étape en cours. ",
		reviewSubstepVisitedAnnouncement: "Cette sous-étape est marquée terminée. ",
		reviewSubstepDisabledAnnouncement: "Cette sous-étape est actuellement désactivée. ",

		reviewSubstepClickAnnouncement: "Appuyez sur ENTREE ou ESPACE pour revenir à cette sous-étape. ",
		reviewSubstepUnvisitedAnnouncement: "Cette sous-étape est actuellement incomplète. "
});

