echo "{"
IFS='='
count=0
env | grep REACT_ | while  read -r name value ; 
do 
  if [ $count -gt 0 ]; 
    then  echo ","   
  fi  
  
  echo \"${name##REACT_}\" : \"$value\"; 
  count=1
done
    

echo "}" 