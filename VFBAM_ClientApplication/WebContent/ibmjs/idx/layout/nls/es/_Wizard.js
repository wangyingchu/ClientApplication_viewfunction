define({
//begin v1.x content
		next: "Siguiente",
		previous: "Anterior",
		finish: "Finalizar",
		cancel: "Cancelar",
		save: "Guardar",
		// for accordion wizard
		leadingOverflowLabel: "${count} Más",
		trailingOverflowLabel: "${count} Más",
		a11yLabel: "Asistente de múltiples pasos",
		accordionAnnouncement: "Asistente de múltiples pasos. Pulse ALT+F12 si desea obtener ayuda. ",
		accordionHelp: "Modalidad estándar del asistente de múltiples pasos. "
					 + "Utilice ALT+INTRO o ALT+BARRA ESPACIADORA para anunciar el paso actual. "
					 + "Utilice ALT+RE PÁG para revisar los pasos anterior y actual del asistente. Utilice ALT+AV PÁG para revisar los "
					 + "pasos del asistente que siguen al paso actual del asistente. Utilice ALT + TECLAS DE FLECHA para ir a "
					 + "los pasos siguiente y anterior del asistente. Utilice ALT+FIN para activar el primero de los botones "
					 + "de acción del asistente. Utilice la tecla TABULADOR y MAYÚSCULAS+TABULADOR para activar el elemento siguiente y el anterior. ",
		leadingReviewHelp: "Modalidad de revisión inicial del asistente de múltiples pasos. "
					+ "Utilice ALT+INTRO o ALT+BARRA ESPACIADORA para anunciar el paso actual. "
					+ "Utilice la tecla ESC o ALT+RE PÁG para cancelar la modalidad de revisión inicial y activar de inmediato "
					+ "nuevamente el paso actual del asistente. "
					+ "Pulse ALT+AV PÁG para cancelar la modalidad de revisión inicial para conmutar a la modalidad de revisión final. "
					+ "Mientras se halle en modalidad de revisión inicial, utilice las teclas de flecha para ir activando los títulos "
					+ "de los pasos anterior y actual del asistente. "
					+ "Utilice ALT+FIN para cancelar la modalidad de revisión inicial y activar el primero de los botones de acción del asistente. "
					+ "Utilice la tecla TABULADOR y MAYÚSCULAS+TABULADOR para llevar a cabo una activación estándar. "
					+ "Si la activación va más allá de los títulos del paso de interlineado del asistente, se cancelará la "
					+ "modalidad de revisión inicial. ",
		trailingReviewHelp: "Modalidad de revisión final del asistente de múltiples pasos. "
					+ "Utilice ALT+INTRO o ALT+BARRA ESPACIADORA para anunciar el paso actual. "
					+ "Utilice la tecla ESC o ALT+AV PÁG para cancelar la modalidad de revisión final y activar de inmediato "
					+ "nuevamente el paso actual del asistente. "
					+ "Pulse ALT+RE PÁG para cancelar la modalidad de revisión final para conmutar a la modalidad de revisión inicial. "
					+ "Mientras se halle en modalidad de revisión final, utilice las teclas de flecha para ir activando los títulos "
					+ "de los pasos del asistente que siguen al paso actual. "
					+ "Utilice ALT+FIN para cancelar la modalidad de revisión final y activar el primero de los botones de acción del asistente. "
					+ "Utilice la tecla TABULADOR y MAYÚSCULAS+TABULADOR para llevar a cabo una activación estándar. Si la activación va más allá "
					+ "de los títulos de los pasos finales del asistente, se cancelará la modalidad de revisión final. ",
		leadingReviewModeAnnouncement: "Modalidad de revisión inicial del asistente de múltiples pasos. Pulse ALT+F12 si desea obtener ayuda. Hay ${count} pasos principales del asistente"
					+ "de interlineado y que incluyen el paso principal actual. ",
		trailingReviewModeAnnouncement: "Modalidad de revisión final del asistente de múltiples pasos. Pulse ALT+F12 si desea obtener ayuda. Hay ${count} pasos principales del asistente "
					+ "de interlineado que van después del paso principal actual. ",
		leadingReviewModeWithSubstepsAnnouncement: "Modalidad de revisión inicial del asistente de múltiples pasos. Pulse ALT+F12 si desea obtener ayuda. Hay ${mainCount} "
					+ "pasos principales del asistente de interlineado y que incluyen el paso principal actual. El paso principal actual tiene ${count} subpasos "
					+ "de interlineado y que incluyen el paso actual. ",
		trailingReviewModeWithSubstepsAnnouncement: "Modalidad de revisión final del asistente de múltiples pasos. Pulse ALT+F12 si desea obtener ayuda. Hay ${mainCount} "
					+ "pasos principales del asistente final que van después del paso principal actual. El paso principal actual tiene ${count} subpaso que van después "
					+ "del paso actual. ",
		trailingReviewOnLastError: "Ahora se halla en el último paso del asistente. La modalidad de revisión final no está disponible. ",
		nextOnInvalidError: "No puede ir al siguiente paso hasta que haya completado el paso actual. ",
		nextOnLastError: "No puede ir al paso siguiente porque ya está en el último paso disponible. ",
		previousOnFirstError: "No puede ir al paso anterior porque ya está en el primer paso disponible. ",
		currentMainStepAnnouncement: "El paso principal actual es ${index} de ${count}, llamado ${title}. ",
		currentSubstepAnnouncement: "El subpaso actual es ${index} de ${count}, llamado ${title}. ",
		stepChangeAnnouncment: "Ha cambiado el paso del asistente. ",		
		reviewStepAnnouncement: "Se está revisando el paso principal ${index} de ${count}, llamado ${title}. ",
		reviewStepCurrentAnnouncement: "Éste es el paso principal actual. ",
		reviewStepVisitedAnnouncement: "Este paso principal se ha marcado como completado. ",
		reviewStepDisabledAnnouncement: "Este paso principal está inhabilitado actualmente. ",
		reviewStepClickAnnouncement: "Pulse INTRO o BARRA ESPACIADORA para volver a este paso. ",
		reviewParentStepClickAnnouncement: "Pulse INTRO o BARRA ESPACIADORA para volver al inicio de este paso. ",
		reviewStepUnvisitedAnnouncement: "Este paso principal está incompleto actualmente. ",
		reviewStepStartedAnnouncement: "Este paso principal se ha iniciado pero no se ha completado del todo. ",
		reviewSubstepAnnouncement: "Se está revisando el subpaso ${index} de ${count}, llamado ${title}. Se trata de un subpaso del paso principal ${mainIndex} de${mainCount}, llamado ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Es el subpaso actual. ",
		reviewSubstepVisitedAnnouncement: "Este subpaso se ha marcado como completado. ",
		reviewSubstepDisabledAnnouncement: "Este subpaso está actualmente inhabilitado. ",

		reviewSubstepClickAnnouncement: "Pulse INTRO o BARRA ESPACIADORA par volver a este subpaso. ",
		reviewSubstepUnvisitedAnnouncement: "Este subpaso está actualmente incompleto. "
});

