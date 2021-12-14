let probeR;
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
let signalValues;
let sigR_array;
let sig_Array;
function someFunction(red, green, redsig, greensig, fusion){

    let probes = ["probeR", "probeG", "sigR", "sigG", "sigF", "sigR2", "sigG2", "sigF2", 
                  "sigR3", "sigG3", "sigF3"];
    console.log(probes);
    console.log(sessionStorage.getItem(probes[red]));
    probeR = sessionStorage.getItem(probes[red]); //recovers stored object as a variable for use in script
    probeG = sessionStorage.getItem(probes[green]);
    let sigR = sessionStorage.getItem(probes[redsig]);
    if (sigR == ""){sigR="0"};
    let sigG = sessionStorage.getItem(probes[greensig]);
    if (sigG == ""){sigG="0"};
    let sigF = sessionStorage.getItem(probes[fusion]);
    if (sigF == ""){sigF="0"};
    sigValues = [sigR,sigG,sigF];
    console.log(sigValues);
   
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
    
    
    if (isNaN(sigR_array[1]) && isNaN(sigF_array[1])){
        sigR_high = 0;
    } else if (isNaN(sigR_array[1])){
        sigR_high = sigR_array[0] + sigF_array[1];
    } else if (isNaN(sigF_array[1])){
        sigR_high = sigR_array[1] + sigF_array[0];
    } else {
        sigR_high = sigR_array[1] + sigF_array[1];
      };
    console.log(sigR_low);
    console.log(sigR_high);
    
    if (isNaN(sigG_array[1]) && isNaN(sigF_array[1])){
        sigG_high = 0;
    } else if (isNaN(sigG_array[1])){
        sigG_high = sigG_array[0] + sigF_array[1];
    } else if (isNaN(sigF_array[1])){
        sigG_high = sigG_array[1] + sigF_array[0];
    } else {
        sigG_high = sigG_array[1] + sigF_array[1];
      };
    console.log(sigG_low);
    console.log(sigG_high);
    
    
    if (isNaN(sigF_array[1])){
        sigF_high = 0;
    } else {
        sigF_high = sigF_array[1];
    }
    console.log(sigF_high);
    
    //set total number of signals to write (RSIG etc. in shell script)
    
 
    
    if (sigR_high == 0){
        sigR_write = sigR_low;
    } else {
        sigR_write = sigR_low + "~" + sigR_high;
    }
    
    if (sigG_high == 0){
        sigG_write = sigG_low;
    } else {
        sigG_write = sigG_low + "~" + sigG_high;
    }
    
    if (sigF_high == 0){
        sigF_write = sigF_low;
    } else {
        sigF_write = sigF_low + "~" + sigF_high;
    }
    //construct array to determine number of sep signals when F=0, with ranges when needed
    
    const sig_Array = [sigR_low, sigR_high, sigG_low, sigG_high];
    sig_Array.sort(function(a,b){return a-b});
    console.log(sig_Array);
    console.log(sigR_array[0], sigR_array[1],sig_Array[0],sig_Array[1], sig_Array[2]);
     
    if (sigR_low == sigG_low && sigR_high == sigG_high){
       if (sigR_high != 0){
        sigTR = sigR_array[0] +"~D" + sigR_high;
       } else {
        sigTR = sigR_array[0];
       }
    } else {
        if (sig_Array[0] != 0){
        sigTR = sig_Array[0] + "~E" + sig_Array[1];
        } else if (sig_Array[1] != 0){
        sigTR = sig_Array[1] + "F~" + sig_Array[2];
        } else {
        sigTR = sig_Array[2];
        }
console.log(sigTR);
}
}

function breakapart_RG(){
    let probeName = probeR.slice(2);
    if (sigR_low == sigG_low && sigR_high == sigG_high){
        if (sigF_high != 0){
            const node = document.createTextNode("(" + probeName+ "x" + sigR_write + ")(" + probeR+ " sep1 " + probeG+ "x" + sigTR + ")A") ;
            const element= document.getElementById("ISCN");
              element.appendChild(node);
        } else {
            const node = document.createTextNode("(" + probeName + "x" + sigR_write + ")(" + probeR+ " sep " + probeG + "x" + sigTR + ")B") ; 
            const element= document.getElementById("ISCN");
            element.appendChild(node);
        }
   } else {
        if (sigF_high != 0){
            const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG + "x" + sigG_write +")(" + probeR + " con " + probeG + "x" + sigF_write + ")C") ;
            const element= document.getElementById("ISCN");
              element.appendChild(node);	
        } else {
            const node = document.createTextNode("(" + probeR + "x" +sigR_write + "," + probeG + "x" + sigG_write + ")(" + probeR+ " con " + probeG + "x" + sigF_write + ")D");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
            }
        }
    }
  
  //function breakapart green before red
  
  function breakapart_GR(){
    let probeName = probeR.slice(2);
    if (sigR_low == sigG_low && sigR_high == sigG_high){
        if (sigF_high != 0){
         const node =  document.createTextNode("(" + probeName + "x" + sigR_write 
            + ")(" + probeG + " sep " + probeR + "x" + sigTR + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
        } else {
            const node = document.createTextNode("(" + probeName + "x" + sigR_write 
            + ")(" + probeG+ " sep " + probeR + "x" + sigTR + ")");
            const element = document.getElementById("ISCN") ;
            element.appendChild(node);}
         /*    document.getElementById("ISCN").innerHTML="(" + probeName + "x" + sigR_write 
            + ")(" + probeG.fontcolor("green") + " con " + probeR.fontcolor("red") + "x0)"; } */
   } else {
        if (sigF_high != 0){
            const node = document.createTextNode("(" + probeG + "x" + sigG_write 
            + "," + probeR + "x" + sigR_write +")(" + probeG + " con " + probeR + "x" + sigF_write + ")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);	
        } else {
            /* document.getElementById("ISCN").innerHTML="(" + probeG.fontcolor("green") + "x" +sigG_write 
            + "," + probeR.fontcolor("red") + "x" + sigR_write + ")(" + probeG.fontcolor("green") + " sep " + probeR.fontcolor("red") + "x" + sigTR + ")" ; */
            const node = document.createTextNode("(" + probeG + "x" +sigG_write 
            + "," + probeR + "x" + sigR_write + ")(" + probeG + " con " + probeR + "x" + sigF_write +")");
            const element = document.getElementById("ISCN");
            element.appendChild(node);
            }
        }

  }
  //function fusion red before green
  function dualFusion_RG(){
      if (sigR_low == sigG_low && sigR_high == sigG_high) {
          if (sigF_high != 0){
              const node = document.createTextNode("(" + probeR + "," + probeG + ")x" 
              + sigR_write + "(" + probeR + " con " + probeG + "x" + sigF_write + ")");
              const element = document.getElementById("ISCN");
              element.appendChild(node);
          } else {
              if (sigF_write == 0){
                  const node = document.createTextNode("(" + probeR + "," + probeG + ")x" + sigR_write);
                  const element= document.getElementById("ISCN");
              element.appendChild(node);
              } else {
              const node = document.createTextNode("(" + probeR + "," + probeG + ")x"  + sigR_write + "(" + probeR + " con " + probeG + "x" + sigF_write + ")"); 
              const element= document.getElementById("ISCN");
              element.appendChild(node);   
              }     
          }    
      } else { 
          if (sigF_high != 0) {
              const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG + "x" + sigG_write +")" + "(" + probeR + " con " + probeG+ "x" 
              + sigF_write + ")"); 
              const element= document.getElementById("ISCN");
              element.appendChild(node);
          } else { 
              if (sigF_write == 0){
              const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG+ "x" + sigG_write +")");
              const element= document.getElementById("ISCN");
              element.appendChild(node);
              } else {
              const node = document.createTextNode("(" + probeR + "x" + sigR_write + "," + probeG+ "x" + sigG_write +")" + "(" + probeR+ " con " + probeG + "x" + sigF_write + ")");
              const element= document.getElementById("ISCN");
              element.appendChild(node);   
              }
          }
      }
  }   
  //function fusion green before red
  
  function dualFusion_GR(){
      if (sigR_low == sigG_low && sigR_high == sigG_high) {
          if (sigF_high != 0){
              const node = document.createTextNode("(" + probeG + "," + probeR + ")x" + sigG_write + "(" + probeG + " con " + probeR + "x" + sigF_write + ")");
              const element= document.getElementById("ISCN");
              element.appendChild(node);
             } else {
                 if (sigF_write == 0){
                  const node = document.createTextNode("(" + probeG+ "," + probeR + ")x" + sigG_write);
                  const element= document.getElementById("ISCN");
              element.appendChild(node);
                 } else {
              const node = document.createTextNode("(" + probeG + "," + probeR+ ")x" + sigG_write + "(" + probeG + " con " + probeR + "x" + sigF_write + ")");  
              const element= document.getElementById("ISCN");
              element.appendChild(node);  
                 }  
          }         
      } else { 
          if (sigF_high != 0) {
              const node = document.createTextNode("(" + probeG+ "x" + sigG_write + "," + probeR + "x" + sigR_write +")" + "(" + probeG + " con " + probeR + "x" 
              + sigF_write + ")"); 
              const element= document.getElementById("ISCN");
              element.appendChild(node);
          } else {
              if (sigF_write == 0) {
                  const node = document.createTextNode("(" + probeG + "x" + sigG_write + "," + probeR + "x" + sigR_write + ")");   
                  const element= document.getElementById("ISCN");
              element.appendChild(node);             
              } else {
          const node = document.createTextNode( "(" + probeG + "x" + sigG_write + "," + probeR + "x" + sigR_write +")" + "(" + probeG + " con " + probeR + "x" + sigF_write + ")");
          const element = document.getElementById("ISCN");
          element.appendChild(node);    
              }
          }
      }
  }  

  function doEverythingBA_RG(){
    let node1 = document.createTextNode("/");
    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    someFunction(0,1,2,3,4);
    breakapart_RG();
    element1.appendChild(nuclei1);

    someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node1);
    }
    breakapart_RG();
    element2.appendChild(nuclei2);

    let node2 = document.createTextNode("/");
    someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node2);
    }
    breakapart_RG();
    element3.appendChild(nuclei3);
}

function doEverythingBA_GR(){
    let node1 = document.createTextNode("/");
    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    someFunction(0,1,2,3,4);
    breakapart_GR();
    element1.appendChild(nuclei1);

    someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node1);
    }
    breakapart_GR();
    element2.appendChild(nuclei2);

    let node2 = document.createTextNode("/");
    someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node2);
    }
    breakapart_GR();
    element3.appendChild(nuclei3);
}
function doEverythingDualFusion_RG(){
    let node1 = document.createTextNode("/");
    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    someFunction(0,1,2,3,4);
    dualFusion_RG();
    element1.appendChild(nuclei1);

    someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node1);
    }
    dualFusion_RG();
    element2.appendChild(nuclei2);

    let node2 = document.createTextNode("/");
    someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node2);
    }
    dualFusion_RG();
    element3.appendChild(nuclei3);
}
function doEverythingDualFusion_GR(){
    let node1 = document.createTextNode("/");
    const nuclei1 = document.createTextNode("[" + sessionStorage.getItem("num1") + "/" + sessionStorage.getItem("denom1") + "]");
    const element1 = document.getElementById("ISCN");
    someFunction(0,1,2,3,4);
    dualFusion_GR();
    element1.appendChild(nuclei1);

    someFunction(0,1,5,6,7);
    const nuclei2 = document.createTextNode("[" + sessionStorage.getItem("num2") + "/" + sessionStorage.getItem("denom2") + "]");
    const element2 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node1);
    }
    dualFusion_GR();
    element2.appendChild(nuclei2);

    let node2 = document.createTextNode("/");
    someFunction(0,1,8,9,10);
    const nuclei3 = document.createTextNode("[" + sessionStorage.getItem("num3") + "/" + sessionStorage.getItem("denom3") + "]");
    const element3 = document.getElementById("ISCN");
    if ((sigValues[0]+sigValues[1]+sigValues[2]) == 0){
        return}
    else{
        document.getElementById("ISCN").appendChild(node2);
    }
    dualFusion_GR();
    element3.appendChild(nuclei3);
}

function submit(){
   window.location.reload();
    }
   function reload() {                          //clears all of the form fields (but the data persists until overwritten)
       document.getElementById("Input").reset();
       document.getElementById("ISCN").innerHTML="";
   }
