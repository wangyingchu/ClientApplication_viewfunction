define({
//begin v1.x content
		next: "Tiếp theo",
		previous: "Trước đó",
		finish: "Hoàn tất",
		cancel: "Hủy",
		save: "Lưu",
		// for accordion wizard
		leadingOverflowLabel: "${count} thêm",
		trailingOverflowLabel: "${count} thêm",
		a11yLabel: "Wizard nhiều bước",
		accordionAnnouncement: "Wizard nhiều bước.  Nhấn ALT+F12 để được trợ giúp. ",
		accordionHelp: "Chế độ tiêu chuẩn của wizard nhiều bước.  "
					 + "Dùng ALT+ENTER hoặc ALT+DẤU CÁCH để thông báo bước hiện tại.  "
					 + "Dùng ALT+PAGE UP để xem xét các bước wizard trước đó hoặc hiện tại.  Dùng ALT+PAGE DOWN để xem xét "
					 + "các bước wizard sau bước wizard hiện tại.  Dùng ALT + CÁC PHÍM MŨI TÊN để điều hướng "
					 + "các bước wizard tiếp theo và trước đó.  Dùng ALT+END để nhảy tiêu điểm đến đầu nút thao tác "
					 + "wizard.  Dùng phím TAB và SHIFT+TAB để điều hướng tiêu điểm đến các yếu tố tiếp theo và trước đó. ",
		leadingReviewHelp: "Chế độ xem xét đầu của wizard nhiều bước.  "
					+ "Dùng ALT+ENTER hoặc ALT+DẤU CÁCH để thông báo bước hiện tại.  "
					+ "Dùng phím ESCAPE hoặc ALT+PAGE UP để hủy chế độ xem xét đầu và trả "
					+ "tiêu điểm về bước wizard hiện thời ngay lập tức.  "
					+ "Nhấn ALT+PAGE DOWN để hủy chế độ xem xét đầu và chuyển đến chế độ xem xét cuối.  "
					+ "Trong khi đang ở chế độ xem xét đầu, dùng các phím mũi tên để luân phiên tiêu điểm qua "
					+ "các tiêu đề của bước wizard trước đó và hiện tại. "
					+ "Dùng ALT+END để hủy chế độ xem xét đầu và nhảy tiêu điểm đến đầu nút thao tác wizard.  "
					+ "Dùng phím TAB và SHIFT+TAB để thực hiện điều hướng tiêu điểm tiêu chuẩn.  "
					+ "Nếu các chuyển tiếp tiêu điểm nằm xa các tiêu đề bước wizard đầu thì chế độ xem xét đầu "
					+ "sẽ bị hủy. ",
		trailingReviewHelp: "Chế độ xem xét cuối của wizard nhiều bước.  "
					+ "Dùng ALT+ENTER hoặc ALT+DẤU CÁCH để thông báo bước hiện tại.  "
					+ "Dùng phím ESCAPE hoặc ALT+PAGE DOWN để hủy chế độ xem xét cuối và trả tiêu điểm "
					+ "về bước wizard hiện thời ngay lập tức.  "
					+ "Nhấn ALT+PAGE UP để hủy chế độ xem xét cuối và chuyển đến chế độ xem xét đầu.  "
					+ "Trong khi đang ở chế độ xem xét cuối, dùng các phím mũi tên để luân phiên tiêu điểm qua "
					+ "các tiêu đề của bước wizard sau bước hiện tại.  "
					+ "Dùng ALT+END để hủy chế độ xem xét cuối và nhảy tiêu điểm đến đầu nút thao tác wizard.  "
					+ "Dùng phím TAB và SHIFT+TAB để thực hiện điều hướng tiêu điểm tiêu chuẩn.  Nếu các chuyển tiếp tiêu điểm nằm xa "
					+ "các tiêu đề bước wizard cuối thì chế độ xem xét cuối sẽ bị hủy. ",
		leadingReviewModeAnnouncement: "Chế độ xem xét đầu của wizard nhiều bước.  Nhấn ALT+F12 để được trợ giúp.Có ${count} bước wizard chính "
					+ "dẫn đến và bao gồm bước chính hiện tại. ",
		trailingReviewModeAnnouncement: "Chế độ xem xét cuối của wizard nhiều bước.  Nhấn ALT+F12 để được trợ giúp.  Có ${count} bước wizard "
					+ "chính cuối sau bước chính hiện thời. ",
		leadingReviewModeWithSubstepsAnnouncement: "Chế độ xem xét đầu của wizard nhiều bước.  Nhấn ALT+F12 để được trợ giúp.  Có ${mainCount} "
					+ "bước wizard chính dẫn đến và bao gồm bước chính hiện tại.  Bước chính hiện tại có ${count} bước phụ "
					+ "dẫn đến và bao gồm bước hiện tại. ",
		trailingReviewModeWithSubstepsAnnouncement: "Chế độ xem xét cuối của wizard nhiều bước.  Nhấn ALT+F12 để được trợ giúp.  Có ${mainCount} "
					+ "bước wizard chính cuối sau bước chính hiện thời.  Bước chính hiện tại có ${count} bước phụ sau "
					+ "bước hiện tại. ",
		trailingReviewOnLastError: "Bạn hiện đang ở bước cuối cùng của wizard.  Chế độ xem xét cuối không khả dụng. ",
		nextOnInvalidError: "Bạn không thể điều hướng đến bước tiếp theo cho đến khi hoàn tất bước hiện tại. ",
		nextOnLastError: "Bạn không thể điều hướng đến bước tiếp theo do bạn đang ở bước cuối hiện có. ",
		previousOnFirstError: "Bạn không thể điều hướng đến bước trước đó do bạn đang ở bước đầu hiện có. ",
		currentMainStepAnnouncement: "Bước chính hiện tại là ${index} của ${count}, có tên ${title}. ",
		currentSubstepAnnouncement: "Bước phụ hiện tại là ${index} của ${count}, có tên ${title}. ",
		stepChangeAnnouncment: "Bước wizard đã thay đổi. ",		
		reviewStepAnnouncement: "Xem xét bước chính ${index} của ${count}, có tên ${title}. ",
		reviewStepCurrentAnnouncement: "Ðây là bước chính hiện tại. ",
		reviewStepVisitedAnnouncement: "Bước chính này đã được đánh dấu hoàn tất. ",
		reviewStepDisabledAnnouncement: "Bước chính này hiện bị vô hiệu. ",
		reviewStepClickAnnouncement: "Nhấn ENTER hoặc DẤU CÁCH để trở về bước này. ",
		reviewParentStepClickAnnouncement: "Nhấn ENTER hoặc DẤU CÁCH để trở về đầu bước này. ",
		reviewStepUnvisitedAnnouncement: "Bước chính này hiện chưa hoàn tất. ",
		reviewStepStartedAnnouncement: "Bước chính này đã được bắt đầu nhưng chưa hoàn tất hoàn toàn. ",
		reviewSubstepAnnouncement: "Xem xét bước phụ ${index} của ${count}, có tên ${title}.  Ðây là bước phụ của bước chính ${mainIndex} của ${mainCount}, có tên ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Ðây là bước phụ hiện tại. ",
		reviewSubstepVisitedAnnouncement: "Bước phụ này đã được đánh dấu hoàn tất. ",
		reviewSubstepDisabledAnnouncement: "Bước phụ này hiện bị vô hiệu. ",

		reviewSubstepClickAnnouncement: "Nhấn ENTER hoặc DẤU CÁCH để trở về bước phụ này. ",
		reviewSubstepUnvisitedAnnouncement: "Bước phụ này hiện chưa hoàn tất. "
});

