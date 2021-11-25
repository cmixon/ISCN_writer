#!/bin/bash
#combines both probe types and allows range entries with tilde (~)
#sets an infite loop for ease of multiple queries

while :
do
read -p 'Is this a breakapart probe (Y/N)? ' BAP
read -p 'Enter RED probe: ' RED
read -p 'Enter GREEN probe: ' GREEN
read -p 'Enter R signals: ' R
read -p 'Enter G signals: ' G
read -p 'Enter F signals: ' F
read -p 'Is RED-->GREEN p-->q? (Y/N) ' PTER

LOW="$(echo "12~34" | sed 's/~/:/1' | cut -d : -f 1)"
HIGH="$(echo "12~34" | sed 's/~/:/1' | cut -d : -f 2)"

LOWF="$(echo ${F} | sed 's/~/:/1' | cut -d : -f 1)"  #get low number of fusion range
HIGHF="$(echo ${F} | sed 's/~/:/1' | cut -d : -f 2)" #get high number of fusion range


LOWr="$(echo ${R} | sed 's/~/:/1' | cut -d : -f 1)"  #lower case r or g for range of values
LOWR=$(($LOWr + $LOWF))								 #upper case R or G for range of values plus range of fusion values
HIGHr="$(echo ${R} | sed 's/~/:/1' | cut -d : -f 2)"
HIGHR=$(($HIGHr + $HIGHF))

LOWg="$(echo ${G} | sed 's/~/:/1' | cut -d : -f 1)"
LOWG=$(($LOWg + $LOWF))
HIGHg="$(echo ${G} | sed 's/~/:/1' | cut -d : -f 2)"
HIGHG=$(($HIGHg + $HIGHF))

#set total number of RED signals
if [[ "${LOWR}" == "${HIGHR}" ]]; then
    RSIG="${LOWR}"
    #echo "lw and high reds are equal"
else
    RSIG="${LOWR}~${HIGHR}"
    #echo "lw and high reds are not equal"
fi

#echo "The RSIG value is ${RSIG}."

#set total number of GREEN signals
if [[ "${LOWG}" == "${HIGHG}" ]]; then
    GSIG="${LOWG}"
   # echo "lowg and highg are equal"
else 
    GSIG="${LOWG}~${HIGHG}"
   # echo "lowg and highg are not equal"
fi

#echo "The GSIG value is ${GSIG}."

#set total number of FUSION signals
if [[ "${LOWF}" == "${HIGHF}" ]]; then
    FSIG="${LOWF}"
   #echo "lowf and highf are equal"
else
    FSIG="${LOWF}~${HIGHF}"
    #echo "lowf and highf are not equal"
fi

#echo "The FSIG value is ${FSIG}."

#set variable to determine number of sep signals (TRSG) when F=0, with ranges when needed
if [[ "${HIGHr}" < "${HIGHg}" ]]; then
		TRSGH="${HIGHr}"
else
		TRSGH="${HIGHg}"
fi

if [[ "$LOWr" < "$LOWg" ]]; then
    TRSGL="${LOWr}"
else
    TRSGL="${LOWg}"
fi
if [[ "${TRSGL}" = "${TRSGH}" ]]; then  #no range needed if low=high
	TRSG="${TRSGL}"
else
	TRSG="${TRSGL}~${TRSGH}"  #range of sep signals where  (lower of low)~(lower of high)
fi

#sum_red=$(($R+$F))
#sum_grn=$(($G+$F))

#if probe set is breakapart

if [[ "${BAP}" == "y" || "${BAP}" == "Y" || "${BAP}" == "yes" ||"${BAP}" == "Yes" || "${BAP}" == "YES" ]]; then
#Get probe name from signal name
PROBENAME="$(echo ${RED} | cut -c 3-)"

	case "${PTER}" in 
		[yY]|[yY][eE][sS]) #when red before green
		if (($HIGHr+$HIGHg==0)); then echo -e "nuc ish(${PROBENAME}x${FSIG}) \n"
else
if [[ "${RSIG}" == "${GSIG}" ]]; then
	if ((${HIGHF}!=0)); then
	echo -e  "nuc ish(${PROBENAME}x${RSIG})($RED sep ${GREEN}x${TRSG}) \n"  
	else echo -e "nuc ish(${PROBENAME}x${RSIG})($RED sep ${GREEN}x${TRSG}) \n"
	fi
else
	if ((${HIGHF}!=0)); then
	echo -e "nuc ish(${RED}x${RSIG},${GREEN}x${GSIG})($RED con ${GREEN}x${FSIG}) \n"
	else echo -e "nuc ish(${RED}x${RSIG},${GREEN}x${GSIG})($RED sep ${GREEN}x${TRSG}) \n"
	fi
fi
fi
		;;

		[nN]|[nN][oO]) #when green before red
		
		if (($HIGHr+$HIGHg==0)); then echo -e "nuc ish(${PROBENAME}x${FSIG}) \n"
else
if [[ "${RSIG}" == "${GSIG}" ]]; then
	if ((${HIGHF}!=0)); then
	echo -e  "nuc ish($PROBENAMEx${RSIG})($GREEN sep ${RED}x${TRSG}) \n"  
	else echo -e "nuc ish(${PROBENAME}x${RSIG})($GREEN sep ${RED}x${TRSG}) \n"
	fi
else
	if ((${HIGHF}!=0)); then
	echo -e "nuc ish(${GREEN}x${GSIG},${RED}x${RSIG})($GREEN con ${RED}x${FSIG}) \n"
	else echo -e "nuc ish(${GREEN}x${GSIG},${RED}x${RSIG})(${GREEN} sep ${RED}x${TRSG}) \n"
	fi
fi
fi
        ;;
esac

#if probe set is fusion probe
else

	case "${PTER}" in
		[yY]|[yY][eE][sS]) #when red before green

		if [[ "${RSIG}" = "${GSIG}" ]] ; then

	if ((${HIGHF} !=0)); then
	echo -e  "nuc ish($RED,$GREEN)x${RSIG}($RED con ${GREEN}x${FSIG}) \n"
	else echo -e "nuc ish($RED,$GREEN)x${RSIG} \n"
	fi
else

	if ((${HIGHF} !=0)); then
	echo -e "nuc ish(${RED}x${RSIG},${GREEN}x${GSIG})($RED con ${GREEN}x${FSIG}) \n"
	else echo -e "nuc ish(${RED}x${RSIG},${GREEN}x${GSIG}) \n"
	fi
fi
		;;
		
		[nN]|[nN][oO]) #when green before red
		
		if [[ "${RSIG}" = "${GSIG}" ]] ; then

	if ((${HIGHF} !=0)); then
	echo -e  "nuc ish($GREEN,$RED)x${RSIG}($GREEN con ${RED}x${FSIG}) \n"
	else echo -e "nuc ish($GREEN,$RED)x${RSIG} \n"
	fi
else

	if ((${HIGHF} !=0)); then
	echo -e "nuc ish(${GREEN}x${GSIG},${RED}x${RSIG})($GREEN con ${RED}x${FSIG}) \n"
	else echo -e "nuc ish(${GREEN}x${GSIG},${RED}x${RSIG}) \n"
	fi
fi
		;;	
esac
fi
done
