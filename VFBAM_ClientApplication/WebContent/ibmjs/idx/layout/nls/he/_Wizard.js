define({
//begin v1.x content
		next: "הבא",
		previous: "הקודם",
		finish: "סיום",
		cancel: "ביטול",
		save: "שמירה",
		// for accordion wizard
		leadingOverflowLabel: "עוד ${count}",
		trailingOverflowLabel: "עוד ${count}",
		a11yLabel: "אשף רב-צעדים",
		accordionAnnouncement: "אשף רב-צעדים.  לחצו על ALT+F12 כדי להציג עזרה. ",
		accordionHelp: "מצב סטנדרטי של אשף רב-צעדים.  "
					 + "לחצו על ALT+ENTER או ALT+SPACE כדי להכריז על הצעד הנוכחי.  "
					 + "לחצו על ALT+PAGE כדי לסקור את הצעד הקודם והצעד הנוכחי של האשף.  לחצו על LT+PAGE DOWN כדי לסקור "
					 + "את צעדי האשף הבאים אחרי צעד האשף הנוכחי.  לחצו על ALT + מקשי החיצים כדי לנווט "
					 + "לצעד הבא והקודם של האשף.  לחצו על ALT+END כדי להקפיץ את המיקוד אל הראשון מלחצני "
					 + "הפעולה של האשף.  לחצו על  מקש TAB ועל SHIFT+TAB כדי להעביר את המיקוד למרכיב הבא והקודם. ",
		leadingReviewHelp: "מצב סקירה מובילה של אשף רב-צעדים.  "
					+ "לחצו על ALT+ENTER או ALT+SPACE כדי להכריז על הצעד הנוכחי.  "
					+ "לחצו על מקש ESCAPE או על ALT+PAGE UP כדי לבטל את מצב הסקירה המובילה ולהחזיר את המיקוד"
					+ "מיד לצעד האשף הנוכחי. "
					+ "לחצו על ALT+PAGE DOWN כדי לבטל את מצב הסקירה המובילה ולעבור למצב סקירה נגררת. "
					+ "במצב סקירה מובילה, השתמשו במקשי החיצים כדי להעביר את המיקוד בין כותרות"
					+ "הצעדים הקודמים והנוכחיים של האשף. "
					+ "לחצו על ALT+END כדי לבטל את מצב הסקירה המובילה ולהקפיץ את המיקוד אל הראשון מלחצני הפעולה של האשף. "
					+ "לחצו על מקש TAB ועל SHIFT+TAB כדי לבצע ניווט סטנדרטי באמצעות העברת המיקוד. "
					+ "אם המיקוד מתרחק מהכותרות המובילות של צעדי האשף מצב הסקירה המובילה "
					+ "יבוטל. ",
		trailingReviewHelp: "מצב סקירה נגררת של אשף רב-צעדים.  "
					+ "לחצו על ALT+ENTER או ALT+SPACE כדי להכריז על הצעד הנוכחי.  "
					+ "לחצו על מקש ESCAPE או על ALT+PAGE DOWN כדי לבטל את מצב הסקירה הנגררת ולהחזיר את המיקוד "
					+ "מיד לצעד האשף הנוכחי.  "
					+ "לחצו על ALT+PAGE UP כדי לבטל את מצב הסקירה הנגררת ולעבור למצב סקירה מובילה. "
					+ "במצב סקירה נגררת, השתמשו במקשי החיצים כדי להעביר את המיקוד בין כותרות "
					+ "עדי האשף הבאים אחרי צעד האשף הנוכחי.  "
					+ "לחצו על ALT+END כדי לבטל את מצב הנגררת המובילה ולהקפיץ את המיקוד אל הראשון מלחצני הפעולה של האשף.  "
					+ "לחצו על מקש TAB ועל SHIFT+TAB כדי לבצע ניווט סטנדרטי באמצעות העברת המיקוד.  אם המיקוד מתרחק  "
					+ "מהכותרות הנגררות של צעדי האשף מצב הסקירה הנגררת יבוטל. ",
		leadingReviewModeAnnouncement: "מצב סקירה מובילה של אשף רב-צעדים.  לחצו על ALT+F12 כדי להציג עזרה.  יש ${count} צעדי אשף עיקריים"
					+ "המובילים אל וכוללים את הצעד העיקרי הנוכחי. ",
		trailingReviewModeAnnouncement: "מצב סקירה נגררת של אשף רב-צעדים.  לחצו על ALT+F12 כדי להציג עזרה.  יש ${count} צעדי אשף "
					+ "עיקריים נגררים הבאים אחרים צעד האשף העיקרי הנוכחי. ",
		leadingReviewModeWithSubstepsAnnouncement: "מצב סקירה מובילה של אשף רב-צעדים.  לחצו על ALT+F12 כדי להציג עזרה.  יש ${mainCount} "
					+ "צעדי אשף עיקריים המובילים אל וכוללים את הצעד העיקרי הנוכחי. לצעד העיקרי הנוכחי יש ${count} תת-צעדים "
					+ "המובילים אל וכוללים את הצעד הנוכחי. ",
		trailingReviewModeWithSubstepsAnnouncement: "מצב סקירה נגררת של אשף רב-צעדים.  לחצו על ALT+F12 כדי להציג עזרה.  יש ${mainCount} "
					+ "צעדי אשף עיקריים נגררים הבאים אחרים צעד האשף העיקרי הנוכחי.  לצעד העיקרי הנוכחי יש ${count} תת-צעדים הבאים "
					+ "אחרי צעד האשף הנוכחי. ",
		trailingReviewOnLastError: "אתם נמצאים כעת בצעד האחרון של האשף. מצב הסקירה הנגררת אינו זמין. ",
		nextOnInvalidError: "תוכלו לנווט לצעד הבא רק לאחר שתשלימו את הצעד הנוכחי. ",
		nextOnLastError: "אינכם יכולים לנווט לצעד הבא מפני שאתם נמצאים בצעד הזמין האחרון. ",
		previousOnFirstError: "אינכם יכולים לנווט לצעד הקודם מפני שאתם נמצאים בצעד הזמין הראשון. ",
		currentMainStepAnnouncement: "הצעד העיקרי הנוכחי הוא ${index} מתוך ${count}, וכותרתו היא ${title}. ",
		currentSubstepAnnouncement: "התת-צעד הנוכחי הוא ${index} מתוך ${count}, וכותרתו היא ${title}. ",
		stepChangeAnnouncment: "צעד האשף השתנה. ",		
		reviewStepAnnouncement: "סקירת הצעד העיקרי הנוכחי ${index} מתוך ${count}, שכותרתו היא ${title}. ",
		reviewStepCurrentAnnouncement: "זהו הצעד העיקרי הנוכחי. ",
		reviewStepVisitedAnnouncement: "צעד עיקרי זה סומן כצעד שהשולם. ",
		reviewStepDisabledAnnouncement: "צעד עיקרי זה מושבת כרגע.  ",
		reviewStepClickAnnouncement: "לחצו על ENTER או SPACE כדי לחזור לצעד זה.  ",
		reviewParentStepClickAnnouncement: "לחצו על ENTER או SPACE כדי לחזור להתחלה של צעד זה. ",
		reviewStepUnvisitedAnnouncement: "צעד עיקרי זה לא הושלם.  ",
		reviewStepStartedAnnouncement: "צעד עיקרי זה הותחל, אך לא הושלם במלואו. ",
		reviewSubstepAnnouncement: "סקירת תת-צעד ${index} מתוך ${count}, שכותרתו היא ${title}.  זהו תת-צעד של  הצעד העיקרי ${mainIndex} מתוך ${mainCount}, שכותרתו היא ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "זהו התת-צעד הנוכחי. ",
		reviewSubstepVisitedAnnouncement: "תת-צעד זה סומן כתת-צעד שהשולם. ",
		reviewSubstepDisabledAnnouncement: "תת-צעד זה מושבת כרגע. ",

		reviewSubstepClickAnnouncement: "לחצו על ENTER או SPACE כדי לחזור לתת-צעד זה. ",
		reviewSubstepUnvisitedAnnouncement: "תת-צעד זה לא הושלם. "
});

