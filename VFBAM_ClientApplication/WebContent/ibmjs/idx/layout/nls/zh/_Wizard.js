define({
//begin v1.x content
		next: "下一页",
		previous: "上一页",
		finish: "完成",
		cancel: "取消",
		save: "保存",
		// for accordion wizard
		leadingOverflowLabel: "更多（${count} 个）",
		trailingOverflowLabel: "更多（${count} 个）",
		a11yLabel: "多步骤向导",
		accordionAnnouncement: "多步骤向导。按 ALT+F12 以获取帮助。",
		accordionHelp: "多步骤向导标准方式。"
					 + "使用 ALT+ENTER 或 ALT+SPACE 来声明当前步骤。"
					 + "使用 ALT+PAGE UP 来查看先前和当前的向导步骤。使用 ALT+PAGE DOWN 查看"
					 + "当前向导步骤之后的向导步骤。使用 ALT + 方向键来浏览"
					 + "下一个和上一个向导步骤。使用 ALT+END 使焦点跳至第一个"
					 + "向导操作按钮。使用 TAB 键和 SHIFT+TAB 使焦点浏览至下一个和前一个元素。",
		leadingReviewHelp: "多步骤向导前置查看方式。"
					+ "使用 ALT+ENTER 或 ALT+SPACE 来声明当前步骤。"
					+ "使用 ESCAPE 键或 ALT+PAGE UP 来取消前置查看方式并将焦点立即返回"
					+ "到当前向导步骤。"
					+ "按 ALT+PAGE DOWN 以取消前置查看方式，并切换至后置查看方式。"
					+ "在前置查看方式下，使用方向键来使焦点在先前和当前"
					+ "向导步骤标题间进行循环。"
					+ "使用 ALT+END 来取消前置查看方式，并使焦点跳至第一个向导操作按钮。"
					+ "使用 TAB 键和 SHIFT+TAB 来执行标准焦点导航。"
					+ "如果焦点转换远离前置向导步骤标题，那么随后"
					+ "将取消前置查看方式。",
		trailingReviewHelp: "多步骤向导后置查看方式。"
					+ "使用 ALT+ENTER 或 ALT+SPACE 来声明当前步骤。"
					+ "使用 ESCAPE 键或 ALT+PAGE DOWN 来取消后置查看方式并将焦点立即返回"
					+ "到当前向导步骤。"
					+ "按 ALT+PAGE UP 来取消后置查看方式，并切换至前置查看方式。"
					+ "在后置查看方式下，使用方向键在当前步骤后的向导步骤标题之间"
					+ "进行循环。"
					+ "使用 ALT+END 来取消后置查看方式，并使焦点跳至第一个向导操作按钮。"
					+ "使用 TAB 键和 SHIFT+TAB 来执行标准焦点导航。如果焦点转换远离尾随向导步骤标题，"
					+ "那么将取消后置查看方式。",
		leadingReviewModeAnnouncement: "多步骤向导前置查看方式。按 ALT+F12 以获取帮助。在当前主要步骤前有 ${count} 个主要向导"
					+ "步骤（包括当前步骤）。",
		trailingReviewModeAnnouncement: "多步骤向导后置查看方式。按 ALT+F12 以获取帮助。在当前主要步骤之后有 ${count} 个"
					+ "后置主要向导步骤。",
		leadingReviewModeWithSubstepsAnnouncement: "多步骤向导前置查看方式。按 ALT+F12 以获取帮助。在当前主要步骤之前有 ${mainCount} 个"
					+ "主要向导步骤（包括当前主要步骤）。当前主要步骤前面有 ${count} 个子步骤"
					+ "（包括当前步骤）。",
		trailingReviewModeWithSubstepsAnnouncement: "多步骤向导后置查看方式。按 ALT+F12 以获取帮助。当前主要步骤之后有 ${mainCount} "
					+ "个后置主要向导步骤。当前主要步骤之后有 ${count} 个"
					+ "子步骤。",
		trailingReviewOnLastError: "您现在处于向导的最后一个步骤。后置查看方式不可用。",
		nextOnInvalidError: "必须先完成当前步骤，然后才能浏览至下一步骤。",
		nextOnLastError: "由于您已处于最后一个可用步骤，因此无法浏览至下一步骤。",
		previousOnFirstError: "由于您已处于第一个可用步骤，因此无法浏览至上一步骤。",
		currentMainStepAnnouncement: "当前主要步骤为第 ${index} 个主要步骤（共 ${count} 个主要步骤），名为 ${title}。",
		currentSubstepAnnouncement: "当前子步骤为第 ${index} 个子步骤（共 ${count} 个子步骤），名为 ${title}。",
		stepChangeAnnouncment: "向导步骤已更改。",		
		reviewStepAnnouncement: "正在查看第 ${index} 个主要步骤（共 ${count} 个主要步骤），名为 ${title}。",
		reviewStepCurrentAnnouncement: "这是当前主要步骤。",
		reviewStepVisitedAnnouncement: "该主要步骤已标记为完成。",
		reviewStepDisabledAnnouncement: "该主要步骤当前已禁用。",
		reviewStepClickAnnouncement: "按 ENTER 键或 SPACE 键以返回到该步骤。",
		reviewParentStepClickAnnouncement: "按 ENTER 键或 SPACE 键以返回到该步骤的开始处。",
		reviewStepUnvisitedAnnouncement: "该主要步骤当前未完成。",
		reviewStepStartedAnnouncement: "该主要步骤已启动，但尚未彻底完成。",
		reviewSubstepAnnouncement: "正在查看第 ${index} 个子步骤（共 ${count} 个子步骤），名为 ${title}。这是主要步骤 ${mainIndex}（共 ${mainCount} 个主要步骤）的子步骤，名为 ${mainTitle}。",
		reviewSubstepCurrentAnnouncement: "这是当前子步骤。",
		reviewSubstepVisitedAnnouncement: "该子步骤已标记为完成。",
		reviewSubstepDisabledAnnouncement: "该子步骤当前已禁用。",

		reviewSubstepClickAnnouncement: "按 ENTER 键或 SPACE 键以返回到该子步骤。",
		reviewSubstepUnvisitedAnnouncement: "该子步骤当前未完成。"
});

