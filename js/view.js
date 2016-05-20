(function(){

		var notebookView ={};
		window.notebookView = notebookView;

		//渲染sidebar笔记本
		notebookView.render = function(notebooks){
			var notebookData = {
				notebooks: notebooks
			};
			var notebookTemplate = Handlebars.compile($("#notebook-template").html());
			$("#notebooks").html(notebookTemplate(notebookData));
		};

		//渲染选中笔记本包含的所有笔记
		notebookView.renderItem = function(notelist){
			
			$(".note-list").html("");
			if (notelist.length >0) {
				var noteData = {
					notes: notelist
				};
				var noteTemplate = Handlebars.compile($("#note-template").html());
				$(".note-list").html(noteTemplate(noteData));

				$(".note-list .note").eq(0).addClass("selected");
	 			$selected=$(".selected");
				NotebooksCtrl.currNote ={
					title: $selected.find("h3").html(),
					content: $selected.find("p").html()
				};
			}else {
				NotebooksCtrl.currNote ={
					title: '',
					content: ''
				};
			}
			notebookView.renderDetail(NotebooksCtrl.currNote);



		};

		notebookView.renderDetail = function(notedata){
			var detailTemplate = Handlebars.compile($("#detail-template").html());
			$("#note-detail").html(detailTemplate(notedata));
        };



})(this,this.document)