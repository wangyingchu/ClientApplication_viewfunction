define({
//begin v1.x content
		next: "Seguinte",
		previous: "Anterior",
		finish: "Terminar",
		cancel: "Cancelar",
		save: "Guardar",
		// for accordion wizard
		leadingOverflowLabel: "Mais ${count}",
		trailingOverflowLabel: "Mais ${count}",
		a11yLabel: "Assistente com Múltiplos Passos",
		accordionAnnouncement: "Assistente com Múltiplos Passos. Prima ALT+F12 para obter ajuda.  ",
		accordionHelp: "Modo padrão do Assistente com múltiplos passos.  "
					 + "Utilize ALT+ENTER ou ALT+Barra de Espaços para anunciar o passo actual.  "
					 + "Utilize ALT+PAGE UP para rever os passos do assistente anteriores e actual. Utilize ALT+PAGE DOWN para rever os "
					 + "passos do assistente que precedem o passo actual do assistente. Utilize ALT + TECLAS DE SETAS para navegar para "
					 + "os passos seguintes e anteriores do assistente. Utilize ALT+END para alterar o foco para o primeiro dos botões "
					 + "de acção do assistente. Utilize a tecla TAB e teclas SHIFT+TAB para navegar o foco para os elementos anteriores e posteriores.  ",
		leadingReviewHelp: "Modo de visualização precedente do assistente com múltiplos passos. "
					+ "Utilize ALT+ENTER ou ALT+Barra de Espaços para anunciar o passo actual.  "
					+ "Utilize a tecla ESC ou ALT+PAGE UP para cancelar o modo de visualização precedente e devolver imediatamente "
					+ "o foco ao passo actual do assistente.  "
					+ "Prima ALT+PAGE DOWN para cancelar o modo de visualização precedente e alterar para o modo de visualização subsequente.  "
					+ "Enquanto está no modo de visualização precedente, utilize as teclas de setas para percorrer ciclicamente o foco pelos "
					+ "títulos dos passos anteriores e actual do assistente.  "
					+ "Utilize ALT+END para cancelar o modo de visualização precedente e alterar o foco para o primeiro dos botões de acção do assistente.  "
					+ "Utilize a tecla TAB e SHIFT+TAB para executar a navegação de foco padrão.  "
					+ "Se o foco sair dos títulos do passo precedente do assistente, então o modo de visualização precedente "
					+ "será cancelado.  ",
		trailingReviewHelp: "Modo de visualização subsequente do assistente com múltiplos passos. "
					+ "Utilize ALT+ENTER ou ALT+Barra de Espaços para anunciar o passo actual.  "
					+ "Utilize a tecla ESC ou ALT+PAGE DOWN para cancelar o modo de visualização subsequente e devolver imediatamente "
					+ "o foco ao passo actual do assistente.  "
					+ "Prima ALT+PAGE UP para cancelar o modo de visualização subsequente e alterar para o modo de visualização precedente.  "
					+ "Enquanto está no modo de visualização subsequente, utilize as teclas de setas para percorrer ciclicamente o foco pelos "
					+ "títulos dos passos do assistente que se seguem ao passo actual. "
					+ "Utilize ALT+END para cancelar o modo de visualização subsequente e alterar o foco para o primeiro dos botões de acção do assistente.  "
					+ "Utilize a tecla TAB e SHIFT+TAB para executar a navegação de foco padrão. Se o foco sair dos "
					+ "títulos do passo subsequente do assistente, então o modo de visualização subsequente será cancelado.  ",
		leadingReviewModeAnnouncement: "Modo de visualização precedente do assistente com múltiplos passos. Prima ALT+F12 para obter ajuda. Há ${count} passos principais do assistente "
					+ "até e incluindo o passo principal actual.  ",
		trailingReviewModeAnnouncement: "Modo de visualização subsequente do assistente com múltiplos passos. Prima ALT+F12 para obter ajuda. Há ${count} passos "
					+ "principais subsequentes do assistente que se seguem ao passo principal actual.  ",
		leadingReviewModeWithSubstepsAnnouncement: "Modo de visualização precedente do assistente com múltiplos passos. Prima ALT+F12 para obter ajuda. Há ${mainCount} "
					+ "precedentes principais do assistente até e incluindo o passo principal actual. O passo principal actual tem ${count} subpassos "
					+ "até e incluindo o passo actual.  ",
		trailingReviewModeWithSubstepsAnnouncement: "Modo de visualização subsequente do assistente com múltiplos passos. Prima ALT+F12 para obter ajuda. Há ${mainCount} "
					+ "passos principais subsequentes do assistente que se seguem ao passo principal actual. O passo principal actual tem ${count} subpassos que seguem "
					+ "o passo actual.  ",
		trailingReviewOnLastError: "Presentemente está no último passo do assistente. O modo de visualização subsequente não está disponível.  ",
		nextOnInvalidError: "Não é possível navegar para o próximo passo até que tenha concluído o passo actual.  ",
		nextOnLastError: "Não é possível navegar para o próximo passo porque está no último passo disponível.  ",
		previousOnFirstError: "Não é possível navegar para o passo anterior porque está no primeiro passo disponível.  ",
		currentMainStepAnnouncement: "O passo principal actual é ${index} de ${count}, denominado ${title}.  ",
		currentSubstepAnnouncement: "O subpasso actual é ${index} de ${count}, denominado ${title}.  ",
		stepChangeAnnouncment: "Alterou-se o passo do assistente.  ",		
		reviewStepAnnouncement: "A rever o passo principal ${index} de ${count}, denominado ${title}.  ",
		reviewStepCurrentAnnouncement: "Este é o actual passo principal.  ",
		reviewStepVisitedAnnouncement: "Este passo principal foi marcado como concluído.  ",
		reviewStepDisabledAnnouncement: "Este passo principal está actualmente desactivado.  ",
		reviewStepClickAnnouncement: "Prima ENTER ou Barra de Espaços para regressar a este passo.  ",
		reviewParentStepClickAnnouncement: "Prima ENTER ou Barra de Espaços para regressar ao inicio deste passo.  ",
		reviewStepUnvisitedAnnouncement: "Presentemente este passo principal está incompleto.  ",
		reviewStepStartedAnnouncement: "Este passo principal foi iniciado, mas não foi completamente concluído.  ",
		reviewSubstepAnnouncement: "Rever o subpasso ${index} de ${count}, denominado ${title}. Este é um subpasso do passo principal ${mainIndex} de ${mainCount}, denominado ${mainTitle}.  ",
		reviewSubstepCurrentAnnouncement: "Este é o subpasso actual.  ",
		reviewSubstepVisitedAnnouncement: "Este subpasso foi marcado como concluído.  ",
		reviewSubstepDisabledAnnouncement: "Este subpasso está actualmente desactivado.  ",

		reviewSubstepClickAnnouncement: "Prima ENTER ou Barra de Espaços para regressar a este subpasso.  ",
		reviewSubstepUnvisitedAnnouncement: "Este subpasso está actualmente incompleto.  "
});

