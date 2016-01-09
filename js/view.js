(function(){


			$(".category_note").on('mouseover',function(){
				if ($(this).hasClass("selectedNote")) {
				}
				else{
					$(this).addClass("hoverNote");
				}
			});

			$(".category_note").on('mouseout',function(){
				$(this).find(".deleteNote").hide();
				if ($(this).hasClass("selectedNote")) {
				}
				else{
					$(this).removeClass("hoverNote");
				}
					
			});

		 //  //为notebooks绑定事件
			// $(".category_note").on('click',function(){
			// 	NotebooksCtrl.clickCategory_note(this);
			// });
		$(".note").on('mouseover',function(){
			$(this).find(".deleteNote").show();
		});
		$(".note").on('mouseout',function(){
			$(this).find(".deleteNote").hide();
		});

		$("#note-detail .note_title > h3").html($(".selected > h3").html());
		$("#note-detail .note_content").html($(".selected >p").html());

})(this,this.document)