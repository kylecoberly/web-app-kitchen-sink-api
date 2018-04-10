function decode(fileContents){
    return splitByLine(fileContents).reduce((accumulator, line) => {
        if (line === "\/* waks:start"){
            accumulator.annotatedExamples.push({
                annotation: "",
                example: ""
            });
            accumulator.inAnnotation = true;
            accumulator.inExample = false;
        } else if (line === "waks:example *\/") {
            accumulator.inAnnotation = false;
            accumulator.inExample = true;
        } else if (line === "\/* waks:end *\/") {
            accumulator.inAnnotation = false;
            accumulator.inExample = false;
        } else if (accumulator.inAnnotation) {
            accumulator.annotatedExamples[accumulator.annotatedExamples.length - 1].annotation += `${line}\n`;
        } else if (accumulator.inExample) {
            accumulator.annotatedExamples[accumulator.annotatedExamples.length - 1].example += `${line}\n`;
        }
        return accumulator;
    }, {
        inAnnotation: false,
        inExample: false,
        annotatedExamples: []
    }).annotatedExamples;
}

function splitByLine(string){
    return string.split(/\r?\n/);
}

module.exports = {
    decode
};
