import codecs
import re

path = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with codecs.open(path, 'r', 'utf-8') as f:
    html = f.read()

new_card = '''  <!-- Useful Links Card -->
  <div class="portal-card" style="min-height: 280px; display: flex; flex-direction: column; --primary-color: #8b5cf6; --primary-hover: #7c3aed; --primary-rgb: 139, 92, 246;">
  <div class="portal-card-header">
  <div class="portal-card-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
  <svg fill="none" height="32" viewbox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
  </svg>
  </div>
  <h3>Χρήσιμα Links & Υλικό</h3>
  </div>
  <p class="portal-card-desc" style="padding: 16px; border-radius: 12px; font-size: 0.95rem; line-height: 1.5; margin-bottom: 8px; flex-grow: 1">Μια συλλογή από σημαντικούς συνδέσμους, κατευθυντήριες οδηγίες (guidelines), ιατρικά αρχεία και μαθήματα για γρήγορη πρόσβαση.</p>
  <a class="portal-card-btn" href="links.html" style="font-weight: 700; border: none; cursor: pointer; display: block; text-decoration: none; width: 100%; text-align: center; border-radius: 8px; padding: 12px; box-sizing: border-box; background: var(--primary-color); color: white; transition: background 0.2s;" onmouseover="this.style.background='var(--primary-hover)'" onmouseout="this.style.background='var(--primary-color)'">🔗 Μετάβαση στο Υλικό</a>
  </div>
  </section>'''

html = html.replace('  </section>', new_card)

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(html)
