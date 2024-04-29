const imagePath = chrome.runtime.getURL('/images/activeIcon.png');

async function getImageData(){
	const response = await fetch(imagePath);
	const blob = await response.blob();
	const bitmap = await createImageBitmap(blob);
	var offscreenCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	var ctx = offscreenCanvas.getContext('2d');
	ctx.drawImage(bitmap, 0, 0);
	return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

chrome.runtime.onInstalled.addListener(async () => {
	chrome.action.disable();
	const iconImage = await getImageData();
	chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostSuffix: 'twitter.com'},
					css: ["div[data-testid='attachments']"]
				}),
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostSuffix: 'x.com'},
					css: ["div[data-testid='attachments']"]
				})
			],
			actions: [new chrome.declarativeContent.SetIcon({imageData: iconImage}),new chrome.declarativeContent.ShowAction()]
		}]);
	});
});