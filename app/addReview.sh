#!/bin/sh

for i in `seq 0 10`;
        do
        year=$((RANDOM%1+2017))
month=$((RANDOM%11+1))
day=$((RANDOM%27+1))
hour=$((RANDOM%25))
min=$((RANDOM%61))
t=$year"-"$month"-"$day"T"$hour":"$min
echo $t
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
		    eval "curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-CSRFToken: C1y4fOFrfVU9bvIl9GAhtdwIpG1E38evLbt1agYXgNoihb2rjeWMhvqi9cQSDzmg' -d '{  \"review_location\": \""$lo"\", \"review_date\": \""$t"\", \"development\": \""$d"\", \"review_type\": \""$rt"\", \"review_comment\": \"This is API test.\",\"reviewmember_set\":["$userlist"] }' 'http://172.16.252.110/reviewtoolapi/review/add/'"
       
       done 




