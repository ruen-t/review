#!/bin/sh

for i in `seq 0 300`;
        do
        year=$((RANDOM%1+2017))
month=$((RANDOM%11+1))
day=$((RANDOM%27+1))
hour=$((RANDOM%25))
min=$((RANDOM%61))
date_s=$year"-"$month"-"$day"T"$hour":"$min
year2=$((RANDOM%1+2017))
month2=$((RANDOM%11+1))
day2=$((RANDOM%27+1))
hour2=$((RANDOM%25))
min2=$((RANDOM%61))
date_e=$year2"-"$month2"-"$day2"T"$hour2":"$min2
d=$((RANDOM%2+1))
rt=$((RANDOM%5+1))
lo=$((RANDOM%12+1))
# loop
#userlist="{\"employee\": \"0\",\"role\": \"1\"}";
userlist="";
declare -a emarr=("1" "2" "3" "4" "5")
for j in `seq 0 4`;
  do
  	create=$((RANDOM%2+1))
  	if [ $create -gt 1 ]; then
  	  bytelen=${#userlist}
	  em=${emarr[$j]}
	  role=$((RANDOM%2+1))
	  user="{\"employee\": \""$em"\",\"role\": \""$role"\"}"
	  if [ $bytelen -gt 0 ]; then
	  	userlist=$user
	  else userlist=$userlist","$user
	  fi
	 
	  #echo $userlist
    fi
   done

        	#eval "curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-CSRFToken: Cgd8agpn80oUBL5JqgD2WArPguyCKi6eLq855IIT9SS3HrpPAOZxKSlp00nQkJeZ' -d '{ \"review_location\": \"2\", \"review_date\": \"2017-02-21T11:00\", \"development\": \"2\", \"review_type\": \"5\", \"review_comment\": \"This is API test.\" }' 'http://172.16.252.110/reviewtoolapi/review/add/'"
		    eval "curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-CSRFToken:  AkaUmNPhyR4p3T6ecpZya9xQsoUZ6l1UJu5Rhf8NzJyy9zqkmXl3YrrqcUJdGM9F' -d '{  \"review_location\": \""$lo"\", \"review_date_start\": \""$date_s"\", \"review_date_end\": \""$date_e"\",\"development\": \""$d"\", \"review_type\": \""$rt"\", \"review_comment\": \"This is API test.\" ,\"review_title\": \"Title Test.\" }' 'http://172.16.252.110/reviewtoolapi/review/'"
       
       done 


