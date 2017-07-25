function console (txt, err) {
	if(err){
		console.log(txt + ": " + err)	
	}else{
		console.log(txt)
	}
	
}


module.exports = {
	console: console
};