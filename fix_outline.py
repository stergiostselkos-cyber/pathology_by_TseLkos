import re

filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update the .main-title and .quiz span blocks we injected previously
# They are at the end of the <style> block.
# We will use regex to find and replace them.

new_gradient = 'linear-gradient(to right, #FF0000, #FF6600, #FFCC00, #00CC00, #0066FF, #9900FF, #FF00FF) !important;'

# Replace the gradient in .main-title
html = re.sub(
    r'\.main-title\s*\{[^}]*background:\s*linear-gradient[^;]*;.*?\}',
    f'''.main-title {{
            font-size: 4.5rem !important;
            font-weight: 900 !important;
            margin-bottom: 10px !important;
            letter-spacing: -1px !important;
            
            /* Intense full saturation colors */
            background: {new_gradient}
            background-size: 200% auto !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
            
            /* Thinner dark blue outline */
            -webkit-text-stroke: 1px #001f3f !important;
            
            animation: rainbowGlow 5s linear infinite !important;
        }}''', 
    html, flags=re.DOTALL
)

html = re.sub(
    r'\.main-title span\.quiz\s*\{[^}]*background:\s*linear-gradient[^;]*;.*?\}',
    f'''.main-title span.quiz {{
            /* Intense full saturation colors */
            background: {new_gradient}
            background-size: 200% auto !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
            
            /* Thinner dark blue outline */
            -webkit-text-stroke: 1px #001f3f !important;
            
            animation: rainbowGlow 5s linear infinite reverse !important;
        }}''', 
    html, flags=re.DOTALL
)

# 2. Add outline to By TseLkos (.glow-name) and update its gradient to be just as full/intense
html = re.sub(
    r'\.glow-name\s*\{[^}]*background:\s*linear-gradient[^;]*;.*?\}',
    f'''.glow-name {{
    font-size: 2rem !important;
    font-weight: 900 !important;
    margin-left: 10px !important;
    display: inline-block !important;
    vertical-align: middle;
    
    background: {new_gradient}
    background-size: 200% auto !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    color: transparent !important;
    
    /* Thin outline for By TseLkos too */
    -webkit-text-stroke: 1px #001f3f !important;
    
    animation: smoothRainbow 5s linear infinite, authorPulseIndex 2s ease-in-out infinite alternate !important;
}}''', 
    html, flags=re.DOTALL
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated outlines and gradients!")
