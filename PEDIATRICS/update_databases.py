import json
import os

def update_mcq():
    json_path = 'questions.json'
    js_path = 'questions.js'
    
    if not os.path.exists(json_path):
        print(f"Σφάλμα: Το αρχείο {json_path} δεν βρέθηκε.")
        return
        
    try:
        with open(json_path, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
        
        js_content = f"const questionsData = {json.dumps(data, ensure_ascii=False, indent=4)};\n"
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Επιτυχής ενημέρωση του {js_path} από το {json_path} ({len(data)} ερωτήσεις).")
    except Exception as e:
        print(f"Σφάλμα κατά την ενημέρωση των MCQ: {e}")

def update_flashcards():
    json_path = os.path.join('data', 'flashcard_questions.json')
    js_path = os.path.join('data', 'flashcard_questions.js')
    
    if not os.path.exists(json_path):
        print(f"Σφάλμα: Το αρχείο {json_path} δεν βρέθηκε.")
        return
        
    try:
        with open(json_path, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
        
        js_content = f"const flashcardQuestionsData = {json.dumps(data, ensure_ascii=False, indent=4)};\n"
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Επιτυχής ενημέρωση του {js_path} από το {json_path} ({len(data)} flashcards).")
    except Exception as e:
        print(f"Σφάλμα κατά την ενημέρωση των Flashcards: {e}")

if __name__ == '__main__':
    print("=== Έναρξη ενημέρωσης βάσεων δεδομένων ===")
    update_mcq()
    update_flashcards()
    print("=========================================")
    input("Πιέστε Enter για έξοδο...")
