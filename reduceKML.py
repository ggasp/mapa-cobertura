################################################################################
## reduceKML: 
##           Reduce el tamaño de los archivos KML al bajar la precisión a 
## metros (precisión 5) en lugar de la precisión a nanometros con que llegan
## los archivos. Además se elimina el componente de altura. 
################################################################################
 
import re,os,sys

kml_loc=sys.argv[1]
f=open(kml_loc)
lines=f.readlines()
f.close()

all_text_0=''.join(lines)
all_text_0=' '.join(all_text_0.split())
all_text_1=re.sub('<description>.*?</description>','<description></description>',all_text_0)
all_text_1=re.sub('<styleUrl>.*?</styleUrl>','',all_text_1)
all_text_2=all_text_1

for i in re.findall('<coordinates>(.*?)</coordinates>',all_text_1):
    coord=i.split(' ')
    fixed_part=''
    for c in coord:
        if( c ): 
            point=c.split(',')
            p1='{0:.{1}f}'.format(float(point[0]),5) # longitud
            p2='{0:.{1}f}'.format(float(point[1]),5) # latitud
            # p3= altura no es necesario
            fixed_part+=' ' + p1 + ',' + p2
    all_text_2=re.sub(i,fixed_part,all_text_2,1)

new_kml=list(os.path.splitext(kml_loc))
new_kml[0]+='_reduced'
f=open(''.join(new_kml),'wt')
f.write(all_text_2)
f.close()
