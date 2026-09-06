import re

filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Define the flowing water gradient and animation
# Notice how the gradient repeats the first few colors at the end so it loops perfectly seamlessly!
flowing_gradient = 'linear-gradient(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF, #FF0000, #FF7F00, #FFFF00) !important;'

# Update .main-title
html = re.sub(
    r'\.main-title\s*\{[^}]*-webkit-text-stroke.*?\}',
    f'''.main-title {{
            font-size: 4.5rem !important;
            font-weight: 900 !important;
            margin-bottom: 10px !important;
            letter-spacing: -1px !important;
            
            /* Intense full saturation colors repeating for seamless flow */
            background: {flowing_gradient}
            background-size: 200% auto !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
            
            /* Thinner dark blue outline */
            -webkit-text-stroke: 1.5px #001f3f !important;
            
            animation: flowWaterAnim 4s linear infinite !important;
        }}''', 
    html, flags=re.DOTALL
)

# Update .main-title span.quiz
html = re.sub(
    r'\.main-title span\.quiz\s*\{[^}]*-webkit-text-stroke.*?\}',
    f'''.main-title span.quiz {{
            /* Intense full saturation colors repeating for seamless flow */
            background: {flowing_gradient}
            background-size: 200% auto !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
            
            /* Thinner dark blue outline */
            -webkit-text-stroke: 1.5px #001f3f !important;
            
            animation: flowWaterAnim 4s linear infinite reverse !important;
        }}''', 
    html, flags=re.DOTALL
)

# Update .glow-name (By TseLkos)
html = re.sub(
    r'\.glow-name\s*\{[^}]*-webkit-text-stroke.*?\}',
    f'''.glow-name {{
    font-size: 2.2rem !important;
    font-weight: 900 !important;
    margin-left: 10px !important;
    display: inline-block !important;
    vertical-align: middle;
    
    background: {flowing_gradient}
    background-size: 200% auto !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    color: transparent !important;
    
    /* Thin outline for By TseLkos too */
    -webkit-text-stroke: 1.5px #001f3f !important;
    
    animation: flowWaterAnim 4s linear infinite, authorPulseIndex 2s ease-in-out infinite alternate !important;
}}''', 
    html, flags=re.DOTALL
)

# Insert the flowWaterAnim keyframes at the end of the <style> block
water_anim = '''
@keyframes flowWaterAnim {
    0% { background-position: 0% center; }
    100% { background-position: -200% center; }
}
'''

if 'flowWaterAnim' not in html:
    html = html.replace('</style>', water_anim + '\n</style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Flowing water gradient applied!")
