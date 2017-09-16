//ALWAYS RUN THIS BEFORE STARTING SCRIPT
//angular.reloadWithDebugInfo();

var PEER_NAMES_TO_CHECK = ["Telegram"/*, "CryptoPing", "Blackmoon Crypto"*/];

function getPeersIds() {
	var allPeers = angular.element('[ng-controller="AppImDialogsController"]').scope().dialogs;
	var peerIds = [];
	PEER_NAMES_TO_CHECK.forEach(channelName => {
		var peer = allPeers.find(p => {
			var checkTitle = false;
			var checkFirstName = false;
			if (p.peerData.title) checkTitle = true;
			if (p.peerData.first_name) checkFirstName = true;
			
			if (checkTitle) return p.peerData.title.toLowerCase() == channelName.toLowerCase();
			if (checkFirstName) return p.peerData.first_name.toLowerCase() == channelName.toLowerCase();
			
			return false;
		});
		
		if (peer) peerIds.push(peer.peerID);
	});
	return peerIds;
}

function initPeerListening() {
	PEER_NAMES_TO_CHECK.forEach(channelName => {
		$(".im_dialog_peer > span").each(function(i, e) { 
			var name = $(this).html();
			if (!PEER_NAMES_TO_CHECK.find(n => name.includes(n))) return;
			
			var generatedElementId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			var $toClick = $(this).closest( "a" );
			$toClick.attr("id", generatedElementId);
			
			//click with 1s delay
			setTimeout(() => {
				$toClick.mousedown();
				angular.element('#'+generatedElementId).triggerHandler('mousedown');
				console.log("------ Fake Clicked On", channelName);
			}, (i+1)*1000)

		});
	});
	setTimeout(() => console.log("------ PEERS TO LISTEN VS DATA AVAILABLE", PEER_NAMES_TO_CHECK.length, angular.element('[ng-controller="AppImHistoryController"]').scope().peerHistories.length), (PEER_NAMES_TO_CHECK.length + 1) * 1000);

}

var oldMessagesByPeerID = {};
function getNewMessages(peerID) {
	//Get new messages
	var messages = angular.element('[ng-controller="AppImHistoryController"]').scope().peerHistories;
	var peerMessages = messages.find(m => m.peerID == peerID);
	if (!peerMessages) throw new Error("No History Found For PeerID " + peerID);
	peerMessages = peerMessages.messages.map(m => m.message);
	
	//Get old messages
	if (!oldMessagesByPeerID[peerID])  oldMessagesByPeerID[peerID] = peerMessages;
	var oldPeerMessages = oldMessagesByPeerID[peerID];
	
	var lastOldMessage = oldPeerMessages[oldPeerMessages.length -1];
	var lastNewMessage = peerMessages[peerMessages.length -1];
	
	console.log("------ ", peerID, "Last:", lastOldMessage, "Now:", lastNewMessage);
	
	if (lastOldMessage == lastNewMessage)
		return [];
	//else get new messages by getting difference between
	var lastOldMessageIndex = peerMessages.indexOf(lastOldMessage);
	if (lastOldMessageIndex == -1) throw new Error('Last Old Message Not Found in new messages, message:' + lastOldMessage);
	//Get new messages from Last one
	var newPeerMessages = peerMessages.slice(lastOldMessageIndex + 1, peerMessages.length);
	
	oldMessagesByPeerID[peerID] = peerMessages;
	
	return newPeerMessages;
}

var ALL_COIN_PAIRS = ["BTC-NEO", "BTC-OMG"];
function getCoinPairsInMessage(message) {
	var coinPairsInMessage = [];
	ALL_COIN_PAIRS.forEach(pairName => {
		if (!message.includes(pairName)) return;
		coinPairsInMessage.push(pairName);
	})
	return coinPairsInMessage;
}

var CHECK_INTERVAL = 1 * 1000; //3s
function startChecking() {
	console.log("------ Extracting PeerIds...");
	var peerIds = getPeersIds();
	console.log("------ Extrated PeerIDs", peerIds);
	console.log("------ Init Messages Listening By Faking Clicks On Peers");
	initPeerListening();
	
	setInterval(() => {
		peerIds.forEach(peerID => {
			var newMessages = getNewMessages(peerID);
			if (!newMessages.length) return;
			var coinPairsInMessage = getCoinPairsInMessage(newMessages.join(" "));
			if (!coinPairsInMessage.length) return;
			console.log("------ COIN PAIRS DETECTED", coinPairsInMessage);
		})
	}, CHECK_INTERVAL);
}


startChecking();





