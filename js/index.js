// jquery
$(document).ready(function(){
	var btnshow = false;
	var innerWidth = $(window).innerWidth();
	if(innerWidth < 768 ) {
		$('.header-nav-btn').on('click', function() {
			if(btnshow) $('.header-nav').hide();
				else $('.header-nav').show();
			btnshow = !btnshow;
			event.stopPropagation()
		})
		$(document).on('click', function () {
			$('.header-nav').hide()
			btnshow = false
		})
	}	
})
