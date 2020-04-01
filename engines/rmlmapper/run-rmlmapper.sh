#!/bin/bash


declare -a mappings=("numberOfFunctions_1_rmlmapper.ttl" "numberOfFunctions_3_rmlmapper.ttl" "numberOfFunctions_5_rmlmapper.ttl" "sameFunction_2_rmlmapper.ttl" "sameFunction_3_rmlmapper.ttl" "sameFunction_4_rmlmapper.ttl")
declare -a dataArray=("veracity25.csv" "veracity50.csv"  "veracity75.csv" "veracity100.csv")
echo "engine,dataset,mapping,time,results" > results.csv

for data in "${dataArray[@]}"
do
	echo "---------Running transformation for $data------------"
	cp $data data.csv
	for mapping in "${mappings[@]}"
	do
		echo "Running $mapping"
		for i in 1 2 3 4 5
		do
			start=$(date +%s.%N)
			java -jar rmlmapper.jar -m $mapping -f functions_grel.ttl -o output.nt -d
			dur=$(echo "$(date +%s.%N) - $start" | bc)
			noutput=$(wc -l output.nt | cut -d " " -f 1)
			echo "rmlmapper,$data,$mapping,$dur,$noutput"  >> results.csv
			rm output.nt
		done	
	done	
done