# Re-encodes every photo in ../images as a JPEG at most 640px wide (quality 80)
# and updates js/images.js to point at the .jpg files.
# Run after tools/fetch-images.js:   powershell -ExecutionPolicy Bypass -File tools\optimize-images.ps1
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$imgDir = Join-Path $root 'images'
$maxWidth = 640
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]80)

$before = 0; $after = 0
Get-ChildItem $imgDir -File | Where-Object { $_.Extension -in '.jpg', '.jpeg', '.png', '.webp' } | ForEach-Object {
  $before += $_.Length
  try {
    $src = [System.Drawing.Image]::FromFile($_.FullName)
  } catch {
    Write-Host "skip $($_.Name) (unsupported format)"; $after += $_.Length; return
  }
  # Already optimized (small JPEG) — leave it alone so quality is not lost on re-runs
  if ($_.Extension -eq '.jpg' -and $src.Width -le $maxWidth -and $_.Length -lt 200KB) {
    $src.Dispose(); $after += $_.Length; return
  }
  $w = [Math]::Min($maxWidth, $src.Width)
  $h = [int]([Math]::Round($src.Height * $w / $src.Width))
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)   # flatten transparent PNGs
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose(); $src.Dispose()

  $out = [System.IO.Path]::ChangeExtension($_.FullName, '.jpg')
  $tmp = "$out.tmp"
  $bmp.Save($tmp, $codec, $params); $bmp.Dispose()
  if ($_.FullName -ne $out) { Remove-Item $_.FullName }
  Move-Item -Force $tmp $out
  $after += (Get-Item $out).Length
}

$js = Join-Path $root 'js\images.js'
if (Test-Path $js) {
  $text = [System.IO.File]::ReadAllText($js)
  $text = [regex]::Replace($text, '"(images/[^"]+)\.(png|webp|jpeg)"', '"$1.jpg"')
  [System.IO.File]::WriteAllText($js, $text, (New-Object System.Text.UTF8Encoding $false))
}
'{0:N1} MB -> {1:N1} MB' -f ($before / 1MB), ($after / 1MB)
