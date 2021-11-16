#!/bin/bash 

################################################################################
## reduceKML.sh: 
##               Recorre el directorio ./kml y por cada archivo .kml, ejecuta
## el script <reduceKML.py> 
##
## Cualquier duda me escribes: gabriel at gasparolo.com
################################################################################

echo Procesando para Tecnologia 2G
for f in $(ls kml/2G/*.kml); do
    echo Procesando archivo $f 
    cp "$f" "${f%.*}-original.kml"
    python3 reduceKML.py $f 2G
done

echo Procesando para Tecnologia 3G
for f in $(ls kml/3G/*.kml); do
    echo Procesando archivo $f 
    cp "$f" "${f%.*}-original.kml"
    python3 reduceKML.py $f 3G
done

echo Procesando para Tecnologia 4G
for f in $(ls kml/4G/*.kml); do
    echo Procesando archivo $f 
    cp "$f" "${f%.*}-original.kml"
    python3 reduceKML.py $f 4G
done

echo Procesando para Tecnologia 5G
for f in $(find kml/5G/. -name 'R??.kml'); do
    echo Procesando archivo $f
    cp "$f" "${f%.*}-original.kml"
    python3 reduceKML.py $f 5G
done
for f in $(find kml/5G/. -name 'R??-planificado.kml'); do
    echo Procesando archivo $f
    cp "$f" "${f%.*}-original.kml"
    python3 reduceKML.py $f Pre5G
done

