define({
//begin v1.x content
		next: "Avançar",
		previous: "Anterior",
		finish: "Concluir",
		cancel: "Cancelar",
		save: "Salvar",
		// for accordion wizard
		leadingOverflowLabel: "${count} Mais",
		trailingOverflowLabel: "${count} Mais",
		a11yLabel: "Assistente de Várias Etapas",
		accordionAnnouncement: "Assistente de Várias Etapas.Pressione ALT+F12 para obter ajuda. ",
		accordionHelp: "Modo padrão do assistente de várias etapas. "
					 + "Use ALT+ENTER ou ALT+SPACE para anunciar a etapa atual. "
					 + "Use ALT+PAGE UP para revisar as etapas anteriores e atuais do assistente.Use ALT+PAGE DOWN para revisar as"
					 + "etapas posteriores à etapa atual do assistente.Use ALT + TECLAS DE SETA para navegar"
					 + "nas etapas posteriores e anteriores do assistente.Use ALT+END para colocar o foco no primeiro dos botões"
					 + "de ação do assistente.Use as teclas TAB e SHIFT+TAB para direcionar o foco até os elementos posteriores e os anteriores. ",
		leadingReviewHelp: "Modo de revisão principal do assistente de várias etapas. "
					+ "Use ALT+ENTER ou ALT+SPACE para anunciar a etapa atual. "
					+ "Use a tecla ESCAPE ou ALT+PAGE UP para cancelar o modo de revisão principal e retornar imediatamente"
					+ "o foco para a etapa atual do assistente. "
					+ "Pressione ALT+PAGE DOWN para cancelar o modo de revisão principal e alternar para o modo de revisão final. "
					+ "No modo de revisão principal, use as teclas de seta para circular o foco pelos"
					+ "títulos das etapas anteriores e atuais do assistente. "
					+ "Use ALT+END para cancelar o modo de revisão principal e passar o foco para o primeiro dos botões de ação do assistente. "
					+ "Use as teclas TAB e SHIFT+TAB para executar a navegação de foco padrão. "
					+ "Se o foco sair dos títulos da etapa principal do assistente, o modo de revisão principal"
					+ "será cancelado. ",
		trailingReviewHelp: "Modo de revisão final do assistente de várias etapas. "
					+ "Use ALT+ENTER ou ALT+SPACE para anunciar a etapa atual. "
					+ "Use a tecla ESCAPE ou ALT+PAGE DOWN para cancelar o modo de revisão final e retornar imediatamente"
					+ "o foco para a etapa atual do assistente. "
					+ "Pressione ALT+PAGE UP para cancelar o modo de revisão final e alternar para o modo de revisão principal. "
					+ "No modo de revisão final, use as teclas de seta para circular o foco pelos"
					+ "títulos das etapas do assistente posteriores à etapa atual. "
					+ "Use ALT+END para cancelar o modo de revisão final e passar o foco para o primeiro dos botões de ação do assistente. "
					+ "Use as teclas TAB e SHIFT+TAB para executar a navegação de foco padrão.Se o foco sair dos"
					+ "títulos da etapa do assistente final, o modo de revisão final será cancelado. ",
		leadingReviewModeAnnouncement: "Modo de revisão principal do assistente de várias etapas.Pressione ALT+F12 para obter ajuda.Há ${count} etapas do assistente principal"
					+ "que conduzem à etapa atual principal, incluindo-a. ",
		trailingReviewModeAnnouncement: "Modo de revisão final do assistente de várias etapas.Pressione ALT+F12 para obter ajuda.Há ${count} etapas"
					+ "do assistente principal posteriores à etapa atual principal. ",
		leadingReviewModeWithSubstepsAnnouncement: "Modo de revisão principal do assistente de várias etapas.Pressione ALT+F12 para obter ajuda.Há ${mainCount} "
					+ "etapas principais do assistente que conduzem à etapa atual principal, incluindo-a.A etapa atual principal tem ${count} subetapas "
					+ "que conduzem à etapa atual, incluindo-a. ",
		trailingReviewModeWithSubstepsAnnouncement: "Modo de revisão final do assistente de várias etapas.Pressione ALT+F12 para obter ajuda.Há ${mainCount} "
					+ "etapas do assistente principal final posteriores à etapa atual principal.A etapa atual principal tem ${count} subetapas posteriores "
					+ "à etapa atual. ",
		trailingReviewOnLastError: "Atualmente, você está na última etapa do assistente.O modo de revisão final não está disponível. ",
		nextOnInvalidError: "Não é possível navegar para a próxima etapa até ter concluído a etapa atual. ",
		nextOnLastError: "Não é possível navegar para a próxima etapa, pois você está na última etapa disponível. ",
		previousOnFirstError: "Não é possível navegar para a etapa anterior, pois você está na primeira etapa disponível. ",
		currentMainStepAnnouncement: "A etapa atual principal é ${index} de ${count}, intitulada ${title}. ",
		currentSubstepAnnouncement: "A subetapa atual é ${index} de ${count}, intitulada ${title}. ",
		stepChangeAnnouncment: "A etapa do assistente mudou. ",		
		reviewStepAnnouncement: "Revisando a etapa principal ${index} de ${count}, intitulada ${title}. ",
		reviewStepCurrentAnnouncement: "Esta é a etapa principal atual. ",
		reviewStepVisitedAnnouncement: "Esta etapa principal foi marcada como concluída. ",
		reviewStepDisabledAnnouncement: "Esta etapa principal está atualmente desativada. ",
		reviewStepClickAnnouncement: "Pressione ENTER ou ESPAÇO para retornar a esta etapa. ",
		reviewParentStepClickAnnouncement: "Pressione ENTER ou ESPAÇO para retornar ao início desta etapa. ",
		reviewStepUnvisitedAnnouncement: "Esta etapa principal está atualmente incompleta. ",
		reviewStepStartedAnnouncement: "A etapa principal foi iniciada, mas não totalmente concluída. ",
		reviewSubstepAnnouncement: "Revisando a subetapa ${index} de ${count}, intitulada ${title}.  Esta é uma subetapa da etapa principal ${mainIndex} de ${mainCount}, intitulada ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Esta é a subetapa atual. ",
		reviewSubstepVisitedAnnouncement: "Esta subetapa foi marcada como concluída. ",
		reviewSubstepDisabledAnnouncement: "Esta subetapa está atualmente desativada. ",

		reviewSubstepClickAnnouncement: "Pressione ENTER ou ESPAÇO para retornar a esta subetapa. ",
		reviewSubstepUnvisitedAnnouncement: "Esta subetapa está atualmente incompleta. "
});

