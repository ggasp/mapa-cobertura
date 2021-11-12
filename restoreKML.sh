#!/bin/bash 

################################################################################
## restoreKML.sh: 
##               Restablece los archivos KML originales reversando los realizado
## por <reduceKML.sh>
##
## Cualquier duda me escribes: gabriel at gasparolo.com
################################################################################

for t in 2G 3G 4G 5G; do
    echo Procesando la Tecnologia $t
    for f in $(ls kml/$t/*-original.kml); do
        original="${f/-original}"
        echo Se restablece el archivo $original
        mv "$f" "$original"
    done
done

