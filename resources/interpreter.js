class Brainflak {
	constructor (source){
		this.source = source;
		this.stack1 = [];
		this.stack2 = [];
		this.mainstack = [];
		this.curstack = 0;
		this.value = 0;
		this.readuntil = "\n";
		this.index = 0;
	}

	checkbalance (s) {
		var map = {"(":")", "[":"]", "{":"}", "<":">"}
		s = s.replace(/[^{}<>()\[\]]/g	, "");

		var stack = [];
		for (var i = 0; i < s.length; i++) {
			var item = s[i];
			if (map[item])
				stack.push(map[item]);
			else
				if (item !== stack.pop())
					return false;
		}
		return stack.length == 0;
	}
	activestack () {
		return (this.curstack == 0) ? this.stack1 : this.stack2; 
	}

	read_until_matching (s, start) {
		var stack_height = 0;
		var sliced = s.slice(start)
		
		var tmp = 0;
		tmp = [...sliced].forEach(function(e, i) {
			if (e == '{')
				stack_height += 1;
			else if (e == "}"){
				stack_height -= 1;
				if (stack_height == -1) return i+start;
			}
		});

		return tmp ? tmp : 0;

	}

	init(...arr) {
		this.stack1 = []
		this.stack2 = [];
		arr.forEach(a => this.activestack().push(parseInt(a)))
	}

	roundnilad() {
		this.value += 1;
		console.log(this.value);
	}

	squarenilad() {
		this.value += this.activestack().length;
	}
	
	curlynilad() {
		var tmp = this.activestack().pop();
		this.value += tmp ? tmp : 0;
	}

	anglenilad() {
		this.curstack = ~this.curstack + 2;
	}

	openround() {
		this.mainstack.push(["(", this.value, this.index]);
		this.value = 0;
	}
	
	closeround(){
		var data = this.mainstack.pop();
		data = data ? data : 0;
		this.activestack().push(this.value);
		this.value += data[1];
	}

	opensquare() {
		this.mainstack.push(["[", this.value, this.index]);
		this.value = 0;
	}

	closesquare(){
		var data = this.mainstack.pop();
		data = data ? data : 0;
		this.value *= -1;
		this.value += data[1];
	}
	
	opencurly() {
		this.mainstack.push(["{", 0, this.index]);
		var new_index = this.read_until_matching(this.source, this.index);

		if (this.activestack()[this.activestack().length-1] == 0){
			this.mainstack.pop();
			this.index = new_index;
		}
	}

	closecurly() {
		var data = this.mainstack.pop();
		data = data ? data : 0;
		this.value = data[2]-1;
		this.value += data[1];
	}

	openangle() {
		this.mainstack.push(["<", this.value, this.index]);
		this.value = 0;
	}

	closeangle(){
		var data = this.mainstack.pop();
		this.value = data[1];
	}

	step() {
		if (this.source == "") return;
		var current_symbol = this.source.slice(this.index, this.index+2);
		switch (current_symbol){
			case "()":
				this.roundnilad();
				this.index += 2;
			break;
			case "[]":
				this.squarenilad();
				this.index += 2;
			break;
			case "{}":
				this.curlynilad();
				this.index += 2;
			break;
			case "<>":
				this.anglenilad();
				this.index += 2;
			break;
			default:
				switch (current_symbol[0]){
					case "(":
						this.openround();
						this.index++;
					break;
					case ")":
						this.closeround();
						this.index++;
					break;
					case "[":
						this.opensquare();
						this.index++;
					break;
					case "]":
						this.closesquare();
						this.index++;
					break;
					case "{":
						this.opencurly();
						this.index++;
					break;
					case "}":
						this.closecurly();
						this.index++;
					break;
					case "<":
						this.openangle();
						this.index++;
					break;
					case ">":
						this.closeangle();
						this.index++;
					break;
					case "\n":
					case " ":
						this.index++;
					break;
					default:
						throw new Error(`Invalid character in program at index ${this.index} >:(`)
					break;
				}
			break;
		}
		if (this.index >= this.source.length)
			return 0;
		else 
			return 1;
	}
	
	run() {
		this.index = 0;
		if (this.checkbalance(this.source) == false)
			throw new Error("Parentheses do not match.");
		else if (this.source != "")
			while (this.step()) ;

		console.log(this.value);
		return this.activestack();
	}
}

runbf = function(){
	var source = document.getElementById("code").value;
	var bf = new Brainflak(source);

	if(document.getElementById("input").value != ""){
		bf.init(document.getElementById("input").value);
	}

	var output;

	document.getElementById("stdout").value = "";
	document.getElementById("stderr").value = "";

	try {
		output = bf.run();
		output.forEach(function (e, i) {
			if (e == 7){
				var sound = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
				sound.play();
				output[i] = "";
			} else 
				output[i] = String.fromCharCode(e)
		
		});
		document.getElementById("stdout").value = output.join('\n');
	} catch(e){
		document.getElementById("stderr").value = e;
	}
}

document.getElementById("code").addEventListener("keypress", function (event){
	if(event.which === 13 && !event.shiftKey){
		runbf();
		event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
	}
});

function bfnumber(n){
	if (n == 0)
		return "()";
	else if (n == 1)
		return "()";
	else if (n ==2)
		return "()()";
	else if (n ==3)
		return "()()()";
	else if (n ==4)
		return "()()()()";
	else if (n ==5)
		return "()()()()()";
	else if (n ==6)
		return "()()()()()()";
	else if (n % 2 == 0)
		return "(" + bfnumber(n/2) + "){}";
	else
		return bfnumber(n-1) + "()";
}

document.getElementById("unicode").addEventListener("keypress", function (event){
	if(event.which === 13 && !event.shiftKey){
		document.getElementById("charactercode").value = document.getElementById("unicode").value.charCodeAt(0);
		document.getElementById("brainflakcode").value = bfnumber(document.getElementById("unicode").value.charCodeAt(0));
		event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
	} else {
		if (document.getElementById("unicode").value.length > 0){
			document.getElementById("unicode").value = String.fromCharCode(event.charCode);
			document.getElementById("charactercode").value = document.getElementById("unicode").value.charCodeAt(0);
			document.getElementById("brainflakcode").value = bfnumber(document.getElementById("unicode").value.charCodeAt(0));
			event.preventDefault();
		}
	}
});

