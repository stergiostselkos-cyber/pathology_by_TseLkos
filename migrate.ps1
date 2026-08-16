$content = Get-Content -Path 'data/cases_data.js' -Raw -Encoding UTF8

function Format-Bullets {
    param([string]$text)
    if ([string]::IsNullOrEmpty($text) -or $text.Contains('<ul>')) { return $text }
    
    # Split by <br><br> or period followed by space and capital Greek/English letter
    $pattern = '<br><br>|\.\s+(?=[Α-ΩA-ZΈΉΊΌΎΏΆ])'
    $sentences = [regex]::Split($text, $pattern)
    
    $html = '<ul>'
    foreach ($s in $sentences) {
        $s = $s.Trim()
        if ($s.Length -gt 0) {
            if (-not $s.EndsWith('.')) { $s += '.' }
            $html += "<li>$s</li>"
        }
    }
    $html += '</ul>'
    return $html
}

# Regex to find history blocks
$content = [regex]::Replace($content, 'history:\s*"([^"]+)"', {
    param($match)
    $newText = Format-Bullets $match.Groups[1].Value
    return 'history: "' + $newText + '"'
})

# Regex to find examination blocks
$content = [regex]::Replace($content, 'examination:\s*"([^"]+)"', {
    param($match)
    $newText = Format-Bullets $match.Groups[1].Value
    return 'examination: "' + $newText + '"'
})

# Now replace the dummy vitals with extracted ones
$content = [regex]::Replace($content, 'vitals:\s*\{[^}]*\},\s*examination:\s*"([^"]+)"', {
    param($match)
    $examText = $match.Groups[1].Value
    $temp = ''
    $bp = ''
    $hr = ''
    
    $bpMatch = [regex]::Match($examText, '(\d{2,3}/\d{2,3})')
    if ($bpMatch.Success) { $bp = $bpMatch.Groups[1].Value + ' mmHg' }
    
    $tempMatch = [regex]::Match($examText, '3[5-9][.,]\d')
    if ($tempMatch.Success) { $temp = $tempMatch.Groups[0].Value.Replace(',', '.') + ' °C' }
    
    $hrMatch = [regex]::Match($examText, '(?i)(\d{2,3})\s*/\s*min|σφυγμός\s*(?:είναι\s*)?(\d{2,3})')
    if ($hrMatch.Success) {
        $val = if ($hrMatch.Groups[1].Value) { $hrMatch.Groups[1].Value } else { $hrMatch.Groups[2].Value }
        $hr = $val + ' bpm'
    }
    
    $vitalsProps = @()
    if ($temp) { $vitalsProps += "temp: '$temp'" }
    if ($bp) { $vitalsProps += "bp: '$bp'" }
    if ($hr) { $vitalsProps += "hr: '$hr'" }
    
    $vitalsStr = ''
    if ($vitalsProps.Count -gt 0) {
        $vitalsStr = "vitals: { " + ($vitalsProps -join ', ') + " },"
    }
    
    if ($vitalsStr) {
        return $vitalsStr + "
    examination: "$examText""
    } else {
        return "examination: "$examText""
    }
})

Set-Content -Path 'data/cases_data.js' -Value $content -Encoding UTF8
Write-Host "Migration completed successfully."
