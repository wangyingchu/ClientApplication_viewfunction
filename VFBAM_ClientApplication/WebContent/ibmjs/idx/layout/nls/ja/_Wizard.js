define({
//begin v1.x content
		next: "次へ",
		previous: "戻る",
		finish: "完了",
		cancel: "キャンセル",
		save: "保存",
		// for accordion wizard
		leadingOverflowLabel: "さらに ${count} 個",
		trailingOverflowLabel: "さらに ${count} 個",
		a11yLabel: "マルチステップ・ウィザード",
		accordionAnnouncement: "マルチステップ・ウィザード。ヘルプを表示するには、ALT+F12 を押します。",
		accordionHelp: "マルチステップ・ウィザードの標準モード。"
					 + "現在のステップを通知するには、ALT+ENTER または ALT+SPACE を使用します。"
					 + "前のウィザード・ステップおよび現在のウィザード・ステップを確認するには、ALT+PAGE UP を使用します。現在のウィザード・ステップの後に続くウィザード・ステップを確認するには、"
					 + "ALT+PAGE DOWN を使用します。次のウィザード・ステップおよび前のウィザード・ステップに"
					 + "ナビゲートするには、ALT+ 矢印キーを使用します。最初のウィザード・アクション・ボタンにフォーカスを"
					 + "ジャンプするには、ALT+END を使用します。次の要素および前の要素にフォーカスを移動するには、TAB および SHIFT+TAB キーを使用します。",
		leadingReviewHelp: "マルチステップ・ウィザードの先行レビュー・モード。"
					+ "現在のステップを通知するには、ALT+ENTER または ALT+SPACE を使用します。"
					+ "先行レビュー・モードをキャンセルして、すぐにフォーカスを現在のウィザード・ステップに戻すには、"
					+ "ESCAPE キーまたは ALT+PAGE UP を使用します。"
					+ "先行レビュー・モードをキャンセルして、末尾レビュー・モードに切り替えるには、ALT+PAGE DOWN を押します。"
					+ "先行レビュー・モードで、前のウィザード・ステップおよび現在のウィザード・ステップのタイトルでフォーカスを循環的に切り替えるには、"
					+ "矢印キーを使用します。"
					+ "先行レビュー・モードをキャンセルして、最初のウィザード・アクション・ボタンにフォーカスをジャンプするには、ALT+END を使用します。"
					+ "標準のフォーカス・ナビゲーションを実行するには、TAB および SHIFT+TAB キーを使用します。"
					+ "フォーカスを先行ウィザード・ステップのタイトルから移行すると、先行レビュー・モードは "
					+ "キャンセルされます。",
		trailingReviewHelp: "マルチステップ・ウィザードの末尾レビュー・モード。"
					+ "現在のステップを通知するには、ALT+ENTER または ALT+SPACE を使用します。"
					+ "末尾レビュー・モードをキャンセルして、すぐにフォーカスを現在のウィザード・ステップに戻すには、"
					+ "ESCAPE キーまたは ALT+PAGE DOWN を使用します。"
					+ "末尾レビュー・モードをキャンセルして、先行レビュー・モードに切り替えるには、ALT+PAGE UP を押します。"
					+ "末尾レビュー・モードで、現在のウィザード・ステップの後に続くウィザード・ステップのタイトルでフォーカスを循環的に切り替えるには、"
					+ "矢印キーを使用します。"
					+ "末尾レビュー・モードをキャンセルして、最初のウィザード・アクション・ボタンにフォーカスをジャンプするには、ALT+END を使用します。"
					+ "標準のフォーカス・ナビゲーションを実行するには、TAB および SHIFT+TAB キーを使用します。フォーカスを末尾ウィザード・ステップの"
					+ "タイトルから移行すると、末尾レビュー・モードはキャンセルされます。",
		leadingReviewModeAnnouncement: "マルチステップ・ウィザードの先行レビュー・モード。ヘルプを表示するには、ALT+F12 を押します。現在のメインステップまでに ${count} 個のメインウィザード・ステップが"
					+ "あります。",
		trailingReviewModeAnnouncement: "マルチステップ・ウィザードの末尾レビュー・モード。ヘルプを表示するには、ALT+F12 を押します。現在のメインステップの後に続く末尾のメインウィザード・ステップは "
					+ "${count} 個あります。",
		leadingReviewModeWithSubstepsAnnouncement: "マルチステップ・ウィザードの先行レビュー・モード。ヘルプを表示するには、ALT+F12 を押します。現在のメインステップまでに ${mainCount} 個の"
					+ "メインウィザード・ステップがあります。現在のメインステップには、現在のステップまでに"
					+ "${count} 個のサブステップがあります。",
		trailingReviewModeWithSubstepsAnnouncement: "マルチステップ・ウィザードの末尾レビュー・モード。ヘルプを表示するには、ALT+F12 を押します。現在のメインステップの後に"
					+ "続く末尾のメインウィザード・ステップは ${mainCount} 個あります。現在のメインステップには、現在のステップの後に続くサブステップが"
					+ "${count} 個あります。",
		trailingReviewOnLastError: "現在、ウィザードの最後のステップを表示しています。末尾レビュー・モードは使用できません。",
		nextOnInvalidError: "現在のステップを完了するまで、次のステップにはナビゲートできません。",
		nextOnLastError: "使用可能な最後のステップを表示しているため、次のステップにはナビゲートできません。",
		previousOnFirstError: "使用可能な最初のステップを表示しているため、前のステップにはナビゲートできません。",
		currentMainStepAnnouncement: "現在のメインステップは ${index}/${count} で、${title} というタイトルです。",
		currentSubstepAnnouncement: "現在のサブステップは ${index}/${count} で、${title} というタイトルです。",
		stepChangeAnnouncment: "ウィザード・ステップが変更されました。",		
		reviewStepAnnouncement: "${title} というタイトルのメインステップ ${index}/${count} を確認しています。",
		reviewStepCurrentAnnouncement: "これは現在のメインステップです。",
		reviewStepVisitedAnnouncement: "このメインステップには完了のマークが付けられています。",
		reviewStepDisabledAnnouncement: "このメインステップは現在使用不可です。",
		reviewStepClickAnnouncement: "このステップに戻るには、ENTER または SPACE を押します。",
		reviewParentStepClickAnnouncement: "このステップの開始に戻るには、ENTER または SPACE を押します。",
		reviewStepUnvisitedAnnouncement: "このメインステップは現在未完了です。",
		reviewStepStartedAnnouncement: "このメインステップは開始されましたが、完全には完了していません。",
		reviewSubstepAnnouncement: "${title} というタイトルのサブステップ ${index}/${count} を確認しています。これは、${mainTitle} というタイトルのメインステップ ${mainIndex}/${mainCount} のサブステップです。",
		reviewSubstepCurrentAnnouncement: "これは現在のサブステップです。",
		reviewSubstepVisitedAnnouncement: "このサブステップには完了のマークが付けられています。",
		reviewSubstepDisabledAnnouncement: "このサブステップは現在使用不可です。",

		reviewSubstepClickAnnouncement: "このサブステップに戻るには、ENTER または SPACE を押します。",
		reviewSubstepUnvisitedAnnouncement: "このサブステップは現在未完了です。"
});

