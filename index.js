/**
 * Firstly, initialize plot with initial values from the task
 *
 */
var x0 = 1;
var y0 = 1;
var X = 10.2;
var h = Number(0.5);
var C = (y0-2*x0)/(Math.pow(x0, 3)*(y0 + x0));

const xExact = [];
const yExact = [];
const xEuler = [];
const yEuler = [];
const xImprovedEuler = [];
const yImprovedEuler = [];
const xRungeKutta = [];
const yRungeKutta = [];
const yEulerErrorLocal= [];
const yImprovedEulerErrorLocal= [];
const yRungeKuttaErrorLocal= [];

/**
 * First 3 array for error without absolute value to compare each method's error with exact
 * {Array}
 */
const yEulerErrorGlobal = [];
const yImprovedEulerErrorGlobal = [];
const yRungeKuttaErrorGlobal = [];
/**
 * This 3 array are for error with absolute value to plot the graph with all errors
 */
const yEulerErrorGlobal2 = [];
const yImprovedEulerErrorGlobal2 = [];
const yRungeKuttaErrorGlobal2 = [];

initialize();

/**
 * Changing the x0 value that reflects on the interval
 */
document.getElementsByName("x0")[0].addEventListener("input", function (e) {
    x0 = +this.value;
    var newx0 = document.getElementsByName("x0")[1];
    newx0.value = x0;
    newx0.style.width = ((this.value.length + 1) * 20) + 'px';
});

/**
 * Getting new input from user
 * Computing new C value from the input
 * Making new plot
 */

document.getElementById("apply").addEventListener("click", function (evt) {
    evt.preventDefault();
    x0 = +document.getElementsByName("x0")[0].value;
    y0 = +document.getElementsByName("y")[0].value;
    h = +document.getElementsByName("h")[0].value;
    X = +document.getElementsByName("x")[0].value;
    C = (y0-2*x0)/(Math.pow(x0, 3)*(y0 + x0));
    if (x0 && y0) {
        initialize();
    }
    return false;
});



function initialize() {
    Exact();
    Euler();
    ImprovedEuler();
    RungeKutta();
    plot();
}
/**
 * Function for numerical methods
 * f(x,y) = y^2/x^2 - 2
 * @param xn
 * @param yn
 * @returns {number} the value of f(x,y) in this point
 */
function equation(xn, yn) {
    return (Math.pow(yn,2)/Math.pow(xn, 2)) - 2;
}

/**
 * Function for exact solution
 * Computing value of y in the certain point of x
 * @param xn
 * @returns {number} value of y
 */
function partialExactSolution(xn) {
    return (+2*xn+C*Math.pow(xn, 4))/(1-C*Math.pow(xn, 3));
}

/**
 * Putting x's from the interval in the array
 * Computing y's for the respective x's
 */
function Exact() {
    xExact.length = 0;
    yExact.length = 0;
    yExact.push(+y0);
    for (let i = x0; i <= X; i+=h) {
        xExact.push(+i);
    }
    for (let i = 1; i < xExact.length; i++) {
        yExact.push(+partialExactSolution(+xExact[i]));
    }
}

/**
 * Putting x's from the interval in the array
 * Computing y's with this formula:
 * y[i] = y[i-1] + h*(f(x[i-1], y[i-1])
 * And computing errors: global and local
 */
function Euler() {
    xEuler.length = 0;
    yEuler.length = 0;
    yEulerErrorGlobal.length = 0;
    yEulerErrorLocal.length = 0;
    yEuler.push(+y0);
    for (let i = x0; i <= X; i+=h) {
        xEuler.push(+i);
    }
    for (let i = 1; i < xEuler.length; i++) {
        yEuler.push(+yEuler[i-1] + h*(equation(+xEuler[i-1], +yEuler[i-1])));
        yEulerErrorGlobal.push(+yExact[i] - yEuler[i]);
        yEulerErrorGlobal2.push(Math.abs(+yExact[i] - yEuler[i]));
        yEulerErrorLocal.push(partialExactSolution(xExact[i+1]) - partialExactSolution(xExact[i]) - h*equation(xExact[i], yExact[i]));
    }
}

/**
 * Putting x's from the interval in the array
 * Computing y's with this formula:
 * y[i] = y[i-1] + h*(f(x[i-1] + h/2, y[i-1]+h/2*f(x[i-1], y[i-1])
 */
function ImprovedEuler() {
    xImprovedEuler.length = 0;
    yImprovedEuler.length = 0;
    yImprovedEulerErrorGlobal.length = 0;
    yImprovedEulerErrorLocal.length = 0;
    yImprovedEuler.push(+y0);
    for (let i = x0; i <= X; i+=h) {
        xImprovedEuler.push(+i);
    }
    for (let i = 1; i < xImprovedEuler.length; i++) {
        yImprovedEuler.push(yImprovedEuler[i-1] + h*(equation(+xImprovedEuler[i-1]+h/2,
            +yImprovedEuler[i-1] + (h/2)*equation(+xImprovedEuler[i-1], +yImprovedEuler[i-1]))));
        yImprovedEulerErrorGlobal.push(+yExact[i] - yImprovedEuler[i]);
        yImprovedEulerErrorGlobal2.push(Math.abs(+yExact[i] - yImprovedEuler[i]));

        yImprovedEulerErrorLocal.push(partialExactSolution(xExact[i+1]) - partialExactSolution(xExact[i])
            - h*(equation(xExact[i]+h/2,
                +yExact[i]) + (h/2)*equation(+xExact[i], + yExact[i])));
    }
}

/**
 * Putting x's from the interval in the array
 * Computing y's with this formula:
 * k1 = f(x[i-1], y[i-1])
 * k2 = f(x[i-1] + h/2, y[i-1] + h*k1/2)
 * k3 = f(x[i-1] + h/2, y[i-1] + h*k2/2)
 * k4 = f(x[i-1], y[i-1] + h*k3)
 * y[i] = y[i-1] + h/6*(k1+2k2+2k3+k4)
 */

function RungeKutta() {
    xRungeKutta.length = 0;
    yRungeKutta.length = 0;
    yRungeKuttaErrorGlobal.length = 0;
    yRungeKutta.push(+y0);
    for (let i = x0; i <= X; i+=h) {
        xRungeKutta.push(+i);
    }
    for (let i = 1; i < xImprovedEuler.length; i++) {
        var k1 = equation(+xImprovedEuler[i-1], +yImprovedEuler[i-1]);
        var k2 = equation(+xImprovedEuler[i-1] + h/2, +yImprovedEuler[i-1] + h*k1/2);
        var k3 = equation(+xImprovedEuler[i-1] + h/2, +yImprovedEuler[i-1] + h*k2/2);
        var k4 = equation(+xImprovedEuler[i-1] + h, +yImprovedEuler[i-1] + h*k3);
        yRungeKutta.push(+yImprovedEuler[i-1] + (h/6)*(k1+2*k2+2*k3+k4));
        yRungeKuttaErrorGlobal.push(+yExact[i] - yRungeKutta[i]);
        yRungeKuttaErrorGlobal2.push(Math.abs(+yExact[i] - yRungeKutta[i]));
        yRungeKuttaErrorLocal.push(partialExactSolution(xExact[i+1]) - partialExactSolution(xExact[i]) - (h/6)*(k1+2*k2+2*k3+k4))
    }
}

/**
 * Plotting
 */

function plot() {
    var Exact = {
        type: 'scatter',
        x: xExact,
        y: yExact,
        mode: 'lines',
        name: 'Exact',
        line: {
            color: 'rgb(219, 64, 82)',
            width: 3
        }
    };

    var Euler = {
        type: 'scatter',
        x: xEuler,
        y: yEuler,
        mode: 'lines',
        name: 'Euler',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 1
        },
        error_y: {
            symmetric: false,
            type: 'data',
            array: yEulerErrorGlobal,
            visible: true,
            color: 'rgb(55, 128, 191)',
        },

    };
    var ImprovedEuler = {
        type: 'scatter',
        x: xImprovedEuler,
        y: yImprovedEuler,
        mode: 'lines',
        name: 'Improved Euler',
        line: {
            color: 'rgb(16, 232, 50)',
            width: 1
        },
        error_y: {
            symmetric: false,
            type: 'data',
            array: yImprovedEulerErrorGlobal,
            visible: true,
            color: 'rgb(16, 232, 50)',
        },
    };
    var RungeKutta = {
        type: 'scatter',
        x: xRungeKutta,
        y: yRungeKutta,
        mode: 'lines',
        name: 'Runge Kutta',
        line: {
            color: 'rgb(0, 0, 0)',
            width: 1
        },
        error_y: {
            symmetric: false,
            type: 'data',
            array: yRungeKuttaErrorGlobal,
            visible: true,
            color: 'rgb(0, 0, 0)',
        },
    };
    var LocalEuler = {
        type: 'scatter',
        x: xExact,
        y: yEulerErrorLocal,
        mode: 'lines',
        name: 'Local Euler',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 1
        }
    };
    var LocalImprovedEuler = {
        type: 'scatter',
        x: xExact,
        y: yImprovedEulerErrorLocal,
        mode: 'lines',
        name: 'Local Improved Euler',
        line: {
            color: 'rgb(16, 232, 50)',
            width: 1
        }
    };
    var LocalRungeKutta = {
        type: 'scatter',
        x: xExact,
        y: yRungeKuttaErrorLocal,
        mode: 'lines',
        name: 'Local Improved Euler',
        line: {
            color: 'rgb(0, 0, 0)',
            width: 1
        }
    };
    var EulerError = {
        type: 'scatter',
        x: xEuler,
        y: yEulerErrorGlobal2,
        mode: 'lines',
        name: 'Euler Error',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 1
        },
    };
    var EulerImprovedError = {
        type: 'scatter',
        x: xEuler,
        y: yImprovedEulerErrorGlobal2,
        mode: 'lines',
        name: 'Improved Euler Error',
        line: {
            color: 'rgb(16, 232, 50)',
            width: 1
        },
    };
    var RungeKuttaError = {
        type: 'scatter',
        x: xEuler,
        y: yRungeKuttaErrorGlobal2,
        mode: 'lines',
        name: 'Runge Kutta Error',
        line: {
            color: 'rgb(0, 0, 0)',
            width: 1
        },
    };
    var data = [Exact, Euler, ImprovedEuler, RungeKutta];
    Plotly.newPlot('myDiv', data);
    Plotly.newPlot('euler', [Exact, Euler]);
    Plotly.newPlot('improvedEuler', [Exact, ImprovedEuler]);
    Plotly.newPlot('rungeKutta', [Exact, RungeKutta]);
    Plotly.newPlot('local', [LocalEuler, LocalImprovedEuler, LocalRungeKutta]);
    Plotly.newPlot('globalErrors', [EulerError, EulerImprovedError, RungeKuttaError])
}





