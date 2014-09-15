function addOne(task){
	var buffer = '<li><div><input type="checkbox" '
	buffer += task.done?'checked=""':''
	buffer += '><label>' + task.text + '</label>'
	buffer += '</div></li>'
	var bufferHtml = $.parseHTML(buffer)
	return bufferHtml
}

function addAll(tasks){
	tasks.forEach(function(task){
		$('#main ul').append(addOne(task))
		$('#main ul li input').last().data('task-id', task._id)
	})
}

function markDone(){
	data = ($(this).is(':checked'))?{'done': true}:{'done': false}
	$.ajax({
		url: '/tasks/' + $(this).data('task-id'),
		type: 'PUT',
		data: data,
	})
}

$(document).ready(function(){
	$.get("/tasks", addAll).done(function(){
		$('#main ul li input').on("change", markDone)
	})

	$('#new-task').on("keypress", function(event){
		if (event.which === 13){
			var task_text = $.trim($(this).val())
			if (!(task_text.length === 0)){
				var data = {
					text: task_text
				}
				$.post( "/tasks", data, function(response){
					$('#main ul').append(addOne(response[0]))
					$('#main ul li input').last().data('task-id', response[0]._id)
					$('#new-task').val('')
				})
			}
		}
	})
})

