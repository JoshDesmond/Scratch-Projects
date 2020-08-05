// This is a hypothetical module to be exported with ES2015 module syntax

class Model {
	constructor(name) {
		this.name = name;
	}

	printName() {
		console.log(this.name);
	}
}

export default Model;

