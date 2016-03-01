define({
//begin v1.x content
		next: "Berikutnya",
		previous: "Sebelumnya",
		finish: "Selesai",
		cancel: "Batal",
		save: "Simpan",
		// for accordion wizard
		leadingOverflowLabel: "${count} Lagi",
		trailingOverflowLabel: "${count} Lagi",
		a11yLabel: "Wizard Multi Langkah",
		accordionAnnouncement: "Wizard Muti Langkah.  Tekan ALT+F12 untuk bantuan. ",
		accordionHelp: "Mode standar wizard multi langkah.  "
					 + "Gunakan ALT+ENTER atau ALT+SPACE untuk memberitahukan langkah saat ini.  "
					 + "Gunakan ALT+PAGE UP untuk meninjau langkah wizard sebelumnya dan saat ini.  Gunakan ALT+PAGE DOWN untuk meninjau "
					 + "Langkah wizard yang mengikuti langkah wizard saat ini.  Gunakan ALT + TOMBOL PANAH untuk navigasi "
					 + "Langkah wizard berikutnya dan sebelumnya.  Gunakan ALT+END untuk melompat ke wizard pertama "
					 + "tombol tindakan.  Gunakan tombol TAB dan SHIFT+TAB untuk menavigasi ke elemen berikutnya dan sesudahnya. ",
		leadingReviewHelp: "Mode tinjauan utama wizard multi langkah.  "
					+ "Gunakan ALT+ENTER atau ALT+SPACE untuk memberitahukan langkah saat ini.  "
					+ "Gunakan tombol ESCAPE atau ALT+PAGE UP untuk membatalkan mode tinjauan utama dan segera kembali "
					+ "fokus ke langkah wizard saat ini.  "
					+ "Tekan ALT+PAGE DOWN untuk membatalkan mode tinjauan utama dan beralih ke mode tinjauan berikutnya.  "
					+ "Selama berada di mode tinjauan utama, gunakan tombol panah untuk fokus siklus melalui"
					+ "judul langkah wizard sebelumnya dan saat ini. "
					+ "Gunakan ALT+END untuk membatalkan mode tinjauan utama dan fokus melompat ke tombol aksi wizard pertama.  "
					+ "Gunakan tombol TAB dan SHIFT+TAB untuk menampilkan navigasi fokus standar.  "
					+ "Jika transisi fokus jauh dari judul langkah wizard utama maka mode tinjauan utama "
					+ "akan dibatalkan. ",
		trailingReviewHelp: "Mode tinjauan berikutnya wizard multi langkah.  "
					+ "Gunakan ALT+ENTER atau ALT+SPACE untuk memberitahukan langkah saat ini.  "
					+ "Gunakan tombol ESCAPE atau ALT+PAGE DOWN untuk membatalkan mode tinjauan berikutnya dan segera kembali "
					+ "fokus ke langkah wizard saat ini.  "
					+ "Tekan ALT+PAGE UP untuk membatalkan mode tinjauan berikutnya dan beralih ke mode tinjauan utama.  "
					+ "Selama berada di mode tinjauan berikutnya, gunakan tombol panah untuk fokus sklus melalui "
					+ "judul langkah wizard yang mengikuti langkah saat ini.  "
					+ "Gunakan ALT+END untuk membatalkan mode tinjauan berikutnya dan fokus melompat ke tombol aksi wizard pertama.  "
					+ "Gunakan tombol TAB dan SHIFT+TAB untuk menampilkan navigasi fokus standar.  Jika transisi fokus jauh "
					+ "dari judul langkah wizard berikutnya maka mode tinjauan berikutnya akan dibatalkan. ",
		leadingReviewModeAnnouncement: "Mode tinjauan utama wizard multi langkah.  Tekan ALT+F12 untuk bantuan.  Terdapat ${count} langkah wizard utama "
					+ "yang mengarah dan termasuk langkah utama saat ini. ",
		trailingReviewModeAnnouncement: "Mode tinjau berikutnya wizard multi langkah.  Tekan ALT+F12 untuk bantuan.  Terdapat ${count} berikutnya "
					+ "langkah wizard utama yang mengikuti langkah utama saat ini. ",
		leadingReviewModeWithSubstepsAnnouncement: "Mode tinjauan utama wizard multi langkah.  Tekan ALT+F12 untuk bantuan.  Terdapat ${mainCount} "
					+ "Langkah wizard utama yang mengarah dan termasuk langkah utama saat ini.  Langkah utama saat ini memiliki ${count} sub langkah  "
					+ "yang mengarah dan termasuk langkah saat ini. ",
		trailingReviewModeWithSubstepsAnnouncement: "Mode tinjauan berikutnya wizard multi langkah.  Tekan ALT+F12 untuk bantuan.  Terdapat ${mainCount} "
					+ "langkah wizard utama berikutnya yang mengikuti langkah utama saat ini.  Langkah utama saat ini memiliki ${count} sub langkah yang mengikuti "
					+ "langkah saat ini. ",
		trailingReviewOnLastError: "Saat ini Anda berada pada langkah terakhir dari wizard.  Mode tinjauan berikutnya tidak tersedia. ",
		nextOnInvalidError: "Anda tidak dapat menavigasi ke langkah berikutnya sampai Anda menyelesaikan langkah saat ini. ",
		nextOnLastError: "Anda tidak dapat menavigasi ke langkah berikutnya karena Anda berada pada langkah terakhir yang tersedia. ",
		previousOnFirstError: "Anda tidak dapat menavigasi ke langkah sebelumnya karena Anda berada pada langkah pertama yang tersedia. ",
		currentMainStepAnnouncement: "langkah utama saat ini adalah ${index} dari ${count}, yang berjudul ${title}. ",
		currentSubstepAnnouncement: "Sub langkah saat ini adalah ${index} dari ${count}, yang berjudul ${title}. ",
		stepChangeAnnouncment: "Langkah wizard diubah. ",		
		reviewStepAnnouncement: "Langkah utama peninjauan ${index} dari ${count}, yang berjudul ${title}. ",
		reviewStepCurrentAnnouncement: "Ini adalah langkah utama saat ini. ",
		reviewStepVisitedAnnouncement: "Langkah utama ini telah ditandai selesai. ",
		reviewStepDisabledAnnouncement: "Langkah utama ini saat ini dinonaktifkan. ",
		reviewStepClickAnnouncement: "Tekan ENTER atau SPASI untuk kembali ke langkah ini. ",
		reviewParentStepClickAnnouncement: "Tekan ENTER atau SPASI untuk kembali ke awal langkah ini. ",
		reviewStepUnvisitedAnnouncement: "Langkah utama ini saat ini belum selesai. ",
		reviewStepStartedAnnouncement: "Langkah utama ini telah dimulai, namun belum sepenuhnya selesai. ",
		reviewSubstepAnnouncement: "Sub langkah peninjauan ${index} dari ${count}, yang berjudul ${title}.  Sub langkah ini dari langkah utama ${mainIndex} dari ${mainCount}, yang berjudul ${mainTitle}. ",
		reviewSubstepCurrentAnnouncement: "Ini adalah sub langkah saat ini. ",
		reviewSubstepVisitedAnnouncement: "Sub langkah ini telah ditandai selesai. ",
		reviewSubstepDisabledAnnouncement: "Sub langkah ini saat ini dinonaktifkan. ",

		reviewSubstepClickAnnouncement: "Tekan ENTER atau SPACE untuk kembali ke sub langkah ini. ",
		reviewSubstepUnvisitedAnnouncement: "Sub langkah ini saat ini belum selesai. "
});

