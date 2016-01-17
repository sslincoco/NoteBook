(function(){

		var notebookView ={};
		window.notebookView = notebookView;

		notebookView.render = function(notebooks){
			for (var i = 0; i < notebooks.length; i++) {
				var item = notebooks[i];
				var $oli = $('<li class="category_note"></li>');
				$oli.attr({"data-id":item.id,"notebook-title":item.title,"numberOfNote":item.numberOfNote});
				$oli.html(item.title+'('+item.numberOfNote+')');
				$("#notebooks").prepend($oli);
			};
			$("#notebooks >li").eq(0).addClass("selectedNote");
			$(".category_note").on('click',function(){
				NotebooksCtrl.clickCategory_note($(this));
			});
			$(".selectedNote").click();

		};


		notebookView.renderItem = function(notelist){
			$(".note-list").html("");
			if (notelist.length >0) {
				for (var i = 0; i < notelist.length; i++) {
					var $oli = $('<li><h3 class="title"></h3><p class="content"></p><i class="deleteNote btn_pointer" style="display:none;"></i></li>');
					$oli.find(".title").html(notelist[i].title);
					$oli.find(".content").html(notelist[i].content);
					$oli.addClass("note").attr({"data-id":notelist[i].id,"categoryId":notelist[i].categoryId});
					$(".note-list").append($oli);
					console.log(notelist[i].content);

				}
				$(".note-list .note").eq(0).addClass("selected");
	 			$selected=$(".selected");
				NotebooksCtrl.currNote ={
					title: $selected.find(".title").html(),
					content: $selected.find(".content").html()
				};
				

			}else{
				NotebooksCtrl.currNote ={
					title: "",
					content: ""
				};

			}
			
			notebookView.renderDetail(NotebooksCtrl.currNote);
			$(".note").on('mouseover',function(){
				$(this).find(".deleteNote").show();
			});

			$(".note").on('mouseout',function(){
				$(this).find(".deleteNote").hide();
			});
			$(".note").on('click',function(){
					NotebooksCtrl.clickNote($(this));
				});
			$(".note").find(".deleteNote").on('click',function(){
				NotebooksCtrl.delNote = $(this).parent();
				$(".gray-overlay").show();
				$(".deleteConfirm .delInfo").html("确定删除"+NotebooksCtrl.delNote.find("h3").html()+"吗？");
				$(".deleteConfirm").show();
			});
		};

		notebookView.renderDetail = function(notedata){
        	$(".note_title>h3").html(notedata.title);
			$(".note_content").html(notedata.content);
        };



})(this,this.document)