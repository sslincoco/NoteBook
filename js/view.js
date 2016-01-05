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

})(this,this.document)