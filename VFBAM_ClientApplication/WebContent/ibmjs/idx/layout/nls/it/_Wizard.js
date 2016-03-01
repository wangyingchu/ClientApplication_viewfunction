define({
//begin v1.x content
		next: "Successivo",
		previous: "Precedente",
		finish: "Fine",
		cancel: "Annulla",
		save: "Salva",
		// for accordion wizard
		leadingOverflowLabel: "Altri ${count}",
		trailingOverflowLabel: "Altri ${count}",
		a11yLabel: "Procedura guidata a più passi",
		accordionAnnouncement: "Procedura guidata a più passi. Premere ALT+F12 per la guida. ",
		accordionHelp: "Modalità standard della procedura guidata a più passi. "
					 + "Utilizzare ALT+INVIO oppure ALT+SPAZIO per annunciare il passo corrente.  "
					 + "Utilizzare ALT+PAG SU per rivedere i passi precedenti e quello corrente della procedura guidata. Utilizzare ALT+PAG GIÙ per rivedere "
					 + "i passi della procedura guidata successivi a quello corrente. Utilizzare ALT + TASTI FRECCIA per spostarsi nei "
					 + "passi precedenti e successivi della procedura guidata. Utilizzare ALT+FINE per spostare il focus sul primo dei pulsanti "
					 + "di azione della procedura guidata. Utilizzare i tasti TAB e MAIUSC+TAB per spostare il focus sugli elementi successivi e precedenti. ",
		leadingReviewHelp: "Modalità di revisione iniziale della procedura guidata a più passi. "
					+ "Utilizzare ALT+INVIO oppure ALT+SPAZIO per annunciare il passo corrente.  "
					+ "Utilizzare il tasto ESCAPE oppure ALT+PAG SU per annullare la modalità di revisione iniziale e spostare immediatamente "
					+ "il focus sul passo corrente della procedura guidata. "
					+ "Premere ALT+PAG GIÙ per annullare la modalità di revisione iniziale e passare a quella finale. "
					+ "Mentre ci si trova in modalità di revisione iniziale, utilizzare i tasti freccia per spostare il focus "
					+ "in modo ciclico tra i titoli dei passi precedenti e di quello corrente della procedura guidata. "
					+ "Utilizzare ALT+FINE per annullare la modalità di revisione iniziale e spostare il focus sul primo dei pulsanti di azione della procedura guidata. "
					+ "Utilizzare i tasti TAB e MAIUSC+TAB per lo spostamento standard del focus. "
					+ "Se il focus si sposta dai titoli dei passi della procedura guidata iniziale, la modalità di revisione iniziale "
					+ "verrà annullata. ",
		trailingReviewHelp: "Modalità di revisione finale della procedura guidata a più passi. "
					+ "Utilizzare ALT+INVIO oppure ALT+SPAZIO per annunciare il passo corrente.  "
					+ "Utilizzare il tasto ESCAPE oppure ALT+PAG GIÙ per annullare la modalità di revisione finale e spostare immediatamente "
					+ "il focus sul passo corrente della procedura guidata. "
					+ "Premere ALT+PAG SU per annullare la modalità di revisione finale e passare a quella iniziale. "
					+ "Mentre ci si trova in modalità di revisione finale, utilizzare i tasti freccia per spostare il focus "
					+ "in modo ciclico sui titoli dei passi della procedura guidata successivi a quello corrente. "
					+ "Utilizzare ALT+FINE per annullare la modalità di revisione finale e spostare il focus sul primo dei pulsanti di azione della procedura guidata. "
					+ "Utilizzare i tasti TAB e MAIUSC+TAB per lo spostamento standard del focus. Se il focus si sposta dai "
					+ "titoli della procedura guidata finale, la modalità di revisione finale verrà annullata. ",
		leadingReviewModeAnnouncement: "Modalità di revisione iniziale della procedura guidata a più passi. Premere ALT+F12 per la guida. Ci sono ${count} passi della procedura guidata principale "
					+ "che portano e includono il passo corrente della procedura principale. ",
		trailingReviewModeAnnouncement: "Modalità di revisione finale della procedura guidata a più passi. Premere ALT+F12 per la guida. Ci sono ${count} passi della "
					+ "procedura guidata finale successivi a quello corrente della procedura principale. ",
		leadingReviewModeWithSubstepsAnnouncement: "Modalità di revisione iniziale della procedura guidata a più passi. Premere ALT+F12 per la guida. Ci sono ${mainCount} "
					+ "passi della procedura guidata principale che portano e includono il passo corrente della procedura principale. Il passo corrente della procedura principale include ${count} passi secondari "
					+ "che portano e includono il passo corrente. ",
		trailingReviewModeWithSubstepsAnnouncement: "Modalità di revisione finale della procedura guidata a più passi. Premere ALT+F12 per la guida. Ci sono ${mainCount} "
					+ "passi della procedura guidata finale successivi a quello corrente della procedura principale. Il passo corrente della procedura principale include ${count} passi secondari che seguono "
					+ "il passo corrente. ",
		trailingReviewOnLastError: "Al momento ci si trova nell'ultimo passo della procedura guidata. La modalità di revisione finale non è disponibile. ",
		nextOnInvalidError: "Non è possibile spostarsi al passo successivo fino a quando non viene completato quello corrente. ",
		nextOnLastError: "Non è possibile spostarsi al passo successivo in quanto ci si trova nell'ultimo passo disponibile. ",
		previousOnFirstError: "Non è possibile spostarsi al passo precedente in quanto ci si trova nel primo passo disponibile. ",
		currentMainStepAnnouncement: "Il passo corrente della procedura principale è ${index} di ${count}, denominato ${title}. ",
		currentSubstepAnnouncement: "Il passo secondario corrente è ${index} di ${count}, denominato ${title}. ",
		stepChangeAnnouncment: "Cambiato passo della procedura guidata. ",		
		reviewStepAnnouncement: "Revisione del passo della procedura guidata principale ${index} di ${count}, denominato ${title}. ",
		reviewStepCurrentAnnouncement: "Questo è il passo corrente della procedura principale. ",
		reviewStepVisitedAnnouncement: "Questo passo della procedura principale è stato contrassegnato come completo. ",
		reviewStepDisabledAnnouncement: "Questo passo della procedura principale è al momento disabilitato. ",
		reviewStepClickAnnouncement: "Premere INVIO oppure SPAZIO per tornare a questo passo. ",
		reviewParentStepClickAnnouncement: "Premere INVIO oppure SPAZIO per tornare all'inizio di questo passo. ",
		reviewStepUnvisitedAnnouncement: "Questo passo della procedura principale è al momento incompleto. ",
		reviewStepStartedAnnouncement: "Questo passo della procedura principale è stato avviato, ma non completato. ",
		reviewSubstepAnnouncement: "Revisione del passo secondario ${index} di ${count}, denominato ${title}. Questo è un passo secondario del passo della procedura principale ${mainIndex} di ${mainCount}, denominato ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Questo è il passo secondario corrente. ",
		reviewSubstepVisitedAnnouncement: "Questo passo secondario è stato contrassegnato come completo. ",
		reviewSubstepDisabledAnnouncement: "Questo passo secondario è al momento disabilitato. ",

		reviewSubstepClickAnnouncement: "Premere INVIO oppure SPAZIO per tornare a questo passo secondario. ",
		reviewSubstepUnvisitedAnnouncement: "Questo passo secondario è al momento incompleto. "
});

