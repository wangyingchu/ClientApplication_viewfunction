define({
	root:
//begin v1.x content
	({
		next: "Next",
		previous: "Previous",
		finish: "Finish",
		cancel: "Cancel",
		save: "Save",
		
		// for accordion wizard
		leadingOverflowLabel: "${count} More",
		
		trailingOverflowLabel: "${count} More",
		
		a11yLabel: "Multistep Wizard",
		
		accordionAnnouncement: "Multistep Wizard.  Press ALT+F12 for help. ",
		
		accordionHelp: "Multistep wizard standard mode.  "
					 + "Use ALT+ENTER or ALT+SPACE to announce the current step.  "
					 + "Use ALT+PAGE UP to review the prior and current wizard steps.  Use ALT+PAGE DOWN to review the "
					 + "wizard steps that follow the current wizard step.  Use ALT + ARROW KEYS to navigate "
					 + "the next and previous wizard steps.  Use ALT+END to jump focus the first of the wizard "
					 + "action buttons.  Use the TAB and SHIFT+TAB key to navigate focus to next and previous elements. ",
					 
		leadingReviewHelp: "Multistep wizard leading review mode.  "
					+ "Use ALT+ENTER or ALT+SPACE to announce the current step.  "
					+ "Use ESCAPE key or ALT+PAGE UP to cancel leading review mode and immediately return "
					+ "focus to current wizard step.  "
					+ "Press ALT+PAGE DOWN to cancel leading review mode and switch to trailing review mode.  "
					+ "While in leading review mode, use arrow keys to cycle focus through the "
					+ "titles of the prior and current wizard steps. "
					+ "Use ALT+END to cancel leading review mode and jump focus to the first of the wizard action buttons.  "
					+ "Use the TAB and SHIFT+TAB key to perform standard focus navigation.  "
					+ "If the focus transitions away from the leading wizard step titles then leading review mode "
					+ "will be cancelled. ",
					
		trailingReviewHelp: "Multistep wizard trailing review mode.  "
					+ "Use ALT+ENTER or ALT+SPACE to announce the current step.  "
					+ "Use ESCAPE key or ALT+PAGE DOWN to cancel trailing review mode and immediately return "
					+ "focus to current wizard step.  "
					+ "Press ALT+PAGE UP to cancel trailing review mode and switch to leading review mode.  "
					+ "While in trailing review mode, use arrow keys to cycle focus through the "
					+ "titles of the wizard steps that follow the current step.  "
					+ "Use ALT+END to cancel trailing review mode and jump focus to the first of the wizard action buttons.  "
					+ "Use the TAB and SHIFT+TAB key to perform standard focus navigation.  If the focus transitions away "
					+ "from the trailing wizard step titles then trailing review mode will be cancelled. ",
					
		leadingReviewModeAnnouncement: "Multistep wizard leading review mode.  Press ALT+F12 for help.  There are ${count} main wizard steps "
					+ "leading up to and including the current main step. ",
		
		trailingReviewModeAnnouncement: "Multistep wizard trailing review mode.  Press ALT+F12 for help.  There are ${count} trailing "
					+ "main wizard steps that follow the current main step. ",
		
		leadingReviewModeWithSubstepsAnnouncement: "Multistep wizard leading review mode.  Press ALT+F12 for help.  There are ${mainCount} "
					+ "main wizard steps leading up to and including the current main step.  The current main step has ${count} substeps "
					+ "leading up to and including the current step. ",
		
		trailingReviewModeWithSubstepsAnnouncement: "Multistep wizard trailing review mode.  Press ALT+F12 for help.  There are ${mainCount} "
					+ "trailing main wizard steps that follow the current main step.  The current main step has ${count} substeps that follow "
					+ "current step. ",
					
		trailingReviewOnLastError: "You are currently on the last step of the wizard.  Trailing review mode is not available. ",
		
		nextOnInvalidError: "You cannot navigate to the next step until you have completed the current step. ",
		
		nextOnLastError: "You cannot navigate to the next step because you are on the last available step. ",
		
		previousOnFirstError: "You cannot navigate to the previous step because you are on the first available step. ",
		
		currentMainStepAnnouncement: "Current main step is ${index} of ${count}, entitled ${title}. ",
		
		currentSubstepAnnouncement: "Current substep is ${index} of ${count}, entitled ${title}. ",
		
		stepChangeAnnouncment: "Wizard step changed. ",		
		
		reviewStepAnnouncement: "Reviewing main step ${index} of ${count}, entitled ${title}. ",
		
		reviewStepCurrentAnnouncement: "This is the current main step. ",
		
		reviewStepVisitedAnnouncement: "This main step has been marked complete. ",
		
		reviewStepDisabledAnnouncement: "This main step is currently disabled. ",
		
		reviewStepClickAnnouncement: "Press ENTER or SPACE to return to this step. ",
		
		reviewParentStepClickAnnouncement: "Press ENTER or SPACE to return to the start of this step. ",
		
		reviewStepUnvisitedAnnouncement: "This main step is currently incomplete. ",
		
		reviewStepStartedAnnouncement: "This main step has been started, but not fully completed. ",
		
		reviewSubstepAnnouncement: "Reviewing substep ${index} of ${count}, entitled ${title}.  This is a substep of main step ${mainIndex} of ${mainCount}, entitled ${mainTitle}. ",
		
		reviewSubstepCurrentAnnouncement: "This is the current substep. ",
		
		reviewSubstepVisitedAnnouncement: "This substep has been marked complete. ",
		
		reviewSubstepDisabledAnnouncement: "This substep is currently disabled. ",

		reviewSubstepClickAnnouncement: "Press ENTER or SPACE to return to this substep. ",
		
		reviewSubstepUnvisitedAnnouncement: "This substep is currently incomplete. "
		
		
	})
	,
"zh": true,
"zh-tw": true,
"tr": true,
"th": true,
"sv": true,
"sl": true,
"sk": true,
"ru": true,
"ro": true,
"pt": true,
"pt-pt": true,
"pl": true,
"nl": true,
"nb": true,
"ko": true,
"kk": true,
"ja": true, "id": true,
"it": true,
"hu": true,
"fr": true,
"fi": true,
"es": true,
"el": true,
"de": true,
"da": true,
"cs": true,
"ca": true,
"ar": true,
"bg": true,
"he": true,
"hr": true,
"uk": true,"vi":true,
"bs": true,
"mk": true,
"sr": true
});
