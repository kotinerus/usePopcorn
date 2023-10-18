def obliczanie(napiecie,natezenie,delta_napiecia,delta_natezenia):
    print(abs(1/natezenie*delta_napiecia)+abs(-napiecie/natezenie**2)*delta_natezenia)

obliczanie(0.9952,0.1026,0.0005,0.082)
obliczanie(1.038,0.1027,0.0005,0.0821)
obliczanie(1.025,0.1027,0.0005,0.0821)
obliczanie(0.9934,0.103,0.0005,0.0824)
print("####")

obliczanie(0.3715,0.103,0.00018,0.0824)
obliczanie(0.4023,0.103,0.0002,0.0824)
obliczanie(0.3681,0.103,0.00018,0.0824)
obliczanie(0.3681,0.103,0.00018,0.0824)