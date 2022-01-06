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
let sigRo;  //to preserve original entry of the probe signal
let sigGo;
let sigFo;
const red_probes = ["11qtel","20S108","3'ALK","3'BCL2","3'BRAF","3'DDIT3","3'EPOR","3'FGFR1",
  "3'IGH","3'JAK2","3'NTRK1","3'NTRK2","3'NTRK3","3'NUP98","3'PDGFB","3'PDGFRB","3'RARA","3'ROS1",
  "5'BCL6","5'CBFB","5'CRLF2","5'DUSP22-IRF4","5'ETV6","5'EWSR1","5'FGFR2","5'KMT2A","5'MALT1","5'MYC",
  "5'RET","5'SS18","5'TFE3","5'TP63","5'USP6","ABL1","ACP5","BCL2","CCND1","CDKN2A","CEN10",
  "CEN3","CEN4","CHIC2","CKS1B","D13S319","D7S926","DLEU1&2","EGFR","EGR1","FGFR3","GLTSCR2","HER2",
  "MAF","MAFB","MALT1","MDM2","MECOM","MET","MYB","MYC","MYC","MYCN","NUP214","PBX1","PDGFRA","PML",
  "PTEN","RREB1","RUNX1","RUNX1T1","SMAD6","TCL1cen","TNFRSF14","TP53","TP53","TP63","TP63","TPRG1L"
];
  const green_probes = ["20qter","3'BCL6","3'CBFB","3'CRLF2","3'DUSP22-IRF4","3'ETV6","3'EWSR1","3'FGFR2",
  "3'KMT2A","3'MALT1","3'MYC","3'RET","3'SS18","3'TFE3","3'TP63","3'USP6","5'ALK","5'BCL2","5'BRAF",
  "5'DDIT3","5'EPOR","5'FGFR1","5'IGH","5'JAK2","5'KMT2A","5'NTRK1","5'NTRK2","5'NTRK3","5'NUP98","5'PDGFB","5'PDGFRB",
  "5'RARA","5'ROS1","API2","ATM","BCR","BLVRB","CDKN2C","CEN1","CEN10","CEN12","CEN12","CEN17","CEN17","CEN2",
  "CEN4","CEN6","CEN7","CEN7","CEN7","CEN8","CEN9","CEN9","CEP1","CEP19","CEP8","D5S1518E-D5S1976","D7S2460","D9S1783",
  "DEK","ETV6","FIP1L1","IGH","IGH","IGH","IGH","IGH","IGH","LAMP1","LAMP1","NF1","RARA","RPN1","RPS14","RUNX1",
  "SEC63","TBL1XR1","TBL1XR1","TCF3","TCL1tel","ABL2", "ASS1", "CEN11","CEN7", "CEN8", 
  "D9S1783", "hTERT", "LAMP1", "PDGFRA", "ZNF443"]; //Probes beginning at position with "ABL2" are actually Acqua

let inequalityR = 0; //to handle counts expressed with > or >=
let inequalityG = 0;
let inequalityF = 0;
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
  
  probeR = sessionStorage.getItem(probes[red]).toUpperCase(); //recovers stored object as a variable for use in script
  probeG = sessionStorage.getItem(probes[green]).toUpperCase();

  let sigR = sessionStorage.getItem(probes[redsig]);
  //when sigR left blank
  if (sigR == "") {
    sigR = "0";
  }
  sigRo = sigR;
  //when sigR includes inequality
  if (sigR.includes(">=") || sigR.includes("=>")) {
    sigR = sigR.slice(2);
    inequalityR = 2;
  }
  if (sigR.includes(">")) {
    sigR = sigR.slice(1);
    inequalityR = 1;
  }

  let sigG = sessionStorage.getItem(probes[greensig]);
  if (sigG == "") {
    sigG = "0";
  }
  sigGo = sigG;
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
  sigFo = sigF;
  if (sigF.includes(">=") || sigF.includes("=>")) {
    sigF = sigF.slice(2);
    inequalityF = 2;
  }
  if (sigF.includes(">")) {
    sigF = sigF.slice(1);
    inequalityF = 1;
  }
  sigValues = [sigR, sigG, sigF];

  //create an array from input variables for signals separated by ~ or -

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


  if (isNaN(sigG_array[1]) && isNaN(sigF_array[1])) {
    sigG_high = 0;
  } else if (isNaN(sigG_array[1])) {
    sigG_high = sigG_array[0] + sigF_array[1];
  } else if (isNaN(sigF_array[1])) {
    sigG_high = sigG_array[1] + sigF_array[0];
  } else {
    sigG_high = sigG_array[1] + sigF_array[1];
  }


  if (isNaN(sigF_array[1])) {
    sigF_high = 0;
  } else {
    sigF_high = sigF_array[1];
  }

  //set total number of signals as single number or range to write for R, G, and F (RSIG etc. in shell script)

  if (sigR_high == 0) {
    //to handle when > or >= or => used
    if (inequalityR == 2 || inequalityF == 2) {
      sigR_write = ">" + (sigR_low - 1);
      //inequalityR = 0;
    } else if (inequalityR == 1 || inequalityF == 1) {
      sigR_write = ">" + sigR_low;
      //inequalityR = 0;
    } else {
      sigR_write = sigR_low;
    }
  }
  //handles when F ranges expressed with inequalities
  if (sigR_high != 0) {
    if (inequalityR != 0) {
      sigR_write = ">" + sigR_low + "~" + sigR_high;
    } else {
      sigR_write = sigR_low + "~" + sigR_high;
    }
  }
  if (sigG_high == 0) {
    if (inequalityG == 2 || inequalityF == 2) {
      sigG_write = ">" + (sigG_low - 1);
    } else if (inequalityG == 1 || inequalityF == 1) {
      sigG_write = ">" + sigG_low;
    } else {
      sigG_write = sigG_low;
    }
  }
  //handles when F ranges expressed with inequalities
  if (sigG_high != 0) {
    if (inequalityG != 0) {
      sigG_write = ">" + sigG_low + "~" + sigG_high;
    } else {
      sigG_write = sigG_low + "~" + sigG_high;
    }
  }


  if (sigF_high == 0) {
    //to handle when > or >= or => used
    if (inequalityF == 2) {
      sigF_write = ">" + (sigF_low - 1);
      //inequalityR = 0;
    } else if (inequalityF == 1) {
      sigF_write = ">" + sigF_low;
      //inequalityR = 0;

    } else {
      sigF_write = sigF_low;
    }
  }

  //handles when F ranges expressed with inequalities
  if (sigF_high != 0) {
    if (inequalityF != 0) {
      sigF_write = ">" + sigF_low + "~" + sigF_high;
    } else {
      sigF_write = sigF_low + "~" + sigF_high;
    }
  }
  //construct array to determine number of sep signals, with ranges when needed

  const sig_Array = [sigR_low, sigR_high, sigG_low, sigG_high];
  sig_Array.sort(function (a, b) {
    return a - b;
  });

  if (sigRo == sigGo) {
    if (inequalityR != 2) {
      sigTR = sigRo;
    } else if (inequalityR == 2) {
      sigTR = ">" + (sigR - 1);
    } else if (sigR_low == sigG_low && sigR_high == sigG_high) {
      if (sigR_high != 0) {
        sigTR = sigR_array[0] + "~" + sigR_high; //not sigR_array[1] since may be undefined
      } else {
        sigTR = sigR_array[0];
      }
    } else {
      if (sig_Array[0] != 0) {
        sigTR = sig_Array[0] + "~e" + sig_Array[1];
      } else if (sig_Array[1] != 0) {
        sigTR = sig_Array[1] + "~f" + sig_Array[2];
      } else {
        sigTR = sigRo;
      }
    }
  }
  //reset inequality indicators for next iteration
  inequalityR = 0;
  inequalityG = 0;
  inequalityF = 0;
  //sigRo = 0;
  sigFo = 0;
  //sigGo = 0;
}
//function breakapart red before green
function breakapart_RG() {
    let probeName = probeR.slice(2);
    if (sigRo == sigGo) {
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
    if (sigRo == sigGo) {
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
       
    } else {
        if (sigF_high != 0) {
            const node = document.createTextNode("(" + probeG + "x" + sigG_write
                + "," + probeR + "x" + sigR_write + ")(" + probeG + " con " + probeR + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            const node = document.createTextNode("(" + probeG + "x" + sigG_write
                + "," + probeR + "x" + sigR_write + ")(" + probeG + " con " + probeR + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        }
    }

}
//function fusion red before green
function dualFusion_RG() {
    if (sigRo == sigGo) {
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
    if (sigRo == sigGo) {
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

function checkColor(){
  if (red_probes.includes(probeG) && green_probes.includes(probeR)){
    alert("Probe colors are reversed");
  } else  if (red_probes.includes(probeG)){
    alert(probeG + " is a RED signal.");
  } else  if (green_probes.includes(probeR)){
    alert(probeR + " is a GREEN signal.");
  } else{
    true;
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
    element1.appendChild(nuclei1);
  }

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

    sorted[0].run.call();
    checkColor();
    if (sorted[1].count > 0){
        document.getElementById("ISCN").appendChild(node1);
        sorted[1].run.call();
    }
    if (sorted[2].count > 0){
        document.getElementById("ISCN").appendChild(node2);
        sorted[2].run.call();
    }
}


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

    sorted[0].run.call();
    checkColor();
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

    sorted[0].run.call();
    checkColor();
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

    sorted[0].run.call();
    checkColor();
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

function reload() {   //clears all of the form fields (but the data persists until overwritten)
    document.getElementById("Input").reset();
    document.getElementById("ISCN").innerHTML = "";
}

function copyToClipboard() {
    let copyText = document.querySelector("#ISCN").innerHTML;
   // console.log(copyText);
    navigator.clipboard.writeText(copyText);
    console.log('Text copied');
}
/* 
if (!navigator.clipboard){  //uncomment to test if clipboard permissions are allowed should copy to clipboard button not work
  alert("clipboard feature not working")
} */