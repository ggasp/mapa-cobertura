################################################################################
## reduceKML.py: 
##           Reduce el tamaño de los archivos KML al bajar la precisión a 
## metros (precisión 5) en lugar de la precisión a nanometros con que llegan
## los archivos. Además se elimina el componente de altura. 
##
## Uso: python3 reduceKML <kml-file> <tecnologia>
##
## Cualquier duda me escribes: gabriel at gasparolo.com
################################################################################
 
import re,os,sys

kml_loc=sys.argv[1]
tecnologia=sys.argv[2]
f=open(kml_loc)
lines=f.readlines()
f.close()

style_replace= {
    '2G': '\g<1><Style><LineStyle><color>FFA8A8A8</color></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>\g<2>',
    '3G': '\g<1><Style><LineStyle><color>FFEB973E</color></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>\g<2>',
    '4G': '\g<1><Style><LineStyle><color>FF3636FA</color></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>\g<2>',
    '5G': '\g<1><Style><LineStyle><color>FF36B9FA</color></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>\g<2>'
}

all_text_0=''.join(lines)
all_text_0=' '.join(all_text_0.split())
all_text_1=re.sub('<description>.*?</description>', '<description></description>', all_text_0)
all_text_1=re.sub('<styleUrl>.*?</styleUrl>', '', all_text_1)
all_text_1=re.sub('(<Placemark .*?>).*?(<ExtendedData>)', style_replace[tecnologia], all_text_1)
all_text_2=all_text_1

precision=5 # reducir la cantidad de decimales con una precisión de metros (5) o centímetros (6)
d=0.0013 # reducir la cantidad de puntos: no los considera cuando la distancia es menor a 300 mts. 

x1=x2=0
for i in re.findall('<coordinates>(.*?)</coordinates>',all_text_1):
    coord=i.split(' ')
    fixed_part=''
    cant_p= 0
    for c in coord:
        if( c ): 
            point=c.split(',')
            p1='{0:.{1}f}'.format(float(point[0]),precision) # longitud
            p2='{0:.{1}f}'.format(float(point[1]),precision) # latitud
            # p3= altura no es necesario
            dist = (( float(p1) - x1)**2 + ( float(p2) - x2)**2)**0.5
            if( dist > d ):
                cant_p+=1
                fixed_part+=' ' + p1 + ',' + p2
                x1= float(p1)
                x2= float(p2)
    if (cant_p > 3): # no me gustan los triangulos
        all_text_2=re.sub(i,fixed_part,all_text_2,1) 
    else: 
        all_text_2=re.sub(i,'',all_text_2,1) 
f=open(kml_loc,'wt')
f.write(all_text_2)
f.close()
