//ALWAYS RUN THIS BEFORE STARTING SCRIPT
//angular.reloadWithDebugInfo();

var ALL_BITTREX_PAIRS = ["BTC-LTC","BTC-DOGE","BTC-VTC","BTC-PPC","BTC-FTC","BTC-RDD","BTC-NXT","BTC-DASH","BTC-POT","BTC-BLK","BTC-EMC2","BTC-XMY","BTC-AUR","BTC-EFL","BTC-GLD","BTC-SLR","BTC-PTC","BTC-GRS","BTC-NLG","BTC-RBY","BTC-XWC","BTC-MONA","BTC-THC","BTC-ENRG","BTC-ERC","BTC-VRC","BTC-CURE","BTC-XMR","BTC-CLOAK","BTC-START","BTC-KORE","BTC-XDN","BTC-TRUST","BTC-NAV","BTC-XST","BTC-BTCD","BTC-VIA","BTC-UNO","BTC-PINK","BTC-IOC","BTC-CANN","BTC-SYS","BTC-NEOS","BTC-DGB","BTC-BURST","BTC-EXCL","BTC-SWIFT","BTC-DOPE","BTC-BLOCK","BTC-ABY","BTC-BYC","BTC-XMG","BTC-BLITZ","BTC-BAY","BTC-BTS","BTC-FAIR","BTC-SPR","BTC-VTR","BTC-XRP","BTC-GAME","BTC-COVAL","BTC-NXS","BTC-XCP","BTC-BITB","BTC-GEO","BTC-FLDC","BTC-GRC","BTC-FLO","BTC-NBT","BTC-MUE","BTC-XEM","BTC-CLAM","BTC-DMD","BTC-GAM","BTC-SPHR","BTC-OK","BTC-SNRG","BTC-PKB","BTC-CPC","BTC-AEON","BTC-ETH","BTC-GCR","BTC-TX","BTC-BCY","BTC-EXP","BTC-INFX","BTC-OMNI","BTC-AMP","BTC-AGRS","BTC-XLM","BTC-BTA","USDT-BTC","BTC-CLUB","BTC-VOX","BTC-EMC","BTC-FCT","BTC-MAID","BTC-EGC","BTC-SLS","BTC-RADS","BTC-DCR","BTC-SAFEX","BTC-BSD","BTC-XVG","BTC-PIVX","BTC-XVC","BTC-MEME","BTC-STEEM","BTC-2GIVE","BTC-LSK","BTC-PDC","BTC-BRK","BTC-DGD","ETH-DGD","BTC-WAVES","BTC-RISE","BTC-LBC","BTC-SBD","BTC-BRX","BTC-DRACO","BTC-ETC","ETH-ETC","BTC-STRAT","BTC-UNB","BTC-SYNX","BTC-TRIG","BTC-EBST","BTC-VRM","BTC-SEQ","BTC-XAUR","BTC-SNGLS","BTC-REP","BTC-SHIFT","BTC-ARDR","BTC-XZC","BTC-NEO","BTC-ZEC","BTC-ZCL","BTC-IOP","BTC-DAR","BTC-GOLOS","BTC-UBQ","BTC-KMD","BTC-GBG","BTC-SIB","BTC-ION","BTC-LMC","BTC-QWARK","BTC-CRW","BTC-SWT","BTC-TIME","BTC-MLN","BTC-ARK","BTC-DYN","BTC-TKS","BTC-MUSIC","BTC-DTB","BTC-INCNT","BTC-GBYTE","BTC-GNT","BTC-NXC","BTC-EDG","BTC-LGD","BTC-TRST","ETH-GNT","ETH-REP","USDT-ETH","ETH-WINGS","BTC-WINGS","BTC-RLC","BTC-GNO","BTC-GUP","BTC-LUN","ETH-GUP","ETH-RLC","ETH-LUN","ETH-SNGLS","ETH-GNO","BTC-APX","BTC-TKN","ETH-TKN","BTC-HMQ","ETH-HMQ","BTC-ANT","ETH-TRST","ETH-ANT","BTC-SC","ETH-BAT","BTC-BAT","BTC-ZEN","BTC-1ST","BTC-QRL","ETH-1ST","ETH-QRL","BTC-CRB","ETH-CRB","ETH-LGD","BTC-PTOY","ETH-PTOY","BTC-MYST","ETH-MYST","BTC-CFI","ETH-CFI","BTC-BNT","ETH-BNT","BTC-NMR","ETH-NMR","ETH-TIME","ETH-LTC","ETH-XRP","BTC-SNT","ETH-SNT","BTC-DCT","BTC-XEL","BTC-MCO","ETH-MCO","BTC-ADT","ETH-ADT","BTC-FUN","ETH-FUN","BTC-PAY","ETH-PAY","BTC-MTL","ETH-MTL","BTC-STORJ","ETH-STORJ","BTC-ADX","ETH-ADX","ETH-DASH","ETH-SC","ETH-ZEC","USDT-ZEC","USDT-LTC","USDT-ETC","USDT-XRP","BTC-OMG","ETH-OMG","BTC-CVC","ETH-CVC","BTC-PART","BTC-QTUM","ETH-QTUM","ETH-XMR","ETH-XEM","ETH-XLM","ETH-NEO","USDT-XMR","USDT-DASH","ETH-BCC","USDT-BCC","BTC-BCC","USDT-NEO","ETH-WAVES","ETH-STRAT","ETH-DGB","ETH-FCT","ETH-BTS","USDT-OMG"];
var PEER_NAMES_TO_CHECK = ["Pump Notifier/Trading Signals"/*, "Telegram", "CryptoPing", "Blackmoon Crypto"*/];

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

function getCoinPairsInMessage(message) {
	var coinPairsInMessage = [];
	ALL_BITTREX_PAIRS.forEach(pairName => {
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





