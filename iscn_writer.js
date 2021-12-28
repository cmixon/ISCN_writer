let probeR;  //collect global variables for use in several functions
let probeG;
let sigR_write;
let sigG_write;
let sigF_write;
let sigTR;
let sigR_low;
let sigR_high;
let sigG_low;
let sigG_high;
let sigF_high;
let sigF_low;
let signalValues;
let sigR_array;
let sig_Array;

function someFunction(red, green, redsig, greensig, fusion) {
  let inequalityR = 0; //to handle counts expressed with > or >=
  let inequalityG = 0;
  let inequalityF = 0;

  let probes = [
    "probeR",
    "probeG",
    "sigR",
    "sigG",
    "sigF",
    "sigR2",
    "sigG2",
    "sigF2",
    "sigR3",
    "sigG3",
    "sigF3",
  ];
  /* console.log(probes);
    console.log(sessionStorage.getItem(probes[red])); */
  probeR = sessionStorage.getItem(probes[red]); //recovers stored object as a variable for use in script
  probeG = sessionStorage.getItem(probes[green]);
  let sigR = sessionStorage.getItem(probes[redsig]);
  //when sigR left blank
  if (sigR == "") {
    sigR = "0";
  }
  //when sigR includes inequality 
  if (sigR.includes(">=") || sigR.includes("=>")) {
    sigR = sigR.slice(2);
    inequalityR = 2;
  }
  if (sigR.includes(">")) {
    sigR = sigR.slice(1);
    inequalityR = 1;
  }
  console.log(inequalityR);

  let sigG = sessionStorage.getItem(probes[greensig]);
  if (sigG == "") {
    sigG = "0";
  }
  if (sigG.includes(">=") || sigG.includes("=>")) {
    sigG = sigG.slice(2);
    inequalityG = 2;
  }
  if (sigG.includes(">")) {
    sigG = sigG.slice(1);
    inequalityG = 1;
  }
  let sigF = sessionStorage.getItem(probes[fusion]);
  if (sigF == "") {
    sigF = "0";
  }
  if (sigF.includes(">=") || sigF.includes("=>")) {
    sigF = sigF.slice(2);
    inequalityF = 2;
  }
  if (sigF.includes(">")) {
    sigF = sigF.slice(1);
    inequalityF = 1;
  }
  sigValues = [sigR, sigG, sigF];
  /* console.log(sigValues);
  console.log(inequalityR);
  console.log(inequalityG); */

  //create an array from input variables for signals separated by ~ or -
  console.log(probeR);
  let sigR_arr = sigR.split(/[~-]+/);
  let sigG_arr = sigG.split(/[~-]+/);
  let sigF_arr = sigF.split(/[~-]+/);

  //convert arrays to number type
  sigR_array = sigR_arr.map(function (x) {
    return parseInt(x);
  });

  let sigG_array = sigG_arr.map(function (x) {
    return parseInt(x);
  });

  let sigF_array = sigF_arr.map(function (x) {
    return parseInt(x);
  });
  console.log(sigR_array);
  console.log(sigG_array);
  console.log(sigF_array);

  //set low and high signals depending on whether single integer or range
  sigR_low = sigR_array[0] + sigF_array[0];
  sigG_low = sigG_array[0] + sigF_array[0];
  sigF_low = sigF_array[0];

  if (isNaN(sigR_array[1]) && isNaN(sigF_array[1])) {
    //R and F are only single signal (no range)
    sigR_high = 0;
  } else if (isNaN(sigR_array[1])) {
    //no range for R signal
    sigR_high = sigR_array[0] + sigF_array[1];
  } else if (isNaN(sigF_array[1])) {
    //no range for F signal
    sigR_high = sigR_array[1] + sigF_array[0];
  } else {
    //both R and F have signal range
    sigR_high = sigR_array[1] + sigF_array[1];
  }
  /* console.log(sigR_low);
    console.log(sigR_high); */

  if (isNaN(sigG_array[1]) && isNaN(sigF_array[1])) {
    sigG_high = 0;
  } else if (isNaN(sigG_array[1])) {
    sigG_high = sigG_array[0] + sigF_array[1];
  } else if (isNaN(sigF_array[1])) {
    sigG_high = sigG_array[1] + sigF_array[0];
  } else {
    sigG_high = sigG_array[1] + sigF_array[1];
  }
  console.log(sigG_low);
     console.log(sigG_high);

  if (isNaN(sigF_array[1])) {
    sigF_high = 0;
  } else {
    sigF_high = sigF_array[1];
  }
  //console.log(sigF_high);

  //set total number of signals as single number or range to write for R, G, and F (RSIG etc. in shell script)

  if (sigR_high == 0) {
//to handle when > or >= or => used
    if (inequalityR == 2) {
      sigR_write = ">" + (sigR_low - 1);
      inequalityR = 0;
    } else if (inequalityR == 1) {
      sigR_write = ">" + sigR_low;
      inequalityR = 0;
    } else {
      sigR_write = sigR_low;
    }
  }
  //assumes ranges will not be expressed with inequalities
  if (sigR_high != 0) {
    sigR_write = sigR_low + "~" + sigR_high;
  }

  if (sigG_high == 0) {
    if (inequalityG == 2) {
      sigG_write = ">" + (sigG_low - 1);
    } else if (inequalityG == 1) {
      sigG_write = ">" + sigG_low;
    } else {
      sigG_write = sigG_low;
    }
  }
  if (sigG_high != 0) {
    sigG_write = sigG_low + "~" + sigG_high;
  }

  if (sigF_high == 0) {
    sigF_write = sigF_low;
  } else {
    sigF_write = sigF_low + "~" + sigF_high;
  }
  //construct array to determine number of sep signals, with ranges when needed

  const sig_Array = [sigR_low, sigR_high, sigG_low, sigG_high];
  sig_Array.sort(function (a, b) {
    return a - b;
  });
 console.log(sig_Array);
    console.log(sigR_array[0], sigR_array[1],sig_Array[0],sig_Array[1], sig_Array[2]);
  if (sigR == sigG) {
    sigTR = sigR;
  } else if (sigR_low == sigG_low && sigR_high == sigG_high) {
    if (sigR_high != 0) {
      sigTR = sigR_array[0] + "~" + sigR_high; //not sigR_array[1] since may be undefined
    } else {
      sigTR = sigR_array[0];
    }
  } else {
    if (sig_Array[0] != 0) {
      sigTR = sig_Array[0] + "~" + sig_Array[1];
    } else if (sig_Array[1] != 0) {
      sigTR = sig_Array[1] + "~" + sig_Array[2];
    } else {
      sigTR = sig_Array[2];
    }
    console.log(sigTR);
  }
  //reset inequality indicators for next iteration
  inequalityR = 0;
  inequalityG = 0;
  ineqautlityF = 0;
}
//function breakapart red before green
function breakapart_RG() {
    let probeName = probeR.slice(2);
    if (sigR_low == sigG_low && sigR_high == sigG_high) {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeName + "x" + sigR_write + ")(" + probeR + " sep " + probeG + "x" + sigTR + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            const node = document.createTextNode("(" + probeName + "x" + sigR_write + ")(" + probeR + " sep " + probeG + "x" + sigTR + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        }
    } else {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG + "x" + sigG_write + ")(" + probeR + " con " + probeG + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG + "x" + sigG_write + ")(" + probeR + " con " + probeG + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        }
    }
}

//function breakapart green before red

function breakapart_GR() {
    let probeName = probeR.slice(2);
    if (sigR_low == sigG_low && sigR_high == sigG_high) {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeName + "x" + sigR_write
                + ")(" + probeG + " sep " + probeR + "x" + sigTR + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            const node = document.createTextNode("(" + probeName + "x" + sigR_write
                + ")(" + probeG + " sep " + probeR + "x" + sigTR + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        }
        /*    document.getElementById("ISCN").innerHTML="(" + probeName + "x" + sigR_write 
           + ")(" + probeG.fontcolor("green") + " con " + probeR.fontcolor("red") + "x0)"; } */
    } else {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeG + "x" + sigG_write
                + "," + probeR + "x" + sigR_write + ")(" + probeG + " con " + probeR + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            /* document.getElementById("ISCN").innerHTML="(" + probeG.fontcolor("green") + "x" +sigG_write 
            + "," + probeR.fontcolor("red") + "x" + sigR_write + ")(" + probeG.fontcolor("green") + " sep " + probeR.fontcolor("red") + "x" + sigTR + ")" ; */
            const node = document.createTextNode("(" + probeG + "x" + sigG_write
                + "," + probeR + "x" + sigR_write + ")(" + probeG + " con " + probeR + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        }
    }

}
//function fusion red before green
function dualFusion_RG() {
    if (sigR_low == sigG_low && sigR_high == sigG_high) {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeR + "," + probeG + ")x"
                + sigR_write + "(" + probeR + " con " + probeG + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            if (sigF_write == 0) {
                const node = document.createTextNode("(" + probeR + "," + probeG + ")x" + sigR_write);
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            } else {
                const node = document.createTextNode("(" + probeR + "," + probeG + ")x" + sigR_write + "(" + probeR + " con " + probeG + "x" + sigF_write + ")");
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            }
        }
    } else {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG + "x" + sigG_write + ")" + "(" + probeR + " con " + probeG + "x"
                + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            if (sigF_write == 0) {
                const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG + "x" + sigG_write + ")");
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            } else {
                const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG + "x" + sigG_write + ")" + "(" + probeR + " con " + probeG + "x" + sigF_write + ")");
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            }
        }
    }
}
//function fusion green before red

function dualFusion_GR() {
    if (sigR_low == sigG_low && sigR_high == sigG_high) {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeG + "," + probeR + ")x" + sigG_write + "(" + probeG + " con " + probeR + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            if (sigF_write == 0) {
                const node = document.createTextNode("(" + probeG + "," + probeR + ")x" + sigG_write);
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            } else {
                const node = document.createTextNode("(" + probeG + "," + probeR + ")x" + sigG_write + "(" + probeG + " con " + probeR + "x" + sigF_write + ")");
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            }
        }
    } else {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeG + "x" + sigG_write + "," + probeR + "x" + sigR_write + ")" + "(" + probeG + " con " + probeR + "x"
                + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            if (sigF_write == 0) {
                const node = document.createTextNode("(" + probeG + "x" + sigG_write + "," + probeR + "x" + sigR_write + ")");
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            } else {
                const node = document.createTextNode("(" + probeG + "x" + sigG_write + "," + probeR + "x" + sigR_write + ")" + "(" + probeG + " con " + probeR + "x" + sigF_write + ")");
                const element = document.getElementById("ISCN");
                element.appendChild(node);
            }
        }
    }
}

//create global variables for signal counts to be used for ordering patterns
let num1 = parseInt(sessionStorage.getItem("num1"));
let num2 = parseInt(sessionStorage.getItem("num2"));
let num3 = parseInt(sessionStorage.getItem("num3"));
let node1 = document.createTextNode("/");
let node2 = document.createTextNode("/");
  function doEverythingBA_RG(){
   
    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    let pattern1_write = function (){someFunction(0,1,2,3,4);
    breakapart_RG();
    element1.appendChild(nuclei1);}

   let pattern2_write = function (){ someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    breakapart_RG();
    element2.appendChild(nuclei2);
    }

    let pattern3_write = function (){
    someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    breakapart_RG();
    element3.appendChild(nuclei3);
    }

    let counts = [{"count":num1, "run": pattern1_write},
    {"count":num2, "run": pattern2_write}, 
    {"count":num3, "run": pattern3_write}]
    
    let sorted = counts.sort((a,b) => b.count - a.count);
    console.log(sorted);
    
    sorted[0].run.call();
    if (sorted[1].count > 0){
        document.getElementById("ISCN").appendChild(node1);
        sorted[1].run.call();
    }
    if (sorted[2].count > 0){
        document.getElementById("ISCN").appendChild(node2);
        sorted[2].run.call();
    }
}
console.log(typeof(num1));


function doEverythingBA_GR(){

    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    let pattern1_write = function() {someFunction(0,1,2,3,4);
    breakapart_GR();
    element1.appendChild(nuclei1);
    }

    let pattern2_write = function(){someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    breakapart_GR();
    element2.appendChild(nuclei2);
    }

    //let node2 = document.createTextNode("/");
    let pattern3_write = function(){someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    breakapart_GR();
    element3.appendChild(nuclei3);
    }
    let counts = [{"count":num1, "run": pattern1_write},
    {"count":num2, "run": pattern2_write}, 
    {"count":num3, "run": pattern3_write}]

    let sorted = counts.sort((a,b) => b.count - a.count);
    console.log(sorted);

    sorted[0].run.call();
    if (sorted[1].count > 0){
        document.getElementById("ISCN").appendChild(node1);
        sorted[1].run.call();
    }
    if (sorted[2].count > 0){
        document.getElementById("ISCN").appendChild(node2);
        sorted[2].run.call();
    }
}
function doEverythingDualFusion_RG(){

    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    let pattern1_write = function() {someFunction(0,1,2,3,4);
    dualFusion_RG();
    element1.appendChild(nuclei1);
    }
    let pattern2_write = function() {someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    dualFusion_RG();
    element2.appendChild(nuclei2);
}

    let pattern3_write = function() {someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    dualFusion_RG();
    element3.appendChild(nuclei3);
}

    let counts = [{"count":num1, "run": pattern1_write},
    {"count":num2, "run": pattern2_write}, 
    {"count":num3, "run": pattern3_write}]

    let sorted = counts.sort((a,b) => b.count - a.count);
    console.log(sorted);

    sorted[0].run.call();
    if (sorted[1].count > 0){
        document.getElementById("ISCN").appendChild(node1);
        sorted[1].run.call();
    }
    if (sorted[2].count > 0){
        document.getElementById("ISCN").appendChild(node2);
        sorted[2].run.call();
    }
}
function doEverythingDualFusion_GR(){
    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    let pattern1_write = function() {someFunction(0,1,2,3,4);
    dualFusion_GR();
    element1.appendChild(nuclei1);
    }
    let pattern2_write = function() {someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    dualFusion_GR();
    element2.appendChild(nuclei2);
    }
    
    let pattern3_write = function() {someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    dualFusion_GR();
    element3.appendChild(nuclei3);
    }
    let counts = [{"count":num1, "run": pattern1_write},
    {"count":num2, "run": pattern2_write}, 
    {"count":num3, "run": pattern3_write}]

    let sorted = counts.sort((a,b) => b.count - a.count);
    console.log(sorted);

    sorted[0].run.call();
    if (sorted[1].count > 0){
        document.getElementById("ISCN").appendChild(node1);
        sorted[1].run.call();
    }
    if (sorted[2].count > 0){
        document.getElementById("ISCN").appendChild(node2);
        sorted[2].run.call();
    }
}


function submit() {
    window.location.reload();
}

function reload() {                          //clears all of the form fields (but the data persists until overwritten)
    document.getElementById("Input").reset();
    document.getElementById("ISCN").innerHTML = "";
}

function copyToClipboard() {
    var copyText = document.querySelector("#ISCN").innerHTML;
    console.log(copyText);
    navigator.clipboard.writeText(copyText);
    console.log('Text copied');
}

