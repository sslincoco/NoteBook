(function(){


			$(".category_note").on('mouseover',function(){
				if ($(this).hasClass("selectedNote")) {
				}
				else{
					$(this).addClass("hoverNote");
				}
			});

			$(".category_note").on('mouseout',function(){
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

})(this,this.document)