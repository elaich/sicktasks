$(document).ready(function(){
	console.log('jquery loaded')
	$('#new-task').on("keypress", function(event){
		if (event.which === 13){
			var task_text = $.trim($(this).val())
			if (!(task_text.length === 0)){
				var data = {
					text: task_text
				}
				console.log('valid submit ' + task_text)
				$.post( "/tasks", data, function(response){
					buffer = '<li><div><input type="checkbox">'
					buffer += '<label>' + response[0].text + '</label>'
					buffer += '</div></li>'
					$('#main').removeClass('hidden')
					$('#main ul').append(buffer)
					$('#new-task').val('')
				})
			}
		}
	})
})

