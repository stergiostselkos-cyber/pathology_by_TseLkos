# -*- coding: utf-8 -*-
"""
APPEND TO UNIFIED LARNAKA MASTER BANK
Use this script whenever new questions/parts are added to Larnaka.
It appends them directly into the single canonical unified bank.
"""
import os, sys, json, shutil

sys.stdout.reconfigure(encoding='utf-8')

MASTER_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(MASTER_DIR, 'larnaka.json')
JS_PATH = os.path.join(MASTER_DIR, 'larnaka.js')
IMAGES_DIR = os.path.join(MASTER_DIR, 'images')

def append_questions(new_questions_list, new_images_folder=None):
    if not os.path.exists(JSON_PATH):
        print(f"Error: Master file not found at {JSON_PATH}")
        return
        
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        master_qs = json.load(f)
        
    print(f"Current Master Questions count: {len(master_qs)}")
    existing_ids = {q['id'] for q in master_qs}
    
    added = 0
    for q in new_questions_list:
        if q['id'] in existing_ids:
            print(f"Updating existing question Q{q['id']}")
            idx = next(i for i, existing in enumerate(master_qs) if existing['id'] == q['id'])
            master_qs[idx] = q
        else:
            master_qs.append(q)
            added += 1
            
    # Sort by ID
    master_qs.sort(key=lambda x: int(x['id']))
    
    # Save JSON and JS
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(master_qs, f, ensure_ascii=False, indent=2)
        
    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write("const larnakaAllQuestions = " + json.dumps(master_qs, ensure_ascii=False, indent=2) + ";\n")
        
    print(f"Successfully appended {added} questions! New total: {len(master_qs)} (Q{master_qs[0]['id']} to Q{master_qs[-1]['id']})")
    
    if new_images_folder and os.path.exists(new_images_folder):
        os.makedirs(IMAGES_DIR, exist_ok=True)
        img_copied = 0
        for f in os.listdir(new_images_folder):
            src = os.path.join(new_images_folder, f)
            dst = os.path.join(IMAGES_DIR, f)
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
                img_copied += 1
        print(f"Copied {img_copied} images to master images folder (Total: {len(os.listdir(IMAGES_DIR))})")

if __name__ == '__main__':
    print("Master Larnaka Updater Ready.")
