define({
//begin v1.x content
		next: "Sonraki",
		previous: "Önceki",
		finish: "Son",
		cancel: "İptal",
		save: "Kaydet",
		// for accordion wizard
		leadingOverflowLabel: "${count} Tane Daha",
		trailingOverflowLabel: "${count} Tane Daha",
		a11yLabel: "Çok Adımlı Sihirbaz",
		accordionAnnouncement: "Çok Adımlı Sihirbaz. Yardım için ALT+F12 tuşlarına basın.  ",
		accordionHelp: "Çok adımlı sihirbaz standart kipi.  "
					 + "Geçerli adımı duyurmak için ALT+ENTER veya ALT+BOŞLUK tuşlarını kullanın.  "
					 + "Önceki ve geçerli sihirbaz adımlarını gözden geçirmek için ALT+PAGE UP tuşlarını kullanın. Geçerli sihirbaz adımını izleyen sihirbaz adımlarını gözden geçirmek için "
					 + "ALT+PAGE DOWN tuşlarını kullanın. Sonraki ve önceki sihirbaz adımlarına gitmek için "
					 + "ALT + OK TUŞLARINI kullanın. Odağı sihirbazın birinci işlem düğmesine getirmek için "
					 + "ALT+END tuşlarını kullanın. Odağı sonraki ve önceki öğelere getirmek için SEKME ve ÜST KARAKTER+SEKME tuşlarını kullanın.  ",
		leadingReviewHelp: "Çok adımlı sihirbaz ön gözden geçirme kipi. "
					+ "Geçerli adımı duyurmak için ALT+ENTER veya ALT+BOŞLUK tuşlarını kullanın.  "
					+ "Ön gözden geçirme kipini iptal etmek ve odağı hemen geçerli sihirbaz adımına geri getirmek için "
					+ "ESCAPE tuşunu veya ALT+PAGE UP tuşlarını kullanın.  "
					+ "Ön gözden geçirme kipini iptal etmek ve son gözden geçirme kipine geçmek için ALT+PAGE DOWN tuşlarına basın.  "
					+ "Ön gözden geçirme kipindeyken, önceki ve geçerli sihirbaz adımlarının başlıkları arasında gezinmek için "
					+ "ok tuşlarını kullanın.  "
					+ "Ön gözden geçirme kipini iptal etmek ve odağı, sihirbazın birinci işlem düğmesine getirmek için ALT+END tuşlarını kullanın.  "
					+ "Standart odak gezintisini gerçekleştirmek için SEKME ve ÜST KARAKTER+SEKME tuşunu kullanın.  "
					+ "Odak, ön sihirbaz adımı başlıklarından geçiş yaparsa ön gözden geçirme kipi "
					+ "iptal edilir.  ",
		trailingReviewHelp: "Çok adımlı sihirbaz son gözden geçirme kipi.  "
					+ "Geçerli adımı duyurmak için ALT+ENTER veya ALT+BOŞLUK tuşlarını kullanın.  "
					+ "Son gözden geçirme kipini iptal etmek ve odağı hemen geçerli sihirbaz adımına geri getirmek için "
					+ "ESCAPE tuşunu veya ALT+PAGE DOWN tuşlarını kullanın.  "
					+ "Son gözden geçirme kipini iptal etmek ve ön gözden geçirme kipine geçmek için ALT+PAGE UP tuşlarına basın.  "
					+ "Son gözden geçirme kipindeyken, geçerli adımı izleyen sihirbaz adımlarının başlıkları arasında gezinmek için "
					+ "ok tuşlarını kullanın.  "
					+ "Son gözden geçirme kipini iptal etmek ve odağı, sihirbazın birinci işlem düğmesine getirmek için ALT+END tuşlarını kullanın.  "
					+ "Standart odak gezintisini gerçekleştirmek için SEKME ve ÜST KARAKTER+SEKME tuşunu kullanın. Odak, son sihirbaz adımı başlıklarından "
					+ "geçiş yaparsa son gözden geçirme kipi iptal edilir.  ",
		leadingReviewModeAnnouncement: "Çok adımlı sihirbaz ön gözden geçirme kipi. Yardım için ALT+F12 tuşlarına basın. Geçerli ana adıma götüren ve bu adımı içeren ${count} "
					+ "ana sihirbaz adımı var.  ",
		trailingReviewModeAnnouncement: "Çok adımlı sihirbaz son gözden geçirme kipi. Yardım için ALT+F12 tuşlarına basın. Geçerli ana adımı izleyen ${count} "
					+ "son ana sihirbaz adımı var. ",
		leadingReviewModeWithSubstepsAnnouncement: "Çok adımlı sihirbaz ön gözden geçirme kipi. Yardım için ALT+F12 tuşlarına basın. Geçerli ana adıma götüren ve bu adımı içeren ${mainCount} "
					+ "ana sihirbaz adımı var. Geçerli ana adım, geçerli adıma götüren ve bu adımı içeren ${count} "
					+ "alt adım içeriyor.  ",
		trailingReviewModeWithSubstepsAnnouncement: "Çok adımlı sihirbaz son gözden geçirme kipi. Yardım için ALT+F12 tuşlarına basın. Geçerli ana adımı izleyen ${mainCount} "
					+ "son ana sihirbaz adımı var.  Geçerli ana adım, geçerli adımı izleyen ${count} "
					+ "alt adım içeriyor.  ",
		trailingReviewOnLastError: "Şu anda sihirbazın son adımındasınız. Son gözden geçirme kipi kullanılamıyor.  ",
		nextOnInvalidError: "Geçerli adımı tamamlamadan sonraki adıma gidemezsiniz.  ",
		nextOnLastError: "Kullanılabilir son adımda olduğunuzdan sonraki adıma gidemezsiniz.  ",
		previousOnFirstError: "Kullanılabilir ilk adımda olduğunuzdan önceki adıma gidemezsiniz.  ",
		currentMainStepAnnouncement: "Geçerli ana adım: ${index} / ${count}; ${title} başlıklı.  ",
		currentSubstepAnnouncement: "Geçerli alt adım: ${index} / ${count}; ${title} başlıklı.  ",
		stepChangeAnnouncment: "Sihirbaz adımı değişti.  ",		
		reviewStepAnnouncement: "Ana adım ${index} / ${count} gözden geçiriliyor; ${title} başlıklı.  ",
		reviewStepCurrentAnnouncement: "Bu geçerli ana adımdır.  ",
		reviewStepVisitedAnnouncement: "Bu ana adım, tamamlandı olarak işaretlendi.  ",
		reviewStepDisabledAnnouncement: "Bu ana adım şu anda devre dışı bırakıldı.  ",
		reviewStepClickAnnouncement: "Bu adıma geri dönmek için ENTER veya BOŞLUK tuşuna basın.  ",
		reviewParentStepClickAnnouncement: "Bu adımın başına geri dönmek için ENTER veya BOŞLUK tuşuna basın.  ",
		reviewStepUnvisitedAnnouncement: "Bu ana adım şu anda eksik.  ",
		reviewStepStartedAnnouncement: "Bu ana adım başlatıldı, ancak tamamlanmadı.  ",
		reviewSubstepAnnouncement: "Alt adım ${index} / ${count} gözden geçiriliyor; ${title} başlıklı. Bu, ana adım ${mainIndex} / ${mainCount} için alt adımdır; ${mainTitle} başlıklı.  ",
		reviewSubstepCurrentAnnouncement: "Bu geçerli alt adımdır.  ",
		reviewSubstepVisitedAnnouncement: "Bu alt adım, tamamlandı olarak işaretlendi.  ",
		reviewSubstepDisabledAnnouncement: "Bu alt adım şu anda devre dışı bırakıldı.  ",

		reviewSubstepClickAnnouncement: "Bu alt adıma geri dönmek için ENTER veya BOŞLUK tuşuna basın.  ",
		reviewSubstepUnvisitedAnnouncement: "Bu alt adım şu anda eksik.  "
});

