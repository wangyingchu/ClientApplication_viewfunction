define({
//begin v1.x content
		next: "下一步",
		previous: "上一步",
		finish: "完成",
		cancel: "取消",
		save: "儲存",
		// for accordion wizard
		leadingOverflowLabel: "尚有 ${count} 個",
		trailingOverflowLabel: "尚有 ${count} 個",
		a11yLabel: "多步驟精靈",
		accordionAnnouncement: "多步驟精靈。如需說明，請按 ALT+F12 鍵。",
		accordionHelp: "多步驟精靈的標準模式。"
					 + "使用 ALT+ENTER 鍵或 ALT+SPACE 鍵可顯示現行步驟。"
					 + "使用 ALT+PAGE UP 鍵可檢閱精靈之前及現行的步驟。使用 ALT+PAGE DOWN 鍵可檢閱"
					 + "精靈現行步驟之後的步驟。使用 ALT + 方向鍵可在"
					 + "精靈的下一步及上一步之間導覽。使用 ALT+END 鍵可將焦點移回精靈的"
					 + "的第一個動作按鈕。使用 TAB 及 SHIFT+TAB 鍵可將焦點移至下一個或前一個元素。",
		leadingReviewHelp: "多步驟精靈的檢閱前導模式。"
					+ "使用 ALT+ENTER 鍵或 ALT+SPACE 鍵可顯示現行步驟。"
					+ "使用 ESCAPE 或 ALT+PAGE UP 鍵可取消檢閱前導模式，並隨即將焦點"
					+ "傳回精靈的現行步驟。"
					+ "按 ALT+PAGE DOWN 鍵可取消檢閱前導模式，並隨即將焦點切換至檢閱後接模式。"
					+ "在檢閱前導模式中，可使用方向鍵在精靈之前及現行步驟的"
					+ "步驟標題間移動焦點。"
					+ "使用 ALT+END 鍵可取消檢閱前導模式，並將焦點移回精靈的第一個動作按鈕。"
					+ "使用 TAB 及 SHIFT+TAB 鍵可執行標準的焦點導覽。"
					+ "若焦點移出精靈前導步驟的標題，"
					+ "檢閱前導模式會隨之取消。",
		trailingReviewHelp: "多步驟精靈的檢閱後接模式。"
					+ "使用 ALT+ENTER 鍵或 ALT+SPACE 鍵可顯示現行步驟。"
					+ "使用 ESCAPE 或 ALT+PAGE DOWN 鍵可取消檢閱後接模式，並隨即將焦點"
					+ "傳回精靈的現行步驟。"
					+ "按 ALT+PAGE UP 鍵可取消檢閱後接模式，並隨即將焦點切換至檢閱前導模式。"
					+ "在檢閱後接模式中，可使用方向鍵在精靈現行步驟之後的"
					+ "步驟標題間移動焦點。"
					+ "使用 ALT+END 鍵可取消檢閱後接模式，並將焦點移回精靈的第一個動作按鈕。"
					+ "使用 TAB 及 SHIFT+TAB 鍵可執行標準的焦點導覽。若焦點移出"
					+ "精靈後接步驟的標題，檢閱後接模式會隨即取消。",
		leadingReviewModeAnnouncement: "多步驟精靈的檢閱前導模式。如需說明，請按 ALT+F12 鍵。截至現行主要步驟之前，精靈共有 ${count} 個"
					+ "主要前導步驟（含現行主要步驟）。",
		trailingReviewModeAnnouncement: "多步驟精靈的檢閱後接模式。如需說明，請按 ALT+F12 鍵。精靈在現行步驟後共有 ${count} 個主要"
					+ "後接步驟。",
		leadingReviewModeWithSubstepsAnnouncement: "多步驟精靈的檢閱前導模式。如需說明，請按 ALT+F12 鍵。截至現行主要步驟之前，精靈共有 ${mainCount} 個"
					+ "主要前導步驟（含現行主要步驟）。現行主要步驟在現行步驟之前共有 ${count} 個前導子步驟"
					+ "（含現行步驟）。",
		trailingReviewModeWithSubstepsAnnouncement: "多步驟精靈的檢閱後接模式。如需說明，請按 ALT+F12 鍵。精靈在現行主要步驟之後共有 ${mainCount} 個"
					+ "主要後接步驟。現行主要步驟在現行步驟之後共有 ${count} 個"
					+ "後接子步驟。",
		trailingReviewOnLastError: "您目前在精靈的最後一個步驟。您已無法再使用檢閱後接模式。",
		nextOnInvalidError: "您必須先完成現行步驟，才能繼續導覽到下一個步驟。",
		nextOnLastError: "因為您已在所提供的最後一個步驟，所以無法再繼續導覽到下一個步驟。",
		previousOnFirstError: "因為您已在所提供的第一個步驟，所以無法再向前導覽前一個步驟。",
		currentMainStepAnnouncement: "現行主要步驟 ${count} 之 ${index}，標題為 ${title}。",
		currentSubstepAnnouncement: "現行子步驟 ${count} 之 ${index}，標題為 ${title}。",
		stepChangeAnnouncment: "精靈步驟已變更。",		
		reviewStepAnnouncement: "正在檢閱主要步驟 ${count} 之 ${index}，標題為 ${title}。",
		reviewStepCurrentAnnouncement: "這是現行主要步驟。",
		reviewStepVisitedAnnouncement: "此主要步驟已標示為完成。",
		reviewStepDisabledAnnouncement: "此主要步驟目前為停用。",
		reviewStepClickAnnouncement: "按 ENTER 鍵或空格鍵可返回此步驟。",
		reviewParentStepClickAnnouncement: "按 ENTER 鍵或空格鍵可返回此步驟的開頭。",
		reviewStepUnvisitedAnnouncement: "此主要步驟目前尚未完成。",
		reviewStepStartedAnnouncement: "此主要步驟已開始，但未完成。",
		reviewSubstepAnnouncement: "正在檢閱子步驟 ${count} 之 ${index}，標題為 ${title}。這是主要步驟 ${mainCount} 之 ${mainIndex} 的子步驟，標題為 ${mainTitle}。",
		reviewSubstepCurrentAnnouncement: "這是現行子步驟。",
		reviewSubstepVisitedAnnouncement: "此子步驟已標示為完成。",
		reviewSubstepDisabledAnnouncement: "此子步驟目前為停用。",

		reviewSubstepClickAnnouncement: "按 ENTER 鍵或空格鍵可返回此子步驟。",
		reviewSubstepUnvisitedAnnouncement: "此子步驟目前尚未完成。"
});

