import fitz
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)
for pno in range(3, 10):
    annots = list(doc[pno].annots())
    centers = [((a.rect.x0+a.rect.x1)/2, (a.rect.y0+a.rect.y1)/2) for a in annots]
    clustered = []
    for c in centers:
        if not any(abs(cl[0]-c[0])<10 and abs(cl[1]-c[1])<10 for cl in clustered):
            clustered.append(c)
    print(f"P{pno+1}: raw={len(annots)}, clustered={len(clustered)}")
