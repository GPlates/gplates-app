#!/bin/bash

INPUT_FILE=Seton_etal_2020_PresentDay_AgeGrid.tif
OUTPUT_FILE=test.tif 

magick $INPUT_FILE -background "#808080" -alpha remove -alpha off $OUTPUT_FILE

# Note: You need to georeference the output file. 
# The SRS info in the input file will not be passed to the outout file automatically.