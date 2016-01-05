(function(window,document){

	$(document).ready(function(){
		var _this =$(this);
		var NotebooksCtrl={};

		var $notebooks=$("#notebooks");
		var $input_new_category = $(".input_new_category");

		$(".addNotebook").on('click',function(){
			console.log('click add new_category');
			$(".input_new_category").show().focus();
		});

		$input_new_category.blur(input_new_categoryBlur);
		$input_new_category.keyup(function(event){
			if (event.keyCode==13) {
				$input_new_category.blur();
			}

		});

		//为notebooks绑定事件
		$(".category_note").on('click',function(){
			NotebooksCtrl.clickCategory_note(this);
		});



		//input_new_category失去焦点时触发事件
		function input_new_categoryBlur(event){
			var $target = $(event.target);
			if (! $target.val()) {
				$target.hide();
			}
			else{
				NotebooksCtrl.addNotebook($target.val());
				$target.val("");
				$target.hide();
			}

		};

		NotebooksCtrl.addNotebook= function(title){
			var $oli = $('<li class="category_note">'+title+'</li>')
			$notebooks.prepend($oli);
			$notebooks.find(".category_note").each(function(){
				$(this).removeClass("selectedNote");
			});
			$notebooks.find(".category_note").eq(0).addClass("selectedNote");
		};

		NotebooksCtrl.clickCategory_note = function(element){
			$notebooks.find(".category_note").each(function(index,element){
				$(this).removeClass("selectedNote");
				$(this).removeClass("hoverNote");
			}); 
			$(element).addClass("selectedNote");

		};


	});



})(this,this.document);