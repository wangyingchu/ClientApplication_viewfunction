define({
//begin v1.x content
		next: "다음",
		previous: "이전",
		finish: "완료",
		cancel: "취소",
		save: "저장",
		// for accordion wizard
		leadingOverflowLabel: "${count} 추가",
		trailingOverflowLabel: "${count} 추가",
		a11yLabel: "다중 단계 마법사",
		accordionAnnouncement: "다중 단계 마법사입니다. 도움말을 보려면 ALT+F12를 누르십시오. ",
		accordionHelp: "다중 단계 마법사 표준 모드입니다. "
					 + "ALT+ENTER 또는 ALT+SPACE를 사용하여 현재 단계를 발표하십시오. "
					 + "ALT+PAGE UP을 사용하여 이전 및 현재 마법사 단계를 검토하십시오. ALT+PAGE DOWN을 사용하여 현재 "
					 + "마법사 단계 다음에 오는 마법사 단계를 검토하십시오. ALT + ARROW KEYS를 사용하여 "
					 + "다음 및 이전 마법사 단계로 이동하십시오. ALT+END를 사용하여 마법사 조치 단추의 처음으로 "
					 + "초점을 이동하십시오. TAB 및 SHIFT+TAB 키를 사용하여 다음 및 이전 요소로 초점을 이동하십시오. ",
		leadingReviewHelp: "다중 단계 마법사 선행 검토 모드입니다. "
					+ "ALT+ENTER 또는 ALT+SPACE를 사용하여 현재 단계를 발표하십시오. "
					+ "ESCAPE 키 또는 ALT+PAGE UP을 사용하여 선행 검토 모드를 취소하거나 현재 마법사 단계에 "
					+ "즉시 초점을 리턴하십시오. "
					+ "ALT+PAGE DOWN을 눌러 선행 검토 모드를 취소하고 후미 검토 모드로 전환하십시오 "
					+ "선행 검토 모드에 있는 경우 화살표 키를 사용하여 이전 및 현재 마법사 "
					+ "단계의 제목 전체에서 초점을 순환시키십시오. "
					+ "ALT+END를 사용하여 선행 검토 모드를 취소하고 마법사 조치 단추의 처음으로 초점을 이동하십시오. "
					+ "TAB 및 SHIFT+TAB 키를 사용하여 표준 초점 이동을 수행하십시오. "
					+ "초점이 선행 마법사 단계 제목에서 전이되면 선행 검토 모드가 "
					+ "취소됩니다. ",
		trailingReviewHelp: "다중 단계 마법사 후미 검토 모드입니다. "
					+ "ALT+ENTER 또는 ALT+SPACE를 사용하여 현재 단계를 발표하십시오. "
					+ "ESCAPE 키 또는 ALT+PAGE DOWN을 사용하여 후미 검토 모드를 취소하거나 현재 마법사 단계에 "
					+ "즉시 초점을 리턴하십시오. "
					+ "ALT+PAGE UP을 눌러 후미 검토 모드를 취소하고 선행 검토 모드로 전환하십시오. "
					+ "후미 검토 모드에 있는 경우 화살표 키를 사용하여 현재 단계 다음에 오는 마법사 "
					+ "단계의 제목 전체에서 초점을 순환시키십시오. "
					+ "ALT+END를 사용하여 후미 검토 모드를 취소하고 마법사 조치 단추의 처음으로 초점을 이동하십시오. "
					+ "TAB 및 SHIFT+TAB 키를 사용하여 표준 초점 이동을 수행하십시오. 초점이 후미 마법사 "
					+ "단계 제목에서 전이하면 후미 검토 모드가 취소됩니다. ",
		leadingReviewModeAnnouncement: "다중 단계 마법사 선행 검토 모드입니다. 도움말을 보려면 ALT+F12를 누르십시오. 현재 기본 단계까지를 포함하는 ${count}개의 "
					+ "선행 기본 마법사 단계가 있습니다. ",
		trailingReviewModeAnnouncement: "다중 단계 마법사 후미 검토 모드입니다. 도움말을 보려면 ALT+F12를 누르십시오. 현재 기본 단계 다음에 오는 ${count}개의 "
					+ "후미 기본 마법사 단계가 있습니다. ",
		leadingReviewModeWithSubstepsAnnouncement: "다중 단계 마법사 선행 검토 모드입니다. 도움말을 보려면 ALT+F12를 누르십시오. 현재 기본 단계까지를 포함하는 ${mainCount}개의 "
					+ "선행 기본 마법사 단계가 있습니다. 현재 기본 단계에는 현재 단계까지를 포함하여 ${count}개의 "
					+ "선행 하위 단계가 있습니다. ",
		trailingReviewModeWithSubstepsAnnouncement: "다중 단계 마법사 후미 검토 모드입니다. 도움말을 보려면 ALT+F12를 누르십시오. 현재 기본 단계 다음에 오는 ${mainCount}개의 "
					+ "후미 기본 마법사 단계가 있습니다. 현재 기본 단계에는 현재 단계 다음에 오는 ${count}개의 "
					+ "하위 단계가 있습니다. ",
		trailingReviewOnLastError: "현재 마법사의 마지막 단계에 있습니다. 후미 검토 모드를 사용할 수 없습니다. ",
		nextOnInvalidError: "현재 단계를 완료해야 다음 단계로 이동할 수 있습니다. ",
		nextOnLastError: "사용 가능한 마지막 단계에 있으므로 다음 단계로 이동할 수 없습니다. ",
		previousOnFirstError: "사용 가능한 첫 번째 단계에 있으므로 이전 단계로 이동할 수 없습니다. ",
		currentMainStepAnnouncement: "현재 기본 단계는 ${count} 중 ${index}이며 제목은 ${title}입니다. ",
		currentSubstepAnnouncement: "현재 하위 단계는 ${count} 중 ${index}이며 제목은 ${title}입니다. ",
		stepChangeAnnouncment: "마법사 단계가 변경되었습니다. ",		
		reviewStepAnnouncement: "${count} 중 ${index}이며 제목은 ${title}인 기본 단계를 검토합니다. ",
		reviewStepCurrentAnnouncement: "이 단계는 현재 기본 단계입니다. ",
		reviewStepVisitedAnnouncement: "이 기본 단계는 완료된 것으로 표시되었습니다. ",
		reviewStepDisabledAnnouncement: "이 기본 단계는 현재 사용되지 않습니다. ",
		reviewStepClickAnnouncement: "ENTER 또는 SPACE를 눌러 이 단계로 돌아가십시오. ",
		reviewParentStepClickAnnouncement: "ENTER 또는 SPACE를 눌러 이 단계의 시작으로 돌아가십시오. ",
		reviewStepUnvisitedAnnouncement: "이 기본 단계는 현재 불완전합니다. ",
		reviewStepStartedAnnouncement: "이 기본 단계가 시작되었지만 완료되지는 않았습니다. ",
		reviewSubstepAnnouncement: "${count} 중 ${index}이며 제목은 ${title}인 하위 단계를 검토합니다. 이 단계는 ${mainCount} 중 ${mainIndex}이며 제목은 ${mainTitle}인 기본 단계의 하위 단계입니다. ",
		reviewSubstepCurrentAnnouncement: "이 단계는 현재 하위 단계입니다. ",
		reviewSubstepVisitedAnnouncement: "이 하위 단계는 완료된 것으로 표시되었습니다. ",
		reviewSubstepDisabledAnnouncement: "이 하위 단계는 현재 사용되지 않습니다. ",

		reviewSubstepClickAnnouncement: "ENTER 또는 SPACE를 눌러 이 하위 단계로 돌아가십시오. ",
		reviewSubstepUnvisitedAnnouncement: "이 하위 단계는 현재 불완전합니다. "
});

