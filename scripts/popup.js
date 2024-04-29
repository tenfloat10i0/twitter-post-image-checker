window.onload = function() {
	document.getElementById("button").addEventListener('click', function(event) {
		document.getElementById("number").value = 1;
		document.getElementById("range").value = 5.5;
		contrastChanger(1);
	});

	document.getElementById("range").addEventListener('input', function(event) {
		let contrast = (-11/(Number(event.target.value) - 11)) - 1;
		document.getElementById("number").value = contrast.toFixed(2);
		contrastChanger(contrast);
	});

	document.getElementById("number").addEventListener('input', function(event) {
		let sliderPosition = (11 * Number(event.target.value))/(Number(event.target.value) + 1);
		document.getElementById("range").value = sliderPosition;
		contrastChanger(Number(event.target.value));
	});
};

function contrastChanger(contrast){
	chrome.tabs.query({ active: true, currentWindow: true },function(tab){
		chrome.scripting.executeScript({
			target:{tabId: tab[0].id},
			args: [contrast],
			function: function(args){
				let images = document.querySelectorAll("div[data-testid='attachments'] div[aria-label='メディア'] div:has(+img)");
				for(image of images){
					if(args != 1){
						image.style.filter = "contrast("+ args +")";
					}
					else{
						image.style.removeProperty("filter");
					}
				}
			}
		});
	});
}