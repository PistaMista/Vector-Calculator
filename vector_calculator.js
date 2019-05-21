class Rules {
    static Dimension(a) {
        a = parseInt(a);
        return !isNaN(a) && a >= 1 && a <= 10;
    }

    static Constant(a) {
        return !isNaN(parseFloat(a));
    }

    static VectorComponent(a) {
        return !isNaN(parseFloat(a)) || a.length == 0;
    }

    static ForceOnPrompt(prompt_text, rule) {
        var input;
        do {
            input = prompt(prompt_text);
        } while (!rule(input))

        return input;
    }
}

class Vector {
    //Vector construction
    constructor(x) {
        this.Coordinates = x;
    }

    /**
     * @param {number[]} new_coordinates
     */
    set Coordinates(new_coordinates) {
        var old_coordinates = typeof this.coordinates == "undefined" ? new Array() : this.coordinates;
        var result = new Array(new_coordinates.length);

        for (var i = 0; i < result.length; i++) {
            //Fill each coordinate with: 1. New coordinate 2. Old coordinate 3. If neither are available 0
            result[i] = isNaN(new_coordinates[i]) ? (isNaN(old_coordinates[i]) ? 0 : old_coordinates[i]) : new_coordinates[i];
        }

        this.coordinates = result;
        this.RecalculateLength();
    }

    RecalculateLength() {
        var result = 0;

        for (var i = 0; i < this.coordinates.length; i++) {
            result += Math.pow(this.coordinates[i], 2);
        }

        this.length = Math.sqrt(result);
    }

    toString() {
        return "(" + this.coordinates.join("; ") + ")";
    }

    static GetCoordinatesFromUser(number_of_coordinates) {
        var coordinates = new Array();
        for (var i = 0; i < number_of_coordinates; i++) {
            coordinates[i] = parseFloat(Rules.ForceOnPrompt("Zadej " + (i + 1) + ". souřadnici (ENTER pro přeskočení souřadnice): ", Rules.VectorComponent));
        }

        return coordinates;
    }


    //Vector operations
    static DotProduct(vector1, vector2) {
        if (vector1.coordinates.length != vector2.coordinates.length) alert("Vector: dot product error: Dimensions do not match.");

        var result = 0;
        for (var i = 0; i < vector1.coordinates.length; i++)
            result += vector1.coordinates[i] * vector2.coordinates[i];

        return result;
    }

    static Add(vector1, vector2) {
        if (vector1.coordinates.length != vector2.coordinates.length) alert("Vector: addition error: Dimensions do not match.");

        var result_coordinates = [];
        for (var i = 0; i < vector1.coordinates.length; i++)
            result_coordinates[i] = vector1.coordinates[i] + vector2.coordinates[i];
        return new Vector(result_coordinates);
    }

    static Substract(vector1, vector2) {
        if (vector1.coordinates.length != vector2.coordinates.length) alert("Vector: substract error: Dimensions do not match.");

        var result_coordinates = [];
        for (var i = 0; i < vector1.coordinates.length; i++)
            result_coordinates[i] = vector1.coordinates[i] - vector2.coordinates[i];
        return new Vector(result_coordinates);
    }

    static Scale(vector, constant) {
        var result_coordinates = [];
        for (var i = 0; i < vector.coordinates.length; i++)
            result_coordinates[i] = vector.coordinates[i] * constant;
        return new Vector(result_coordinates);
    }

    //Operation parsing
    static ProcessOperationString(string) {
        if (string.includes("k.")) {
            return Vector.Scale(vectors[string[2]], constant);
        } else {
            var operand1 = parseInt(string[0]);
            var operation = string[1];
            var operand2 = parseInt(string[2]);

            switch (operation) {
                case "+":
                    return Vector.Add(vectors[operand1], vectors[operand2]);
                case "-":
                    return Vector.Substract(vectors[operand1], vectors[operand2]);
                case ".":
                    return Vector.DotProduct(vectors[operand1], vectors[operand2]);
            }
        }

    }
}

function AskForNewDimension() {
    dimension = parseInt(Rules.ForceOnPrompt("Zadej pocet souradnic (nejvice 10): ", Rules.Dimension));
    var resizer_array = new Array(dimension).fill(NaN);

    vectors.forEach(function (x) { x.Coordinates = resizer_array; })
    UpdateDisplay();
}

function AskForNewConstant() {
    constant = parseFloat(Rules.ForceOnPrompt("Zadej konstantu k: ", Rules.Constant));

    UpdateDisplay();
}

function AskForVectorModification(index) {
    if (index < 0 || index >= vectors.length) return;

    vectors[index].Coordinates = Vector.GetCoordinatesFromUser(dimension);

    UpdateDisplay();
}

var dimension = 3;
var constant = 2;

var vectors =
    [
        new Vector([0, 0, 0]),
        new Vector([0, 0, 0]),
        new Vector([0, 0, 0])
    ]

function UpdateDisplay() {
    document.getElementById("dimension").value = dimension;
    document.getElementById("constant").value = constant;

    for (var i = 0; i < vectors.length; i++) {
        document.getElementById("vector" + i).value = vectors[i].toString();
        document.getElementById("vector" + i + "_length").value = vectors[i].length;
    }

    operations = document.getElementsByClassName("output_display");

    for (var i = 0; i < operations.length; i++)
        operations[i].value = Vector.ProcessOperationString(operations[i].getAttribute("data-operation")).toString();
}