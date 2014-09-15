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
	var data = ($(this).is(':checked'))?{'done': true}:{'done': false}
	$.ajax({
		url: '/tasks/' + $(this).data('task-id'),
		type: 'PUT',
		contentType: 'application/json',
		data: JSON.stringify(data),
	})
}

$(document).ready(function(){
	$.get("/tasks", addAll).done(function(data){
		$('#main ul li input').on("change", markDone)
		$('#footer ul li a').on("click", function(event){
			event.preventDefault()
			$('#footer ul li a').removeClass('selected')
			$(this).addClass('selected')
			if ($(this).text() === 'All'){
				$.get("/tasks", function(data){
					$('#main ul li').remove()
					addAll(data)
					$('#main ul li input').on("change", markDone)
				})
			}
			else if ($(this).text() === 'Active'){
				$.get("/tasks", function(data){
					$('#main ul li').remove()
					var tasks = data.filter(function(task){ return !(task.done) })
					addAll(tasks)
					$('#main ul li input').on("change", markDone)
				})
			} else if ($(this).text() === 'Completed'){
				$.get("/tasks", function(data){
					$('#main ul li').remove()
					var tasks = data.filter(function(task){ return task.done })
					addAll(tasks)
					$('#main ul li input').on("change", markDone)
				})
			}
		})
	})

	$('#new-task').on("keypress", function(event){
		if (event.which === 13){
			var task_text = $.trim($(this).val())
			if (!(task_text.length === 0)){
				var data = {}
				data.text = task_text
				$.post( "/tasks", data, function(response){
					$('#main ul').append(addOne(response[0]))
					$('#main ul li input').last().data('task-id', response[0]._id)
					$('#main ul li input').last().on("change", markDone)
					$('#new-task').val('')
				})
			}
		}
	})
})

